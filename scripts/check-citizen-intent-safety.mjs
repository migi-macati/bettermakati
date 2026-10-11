// Synthetic resident-intent regression gate. Run: node scripts/check-citizen-intent-safety.mjs
// Uses local TypeScript dependency only; no network, user data, or AI provider.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const ts = createRequire(import.meta.url)('typescript');
const source = readFileSync('src/data/citizenProblemGuides.ts', 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { findCitizenGuides, isImmediateDanger } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'));
// [utterance, expected guide or null, immediate danger, tier]; 'later' tracks known paraphrase gaps.
const cases = [
  ['A parked car is blocking our driveway','obstructive-parking',false],
  ['May nakapark sa bangketa','obstructive-parking',false],
  ['No parking sign ignored on our street','obstructive-parking',false],
  ['Parking permit requirements',null,false],
  ['I need to renew my parking permit',null,false],
  ['A downed live wire is sparking',null,true],
  ['Sparking wire outside the school',null,true],
  ['My child is being abused right now',null,true],
  ['A child was abused years ago',null,false],
  ['Baha sa kalye namin','flooding',false],
  ['Binabaha ang kalsada','flooding',false],
  ['Nasa bahay ako',null,false],
  ['May sunog sa bahay',null,true],
  ['The house is on fire',null,true],
  ['Clogged drain in front of our house','flooding',false],
  ['There is floodwater on the road','flooding',false],
  ['Karaoke all night','neighborhood-noise',false],
  ['My neighbor is singing loudly','neighborhood-noise',false],
  ['My neighbor is blasting music at 2am','neighborhood-noise',false,'later'],
  ['Basura has not been collected','garbage',false],
  ['Streetlight is flickering','streetlight',false],
  ['Walang kuryente sa Poblacion','brownout',false],
  ['Hindi pa binibigay sahod ko','unpaid-wages',false,'later'],
  ['I already reported it. What next?',null,false],
  ['How to apply for a cedula?',null,false],
];
let passed = 0, mustFail = 0, laterFail = 0;
for (const [text, guide, danger, tier] of cases) {
  const found = findCitizenGuides(text).map(g => g.id);
  const actualDanger = isImmediateDanger(text);
  const ok = (guide ? found.includes(guide) : found.length === 0) && actualDanger === danger;
  if (ok) { passed++; continue; }
  if (tier === 'later') laterFail++; else mustFail++;
  console.error(JSON.stringify({ text, expectedGuide: guide, expectedDanger: danger, actualGuides: found, actualDanger, tier: tier || 'must-pass' }));
}
console.log(passed + '/' + cases.length + ' passed; ' + mustFail + ' must-pass failures; ' + laterFail + ' known follow-up gaps');
if (mustFail) process.exitCode = 1;
