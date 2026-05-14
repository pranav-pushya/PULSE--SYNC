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
        discover: resolve(__dirname, 'discover.html'),
        games: resolve(__dirname, 'games.html'),
        feedback: resolve(__dirname, 'feedback.html'),
      },
    },
  },
  server: {
    open: '/',
  },
});
