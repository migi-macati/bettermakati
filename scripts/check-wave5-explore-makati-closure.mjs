import { readFile } from 'node:fs/promises';

const [
  closureSource,
  curation,
  page,
  placesExplorer,
  searchIndex,
  navigation,
  home,
  legacyVisitData,
  packageJson,
] = await Promise.all([
  readFile('data/wave5-explore-makati-closure.json', 'utf8'),
  readFile('src/data/visitorCuration.ts', 'utf8'),
  readFile('src/pages/VisitMakati.tsx', 'utf8'),
  readFile('src/components/visit/PlacesExplorer.tsx', 'utf8'),
  readFile('src/data/searchIndex.ts', 'utf8'),
  readFile('src/data/navigation.ts', 'utf8'),
  readFile('src/pages/Home.tsx', 'utf8'),
  readFile('src/data/visitMakati.ts', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const closure = JSON.parse(closureSource);
const problems = [];

const blockBetween = (source, start, end) =>
  source.split(start)[1]?.split(end)[0] ?? '';

const sourceBlock = blockBetween(
  curation,
  'export const visitorCurationSources: VisitorCurationSource[] = [',
  '\n];\n\nexport const visitorExperiences'
);
const experienceBlock = blockBetween(
  curation,
  'export const visitorExperiences: VisitorExperience[] = [',
  '\n];\n\nexport const visitorResources'
);
const resourceBlock = blockBetween(
  curation,
  'export const visitorResources: VisitorResource[] = [',
  '\n];\n\nconst sourceById'
);

const sourceCount = (
  sourceBlock.match(/^    id: '[^']+',$/gm) ?? []
).length;
const firstPartyCount = (
  sourceBlock.match(/kind: 'first-party'/g) ?? []
).length;
const officialGovernmentCount = (
  sourceBlock.match(/kind: 'official-government'/g) ?? []
).length;
const currentSecondaryCount = (
  sourceBlock.match(/kind: 'current-secondary'/g) ?? []
).length;

const experienceIds = [
  ...experienceBlock.matchAll(/^    id: '([^']+)',$/gm),
].map(match => match[1]);
const canonicalCount = (
  experienceBlock.match(/kind: 'canonical-destination'/g) ?? []
).length;
const recurringCount = (
  experienceBlock.match(/kind: 'recurring-experience'/g) ?? []
).length;
const resourceCount = (
  resourceBlock.match(/^    id: '[^']+',$/gm) ?? []
).length;

const expectedExperienceIds = [
  'ayala-museum',
  'ayala-triangle-gardens',
  'salcedo-saturday-market',
  'legazpi-sunday-market',
  'poblacion',
  'ayala-center',
];

if (
  closure.closureStatus !==
  'closed-with-live-commercial-boundary-and-deployment-verification-deferred'
) {
  problems.push(
    'W5-6 closure status must preserve the live-commercial and deployment-verification boundaries.'
  );
}

if (
  sourceCount !== 13 ||
  firstPartyCount !== 8 ||
  officialGovernmentCount !== 2 ||
  currentSecondaryCount !== 3
) {
  problems.push(
    'W5-6 source closure expects 13 sources = 8 first-party + 2 official-government + 3 current-secondary.'
  );
}

if (
  JSON.stringify(experienceIds) !== JSON.stringify(expectedExperienceIds) ||
  canonicalCount !== 4 ||
  recurringCount !== 2 ||
  resourceCount !== 2
) {
  problems.push(
    'W5-6 curation closure expects 6 records = 4 canonical destinations + 2 recurring experiences, plus 2 visitor resources.'
  );
}

for (const marker of [
  "visitorCurationReviewedOn = '2026-09-28'",
  'assertCanonicalRef',
  'validateVisitorCuration',
  "identityRef: { type: 'place', id: 'ayala-museum' }",
  "identityRef: { type: 'place', id: 'ayala-triangle-gardens' }",
  "identityRef: { type: 'barangay', id: 'poblacion' }",
  "identityRef: { type: 'area', id: 'ayala-center' }",
  "{ type: 'place', id: 'jaime-velasquez-park' }",
  "{ type: 'area', id: 'salcedo-village' }",
  "{ type: 'area', id: 'legazpi-village' }",
]) {
  if (!curation.includes(marker)) {
    problems.push('Explore curation/canonical-reference marker missing: ' + marker);
  }
}

if (
  experienceBlock.includes("id: 'greenbelt'") ||
  /parking/i.test(experienceBlock)
) {
  problems.push(
    'Explore curation must not restore standalone Greenbelt or Parking records.'
  );
}

if (
  legacyVisitData.includes('export interface VisitorPlace') ||
  legacyVisitData.includes('export const visitorPlaces')
) {
  problems.push('Legacy visitorPlaces architecture returned.');
}

for (const marker of [
  'title="Explore Makati"',
  'Understand the city as you explore it.',
  'aria-label="Explore Makati sections"',
  'Start with Makati itself.',
  'Recurring experiences',
  'Weekend markets',
  'id="city-context"',
  'Explore Makati by layer.',
  'id="live-discovery"',
  'Restaurants, cafés, shops and nightlife change quickly.',
  'External resources',
  "id={'explore-' + experience.id}",
  'overflow-x-auto',
  'grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4',
]) {
  if (!page.includes(marker)) {
    problems.push('Explore page closure marker missing: ' + marker);
  }
}

for (const marker of [
  "href: '/estates'",
  "href: '/barangays'",
  "href: '/heritage'",
  "href: '/history'",
  "href: '/mobility'",
  "href: '/calendar'",
]) {
  if (!page.includes(marker)) {
    problems.push('Explore cross-link missing: ' + marker);
  }
}

for (const forbidden of [
  '/parking',
  'Plan your visit',
  'Food & Places',
  "label: 'Eat & drink'",
  "name: 'Greenbelt'",
  'visitorPlaces.map',
]) {
  if (page.includes(forbidden)) {
    problems.push('Removed Explore page pattern returned: ' + forbidden);
  }
}

for (const marker of [
  "fetch(\`/api/places?q=",
  'Google Maps',
  'Live place results are unavailable here.',
  'Open this search in Google Maps',
]) {
  if (!placesExplorer.includes(marker)) {
    problems.push('Live-discovery boundary marker missing: ' + marker);
  }
}

if (
  placesExplorer.includes('placeRegistry') ||
  placesExplorer.includes('visitorExperiences') ||
  searchIndex.includes('...results')
) {
  problems.push(
    'Live place-discovery results must not be promoted into canonical/search registries.'
  );
}

for (const marker of [
  "from './visitorCuration'",
  'const recurringVisitorItems: SearchItem[]',
  'const visitorResourceItems: SearchItem[]',
  "title: 'Explore Makati'",
  "canonicalKey: 'visitor:explore-makati'",
  "canonicalKey: 'visitor-experience:' + experience.id",
  "canonicalKey: 'visitor-resource:' + resource.id",
  "href: '/visit#explore-' + experience.id",
]) {
  if (!searchIndex.includes(marker)) {
    problems.push('Explore Search marker missing: ' + marker);
  }
}

for (const forbidden of [
  "title: 'Visit Makati'",
  "title: 'Poblacion dining & nightlife'",
  "title: 'Ayala Museum',\n    group: 'Visit'",
  "title: 'Ayala Triangle Gardens',\n    group: 'Visit'",
]) {
  if (searchIndex.includes(forbidden)) {
    problems.push('Search duplication/misframing returned: ' + forbidden);
  }
}

for (const marker of [
  "id: 'explore'",
  "labelKey: 'navigation.explore'",
  "href: '/visit'",
]) {
  if (!navigation.includes(marker)) {
    problems.push('Explore navigation marker missing: ' + marker);
  }
}

for (const forbidden of [
  "label: 'Visit Makati'",
  "{ label: 'Parking', href: '/parking'",
]) {
  if (navigation.includes(forbidden)) {
    problems.push('Legacy navigation returned: ' + forbidden);
  }
}

for (const marker of [
  "key: 'explore'",
  "t('home.page.exploreTitle')",
  "key: 'districts'",
  "href: '/estates'",
]) {
  if (!home.includes(marker)) {
    problems.push('Explore homepage marker missing: ' + marker);
  }
}

for (const forbidden of [
  "label: 'Eat & drink'",
  "label: 'Parking'",
  "href: '/parking'",
  'Explore, eat and discover',
]) {
  if (home.includes(forbidden)) {
    problems.push('Legacy homepage visitor pattern returned: ' + forbidden);
  }
}

const expectedCounts = {
  curationSources: 13,
  firstPartySources: 8,
  officialGovernmentSources: 2,
  currentSecondarySources: 3,
  curatedExperiences: 6,
  canonicalDestinations: 4,
  recurringExperiences: 2,
  visitorResources: 2,
};

for (const [key, value] of Object.entries(expectedCounts)) {
  if (closure.counts?.[key] !== value) {
    problems.push('W5-6 closure ledger count mismatch: ' + key);
  }
}

for (const required of [
  'commercial-directory',
  'market-operating-details',
  'greenbelt-identity',
  'parking',
]) {
  if (!(closure.bounded ?? []).some(item => item.id === required)) {
    problems.push('Required W5-6 bounded capability missing: ' + required);
  }
}

const deploymentDeferred = (closure.deferred ?? []).find(
  item => item.id === 'deployment-live-browser-verification'
);
if (
  deploymentDeferred?.status !== 'unverified' ||
  !deploymentDeferred?.nonClaim?.includes(
    'does not establish that W5-6 code caused the failure'
  )
) {
  problems.push(
    'W5-6 deployment/live-browser verification must remain explicitly unverified and non-attributed.'
  );
}

for (const script of [
  'check:visitor-curation',
  'check:wave5-explore-makati-closure',
]) {
  const occurrences = (
    packageJson.match(
      new RegExp('npm run ' + script.replace(':', '\\:'), 'g')
    ) ?? []
  ).length;
  if (occurrences < 2) {
    problems.push(
      'Explore dependency/closure gate is not present in both build and quality: ' +
        script
    );
  }
}

if (
  !closure.finalStatement?.startsWith(
    'W5-6 Explore Makati is closed at repository level'
  )
) {
  problems.push('W5-6 closure final statement is missing or overstated.');
}

if (problems.length) {
  console.error(
    'Wave 5.6 Explore Makati closure failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  [
    'Wave 5.6 Explore Makati closure passed:',
    sourceCount + ' reviewed sources',
    experienceIds.length + ' curated experiences',
    canonicalCount + ' canonical destinations',
    recurringCount + ' recurring experiences',
    resourceCount + ' visitor resources',
    'canonical cross-links retained with BetterBarangay owning the homepage barangay entry',
    'live commercial discovery remains external',
    'Parking remains removed',
    'fresh deployment/live-browser verification explicitly deferred',
  ].join(' ')
);
