// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import tsconfigPaths from 'vite-tsconfig-paths';


const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@calendar': path.resolve(__dirname, 'src/components/calendar'),
      '@lib': path.resolve(__dirname, 'src/lib'),
    }
  },
  server: {
    historyApiFallback: true, // ✅ Ensure SPA fallback (important)
    proxy: {
      '/api': {
        target: 'https://edunova-back-rqxc.onrender.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api') 
      },
      '/ws': {
        target: 'wss://edunova-back-rqxc.onrender.com', 
        ws: true,
        secure: true,
        changeOrigin: true
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
