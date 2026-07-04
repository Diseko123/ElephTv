import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    allowedHosts: [
      'elephTV-front-end.onrender.com',
      '*.onrender.com',
      'localhost'
    ],
    host: true
  },
  preview: {
    allowedHosts: [
      'elephTV-front-end.onrender.com',
      '*.onrender.com'
    ],
    host: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react']
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  }
});
