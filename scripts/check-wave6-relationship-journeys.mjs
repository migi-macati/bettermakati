import { readFile } from 'node:fs/promises';

const [
  matrixRaw,
  closureDoc,
  relationshipModelDoc,
  crosslinksDoc,
  backlinkDoc,
  uxDoc,
  compactLinks,
  elections,
  officialRelationships,
  timelineRelationships,
  calendar,
  reportArticle,
  civicAsset,
  integrity,
  barangayScope,
  publicRecordDetail,
  cityMonitorRecord,
  packageRaw,
] = await Promise.all([
  readFile('data/wave6-relationship-journey-matrix.json', 'utf8'),
  readFile('docs/w6-4f-relationship-journey-closure.md', 'utf8'),
  readFile('docs/w6-4b-civic-relationship-model.md', 'utf8'),
  readFile('docs/w6-4c-page-family-crosslinks.md', 'utf8'),
  readFile('docs/w6-4d-contextual-backlink-qa.md', 'utf8'),
  readFile('docs/w6-4e-relationship-ux-consistency.md', 'utf8'),
  readFile('src/components/civic/CivicRelationshipLinks.tsx', 'utf8'),
  readFile('src/pages/Elections.tsx', 'utf8'),
  readFile('src/data/officialCivicRelationships.ts', 'utf8'),
  readFile('src/data/timelineCivicRelationships.ts', 'utf8'),
  readFile('src/pages/Calendar.tsx', 'utf8'),
  readFile('src/pages/ReportArticle.tsx', 'utf8'),
  readFile('src/pages/CivicAsset.tsx', 'utf8'),
  readFile('src/pages/Integrity.tsx', 'utf8'),
  readFile('src/hooks/useBarangayScope.ts', 'utf8'),
  readFile('src/pages/PublicRecordDetail.tsx', 'utf8'),
  readFile('src/pages/CityMonitorRecordPage.tsx', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const matrix = JSON.parse(matrixRaw);
const pkg = JSON.parse(packageRaw);
const problems = [];

const need = (name, source, marker) => {
  if (!source.includes(marker)) {
    problems.push(name + ' marker missing: ' + marker);
  }
};

if (matrix.status !== 'complete') {
  problems.push('W6-4f journey matrix is not complete.');
}
if (matrix.closure?.wave6_4 !== 'complete') {
  problems.push('Journey matrix does not close W6-4.');
}
if (!Array.isArray(matrix.journeys) || matrix.journeys.length < 9) {
  problems.push('Journey matrix must keep the representative W6-4 relationship set.');
}
for (const journey of matrix.journeys ?? []) {
  if (journey.status !== 'pass') {
    problems.push('Journey is not passing: ' + journey.id);
  }
}
if (!Array.isArray(matrix.boundedExceptions) || matrix.boundedExceptions.length < 3) {
  problems.push('Bounded relationship exceptions must remain documented.');
}

for (const [name, source] of [
  ['W6-4b', relationshipModelDoc],
  ['W6-4c', crosslinksDoc],
  ['W6-4d', backlinkDoc],
  ['W6-4e', uxDoc],
  ['W6-4f', closureDoc],
]) {
  need(name + ' documentation', source, 'Status: complete');
}
need('W6-4f closure', closureDoc, '**W6-4 is closed.**');

need('Compact relationship links', compactLinks, 'min-h-11');

need(
  'Election profile touch target',
  elections,
  'inline-flex min-h-11 items-center font-bold text-primary-800 underline'
);
need(
  'Official exact result destination',
  officialRelationships,
  "href: '/elections#official-result-' + official.slug"
);

need(
  'Timeline exact anchor destination',
  timelineRelationships,
  "'#timeline-item-'"
);
need(
  'Calendar exact timeline anchor',
  calendar,
  "id={'timeline-item-' + item.id}"
);
if (timelineRelationships.includes('q: item.title')) {
  problems.push('Timeline reverse links must not fall back to title search.');
}
need('Report timeline relationship', reportArticle, 'timelineForCivicRecord');

need(
  'Place typed Accountability return',
  civicAsset,
  "'/accountability?type='"
);
need(
  'Place exact Accountability anchor',
  civicAsset,
  "'#' +"
);

for (const marker of [
  'inline-flex min-h-11 items-center text-xs font-bold text-primary-700',
  'inline-flex min-h-11 items-center text-sm font-bold text-primary-700',
  'inline-flex min-h-11 items-center text-sm font-bold text-secondary-900',
]) {
  need('Integrity touch relationships', integrity, marker);
}

for (const marker of [
  "params.set('barangay', slug)",
  "return pathname + (query ? '?' + query : '') + (hash ? '#' + hash : '')",
]) {
  need('Barangay scope preservation', barangayScope, marker);
}

need('Public Record reverse context', publicRecordDetail, 'record.contexts.map');
need('City Monitor related civic record', cityMonitorRecord, 'record.relatedHref');

const scriptName = 'check:wave6-relationship-journeys';
const command = 'node scripts/check-wave6-relationship-journeys.mjs';
if (pkg.scripts?.[scriptName] !== command) {
  problems.push(scriptName + ' script registration is missing.');
}

for (const pipeline of ['build', 'quality']) {
  if (!pkg.scripts?.[pipeline]?.includes('npm run ' + scriptName)) {
    problems.push(scriptName + ' must remain in the ' + pipeline + ' pipeline.');
  }
  for (const prior of [
    'check:wave6-civic-relationship-model',
    'check:wave6-page-family-crosslinks',
    'check:wave6-contextual-backlinks',
    'check:wave6-relationship-ux',
  ]) {
    if (!pkg.scripts?.[pipeline]?.includes('npm run ' + prior)) {
      problems.push(prior + ' must remain in the ' + pipeline + ' pipeline.');
    }
  }
}

if (problems.length) {
  console.error(
    'W6-4f relationship journey closure failed:\n- ' + problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'W6-4f relationship journey closure passed: representative two-way civic journeys preserve exact identity and barangay scope, touch relationships meet the 44px target, bounded external/calendar exceptions are documented, and W6-4 is closed.'
);
