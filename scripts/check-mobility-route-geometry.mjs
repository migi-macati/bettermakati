import { readFile } from 'node:fs/promises';

const [
  geometrySource,
  systemsSource,
  routesSource,
  packageSource,
] = await Promise.all([
  readFile('src/data/mobilityRouteGeometry.ts', 'utf8'),
  readFile('src/data/mobilitySystems.ts', 'utf8'),
  readFile('src/data/mobilityRoutes.ts', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const problems = [];

for (const marker of [
  "type: 'LineString'",
  "type: 'MultiLineString'",
  "export type MobilityGeometryKind",
  "'infrastructure-alignment'",
  "'service-alignment'",
  "'approximate-corridor'",
  "'historical-lineage'",
  "export type MobilityGeometryCoverage",
  "'full-system'",
  "'makati-segment'",
  "'route-corridor'",
  "'historical-reference'",
  "export type MobilityGeometryOwnerType = 'service' | 'route'",
  'export interface MobilityRouteGeometryArtifact',
  'sourceRefs: MobilityGeometrySourceRef[]',
  'precisionNote: string',
  'validateMobilityRouteGeometryArtifacts',
  'mobilityRouteGeometryById',
  'mobilityRouteGeometryForOwner',
  'boundsForMobilityRouteGeometry',
]) {
  if (!geometrySource.includes(marker)) {
    problems.push('Mobility route-geometry schema marker missing: ' + marker);
  }
}

for (const marker of [
  'lng < 120.8',
  'lng > 121.25',
  'lat < 14.35',
  'lat > 14.9',
  'must contain at least two positions',
  'must contain at least two distinct positions',
  'Only one active default mobility geometry artifact is allowed per owner',
  'is not reciprocally linked by its owner',
  'must cite at least one source',
  'requires a precision note',
]) {
  if (!geometrySource.includes(marker)) {
    problems.push('Mobility route-geometry runtime guard missing: ' + marker);
  }
}

if (!systemsSource.includes('geometryArtifactId?: string;')) {
  problems.push(
    'Mobility service schema does not expose an optional repository-owned geometry artifact reference.'
  );
}

if (!routesSource.includes('geometryArtifactId?: string;')) {
  problems.push(
    'Mobility route schema does not expose an optional repository-owned geometry artifact reference.'
  );
}

if (
  routesSource.includes(
    'W5-4c4 must not publish route geometry before the geometry workstream'
  )
) {
  problems.push(
    'Legacy W5-4c4 geometry prohibition remains after route-geometry architecture was introduced.'
  );
}

const artifactBlock =
  geometrySource
    .split(
      'export const mobilityRouteGeometryArtifacts: MobilityRouteGeometryArtifact[] ='
    )[1]
    ?.split(
      '\n\nconst systemSourceIds'
    )[0] ?? '';

if (!artifactBlock.includes('[];')) {
  problems.push(
    'W5-4e1 must keep route geometry artifacts empty until a coordinate trace is independently QAed.'
  );
}

const geometrySourceBlock =
  geometrySource
    .split(
      'export const mobilityGeometrySources: MobilityGeometrySource[] ='
    )[1]
    ?.split(
      '\n\n/**\n * W5-4e1 establishes'
    )[0] ?? '';

if (!geometrySourceBlock.includes('[];')) {
  problems.push(
    'Geometry-specific sources should not be populated before an artifact actually uses them.'
  );
}

const routeRecordBlock =
  routesSource
    .split(
      'export const mobilityRouteCorridors: MobilityRouteCorridorRecord[] = ['
    )[1]
    ?.split(
      '\n];\n\nexport const validateMobilityRouteCorridors'
    )[0] ?? '';

const serviceRecordBlock =
  systemsSource
    .split(
      'export const mobilityServices: MobilityServiceRecord[] = ['
    )[1]
    ?.split(
      '\n];\n\nexport const validateMobilityServices'
    )[0] ?? '';

if (
  /geometryArtifactId:\s*['"][^'"]+['"]/.test(routeRecordBlock) ||
  /geometryArtifactId:\s*['"][^'"]+['"]/.test(serviceRecordBlock)
) {
  problems.push(
    'W5-4e1 architecture step must not attach an unreviewed geometry artifact to a route or service.'
  );
}

for (const forbidden of [
  'representative point',
  'station points are enough',
  'endpoint names are enough',
]) {
  if (geometrySource.toLowerCase().includes(forbidden.toLowerCase())) {
    problems.push(
      'Route-geometry architecture contains unsafe geometry shortcut language: ' +
        forbidden
    );
  }
}

for (const requiredDoctrine of [
  'Endpoint names, station points and old Makati GIS lines are not enough on',
  'their own to manufacture a current route polyline.',
  'Metro Manila rather than Makati',
]) {
  if (!geometrySource.includes(requiredDoctrine)) {
    problems.push(
      'Route-geometry evidence doctrine missing: ' + requiredDoctrine
    );
  }
}

const gateCount = (
  packageSource.match(/npm run check:mobility-route-geometry/g) ?? []
).length;

if (gateCount !== 2) {
  problems.push(
    'check:mobility-route-geometry must run once in build and once in quality; found ' +
      gateCount +
      '.'
  );
}

if (
  !packageSource.includes(
    '"check:mobility-route-geometry": "node scripts/check-mobility-route-geometry.mjs"'
  )
) {
  problems.push(
    'package.json does not declare check:mobility-route-geometry.'
  );
}

if (problems.length) {
  console.error(
    'Mobility route-geometry architecture check failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  [
    'Mobility route-geometry architecture check passed:',
    'LineString + MultiLineString supported',
    'service + route owners supported',
    'source registry separation intact',
    'Metro Manila coordinate envelope guarded',
    'owner reciprocity guarded',
    '0 published geometry artifacts',
    '0 invented route points/polylines',
    'build + quality gate active',
  ].join(' ')
);
