# 玄核 Bazi AI

AI 八字命理分析网站 MVP。当前前端已接入 `lunar-javascript` 做基础排盘；`backend/` 目录提供商业化后端骨架，覆盖用户、会员、积分、支付订单、分析记录、提示词版本、后台统计和安全监控。

## 本地预览

```bash
python -m http.server 4173 --bind 127.0.0.1
```

打开：

```text
http://127.0.0.1:4173/
```

## Vercel 部署

这个项目是纯静态 HTML/CSS/JS，不需要构建步骤。把仓库导入 Vercel 后：

- Framework Preset: `Other`
- Build Command: 留空
- Output Directory: 留空或 `./`
- Install Command: 留空

Vercel 会直接发布根目录下的 `index.html`。

## 下一步

- 前端接入 `backend/` API，替换本地静态交互。
- 接入微信/支付宝真实支付预下单和回调。
- 接入真实 AI 服务，使用后台当前生效提示词版本。
- 生产环境切换 MySQL + Redis + WAF/Cloudflare 日志。

## 后端

```bash
cd backend
copy .env.example .env
npm install
npm run prisma:generate
npm run db:push
npm run db:seed
npm run dev
```

后端文档：

- `backend/README.md`
- `backend/docs/API.md`
- `backend/docs/DATABASE.md`
- `backend/docs/ARCHITECTURE.md`
