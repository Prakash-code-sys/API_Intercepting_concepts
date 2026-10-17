import { test, expect } from '@playwright/test';
import http from 'node:http';

test('modify a request header before continuing the network call', async ({ page }) => {
  let observedHeaderValue = null;

  const server = http.createServer((request, response) => {
    if (request.url === '/api/headers-check') {
      observedHeaderValue = request.headers['x-test'];
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ xTest: request.headers['x-test'] || null }));
      return;
    }

    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(`<!doctype html><script>fetch('/api/headers-check');</script>`);
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();

  try {
    await page.route('**/api/headers-check', async (route) => {
      const headers = {
        ...route.request().headers(),
        'x-test': 'automation',
      };

      await route.continue({ headers });
    });

    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });

    await expect.poll(() => observedHeaderValue).toBe('automation');
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
});
