import { readFile } from 'node:fs/promises';

const model = await readFile(
  'src/data/civicIntelligenceRelationships.ts',
  'utf8'
);

const problems = [];

for (const marker of [
  "'indicator'",
  "'legislation-record'",
  "'integrity-entity'",
  "'integrity-record'",
  "'procurement-contract'",
  "'report'",
  "'place'",
  "'segment'",
  "'route'",
  "'barangay'",
  "'service'",
  "'project'",
  "'accountability-record'",
  "'city-monitor-record'",
  "'public-record'",
  "'ecosystem-resource'",
  "'bettergov'",
  "'betterlgu'",
  'export interface CivicIntelligenceRelationship',
  'from: CivicIntelligenceReference',
  'to: CivicIntelligenceReference',
  'evidence: CivicIntelligenceRelationshipEvidence',
  "'official-cross-reference'",
  "'source-stated'",
  "'declared-analysis-input'",
  "'explicit-geography'",
  "'curated-ecosystem-context'",
  'createCivicIntelligenceRelationshipIndex',
  "direction: 'outbound'",
  "direction: 'inbound'",
  'outboundFrom:',
  'inboundTo:',
  'resolveCivicIntelligenceRelationshipViews',
  'composeCivicIntelligenceNodeResolvers',
  'Duplicate/reverse Civic Intelligence relationship must be derived as a backlink, not stored twice',
]) {
  if (!model.includes(marker)) {
    problems.push('Shared relationship model marker missing: ' + marker);
  }
}

if (/^import\s/m.test(model)) {
  problems.push(
    'The shared relationship model must not import canonical domain modules; domain imports would create circular ownership risk.'
  );
}

const relationshipInterface = model.match(
  /export interface CivicIntelligenceRelationship \{([\s\S]*?)\n\}/
)?.[1];

if (!relationshipInterface) {
  problems.push('Could not inspect CivicIntelligenceRelationship interface.');
} else {
  for (const forbidden of [
    'label:',
    'title:',
    'href:',
    'url:',
    'summary:',
    'amount:',
    'status:',
  ]) {
    if (relationshipInterface.includes(forbidden)) {
      problems.push(
        'Relationship edges must not duplicate canonical record payload fields: ' +
          forbidden
      );
    }
  }
}

for (const helper of [
  'civicIntelligenceRefKey',
  'sameCivicIntelligenceRef',
  'validateCivicIntelligenceRelationships',
]) {
  if (!model.includes('export const ' + helper)) {
    problems.push('Shared relationship helper missing: ' + helper);
  }
}

if (
  !model.includes(
    "relationship.evidence.basis === 'official-cross-reference'"
  ) ||
  !model.includes(
    "relationship.evidence.basis === 'source-stated'"
  ) ||
  !model.includes('relationship.evidence.sourceIds.length') ||
  !model.includes('relationship.evidence.statement')
) {
  problems.push(
    'Source-backed relationship evidence must require source ids and a source-backed statement.'
  );
}

if (
  !model.includes(
    "relationship.evidence.basis === 'curated-ecosystem-context'"
  ) ||
  !model.includes('relationship.evidence.note')
) {
  problems.push(
    'BetterGov/BetterLGU context links must carry an explicit curation note rather than inferred topical matching.'
  );
}

if (problems.length) {
  console.error(
    'Civic Intelligence relationship model check failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'Civic Intelligence relationship model check passed: all Wave 4 civic domains have typed references, canonical payloads remain in their owning modules, one stored edge yields inbound/outbound navigation, and source/ecosystem relationships carry explicit evidence.'
);
