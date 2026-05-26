# 阿里云 ECS 部署说明

本文档用于把当前项目部署到阿里云 ECS。当前项目已经具备前端静态页、Express 后端、Prisma 数据模型、会员/积分/订单/后台/安全日志基础接口，但仍有生产化缺口，见“上线前必须确认”。

## 1. 当前项目结构

- 前端静态目录：项目根目录
- 后端目录：`backend/`
- 本地前端端口：`4173`
- 本地后端端口：`4300`
- 生产建议：Nginx 对外暴露 80/443，后端只监听 `127.0.0.1:4300`

## 2. 本地运行命令

前端：

```bash
npm run dev
```

等价命令：

```bash
python -m http.server 4173 --bind 127.0.0.1
```

后端：

```bash
cd backend
npm install
npm run db:push
npm run db:seed
npm run dev
```

健康检查：

```bash
curl http://127.0.0.1:4300/health
curl http://127.0.0.1:4300/api/membership-plans
curl http://127.0.0.1:4300/api/point-packages
```

## 3. 前端构建和发布

当前前端是静态 HTML/CSS/JS，没有打包构建步骤。

部署时把这些文件复制到服务器前端目录，例如：

```bash
sudo mkdir -p /var/www/yan-ce-ai/frontend
sudo rsync -av --exclude backend --exclude node_modules --exclude .git ./ /var/www/yan-ce-ai/frontend/
```

如果后续改成 Vite/React，再把前端构建命令改为 `npm run build`，并让 Nginx 指向 `dist/`。

## 4. 后端生产启动

生产建议使用 PM2：

```bash
cd /var/www/yan-ce-ai/backend
npm ci
npm run prisma:generate
npm run db:push
npm run db:seed
pm2 start /var/www/yan-ce-ai/ecosystem.config.js --env production
pm2 save
pm2 startup
```

注意：当前 Prisma schema 使用 SQLite，`db:push` 会推到 SQLite 开发库。生产使用 MySQL 前，必须先切换 Prisma datasource provider 为 `mysql`，重新生成 Prisma Client，并用生产数据库执行迁移。

## 5. MySQL 安装与配置

阿里云 ECS 生产建议 MySQL 只监听内网或本机，不要开放公网 3306。

Ubuntu/Debian 示例：

```bash
sudo apt update
sudo apt install -y mysql-server
sudo systemctl enable --now mysql
sudo mysql_secure_installation
```

创建数据库和用户：

```sql
CREATE DATABASE yan_ce_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'yan_ce_ai'@'127.0.0.1' IDENTIFIED BY 'CHANGE_ME_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON yan_ce_ai.* TO 'yan_ce_ai'@'127.0.0.1';
FLUSH PRIVILEGES;
```

生产 `.env` 示例：

```env
DATABASE_URL="mysql://yan_ce_ai:CHANGE_ME_STRONG_PASSWORD@127.0.0.1:3306/yan_ce_ai"
```

安全组要求：

- 不开放公网 3306
- 如需远程管理，使用 SSH 隧道或阿里云内网

## 6. Redis 安装与配置

Redis 用于生产级分布式限流、缓存、在线状态等。当前代码还没有真正接入 Redis，仍是内存限流；上线前需要补 Redis 限流实现。

Ubuntu/Debian 示例：

```bash
sudo apt install -y redis-server
sudo systemctl enable --now redis-server
```

建议配置：

```conf
bind 127.0.0.1
protected-mode yes
requirepass CHANGE_ME_REDIS_PASSWORD
```

生产 `.env` 示例：

```env
REDIS_URL="redis://:CHANGE_ME_REDIS_PASSWORD@127.0.0.1:6379/0"
```

安全组要求：

- 不开放公网 6379

## 7. Nginx 配置

模板文件：

```text
nginx/yan-ce-ai.conf
```

部署：

```bash
sudo cp nginx/yan-ce-ai.conf /etc/nginx/conf.d/yan-ce-ai.conf
sudo nginx -t
sudo systemctl reload nginx
```

正式上线建议使用 HTTPS，可用阿里云免费证书或 Let's Encrypt。

## 8. 环境变量

开发示例：

```text
backend/.env.example
```

生产示例：

```text
backend/.env.production.example
```

生产环境必须：

- 设置强随机 `JWT_SECRET`
- 设置真实 `PAYMENT_WEBHOOK_SECRET`
- 设置真实支付回调地址和验签规则
- 设置真实 `AI_API_KEY`
- `MOCK_MODE=false`
- `CORS_ORIGIN` 只允许正式域名

`.env`、`.env.production` 不允许提交 GitHub。

## 9. 初始化数据

默认初始化方式：

```bash
cd backend
npm run db:seed
```

Seed 会初始化：

- 默认会员套餐
- 默认积分包
- 默认管理员账号
- 默认提示词版本
- 本地测试用户和测试积分

生产环境建议：

- 修改 `ADMIN_DEFAULT_EMAIL`
- 修改 `ADMIN_DEFAULT_PASSWORD`
- 首次登录后立即改密码
- 不要保留测试用户和测试积分

## 10. 上线前必须确认

当前已完成：

- 前端静态页面可运行
- 后端 Express 可运行
- 会员套餐接口
- 积分包接口
- 订单系统基础表和接口
- 支付回调验签、金额校验、幂等基础逻辑
- 积分流水表
- 管理员登录和基础后台接口
- 请求日志、安全事件、IP 黑名单基础表和接口
- Helmet、CORS、JSON body 限制
- PM2 模板
- Nginx 模板
- SECURITY.md

仍需完成后再商业化上线：

- Prisma 生产数据源从 SQLite 切换到 MySQL
- 生成 MySQL 迁移并在 ECS 上验证
- Redis 分布式限流接入，替换当前内存限流
- 真实微信/支付宝支付预下单和回调验签接入
- 真实 AI 服务接入；当前 `/api/analysis` 仍是占位返回
- MOCK_MODE 在代码层面的强制开关
- 后台前端与后端权限细节联调
- 日志轮转、备份、监控告警

## 11. GitHub 上传步骤

```bash
git init
git add .
git status
git commit -m "prepare yan ce ai deployment"
git branch -M main
git remote add origin https://github.com/<your-org>/<your-repo>.git
git push -u origin main
```

上传前必须确认：

```bash
git status --ignored
```

确认以下内容没有被提交：

- `.env`
- `.env.production`
- `node_modules/`
- `backend/node_modules/`
- `backend/prisma/dev.db`
- 日志文件

## 12. 部署后测试

```bash
curl https://your-domain.com/
curl https://your-domain.com/health
curl https://your-domain.com/api/membership-plans
curl https://your-domain.com/api/point-packages
```

后台测试：

1. 打开 `https://your-domain.com/admin.html`
2. 使用生产管理员账号登录
3. 查看会员套餐、积分包、订单、用户、分析记录、安全面板
4. 测试错误登录是否限流
5. 测试 Nginx 不允许访问 `.env`、`.git`

## 13. 端口和安全组

ECS 安全组只建议开放：

- 22：SSH，限制可信 IP
- 80：HTTP
- 443：HTTPS

不要开放：

- 4300 后端端口
- 3306 MySQL
- 6379 Redis

后端、MySQL、Redis 都应只通过本机或内网访问。
