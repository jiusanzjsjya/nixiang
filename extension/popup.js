// ========== 故意埋的漏洞点（逆向时重点搜索这些） ==========
const API_KEY = "sk-proj-GrokSecretKey-2026-VueRE-Test-nixiang-plugin";  // 漏洞1：硬编码密钥
const ADMIN_PASSWORD = "admin@2026";                                   // 漏洞2：前端写死密码
const SECRET_SALT = 0x1A;                                              // 漏洞3：简单异或常量

// DOM 元素
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginBox = document.getElementById('login-box');
const successBox = document.getElementById('success-box');
const successMsg = document.getElementById('success-msg');
const messageEl = document.getElementById('message');
const scanBtn = document.getElementById('scan-btn');
const secretsDiv = document.getElementById('secrets');
const secretsList = document.getElementById('secrets-list');
const closePanelBtn = document.getElementById('close-panel');
const pluginPanel = document.getElementById('plugin-panel');

// 弱加密函数（漏洞3）
function weakEncrypt(str) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += String.fromCharCode(str.charAt(i).charCodeAt(0) ^ SECRET_SALT);
  }
  return result;
}

// 本地校验逻辑（漏洞4：关键判断完全在前端）
function checkLogin() {
  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    messageEl.textContent = '请输入用户名和密码';
    return;
  }

  const encryptedInput = weakEncrypt(password);
  const encryptedAdmin = weakEncrypt(ADMIN_PASSWORD);

  if (username === 'admin' && encryptedInput === encryptedAdmin) {
    loginBox.style.display = 'none';
    successBox.style.display = 'block';
    successMsg.textContent = '登录成功！欢迎管理员';
    messageEl.textContent = '登录成功！欢迎管理员';

    // 漏洞5：敏感信息直接存 localStorage
    localStorage.setItem('token', API_KEY);
    localStorage.setItem('role', 'admin');
    localStorage.setItem('loginTime', new Date().toISOString());
    localStorage.setItem('user', username);
  } else {
    messageEl.textContent = '用户名或密码错误';
  }
}

function logout() {
  loginBox.style.display = 'block';
  successBox.style.display = 'none';
  messageEl.textContent = '已退出登录';
  localStorage.clear();
  secretsDiv.style.display = 'none';
  secretsList.innerHTML = '';
}

// 教学用：扫描 localStorage
function scanLocalStorage() {
  const secrets = [];
  if (localStorage.getItem('token')) secrets.push('token: ' + localStorage.getItem('token'));
  if (localStorage.getItem('role')) secrets.push('role: ' + localStorage.getItem('role'));
  if (localStorage.getItem('user')) secrets.push('user: ' + localStorage.getItem('user'));
  if (localStorage.getItem('loginTime')) secrets.push('loginTime: ' + localStorage.getItem('loginTime'));

  secretsList.innerHTML = '';
  if (secrets.length === 0) {
    messageEl.textContent = '当前 localStorage 无敏感数据';
    secretsDiv.style.display = 'none';
  } else {
    messageEl.textContent = `发现 ${secrets.length} 项敏感数据！`;
    secrets.forEach(s => {
      const li = document.createElement('li');
      li.textContent = s;
      secretsList.appendChild(li);
    });
    secretsDiv.style.display = 'block';
  }
}

// 事件绑定
loginBtn.addEventListener('click', checkLogin);
logoutBtn.addEventListener('click', logout);
scanBtn.addEventListener('click', scanLocalStorage);
closePanelBtn.addEventListener('click', () => {
  pluginPanel.style.display = 'none';
});

// 回车登录
passwordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') checkLogin();
});

// 页面加载时检查残留数据
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('token')) {
    messageEl.textContent = '检测到本地残留 token，可能存在信息泄露风险（练习点）';
  }
});
