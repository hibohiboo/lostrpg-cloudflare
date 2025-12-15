import customConfig from '@lostrpg/eslint-config-custom/frontend.js';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'vite.config.ts']),
  {
    extends: [
      ...customConfig,
      {
        files: [
          '**/tests/**',
          '**/*.test.tsx',
          '**/*.test.ts',
          'vitest.config.ts',
        ],
        rules: {
          'import/extensions': ['off'],
          'import/no-extraneous-dependencies': ['off'],
          'import/no-unresolved': ['off'],
          'sonarjs/slow-regex': ['off'],
          'lintsonarjs/no-empty-test-file': ['off'],
          'no-restricted-syntax': ['off'],
          'no-await-in-loop': ['off'],
          '@typescript-eslint/no-explicit-any': ['off'],
        },
      },
      {
        files: ['src/shared/lib/auth/**'],
        rules: {
          '@conarti/feature-sliced/layers-slices': ['off'],
        },
      },
      {
        files: ['**/src/**/**Slice.ts'],
        rules: {
          'no-param-reassign': ['off'],
        },
      },
    ],
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        typescript: {
          project: './tsconfig.app.json',
        },
      },
    },
  },
]);
