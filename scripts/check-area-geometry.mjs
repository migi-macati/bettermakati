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

if (artifactIds.length !== 0) {
  problems.push(
    'W5-3d2 must keep geometry artifacts empty after the Circuit Makati source correction; found ' +
      artifactIds.length +
      '.'
  );
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
    '0 published geometry artifacts after Circuit source correction',
    'Circuit Makati remains geometry-less',
    'Dasmariñas Village is the next trace candidate',
  ].join(' ')
);
