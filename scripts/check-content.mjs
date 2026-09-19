import { readFile } from 'node:fs/promises';

const files = [
  'src/data/yamlLoader.ts',
  'src/pages/VisitMakati.tsx',
  'src/pages/History.tsx',
  'src/data/visitMakati.ts',
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

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('Content guardrails passed.');
