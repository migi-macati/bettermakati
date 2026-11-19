import assert from 'node:assert/strict';
import { validateProjectPages } from './bettergov-budget-validation.mjs';
const row = { id: 'a', nep_php: null, hgab2_php: 25, hgab3_php: 25, lat: null, lon: null };
const page = { meta: { source_commit: 'abc', built_at: 'date', dataset_key: 'dpwh', currency: 'PHP', scale: 'pesos', fiscal_year: 2027 }, data: { total: 1, rows: [row], sums: { nep_php: null, hgab2_php: 25, hgab3_php: 25 } } };
const result = validateProjectPages([page]);
assert.equal(result.sums.nep_php.sum_php, null);
assert.equal(result.sums.nep_php.missing_rows, 1);
assert.equal(result.coordinates.missing, 1);
function changed(fn) { const p = structuredClone(page); fn(p); return p; }
assert.throws(() => validateProjectPages([changed(p => p.data.total = 2)]), /pagination/);
assert.throws(() => validateProjectPages([changed(p => { p.data.total = 2; p.data.rows.push(row); })]), /duplicate/);
assert.throws(() => validateProjectPages([changed(p => p.data.sums.hgab3_php = 26)]), /Unreconciled/);
assert.throws(() => validateProjectPages([changed(p => p.data.rows[0].hgab3_php = '25')]), /Invalid/);
assert.throws(() => validateProjectPages([page, changed(p => p.meta.source_commit = 'other')]), /changed source_commit/);
assert.throws(() => validateProjectPages([changed(p => p.meta.scale = 'millions')]), /units/);
assert.equal(validateProjectPages([changed(p => p.data.rows[0].lat = 14.5)]).coordinates.invalid, 1);
assert.equal(validateProjectPages([changed(p => Object.assign(p.data.rows[0], { lat: 14.5, lon: 121 }))]).coordinates.valid, 1);
assert.equal(validateProjectPages([changed(p => Object.assign(p.data.rows[0], { lat: 0, lon: 0 }))]).coordinates.invalid, 1);
console.log('10 budget validation assertions passed');
