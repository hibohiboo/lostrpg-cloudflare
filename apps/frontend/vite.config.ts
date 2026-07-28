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
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const chunks: Record<string, string[]> = {
            react: ['react', 'react-router', 'react-dom'],
            redux: ['@reduxjs/toolkit', 'react-redux'],
            icons: ['@mui/icons-material'],
            mui: ['@mui/material'],
            datatable: ['@mui/x-data-grid'],
            datefns: ['date-fns'],
            zipjs: ['@zip.js/zip.js'],
            lodash: ['lodash'],
            util: ['swr', 'file-saver'],
          };
          const match = Object.entries(chunks).find(([, packages]) =>
            packages.some((pkg) => id.includes(`/node_modules/${pkg}/`)),
          );
          return match?.[0];
        },
      },
    },
  },
});
