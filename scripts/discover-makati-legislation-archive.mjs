import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const sourceUrl =
  'https://www.makati.gov.ph/content/resolutions-and-ordinances/author';
const capturedAt = new Date().toISOString();
const outputDir = process.env.ARCHIVE_DISCOVERY_DIR || 'artifacts';
const outputPath =
  process.env.ARCHIVE_DISCOVERY_PATH ||
  `${outputDir}/makati-legislation-archive-discovery.json`;

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1200 },
  userAgent:
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130 Safari/537.36 BetterMakatiArchiveEnumerator/1.0',
});
const page = await context.newPage();

const responses = [];
const responseKeys = new Set();

page.on('response', async response => {
  const url = response.url();
  if (
    !/makati\.gov\.ph/i.test(url) ||
    !/(resolution|ordinance|legislation|author|category|content|search)/i.test(url)
  ) {
    return;
  }

  const headers = await response.allHeaders().catch(() => ({}));
  const contentType = headers['content-type'] || '';
  const record = {
    url,
    status: response.status(),
    method: response.request().method(),
    resourceType: response.request().resourceType(),
    contentType,
  };

  if (/json/i.test(contentType)) {
    try {
      const body = await response.json();
      record.json = body;
    } catch {
      // Leave metadata only when the body cannot be decoded as JSON.
    }
  }

  const key = JSON.stringify([
    record.method,
    record.url,
    record.status,
    record.resourceType,
  ]);
  if (!responseKeys.has(key)) {
    responseKeys.add(key);
    responses.push(record);
  }
});

let navigationError = null;
try {
  await page.goto(sourceUrl, {
    waitUntil: 'domcontentloaded',
    timeout: 60_000,
  });
  await page.waitForTimeout(5_000);
  await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {});
} catch (error) {
  navigationError = String(error);
}

const scriptSources = await page
  .locator('script[src]')
  .evaluateAll(nodes => nodes.map(node => node.src))
  .catch(() => []);

const collectArchiveLinks = async () =>
  page
    .locator('a[href*="/content/resolutions-and-ordinances/"]')
    .evaluateAll(nodes =>
      nodes.map(node => ({
        href: node.href,
        text: (node.textContent || '').replace(/\s+/g, ' ').trim(),
      }))
    )
    .catch(() => []);

const archiveLinks = new Map();
const mergeLinks = links => {
  for (const link of links) {
    if (!link.href) continue;
    const existing = archiveLinks.get(link.href);
    if (!existing || (!existing.text && link.text)) {
      archiveLinks.set(link.href, link);
    }
  }
};

mergeLinks(await collectArchiveLinks());

let stableRounds = 0;
let previousCount = archiveLinks.size;
let previousHeight = 0;

for (let iteration = 0; iteration < 80 && stableRounds < 5; iteration += 1) {
  const beforeHeight = await page
    .evaluate(() => document.documentElement.scrollHeight)
    .catch(() => 0);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(900);

  const clickable = await page
    .getByRole('button')
    .all()
    .catch(() => []);
  let clicked = false;
  for (const button of clickable) {
    const text = ((await button.textContent().catch(() => '')) || '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
    const disabled = await button.isDisabled().catch(() => true);
    const visible = await button.isVisible().catch(() => false);
    if (
      visible &&
      !disabled &&
      /^(next|next page|load more|more|show more|›|»)$/.test(text)
    ) {
      await button.click().catch(() => {});
      clicked = true;
      await page.waitForTimeout(1_200);
      break;
    }
  }

  mergeLinks(await collectArchiveLinks());

  const currentHeight = await page
    .evaluate(() => document.documentElement.scrollHeight)
    .catch(() => beforeHeight);
  const currentCount = archiveLinks.size;

  if (
    currentCount === previousCount &&
    currentHeight === previousHeight &&
    !clicked
  ) {
    stableRounds += 1;
  } else {
    stableRounds = 0;
  }

  previousCount = currentCount;
  previousHeight = currentHeight;
}

const bodyText = await page
  .locator('body')
  .innerText()
  .catch(() => '');

const interactive = await page
  .locator('input, button, select, a')
  .evaluateAll(nodes =>
    nodes.slice(0, 500).map(node => ({
      tag: node.tagName,
      type: node.getAttribute('type'),
      name: node.getAttribute('name'),
      id: node.id || null,
      className: node.getAttribute('class'),
      value: node.getAttribute('value'),
      placeholder: node.getAttribute('placeholder'),
      text: (node.textContent || '').replace(/\s+/g, ' ').trim(),
      href: node instanceof HTMLAnchorElement ? node.href : null,
    }))
  )
  .catch(() => []);

const result = {
  schemaVersion: 1,
  capturedAt,
  sourceUrl,
  finalUrl: page.url(),
  navigationError,
  title: await page.title().catch(() => ''),
  archiveLinkCount: archiveLinks.size,
  archiveLinks: [...archiveLinks.values()].sort((a, b) =>
    a.href.localeCompare(b.href)
  ),
  relevantNetworkResponses: responses,
  scriptSources,
  interactive,
  bodyText,
};

await writeFile(outputPath, JSON.stringify(result, null, 2) + '\n', 'utf8');

console.log(
  JSON.stringify(
    {
      capturedAt,
      finalUrl: result.finalUrl,
      archiveLinkCount: result.archiveLinkCount,
      relevantNetworkResponseCount: responses.length,
      jsonResponseCount: responses.filter(item => item.json !== undefined).length,
      scriptSourceCount: scriptSources.length,
      outputPath,
    },
    null,
    2
  )
);

await browser.close();
