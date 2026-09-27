import { readFile } from 'node:fs/promises';

const [source, placeRegistrySource] = await Promise.all([
  readFile('src/data/areaOrganizationRegistry.ts', 'utf8'),
  readFile('src/data/placeRegistry.ts', 'utf8'),
]);

const problems = [];

for (const marker of [
  "export interface CivicAreaRecord",
  "export interface CivicOrganizationRecord",
  "export interface CivicAreaRelationship",
  "barangaySlugs: string[]",
  "geometry?: CivicAreaGeometry",
  "'within-area'",
  "'within-barangay'",
  "'managed-by'",
  "'developed-by'",
  "'place-within-area'",
  "channels: CivicOrganizationChannel[]",
  "sourceIds: string[]",
  "validateAreaOrganizationRegistry",
  "export const civicAreaRegistrySources: CivicAreaRegistrySource[] = [",
  "export const civicAreas: CivicAreaRecord[] = [",
  "export const civicOrganizations: CivicOrganizationRecord[] = [",
  "export const civicAreaRelationships: CivicAreaRelationship[] = [",
]) {
  if (!source.includes(marker)) {
    problems.push('Area/organization registry schema marker missing: ' + marker);
  }
}

if (/\b(?:lat|lng|centroid):\s*(?:number|\{)/.test(source)) {
  problems.push(
    'Area schema must not require a fake point or centroid for canonical areas.'
  );
}

if (!source.includes("['area', 'area']")) {
  problems.push('Area hierarchy endpoint validation is missing.');
}

if (!source.includes("['area', 'barangay']")) {
  problems.push('Area-to-barangay endpoint validation is missing.');
}

if (!source.includes("['area', 'organization']")) {
  problems.push('Area-to-organization endpoint validation is missing.');
}

if (!source.includes("['place', 'area']")) {
  problems.push('Place-to-area endpoint validation is missing.');
}

const blockBetween = (start, end) =>
  source.split(start)[1]?.split(end)[0] ?? '';

const areaBlock = blockBetween(
  'export const civicAreas: CivicAreaRecord[] = [',
  '\n];\n\nexport const civicOrganizations'
);
const organizationBlock = blockBetween(
  'export const civicOrganizations: CivicOrganizationRecord[] = [',
  '\n];\n\nexport const civicAreaRelationships'
);
const relationshipBlock = blockBetween(
  'export const civicAreaRelationships: CivicAreaRelationship[] = [',
  '\n];\n\nvalidateAreaOrganizationRegistry'
);
const sourceBlock = blockBetween(
  'export const civicAreaRegistrySources: CivicAreaRegistrySource[] = [',
  '\n];\n\nexport const civicAreas'
);

const parseRows = block =>
  [...block.matchAll(/\n  \{\n([\s\S]*?)\n  \},?/g)].map(match => match[1]);

const parseId = row => row.match(/\bid:\s*'([^']+)'/)?.[1] ?? null;

const areaRows = parseRows(areaBlock);
const organizationRows = parseRows(organizationBlock);
const relationshipRows = parseRows(relationshipBlock);
const registrySourceRows = parseRows(sourceBlock);

if (areaRows.length !== 13) {
  problems.push('Expected 13 canonical areas, found ' + areaRows.length + '.');
}
if (organizationRows.length !== 11) {
  problems.push(
    'Expected 11 canonical organizations, found ' +
      organizationRows.length +
      '.'
  );
}
if (relationshipRows.length !== 29) {
  problems.push(
    'Expected 29 source-backed area relationships, found ' +
      relationshipRows.length +
      '.'
  );
}
if (registrySourceRows.length < 35) {
  problems.push(
    'Expected the W5-3a2 authoritative source set to be populated; found only ' +
      registrySourceRows.length +
      ' sources.'
  );
}

const areaIds = areaRows.map(parseId).filter(Boolean);
const organizationIds = organizationRows.map(parseId).filter(Boolean);
const relationshipIds = relationshipRows.map(parseId).filter(Boolean);

for (const [label, ids] of [
  ['area', areaIds],
  ['organization', organizationIds],
  ['relationship', relationshipIds],
]) {
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) {
    problems.push(
      'Duplicate ' + label + ' IDs: ' + [...new Set(duplicates)].join(', ')
    );
  }
}

for (const expectedArea of [
  'makati-cbd',
  'ayala-center',
  'salcedo-village',
  'legazpi-village',
  'circuit-makati',
  'century-city',
  'rockwell-center',
  'bel-air-village',
  'dasmarinas-village',
  'forbes-park-village',
  'san-lorenzo-village',
  'urdaneta-village',
  'magallanes-village',
]) {
  if (!areaIds.includes(expectedArea)) {
    problems.push('Missing reconciled canonical area: ' + expectedArea);
  }
}

for (const expectedOrganization of [
  'makati-central-estate-association',
  'ayala-center-estate-association',
  'circuit-makati-estate-association',
  'century-city-estate-association',
  'rockwell-land-corporation',
  'bel-air-village-association',
  'dasmarinas-village-association',
  'forbes-park-association',
  'san-lorenzo-village-association',
  'urdaneta-village-association',
  'magallanes-village-association',
]) {
  if (!organizationIds.includes(expectedOrganization)) {
    problems.push(
      'Missing reconciled canonical organization: ' + expectedOrganization
    );
  }
}

if (source.includes("id: 'rockwell-center-association'")) {
  problems.push(
    'Unverified Rockwell Center Association must remain noncanonical.'
  );
}

if (
  relationshipBlock.includes("id: 'poblacion'") &&
  relationshipBlock.includes("makati-central-estate-association")
) {
  problems.push(
    'Unsupported MACEA-to-Poblacion relationship was propagated into the canonical registry.'
  );
}

if (/\bgeometry:\s*\{/.test(areaBlock)) {
  problems.push(
    'W5-3b2 must not fabricate estate/village geometry before the separate boundary evidence pass.'
  );
}

for (const row of relationshipRows) {
  if (
    !row.includes('sourceIds: [') ||
    !row.includes('evidenceStrength:')
  ) {
    problems.push(
      'Relationship lacks explicit source-backed evidence: ' +
        (parseId(row) ?? 'unknown')
    );
  }
}

const placeRegistryBlock =
  placeRegistrySource
    .split('export const civicAssets: CivicAsset[] = [')[1]
    ?.split('const geometryTypeFor')[0] ?? '';
const placeIds = new Set(
  [...placeRegistryBlock.matchAll(/\bid:\s*'([^']+)'/g)].map(match => match[1])
);

const placeWithinAreaRows = relationshipRows.filter(row =>
  row.includes("kind: 'place-within-area'")
);

if (placeWithinAreaRows.length !== 8) {
  problems.push(
    'Expected 8 directly sourced place-to-area relationships, found ' +
      placeWithinAreaRows.length +
      '.'
  );
}

const expectedPlaceAreaPairs = [
  ['ayala-triangle-gardens', 'makati-cbd'],
  ['one-ayala-terminal', 'makati-cbd'],
  ['ayala-fire-satellite', 'ayala-center'],
  ['jaime-velasquez-park', 'salcedo-village'],
  ['sec-headquarters', 'salcedo-village'],
  ['washington-sycip-park', 'makati-cbd'],
  ['legazpi-active-park', 'makati-cbd'],
  ['psa-makati-crs', 'circuit-makati'],
];

for (const row of placeWithinAreaRows) {
  const placeId =
    row.match(/from:\s*\{ type: 'place', id: '([^']+)' \}/)?.[1];
  const areaId =
    row.match(/to:\s*\{ type: 'area', id: '([^']+)' \}/)?.[1];

  if (!placeId || !areaId) {
    problems.push(
      'Malformed place-within-area relationship: ' +
        (parseId(row) ?? 'unknown')
    );
    continue;
  }

  if (!placeIds.has(placeId)) {
    problems.push(
      'Place-to-area relationship points to missing canonical place: ' +
        placeId
    );
  }

  if (!areaIds.includes(areaId)) {
    problems.push(
      'Place-to-area relationship points to missing canonical area: ' +
        areaId
    );
  }
}

for (const [placeId, areaId] of expectedPlaceAreaPairs) {
  const matched = placeWithinAreaRows.some(
    row =>
      row.includes("from: { type: 'place', id: '" + placeId + "' }") &&
      row.includes("to: { type: 'area', id: '" + areaId + "' }")
  );

  if (!matched) {
    problems.push(
      'Missing directly sourced place-to-area relationship: ' +
        placeId +
        ' -> ' +
        areaId
    );
  }
}

for (const deferredArea of ['century-city', 'rockwell-center']) {
  const hasDirectPlaceMembership = placeWithinAreaRows.some(row =>
    row.includes("to: { type: 'area', id: '" + deferredArea + "' }")
  );
  if (hasDirectPlaceMembership) {
    problems.push(
      'Century City / Rockwell place membership should remain deferred until a canonical Place record has direct source support: ' +
        deferredArea
    );
  }
}

if (problems.length) {
  console.error(
    'Area/organization registry schema check failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  [
    'Area/organization registry schema check passed:',
    'optional sourced area geometry',
    'multi-barangay support',
    'area hierarchy',
    'management/developer relationships',
    'organization channels',
    'place-to-area relationships',
    'relationship provenance',
    areaRows.length + ' canonical areas',
    organizationRows.length + ' canonical organizations',
    relationshipRows.length + ' source-backed relationships',
    placeWithinAreaRows.length + ' directly sourced place-to-area links',
    registrySourceRows.length + ' authoritative source records',
    'no unsourced geometry promoted',
  ].join(' ')
);
