import { test, expect } from '@playwright/test';

test('abort the fruit API request and verify the app shows its failed-loading state', async ({ page }) => {
  await page.route('**/api/v1/fruits', async (route) => {
    await route.abort();
  });

  await page.goto('https://demo.playwright.dev/api-mocking/', { waitUntil: 'networkidle' });

  await expect(page.locator('body')).toContainText('Loading...');
  await expect(page.locator('li')).toHaveCount(0);
  await page.waitForTimeout(3000)
});
