import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './_tests_/e2e',
  timeout: 30 * 1000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 0,
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
})
