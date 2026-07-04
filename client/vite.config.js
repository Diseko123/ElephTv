import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  define: {
    'process.env': {},
    'global': 'window'
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
    exclude: ['esbuild']  // ⬅️ IMPORTANT!
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      exclude: [/esbuild/]  // ⬅️ IMPORTANT!
    },
    rollupOptions: {
      external: ['esbuild'],  // ⬅️ IMPORTANT!
      output: {
        manualChunks: undefined
      }
    }
  }
});
