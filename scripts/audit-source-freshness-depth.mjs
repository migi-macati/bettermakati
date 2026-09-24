import { readFile } from 'node:fs/promises';

const watchlist = JSON.parse(await readFile('data/source-watchlist.json', 'utf8'));
const state = JSON.parse(await readFile('data/source-watch-state.json', 'utf8'));
const history = JSON.parse(await readFile('data/source-watch-history.json', 'utf8'));
const checker = await readFile('scripts/check-sources.mjs', 'utf8');
const workflow = await readFile('.github/workflows/source-freshness.yml', 'utf8');
const weeklyNews = await readFile('.github/workflows/weekly-content-refresh.yml', 'utf8');
const generator = await readFile('scripts/generate-site-files.mjs', 'utf8');
const records = await readFile('src/pages/PublicRecords.tsx', 'utf8');
const status = await readFile('src/pages/ProjectStatus.tsx', 'utf8');
const pageAudit = JSON.parse(await readFile('data/page-audit.json', 'utf8'));
const tests = await readFile('tests/e2e/critical-paths.spec.mjs', 'utf8');
const pkg = JSON.parse(await readFile('package.json', 'utf8'));

const problems = [];
const validCadence = new Set(['daily', 'weekly', 'monthly']);
const validMode = new Set(['content-hash', 'reachability']);

if (!Array.isArray(watchlist) || watchlist.length < 90) {
  problems.push('Source watchlist unexpectedly fell below the established site-wide baseline.');
}

const ids = new Set();
const urls = new Set();
for (const source of watchlist) {
  for (const field of ['id', 'label', 'url', 'kind', 'cadence', 'monitoringMode']) {
    if (!source[field]) problems.push('Watched source is missing ' + field + ': ' + JSON.stringify(source));
  }
  if (!validCadence.has(source.cadence)) problems.push('Invalid cadence for ' + source.id);
  if (!validMode.has(source.monitoringMode)) problems.push('Invalid monitoring mode for ' + source.id);
  if (ids.has(source.id)) problems.push('Duplicate watched-source id: ' + source.id);
  if (urls.has(source.url)) problems.push('Duplicate watched-source URL: ' + source.url);
  ids.add(source.id);
  urls.add(source.url);
  const stableUrl = String(source.url).toLowerCase().split(/[?#]/)[0];
  if (source.monitoringMode === 'content-hash' && !stableUrl.endsWith('.pdf')) {
    problems.push('Content hashing must remain conservative; non-PDF source classified for hashing: ' + source.id);
  }
}

for (const cadence of validCadence) {
  if (!watchlist.some(source => source.cadence === cadence)) {
    problems.push('No watched sources assigned to cadence: ' + cadence);
  }
}

if (state.version !== 2 || !Array.isArray(state.sources)) {
  problems.push('Current source freshness state must use version 2 with a sources array.');
} else {
  const stateIds = new Set(state.sources.map(source => source.id));
  for (const id of ids) {
    if (!stateIds.has(id)) problems.push('Current source state is missing watched source: ' + id);
  }
}

if (history.version !== 2 || !Array.isArray(history.runs)) {
  problems.push('Source freshness history must use version 2.');
}

for (const marker of [
  "const cadence = args.get('cadence') || 'all'",
  "source.monitoringMode === 'content-hash'",
  "result.change === 'content-changed'",
  "response.body?.cancel()",
  "data/source-watch-state.json",
  "slice(0, 400)",
]) {
  if (!checker.includes(marker)) problems.push('Source checker lost safety/cadence behavior: ' + marker);
}

for (const cron of ["cron: '30 0 * * *'", "cron: '40 0 * * 1'", "cron: '50 0 1 * *'"]) {
  if (!workflow.includes(cron)) problems.push('Source freshness workflow lost schedule: ' + cron);
}
for (const marker of [
  'node scripts/check-sources.mjs --cadence=',
  'npm run build',
  'data/source-watch-state.json',
  'git pull --rebase origin main',
]) {
  if (!workflow.includes(marker)) problems.push('Source freshness workflow lost required behavior: ' + marker);
}
if (weeklyNews.includes('npm run check:sources')) {
  problems.push('Weekly news refresh must not duplicate the source freshness monitor.');
}

for (const marker of [
  "'public/source-watch-state.json'",
  "'public/source-watch-history.json'",
  "'public/source-watch-index.json'",
]) {
  if (!generator.includes(marker)) problems.push('Generated site files lost source freshness publication: ' + marker);
}

for (const marker of [
  "fetch('/source-watch-state.json'",
  'Source freshness monitor',
  'stable-document content check',
  'reachability check only',
  'Current source state',
]) {
  if (!records.includes(marker)) problems.push('Public Records lost source freshness UX: ' + marker);
}

for (const marker of [
  "fetch('/source-watch-state.json'",
  'Source freshness automation',
  'Open source freshness',
]) {
  if (!status.includes(marker)) problems.push('BetterMakati Status lost source freshness state: ' + marker);
}

const recordsAudit = pageAudit.find(item => item.path === '/records');
const statusAudit = pageAudit.find(item => item.path === '/status');
for (const [label, row, checks] of [
  ['/records', recordsAudit, ['cadence-aware-source-watch', 'published-current-source-state', 'monitoring-mode-labels', 'per-record-freshness']],
  ['/status', statusAudit, ['source-freshness-state', 'page-audit']],
]) {
  if (!row) {
    problems.push('Page audit missing ' + label);
    continue;
  }
  for (const check of checks) if (!row.checks?.includes(check)) problems.push(label + ' page audit missing ' + check);
}

for (const marker of [
  "test('Public Records exposes current source freshness state'",
  "test('BetterMakati Status exposes source freshness automation'",
]) {
  if (!tests.includes(marker)) problems.push('Source freshness browser coverage missing: ' + marker);
}

if (!pkg.scripts?.['audit:source-freshness']) problems.push('package.json is missing audit:source-freshness.');
if (!String(pkg.scripts?.build || '').includes('audit:source-freshness')) problems.push('Production build does not run audit:source-freshness.');
if (!String(pkg.scripts?.quality || '').includes('audit:source-freshness')) problems.push('Quality command does not run audit:source-freshness.');

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

const counts = Object.fromEntries([...validCadence].map(cadence => [cadence, watchlist.filter(source => source.cadence === cadence).length]));
const hashCount = watchlist.filter(source => source.monitoringMode === 'content-hash').length;
const reachabilityCount = watchlist.filter(source => source.monitoringMode === 'reachability').length;
console.log(
  'Source freshness depth audit passed: ' + watchlist.length + ' sources; ' +
    counts.daily + ' daily, ' + counts.weekly + ' weekly, ' + counts.monthly + ' monthly; ' +
    hashCount + ' stable-document hashes and ' + reachabilityCount + ' reachability checks.'
);
