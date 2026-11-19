#!/usr/bin/env node
/**
 * BM-C054: conservative BetterGov FY2027 Makati title-search coverage audit.
 * Run: node scripts/audit-bettergov-makati-budget.mjs
 * This is discovery, not a certified city project ledger. Requires public API access.
 */
import { validateProjectPages } from './bettergov-budget-validation.mjs';
const BASE = 'https://budget.bettergov.ph/api/v1/hgab/2027';
const PROGRAMS = ['dpwh', 'fmr', 'hfep', 'nia'];
const LIMIT = 200;
const MAX = 4000;
const TIMEOUT_MS = 15000;
const results = [];
let failed = false;
async function read(path, params = {}) {
  const url = new URL(BASE + path);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, String(value));
  const response = await fetch(url, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!response.ok) throw new Error(`HTTP ${response.status} at ${url.pathname}`);
  const body = await response.json();
  if (!body || typeof body !== 'object' || !('data' in body)) throw new Error('Unexpected API envelope');
  return body;
}
for (const program of PROGRAMS) {
  try {
    const first = await read(`/datasets/${program}/projects`, { q: 'Makati', limit: LIMIT, offset: 0 });
    const total = first.data?.total;
    if (!Number.isSafeInteger(total) || total < 0 || !Array.isArray(first.data.rows)) throw new Error('Unexpected project-list schema');
    const pages = [first];
    if (total > MAX) throw new Error(`Truncated result: ${total} exceeds audit cap ${MAX}`);
    for (let offset = LIMIT; offset < total; offset += LIMIT) {
      const page = await read(`/datasets/${program}/projects`, { q: 'Makati', limit: LIMIT, offset });
      if (!Array.isArray(page.data?.rows)) throw new Error('Unexpected paginated rows');
      pages.push(page);
    }
    const validated = validateProjectPages(pages);
    results.push({ program, query: 'Makati', scope: 'title-match only; not verified Makati location', ...validated });
  } catch (error) {
    failed = true;
    results.push({ program, error: String(error.message || error), completeness: 'UNVERIFIED' });
  }
}
const output = { packet: 'BM-C054', checked_at: new Date().toISOString(), method: 'paginated place-name discovery; excludes office-ledger verification', results, complete_title_queries: !failed, city_coverage_verified: false, warning: 'Do not sum these into a Makati total. Shared DPWH office allocations, namesakes, unlocated lines and source PDF checks remain unresolved.' };
console.log(JSON.stringify(output, null, 2));
if (failed) process.exitCode = 1;

