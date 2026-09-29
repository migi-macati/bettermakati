import { readFile } from 'node:fs/promises';

const [
  compactLinks,
  statistics,
  projectsBudget,
  accountability,
  legislation,
  officialProfile,
  reportArticle,
  civicAsset,
  domainTimeline,
  barangayTimeline,
  calendar,
  relationshipPresentation,
  packageRaw,
] = await Promise.all([
  readFile('src/components/civic/CivicRelationshipLinks.tsx', 'utf8'),
  readFile('src/pages/Statistics.tsx', 'utf8'),
  readFile('src/pages/ProjectsBudget.tsx', 'utf8'),
  readFile('src/pages/Accountability.tsx', 'utf8'),
  readFile('src/pages/Legislation.tsx', 'utf8'),
  readFile('src/pages/OfficialProfile.tsx', 'utf8'),
  readFile('src/pages/ReportArticle.tsx', 'utf8'),
  readFile('src/pages/CivicAsset.tsx', 'utf8'),
  readFile('src/components/civic/CivicDomainTimelinePreview.tsx', 'utf8'),
  readFile('src/components/civic/CivicTimelinePreview.tsx', 'utf8'),
  readFile('src/pages/Calendar.tsx', 'utf8'),
  readFile('src/data/civicRelationshipPresentation.ts', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const pkg = JSON.parse(packageRaw);
const problems = [];

const need = (name, source, marker) => {
  if (!source.includes(marker)) {
    problems.push(name + ' marker missing: ' + marker);
  }
};

for (const marker of [
  'export type CivicRelationshipTone',
  "'primary' | 'secondary' | 'neutral'",
  'external?: boolean',
  'min-h-11',
  'ExternalLink',
  'frameClasses',
]) {
  need('Compact relationship component', compactLinks, marker);
}

need('Relationship presentation', relationshipPresentation, 'civicRelationshipOwnerLabel');
need('Statistics', statistics, 'label="Related analysis"');
need('Statistics', statistics, 'label="National data context"');
need('Statistics', statistics, 'tone="neutral"');

for (const marker of [
  'label="Related places"',
  'label="Integrity evidence"',
  'label="Related analysis"',
]) {
  need('Accountability', accountability, marker);
}

need('Legislation', legislation, 'label="Related civic records"');
need('Official profile', officialProfile, 'label="Election record"');
need(
  'Official profile',
  officialProfile,
  'Only records directly linked to this profile by the underlying public data are shown here.'
);
need(
  'Civic Asset',
  civicAsset,
  'Related accountability records'
);
need('Projects & Budget', projectsBudget, 'label="National context"');
need('Projects & Budget', projectsBudget, 'tone="neutral"');

for (const marker of [
  'civicRelationshipOwnerLabel(item.node.owner)',
  'Open external resource',
]) {
  need('Report Article', reportArticle, marker);
}

need('Domain Timeline', domainTimeline, 'On the Makati Calendar');
need('Domain Timeline', domainTimeline, 'Open record');
need('Barangay Timeline', barangayTimeline, 'On the Makati Calendar');
need('Calendar', calendar, 'Open record');
need('Calendar', calendar, 'Record: {item.canonicalLabel}');

const publicFacingJargon = [
  ['Official profile', officialProfile, 'explicit canonical relationship to this profile'],
  ['Report Article', reportArticle, 'report remains the canonical analysis'],
  ['Domain Timeline', domainTimeline, 'Open canonical record'],
  ['Calendar', calendar, 'Open canonical record'],
  ['Calendar', calendar, 'Canonical owner:'],
  ['Calendar', calendar, 'No canonical items match this view yet.'],
  ['Calendar', calendar, 'cross-domain index of canonical BetterMakati records'],
  ['Barangay Timeline', barangayTimeline, 'No current or future canonical civic dates'],
];

for (const [name, source, phrase] of publicFacingJargon) {
  if (source.includes(phrase)) {
    problems.push(name + ' restored public-facing implementation jargon: ' + phrase);
  }
}

const scriptName = 'check:wave6-relationship-ux';
const command = 'node scripts/check-wave6-relationship-ux.mjs';

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
  ]) {
    if (!pkg.scripts?.[pipeline]?.includes('npm run ' + prior)) {
      problems.push(prior + ' must remain in the ' + pipeline + ' pipeline.');
    }
  }
}

if (problems.length) {
  console.error(
    'W6-4e relationship UX check failed:\n- ' + problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'W6-4e relationship UX check passed: compact relationship links expose purpose, external civic resources remain context rather than evidence, report cards show record type, and public Calendar copy avoids internal relationship-model jargon.'
);
