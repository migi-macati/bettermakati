import { readFile } from 'node:fs/promises';

const [
  closureSource,
  systems,
  routes,
  network,
  geometry,
  externalResources,
  page,
  civicMapLayer,
  searchIndex,
  packageJson,
] = await Promise.all([
  readFile('data/wave5-mobility-closure.json', 'utf8'),
  readFile('src/data/mobilitySystems.ts', 'utf8'),
  readFile('src/data/mobilityRoutes.ts', 'utf8'),
  readFile('src/data/mobilityNetwork.ts', 'utf8'),
  readFile('src/data/mobilityRouteGeometry.ts', 'utf8'),
  readFile('src/data/mobilityExternalResources.ts', 'utf8'),
  readFile('src/pages/Mobility.tsx', 'utf8'),
  readFile('src/components/civic/CivicAreaContextMap.tsx', 'utf8'),
  readFile('src/data/searchIndex.ts', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const closure = JSON.parse(closureSource);
const problems = [];

const blockBetween = (source, start, end) =>
  source.split(start)[1]?.split(end)[0] ?? '';

if (
  closure.closureStatus !==
  'closed-with-bounded-evidence-and-deployment-verification-deferred'
) {
  problems.push('W5-4 closure status must preserve evidence and deployment-verification bounds.');
}

const systemBlock = blockBetween(
  systems,
  'export const mobilityServices: MobilityServiceRecord[] = [',
  '\n];\n\nexport const validateMobilityServices'
);
const routeBlock = blockBetween(
  routes,
  'export const mobilityRouteCorridors: MobilityRouteCorridorRecord[] = [',
  '\n];\n\nexport const validateMobilityRouteCorridors'
);
const explicitNetworkBlock = blockBetween(
  network,
  'const explicitNetworkRelationships: MobilityNetworkRelationship[] = [',
  '\n];\n\nexport const mobilityNetworkRelationships'
);
const geometryBlock = blockBetween(
  geometry,
  'export const mobilityRouteGeometryArtifacts: MobilityRouteGeometryArtifact[] =',
  '\n\nconst systemSourceIds'
);

const systemIds = [
  ...systemBlock.matchAll(/^    id: '([^']+)',$/gm),
].map(match => match[1]);
const routeIds = [
  ...routeBlock.matchAll(/^    id: '([^']+)',$/gm),
].map(match => match[1]);
const explicitNetworkIds = [
  ...explicitNetworkBlock.matchAll(/^    id: '([^']+)',$/gm),
].map(match => match[1]);
const geometryIds = [
  ...geometryBlock.matchAll(/^      id: '([^']+)',$/gm),
].map(match => match[1]);
const externalResourceIds = [
  ...externalResources.matchAll(/^    id: '([^']+)',$/gm),
].map(match => match[1]);

const historicalCount = (
  routeBlock.match(/recordKind: 'historical-reconciliation'/g) ?? []
).length;
const currentCount = (
  routeBlock.match(/recordKind: 'current-service'/g) ?? []
).length;
const unresolvedCount = (
  routeBlock.match(/disposition: ["']unresolved-current-status["']/g) ?? []
).length;

if (
  JSON.stringify(systemIds) !==
  JSON.stringify([
    'mrt3',
    'edsa-busway',
    'pasig-river-ferry',
    'century-city-shuttle',
  ])
) {
  problems.push('W5-4 must close with exactly the four reconciled mobility services.');
}

if (routeIds.length !== 67 || historicalCount !== 38 || currentCount !== 29) {
  problems.push(
    'W5-4 route closure expects 67 records = 38 historical/reconciled + 29 current-only.'
  );
}
if (unresolvedCount !== 3 || historicalCount - unresolvedCount !== 35) {
  problems.push(
    'W5-4 jeepney closure expects 35 current/successor corridors + 3 unresolved historical rows.'
  );
}

if (
  (routeBlock.match(/geometryArtifactId: undefined/g) ?? []).length !== 67
) {
  problems.push('All 67 canonical route records must remain geometry-less at W5-4 closure.');
}

const servicePlaceCount = (
  systems.match(/placeId: '[^']+'/g) ?? []
).length;
const serviceAreaCount = (
  systems.match(/relatedAreaIds: \[[^\]]+\]/g) ?? []
).length;
const derivedNetworkCount =
  servicePlaceCount +
  serviceAreaCount +
  currentCount +
  explicitNetworkIds.length;

if (
  derivedNetworkCount !== 48 ||
  explicitNetworkIds.filter(id => id.startsWith('transfer-')).length !== 5 ||
  explicitNetworkIds.filter(id => id.startsWith('service-hub-')).length !== 2
) {
  problems.push('W5-4 mobility-network closure expects 48 relationships, including 5 transfers and 2 service-hub connections.');
}

if (
  JSON.stringify(geometryIds) !==
  JSON.stringify([
    'mrt3-makati-alignment-2026-09',
    'edsa-busway-makati-alignment-2026-09',
  ])
) {
  problems.push('W5-4 closes with exactly two sourced fixed-system alignment artifacts.');
}

for (const marker of [
  'Mapped reference alignment',
  'Rail reference alignment',
  'Busway reference alignment',
  'Geometry-less',
]) {
  if (!civicMapLayer.includes(marker)) {
    problems.push('Civic Map mobility geometry/caveat marker missing: ' + marker);
  }
}
if (civicMapLayer.includes('mobilityRouteCorridors')) {
  problems.push('Civic Map must not reconstruct route geometry from canonical route rows.');
}

for (const marker of [
  'publicMobilityServices.map',
  'privateMobilityServices.map',
  'transferRelationships.map',
  'serviceHubRelationships.map',
  'currentBusRoutes',
  'currentUvExpressRoutes',
  'currentOrSuccessorJeepneyCorridors',
  'unresolvedJeepneyRows',
  'mobilityExternalResources.map',
  'routeDisplayLimit = 12',
  'mobility-route-filter',
  'date="2026-09-28"',
]) {
  if (!page.includes(marker)) {
    problems.push('Mobility page closure marker missing: ' + marker);
  }
}

for (const forbidden of [
  'const transitLinks =',
  'const rideApps =',
  'https://edsabus.com/route-map',
  'One%20Ayala%20Makati',
  'mobilityRouteGeometryArtifacts',
]) {
  if (page.includes(forbidden)) {
    problems.push('Stale or architecturally invalid Mobility page content returned: ' + forbidden);
  }
}

if (
  JSON.stringify(externalResourceIds) !==
  JSON.stringify(['grab-ph', 'angkas', 'joyride-ph', 'move-it-ph'])
) {
  problems.push('W5-4 closure expects exactly four reviewed external ride-hailing resources.');
}
for (const marker of [
  'officialSourceUrls',
  'volatilityNote',
  'validateMobilityExternalResources',
]) {
  if (!externalResources.includes(marker)) {
    problems.push('External mobility-resource evidence guard missing: ' + marker);
  }
}

for (const marker of [
  'const mobilitySearchItems: SearchItem[] = [',
  "canonicalKey: 'mobility-service:' + service.id",
  "canonicalKey: 'mobility-route:' + route.id",
  "canonicalKey: 'mobility-network:' + relationship.id",
]) {
  if (!searchIndex.includes(marker)) {
    problems.push('Search/Civic Intelligence mobility integration missing: ' + marker);
  }
}

for (const item of closure.bounded ?? []) {
  if (!item.id || !item.status || !item.reason) {
    problems.push('Bounded W5-4 closure item is missing id/status/reason.');
  }
}
for (const required of [
  'tricycle-toda-inventory',
  'depw-bus-stop-roster',
  'route-geometry-coverage',
  'volatile-operating-fields',
]) {
  if (!(closure.bounded ?? []).some(item => item.id === required)) {
    problems.push('Required bounded mobility capability missing: ' + required);
  }
}

const deploymentDeferred = (closure.deferred ?? []).find(
  item => item.id === 'deployment-live-browser-verification'
);
if (
  deploymentDeferred?.status !== 'unverified' ||
  !deploymentDeferred?.nonClaim?.includes(
    'does not establish that the W5-4 code caused the failure'
  )
) {
  problems.push('W5-4 deployment/live-browser verification must remain explicitly unverified and non-attributed.');
}

const expectedCounts = {
  mobilitySystems: 4,
  publicSystems: 3,
  privateServices: 1,
  canonicalRouteRecords: 67,
  historicalJeepneyRows: 38,
  currentOrSuccessorJeepneyCorridors: 35,
  unresolvedJeepneyRows: 3,
  currentBusP2pUvRoutes: 29,
  networkRelationships: 48,
  explicitTransfers: 5,
  explicitServiceHubConnections: 2,
  mobilityGeometryArtifacts: 2,
  externalMobilityResources: 4,
};

for (const [key, value] of Object.entries(expectedCounts)) {
  if (closure.counts?.[key] !== value) {
    problems.push('W5-4 closure ledger count mismatch: ' + key);
  }
}

for (const script of [
  'check:mobility-systems',
  'check:mobility-routes',
  'check:mobility-network',
  'check:mobility-route-geometry',
  'check:mobility-page',
  'check:civic-intelligence-search',
  'check:wave5-mobility-closure',
]) {
  const occurrences = (
    packageJson.match(
      new RegExp('npm run ' + script.replace(':', '\\:'), 'g')
    ) ?? []
  ).length;
  if (occurrences < 2) {
    problems.push(
      'W5-4 dependency/closure gate is not present in both build and quality: ' +
        script
    );
  }
}

if (
  !closure.finalStatement?.startsWith('W5-4 Mobility is closed at repository level')
) {
  problems.push('W5-4 closure final statement is missing or overstated.');
}

if (problems.length) {
  console.error(
    'Wave 5.4 Mobility closure failed:\n- ' + problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  [
    'Wave 5.4 Mobility closure passed:',
    systemIds.length + ' canonical services',
    routeIds.length + ' canonical routes',
    historicalCount - unresolvedCount + ' current/successor jeepney corridors',
    unresolvedCount + ' unresolved jeepney rows',
    derivedNetworkCount + ' network relationships',
    geometryIds.length + ' sourced alignment artifacts',
    externalResourceIds.length + ' reviewed external mobility resources',
    'canonical page/search/Civic Map integrations retained',
    'evidence gaps explicitly bounded',
    'fresh deployment/live-browser verification explicitly deferred',
  ].join(' ')
);
