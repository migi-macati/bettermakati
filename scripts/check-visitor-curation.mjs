import { readFile } from 'node:fs/promises';

const [
  curation,
  page,
  legacyData,
  navigation,
  home,
  searchIndex,
  packageJson,
] = await Promise.all([
  readFile('src/data/visitorCuration.ts', 'utf8'),
  readFile('src/pages/VisitMakati.tsx', 'utf8'),
  readFile('src/data/visitMakati.ts', 'utf8'),
  readFile('src/data/navigation.ts', 'utf8'),
  readFile('src/pages/Home.tsx', 'utf8'),
  readFile('src/data/searchIndex.ts', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const problems = [];

for (const marker of [
  'export type VisitorCanonicalReference',
  'export type VisitorExperience',
  'export const visitorExperiences',
  'export const visitorResources',
  'validateVisitorCuration',
  "kind: 'canonical-destination'",
  "kind: 'recurring-experience'",
  "identityRef: { type: 'place', id: 'ayala-museum' }",
  "identityRef: { type: 'place', id: 'ayala-triangle-gardens' }",
  "id: 'salcedo-saturday-market'",
  "id: 'legazpi-sunday-market'",
  "identityRef: { type: 'barangay', id: 'poblacion' }",
  "identityRef: { type: 'area', id: 'ayala-center' }",
  "id: 'make-it-makati'",
  "id: 'makati-official-portal'",
]) {
  if (!curation.includes(marker)) {
    problems.push('Visitor curation marker missing: ' + marker);
  }
}

const experienceBlock =
  curation
    .split('export const visitorExperiences: VisitorExperience[] = [')[1]
    ?.split('\n];\n\nexport const visitorResources')[0] ?? '';

const experienceCount = (
  experienceBlock.match(/^    id: '[^']+',$/gm) ?? []
).length;
const canonicalCount = (
  experienceBlock.match(/kind: 'canonical-destination'/g) ?? []
).length;
const recurringCount = (
  experienceBlock.match(/kind: 'recurring-experience'/g) ?? []
).length;

if (experienceCount !== 6 || canonicalCount !== 4 || recurringCount !== 2) {
  problems.push(
    'W5-6c expects 6 visitor records = 4 canonical destinations + 2 recurring experiences.'
  );
}

if (
  experienceBlock.includes("id: 'greenbelt'") ||
  /parking/i.test(experienceBlock)
) {
  problems.push(
    'Visitor curation must not restore standalone Greenbelt or Parking records.'
  );
}

if (
  legacyData.includes('export interface VisitorPlace') ||
  legacyData.includes('export const visitorPlaces')
) {
  problems.push(
    'Legacy visitor-place list must be removed after W5-6c migration.'
  );
}

for (const marker of [
  'visitorExperiences.filter',
  'canonicalStarts.map',
  'recurringExperiences.map',
  'visitorRefView',
  'visitorResources.map',
  'resource.areaRefs',
  "resolveDistrictReference({ type: 'area', id: areaId })",
  'visitorCurationSourceById',
  'date="2026-09-28"',
  "title={t('corePages.visit.seoTitle')}",
  'Understand the city as you explore it.',
  "aria-label={t('corePages.visit.sections')}",
  'Start with Makati itself.',
  "t('corePages.visit.recurring')",
  'Weekend markets',
  'id="city-context"',
  "t('corePages.visit.layers')",
  'id="live-discovery"',
  'Looking for something specific?',
  'Restaurants, cafés, shops and nightlife change quickly.',
  'Makati Calendar',
  'Cinemas &amp; showtimes',
  'Plan how to get there',
  "t('corePages.visit.external')",
  "id={'explore-' + experience.id}",
  "href: '/estates'",
  "href: '/barangays'",
  "href: '/heritage'",
  "href: '/history'",
  "href: '/mobility'",
  "href: '/calendar'",
]) {
  if (!page.includes(marker)) {
    problems.push('Visit page migration marker missing: ' + marker);
  }
}

if (
  page.includes('visitorPlaces.map') ||
  page.includes("name: 'Greenbelt'") ||
  page.includes('/parking') ||
  page.includes('Plan your visit') ||
  page.includes('Food & Places') ||
  page.includes("label: 'Eat & drink'")
) {
  problems.push(
    'Explore Makati page still contains a removed legacy visitor/directory pattern.'
  );
}

for (const marker of [
  "id: 'explore'",
  "labelKey: 'navigation.explore'",
  "href: '/visit'",
]) {
  if (!navigation.includes(marker)) {
    problems.push('Explore Makati navigation marker missing: ' + marker);
  }
}

for (const forbidden of [
  "label: 'Visit Makati'",
  "{ label: 'Parking', href: '/parking'",
]) {
  if (navigation.includes(forbidden)) {
    problems.push('Legacy Explore Makati navigation returned: ' + forbidden);
  }
}

for (const marker of [
  "key: 'explore'",
  "t('home.page.exploreTitle')",
  "key: 'districts'",
  "href: '/estates'",
  "{ key: 'cinemas', href: '/cinemas'",
]) {
  if (!home.includes(marker)) {
    problems.push('Homepage Explore Makati marker missing: ' + marker);
  }
}

for (const forbidden of [
  "label: 'Eat & drink'",
  "label: 'Parking'",
  "href: '/parking'",
  'Explore, eat and discover',
]) {
  if (home.includes(forbidden)) {
    problems.push('Homepage legacy visitor/directory pattern returned: ' + forbidden);
  }
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
    problems.push('Search Explore Makati marker missing: ' + marker);
  }
}

for (const forbidden of [
  "title: 'Visit Makati'",
  "title: 'Poblacion dining & nightlife'",
  "title: 'Ayala Museum',\n    group: 'Visit'",
  "title: 'Ayala Triangle Gardens',\n    group: 'Visit'",
]) {
  if (searchIndex.includes(forbidden)) {
    problems.push(
      'Search still duplicates or misframes Explore Makati content: ' + forbidden
    );
  }
}

if ((packageJson.match(/npm run check:visitor-curation/g) ?? []).length < 2) {
  problems.push(
    'Visitor-curation guard is not present in both build and quality.'
  );
}

if (problems.length) {
  console.error(
    'W5-6c visitor-curation check failed:\n- ' + problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'W5-6e Explore Makati check passed: six curated orientation records remain canonical/source-backed; Explore naming is aligned across page, navigation, homepage and Search; recurring experiences deep-link from Search; Civic Map/Areas/Mobility/Makati Calendar/Heritage/History cross-links remain explicit while BetterBarangay owns the homepage barangay entry; legacy tourism-directory and Parking patterns stay removed.'
);
