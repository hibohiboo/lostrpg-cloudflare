import featureSliced from '@conarti/eslint-plugin-feature-sliced';
import { defineConfig } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import customConfig from './defaults.js';

export default defineConfig([
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['dist', 'public'],
    extends: [
      featureSliced({ sortImports: false }),
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      ...customConfig,
    ],
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-alert': 'off',
      'no-console': 'off',
      // Redux Toolkit uses immer internally to allow "mutating" state
      'no-param-reassign': [
        'error',
        { props: true, ignorePropertyModificationsFor: ['state'] },
      ],
      // Allow TO DO comments for future implementation
      'sonarjs/todo-tag': 'warn',
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
        myCustomGlobal: 'readonly',
      },
    },
  },
]);
