import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const base = (process.env.VITE_WEBSITE_URL || 'https://bettermakati.org').replace(/\/$/, '');
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert.equal(urls.length, new Set(urls).size, 'Duplicate URLs in sitemap');
assert(!sitemap.includes('<lastmod>'), 'Sitemap must not publish deploy-time lastmod values');
assert(urls.includes(base + '/government-offices'), 'Government offices missing from sitemap');
assert(urls.includes(base + '/reports'), 'Featured Reports landing page missing from sitemap');
assert(urls.some(url => url.includes('/services/guide/')), 'Service guides missing from sitemap');
assert(urls.some(url => /\/civic-map\/[^/]+$/.test(url) && !url.endsWith('/reports')), 'Civic assets missing from sitemap');
assert(
  urls.some(url => url.endsWith('/civic-map/audits/park-accessibility-2026')),
  'Park accessibility audit missing from sitemap'
);
assert(
  urls.some(url => url.endsWith('/civic-map/audits/park-accessibility-2026/results')),
  'Park accessibility audit results missing from sitemap'
);

const reportFiles = (await readdir('src/data/reports')).filter(file => file.endsWith('.ts'));
for (const file of reportFiles) {
  const source = await readFile(path.join('src/data/reports', file), 'utf8');
  const slug = source.match(/\bslug:\s*['\"]([a-z0-9-]+)['\"]/)?.[1];
  assert(slug, `Featured report slug missing in ${file}`);
  assert(
    urls.includes(base + '/reports/' + slug),
    `Featured report missing from sitemap: ${slug}`
  );
}
for (const url of urls) {
  assert(url.startsWith(base + '/'), `Wrong canonical host: ${url}`);
  const html = await readFile(path.join('dist', new URL(url).pathname, 'index.html'), 'utf8');
  const canonicals = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"[^>]*>/g)];
  assert.equal(canonicals.length, 1, `Duplicate or missing canonical: ${url}`);
  assert.equal(canonicals[0][1], url);
  for (const name of ['og:url', 'og:title', 'og:description', 'og:image']) {
    const tags = [...html.matchAll(new RegExp(`<meta\\b[^>]*property="${name}"[^>]*content="([^"]*)"[^>]*>`, 'g'))];
    assert.equal(tags.length, 1, `Duplicate or missing ${name}: ${url}`);
    assert(tags[0][1], `Empty ${name}: ${url}`);
    if (name === 'og:url') assert.equal(tags[0][1], url);
    if (name === 'og:image') assert.equal(tags[0][1], base + '/og-image.png');
  }
  assert(!html.includes('bettermakati.vercel.app'), `Legacy domain in metadata: ${url}`);
}
console.log(`Built metadata passed for ${urls.length} public routes.`);
