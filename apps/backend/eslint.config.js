import backendConfig from '@age-of-hero/eslint-config-custom/backend.js';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  { ignores: ['vite.config.ts', '**/dist/**', '**/public/**'] },
  {
    extends: [
      ...backendConfig,
      {
        files: ['eslint.config.js', 'drizzle.config.ts', 'vitest.config.ts'],
        rules: {
          'import/no-extraneous-dependencies': ['off'],
        },
      },
      {
        files: ['**/tests/**'],
        rules: {
          'import/no-extraneous-dependencies': ['off'],
          '@typescript-eslint/no-explicit-any': ['off'],
          'no-await-in-loop': ['off'],
          'no-promise-executor-return': ['off'],
          'no-plusplus': ['off'],
          'no-shadow': ['off'],
          'sonarjs/no-hardcoded-passwords': ['off'],
        },
      },
    ],
  },
);
