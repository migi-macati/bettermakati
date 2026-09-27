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

if (artifactIds.length !== 1) {
  problems.push(
    'W5-3d3 expects exactly one published area geometry artifact; found ' +
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

const coordinatePairs = [
  ...artifactBlock.matchAll(/\[([0-9]+\.[0-9]+),\s*([0-9]+\.[0-9]+)\]/g),
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
    artifactIds.length + ' published geometry artifact',
    'Dasmariñas Village approximate boundary linked to canonical area',
    coordinatePairs.length + ' ring positions',
    'DVA perimeter + Village Map govern interpretation',
    'PSGC-derived polygon checked against OSM relation 103761',
    'Circuit Makati remains geometry-less',
  ].join(' ')
);
