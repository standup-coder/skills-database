import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['app/src/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    environment: 'node',
    globals: true,
  }
});