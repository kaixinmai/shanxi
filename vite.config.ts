import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Gitee Pages 子路径：build 时传 --base=/shanxi-project/
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: true,
  },
})
