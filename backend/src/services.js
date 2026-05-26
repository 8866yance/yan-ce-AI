import { prisma, ensureWallet, toMoney } from "./db.js";
import { addDays, createOrderNo, dayStart, hmacSign } from "./utils.js";

export async function createUserOrder({ userId, orderType, productId, clientIp }) {
  const recentPending = await prisma.paymentOrder.findFirst({
    where: {
      userId,
      orderType,
      productId,
      status: "pending",
      createdAt: { gte: new Date(Date.now() - 10 * 60_000) }
    },
    orderBy: { createdAt: "desc" }
  });
  if (recentPending) return recentPending;

  if (orderType === "membership") {
    const plan = await prisma.membershipPlan.findFirst({ where: { id: productId, enabled: true } });
    if (!plan) throw Object.assign(new Error("会员套餐不存在或已禁用。"), { status: 404 });
    return prisma.paymentOrder.create({
      data: {
        orderNo: createOrderNo("M"),
        userId,
        orderType,
        productId,
        productName: plan.name,
        amount: plan.price,
        status: "pending",
        clientIp
      }
    });
  }

  if (orderType === "points") {
    const pack = await prisma.pointPackage.findFirst({ where: { id: productId, enabled: true } });
    if (!pack) throw Object.assign(new Error("积分包不存在或已禁用。"), { status: 404 });
    return prisma.paymentOrder.create({
      data: {
        orderNo: createOrderNo("P"),
        userId,
        orderType,
        productId,
        productName: pack.name,
        amount: pack.price,
        status: "pending",
        clientIp
      }
    });
  }

  throw Object.assign(new Error("不支持的订单类型。"), { status: 400 });
}

export async function processPaymentCallback(rawBody, signature) {
  const expected = hmacSign(rawBody);
  if (signature !== expected) {
    throw Object.assign(new Error("支付回调验签失败。"), { status: 400, code: "BAD_SIGNATURE" });
  }
  const payload = JSON.parse(rawBody);
  const order = await prisma.paymentOrder.findUnique({ where: { orderNo: payload.orderNo } });
  if (!order) throw Object.assign(new Error("订单不存在。"), { status: 404 });

  if (order.status === "paid") {
    return { order, duplicate: true };
  }
  if (toMoney(order.amount) !== toMoney(payload.amount)) {
    await prisma.paymentOrder.update({
      where: { id: order.id },
      data: { status: "failed", failReason: "支付回调金额与订单金额不一致", callbackRaw: rawBody, callbackSignature: signature }
    });
    throw Object.assign(new Error("订单金额校验失败。"), { status: 400, code: "AMOUNT_MISMATCH" });
  }
  if (payload.status !== "paid") {
    const failed = await prisma.paymentOrder.update({
      where: { id: order.id },
      data: { status: "failed", failReason: payload.failReason || "支付失败", callbackRaw: rawBody, callbackSignature: signature }
    });
    return { order: failed, duplicate: false };
  }

  const result = await prisma.$transaction(async (tx) => {
    const paidOrder = await tx.paymentOrder.update({
      where: { id: order.id },
      data: {
        status: "paid",
        paymentProvider: payload.provider || "mock",
        thirdPartyTradeNo: payload.thirdPartyTradeNo,
        paidAt: new Date(payload.paidAt || Date.now()),
        callbackRaw: rawBody,
        callbackSignature: signature,
        callbackProcessedAt: new Date()
      }
    });

    if (order.orderType === "membership") {
      await grantMembership(tx, paidOrder);
    }
    if (order.orderType === "points") {
      await grantPoints(tx, paidOrder);
    }

    return paidOrder;
  });

  return { order: result, duplicate: false };
}

async function grantMembership(tx, order) {
  const plan = await tx.membershipPlan.findUnique({ where: { id: order.productId } });
  if (!plan) throw new Error("会员套餐已不存在，无法发放。");
  const now = new Date();
  const latest = await tx.userMembership.findFirst({
    where: { userId: order.userId, status: "active", endAt: { gt: now } },
    orderBy: { endAt: "desc" }
  });
  const startAt = latest?.endAt && latest.endAt > now ? latest.endAt : now;
  const endAt = addDays(startAt, plan.durationDays);
  await tx.userMembership.create({
    data: {
      userId: order.userId,
      planId: plan.id,
      orderId: order.id,
      startAt,
      endAt,
      status: "active",
      analysisLimit: plan.analysisLimit,
      unlimited: plan.unlimited,
      purchaseMode: "renew_stack"
    }
  });
  await tx.user.update({
    where: { id: order.userId },
    data: {
      currentMembershipStatus: "active",
      totalRechargeAmount: { increment: order.amount }
    }
  });
}

async function grantPoints(tx, order) {
  const pack = await tx.pointPackage.findUnique({ where: { id: order.productId } });
  if (!pack) throw new Error("积分包已不存在，无法发放。");
  const wallet = await ensureWallet(order.userId, tx);
  const points = pack.points + pack.bonusPoints;
  const updated = await tx.userWallet.update({
    where: { userId: order.userId },
    data: {
      pointsBalance: { increment: points },
      totalEarned: { increment: points }
    }
  });
  await tx.pointLedger.create({
    data: {
      userId: order.userId,
      walletId: wallet.id,
      orderId: order.id,
      changeType: "recharge",
      direction: "in",
      points,
      beforeBalance: wallet.pointsBalance,
      afterBalance: updated.pointsBalance,
      remark: `购买积分包：${pack.name}`
    }
  });
  await tx.user.update({
    where: { id: order.userId },
    data: {
      currentPoints: updated.pointsBalance,
      totalRechargeAmount: { increment: order.amount }
    }
  });
}

export async function expireMemberships() {
  const now = new Date();
  await prisma.userMembership.updateMany({
    where: { status: "active", endAt: { lte: now } },
    data: { status: "expired" }
  });
  const activeUserIds = new Set((await prisma.userMembership.findMany({
    where: { status: "active", endAt: { gt: now } },
    select: { userId: true }
  })).map((item) => item.userId));
  const users = await prisma.user.findMany({ where: { currentMembershipStatus: "active" }, select: { id: true } });
  await Promise.all(users.filter((user) => !activeUserIds.has(user.id)).map((user) => prisma.user.update({
    where: { id: user.id },
    data: { currentMembershipStatus: "expired" }
  })));
}

export async function consumeAnalysisQuota(userId, analysisCost, analysisRecordId, tx = prisma) {
  const active = await tx.userMembership.findFirst({
    where: { userId, status: "active", endAt: { gt: new Date() } },
    orderBy: { endAt: "desc" }
  });
  if (active && (active.unlimited || active.analysisUsed < active.analysisLimit)) {
    await tx.userMembership.update({ where: { id: active.id }, data: { analysisUsed: { increment: 1 } } });
    return { memberFree: true, pointsCost: 0 };
  }

  const wallet = await ensureWallet(userId, tx);
  if (wallet.pointsBalance < analysisCost) {
    throw Object.assign(new Error("积分不足，请充值或购买会员。"), { status: 402, code: "POINTS_NOT_ENOUGH" });
  }
  const updated = await tx.userWallet.update({
    where: { userId },
    data: { pointsBalance: { decrement: analysisCost }, totalSpent: { increment: analysisCost } }
  });
  await tx.pointLedger.create({
    data: {
      userId,
      walletId: wallet.id,
      analysisRecordId,
      changeType: "analysis_consume",
      direction: "out",
      points: analysisCost,
      beforeBalance: wallet.pointsBalance,
      afterBalance: updated.pointsBalance,
      remark: "AI 八字分析消耗"
    }
  });
  await tx.user.update({ where: { id: userId }, data: { currentPoints: updated.pointsBalance } });
  return { memberFree: false, pointsCost: analysisCost };
}

export async function dashboardSummary() {
  const today = dayStart();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const onlineSince = new Date(Date.now() - 5 * 60_000);
  const [
    totalUsers,
    todayUsers,
    onlineUsers,
    todayAnalysis,
    yesterdayAnalysis,
    todayPaid,
    allPaid,
    memberUsers,
    pointRechargeUsers,
    abnormalRequests,
    attacks
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { registeredAt: { gte: today } } }),
    prisma.userSession.count({ where: { lastHeartbeatAt: { gte: onlineSince } } }),
    prisma.analysisRecord.count({ where: { createdAt: { gte: today } } }),
    prisma.analysisRecord.count({ where: { createdAt: { gte: yesterday, lt: today } } }),
    prisma.paymentOrder.aggregate({ where: { status: "paid", paidAt: { gte: today } }, _sum: { amount: true } }),
    prisma.paymentOrder.aggregate({ where: { status: "paid" }, _sum: { amount: true } }),
    prisma.userMembership.count({ where: { status: "active", endAt: { gt: new Date() } } }),
    prisma.paymentOrder.groupBy({ by: ["userId"], where: { status: "paid", orderType: "points" } }),
    prisma.requestLog.count({ where: { requestTime: { gte: today }, OR: [{ statusCode: { gte: 400 } }, { durationMs: { gt: 3000 } }] } }),
    prisma.securityEvent.count({ where: { createdAt: { gte: today } } })
  ]);

  return {
    totalUsers,
    todayUsers,
    onlineUsers,
    todayAnalysis,
    yesterdayAnalysis,
    todayRechargeAmount: todayPaid._sum.amount || 0,
    totalRechargeAmount: allPaid._sum.amount || 0,
    memberUsers,
    pointRechargeUsers: pointRechargeUsers.length,
    abnormalRequests,
    suspectedAttacks: attacks
  };
}

export async function chartData(days = 30) {
  const from = dayStart();
  from.setDate(from.getDate() - (days - 1));
  const analysis = await prisma.analysisRecord.findMany({ where: { createdAt: { gte: from } }, select: { createdAt: true, analysisType: true } });
  const orders = await prisma.paymentOrder.findMany({ where: { status: "paid", paidAt: { gte: from } }, select: { paidAt: true, amount: true } });
  const users = await prisma.user.findMany({ where: { registeredAt: { gte: from } }, select: { registeredAt: true } });
  return { analysis, orders, users };
}
