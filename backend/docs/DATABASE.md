# 数据库表设计

数据库模型在 [prisma/schema.prisma](../prisma/schema.prisma) 中定义。开发默认 SQLite，生产可切 MySQL。

## users 用户表

- `id String PK`：用户 ID。
- `openid String unique nullable`：小程序 openid。
- `unionid String index nullable`：微信 unionid。
- `nickname String nullable`：昵称。
- `avatarUrl String nullable`：头像。
- `phone String nullable`：手机号，可选。
- `registeredAt DateTime index`：注册时间。
- `lastLoginAt DateTime nullable`：最近登录时间。
- `loginIp String nullable`：登录 IP。
- `status String index`：`active/disabled`。
- `currentMembershipStatus String`：`none/active/expired`。
- `currentPoints Int`：当前积分余额冗余字段，真实对账以 `user_wallets` 和 `point_ledger` 为准。
- `totalAnalysisCount Int`：累计分析次数。
- `totalRechargeAmount Decimal`：累计充值金额。

## user_sessions 用户在线状态表

- `id String PK`
- `userId String index`
- `sessionToken String unique nullable`
- `deviceId String nullable`
- `platform String nullable`
- `ip String nullable`
- `userAgent String nullable`
- `lastHeartbeatAt DateTime index`：最近心跳。
- `onlineStatus String index`

## membership_plans 会员套餐表

- `id String PK`
- `name String`
- `price Decimal`：后台可配置价格。
- `durationDays Int`：有效期天数。
- `analysisLimit Int`：可分析次数。
- `unlimited Boolean`：是否不限次数。
- `description String nullable`
- `sortOrder Int`
- `enabled Boolean index`
- `createdBy/updatedBy String nullable`

默认种子套餐：`29.99`、`59.99`、`89.99`。

## user_memberships 用户会员表

- `id String PK`
- `userId String index`
- `planId String`
- `orderId String unique nullable`
- `startAt DateTime`
- `endAt DateTime index`
- `status String index`：`active/expired/cancelled`
- `analysisLimit Int`
- `analysisUsed Int`
- `unlimited Boolean`
- `purchaseMode String`：默认 `renew_stack`，续费叠加时长。

## point_packages 积分充值包表

- `id String PK`
- `name String`
- `price Decimal`
- `points Int`
- `bonusPoints Int`
- `description String nullable`
- `sortOrder Int`
- `enabled Boolean index`
- `createdBy/updatedBy String nullable`

默认种子积分包：`9.99`、`19.99`、`49.99`。

## user_wallets 用户钱包表

- `id String PK`
- `userId String unique`
- `pointsBalance Int`
- `frozenPoints Int`
- `totalEarned Int`
- `totalSpent Int`

## point_ledger 积分流水表

- `id String PK`
- `userId String index`
- `walletId String nullable`
- `orderId String index nullable`
- `analysisRecordId String index nullable`
- `changeType String index`：`recharge/analysis_consume/admin_adjust/refund`
- `direction String`：`in/out`
- `points Int`
- `beforeBalance Int`
- `afterBalance Int`
- `remark String nullable`
- `operatorType String`
- `operatorId String nullable`
- `createdAt DateTime index`

积分对账必须以本表为准。

## payment_orders 支付订单表

- `id String PK`
- `orderNo String unique`
- `userId String index`
- `orderType String index`：`membership/points`
- `productId String`
- `productName String nullable`
- `amount Decimal`
- `currency String`
- `status String index`：`pending/paid/cancelled/refunded/failed`
- `paymentProvider String nullable`
- `thirdPartyTradeNo String index nullable`
- `paidAt DateTime nullable`
- `callbackRaw String nullable`
- `callbackSignature String nullable`
- `callbackProcessedAt DateTime nullable`
- `refundedAt DateTime nullable`
- `refundAmount Decimal nullable`
- `failReason String nullable`
- `clientIp String nullable`

支付成功以后端回调为准，发放权益在事务内完成。

## analysis_records AI分析记录表

- `id String PK`
- `userId String index`
- `submitContent String`：用户提交内容。
- `imageUrl String nullable`
- `birthInfoJson String`
- `baziResultJson String`
- `aiResult String nullable`
- `promptVersionId String nullable`
- `pointsCost Int`
- `memberFree Boolean`
- `analysisType String index`：`bazi/year/month/marriage/other`
- `durationMs Int nullable`
- `success Boolean index`
- `failReason String nullable`
- `clientIp String nullable`
- `createdAt DateTime index`

后台展示时应脱敏。

## prompt_versions 提示词版本表

- `id String PK`
- `title String`
- `content String`
- `versionNo Int unique`
- `status String index`：`draft/active/archived`
- `changeReason String nullable`
- `createdBy String nullable`
- `activatedBy String nullable`
- `activatedAt DateTime nullable`

前端 AI 分析必须读取当前 `active` 版本。

## prompt_suggestions 提示词优化建议表

- `id String PK`
- `questionType String`
- `userNeed String`
- `currentWeakness String`
- `addRules String`
- `removeRules String nullable`
- `recommendedSnippet String`
- `sampleRecordIds String nullable`
- `status String index`：`pending/accepted/ignored`
- `generatedBy String`
- `reviewedBy String nullable`
- `reviewedAt DateTime nullable`

## request_logs 请求日志表

- `id String PK`
- `userId String index nullable`
- `ip String index`
- `path String index`
- `method String`
- `userAgent String nullable`
- `statusCode Int index`
- `durationMs Int`
- `requestTime DateTime index`
- `requestId String nullable`
- `provider String nullable`：`origin/proxy/cloudflare`
- `country/region/city String nullable`

## security_events 安全事件表

- `id String PK`
- `eventType String index`
- `attackIp String index`
- `requestCount Int`
- `attackPath String nullable`
- `firstSeenAt DateTime`
- `lastSeenAt DateTime index`
- `status String index`：`open/handled/ignored`
- `sourceProvider String nullable`
- `rawData String nullable`
- `handledBy String nullable`
- `handledAt DateTime nullable`
- `note String nullable`

## ip_blocklist IP 黑名单表

- `id String PK`
- `ip String unique`
- `reason String nullable`
- `status String index`
- `createdBy String nullable`
- `expiresAt DateTime nullable`

## admin_users 管理员表

- `id String PK`
- `email String unique`
- `passwordHash String`
- `nickname String nullable`
- `role String index`：`super_admin/operation_admin/finance_admin/content_admin`
- `status String index`
- `lastLoginAt DateTime nullable`
- `lastLoginIp String nullable`

## admin_audit_logs 后台操作日志表

- `id String PK`
- `adminId String index nullable`
- `action String`
- `resource String index`
- `resourceId String nullable`
- `beforeJson String nullable`
- `afterJson String nullable`
- `ip String nullable`
- `userAgent String nullable`
- `createdAt DateTime index`

## dashboard_daily_stats 每日统计表

- `statDate DateTime unique`
- `newUsers Int`
- `activeUsers Int`
- `analysisCount Int`
- `rechargeAmount Decimal`
- `paidOrderCount Int`
- `abnormalRequests Int`
- `suspectedAttacks Int`
- `memberUsers Int`
- `pointRechargeUsers Int`

## dashboard_hourly_stats 小时统计表

- `statHour DateTime unique`
- `newUsers Int`
- `activeUsers Int`
- `analysisCount Int`
- `rechargeAmount Decimal`
- `requestCount Int`
- `abnormalRequests Int`


### request_logs 安全字段补充

- rateLimited Boolean：本次请求是否被后端限流。
- blockedByBlacklist Boolean：本次请求是否被 IP 黑名单拦截。
- requestBodyBytes Int：请求体大小，便于观察异常大请求。

这些字段用于后台安全面板统计今日被限流次数、黑名单拦截记录、异常请求趋势。
