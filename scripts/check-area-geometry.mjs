import { readFile } from 'node:fs/promises';

const [geometrySource, areaRegistrySource, evidenceDoc] = await Promise.all([
  readFile('src/data/areaGeometry.ts', 'utf8'),
  readFile('src/data/areaOrganizationRegistry.ts', 'utf8'),
  readFile('docs/w5-3d1-area-boundary-geometry-evidence.md', 'utf8'),
]);

const problems = [];

for (const marker of [
  "export type CivicAreaGeometryKind",
  "export type GeoPosition = [lng: number, lat: number]",
  "type: 'Polygon'",
  "type: 'MultiPolygon'",
  "export interface CivicAreaGeometryArtifact",
  "precisionNote: string",
  "sourceIds: string[]",
  "validateCivicAreaGeometryArtifacts",
  "civicAreaGeometryByAreaId",
  "boundsForAreaGeometry",
]) {
  if (!geometrySource.includes(marker)) {
    problems.push('Area geometry model marker missing: ' + marker);
  }
}

if (!areaRegistrySource.includes('geometryId?: string')) {
  problems.push(
    'Canonical area records must reference repository-owned geometry artifacts by ID.'
  );
}

if (areaRegistrySource.includes('geometryRef: string')) {
  problems.push(
    'Legacy opaque geometryRef storage must not remain in the canonical area schema.'
  );
}

if (/\bgeometry:\s*\{/.test(
  areaRegistrySource
    .split('export const civicAreas: CivicAreaRecord[] = [')[1]
    ?.split('\n];\n\nexport const civicOrganizations')[0] ?? ''
)) {
  problems.push(
    'Renderable polygon coordinates must not be embedded directly in canonical area records.'
  );
}

for (const validatorMarker of [
  'must contain at least four positions',
  'must be closed',
  'at least three distinct positions',
  'outside the Makati / Metro Manila validation envelope',
  'Only one active geometry artifact is allowed per area',
  'must cite at least one source',
  'is not referenced by its canonical area',
  'references a missing geometry artifact',
]) {
  if (!geometrySource.includes(validatorMarker)) {
    problems.push(
      'Area geometry validation guard missing: ' + validatorMarker
    );
  }
}

const artifactBlock =
  geometrySource
    .split(
      'export const civicAreaGeometryArtifacts: CivicAreaGeometryArtifact[] = ['
    )[1]
    ?.split('\n];\n\nvalidateCivicAreaGeometryArtifacts')[0] ?? '';

const artifactIds = [
  ...artifactBlock.matchAll(/\bid:\s*'([^']+)'/g),
].map(match => match[1]);

if (artifactIds.length !== 2) {
  problems.push(
    'W5-3d4 expects exactly two published area geometry artifacts; found ' +
      artifactIds.length +
      '.'
  );
}

if (!artifactIds.includes('dasmarinas-village-boundary-2026-09')) {
  problems.push(
    'Dasmariñas Village approximate boundary artifact is missing.'
  );
}

for (const marker of [
  "areaId: 'dasmarinas-village'",
  "kind: 'approximate-boundary'",
  "type: 'Polygon'",
  "'dva-about-boundary'",
  "'dva-village-map'",
  "'psgc-2023-makati-barangay-geojson'",
  "'osm-dasmarinas-boundary-snapshot'",
  'Approximate display boundary, not a cadastral or survey polygon.',
  'OpenStreetMap administrative relation 103761 snapshot',
]) {
  if (!artifactBlock.includes(marker)) {
    problems.push(
      'Dasmariñas Village geometry evidence marker missing: ' + marker
    );
  }
}

const dasmarinasArtifact =
  artifactBlock
    .split("id: 'dasmarinas-village-boundary-2026-09'")[1]
    ?.split("\n  },")[0] ?? '';

const coordinatePairs = [
  ...dasmarinasArtifact.matchAll(
    /\[([0-9]+\.[0-9]+),\s*([0-9]+\.[0-9]+)\]/g
  ),
].map(match => [Number(match[1]), Number(match[2])]);

if (coordinatePairs.length !== 24) {
  problems.push(
    'Dasmariñas Village boundary should contain the 24-position simplified PSGC-derived ring; found ' +
      coordinatePairs.length +
      '.'
  );
}

if (coordinatePairs.length) {
  const first = coordinatePairs[0];
  const last = coordinatePairs[coordinatePairs.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    problems.push('Dasmariñas Village geometry ring is not closed.');
  }
}

if (!artifactIds.includes('forbes-park-village-boundary-2026-09')) {
  problems.push('Forbes Park approximate boundary artifact is missing.');
}

const forbesArtifact =
  artifactBlock
    .split("id: 'forbes-park-village-boundary-2026-09'")[1]
    ?.split("\n  },")[0] ?? '';

for (const marker of [
  "areaId: 'forbes-park-village'",
  "kind: 'approximate-boundary'",
  "'forbes-park-articles'",
  "'forbes-park-village-map'",
  "'psgc-2023-makati-barangay-geojson'",
  "'osm-forbes-park-boundary-snapshot'",
  'BetterMakati does not assert legal identity between Barangay Forbes Park and the private subdivision.',
  'OpenStreetMap administrative relation 109972 snapshot',
]) {
  if (!forbesArtifact.includes(marker)) {
    problems.push('Forbes Park geometry evidence marker missing: ' + marker);
  }
}

const forbesCoordinatePairs = [
  ...forbesArtifact.matchAll(/\[([0-9]+\.[0-9]+),\s*([0-9]+\.[0-9]+)\]/g),
].map(match => [Number(match[1]), Number(match[2])]);

if (forbesCoordinatePairs.length !== 34) {
  problems.push(
    'Forbes Park boundary should contain the 34-position high-resolution PSGC-derived ring; found ' +
      forbesCoordinatePairs.length +
      '.'
  );
}

if (forbesCoordinatePairs.length) {
  const first = forbesCoordinatePairs[0];
  const last = forbesCoordinatePairs[forbesCoordinatePairs.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    problems.push('Forbes Park geometry ring is not closed.');
  }
}

const circuitRow =
  areaRegistrySource
    .split("id: 'circuit-makati'")[1]
    ?.split('\n  },')[0] ?? '';

if (circuitRow.includes('geometryId:')) {
  problems.push(
    'Circuit Makati must not receive geometry from the misread MACEA outline.'
  );
}

const dasmarinasRow =
  areaRegistrySource
    .split("id: 'dasmarinas-village'")[1]
    ?.split('\n  },')[0] ?? '';

if (
  !dasmarinasRow.includes(
    "geometryId: 'dasmarinas-village-boundary-2026-09'"
  )
) {
  problems.push(
    'Canonical Dasmariñas Village area must reference its published geometry artifact.'
  );
}

for (const sourceId of [
  'dva-about-boundary',
  'dva-village-map',
  'psgc-2023-makati-barangay-geojson',
  'osm-dasmarinas-boundary-snapshot',
]) {
  if (!areaRegistrySource.includes("id: '" + sourceId + "'")) {
    problems.push(
      'Dasmariñas Village geometry source is missing from the canonical source registry: ' +
        sourceId
    );
  }
}

const forbesRow =
  areaRegistrySource
    .split("id: 'forbes-park-village'")[1]
    ?.split('\n  },')[0] ?? '';

if (
  !forbesRow.includes(
    "geometryId: 'forbes-park-village-boundary-2026-09'"
  )
) {
  problems.push(
    'Canonical Forbes Park area must reference its published geometry artifact.'
  );
}

for (const sourceId of [
  'forbes-park-articles',
  'forbes-park-village-map',
  'psgc-2023-makati-barangay-geojson',
  'osm-forbes-park-boundary-snapshot',
]) {
  if (!areaRegistrySource.includes("id: '" + sourceId + "'")) {
    problems.push(
      'Forbes Park geometry source is missing from the canonical source registry: ' +
        sourceId
    );
  }
}

for (const marker of [
  'black outline is labeled **“Makati CBD Projects with MACEA”**',
  '**NO BOUNDARY YET**',
  '**Circuit Makati is removed from Tier 1.**',
  'first actual polygon should be **Dasmariñas Village**',
]) {
  if (!evidenceDoc.includes(marker)) {
    problems.push(
      'Corrected W5-3d1 Circuit evidence marker missing: ' + marker
    );
  }
}

if (
  !geometrySource.includes(
    'previously cited Ayala Land slide does not draw Circuit Makati'
  )
) {
  problems.push(
    'Geometry model must preserve why Circuit Makati remains geometry-less.'
  );
}

if (problems.length) {
  console.error(
    'Area geometry artifact check failed:\n- ' + problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  [
    'Area geometry artifact check passed:',
    'GeoJSON-compatible Polygon/MultiPolygon model',
    'closed-ring and coordinate validation',
    'canonical area/source linkage validation',
    artifactIds.length + ' published geometry artifacts',
    'Dasmariñas Village approximate boundary linked to canonical area',
    coordinatePairs.length + ' Dasmariñas ring positions',
    'Forbes Park approximate boundary linked to canonical area',
    forbesCoordinatePairs.length + ' Forbes Park ring positions',
    'FPA map + articles govern Forbes interpretation',
    'PSGC-derived traces checked against separate OSM snapshots',
    'Circuit Makati remains geometry-less',
  ].join(' ')
);
