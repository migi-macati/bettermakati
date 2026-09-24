import { readFile } from 'node:fs/promises';

const today = await readFile('src/pages/Today.tsx', 'utf8');
const live = await readFile('src/pages/LiveMakati.tsx', 'utf8');
const sourceModel = await readFile('src/data/liveMakati.ts', 'utf8');
const pageAudit = JSON.parse(await readFile('data/page-audit.json', 'utf8'));
const tests = await readFile('tests/e2e/critical-paths.spec.mjs', 'utf8');
const pkg = JSON.parse(await readFile('package.json', 'utf8'));

const problems = [];

for (const marker of [
  "fetch('/civic-briefs.json'",
  "fetch('/city-monitor-source-history.json'",
  "fetch('/city-monitor-source-state.json'",
  "fetch('/api/news')",
  'Latest published brief',
  'Current conditions',
  'Choose my barangay',
]) {
  if (!today.includes(marker)) {
    problems.push('Today in Makati lost required Wave 2.3 feature: ' + marker);
  }
}

for (const marker of [
  "fetch('/city-monitor-source-state.json'",
  'Source checks',
  'Source directory',
  'Open-Meteo',
  'PAGASA NCR',
  'sourceStatusLabel',
  'liveSourceAuthorityLabel',
]) {
  if (!live.includes(marker)) {
    problems.push('Live Makati lost required Wave 2.3 feature: ' + marker);
  }
}

for (const marker of [
  "export const liveMakatiReviewed = '24 September 2026';",
  "'official-government'",
  "'utility-provider'",
  "'district-source'",
  "checkMode: 'city-monitor'",
  "checkMode: 'direct-link'",
  "monitorSourceId: 'makati-news'",
  "monitorSourceId: 'makati-events'",
]) {
  if (!sourceModel.includes(marker)) {
    problems.push('Live Makati source model lost trust/freshness field: ' + marker);
  }
}

const todayAudit = pageAudit.find(item => item.path === '/today');
const liveAudit = pageAudit.find(item => item.path === '/live');

if (!todayAudit) {
  problems.push('Page audit has no /today record.');
} else {
  for (const check of [
    'barangay-preference',
    'weather-freshness',
    'latest-civic-brief',
    'city-monitor-health',
    'news-separation',
    'events-and-hotlines',
  ]) {
    if (!todayAudit.checks?.includes(check)) {
      problems.push('/today page audit is missing check: ' + check);
    }
  }
}

if (!liveAudit) {
  problems.push('Page audit has no /live record.');
} else {
  for (const check of [
    'weather-observation-time',
    'official-warning-handoff',
    'source-health',
    'authority-labels',
    'monitor-vs-direct-link',
    'emergency-routing',
  ]) {
    if (!liveAudit.checks?.includes(check)) {
      problems.push('/live page audit is missing check: ' + check);
    }
  }
}

for (const marker of [
  "['/live', /What’s happening now/i]",
  "test('Today in Makati combines current and validated layers'",
  "test('Live Makati labels source authority and check status'",
]) {
  if (!tests.includes(marker)) {
    problems.push('Wave 2.3 browser coverage is missing: ' + marker);
  }
}

if (!pkg.scripts?.['audit:today-live']) {
  problems.push('package.json is missing audit:today-live.');
}

if (!String(pkg.scripts?.build || '').includes('audit:today-live')) {
  problems.push('Production build does not run audit:today-live.');
}

if (!String(pkg.scripts?.quality || '').includes('audit:today-live')) {
  problems.push('Quality command does not run audit:today-live.');
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log(
  'Today / Live Makati depth audit passed: daily synthesis, source authority, freshness, monitor linkage, official-warning handoff and browser coverage protected.'
);
