// vite.config.ts or vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://blogsmy.azurewebsites.net/', // Your backend API URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
