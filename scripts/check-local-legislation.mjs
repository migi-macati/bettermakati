import { readFile } from 'node:fs/promises';

const source = await readFile('src/data/localLegislation.ts', 'utf8');
const serviceSource = await readFile('src/data/serviceDirectory.ts', 'utf8');
const pageSource = await readFile('src/pages/Legislation.tsx', 'utf8');

const expectedOrdinances = [
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

const expectedResolutions = [
  ['2020-016', '2020-03-16'],
  ['2020-017', '2020-03-16'],
  ['2020-018', '2020-03-19'],
  ['2020-019', '2020-03-19'],
  ['2020-020', '2020-03-19'],
];

const problems = [];

for (const [batchId, count, scopeMarker] of [
  ['ordinance-batch-2020-covid-response', 15, 'All City Ordinance entries in Annex A'],
  ['resolution-batch-2020-covid-response', 5, 'All City Resolution entries in Annex A'],
]) {
  if (!source.includes("id: '" + batchId + "'")) {
    problems.push('Missing batch metadata: ' + batchId);
  }
  if (!source.includes('expectedCount: ' + count)) {
    problems.push('Missing expectedCount ' + count + ' for ' + batchId);
  }
  if (!source.includes(scopeMarker)) {
    problems.push('Missing declared scope marker for ' + batchId);
  }
}

if (!source.includes("'makati-covid-recovery-plan-2020'")) {
  problems.push('Official Makati recovery-plan source is missing.');
}
if (!source.includes("sourceClass: 'official-city-publication'")) {
  problems.push('Official source class is missing.');
}

const ordinanceCalls = [
  ...source.matchAll(
    /ordinanceFromAnnex\(\s*'([^']+)',\s*'([^']+)',\s*("[\s\S]*?")\s*\)/g
  ),
].map(match => ({
  number: match[1],
  date: match[2],
  title: JSON.parse(match[3]),
}));

const resolutionCalls = [
  ...source.matchAll(
    /resolutionFromAnnex\(\s*'([^']+)',\s*'([^']+)',\s*'([\s\S]*?)'\s*\)/g
  ),
].map(match => ({
  number: match[1],
  date: match[2],
  title: match[3],
}));

const validateBatch = (kind, records, expected) => {
  if (records.length !== expected.length) {
    problems.push(
      'Expected ' + expected.length + ' ' + kind + ' records; found ' + records.length + '.'
    );
  }

  const duplicateNumbers = records
    .map(item => item.number)
    .filter((number, index, all) => all.indexOf(number) !== index);
  if (duplicateNumbers.length) {
    problems.push(
      'Duplicate ' + kind + ' references: ' + duplicateNumbers.join(', ')
    );
  }

  for (const [number, date] of expected) {
    const record = records.find(item => item.number === number);
    if (!record) {
      problems.push('Missing ' + kind + ' ' + number + '.');
      continue;
    }
    if (record.date !== date) {
      problems.push(
        'Approval date mismatch for ' +
          number +
          ': ' +
          record.date +
          ' != ' +
          date
      );
    }
    if (!record.title.trim()) {
      problems.push('Missing title for ' + kind + ' ' + number + '.');
    }
  }
};

validateBatch('ordinance', ordinanceCalls, expectedOrdinances);
validateBatch('resolution', resolutionCalls, expectedResolutions);

if (
  !source.includes("measureType: 'ordinance'") ||
  !source.includes("measureType: 'resolution'")
) {
  problems.push('Both canonical local measure types must be represented.');
}

for (const marker of [
  "eventType: 'other-as-stated'",
  "actionAsStated: 'Date of approval listed in Annex A'",
  "evidenceStatus: 'official-publication'",
  'does not, in this table alone, identify the approving body',
  "recordStatus: 'provisional'",
  'Full ordinance text, authors, readings, vote, mayoral action, effectivity and later legal status still require measure-level evidence.',
  'Full resolution text, authors, readings, vote, mayoral action where applicable, effectivity and later legal status still require measure-level evidence.',
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
    'Annex A batches must not infer council approval, mayoral action or full verification from a generic Date of Approval column.'
  );
}

if (
  source.includes("kind: 'official-text'") &&
  (source.includes('annex-a-' + expectedOrdinances[0][0]) ||
    source.includes('annex-a-resolution-' + expectedResolutions[0][0]))
) {
  problems.push(
    'The recovery-plan Annex A must not be mislabeled as the full official text of an ordinance or resolution.'
  );
}

const verifiedEnrichmentRecords = [
  {
    number: '2020-115',
    targetId: 'civil-registration',
    topicMarkers: ["'civil registry'", "'COVID-19'"],
    evidenceMarker:
      'suspending late registration fees on several civil registry documents',
  },
  {
    number: '2020-116',
    targetId: 'local-civil-registry-copy',
    topicMarkers: ["'civil registry'", "'death records'", "'COVID-19'"],
    evidenceMarker:
      'waiving fees for certified true copies of certificates of death',
  },
];

const enrichmentKeys = [
  ...source.matchAll(/\n  '(\d{4}-\d{3})': \{\n    topics:/g),
].map(match => match[1]);

if (enrichmentKeys.length !== verifiedEnrichmentRecords.length) {
  problems.push(
    'W4-2f pilot must remain a small explicit relationship set; expected ' +
      verifiedEnrichmentRecords.length +
      ' enriched records, found ' +
      enrichmentKeys.length +
      '.'
  );
}

for (const expected of verifiedEnrichmentRecords) {
  if (!enrichmentKeys.includes(expected.number)) {
    problems.push('Missing verified W4-2f enrichment for ' + expected.number + '.');
  }
  if (!serviceSource.includes("id: '" + expected.targetId + "'")) {
    problems.push(
      'Legislation relationship target does not resolve to serviceDirectory: ' +
        expected.targetId
    );
  }
  if (!source.includes("targetId: '" + expected.targetId + "'")) {
    problems.push(
      'Missing legislation relationship target ' +
        expected.targetId +
        ' for ' +
        expected.number +
        '.'
    );
  }
  for (const topicMarker of expected.topicMarkers) {
    if (!source.includes(topicMarker)) {
      problems.push(
        'Missing evidence-bounded topic ' +
          topicMarker +
          ' for ' +
          expected.number +
          '.'
      );
    }
  }
  if (!source.includes(expected.evidenceMarker)) {
    problems.push(
      'Missing explicit relationship evidence statement for ' +
        expected.number +
        '.'
    );
  }
}

for (const marker of [
  "kind: 'affects-service'",
  "targetType: 'service'",
  "basis: 'official-title'",
  'does not infer current fees, implementation status or later legal effect',
]) {
  if (!source.includes(marker)) {
    problems.push('W4-2f relationship guard missing: ' + marker);
  }
}

for (const marker of [
  "localLegislationRecords",
  "Search local records",
  "BetterMakati index",
  "Open official source record",
  "Use the City Government of Makati archive for records not yet indexed here.",
]) {
  if (!pageSource.includes(marker)) {
    problems.push('W4-2g local-first page marker missing: ' + marker);
  }
}

if (
  pageSource.includes("site:makati.gov.ph/content/resolutions-and-ordinances") ||
  pageSource.includes("archiveSearch(")
) {
  problems.push(
    'W4-2g must not use an external web search as the primary legislation search experience.'
  );
}

const allReferences = [...ordinanceCalls, ...resolutionCalls].map(
  item => item.number
);
const duplicateAcrossTypes = allReferences.filter(
  (number, index, all) => all.indexOf(number) !== index
);
if (duplicateAcrossTypes.length) {
  problems.push(
    'Duplicate official references across local measure types: ' +
      duplicateAcrossTypes.join(', ')
  );
}

if (problems.length) {
  console.error('Local legislation audit failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}

console.log(
  'Local legislation audit passed: 15/15 Annex A ordinances, 5/5 Annex A resolutions, ' +
    'official source preserved, approval-date evidence kept non-inferential, ' +
    'and 2 evidence-bounded civic relationships resolve to serviceDirectory.'
);
