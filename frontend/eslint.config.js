// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

// @ts-check
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'

export default tseslint.config(// Base JavaScript config
js.configs.recommended, // TypeScript files
...tseslint.configs.recommendedTypeChecked, {
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
      ecmaFeatures: {
        jsx: true,
      },
    },
    globals: {
      ...globals.browser,
      ...globals.es2021,
      // Testing globals
      describe: 'readonly',
      it: 'readonly',
      test: 'readonly',
      expect: 'readonly',
      beforeEach: 'readonly',
      afterEach: 'readonly',
      beforeAll: 'readonly',
      afterAll: 'readonly',
      vi: 'readonly',
      jest: 'readonly',
      NodeJS: 'readonly',
      global: 'readonly',
      process: 'readonly',
    },
  },
  plugins: {
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
  },
  rules: {
    // React Hooks rules
    ...reactHooks.configs.recommended.rules,

    // React Refresh rules
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],

    // Custom overrides
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_'
    }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    'no-case-declarations': 'error',
    'no-undef': 'error',
    'storybook/no-renderer-packages': 'off',
  },
}, // Ignore patterns
{
  ignores: [
    'dist/**',
    'node_modules/**',
    'coverage/**',
    'build/**',
    'storybook-static/**',
    '*.config.js',
    '*.config.ts',
    'vite.config.d.ts',
    'playwright.config.d.ts',
    '.storybook/**',
  ],
}, ...storybook.configs["flat/recommended"], {
  files: ['**/*.stories.{ts,tsx}'],
  rules: {
    'storybook/no-renderer-packages': 'off',
  },
});
