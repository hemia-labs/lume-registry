import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  root: 'src/playground',
  resolve: {
    alias: {
      '@components': resolve(__dirname, 'src/components'),
    },
  },
});
