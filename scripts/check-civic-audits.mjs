import { readFile } from 'node:fs/promises';

const campaign = JSON.parse(
  await readFile('data/civic-audit-campaign-schema.json', 'utf8')
);
const observations = JSON.parse(
  await readFile('data/structured-observation-schema.json', 'utf8')
);
const registrySource = await readFile('src/data/placeRegistry.ts', 'utf8');
const pilot = JSON.parse(
  await readFile('data/civic-audit-pilot-park-accessibility-2026.json', 'utf8')
);
const parkAudit = JSON.parse(
  await readFile('data/wave3-civic-map-parks-completeness-audit.json', 'utf8')
);
const pilotSource = await readFile('src/data/civicAuditPilot.ts', 'utf8');
const pilotPageSource = await readFile('src/pages/CivicAuditPilot.tsx', 'utf8');
const appSource = await readFile('src/App.tsx', 'utf8');
const civicMapPage = await readFile('src/pages/CivicMap.tsx', 'utf8');
const auditApiSource = await readFile('api/civic-audit.js', 'utf8');
const auditResultsSource = await readFile('src/pages/CivicAuditResults.tsx', 'utf8');

const problems = [];

const campaignFamilies = new Set(
  campaign.campaign.properties.questions.properties.familyId.values
);
const observationFamilies = new Set(Object.keys(observations.familyMapping));

for (const family of campaignFamilies) {
  if (!observationFamilies.has(family)) {
    problems.push('Campaign family not found in observation schema: ' + family);
  }
}
for (const family of observationFamilies) {
  if (!campaignFamilies.has(family)) {
    problems.push('Observation family missing from campaign schema: ' + family);
  }
}

const workflowStages = campaign.workflow.map(stage => stage.stage);
const expectedStages = [
  'draft',
  'freeze',
  'configure',
  'collect',
  'monitor',
  'close',
  'publish',
];
if (JSON.stringify(workflowStages) !== JSON.stringify(expectedStages)) {
  problems.push('Civic audit workflow stages changed unexpectedly.');
}

for (const required of [
  'entityKind',
  'frozenEntityIds',
  'frozenAt',
  'inventoryClaim',
  'targetEligibility',
]) {
  if (!campaign.campaign.properties.targetSet.required.includes(required)) {
    problems.push('Campaign targetSet is missing required field: ' + required);
  }
}

for (const kind of ['place', 'segment', 'route']) {
  if (!campaign.campaign.properties.targetSet.properties.entityKind.values.includes(kind)) {
    problems.push('Campaign targetSet is missing entity kind: ' + kind);
  }
}
for (const policy of ['verified-only', 'bounded-provisional-linear-allowed']) {
  if (!campaign.campaign.properties.targetSet.properties.targetEligibility.values.includes(policy)) {
    problems.push('Campaign targetSet is missing eligibility policy: ' + policy);
  }
}

let registryAssets = [];

const sourceMarker = 'export const civicAssets: CivicAsset[] = ';
const sourceStart = registrySource.indexOf(sourceMarker);
const arrayStart = registrySource.indexOf('[', sourceStart + sourceMarker.length);
let depth = 0;
let inString = false;
let quote = '';
let escape = false;
let arrayEnd = -1;

for (let index = arrayStart; index < registrySource.length; index += 1) {
  const char = registrySource[index];
  if (inString) {
    if (escape) {
      escape = false;
      continue;
    }
    if (char === '\\') {
      escape = true;
      continue;
    }
    if (char === quote) {
      inString = false;
      quote = '';
    }
    continue;
  }
  if (char === "'" || char === '"' || char === '`') {
    inString = true;
    quote = char;
    continue;
  }
  if (char === '[') depth += 1;
  if (char === ']') {
    depth -= 1;
    if (depth === 0) {
      arrayEnd = index + 1;
      break;
    }
  }
}

if (arrayStart < 0 || arrayEnd < 0) {
  problems.push('Could not parse Civic Registry seed list.');
} else {
  registryAssets = Function(
    'return (' + registrySource.slice(arrayStart, arrayEnd) + ')'
  )();

  const streetSegments = registryAssets.filter(asset => asset.type === 'street-segment');
  const provisionalStreetSegments = streetSegments.filter(
    asset => asset.status === 'pilot'
  );
  const verifiedStreetSegments = streetSegments.filter(
    asset => asset.status === 'mapped' && asset.sourceUrl && asset.coordinateSourceUrl
  );
  const sidewalkSegments = registryAssets.filter(
    asset => asset.type === 'sidewalk-segment'
  );

  if (
    streetSegments.length !==
    campaign.streetSegmentCoverage.currentRecords.streetSegmentCount
  ) {
    problems.push('Campaign street-segment count is out of sync with registry seeds.');
  }
  if (
    provisionalStreetSegments.length !==
    campaign.streetSegmentCoverage.currentRecords.provisionalStreetSegmentCount
  ) {
    problems.push('Campaign provisional street-segment count is out of sync.');
  }
  if (
    verifiedStreetSegments.length !==
    campaign.streetSegmentCoverage.currentRecords.verifiedStreetSegmentCount
  ) {
    problems.push('Campaign verified street-segment count is out of sync.');
  }
  if (
    sidewalkSegments.length !==
    campaign.streetSegmentCoverage.currentRecords.sidewalkSegmentCount
  ) {
    problems.push('Campaign sidewalk-segment count is out of sync.');
  }

  const recordedIds = campaign.streetSegmentCoverage.currentRecords.records.map(
    record => record.id
  );
  const registryIds = streetSegments.map(asset => asset.id);
  if (
    recordedIds.length !== registryIds.length ||
    recordedIds.some(id => !registryIds.includes(id))
  ) {
    problems.push('Campaign street-segment ID snapshot is out of sync.');
  }
}


const pilotCampaign = pilot.campaign;
const pilotTargetIds = pilotCampaign.targetSet.frozenEntityIds;
const expectedGovernmentPublicParkIds =
  parkAudit.currentCivicMapParkLayer.governmentPublicIds;

if (pilot.status !== 'collecting') {
  problems.push('Park accessibility pilot must be in collecting status.');
}
if (pilotCampaign.targetSet.entityKind !== 'place') {
  problems.push('Park accessibility pilot must target place entities.');
}
if (pilotCampaign.targetSet.targetEligibility !== 'verified-only') {
  problems.push('Park accessibility pilot must use verified-only targeting.');
}
if (pilotCampaign.questions.familyId !== 'park-public-space') {
  problems.push('Park accessibility pilot must use the park-public-space family.');
}
if (pilotCampaign.questions.questionSetId !== 'park-public-space-v1') {
  problems.push('Park accessibility pilot must use park-public-space-v1.');
}
if (
  pilotTargetIds.length !== 13 ||
  new Set(pilotTargetIds).size !== pilotTargetIds.length
) {
  problems.push('Park accessibility pilot must freeze exactly 13 unique targets.');
}
if (
  pilotTargetIds.length !== expectedGovernmentPublicParkIds.length ||
  pilotTargetIds.some(id => !expectedGovernmentPublicParkIds.includes(id)) ||
  expectedGovernmentPublicParkIds.some(id => !pilotTargetIds.includes(id))
) {
  problems.push('Park accessibility pilot target set is out of sync with the reconciled 13 public parks.');
}

for (const id of pilotTargetIds) {
  const asset = registryAssets.find(item => item.id === id);
  if (!asset) {
    problems.push('Pilot target is missing from Civic Registry seeds: ' + id);
    continue;
  }
  if (asset.type !== 'park') {
    problems.push('Pilot target is not a park: ' + id);
  }
  if (asset.accessClass !== 'government-public') {
    problems.push('Pilot target is not government-public: ' + id);
  }
  if (!(asset.status === 'mapped' && asset.sourceUrl && asset.coordinateSourceUrl)) {
    problems.push('Pilot target is not verified under the current registry migration rule: ' + id);
  }
}

const parkQuestionSet = observations.questionSets['park-public-space-v1'];
const parkQuestionIds = new Set(
  parkQuestionSet?.questions?.map(question => question.id) ?? []
);
for (const questionId of pilotCampaign.questions.questionIds) {
  if (!parkQuestionIds.has(questionId)) {
    problems.push('Pilot question is missing from park-public-space-v1: ' + questionId);
  }
}
for (const requiredQuestionId of pilotCampaign.questions.requiredQuestionIds) {
  if (!pilotCampaign.questions.questionIds.includes(requiredQuestionId)) {
    problems.push('Pilot required question is not in questionIds: ' + requiredQuestionId);
  }
}

const startsAt = new Date(pilotCampaign.period.startsAt).getTime();
const endsAt = new Date(pilotCampaign.period.endsAt).getTime();
if (!Number.isFinite(startsAt) || !Number.isFinite(endsAt) || endsAt <= startsAt) {
  problems.push('Park accessibility pilot period is invalid.');
}

if (pilotCampaign.completion.minimumObservationsPerEntity !== 2) {
  problems.push('Park accessibility pilot must seek two observations per park.');
}
if (pilotCampaign.completion.coverageTargetPercent !== 100) {
  problems.push('Park accessibility pilot coverage target must remain 100 percent.');
}

const frontendTargetIds = [
  ...pilotSource.matchAll(/\n\s+'([^']+)',/g),
]
  .map(match => match[1])
  .filter(value => expectedGovernmentPublicParkIds.includes(value));

if (
  frontendTargetIds.length !== pilotTargetIds.length ||
  frontendTargetIds.some(id => !pilotTargetIds.includes(id))
) {
  problems.push('Frontend park audit target IDs are out of sync with the frozen campaign.');
}

for (const marker of [
  "id: 'makati-public-park-accessibility-2026-pilot'",
  "minimumObservationsPerEntity: 2",
  "'entrance-access'",
  "'step-free-access'",
  "'seating'",
  "'toilets'",
]) {
  if (!pilotSource.includes(marker)) {
    problems.push('Frontend pilot data is missing: ' + marker);
  }
}

for (const marker of [
  'Choose a park to observe',
  "'?campaign=' +",
  'civicAuditPilot.id',
  "'#observe'",
  'Record conditions',
]) {
  if (!pilotPageSource.includes(marker)) {
    problems.push('Park accessibility pilot page is missing: ' + marker);
  }
}

if (!appSource.includes('path="/civic-map/audits/park-accessibility-2026"')) {
  problems.push('Park accessibility pilot route is missing.');
}
if (!civicMapPage.includes('to="/civic-map/audits/park-accessibility-2026"')) {
  problems.push('Civic Map does not surface the park accessibility pilot.');
}

const apiTargetBlock = auditApiSource.match(
  /targetEntityIds:\s*\[([\s\S]*?)\],\s*familyId/
)?.[1] ?? '';
const apiTargetIds = [
  ...apiTargetBlock.matchAll(/'([^']+)'/g),
].map(match => match[1]);

if (
  apiTargetIds.length !== pilotTargetIds.length ||
  apiTargetIds.some(id => !pilotTargetIds.includes(id)) ||
  pilotTargetIds.some(id => !apiTargetIds.includes(id))
) {
  problems.push('Live civic audit API target IDs are out of sync with the frozen campaign.');
}

for (const questionId of pilotCampaign.questions.questionIds) {
  if (!auditApiSource.includes("'" + questionId + "'")) {
    problems.push('Live civic audit API is missing campaign question: ' + questionId);
  }
}
if (!auditApiSource.includes("startsAt: '" + pilotCampaign.period.startsAt + "'")) {
  problems.push('Live civic audit API start date is out of sync.');
}
if (!auditApiSource.includes("endsAt: '" + pilotCampaign.period.endsAt + "'")) {
  problems.push('Live civic audit API end date is out of sync.');
}

for (const marker of [
  "const CAMPAIGN = {",
  "targetEntityIds: [",
  "minimumObservationsPerEntity: 2",
  "inCampaignWindow(observation.observedAt)",
  "CAMPAIGN.questionIds.includes(answer.questionId)",
  "entityObservations.length >= CAMPAIGN.minimumObservationsPerEntity",
  "CAMPAIGN.requiredQuestionIds.every",
  "observationCount: observations.length",
  "observedEntities",
  "completeEntities",
  "questions,",
]) {
  if (!auditApiSource.includes(marker)) {
    problems.push('Live civic audit API is missing: ' + marker);
  }
}

for (const marker of [
  'Live audit output',
  'campaign observations',
  'parks with observations',
  'parks meeting the pilot completion rule',
  'Observed distributions',
  '13 frozen target parks',
  'No substantive campaign-period answers yet.',
  "civicAuditPilot.route + '/results'",
]) {
  if (!auditResultsSource.includes(marker) && !pilotPageSource.includes(marker)) {
    problems.push('Published audit output is missing: ' + marker);
  }
}

for (const forbidden of [
  'overallScore',
  'averageRating',
  'weightedScore',
  'compositeIndex',
  'starRating',
  'best park',
  'worst park',
  'park ranking',
]) {
  if (auditApiSource.includes(forbidden) || auditResultsSource.includes(forbidden)) {
    problems.push('Published audit output contains forbidden scoring/ranking marker: ' + forbidden);
  }
}
if (!pilotPageSource.includes("civicAuditPilot.id +")) {
  problems.push('Park audit links do not carry campaign context.');
}
const civicAssetSource = await readFile('src/pages/CivicAsset.tsx', 'utf8');
const observationFormSource = await readFile(
  'src/components/civic/CivicObservationForm.tsx',
  'utf8'
);
for (const marker of [
  "searchParams.get('campaign') === civicAuditPilot.id",
  'questionIds={',
  'civicAuditPilot.questionIds',
]) {
  if (!civicAssetSource.includes(marker)) {
    problems.push('Park audit detail-page question scoping is missing: ' + marker);
  }
}
for (const marker of [
  'questionIds?: readonly string[]',
  'const allowed = new Set(questionIds)',
  'questions: fullSet.questions.filter(question => allowed.has(question.id))',
]) {
  if (!observationFormSource.includes(marker)) {
    problems.push('Observation form campaign question filter is missing: ' + marker);
  }
}

for (const forbidden of [
  'overall-score',
  'star-rating',
  'weighted-composite',
  'entity-ranking',
  'best-worst-label',
  'hidden-numeric-conversion',
]) {
  if (!campaign.campaign.properties.output.properties.forbidden.const.includes(forbidden)) {
    problems.push('Campaign output prohibition missing: ' + forbidden);
  }
}

if (!campaign.streetSegmentCoverage.campaignRule.includes('Do not launch')) {
  problems.push('Street-segment coverage gate is missing.');
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log(
  'Civic audit campaign schema OK: ' +
    campaignFamilies.size +
    ' families, ' +
    workflowStages.length +
    ' workflow stages, 13-park accessibility pilot frozen, street inventory gap explicitly gated.'
);
