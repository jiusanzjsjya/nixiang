<script setup>
import { ref, onMounted, computed } from 'vue'

// ========== 故意埋的漏洞点（逆向时重点搜索这些） ==========
const API_KEY = "sk-proj-GrokSecretKey-2026-VueRE-Test-nixiang"   // 漏洞1：硬编码密钥
const ADMIN_PASSWORD = "admin@2026"                              // 漏洞2：前端写死密码
const SECRET_SALT = 0x1A                                         // 漏洞3：简单异或常量

const username = ref('')
const password = ref('')
const message = ref('')
const isLoggedIn = ref(false)
const showTips = ref(true)
const foundSecrets = ref([])

// 弱加密函数（漏洞3）
function weakEncrypt(str) {
  let result = ''
  for (let i = 0; i < str.length; i++) {
    result += String.fromCharCode(str.charAt(i).charCodeAt(0) ^ SECRET_SALT)
  }
  return result
}

// 本地校验逻辑（漏洞4：关键判断完全在前端）
function checkLogin() {
  if (!username.value || !password.value) {
    message.value = '请输入用户名和密码'
    return
  }

  const encryptedInput = weakEncrypt(password.value)
  const encryptedAdmin = weakEncrypt(ADMIN_PASSWORD)

  if (username.value === 'admin' && encryptedInput === encryptedAdmin) {
    isLoggedIn.value = true
    message.value = '登录成功！欢迎管理员'

    // 漏洞5：敏感信息直接存 localStorage
    localStorage.setItem('token', API_KEY)
    localStorage.setItem('role', 'admin')
    localStorage.setItem('loginTime', new Date().toISOString())
    localStorage.setItem('user', username.value)
  } else {
    message.value = '用户名或密码错误'
  }
}

function logout() {
  isLoggedIn.value = false
  localStorage.clear()
  message.value = '已退出登录'
  foundSecrets.value = []
}

// 教学用：模拟“发现”本地残留数据
function scanLocalStorage() {
  const secrets = []
  if (localStorage.getItem('token')) secrets.push('token: ' + localStorage.getItem('token'))
  if (localStorage.getItem('role')) secrets.push('role: ' + localStorage.getItem('role'))
  if (localStorage.getItem('user')) secrets.push('user: ' + localStorage.getItem('user'))
  foundSecrets.value = secrets
  if (secrets.length === 0) {
    message.value = '当前 localStorage 无敏感数据'
  } else {
    message.value = `发现 ${secrets.length} 项敏感数据！`
  }
}

onMounted(() => {
  if (localStorage.getItem('token')) {
    message.value = '检测到本地残留 token，可能存在信息泄露风险（练习点）'
  }
})
</script>

<template>
  <div class="container">
    <!-- 左侧：模拟业务页面 -->
    <div class="main-panel">
      <h1>Vue 逆向练习 Demo</h1>
      <p class="subtitle">这是一个故意有漏洞的登录页面，用于练习客户端逆向分析</p>

      <div v-if="!isLoggedIn" class="login-box">
        <input v-model="username" placeholder="用户名（试试 admin）" />
        <input v-model="password" type="password" placeholder="密码" />
        <button @click="checkLogin">登录</button>
      </div>

      <div v-else class="success-box">
        <p class="success">{{ message }}</p>
        <button @click="logout" class="secondary">退出登录</button>
      </div>

      <p class="msg">{{ message }}</p>

      <div class="actions">
        <button @click="scanLocalStorage" class="secondary">扫描 localStorage（教学功能）</button>
      </div>

      <div v-if="foundSecrets.length" class="secrets">
        <h3>发现的敏感数据：</h3>
        <ul>
          <li v-for="(s, i) in foundSecrets" :key="i">{{ s }}</li>
        </ul>
      </div>
    </div>

    <!-- 右侧：教学插件面板 -->
    <div class="plugin-panel" v-if="showTips">
      <div class="plugin-header">
        <h2>逆向教学插件</h2>
        <button class="close" @click="showTips = false">×</button>
      </div>
      <div class="plugin-body">
        <h3>练习步骤</h3>
        <ol>
          <li>执行 <code>npm run build</code> 打包</li>
          <li>打开打包后的页面，按 F12</li>
          <li>在 Sources 面板搜索：<code>API_KEY</code>、<code>0x1a</code>、<code>admin@2026</code></li>
          <li>尝试还原异或加密逻辑</li>
          <li>修改 localStorage 或前端逻辑绕过校验</li>
        </ol>

        <h3>本 Demo 埋的漏洞</h3>
        <ul>
          <li>硬编码 API Key 和密码</li>
          <li>弱异或加密（SECRET_SALT = 0x1A）</li>
          <li>关键判断完全在前端</li>
          <li>敏感数据写入 localStorage</li>
          <li>开启了 source map（生产环境风险）</li>
        </ul>

        <h3>正确密码提示</h3>
        <p>用户名：<code>admin</code><br>密码：请自己通过逆向还原 😄</p>

        <p class="tip">提示：打包后即使 minify=false，字符串和常量依然清晰可见。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #f0f2f5;
}

.main-panel {
  flex: 1;
  max-width: 480px;
  margin: 40px auto;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

h1 {
  margin: 0 0 8px;
  font-size: 24px;
  color: #1a1a1a;
}

.subtitle {
  color: #666;
  font-size: 14px;
  margin-bottom: 30px;
}

.login-box input {
  display: block;
  width: 100%;
  padding: 12px 14px;
  margin-bottom: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 12px;
  background: #1677ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background: #4096ff;
}

button.secondary {
  background: #f5f5f5;
  color: #333;
  margin-top: 12px;
}

button.secondary:hover {
  background: #e8e8e8;
}

.success {
  color: #52c41a;
  font-weight: 500;
}

.msg {
  margin-top: 20px;
  color: #666;
  min-height: 24px;
}

.secrets {
  margin-top: 20px;
  padding: 16px;
  background: #fff7e6;
  border-radius: 8px;
  border: 1px solid #ffd591;
}

.secrets h3 {
  margin: 0 0 10px;
  font-size: 15px;
  color: #d46b08;
}

.secrets ul {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  word-break: break-all;
}

/* 右侧教学插件面板 */
.plugin-panel {
  width: 340px;
  background: #1e1e2e;
  color: #cdd6f4;
  padding: 0;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 20px rgba(0,0,0,0.15);
}

.plugin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #181825;
  border-bottom: 1px solid #313244;
}

.plugin-header h2 {
  margin: 0;
  font-size: 16px;
  color: #89b4fa;
}

.close {
  background: transparent;
  color: #a6adc8;
  width: auto;
  padding: 0 8px;
  font-size: 20px;
  line-height: 1;
}

.close:hover {
  color: #f38ba8;
  background: transparent;
}

.plugin-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
  font-size: 13px;
  line-height: 1.6;
}

.plugin-body h3 {
  margin: 0 0 10px;
  font-size: 14px;
  color: #a6e3a1;
}

.plugin-body ol, .plugin-body ul {
  padding-left: 20px;
  margin: 0 0 20px;
}

.plugin-body code {
  background: #313244;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  color: #f9e2af;
}

.tip {
  margin-top: 16px;
  padding: 10px;
  background: #313244;
  border-radius: 6px;
  font-size: 12px;
  color: #a6adc8;
}

@media (max-width: 800px) {
  .container {
    flex-direction: column;
  }
  .plugin-panel {
    width: 100%;
    max-height: 400px;
  }
}
</style>
