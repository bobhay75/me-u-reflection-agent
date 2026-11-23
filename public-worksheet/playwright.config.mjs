import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  outputDir: 'test-results/acceptance',
  testDir: './tests/browser', workers: 1, retries: 0, timeout: 45000,
  expect: { timeout: 10000 },
  reporter: [['list'], ['json', { outputFile: 'test-results/browser-results.json' }]],
  use: { trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'desktop-chromium', testMatch: 'behavior.spec.mjs', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } } },
    { name: 'android-chromium', testMatch: 'behavior.spec.mjs', use: { ...devices['Pixel 7'] } },
    { name: 'iphone-webkit', testMatch: 'behavior.spec.mjs', use: { ...devices['iPhone 13'] } },
  ],
});
