import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["pdfjs-dist/build/pdf"],
  },
  define: {
    "process.env": {},
  },
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
