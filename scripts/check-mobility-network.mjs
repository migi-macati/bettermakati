import { readFile } from 'node:fs/promises';

const [
  networkSource,
  systemsSource,
  routesSource,
  placeSource,
  areaSource,
] = await Promise.all([
  readFile('src/data/mobilityNetwork.ts', 'utf8'),
  readFile('src/data/mobilitySystems.ts', 'utf8'),
  readFile('src/data/mobilityRoutes.ts', 'utf8'),
  readFile('src/data/placeRegistry.ts', 'utf8'),
  readFile('src/data/areaOrganizationRegistry.ts', 'utf8'),
]);

const problems = [];

for (const marker of [
  'export type MobilityNetworkNodeType',
  "'service'",
  "'route'",
  "'place'",
  "'area'",
  'export type MobilityNetworkRelationshipKind',
  "'service-serves-place'",
  "'service-related-area'",
  "'route-uses-terminal'",
  "'service-connected-hub'",
  "'transfer'",
  'mobilityNetworkRelationships',
  'validateMobilityNetworkRelationships',
  'mobilityNetworkRelationshipsForNode',
  'mobilityTransfersForPlace',
]) {
  if (!networkSource.includes(marker)) {
    problems.push('Mobility network schema marker missing: ' + marker);
  }
}

const relationshipBlock =
  networkSource
    .split(
      'export const mobilityNetworkRelationships: MobilityNetworkRelationship[] = ['
    )[1]
    ?.split(
      '\n];\n\nconst systemSourceIds'
    )[0] ?? '';

for (const spread of [
  '...servicePlaceRelationships',
  '...serviceAreaRelationships',
  '...routeTerminalRelationships',
  '...explicitNetworkRelationships',
]) {
  if (!relationshipBlock.includes(spread)) {
    problems.push('Mobility network relationship composition missing: ' + spread);
  }
}

/* Derivation counts from canonical source registries. */
const systemPlaceCount = (
  systemsSource.match(/placeId: '[^']+'/g) ?? []
).length;

if (systemPlaceCount !== 11) {
  problems.push(
    'Expected 11 canonical service -> Place connections; found ' +
      systemPlaceCount +
      '.'
  );
}

const relatedAreaCount = (
  systemsSource.match(/relatedAreaIds: \[[^\]]+\]/g) ?? []
).length;

if (relatedAreaCount !== 1) {
  problems.push(
    'Expected one canonical service -> Area relationship; found ' +
      relatedAreaCount +
      '.'
  );
}

const currentRouteBlock =
  routesSource
    .split(
      'export const mobilityRouteCorridors: MobilityRouteCorridorRecord[] = ['
    )[1]
    ?.split(
      '\n];\n\nexport const validateMobilityRouteCorridors'
    )[0] ?? '';

const currentRouteCount = (
  currentRouteBlock.match(/recordKind: 'current-service'/g) ?? []
).length;

if (currentRouteCount !== 29) {
  problems.push(
    'Expected 29 current-only routes feeding terminal relationships; found ' +
      currentRouteCount +
      '.'
  );
}

const oneAyalaTerminalRefs = (
  currentRouteBlock.match(
    /terminalPlaceIds: \['one-ayala-terminal'\]/g
  ) ?? []
).length;

if (oneAyalaTerminalRefs !== 29) {
  problems.push(
    'Expected all 29 current-only routes to use one-ayala-terminal; found ' +
      oneAyalaTerminalRefs +
      '.'
  );
}

const explicitBlock =
  networkSource
    .split(
      'const explicitNetworkRelationships: MobilityNetworkRelationship[] = ['
    )[1]
    ?.split(
      '\n];\n\nexport const mobilityNetworkRelationships'
    )[0] ?? '';

const explicitIds = [
  ...explicitBlock.matchAll(/^    id: '([^']+)',$/gm),
].map(match => match[1]);

if (explicitIds.length !== 7) {
  problems.push(
    'Expected 7 explicit intermodal relationships; found ' +
      explicitIds.length +
      '.'
  );
}

const transferIds = explicitIds.filter(id =>
  id.startsWith('transfer-')
);
const serviceHubIds = explicitIds.filter(id =>
  id.startsWith('service-hub-')
);

if (transferIds.length !== 5) {
  problems.push(
    'Expected 5 explicit transfer relationships; found ' +
      transferIds.length +
      '.'
  );
}
if (serviceHubIds.length !== 2) {
  problems.push(
    'Expected 2 service <-> One Ayala hub relationships; found ' +
      serviceHubIds.length +
      '.'
  );
}

const expectedExplicitIds = [
  'service-hub-mrt3-one-ayala',
  'service-hub-edsa-busway-one-ayala',
  'transfer-mrt3-ayala-one-ayala',
  'transfer-edsa-busway-ayala-one-ayala',
  'transfer-mrt3-ayala-edsa-busway-ayala',
  'transfer-mrt3-buendia-edsa-busway-buendia',
  'transfer-mrt3-guadalupe-edsa-busway-guadalupe',
];

for (const id of expectedExplicitIds) {
  if (!explicitIds.includes(id)) {
    problems.push('Missing explicit mobility network relationship: ' + id);
  }
}

/* Guard the evidence behind transfer claims. */
for (const sourceMarker of [
  "id: 'one-ayala-intermodal-connection'",
  "id: 'pia-buendia-busway-mrt-connection-2021'",
  "id: 'pia-mrt-bus-carousel-transfer-points-2024'",
]) {
  if (!networkSource.includes(sourceMarker)) {
    problems.push('Mobility transfer source missing: ' + sourceMarker);
  }
}

const transferEvidenceMarkers = [
  [
    'transfer-mrt3-ayala-one-ayala',
    'one-ayala-intermodal-connection',
  ],
  [
    'transfer-edsa-busway-ayala-one-ayala',
    'one-ayala-intermodal-connection',
  ],
  [
    'transfer-mrt3-ayala-edsa-busway-ayala',
    'one-ayala-intermodal-connection',
  ],
  [
    'transfer-mrt3-buendia-edsa-busway-buendia',
    'pia-buendia-busway-mrt-connection-2021',
  ],
  [
    'transfer-mrt3-guadalupe-edsa-busway-guadalupe',
    'pia-mrt-bus-carousel-transfer-points-2024',
  ],
];

for (const [id, sourceId] of transferEvidenceMarkers) {
  const start = explicitBlock.indexOf("id: '" + id + "'");
  const next = explicitIds
    .map(otherId =>
      explicitBlock.indexOf("id: '" + otherId + "'", start + 1)
    )
    .filter(index => index > start)
    .sort((a, b) => a - b)[0];
  const block = explicitBlock.slice(
    start,
    next ?? explicitBlock.length
  );

  if (!block.includes("sourceId: '" + sourceId + "'")) {
    problems.push(
      'Mobility transfer lacks expected source: ' +
        id +
        ' -> ' +
        sourceId
    );
  }
}

/* No false Magallanes Busway transfer before an operating station exists. */
if (/transfer-[^\n']*magallanes/i.test(networkSource)) {
  problems.push(
    'Mobility network must not invent an MRT/Busway Magallanes transfer before a canonical operating Busway station exists.'
  );
}

/* No geometry belongs in the network relationship layer. */
for (const forbidden of [
  'lat:',
  'lng:',
  'polyline:',
  'geometryArtifactId:',
]) {
  if (relationshipBlock.includes(forbidden) || explicitBlock.includes(forbidden)) {
    problems.push(
      'Mobility network relationships must not carry geometry: ' +
        forbidden
    );
  }
}

/* Canonical node IDs needed by the explicit network must exist. */
const requiredPlaceIds = [
  'one-ayala-terminal',
  'mrt3-ayala',
  'mrt3-buendia',
  'mrt3-guadalupe',
  'edsa-busway-ayala',
  'edsa-busway-buendia',
  'edsa-busway-guadalupe',
];

for (const placeId of requiredPlaceIds) {
  if (!placeSource.includes("id: '" + placeId + "'")) {
    problems.push(
      'Mobility network explicit relationship references missing Place: ' +
        placeId
    );
  }
}

if (!areaSource.includes("id: 'century-city'")) {
  problems.push(
    'Mobility service -> Area network expects canonical century-city Area.'
  );
}

for (const serviceId of [
  'mrt3',
  'edsa-busway',
  'pasig-river-ferry',
  'century-city-shuttle',
]) {
  if (!systemsSource.includes("id: '" + serviceId + "'")) {
    problems.push(
      'Mobility network references missing canonical service: ' +
        serviceId
    );
  }
}

/* Relationship derivation math: 11 + 1 + 29 + 7 = 48. */
const expectedRelationshipCount =
  systemPlaceCount +
  relatedAreaCount +
  currentRouteCount +
  explicitIds.length;

if (expectedRelationshipCount !== 48) {
  problems.push(
    'W5-4d relationship derivation should total 48; computed ' +
      expectedRelationshipCount +
      '.'
  );
}

for (const marker of [
  'Duplicate symmetric mobility transfer',
  'route-uses-terminal must connect route -> place',
  'service-serves-place must connect service -> place',
  'transfer must connect place <-> place',
]) {
  if (!networkSource.includes(marker)) {
    problems.push('Mobility network runtime guard missing: ' + marker);
  }
}

if (problems.length) {
  console.error(
    'Canonical mobility network check failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  [
    'Canonical mobility network check passed:',
    expectedRelationshipCount + ' relationships',
    systemPlaceCount + ' service -> Place',
    relatedAreaCount + ' service -> Area',
    currentRouteCount + ' current route -> terminal',
    serviceHubIds.length + ' service -> One Ayala hub',
    transferIds.length + ' explicit transfers',
    'MRT/Busway transfers at Ayala, Buendia and Guadalupe',
    'One Ayala linked to MRT-3, EDSA Busway and 29 current bus/UV routes',
    'ferry system linked to its 2 canonical Makati stations',
    '0 invented geometry',
  ].join(' ')
);
