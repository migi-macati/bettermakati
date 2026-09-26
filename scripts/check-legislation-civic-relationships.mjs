import { readFile } from 'node:fs/promises';

const relationships = await readFile(
  'src/data/legislationCivicRelationships.ts',
  'utf8'
);
const legislation = await readFile(
  'src/data/localLegislation.ts',
  'utf8'
);
const legislationPage = await readFile(
  'src/pages/Legislation.tsx',
  'utf8'
);
const serviceGuide = await readFile(
  'src/pages/ServiceGuide.tsx',
  'utf8'
);

const problems = [];

for (const marker of [
  'civicRelationshipEdges',
  'record.relationships.map',
  "relationship.evidence.basis === 'official-cross-reference'",
  "'source-stated' as const",
  'cityMonitorEdges',
  'event.cityMonitorRecordId',
  'evidence.cityMonitorRecordId',
  'publicRecordEdges',
  'publicRecords.find(item => item.url === document.url)',
  'legislationCivicRelationshipIndex',
  'legislationCivicNodeResolver',
  'legislationRelatedRecords',
  'legislationForService',
  'Unresolved Legislation relationship source',
  'Unresolved Legislation relationship target',
]) {
  if (!relationships.includes(marker)) {
    problems.push('Legislation relationship marker missing: ' + marker);
  }
}

for (const canonicalMarker of [
  "targetId: 'civil-registration'",
  "targetId: 'local-civil-registry-copy'",
  "statement:",
  "basis: 'official-title'",
]) {
  if (!legislation.includes(canonicalMarker)) {
    problems.push(
      'Canonical verified legislation relationship missing: ' +
        canonicalMarker
    );
  }
}

for (const uiMarker of [
  "import { legislationRelatedRecords } from '../data/legislationCivicRelationships'",
  'Related BetterMakati records',
  'legislationRelatedRecords(seed.id)',
]) {
  if (!legislationPage.includes(uiMarker)) {
    problems.push('Legislation page backlink marker missing: ' + uiMarker);
  }
}

for (const uiMarker of [
  "import { legislationForService } from '../data/legislationCivicRelationships'",
  'const relatedLegislation = legislationForService(item.id)',
  'Related local legislation',
  'Historical measures connected to this service',
  'They do not establish the service’s current fee, rule or legal effect.',
]) {
  if (!serviceGuide.includes(uiMarker)) {
    problems.push('Service legislation backlink marker missing: ' + uiMarker);
  }
}

for (const forbidden of [
  '.includes(relationship',
  'fuzzy',
  'similarity',
  'levenshtein',
  'keyword',
  'titleMatch',
]) {
  if (relationships.toLowerCase().includes(forbidden.toLowerCase())) {
    problems.push(
      'Legislation cross-linking must not infer relationships from text similarity: ' +
        forbidden
    );
  }
}

const explicitServiceTargets = (
  legislation.match(/targetType:\s*'service'/g) ?? []
).length;
if (explicitServiceTargets !== 2) {
  problems.push(
    'Expected exactly 2 explicit canonical service relationships; found ' +
      explicitServiceTargets +
      '.'
  );
}

for (const targetType of [
  'barangay',
  'place',
  'project',
  'accountability-record',
]) {
  const count = (
    legislation.match(
      new RegExp("targetType:\\s*'" + targetType + "'", 'g')
    ) ?? []
  ).length;
  if (count !== 0) {
    problems.push(
      'W4-5c must not add inferred ' +
        targetType +
        ' relationships; found ' +
        count +
        '.'
    );
  }
}

if (
  !legislationPage.includes('openCongressMakatiRecords') ||
  !legislationPage.includes('Open Congress data')
) {
  problems.push(
    'Existing reviewed BetterGov Open Congress national-law context must remain available on the Legislation page.'
  );
}

if (problems.length) {
  console.error(
    'Legislation Civic Intelligence relationship check failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'Legislation Civic Intelligence relationship check passed: 2 source-backed service links are bidirectional; City Monitor/Public Records hooks require explicit IDs or shared source URLs; no barangay/place/project/Accountability relationship is inferred; reviewed Open Congress national context remains available.'
);
