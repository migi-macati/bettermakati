import { readFile } from 'node:fs/promises';

const [
  pageSource,
  routeSource,
  networkSource,
  externalResourceSource,
  packageSource,
] = await Promise.all([
  readFile('src/pages/Mobility.tsx', 'utf8'),
  readFile('src/data/mobilityRoutes.ts', 'utf8'),
  readFile('src/data/mobilityNetwork.ts', 'utf8'),
  readFile('src/data/mobilityExternalResources.ts', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const problems = [];

for (const marker of [
  "mobilityServices",
  "publicMobilityServices",
  "privateMobilityServices",
  "service.governance === 'public'",
  "service.governance === 'private'",
  "mobilityServiceKind",
  "Public ferry service",
  "Private estate shuttle",
  "publicMobilityServices.map",
  "privateMobilityServices.map",
  "placeRegistryById.get('one-ayala-terminal')",
  "to={'/civic-map/' + oneAyala.id}",
  "date=\"2026-09-28\"",
  "Schedules, fares and live routing remain with the linked operator or map.",
  "currentBusRoutes",
  "currentUvExpressRoutes",
  "currentOrSuccessorJeepneyCorridors",
  "unresolvedJeepneyRows",
  "routeViews",
  "Route registry",
  "Routes and corridors",
  "One Ayala terminal",
  "Historical association labels are retained as",
  "Current status unresolved",
  "not presented",
  "mobilityNetworkRelationships",
  "mobilityNetworkSources",
  "transferRelationships",
  "serviceHubRelationships",
  "relationship.kind === 'transfer'",
  "relationship.kind === 'service-connected-hub'",
  "Verified transfers and hub connections",
  "Transfer points",
  "One Ayala system connections",
  "Directly documented",
  "Corroborated",
  "not transfers inferred from nearby",
  "Getting around sections",
  "Stations &amp; terminals",
  "Search transport",
  "to=\"/search?q=transport\"",
  "serviceHasInterchange",
  "Search this system",
  "Search this service",
  "civicAreaById",
  "to={'/estates#area-' + areaId}",
  "Search route records",
  "to=\"/search?q=route\"",
  "routeDisplayLimit = 12",
  "mobilityRouteMatchesQuery",
  "routeQuery",
  "showAllRoutes",
  "Filter this route list",
  "mobility-route-filter",
  "visibleCurrentRoutes",
  "visibleJeepneyRoutes",
  "visibleUnresolvedRoutes",
  "Evidence &amp; limits",
  "Show all ",
  "Show fewer",
  "overflow-x-auto",
  "min-h-11 shrink-0 whitespace-nowrap",
  "mobilityExternalResources",
  "mobilityExternalResources.map",
  "resource.primaryUrl",
  "resource.displayType",
]) {
  if (!pageSource.includes(marker)) {
    problems.push('Mobility page canonical presentation marker missing: ' + marker);
  }
}

for (const forbidden of [
  'const transitLinks =',
  'https://edsabus.com/route-map',
  'One%20Ayala%20Makati',
  "centuryCity.label + ' E-Bus'",
  "mobilityRouteGeometryArtifacts",
  "const rideApps =",
]) {
  if (pageSource.includes(forbidden)) {
    problems.push('Mobility page still contains stale/manual system presentation: ' + forbidden);
  }
}

const routeBlock =
  routeSource
    .split(
      'export const mobilityRouteCorridors: MobilityRouteCorridorRecord[] = ['
    )[1]
    ?.split('\n];\n\nexport const validateMobilityRouteCorridors')[0] ?? '';

const routeIds = [
  ...routeBlock.matchAll(/^    id: '([^']+)',$/gm),
].map(match => match[1]);

if (routeIds.length !== 67) {
  problems.push(
    'Mobility page route presentation expects the canonical 67-record registry; found ' +
      routeIds.length +
      '.'
  );
}

if (
  (routeBlock.match(/geometryArtifactId: undefined/g) ?? []).length !== 67
) {
  problems.push(
    'W5-4f2 route presentation must keep all 67 route records geometry-less.'
  );
}

const explicitNetworkBlock =
  networkSource
    .split(
      'const explicitNetworkRelationships: MobilityNetworkRelationship[] = ['
    )[1]
    ?.split(
      '\n];\n\nexport const mobilityNetworkRelationships'
    )[0] ?? '';

const explicitNetworkIds = [
  ...explicitNetworkBlock.matchAll(/^    id: '([^']+)',$/gm),
].map(match => match[1]);

const explicitTransferIds = explicitNetworkIds.filter(id =>
  id.startsWith('transfer-')
);
const explicitServiceHubIds = explicitNetworkIds.filter(id =>
  id.startsWith('service-hub-')
);

if (explicitTransferIds.length !== 5) {
  problems.push(
    'Mobility page expects 5 canonical explicit transfer relationships; found ' +
      explicitTransferIds.length +
      '.'
  );
}

if (explicitServiceHubIds.length !== 2) {
  problems.push(
    'Mobility page expects 2 canonical One Ayala service-hub relationships; found ' +
      explicitServiceHubIds.length +
      '.'
  );
}

if (/transfer-[^\n']*magallanes/i.test(explicitNetworkBlock)) {
  problems.push(
    'Mobility page must not surface an invented Magallanes MRT/Busway transfer.'
  );
}

const externalResourceIds = [
  ...externalResourceSource.matchAll(/^    id: '([^']+)',$/gm),
].map(match => match[1]);

if (
  JSON.stringify(externalResourceIds) !==
  JSON.stringify(['grab-ph', 'angkas', 'joyride-ph', 'move-it-ph'])
) {
  problems.push(
    'Mobility page expects the four reviewed external app-based mobility resources.'
  );
}

for (const marker of [
  'officialSourceUrls',
  'volatilityNote',
  'validateMobilityExternalResources',
]) {
  if (!externalResourceSource.includes(marker)) {
    problems.push(
      'Mobility external-resource evidence guard missing: ' + marker
    );
  }
}

const gateCount = (
  packageSource.match(/npm run check:mobility-page/g) ?? []
).length;

if (gateCount !== 2) {
  problems.push(
    'check:mobility-page must run once in build and once in quality; found ' +
      gateCount +
      '.'
  );
}

if (
  !packageSource.includes(
    '"check:mobility-page": "node scripts/check-mobility-page.mjs"'
  )
) {
  problems.push('package.json does not declare check:mobility-page.');
}

if (problems.length) {
  console.error('Mobility page check failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}

console.log(
  'Mobility page check passed: canonical systems, 5 verified transfers, 2 One Ayala system-hub connections, 67 route records by evidence class, unresolved jeepney rows separated, no synthetic route geometry.'
);
