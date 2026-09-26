import { readFile } from 'node:fs/promises';

const shared = await readFile(
  'src/data/integrityCivicRelationships.ts',
  'utf8'
);
const integrityGraphCheck = await readFile(
  'scripts/check-integrity-relationships.mjs',
  'utf8'
);
const ecosystem = await readFile(
  'src/data/ecosystemResources.ts',
  'utf8'
);
const integrityPage = await readFile('src/pages/Integrity.tsx', 'utf8');
const accountabilityPage = await readFile(
  'src/pages/Accountability.tsx',
  'utf8'
);
const projectsPage = await readFile(
  'src/pages/ProjectsBudget.tsx',
  'utf8'
);
const recordsPage = await readFile(
  'src/pages/PublicRecords.tsx',
  'utf8'
);
const accountabilitySupplement = await readFile(
  'src/data/accountabilitySupplement.ts',
  'utf8'
);

const problems = [];

for (const marker of [
  'integrityRelationships.map',
  'projectedIntegrityEdges',
  'sharedRefFor',
  "'integrity-entity'",
  "'integrity-record'",
  "'accountability-record'",
  "'procurement-award'",
  "'procurement-contract'",
  "'audit-finding'",
  "'audit-action'",
  "'audit-resolution-trail'",
  'publicRecordByUrl.get(source.url)',
  "kind: 'source-for'",
  "basis: 'shared-canonical-owner'",
  'The Integrity record and Public Records catalog item resolve to the same source URL.',
  "id: 'philgeps'",
  "kind: 'continuation-resource'",
  "basis: 'curated-ecosystem-context'",
  'it is not evidence for this Makati award',
  'integrityForAccountability',
  'integrityForPublicRecord',
  'integrityProcurementContextLinks',
  'placeEdges: 0',
  'duplicateProjectAliasEdges: 0',
]) {
  if (!shared.includes(marker)) {
    problems.push('Integrity civic relationship marker missing: ' + marker);
  }
}

if (
  !integrityGraphCheck.includes(
    'Expected relationship formula to produce 110 edges'
  )
) {
  problems.push(
    'W4-5d projection must remain anchored to the validated 110-edge canonical Integrity graph.'
  );
}

const seedStart = accountabilitySupplement.indexOf(
  'const procurementSeeds: ProcurementSeed[] = ['
);
const seedEnd = accountabilitySupplement.indexOf(
  'export const procurementProjectEntries'
);
const seedBlock =
  seedStart >= 0 && seedEnd > seedStart
    ? accountabilitySupplement.slice(seedStart, seedEnd)
    : '';
const awardCount = (
  seedBlock.match(/referenceNo:\s*'[^']+'/g) ?? []
).length;

if (awardCount !== 21) {
  problems.push(
    'Expected 21 procurement awards for BetterGov continuation links; found ' +
      awardCount +
      '.'
  );
}

if (
  !shared.includes(
    'const ecosystemEdges: CivicIntelligenceRelationship[] =\n  procurementAwardRefs.map'
  )
) {
  problems.push(
    'Each canonical procurement award must derive one BetterGov procurement-discovery continuation edge.'
  );
}

for (const marker of [
  "id: 'transparency'",
  "role: 'national-transparency-context'",
  "id: 'philgeps'",
  "role: 'national-procurement-discovery'",
  'It does not establish any Makati-specific Integrity fact.',
  'does not assert an exact PhilGEPS notice match',
]) {
  if (!ecosystem.includes(marker)) {
    problems.push('BetterGov Integrity-context marker missing: ' + marker);
  }
}

for (const marker of [
  'civicLinksForAward(award.id)',
  'civicLinksForFinding(finding.id)',
  'procurementContextLinks.map',
  'Accountability record',
  'Source catalog',
]) {
  if (!integrityPage.includes(marker)) {
    problems.push('Integrity page cross-link marker missing: ' + marker);
  }
}

for (const marker of [
  "import { integrityForAccountability } from '../data/integrityCivicRelationships'",
  'const integrityLinks = integrityForAccountability(entry.id)',
  'Integrity evidence',
]) {
  if (!accountabilityPage.includes(marker)) {
    problems.push('Accountability backlink marker missing: ' + marker);
  }
}

for (const marker of [
  "import { integrityForAccountability } from '../data/integrityCivicRelationships'",
  'const integrityLinks = integrityForAccountability(item.id)',
  'Integrity evidence',
]) {
  if (!projectsPage.includes(marker)) {
    problems.push('Projects & Budget backlink marker missing: ' + marker);
  }
}

for (const marker of [
  "import { integrityForPublicRecord } from '../data/integrityCivicRelationships'",
  'const integrityLinks = integrityForPublicRecord(record.id)',
  'Integrity evidence',
]) {
  if (!recordsPage.includes(marker)) {
    problems.push('Public Records backlink marker missing: ' + marker);
  }
}

for (const forbidden of [
  'placeRegistry',
  "type: 'place'",
  "type: 'project'",
  'fuzzy',
  'similarity',
  'levenshtein',
  'titleMatch',
  'locationMatch',
]) {
  if (shared.toLowerCase().includes(forbidden.toLowerCase())) {
    problems.push(
      'Integrity cross-linking must not infer place/project identity or fuzzy-match records: ' +
        forbidden
    );
  }
}

for (const forbidden of [
  'riskScore',
  'riskLevel',
  'corruptionScore',
  'redFlag',
  'suspectedConflict',
  'probableOwner',
  'likelyOwner',
  'guilt',
]) {
  if (shared.includes(forbidden)) {
    problems.push(
      'Shared Integrity relationships must not add inferential integrity labels: ' +
        forbidden
    );
  }
}

if (problems.length) {
  console.error(
    'Integrity Civic Intelligence relationship check failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'Integrity Civic Intelligence relationship check passed: the validated 110-edge Integrity graph is projected into the shared model, 21 procurement awards receive BetterGov discovery continuations, Public Records links require exact source-URL equality, and Accountability/Projects/Records backlinks are present without inferred place or duplicate project nodes.'
);
