import { config } from 'dotenv';
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const projectRoot = path.resolve(import.meta.dirname, '..');

config({ path: path.join(import.meta.dirname, '../.env') });
const { BACKEND_PORT, FRONTEND_PORT } = process.env;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(projectRoot, 'shared'),
    },
  },
  server: {
    host: '127.0.0.1',
    port: FRONTEND_PORT ? Number(FRONTEND_PORT) : undefined,
    strictPort: true,
    fs: {
      allow: [projectRoot],
    },
    proxy: {
      '/api': `http://127.0.0.1:${BACKEND_PORT}`,
      '/uploads': `http://127.0.0.1:${BACKEND_PORT}`,
    },
  },
});
