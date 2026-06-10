import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,          // روی localhost و 127.0.0.1 گوش می‌دهد
    port: 4500,          // پورت ثابت و کم‌استفاده تا با چیز دیگری تداخل نکند
    strictPort: true,    // اگر 4500 اشغال بود خطا بده (به‌جای رفتن بی‌صدا روی پورت دیگر)
    open: true,          // خودکار مرورگر را روی پورت درست باز می‌کند
    // پروکسی به api-gateway بک‌اند تا از مشکل CORS در توسعه جلوگیری شود.
    proxy: {
      '/api': {
        target: process.env.VITE_API_TARGET || 'http://localhost:8090',
        changeOrigin: true,
      },
    },
  },
});
