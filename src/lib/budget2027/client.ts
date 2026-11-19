/** BetterGov public API adapter. Proposals and appropriations are not spending. */
export const PROGRAMS = ['dpwh', 'fmr', 'hfep', 'nia'] as const;
export type Program = typeof PROGRAMS[number];
type ObjectValue = Record<string, unknown>;
export interface Project {
  id: string; dataset: Program; title: string; office: string | null;
  nep_php: number | null; hgab2_php: number | null; hgab3_php: number | null;
  house_php: number | null; lat: number | null; lon: number | null;
  pdf_url: Record<string, string | null>; held: boolean; bridge_group: string;
}
export interface ProjectResult {
  rows: Project[]; total: number; meta: ObjectValue; disclaimers: ObjectValue[];
  sourceUrl: string; retrievedAt: string; scope: 'title-query'; query: string;
  coordinates: { valid: number; missing: number; invalid: number };
}
export interface NationalResult {
  national: { amount: number; base_amount: number };
  departments: { id: string; description: string; amount: number; base_amount: number }[];
  meta: ObjectValue; sourceUrl: string; retrievedAt: string;
  comparison: 'NEP-2027-versus-GAA-2026';
}
const BASE = 'https://budget.bettergov.ph/api/v1/';
const object = (x: unknown): ObjectValue => {
  if (!x || typeof x !== 'object' || Array.isArray(x)) throw new Error('Invalid API object');
  return x as ObjectValue;
};
const string = (x: unknown): string => {
  if (typeof x !== 'string' || !x.trim()) throw new Error('Missing text');
  return x;
};
const amount = (x: unknown): number => {
  if (typeof x !== 'number' || !Number.isSafeInteger(x) || x < 0) throw new Error('Invalid peso amount');
  return x;
};
const nullableAmount = (x: unknown) => x === null ? null : amount(x);
const nullableCoordinate = (x: unknown) => {
  if (x === null) return null;
  if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error('Invalid coordinate');
  return x;
};
function units(meta: ObjectValue) {
  if (meta.currency !== 'PHP' || meta.scale !== 'pesos' || meta.fiscal_year !== 2027) throw new Error('Unexpected units/year');
}
function coordinateState(row: Project): 'valid' | 'missing' | 'invalid' {
  if (row.lat === null && row.lon === null) return 'missing';
  if (row.lat !== null && row.lon !== null && Math.abs(row.lat) <= 90 && Math.abs(row.lon) <= 180 && (row.lat !== 0 || row.lon !== 0)) return 'valid';
  return 'invalid';
}
function project(value: unknown, dataset: Program): Project {
  const r = object(value);
  if (r.dataset !== dataset || typeof r.held !== 'boolean') throw new Error('Unexpected project schema');
  const pdf_url: Project['pdf_url'] = {};
  for (const [key, value] of Object.entries(object(r.pdf_url))) {
    if (value === null) pdf_url[key] = null;
    else {
      const url = new URL(string(value));
      if (url.protocol !== 'https:' || url.hostname !== 'budget-assets.bettergov.ph') throw new Error('Unexpected PDF host');
      pdf_url[key] = url.href;
    }
  }
  return { ...r, id: string(r.id), dataset, title: string(r.title), office: r.office === null ? null : string(r.office),
    nep_php: nullableAmount(r.nep_php), hgab2_php: nullableAmount(r.hgab2_php), hgab3_php: nullableAmount(r.hgab3_php),
    house_php: nullableAmount(r.house_php), lat: nullableCoordinate(r.lat), lon: nullableCoordinate(r.lon),
    pdf_url, held: r.held, bridge_group: string(r.bridge_group) };
}
export interface ClientOptions { fetcher?: typeof fetch; signal?: AbortSignal; timeoutMs?: number }
async function read(url: URL, options: ClientOptions): Promise<ObjectValue> {
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (options.signal?.aborted) abort();
  options.signal?.addEventListener('abort', abort, { once: true });
  const timer = setTimeout(abort, options.timeoutMs ?? 15000);
  try {
    const response = await (options.fetcher ?? fetch)(url, { signal: controller.signal, headers: { accept: 'application/json' } });
    if (!response.ok) throw new Error(`Budget API HTTP ${response.status}`);
    return object(await response.json());
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener('abort', abort);
  }
}
export async function loadProjects(dataset: Program, query: string, options: ClientOptions = {}): Promise<ProjectResult> {
  if (!PROGRAMS.includes(dataset) || !query.trim()) throw new Error('Invalid query');
  const url = new URL(`hgab/2027/datasets/${dataset}/projects`, BASE);
  url.searchParams.set('q', query.trim()); url.searchParams.set('limit', '200');
  const sourceUrl = url.href;
  let first: ObjectValue | undefined, total: number | undefined, offset = 0;
  const rows: Project[] = [];
  while (true) {
    url.searchParams.set('offset', String(offset));
    const page = await read(url, options), meta = object(page.meta), data = object(page.data);
    units(meta);
    if (meta.dataset_key !== dataset) throw new Error('Wrong dataset');
    string(meta.source_commit); string(meta.built_at);
    if (!Array.isArray(page.disclaimers)) throw new Error('Missing disclaimers');
    page.disclaimers.forEach(d => { const x = object(d); string(x.title); string(x.body); });
    if (!first) { first = page; total = amount(data.total); if (total > 4000) throw new Error('Query exceeds supported coverage'); }
    const initialMeta = object(first.meta);
    if (data.total !== total || ['source_commit', 'built_at', 'house_stage'].some(key => meta[key] !== initialMeta[key])) throw new Error('Source changed during pagination');
    if (!Array.isArray(data.rows)) throw new Error('Missing project rows');
    rows.push(...data.rows.map(r => project(r, dataset)));
    if (rows.length > total!) throw new Error('Too many rows');
    if (rows.length === total) break;
    if (data.rows.length !== 200) throw new Error('Incomplete page');
    offset += 200;
  }
  if (new Set(rows.map(r => r.id)).size !== rows.length) throw new Error('Duplicate project IDs');
  const sums = object(object(first!.data).sums);
  for (const key of ['nep_php', 'hgab2_php', 'hgab3_php'] as const) {
    const values = rows.map(r => r[key]).filter((n): n is number => n !== null);
    const sum = values.reduce((a, b) => a + b, 0);
    if (!Number.isSafeInteger(sum) || (sums[key] !== sum && !(values.length === 0 && sums[key] === null))) throw new Error(`Unreconciled ${key}`);
  }
  const coordinates = { valid: 0, missing: 0, invalid: 0 };
  rows.forEach(row => coordinates[coordinateState(row)]++);
  return { rows, total: rows.length, meta: object(first!.meta), disclaimers: (first!.disclaimers as unknown[]).map(object), sourceUrl,
    retrievedAt: new Date().toISOString(), scope: 'title-query', query: query.trim(), coordinates };
}
export async function loadNationalOverview(options: ClientOptions = {}): Promise<NationalResult> {
  const url = new URL('nep/2027', BASE), response = await read(url, options);
  const meta = object(response.meta), data = object(response.data), n = object(data.national);
  units(meta);
  if (meta.dataset !== 'nep' || meta.baseline_year !== 2026) throw new Error('Unexpected national comparison');
  const national = { amount: amount(n.amount), base_amount: amount(n.base_amount) };
  if (!Array.isArray(data.departments)) throw new Error('Missing departments');
  const departments = data.departments.map(value => { const d = object(value); return { id: string(d.id), description: string(d.description), amount: amount(d.amount), base_amount: amount(d.base_amount) }; });
  if (new Set(departments.map(d => d.id)).size !== departments.length) throw new Error('Duplicate departments');
  for (const key of ['amount', 'base_amount'] as const) {
    const sum = departments.reduce((a, d) => a + d[key], 0);
    if (!Number.isSafeInteger(sum) || sum !== national[key]) throw new Error('National totals do not reconcile');
  }
  return { national, departments, meta, sourceUrl: url.href, retrievedAt: new Date().toISOString(), comparison: 'NEP-2027-versus-GAA-2026' };
}
export async function loadCityProjects(query: string, options: ClientOptions = {}) {
  const programs = await Promise.all(PROGRAMS.map(async dataset => {
    try { return { dataset, status: 'available' as const, result: await loadProjects(dataset, query, options) }; }
    catch (error) {
      if (options.signal?.aborted) throw error;
      return { dataset, status: 'unavailable' as const, error: error instanceof Error ? error.message : 'Budget data unavailable' };
    }
  }));
  return { programs, completeQueries: programs.every(p => p.status === 'available'), cityCoverageVerified: false as const };
}
