import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const args = new Map(
  process.argv.slice(2).map(item => {
    const [key, value = ''] = item.replace(/^--/, '').split('=');
    return [key, value];
  })
);

const cadence = args.get('cadence') || 'all';
if (!['daily', 'weekly', 'monthly', 'due', 'all'].includes(cadence)) {
  throw new Error('cadence must be daily, weekly, monthly, due or all');
}

const manilaNow = new Date();
const manilaParts = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Manila',
  weekday: 'short',
  day: '2-digit',
}).formatToParts(manilaNow);
const manilaWeekday =
  manilaParts.find(part => part.type === 'weekday')?.value || '';
const manilaDay = manilaParts.find(part => part.type === 'day')?.value || '';
const cadenceIsDue = sourceCadence =>
  sourceCadence === 'daily' ||
  (sourceCadence === 'weekly' && manilaWeekday === 'Mon') ||
  (sourceCadence === 'monthly' && manilaDay === '01');

const watchlist = JSON.parse(
  await readFile('data/source-watchlist.json', 'utf8')
);
const timeoutMs = 20000;
const concurrency = 6;
const statePath = 'data/source-watch-state.json';

let previous = { version: 2, checkedAt: null, cadence: null, sources: [] };
try {
  previous = JSON.parse(await readFile(statePath, 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const previousById = new Map(
  (Array.isArray(previous.sources) ? previous.sources : []).map(source => [
    source.id,
    source,
  ])
);

const blankState = source => ({
  ...source,
  status: 'not-checked',
  statusCode: null,
  contentType: '',
  contentLength: 0,
  sha256: '',
  lastSuccessfulHash: '',
  change: 'not-checked',
  lastCheckedAt: null,
  lastSuccessfulAt: null,
  lastChangedAt: null,
});

const fetchSource = async source => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const checkedAt = new Date().toISOString();
  const old = previousById.get(source.id) || blankState(source);

  try {
    const response = await fetch(source.url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'user-agent': 'BetterMakati-source-check/2.0' },
    });

    const contentType = response.headers.get('content-type') || '';
    const headerLength = Number(response.headers.get('content-length') || 0);
    let contentLength = Number.isFinite(headerLength) ? headerLength : 0;
    let sha256 = '';
    let change = response.ok ? 'reachable' : 'check-failed';
    let lastSuccessfulHash = old.lastSuccessfulHash || old.sha256 || '';
    let lastChangedAt = old.lastChangedAt || null;

    if (response.ok && source.monitoringMode === 'content-hash') {
      const body = await response.arrayBuffer();
      contentLength = body.byteLength;
      sha256 = createHash('sha256').update(Buffer.from(body)).digest('hex');
      const baseline = old.lastSuccessfulHash || old.sha256 || '';
      change = !baseline
        ? 'new-baseline'
        : baseline === sha256
          ? 'unchanged'
          : 'content-changed';
      lastSuccessfulHash = sha256;
      if (change === 'content-changed') lastChangedAt = checkedAt;
    } else {
      try {
        await response.body?.cancel();
      } catch {
        // The status code is sufficient for reachability monitoring.
      }
    }

    return {
      ...source,
      status: response.ok ? 'ok' : 'http-error',
      statusCode: response.status,
      contentType,
      contentLength,
      sha256,
      lastSuccessfulHash,
      change,
      lastCheckedAt: checkedAt,
      lastSuccessfulAt: response.ok ? checkedAt : old.lastSuccessfulAt || null,
      lastChangedAt,
    };
  } catch (error) {
    return {
      ...source,
      status: 'unreachable',
      statusCode: null,
      contentType: '',
      contentLength: 0,
      sha256: '',
      lastSuccessfulHash: old.lastSuccessfulHash || old.sha256 || '',
      change: 'check-failed',
      lastCheckedAt: checkedAt,
      lastSuccessfulAt: old.lastSuccessfulAt || null,
      lastChangedAt: old.lastChangedAt || null,
      error: error instanceof Error ? error.name : 'UnknownError',
    };
  } finally {
    clearTimeout(timeout);
  }
};

const selected = watchlist.filter(source => {
  if (source.owner && source.owner !== 'general-source-freshness') return false;
  if (cadence === 'all') return true;
  if (cadence === 'due') return cadenceIsDue(source.cadence);
  return source.cadence === cadence;
});

const checked = [];
for (let index = 0; index < selected.length; index += concurrency) {
  const batch = selected.slice(index, index + concurrency);
  const batchResults = await Promise.all(batch.map(fetchSource));
  checked.push(...batchResults);
  for (const result of batchResults) {
    console.log(
      `${result.status.padEnd(12)} ${String(result.monitoringMode).padEnd(14)} ${result.label}`
    );
  }
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

const publishRequired = checked.some(semanticStateChanged);

const checkedById = new Map(checked.map(source => [source.id, source]));
const sources = watchlist.map(source => {
  const current = checkedById.get(source.id);
  if (current) return current;
  const old = previousById.get(source.id);
  return old ? { ...source, ...old, ...source } : blankState(source);
});

const runAt = new Date().toISOString();
const summary = {
  checked: checked.length,
  ok: checked.filter(result => result.status === 'ok').length,
  failed: checked.filter(result => result.status !== 'ok').length,
  changed: checked.filter(result => result.change === 'content-changed').length,
  newBaselines: checked.filter(result => result.change === 'new-baseline').length,
  reachabilityOnly: checked.filter(
    result => result.monitoringMode === 'reachability' && result.status === 'ok'
  ).length,
};

await writeFile(
  statePath,
  JSON.stringify(
    {
      version: 2,
      checkedAt: runAt,
      cadence,
      summary,
      publishRequired,
      sources,
    },
    null,
    2
  ) + '\n'
);

let history = { version: 2, runs: [] };
try {
  history = JSON.parse(await readFile('data/source-watch-history.json', 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const mapItem = result => ({
  id: result.id,
  label: result.label,
  url: result.url,
  kind: result.kind,
  cadence: result.cadence,
  monitoringMode: result.monitoringMode,
});

const historyRun = {
  checkedAt: runAt,
  cadence,
  summary,
  changed: checked
    .filter(result => result.change === 'content-changed')
    .map(mapItem),
  failed: checked
    .filter(result => result.status !== 'ok')
    .map(result => ({
      ...mapItem(result),
      status: result.status,
      statusCode: result.statusCode,
    })),
  newBaselines: checked
    .filter(result => result.change === 'new-baseline')
    .map(mapItem),
};

history.runs = [
  historyRun,
  ...(Array.isArray(history.runs) ? history.runs : []),
].slice(0, 400);

await writeFile(
  'data/source-watch-history.json',
  JSON.stringify({ version: 2, runs: history.runs }, null, 2) + '\n'
);

const changed = historyRun.changed;
const failed = historyRun.failed;
const baselines = historyRun.newBaselines;

const report = [
  '# BetterMakati source freshness check',
  '',
  `Checked: ${runAt}`,
  `Cadence: ${cadence}`,
  `Sources checked: ${summary.checked} of ${watchlist.length}`,
  `Successful checks: ${summary.ok}`,
  `Failed checks: ${summary.failed}`,
  `Stable-document content changes requiring review: ${summary.changed}`,
  `New stable-document baselines: ${summary.newBaselines}`,
  `Reachability-only successes: ${summary.reachabilityOnly}`,
  '',
  '## Review queue',
  '',
  ...(changed.length
    ? changed.map(
        item =>
          `- **Content changed:** ${item.label} — review the stable source document before changing any BetterMakati claim: ${item.url}`
      )
    : ['- No stable-document content change was detected in this run.']),
  ...(failed.length
    ? failed.map(
        item =>
          `- **Check failed:** ${item.label} — ${item.status} (${item.statusCode ?? 'no response'}): ${item.url}`
      )
    : ['- No source check failed in this run.']),
  ...(baselines.length
    ? baselines.map(
        item =>
          `- **New baseline:** ${item.label} — future stable-document checks can now detect byte-level changes: ${item.url}`
      )
    : []),
  '',
  'Dynamic portals use reachability monitoring unless explicitly classified otherwise. A reachable page does not prove that its content is unchanged, and a changed stable-document hash does not by itself establish what changed or whether any BetterMakati claim should be updated.',
  '',
].join('\n');

await writeFile('data/source-watch-report.md', report);

console.log(
  `Source freshness run complete: ${summary.checked} checked, ${summary.ok} successful, ${summary.failed} failed, ${summary.changed} stable-document changes; publish required: ${publishRequired}.`
);
