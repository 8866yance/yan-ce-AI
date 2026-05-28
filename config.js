import "dotenv/config";

export const config = {
  port: Number(process.env.PORT || 4300),
  jwtSecret: process.env.JWT_SECRET || "dev-only-change-me",
  paymentWebhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || "dev-payment-secret",
  corsOrigin: (process.env.CORS_ORIGIN || "http://127.0.0.1:4173,http://localhost:4173").split(",").map((item) => item.trim()).filter(Boolean),
  redisEnabled: String(process.env.REDIS_ENABLED || "false").toLowerCase() === "true",
  redisUrl: process.env.REDIS_URL || "",
  onlineWindowMinutes: 5,
  jsonBodyLimit: process.env.JSON_BODY_LIMIT || "512kb",
  uploadBodyLimit: process.env.UPLOAD_BODY_LIMIT || "5mb",
  aiProvider: process.env.AI_PROVIDER || "",
  arkApiKey: process.env.ARK_API_KEY || "",
  arkBaseUrl: process.env.ARK_BASE_URL || "",
  arkModel: process.env.ARK_MODEL || "",
  tempBlockMinutes: Number(process.env.TEMP_BLOCK_MINUTES || 10),
  rateLimits: {
    login: { ipLimit: 5, windowMs: 60_000, tempBlockAfter: 20 },
    adminLogin: { ipLimit: 5, windowMs: 60_000, tempBlockAfter: 15 },
    payment: { userLimit: 3, ipLimit: 20, windowMs: 60_000 },
    analysis: { userLimit: 3, ipLimit: 10, windowMs: 60_000, tempBlockAfter: 30 },
    default: { ipLimit: 180, windowMs: 60_000, tempBlockAfter: 360 }
  }
};
