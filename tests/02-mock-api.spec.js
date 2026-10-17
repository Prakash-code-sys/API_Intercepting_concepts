import { test, expect } from '@playwright/test';

test('mock the fruit API and verify the custom fruit is rendered', async ({ page }) => {
  await page.route('**/api/v1/fruits', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 999, name: 'Dragonfruit' },
        { id: 1000, name: 'Papaya' },
      ]),
    });
  });

  await page.goto('https://demo.playwright.dev/api-mocking/');

  await expect(page.locator('li')).toHaveCount(2);
  await expect(page.getByText('Dragonfruit')).toBeVisible();
  await expect(page.getByText('Papaya')).toBeVisible();
});
