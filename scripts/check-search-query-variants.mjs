// Local lexical search expansion regression. Run: node scripts/check-search-query-variants.mjs
// This tests the query helper, not ranked results or conversational understanding.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const ts = createRequire(import.meta.url)('typescript');
const source = readFileSync('src/data/searchQueryVariants.ts', 'utf8');
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { queryVariants } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'));

const cases = [
  ['Where can I get a cedula?', 'community tax certificate'],
  ['Paano kumuha ng amilyar sa Makati?', 'real property tax makati'],
  ['Basura not collected', 'garbage'],
  ['Baha sa Poblacion', 'flooding'],
  ['Walang kuryente', 'electricity'],
  ['How to apply for barangay clearance', 'barangay clearance'],
  ['brgy Poblacion', 'barangay poblacion'],
  ['Paano kumuha ng birthcert', 'birth certificate'],
  ['Where is the Makati City Hall?', 'makati city hall'],
  ['My sahod is delayed', 'wages'],
  ['Where can I commute', 'mobility'],
  ['Kailangan ko ng lisensya', 'license'],
  ['Poblacion', 'poblacion'],
];
let failures = 0;
for (const [utterance, expected] of cases) {
  const variants = queryVariants(utterance);
  const first = utterance.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  if (variants[0] !== first || !variants.some(v => v.includes(expected)) || variants.length > 24) {
    failures++;
    console.error(JSON.stringify({ utterance, expected, variants }));
  }
}
// Do not create a spurious parking or flooding token from unrelated words.
for (const [utterance, excluded] of [['A sparking wire', 'parking'], ['Nasa bahay ako', 'baha']]) {
  const variants = queryVariants(utterance);
  if (variants.some(v => v.split(/\s+/).includes(excluded))) {
    failures++;
    console.error(JSON.stringify({ utterance, excluded, variants }));
  }
}
const unknown = queryVariants('quasar glimmer');
if (unknown.length !== 1 || unknown[0] !== 'quasar glimmer') {
  failures++;
  console.error(JSON.stringify({ unknown }));
}
console.log((16 - failures) + '/16 lexical query cases passed; ' + failures + ' failures');
if (failures) process.exitCode = 1;
