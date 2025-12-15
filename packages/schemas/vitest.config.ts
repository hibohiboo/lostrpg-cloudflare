import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig, type UserConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths() as unknown as UserConfig['plugins']],
  test: {
    globals: true,
    environment: 'node',
  },
});
