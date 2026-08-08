import { defineConfig, devices } from '@playwright/test';

const STUDENT_ID = '23127244';
const REPORT_TITLE = `Run by: ${STUDENT_ID} | ${new Date().toISOString()}`;

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Every feature's cases share one live, mutable backend/DB row (e.g. one
   * seeded user account) rather than isolated fixtures per case. Parallel
   * workers hitting the same row can interleave writes/reads across tests,
   * so we run fully serial to keep each case's assertions reading only its
   * own write. Suite is small enough that this costs negligible wall-clock. */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  /* Both reporters live here (not passed via --reporter on the CLI) because
   * the CLI flag replaces this array wholesale and falls back to each named
   * reporter's default options, silently dropping the html title below. */
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never', title: REPORT_TITLE }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'http://localhost:5173',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

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

  /* Auto-start the SUT (backend API + frontend web) before running tests */
  webServer: [
    {
      command: 'node server.js',
      cwd: '../eshop-sut/backend',
      url: 'http://localhost:3000/api/products',
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: 'npm run dev',
      cwd: '../eshop-sut/frontend-web',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: 'npm run dev',
      cwd: '../eshop-sut/frontend-admin',
      url: 'http://localhost:5174',
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
  ],
});
