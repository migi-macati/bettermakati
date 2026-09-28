import { readFile } from 'node:fs/promises';

const [
  auditRaw,
  history,
  heritage,
  estates,
  mobility,
  explore,
  calendar,
  news,
  home,
  navigation,
  searchIndex,
  app,
  packageJson,
] = await Promise.all([
  readFile('data/wave5-crosslink-audit.json', 'utf8'),
  readFile('src/pages/History.tsx', 'utf8'),
  readFile('src/pages/Heritage.tsx', 'utf8'),
  readFile('src/pages/Estates.tsx', 'utf8'),
  readFile('src/pages/Mobility.tsx', 'utf8'),
  readFile('src/pages/VisitMakati.tsx', 'utf8'),
  readFile('src/pages/Calendar.tsx', 'utf8'),
  readFile('src/pages/News.tsx', 'utf8'),
  readFile('src/pages/Home.tsx', 'utf8'),
  readFile('src/data/navigation.ts', 'utf8'),
  readFile('src/data/searchIndex.ts', 'utf8'),
  readFile('src/App.tsx', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const audit = JSON.parse(auditRaw);
const problems = [];

if (audit.status !== 'complete-with-bounded-ecosystem-handoffs') {
  problems.push('W5-9a cross-link audit status changed.');
}

const requireMarkers = (label, content, markers) => {
  for (const marker of markers) {
    if (!content.includes(marker)) {
      problems.push(label + ' cross-link marker missing: ' + marker);
    }
  }
};

requireMarkers('History', history, [
  'to="/heritage"',
  'to="/visit"',
  'to={`/civic-map/${place.id}`}',
  'to={`/barangays/${barangay.slug}`}',
]);

requireMarkers('Heritage', heritage, [
  "to={'/history?collection=' + route.id}",
  "to={'/civic-map/' + stop.id}",
  'to="/history"',
]);

requireMarkers('Estates', estates, [
  'to="/visit"',
  'to="/mobility"',
  "to={'/barangays/' + barangay.slug}",
  "to={'/civic-map/' + place.id}",
]);

requireMarkers('Mobility', mobility, [
  'to="/estates"',
  'to="/civic-map"',
  "to={'/civic-map/' + oneAyala.id}",
  "to={'/search?q=' + encodeURIComponent(service.name)}",
]);

requireMarkers('Explore Makati', explore, [
  "href: '/estates'",
  "href: '/barangays'",
  "href: '/heritage'",
  "href: '/history'",
  "href: '/mobility'",
  "href: '/calendar'",
  'to="/cinemas"',
]);

requireMarkers('Calendar', calendar, [
  'to={item.canonicalHref}',
  'href={primarySource.url}',
  "to="/city-monitor"",
  "to="/today"",
  "href: '/barangays/' + slug",
  "href: '/civic-map/' + placeId",
]);

requireMarkers('News', news, [
  'to="/city-monitor"',
  'to="/calendar"',
  'Related in BetterMakati',
  'to={relationship.href}',
]);

requireMarkers('Global ecosystem handoffs', navigation, [
  "label: 'National services — BetterGov'",
  "href: 'https://bettergov.ph/services'",
  "label: 'Other LGUs — BetterLGU'",
  "href: 'https://lgu.bettergov.ph/'",
]);

const parkingForbiddenSurfaces = [
  ['History', history],
  ['Heritage', heritage],
  ['Estates', estates],
  ['Mobility', mobility],
  ['Explore Makati', explore],
  ['Calendar', calendar],
  ['News', news],
  ['Home', home],
  ['Navigation', navigation],
  ['Search', searchIndex],
];

for (const [label, content] of parkingForbiddenSurfaces) {
  if (
    content.includes('to="/parking"') ||
    content.includes("href: '/parking'") ||
    content.includes("href="/parking"")
  ) {
    problems.push(label + ' restored a public Parking link.');
  }
}

if (
  !app.includes(
    '<Route path="/parking" element={<Navigate to="/visit" replace />} />'
  )
) {
  problems.push(
    'Legacy /parking compatibility redirect is missing or no longer points to Explore Makati.'
  );
}

const expectedDomainIds = [
  'history',
  'heritage',
  'estates-districts',
  'mobility',
  'explore-makati',
  'calendar',
  'news-discovery',
];
const actualDomainIds = (audit.domains || []).map(item => item.id);
if (
  JSON.stringify(actualDomainIds) !== JSON.stringify(expectedDomainIds)
) {
  problems.push('W5-9a domain audit set changed.');
}

for (const required of [
  'parking-feature',
  'all-to-all-crosslinking',
  'ecosystem-promotion',
]) {
  if (!(audit.removedOrBounded || []).some(item => item.id === required)) {
    problems.push('W5-9a bounded/removed rule missing: ' + required);
  }
}

if (audit.next !== 'W5-9b — Search & discovery audit') {
  problems.push('W5-9a next-step pointer changed.');
}

const occurrences = (
  packageJson.match(/npm run check:wave5-crosslinks/g) ?? []
).length;
if (occurrences < 2) {
  problems.push(
    'W5-9a cross-link guard is not present in both build and quality.'
  );
}

if (problems.length) {
  console.error(
    'W5-9a cross-link audit failed:\n- ' + problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'W5-9a cross-link audit passed: History, Heritage, Estates, Mobility, Explore, Calendar and News have useful canonical continuations; Parking stays removed; BetterGov/BetterLGU remain bounded global handoffs.'
);
