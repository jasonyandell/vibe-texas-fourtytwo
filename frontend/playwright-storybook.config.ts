import { defineConfig, devices } from '@playwright/test';

const STORYBOOK_PORT = 6006;

/**
 * Playwright configuration specifically for Storybook tests
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Only run Storybook tests */
  testMatch: '**/storybook*.spec.ts',
  
  /* Run tests in files in parallel */
  fullyParallel: false, // Run Storybook tests sequentially to avoid port conflicts
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Single worker for Storybook tests to avoid conflicts */
  workers: 1,
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'playwright-report-storybook' }],
    ['json', { outputFile: 'test-results-storybook/results.json' }],
    ['junit', { outputFile: 'test-results-storybook/results.xml' }],
  ],
  
  /* Use separate output directory for Storybook test artifacts */
  outputDir: 'test-results-storybook',
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: `http://localhost:${STORYBOOK_PORT}`,

    /* Reasonable timeouts for development */
    actionTimeout: 10000,       // 10 seconds for Storybook interactions
    navigationTimeout: 30000,   // 30 seconds for Storybook to load
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record video on failure */
    video: 'retain-on-failure',
  },

  /* Global test timeout - longer for Storybook */
  timeout: 60000,

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run Storybook dev server before starting the tests */
  webServer: {
    command: `npm run storybook`,
    port: STORYBOOK_PORT,
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
    timeout: 60000, // Give Storybook more time to start
  },
});