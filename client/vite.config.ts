import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Load environment variables
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:5000';
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: API_BASE_URL,
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});