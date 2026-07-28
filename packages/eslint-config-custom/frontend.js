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
      featureSliced({
        sortImports: false,
        // '@x' cross-import files only re-export from their own slice; skip
        // public-api validation for their internal relative imports.
        publicApi: { ignoreFiles: ['**/@x/**'] },
      }),
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      ...customConfig,
    ],
    settings: {
      // Segment folder names beyond the plugin's defaults (ui/model/lib/api/config/assets)
      // that this project uses, so slice detection doesn't fall back to the wrong folder.
      '@conarti/feature-sliced': {
        segments: ['actions', 'hooks', 'utils'],
      },
    },
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
