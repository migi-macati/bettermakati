import { readFile } from 'node:fs/promises';

const campaign = JSON.parse(
  await readFile('data/civic-audit-campaign-schema.json', 'utf8')
);
const observations = JSON.parse(
  await readFile('data/structured-observation-schema.json', 'utf8')
);
const registrySource = await readFile('src/data/placeRegistry.ts', 'utf8');

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
  const assets = Function(
    'return (' + registrySource.slice(arrayStart, arrayEnd) + ')'
  )();

  const streetSegments = assets.filter(asset => asset.type === 'street-segment');
  const provisionalStreetSegments = streetSegments.filter(
    asset => asset.status === 'pilot'
  );
  const verifiedStreetSegments = streetSegments.filter(
    asset => asset.status === 'mapped' && asset.sourceUrl && asset.coordinateSourceUrl
  );
  const sidewalkSegments = assets.filter(
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
    ' workflow stages, street inventory gap explicitly gated.'
);
