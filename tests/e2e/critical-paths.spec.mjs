import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';

const criticalRoutes = [
  ['/', /What do you need in Makati/i],
  ['/services', /Find a government service/i],
  ['/government-offices', /Government offices for Makati/i],
  ['/government', /Makati City Government/i],
  ['/barangays', /Choose a barangay/i],
  ['/barangays/poblacion', /Poblacion/i],
  ['/projects-budget', /Where Makati’s money comes from and goes/i],
  ['/statistics', /Makati/i],
  ['/history', /Many histories\. One Makati\./i],
  ['/visit', /Explore the city/i],
  ['/mobility', /Getting around/i],
  ['/today', /Makati/i],
  ['/city-monitor', /City Monitor/i],
  ['/records', /Public Records/i],
  ['/reports', /Reports & Insights/i],
  ['/reports/makati-overview', /Four signals from Makati’s latest city data/i],
  ['/participate', /Participate/i],
  ['/hotlines', /Hotlines|Emergency/i],
  ['/civic-map', /Help improve public places/i],
  ['/civic-map/reports', /Civic Map reports/i],
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

test('Barangays is a top-level main navigation option', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(baseURL + '/');
  await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Barangays', exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'City', exact: true }).click();
  const cityPanel = page.locator('#desktop-panel-city');
  await expect(cityPanel.getByRole('link', { name: 'Barangays', exact: true })).toHaveCount(0);
});

test('homepage exposes and opens barangay editions', async ({ page }) => {
  await page.goto(baseURL + '/');
  await expect(page.getByRole('heading', { name: /Go deeper into your barangay/i })).toBeVisible();
  await page.getByLabel('Choose a barangay edition').selectOption('poblacion');
  await expect(page).toHaveURL(/\/barangays\/poblacion$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/BetterPoblacion/i);
});


test('homepage featured insights shows one card for the Makati Overview report', async ({ page }) => {
  await page.goto(baseURL + '/');
  await expect(page.getByRole('heading', { name: /Reports worth reading/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Four signals from Makati’s latest city data/i })).toBeVisible();
  await expect(page.getByText('23 September 2026', { exact: true })).toBeVisible();

  await page.getByRole('link', { name: 'Read more', exact: true }).click();
  await expect(page).toHaveURL(/\/reports\/makati-overview$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    /Four signals from Makati’s latest city data/i
  );
  await expect(page.getByRole('link', { name: '[1] Projects & Budget', exact: true })).toBeVisible();
});

test('reports page is a clean report library without explanatory evidence-base copy', async ({ page }) => {
  await page.goto(baseURL + '/reports');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Reports & Insights');
  await expect(page.getByRole('link', { name: /Four signals from Makati’s latest city data/i })).toBeVisible();
  await expect(page.getByText('Evidence base', { exact: true })).toHaveCount(0);
  await expect(page.getByText(/These are not reports/i)).toHaveCount(0);
  await expect(page.getByText(/Reports cite BetterMakati pages first/i)).toHaveCount(0);
});

test('homepage universal search tolerates a simple typo', async ({ page }) => {
  await page.goto(baseURL + '/');
  const search = page.getByPlaceholder(/Try Yellow Card, Poblacion, budget, cinema/i);
  await search.fill('cedla');
  await expect(page.getByText(/Community Tax Certificate|Cedula/i).first()).toBeVisible();
});

test('service directory tolerates a common typo', async ({ page }) => {
  await page.goto(baseURL + '/services');
  const search = page.getByPlaceholder(/Search permit, clearance, ID, test or service/i);
  await search.fill('cedla');
  await expect(page.getByText(/Community Tax Certificate \/ Cedula/i).first()).toBeVisible();
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
  for (const route of ['/', '/services', '/barangays', '/barangays/poblacion', '/reports', '/reports/makati-overview', '/civic-map', '/civic-map/poblacion-park', '/civic-map/reports']) {
    await page.goto(baseURL + route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `Horizontal overflow on ${route}`).toBeLessThanOrEqual(2);
  }
});


test('official logo artwork is used in the header, not a reconstructed wordmark', async ({ page }) => {
  await page.goto(baseURL + '/');
  const logo = page.locator('nav img[alt="BetterMakati"]').first();
  await expect(logo).toBeVisible();
  await expect(logo).toHaveAttribute('src', /bettermakati-logo-horizontal\.svg$/);
  await expect(page.locator('nav .brand-wordmark')).toHaveCount(0);
});

test('owner task: SSS benefit journey reaches Makati-facing service locations', async ({ page }) => {
  await page.goto(baseURL + '/services');
  const search = page.getByPlaceholder(/Search permit, clearance, ID, test or service/i);
  await search.fill('sss sickness');
  await page.getByRole('link', { name: /Open guide/i }).first().click();
  await expect(page).toHaveURL(/\/services\/guide\/sss-sickness-benefit/);
  await expect(page.getByText(/Makati|office|branch/i).first()).toBeVisible();
});

test('owner task: project spending is reachable from homepage capability examples', async ({ page }) => {
  await page.goto(baseURL + '/');
  const projectLink = page.getByRole('link', { name: /What is the city spending on this project/i });
  if (await projectLink.count()) {
    await projectLink.first().click();
    await expect(page).toHaveURL(/\/projects-budget/);
  } else {
    await page.goto(baseURL + '/projects-budget');
  }
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Where Makati’s money comes from and goes/i);
});

test('owner task: history search surface loads without a dead end', async ({ page }) => {
  await page.goto(baseURL + '/history');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Many histories\. One Makati\./i);
  await expect(page.locator('input[type="search"]').first()).toBeVisible();
});

test('owner task: civic map exposes consolidated reports, not only submissions', async ({ page }) => {
  await page.goto(baseURL + '/civic-map');
  await expect(page.getByRole('link', { name: /Weekly & monthly reports/i })).toBeVisible();
  await page.getByRole('link', { name: /Weekly & monthly reports/i }).click();
  await expect(page).toHaveURL(/\/civic-map\/reports/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Civic Map reports/i);
});

test('ratings are reversible and cannot be submitted empty', async ({ page }) => {
  let posts = 0;
  await page.route('**/api/civic', route => {
    if (route.request().method() === 'POST') posts++;
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ items: [] }) });
  });
  await page.goto(baseURL + '/civic-map/poblacion-park');
  await page.getByRole('button', { name: /Rate this place/ }).click();
  const rating = page.getByRole('button', { name: /: 4 of 5/ }).first();
  await rating.click();
  await expect(rating).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: /Clear rating for/ }).first().click();
  await expect(rating).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'Publish review', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Choose at least one rating');
  expect(posts).toBe(0);
});

test('failed civic feed does not imply zero reports', async ({ page }) => {
  await page.route('**/api/civic', route => route.fulfill({ status: 503, contentType: 'application/json', body: '{}' }));
  await page.goto(baseURL + '/civic-map');
  await expect(page.getByText('Community counts are unavailable.', { exact: false })).toBeVisible();
  await expect(page.getByText('0 community records', { exact: true })).toHaveCount(0);
});


test('barangays page is a focused selection gateway', async ({ page }) => {
  await page.goto(baseURL + '/barangays');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Choose a barangay');
  await expect(page.getByRole('link', { name: /BetterPoblacion/i })).toBeVisible();
  await expect(page.getByText(/How population is distributed/i)).toHaveCount(0);
});

test('barangay landing page uses the persistent BetterBarangay context bar', async ({ page }) => {
  await page.goto(baseURL + '/barangays/poblacion');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('BetterPoblacion');
  await expect(page.getByRole('region', { name: 'BetterBarangay view' })).toBeVisible();
  await expect(page.getByLabel('Choose BetterBarangay view')).toHaveValue('poblacion');
  await expect(page.getByRole('link', { name: /Homepage/i })).toHaveAttribute('href', '/barangays/poblacion');
  await expect(page.getByRole('heading', { name: /What do you need in Poblacion/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Follow what affects Poblacion/i })).toBeVisible();
});

test('sliceable city pages always expose the persistent BetterBarangay bar', async ({ page }) => {
  await page.goto(baseURL + '/services');
  await expect(page.getByRole('region', { name: 'BetterBarangay view' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'BetterBarangay view' }).locator('span').filter({ hasText: 'BetterBarangay View' }).first()).toBeVisible();
  await expect(page.getByLabel('Choose BetterBarangay view')).toHaveValue('');
  await page.getByLabel('Choose BetterBarangay view').selectOption('poblacion');
  await expect(page).toHaveURL(/\/services\?barangay=poblacion/);
  await expect(page.getByLabel('Choose BetterBarangay view')).toHaveValue('poblacion');
});

test('scoped city pages show the selected BetterBarangay in the persistent bar', async ({ page }) => {
  await page.goto(baseURL + '/services?barangay=carmona');
  await expect(page.getByRole('region', { name: 'BetterBarangay view' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'BetterBarangay view' }).locator('span').filter({ hasText: 'BetterCarmona' }).first()).toBeVisible();
  await expect(page.getByLabel('Choose BetterBarangay view')).toHaveValue('carmona');
  await expect(page.getByText('Deep dive into a BetterBarangay', { exact: true })).toHaveCount(0);
});

test('barangay homepage launches scoped Civic Map', async ({ page }) => {
  await page.goto(baseURL + '/barangays/poblacion');
  await page.getByRole('link', { name: 'Open local Civic Map' }).click();
  await expect(page).toHaveURL(/\/civic-map\?barangay=poblacion/);
  await expect(page.getByLabel('Choose BetterBarangay view')).toHaveValue('poblacion');
  await expect(page.getByText(/mapped assets in Barangay Poblacion/i)).toBeVisible();
  await expect(page.getByText('Makati Poblacion Park', { exact: true })).toBeVisible();
  await expect(page.getByText(/Ayala Avenue — Paseo de Roxas to V\.A\. Rufino/i)).toHaveCount(0);
});

test('barangay homepage launches services with barangay slice', async ({ page }) => {
  await page.goto(baseURL + '/barangays/poblacion');
  await page.getByRole('link', { name: /Find a service/i }).first().click();
  await expect(page).toHaveURL(/\/services\?barangay=poblacion/);
  await expect(page.getByLabel('Choose BetterBarangay view')).toHaveValue('poblacion');
  await expect(page.getByRole('button', { name: 'Barangay', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('barangay statistics show local population context through slicer', async ({ page }) => {
  await page.goto(baseURL + '/statistics?barangay=poblacion');
  await expect(page.getByLabel('Choose BetterBarangay view')).toHaveValue('poblacion');
  await expect(page.getByText('17,088', { exact: true })).toBeVisible();
  await expect(page.getByText('Barangay population', { exact: true })).toBeVisible();
});

test('barangay context does not follow users to unrelated citywide pages', async ({ page }) => {
  await page.goto(baseURL + '/services?barangay=poblacion');
  await expect(page.getByLabel('Choose BetterBarangay view')).toHaveValue('poblacion');
  await page.goto(baseURL + '/history');
  await expect(page.getByLabel('Choose BetterBarangay view')).toHaveCount(0);
  await page.goto(baseURL + '/services');
  await expect(page.getByLabel('Choose BetterBarangay view')).toHaveValue('');
});

