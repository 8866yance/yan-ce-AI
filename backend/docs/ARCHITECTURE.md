# 后端目录结构

```text
backend/
  package.json
  .env.example
  prisma/
    schema.prisma        # 17+ 张核心业务表
    seed.js              # 默认套餐、积分包、管理员、提示词、测试用户
  src/
    config.js            # 环境变量和限流配置
    db.js                # Prisma Client 和钱包工具
    middleware.js        # 认证、限流、请求日志、安全事件
    services.js          # 订单、支付回调、会员/积分发放、统计
    server.js            # API 路由入口
  docs/
    API.md
    DATABASE.md
    ARCHITECTURE.md
```

## 关键设计

### 会员套餐

价格从 `membership_plans` 读取，后台可新增、删除、启用、禁用。

重复购买采用 `renew_stack`：

- 未过期：从当前会员结束时间继续叠加。
- 已过期：从支付成功时间开始。

### 积分

`user_wallets` 存余额，`point_ledger` 存每一次变动。充值、消费、退款、后台调整都必须写流水。

### 支付

`payment_orders` 保存订单。前端支付成功不发权益，必须等 `/api/payments/webhook`：

1. 验签。
2. 防重复。
3. 校验金额。
4. 更新订单为 paid。
5. 事务内发放会员或积分。

资金模块的完整约束见 `docs/FUNDING_RULES.md`。后台不提供绕过订单直接改用户余额或直接开通会员的接口。

### 统计

后台 dashboard 当前直接从真实业务表聚合，不使用假数据。后期访问量上来后，可用定时任务写入 `dashboard_daily_stats`、`dashboard_hourly_stats` 提升性能。

### 在线人数

前端定时调用 `/api/heartbeat`。后台用最近 5 分钟 `user_sessions.lastHeartbeatAt` 统计在线人数。

### 安全

后端记录所有请求日志：

- IP
- 路径
- 方法
- User-Agent
- 状态码
- 耗时
- 用户 ID
- 代理来源字段

安全事件来自：

- 限流
- 黑名单拦截
- 高频 AI 接口
- 大量 404
- 大量 5xx
- 手动封禁

真正 DDoS 防护仍应接 Cloudflare / WAF / 高防 IP / Nginx 限流。
