import { readFile } from 'node:fs/promises';

const reports = await readFile('src/data/reports.ts', 'utf8');
const flagship = JSON.parse(
  await readFile('data/wave4-statistics-flagship.json', 'utf8')
);

const problems = [];

if (
  !Array.isArray(flagship.publishedReportSlugs) ||
  flagship.publishedReportSlugs.length !== 1
) {
  problems.push('W4-4d must publish exactly one Statistics-derived report.');
}

const slug = flagship.publishedReportSlugs?.[0];
if (slug !== '2024-population-growth-acceleration') {
  problems.push('Unexpected Statistics flagship slug: ' + slug);
}

if ((reports.match(/slug:\s*'2024-population-growth-acceleration'/g) ?? []).length !== 1) {
  problems.push('Statistics flagship report must appear exactly once.');
}

for (const marker of [
  "cityIndicatorObservations('population-total')",
  "cityIndicatorObservations('population-growth-rate')",
  "cityIndicatorSources['psa-openstat-population-growth-2024']",
  "recordType: 'statistics-indicator'",
  "id: 'population-total'",
  "id: 'population-growth-rate'",
  'populationAdded2020to2024',
  'growthAccelerationPp',
  'The latest interval is therefore the fastest of the three comparable intervals in the current series.',
  'The series establishes a change in resident-population growth, not its cause.',
  'it should not be read as a measure of Makati’s daytime population.',
  'The report uses the PSA-published average annual growth rates rather than recomputing a simple calendar-year CAGR.',
]) {
  if (!reports.includes(marker)) {
    problems.push('Statistics flagship marker missing: ' + marker);
  }
}

for (const indicatorId of ['population-total', 'population-growth-rate']) {
  if (!flagship.canonicalIndicators?.includes(indicatorId)) {
    problems.push('Flagship metadata missing canonical indicator: ' + indicatorId);
  }
}

const claims = flagship.claims ?? {};
const expectedClaims = {
  growth2010to2015Percent: 1.16,
  growth2015to2020Percent: 0.93,
  growth2020to2024Percent: 1.37,
  accelerationVsPriorIntervalPercentagePoints: 0.44,
  population2020: 292743,
  population2024: 309770,
  populationAdded2020to2024: 17027,
};

for (const [key, value] of Object.entries(expectedClaims)) {
  if (claims[key] !== value) {
    problems.push(
      'Flagship claim mismatch for ' +
        key +
        ': expected ' +
        value +
        ', found ' +
        claims[key]
    );
  }
}

if (
  flagship.primarySourceId !== 'psa-openstat-population-growth-2024'
) {
  problems.push('Statistics flagship must remain tied to the PSA population series.');
}

for (const forbidden of [
  'growth accelerated because',
  'caused the acceleration',
  'proves that migration',
  'daytime population increased by',
]) {
  if (reports.toLowerCase().includes(forbidden)) {
    problems.push('Flagship report contains unsupported causal inference: ' + forbidden);
  }
}

if (problems.length) {
  console.error(
    'Statistics flagship report check failed:\n- ' + problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'Statistics flagship report check passed: exactly one W4-4d report uses the comparable population-total and population-growth-rate indicators, with all factual claims tied to the PSA series and no causal inference.'
);
