import { readFile } from 'node:fs/promises';

const [
  indicatorSource,
  populationInventorySource,
  economicInventorySource,
  infrastructureInventorySource,
  barangaySource,
  cityComparisonSource,
  budgetSource,
  migrationSource,
] = await Promise.all([
  readFile('src/data/cityIndicators.ts', 'utf8'),
  readFile('data/wave4-population-demographic-source-inventory.json', 'utf8'),
  readFile('data/wave4-economic-business-source-inventory.json', 'utf8'),
  readFile('data/wave4-service-land-infrastructure-source-inventory.json', 'utf8'),
  readFile('src/data/barangays.ts', 'utf8'),
  readFile('src/data/cityComparison.ts', 'utf8'),
  readFile('src/data/budget2025.ts', 'utf8'),
  readFile('data/wave4-statistics-data-migration.json', 'utf8'),
]);

const populationInventory = JSON.parse(populationInventorySource);
const economicInventory = JSON.parse(economicInventorySource);
const infrastructureInventory = JSON.parse(infrastructureInventorySource);
const migration = JSON.parse(migrationSource);

const problems = [];

const duplicateValues = values =>
  [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];

const inventories = [
  populationInventory,
  economicInventory,
  infrastructureInventory,
];

const approvedIds = inventories.flatMap(
  inventory => inventory.implementationBatchRecommendation.implementFirst
);
const heldOrRejectedIds = inventories.flatMap(inventory => [
  ...inventory.implementationBatchRecommendation.hold,
  ...inventory.implementationBatchRecommendation.reject,
]);

const implementedIds = [
  ...indicatorSource.matchAll(/indicator\('([^']+)'/g),
].map(match => match[1]);

const duplicateIndicatorIds = duplicateValues(implementedIds);
if (duplicateIndicatorIds.length) {
  problems.push(
    'Duplicate city-indicator IDs: ' + duplicateIndicatorIds.join(', ')
  );
}

const missingApproved = approvedIds.filter(id => !implementedIds.includes(id));
const unexpectedImplemented = implementedIds.filter(
  id => !approvedIds.includes(id)
);
const accidentallyImplementedBlocked = heldOrRejectedIds.filter(id =>
  implementedIds.includes(id)
);

if (missingApproved.length) {
  problems.push(
    'Approved W4-1c/1d/1e indicators missing from data layer: ' +
      missingApproved.join(', ')
  );
}
if (unexpectedImplemented.length) {
  problems.push(
    'City-indicator data layer contains out-of-batch IDs: ' +
      unexpectedImplemented.join(', ')
  );
}
if (accidentallyImplementedBlocked.length) {
  problems.push(
    'Held/rejected indicators were implemented: ' +
      accidentallyImplementedBlocked.join(', ')
  );
}

const sourceRegistryBlock =
  indicatorSource
    .split(
      'export const cityIndicatorSources: Record<string, CityIndicatorSource> = {'
    )[1]
    ?.split('\n};\n\nexport const currentMakatiPopulation')[0] ?? '';

const registeredSourceIds = [
  ...sourceRegistryBlock.matchAll(/^\s{2}'([^']+)':\s*\{/gm),
].map(match => match[1]);

const duplicateSourceIds = duplicateValues(registeredSourceIds);
if (duplicateSourceIds.length) {
  problems.push(
    'Duplicate city-indicator source IDs: ' + duplicateSourceIds.join(', ')
  );
}

const sourceBoundIds = [
  ...indicatorSource.matchAll(/sourceBound\('([^']+)'/g),
].map(match => match[1]);

const sourceArrayIds = [
  ...indicatorSource.matchAll(/sourceIds:\s*\[([\s\S]*?)\]/g),
].flatMap(match =>
  [...match[1].matchAll(/'([^']+)'/g)].map(sourceMatch => sourceMatch[1])
);

for (const sourceId of new Set([...sourceBoundIds, ...sourceArrayIds])) {
  if (!registeredSourceIds.includes(sourceId)) {
    problems.push('Unregistered city-indicator source ID: ' + sourceId);
  }
}

const indicatorTargets = [
  ...indicatorSource.matchAll(
    /targetType:\s*'indicator',\s*targetId:\s*'([^']+)'/g
  ),
].map(match => match[1]);

for (const targetId of indicatorTargets) {
  if (!implementedIds.includes(targetId)) {
    problems.push('Broken indicator relationship target: ' + targetId);
  }
}

const dependencyBlocks = [
  ...indicatorSource.matchAll(/dependencies:\s*\[([^\]]+)\]/g),
].flatMap(match =>
  [...match[1].matchAll(/'([^']+)'/g)].map(dependencyMatch => dependencyMatch[1])
);

for (const dependencyId of dependencyBlocks) {
  if (!implementedIds.includes(dependencyId)) {
    problems.push('Broken derived-indicator dependency: ' + dependencyId);
  }
}

const requiredRecordFields = ['definition:', 'unit:', 'data:', 'provenance:', 'revision:', 'comparability:', 'relationships:', 'tags:'];
for (const marker of requiredRecordFields) {
  const count = indicatorSource.split(marker).length - 1;
  if (count < implementedIds.length) {
    problems.push(
      'Expected at least one ' +
        marker.replace(':', '') +
        ' field per indicator; found ' +
        count +
        ' for ' +
        implementedIds.length +
        ' indicators.'
    );
  }
}

const barangayPopulationValues = [
  ...barangaySource.matchAll(/population2024:\s*(\d+)/g),
].map(match => Number(match[1]));
const barangayPopulationSum = barangayPopulationValues.reduce(
  (sum, value) => sum + value,
  0
);

if (barangayPopulationValues.length !== 23) {
  problems.push(
    'Expected 23 canonical barangay population records; found ' +
      barangayPopulationValues.length +
      '.'
  );
}
if (barangayPopulationSum !== 309770) {
  problems.push(
    'Canonical 2024 barangay population sum drifted from 309,770: ' +
      barangayPopulationSum
  );
}
if (
  !barangaySource.includes('export const currentMakatiPopulation2024 = barangays.reduce(')
) {
  problems.push('Canonical currentMakatiPopulation2024 selector is missing.');
}
if (
  !budgetSource.includes(
    "import { currentMakatiPopulation2024 } from './barangays';"
  ) ||
  !budgetSource.includes(
    'export const cityPopulation = currentMakatiPopulation2024;'
  ) ||
  budgetSource.includes('export const cityPopulation = 309770;')
) {
  problems.push(
    'Budget data must reuse currentMakatiPopulation2024 instead of owning another population literal.'
  );
}
if (
  !indicatorSource.includes(
    'export const currentMakatiPopulation = currentMakatiPopulation2024;'
  ) ||
  indicatorSource.includes('value: 309770')
) {
  problems.push(
    'City indicators must resolve 2024 population from canonical barangay data.'
  );
}

const makatiComparisonMatch = cityComparisonSource.match(
  /\{ city: 'Makati',[^}]*gdpPerPerson:\s*(\d+),[^}]*isMakati:\s*true/
);
if (!makatiComparisonMatch) {
  problems.push('Canonical 2024 Makati GDP-per-person comparison row is missing.');
} else if (
  !indicatorSource.includes('value: makati2024GdpPerPerson') ||
  indicatorSource.includes('value: 3889202')
) {
  problems.push(
    'GDP-per-capita indicator must consume the canonical CityComparison value rather than duplicate 3,889,202.'
  );
}

if (indicatorSource.includes("from './placeRegistry'")) {
  problems.push(
    'City indicators must not import Place Registry as a statistical denominator.'
  );
}
if (
  !indicatorSource.includes("indicator('public-parks-administrative-count'") ||
  !indicatorSource.includes('value: 15') ||
  !indicatorSource.includes(
    'This official denominator is not the same as the current 13-park civic-audit target set.'
  )
) {
  problems.push(
    'Public-park indicator must preserve the official 15-park denominator and the 13-target audit scope distinction.'
  );
}

for (const marker of [
  "indicator('real-gdp-level'",
  "period: ['2022', '2023', '2024', '2025']",
  'PSA PPA footnotes exclude the transferred Embo barangays starting in 2022.',
  "indicator('resident-employment-rate'",
  'Resident-based rate; it is not workplace employment in Makati establishments.',
  "indicator('yakap-gamot-providers-makati'",
  'This is not a count of all health facilities in Makati.',
]) {
  if (!indicatorSource.includes(marker)) {
    problems.push('Boundary/definition guard missing from city indicators: ' + marker);
  }
}

const migrationStatuses = migration.items.flatMap(item =>
  item.disposition.map(disposition => disposition.status)
);
for (const expected of [
  'migrated-in-W4-1f',
  'migrate-W4-1g',
  'migrate-W4-1i',
  'retain-publication-snapshot',
  'retain-canonical-owner',
]) {
  if (!migrationStatuses.includes(expected)) {
    problems.push('Statistics migration disposition is missing status: ' + expected);
  }
}

if (problems.length) {
  console.error(
    'City indicator audit failed:\n- ' + problems.join('\n- ')
  );
  process.exit(1);
}

const inlineIndicatorCount = (
  indicatorSource.match(/kind:\s*'inline-observations'/g) || []
).length;
const sourceBoundIndicatorCount = (
  indicatorSource.match(/data:\s*sourceBound\(/g) || []
).length;
const derivedIndicatorCount = (
  indicatorSource.match(/kind:\s*'derived'/g) || []
).length;

console.log(
  [
    'City indicator audit passed:',
    implementedIds.length + ' approved indicators',
    registeredSourceIds.length + ' registered sources',
    inlineIndicatorCount + ' inline/materialized indicator records',
    sourceBoundIndicatorCount + ' source-table-bound indicator records',
    derivedIndicatorCount + ' derived indicator records',
    barangayPopulationSum.toLocaleString('en-US') +
      ' canonical 2024 population',
    '0 held/rejected indicators implemented',
  ].join(' ')
);
