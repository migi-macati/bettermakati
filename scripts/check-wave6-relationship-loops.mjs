import { readFile } from 'node:fs/promises';

const [
  auditRaw,
  officialProfile,
  timelineRelationships,
  ecosystemResources,
  about,
  government,
  statistics,
  projectsBudget,
  civicAsset,
  packageRaw,
] = await Promise.all([
  readFile('data/wave6-relationship-loop-audit.json', 'utf8'),
  readFile('src/pages/OfficialProfile.tsx', 'utf8'),
  readFile('src/data/timelineCivicRelationships.ts', 'utf8'),
  readFile('src/data/ecosystemResources.ts', 'utf8'),
  readFile('src/pages/About.tsx', 'utf8'),
  readFile('src/pages/Government.tsx', 'utf8'),
  readFile('src/pages/Statistics.tsx', 'utf8'),
  readFile('src/pages/ProjectsBudget.tsx', 'utf8'),
  readFile('src/pages/CivicAsset.tsx', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const audit = JSON.parse(auditRaw);
const pkg = JSON.parse(packageRaw);
const problems = [];

if (audit.status !== 'complete') problems.push('W6-4e loop audit is not complete.');
if ((audit.closure?.unresolved ?? -1) !== 0) problems.push('W6-4e loop audit has unresolved findings.');
if ((audit.closure?.removedOrReplaced ?? 0) < 4) problems.push('Resolved redundancy baseline regressed.');
if ((audit.closure?.intentionalBidirectionalOrLayeredPatterns ?? 0) < 6) {
  problems.push('Intentional layered/bidirectional decision set regressed.');
}

for (const forbidden of [
  '<Link to="/accountability"',
  '<Link to="/legislation"',
  '<Link to="/records"',
]) {
  if (officialProfile.includes(forbidden)) {
    problems.push('Official profile restored unsupported generic loop: ' + forbidden);
  }
}

if (timelineRelationships.includes('q: item.title')) {
  problems.push('Timeline relationships restored title-search rediscovery.');
}
if (!timelineRelationships.includes("'#timeline-item-'")) {
  problems.push('Timeline exact-item anchor is missing.');
}

if (!civicAsset.includes('Related accountability records')) {
  problems.push('Civic Asset relationship family label regressed.');
}

for (const source of [about, government, statistics, projectsBudget]) {
  if (!source.includes('requireCivicEcosystemResource')) {
    problems.push('A core ecosystem surface is no longer registry-backed.');
  }
}
if (!ecosystemResources.includes('requireCivicEcosystemResource')) {
  problems.push('Ecosystem registry accessor is missing.');
}

const decisions = new Map((audit.decisions ?? []).map(item => [item.id, item]));
for (const id of [
  'official-generic-domain-links',
  'calendar-title-search-backlink',
  'hardcoded-ecosystem-url-duplicates',
  'civic-asset-related-public-records-label',
  'statistics-national-context-two-levels',
  'barangay-quick-actions-and-civic-information',
  'official-election-two-way',
  'report-calendar-two-way',
  'accountability-place-two-way',
  'about-and-domain-ecosystem-links',
]) {
  if (!decisions.has(id)) problems.push('Loop audit decision missing: ' + id);
}

const scriptName = 'check:wave6-relationship-loops';
const command = 'node scripts/check-wave6-relationship-loops.mjs';
if (pkg.scripts?.[scriptName] !== command) problems.push(scriptName + ' registration missing.');
for (const pipeline of ['build', 'quality']) {
  if (!pkg.scripts?.[pipeline]?.includes('npm run ' + scriptName)) {
    problems.push(scriptName + ' missing from ' + pipeline + '.');
  }
}

if (problems.length) {
  console.error('W6-4e loop/redundancy check failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}

console.log('W6-4e loop/redundancy check passed: removed loops stay removed, exact relationship anchors remain, ecosystem destinations stay centralized, and retained repeated paths have explicit user-purpose rationale.');
