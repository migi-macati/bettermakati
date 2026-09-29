import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';

const deviceMatrix = [
  { id: 'narrow-mobile', width: 320, height: 568 },
  { id: 'android-mobile', width: 390, height: 844 },
  { id: 'tablet-portrait', width: 768, height: 1024 },
  { id: 'compact-landscape', width: 1024, height: 768 },
  { id: 'desktop', width: 1440, height: 900 },
];

const reflowRoutes = [
  '/',
  '/search',
  '/barangays/poblacion',
  '/projects-budget',
  '/statistics',
  '/calendar',
  '/civic-map/poblacion-park',
  '/heritage',
];

const assertNoPageOverflow = async (page, route) => {
  await expect(page.locator('main#main-content')).toBeVisible();
  await expect(page.locator('main#main-content h1')).toHaveCount(1);

  const metrics = await page.evaluate(() => {
    const viewport = window.innerWidth;
    const isClippedByAncestor = element => {
      let parent = element.parentElement;
      while (parent) {
        const overflowX = getComputedStyle(parent).overflowX;
        if (['auto', 'scroll', 'hidden', 'clip'].includes(overflowX)) return true;
        parent = parent.parentElement;
      }
      return false;
    };
    const offenders = Array.from(document.querySelectorAll('body *'))
      .flatMap(element => {
        const rect = element.getBoundingClientRect();
        if (
          (rect.right <= viewport + 1 && rect.left >= -1) ||
          isClippedByAncestor(element)
        ) return [];
        return [{
          tag: element.tagName.toLowerCase(),
          id: element.id || '',
          className: typeof element.className === 'string' ? element.className.slice(0, 180) : '',
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          text: (element.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 100),
        }];
      })
      .slice(0, 8);
    return {
      viewport,
      documentWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      offenders,
    };
  });

  const overflowContext = metrics.offenders.length
    ? ' Offenders: ' + JSON.stringify(metrics.offenders)
    : '';
  expect(
    metrics.documentWidth,
    'Document overflow on ' + route + ' at ' + metrics.viewport + 'px.' + overflowContext
  ).toBeLessThanOrEqual(metrics.viewport + 1);
  expect(
    metrics.bodyWidth,
    'Body overflow on ' + route + ' at ' + metrics.viewport + 'px.' + overflowContext
  ).toBeLessThanOrEqual(metrics.viewport + 1);
};

for (const device of deviceMatrix) {
  test(
    device.id + ' keeps representative civic journeys within the viewport',
    async ({ page }) => {
      await page.setViewportSize({
        width: device.width,
        height: device.height,
      });

      const pageErrors = [];
      page.on('pageerror', error => pageErrors.push(error.message));

      for (const route of reflowRoutes) {
        const response = await page.goto(baseURL + route);
        expect(
          response?.ok(),
          'HTTP response for ' + route + ' at ' + device.width + 'px'
        ).toBeTruthy();
        await assertNoPageOverflow(page, route);
      }

      expect(
        pageErrors,
        'No page errors expected across ' + device.id
      ).toEqual([]);
    }
  );
}

for (const device of deviceMatrix.slice(0, 2)) {
  test(
    device.id + ' keeps mobile navigation and search popover on screen',
    async ({ page }) => {
      await page.setViewportSize({
        width: device.width,
        height: device.height,
      });

      await page.goto(baseURL + '/barangays/poblacion');
      const menu = page.getByRole('button', { name: 'Open main menu' });
      await menu.click();

      const nav = page.locator('#mobile-navigation');
      await expect(nav).toBeVisible();
      const navBox = await nav.boundingBox();
      expect(navBox).not.toBeNull();
      expect(navBox.x).toBeGreaterThanOrEqual(-1);
      expect(navBox.x + navBox.width).toBeLessThanOrEqual(device.width + 1);
      await assertNoPageOverflow(page, '/barangays/poblacion');

      await page.goto(baseURL + '/search');
      const search = page.getByRole('combobox', {
        name: 'What are you looking for?',
      });
      await search.fill('budget');

      const popup = page.locator('#search-results-site');
      await expect(popup).toBeVisible();
      const popupBox = await popup.boundingBox();
      expect(popupBox).not.toBeNull();
      expect(popupBox.x).toBeGreaterThanOrEqual(-1);
      expect(popupBox.x + popupBox.width).toBeLessThanOrEqual(device.width + 1);
      await assertNoPageOverflow(page, '/search');
    }
  );
}

test('narrow mobile can keyboard-scroll the dense statistics table', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto(baseURL + '/statistics');

  const region = page.getByRole('region', {
    name: 'Makati population trend table — horizontally scrollable',
  });
  await region.focus();
  await expect(region).toBeFocused();

  const before = await region.evaluate(element => ({
    left: element.scrollLeft,
    width: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(before.scrollWidth).toBeGreaterThan(before.width);

  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(120);

  const after = await region.evaluate(element => element.scrollLeft);
  expect(after).toBeGreaterThan(before.left);
});

test('reduced motion disables Featured Reports autoplay control', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseURL + '/');

  const carousel = page.locator(
    'section[aria-labelledby="featured-reports-title"][aria-roledescription="carousel"]'
  );
  await expect(carousel).toBeVisible();
  await expect(
    carousel.getByRole('button', { name: /Pause|Resume/ })
  ).toHaveCount(0);
  await expect(
    carousel.getByRole('button', { name: 'Previous featured report' })
  ).toBeVisible();
  await expect(
    carousel.getByRole('button', { name: 'Next featured report' })
  ).toBeVisible();
});

test('civic map iframe accepts keyboard focus and keeps a text fallback', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseURL + '/civic-map/poblacion-park');

  const map = page.locator('iframe[title^="Map:"]').first();
  await expect(map).toBeVisible();
  await map.focus();
  await expect(map).toBeFocused();
  await expect(page.getByRole('link', { name: /Open full map/i })).toBeVisible();
});

test('200 percent text resizing does not create page-level overflow on core journeys', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });

  for (const route of ['/', '/search', '/services', '/calendar']) {
    await page.goto(baseURL + route);
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    await page.waitForTimeout(50);
    await assertNoPageOverflow(page, route + ' with 200% text');
  }
});
