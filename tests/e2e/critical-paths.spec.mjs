import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';

const criticalRoutes = [
  ['/', /What do you need in Makati/i],
  ['/services', /Find a government service/i],
  ['/government-offices', /Government offices for Makati/i],
  ['/government', /Makati City Government/i],
  ['/barangays', /Barangays/i],
  ['/projects-budget', /budget|projects/i],
  ['/statistics', /Makati/i],
  ['/history', /Many histories\. One Makati\./i],
  ['/visit', /Explore the city/i],
  ['/mobility', /Getting around/i],
  ['/today', /Makati/i],
  ['/city-monitor', /City Monitor/i],
  ['/records', /Public Records/i],
  ['/participate', /Participate/i],
  ['/hotlines', /Hotlines|Emergency/i],
];

const assertBasicAccessibility = async page => {
  await expect(page.locator('main#main-content')).toHaveCount(1);
  const missingAlt = await page.locator('img:not([alt])').count();
  expect(missingAlt, 'Every image must have an alt attribute').toBe(0);

  const unnamedButtons = await page.locator('button').evaluateAll(buttons =>
    buttons.filter(button => {
      const text = (button.textContent || '').trim();
      const label = button.getAttribute('aria-label') || button.getAttribute('aria-labelledby');
      return !text && !label;
    }).length
  );
  expect(unnamedButtons, 'Every button must have an accessible name').toBe(0);

  const h1Count = await page.locator('h1').count();
  expect(h1Count, 'Pages should have one primary heading').toBeGreaterThanOrEqual(1);
  expect(h1Count, 'Pages should not have multiple primary headings').toBeLessThanOrEqual(1);
};

for (const [route, heading] of criticalRoutes) {
  test(`critical route ${route}`, async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    const response = await page.goto(baseURL + route);
    expect(response?.ok(), `HTTP response for ${route}`).toBeTruthy();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(heading);
    await assertBasicAccessibility(page);
    expect(pageErrors, `No page errors expected on ${route}`).toEqual([]);
  });
}

test('homepage universal search tolerates a simple typo', async ({ page }) => {
  await page.goto(baseURL + '/');
  const search = page.getByPlaceholder(/Try Yellow Card, Poblacion, budget, cinema/i);
  await search.fill('cedla');
  await expect(page.getByText(/Community Tax Certificate|Cedula/i).first()).toBeVisible();
});

test('service directory opens BetterMakati guide before external handoff', async ({ page }) => {
  await page.goto(baseURL + '/services');
  const search = page.getByPlaceholder(/Search permit, clearance, ID, test or service/i);
  await search.fill('cedula');
  await page.getByRole('link', { name: /Open guide/i }).first().click();
  await expect(page).toHaveURL(/\/services\/guide\/community-tax-certificate/);
  await expect(page.getByText('Structured details verified')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Requirements' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Fees & payment' })).toBeVisible();
});

test('mobile homepage and services have no material horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/', '/services']) {
    await page.goto(baseURL + route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `Horizontal overflow on ${route}`).toBeLessThanOrEqual(2);
  }
});
