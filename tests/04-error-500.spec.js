import { test, expect } from '@playwright/test';

test('handle an HTTP 500 error from the fruit API without assuming a specific message', async ({ page }) => {
  await page.route('**/api/v1/fruits', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal Server Error' }),
    });
  });

  const responsePromise = page.waitForResponse((response) => response.url().includes('/api/v1/fruits'));

  await page.goto('https://demo.playwright.dev/api-mocking/', { waitUntil: 'networkidle' });

  const response = await responsePromise;
  expect(response.status()).toBe(500);

  await expect(page.locator('li')).toHaveCount(0);
  await expect(page.locator('body')).not.toContainText('Strawberry');
});
