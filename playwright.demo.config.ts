import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './demo-tests',
  fullyParallel: true,
  retries: 2,
  reporter: [
  ['html', { open: 'never', outputFolder: 'demo-html-report' }],
  ['allure-playwright', { resultsDir: 'allure-results-demo' }],
  ],
  timeout: 60000,

  webServer: {
    command: 'node serve.js',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    navigationTimeout: 60000,
    headless: false,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
