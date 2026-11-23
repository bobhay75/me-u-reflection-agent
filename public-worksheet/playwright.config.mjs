import { defineConfig, devices } from '@playwright/test';

const recording = process.argv.includes('--project=demo');

export default defineConfig({
  outputDir: recording ? 'test-results/demo' : 'test-results/acceptance',
  testDir: './tests/browser', workers: 1, retries: 0, timeout: 45000,
  expect: { timeout: 10000 },
  reporter: [['list'], ['json', { outputFile: recording ? 'test-results/demo-results.json' : 'test-results/browser-results.json' }]],
  use: { trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'desktop-chromium', testMatch: 'behavior.spec.mjs', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } } },
    { name: 'android-chromium', testMatch: 'behavior.spec.mjs', use: { ...devices['Pixel 7'] } },
    { name: 'iphone-webkit', testMatch: 'behavior.spec.mjs', use: { ...devices['iPhone 13'] } },
    { name: 'demo', testMatch: 'demo.spec.mjs', timeout: 240000, use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 }, video: { mode: 'on', size: { width: 1280, height: 900 } }, trace: 'off' } },
  ],
});
