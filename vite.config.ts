import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  root: 'src/playground',
  resolve: {
    alias: {
      '@components': resolve(__dirname, 'src/components'),
    },
  },
});
