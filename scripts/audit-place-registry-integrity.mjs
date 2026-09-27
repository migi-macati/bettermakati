import { readFile } from 'node:fs/promises';

const [
  registrySource,
  barangaySource,
  entityIndexSource,
  serviceDirectorySource,
  accountabilitySource,
  accountabilitySupplementSource,
  cityMonitorSource,
  visitMakatiSource,
  makatiHistorySource,
] = await Promise.all([
  readFile('src/data/placeRegistry.ts', 'utf8'),
  readFile('src/data/barangays.ts', 'utf8'),
  readFile('data/civic-entity-index.mjs', 'utf8'),
  readFile('src/data/serviceDirectory.ts', 'utf8'),
  readFile('src/data/accountability.ts', 'utf8'),
  readFile('src/data/accountabilitySupplement.ts', 'utf8'),
  readFile('src/data/cityMonitor.ts', 'utf8'),
  readFile('src/data/visitMakati.ts', 'utf8'),
  readFile('src/data/makatiHistory.ts', 'utf8'),
]);

const problems = [];

const normalizeText = value =>
  String(value || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('en-PH')
    .replace(/\bsta\.?(?=\s|$)/g, 'santa')
    .replace(/\s+/g, ' ')
    .trim();

const duplicateValues = values =>
  [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];

const parseSingleQuotedProperty = (row, property) =>
  row.match(new RegExp('\\b' + property + ":\\s*'([^']+)'"))?.[1] ?? null;

const parseNumberProperty = (row, property) => {
  const value = row.match(
    new RegExp('\\b' + property + ':\\s*(-?[0-9]+(?:\\.[0-9]+)?)')
  )?.[1];
  return value === undefined ? null : Number(value);
};

const assetBlock =
  registrySource
    .split('export const civicAssets: CivicAsset[] = [')[1]
    ?.split('const geometryTypeFor')[0] ?? '';

const assetRows = [...assetBlock.matchAll(/\n  \{\n([\s\S]*?)\n  \},?/g)].map(
  match => match[1]
);

const assets = assetRows.map(row => ({
  row,
  id: parseSingleQuotedProperty(row, 'id'),
  title: parseSingleQuotedProperty(row, 'title'),
  type: parseSingleQuotedProperty(row, 'type'),
  barangay: parseSingleQuotedProperty(row, 'barangay'),
  lat: parseNumberProperty(row, 'lat'),
  lng: parseNumberProperty(row, 'lng'),
  status: parseSingleQuotedProperty(row, 'status'),
  sourceUrl: parseSingleQuotedProperty(row, 'sourceUrl'),
  sourceLabel: parseSingleQuotedProperty(row, 'sourceLabel'),
  coordinateSourceUrl: parseSingleQuotedProperty(row, 'coordinateSourceUrl'),
  coordinateSourceLabel: parseSingleQuotedProperty(row, 'coordinateSourceLabel'),
}));

if (!assets.length) {
  problems.push('Could not parse any Civic Registry seed records.');
}

const assetIds = assets.map(asset => asset.id).filter(Boolean);
const duplicateAssetIds = duplicateValues(assetIds);
if (duplicateAssetIds.length) {
  problems.push('Duplicate Place Registry IDs: ' + duplicateAssetIds.join(', '));
}

for (const asset of assets) {
  if (!asset.id) {
    problems.push('Registry seed record is missing an id.');
    continue;
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(asset.id)) {
    problems.push('Registry ID is not lowercase kebab-case: ' + asset.id);
  }
  if (!asset.title) {
    problems.push('Registry record is missing a title: ' + asset.id);
  }
}

/* Canonical barangay membership */
const canonicalBarangays = [
  ...barangaySource.matchAll(
    /\{\s*slug:\s*'([^']+)',\s*name:\s*'([^']+)'/g
  ),
].map(match => ({
  slug: match[1],
  name: match[2],
}));

if (canonicalBarangays.length !== 23) {
  problems.push(
    'Expected 23 current Makati barangays but parsed ' +
      canonicalBarangays.length +
      '.'
  );
}

const barangayNames = new Set(
  canonicalBarangays.map(barangay => normalizeText(barangay.name))
);

for (const asset of assets) {
  if (!asset.barangay) continue;
  const parts = asset.barangay
    .split('/')
    .map(value => value.trim())
    .filter(Boolean);

  if (!parts.length) {
    problems.push('Empty barangay assignment: ' + asset.id);
    continue;
  }

  for (const part of parts) {
    if (!barangayNames.has(normalizeText(part))) {
      problems.push(
        'Unknown current Makati barangay on ' + asset.id + ': ' + part
      );
    }
  }
}

/* Coordinates */
const coordinateKeys = new Map();
for (const asset of assets) {
  if (!Number.isFinite(asset.lat) || !Number.isFinite(asset.lng)) {
    problems.push('Missing or non-numeric coordinates: ' + asset.id);
    continue;
  }

  if (asset.lat < -90 || asset.lat > 90 || asset.lng < -180 || asset.lng > 180) {
    problems.push(
      'Invalid WGS84 coordinates on ' +
        asset.id +
        ': ' +
        asset.lat +
        ', ' +
        asset.lng
    );
    continue;
  }

  // Current registry seeds are Makati places/segments or Makati-serving transport records.
  // This loose Metro Manila envelope catches swapped/zero/far-away coordinates without
  // pretending to validate exact administrative boundaries.
  if (
    asset.lat < 14.45 ||
    asset.lat > 14.70 ||
    asset.lng < 120.90 ||
    asset.lng > 121.20
  ) {
    problems.push(
      'Coordinate falls outside the Makati/Metro Manila registry envelope on ' +
        asset.id +
        ': ' +
        asset.lat +
        ', ' +
        asset.lng
    );
  }

  const key = asset.lat.toFixed(6) + ',' + asset.lng.toFixed(6);
  const atPoint = coordinateKeys.get(key) ?? [];
  atPoint.push(asset.id);
  coordinateKeys.set(key, atPoint);
}

for (const [coordinate, ids] of coordinateKeys) {
  if (ids.length > 1) {
    problems.push(
      'Exact duplicate registry coordinate ' +
        coordinate +
        ' is assigned to: ' +
        ids.join(', ')
    );
  }
}

/* Verification/provenance */
if (
  !registrySource.includes(
    "asset.status === 'mapped' && asset.sourceUrl && asset.coordinateSourceUrl"
  )
) {
  problems.push(
    'Verified Place Registry status must continue to require mapping plus identity and coordinate sources.'
  );
}

if (
  !registrySource.includes('sources: placeSourcesFor(asset)') ||
  !registrySource.includes('assertions: placeAssertionsFor(asset)')
) {
  problems.push('Place Registry provenance derivation is missing.');
}

const heritageCanonicalIds = [
  'nuestra-senora-de-gracia-church',
  'sts-peter-and-paul-parish-church',
  'nielson-tower',
  'dambana-ng-banal-na-krus',
  'museo-ng-makati',
  'ayala-museum',
  'plaza-cristo-rey',
];

for (const heritageId of heritageCanonicalIds) {
  const asset = assets.find(item => item.id === heritageId);
  if (!asset) {
    problems.push('Canonical heritage record is missing: ' + heritageId);
    continue;
  }
  if (!/\bheritage:\s*\{/.test(asset.row)) {
    problems.push('Canonical heritage metadata is missing: ' + heritageId);
  }

  const availableSourceIds = new Set();
  if (asset.sourceUrl) availableSourceIds.add(heritageId + ':identity');
  if (asset.coordinateSourceUrl) availableSourceIds.add(heritageId + ':coordinates');
  for (const match of asset.row.matchAll(/\bidSuffix:\s*'([^']+)'/g)) {
    availableSourceIds.add(heritageId + ':' + match[1]);
  }

  const referencedSourceIds = [
    ...asset.row.matchAll(/\bsourceIds:\s*\[([^\]]*)\]/g),
  ].flatMap(match =>
    [...match[1].matchAll(/'([^']+)'/g)].map(sourceMatch => sourceMatch[1])
  );

  for (const sourceId of referencedSourceIds) {
    if (!availableSourceIds.has(sourceId)) {
      problems.push(
        'Heritage metadata source reference is unresolved on ' +
          heritageId +
          ': ' +
          sourceId
      );
    }
  }
}

for (const heritageId of [
  'nuestra-senora-de-gracia-church',
  'sts-peter-and-paul-parish-church',
  'nielson-tower',
  'museo-ng-makati',
]) {
  const asset = assets.find(item => item.id === heritageId);
  if (asset && !asset.row.includes("classification: 'Important Cultural Property'")) {
    problems.push('Expected National Museum ICP designation is missing: ' + heritageId);
  }
}

for (const [heritageId, markerYear] of [
  ['nuestra-senora-de-gracia-church', '1937'],
  ['sts-peter-and-paul-parish-church', '1937'],
  ['nielson-tower', '1996'],
  ['dambana-ng-banal-na-krus', '1991'],
]) {
  const asset = assets.find(item => item.id === heritageId);
  if (
    asset &&
    (
      !asset.row.includes("classification: 'Level II – Historical marker'") ||
      !asset.row.includes("dateOrYear: '" + markerYear + "'")
    )
  ) {
    problems.push(
      'Expected NHCP marker metadata is missing or incomplete: ' +
        heritageId
    );
  }
}

for (const asset of assets) {
  const identityUrl = Boolean(asset.sourceUrl);
  const identityLabel = Boolean(asset.sourceLabel);
  const coordinateUrl = Boolean(asset.coordinateSourceUrl);
  const coordinateLabel = Boolean(asset.coordinateSourceLabel);

  if (identityUrl !== identityLabel) {
    problems.push(
      'Identity source URL/label must be paired on ' + asset.id + '.'
    );
  }
  if (coordinateUrl !== coordinateLabel) {
    problems.push(
      'Coordinate source URL/label must be paired on ' + asset.id + '.'
    );
  }

  for (const [label, url] of [
    ['identity', asset.sourceUrl],
    ['coordinate', asset.coordinateSourceUrl],
  ]) {
    if (!url) continue;
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        problems.push(
          'Unsupported ' + label + ' source URL protocol on ' + asset.id + '.'
        );
      }
    } catch {
      problems.push('Invalid ' + label + ' source URL on ' + asset.id + '.');
    }
  }

  const wouldBeVerified =
    asset.status === 'mapped' &&
    identityUrl &&
    identityLabel &&
    coordinateUrl &&
    coordinateLabel;

  if (wouldBeVerified && (!asset.sourceUrl || !asset.coordinateSourceUrl)) {
    problems.push('Verified record lacks required provenance: ' + asset.id);
  }
}

/* Lifecycle: mapping/verification must not silently become lifecycle. */
const lifecycleTypeBlock =
  registrySource
    .split('export type PlaceLifecycleStatus =')[1]
    ?.split(';')[0] ?? '';

const lifecycleStates = [
  ...lifecycleTypeBlock.matchAll(/'([^']+)'/g),
].map(match => match[1]);

const expectedLifecycleStates = [
  'operating',
  'temporarily-suspended',
  'under-construction',
  'future',
  'closed',
  'unknown',
];

for (const state of expectedLifecycleStates) {
  if (!lifecycleStates.includes(state)) {
    problems.push('Place lifecycle state is missing from the type: ' + state);
  }
}

if (
  !registrySource.includes("lifecycle: {\n    status: 'unknown'") ||
  !registrySource.includes(
    'Lifecycle is intentionally not inferred from Civic Map mapping status.'
  )
) {
  problems.push(
    'Legacy mapping status must not be silently promoted into a Place Registry lifecycle state.'
  );
}

/* Generated entity index parity */
const indexEntries = [
  ...entityIndexSource.matchAll(
    /\{\s*"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"category":\s*"([^"]+)",\s*"entityKind":\s*"([^"]+)"\s*\}/g
  ),
].map(match => ({
  id: match[1],
  name: match[2],
  category: match[3],
  entityKind: match[4],
}));

const indexIds = indexEntries.map(entry => entry.id);
const duplicateIndexIds = duplicateValues(indexIds);
if (duplicateIndexIds.length) {
  problems.push(
    'Duplicate generated civic-entity-index IDs: ' + duplicateIndexIds.join(', ')
  );
}

for (const id of assetIds) {
  if (!indexIds.includes(id)) {
    problems.push('Registry ID missing from civic-entity-index: ' + id);
  }
}
for (const id of indexIds) {
  if (!assetIds.includes(id)) {
    problems.push('civic-entity-index contains missing registry ID: ' + id);
  }
}

const segmentTypes = new Set([
  'street-segment',
  'sidewalk-segment',
  'crossing',
  'bike-lane',
  'drainage',
  'bridge',
]);

for (const asset of assets) {
  if (!asset.id || !asset.type) continue;
  const indexed = indexEntries.find(entry => entry.id === asset.id);
  if (!indexed) continue;

  const expectedKind =
    asset.type === 'transport-route'
      ? 'route'
      : segmentTypes.has(asset.type)
        ? 'segment'
        : 'place';

  if (indexed.name !== asset.title) {
    problems.push('Generated index name drift for ' + asset.id + '.');
  }
  if (indexed.category !== asset.type) {
    problems.push('Generated index category drift for ' + asset.id + '.');
  }
  if (indexed.entityKind !== expectedKind) {
    problems.push('Generated index entity-kind drift for ' + asset.id + '.');
  }
}

/* Explicit relationships */
const relationshipBlock =
  registrySource
    .split(
      'const explicitPlaceRelationshipsById: Record<string, PlaceRelationship[]> = {'
    )[1]
    ?.split('\n};\n\n/**')[0] ?? '';

const relationshipOwners = [
  ...relationshipBlock.matchAll(/^\s*'([^']+)':\s*\[/gm),
].map(match => match[1]);

const duplicateRelationshipOwners = duplicateValues(relationshipOwners);
if (duplicateRelationshipOwners.length) {
  problems.push(
    'Duplicate explicit relationship owner IDs: ' +
      duplicateRelationshipOwners.join(', ')
  );
}

for (const ownerId of relationshipOwners) {
  if (!assetIds.includes(ownerId)) {
    problems.push(
      'Explicit relationship owner is missing from Place Registry: ' + ownerId
    );
  }
}

const relationships = [
  ...relationshipBlock.matchAll(
    /kind:\s*'([^']+)'[\s\S]*?targetType:\s*'([^']+)'[\s\S]*?targetId:\s*'([^']+)'/g
  ),
].map(match => ({
  kind: match[1],
  targetType: match[2],
  targetId: match[3],
}));

const accountabilityIds = new Set([
  ...[accountabilitySource, accountabilitySupplementSource].flatMap(source =>
    [...source.matchAll(/\bid:\s*['"]([^'"]+)['"]/g)].map(match => match[1])
  ),
]);
const serviceIds = new Set(
  [...serviceDirectorySource.matchAll(/\bid:\s*['"]([^'"]+)['"]/g)].map(
    match => match[1]
  )
);
const cityMonitorIds = new Set(
  [...cityMonitorSource.matchAll(/\bid:\s*['"]([^'"]+)['"]/g)].map(
    match => match[1]
  )
);
const heritageBlock =
  visitMakatiSource.split('export const heritageSites')[1] ?? '';
const heritageRows = [
  ...heritageBlock.matchAll(/\n  \{\n([\s\S]*?)\n  \},?/g),
].map(match => match[1]);
const heritagePlaceIds = heritageRows
  .map(row => parseSingleQuotedProperty(row, 'placeId'))
  .filter(Boolean);
const heritageIds = new Set(heritagePlaceIds);

if (heritageRows.length !== 7) {
  problems.push(
    'Expected 7 current Heritage & Culture presentation records but parsed ' +
      heritageRows.length +
      '.'
  );
}

for (const row of heritageRows) {
  const placeId = parseSingleQuotedProperty(row, 'placeId');
  if (!placeId) {
    problems.push('Heritage presentation record is not linked to a canonical place.');
    continue;
  }
  if (!assetIds.includes(placeId)) {
    problems.push(
      'Heritage presentation record points to a missing canonical place: ' +
        placeId
    );
  }

  for (const forbiddenField of [
    'name',
    'address',
    'mapsQuery',
    'sourceUrl',
    'sourceLabel',
  ]) {
    if (parseSingleQuotedProperty(row, forbiddenField)) {
      problems.push(
        'Heritage presentation duplicates canonical Place data (' +
          forbiddenField +
          '): ' +
          placeId
      );
    }
  }

  for (const requiredField of ['category', 'period', 'context']) {
    if (!parseSingleQuotedProperty(row, requiredField)) {
      problems.push(
        'Heritage presentation is missing ' +
          requiredField +
          ': ' +
          placeId
      );
    }
  }
}

const duplicateHeritagePlaceIds = duplicateValues(heritagePlaceIds);
if (duplicateHeritagePlaceIds.length) {
  problems.push(
    'Multiple Heritage records point to the same canonical place: ' +
      duplicateHeritagePlaceIds.join(', ')
  );
}

for (const requiredHeritagePlaceId of [
  'nuestra-senora-de-gracia-church',
  'sts-peter-and-paul-parish-church',
  'nielson-tower',
  'dambana-ng-banal-na-krus',
  'museo-ng-makati',
  'ayala-museum',
  'plaza-cristo-rey',
]) {
  if (!heritagePlaceIds.includes(requiredHeritagePlaceId)) {
    problems.push(
      'Expected Heritage & Culture place is missing: ' +
        requiredHeritagePlaceId
    );
  }
}

/* History and BetterBarangay heritage cross-links */
const historyPlaceIds = [
  ...makatiHistorySource.matchAll(/placeIds:\s*\[([^\]]+)\]/g),
].flatMap(match =>
  [...match[1].matchAll(/'([^']+)'/g)].map(idMatch => idMatch[1])
);

for (const placeId of historyPlaceIds) {
  if (!assetIds.includes(placeId)) {
    problems.push(
      'History event points to a missing canonical place: ' + placeId
    );
  }
}

const barangayHeritageMarkerPlaceIds = [
  ...barangaySource.matchAll(
    /heritageMarkers:\s*\[[\s\S]*?\](?=\s*[,}])/g
  ),
].flatMap(match =>
  [...match[0].matchAll(/placeId:\s*'([^']+)'/g)].map(idMatch => idMatch[1])
);

for (const placeId of barangayHeritageMarkerPlaceIds) {
  if (!assetIds.includes(placeId)) {
    problems.push(
      'BetterBarangay heritage marker points to a missing canonical place: ' +
        placeId
    );
  }
}

for (const requiredPlaceId of [
  'nuestra-senora-de-gracia-church',
  'sts-peter-and-paul-parish-church',
  'nielson-tower',
  'dambana-ng-banal-na-krus',
  'museo-ng-makati',
]) {
  if (!barangayHeritageMarkerPlaceIds.includes(requiredPlaceId)) {
    problems.push(
      'Expected canonical BetterBarangay heritage link is missing: ' +
        requiredPlaceId
    );
  }
}

for (const marker of [
  "aliasKinds?: Record<string, PlaceAlias['kind']>",
  "sourceKind?: PlaceSource['kind']",
  "additionalSources?: CivicAssetAdditionalSource[]",
  "heritage?: PlaceHeritageMetadata",
  "kind: asset.aliasKinds?.[name] ?? 'unclassified'",
  "kind: asset.sourceKind ?? 'other'",
  "for (const source of asset.additionalSources ?? [])",
  "heritage: asset.heritage",
]) {
  if (!registrySource.includes(marker)) {
    problems.push('Heritage metadata normalization is missing: ' + marker);
  }
}

const targetExists = relationship => {
  switch (relationship.targetType) {
    case 'place':
      return assetIds.includes(relationship.targetId);
    case 'service':
      return serviceIds.has(relationship.targetId);
    case 'project':
    case 'accountability-record':
      return accountabilityIds.has(relationship.targetId);
    case 'city-monitor-record':
      return cityMonitorIds.has(relationship.targetId);
    case 'heritage-record':
      return heritageIds.has(relationship.targetId);
    default:
      return false;
  }
};

const expectedTargetTypeForKind = {
  'related-project': 'project',
  'related-accountability': 'accountability-record',
  'related-city-monitor': 'city-monitor-record',
  'related-heritage': 'heritage-record',
  'service-location-for': 'service',
};

const relationshipKeys = relationships.map(
  relationship =>
    relationship.kind +
    '|' +
    relationship.targetType +
    '|' +
    relationship.targetId
);

const duplicateRelationships = duplicateValues(relationshipKeys);
if (duplicateRelationships.length) {
  problems.push(
    'Duplicate explicit relationship tuples: ' +
      duplicateRelationships.join(', ')
  );
}

for (const relationship of relationships) {
  const expectedTargetType = expectedTargetTypeForKind[relationship.kind];
  if (
    expectedTargetType &&
    relationship.targetType !== expectedTargetType
  ) {
    problems.push(
      'Relationship kind/target-type mismatch: ' +
        relationship.kind +
        ' -> ' +
        relationship.targetType +
        ':' +
        relationship.targetId
    );
  }

  if (!targetExists(relationship)) {
    problems.push(
      'Broken relationship target: ' +
        relationship.targetType +
        ':' +
        relationship.targetId
    );
  }
}

if (problems.length) {
  console.error(
    'Place Registry integrity audit failed:\n- ' + problems.join('\n- ')
  );
  process.exit(1);
}

const verifiedCount = assets.filter(
  asset =>
    asset.status === 'mapped' &&
    asset.sourceUrl &&
    asset.sourceLabel &&
    asset.coordinateSourceUrl &&
    asset.coordinateSourceLabel
).length;

console.log(
  [
    'Place Registry integrity passed:',
    assets.length + ' unique records',
    canonicalBarangays.length + ' canonical barangays checked',
    assets.length + ' coordinate pairs checked',
    verifiedCount + ' source-complete verified records',
    relationships.length + ' explicit relationships resolved',
    heritagePlaceIds.length + ' canonical-driven Heritage presentation records',
    heritageCanonicalIds.length + ' enriched canonical heritage records',
    historyPlaceIds.length + ' History-to-place links resolved',
    barangayHeritageMarkerPlaceIds.length + ' BetterBarangay heritage links resolved',
    indexEntries.length + ' generated index entries in parity',
  ].join(' ')
);
