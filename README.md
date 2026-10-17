# API Interception Concepts with Playwright

This project demonstrates how to observe, intercept, mock, and modify network traffic in a browser with Playwright. The examples use the official Playwright API mocking demo at https://demo.playwright.dev/api-mocking/.

## What is API interception?

API interception is the practice of observing requests and responses, or replacing them with controlled test data, before they reach the application or the server. In browser automation, this is useful for:

- validating outgoing requests
- reproducing backend failures
- testing empty-state and error-state UI flows
- simulating unusual traffic patterns without changing a real server
- verifying request and response contracts in automated tests

## Test files overview

1. `01-monitor-api.spec.js` — monitors the outgoing request and incoming response events for the fruit API.
2. `02-mock-api.spec.js` — overrides the fruit API with custom data and verifies that the mocked fruit is shown in the UI.
3. `03-empty-response.spec.js` — returns an empty array and confirms the app renders no fruit list items.
4. `04-error-500.spec.js` — returns an HTTP 500 response and checks the app fails gracefully without assuming a specific error message.
5. `05-abort-api.spec.js` — aborts the fruit API request and validates the loading/error behavior.
6. `06-modify-request.spec.js` — adds a custom request header and confirms it reaches the network layer.
7. `07-modify-response.spec.js` — uses `route.fetch()` to read an actual response, changes it, and fulfills the modified data back to the page.
8. `08-wait-response.spec.js` — waits for a specific response before checking its status and URL.
9. `09-conditional-mocking.spec.js` — returns different mocked responses based on a query-string condition.
10. `10-real-world-scenario.spec.js` — demonstrates a realistic merchandising rule by altering a real response and checking the resulting UI output.

## Key Playwright concepts

- `page.on('request')` — fires whenever a request is created. Use it for logging or asserting request metadata.
- `page.on('response')` — fires when the browser receives a response to a request. Use it for checking status codes and response URLs.
- `page.route()` — intercepts matching requests and lets you stub, modify, abort, or route them.
- `route.continue()` — passes the intercept request through to the original network call, optionally with modified headers or payload.
- `route.fulfill()` — short-circuits the request and returns a custom response body and status code.
- `route.abort()` — stops the request before it reaches the server.
- `route.fetch()` — fetches the real network response so you can inspect or transform it before fulfilling the page.
- `page.waitForResponse()` — waits for a specific response to arrive after triggering a UI action.

## Install dependencies

```bash
npm install
```

## Run all tests

```bash
npx playwright test
```

## Run a single test file

```bash
npx playwright test tests/02-mock-api.spec.js
```

## View the HTML report

```bash
npx playwright show-report
```

## Common issues and troubleshooting

- If the page does not load, verify that the demo website is reachable and that the browser has been installed with `npx playwright install chromium`.
- If a test fails because the route pattern does not match, confirm the intercepted URL includes `/api/v1/fruits` and query parameters are handled correctly.
- If `page.route()` does not seem to affect the request, ensure the route is registered before navigation or the first API call.
- If a response assertion fails, log the URL and status by using `console.log()` or `page.on('response')` to see what the browser actually received.
- If a header assertion fails, remember that `route.continue({ headers })` must be used instead of trying to mutate the header after `continue()` has already happened.

## Test isolation note

Each Playwright test runs in its own browser context. Even when several tests hit the same fruit API route, the browser context and test lifecycle isolate their route handlers and network traffic from each other. This prevents one test's interception from affecting another test's results.
