import { readFile } from 'node:fs/promises';

const source = await readFile('src/data/localLegislation.ts', 'utf8');

const expected = [
  ['2020-074', '2020-03-19'],
  ['2020-075', '2020-03-19'],
  ['2020-080', '2020-03-26'],
  ['2020-086', '2020-04-08'],
  ['2020-087', '2020-04-08'],
  ['2020-088', '2020-04-08'],
  ['2020-089', '2020-04-08'],
  ['2020-090', '2020-04-15'],
  ['2020-092', '2020-04-15'],
  ['2020-095', '2020-04-18'],
  ['2020-100', '2020-04-21'],
  ['2020-115', '2020-04-29'],
  ['2020-116', '2020-04-29'],
  ['2020-117', '2020-04-29'],
  ['2020-128', '2020-05-06'],
];

const problems = [];

if (!source.includes("id: 'ordinance-batch-2020-covid-response'")) {
  problems.push('First ordinance batch metadata is missing.');
}
if (!source.includes('expectedCount: 15')) {
  problems.push('First ordinance batch expectedCount must be 15.');
}
if (!source.includes('All City Ordinance entries in Annex A')) {
  problems.push('Declared Annex A ordinance scope is missing.');
}
if (!source.includes("'makati-covid-recovery-plan-2020'")) {
  problems.push('Official Makati recovery-plan source is missing.');
}
if (!source.includes("sourceClass: 'official-city-publication'")) {
  problems.push('First batch must identify the official source class.');
}

const calls = [
  ...source.matchAll(
    /ordinanceFromAnnex\(\s*'([^']+)',\s*'([^']+)',\s*("[\s\S]*?")\s*\)/g
  ),
].map(match => ({
  number: match[1],
  date: match[2],
  title: JSON.parse(match[3]),
}));

if (calls.length !== expected.length) {
  problems.push(
    'Expected ' + expected.length + ' ordinance records; found ' + calls.length + '.'
  );
}

const duplicateNumbers = calls
  .map(item => item.number)
  .filter((number, index, all) => all.indexOf(number) !== index);
if (duplicateNumbers.length) {
  problems.push('Duplicate ordinance references: ' + duplicateNumbers.join(', '));
}

for (const [number, date] of expected) {
  const record = calls.find(item => item.number === number);
  if (!record) {
    problems.push('Missing ordinance ' + number + '.');
    continue;
  }
  if (record.date !== date) {
    problems.push(
      'Approval date mismatch for ' + number + ': ' + record.date + ' != ' + date
    );
  }
  if (!record.title.trim()) {
    problems.push('Missing title for ordinance ' + number + '.');
  }
}

if (
  !source.includes("measureType: 'ordinance'") ||
  !source.includes('export const localResolutionRecords: LocalLegislationRecord[] = [];')
) {
  problems.push('W4-2c must contain ordinances only; resolutions belong to W4-2d.');
}

for (const marker of [
  "eventType: 'other-as-stated'",
  "actionAsStated: 'Date of approval listed in Annex A'",
  "evidenceStatus: 'official-publication'",
  'does not, in this table alone, identify the approving body',
  "recordStatus: 'provisional'",
  'Full ordinance text, authors, readings, vote, mayoral action, effectivity and later legal status still require measure-level evidence.',
]) {
  if (!source.includes(marker)) {
    problems.push('Evidence guard missing: ' + marker);
  }
}

if (
  source.includes("eventType: 'approved-by-council'") ||
  source.includes("eventType: 'mayor-signed-approved'") ||
  source.includes("recordStatus: 'verified'")
) {
  problems.push(
    'Annex A batch must not infer council approval, mayoral action or full verification from a generic Date of Approval column.'
  );
}

if (
  source.includes("kind: 'official-text'") &&
  source.includes('annex-a-' + expected[0][0])
) {
  problems.push(
    'The recovery-plan Annex A must not be mislabeled as the full official text of each ordinance.'
  );
}

if (problems.length) {
  console.error('Local legislation audit failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}

console.log(
  'Local legislation audit passed: 15/15 Annex A ordinances, 0 resolutions, ' +
    'official source preserved, approval-date evidence kept non-inferential.'
);
