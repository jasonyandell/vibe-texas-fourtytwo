// @ts-check
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import { testingGlobals, commonRules, commonParserOptions } from './shared.js'

export const frontendConfig = [
  // Frontend TypeScript/React files
  ...tseslint.configs.recommendedTypeChecked.map(config => ({
    ...config,
    files: ['frontend/**/*.{ts,tsx}'],
  })),
  {
    files: ['frontend/**/*.{ts,tsx}'],
    languageOptions: {
      ...commonParserOptions,
      parserOptions: {
        ...commonParserOptions.parserOptions,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...testingGlobals,
        jest: 'readonly',
        NodeJS: 'readonly',
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

      // Common rules
      ...commonRules,
    },
  },
]