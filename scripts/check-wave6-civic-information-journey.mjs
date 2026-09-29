import { readFile } from 'node:fs/promises';

const [today, cityMonitor, briefs, news, calendar, live, navigation, packageJson] =
  await Promise.all([
    readFile('src/pages/Today.tsx', 'utf8'),
    readFile('src/pages/CityMonitor.tsx', 'utf8'),
    readFile('src/pages/CivicBriefs.tsx', 'utf8'),
    readFile('src/pages/News.tsx', 'utf8'),
    readFile('src/pages/Calendar.tsx', 'utf8'),
    readFile('src/pages/LiveMakati.tsx', 'utf8'),
    readFile('src/data/navigation.ts', 'utf8'),
    readFile('package.json', 'utf8'),
  ]);

const problems = [];

for (const marker of [
  "'What’s next in Makati'",
  'Live conditions & current sources',
  'to="/city-monitor"',
  'to="/news"',
  'to="/hotlines"',
  'Open Civic Briefs',
  'Browse all Makati news',
]) {
  if (!today.includes(marker)) problems.push('Today synthesis marker missing: ' + marker);
}

const timelineIndex = today.indexOf('<CivicTimelinePreview');
const currentSourcesIndex = today.indexOf('Live conditions & current sources');
if (timelineIndex < 0 || currentSourcesIndex < 0 || timelineIndex > currentSourcesIndex) {
  problems.push('Today no longer places source-backed civic dates before specialist current-information surfaces.');
}

for (const forbidden of [
  'monitored sources reachable',
  'failed checks in the latest monitor run',
  'source-change signals in the latest monitor run',
  'reviewSignals',
  'failedChecks',
]) {
  if (today.includes(forbidden)) {
    problems.push('Today exposes platform-health diagnostics: ' + forbidden);
  }
}

for (const [label, source] of [
  ['City Monitor', cityMonitor],
  ['Civic Briefs', briefs],
  ['News', news],
  ['Calendar', calendar],
  ['Live Makati', live],
]) {
  if (!source.includes('to="/today"')) {
    problems.push(label + ' does not return to the canonical Today synthesis door.');
  }
}

const todayNavigationIndex = navigation.indexOf("label: 'Today'");
const todayNavigationBlock =
  todayNavigationIndex >= 0
    ? navigation.slice(todayNavigationIndex, todayNavigationIndex + 500)
    : '';
if (!todayNavigationBlock.includes("href: '/today'")) {
  problems.push('Global navigation no longer owns Today as the canonical current-information door.');
}

if (!packageJson.includes('"check:wave6-civic-information-journey"')) {
  problems.push('W6-3e guard is not registered in package.json.');
}

if (problems.length) {
  console.error('W6-3e civic-information journey check failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}

console.log(
  'W6-3e civic-information journey check passed: Today leads with canonical civic dates, specialist surfaces stay distinct, and supporting pages return to Today.'
);
