import { readFile } from 'node:fs/promises';

const [
  auditRaw,
  index,
  search,
  searchPage,
  hero,
  navbar,
  navigation,
  app,
  packageJson,
] = await Promise.all([
  readFile('data/wave5-search-discovery-audit.json', 'utf8'),
  readFile('src/data/searchIndex.ts', 'utf8'),
  readFile('src/components/home/ServiceSearch.tsx', 'utf8'),
  readFile('src/pages/Search.tsx', 'utf8'),
  readFile('src/components/sections/Hero.tsx', 'utf8'),
  readFile('src/components/layout/Navbar.tsx', 'utf8'),
  readFile('src/data/navigation.ts', 'utf8'),
  readFile('src/App.tsx', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const audit = JSON.parse(auditRaw);
const problems = [];

if (audit.status !== 'complete-with-bounded-external-handoffs') {
  problems.push('W5-9b audit status changed.');
}

if (
  !hero.includes('<ServiceSearch') ||
  !hero.includes('scope="site"')
) {
  problems.push('Homepage no longer exposes shared site Search.');
}

const navbarSearchLinks =
  (navbar.match(/to="\/search"/g) ?? []).length +
  (navbar.match(/to=\{searchHref\}/g) ?? []).length;
if (navbarSearchLinks < 2) {
  problems.push(
    'Navbar must expose Search in both desktop and compact/mobile controls.'
  );
}

for (const marker of [
  '<ServiceSearch',
  'scope="site"',
  'Search BetterMakati',
  'districts and estates',
  'organizations',
]) {
  if (!searchPage.includes(marker)) {
    problems.push('Dedicated Search page marker missing: ' + marker);
  }
}

for (const marker of [
  "title: 'Explore Makati'",
  "title: 'Heritage & Culture'",
  "title: 'History of Makati'",
  "title: 'Getting around Makati'",
  "title: 'Estates, Districts & Associations'",
  "title: 'Makati Calendar'",
  "title: 'Makati in the News'",
  "...makatiHistory.map",
  "...placeRegistry",
  "...civicAreas.map",
  "...civicOrganizations.map",
  "...mobilityServices.map",
  "...mobilityRouteCorridors.map",
  "...mobilityNetworkRelationships",
  "for (const item of nativeCivicTimelineItems)",
]) {
  if (!index.includes(marker)) {
    problems.push('Wave 5 Search coverage marker missing: ' + marker);
  }
}

for (const marker of [
  "canonicalKey: 'history:' + event.id",
  "canonicalKey: 'barangay:' + barangay.slug",
  "'civic-registry:' + record.entityKind + ':' + record.id",
  "canonicalKey: 'area:' + area.id",
  "canonicalKey: 'organization:' + organization.id",
  "canonicalKey: 'mobility-service:' + service.id",
  "canonicalKey: 'mobility-route:' + route.id",
  "canonicalKey: 'mobility-network:' + relationship.id",
  "canonicalKey: 'tool:makati-calendar'",
]) {
  if (!index.includes(marker)) {
    problems.push('Stable canonical Search key missing: ' + marker);
  }
}

for (const alias of [
  'whats on what is on event events upcoming happenings schedule',
  'visit Makati visitor guide tourist tourism things to do sights destinations',
  'current affairs current events updates breaking',
]) {
  if (!index.includes(alias)) {
    problems.push('Search alias coverage missing: ' + alias);
  }
}

for (const marker of [
  "'Organizations'",
  "if (tab === 'Organizations') return item.group === 'Organization';",
]) {
  if (!search.includes(marker)) {
    problems.push('Organizations Search filter missing: ' + marker);
  }
}

const governmentBlock =
  search.split("if (tab === 'Government')")[1]
    ?.split("if (tab === 'Organizations')")[0] ?? '';
if (governmentBlock.includes("item.group === 'Organization'")) {
  problems.push('Private/civic organizations are still classified under Government Search.');
}

for (const marker of [
  "label: 'Explore Makati'",
  "{ label: 'Areas & Districts', href: '/estates' }",
  "{ label: 'Getting Around', href: '/mobility' }",
  "{ label: 'Heritage & Culture', href: '/heritage' }",
  "{ label: 'History of Makati', href: '/history' }",
]) {
  if (!navigation.includes(marker)) {
    problems.push('Explore navigation discovery marker missing: ' + marker);
  }
}

if (
  index.includes("title: 'What's On'") ||
  index.includes('href: \'/whats-on\'') ||
  index.includes('href: \'/parking\'')
) {
  problems.push(
    'Retired What’s On or Parking surface returned as a canonical Search result.'
  );
}

for (const redirect of [
  '<Route path="/whats-on" element={<CompatibilityRedirect to="/calendar" />} />',
  '<Route path="/parking" element={<CompatibilityRedirect to="/visit" />} />',
]) {
  if (!app.includes(redirect)) {
    problems.push('Legacy compatibility redirect missing: ' + redirect);
  }
}

for (const marker of [
  'Search national services on BetterGov',
  'https://bettergov.ph/services?search=',
  'Find another LGU on BetterLGU',
  'https://lgu.bettergov.ph/',
  'No matching result',
  'Report a missing result',
]) {
  if (!search.includes(marker)) {
    problems.push('No-result discovery/handoff marker missing: ' + marker);
  }
}

if (
  index.includes('bettergov.ph') ||
  index.includes('lgu.bettergov.ph') ||
  index.includes('ecosystem-resource:')
) {
  problems.push(
    'BetterGov/BetterLGU must remain external Search handoffs rather than local indexed entities.'
  );
}

for (const id of [
  'history',
  'heritage',
  'estates-districts',
  'mobility',
  'explore-makati',
  'calendar',
  'news',
  'barangays',
  'civic-registry',
]) {
  if (!(audit.wave5Coverage || []).some(item => item.id === id)) {
    problems.push('W5-9b coverage ledger missing domain: ' + id);
  }
}

for (const id of [
  'semantic-universal-search',
  'external-ecosystem-cloning',
  'retired-directory-restoration',
]) {
  if (!(audit.bounded || []).some(item => item.id === id)) {
    problems.push('W5-9b bounded capability missing: ' + id);
  }
}

if (audit.next !== 'W5-9c — Responsive, accessibility & visual QA') {
  problems.push('W5-9b next-step pointer changed.');
}

const occurrences = (
  packageJson.match(/npm run check:wave5-search-discovery/g) ?? []
).length;
if (occurrences < 2) {
  problems.push(
    'W5-9b Search/discovery guard is not present in both build and quality.'
  );
}

if (problems.length) {
  console.error(
    'W5-9b Search & discovery audit failed:\n- ' + problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'W5-9b Search & discovery audit passed: global entry points, canonical Wave 5 indexing, aliases, organization filtering, Explore navigation, ecosystem handoffs and retired-surface boundaries are intact.'
);
