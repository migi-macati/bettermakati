import assert from 'node:assert/strict';
import { loadProjects, loadNationalOverview, loadCityProjects } from '../src/lib/budget2027/client.ts';

// Deliberately synthetic fixtures; never used as published budget data.
const row = id => ({ id, dataset: 'dpwh', title: 'Test project', office: null, nep_php: null, hgab2_php: 10, hgab3_php: 10, house_php: 10, lat: null, lon: null, pdf_url: {}, held: false, bridge_group: 'house_only' });
const page = (rows, total = rows.length) => ({
  meta: { dataset_key: 'dpwh', fiscal_year: 2027, currency: 'PHP', scale: 'pesos', source_commit: 'test', built_at: 'test', house_stage: 'hgab3' },
  disclaimers: [{ title: 'Test notice', body: 'Synthetic data' }],
  data: { total, rows, sums: { nep_php: null, hgab2_php: total * 10 || null, hgab3_php: total * 10 || null } },
});
const fake = fn => async url => new Response(JSON.stringify(fn(new URL(url))), { status: 200 });
const options = data => ({ fetcher: fake(() => data) });
const r = await loadProjects('dpwh', 'Makati', options(page([row('a')])));
assert.equal(r.rows[0].nep_php, null);
assert.equal(r.coordinates.missing, 1);
assert.equal(r.scope, 'title-query');
const requests = [];
const all = await loadProjects('dpwh', 'Makati', { fetcher: fake(url => {
  const offset = Number(url.searchParams.get('offset')); requests.push(offset);
  return page(Array.from({ length: offset === 0 ? 200 : 1 }, (_, i) => row(String(offset + i))), 201);
}) });
assert.equal(all.total, 201); assert.deepEqual(requests, [0, 200]);
await assert.rejects(loadProjects('dpwh', 'Makati', options(page([row('a')], 201))), /Incomplete/);
await assert.rejects(loadProjects('dpwh', 'Makati', options(page([row('a'), row('a')]))), /Duplicate/);
const wrongSum = page([row('a')]); wrongSum.data.sums.hgab3_php = 11;
await assert.rejects(loadProjects('dpwh', 'Makati', options(wrongSum)), /Unreconciled/);
await assert.rejects(loadProjects('dpwh', 'Makati', { fetcher: fake(url => {
  const offset = Number(url.searchParams.get('offset'));
  const p = page(Array.from({ length: offset ? 1 : 200 }, (_, i) => row(String(offset + i))), 201);
  if (offset) p.meta.source_commit = 'changed'; return p;
}) }), /Source changed/);
await assert.rejects(loadProjects('dpwh', 'Makati', { fetcher: async () => new Response('', { status: 403 }) }), /403/);
const empty = await loadProjects('dpwh', 'Makati', options(page([])));
assert.equal(empty.total, 0);
const partial = await loadCityProjects('Makati', { fetcher: fake(url => {
  if (!url.pathname.includes('/dpwh/')) throw new Error('Access unavailable'); return page([]);
}) });
assert.equal(partial.completeQueries, false);
assert.equal(partial.programs.filter(p => p.status === 'unavailable').length, 3);
assert.equal(partial.cityCoverageVerified, false);
const national = { meta: { dataset: 'nep', fiscal_year: 2027, baseline_year: 2026, currency: 'PHP', scale: 'pesos' }, data: { national: { amount: 100, base_amount: 90 }, departments: [{ id: 'test', description: 'Test department', amount: 100, base_amount: 90 }] } };
assert.equal((await loadNationalOverview(options(national))).comparison, 'NEP-2027-versus-GAA-2026');
national.data.national.amount = 101;
await assert.rejects(loadNationalOverview(options(national)), /reconcile/);
const controller = new AbortController(); controller.abort();
await assert.rejects(loadCityProjects('Makati', { signal: controller.signal, fetcher: async (_url, init) => { init.signal.throwIfAborted(); } }));
console.log('Budget 2027 adapter: pagination, sums, missing data, partial failures, source drift, comparison labels and cancellation passed.');

const { makatiScope } = await import('../src/lib/budget2027/scope.ts');
assert.equal(makatiScope({ title: 'Sitio Kao - Lamakati Road, South Cotabato' }), 'excluded');
assert.equal(makatiScope({ title: 'Drainage in Makati City' }), 'candidate');
assert.equal(makatiScope({ title: 'Makati-Mandaluyong Br.' }), 'shared');
assert.equal(makatiScope({ title: 'Mandaluyong–Makati bridge' }), 'shared');
assert.equal(makatiScope({ title: 'Makati Div. Channel Br.' }), 'candidate');
assert.equal(makatiScope({ title: 'Makatiño test' }), 'excluded');
console.log('Makati title scope: 6 assertions passed');
