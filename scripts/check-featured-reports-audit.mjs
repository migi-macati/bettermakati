import { readFile } from 'node:fs/promises';

const reportsSource = await readFile('src/data/reports.ts', 'utf8');
const audit = JSON.parse(
  await readFile('data/wave4-featured-reports-audit.json', 'utf8')
);

const problems = [];

const slugs = [
  ...reportsSource.matchAll(/slug:\s*'([^']+)'/g),
].map(match => match[1]);

if (slugs.length !== 4) {
  problems.push('Expected 4 current Featured Reports; found ' + slugs.length + '.');
}

const classifications = audit.classifications ?? [];
if (classifications.length !== slugs.length) {
  problems.push(
    'Every current report must have exactly one audit classification.'
  );
}

const allowed = new Set(['keep', 'rewrite', 'merge', 'retire']);

for (const item of classifications) {
  if (!slugs.includes(item.slug)) {
    problems.push('Audit classification targets unknown report slug: ' + item.slug);
  }
  if (!allowed.has(item.classification)) {
    problems.push(
      'Invalid audit classification for ' +
        item.slug +
        ': ' +
        item.classification
    );
  }
}

for (const slug of slugs) {
  const matches = classifications.filter(item => item.slug === slug);
  if (matches.length !== 1) {
    problems.push(
      'Report slug must have exactly one editorial disposition: ' + slug
    );
  }
}

const summary = audit.dispositionSummary ?? {};
const counted = {
  keep: classifications.filter(item => item.classification === 'keep').length,
  rewrite: classifications.filter(item => item.classification === 'rewrite').length,
  merge: classifications.filter(item => item.classification === 'merge').length,
  retire: classifications.filter(item => item.classification === 'retire').length,
};

for (const key of Object.keys(counted)) {
  if (summary[key] !== counted[key]) {
    problems.push(
      'Disposition summary mismatch for ' +
        key +
        ': expected ' +
        counted[key] +
        ', audit says ' +
        summary[key]
    );
  }
}

const mergeItems = classifications.filter(
  item => item.classification === 'merge'
);
if (
  mergeItems.length !== 2 ||
  !mergeItems.every(item => item.mergeGroup === '2025-fiscal-profile')
) {
  problems.push(
    'The two 2025 fiscal reports must remain one explicit merge group in W4-4a.'
  );
}

for (const marker of [
  'oneReportOneSynthesis',
  'qualityOverReportCount',
  'articleNotSnippet',
  'factAndAnalysisMustBeDistinguishable',
  'remove-or-demote-in-W4-4f',
  'address-in-W4-4b',
  'preserve-and-strengthen',
  'enforce-in-W4-4g',
]) {
  if (!JSON.stringify(audit).includes(marker)) {
    problems.push('Featured-report audit marker missing: ' + marker);
  }
}

if (
  audit.nextStep !==
  'W4-4b: define report schema v2 only. Do not rewrite or merge report content until W4-4c.'
) {
  problems.push('W4-4a must stop before report rewriting or migration.');
}

if (problems.length) {
  console.error(
    'Featured Reports audit check failed:\n- ' + problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'Featured Reports audit check passed: all 4 current reports are classified, with 2 rewrites and 2 reports merged into one fiscal-profile storyline; no content migration occurs in W4-4a.'
);
