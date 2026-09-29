import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const routes = [
  '/',
  '/services',
  '/search',
  '/community-tools',
  '/community-tools/saan-ako-lalapit',
  '/services/guide/community-tax-certificate',
  '/services/guide/pwd-id',
  '/services/guide/national-id',
  '/participate',
  '/get-involved',
  '/contact',
  '/hotlines',
  '/about',
  '/privacy',
  '/terms',
  '/government',
  '/government-offices',
  '/legislation',
  '/accountability',
  '/open-government',
  '/integrity',
  '/barangays',
  '/barangays/poblacion',
  '/projects-budget',
  '/statistics',
  '/elections',
  '/officials/nancy-binay',
  '/history',
  '/heritage',
  '/estates',
  '/visit',
  '/mobility',
  '/cinemas',
  '/calendar',
  '/news',
  '/today',
  '/live',
  '/records',
  '/records/makati-annual-budget-2026-https-www-makati-gov-ph-assets-uploads-staticmenu-docs-online-fo',
  '/status',
  '/city-monitor',
  '/city-monitor/2026-q2-makati-city-hall-building-ii-hvac',
  '/briefs',
  '/reports',
  '/reports/2026-budget-operating-expenses',
  '/civic-map',
  '/civic-map/reports',
  '/civic-map/audits/park-accessibility-2026',
  '/civic-map/audits/park-accessibility-2026/results',
  '/civic-map/report',
  '/civic-map/poblacion-park',
];

const wcagTags = [
  'wcag2a',
  'wcag2aa',
  'wcag21a',
  'wcag21aa',
  'wcag22a',
  'wcag22aa',
];

const assertPageSemantics = async page => {
  await expect(page.locator('main#main-content')).toHaveCount(1);
  await expect(page.locator('main#main-content h1')).toHaveCount(1);
  await expect(page.locator('main#main-content h1')).not.toContainText(
    /We couldn’t find that page|We couldn't find that page/i
  );

  const unnamedButtons = await page.locator('button').evaluateAll(buttons =>
    buttons.filter(button => {
      const text = (button.textContent || '').trim();
      const label =
        button.getAttribute('aria-label') ||
        button.getAttribute('aria-labelledby');
      return !text && !label;
    }).length
  );
  expect(unnamedButtons, 'Every button must have an accessible name').toBe(0);

  const missingAlt = await page.locator('img:not([alt])').count();
  expect(missingAlt, 'Every image must have an alt attribute').toBe(0);
};

for (const route of routes) {
  test(`no serious accessibility violations on ${route}`, async ({ page }) => {
    const response = await page.goto(baseURL + route);
    expect(response?.ok(), `HTTP response for ${route}`).toBeTruthy();
    await assertPageSemantics(page);

    const results = await new AxeBuilder({ page })
      .withTags(wcagTags)
      .analyze();

    const serious = results.violations.filter(violation =>
      violation.impact === 'serious' || violation.impact === 'critical'
    );

    expect(
      serious.map(violation => ({
        id: violation.id,
        impact: violation.impact,
        help: violation.help,
        nodes: violation.nodes.map(node => node.target),
      })),
      `Serious/critical accessibility violations on ${route}`
    ).toEqual([]);
  });
}


test('skip link is the first keyboard stop and moves focus to main content', async ({ page }) => {
  await page.goto(baseURL + '/');
  await page.keyboard.press('Tab');

  const skip = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skip).toBeFocused();

  await page.keyboard.press('Enter');
  await expect(page.locator('main#main-content')).toBeFocused();
});

test('desktop navigation menu closes with Escape and restores toggle focus', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(baseURL + '/');

  const toggle = page.getByRole('button', { name: 'Open Services menu' });
  await toggle.focus();
  await page.keyboard.press('Enter');

  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#desktop-panel-services')).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#desktop-panel-services')).toBeHidden();
  await expect(toggle).toBeFocused();
});

test('search combobox keeps DOM focus while arrowing through results and closes on Escape', async ({ page }) => {
  await page.goto(baseURL + '/search');

  const search = page.getByRole('combobox', { name: 'What are you looking for?' });
  await search.focus();
  await search.fill('budget');

  await expect(search).toHaveAttribute('aria-expanded', 'true');
  await expect(search).toHaveAttribute('aria-activedescendant', /search-result-site-0/);

  await page.keyboard.press('ArrowDown');
  await expect(search).toBeFocused();
  await expect(search).toHaveAttribute('aria-activedescendant', /search-result-site-1/);

  await page.keyboard.press('Escape');
  await expect(search).toBeFocused();
  await expect(search).toHaveAttribute('aria-expanded', 'false');
});

test('dense horizontal table region is keyboard focusable and named', async ({ page }) => {
  await page.goto(baseURL + '/statistics');

  const region = page.getByRole('region', {
    name: 'Makati population trend table — horizontally scrollable',
  });
  await region.focus();
  await expect(region).toBeFocused();
});

test('SPA pathname navigation moves focus to main content', async ({ page }) => {
  await page.goto(baseURL + '/');

  const services = page.getByRole('link', { name: 'Get a service', exact: true });
  await services.focus();
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(baseURL + '/services');
  await expect(page.locator('main#main-content')).toBeFocused();
});
