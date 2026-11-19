import { readFile } from 'node:fs/promises';

const files = [
  'src/data/yamlLoader.ts',
  'src/pages/VisitMakati.tsx',
  'src/pages/History.tsx',
  'src/data/visitMakati.ts',
  'src/data/searchIndex.ts',
];
const combined = (await Promise.all(files.map(file => readFile(file, 'utf8')))).join('\n');

const problems = [];
if (/San Pedro Makati/i.test(combined)) {
  problems.push('Use the historically sourced form "San Pedro Macati", not "San Pedro Makati".');
}
for (const forbidden of ['agriculture-fisheries', 'get-veterinary-services-for-livestock']) {
  if (combined.includes(forbidden)) {
    problems.push('Dormant generic starter content is still wired into the public loader: ' + forbidden);
  }
}

// BM-C051: keep the RPT discount cutoff distinct from the installment due date.
const rptGuide = await readFile('content/services/housing-land-use/real-property-tax-payment.md', 'utf8');
if (/fourth-quarter deadline is October 20, 2026/i.test(rptGuide)) {
  problems.push('RPT guide conflates the October 20 discount cutoff with the installment date.');
}
for (const required of [
  '5% fourth-quarter prompt-payment discount',
  'Section 2A.10',
  'December 31',
  'Confirm the current 2026 installment date',
  'Sa madaling sabi:',
  'Correction (October 27, 2026)',
]) {
  if (!rptGuide.includes(required)) problems.push('RPT date correction missing: ' + required);
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('Content guardrails passed.');
