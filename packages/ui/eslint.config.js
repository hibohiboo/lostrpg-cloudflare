import customConfig from '@age-of-hero/eslint-config-custom/defaults.js';
import { defineConfig } from 'eslint/config';
import storybook from 'eslint-plugin-storybook';


export default defineConfig(
  {
    extends: [
      ...customConfig,
      {
        files: ['**/**'],
        rules: {
          'no-underscore-dangle': ['off'],
          'no-restricted-exports': ['off'],
          'import/no-extraneous-dependencies': ['off'],
          'no-alert': ['off'],
          'no-console': ['off'],
        },
      },
      {
        files: ['src/**/*.stories.tsx'],
        rules: {
          'no-shadow': ['off'],
        },
      },
    ],
  },
  storybook.configs['flat/recommended'],
);
