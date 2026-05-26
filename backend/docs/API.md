# API 接口文档

Base URL: `http://127.0.0.1:4300`

认证方式：

```http
Authorization: Bearer <token>
```

## 用户端

资金规则：会员购买和积分充值都必须先创建订单，再由支付平台服务端回调确认。用户端和后台均不提供直接修改余额或直接开通会员的接口。

### 用户登录

`POST /api/auth/login`

```json
{
  "openid": "wx-openid",
  "unionid": "wx-unionid",
  "nickname": "用户昵称",
  "avatarUrl": "https://example.com/avatar.png"
}
```

返回：`token`、`user`。

### 获取用户信息

`GET /api/me`

返回用户、钱包、当前有效会员。

### 上报在线心跳

`POST /api/heartbeat`

后端按最近 5 分钟心跳计算当前在线人数。

### 获取会员套餐

`GET /api/membership-plans`

返回后台启用的套餐。价格不写死在前端。

### 创建会员订单

`POST /api/orders/membership`

```json
{ "planId": "membership_plan_id" }
```

### 获取积分包

`GET /api/point-packages`

### 创建积分充值订单

`POST /api/orders/points`

```json
{ "packageId": "point_package_id" }
```

### 查询支付状态

`GET /api/orders/:orderNo`

### 支付回调

`POST /api/payments/webhook`

Header:

```http
X-Payment-Signature: <hmac-sha256>
```

要求：

- 服务端验签。
- 校验订单存在。
- 校验金额一致。
- 防重复回调。
- 只有回调 `paid` 后才发放会员/积分。

### 提交 AI 分析

`POST /api/analysis`

```json
{
  "submitContent": "我想看今年事业",
  "imageUrl": "https://example.com/a.png",
  "birthInfo": {
    "calendarType": "solar",
    "date": "2001-08-18",
    "time": "23:30",
    "province": "北京",
    "city": "北京",
    "area": "东城"
  },
  "baziResult": {
    "year": "辛巳",
    "month": "丙申",
    "day": "癸丑",
    "hour": "壬子"
  },
  "analysisType": "bazi"
}
```

说明：优先消耗有效会员次数；无会员或次数不足时扣积分并写入 `point_ledger`。

### 获取分析历史

`GET /api/analysis/history?page=1&pageSize=20`

## 管理后台

### 管理员登录

`POST /api/admin/login`

```json
{
  "email": "admin@yan-ce-ai.local",
  "password": "ChangeMe123!"
}
```

### 后台首页统计

`GET /api/admin/dashboard`

返回：

- 注册总人数
- 今日新增用户
- 当前在线人数
- 今日/昨日分析次数
- 今日/累计充值金额
- 会员用户数量
- 积分充值用户数量
- 今日异常请求数
- 疑似攻击次数
- 今日小时级波形图
- 热门提问类型排行

### 近 7/30/90 天趋势图

`GET /api/admin/dashboard/trends?days=30`

返回按天聚合的：

- 分析次数趋势
- 充值金额趋势
- 新增用户趋势

### 用户列表

`GET /api/admin/users?page=1&pageSize=20&keyword=xxx`

### 用户详情

`GET /api/admin/users/:id`

包含用户详情、充值记录、分析记录，用户提问内容默认脱敏。

### 订单列表

`GET /api/admin/orders?status=paid&orderType=membership`

可用于后台筛选、导出。

### 会员套餐管理

`GET /api/admin/membership-plans`

`POST /api/admin/membership-plans`

`PATCH /api/admin/membership-plans/:id`

`DELETE /api/admin/membership-plans/:id`

字段：

```json
{
  "name": "基础会员",
  "price": "29.99",
  "durationDays": 30,
  "analysisLimit": 30,
  "unlimited": false,
  "description": "套餐描述",
  "sortOrder": 1,
  "enabled": true
}
```

### 积分包管理

`GET /api/admin/point-packages`

`POST /api/admin/point-packages`

`PATCH /api/admin/point-packages/:id`

### 分析记录

`GET /api/admin/analysis-records`

### 提示词版本

`GET /api/admin/prompt-versions`

`POST /api/admin/prompt-versions`

`POST /api/admin/prompt-versions/:id/activate`

每次保存生成新版本；激活会把旧生效版本归档，支持回滚。

### 提示词优化建议

`GET /api/admin/prompt-suggestions`

`POST /api/admin/prompt-suggestions/generate`

基于最近 30 天真实 `analysis_records` 生成建议，不用假数据。

`PATCH /api/admin/prompt-suggestions/:id`

```json
{ "status": "accepted" }
```

状态：`accepted`、`ignored`、`pending`。

### 请求日志

`GET /api/admin/request-logs`

### 安全事件

`GET /api/admin/security-events`

### 封禁 / 解封 IP

`POST /api/admin/ip-blocklist`

```json
{
  "ip": "1.2.3.4",
  "reason": "高频访问 AI 接口",
  "expiresAt": "2026-05-30T00:00:00.000Z"
}
```

`DELETE /api/admin/ip-blocklist/:ip`

## 角色权限

- `super_admin`：全部权限。
- `operation_admin`：用户、套餐、积分包、统计、安全事件。
- `finance_admin`：订单、收入、套餐/积分包只读。
- `content_admin`：分析记录、用户提问、提示词版本、提示词建议。


## 安全接口补充

### 限流规则

- POST /api/auth/login：单 IP 每分钟 5 次。
- POST /api/admin/login：单 IP 每分钟 5 次。
- POST /api/analysis：单用户每分钟 3 次，单 IP 每分钟 10 次。
- POST /api/orders/membership：单用户每分钟 3 次。
- POST /api/orders/points：单用户每分钟 3 次。
- 全局默认限流：单 IP 每分钟 180 次。

超过限流返回：

```json
{ "code": "RATE_LIMITED", "message": "请求过于频繁，请稍后再试。" }
```

### 安全面板

GET /api/admin/security-events

返回今日请求总数、异常请求数、被限流次数、疑似攻击 IP 数、封禁 IP 列表、高频接口排行、404 路径排行、5xx 趋势和最近安全事件。

### IP 封禁

POST /api/admin/ip-blocklist

```json
{ "ip": "1.2.3.4", "reason": "高频刷接口", "expiresAt": "2026-05-26T00:00:00.000Z" }
```

DELETE /api/admin/ip-blocklist/:ip

将 IP 状态改为 inactive。

### AI 分析保护

- 必须登录。
- 必须有有效会员次数或积分余额。
- 同一用户 5 分钟内提交完全相同内容，复用上次成功记录。
- 没有生效提示词时不扣积分。
- AI 分析扣积分和分析记录保存放在事务里。

### 支付保护

- 创建订单不直接发放权益。
- 10 分钟内同一用户同一商品只保留一个待支付订单。
- 支付成功必须以服务端回调为准。
- 回调必须验签、校验金额、幂等处理。
