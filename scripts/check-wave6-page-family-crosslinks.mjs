import { readFile } from 'node:fs/promises';

const [
  statistics,
  projectsBudget,
  accountability,
  legislation,
  officialProfile,
  elections,
  reportArticle,
  calendar,
  barangayProfile,
  civicAsset,
  officialRelationships,
  timelineRelationships,
  policyRaw,
  packageRaw,
] = await Promise.all([
  readFile('src/pages/Statistics.tsx', 'utf8'),
  readFile('src/pages/ProjectsBudget.tsx', 'utf8'),
  readFile('src/pages/Accountability.tsx', 'utf8'),
  readFile('src/pages/Legislation.tsx', 'utf8'),
  readFile('src/pages/OfficialProfile.tsx', 'utf8'),
  readFile('src/pages/Elections.tsx', 'utf8'),
  readFile('src/pages/ReportArticle.tsx', 'utf8'),
  readFile('src/pages/Calendar.tsx', 'utf8'),
  readFile('src/pages/BarangayProfile.tsx', 'utf8'),
  readFile('src/pages/CivicAsset.tsx', 'utf8'),
  readFile('src/data/officialCivicRelationships.ts', 'utf8'),
  readFile('src/data/timelineCivicRelationships.ts', 'utf8'),
  readFile('data/wave6-civic-relationship-policy.json', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const policy = JSON.parse(policyRaw);
const pkg = JSON.parse(packageRaw);
const problems = [];

const requireMarkers = (name, source, markers) => {
  for (const marker of markers) {
    if (!source.includes(marker)) {
      problems.push(name + ' cross-link marker missing: ' + marker);
    }
  }
};

requireMarkers('Statistics', statistics, [
  'reportsForCivicRecord',
  'statisticsRelatedRecords',
  'Related analysis',
]);

requireMarkers('Projects & Budget', projectsBudget, [
  'integrityForAccountability',
  "/accountability?type=project#",
  'City Monitor',
]);

requireMarkers('Accountability', accountability, [
  'placesRelatedTo',
  'integrityForAccountability',
  'reportsForCivicRecord',
  'CivicDomainTimelinePreview',
]);

requireMarkers('Legislation', legislation, [
  'legislationRelatedRecords',
  'Public record',
  'CivicDomainTimelinePreview',
]);

requireMarkers('Officials', officialProfile, [
  'electionRecordForOfficial',
  '2025 election result',
]);

requireMarkers('Elections', elections, [
  'findElection2025OfficialSlug',
  "/officials/",
  'ElectionCandidateName',
]);

requireMarkers('Reports', reportArticle, [
  'timelineForCivicRecord',
  'On the Makati Calendar',
  'View calendar entry',
]);

requireMarkers('Calendar', calendar, [
  'Open canonical record',
  'geographyLinks',
  'Original source',
]);

requireMarkers('Barangay', barangayProfile, [
  'CivicTimelinePreview',
  "withBarangayScope('/statistics'",
  "withBarangayScope('/projects-budget'",
  "withBarangayScope('/accountability'",
  "withBarangayScope('/civic-map'",
]);

requireMarkers('Place', civicAsset, [
  'relatedAccountability',
  'relatedHistoryEvents',
  'relatedBarangays',
]);

requireMarkers('Official relationship model', officialRelationships, [
  "type: 'election-record'",
  "type: 'official'",
  "basis: 'canonical-id'",
  'does not infer later votes, sponsorship, project responsibility or procurement control',
]);

requireMarkers('Timeline relationship model', timelineRelationships, [
  "type: 'timeline-item'",
  "kind: 'chronicles'",
  "basis: 'canonical-id'",
  "basis: 'explicit-geography'",
  'timelineForCivicRecord',
]);

const forbidden = policy.forbiddenInference ?? [];
for (const required of [
  'title or keyword similarity',
  'chronological proximity',
  'same broad topic',
  'office held as proof of authorship, vote, responsibility or control',
  'budget category as proof that a specific project was funded',
]) {
  if (!forbidden.includes(required)) {
    problems.push('W6-4b anti-inference authority missing: ' + required);
  }
}

const scriptName = 'check:wave6-page-family-crosslinks';
const command = 'node scripts/check-wave6-page-family-crosslinks.mjs';

if (pkg.scripts?.[scriptName] !== command) {
  problems.push(scriptName + ' script registration is missing.');
}

for (const pipeline of ['build', 'quality']) {
  if (!pkg.scripts?.[pipeline]?.includes('npm run ' + scriptName)) {
    problems.push(scriptName + ' must remain in the ' + pipeline + ' pipeline.');
  }
}

if (problems.length) {
  console.error(
    'W6-4c page-family cross-link check failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'W6-4c page-family cross-link check passed: established civic continuations remain intact, Officials↔Elections and Reports↔Calendar are now reversible through canonical IDs, and W6-4b anti-inference rules still govern the graph.'
);
