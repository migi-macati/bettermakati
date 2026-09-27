import { readFile } from 'node:fs/promises';

const [
  bridgeSource,
  areaRegistrySource,
  placeRegistrySource,
  barangaySource,
] = await Promise.all([
  readFile('src/data/areaOrganizationCivicRelationships.ts', 'utf8'),
  readFile('src/data/areaOrganizationRegistry.ts', 'utf8'),
  readFile('src/data/placeRegistry.ts', 'utf8'),
  readFile('src/data/barangays.ts', 'utf8'),
]);

const problems = [];

for (const marker of [
  'areaOrganizationCivicRelationships',
  'createCivicIntelligenceRelationshipIndex',
  'areaOrganizationCivicNodeResolver',
  "ref.type === 'area'",
  "ref.type === 'organization'",
  "ref.type === 'place'",
  "ref.type === 'barangay'",
  "owner: 'area-registry'",
  "owner: 'place-registry'",
  "owner: 'barangays'",
  "relationship.kind === 'managed-by'",
  "relationship.kind === 'operated-by'",
  "relationship.kind === 'developed-by'",
  'civicRelationshipsForArea',
  'civicRelationshipsForOrganization',
  'civicRelationshipsForAreaPlace',
  'civicRelationshipsForAreaBarangay',
]) {
  if (!bridgeSource.includes(marker)) {
    problems.push('Area Civic Intelligence bridge marker missing: ' + marker);
  }
}

const areaRelationshipBlock =
  areaRegistrySource
    .split('export const civicAreaRelationships: CivicAreaRelationship[] = [')[1]
    ?.split('\n];\n\nvalidateAreaOrganizationRegistry')[0] ?? '';

const canonicalRelationshipIds = [
  ...areaRelationshipBlock.matchAll(/\bid:\s*'([^']+)'/g),
].map(match => match[1]);

if (canonicalRelationshipIds.length !== 29) {
  problems.push(
    'Expected 29 canonical area relationships, found ' +
      canonicalRelationshipIds.length +
      '.'
  );
}

if (
  !bridgeSource.includes(
    "id: 'area-registry-' + relationship.id"
  )
) {
  problems.push(
    'Civic Intelligence area edges must derive stable IDs from canonical area relationship IDs.'
  );
}

if (
  !bridgeSource.includes(
    'civicAreaRelationships.map(relationship => ({'
  )
) {
  problems.push(
    'Area Civic Intelligence edges must be derived from the canonical area registry rather than maintained as a second manual list.'
  );
}

for (const kind of [
  "'within-area': 'located-in'",
  "'within-barangay': 'located-in'",
  "'place-within-area': 'located-in'",
  "'managed-by': 'managed-by'",
  "'developed-by': 'developed-by'",
  "'operated-by': 'operated-by'",
]) {
  if (!bridgeSource.includes(kind)) {
    problems.push('Area relationship kind mapping missing: ' + kind);
  }
}

if (
  !bridgeSource.includes("basis: 'source-stated' as const") ||
  !bridgeSource.includes('sourceIds: relationship.evidence.sourceIds') ||
  !bridgeSource.includes('statement:') ||
  !bridgeSource.includes('relationship.evidence.evidenceStrength')
) {
  problems.push(
    'Canonical area relationship evidence is not being preserved in the Civic Intelligence bridge.'
  );
}

const placeBlock =
  placeRegistrySource
    .split('export const civicAssets: CivicAsset[] = [')[1]
    ?.split('const geometryTypeFor')[0] ?? '';
const placeIds = new Set(
  [...placeBlock.matchAll(/\bid:\s*'([^']+)'/g)].map(match => match[1])
);

const barangaySlugs = new Set(
  [...barangaySource.matchAll(/\bslug:\s*'([^']+)'/g)].map(
    match => match[1]
  )
);

const areaBlock =
  areaRegistrySource
    .split('export const civicAreas: CivicAreaRecord[] = [')[1]
    ?.split('\n];\n\nexport const civicOrganizations')[0] ?? '';
const organizationBlock =
  areaRegistrySource
    .split('export const civicOrganizations: CivicOrganizationRecord[] = [')[1]
    ?.split('\n];\n\nexport const civicAreaRelationships')[0] ?? '';

const areaIds = new Set(
  [...areaBlock.matchAll(/\bid:\s*'([^']+)'/g)].map(match => match[1])
);

const organizationIds = new Set(
  [...organizationBlock.matchAll(/\bid:\s*'([^']+)'/g)].map(
    match => match[1]
  )
);

for (const row of [
  ...areaRelationshipBlock.matchAll(/\n  \{\n([\s\S]*?)\n  \},?/g),
].map(match => match[1])) {
  const relationshipId =
    row.match(/\bid:\s*'([^']+)'/)?.[1] ?? 'unknown';
  const refs = [
    ...row.matchAll(
      /(?:from|to):\s*\{ type: '(area|organization|place|barangay)', id: '([^']+)' \}/g
    ),
  ];

  if (refs.length !== 2) {
    problems.push(
      'Could not parse both canonical relationship endpoints: ' +
        relationshipId
    );
    continue;
  }

  for (const [, type, id] of refs) {
    const exists =
      type === 'area'
        ? areaIds.has(id)
        : type === 'organization'
          ? organizationIds.has(id)
          : type === 'place'
            ? placeIds.has(id)
            : barangaySlugs.has(id);

    if (!exists) {
      problems.push(
        'Area Civic Intelligence canonical endpoint does not resolve: ' +
          relationshipId +
          ' -> ' +
          type +
          ':' +
          id
      );
    }
  }
}

for (const forbidden of [
  'Makati Central Business District',
  'Ayala Center Estate Association, Inc.',
  'Circuit Makati Estate Association, Inc.',
  'Bel-Air Village Association',
]) {
  if (bridgeSource.includes(forbidden)) {
    problems.push(
      'Area Civic Intelligence bridge duplicates canonical labels instead of resolving them: ' +
        forbidden
    );
  }
}

if (problems.length) {
  console.error(
    'Area Civic Intelligence relationship check failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  [
    'Area Civic Intelligence relationship check passed:',
    canonicalRelationshipIds.length + ' canonical relationships bridged',
    areaIds.size + ' area nodes',
    organizationIds.size + ' organization nodes',
    'canonical labels resolved at render time',
    'place and barangay endpoints validated',
    'source evidence preserved',
  ].join(' ')
);
