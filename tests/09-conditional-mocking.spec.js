import { test, expect } from '@playwright/test';

test('conditionally mock different responses based on the request URL query string', async ({ page }) => {
  await page.route('**/api/v1/fruits**', async (route) => {
    const url = new URL(route.request().url());
    const type = url.searchParams.get('type');

    if (type === 'featured') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 999, name: 'Dragonfruit' }]),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ id: 1, name: 'Standard Fruit' }]),
    });
  });

  await page.goto('https://demo.playwright.dev/api-mocking/', { waitUntil: 'networkidle' });

  const featuredData = await page.evaluate(() =>
    fetch('https://demo.playwright.dev/api-mocking/api/v1/fruits?type=featured').then((response) => response.json())
  );

  const standardData = await page.evaluate(() =>
    fetch('https://demo.playwright.dev/api-mocking/api/v1/fruits').then((response) => response.json())
  );

  expect(featuredData).toEqual([{ id: 999, name: 'Dragonfruit' }]);
  expect(standardData).toEqual([{ id: 1, name: 'Standard Fruit' }]);
});
