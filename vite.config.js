import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    // 方便练习：关闭压缩可更清晰看到代码结构（真实项目请开启）
    minify: false,
    sourcemap: true   // 故意开启 source map，方便观察泄露风险
  }
})
