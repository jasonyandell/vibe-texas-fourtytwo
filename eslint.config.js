// @ts-check
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import { backendConfig } from './eslint-config/backend.js'
import { frontendConfig } from './eslint-config/frontend.js'

export default tseslint.config(
  // Base JavaScript config
  js.configs.recommended,

  // Backend and Frontend configs
  ...backendConfig,
  ...frontendConfig,

  // Ignore patterns
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/coverage/**',
      '**/build/**',
      '**/*.config.js',
      '**/*.config.ts',
      '**/vite.config.d.ts',
      '**/playwright.config.d.ts',
      'scripts/**',
    ],
  },
)
