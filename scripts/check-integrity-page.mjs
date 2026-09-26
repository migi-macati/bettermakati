import { readFile } from 'node:fs/promises';

const page = await readFile('src/pages/Integrity.tsx', 'utf8');
const problems = [];

for (const marker of [
  "from '../data/integrityData'",
  "from '../data/integrityDisclosures'",
  "from '../data/integrityAuditTrails'",
  "from '../data/integrityRelationships'",
  'Search integrity records',
  "id=\"procurement\"",
  'Suppliers & awards',
  "id=\"disclosures\"",
  'Disclosure research',
  'Not retrieved',
  "id=\"audits\"",
  'Audit finding trails',
  'Why unresolved',
  "id=\"sources\"",
  '>Sources<',
  'Open source',
  'Open procurement table',
  'Open Accountability audit ledger',
  'Open COA source',
  '26 September 2026',
]) {
  if (!page.includes(marker)) {
    problems.push('Missing evidence-first Integrity page marker: ' + marker);
  }
}

for (const oldStructure of [
  'Public standards',
  'Rules & records',
  'Published gaps',
  'Coverage gaps',
  'Open-government doctrine',
  'Supplier and contractor graph',
  'Beneficial ownership linkage',
  'Conflict and recusal records',
]) {
  if (page.includes(oldStructure)) {
    problems.push(
      'Legacy standards/gaps sermon structure remains on Integrity page: ' +
        oldStructure
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
  if (page.includes(forbidden)) {
    problems.push(
      'Integrity page must not add inferential integrity labels: ' + forbidden
    );
  }
}

if (!page.includes('integrityProcurementAwards.length')) {
  problems.push('Indexed-award count must be derived from canonical data.');
}
if (!page.includes('integrityProcurementEntities.length')) {
  problems.push('Supplier/JV count must be derived from canonical data.');
}
if (!page.includes('integrityDisclosureRecords.length')) {
  problems.push('Disclosure count must be derived from canonical data.');
}
if (!page.includes('integrityAuditFindings.length')) {
  problems.push('Audit finding count must be derived from canonical data.');
}

if (
  !page.includes('target="_blank"') ||
  !page.includes('rel="noreferrer"')
) {
  problems.push('External evidence links must open safely as direct sources.');
}

if (
  !page.includes("view === 'all' || view === 'procurement'") ||
  !page.includes("view === 'all' || view === 'disclosures'") ||
  !page.includes("view === 'all' || view === 'audits'") ||
  !page.includes("view === 'all' || view === 'sources'")
) {
  problems.push('Integrity page record views must remain independently filterable.');
}

if (problems.length) {
  console.error(
    'Integrity page check failed:\n- ' + problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'Integrity page check passed: evidence-first supplier, disclosure, audit and source views are searchable, direct-source linked and free of the legacy standards/gaps sermon structure.'
);
