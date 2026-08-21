# nixiang - Vue 逆向工程练习项目（含浏览器插件版）

这是一个**故意埋了多个客户端漏洞**的练习项目，专门用于学习如何逆向分析前端应用（Vue / 纯 JS）。

现在提供两种使用方式：

1. **普通 Web 项目**（Vite + Vue）
2. **浏览器扩展插件**（Chrome / Edge / 国内基于 Chromium 的浏览器，Manifest V3）← **推荐直接使用**

---

## 方式一：浏览器插件（最方便）

### 安装步骤（加载未打包扩展）

1. 克隆或下载本仓库
2. 打开浏览器，进入扩展管理页面：
   - Chrome：`chrome://extensions/`
   - Edge：`edge://extensions/`
3. 打开右上角「开发者模式」
4. 点击「加载已解压的扩展程序」
5. 选择本仓库中的 **`extension`** 文件夹
6. 点击浏览器工具栏的插件图标即可打开练习弹窗

### 插件功能

- 左侧：故意有漏洞的登录 Demo（硬编码密钥、弱加密、前端校验、localStorage 泄露）
- 右侧：逆向教学面板（实时提示练习步骤和漏洞点）
- 支持扫描 localStorage 查看敏感数据残留

### 练习方法

1. 打开插件弹窗
2. 按 `F12` 打开开发者工具
3. 在 Sources 面板搜索：`API_KEY`、`0x1a`、`admin@2026`、`SECRET_SALT`
4. 尝试还原加密逻辑并找到正确密码
5. 修改 localStorage 或前端代码绕过校验

---

## 方式二：普通 Web 项目（Vite）

```bash
git clone https://github.com/jiusanzjsjya/nixiang.git
cd nixiang
npm install
npm run dev          # 开发模式
npm run build        # 打包（真正做逆向时用这个）
npm run preview      # 预览打包结果
```

打包后重点分析 `dist/assets/` 下的 JS 文件。

---

## 故意埋入的漏洞清单

| 漏洞类型 | 说明 |
|---------|------|
| 硬编码密钥 | API_KEY 直接写在代码里 |
| 前端写死密码 | 管理员密码明文存在前端 |
| 弱异或加密 | SECRET_SALT = 0x1A，可轻易还原 |
| 前端校验 | 登录判断完全在客户端 |
| localStorage 泄露 | token / role / user 直接存储 |

---

## 免责声明

本项目**仅供个人学习和安全研究**使用。  
请勿用于攻击任何真实系统。所有代码和漏洞均为教学目的故意设计。

---

Created for reverse engineering practice with Grok.  
仓库地址：https://github.com/jiusanzjsjya/nixiang
