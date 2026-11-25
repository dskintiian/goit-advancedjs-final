import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  base: '/goit-advancedjs-final/',
  plugins: [injectHTML(), FullReload(['./src/**/*.html'])],
  build: {
    sourcemap: true,
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./src/index.html', import.meta.url)),
        favorites: fileURLToPath(
          new URL('./src/favorites.html', import.meta.url)
        ),
      },
    },
  },
});
