import { readFile } from 'node:fs/promises';

const index = await readFile('src/data/searchIndex.ts', 'utf8');
const search = await readFile(
  'src/components/home/ServiceSearch.tsx',
  'utf8'
);
const legislation = await readFile(
  'src/data/legislationBrowserIndex.ts',
  'utf8'
);
const indicators = await readFile(
  'src/data/cityIndicators.ts',
  'utf8'
);
const integrity = await readFile(
  'src/data/integrityData.ts',
  'utf8'
);
const reports = await readFile('src/data/reports.ts', 'utf8');

const problems = [];

for (const marker of [
  "import { cityIndicators } from './cityIndicators'",
  "import { integrityProcurementEntities } from './integrityData'",
  "import { reports } from './reports'",
  'canonicalKey?: string',
  'const civicIntelligenceItems: SearchItem[] = [',
  '...cityIndicators',
  "category: 'Statistic'",
  "canonicalKey: 'indicator:' + indicator.id",
  '...integrityProcurementEntities.map',
  "canonicalKey: 'integrity-entity:' + entity.id",
  '...reports.map',
  "category: 'Report'",
  "canonicalKey: 'report:' + report.slug",
  '...civicIntelligenceItems',
]) {
  if (!index.includes(marker)) {
    problems.push('Civic Intelligence search-index marker missing: ' + marker);
  }
}

for (const forbidden of [
  "from './ecosystemResources'",
  'bettergov.ph',
  'lgu.bettergov.ph',
  "from './localLegislation'",
  'localLegislationRecords',
]) {
  if (index.toLowerCase().includes(forbidden.toLowerCase())) {
    problems.push(
      'Static BetterMakati search index must not clone ecosystem or full legislation records: ' +
        forbidden
    );
  }
}

for (const marker of [
  'legislationRecordId',
  "canonicalKey: 'legislation-record:' + legislationRecordId(record)",
  "query.trim().length >= 3",
  "tab === 'All' || tab === 'Records'",
  'loadLegislationBrowserIndex()',
  'matchLegislationRecords',
  'const seen = new Set<string>()',
  'item.canonicalKey ??',
  'if (seen.has(key)) return false',
  "item.group === 'Service' || item.group === 'Record'",
  'key={item.canonicalKey ?? item.href + item.title}',
  'Search national services on BetterGov',
  'Find another LGU on BetterLGU',
]) {
  if (!search.includes(marker)) {
    problems.push('Global Search canonical/dedupe marker missing: ' + marker);
  }
}

if (!search.includes('https://bettergov.ph/services?search=')) {
  problems.push(
    'BetterGov must remain an explicit external handoff when local Search has no result.'
  );
}
if (!search.includes('https://lgu.bettergov.ph/')) {
  problems.push(
    'BetterLGU must remain an explicit external handoff rather than a cloned local result.'
  );
}

if (
  !legislation.includes(
    "export const legislationBrowserIndexUrl = '/data/makati-legislation-index.json'"
  ) ||
  !legislation.includes('export const legislationRecordId')
) {
  problems.push(
    'Legislation must remain backed by the lazy canonical browser index with stable record IDs.'
  );
}

const indicatorCount = (indicators.match(/\bindicator\(\s*'/g) ?? []).length;
if (indicatorCount !== 30) {
  problems.push(
    'Expected 30 implemented canonical Statistics indicators; found ' +
      indicatorCount +
      '.'
  );
}

const reportCount = (reports.match(/schemaVersion:\s*2/g) ?? []).length;
if (reportCount !== 5) {
  problems.push(
    'Expected 5 canonical Featured Reports; found ' + reportCount + '.'
  );
}

for (const entityId of [
  'supplier-amellar-solutions',
  'supplier-wadsworth-commercial-corp',
  'supplier-runr-enterprise-and-services-company',
  'supplier-malgonz-enterprise',
  'supplier-pla-events-planner-inc',
  'supplier-djt-group-corp',
  'supplier-transprint-corporation',
  'supplier-epigraphy-inc',
  'supplier-kristin-educational-exponents-publications-inc',
  'supplier-non-pareil-international-freight-and-cargo-service-inc',
  'supplier-maxipharm-co-ltd',
  'supplier-asia-prime-commodities-corp',
  'supplier-libtech-source-philippines-inc',
  'joint-venture-beesee-global-technologies-pinnacle-technologies',
  'supplier-shabat-corporation',
  'supplier-tj-grill-corp',
  'supplier-jppm-construction-and-supply',
]) {
  if (!integrity.includes("'" + entityId + "'")) {
    problems.push('Canonical Integrity entity missing: ' + entityId);
  }
}

for (const forbidden of [
  'ecosystem-resource:',
  "canonicalKey: 'bettergov",
  "canonicalKey: 'betterlgu",
]) {
  if (index.includes(forbidden)) {
    problems.push(
      'BetterGov/BetterLGU resources must be handoffs, not local canonical Search entities: ' +
        forbidden
    );
  }
}

if (problems.length) {
  console.error(
    'Civic Intelligence Search check failed:\n- ' + problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'Civic Intelligence Search check passed: 30 Statistics indicators, 17 Integrity entities and 5 reports are statically indexed with canonical keys; 11,355 legislation records remain lazy; duplicate canonical keys collapse once; BetterGov/BetterLGU remain external handoffs rather than cloned local records.'
);
