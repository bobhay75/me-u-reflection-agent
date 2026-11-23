import { defineConfig, devices } from '@playwright/test';
import acceptance from './playwright.config.mjs';

// Workers reload their config without the launcher's CLI arguments. An explicit
// config keeps fresh demo footage separate from acceptance evidence in both.
export default defineConfig({
  ...acceptance,
  outputDir: 'test-results/demo',
  reporter: [['list'], ['json', { outputFile: 'test-results/demo-results.json' }]],
  projects: [{
    name: 'demo', testMatch: 'demo.spec.mjs', timeout: 240000,
    use: {
      ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 },
      video: { mode: 'on', size: { width: 1280, height: 900 } }, trace: 'off',
    },
  }],
});
