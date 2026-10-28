import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const js = ts.transpileModule(readFileSync('src/data/todayRelevance.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext },
}).outputText;
const { startsWithinTodayWindow, latestSubstantiveBrief } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'));
const now = new Date('2026-10-16T09:00:00Z');
assert.equal(startsWithinTodayWindow('2026-11-15', now), true);
assert.equal(startsWithinTodayWindow('2026-11-16', now), false);
assert.equal(startsWithinTodayWindow('2028-11-13', now), false);
assert.equal(startsWithinTodayWindow('2026-10-01', now), true); // ongoing items are prefiltered by Calendar
assert.equal(startsWithinTodayWindow('invalid', now), false);
assert.equal(startsWithinTodayWindow('2026-11-16', new Date('2026-10-16T16:01:00Z')), true);
const old = { id: 'old', publishedAt: '2026-09-25T12:00:00Z', periodEnd: '2026-09-24', recordIds: ['record'] };
const empty = { ...old, id: 'empty', publishedAt: '2026-10-02T12:00:00Z', recordIds: [] };
const recent = { ...old, id: 'recent', publishedAt: '2026-10-01T12:00:00Z' };
const briefs = [empty, old, recent];
assert.equal(latestSubstantiveBrief(briefs, now).id, 'recent');
assert.deepEqual(briefs.map(b => b.id), ['empty', 'old', 'recent']);
assert.equal(latestSubstantiveBrief([empty], now), null);
assert.equal(latestSubstantiveBrief([{ ...old, publishedAt: 'invalid' }], now), null);
assert.equal(latestSubstantiveBrief([{ ...old, publishedAt: '2027-01-01' }], now), null);
console.log('BM-ORD-003: 11 relevance cases passed');
