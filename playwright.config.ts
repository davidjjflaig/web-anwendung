import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e/',
  testMatch: '**/*.e2e.spec.ts',
  use: {
    baseURL: process.env.PW_BASE_URL ?? 'https://swe.flaig.io',
    browserName: 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
});
