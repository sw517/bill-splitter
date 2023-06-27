import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vuetify({ styles: { configFile: './src/assets/styles/vuetify.scss' } })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    setupFiles: './src/plugins/vuetify.ts',
    deps: {
      inline: ['vuetify'],
    },
    environment: 'jsdom',
    globals: true,
  },
});
