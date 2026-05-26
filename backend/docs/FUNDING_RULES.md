# 资金模块规则

这是充值、会员、积分和支付订单的硬性规则。

## 不允许的行为

- 不允许前端直接修改用户会员状态。
- 不允许前端直接增加积分余额。
- 不允许后台运营人员绕过订单直接给用户充值积分。
- 不允许后台运营人员绕过订单直接开通会员。
- 不允许以前端支付成功返回作为发放权益依据。
- 不允许只修改 `users.currentPoints` 或 `user_wallets.pointsBalance`，却没有 `point_ledger` 流水。

## 必须走的链路

### 会员购买

1. 用户选择 `membership_plans` 中启用的套餐。
2. 创建 `payment_orders`，状态为 `pending`。
3. 前端调用微信/支付宝等支付。
4. 支付平台通知后端 `/api/payments/webhook`。
5. 后端验签。
6. 后端校验订单金额。
7. 后端防重复回调。
8. 后端将订单改为 `paid`。
9. 后端在同一个事务里创建 `user_memberships`。
10. 后端更新用户当前会员状态。

### 积分充值

1. 用户选择 `point_packages` 中启用的积分包。
2. 创建 `payment_orders`，状态为 `pending`。
3. 支付平台通知后端 `/api/payments/webhook`。
4. 后端验签、校验金额、防重复。
5. 后端将订单改为 `paid`。
6. 后端在同一个事务里更新 `user_wallets`。
7. 后端写入 `point_ledger`，记录 `beforeBalance` 和 `afterBalance`。
8. `users.currentPoints` 只作为展示冗余字段同步更新。

### 积分消费

1. 提交 AI 分析。
2. 优先检查有效会员额度。
3. 没有会员额度时检查钱包余额。
4. 扣减 `user_wallets.pointsBalance`。
5. 写入 `point_ledger` 消耗流水。
6. 写入 `analysis_records`。

## 当前代码中的保护

- 用户端只有创建订单接口，没有直接充值接口。
- 管理后台只有套餐/积分包配置接口，没有直接改用户余额接口。
- `processPaymentCallback` 是唯一发放会员和积分的入口。
- 支付回调必须传 `X-Payment-Signature`。
- 回调金额必须等于订单金额。
- 已支付订单重复回调不会重复发放。
- 积分充值和消费都会写 `point_ledger`。

## 后续接入真实支付

接微信支付或支付宝时，只替换支付 provider：

- 预下单接口生成支付参数。
- 回调验签改为官方 SDK 验签。
- 保持 `processPaymentCallback` 的订单校验和权益发放规则不变。
