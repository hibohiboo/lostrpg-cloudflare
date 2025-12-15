import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig, type Plugin } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths() as unknown as Plugin],
  test: {
    globals: true,
    environment: 'node',
  },
});
