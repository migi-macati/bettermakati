import { readFile } from 'node:fs/promises';

const serviceSearch = await readFile('src/components/home/ServiceSearch.tsx', 'utf8');
const criticalPaths = await readFile('tests/e2e/critical-paths.spec.mjs', 'utf8');

const problems = [];

const requireAll = (source, label, markers) => {
  for (const marker of markers) {
    if (!source.includes(marker)) {
      problems.push(label + ' missing: ' + marker);
    }
  }
};

requireAll(serviceSearch, 'Zero-result recovery model', [
  'const allRankedResults = useMemo(() => {',
  'const hasBroaderMatches = visibleResults.length === 0 && allRankedResults.length > 0;',
  'const showAllMatches = () => {',
  'No {activeFilterLabel} matches',
  'Show all {allRankedResults.length} matching',
  'No BetterMakati match for “',
  'Browse BetterMakati',
  'Outside BetterMakati',
  'Search national services on BetterGov',
  'Find another LGU on BetterLGU',
  "tool=search&subject=",
]);

requireAll(serviceSearch, 'Internal recovery paths', [
  'to="/services"',
  'to="/barangays"',
  'to="/records"',
  'to="/reports"',
  'to="/civic-map"',
]);

if (serviceSearch.includes("tool=saan-ako-lalapit&subject=")) {
  problems.push('Search zero-result reporting still routes through Saan Ako Lalapit');
}

requireAll(criticalPaths, 'Zero-result browser QA', [
  "empty search filters recover to broader BetterMakati matches",
  "true zero-result search recovers through BetterMakati before ecosystem exits",
  "No News matches",
  "Show all \\d+ matching results?",
  "recovery.getByRole('link', { name: 'Saan Ako Lalapit?', exact: true })).toHaveCount(0)",
  "tool=search&subject=Missing",
]);

if (problems.length > 0) {
  console.error('W6-2d zero-result recovery failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}

console.log(
  'W6-2d zero-result recovery passed: filter misses recover to broader matches, true misses recover internally before ecosystem exits, and search gaps no longer funnel through Saan Ako Lalapit.'
);
