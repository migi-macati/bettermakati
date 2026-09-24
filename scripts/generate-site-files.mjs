import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as yaml from 'js-yaml';

const productionHost = process.env.VITE_WEBSITE_URL || 'https://bettermakati.org';
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
  '/open-government',
  '/integrity',
  '/status',
  '/city-monitor',
  '/briefs',
  '/barangays',
  '/elections',
  '/estates',
  '/statistics',
  '/legislation',
  '/news',
  '/live',
  '/projects-budget',
  '/community-tools',
  '/civic-map',
  '/civic-map/reports',
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
const civicMapText = await readFile('src/data/civicMap.ts', 'utf8');
const civicAssetBlock = civicMapText.split('export const civicAssets')[1]?.split('const commonCriteria')[0] ?? '';
const civicAssetIds = [...civicAssetBlock.matchAll(/\bid:\s*'([^']+)'/g)].map(match => match[1]);
const serviceDirectoryText = await readFile('src/data/serviceDirectory.ts', 'utf8');
const serviceIds = [...serviceDirectoryText.matchAll(/\bid:\s*'([^']+)'/g)].map(match => match[1]);

const cityMonitorText = await readFile('src/data/cityMonitor.ts', 'utf8');
const cityMonitorBaseBlock =
  cityMonitorText.split('const baseCityMonitorRecords')[1]?.split(
    'const procurementMonitorRecords'
  )[0] ?? '';
const cityMonitorBaseIds = [
  ...cityMonitorBaseBlock.matchAll(/\bid:\s*'([^']+)'/g),
].map(match => match[1]);

const accountabilitySupplementText = await readFile(
  'src/data/accountabilitySupplement.ts',
  'utf8'
);
const procurementSeedBlock =
  accountabilitySupplementText.split('const procurementSeeds: ProcurementSeed[] = [')[1]?.split(
    'export const procurementProjectEntries'
  )[0] ?? '';
const procurementMonitorIds = [
  ...procurementSeedBlock.matchAll(/\bid:\s*'([^']+)'/g),
].map(match => 'monitor-procurement-' + match[1]);
const cityMonitorRecordIds = [...cityMonitorBaseIds, ...procurementMonitorIds];

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
  ...civicAssetIds.map(id => '/civic-map/' + id),
  ...serviceIds.map(id => '/services/guide/' + id),
  ...cityMonitorRecordIds.map(id => '/city-monitor/' + id),
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
try {
  const cityMonitorHistory = await readFile('data/city-monitor-source-history.json', 'utf8');
  await writeFile('public/city-monitor-source-history.json', cityMonitorHistory);
  try {
    const cityMonitorState = await readFile('data/city-monitor-source-state.json', 'utf8');
    await writeFile('public/city-monitor-source-state.json', cityMonitorState);
  } catch {
    await writeFile(
      'public/city-monitor-source-state.json',
      JSON.stringify({ version: 2, checkedAt: null, sources: [] }, null, 2) + '\n'
    );
  }

  const parsed = JSON.parse(cityMonitorHistory);
  const items = (Array.isArray(parsed.runs) ? parsed.runs : [])
    .flatMap(run =>
      (Array.isArray(run.changed) ? run.changed : []).map(item => ({
        ...item,
        checkedAt: run.checkedAt,
      }))
    )
    .slice(0, 60);

  const xmlEscape = value =>
    String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&apos;');

  const rss = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '<channel>',
    '<title>BetterMakati City Monitor</title>',
    '<link>' + base + '/city-monitor</link>',
    '<description>Detected changes in monitored official Makati civic sources. A source change is a review signal, not an interpreted government action.</description>',
    ...items.map(item => [
      '<item>',
      '<title>' + xmlEscape('Official source changed: ' + item.label) + '</title>',
      '<link>' + xmlEscape(item.url) + '</link>',
      '<guid isPermaLink="false">' + xmlEscape(item.id + '-' + item.checkedAt) + '</guid>',
      '<pubDate>' + new Date(item.checkedAt).toUTCString() + '</pubDate>',
      '<description>' + xmlEscape('BetterMakati detected a content change in the monitored official source. Review the original source before drawing a substantive conclusion.') + '</description>',
      '</item>',
    ].join('')),
    '</channel>',
    '</rss>',
    '',
  ].join('\n');
  await writeFile('public/city-monitor.rss.xml', rss);
} catch {
  await writeFile(
    'public/city-monitor-source-history.json',
    JSON.stringify({ version: 2, runs: [] }, null, 2) + '\n'
  );
  await writeFile(
    'public/city-monitor-source-state.json',
    JSON.stringify({ version: 2, checkedAt: null, sources: [] }, null, 2) + '\n'
  );
  await writeFile(
    'public/city-monitor.rss.xml',
    '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>BetterMakati City Monitor</title><link>' + base + '/city-monitor</link><description>No source-change history has been published yet.</description></channel></rss>\n'
  );
}

try {
  const civicBriefsText = await readFile('data/civic-briefs.json', 'utf8');
  await writeFile('public/civic-briefs.json', civicBriefsText);

  const parsed = JSON.parse(civicBriefsText);
  const briefs = (Array.isArray(parsed.briefs) ? parsed.briefs : []).slice(0, 60);
  const escapeXml = value =>
    String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&apos;');

  const rss = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '<channel>',
    '<title>BetterMakati Civic Briefs</title>',
    '<link>' + base + '/briefs</link>',
    '<description>Daily, weekly and monthly source-backed civic summaries generated only from validated City Monitor records. Source-change signals remain separate until reviewed.</description>',
    ...briefs.map(brief => [
      '<item>',
      '<title>' + escapeXml(brief.title + ' — ' + brief.periodEnd) + '</title>',
      '<link>' + escapeXml(base + '/briefs?brief=' + encodeURIComponent(brief.id)) + '</link>',
      '<guid isPermaLink="false">' + escapeXml('civic-brief-' + brief.id) + '</guid>',
      '<pubDate>' + new Date(brief.publishedAt).toUTCString() + '</pubDate>',
      '<description>' +
        escapeXml(
          String(brief.recordIds?.length ?? 0) +
            ' validated records; ' +
            String(brief.reviewSignals?.length ?? 0) +
            ' source-change signals awaiting review.'
        ) +
        '</description>',
      '</item>',
    ].join('')),
    '</channel>',
    '</rss>',
    '',
  ].join('\n');
  await writeFile('public/civic-briefs.rss.xml', rss);
} catch {
  await writeFile(
    'public/civic-briefs.json',
    JSON.stringify({ version: 1, briefs: [] }, null, 2) + '\n'
  );
  await writeFile(
    'public/civic-briefs.rss.xml',
    '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>BetterMakati Civic Briefs</title><link>' +
      base +
      '/briefs</link><description>No Civic Brief archive has been published yet.</description></channel></rss>\n'
  );
}

try {
  const pageAudit = await readFile('data/page-audit.json', 'utf8');
  await writeFile('public/page-audit.json', pageAudit);
} catch {
  await writeFile('public/page-audit.json', '[]\n');
}

try {
  const sourceHistory = await readFile('data/source-watch-history.json', 'utf8');
  await writeFile('public/source-watch-history.json', sourceHistory);
} catch {
  await writeFile(
    'public/source-watch-history.json',
    JSON.stringify({ version: 1, runs: [] }, null, 2) + '\n'
  );
}

try {
  const sourceWatchlist = await readFile('data/source-watchlist.json', 'utf8');
  await writeFile('public/source-watch-index.json', sourceWatchlist);
} catch {
  await writeFile('public/source-watch-index.json', '[]\n');
}

await writeFile(
  'public/robots.txt',
  ['User-agent: *', 'Allow: /', 'Disallow: /search', 'Sitemap: ' + base + '/sitemap.xml', ''].join('\n')
);
console.log('Generated sitemap with ' + uniqueRoutes.length + ' public routes for ' + base);
