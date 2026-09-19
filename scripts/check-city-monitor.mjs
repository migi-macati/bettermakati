import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const config = JSON.parse(
  await readFile('data/city-monitor-sources.json', 'utf8')
);

let previous = { version: 1, sources: [] };
try {
  previous = JSON.parse(
    await readFile('data/city-monitor-source-state.json', 'utf8')
  );
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

let history = { version: 1, runs: [] };
try {
  history = JSON.parse(
    await readFile('data/city-monitor-source-history.json', 'utf8')
  );
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const previousById = new Map(
  previous.sources.map(source => [source.id, source])
);
const timeoutMs = 20000;

const normalizeText = text =>
  text
    .replace(/\s+/g, ' ')
    .replace(/\b\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM)?\b/gi, '')
    .trim();

const check = async source => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(source.url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': 'BetterMakati-city-monitor/1.0' },
    });
    const raw = await response.text();
    const normalized = normalizeText(raw);
    const sha256 = createHash('sha256').update(normalized).digest('hex');
    const old = previousById.get(source.id);
    const baseline = old?.lastSuccessfulHash || old?.sha256 || '';

    return {
      ...source,
      status: response.ok ? 'ok' : 'http-error',
      statusCode: response.status,
      contentType: response.headers.get('content-type') || '',
      contentLength: raw.length,
      sha256,
      lastSuccessfulHash: response.ok ? sha256 : baseline,
      change:
        !response.ok
          ? 'check-failed'
          : !baseline
            ? 'new-baseline'
            : baseline === sha256
              ? 'unchanged'
              : 'content-changed',
    };
  } catch (error) {
    const old = previousById.get(source.id);
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
    `${result.change.padEnd(15)} ${result.status.padEnd(12)} ${result.label}`
  );
}

const checkedAt = new Date().toISOString();
const run = {
  checkedAt,
  changed: results
    .filter(item => item.change === 'content-changed')
    .map(({ id, label, url, stream }) => ({ id, label, url, stream })),
  failed: results
    .filter(item => item.status !== 'ok')
    .map(({ id, label, url, stream, status, statusCode }) => ({
      id,
      label,
      url,
      stream,
      status,
      statusCode,
    })),
  newBaselines: results
    .filter(item => item.change === 'new-baseline')
    .map(({ id, label, url, stream }) => ({ id, label, url, stream })),
};

history.runs = [
  run,
  ...(Array.isArray(history.runs) ? history.runs : []),
].slice(0, 120);

await writeFile(
  'data/city-monitor-source-state.json',
  JSON.stringify({ version: 1, checkedAt, sources: results }, null, 2) + '\n'
);
await writeFile(
  'data/city-monitor-source-history.json',
  JSON.stringify(history, null, 2) + '\n'
);

const actionable =
  run.changed.length > 0 || run.failed.length > 0;

const report = [
  '# BetterMakati City Monitor daily source check',
  '',
  `Checked: ${checkedAt}`,
  '',
  actionable
    ? 'One or more official source channels changed or could not be checked. These are review candidates, not automatically interpreted civic events.'
    : 'No established source-channel changes were detected.',
  '',
  '## Changed sources',
  '',
  ...(run.changed.length
    ? run.changed.map(item => `- **${item.label}** — ${item.url}`)
    : ['- None']),
  '',
  '## Failed checks',
  '',
  ...(run.failed.length
    ? run.failed.map(
        item =>
          `- **${item.label}** — ${item.status} (${item.statusCode ?? 'no response'}): ${item.url}`
      )
    : ['- None']),
  '',
  '## New baselines',
  '',
  ...(run.newBaselines.length
    ? run.newBaselines.map(item => `- **${item.label}** — ${item.url}`)
    : ['- None']),
  '',
  '### Editorial rule',
  '',
  'A changed source hash is only a detection signal. Before publishing a City Monitor record, verify the underlying official record, identify the correct event type and date, and preserve the source. Do not infer that an ordinance advanced, a contract was awarded, or a speech occurred from a hash change alone.',
  '',
].join('\n');

await writeFile('data/city-monitor-report.md', report);
