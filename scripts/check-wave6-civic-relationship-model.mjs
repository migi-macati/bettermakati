import { readFile } from 'node:fs/promises';

const [model, policyRaw, doc, packageRaw] = await Promise.all([
  readFile('src/data/civicIntelligenceRelationships.ts', 'utf8'),
  readFile('data/wave6-civic-relationship-policy.json', 'utf8'),
  readFile('docs/w6-4b-civic-relationship-model.md', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const policy = JSON.parse(policyRaw);
const pkg = JSON.parse(packageRaw);
const problems = [];

const requiredNodeTypes = [
  'budget-record',
  'official',
  'election-record',
  'timeline-item',
];

for (const type of requiredNodeTypes) {
  if (!model.includes("'" + type + "'")) {
    problems.push('Shared relationship node type missing: ' + type);
  }
  if (!policy.requiredNodeTypes?.includes(type)) {
    problems.push('W6-4b policy node type missing: ' + type);
  }
}

for (const owner of ['budgets', 'officials', 'elections', 'timeline']) {
  if (!model.includes("'" + owner + "'")) {
    problems.push('Shared relationship resolver owner missing: ' + owner);
  }
  if (!policy.requiredOwners?.includes(owner)) {
    problems.push('W6-4b policy resolver owner missing: ' + owner);
  }
}

if (!model.includes("'chronicles'")) {
  problems.push('Timeline relationship kind chronicles is missing.');
}

const timelinePattern = policy.allowedPatterns?.find(
  item => item.from === 'timeline-item'
);
if (
  !timelinePattern ||
  !timelinePattern.allowedKinds?.includes('chronicles') ||
  !timelinePattern.evidenceBasis?.includes('canonical-id')
) {
  problems.push(
    'Timeline policy must require a canonical-id based chronicles relationship.'
  );
}

const officialPattern = policy.allowedPatterns?.find(
  item => item.from === 'official'
);
if (
  !officialPattern ||
  !officialPattern.to?.includes('election-record')
) {
  problems.push(
    'Official policy must allow exact official-to-election identity without broad office attribution.'
  );
}

const budgetPattern = policy.allowedPatterns?.find(
  item => item.from === 'budget-record'
);
if (
  !budgetPattern ||
  !budgetPattern.to?.includes('project') ||
  !budgetPattern.allowedKinds?.includes('funds')
) {
  problems.push(
    'Budget policy must allow evidence-backed funding links to projects.'
  );
}

const forbidden = policy.forbiddenInference ?? [];
for (const required of [
  'title or keyword similarity',
  'chronological proximity',
  'same broad topic',
  'office held as proof of authorship, vote, responsibility or control',
  'budget category as proof that a specific project was funded',
]) {
  if (!forbidden.includes(required)) {
    problems.push('Anti-inference rule missing: ' + required);
  }
}

if (!doc.includes('W6-4c — page-family cross-links')) {
  problems.push('W6-4b closure doc must hand off explicitly to W6-4c.');
}

const scriptName = 'check:wave6-civic-relationship-model';
const command = 'node scripts/check-wave6-civic-relationship-model.mjs';

if (pkg.scripts?.[scriptName] !== command) {
  problems.push(scriptName + ' script registration is missing.');
}

for (const pipeline of ['build', 'quality']) {
  if (!pkg.scripts?.[pipeline]?.includes('npm run ' + scriptName)) {
    problems.push(
      scriptName + ' must remain in the ' + pipeline + ' pipeline.'
    );
  }
}

if (problems.length) {
  console.error(
    'W6-4b civic relationship model check failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'W6-4b civic relationship model check passed: officials, elections, budget records and timeline items use the shared typed graph, cross-domain links require explicit evidence, and unsupported attribution/proximity matching remains forbidden.'
);
