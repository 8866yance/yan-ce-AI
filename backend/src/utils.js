import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { config } from "./config.js";

export function signUser(user) {
  return jwt.sign({ sub: user.id, type: "user" }, config.jwtSecret, { expiresIn: "30d" });
}

export function signAdmin(admin) {
  return jwt.sign({ sub: admin.id, role: admin.role, type: "admin" }, config.jwtSecret, { expiresIn: "12h" });
}

export function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

export function getClientIp(req) {
  return (req.headers["cf-connecting-ip"]
    || req.headers["x-real-ip"]
    || req.headers["x-forwarded-for"]?.split(",")[0]
    || req.socket.remoteAddress
    || "").replace("::ffff:", "");
}

export function createOrderNo(prefix = "YC") {
  const time = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  return `${prefix}${time}${nanoid(8).toUpperCase()}`;
}

export function hmacSign(payload, secret = config.paymentWebhookSecret) {
  const text = typeof payload === "string" ? payload : JSON.stringify(payload);
  return crypto.createHmac("sha256", secret).update(text).digest("hex");
}

export function dayStart(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export function maskText(value = "") {
  if (value.length <= 16) return value;
  return `${value.slice(0, 8)}***${value.slice(-4)}`;
}

export function parsePagination(req) {
  const page = Math.max(Number(req.query.page || 1), 1);
  const pageSize = Math.min(Math.max(Number(req.query.pageSize || 20), 1), 100);
  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize };
}
