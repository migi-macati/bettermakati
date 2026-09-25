import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const routes = [
  '/',
  '/services',
  '/search',
  '/community-tools/saan-ako-lalapit',
  '/services/guide/community-tax-certificate',
  '/services/guide/pwd-id',
  '/services/guide/national-id',
  '/participate',
  '/get-involved',
  '/hotlines',
  '/about',
  '/government',
  '/legislation',
  '/accountability',
  '/barangays',
  '/barangays/poblacion',
  '/projects-budget',
  '/history',
  '/visit',
  '/today',
  '/live',
  '/records',
  '/status',
];

for (const route of routes) {
  test(`no serious accessibility violations on ${route}`, async ({ page }) => {
    await page.goto(baseURL + route);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
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
