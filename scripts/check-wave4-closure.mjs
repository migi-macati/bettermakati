import { readFile } from 'node:fs/promises';

const closure = JSON.parse(
  await readFile('data/wave4-closure.json', 'utf8')
);
const backlog = JSON.parse(
  await readFile('data/wave4-execution-backlog.json', 'utf8')
);
const humanAudit = JSON.parse(
  await readFile(
    'data/wave4-civic-intelligence-human-relationship-audit.json',
    'utf8'
  )
);

const problems = [];
const allowedClasses = ['complete', 'bounded', 'partial', 'deferred'];

if (
  closure.closureStatus !==
  'closed-with-bounded-and-deferred-capabilities'
) {
  problems.push('Wave 4 closure status must preserve bounded/deferred capability classes.');
}

for (const key of allowedClasses) {
  if (!Array.isArray(closure[key]) || closure[key].length === 0) {
    problems.push('Wave 4 closure classification is missing non-empty ' + key + ' entries.');
  }
}

const classifiedIds = new Set();
for (const key of allowedClasses) {
  for (const item of closure[key]) {
    if (!item?.id || !item?.capability) {
      problems.push(key + ' closure item is missing id/capability.');
      continue;
    }
    if (classifiedIds.has(item.id)) {
      problems.push('Duplicate closure capability id: ' + item.id);
    }
    classifiedIds.add(item.id);
  }
}

for (const required of [
  'statistics-core',
  'legislation-archive',
  'integrity-model-and-graph',
  'featured-reports',
  'shared-civic-intelligence',
  'search',
  'public-records',
  'wave4-ux-static-audit',
]) {
  if (!closure.complete.some(item => item.id === required)) {
    problems.push('Required complete capability missing: ' + required);
  }
}

for (const required of [
  'statistics-coverage',
  'legislation-history',
  'legislation-crosslinks',
  'integrity-place-links',
  'public-records-crosslinks',
]) {
  if (!closure.bounded.some(item => item.id === required)) {
    problems.push('Required bounded capability missing: ' + required);
  }
}

for (const required of [
  'integrity-beneficial-ownership-disclosures',
  'integrity-audit-closure',
]) {
  if (!closure.partial.some(item => item.id === required)) {
    problems.push('Required partial evidence capability missing: ' + required);
  }
}

for (const required of [
  'live-browser-verification',
  'wave4-ci-execution',
]) {
  if (!closure.deferred.some(item => item.id === required)) {
    problems.push('Required deferred verification capability missing: ' + required);
  }
}

if (
  humanAudit.overallStatus !==
  'static-verified-live-browser-unverified'
) {
  problems.push('W4-5i browser limitation was changed or overstated.');
}
if (humanAudit.verification?.liveBrowserAudit?.status !== 'unverified') {
  problems.push('Live browser verification must remain unverified at closure.');
}

const browserClosure = closure.deferred.find(
  item => item.id === 'live-browser-verification'
);
if (!browserClosure) {
  problems.push('Live-browser deferred entry is missing.');
} else {
  const deferredChecks = browserClosure.includes ?? [];
  for (const phrase of [
    'runtime console verification',
    'visual focus-order verification',
    'production PDF embedding behavior',
  ]) {
    if (!deferredChecks.includes(phrase)) {
      problems.push('Live-browser deferred scope missing: ' + phrase);
    }
  }
}

const ciClosure = closure.deferred.find(
  item => item.id === 'wave4-ci-execution'
);
if (
  !ciClosure?.reason?.includes('BetterBarangay Place Registry') ||
  ciClosure?.wave4Attribution !==
    'This blocker predates W4-5i and is not evidence that a Wave 4 guard failed.'
) {
  problems.push('Wave 4 CI blocker must remain explicitly attributed outside Wave 4.');
}

const bo = closure.partial.find(
  item => item.id === 'integrity-beneficial-ownership-disclosures'
);
if (
  !bo?.nonInference?.includes('Unavailable does not mean absent') ||
  !bo?.status?.includes('not-retrieved')
) {
  problems.push('Integrity disclosure retrieval must remain partial and non-inferential.');
}

const auditClosure = closure.partial.find(
  item => item.id === 'integrity-audit-closure'
);
if (
  !auditClosure?.status?.includes('unresolved') ||
  !auditClosure?.nonInference?.includes('unresolved status does not establish continuing wrongdoing')
) {
  problems.push('Audit continuity must remain partial/unresolved without wrongdoing inference.');
}

const futureIds = new Set(
  (closure.futureCapabilities ?? []).map(item => item.id)
);
for (const id of [
  'future-live-browser-audit',
  'future-integrity-registry-retrieval',
  'future-audit-continuity',
  'future-legislation-relationships',
  'future-statistics-expansion',
  'future-repo-ci-unblock',
]) {
  if (!futureIds.has(id)) {
    problems.push('Specific future capability missing: ' + id);
  }
}

const batches = backlog.batches ?? [];
if (batches.length !== 46) {
  problems.push('Expected 46 Wave 4 micro-steps; found ' + batches.length + '.');
}
const incomplete = batches.filter(batch => batch.status !== 'complete');
if (incomplete.length) {
  problems.push(
    'Wave 4 backlog still has incomplete micro-steps: ' +
      incomplete.map(item => item.id + ':' + item.status).join(', ')
  );
}
if (backlog.current !== null) {
  problems.push('Closed Wave 4 backlog current must be null.');
}
if (backlog.immediateNext !== null) {
  problems.push('Closed Wave 4 backlog immediateNext must be null.');
}
if (backlog.waveStatus !== 'closed') {
  problems.push('Wave 4 backlog waveStatus must be closed.');
}
if (backlog.closedAt !== '2026-09-27') {
  problems.push('Wave 4 backlog closedAt must be 2026-09-27.');
}
if (backlog.closureFile !== 'data/wave4-closure.json') {
  problems.push('Wave 4 backlog must point to the closure ledger.');
}

if (
  closure.executionSummary?.plannedMicrosteps !== 46 ||
  closure.executionSummary?.completedAfterClosure !== 46
) {
  problems.push('Wave 4 closure execution counts must be 46/46 after W4-5j.');
}

if (
  !closure.finalStatement?.startsWith('Wave 4 is closed.')
) {
  problems.push('Wave 4 closure final statement is missing.');
}

if (problems.length) {
  console.error(
    'Wave 4 closure check failed:\n- ' + problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'Wave 4 closure check passed: all 46 micro-steps are closed; implemented capabilities are separated from bounded coverage, partial evidence and deferred browser/CI verification; future work is reopened only as named capabilities.'
);
