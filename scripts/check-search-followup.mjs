import assert from 'node:assert/strict';
import { resolveSearchFollowup } from '../src/data/searchFollowup.ts';

const ctx = { issue: 'May illegal parking sa sidewalk', guideId: 'obstructive-parking', step: 0, stepCount: 3 };
const cases = [
  ['I already did that', [], false, 'advance', 1],
  ['Nagawa ko na iyan', [], false, 'advance', 1],
  ['Nasubukan ko na', [], false, 'advance', 1],
  ['Sinubukan ko na', [], false, 'advance', 1],
  ['What next?', [], false, 'advance', 1],
  ['Ano na ang susunod?', [], false, 'advance', 1],
  ['Paano na?', [], false, 'advance', 1],
  ['I already reported it', [], false, 'contacted', 0],
  ['Nagreport na ako', [], false, 'contacted', 0],
  ['Nag-report na ako', [], false, 'contacted', 0],
  ['Nag report na ako', [], false, 'contacted', 0],
  ['Tumawag na ako', [], false, 'contacted', 0],
  ['How much is the fee?', [], false, 'clarify', 0],
  ['Saan ang office?', [], false, 'clarify', 0],
  ['Which ordinance?', [], false, 'clarify', 0],
  ['Yes', [], false, 'clarify', 0],
  ['I have another issue', [], false, 'new-topic', 0],
  ['Ibang concern naman', [], false, 'new-topic', 0],
  ['May problema sa basura', ['garbage'], false, 'new-topic', 0],
  ['May illegal parking pa rin', ['obstructive-parking'], false, 'repeat', 0],
  ['May bago akong tanong sa permit', [], false, 'new-topic', 0],
  ['May threat at may kutsilyo', [], true, 'danger', 0],
  ['I already did that but I am being attacked', [], true, 'danger', 0],
  ['', [], false, 'clarify', 0],
  ['ok', [], false, 'clarify', 0],
  ['a', [], false, 'clarify', 0],
];
let passed = 0;
for (const [utterance, matches, danger, action, step] of cases) {
  const actual = resolveSearchFollowup(utterance, ctx, matches, danger);
  assert.equal(actual.action, action, utterance);
  assert.equal(actual.nextStep, step, utterance);
  passed++;
}
assert.equal(resolveSearchFollowup('I already did that', { ...ctx, step: 2 }, [], false).nextStep, 2);
assert.equal(resolveSearchFollowup('X'.repeat(1000), ctx, [], false).message.length, 500);
console.log(`${passed + 2}/${passed + 2} deterministic routing assertions passed`);
