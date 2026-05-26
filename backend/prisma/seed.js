import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const membershipCount = await prisma.membershipPlan.count();
  if (membershipCount === 0) {
    await prisma.membershipPlan.createMany({
      data: [
      { name: "基础会员", price: "29.99", durationDays: 30, analysisLimit: 30, unlimited: false, description: "适合轻度使用，含 30 次 AI 分析。", sortOrder: 1, enabled: true },
      { name: "进阶会员", price: "59.99", durationDays: 90, analysisLimit: 120, unlimited: false, description: "适合持续关注流年流月的用户。", sortOrder: 2, enabled: true },
      { name: "尊享会员", price: "89.99", durationDays: 180, analysisLimit: 0, unlimited: true, description: "有效期内不限次数分析，适合深度用户。", sortOrder: 3, enabled: true }
      ]
    });
  }

  const pointPackageCount = await prisma.pointPackage.count();
  if (pointPackageCount === 0) {
    await prisma.pointPackage.createMany({
      data: [
      { name: "体验积分包", price: "9.99", points: 100, bonusPoints: 0, description: "适合单次深度咨询。", sortOrder: 1, enabled: true },
      { name: "常用积分包", price: "19.99", points: 220, bonusPoints: 20, description: "赠送 20 积分。", sortOrder: 2, enabled: true },
      { name: "高频积分包", price: "49.99", points: 600, bonusPoints: 100, description: "赠送 100 积分。", sortOrder: 3, enabled: true }
      ]
    });
  }

  const email = process.env.ADMIN_DEFAULT_EMAIL || "admin@yan-ce-ai.local";
  const password = process.env.ADMIN_DEFAULT_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash, nickname: "超级管理员", role: "super_admin", status: "active" }
  });

  const activePrompt = await prisma.promptVersion.findFirst({ where: { status: "active" } });
  if (!activePrompt) {
    await prisma.promptVersion.create({
      data: {
        title: "八字分析系统提示词",
        content: "你是专业命理分析助手。必须先基于四柱、十神、五行强弱、大运流年流月关系进行结构化判断，再输出生活建议。神煞只作辅助参考，不可单独断吉凶。不得制造恐吓式结论。",
        versionNo: 1,
        status: "active",
        changeReason: "初始化默认提示词",
        createdBy: "seed",
        activatedBy: "seed",
        activatedAt: new Date()
      }
    });
  }

  const user = await prisma.user.upsert({
    where: { openid: "demo-openid-001" },
    update: {},
    create: {
      openid: "demo-openid-001",
      unionid: "demo-unionid-001",
      nickname: "测试用户",
      status: "active",
      registeredAt: new Date(),
      lastLoginAt: new Date()
    }
  });
  const wallet = await prisma.userWallet.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id }
  });
  const existingInitLedger = await prisma.pointLedger.findFirst({
    where: { userId: user.id, changeType: "seed_initial_points" }
  });
  if (!existingInitLedger) {
    const updatedWallet = await prisma.userWallet.update({
      where: { userId: user.id },
      data: { pointsBalance: { increment: 300 }, totalEarned: { increment: 300 } }
    });
    await prisma.pointLedger.create({
      data: {
        userId: user.id,
        walletId: wallet.id,
        changeType: "seed_initial_points",
        direction: "in",
        points: 300,
        beforeBalance: wallet.pointsBalance,
        afterBalance: updatedWallet.pointsBalance,
        remark: "测试用户初始化积分，仅用于本地开发种子数据。"
      }
    });
    await prisma.user.update({ where: { id: user.id }, data: { currentPoints: updatedWallet.pointsBalance } });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed completed.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
