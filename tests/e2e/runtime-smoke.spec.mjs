import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';

test('application bootstrap renders and reports no runtime errors', async ({ page }) => {
  const pageErrors = [];
  const consoleErrors = [];

  page.on('pageerror', error => {
    pageErrors.push(error.stack || error.message);
  });

  page.on('console', message => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  const response = await page.goto(baseURL + '/');
  expect(response?.ok(), 'Homepage HTTP response should succeed').toBeTruthy();

  await page.waitForTimeout(750);

  if (pageErrors.length || consoleErrors.length) {
    throw new Error(
      [
        'Browser bootstrap errors detected.',
        ...pageErrors.map(error => 'pageerror: ' + error),
        ...consoleErrors.map(error => 'console.error: ' + error),
      ].join('\n')
    );
  }

  await expect(page.locator('main#main-content')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    /How can we make Makati better\?/i
  );
});
