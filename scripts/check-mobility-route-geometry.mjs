import { readFile } from 'node:fs/promises';

const [
  geometrySource,
  systemsSource,
  routesSource,
  placeSource,
  packageSource,
] = await Promise.all([
  readFile('src/data/mobilityRouteGeometry.ts', 'utf8'),
  readFile('src/data/mobilitySystems.ts', 'utf8'),
  readFile('src/data/mobilityRoutes.ts', 'utf8'),
  readFile('src/data/placeRegistry.ts', 'utf8'),
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

const geometrySourceBlock =
  geometrySource
    .split(
      'export const mobilityGeometrySources: MobilityGeometrySource[] = ['
    )[1]
    ?.split(
      '\n];\n\n/**\n * W5-4e1 establishes'
    )[0] ?? '';

const geometrySourceIds = [
  ...geometrySourceBlock.matchAll(/^    id: '([^']+)',$/gm),
].map(match => match[1]);

const expectedGeometrySources = [
  'osm-mrt3-route-master-8000255',
  'osm-mrt3-southbound-route-109159',
  'osm-mrt3-rail-exposure-snapshot',
  'traintracks-mrt3-geojson-crosscheck',
  'traintracks-edsa-carousel-geojson-2026',
];

if (geometrySourceIds.length !== 5) {
  problems.push(
    'W5-4e4 expects five mobility geometry/reference sources; found ' +
      geometrySourceIds.length +
      '.'
  );
}

for (const sourceId of expectedGeometrySources) {
  if (!geometrySourceIds.includes(sourceId)) {
    problems.push('Missing MRT-3 geometry source: ' + sourceId);
  }
}

const artifactBlock =
  geometrySource
    .split(
      'export const mobilityRouteGeometryArtifacts: MobilityRouteGeometryArtifact[] ='
    )[1]
    ?.split(
      '\n\nconst systemSourceIds'
    )[0] ?? '';

const artifactIds = [
  ...artifactBlock.matchAll(/^      id: '([^']+)',$/gm),
].map(match => match[1]);

if (artifactIds.length !== 2) {
  problems.push(
    'W5-4e4 expects exactly two published mobility geometry artifacts; found ' +
      artifactIds.length +
      '.'
  );
}

for (const artifactId of [
  'mrt3-makati-alignment-2026-09',
  'edsa-busway-makati-alignment-2026-09',
]) {
  if (!artifactIds.includes(artifactId)) {
    problems.push('Published mobility alignment artifact is missing: ' + artifactId);
  }
}

const mrt3ArtifactBlock =
  artifactBlock
    .split("id: 'mrt3-makati-alignment-2026-09'")[1]
    ?.split("id: 'edsa-busway-makati-alignment-2026-09'")[0] ?? '';

const buswayArtifactBlock =
  artifactBlock
    .split("id: 'edsa-busway-makati-alignment-2026-09'")[1] ?? '';

for (const marker of [
  "ownerType: 'service'",
  "ownerId: 'mrt3'",
  "kind: 'infrastructure-alignment'",
  "coverage: 'makati-segment'",
  "type: 'LineString'",
  "registry: 'system'",
  "sourceId: 'mrt3-about-2026'",
  "sourceId: 'osm-mrt3-route-master-8000255'",
  "sourceId: 'osm-mrt3-southbound-route-109159'",
  "sourceId: 'osm-mrt3-rail-exposure-snapshot'",
  'not a survey, engineering or cadastral product',
  'not a legal Makati-boundary clip',
  'do not depict the full width or both tracks of the railway',
  'member ways 810673631, 642764191, 547163412, 810673628, 810673626, 810634546, 799249439, 642764192, 810634542, 642764189 and 38192006',
  'TrainTracks MRT-3 GeoJSON feature Q13422345',
  'Canonical BetterMakati MRT-3 station points: Guadalupe, Buendia, Ayala and Magallanes',
]) {
  if (!mrt3ArtifactBlock.includes(marker)) {
    problems.push('MRT-3 geometry evidence marker missing: ' + marker);
  }
}

for (const marker of [
  "ownerType: 'service'",
  "ownerId: 'edsa-busway'",
  "kind: 'infrastructure-alignment'",
  "coverage: 'makati-segment'",
  "type: 'MultiLineString'",
  "sourceId: 'pia-edsa-busway-wifi-2026'",
  "sourceId: 'traintracks-edsa-carousel-geojson-2026'",
  'not a survey, engineering or cadastral product',
  'not a legal Makati-boundary clip',
  'do not define platform edges, lane widths or temporary traffic arrangements',
  'Canonical BetterMakati EDSA Busway station points: Guadalupe, Buendia and Ayala',
]) {
  if (!buswayArtifactBlock.includes(marker)) {
    problems.push('EDSA Busway geometry evidence marker missing: ' + marker);
  }
}

const coordinatePairs = [
  ...mrt3ArtifactBlock.matchAll(
    /\[([0-9]+\.[0-9]+),\s*([0-9]+\.[0-9]+)\]/g
  ),
].map(match => [Number(match[1]), Number(match[2])]);

if (coordinatePairs.length !== 56) {
  problems.push(
    'MRT-3 Makati alignment should contain 56 OSM-derived positions; found ' +
      coordinatePairs.length +
      '.'
  );
}

if (coordinatePairs.length) {
  const first = coordinatePairs[0];
  const last = coordinatePairs[coordinatePairs.length - 1];

  if (
    first[0] !== 121.0464023 ||
    first[1] !== 14.5701072
  ) {
    problems.push(
      'MRT-3 Makati alignment north endpoint changed unexpectedly.'
    );
  }

  if (
    last[0] !== 121.0174488 ||
    last[1] !== 14.5408093
  ) {
    problems.push(
      'MRT-3 Makati alignment south endpoint changed unexpectedly.'
    );
  }

  if (
    !coordinatePairs.every(
      ([lng, lat]) =>
        lng >= 121.017 &&
        lng <= 121.047 &&
        lat >= 14.540 &&
        lat <= 14.571
    )
  ) {
    problems.push(
      'MRT-3 Makati alignment contains a coordinate outside its reviewed local envelope.'
    );
  }
}

const buswayCoordinatePairs = [
  ...buswayArtifactBlock.matchAll(
    /\[([0-9]+\.[0-9]+),\s*([0-9]+\.[0-9]+)\]/g
  ),
].map(match => [Number(match[1]), Number(match[2])]);

if (buswayCoordinatePairs.length !== 16) {
  problems.push(
    'EDSA Busway Makati alignment should contain 16 directional reference positions; found ' +
      buswayCoordinatePairs.length +
      '.'
  );
}

if (
  !buswayCoordinatePairs.every(
    ([lng, lat]) =>
      lng >= 121.016 &&
      lng <= 121.048 &&
      lat >= 14.540 &&
      lat <= 14.573
  )
) {
  problems.push(
    'EDSA Busway Makati alignment contains a coordinate outside its reviewed local envelope.'
  );
}

/**
 * QA canonical station points against the stored track line using a local
 * equirectangular projection. This is not a survey-distance calculation; it
 * simply catches a polyline that no longer passes the four Makati stations.
 */
const stationIds = [
  'mrt3-guadalupe',
  'mrt3-buendia',
  'mrt3-ayala',
  'mrt3-magallanes',
];

const stationPoints = new Map();

for (const stationId of stationIds) {
  const start = placeSource.indexOf("id: '" + stationId + "'");
  if (start < 0) {
    problems.push('Missing canonical MRT-3 station Place: ' + stationId);
    continue;
  }

  const block = placeSource.slice(start, start + 2200);
  const lat = Number(block.match(/\blat:\s*([0-9.]+)/)?.[1]);
  const lng = Number(block.match(/\blng:\s*([0-9.]+)/)?.[1]);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    problems.push(
      'Could not read canonical station coordinates: ' + stationId
    );
    continue;
  }

  stationPoints.set(stationId, { lat, lng });
}

const earthRadius = 6371000;
const referenceLatitude = (14.555 * Math.PI) / 180;

const xy = ([lng, lat]) => [
  earthRadius *
    ((lng * Math.PI) / 180) *
    Math.cos(referenceLatitude),
  earthRadius * ((lat * Math.PI) / 180),
];

const distancePointToSegment = (point, start, end) => {
  const [px, py] = xy([point.lng, point.lat]);
  const [ax, ay] = xy(start);
  const [bx, by] = xy(end);
  const dx = bx - ax;
  const dy = by - ay;
  const denominator = dx * dx + dy * dy;
  const rawT =
    denominator === 0
      ? 0
      : ((px - ax) * dx + (py - ay) * dy) / denominator;
  const t = Math.max(0, Math.min(1, rawT));
  return Math.hypot(
    px - (ax + t * dx),
    py - (ay + t * dy)
  );
};

const stationDistances = new Map();

for (const [stationId, point] of stationPoints) {
  let minimum = Number.POSITIVE_INFINITY;

  for (let index = 0; index < coordinatePairs.length - 1; index += 1) {
    minimum = Math.min(
      minimum,
      distancePointToSegment(
        point,
        coordinatePairs[index],
        coordinatePairs[index + 1]
      )
    );
  }

  stationDistances.set(stationId, minimum);

  if (minimum > 20) {
    problems.push(
      'MRT-3 alignment is more than 20 m from canonical station point ' +
        stationId +
        ': ' +
        Math.round(minimum) +
        ' m.'
    );
  }
}

const buswayStationDistances = new Map();

for (const stationId of [
  'edsa-busway-guadalupe',
  'edsa-busway-buendia',
  'edsa-busway-ayala',
]) {
  const start = placeSource.indexOf("id: '" + stationId + "'");
  if (start < 0) {
    problems.push('Missing canonical EDSA Busway station Place: ' + stationId);
    continue;
  }

  const block = placeSource.slice(start, start + 2200);
  const lat = Number(block.match(/\blat:\s*([0-9.]+)/)?.[1]);
  const lng = Number(block.match(/\blng:\s*([0-9.]+)/)?.[1]);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    problems.push(
      'Could not read canonical Busway station coordinates: ' + stationId
    );
    continue;
  }

  const point = { lat, lng };
  let minimum = Number.POSITIVE_INFINITY;

  for (
    let index = 0;
    index < buswayCoordinatePairs.length - 1;
    index += 1
  ) {
    minimum = Math.min(
      minimum,
      distancePointToSegment(
        point,
        buswayCoordinatePairs[index],
        buswayCoordinatePairs[index + 1]
      )
    );
  }

  buswayStationDistances.set(stationId, minimum);

  if (minimum > 50) {
    problems.push(
      'EDSA Busway alignment is more than 50 m from canonical station point ' +
        stationId +
        ': ' +
        Math.round(minimum) +
        ' m.'
    );
  }
}

const serviceRecordBlock =
  systemsSource
    .split(
      'export const mobilityServices: MobilityServiceRecord[] = ['
    )[1]
    ?.split(
      '\n];\n\nexport const validateMobilityServices'
    )[0] ?? '';

const mrt3Block =
  serviceRecordBlock
    .split("id: 'mrt3'")[1]
    ?.split("\n  },")[0] ?? '';

if (
  !mrt3Block.includes(
    "geometryArtifactId: 'mrt3-makati-alignment-2026-09'"
  )
) {
  problems.push(
    'Canonical MRT-3 service does not reciprocally reference its geometry artifact.'
  );
}

const buswayBlock =
  serviceRecordBlock
    .split("id: 'edsa-busway'")[1]
    ?.split("\n  },")[0] ?? '';

if (
  !buswayBlock.includes(
    "geometryArtifactId: 'edsa-busway-makati-alignment-2026-09'"
  )
) {
  problems.push(
    'Canonical EDSA Busway service does not reciprocally reference its geometry artifact.'
  );
}

const attachedServiceGeometryIds = [
  ...serviceRecordBlock.matchAll(
    /geometryArtifactId:\s*'([^']+)'/g
  ),
].map(match => match[1]);

if (
  attachedServiceGeometryIds.length !== 2 ||
  !attachedServiceGeometryIds.includes('mrt3-makati-alignment-2026-09') ||
  !attachedServiceGeometryIds.includes('edsa-busway-makati-alignment-2026-09')
) {
  problems.push(
    'W5-4e4 should attach geometry only to MRT-3 and EDSA Busway services.'
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

if (
  /geometryArtifactId:\s*'[^']+'/.test(routeRecordBlock)
) {
  problems.push(
    'W5-4e2 must not attach geometry to jeepney/bus/UV route records.'
  );
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
    'Mobility route-geometry check failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

const distanceSummary = [...stationDistances.entries()]
  .map(
    ([stationId, distance]) =>
      stationId + '=' + Math.round(distance) + 'm'
  )
  .join(', ');

const buswayDistanceSummary = [...buswayStationDistances.entries()]
  .map(
    ([stationId, distance]) =>
      stationId + '=' + Math.round(distance) + 'm'
  )
  .join(', ');

console.log(
  [
    'Mobility route-geometry check passed:',
    artifactIds.length + ' published artifacts',
    coordinatePairs.length + ' MRT-3 positions',
    buswayCoordinatePairs.length + ' EDSA Busway positions',
    'service reciprocity intact',
    'MRT station proximity ' + distanceSummary,
    'Busway station proximity ' + buswayDistanceSummary,
    geometrySourceIds.length + ' geometry/reference sources',
    '0 road-route geometry artifacts',
    'build + quality gate active',
  ].join(' ')
);
