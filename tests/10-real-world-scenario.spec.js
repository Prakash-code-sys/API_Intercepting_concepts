import { test, expect } from '@playwright/test';

test('simulate a merchandising rule by customising a real fruit response', async ({ page }) => {
  await page.route('**/api/v1/fruits', async (route) => {
    const response = await route.fetch();
    const fruits = await response.json();

    const promotedFruit = fruits.map((fruit) => {
      if (fruit.name === 'Apple') {
        return { ...fruit, name: 'Apple (Featured)' };
      }

      return fruit;
    });

    await route.fulfill({
      status: response.status(),
      contentType: 'application/json',
      body: JSON.stringify(promotedFruit),
    });
  });

  await page.goto('https://demo.playwright.dev/api-mocking/', { waitUntil: 'networkidle' });

  await expect(page.getByText('Apple (Featured)')).toBeVisible();
  await page.waitForTimeout(3000)
});
