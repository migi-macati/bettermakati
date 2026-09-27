import { readFile } from 'node:fs/promises';

const source = await readFile(
  'src/data/areaOrganizationRegistry.ts',
  'utf8'
);

const problems = [];

for (const marker of [
  "export interface CivicAreaRecord",
  "export interface CivicOrganizationRecord",
  "export interface CivicAreaRelationship",
  "barangaySlugs: string[]",
  "geometry?: CivicAreaGeometry",
  "'within-area'",
  "'within-barangay'",
  "'managed-by'",
  "'developed-by'",
  "'place-within-area'",
  "channels: CivicOrganizationChannel[]",
  "sourceIds: string[]",
  "validateAreaOrganizationRegistry",
  "export const civicAreas: CivicAreaRecord[] = []",
  "export const civicOrganizations: CivicOrganizationRecord[] = []",
  "export const civicAreaRelationships: CivicAreaRelationship[] = []",
]) {
  if (!source.includes(marker)) {
    problems.push('Area/organization registry schema marker missing: ' + marker);
  }
}

if (/\b(?:lat|lng|centroid):\s*(?:number|\{)/.test(source)) {
  problems.push(
    'Area schema must not require a fake point or centroid for canonical areas.'
  );
}

if (!source.includes("['area', 'area']")) {
  problems.push('Area hierarchy endpoint validation is missing.');
}

if (!source.includes("['area', 'barangay']")) {
  problems.push('Area-to-barangay endpoint validation is missing.');
}

if (!source.includes("['area', 'organization']")) {
  problems.push('Area-to-organization endpoint validation is missing.');
}

if (!source.includes("['place', 'area']")) {
  problems.push('Place-to-area endpoint validation is missing.');
}

if (
  !source.includes(
    "W5-3b2 will populate source-backed area, organization and relationship records."
  )
) {
  problems.push(
    'Schema-only guard is missing; W5-3b1 should not silently populate unsourced records.'
  );
}

if (problems.length) {
  console.error(
    'Area/organization registry schema check failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  [
    'Area/organization registry schema check passed:',
    'optional sourced area geometry',
    'multi-barangay support',
    'area hierarchy',
    'management/developer relationships',
    'organization channels',
    'place-to-area relationships',
    'relationship provenance',
    'W5-3b1 data arrays intentionally empty',
  ].join(' ')
);
