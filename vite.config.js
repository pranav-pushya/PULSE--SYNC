import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        weather: resolve(__dirname, 'weather.html'),
        finance: resolve(__dirname, 'finance.html'),
        science: resolve(__dirname, 'science.html'),
      },
    },
  },
  server: {
    open: '/',
  },
});
