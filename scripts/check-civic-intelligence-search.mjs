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
const areas = await readFile(
  'src/data/areaOrganizationRegistry.ts',
  'utf8'
);
const navigation = await readFile('src/data/navigation.ts', 'utf8');
const searchPage = await readFile('src/pages/Search.tsx', 'utf8');
const enLocale = await readFile('src/locales/en.json', 'utf8');
const mobilitySystems = await readFile(
  'src/data/mobilitySystems.ts',
  'utf8'
);
const mobilityRoutes = await readFile(
  'src/data/mobilityRoutes.ts',
  'utf8'
);
const mobilityNetwork = await readFile(
  'src/data/mobilityNetwork.ts',
  'utf8'
);

const problems = [];

for (const marker of [
  "import { cityIndicators } from './cityIndicators'",
  "import { integrityProcurementEntities } from './integrityData'",
  "import { reports } from './reports'",
  "civicAreas,",
  "civicOrganizations,",
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

for (const marker of [
  "'Area'",
  "'Organization'",
  'const areaOrganizationItems: SearchItem[] = [',
  '...civicAreas.map',
  "canonicalKey: 'area:' + area.id",
  '...civicOrganizations.map',
  "canonicalKey: 'organization:' + organization.id",
  '...areaOrganizationItems',
  "href: '/estates#area-' + area.id",
  "href: '/estates#organization-' + organization.id",
]) {
  if (!index.includes(marker)) {
    problems.push(
      'Canonical Area/Organization search marker missing: ' + marker
    );
  }
}

for (const marker of [
  "import { mobilityServices } from './mobilitySystems'",
  "import { mobilityRouteCorridors } from './mobilityRoutes'",
  "import { mobilityNetworkRelationships } from './mobilityNetwork'",
  'const mobilitySearchItems: SearchItem[] = [',
  "...mobilityServices.map",
  "...mobilityRouteCorridors.map",
  "...mobilityNetworkRelationships",
  "canonicalKey: 'mobility-service:' + service.id",
  "canonicalKey: 'mobility-route:' + route.id",
  "canonicalKey: 'mobility-network:' + relationship.id",
  "href: '/mobility#routes'",
  "href: '/mobility#interchanges'",
  '...mobilitySearchItems',
]) {
  if (!index.includes(marker)) {
    problems.push('Canonical mobility search marker missing: ' + marker);
  }
}

const mobilityServiceBlock =
  mobilitySystems
    .split('export const mobilityServices: MobilityServiceRecord[] = [')[1]
    ?.split('\n];\n\nexport const validateMobilityServices')[0] ?? '';

const mobilityRouteBlock =
  mobilityRoutes
    .split(
      'export const mobilityRouteCorridors: MobilityRouteCorridorRecord[] = ['
    )[1]
    ?.split(
      '\n];\n\nexport const validateMobilityRouteCorridors'
    )[0] ?? '';

const mobilityExplicitNetworkBlock =
  mobilityNetwork
    .split(
      'const explicitNetworkRelationships: MobilityNetworkRelationship[] = ['
    )[1]
    ?.split(
      '\n];\n\nexport const mobilityNetworkRelationships'
    )[0] ?? '';

const mobilityServiceCount = (
  mobilityServiceBlock.match(/^    id: '[^']+',$/gm) ?? []
).length;
const mobilityRouteCount = (
  mobilityRouteBlock.match(/^    id: '[^']+',$/gm) ?? []
).length;
const mobilitySearchableNetworkCount = (
  mobilityExplicitNetworkBlock.match(
    /^    id: '(?:transfer|service-hub)-[^']+',$/gm
  ) ?? []
).length;

if (mobilityServiceCount !== 4) {
  problems.push(
    'Expected 4 canonical mobility services for Search; found ' +
      mobilityServiceCount +
      '.'
  );
}
if (mobilityRouteCount !== 67) {
  problems.push(
    'Expected 67 canonical mobility routes for Search; found ' +
      mobilityRouteCount +
      '.'
  );
}
if (mobilitySearchableNetworkCount !== 7) {
  problems.push(
    'Expected 7 canonical explicit mobility interchange relationships for Search; found ' +
      mobilitySearchableNetworkCount +
      '.'
  );
}

const areaBlock =
  areas
    .split('export const civicAreas: CivicAreaRecord[] = [')[1]
    ?.split('\n];\n\nexport const civicOrganizations')[0] ?? '';
const organizationBlock =
  areas
    .split('export const civicOrganizations: CivicOrganizationRecord[] = [')[1]
    ?.split('\n];\n\nexport const civicAreaRelationships')[0] ?? '';

const areaCount = (
  areaBlock.match(/^    id: '[^']+',$/gm) ?? []
).length;
const organizationCount = (
  organizationBlock.match(/^    id: '[^']+',$/gm) ?? []
).length;

if (areaCount !== 13) {
  problems.push(
    'Expected 13 canonical Area search sources; found ' + areaCount + '.'
  );
}
if (organizationCount !== 11) {
  problems.push(
    'Expected 11 canonical Organization search sources; found ' +
      organizationCount +
      '.'
  );
}

for (const requiredSearchName of [
  'Ayala Center Estate Association, Inc.',
  'Circuit Makati Estate Association, Inc.',
  'Magallanes Village Association, Inc.',
  'Urdaneta Village Association, Inc.',
]) {
  if (!areas.includes("name: '" + requiredSearchName + "'")) {
    problems.push(
      'Expected canonical organization missing from searchable registry: ' +
        requiredSearchName
    );
  }
}

for (const legacy of [
  "title: 'Bel-Air Village Association'",
  "title: 'Dasmariñas Village Association'",
  "title: 'Forbes Park Association'",
  "title: 'San Lorenzo Village Association'",
]) {
  if (index.includes(legacy)) {
    problems.push(
      'Legacy hand-written HOA search entry remains instead of canonical registry indexing: ' +
        legacy
    );
  }
}

if (index.includes('barangay.associations')) {
  problems.push(
    'Barangay search keywords still depend on removed legacy association payloads.'
  );
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
  "item.group === 'Organization'",
  "item.group === 'Area'",
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
  "t('serviceSearch.betterGov')",
  "t('serviceSearch.betterLgu')",
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

if (
  !navigation.includes("id: 'areas'") ||
  !navigation.includes("labelKey: 'navigation.areas'") ||
  !navigation.includes("href: '/estates'")
) {
  problems.push(
    'Area/Organization navigation must keep a discoverable /estates entry.'
  );
}

if (
  !searchPage.includes("t('discovery.search.description')") ||
  !enLocale.includes('districts and estates') ||
  !enLocale.includes('organizations')
) {
  problems.push(
    'Search page scope copy must explicitly include canonical areas and organizations.'
  );
}

if (problems.length) {
  console.error(
    'Civic Intelligence Search check failed:\n- ' + problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'Civic Intelligence Search check passed: canonical Statistics, Integrity, reports, Areas, Organizations and mobility entities are indexed; mobility contributes 4 systems, 67 routes and 7 explicit interchange relationships; legislation remains lazy; duplicate canonical keys collapse once; BetterGov/BetterLGU remain external handoffs rather than cloned local records.'
);
