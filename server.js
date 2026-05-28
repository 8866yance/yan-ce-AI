import express from "express";
import cors from "cors";
import helmet from "helmet";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma, ensureWallet } from "./db.js";
import { config } from "./config.js";
import { asyncHandler, errorHandler, optionalAuth, rateLimit, requestLogger, requireAdmin, requireUser, upsertSecurityEvent } from "./middleware.js";
import { createUserOrder, processPaymentCallback, consumeAnalysisQuota, dashboardSummary, expireMemberships, chartData } from "./services.js";
import { getClientIp, hmacSign, maskText, parsePagination, signAdmin, signUser } from "./utils.js";

const app = express();
const DEFAULT_SINGLE_READING_PROMPT = "你是专业、克制、白话的八字命理分析助手。只做参考建议，不恐吓，不绝对化。";

app.use(helmet());
app.use(cors({
  origin(origin, cb) {
    if (!origin || config.corsOrigin.length === 0 || config.corsOrigin.includes(origin)) return cb(null, true);
    cb(new Error("CORS origin not allowed"));
  }
}));

app.post("/api/payments/webhook", express.raw({ type: "application/json" }));
app.use(express.json({ limit: config.jsonBodyLimit }));
app.use(express.urlencoded({ limit: config.jsonBodyLimit, extended: false }));
app.use(optionalAuth);
app.use(requestLogger);
app.use(rateLimit("default"));

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "yan-ce-ai-backend",
    message: "后端 API 服务运行中。网站前端请打开 http://127.0.0.1:4173/，后端健康检查请打开 /health。",
    endpoints: {
      health: "/health",
      membershipPlans: "/api/membership-plans",
      pointPackages: "/api/point-packages",
      adminLogin: "/api/admin/login"
    }
  });
});

app.get("/health", (_req, res) => res.json({ ok: true, service: "yan-ce-ai-backend" }));

function arkConfig() {
  const provider = String(config.aiProvider || "ark").toLowerCase();
  if (provider !== "ark") return null;
  if (!config.arkApiKey || !config.arkBaseUrl || !config.arkModel) return null;
  return {
    apiKey: config.arkApiKey,
    baseUrl: config.arkBaseUrl.replace(/\/+$/, ""),
    model: config.arkModel
  };
}

async function generateSingleReading({ birthInfo, chartData, luckData, question }) {
  const ark = arkConfig();
  if (!ark) {
    const error = new Error("ARK_CONFIG_MISSING");
    error.statusCode = 503;
    throw error;
  }
  const activePrompt = await prisma.promptVersion.findFirst({
    where: { status: "active" },
    orderBy: { versionNo: "desc" }
  });
  const systemPrompt = activePrompt?.content?.trim() || DEFAULT_SINGLE_READING_PROMPT;

  const response = await fetch(`${ark.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ark.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: ark.model,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: [
            "结合用户命盘数据和咨询问题，生成专项解读。",
            `咨询问题：${question}`,
            `出生信息：${JSON.stringify(birthInfo)}`,
            `命盘数据：${JSON.stringify(chartData)}`,
            `岁运数据：${JSON.stringify(luckData)}`
          ].join("\n\n")
        }
      ],
      temperature: 0.7,
      max_tokens: 1200
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data?.error?.message || "ARK_REQUEST_FAILED");
    error.statusCode = response.status;
    throw error;
  }

  const content = data?.choices?.[0]?.message?.content || "";
  if (!content.trim()) {
    const error = new Error("ARK_EMPTY_RESULT");
    error.statusCode = 502;
    throw error;
  }
  return content.trim();
}

app.post("/api/auth/login", rateLimit("login"), asyncHandler(async (req, res) => {
  const body = z.object({
    openid: z.string().min(1),
    unionid: z.string().optional(),
    nickname: z.string().optional(),
    avatarUrl: z.string().url().optional()
  }).parse(req.body);
  const ip = getClientIp(req);
  const user = await prisma.user.upsert({
    where: { openid: body.openid },
    update: { unionid: body.unionid, nickname: body.nickname, avatarUrl: body.avatarUrl, lastLoginAt: new Date(), loginIp: ip },
    create: { ...body, lastLoginAt: new Date(), loginIp: ip }
  });
  await ensureWallet(user.id);
  const token = signUser(user);
  await prisma.userSession.create({
    data: { userId: user.id, sessionToken: token, ip, userAgent: req.headers["user-agent"], platform: req.headers["x-platform"] }
  });
  res.json({ token, user });
}));

app.get("/api/me", requireUser, asyncHandler(async (req, res) => {
  await expireMemberships();
  const [wallet, membership] = await Promise.all([
    ensureWallet(req.user.id),
    prisma.userMembership.findFirst({ where: { userId: req.user.id, status: "active", endAt: { gt: new Date() } }, orderBy: { endAt: "desc" } })
  ]);
  res.json({ user: req.user, wallet, membership });
}));

app.post("/api/heartbeat", requireUser, asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  await prisma.userSession.upsert({
    where: { sessionToken: token },
    update: { lastHeartbeatAt: new Date(), onlineStatus: "online", ip: getClientIp(req), userAgent: req.headers["user-agent"] },
    create: { userId: req.user.id, sessionToken: token, lastHeartbeatAt: new Date(), ip: getClientIp(req), userAgent: req.headers["user-agent"] }
  });
  res.json({ ok: true });
}));

app.get("/api/membership-plans", asyncHandler(async (_req, res) => {
  const plans = await prisma.membershipPlan.findMany({ where: { enabled: true }, orderBy: [{ sortOrder: "asc" }, { price: "asc" }] });
  res.json({ plans });
}));

app.get("/api/point-packages", asyncHandler(async (_req, res) => {
  const packages = await prisma.pointPackage.findMany({ where: { enabled: true }, orderBy: [{ sortOrder: "asc" }, { price: "asc" }] });
  res.json({ packages });
}));

app.post("/api/orders/membership", requireUser, rateLimit("payment"), asyncHandler(async (req, res) => {
  const { planId } = z.object({ planId: z.string().min(1) }).parse(req.body);
  const order = await createUserOrder({ userId: req.user.id, orderType: "membership", productId: planId, clientIp: getClientIp(req) });
  res.status(201).json({ order, paymentHint: "真实支付需调用微信/支付宝预下单；权益只在服务端回调 paid 后发放。" });
}));

app.post("/api/orders/points", requireUser, rateLimit("payment"), asyncHandler(async (req, res) => {
  const { packageId } = z.object({ packageId: z.string().min(1) }).parse(req.body);
  const order = await createUserOrder({ userId: req.user.id, orderType: "points", productId: packageId, clientIp: getClientIp(req) });
  res.status(201).json({ order, paymentHint: "真实支付需调用微信/支付宝预下单；积分只在服务端回调 paid 后发放。" });
}));

app.get("/api/orders/:orderNo", requireUser, asyncHandler(async (req, res) => {
  const order = await prisma.paymentOrder.findFirst({ where: { orderNo: req.params.orderNo, userId: req.user.id } });
  if (!order) return res.status(404).json({ code: "ORDER_NOT_FOUND", message: "订单不存在。" });
  res.json({ order });
}));

app.post("/api/payments/webhook", rateLimit("payment"), asyncHandler(async (req, res) => {
  const rawBody = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : JSON.stringify(req.body);
  const signature = req.headers["x-payment-signature"];
  const result = await processPaymentCallback(rawBody, signature);
  res.json({ ok: true, duplicate: result.duplicate, orderNo: result.order.orderNo });
}));

app.post("/api/payments/mock-signature", requireAdmin(["super_admin", "finance_admin"]), asyncHandler(async (req, res) => {
  const payload = z.object({
    orderNo: z.string(),
    amount: z.union([z.string(), z.number()]),
    status: z.enum(["paid", "failed"]),
    provider: z.string().default("mock"),
    thirdPartyTradeNo: z.string().default(`mock_${Date.now()}`)
  }).parse(req.body);
  res.json({ payload, signature: hmacSign(JSON.stringify(payload)) });
}));

app.post("/api/analysis", requireUser, rateLimit("analysis"), asyncHandler(async (req, res) => {
  const started = Date.now();
  const body = z.object({
    submitContent: z.string().min(1),
    imageUrl: z.string().url().optional(),
    birthInfo: z.record(z.any()),
    baziResult: z.record(z.any()),
    analysisType: z.enum(["bazi", "year", "month", "marriage", "other"]).default("bazi")
  }).parse(req.body);

  const recentDuplicate = await prisma.analysisRecord.findFirst({
    where: {
      userId: req.user.id,
      analysisType: body.analysisType,
      submitContent: body.submitContent,
      success: true,
      createdAt: { gte: new Date(Date.now() - 5 * 60_000) }
    },
    orderBy: { createdAt: "desc" }
  });
  if (recentDuplicate) return res.json({ reused: true, record: recentDuplicate });

  const prompt = await prisma.promptVersion.findFirst({ where: { status: "active" }, orderBy: { versionNo: "desc" } });
  if (!prompt) {
    const failed = await prisma.analysisRecord.create({
      data: {
        userId: req.user.id,
        submitContent: body.submitContent,
        imageUrl: body.imageUrl,
        birthInfoJson: JSON.stringify(body.birthInfo),
        baziResultJson: JSON.stringify(body.baziResult),
        analysisType: body.analysisType,
        clientIp: getClientIp(req),
        pointsCost: 0,
        memberFree: false,
        durationMs: Date.now() - started,
        success: false,
        failReason: "NO_ACTIVE_PROMPT"
      }
    });
    return res.status(503).json({ code: "NO_ACTIVE_PROMPT", message: "未配置生效提示词，未扣积分。", record: failed });
  }

  const analysisCost = body.analysisType === "bazi" ? 10 : 6;
  const aiResult = `已使用提示词版本 v${prompt.versionNo} 生成分析任务。这里应接入真实 AI 服务返回结果。`;
  const result = await prisma.$transaction(async (tx) => {
    const record = await tx.analysisRecord.create({
      data: {
        userId: req.user.id,
        submitContent: body.submitContent,
        imageUrl: body.imageUrl,
        birthInfoJson: JSON.stringify(body.birthInfo),
        baziResultJson: JSON.stringify(body.baziResult),
        promptVersionId: prompt.id,
        analysisType: body.analysisType,
        clientIp: getClientIp(req),
        success: false
      }
    });
    const quota = await consumeAnalysisQuota(req.user.id, analysisCost, record.id, tx);
    const updated = await tx.analysisRecord.update({
      where: { id: record.id },
      data: {
        aiResult,
        pointsCost: quota.pointsCost,
        memberFree: quota.memberFree,
        durationMs: Date.now() - started,
        success: true,
        failReason: null
      }
    });
    await tx.user.update({ where: { id: req.user.id }, data: { totalAnalysisCount: { increment: 1 } } });
    return updated;
  });
  res.status(201).json({ record: result });
}));

app.post("/api/analysis/single-reading", rateLimit("analysis"), asyncHandler(async (req, res) => {
  const body = z.object({
    guestId: z.string().min(1),
    birthInfo: z.record(z.any()),
    chartData: z.record(z.any()),
    luckData: z.record(z.any()),
    question: z.string().min(1).max(1000)
  }).parse(req.body);

  try {
    const result = await generateSingleReading(body);
    res.json({ ok: true, result });
  } catch (error) {
    console.error("single-reading AI failed", error.message);
    res.status(error.statusCode || 502).json({
      ok: false,
      code: "AI_GENERATION_FAILED",
      message: "AI 解读生成失败，请稍后再试。"
    });
  }
}));

app.get("/api/analysis/history", requireUser, asyncHandler(async (req, res) => {
  const { skip, take, page, pageSize } = parsePagination(req);
  const [items, total] = await Promise.all([
    prisma.analysisRecord.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: "desc" }, skip, take }),
    prisma.analysisRecord.count({ where: { userId: req.user.id } })
  ]);
  res.json({ items, total, page, pageSize });
}));

app.post("/api/admin/login", rateLimit("adminLogin"), asyncHandler(async (req, res) => {
  const body = z.object({ email: z.string().email(), password: z.string().min(6) }).parse(req.body);
  const admin = await prisma.adminUser.findUnique({ where: { email: body.email } });
  if (!admin || admin.status !== "active" || !(await bcrypt.compare(body.password, admin.passwordHash))) {
    return res.status(401).json({ code: "BAD_ADMIN_LOGIN", message: "管理员账号或密码错误。" });
  }
  await prisma.adminUser.update({ where: { id: admin.id }, data: { lastLoginAt: new Date(), lastLoginIp: getClientIp(req) } });
  res.json({ token: signAdmin(admin), admin: { id: admin.id, email: admin.email, role: admin.role, nickname: admin.nickname } });
}));

app.get("/api/admin/dashboard", requireAdmin(), asyncHandler(async (_req, res) => {
  const summary = await dashboardSummary();
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const hourly = await Promise.all(Array.from({ length: 24 }, async (_, hour) => {
    const start = new Date(todayStart);
    start.setHours(hour);
    const end = new Date(start);
    end.setHours(hour + 1);
    return {
      hour,
      analysisCount: await prisma.analysisRecord.count({ where: { createdAt: { gte: start, lt: end } } }),
      rechargeAmount: (await prisma.paymentOrder.aggregate({ where: { status: "paid", paidAt: { gte: start, lt: end } }, _sum: { amount: true } }))._sum.amount || 0,
      newUsers: await prisma.user.count({ where: { registeredAt: { gte: start, lt: end } } })
    };
  }));
  const hotTypes = await prisma.analysisRecord.groupBy({ by: ["analysisType"], _count: { analysisType: true }, orderBy: { _count: { analysisType: "desc" } }, take: 10 });
  res.json({ summary, charts: { hourly }, hotTypes });
}));

app.get("/api/admin/dashboard/trends", requireAdmin(), asyncHandler(async (req, res) => {
  const days = Math.min(Math.max(Number(req.query.days || 30), 7), 90);
  const raw = await chartData(days);
  const dateKey = (date) => new Date(date).toISOString().slice(0, 10);
  const buckets = {};
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    buckets[dateKey(date)] = { date: dateKey(date), analysisCount: 0, rechargeAmount: 0, newUsers: 0 };
  }
  raw.analysis.forEach((item) => { buckets[dateKey(item.createdAt)].analysisCount += 1; });
  raw.orders.forEach((item) => { buckets[dateKey(item.paidAt)].rechargeAmount += Number(item.amount); });
  raw.users.forEach((item) => { buckets[dateKey(item.registeredAt)].newUsers += 1; });
  res.json({ days, trends: Object.values(buckets) });
}));

app.get("/api/admin/users", requireAdmin(["super_admin", "operation_admin"]), asyncHandler(async (req, res) => {
  const { skip, take, page, pageSize } = parsePagination(req);
  const where = req.query.keyword ? { OR: [{ nickname: { contains: String(req.query.keyword) } }, { phone: { contains: String(req.query.keyword) } }, { openid: { contains: String(req.query.keyword) } }] } : {};
  const [items, total] = await Promise.all([
    prisma.user.findMany({ where, orderBy: { registeredAt: "desc" }, skip, take }),
    prisma.user.count({ where })
  ]);
  res.json({ items, total, page, pageSize });
}));

app.get("/api/admin/users/:id", requireAdmin(["super_admin", "operation_admin", "finance_admin", "content_admin"]), asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id }, include: { wallet: true, memberships: true } });
  if (!user) return res.status(404).json({ code: "USER_NOT_FOUND", message: "用户不存在。" });
  const [orders, analysis] = await Promise.all([
    prisma.paymentOrder.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.analysisRecord.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 20 })
  ]);
  res.json({ user, orders, analysis: analysis.map((item) => ({ ...item, submitContent: maskText(item.submitContent) })) });
}));

app.get("/api/admin/orders", requireAdmin(["super_admin", "finance_admin"]), asyncHandler(async (req, res) => {
  const { skip, take, page, pageSize } = parsePagination(req);
  const where = {
    ...(req.query.status ? { status: String(req.query.status) } : {}),
    ...(req.query.orderType ? { orderType: String(req.query.orderType) } : {})
  };
  const [items, total] = await Promise.all([
    prisma.paymentOrder.findMany({ where, orderBy: { createdAt: "desc" }, skip, take }),
    prisma.paymentOrder.count({ where })
  ]);
  res.json({ items, total, page, pageSize });
}));

app.get("/api/admin/membership-plans", requireAdmin(["super_admin", "operation_admin", "finance_admin"]), asyncHandler(async (_req, res) => {
  res.json({ items: await prisma.membershipPlan.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }) });
}));

app.post("/api/admin/membership-plans", requireAdmin(["super_admin", "operation_admin"]), asyncHandler(async (req, res) => {
  const data = z.object({
    name: z.string().min(1),
    price: z.union([z.string(), z.number()]),
    durationDays: z.number().int().positive(),
    analysisLimit: z.number().int().min(0).default(0),
    unlimited: z.boolean().default(false),
    description: z.string().optional(),
    sortOrder: z.number().int().default(0),
    enabled: z.boolean().default(true)
  }).parse(req.body);
  res.status(201).json({ item: await prisma.membershipPlan.create({ data: { ...data, createdBy: req.admin.id } }) });
}));

app.patch("/api/admin/membership-plans/:id", requireAdmin(["super_admin", "operation_admin"]), asyncHandler(async (req, res) => {
  const item = await prisma.membershipPlan.update({ where: { id: req.params.id }, data: { ...req.body, updatedBy: req.admin.id } });
  res.json({ item });
}));

app.delete("/api/admin/membership-plans/:id", requireAdmin(["super_admin"]), asyncHandler(async (req, res) => {
  await prisma.membershipPlan.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
}));

app.get("/api/admin/point-packages", requireAdmin(["super_admin", "operation_admin", "finance_admin"]), asyncHandler(async (_req, res) => {
  res.json({ items: await prisma.pointPackage.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }) });
}));

app.post("/api/admin/point-packages", requireAdmin(["super_admin", "operation_admin"]), asyncHandler(async (req, res) => {
  const data = z.object({
    name: z.string().min(1),
    price: z.union([z.string(), z.number()]),
    points: z.number().int().positive(),
    bonusPoints: z.number().int().min(0).default(0),
    description: z.string().optional(),
    sortOrder: z.number().int().default(0),
    enabled: z.boolean().default(true)
  }).parse(req.body);
  res.status(201).json({ item: await prisma.pointPackage.create({ data: { ...data, createdBy: req.admin.id } }) });
}));

app.patch("/api/admin/point-packages/:id", requireAdmin(["super_admin", "operation_admin"]), asyncHandler(async (req, res) => {
  const item = await prisma.pointPackage.update({ where: { id: req.params.id }, data: { ...req.body, updatedBy: req.admin.id } });
  res.json({ item });
}));

app.get("/api/admin/analysis-records", requireAdmin(["super_admin", "operation_admin", "content_admin"]), asyncHandler(async (req, res) => {
  const { skip, take, page, pageSize } = parsePagination(req);
  const [items, total] = await Promise.all([
    prisma.analysisRecord.findMany({ orderBy: { createdAt: "desc" }, skip, take }),
    prisma.analysisRecord.count()
  ]);
  res.json({ items: items.map((item) => ({ ...item, submitContent: maskText(item.submitContent) })), total, page, pageSize });
}));

app.get("/api/admin/prompt-versions", requireAdmin(["super_admin", "content_admin"]), asyncHandler(async (_req, res) => {
  res.json({ items: await prisma.promptVersion.findMany({ orderBy: { versionNo: "desc" } }) });
}));

app.post("/api/admin/prompt-versions", requireAdmin(["super_admin", "content_admin"]), asyncHandler(async (req, res) => {
  const body = z.object({
    title: z.string(),
    content: z.string().min(10),
    changeReason: z.string().optional(),
    activate: z.boolean().default(false),
    baseVersionId: z.string().optional()
  }).parse(req.body);
  const last = await prisma.promptVersion.findFirst({ orderBy: { versionNo: "desc" } });
  const baseVersion = body.baseVersionId
    ? await prisma.promptVersion.findUnique({ where: { id: body.baseVersionId } })
    : null;
  if (body.baseVersionId && !baseVersion) {
    return res.status(404).json({ code: "PROMPT_BASE_NOT_FOUND", message: "基础提示词版本不存在。" });
  }
  const item = await prisma.$transaction(async (tx) => {
    if (body.activate) await tx.promptVersion.updateMany({ data: { status: "archived" }, where: { status: "active" } });
    return tx.promptVersion.create({
      data: {
        title: body.title,
        content: body.content,
        changeReason: baseVersion
          ? `基于 v${baseVersion.versionNo} 修改。${body.changeReason || ""}`.trim()
          : body.changeReason,
        baseVersionId: baseVersion?.id,
        baseVersionNo: baseVersion?.versionNo,
        versionNo: (last?.versionNo || 0) + 1,
        status: body.activate ? "active" : "draft",
        createdBy: req.admin.id,
        activatedBy: body.activate ? req.admin.id : null,
        activatedAt: body.activate ? new Date() : null
      }
    });
  });
  res.status(201).json({ item });
}));

app.post("/api/admin/prompt-versions/:id/activate", requireAdmin(["super_admin", "content_admin"]), asyncHandler(async (req, res) => {
  const item = await prisma.$transaction(async (tx) => {
    await tx.promptVersion.updateMany({ data: { status: "archived" }, where: { status: "active" } });
    return tx.promptVersion.update({ where: { id: req.params.id }, data: { status: "active", activatedBy: req.admin.id, activatedAt: new Date() } });
  });
  res.json({ item });
}));

app.get("/api/admin/prompt-suggestions", requireAdmin(["super_admin", "content_admin"]), asyncHandler(async (_req, res) => {
  res.json({ items: await prisma.promptSuggestion.findMany({ orderBy: { createdAt: "desc" } }) });
}));

app.post("/api/admin/prompt-suggestions/generate", requireAdmin(["super_admin", "content_admin"]), asyncHandler(async (_req, res) => {
  const records = await prisma.analysisRecord.findMany({
    where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60_000) } },
    orderBy: { createdAt: "desc" },
    take: 300
  });
  const groups = records.reduce((acc, item) => {
    acc[item.analysisType] ||= [];
    acc[item.analysisType].push(item);
    return acc;
  }, {});
  const created = [];
  for (const [type, items] of Object.entries(groups)) {
    const failed = items.filter((item) => !item.success).length;
    const commonText = items.slice(0, 5).map((item) => maskText(item.submitContent)).join(" / ");
    created.push(await prisma.promptSuggestion.create({
      data: {
        questionType: type,
        userNeed: `近 30 天该类型共 ${items.length} 条，样例：${commonText}`,
        currentWeakness: failed > 0 ? `存在 ${failed} 条失败或未完整回答记录，需要补充失败兜底和追问策略。` : "建议继续提升结构化程度，避免回答过于笼统。",
        addRules: "增加：先引用命局关键依据，再给结论；对事业、财运、感情、健康分别输出可执行建议；涉及不确定信息时主动说明前提。",
        removeRules: "弱化：绝对化吉凶、恐吓式表达、没有依据的断语。",
        recommendedSnippet: `当用户咨询${type}时，必须结合四柱、当前大运、流年/流月触发关系，并列出依据、风险、建议三段。`,
        sampleRecordIds: items.slice(0, 20).map((item) => item.id).join(",")
      }
    }));
  }
  res.status(201).json({ items: created });
}));

app.patch("/api/admin/prompt-suggestions/:id", requireAdmin(["super_admin", "content_admin"]), asyncHandler(async (req, res) => {
  const body = z.object({ status: z.enum(["accepted", "ignored", "pending"]) }).parse(req.body);
  res.json({ item: await prisma.promptSuggestion.update({ where: { id: req.params.id }, data: { status: body.status, reviewedBy: req.admin.id, reviewedAt: new Date() } }) });
}));

app.get("/api/admin/request-logs", requireAdmin(["super_admin", "operation_admin"]), asyncHandler(async (req, res) => {
  const { skip, take, page, pageSize } = parsePagination(req);
  const [items, total] = await Promise.all([
    prisma.requestLog.findMany({ orderBy: { requestTime: "desc" }, skip, take }),
    prisma.requestLog.count()
  ]);
  res.json({ items, total, page, pageSize });
}));

app.get("/api/admin/security-events", requireAdmin(["super_admin", "operation_admin"]), asyncHandler(async (_req, res) => {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const [events, requestTotal, abnormal, rateLimited, attackIps, blockedIps, topPaths, top404, fiveXxTrend] = await Promise.all([
    prisma.securityEvent.findMany({ orderBy: { lastSeenAt: "desc" }, take: 100 }),
    prisma.requestLog.count({ where: { requestTime: { gte: todayStart } } }),
    prisma.requestLog.count({ where: { requestTime: { gte: todayStart }, OR: [{ statusCode: { gte: 400 } }, { durationMs: { gt: 3000 } }] } }),
    prisma.requestLog.count({ where: { requestTime: { gte: todayStart }, rateLimited: true } }),
    prisma.securityEvent.groupBy({ by: ["attackIp"], where: { createdAt: { gte: todayStart } }, _count: { attackIp: true } }),
    prisma.ipBlocklist.findMany({ where: { status: "active", OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] }, orderBy: { updatedAt: "desc" }, take: 100 }),
    prisma.requestLog.groupBy({ by: ["path"], where: { requestTime: { gte: todayStart } }, _count: { path: true }, orderBy: { _count: { path: "desc" } }, take: 10 }),
    prisma.requestLog.groupBy({ by: ["path"], where: { requestTime: { gte: todayStart }, statusCode: 404 }, _count: { path: true }, orderBy: { _count: { path: "desc" } }, take: 10 }),
    prisma.requestLog.findMany({ where: { requestTime: { gte: todayStart }, statusCode: { gte: 500 } }, select: { requestTime: true, statusCode: true }, orderBy: { requestTime: "asc" } })
  ]);
  res.json({
    events,
    panel: {
      requestTotal,
      abnormal,
      rateLimited,
      suspectedAttackIps: attackIps.length,
      blockedIpCount: blockedIps.length,
      blockedIps,
      topPaths,
      top404,
      fiveXxTrend
    }
  });
}));

app.post("/api/admin/ip-blocklist", requireAdmin(["super_admin", "operation_admin"]), asyncHandler(async (req, res) => {
  const body = z.object({ ip: z.string().min(3), reason: z.string().optional(), expiresAt: z.string().datetime().optional() }).parse(req.body);
  await upsertSecurityEvent("manual_block", body.ip, "*", 1, body.reason);
  const item = await prisma.ipBlocklist.upsert({
    where: { ip: body.ip },
    update: { status: "active", reason: body.reason, expiresAt: body.expiresAt ? new Date(body.expiresAt) : null, createdBy: req.admin.id },
    create: { ip: body.ip, reason: body.reason, expiresAt: body.expiresAt ? new Date(body.expiresAt) : null, createdBy: req.admin.id }
  });
  res.json({ item });
}));

app.delete("/api/admin/ip-blocklist/:ip", requireAdmin(["super_admin", "operation_admin"]), asyncHandler(async (req, res) => {
  const item = await prisma.ipBlocklist.update({ where: { ip: req.params.ip }, data: { status: "inactive" } });
  res.json({ item });
}));

app.use(errorHandler);

setInterval(() => expireMemberships().catch((error) => console.warn("expire memberships failed", error.message)), 10 * 60_000);

app.listen(config.port, () => {
  console.log(`Yan Ce AI backend listening on http://127.0.0.1:${config.port}`);
});
