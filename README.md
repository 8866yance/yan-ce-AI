# 玄核 Bazi AI

AI 八字命理分析网站 MVP 静态原型。当前版本用于展示产品流程和专业细盘 UI，排盘数据仍为前端模拟。

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

- 接入真实八字排盘算法
- 导入完整中国省市区县乡镇数据和经纬度
- 接入 AI 报告生成 API
- 增加用户登录、历史报告和付费解锁
