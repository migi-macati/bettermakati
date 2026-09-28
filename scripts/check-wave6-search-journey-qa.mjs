import { readFile } from 'node:fs/promises';

const [qaDoc, criticalPaths, packageJson] = await Promise.all([
  readFile('docs/w6-2f-search-journey-qa.md', 'utf8'),
  readFile('tests/e2e/critical-paths.spec.mjs', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const problems = [];

for (let index = 1; index <= 10; index += 1) {
  const id = 'SJ' + index;
  if (!qaDoc.includes('| ' + id + ' |')) {
    problems.push('Search QA matrix missing ' + id);
  }
  if (!criticalPaths.includes("id: '" + id + "'")) {
    problems.push('Browser search journey matrix missing ' + id);
  }
}

const requiredJourneys = [
  ["query: 'cedula'", "expectedHref: '/services/guide/community-tax-certificate'"],
  ["query: 'brgy poblacion'", "expectedHref: '/barangays/poblacion'"],
  ["query: 'city hall'", "expectedHref: '/government#offices'"],
  ["query: 'council sessions'", "expectedHref: '/calendar'"],
  ["query: 'bids'", "expectedHref: '/accountability?type=project'"],
  ["query: 'public records'", "expectedHref: '/records'"],
  ["query: 'commute'", "expectedHref: '/mobility'"],
  ["query: 'historical sites'", "expectedHref: '/heritage'"],
  ["query: 'city stats'", "expectedHref: '/statistics'"],
  ["query: 'laws'", "expectedHref: '/legislation'"],
];

for (const [query, href] of requiredJourneys) {
  if (!criticalPaths.includes(query) || !criticalPaths.includes(href)) {
    problems.push('Search journey contract missing: ' + query + ' → ' + href);
  }
}

for (const marker of [
  "test('W6-2f search journeys reach useful canonical destinations across civic domains'",
  "test('positive search deep link restores the query and supports keyboard completion'",
  "page.goto(baseURL + '/search?q=commute')",
  "await expect(search).toHaveValue('commute')",
  "await search.press('Enter')",
]) {
  if (!criticalPaths.includes(marker)) {
    problems.push('W6-2f browser QA marker missing: ' + marker);
  }
}

for (const marker of [
  'sitewide civic search engine',
  'W6-2e separately owns search entry-point convergence',
  'Full P0/P1 journey closure',
  'W6-9',
]) {
  if (!qaDoc.includes(marker)) {
    problems.push('W6-2f scope/closure marker missing: ' + marker);
  }
}

const occurrences = (
  packageJson.match(/npm run check:wave6-search-journey-qa/g) ?? []
).length;
if (occurrences < 2) {
  problems.push('W6-2f guard must be present in both build and quality.');
}

if (
  !packageJson.includes(
    '"check:wave6-search-journey-qa": "node scripts/check-wave6-search-journey-qa.mjs"'
  )
) {
  problems.push('package.json is missing check:wave6-search-journey-qa.');
}

if (problems.length) {
  console.error('W6-2f search journey QA guard failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}

console.log(
  'W6-2f search journey QA passed: 10 representative civic intents, positive query deep-link restoration and keyboard completion remain covered; full J1-J12 closure stays reserved for W6-9.'
);
