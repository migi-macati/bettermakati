import { readFile } from 'node:fs/promises';

const [
  statisticsRelationships,
  reportRelationships,
  integrityRelationships,
  legislationRelationships,
  officialRelationships,
  elections,
  officialProfile,
  reportArticle,
  timelineRelationships,
  packageRaw,
] = await Promise.all([
  readFile('src/data/statisticsCivicRelationships.ts', 'utf8'),
  readFile('src/data/reportCivicRelationships.ts', 'utf8'),
  readFile('src/data/integrityCivicRelationships.ts', 'utf8'),
  readFile('src/data/legislationCivicRelationships.ts', 'utf8'),
  readFile('src/data/officialCivicRelationships.ts', 'utf8'),
  readFile('src/pages/Elections.tsx', 'utf8'),
  readFile('src/pages/OfficialProfile.tsx', 'utf8'),
  readFile('src/pages/ReportArticle.tsx', 'utf8'),
  readFile('src/data/timelineCivicRelationships.ts', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const pkg = JSON.parse(packageRaw);
const problems = [];

const need = (name, source, marker) => {
  if (!source.includes(marker)) {
    problems.push(name + ' marker missing: ' + marker);
  }
};

need(
  'Statistics relationship map',
  statisticsRelationships,
  'export const statisticsHrefByIndicatorId'
);
need(
  'Report Statistics resolver',
  reportRelationships,
  "href: statisticsHrefByIndicatorId[ref.id] ?? '/statistics'"
);

need(
  'Official resolver',
  officialRelationships,
  "href: '/elections#official-result-' + official.slug"
);
need(
  'Elections exact result anchor helper',
  elections,
  "'official-result-' + officialSlug"
);
need(
  'Elections single-seat exact anchor',
  elections,
  'id={electionOfficialResultAnchorId(winner.name)}'
);
need(
  'Elections council exact anchor',
  elections,
  'id={electionOfficialResultAnchorId(candidate.name)}'
);

need(
  'Official profile exact relationship',
  officialProfile,
  'electionRecordForOfficial'
);
need(
  'Official profile evidence rule',
  officialProfile,
  'Only records directly linked to this profile by the underlying public data are shown here.'
);

for (const forbidden of [
  '<Link to="/accountability"',
  '<Link to="/legislation"',
  '<Link to="/records"',
]) {
  if (officialProfile.includes(forbidden)) {
    problems.push(
      'Official profile restored unsupported generic related-record handoff: ' +
        forbidden
    );
  }
}

need(
  'Integrity exact Public Record route',
  integrityRelationships,
  "href: '/records/' + record.id"
);
if (integrityRelationships.includes("href: '/records',")) {
  problems.push('Integrity resolver still contains generic Public Records fallback.');
}

need(
  'Legislation exact City Monitor fallback',
  legislationRelationships,
  "href: record.relatedHref ?? '/city-monitor/' + record.id"
);
need(
  'Legislation exact Public Record fallback',
  legislationRelationships,
  "href: record.relatedHref ?? '/records/' + record.id"
);

need('Report Calendar backlink', reportArticle, 'timelineForCivicRecord');
need('Timeline canonical reverse edge', timelineRelationships, "kind: 'chronicles'");

const priorGuard = 'npm run check:wave6-page-family-crosslinks';
for (const pipeline of ['build', 'quality']) {
  if (!pkg.scripts?.[pipeline]?.includes(priorGuard)) {
    problems.push(
      'W6-4c page-family guard must remain in the ' + pipeline + ' pipeline.'
    );
  }
}

const scriptName = 'check:wave6-contextual-backlinks';
const command = 'node scripts/check-wave6-contextual-backlinks.mjs';
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
    'W6-4d contextual backlink QA failed:\n- ' + problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'W6-4d contextual backlink QA passed: official election links, report/statistics backlinks, Integrity sources and Legislation record fallbacks land on exact canonical destinations, while unsupported generic office-related handoffs stay removed.'
);
