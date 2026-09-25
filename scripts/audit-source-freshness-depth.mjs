import { readFile } from 'node:fs/promises';

const watchlist = JSON.parse(await readFile('data/source-watchlist.json', 'utf8'));
const state = JSON.parse(await readFile('data/source-watch-state.json', 'utf8'));
const history = JSON.parse(await readFile('data/source-watch-history.json', 'utf8'));
const checker = await readFile('scripts/check-sources.mjs', 'utf8');
const workflow = await readFile('.github/workflows/source-freshness.yml', 'utf8');
const weeklyNews = await readFile('.github/workflows/weekly-content-refresh.yml', 'utf8');
const cityMonitorConfig = JSON.parse(await readFile('data/city-monitor-sources.json', 'utf8'));
const generator = await readFile('scripts/generate-site-files.mjs', 'utf8');
const records = await readFile('src/pages/PublicRecords.tsx', 'utf8');
const status = await readFile('src/pages/ProjectStatus.tsx', 'utf8');
const pageAudit = JSON.parse(await readFile('data/page-audit.json', 'utf8'));
const tests = await readFile('tests/e2e/critical-paths.spec.mjs', 'utf8');
const pkg = JSON.parse(await readFile('package.json', 'utf8'));

const problems = [];
const validCadence = new Set(['daily', 'weekly', 'monthly']);
const validMode = new Set(['content-hash', 'reachability']);
const validOwners = new Set(['general-source-freshness', 'city-monitor']);
const delegatedToCityMonitor = new Set(['makati-news', 'makati-events', 'makati-legislation', 'philgeps']);

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
  if (!validOwners.has(source.owner)) problems.push('Invalid or missing owner for ' + source.id);
  if (ids.has(source.id)) problems.push('Duplicate watched-source id: ' + source.id);
  if (urls.has(source.url)) problems.push('Duplicate watched-source URL: ' + source.url);
  ids.add(source.id);
  urls.add(source.url);
  const stableUrl = String(source.url).toLowerCase().split(/[?#]/)[0];
  const hashableStableExtensions = ['.pdf', '.csv', '.toml', '.json', '.geojson'];
  if (
    source.owner === 'general-source-freshness' &&
    source.monitoringMode === 'content-hash' &&
    !hashableStableExtensions.some(extension => stableUrl.endsWith(extension))
  ) {
    problems.push(
      'Content hashing must remain conservative; dynamic/non-versionable source classified for hashing: ' +
        source.id
    );
  }
}

const requiredEcosystemDependencies = [
  'bettergov-openhalalan-dataset',
  'openhalalan-makati-2022-source',
  'bettergov-open-congress-api',
  'open-congress-hb-1293-source',
  'open-congress-hb-1294-source',
  'open-congress-hb-6100-source',
  'bettergov-transparency-procurement',
];
for (const id of requiredEcosystemDependencies) {
  if (!ids.has(id)) problems.push('Source watchlist missing ecosystem dependency: ' + id);
}

for (const cadence of validCadence) {
  if (!watchlist.some(source => source.cadence === cadence)) {
    problems.push('No watched sources assigned to cadence: ' + cadence);
  }
}

const cityMonitorById = new Map(cityMonitorConfig.sources.map(source => [source.id, source]));
for (const id of delegatedToCityMonitor) {
  const source = watchlist.find(item => item.id === id);
  if (!source) {
    problems.push('Delegated source missing from public source catalog: ' + id);
    continue;
  }
  if (source.owner !== 'city-monitor' || source.delegated !== true) {
    problems.push('Delegated source is not marked City Monitor-owned: ' + id);
  }
  const cityOwned = cityMonitorById.get(id);
  if (!cityOwned) {
    problems.push('Delegated source is missing from City Monitor config: ' + id);
  } else if (source.monitoringMode !== cityOwned.monitoringMode) {
    problems.push('Delegated source monitoring mode does not match City Monitor owner: ' + id);
  }
}
const unexpectedCityOwned = watchlist
  .filter(source => source.owner === 'city-monitor' && !delegatedToCityMonitor.has(source.id))
  .map(source => source.id);
if (unexpectedCityOwned.length) {
  problems.push('Unexpected City Monitor-owned source(s) in general catalog: ' + unexpectedCityOwned.join(', '));
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
  "cadenceIsDue",
  "source.owner && source.owner !== 'general-source-freshness'",
  "const publishRequired = checked.some(semanticStateChanged)",
  "source.monitoringMode === 'content-hash'",
  "result.change === 'content-changed'",
  "response.body?.cancel()",
  "data/source-watch-state.json",
  "slice(0, 400)",
]) {
  if (!checker.includes(marker)) problems.push('Source checker lost safety/cadence behavior: ' + marker);
}

if (!workflow.includes("cron: '0 0 * * *'")) {
  problems.push('Source freshness workflow must run once daily at 08:00 Philippine time.');
}
for (const retiredCron of ["cron: '30 0 * * *'", "cron: '40 0 * * 1'", "cron: '50 0 1 * *'"]) {
  if (workflow.includes(retiredCron)) {
    problems.push('Source freshness workflow still contains retired split schedule: ' + retiredCron);
  }
}
for (const marker of [
  'node scripts/check-sources.mjs --cadence=',
  'cadence="due"',
  "if: steps.publish.outputs.publish_required == 'true'",
  'npm run build',
  'data/source-watch-state.json',
  'git pull --rebase origin main',
  'Source freshness review queue',
  'issues: write',
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
const activeGeneralSources = watchlist.filter(source => source.owner === 'general-source-freshness');
const delegatedCount = watchlist.filter(source => source.owner === 'city-monitor').length;
const hashCount = activeGeneralSources.filter(source => source.monitoringMode === 'content-hash').length;
const reachabilityCount = activeGeneralSources.filter(source => source.monitoringMode === 'reachability').length;
console.log(
  'Source freshness depth audit passed: ' + watchlist.length + ' catalog sources; ' +
    activeGeneralSources.length + ' owned by general freshness and ' + delegatedCount + ' delegated to City Monitor; ' +
    counts.daily + ' daily, ' + counts.weekly + ' weekly, ' + counts.monthly + ' monthly; ' +
    hashCount + ' active stable-document hashes and ' + reachabilityCount + ' active reachability checks.'
);
