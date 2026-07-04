import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    allowedHosts: ['*.onrender.com', 'localhost'],
    host: true
  },
  preview: {
    allowedHosts: ['*.onrender.com'],
    host: true
  },
  define: {
    'process.env': {},
    'global': 'window'
  },
  resolve: {
    alias: {
      'fs': 'empty',
      'path': 'empty',
      'os': 'empty',
      'crypto': 'empty',
      'stream': 'empty',
      'http': 'empty',
      'https': 'empty',
      'zlib': 'empty',
      'url': 'empty',
      'util': 'empty',
      'buffer': 'empty',
      'events': 'empty',
      'querystring': 'empty'
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
    esbuildOptions: {
      target: 'es2020'
    }
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    },
    target: 'es2020'
  }
});
