import { readFile } from 'node:fs/promises';

const integritySource = await readFile('src/data/integrityData.ts', 'utf8');
const procurementSource = await readFile(
  'src/data/accountabilitySupplement.ts',
  'utf8'
);

const problems = [];

const seedStart = procurementSource.indexOf(
  'const procurementSeeds: ProcurementSeed[] = ['
);
const seedEnd = procurementSource.indexOf(
  'export const procurementProjectEntries'
);

if (seedStart < 0 || seedEnd < 0 || seedEnd <= seedStart) {
  problems.push('Unable to locate procurement seed registry.');
}

const seedSource =
  seedStart >= 0 && seedEnd > seedStart
    ? procurementSource.slice(seedStart, seedEnd)
    : '';

const supplierNames = [
  ...seedSource.matchAll(/supplier:\s*'([^']+)'/g),
].map(match => match[1]);

const references = [
  ...seedSource.matchAll(/referenceNo:\s*'([^']+)'/g),
].map(match => match[1]);

const uniqueSupplierNames = [...new Set(supplierNames)];

if (supplierNames.length !== 21) {
  problems.push(
    'Expected 21 procurement supplier assignments; found ' +
      supplierNames.length +
      '.'
  );
}

if (references.length !== 21) {
  problems.push(
    'Expected 21 procurement reference numbers; found ' +
      references.length +
      '.'
  );
}

if (uniqueSupplierNames.length !== 17) {
  problems.push(
    'Expected 17 unique source-stated supplier identities; found ' +
      uniqueSupplierNames.length +
      '.'
  );
}

const mappingStart = integritySource.indexOf(
  'const supplierEntityIdBySourceName: Record<string, string> = {'
);
const mappingEnd = integritySource.indexOf(
  'export const integrityProcurementSources'
);
const mappingSource =
  mappingStart >= 0 && mappingEnd > mappingStart
    ? integritySource.slice(mappingStart, mappingEnd)
    : '';

const mappings = [
  ...mappingSource.matchAll(/'([^']+)':\s*(?:\n\s*)?'([^']+)'/g),
].map(match => ({
  sourceName: match[1],
  entityId: match[2],
}));

if (mappings.length !== 17) {
  problems.push(
    'Expected 17 explicit supplier-to-entity mappings; found ' +
      mappings.length +
      '.'
  );
}

const mappingNames = mappings.map(item => item.sourceName);
const mappingIds = mappings.map(item => item.entityId);

for (const supplierName of uniqueSupplierNames) {
  if (!mappingNames.includes(supplierName)) {
    problems.push(
      'Procurement supplier has no canonical entity mapping: ' + supplierName
    );
  }
}

for (const mappedName of mappingNames) {
  if (!uniqueSupplierNames.includes(mappedName)) {
    problems.push(
      'Canonical entity mapping has no current procurement supplier: ' +
        mappedName
    );
  }
}

if (new Set(mappingIds).size !== mappingIds.length) {
  problems.push('Canonical supplier entity IDs must be unique.');
}

const repeatedSuppliers = supplierNames.filter(
  (name, index, all) => all.indexOf(name) !== index
);
for (const supplierName of [...new Set(repeatedSuppliers)]) {
  const matchingMappings = mappings.filter(
    item => item.sourceName === supplierName
  );
  if (matchingMappings.length !== 1) {
    problems.push(
      'Repeated supplier must resolve to exactly one canonical entity: ' +
        supplierName
    );
  }
}

for (const marker of [
  "id: 'makati-procurement-2025-q2-bid-results'",
  "url: procurementQ22025Source",
  "id: 'makati-procurement-2024-q3-bid-results'",
  "url: procurementQ32024Source",
  "publisher: 'City Government of Makati'",
  'sourceIdByUrl.get(source.url)',
  'accountabilityEntryId: entry.id',
  'referenceNo: procurement.referenceNo',
  'title: entry.title',
  'bidOrAwardDate: procurement.bidDate',
  'approvedBudgetM: procurement.approvedBudgetM',
  'awardedAmountM: procurement.awardedAmountM',
  'supplierEntityIds: [supplierEntityId]',
  "id: 'award-' + entry.id.replace(/^procurement-/, '')",
]) {
  if (!integritySource.includes(marker)) {
    problems.push('Integrity procurement lineage marker missing: ' + marker);
  }
}

if (
  !integritySource.includes(
    "'Beesee Global Technologies Inc. / Pinnacle Technologies Inc. (JV)'"
  ) ||
  !integritySource.includes(
    "'joint-venture-beesee-global-technologies-pinnacle-technologies'"
  ) ||
  !integritySource.includes(
    "kind: jointVenture ? 'joint-venture' : 'supplier'"
  )
) {
  problems.push(
    'Source-stated joint venture must remain one explicit joint-venture identity in W4-3c.'
  );
}

for (const forbidden of [
  'beneficialOwner',
  'beneficialOwnership',
  'conflictOfInterest',
  'recusalRecord',
  'riskScore',
  'riskLevel',
  'redFlag',
  'corruptionScore',
]) {
  if (integritySource.includes(forbidden)) {
    problems.push(
      'W4-3c must not add ownership research or risk inference: ' + forbidden
    );
  }
}

if (problems.length) {
  console.error(
    'Integrity procurement normalization audit failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'Integrity procurement normalization audit passed: 21 awards resolve from 17 canonical source-stated supplier identities, with exact Makati bid-result source lineage and no ownership/risk inference.'
);
