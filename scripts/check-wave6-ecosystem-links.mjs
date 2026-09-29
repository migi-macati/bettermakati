import { readFile } from 'node:fs/promises';

const [
  auditRaw,
  resources,
  about,
  government,
  statistics,
  projectsBudget,
  integrityRelationships,
  policyRaw,
  packageRaw,
] = await Promise.all([
  readFile('data/wave6-ecosystem-link-audit.json', 'utf8'),
  readFile('src/data/ecosystemResources.ts', 'utf8'),
  readFile('src/pages/About.tsx', 'utf8'),
  readFile('src/pages/Government.tsx', 'utf8'),
  readFile('src/pages/Statistics.tsx', 'utf8'),
  readFile('src/pages/ProjectsBudget.tsx', 'utf8'),
  readFile('src/data/integrityCivicRelationships.ts', 'utf8'),
  readFile('data/wave6-civic-relationship-policy.json', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const audit = JSON.parse(auditRaw);
const policy = JSON.parse(policyRaw);
const pkg = JSON.parse(packageRaw);
const problems = [];

if (audit.status !== 'complete') problems.push('W6-4d ecosystem audit is not complete.');

for (const id of audit.registry?.requiredIds ?? []) {
  if (!resources.includes("id: '" + id + "'")) {
    problems.push('Ecosystem registry missing required resource: ' + id);
  }
}

for (const marker of [
  "requireCivicEcosystemResource('bettergov-home')",
  "requireCivicEcosystemResource('betterlgu')",
  'Browse BetterLGU sites',
]) {
  if (!about.includes(marker)) problems.push('About ecosystem marker missing: ' + marker);
}

for (const marker of [
  "requireCivicEcosystemResource('open-congress')",
  "requireCivicEcosystemResource('national-government')",
  'label="National context"',
]) {
  if (!government.includes(marker)) problems.push('Government ecosystem marker missing: ' + marker);
}

for (const marker of [
  "requireCivicEcosystemResource('open-data')",
  "requireCivicEcosystemResource('data-research')",
  "requireCivicEcosystemResource('price-guides')",
]) {
  if (!statistics.includes(marker)) problems.push('Statistics ecosystem marker missing: ' + marker);
}

for (const marker of [
  "requireCivicEcosystemResource('national-budget')",
  "requireCivicEcosystemResource('philgeps')",
  "requireCivicEcosystemResource('transparency')",
  "requireCivicEcosystemResource('flood-control')",
  'label="National context"',
]) {
  if (!projectsBudget.includes(marker)) problems.push('Projects & Budget ecosystem marker missing: ' + marker);
}

if (!integrityRelationships.includes("ecosystem: 'bettergov'")) {
  problems.push('Integrity procurement ecosystem relationship is missing.');
}

const forbiddenHardcoded = [
  ['About', about, 'https://bettergov.ph/'],
  ['About', about, 'https://lgu.bettergov.ph/'],
  ['Government', government, 'https://open-congress-api.bettergov.ph/'],
  ['Government', government, 'https://bettergov.ph/government'],
  ['Statistics', statistics, 'https://data.bettergov.ph/'],
  ['Statistics', statistics, 'https://visualizations.bettergov.ph/'],
  ['Statistics', statistics, 'https://price-guides.bettergov.ph/'],
  ['Projects & Budget', projectsBudget, 'https://2026-budget.bettergov.ph/'],
  ['Projects & Budget', projectsBudget, 'https://transparency.bettergov.ph/'],
  ['Projects & Budget', projectsBudget, 'https://bettergov.ph/flood-control-projects'],
];
for (const [name, source, url] of forbiddenHardcoded) {
  if (source.includes(url)) problems.push(name + ' restored hardcoded ecosystem URL: ' + url);
}

for (const phrase of [
  'external ecosystem page as proof of Makati-specific fact',
  'BetterGov and BetterLGU are continuation context, not Makati-specific source evidence',
]) {
  const policyText = JSON.stringify(policy);
  if (!policyText.includes(phrase)) {
    problems.push('W6-4b ecosystem evidence boundary missing: ' + phrase);
  }
}

const scriptName = 'check:wave6-ecosystem-links';
const command = 'node scripts/check-wave6-ecosystem-links.mjs';
if (pkg.scripts?.[scriptName] !== command) problems.push(scriptName + ' registration missing.');
for (const pipeline of ['build', 'quality']) {
  if (!pkg.scripts?.[pipeline]?.includes('npm run ' + scriptName)) {
    problems.push(scriptName + ' missing from ' + pipeline + '.');
  }
}

if (problems.length) {
  console.error('W6-4d ecosystem-link check failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}

console.log('W6-4d ecosystem-link check passed: BetterGov/BetterLGU destinations are centrally registered, page-specific continuations are context-only, and core pages no longer duplicate registry-owned URLs.');
