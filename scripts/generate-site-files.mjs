import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as yaml from 'js-yaml';

const productionHost =
  process.env.VITE_WEBSITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL
    : 'https://bettermakati.vercel.app');
const base = productionHost.replace(/\/$/, '');

const staticRoutes = [
  '/',
  '/about',
  '/privacy',
  '/terms',
  '/services',
  '/visit',
  '/mobility',
  '/cinemas',
  '/parking',
  '/whats-on',
  '/heritage',
  '/history',
  '/government',
  '/accountability',
  '/records',
  '/participate',
  '/today',
  '/barangays',
  '/elections',
  '/estates',
  '/statistics',
  '/legislation',
  '/news',
  '/live',
  '/projects-budget',
  '/community-tools',
  '/community-tools/saan-ako-lalapit',
  '/get-involved',
  '/contact',
  '/hotlines',
];

const extractSlugs = async file => {
  const text = await readFile(file, 'utf8');
  return [...text.matchAll(/\bslug:\s*['"]?([a-z0-9-]+)['"]?/g)].map(match => match[1]);
};

const barangaySlugs = await extractSlugs('src/data/barangays.ts');
const officialSlugs = await extractSlugs('src/data/electedOfficials.ts');

const serviceRoutes = [];
const serviceRoot = 'content/services';
for (const category of await readdir(serviceRoot)) {
  const indexPath = path.join(serviceRoot, category, 'index.yaml');
  try {
    const index = yaml.load(await readFile(indexPath, 'utf8'));
    if (!Array.isArray(index?.pages)) continue;
    serviceRoutes.push('/services/' + category);
    for (const page of index.pages) {
      if (page?.slug) serviceRoutes.push('/services/' + category + '/' + page.slug);
    }
  } catch {
    // Ignore non-service directories and incomplete starter content.
  }
}

const allowedCategories = new Set([
  'business',
  'health-services',
  'education',
  'social-welfare',
  'housing-land-use',
]);
const filteredServiceRoutes = serviceRoutes.filter(route => {
  const category = route.split('/')[2];
  return allowedCategories.has(category);
});

const routes = [
  ...staticRoutes,
  ...barangaySlugs.map(slug => '/barangays/' + slug),
  ...officialSlugs.map(slug => '/officials/' + slug),
  ...filteredServiceRoutes,
];

const uniqueRoutes = [...new Set(routes)].sort();
const today = new Date().toISOString().slice(0, 10);
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...uniqueRoutes.map(route =>
    '  <url><loc>' +
    base +
    (route === '/' ? '/' : route) +
    '</loc><lastmod>' +
    today +
    '</lastmod></url>'
  ),
  '</urlset>',
  '',
].join('\n');

await mkdir('public', { recursive: true });
await writeFile('public/sitemap.xml', xml);
await writeFile(
  'public/robots.txt',
  ['User-agent: *', 'Allow: /', 'Disallow: /search', 'Sitemap: ' + base + '/sitemap.xml', ''].join('\n')
);
console.log('Generated sitemap with ' + uniqueRoutes.length + ' public routes for ' + base);
