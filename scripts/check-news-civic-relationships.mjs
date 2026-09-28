import { readFile } from 'node:fs/promises';
import { clusterNewsItems } from './news-clustering.mjs';

const [
  relationships,
  newsPage,
  todayPage,
  feed,
  types,
  mobilityPage,
] = await Promise.all([
  readFile('src/data/newsCivicRelationships.ts', 'utf8'),
  readFile('src/pages/News.tsx', 'utf8'),
  readFile('src/pages/Today.tsx', 'utf8'),
  readFile('scripts/news-feed.mjs', 'utf8'),
  readFile('src/data/newsTypes.ts', 'utf8'),
  readFile('src/pages/Mobility.tsx', 'utf8'),
]);

const problems = [];

for (const marker of [
  "from './barangays'",
  "from './areaOrganizationRegistry'",
  "from './placeRegistry'",
  "from './mobilitySystems'",
  "from './accountabilitySupplement'",
  "from './localLegislation'",
  "from './cityMonitor'",
  'explicit-title-mention',
  'explicit-description-mention',
  'explicit-reference',
  'shared-source-url',
  'direct-city',
  'direct-entity',
  'contextual',
]) {
  if (!relationships.includes(marker)) {
    problems.push('News civic-relationship marker missing: ' + marker);
  }
}

if (relationships.includes('url === item.sourceUrl')) {
  problems.push(
    'News relationships must not link City Monitor records by publisher-homepage equality.'
  );
}

for (const marker of [
  'Related in BetterMakati',
  'enrichment.relevanceLabel',
  'item.clusterSize',
  'Other coverage',
]) {
  if (!newsPage.includes(marker)) {
    problems.push('News presentation marker missing: ' + marker);
  }
}

if (!todayPage.includes('.filter(isTodayNewsCandidate)')) {
  problems.push('Today does not enforce direct-Makati relevance.');
}

if (!feed.includes('clusterNewsItems(items)')) {
  problems.push('Live news feed does not apply story clustering.');
}

if (
  !relationships.includes("href: '/mobility#system-' + service.id") ||
  !mobilityPage.includes("id={'system-' + service.id}")
) {
  problems.push('News-to-mobility relationships do not deep-link to canonical system cards.');
}

for (const marker of ['storyClusterId?', 'clusterSize?', 'relatedCoverage?']) {
  if (!types.includes(marker)) {
    problems.push('NewsItem cluster contract missing: ' + marker);
  }
}

const now = new Date('2026-09-28T05:00:00.000Z');
const base = {
  description: '',
  sourceUrl: 'https://example.com',
  sourceClass: 'news-media',
  sourceClassLabel: 'News media',
  freshness: 'current',
  ageDays: 0,
  todayEligible: true,
  clusterKey: '',
  retrievedAt: now.toISOString(),
  reviewCandidate: false,
  reviewReasons: [],
};

const clustered = clusterNewsItems([
  {
    ...base,
    title: 'Makati City Hall adopts four-day onsite workweek and longer service hours',
    link: 'https://example.com/a',
    pubDate: '2026-09-28T01:00:00.000Z',
    source: 'Publisher A',
  },
  {
    ...base,
    title: 'Makati City Hall adopts four-day onsite workweek with longer service hours',
    link: 'https://example.org/b',
    pubDate: '2026-09-28T02:00:00.000Z',
    source: 'Publisher B',
  },
  {
    ...base,
    title: 'Makati opens a new public park in another district',
    link: 'https://example.net/c',
    pubDate: '2026-09-28T03:00:00.000Z',
    source: 'Publisher C',
  },
]);

if (clustered.length !== 2) {
  problems.push(
    'Synthetic story clustering expected 2 clusters, received ' +
      clustered.length +
      '.'
  );
}

const workweek = clustered.find(item =>
  item.title.toLowerCase().includes('workweek')
);
if (!workweek || workweek.clusterSize !== 2 || workweek.relatedCoverage.length !== 1) {
  problems.push('Synthetic duplicate-story coverage was not preserved correctly.');
}

if (problems.length) {
  console.error('News relevance/relationship check failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}

console.log(
  'News relevance/relationship policy OK:',
  'direct/contextual relevance model',
  'conservative story clustering',
  'canonical entity links',
  'and no automatic domain promotion.'
);
