import path from 'path';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@lostrpg/frontend': path.join(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-router', 'react-dom/client'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          icons: ['@mui/icons-material'],
          mui: ['@mui/material'],
          datatable: ['@mui/x-data-grid'],
          util: ['swr'],
          vendors: ['hono'],
        },
      },
    },
  },
});
