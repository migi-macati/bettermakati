import { readFile } from 'node:fs/promises';

const monitor = await readFile('src/data/cityMonitor.ts', 'utf8');
const page = await readFile('src/pages/CityMonitor.tsx', 'utf8');
const checker = await readFile('scripts/check-city-monitor.mjs', 'utf8');
const generator = await readFile('scripts/generate-site-files.mjs', 'utf8');
const workflow = await readFile('.github/workflows/daily-city-monitor.yml', 'utf8');
const config = JSON.parse(await readFile('data/city-monitor-sources.json', 'utf8'));
const supplement = await readFile('src/data/accountabilitySupplement.ts', 'utf8');

const problems = [];

const expectedSourceIds = [
  'makati-legislation',
  'makati-mayor-speeches',
  'mymakati-broadcasts',
  'makati-events',
  'makati-news',
  'makati-full-disclosure',
  'philgeps',
  'makati-publications',
];

if (config.sources.length !== expectedSourceIds.length) {
  problems.push(
    'Expected ' +
      expectedSourceIds.length +
      ' City Monitor source channels; found ' +
      config.sources.length +
      '.'
  );
}

for (const id of expectedSourceIds) {
  if (!config.sources.some(source => source.id === id)) {
    problems.push('City Monitor machine config is missing source: ' + id);
  }
  if (!monitor.includes("id: '" + id + "'")) {
    problems.push('City Monitor public source directory is missing source: ' + id);
  }
}

for (const mode of ['content-hash', 'reachability', 'manual-review']) {
  if (!config.sources.some(source => source.monitoringMode === mode)) {
    problems.push('City Monitor source config is missing monitoring mode: ' + mode);
  }
}

const procurementSeedBlock =
  supplement.split('const procurementSeeds: ProcurementSeed[] = [')[1]?.split(
    'export const procurementProjectEntries'
  )[0] ?? '';
const procurementRefs = [
  ...procurementSeedBlock.matchAll(/referenceNo:\s*'([^']+)'/g),
].map(match => match[1]);

if (procurementRefs.length < 21) {
  problems.push(
    'City Monitor procurement record baseline fell below 21: ' +
      procurementRefs.length +
      '.'
  );
}

for (const type of [
  'council-session',
  'legislation',
  'executive-speech',
  'procurement',
  'project',
  'publication',
  'consultation',
  'official-notice',
]) {
  if (!monitor.includes("type: '" + type + "'")) {
    problems.push('City Monitor coverage model is missing stream: ' + type);
  }
}

for (const marker of [
  'What City Monitor can and cannot see yet',
  'Detected changes awaiting interpretation',
  'validated permanent records',
  'content-change detection',
  'reachability only',
  'manual review',
  'Showing <strong className="text-gray-900">{visibleRecords.length}</strong>',
]) {
  if (!page.includes(marker)) {
    problems.push('City Monitor page is missing required feature: ' + marker);
  }
}

for (const marker of [
  "mode === 'manual-review'",
  "mode === 'reachability'",
  "change: 'manual-review'",
  "'data/city-monitor-source-state.json'",
  "'data/city-monitor-source-history.json'",
  'A changed source hash is only a detection signal.',
]) {
  if (!checker.includes(marker)) {
    problems.push('City Monitor checker is missing required behavior: ' + marker);
  }
}

if (!generator.includes("...cityMonitorRecordIds.map(id => '/city-monitor/' + id)")) {
  problems.push('Permanent City Monitor record routes are no longer included in the sitemap.');
}

if (!generator.includes("'public/city-monitor-source-state.json'")) {
  problems.push('Generated site files no longer publish City Monitor source health.');
}
if (!generator.includes("'public/city-monitor-source-history.json'")) {
  problems.push('Generated site files no longer publish City Monitor source history.');
}
if (!generator.includes("'public/city-monitor.rss.xml'")) {
  problems.push('Generated site files no longer publish City Monitor RSS.');
}

if (!workflow.includes("cron: '30 0 * * *'")) {
  problems.push('Daily City Monitor schedule is no longer 08:30 Philippine time.');
}
if (!workflow.includes('npm run check:city-monitor')) {
  problems.push('Daily City Monitor workflow no longer runs the source checker.');
}

if (!monitor.includes("export const cityMonitorReviewed = '24 September 2026';")) {
  problems.push('City Monitor review date is not current for Wave 2.1.');
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log(
  'City Monitor depth audit passed: ' +
    expectedSourceIds.length +
    ' source channels; ' +
    procurementRefs.length +
    ' structured procurement records plus permanent civic records; 8 coverage streams; daily source health/history publishing protected.'
);
