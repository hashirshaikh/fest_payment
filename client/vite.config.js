import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // All /api calls go to Express backend
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // Logo and images served by Express static
      '/images': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // Download receipt still goes to Express
      '/download': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // Razorpay webhook stays on Express
      '/razorpay-webhook': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
