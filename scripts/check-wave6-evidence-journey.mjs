import { readFile } from 'node:fs/promises';

const [
  home,
  records,
  recordDetail,
  pageHelp,
  legislation,
  accountability,
  statistics,
  navigation,
  packageJson,
] = await Promise.all([
  readFile('src/pages/Home.tsx', 'utf8'),
  readFile('src/pages/PublicRecords.tsx', 'utf8'),
  readFile('src/pages/PublicRecordDetail.tsx', 'utf8'),
  readFile('src/components/ui/PageHelp.tsx', 'utf8'),
  readFile('src/pages/Legislation.tsx', 'utf8'),
  readFile('src/pages/Accountability.tsx', 'utf8'),
  readFile('src/pages/Statistics.tsx', 'utf8'),
  readFile('src/data/navigation.ts', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const problems = [];

for (const marker of [
  "label: 'Public records'",
  "href: '/records'",
  'Open the underlying documents, datasets and source records behind civic claims.',
]) {
  if (!home.includes(marker)) {
    problems.push('Homepage evidence entry marker missing: ' + marker);
  }
}

for (const marker of [
  'Find the source.',
  'BetterMakati evidence index',
  'Original evidence',
  'Record pages describe and connect sources.',
  'Open source',
  "to={'/records/' + record.id}",
]) {
  if (!records.includes(marker)) {
    problems.push('Public Records evidence-index marker missing: ' + marker);
  }
}

for (const marker of [
  'BetterMakati catalog entry',
  'it is not the original record itself',
  'Open original source',
  'Where BetterMakati uses this source',
  'Open BetterMakati context',
  'Browse the evidence index',
]) {
  if (!recordDetail.includes(marker)) {
    problems.push('Public Record detail distinction marker missing: ' + marker);
  }
}

for (const marker of [
  "t('pageHelp.records')",
  'to="/records"',
  "t('pageHelp.correction')",
]) {
  if (!pageHelp.includes(marker)) {
    problems.push('Page Help evidence/correction handoff missing: ' + marker);
  }
}

for (const marker of [
  'Official document',
  "to={'/records/' + publicRecord.id}",
  'Official Makati archive',
]) {
  if (!legislation.includes(marker)) {
    problems.push('Legislation evidence handoff missing: ' + marker);
  }
}

for (const marker of [
  'Source evidence',
  'href={source.url}',
]) {
  if (!accountability.includes(marker)) {
    problems.push('Accountability evidence handoff missing: ' + marker);
  }
}

for (const marker of [
  'PSA barangay source',
  'Open source table',
  'href={source.url}',
]) {
  if (!statistics.includes(marker)) {
    problems.push('Statistics source handoff missing: ' + marker);
  }
}

const accountabilityNavigationIndex = navigation.indexOf("id: 'accountability'");
const accountabilityNavigationBlock =
  accountabilityNavigationIndex >= 0
    ? navigation.slice(accountabilityNavigationIndex, accountabilityNavigationIndex + 1200)
    : '';
if (
  !accountabilityNavigationBlock.includes("labelKey: 'navigation.accountability'") ||
  !accountabilityNavigationBlock.includes("id: 'records'") ||
  !accountabilityNavigationBlock.includes("labelKey: 'navigation.records'") ||
  !accountabilityNavigationBlock.includes("href: '/records'")
) {
  problems.push('Global navigation no longer exposes Public Records from the Accountability family.');
}

if (!packageJson.includes('"check:wave6-evidence-journey"')) {
  problems.push('W6-3h evidence journey guard is not registered in package.json.');
}

if (problems.length) {
  console.error('W6-3h evidence journey check failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}

console.log(
  'W6-3h evidence journey check passed: Public Records is a recognizable evidence index, source detail pages distinguish BetterMakati metadata from publisher evidence, and factual pages retain source/context handoffs.'
);
