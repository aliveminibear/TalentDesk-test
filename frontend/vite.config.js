import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });
const { BACKEND_PORT, FRONTEND_PORT } = process.env;

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: FRONTEND_PORT ? Number(FRONTEND_PORT) : undefined,
    strictPort: true,
    proxy: {
      '/api': `http://127.0.0.1:${BACKEND_PORT}`,
      '/uploads': `http://127.0.0.1:${BACKEND_PORT}`,
    },
  },
});
