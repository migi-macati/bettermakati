import { readFile } from 'node:fs/promises';

const [pageSource, routeSource, packageSource] = await Promise.all([
  readFile('src/pages/Mobility.tsx', 'utf8'),
  readFile('src/data/mobilityRoutes.ts', 'utf8'),
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
  'Mobility page check passed: canonical systems, internal One Ayala hub, 67 route records surfaced by evidence class, unresolved jeepney rows separated, no synthetic route geometry.'
);
