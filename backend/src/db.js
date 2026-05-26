import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"]
});

export async function ensureWallet(userId, tx = prisma) {
  const existing = await tx.userWallet.findUnique({ where: { userId } });
  if (existing) return existing;
  return tx.userWallet.create({ data: { userId } });
}

export function toMoney(value) {
  return Number(value || 0).toFixed(2);
}
