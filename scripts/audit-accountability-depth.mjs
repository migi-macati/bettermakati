import { readFile } from 'node:fs/promises';

const accountability = await readFile('src/data/accountability.ts', 'utf8');
const supplement = await readFile('src/data/accountabilitySupplement.ts', 'utf8');
const page = await readFile('src/pages/Accountability.tsx', 'utf8');

const problems = [];

const coverageIds = [
  ...accountability.matchAll(/id:\s*'(fiscal|project|audit|service|commitment)'/g),
].map(match => match[1]);
for (const id of ['fiscal', 'project', 'audit', 'service', 'commitment']) {
  if (!coverageIds.includes(id)) {
    problems.push(`Accountability coverage matrix is missing ${id}.`);
  }
}

const procurementSeedBlock =
  supplement.split('const procurementSeeds: ProcurementSeed[] = [')[1]?.split(
    'export const procurementProjectEntries'
  )[0] ?? '';
const procurementRefs = [
  ...procurementSeedBlock.matchAll(/referenceNo:\s*'([^']+)'/g),
].map(match => match[1]);
if (procurementRefs.length < 21) {
  problems.push(
    `Structured procurement coverage fell below 21 records: ${procurementRefs.length}.`
  );
}

const commitmentBlock =
  supplement.split('export const publicCommitmentEntries')[1]?.split(
    'const sef2024Url'
  )[0] ?? '';
const commitmentIds = [
  ...commitmentBlock.matchAll(/id:\s*'commitment-[^']+'/g),
];
if (commitmentIds.length < 3) {
  problems.push(
    `Public commitment coverage fell below 3 records: ${commitmentIds.length}.`
  );
}

const auditBlock =
  supplement.split('export const auditFindingEntries')[1] ?? '';
const auditIds = [...auditBlock.matchAll(/id:\s*'audit-[^']+'/g)];
if (auditIds.length < 4) {
  problems.push(
    `Audit finding coverage fell below 4 records: ${auditIds.length}.`
  );
}

if (!supplement.includes("barangaySlug: 'poblacion'")) {
  problems.push('Poblacion accountability evidence lost its explicit barangay tag.');
}
if (
  (supplement.match(/barangaySlug:\s*'bel-air'/g) || []).length < 2
) {
  problems.push('Bel-Air accountability commitments lost explicit barangay tags.');
}

if (!page.includes("entry.barangaySlug === barangay.slug")) {
  problems.push(
    'Barangay accountability scope must use explicit barangaySlug tags.'
  );
}
if (!page.includes('scopedEntries = barangay ? locallyTaggedEntries : accountabilityEntries')) {
  problems.push(
    'Barangay accountability scope must not fall back to the citywide ledger when local evidence is missing.'
  );
}
if (page.includes('const needle = barangay.name.toLowerCase()')) {
  problems.push(
    'Barangay accountability scope must not use free-text name matching.'
  );
}

for (const marker of [
  'What the ledger currently covers',
  'What evidence is missing next',
  'unique public source URLs',
  'source_urls',
  'barangay_slug',
]) {
  if (!page.includes(marker)) {
    problems.push(`Accountability page/data export is missing required marker: ${marker}.`);
  }
}

const gapIds = [
  ...accountability.matchAll(/id:\s*'(project-contract-linkage|audit-follow-through|public-commitments|barangay-disclosures)'/g),
].map(match => match[1]);
if (new Set(gapIds).size < 4) {
  problems.push('Accountability coverage gaps must keep the four baseline gap classes.');
}

if (!accountability.includes("export const accountabilityReviewed = '24 September 2026';")) {
  problems.push('Accountability reviewed date is not current for Wave 1.4.');
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log(
  `Accountability-depth audit passed: 5 coverage areas; ${procurementRefs.length} procurement records; ${commitmentIds.length} commitments; ${auditIds.length} audit findings; explicit barangay scoping enforced.`
);
