var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { defineConfig, devices } from '@playwright/test';
var FRONTEND_PORT = process.env.FRONTEND_PORT || '3000';
var BACKEND_PORT = process.env.BACKEND_PORT || '4201';
/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    testDir: './tests/e2e',
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [
        ['html'],
        ['json', { outputFile: 'test-results/results.json' }],
        ['junit', { outputFile: 'test-results/results.xml' }],
    ],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: "http://localhost:".concat(FRONTEND_PORT),
        /* Aggressive timeouts for fast development - this game should be FAST */
        actionTimeout: 1000, // 1 second max for clicks, fills, etc.
        navigationTimeout: 5000, // 5 seconds max for page loads (temporary - needs optimization)
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
        /* Take screenshot on failure */
        screenshot: 'only-on-failure',
        /* Record video on failure */
        video: 'retain-on-failure',
    },
    /* Global test timeout - if a test takes >3s, something is wrong */
    timeout: 3000,
    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: __assign({}, devices['Desktop Chrome']),
        },
        {
            name: 'firefox',
            use: __assign({}, devices['Desktop Firefox']),
        },
        {
            name: 'webkit',
            use: __assign({}, devices['Desktop Safari']),
        },
        /* Test against mobile viewports. */
        {
            name: 'Mobile Chrome',
            use: __assign({}, devices['Pixel 5']),
        },
        {
            name: 'Mobile Safari',
            use: __assign({}, devices['iPhone 12']),
        },
        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
        // },
    ],
    /* Run your local dev server before starting the tests */
    webServer: {
        command: "npm run dev -- --port ".concat(FRONTEND_PORT),
        port: parseInt(FRONTEND_PORT),
        reuseExistingServer: !process.env.CI,
        stdout: 'ignore',
        stderr: 'pipe',
    },
});
