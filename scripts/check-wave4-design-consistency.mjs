import { readFile } from 'node:fs/promises';

const statistics = await readFile('src/pages/Statistics.tsx', 'utf8');
const legislation = await readFile('src/pages/Legislation.tsx', 'utf8');
const integrity = await readFile('src/pages/Integrity.tsx', 'utf8');
const reports = await readFile('src/pages/Reports.tsx', 'utf8');
const reportArticle = await readFile('src/pages/ReportArticle.tsx', 'utf8');
const publicRecordDetail = await readFile(
  'src/pages/PublicRecordDetail.tsx',
  'utf8'
);

const problems = [];

const darkHeaderChecks = [
  [
    'Statistics',
    statistics,
    'border-b border-primary-900 bg-primary-800 text-white',
  ],
  [
    'Legislation',
    legislation,
    'border-b border-primary-800 bg-primary-900 text-white',
  ],
  ['Integrity', integrity, 'bg-primary-900 text-white'],
  [
    'Reports',
    reports,
    'border-b border-primary-800 bg-primary-900 text-white',
  ],
  [
    'Public Record detail',
    publicRecordDetail,
    'border-b border-primary-800 bg-primary-900 text-white',
  ],
];

for (const [name, source, marker] of darkHeaderChecks) {
  if (!source.includes(marker)) {
    problems.push(name + ' lost the shared dark-green publication header treatment.');
  }
}

for (const [name, source, marker] of [
  ['Statistics', statistics, 'See how Makati is changing.'],
  ['Legislation', legislation, '>Legislation<'],
  ['Integrity', integrity, '>Integrity records<'],
  ['Reports', reports, 'Featured Reports & Insights'],
  ['Public Record detail', publicRecordDetail, 'Open original source'],
]) {
  if (!source.includes(marker)) {
    problems.push(name + ' lost its content-first primary heading/action marker: ' + marker);
  }
}

const forbiddenPublicMeta = [
  'Follow the record',
  'What the checked public record returned',
  'BetterMakati index',
  'BetterMakati ID',
  'Makati archive ID',
  'Record and source status checked on the date shown.',
  'Dates on each indicator show the observation or source snapshot.',
  'Public Records ID:',
  'canonical barangay profile',
  'Across BetterMakati',
  'Records synthesized in this report',
  'Underlying records',
  'Primary trail',
  'currently indexed by BetterMakati',
  'Search Makati ordinances and resolutions indexed by BetterMakati.',
];

for (const [name, source] of [
  ['Statistics', statistics],
  ['Legislation', legislation],
  ['Integrity', integrity],
  ['Reports', reports],
  ['Report article', reportArticle],
  ['Public Record detail', publicRecordDetail],
]) {
  for (const forbidden of forbiddenPublicMeta) {
    if (source.includes(forbidden)) {
      problems.push(name + ' still contains public-facing meta/sermon copy: ' + forbidden);
    }
  }
}

for (const marker of [
  'current 23-barangay boundary',
  'different Makati geography',
  'describe Makati residents, not the number of jobs physically located',
]) {
  if (!statistics.includes(marker)) {
    problems.push(
      'Statistics lost an interpretation-critical geography/labor caveat: ' + marker
    );
  }
}

for (const marker of [
  '“Not retrieved” means no entity-specific record surfaced',
  'Why unresolved',
]) {
  if (!integrity.includes(marker)) {
    problems.push(
      'Integrity lost an interpretation-critical evidence-status caveat: ' + marker
    );
  }
}

if (
  !publicRecordDetail.includes(
    'If the publisher blocks embedded viewing, open the original source above.'
  )
) {
  problems.push(
    'Public Record detail lost the PDF viewer fallback instruction.'
  );
}

for (const marker of [
  '<div className="section-eyebrow">Indexed records</div>',
  'Related records',
]) {
  if (!legislation.includes(marker)) {
    problems.push('Legislation cleanup marker missing: ' + marker);
  }
}

for (const marker of [
  '<div className="section-eyebrow !text-secondary-300">\n          Civic analysis',
  'Featured Reports & Insights',
]) {
  if (!reports.includes(marker)) {
    problems.push('Reports design-consistency marker missing: ' + marker);
  }
}

for (const marker of [
  '<div className="section-eyebrow">Records</div>',
  '<Heading level={2}>Related records</Heading>',
]) {
  if (!reportArticle.includes(marker)) {
    problems.push('Report article cleanup marker missing: ' + marker);
  }
}

for (const marker of [
  '<div className="section-eyebrow">Related records</div>',
  '<Heading level={2}>Where this source appears</Heading>',
]) {
  if (!publicRecordDetail.includes(marker)) {
    problems.push('Public Record detail cleanup marker missing: ' + marker);
  }
}

if (problems.length) {
  console.error(
    'Wave 4 anti-sermon/design consistency check failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'Wave 4 anti-sermon/design consistency check passed: core Civic Intelligence surfaces share the dark-green publication language, internal/meta labels are removed, and only interpretation-critical evidence caveats remain.'
);
