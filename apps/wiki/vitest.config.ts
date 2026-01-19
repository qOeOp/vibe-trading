/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  plugins: [react(), nxViteTsPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.spec.tsx', '**/*.spec.ts'],
    exclude: ['e2e/**/*', 'node_modules/**/*'],
  },
});
