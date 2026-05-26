# 玄核 Bazi AI Backend

商业化后端骨架，覆盖用户、会员、积分、支付订单、分析记录、提示词版本、后台统计和安全监控。

## 技术方案

- Node.js + Express：轻量、适合先快速落地小程序/网站 API。
- Prisma：统一管理数据库模型，开发默认 SQLite，生产建议切 MySQL。
- Redis 预留：线上用于分布式限流、在线心跳、任务队列和缓存。
- 支付回调：当前提供 HMAC 验签模拟回调，接微信/支付宝时保持“服务端回调为准”的发放逻辑。

## 本地运行

```bash
cd backend
copy .env.example .env
npm install
npm run prisma:generate
npm run db:push
npm run db:seed
npm run dev
```

打开：

```text
http://127.0.0.1:4300/health
```

> 当前电脑命令行里 `node.exe` 权限异常、`npm` 未识别。安装 Node.js LTS 后，重新打开 PowerShell 再执行上面的命令。

## 默认管理员

来自 `.env`：

- 邮箱：`admin@yan-ce-ai.local`
- 密码：`ChangeMe123!`

上线前必须修改。

## 会员续费策略

推荐并已实现：`renew_stack` 续费叠加时长。

- 用户当前会员未过期：新套餐从当前会员结束时间后开始叠加。
- 用户无会员或已过期：从支付成功时间开始。
- 这样不会吞掉用户剩余会员天数，商业上更合理，也更容易解释。

## 支付回调测试

1. 管理员登录获取 token。
2. 用户创建订单。
3. 用管理员接口生成模拟签名：

```http
POST /api/payments/mock-signature
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "orderNo": "M20260524123456ABCDEF12",
  "amount": "29.99",
  "status": "paid",
  "provider": "mock",
  "thirdPartyTradeNo": "mock_trade_001"
}
```

4. 调用回调：

```http
POST /api/payments/webhook
X-Payment-Signature: <signature>
Content-Type: application/json

{"orderNo":"...","amount":"29.99","status":"paid","provider":"mock","thirdPartyTradeNo":"mock_trade_001"}
```

支付成功后才会发放会员或积分。

资金模块硬规则见：

```text
docs/FUNDING_RULES.md
```

当前后端不提供绕过订单直接改余额或直接开通会员的接口。

## 生产建议

- 数据库：MySQL 8 或 PostgreSQL。
- Redis：替换内存限流、在线人数统计、支付幂等锁。
- 网关：Nginx / Cloudflare / 腾讯云 WAF / 阿里云 WAF。
- 定时任务：会员过期、每日统计汇总、提示词优化建议生成。
- 对象存储：用户上传图片保存到 COS/OSS/R2。
