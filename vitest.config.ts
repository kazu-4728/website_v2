import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.tsx',
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      'tests/lib/images.test.ts',
      'tests/integration/build-validation.test.ts'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app'),
      '@/app': path.resolve(__dirname, './app'),
    },
  },
});
