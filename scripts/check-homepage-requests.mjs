import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { resolve, sep, extname } from 'node:path';
import { chromium } from '@playwright/test';

// Local production-build comparison, with SW bypassed to isolate HTTP traffic.
// Count actual server responses, including 304s. Transfer is compressed body bytes.
const root = resolve(process.argv[2] || 'dist');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png' };
const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
const immutable = config.headers.find(rule => rule.headers.some(h => h.value.includes('immutable')));
const hashed = immutable && new RegExp('^' + immutable.source + '$');
assert(!hashed?.test('/assets/search.js') && !hashed?.test('/locales/en/common.json'));
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
    res.setHeader('Cache-Control', hashed?.test(pathname) ? 'public, max-age=31536000, immutable' : pathname.startsWith('/locales/') ? 'max-age=3600' : 'max-age=0, must-revalidate');
    res.setHeader('Content-Type', type);
    if (compressed) res.setHeader('Content-Encoding', 'gzip');
    responses.push({ pathname, bytes: cached ? 0 : body.length });
    res.writeHead(cached ? 304 : 200).end(cached ? undefined : body);
  } catch { res.writeHead(404).end(); }
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const url = 'http://127.0.0.1:' + server.address().port;
try {
  for (const [width, language] of [[390, 'en'], [1440, 'fil']]) {
    const browser = await chromium.launch({
      executablePath: process.env.CHROMIUM_EXECUTABLE || undefined,
      args: ['--host-resolver-rules=MAP fonts.googleapis.com ~NOTFOUND, MAP fonts.gstatic.com ~NOTFOUND'],
    });
    try {
      const page = await browser.newPage({ viewport: { width, height: 850 }, serviceWorkers: 'block' });
      await page.addInitScript(lang => localStorage.setItem('i18nextLng', lang), language);
      for (const phase of ['cold', 'warm', 'search']) {
        responses = [];
        if (phase === 'search') {
          const archiveResponse = page.waitForResponse(r => new URL(r.url()).pathname === '/data/makati-legislation-index.json');
          await page.getByRole('combobox').first().fill('yellow card');
          const archive = await archiveResponse;
          assert(archive.ok());
          await archive.finished();
          await page.getByRole('option').filter({ hasText: 'Yellow Card' }).first().waitFor();
        } else {
          await page.goto(url);
          await page.locator('main h1').waitFor();
        }
        await page.waitForLoadState('networkidle');
        const bytes = responses.reduce((sum, r) => sum + r.bytes, 0);
        const limits = { cold: [37, 405000], warm: [6, 4000], search: [32, 1250000] };
        const [maxRequests, maxBytes] = limits[phase];
        console.log({ width, language, phase, requests: responses.length, bytes });
        assert(responses.length <= maxRequests && bytes <= maxBytes, 'Homepage request or transfer regression');
        if (phase !== 'search') assert(!responses.some(r => r.pathname.includes('/searchIndex-')));
      }
    } finally { await browser.close(); }
  }
} finally { server.closeAllConnections(); server.close(); }
