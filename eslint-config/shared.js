// @ts-check
export const testingGlobals = {
  describe: 'readonly',
  it: 'readonly',
  test: 'readonly',
  expect: 'readonly',
  beforeEach: 'readonly',
  afterEach: 'readonly',
  beforeAll: 'readonly',
  afterAll: 'readonly',
  vi: 'readonly',
}

export const commonRules = {
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
}

export const commonParserOptions = {
  ecmaVersion: 'latest',
  sourceType: 'module',
  parserOptions: {
    projectService: true,
    tsconfigRootDir: import.meta.dirname + '/..',
  },
}