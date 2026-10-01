import { readFile } from 'node:fs/promises';

const [
  registry,
  geometry,
  civicBridge,
  barangays,
  barangayPage,
  estatesPage,
  searchIndex,
  navigation,
  districtResolver,
  mobility,
  visit,
  calendar,
  civicMapPage,
  civicAreaMap,
  packageJson,
] = await Promise.all([
  readFile('src/data/areaOrganizationRegistry.ts', 'utf8'),
  readFile('src/data/areaGeometry.ts', 'utf8'),
  readFile('src/data/areaOrganizationCivicRelationships.ts', 'utf8'),
  readFile('src/data/barangays.ts', 'utf8'),
  readFile('src/pages/BarangayProfile.tsx', 'utf8'),
  readFile('src/pages/Estates.tsx', 'utf8'),
  readFile('src/data/searchIndex.ts', 'utf8'),
  readFile('src/data/navigation.ts', 'utf8'),
  readFile('src/data/districtReferences.ts', 'utf8'),
  readFile('src/pages/Mobility.tsx', 'utf8'),
  readFile('src/pages/VisitMakati.tsx', 'utf8'),
  readFile('src/pages/Calendar.tsx', 'utf8'),
  readFile('src/pages/CivicMap.tsx', 'utf8'),
  readFile('src/components/civic/CivicAreaContextMap.tsx', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const problems = [];

const blockBetween = (source, start, end) =>
  source.split(start)[1]?.split(end)[0] ?? '';

const rows = block =>
  [...block.matchAll(/\n  \{\n([\s\S]*?)\n  \},?/g)].map(
    match => match[1]
  );
const rowId = row => row.match(/\bid:\s*'([^']+)'/)?.[1] ?? null;

const sourceBlock = blockBetween(
  registry,
  'export const civicAreaRegistrySources: CivicAreaRegistrySource[] = [',
  '\n];\n\nexport const civicAreas'
);
const areaBlock = blockBetween(
  registry,
  'export const civicAreas: CivicAreaRecord[] = [',
  '\n];\n\nexport const civicOrganizations'
);
const organizationBlock = blockBetween(
  registry,
  'export const civicOrganizations: CivicOrganizationRecord[] = [',
  '\n];\n\nexport const civicAreaRelationships'
);
const relationshipBlock = blockBetween(
  registry,
  'export const civicAreaRelationships: CivicAreaRelationship[] = [',
  '\n];\n\nvalidateAreaOrganizationRegistry'
);
const artifactBlock = blockBetween(
  geometry,
  'export const civicAreaGeometryArtifacts: CivicAreaGeometryArtifact[] = [',
  '\n];\n\nvalidateCivicAreaGeometryArtifacts'
);

const sourceRows = rows(sourceBlock);
const areaRows = rows(areaBlock);
const organizationRows = rows(organizationBlock);
const relationshipRows = rows(relationshipBlock);
const artifactRows = rows(artifactBlock);

const areaIds = areaRows.map(rowId).filter(Boolean);
const organizationIds = organizationRows.map(rowId).filter(Boolean);
const relationshipIds = relationshipRows.map(rowId).filter(Boolean);
const sourceIds = sourceRows.map(rowId).filter(Boolean);
const artifactIds = artifactRows.map(rowId).filter(Boolean);

const expectedAreas = [
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
];

const expectedOrganizations = [
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
];

for (const id of expectedAreas) {
  if (!areaIds.includes(id)) problems.push('Missing canonical area: ' + id);
}
for (const id of expectedOrganizations) {
  if (!organizationIds.includes(id)) {
    problems.push('Missing canonical organization: ' + id);
  }
}

if (areaIds.length !== 13) {
  problems.push('Wave 5.3 closure expects 13 canonical areas; found ' + areaIds.length + '.');
}
if (organizationIds.length !== 11) {
  problems.push(
    'Wave 5.3 closure expects 11 canonical organizations; found ' +
      organizationIds.length +
      '.'
  );
}
if (relationshipIds.length !== 29) {
  problems.push(
    'Wave 5.3 closure expects 29 source-backed relationships; found ' +
      relationshipIds.length +
      '.'
  );
}
if (sourceIds.length < 42) {
  problems.push(
    'Wave 5.3 closure expects at least 42 reconciled source records; found ' +
      sourceIds.length +
      '.'
  );
}

for (const [label, ids] of [
  ['area', areaIds],
  ['organization', organizationIds],
  ['relationship', relationshipIds],
  ['source', sourceIds],
  ['geometry artifact', artifactIds],
]) {
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) {
    problems.push(
      'Duplicate ' + label + ' IDs at Wave 5.3 closure: ' +
        [...new Set(duplicates)].join(', ')
    );
  }
}

/* Reconciliation decisions that must survive closure. */
if (registry.includes("id: 'rockwell-center-association'")) {
  problems.push('Unverified Rockwell Center Association was canonicalized.');
}

const maceaPoblacion = relationshipRows.some(
  row =>
    row.includes("id: 'poblacion'") &&
    row.includes("id: 'makati-central-estate-association'")
);
if (maceaPoblacion) {
  problems.push('Unsupported MACEA → Poblacion relationship returned.');
}

const placeAreaRows = relationshipRows.filter(row =>
  row.includes("kind: 'place-within-area'")
);
if (placeAreaRows.length !== 8) {
  problems.push(
    'Expected 8 directly sourced Place → Area relationships; found ' +
      placeAreaRows.length +
      '.'
  );
}

/* BetterBarangay must consume canonical Area/Organization records. */
const profileBlock = blockBetween(
  barangays,
  'const barangayBaseProfiles',
  'export const barangays'
);

if (/\bassociations\s*:/.test(profileBlock) || barangays.includes('associations?:')) {
  problems.push(
    'Legacy BetterBarangay association payloads remain after canonical migration.'
  );
}
if (barangayPage.includes('barangay.associations')) {
  problems.push('BarangayProfile still renders legacy association payloads.');
}

const communityAreaRefs = [
  ...profileBlock.matchAll(/communityAreaIds:\s*\[([^\]]*)\]/g),
].flatMap(match =>
  [...match[1].matchAll(/'([^']+)'/g)].map(item => item[1])
);
const expectedCommunityAreaRefs = [
  'bel-air-village',
  'dasmarinas-village',
  'forbes-park-village',
  'magallanes-village',
  'san-lorenzo-village',
  'urdaneta-village',
];

if (
  communityAreaRefs.length !== expectedCommunityAreaRefs.length ||
  expectedCommunityAreaRefs.some(id => !communityAreaRefs.includes(id))
) {
  problems.push(
    'BetterBarangay private-village references are not the six reconciled canonical Area IDs.'
  );
}

for (const marker of [
  'civicAreaRelationships',
  'civicAreaById',
  'civicOrganizationById',
  "href: '/estates#area-' + area.id",
  "href: '/estates#organization-' + organization.id",
]) {
  if (!barangayPage.includes(marker)) {
    problems.push('BetterBarangay canonical cross-link missing: ' + marker);
  }
}

/* Estates presentation is registry-driven and does not fake area points. */
for (const marker of [
  'civicAreas',
  'civicOrganizations',
  'civicAreaRelationships',
  'businessAreas.map(area =>',
  'residentialAreas.map(area =>',
  'civicOrganizations.map(organization =>',
  "id={'area-' + area.id}",
  "id={'organization-' + organization.id}",
]) {
  if (!estatesPage.includes(marker)) {
    problems.push('Canonical Estates presentation marker missing: ' + marker);
  }
}
if (/\bconst\s+estates\s*=/.test(estatesPage)) {
  problems.push('Estates page has regressed to a local hard-coded estates array.');
}
if (estatesPage.includes('mapsUrl(')) {
  problems.push('Estates page again synthesizes point maps for polygon areas.');
}

/* Civic Intelligence bridge remains derived rather than duplicated. */
for (const marker of [
  'civicAreaRelationships.map(relationship => ({',
  "id: 'area-registry-' + relationship.id",
  "ref.type === 'area'",
  "ref.type === 'organization'",
  "owner: 'area-registry'",
  "href: '/estates#area-' + area.id",
  "href: '/estates#organization-' + organization.id",
]) {
  if (!civicBridge.includes(marker)) {
    problems.push('Civic Intelligence Area bridge marker missing: ' + marker);
  }
}

/* Search + navigation. */
for (const marker of [
  "'Area'",
  "'Organization'",
  '...civicAreas.map(area => ({',
  '...civicOrganizations.map(organization => ({',
  "canonicalKey: 'area:' + area.id",
  "canonicalKey: 'organization:' + organization.id",
  "href: '/estates#area-' + area.id",
  "href: '/estates#organization-' + organization.id",
]) {
  if (!searchIndex.includes(marker)) {
    problems.push('Canonical search indexing marker missing: ' + marker);
  }
}
if (searchIndex.includes('barangay.associations')) {
  problems.push('Search index still depends on deleted barangay association payloads.');
}
if (
  !navigation.includes("id: 'areas'") ||
  !navigation.includes("labelKey: 'navigation.areas'") ||
  !navigation.includes("href: '/estates'")
) {
  problems.push('Estates navigation must keep a discoverable /estates entry.');
}

/* District-facing surfaces must resolve IDs through one canonical helper. */
for (const marker of [
  'civicAreaById.get(ref.id)',
  'findBarangay(ref.id)',
  "href: '/estates#area-' + area.id",
  "href: '/barangays/' + barangay.slug",
]) {
  if (!districtResolver.includes(marker)) {
    problems.push('District resolver marker missing: ' + marker);
  }
}

const districtSurfaceChecks = [
  [mobility, 'Mobility', 'resolveTripEndpoint'],
  [visit, 'Explore Makati', 'resolveDistrictReference'],
  [calendar, 'Makati Calendar', "resolveDistrictReference({ type: 'area', id: areaId })"],
];
for (const [source, label, marker] of districtSurfaceChecks) {
  if (!source.includes(marker)) {
    problems.push(label + ' is no longer resolving canonical district references.');
  }
}

/* Geometry is sparse, provenance-backed and visibly approximate. */
const expectedGeometryIds = [
  'dasmarinas-village-boundary-2026-09',
  'forbes-park-village-boundary-2026-09',
];
if (artifactIds.length !== 2) {
  problems.push(
    'Wave 5.3 closes with exactly two defensible area polygons; found ' +
      artifactIds.length +
      '.'
  );
}
for (const id of expectedGeometryIds) {
  if (!artifactIds.includes(id)) {
    problems.push('Required closure geometry artifact missing: ' + id);
  }
}

for (const marker of [
  "areaId: 'dasmarinas-village'",
  "areaId: 'forbes-park-village'",
  "kind: 'approximate-boundary'",
  'Approximate display boundary, not a cadastral or survey polygon.',
  'BetterMakati does not assert legal identity between Barangay Forbes Park and the private subdivision.',
]) {
  if (!artifactBlock.includes(marker)) {
    problems.push('Geometry provenance/caveat marker missing: ' + marker);
  }
}

const circuitRow =
  areaBlock.split("id: 'circuit-makati'")[1]?.split('\n  },')[0] ?? '';
if (circuitRow.includes('geometryId:')) {
  problems.push('Circuit Makati incorrectly regained unsupported geometry.');
}

/* Civic Map areas are a context layer, not Civic Asset records. */
for (const marker of [
  'civicAreaGeometryArtifacts',
  'boundsForAreaGeometry',
  'Districts &amp; estates',
  'Approximate boundary',
  'Areas without sourced geometry are not drawn.',
  "to={'/estates#area-' + area.id}",
]) {
  if (!civicAreaMap.includes(marker)) {
    problems.push('Civic Map Area context marker missing: ' + marker);
  }
}
if (civicAreaMap.includes('&marker=') || /\bcentroid\b/i.test(civicAreaMap)) {
  problems.push('Civic Map Area layer is inventing a marker or centroid.');
}
if (!civicMapPage.includes('<CivicAreaContextMap />')) {
  problems.push('Civic Map page no longer renders the Area context layer.');
}

/* Search-and-destroy known pre-canonical duplicate strings on migrated surfaces. */
const migratedSurfaces = [
  profileBlock,
  barangayPage,
  estatesPage,
  searchIndex,
  mobility,
  visit,
  calendar,
];
for (const legacy of [
  'Rockwell Center Association, Inc.',
  'Makati Central Estate Association (MACEA)',
  'Magallanes%20Village%20Association%20Makati',
  'Urdaneta%20Village%20Association%20Makati',
  "title: 'Bel-Air Village Association'",
  "title: 'Dasmariñas Village Association'",
  "title: 'Forbes Park Association'",
  "title: 'San Lorenzo Village Association'",
  "'Ayala Center Makati'",
  "'Salcedo Village Makati'",
  "'Legazpi Village Makati'",
  "'Poblacion Makati'",
  "'Rockwell Center Makati'",
  "'Century City Makati'",
]) {
  if (migratedSurfaces.some(source => source.includes(legacy))) {
    problems.push('Legacy duplicated estate/district content remains: ' + legacy);
  }
}

/* Existing component checks must stay gated in both build and quality. */
for (const script of [
  'check:area-registry',
  'check:area-geometry',
  'check:district-area-refs',
  'check:area-civic-relationships',
  'check:civic-intelligence-search',
  'check:civic-map',
]) {
  const occurrences = (
    packageJson.match(new RegExp('npm run ' + script.replace(':', '\\:'), 'g')) ??
    []
  ).length;
  if (occurrences < 2) {
    problems.push(
      'Wave 5.3 dependency gate is not present in both build and quality: ' +
        script
    );
  }
}

if (problems.length) {
  console.error(
    'Wave 5.3 Estates & Districts closure failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  [
    'Wave 5.3 Estates & Districts closure passed:',
    sourceIds.length + ' source records',
    areaIds.length + ' canonical areas',
    organizationIds.length + ' canonical organizations',
    relationshipIds.length + ' relationships',
    placeAreaRows.length + ' Place→Area links',
    communityAreaRefs.length + ' BetterBarangay private-village refs',
    artifactIds.length + ' approximate Area polygons',
    'registry-driven Estates/Search/Navigation',
    'canonical district refs on Mobility/Explore/Calendar',
    'Civic Intelligence bridge intact',
    'Civic Map context layer intact',
    'no known legacy duplicate estate strings on migrated surfaces',
  ].join(' ')
);
