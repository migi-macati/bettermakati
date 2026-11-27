import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { resolve, sep, extname } from 'node:path';
import { chromium } from '@playwright/test';

// Local production-build comparison, with ordinary HTTP caching and with the installed service worker.
// Count actual server responses, including 304s. Transfer is compressed body bytes.
const root = resolve(process.argv[2] || 'dist');
const serviceArchive = JSON.parse(await readFile(new URL('../src/data/serviceLegislation.generated.json', import.meta.url)));
const fullArchive = JSON.parse(await readFile(resolve(root, 'data/makati-legislation-index.json')));
for (const fragment of serviceArchive.fragments) {
  const matches = ([, type, number, , title]) =>
    ('City ' + type + ' No. ' + number + ' ' + number + ' ' + title).toLowerCase().includes(fragment);
  assert.deepEqual(serviceArchive.records.filter(matches), fullArchive.records.filter(matches),
    'Missing or changed archive records for ' + fragment);
}
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png' };
const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
const immutable = config.headers.find(rule => rule.headers.some(h => h.value.includes('immutable')));
const hashed = immutable && new RegExp('^' + immutable.source + '$');
assert(!hashed?.test('/assets/search.js') && !hashed?.test('/locales/en/common.json'));
const logoPaths = ['/bettermakati-logo-horizontal.svg', '/bettermakati-logo-horizontal-reverse.svg'];
const exactCacheHeaders = new Map(config.headers.flatMap(rule =>
  rule.headers.filter(header => header.key === 'Cache-Control').map(header => [rule.source, header.value])
));
let responses = [];
const server = createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const file = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + sep)) { res.writeHead(404).end(); return; }
  try {
    const raw = await readFile(file);
    const type = types[extname(file)] || 'application/octet-stream';
    const compressed = !type.startsWith('image/') || type === 'image/svg+xml';
    const body = compressed ? gzipSync(raw) : raw;
    const tag = '"' + createHash('sha256').update(body).digest('hex') + '"';
    const cached = req.headers['if-none-match'] === tag;
    res.setHeader('ETag', tag);
    res.setHeader('Cache-Control', exactCacheHeaders.get(pathname) ?? (hashed?.test(pathname) ? 'public, max-age=31536000, immutable' : pathname.startsWith('/locales/') ? 'max-age=3600' : 'max-age=0, must-revalidate'));
    res.setHeader('Content-Type', type);
    if (compressed) res.setHeader('Content-Encoding', 'gzip');
    responses.push({ pathname, bytes: cached ? 0 : body.length });
    res.writeHead(cached ? 304 : 200).end(cached ? undefined : body);
  } catch { responses.push({ pathname, bytes: 0, status: 404 }); res.writeHead(404).end(); }
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const url = 'http://127.0.0.1:' + server.address().port;
try {
  const journeys = [[390, 'en'], [1440, 'fil']];
  for (const [width, language, serviceWorkers] of ['block', 'allow'].flatMap(mode =>
    journeys.map(([width, language]) => [width, language, mode])
  )) {
    const browser = await chromium.launch({
      executablePath: process.env.CHROMIUM_EXECUTABLE || undefined,
      args: ['--host-resolver-rules=MAP fonts.googleapis.com ~NOTFOUND, MAP fonts.gstatic.com ~NOTFOUND'],
    });
    try {
      const page = await browser.newPage({ viewport: { width, height: 850 }, serviceWorkers });
      await page.addInitScript(lang => localStorage.setItem('i18nextLng', lang), language);
      for (const phase of ['cold', 'warm', 'search', 'archive']) {
        responses = [];
        if (phase === 'search') {
          const input = page.getByRole('combobox').first();
          await input.pressSequentially(language === 'fil' ? 'paano mag apply ng yellow card' : 'yellow card', { delay: 40 });
          if (language === 'fil') await input.fill('yellow card');
          await page.getByRole('option').filter({ hasText: 'Yellow Card' }).first().waitFor();
        } else if (phase === 'archive') {
          const archiveResponse = page.waitForResponse(r => new URL(r.url()).pathname === '/data/makati-legislation-index.json');
          await page.getByRole('combobox').first().fill('municipality of taytay');
          const archive = await archiveResponse;
          assert(archive.ok());
          await archive.finished();
          await page.getByRole('option').filter({ hasText: /City (Resolution|Ordinance) No\./ }).first().waitFor();
        } else {
          await page.goto(url);
          await page.locator('main h1').waitFor();
          if (serviceWorkers === 'allow') await page.waitForFunction(() => !!navigator.serviceWorker.controller);
        }
        await page.waitForLoadState('networkidle');
        const bytes = responses.reduce((sum, r) => sum + r.bytes, 0);
        const limits = { cold: [serviceWorkers === 'allow' ? 41 : 37, width === 390 ? 283000 : 332000], warm: [2, 4000], search: [22, 255000], archive: [2, 1050000] };
        const [maxRequests, maxBytes] = limits[phase];
        console.log({ width, language, serviceWorkers, phase, requests: responses.length, bytes });
        assert(!responses.some(r => r.status === 404), 'Missing homepage resource');
        assert(responses.length <= maxRequests && bytes <= maxBytes, 'Homepage request or transfer regression');
        if (phase === 'warm') assert(!responses.some(r => logoPaths.includes(r.pathname)), 'Revisited fresh logos');
        if (phase === 'cold') {
          for (const logo of logoPaths) assert(responses.some(r => r.pathname === logo), 'Missing brand image');
          const photos = responses.filter(r => r.pathname.includes('guadalupe-skyline'));
          assert.equal(photos.length, 1, 'Fetch one lead photo per viewport');
          assert(photos[0].pathname.includes(width === 390 ? '-400-' : '-640-'));
          assert(await page.locator('main figure img').evaluate(img => img.complete && img.naturalWidth > 0));
        }
        if (phase === 'cold' || phase === 'warm') assert(!responses.some(r => r.pathname.includes('/searchIndex-')));
        const archives = responses.filter(r => r.pathname === '/data/makati-legislation-index.json');
        assert.equal(archives.length, phase === 'archive' ? 1 : 0);
      }
    } finally { await browser.close(); }
  }
} finally { server.closeAllConnections(); server.close(); }
