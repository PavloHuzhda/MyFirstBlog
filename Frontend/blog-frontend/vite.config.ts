// vite.config.ts or vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7046', // Your backend API URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
