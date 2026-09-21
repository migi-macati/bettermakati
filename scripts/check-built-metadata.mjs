import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const base = (process.env.VITE_WEBSITE_URL || 'https://bettermakati.org').replace(/\/$/, '');
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert(urls.some(url => url.includes('/services/guide/')), 'Service guides missing from sitemap');
assert(urls.some(url => /\/civic-map\/[^/]+$/.test(url) && !url.endsWith('/reports')), 'Civic assets missing from sitemap');
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
