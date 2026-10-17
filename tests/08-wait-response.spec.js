import { test, expect } from '@playwright/test';

test('wait for the fruit API response before asserting its status and URL', async ({ page }) => {
  const responsePromise = page.waitForResponse((response) => response.url().includes('/api/v1/fruits'));

  await page.goto('https://demo.playwright.dev/api-mocking/', { waitUntil: 'domcontentloaded' });
  await page.reload();

  const response = await responsePromise;
  expect(response.status()).toBe(200);
  expect(response.url()).toContain('/api/v1/fruits');
});
