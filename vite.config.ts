import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  base: './', // 相对路径：无论部署在何处都能正确加载资源
  server: {
    port: 3000,
    host: true,
  },
})
