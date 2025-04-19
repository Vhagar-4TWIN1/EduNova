import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ["pdfjs-dist/build/pdf.worker.entry"],
  },
  plugins: [react()],
});
