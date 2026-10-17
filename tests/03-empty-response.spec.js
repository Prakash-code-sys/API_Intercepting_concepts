import { test, expect } from '@playwright/test';

test('return an empty fruit list and ensure the app handles it gracefully', async ({ page }) => {
  await page.route('**/api/v1/fruits', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });

  await page.goto('https://demo.playwright.dev/api-mocking/', { waitUntil: 'networkidle' });

  await expect(page.locator('li')).toHaveCount(0);
  await expect(page.locator('body')).not.toContainText('Strawberry');
  await expect(page.locator('body')).toContainText('Render a List of Fruits');
});
