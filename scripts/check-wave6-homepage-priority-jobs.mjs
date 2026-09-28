import { readFile } from 'node:fs/promises';

const [priorityDoc, journeyMatrix, scopeRegister, packageJson] = await Promise.all([
  readFile('docs/w6-3a-homepage-priority-jobs.md', 'utf8'),
  readFile('docs/w6-0c-core-journey-matrix.md', 'utf8'),
  readFile('docs/w6-0d-scope-defer-register.md', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const problems = [];

for (let index = 1; index <= 8; index += 1) {
  if (!priorityDoc.includes('HP' + index + ' —')) {
    problems.push('Homepage priority model missing HP' + index);
  }
}

for (const marker of [
  '### Tier A — immediate task access',
  '### Tier B — core civic context and action',
  '### Tier C — city use and depth',
  'HP1 urgent help',
  'HP2 services',
  'HP3 BetterBarangay',
  'HP4 Today',
  'HP5 accountability/evidence',
  'HP6 participation',
  'HP7 Explore / Mobility',
  'HP8 Research / Statistics / Reports',
  '### Search',
  '### BetterBarangay context',
  '### Trust, freshness and corrections',
]) {
  if (!priorityDoc.includes(marker)) {
    problems.push('Homepage priority marker missing: ' + marker);
  }
}

for (const gap of [
  'Emergency is not a clearly independent homepage start.',
  'Participation is not a first-order homepage job.',
  'Public Records / find the source is not a clearly recognizable homepage journey.',
  'Community Tools occupies first-order section space',
]) {
  if (!priorityDoc.includes(gap)) {
    problems.push('Known homepage gap missing: ' + gap);
  }
}

for (const sourceMarker of [
  '**J1**',
  '**J2**',
  '**J3**',
  '**J4**',
  '**J6**',
  '**J7**',
  '**J8**',
  '**J9**',
  '**J10**',
  '**J11**',
  '**J12**',
]) {
  if (!journeyMatrix.includes(sourceMarker)) {
    problems.push('W6-0c journey source missing: ' + sourceMarker);
  }
}

for (const scopeMarker of [
  'align homepage emphasis with W6-0c user jobs rather than feature count',
  'make Today the synthesis door for current civic information',
  'give Participation appropriate first-order visibility',
  'give evidence/public records a recognizable journey',
  'This is an **information hierarchy / journey pass**, not the Wave 7 aesthetic redesign.',
]) {
  if (!scopeRegister.includes(scopeMarker)) {
    problems.push('W6-0d homepage scope marker missing: ' + scopeMarker);
  }
}

const occurrences = (
  packageJson.match(/npm run check:wave6-homepage-priority-jobs/g) ?? []
).length;
if (occurrences < 2) {
  problems.push('W6-3a guard must be present in both build and quality.');
}

if (
  !packageJson.includes(
    '"check:wave6-homepage-priority-jobs": "node scripts/check-wave6-homepage-priority-jobs.mjs"'
  )
) {
  problems.push('package.json is missing check:wave6-homepage-priority-jobs.');
}

if (problems.length) {
  console.error('W6-3a homepage priority-job guard failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}

console.log(
  'W6-3a homepage priority-job guard passed: HP1-HP8, Tier A-C prominence, cross-cutting layers and known homepage gaps are frozen before homepage IA changes.'
);
