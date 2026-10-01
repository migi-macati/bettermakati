import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';

const visibleButton = (page, name) =>
  page.getByRole('button', { name }).filter({ visible: true }).first();

test('explicit language choice persists without changing the current URL', async ({ page, context }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto(baseURL + '/?language-test=1#services');

  const originalURL = page.url();
  await visibleButton(page, 'Use Filipino').click();

  await expect(page.locator('html')).toHaveAttribute('lang', 'fil');
  await expect(page.getByRole('link', { name: 'Makilahok', exact: true }).first()).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('i18nextLng'))).toBe('fil');
  expect(page.url()).toBe(originalURL);

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'fil');
  await expect(page.getByRole('link', { name: 'Makilahok', exact: true }).first()).toBeVisible();

  await page.goto(baseURL + '/services');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fil');

  const returnVisit = await context.newPage();
  await returnVisit.setViewportSize({ width: 1600, height: 900 });
  await returnVisit.goto(baseURL + '/');
  await expect(returnVisit.locator('html')).toHaveAttribute('lang', 'fil');
  await expect(returnVisit.getByRole('link', { name: 'Makilahok', exact: true }).first()).toBeVisible();

  await visibleButton(returnVisit, 'Gamitin ang English').click();
  await expect(returnVisit.locator('html')).toHaveAttribute('lang', 'en');
  await expect(returnVisit.getByRole('link', { name: 'Participate', exact: true }).first()).toBeVisible();
  await expect.poll(() => returnVisit.evaluate(() => localStorage.getItem('i18nextLng'))).toBe('en');
});
