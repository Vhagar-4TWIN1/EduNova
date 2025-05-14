// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import tsconfigPaths from 'vite-tsconfig-paths';

// --- these two lines give you the equivalent of __dirname in ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@':         path.resolve(__dirname, 'src'),
      '@calendar': path.resolve(__dirname, 'src/components/calendar'),
      '@lib':      path.resolve(__dirname, 'src/lib'),
    }
  },
  server: {
    host: 'localhost',
    port: 3000, // Change to your preferred port
    open: true,
    proxy: {
      '/api': {
        target: 'https://edunova-back-rqxc.onrender.com',
        changeOrigin: true,
        secure: false, // If you encounter SSL issues
        rewrite: (path) => path.replace(/^\/api/, '') // Optional: If your backend doesn't use '/api' prefix
      },
      '/ws': {
        target: 'wss://edunova-back-rqxc.onrender.com',
        ws: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        },
      },
    },
  }
});
