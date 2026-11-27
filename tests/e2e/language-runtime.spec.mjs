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

for (const language of ['en', 'fil']) {
  for (const width of [390, 1440]) {
    test(`BM-E001 GDP boundary and corrections (${language}, ${width})`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.addInitScript(lang => localStorage.setItem('i18nextLng', lang), language);
      await page.goto(baseURL + '/reports/makati-2025-economy-gdp-outlook');
      const history = page.getByRole('table').filter({
        has: page.getByRole('columnheader', { name: language === 'en' ? 'Geography note' : 'Sakop ng datos' }),
      });
      const historyRow = year => history.getByRole('row').filter({ has: page.getByRole('cell', { name: year, exact: true }) });
      await expect(historyRow('2021')).toContainText(language === 'en' ? 'Pre-transfer Makati' : 'Kasama ang EMBO');
      await expect(historyRow('2022')).toContainText(language === 'en' ? 'PSA excludes EMBO' : 'Hindi kasama ang EMBO');
      await expect(historyRow('2022')).toContainText('1.64%');
      await expect(page.locator('main')).toContainText('17.48%');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
  }
}

for (const [language, fee, intake] of [
  ['en', 'Free', 'File the form and documents with your barangay'],
  ['fil', 'Libre', 'Isumite ang form at mga dokumento sa satellite office'],
]) {
  test('White Card preparation and office contact in ' + language, async ({ page }) => {
    await page.addInitScript(lang => localStorage.setItem('i18nextLng', lang), language);
    await page.goto(baseURL + '/services/guide/senior-national-id');
    await expect(page.getByText(fee, { exact: true })).toBeVisible();
    await expect(page.getByText(intake, { exact: false })).toBeVisible();
    await expect(page.getByText('(02) 8870-1714 / (02) 8870-1707', { exact: true })).toBeVisible();
    await expect(page.locator('a[href*="OSCA%20NID%20FORM"]').first()).toBeVisible();
  });
}

for (const [language, voterRule] of [['en', 'active Makati voter'], ['fil', 'aktibong botante']]) {
  test('Blu Card guide distinguishes local benefit eligibility in ' + language, async ({ page }) => {
    await page.addInitScript(lang => localStorage.setItem('i18nextLng', lang), language);
    await page.goto(baseURL + '/services/guide/senior-blu-card');
    await expect(page.getByText(voterRule, { exact: false })).toBeVisible();
    await expect(page.getByText('(02) 8870-1640', { exact: true })).toBeVisible();
    await expect(page.locator('a[href$="#page=432"]').first()).toBeVisible();
  });
}
