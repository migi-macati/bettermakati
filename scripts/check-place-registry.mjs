import { readFile } from 'node:fs/promises';

const text = await readFile('src/data/placeRegistry.ts', 'utf8');
const mobilityPage = await readFile('src/pages/Mobility.tsx', 'utf8');
const servicesPage = await readFile('src/pages/Services.tsx', 'utf8');
const governmentOfficesPage = await readFile('src/pages/GovernmentOffices.tsx', 'utf8');
const governmentOfficesSource = await readFile('src/data/governmentServiceOffices.ts', 'utf8');
const problems = [];

const requiredExports = [
  'placeHasBarangay',
  'placesByBarangay',
  'placesByCategory',
  'placeOffersService',
  'placesByService',
  'placesByLifecycle',
  'placeDistanceKm',
  'placesWithinDistance',
];

for (const name of requiredExports) {
  if (!text.includes('export const ' + name) && !text.includes('export interface ' + name)) {
    problems.push('Missing Place Registry selector/export: ' + name);
  }
}

for (const marker of [
  'const legacyBarangayParts',
  'place.secondaryCategories?.some',
  'item.serviceId',
  'place.lifecycle.status === status',
  'Math.atan2',
  '.sort((a, b) => a.distanceKm - b.distanceKm',
]) {
  if (!text.includes(marker)) {
    problems.push('Place Registry selector implementation is missing expected behavior: ' + marker);
  }
}

const assetBlock = text.split('export const civicAssets')[1]?.split('const geometryTypeFor')[0] ?? '';
const assetIds = [...assetBlock.matchAll(/\bid:\s*'([^']+)'/g)].map(match => match[1]);
if (assetIds.length !== 88) {
  problems.push('Expected 88 migrated Civic Map assets but found ' + assetIds.length + '.');
}
const duplicateIds = assetIds.filter((id, index) => assetIds.indexOf(id) !== index);
if (duplicateIds.length) {
  problems.push('Duplicate migrated place IDs: ' + [...new Set(duplicateIds)].join(', '));
}

const transportRows = assetBlock
  .split(/\n\s*\{/)
  .filter(block => /type:\s*'transport-(stop|terminal)'/.test(block));
const verifiedTransportRows = transportRows.filter(block =>
  /status:\s*'mapped'/.test(block) &&
  /sourceUrl:/.test(block) &&
  /coordinateSourceUrl:/.test(block)
);
if (verifiedTransportRows.length !== 10) {
  problems.push(
    'Expected 10 verified transport stops/terminals for Mobility reuse but found ' +
      verifiedTransportRows.length +
      '.'
  );
}

for (const marker of [
  "...placesByCategory('transport-stop')",
  "...placesByCategory('transport-terminal')",
  "place.verification.status === 'verified'",
  'id="transport-anchors"',
  "to={'/civic-map/' + place.id}",
  "place.tags.includes('MRT-3')",
  "place.tags.includes('EDSA Busway')",
  "place.tags.includes('Pasig River Ferry')",
]) {
  if (!mobilityPage.includes(marker)) {
    problems.push('Mobility Place Registry integration is missing: ' + marker);
  }
}

const governmentOfficePlaceIds = [
  ...governmentOfficesSource.matchAll(/placeId:\s*'([^']+)'/g),
].map(match => match[1]);
const expectedGovernmentOfficePlaceIds = [
  'psa-makati-crs',
  'makati-central-fire-station',
  'lto-makati-district',
  'sec-headquarters',
];

if (governmentOfficePlaceIds.length !== expectedGovernmentOfficePlaceIds.length) {
  problems.push(
    'Expected ' +
      expectedGovernmentOfficePlaceIds.length +
      ' explicit government-office place links but found ' +
      governmentOfficePlaceIds.length +
      '.'
  );
}

for (const placeId of expectedGovernmentOfficePlaceIds) {
  if (!governmentOfficePlaceIds.includes(placeId)) {
    problems.push('Missing explicit government-office place link: ' + placeId);
  }
  if (!assetIds.includes(placeId)) {
    problems.push('Government-office place link targets a missing registry place: ' + placeId);
  }
}

for (const marker of [
  "placesByBarangay(barangay.name)",
  "place.primaryCategory === 'health-center'",
  "place.primaryCategory === 'community-center'",
  "place.tags.includes('service')",
  "to={'/civic-map/' + place.id}",
  "withBarangayScope('/civic-map', barangay.slug)",
]) {
  if (!servicesPage.includes(marker)) {
    problems.push('Services Place Registry integration is missing: ' + marker);
  }
}

for (const marker of [
  'placeRegistryById.get(office.placeId)',
  "to={'/civic-map/' + place.id}",
]) {
  if (!governmentOfficesPage.includes(marker)) {
    problems.push('Government Offices Place Registry integration is missing: ' + marker);
  }
}

if (governmentOfficesPage.includes('Place Registry')) {
  problems.push('Government Offices must not expose Place Registry implementation language in the UI.');
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log(
  'Place Registry selectors passed static integrity checks: ' +
  requiredExports.length + ' selector exports, ' + assetIds.length + ' preserved place IDs, ' + verifiedTransportRows.length + ' verified Mobility transport anchors, and ' + governmentOfficePlaceIds.length + ' explicit government-office place links.'
);
