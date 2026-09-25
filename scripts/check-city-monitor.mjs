import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const config = JSON.parse(await readFile('data/city-monitor-sources.json', 'utf8'));

let previous = { version: 2, sources: [] };
try {
  previous = JSON.parse(await readFile('data/city-monitor-source-state.json', 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

let history = { version: 2, runs: [] };
try {
  history = JSON.parse(await readFile('data/city-monitor-source-history.json', 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const previousById = new Map(previous.sources.map(source => [source.id, source]));
const timeoutMs = 20000;

const normalizeText = text =>
  text
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/\b\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM)?\b/gi, ' ')
    .replace(/\b[\d,]+\s+Visitors\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const check = async source => {
  const mode = source.monitoringMode || 'content-hash';
  const old = previousById.get(source.id);

  if (mode === 'manual-review') {
    return {
      ...source,
      status: 'manual-review',
      statusCode: null,
      contentType: '',
      contentLength: 0,
      sha256: old?.sha256 || '',
      lastSuccessfulHash: old?.lastSuccessfulHash || old?.sha256 || '',
      change: 'manual-review',
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(source.url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': 'BetterMakati-city-monitor/2.0' },
    });
    const raw = await response.text();
    const normalized = normalizeText(raw);
    const sha256 = createHash('sha256').update(normalized).digest('hex');
    const baseline = old?.lastSuccessfulHash || old?.sha256 || '';

    let change = 'unchanged';
    if (!response.ok) change = 'check-failed';
    else if (mode === 'reachability') change = baseline ? 'reachable' : 'new-baseline';
    else if (!baseline) change = 'new-baseline';
    else if (baseline !== sha256) change = 'content-changed';

    return {
      ...source,
      status: response.ok ? 'ok' : 'http-error',
      statusCode: response.status,
      contentType: response.headers.get('content-type') || '',
      contentLength: raw.length,
      sha256,
      lastSuccessfulHash: response.ok ? sha256 : baseline,
      change,
    };
  } catch (error) {
    return {
      ...source,
      status: 'unreachable',
      statusCode: null,
      contentType: '',
      contentLength: 0,
      sha256: '',
      lastSuccessfulHash: old?.lastSuccessfulHash || old?.sha256 || '',
      change: 'check-failed',
      error: error instanceof Error ? error.name : 'UnknownError',
    };
  } finally {
    clearTimeout(timeout);
  }
};

const results = [];
for (const source of config.sources) {
  const result = await check(source);
  results.push(result);
  console.log(
    `${result.change.padEnd(16)} ${result.status.padEnd(14)} ${result.label}`
  );
}

const semanticStateChanged = result => {
  const old = previousById.get(result.id);
  if (!old) return true;
  if (old.status !== result.status) return true;
  if ((old.statusCode ?? null) !== (result.statusCode ?? null)) return true;
  if ((old.error || '') !== (result.error || '')) return true;
  if (
    result.monitoringMode === 'content-hash' &&
    (old.lastSuccessfulHash || old.sha256 || '') !==
      (result.lastSuccessfulHash || result.sha256 || '')
  ) {
    return true;
  }
  return false;
};

const publishRequired = results.some(semanticStateChanged);

const checkedAt = new Date().toISOString();
const run = {
  checkedAt,
  checked: results.filter(item => item.status !== 'manual-review').length,
  unchanged: results.filter(item => item.change === 'unchanged' || item.change === 'reachable').length,
  changed: results
    .filter(item => item.change === 'content-changed')
    .map(({ id, label, url, stream, monitoringMode }) => ({ id, label, url, stream, monitoringMode })),
  failed: results
    .filter(item => item.status === 'http-error' || item.status === 'unreachable')
    .map(({ id, label, url, stream, monitoringMode, status, statusCode }) => ({
      id, label, url, stream, monitoringMode, status, statusCode,
    })),
  newBaselines: results
    .filter(item => item.change === 'new-baseline')
    .map(({ id, label, url, stream, monitoringMode }) => ({ id, label, url, stream, monitoringMode })),
  manualReview: results
    .filter(item => item.change === 'manual-review')
    .map(({ id, label, url, stream, monitoringMode }) => ({ id, label, url, stream, monitoringMode })),
};

history.runs = [run, ...(Array.isArray(history.runs) ? history.runs : [])].slice(0, 120);

await writeFile(
  'data/city-monitor-source-state.json',
  JSON.stringify({ version: 2, checkedAt, publishRequired, sources: results }, null, 2) + '\n'
);
await writeFile(
  'data/city-monitor-source-history.json',
  JSON.stringify({ version: 2, runs: history.runs }, null, 2) + '\n'
);

const report = [
  '# BetterMakati City Monitor daily source check',
  '',
  `Checked: ${checkedAt}`,
  '',
  `Automatic checks: ${run.checked}. Unchanged/reachable: ${run.unchanged}. Changed: ${run.changed.length}. Failed: ${run.failed.length}. Manual-review channels: ${run.manualReview.length}.`,
  '',
  '## Changed sources requiring editorial review',
  '',
  ...(run.changed.length ? run.changed.map(item => `- **${item.label}** — ${item.url}`) : ['- None']),
  '',
  '## Failed automatic checks',
  '',
  ...(run.failed.length ? run.failed.map(item => `- **${item.label}** — ${item.status} (${item.statusCode ?? 'no response'}): ${item.url}`) : ['- None']),
  '',
  '## Manual-review channels',
  '',
  ...(run.manualReview.length ? run.manualReview.map(item => `- **${item.label}** — ${item.url}`) : ['- None']),
  '',
  '### Editorial rule',
  '',
  'A changed source hash is only a detection signal. Reachability-only and manual-review channels do not claim content-change detection. Before publishing a City Monitor record, verify the underlying official record, identify the correct event type and date, preserve the source, and link any measurable commitment or follow-through to Accountability.',
  '',
].join('\n');

await writeFile('data/city-monitor-report.md', report);

console.log('City Monitor publish required: ' + publishRequired);
