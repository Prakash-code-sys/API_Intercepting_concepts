import { test, expect } from '@playwright/test';

test('fetch the real response, modify it, and fulfill the custom fruit list', async ({ page }) => {
  await page.route('**/api/v1/fruits', async (route) => {
    const response = await route.fetch();
    const fruits = await response.json();

    const modified = fruits.map((fruit, index) => ({
      ...fruit,
      name: index === 0 ? `${fruit.name} (modified)` : fruit.name,
    }));

    await route.fulfill({
      status: response.status(),
      contentType: 'application/json',
      body: JSON.stringify(modified),
    });
  });

  await page.goto('https://demo.playwright.dev/api-mocking/', { waitUntil: 'networkidle' });

  await expect(page.getByText('Strawberry (modified)')).toBeVisible();
});
