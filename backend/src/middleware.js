import { prisma } from "./db.js";
import { config } from "./config.js";
import { getClientIp, verifyToken } from "./utils.js";

const buckets = new Map();

export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

function hitBucket(key, limit, windowMs) {
  const now = Date.now();
  const current = buckets.get(key) || { count: 0, resetAt: now + windowMs };
  if (now > current.resetAt) {
    current.count = 0;
    current.resetAt = now + windowMs;
  }
  current.count += 1;
  buckets.set(key, current);
  return current;
}

async function createTempBlock(ip, reason, minutes = config.tempBlockMinutes) {
  const expiresAt = new Date(Date.now() + minutes * 60_000);
  await prisma.ipBlocklist.upsert({
    where: { ip },
    update: { status: "active", reason, expiresAt },
    create: { ip, reason, expiresAt, status: "active" }
  });
}

export function rateLimit(name = "default") {
  const rule = config.rateLimits[name] || config.rateLimits.default;
  return asyncHandler(async (req, res, next) => {
    const ip = getClientIp(req);
    const checks = [];
    if (rule.ipLimit) checks.push({ key: `${name}:ip:${ip}`, limit: rule.ipLimit, scope: "ip" });
    if (rule.userLimit && req.user?.id) checks.push({ key: `${name}:user:${req.user.id}`, limit: rule.userLimit, scope: "user" });

    for (const check of checks) {
      const current = hitBucket(check.key, check.limit, rule.windowMs);
      if (rule.tempBlockAfter && check.scope === "ip" && current.count > rule.tempBlockAfter) {
        req.rateLimited = true;
        await upsertSecurityEvent("temporary_block", ip, req.path, current.count, `${name} exceeded temporary block threshold`);
        await createTempBlock(ip, `${name} high frequency requests`);
        return res.status(403).json({ code: "TEMPORARILY_BLOCKED", message: "访问过于频繁，已临时限制。" });
      }
      if (current.count > check.limit) {
        req.rateLimited = true;
        await upsertSecurityEvent("rate_limited", ip, req.path, current.count, `${name} ${check.scope} limit`);
        return res.status(429).json({ code: "RATE_LIMITED", message: "请求过于频繁，请稍后再试。" });
      }
    }
    next();
  });
}

export async function upsertSecurityEvent(eventType, ip, path, count = 1, rawData) {
  const existing = await prisma.securityEvent.findFirst({
    where: { eventType, attackIp: ip, attackPath: path, status: "open" }
  });
  if (existing) {
    return prisma.securityEvent.update({
      where: { id: existing.id },
      data: { requestCount: { increment: count }, lastSeenAt: new Date(), rawData }
    });
  }
  return prisma.securityEvent.create({
    data: {
      eventType,
      attackIp: ip,
      attackPath: path,
      requestCount: count,
      firstSeenAt: new Date(),
      lastSeenAt: new Date(),
      rawData
    }
  });
}

export const requestLogger = asyncHandler(async (req, res, next) => {
  const started = Date.now();
  const ip = getClientIp(req);
  req.rateLimited = false;
  req.blockedByBlacklist = false;

  res.on("finish", async () => {
    const durationMs = Date.now() - started;
    try {
      await prisma.requestLog.create({
        data: {
          userId: req.user?.id,
          ip,
          path: req.path,
          method: req.method,
          userAgent: req.headers["user-agent"],
          statusCode: res.statusCode,
          durationMs,
          rateLimited: Boolean(req.rateLimited),
          blockedByBlacklist: Boolean(req.blockedByBlacklist),
          requestBodyBytes: Number(req.headers["content-length"] || 0) || null,
          provider: req.headers["cf-ray"] ? "cloudflare" : req.headers["x-forwarded-for"] ? "proxy" : "origin"
        }
      });
      if (res.statusCode === 404) await upsertSecurityEvent("many_404", ip, req.path);
      if (res.statusCode >= 500) await upsertSecurityEvent("many_5xx", ip, req.path);
      if (req.path.includes("/analysis") && durationMs < 1000) {
        const recent = await prisma.requestLog.count({
          where: { ip, path: { contains: "/analysis" }, requestTime: { gt: new Date(Date.now() - 60_000) } }
        });
        if (recent > 10) await upsertSecurityEvent("high_frequency_analysis", ip, req.path, recent);
      }
    } catch (error) {
      console.warn("request log failed", error.message);
    }
  });

  const blocked = await prisma.ipBlocklist.findFirst({
    where: {
      ip,
      status: "active",
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }]
    }
  });
  if (blocked) {
    req.blockedByBlacklist = true;
    await upsertSecurityEvent("blocked_ip", ip, req.path, 1, blocked.reason);
    return res.status(403).json({ code: "IP_BLOCKED", message: "当前 IP 已被限制访问。" });
  }
  next();
});

export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return next();
  try {
    const payload = verifyToken(token);
    if (payload.type === "user") {
      req.user = await prisma.user.findUnique({ where: { id: payload.sub } });
    }
    if (payload.type === "admin") {
      req.admin = await prisma.adminUser.findUnique({ where: { id: payload.sub } });
    }
  } catch {
    // Guest request continues.
  }
  next();
});

export function requireUser(req, res, next) {
  if (!req.user || req.user.status !== "active") {
    return res.status(401).json({ code: "UNAUTHORIZED", message: "请先登录。" });
  }
  next();
}

export function requireAdmin(roles = []) {
  return (req, res, next) => {
    if (!req.admin || req.admin.status !== "active") {
      return res.status(401).json({ code: "ADMIN_UNAUTHORIZED", message: "管理员未登录。" });
    }
    if (roles.length && req.admin.role !== "super_admin" && !roles.includes(req.admin.role)) {
      return res.status(403).json({ code: "FORBIDDEN", message: "当前角色无权访问该功能。" });
    }
    next();
  };
}

export function errorHandler(error, _req, res, _next) {
  console.error(error);
  if (error.name === "ZodError") {
    return res.status(400).json({ code: "VALIDATION_ERROR", message: error.errors[0]?.message || "参数错误" });
  }
  res.status(error.status || 500).json({ code: error.code || "SERVER_ERROR", message: error.message || "服务器错误" });
}
