import { readFile } from 'node:fs/promises';

const [
  auditRaw,
  app,
  css,
  sharedRelationships,
  statisticsRelationships,
  legislationRelationships,
  integrityRelationships,
  reportRelationships,
  statisticsPage,
  legislationPage,
  integrityPage,
  reportArticle,
  publicRecordsPage,
  publicRecordDetail,
  accountabilityPage,
  serviceGuide,
  searchIndex,
] = await Promise.all([
  readFile('data/wave4-civic-intelligence-human-relationship-audit.json', 'utf8'),
  readFile('src/App.tsx', 'utf8'),
  readFile('src/index.css', 'utf8'),
  readFile('src/data/civicIntelligenceRelationships.ts', 'utf8'),
  readFile('src/data/statisticsCivicRelationships.ts', 'utf8'),
  readFile('src/data/legislationCivicRelationships.ts', 'utf8'),
  readFile('src/data/integrityCivicRelationships.ts', 'utf8'),
  readFile('src/data/reportCivicRelationships.ts', 'utf8'),
  readFile('src/pages/Statistics.tsx', 'utf8'),
  readFile('src/pages/Legislation.tsx', 'utf8'),
  readFile('src/pages/Integrity.tsx', 'utf8'),
  readFile('src/pages/ReportArticle.tsx', 'utf8'),
  readFile('src/pages/PublicRecords.tsx', 'utf8'),
  readFile('src/pages/PublicRecordDetail.tsx', 'utf8'),
  readFile('src/pages/Accountability.tsx', 'utf8'),
  readFile('src/pages/ServiceGuide.tsx', 'utf8'),
  readFile('src/data/searchIndex.ts', 'utf8'),
]);

const audit = JSON.parse(auditRaw);
const problems = [];

if (audit.overallStatus !== 'static-verified-live-browser-unverified') {
  problems.push('W4-5i must not overstate live-browser verification.');
}
if (audit.verification?.liveBrowserAudit?.status !== 'unverified') {
  problems.push('Live browser status must remain explicitly unverified until actually tested.');
}
if (audit.verification?.repositoryStaticAudit?.status !== 'pass') {
  problems.push('Repository static audit must be recorded as pass.');
}

for (const marker of [
  'Duplicate/reverse Civic Intelligence relationship must be derived as a backlink, not stored twice',
  'Civic Intelligence relationship cannot link a record to itself',
  'Source-backed Civic Intelligence relationship needs source ids',
  'createCivicIntelligenceRelationshipIndex',
]) {
  if (!sharedRelationships.includes(marker)) {
    problems.push('Shared relationship integrity marker missing: ' + marker);
  }
}

for (const [name, source, sourceMarker, targetMarker] of [
  [
    'Statistics',
    statisticsRelationships,
    'Unresolved Statistics relationship source',
    'Unresolved Statistics relationship target',
  ],
  [
    'Legislation',
    legislationRelationships,
    'Unresolved Legislation relationship source',
    'Unresolved Legislation relationship target',
  ],
  [
    'Integrity',
    integrityRelationships,
    'Unresolved Integrity civic relationship source',
    'Unresolved Integrity civic relationship target',
  ],
  [
    'Reports',
    reportRelationships,
    'Unresolved report civic relationship source',
    'Unresolved report civic relationship target',
  ],
]) {
  if (!source.includes(sourceMarker) || !source.includes(targetMarker)) {
    problems.push(name + ' relationship endpoints are not guarded by canonical resolution checks.');
  }
}

for (const marker of [
  '<Route path="/statistics" element={<Statistics />} />',
  '<Route path="/legislation" element={<Legislation />} />',
  '<Route path="/integrity" element={<Integrity />} />',
  '<Route path="/reports" element={<Reports />} />',
  '<Route path="/reports/:slug" element={<ReportArticle />} />',
  '<Route path="/records" element={<PublicRecords />} />',
  '<Route path="/records/:id" element={<PublicRecordDetail />} />',
  '<Route path="/accountability"',
  'path="/services/guide/:id"',
]) {
  if (!app.includes(marker)) {
    problems.push('Wave 4 canonical route missing: ' + marker);
  }
}

for (const marker of [
  '@media (prefers-reduced-motion: reduce)',
  ':where(a, button, input, select, textarea, summary):focus-visible',
  'min-height: 44px',
  '.skip-link',
]) {
  if (!css.includes(marker)) {
    problems.push('Global mobile/accessibility baseline missing: ' + marker);
  }
}

for (const marker of [
  'id="population-trend"',
  'id="economy-work"',
  'overflow-x-auto',
  'min-w-[420px]',
  'Related analysis',
]) {
  if (!statisticsPage.includes(marker)) {
    problems.push('Statistics journey/mobile marker missing: ' + marker);
  }
}

for (const marker of [
  'aria-pressed={active}',
  'min-h-11 border-primary-700 bg-primary-700 text-white',
  'min-h-11 appearance-none rounded-full',
  'inline-flex min-h-11 items-center text-primary-700',
  'aria-expanded={expanded}',
  'Related records',
]) {
  if (!legislationPage.includes(marker)) {
    problems.push('Legislation journey/mobile marker missing: ' + marker);
  }
}

for (const marker of [
  "id=\"procurement\"",
  "id=\"disclosures\"",
  "id=\"audits\"",
  'overflow-x-auto',
  'min-w-[760px]',
  'min-w-[980px]',
  'Accountability record',
  'Public record',
  'Analysis: {item.node.label}',
]) {
  if (!integrityPage.includes(marker)) {
    problems.push('Integrity journey/mobile marker missing: ' + marker);
  }
}

for (const marker of [
  'reportCivicNodeResolver',
  'reportRecordRefToCivicRef(record)',
  'to={resolved?.href ?? record.href}',
  'Related records',
  'overflow-x-auto',
  'min-w-[640px]',
]) {
  if (!reportArticle.includes(marker)) {
    problems.push('Report canonical/mobile journey marker missing: ' + marker);
  }
}

for (const marker of [
  'id={entry.id}',
  'Integrity evidence',
  'Analysis: {item.node.label}',
]) {
  if (!accountabilityPage.includes(marker)) {
    problems.push('Accountability reverse-journey marker missing: ' + marker);
  }
}

for (const marker of [
  'legislationForService(item.id)',
  'They do not establish the service’s current fee, rule or legal effect.',
]) {
  if (!serviceGuide.includes(marker)) {
    problems.push('Service/legislation reverse journey marker missing: ' + marker);
  }
}

for (const marker of [
  "to={'/records/' + record.id}",
  'View record',
  'Integrity evidence',
]) {
  if (!publicRecordsPage.includes(marker)) {
    problems.push('Public Records catalog journey marker missing: ' + marker);
  }
}

for (const marker of [
  'record.contexts.map',
  "record.format === 'PDF'",
  "title={record.title + ' document preview'}",
  'If the publisher blocks embedded viewing',
]) {
  if (!publicRecordDetail.includes(marker)) {
    problems.push('Public Record detail accessibility/journey marker missing: ' + marker);
  }
}

for (const forbidden of [
  '/integrity?view=suppliers#procurement',
]) {
  if (
    integrityRelationships.includes(forbidden) ||
    reportRelationships.includes(forbidden) ||
    searchIndex.includes(forbidden)
  ) {
    problems.push('Stale canonical route remains: ' + forbidden);
  }
}

if (!integrityRelationships.includes("href: '/integrity#procurement'")) {
  problems.push('Integrity entity resolver must use the canonical procurement anchor.');
}
if (!reportRelationships.includes("href: '/integrity#procurement'")) {
  problems.push('Report resolver must use the canonical Integrity procurement anchor.');
}
if (!searchIndex.includes("href: '/integrity#procurement'")) {
  problems.push('Global Search must use the canonical Integrity procurement anchor.');
}

const journeyStatuses = new Map(
  (audit.userJourneys ?? []).map(journey => [journey.id, journey.status])
);
for (const id of [
  'statistics-report-record',
  'legislation-service-source',
  'integrity-accountability-source-analysis',
  'search-canonical-destination',
]) {
  if (journeyStatuses.get(id) !== 'pass-static') {
    problems.push('W4-5i user journey is not statically verified: ' + id);
  }
}

if (
  audit.closureInputs?.boundedOrDeferred?.includes('live browser viewport verification') !== true ||
  audit.closureInputs?.boundedOrDeferred?.includes('runtime console verification') !== true
) {
  problems.push('W4-5i closure inputs must preserve the live-browser/runtime verification limitation.');
}

if (problems.length) {
  console.error(
    'Wave 4 human/relationship audit check failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'Wave 4 human/relationship audit check passed: canonical relationship endpoints are guarded, four Civic Intelligence journeys are statically verified, mobile/accessibility source checks pass after bounded fixes, and live-browser/runtime verification remains explicitly unverified.'
);
