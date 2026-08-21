# nixiang - Vue 逆向工程练习项目

这是一个**故意埋了多个客户端漏洞**的 Vue 3 示例项目，专门用于学习如何逆向分析打包后的前端应用。

## 项目目标

- 练习用浏览器开发者工具分析生产环境 JS
- 发现硬编码密钥、弱加密、前端校验绕过、localStorage 泄露等问题
- 理解 Vue 打包后代码的样子
- 学习如何从逆向视角加固自己的应用

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/jiusanzjsjya/nixiang.git
cd nixiang

# 安装依赖
npm install

# 开发模式（可直接看到源码）
npm run dev

# 打包成生产环境（真正做逆向时用这个）
npm run build

# 预览打包结果
npm run preview
```

打包后打开 `dist/index.html` 或使用 `npx serve dist`，然后按 F12 开始逆向。

## 故意埋入的漏洞（练习目标）

1. **硬编码 API Key** 和管理员密码
2. **弱异或加密**（可轻易还原）
3. **关键登录逻辑完全在前端**
4. **敏感信息直接写入 localStorage**
5. **页面加载时残留数据提示**（方便观察）

## 推荐练习步骤

1. 先 `npm run build` 生成生产包
2. 打开打包后的页面，F12 → Sources 面板
3. 搜索关键词：`API_KEY`、`admin@2026`、`0x1a`、`localStorage`、`sk-proj`
4. 尝试还原加密逻辑和正确密码
5. 思考如何绕过前端校验
6. 修改 localStorage 观察效果

## 免责声明

本项目仅供个人学习和安全研究使用。请勿用于攻击任何真实系统。所有代码和漏洞均为教学目的故意设计。

---

Created for reverse engineering practice with Grok.
