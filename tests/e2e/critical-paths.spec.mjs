import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';

const criticalRoutes = [
  ['/', /What do you need in Makati/i],
  ['/services', /Find a government service/i],
  ['/community-tools/saan-ako-lalapit', /Saan Ako Lalapit/i],
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
  ['/live', /What’s happening now/i],
  ['/city-monitor', /City Monitor/i],
  ['/records', /Public Records/i],
  ['/reports', /Featured Reports & Insights/i],
  ['/reports/2026-budget-operating-expenses', /Operating expenses account for nearly three-quarters/i],
  ['/reports/2025-local-revenue', /Makati generated 93\.5% of its reported 2025 receipts locally/i],
  ['/reports/2025-social-services', /Social services absorbed 55\.2% of Makati’s reported 2025 expenditure/i],
  ['/reports/2024-barangay-population', /Three barangays contain 37\.6% of Makati’s 2024 population/i],
  ['/participate', /Participate/i],
  ['/hotlines', /Hotlines|Emergency/i],
  ['/status', /BetterMakati Status/i],
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


test('homepage featured reports carousel shows one report article per card', async ({ page }) => {
  await page.goto(baseURL + '/');
  await expect(page.getByRole('heading', { name: 'Featured Reports & Insights', exact: true })).toBeVisible();
  await expect(
    page.getByRole('heading', {
      name: /Operating expenses account for nearly three-quarters of Makati’s 2026 budget increase/i,
    })
  ).toBeVisible();
  await expect(
    page.getByText(/The proposed city budget rises by ₱2 billion to ₱21 billion/i)
  ).toBeVisible();

  await page.getByRole('link', { name: 'Read more', exact: true }).click();
  await expect(page).toHaveURL(/\/reports\/2026-budget-operating-expenses$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    /Operating expenses account for nearly three-quarters/i
  );
});

test('homepage featured reports carousel advances to a different report page', async ({ page }) => {
  await page.goto(baseURL + '/');
  await page.getByRole('button', { name: 'Next featured report' }).click();
  await expect(
    page.getByRole('heading', {
      name: /Makati generated 93\.5% of its reported 2025 receipts locally/i,
    })
  ).toBeVisible();
  await expect(
    page.getByText(/Local taxes, fees, charges and other local receipts contributed ₱23\.05 billion/i)
  ).toBeVisible();
});

test('reports page lists standalone articles and never shows Makati Overview', async ({ page }) => {
  await page.goto(baseURL + '/reports');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Featured Reports & Insights');
  await expect(page.getByText('Makati Overview', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /Operating expenses account for nearly three-quarters/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Makati generated 93\.5%/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Social services absorbed 55\.2%/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Three barangays contain 37\.6%/i })).toBeVisible();
});

test('featured report article is a single narrative synthesis with internal citations', async ({ page }) => {
  await page.goto(baseURL + '/reports/2025-social-services');
  await expect(page.locator('article p')).toHaveCount(3);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Social services absorbed 55\.2%/i);
  await expect(page.getByRole('link', { name: /Source 1: Projects & Budget/i }).first()).toBeVisible();
  await expect(page.getByText('Key findings', { exact: true })).toHaveCount(0);
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

test('Saan Ako Lalapit is task-first and service-only', async ({ page }) => {
  await page.goto(baseURL + '/community-tools/saan-ako-lalapit');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Saan Ako Lalapit?');
  await expect(page.getByRole('link', { name: /Open emergency hotlines/i })).toBeVisible();
  const search = page.getByPlaceholder(/hospital bill, PWD ID, business permit, cedula/i);
  await search.fill('hospital bill');
  await expect(page.getByText('Medical / financial assistance', { exact: true }).first()).toBeVisible();
  const resultList = page.getByRole('listbox', { name: /What do you need help with\? matches/i });
  await expect(resultList.getByRole('option').filter({ hasText: 'Visit Makati' })).toHaveCount(0);
});

test('Saan Ako Lalapit common need reaches the structured PWD guide', async ({ page }) => {
  await page.goto(baseURL + '/community-tools/saan-ako-lalapit');
  await page.getByRole('link', { name: /I need a PWD ID/i }).click();
  await expect(page).toHaveURL(/\/services\/guide\/pwd-id$/);
  await expect(page.getByText('Partially verified')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Requirements' })).toBeVisible();
  await expect(page.getByText('Six 1x1 ID pictures', { exact: true })).toBeVisible();
});

test('mobile homepage and services have no material horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/', '/services', '/community-tools/saan-ako-lalapit', '/projects-budget', '/accountability', '/accountability?barangay=bel-air', '/records', '/elections', '/city-monitor', '/briefs', '/today', '/live', '/status', '/barangays', '/barangays/poblacion', '/reports', '/reports/2026-budget-operating-expenses', '/reports/2025-local-revenue', '/civic-map', '/civic-map/poblacion-park', '/civic-map/reports']) {
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

test('Projects & Budget separates adopted plan, current estimate and 2026 proposal', async ({ page }) => {
  await page.goto(baseURL + '/projects-budget');
  await expect(page.getByText('2025 adopted budget plan', { exact: true })).toBeVisible();
  await expect(page.getByText('2025 current-year estimate', { exact: true })).toBeVisible();
  await expect(page.getByText('2026 proposed city budget', { exact: true })).toBeVisible();
  await expect(page.getByText('2025 adopted', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('2025 current estimate', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('2026 proposed', { exact: true }).first()).toBeVisible();
});

test('Budget Explorer exposes the complete reconciled 2026 citywide summary', async ({ page }) => {
  await page.goto(baseURL + '/projects-budget');
  await expect(page.getByText('103 lines indexed', { exact: true })).toBeVisible();
  await expect(page.getByText('Line items reconcile to ₱21.0B', { exact: true })).toBeVisible();
  const search = page.getByPlaceholder('Search line or account code');
  await search.fill('1-07-04-990');
  await expect(page.getByRole('cell', { name: 'Other Structures', exact: true })).toBeVisible();
  await expect(page.getByRole('cell', { name: '₱55,265,000', exact: true })).toBeVisible();
});

test('Budget Explorer exposes reconciled 2026 office appropriations', async ({ page }) => {
  await page.goto(baseURL + '/projects-budget');
  await expect(page.getByText('36 office totals indexed', { exact: true })).toBeVisible();
  await expect(page.getByText('Office totals reconcile to ₱21.0B', { exact: true })).toBeVisible();
  const search = page.getByPlaceholder('Search office or department');
  await search.fill('Ospital ng Makati');
  await expect(page.getByRole('cell', { name: 'Ospital ng Makati', exact: true })).toBeVisible();
  await expect(page.getByRole('cell', { name: '₱3,530,707,000', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /pp\. 65–66/i })).toBeVisible();
});

test('Budget Explorer exposes reconciled office line-item drill-down', async ({ page }) => {
  await page.goto(baseURL + '/projects-budget');
  await expect(page.getByRole('heading', { name: 'Object-of-expenditure detail' })).toBeVisible();
  await expect(page.getByText('36 of 36 offices with line-item detail', { exact: true })).toBeVisible();
  await expect(page.getByText('Matches published office total', { exact: true })).toBeVisible();
  const office = page.getByRole('combobox', { name: 'Select office budget detail' });
  await office.selectOption("City Administrator's Office");
  await expect(page.getByRole('cell', { name: 'Training Expenses', exact: true }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: '₱131,699,000', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'p. 14', exact: true }).first()).toBeVisible();

  await office.selectOption('Youth and Sports Development Department');
  await expect(page.getByRole('cell', { name: 'Sports Equipment', exact: true })).toBeVisible();
  await expect(page.getByRole('cell', { name: '₱1,838,000', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'p. 82', exact: true }).first()).toBeVisible();
});

test('Projects & Budget displays and filters procurement evidence', async ({ page }) => {
  await page.goto(baseURL + '/projects-budget');
  await expect(page.getByRole('heading', { name: 'Bid results and award records' })).toBeVisible();
  await expect(page.getByText('21', { exact: true }).first()).toBeVisible();

  const evidence = page.getByRole('combobox', { name: 'Filter procurement evidence' });
  await evidence.selectOption('Follow-up evidence');
  await expect(page.getByText('Event management services for Rosas ng Sampiro Festival 2025', { exact: true })).toBeVisible();
  await expect(page.getByText('Desktop/laptop computers and printers for various city offices', { exact: true })).toHaveCount(0);

  await evidence.selectOption('Bid result only');
  await expect(page.getByText('Desktop/laptop computers and printers for various city offices', { exact: true })).toBeVisible();
  await expect(page.getByText('Event management services for Rosas ng Sampiro Festival 2025', { exact: true })).toHaveCount(0);

  await evidence.selectOption('All');
  const search = page.getByPlaceholder('Search project, supplier or reference');
  await search.fill('BS25-04-0419');
  await expect(page.getByText('Instructional materials for Makati public elementary and secondary schools', { exact: true })).toBeVisible();
  await expect(page.getByText('Epigraphy Inc.', { exact: true })).toBeVisible();
  await expect(page.getByText('Checked 25 September 2026', { exact: true })).toBeVisible();
});

test('Projects & Budget displays structured audit follow-through', async ({ page }) => {
  await page.goto(baseURL + '/projects-budget');
  await expect(page.getByRole('heading', { name: 'Structured COA findings' })).toBeVisible();
  await expect(page.getByText('COA finding', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Recommendation', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Follow-up', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: /development-fund use for loan and interest payments/i })).toBeVisible();
  await expect(page.getByText('Last checked 25 September 2026', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /Makati status report of unliquidated cash advances/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Makati Special Education Fund Utilization/i }).first()).toBeVisible();
});

test('Accountability Ledger publishes its actual coverage and known limits', async ({ page }) => {
  await page.goto(baseURL + '/accountability');
  await expect(page.getByRole('heading', { name: 'Follow public money, projects and promises' })).toBeVisible();
  await expect(page.getByText('structured records in this view', { exact: true })).toBeVisible();
  await expect(page.getByText('records with a follow-up evidence gap', { exact: true })).toBeVisible();
  await expect(page.getByText('projects / procurements tracked', { exact: true })).toBeVisible();
  await expect(page.getByText('structured audit observations', { exact: true })).toBeVisible();
  await expect(page.getByText('published service standards', { exact: true })).toBeVisible();
  await expect(page.getByText('public commitments indexed', { exact: true })).toBeVisible();
  await expect(page.getByText('Follow-up gaps', { exact: true })).toBeVisible();
});

test('Accountability record cards expose provenance and the next evidence gap', async ({ page }) => {
  await page.goto(baseURL + '/accountability?type=project');
  const search = page.getByPlaceholder(/Search project, supplier, office, reference number/i);
  await search.fill('BS25-04-0419');
  const card = page.locator('article').filter({
    has: page.getByText('Instructional materials for Makati public elementary and secondary schools', { exact: true }),
  });
  await expect(card).toBeVisible();
  await expect(card.getByText(/source linked|sources linked/i)).toBeVisible();
  await expect(card.getByText(/Last verified:/i)).toBeVisible();
  await expect(card.getByText('Next evidence missing', { exact: true })).toBeVisible();
});

test('Accountability barangay slice uses only explicit local tags', async ({ page }) => {
  await page.goto(baseURL + '/accountability?barangay=poblacion');
  await expect(page.getByText(/explicitly tagged to Poblacion/i)).toBeVisible();
  await expect(page.getByText('Events management services for Pride March 2024', { exact: true })).toBeVisible();
  await expect(page.getByText('2026 city fiscal record', { exact: true })).toHaveCount(0);
});

test('Accountability Bel-Air slice keeps local Makati Life commitments together', async ({ page }) => {
  await page.goto(baseURL + '/accountability?barangay=bel-air');
  await expect(page.getByText(/explicitly tagged to Bel-Air/i)).toBeVisible();
  await expect(page.getByText('Bring Makati Life Medical Center into full operation', { exact: true })).toBeVisible();
  await expect(page.getByText('Provide free digital PET/CT scans to Yellow Card holders', { exact: true })).toBeVisible();
  await expect(page.getByText('2026 city fiscal record', { exact: true })).toHaveCount(0);
});

test('Accountability never falls back to citywide records for an empty barangay slice', async ({ page }) => {
  await page.goto(baseURL + '/accountability?barangay=bangkal');
  await expect(page.getByText(/No Accountability Ledger record is currently tagged to Bangkal/i)).toBeVisible();
  await expect(page.getByText('No matching record yet', { exact: true })).toBeVisible();
  await expect(page.getByText('2026 city fiscal record', { exact: true })).toHaveCount(0);
});

test('Public Records exposes a normalized searchable source catalog', async ({ page }) => {
  await page.goto(baseURL + '/records');
  await expect(page.getByRole('heading', { name: 'Public Records' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Search the public record catalog' })).toBeVisible();
  await expect(page.getByRole('option', { name: 'Budget & fiscal', exact: true })).toHaveCount(1);
  await expect(page.getByRole('option', { name: 'Services & directories', exact: true })).toHaveCount(1);
  await expect(page.getByText('unique source URLs indexed', { exact: true })).toBeVisible();
});

test('Public Records search reaches an older original annual budget', async ({ page }) => {
  await page.goto(baseURL + '/records');
  const search = page.getByPlaceholder(/Search budget, ordinance, COA, COMELEC/i);
  await search.fill('Makati Annual Budget 2014');
  const card = page.locator('article').filter({
    has: page.getByRole('heading', { name: 'Makati Annual Budget 2014', exact: true }),
  });
  await expect(card).toBeVisible();
  await expect(card.getByText('City government', { exact: true })).toBeVisible();
  await expect(card.getByText('PDF', { exact: true })).toBeVisible();
  await expect(card.getByRole('link', { name: /Open source/i })).toHaveAttribute(
    'href',
    /executive_budget_2014\.pdf/
  );
});

test('Public Records distinguishes official and contextual evidence', async ({ page }) => {
  await page.goto(baseURL + '/records');
  await page.getByLabel('Filter records by source class').selectOption('Media / secondary');
  await expect(
    page.locator('article').filter({ hasText: 'Media / secondary' }).first()
  ).toBeVisible();
  await page.getByLabel('Filter records by source class').selectOption('All');
  await page.getByRole('checkbox').check();
  await expect(
    page.locator('article').filter({ hasText: 'Media / secondary' })
  ).toHaveCount(0);
});

test('Public Records publishes machine-readable catalog and source-watch downloads', async ({ page }) => {
  await page.goto(baseURL + '/records');
  await expect(page.getByRole('link', { name: /Download catalog CSV/i })).toHaveAttribute(
    'download',
    'bettermakati-public-records.csv'
  );
  await expect(page.getByRole('link', { name: /Monitored-source index/i })).toHaveAttribute(
    'href',
    '/source-watch-index.json'
  );
  const response = await page.request.get(baseURL + '/source-watch-index.json');
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(Array.isArray(body)).toBeTruthy();
  expect(body.length).toBeGreaterThanOrEqual(92);
});

test('Public Records exposes current source freshness state', async ({ page }) => {
  await page.goto(baseURL + '/records');
  await expect(page.getByRole('heading', { name: 'Source freshness monitor' })).toBeVisible();
  await expect(page.getByText('sources configured', { exact: true })).toBeVisible();
  await expect(page.getByText(/dynamic portals are normally checked only for reachability/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /Current source state/i })).toHaveAttribute(
    'href',
    '/source-watch-state.json'
  );

  const state = await page.request.get(baseURL + '/source-watch-state.json');
  expect(state.ok()).toBeTruthy();
  const body = await state.json();
  expect(body.version).toBe(2);
  expect(Array.isArray(body.sources)).toBeTruthy();
  expect(body.sources.length).toBeGreaterThanOrEqual(90);
  expect(new Set(body.sources.map(item => item.cadence))).toEqual(
    new Set(['daily', 'weekly', 'monthly'])
  );
  expect(new Set(body.sources.map(item => item.monitoringMode))).toEqual(
    new Set(['content-hash', 'reachability'])
  );
});

test('BetterMakati Status exposes source freshness automation', async ({ page }) => {
  await page.goto(baseURL + '/status');
  await expect(page.getByRole('heading', { name: 'Source freshness automation' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open source freshness' })).toHaveAttribute(
    'href',
    '/records'
  );
  await expect(page.getByText(/cadence-aware monitor is configured/i)).toBeVisible();
});

test('Elections publishes structured results and current BSKE information', async ({ page }) => {
  await page.goto(baseURL + '/elections');
  await expect(page.getByRole('heading', { name: '2025 Makati election results' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'How the 23 current barangays voted' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Makati mayoral history, 1998–2025' })).toBeVisible();
});

test('Elections exposes the full 2025 council candidate fields', async ({ page }) => {
  await page.goto(baseURL + '/elections#council-results');
  await expect(page.getByRole('heading', { name: 'Full 2025 council candidate results' })).toBeVisible();
  await expect(page.getByText('Rene Andrei Saguisag', { exact: true })).toBeVisible();
  await expect(page.getByText('Bodik Baniqued', { exact: true })).toBeVisible();
  await expect(page.getByText('Herman Marco “Tito Kanin” Garcia', { exact: true })).toBeVisible();
  await expect(page.getByText('Reynante Saludo', { exact: true })).toBeVisible();
});

test('Elections publishes 2026 BSKE legal framework and candidate-source guardrail', async ({ page }) => {
  await page.goto(baseURL + '/elections#bske-2026');
  await expect(page.getByRole('heading', { name: 'Calendar & legal framework' })).toBeVisible();
  await expect(page.getByText('Four-year term', { exact: true })).toBeVisible();
  await expect(page.getByText('Barangay term limit', { exact: true })).toBeVisible();
  await expect(page.getByText('SK transition', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Candidate directory status' })).toBeVisible();
  await expect(page.getByText(/Official Makati candidate list pending COMELEC publication/i)).toBeVisible();
});

test('Elections provides downloadable local, barangay and historical datasets', async ({ page }) => {
  await page.goto(baseURL + '/elections#election-data');
  await expect(page.getByRole('link', { name: /2025 local results CSV/i })).toHaveAttribute(
    'download',
    'bettermakati-election-2025-local-results.csv'
  );
  await expect(page.getByRole('link', { name: /2025 barangay mayor CSV/i })).toHaveAttribute(
    'download',
    'bettermakati-election-2025-barangay-mayor.csv'
  );
  await expect(page.getByRole('link', { name: /Mayoral history CSV/i })).toHaveAttribute(
    'download',
    'bettermakati-mayoral-history-1998-2025.csv'
  );
});

test('Today in Makati combines current and validated layers', async ({ page }) => {
  await page.goto(baseURL + '/today');
  await expect(page.getByRole('heading', { level: 1, name: 'Today in Makati' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Current conditions' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Latest published brief' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'City Monitor' })).toBeVisible();
  await expect(page.getByLabel('Choose my barangay')).toBeVisible();
});

test('Live Makati labels source authority and check status', async ({ page }) => {
  await page.goto(baseURL + '/live');
  await expect(page.getByRole('heading', { level: 1, name: 'What’s happening now' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Source checks' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Source directory' })).toBeVisible();
  await expect(page.getByText('Official government', { exact: true }).first()).toBeVisible();
  await expect(page.locator('#main-content').getByRole('link', { name: 'Today in Makati', exact: true })).toBeVisible();

  const state = await page.request.get(baseURL + '/city-monitor-source-state.json');
  expect(state.ok()).toBeTruthy();
});

test('City Monitor publishes permanent records and source status', async ({ page }) => {
  await page.goto(baseURL + '/city-monitor');
  await expect(page.getByRole('heading', { name: 'Structured records' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Source directory' })).toBeVisible();
  await expect(page.getByLabel('Filter City Monitor stream')).toBeVisible();
});

test('City Monitor exposes the editorial review queue and monitoring modes', async ({ page }) => {
  await page.goto(baseURL + '/city-monitor');
  await expect(page.getByRole('heading', { name: 'Source changes awaiting review' })).toBeVisible();
  await expect(page.getByText('content-change detection', { exact: true })).toBeVisible();
  await expect(page.getByText('reachability only', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('manual review', { exact: true })).toBeVisible();
});

test('City Monitor indexes structured procurement as permanent records', async ({ page }) => {
  await page.goto(baseURL + '/city-monitor');
  const search = page.getByPlaceholder('Search records');
  await search.fill('BS25-04-0419');
  await expect(page.getByText('Instructional materials for Makati public elementary and secondary schools', { exact: true })).toBeVisible();
  await expect(page.getByText(/Epigraphy Inc\./)).toBeVisible();
  await expect(page.getByText(/Reference:/)).toBeVisible();
});

test('City Monitor procurement record has a permanent detail page and evidence link', async ({ page }) => {
  await page.goto(baseURL + '/city-monitor/monitor-procurement-2025-q2-bs25-04-0419');
  await expect(page.getByRole('heading', { level: 1, name: 'Instructional materials for Makati public elementary and secondary schools' })).toBeVisible();
  await expect(page.getByText('BS25-04-0419', { exact: false })).toBeVisible();
  await expect(page.getByRole('link', { name: /Original source/i })).toBeVisible();
});

test('City Monitor publishes machine-readable source health and history', async ({ page }) => {
  await page.goto(baseURL + '/city-monitor');
  await expect(page.getByRole('link', { name: 'Source health JSON' })).toHaveAttribute(
    'href',
    '/city-monitor-source-state.json'
  );
  await expect(page.getByRole('link', { name: 'Check history JSON' })).toHaveAttribute(
    'href',
    '/city-monitor-source-history.json'
  );
  await expect(page.getByRole('link', { name: 'Source-change RSS' })).toHaveAttribute(
    'href',
    '/city-monitor.rss.xml'
  );

  const state = await page.request.get(baseURL + '/city-monitor-source-state.json');
  expect(state.ok()).toBeTruthy();
  const stateBody = await state.json();
  expect(Array.isArray(stateBody.sources)).toBeTruthy();

  const history = await page.request.get(baseURL + '/city-monitor-source-history.json');
  expect(history.ok()).toBeTruthy();
  const historyBody = await history.json();
  expect(Array.isArray(historyBody.runs)).toBeTruthy();

  const sitemap = await page.request.get(baseURL + '/sitemap.xml');
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain(
    '/city-monitor/monitor-procurement-2025-q2-bs25-04-0419'
  );
});

test('Civic Briefs exposes daily weekly and monthly publication modes', async ({ page }) => {
  await page.goto(baseURL + '/briefs');
  await expect(page.getByRole('heading', { level: 1, name: 'Civic Briefs' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Daily', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Weekly', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Monthly', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What changed in the civic record' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Source-review queue' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Permanent brief archive' })).toBeVisible();
});

test('Civic Briefs archive has permanent seeded snapshots without backdating', async ({ page }) => {
  await page.goto(baseURL + '/briefs?brief=daily-2026-09-24');
  await expect(page.getByText('Published brief', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Daily Civic Brief', exact: true }).first()).toBeVisible();

  const response = await page.request.get(baseURL + '/civic-briefs.json');
  expect(response.ok()).toBeTruthy();
  const archive = await response.json();
  expect(Array.isArray(archive.briefs)).toBeTruthy();
  expect(archive.briefs.length).toBeGreaterThanOrEqual(3);
  expect(new Set(archive.briefs.map(item => item.cadence))).toEqual(
    new Set(['daily', 'weekly', 'monthly'])
  );
  for (const id of [
    'daily-2026-09-24',
    'weekly-2026-09-18--2026-09-24',
    'monthly-2026-09',
  ]) {
    const seed = archive.briefs.find(item => item.id === id);
    expect(seed).toBeTruthy();
    expect(String(seed.publishedAt)).toMatch(/^2026-09-24/);
  }
});

test('Civic Briefs exposes its review queue separately from published activity', async ({ page }) => {
  await page.goto(baseURL + '/briefs');
  await expect(page.getByRole('heading', { name: 'Source-review queue' })).toBeVisible();
  await expect(page.getByText(/source changes awaiting review/i).first()).toBeVisible();
});

test('Civic Briefs exposes barangay relevance without hiding citywide records', async ({ page }) => {
  await page.goto(baseURL + '/briefs');
  const selector = page.getByLabel('Filter Civic Brief by barangay relevance');
  await expect(selector).toBeVisible();
  await selector.selectOption('poblacion');
  await expect(page).toHaveURL(/barangay=poblacion/);
  await expect(
    page.getByText(/Shows citywide records plus records explicitly tagged to Barangay Poblacion/i)
  ).toBeVisible();
});

test('Civic Briefs monthly view exposes neutral activity and procurement summaries', async ({ page }) => {
  await page.goto(baseURL + '/briefs?period=monthly');
  await expect(page.getByRole('heading', { level: 2, name: 'State of Makati', exact: true }).first()).toBeVisible();
  await expect(page.getByText('Procurement represented in validated records', { exact: true })).toBeVisible();
  await expect(page.getByText('Validated activity by stream', { exact: true })).toBeVisible();
  await expect(page.getByText(/It is not total city spending or proof of payment/i)).toBeVisible();
});

test('Civic Briefs publishes archive and RSS distribution feeds', async ({ page }) => {
  await page.goto(baseURL + '/briefs');
  await expect(page.getByRole('link', { name: /Civic Briefs RSS/i })).toHaveAttribute(
    'href',
    '/civic-briefs.rss.xml'
  );
  await expect(page.getByRole('button', { name: /Copy brief text/i })).toBeVisible();
  const distribution = page.locator('section').filter({
    has: page.getByRole('heading', { name: 'Share the brief' }),
  });
  await expect(distribution.getByRole('link', { name: 'Facebook', exact: true })).toHaveAttribute(
    'href',
    'https://www.facebook.com/bettermakati'
  );

  const rss = await page.request.get(baseURL + '/civic-briefs.rss.xml');
  expect(rss.ok()).toBeTruthy();
  expect(await rss.text()).toContain('BetterMakati Civic Briefs');
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
  await expect(page.getByRole('link', { name: 'Barangay Homepage', exact: true })).toHaveAttribute('href', '/barangays/poblacion');
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

test('barangay homepage exposes council services election and local accountability', async ({ page }) => {
  await page.goto(baseURL + '/barangays/poblacion');
  await expect(page.getByRole('heading', { name: /Common barangay transactions/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Current barangay council/i })).toBeVisible();
  await expect(page.getByText(/Jose Mikhail Ranillo Villena/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: /2025 mayoral result/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Locally tagged public records/i })).toBeVisible();
});

test('first BetterBarangay contact batch exposes verified hall details', async ({ page }) => {
  await page.goto(baseURL + '/barangays/bangkal');
  await expect(page.getByText('3440 Gen. Lim Street, Bangkal, Makati City', { exact: true })).toBeVisible();
  await expect(page.getByText('7751-0787', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /Official social channel/i })).toBeVisible();

  await page.goto(baseURL + '/barangays/carmona');
  await expect(page.getByText('A.P. Reyes Avenue, Barangay Carmona, Makati City', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'barangaycarmona2013@gmail.com', exact: true })).toBeVisible();

  await page.goto(baseURL + '/barangays/forbes-park');
  await expect(page.getByText('Kalayaan Road corner Pandan Street, Forbes Park, Makati City', { exact: true })).toBeVisible();
});

test('expanded BetterBarangay hall contact batch renders current locations', async ({ page }) => {
  const checks = [
    ['/barangays/guadalupe-nuevo', 'Orense Street, Guadalupe Nuevo, Makati City'],
    ['/barangays/kasilawan', '2094 E. Pascua Street, Kasilawan, Makati City'],
    ['/barangays/pio-del-pilar', '6845 Washington Street, Pio Del Pilar, Makati City'],
    ['/barangays/san-isidro', '2701 Guatemala Street, San Isidro, Makati City'],
    ['/barangays/singkamas', '3816 F. Nazario Street, Singkamas, Makati City'],
    ['/barangays/valenzuela', 'Hormiga Street corner Pililia Street, Valenzuela, Makati City'],
  ];

  for (const [route, address] of checks) {
    await page.goto(baseURL + route);
    await expect(page.getByText(address, { exact: true })).toBeVisible();
  }
});

test('barangay gateway search finds a barangay through an official name', async ({ page }) => {
  await page.goto(baseURL + '/barangays');
  await page.getByPlaceholder(/Search barangay, official or local place/i).fill('Jose Mikhail');
  await expect(page.getByRole('link', { name: /BetterPoblacion/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /BetterBangkal/i })).toHaveCount(0);
});

test('site search indexes barangay officials', async ({ page }) => {
  await page.goto(baseURL + '/');
  const search = page.getByPlaceholder(/Try Yellow Card, Poblacion, budget, cinema/i);
  await search.fill('Jose Mikhail Villena');
  await expect(page.getByText('Barangay Poblacion', { exact: true }).first()).toBeVisible();
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

