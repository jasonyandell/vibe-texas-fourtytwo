// @ts-check
import tseslint from 'typescript-eslint'
import globals from 'globals'
import { testingGlobals, commonRules, commonParserOptions } from './shared.js'

export const backendConfig = [
  // Backend TypeScript files
  ...tseslint.configs.recommendedTypeChecked.map(config => ({
    ...config,
    files: ['backend/**/*.{ts,js}'],
  })),
  {
    files: ['backend/**/*.{ts,js}'],
    languageOptions: {
      ...commonParserOptions,
      globals: {
        ...globals.node,
        ...globals.es2021,
        ...testingGlobals,
      },
    },
    rules: commonRules,
  },
]