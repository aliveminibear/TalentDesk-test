import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

config({ path: path.join(__dirname, '../.env') });
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
