import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const watchlist = JSON.parse(
  await readFile('data/source-watchlist.json', 'utf8')
);
const timeoutMs = 20000;
let previous = { sources: [] };
try {
  previous = JSON.parse(await readFile('data/source-watch.json', 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const previousByUrl = new Map(
  previous.sources.map(source => [source.url, source])
);

const fetchSource = async source => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(source.url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'user-agent': 'BetterMakati-source-check/1.0' },
    });
    const body = await response.arrayBuffer();
    const hash = createHash('sha256').update(Buffer.from(body)).digest('hex');
    return {
      ...source,
      status: response.ok ? 'ok' : 'http-error',
      statusCode: response.status,
      contentType: response.headers.get('content-type') || '',
      contentLength: body.byteLength,
      sha256: hash,
    };
  } catch (error) {
    return {
      ...source,
      status: 'unreachable',
      statusCode: null,
      contentType: '',
      contentLength: 0,
      sha256: '',
      error: error instanceof Error ? error.name : 'UnknownError',
    };
  } finally {
    clearTimeout(timeout);
  }
};

const results = [];
for (const source of watchlist) {
  const result = await fetchSource(source);
  const old = previousByUrl.get(source.url);
  const baseline = old?.lastSuccessfulHash || old?.sha256;
  result.change =
    result.status !== 'ok'
      ? 'check-failed'
      : !baseline
        ? 'new-baseline'
        : baseline === result.sha256
          ? 'unchanged'
          : 'content-changed';
  result.lastSuccessfulHash =
    result.status === 'ok' ? result.sha256 : baseline || '';
  results.push(result);
  console.log(`${result.status.padEnd(12)} ${source.label}`);
}

await writeFile(
  'data/source-watch.json',
  `${JSON.stringify({ version: 1, sources: results }, null, 2)}\n`
);

const changed = results.filter(
  result => result.status !== 'ok' || result.change === 'content-changed'
);
let history = { version: 1, runs: [] };
try {
  history = JSON.parse(await readFile('data/source-watch-history.json', 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const checkedAt = new Date().toISOString();
const historyRun = {
  checkedAt,
  changed: results
    .filter(result => result.change === 'content-changed')
    .map(result => ({
      id: result.id,
      label: result.label,
      url: result.url,
      kind: result.kind,
    })),
  failed: results
    .filter(result => result.status !== 'ok')
    .map(result => ({
      id: result.id,
      label: result.label,
      url: result.url,
      kind: result.kind,
      status: result.status,
      statusCode: result.statusCode,
    })),
  newBaselines: results
    .filter(result => result.change === 'new-baseline')
    .map(result => ({
      id: result.id,
      label: result.label,
      url: result.url,
      kind: result.kind,
    })),
};

history.runs = [historyRun, ...(Array.isArray(history.runs) ? history.runs : [])].slice(0, 52);
await writeFile(
  'data/source-watch-history.json',
  `${JSON.stringify(history, null, 2)}\n`
);

const report = [
  '# Weekly BetterMakati source check',
  '',
  `Checked: ${checkedAt}`,
  '',
  changed.length
    ? 'Source content changed or a check failed. Review the results below before updating site claims:'
    : 'No changes to established baselines were detected. New sources establish a baseline on their first successful check.',
  '',
  ...results.map(
    result =>
      `- **${result.label}** — ${result.change}; ${result.status} (${result.statusCode ?? 'no response'}): ${result.url}`
  ),
  '',
  'A changed hash means the source changed; it does not by itself prove that the extracted figures should be replaced. Review the source and update the corresponding site data deliberately.',
  '',
].join('\n');
await writeFile('data/source-watch-report.md', report);
