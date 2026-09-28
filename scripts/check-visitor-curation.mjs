import { readFile } from 'node:fs/promises';

const [curation, page, legacyData, packageJson] = await Promise.all([
  readFile('src/data/visitorCuration.ts', 'utf8'),
  readFile('src/pages/VisitMakati.tsx', 'utf8'),
  readFile('src/data/visitMakati.ts', 'utf8'),
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
  'visitorExperiences.map',
  'visitorRefView',
  'visitorResources.map',
  'resource.areaRefs',
  "resolveDistrictReference({ type: 'area', id: areaId })",
  'visitorCurationSourceById',
  'date="2026-09-28"',
]) {
  if (!page.includes(marker)) {
    problems.push('Visit page migration marker missing: ' + marker);
  }
}

if (
  page.includes('visitorPlaces.map') ||
  page.includes("name: 'Greenbelt'") ||
  page.includes('/parking')
) {
  problems.push('Visit page still contains a removed legacy visitor pattern.');
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
  'W5-6c visitor-curation check passed: six curated orientation records use four canonical identities plus two recurring experiences; Greenbelt is represented through Ayala Center; visitor resources are source-backed; legacy visitorPlaces and Parking stay removed.'
);
