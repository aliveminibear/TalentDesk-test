import path from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const projectRoot = import.meta.dirname;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(projectRoot, 'shared'),
    },
  },
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['backend/src/**', 'frontend/src/**', 'shared/**'],
      exclude: ['**/*.test.*', '**/test/**'],
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'frontend',
          environment: 'jsdom',
          setupFiles: ['./test/setup.js'],
          include: ['frontend/**/*.test.{js,jsx}'],
        },
      },
      {
        extends: true,
        test: {
          name: 'node',
          environment: 'node',
          include: ['backend/**/*.test.js', 'shared/**/*.test.js'],
        },
      },
    ],
  },
});
