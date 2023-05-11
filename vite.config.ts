import { resolve } from 'path';
import { defineConfig } from 'vite';

// @ts-ignore
/** @type {import('vite').UserConfig} */
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    minify: true,
    sourcemap: false,
    lib: {
      entry: {
        'index': resolve(__dirname, './src/index.ts'),
        'style': resolve(__dirname, './src/style.ts')
      }
    },
  },
  server: {
    port: 6002,
    host: true
  },
});
