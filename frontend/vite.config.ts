
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Match frontend port mentioned in docs
    proxy: {
      // Proxy API requests to the backend server
      '/api': {
        target: 'http://localhost:3001', // Backend server address
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
