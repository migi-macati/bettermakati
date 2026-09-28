import { readFile } from 'node:fs/promises';

const [
  closureRaw,
  electionCivic,
  electionsPage,
  native,
  calendar,
  app,
  navigation,
  searchIndex,
  home,
  explore,
  today,
  watchlistRaw,
  packageJson,
] = await Promise.all([
  readFile('data/wave5-civic-time-closure.json', 'utf8'),
  readFile('src/data/electionCivic.ts', 'utf8'),
  readFile('src/pages/Elections.tsx', 'utf8'),
  readFile('src/data/civicTimelineNative.ts', 'utf8'),
  readFile('src/pages/Calendar.tsx', 'utf8'),
  readFile('src/App.tsx', 'utf8'),
  readFile('src/data/navigation.ts', 'utf8'),
  readFile('src/data/searchIndex.ts', 'utf8'),
  readFile('src/pages/Home.tsx', 'utf8'),
  readFile('src/pages/VisitMakati.tsx', 'utf8'),
  readFile('src/pages/Today.tsx', 'utf8'),
  readFile('data/source-watchlist.json', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const closure = JSON.parse(closureRaw);
const problems = [];

if (closure.status !== 'closed-with-deployment-verification-deferred') {
  problems.push('Civic-time closure status changed.');
}
if (closure.canonicalRoute !== '/calendar') {
  problems.push('Calendar is no longer the canonical civic-time route.');
}

const ready = new Set(closure.readyDomains.map(item => item.domain));
for (const domain of [
  'legislation',
  'council-city-monitor',
  'accountability',
  'elections',
  'reports',
]) {
  if (!ready.has(domain)) problems.push('Closure ready-domain missing: ' + domain);
}

const deferred = new Set(closure.deferredDomains.map(item => item.domain));
for (const domain of ['statistics', 'public-records', 'services', 'mobility']) {
  if (!deferred.has(domain)) problems.push('Closure deferred-domain missing: ' + domain);
}

for (const marker of [
  'Republic Act No. 12326',
  "electionDate: '2028-11-13'",
  'supersededBske2026Milestones',
]) {
  if (!electionCivic.includes(marker)) problems.push('Election reconciliation missing: ' + marker);
}
if (
  !electionsPage.includes('Election day: November 13, 2028') ||
  !electionsPage.includes('Superseded 2026 schedule') ||
  !electionsPage.includes('owner="elections"')
) {
  problems.push('Elections page is not reconciled with the civic-time closure.');
}
if (
  !native.includes('nativeCurrentElectionTimelineItems') ||
  !native.includes("status: 'superseded'")
) {
  problems.push('Native timeline lacks current/superseded election schedule coverage.');
}

for (const forbiddenImport of [
  "from './cityIndicators'",
  "from './publicRecords'",
  "from './serviceDirectory'",
  "from './mobilityRoutes'",
  "from './mobilitySystems'",
]) {
  if (native.includes(forbiddenImport)) {
    problems.push('Deferred domain was incorrectly projected: ' + forbiddenImport);
  }
}

if (
  !calendar.includes('not an entertainment calendar') ||
  !calendar.includes('nativeCivicTimelineItems')
) {
  problems.push('Calendar product boundary changed.');
}

if (!app.includes('<Route path="/whats-on" element={<CompatibilityRedirect to="/calendar" />} />')) {
  problems.push('What’s On compatibility redirect is missing.');
}

for (const [label, content] of [
  ['navigation', navigation],
  ['search', searchIndex],
  ['homepage', home],
  ['Explore Makati', explore],
  ['Today', today],
]) {
  if (
    content.includes("href: '/whats-on'") ||
    content.includes('to="/whats-on"') ||
    content.includes("label: 'What’s On'") ||
    content.includes("label: 'What’s on'")
  ) {
    problems.push(label + ' still exposes retired What’s On navigation/content.');
  }
}

const watchlist = JSON.parse(watchlistRaw);
for (const id of [
  'pia-ra-12326-bske-current-schedule',
  'pna-ra-12326-bske-postponement',
]) {
  const watched = watchlist.find(item => item.id === id);
  if (!watched || !watched.affectedPages?.includes('/calendar')) {
    problems.push('Current election source is not monitored for Calendar freshness: ' + id);
  }
}

if ((packageJson.match(/npm run check:wave5-civic-time-closure/g) ?? []).length < 2) {
  problems.push('Civic-time closure guard is not present in build and quality.');
}

if (problems.length) {
  console.error('W5-7R6c civic-time closure failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}

console.log(
  'W5-7R6c civic-time closure passed: canonical Calendar ownership, current/superseded election schedule, domain readiness boundaries, retired What’s On surface, and deferred date semantics are intact.'
);
