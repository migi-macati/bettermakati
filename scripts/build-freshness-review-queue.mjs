import { readFile, writeFile } from 'node:fs/promises';

const readJson = async (path, fallback) => {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return fallback;
    throw error;
  }
};

const sourceState = await readJson('data/source-watch-state.json', { sources: [] });
const sourceHistory = await readJson('data/source-watch-history.json', { runs: [] });
const cityState = await readJson('data/city-monitor-source-state.json', { sources: [] });
const cityHistory = await readJson('data/city-monitor-source-history.json', { runs: [] });
const cityConfig = await readJson('data/city-monitor-sources.json', { sources: [] });
const existing = await readJson('data/freshness-review-queue.json', {
  version: 1,
  generatedAt: null,
  items: [],
});

const sourceStateById = new Map((sourceState.sources || []).map(item => [item.id, item]));
const cityStateById = new Map((cityState.sources || []).map(item => [item.id, item]));
const existingByKey = new Map((existing.items || []).map(item => [item.key, item]));

const latestTimestamp = (...values) =>
  values.filter(Boolean).sort().at(-1) || null;

const actionFor = signal => {
  if (signal === 'content-changed') {
    return 'Compare the changed source with each affected page, verify the underlying fact, then update only claims the source actually changes.';
  }
  if (signal === 'check-failed') {
    return 'Recheck source availability. If the failure persists, inspect affected pages for links or claims that may no longer be supportable.';
  }
  return 'Open the source manually and review new official content relevant to the affected pages before publishing a civic record.';
};

const labelFor = signal =>
  signal === 'content-changed'
    ? 'Content changed'
    : signal === 'check-failed'
      ? 'Check failed'
      : 'Manual review';

const buildHistorySignals = (system, runs, field, signal, stateById) => {
  const bySource = new Map();
  for (const run of runs || []) {
    for (const item of run[field] || []) {
      const existingSignal = bySource.get(item.id);
      if (!existingSignal) {
        bySource.set(item.id, {
          system,
          signal,
          item,
          firstDetectedAt: run.checkedAt,
          latestDetectedAt: run.checkedAt,
          detections: 1,
          state: stateById.get(item.id),
        });
      } else {
        existingSignal.firstDetectedAt = latestTimestamp(
          existingSignal.firstDetectedAt,
          run.checkedAt
        ) === existingSignal.firstDetectedAt
          ? run.checkedAt
          : existingSignal.firstDetectedAt;
        existingSignal.latestDetectedAt = latestTimestamp(
          existingSignal.latestDetectedAt,
          run.checkedAt
        );
        existingSignal.detections += 1;
      }
    }
  }
  return [...bySource.values()];
};

const candidates = [
  ...buildHistorySignals(
    'general-source-freshness',
    sourceHistory.runs,
    'changed',
    'content-changed',
    sourceStateById
  ),
  ...buildHistorySignals(
    'city-monitor',
    cityHistory.runs,
    'changed',
    'content-changed',
    cityStateById
  ),
];

const latestFailureAt = (runs, id) => {
  for (const run of runs || []) {
    if ((run.failed || []).some(item => item.id === id)) return run.checkedAt;
  }
  return null;
};

for (const state of sourceState.sources || []) {
  if (state.owner === 'city-monitor') continue;
  if (state.status !== 'http-error' && state.status !== 'unreachable') continue;
  candidates.push({
    system: 'general-source-freshness',
    signal: 'check-failed',
    item: state,
    firstDetectedAt: latestFailureAt(sourceHistory.runs, state.id) || state.lastCheckedAt || sourceState.checkedAt,
    latestDetectedAt: state.lastCheckedAt || sourceState.checkedAt,
    detections: 1,
    state,
  });
}

for (const state of cityState.sources || []) {
  if (state.status !== 'http-error' && state.status !== 'unreachable') continue;
  candidates.push({
    system: 'city-monitor',
    signal: 'check-failed',
    item: state,
    firstDetectedAt: latestFailureAt(cityHistory.runs, state.id) || state.lastCheckedAt || cityState.checkedAt,
    latestDetectedAt: state.lastCheckedAt || cityState.checkedAt,
    detections: 1,
    state,
  });
}

for (const source of cityConfig.sources || []) {
  if (source.monitoringMode !== 'manual-review') continue;
  const state = cityStateById.get(source.id);
  candidates.push({
    system: 'city-monitor',
    signal: 'manual-review',
    item: source,
    firstDetectedAt: cityState.checkedAt,
    latestDetectedAt: cityState.checkedAt,
    detections: 1,
    state,
  });
}

const openItems = [];
for (const candidate of candidates) {
  const key = candidate.system + ':' + candidate.item.id + ':' + candidate.signal;
  const previous = existingByKey.get(key);
  const detectedAt = candidate.latestDetectedAt || candidate.firstDetectedAt || null;

  if (
    previous?.status === 'resolved' &&
    previous.resolvedAt &&
    detectedAt &&
    previous.resolvedAt >= detectedAt
  ) {
    continue;
  }

  const state = candidate.state || {};
  const affectedPages =
    Array.isArray(candidate.item.affectedPages) && candidate.item.affectedPages.length
      ? candidate.item.affectedPages
      : Array.isArray(state.affectedPages)
        ? state.affectedPages
        : [];

  openItems.push({
    key,
    status: 'open',
    system: candidate.system,
    signal: candidate.signal,
    signalLabel: labelFor(candidate.signal),
    sourceId: candidate.item.id,
    label: candidate.item.label,
    url: candidate.item.url,
    affectedPages,
    firstDetectedAt: previous?.status === 'open'
      ? previous.firstDetectedAt || candidate.firstDetectedAt
      : candidate.firstDetectedAt,
    latestDetectedAt: detectedAt,
    detections: Math.max(candidate.detections || 1, previous?.status === 'open' ? previous.detections || 1 : 1),
    lastCheckedAt:
      state.lastCheckedAt ||
      (candidate.system === 'city-monitor' ? cityState.checkedAt : sourceState.checkedAt) ||
      null,
    lastSuccessfulAt:
      state.lastSuccessfulAt ||
      (state.status === 'ok'
        ? (candidate.system === 'city-monitor' ? cityState.checkedAt : sourceState.checkedAt)
        : null),
    action: actionFor(candidate.signal),
  });
}

const openKeys = new Set(openItems.map(item => item.key));
const resolvedItems = (existing.items || [])
  .filter(item => item.status === 'resolved' && !openKeys.has(item.key))
  .slice(0, 100);

const items = [...openItems, ...resolvedItems].sort((a, b) => {
  if (a.status !== b.status) return a.status === 'open' ? -1 : 1;
  return String(b.latestDetectedAt || '').localeCompare(String(a.latestDetectedAt || ''));
});

const generatedAt = latestTimestamp(
  sourceState.checkedAt,
  cityState.checkedAt,
  ...(sourceHistory.runs || []).map(run => run.checkedAt),
  ...(cityHistory.runs || []).map(run => run.checkedAt)
);

const open = items.filter(item => item.status === 'open');
const summary = {
  open: open.length,
  contentChanged: open.filter(item => item.signal === 'content-changed').length,
  failed: open.filter(item => item.signal === 'check-failed').length,
  manualReview: open.filter(item => item.signal === 'manual-review').length,
  affectedPages: [...new Set(open.flatMap(item => item.affectedPages))].sort().length,
};

const output = {
  version: 1,
  generatedAt,
  summary,
  items,
};

await writeFile(
  'data/freshness-review-queue.json',
  JSON.stringify(output, null, 2) + '\n'
);

const lines = [
  '# BetterMakati freshness review queue',
  '',
  generatedAt ? 'Published source state: ' + generatedAt : 'Published source state: not yet available',
  'Open items: ' + summary.open,
  '',
  ...(open.length
    ? open.flatMap(item => [
        '## ' + item.label + ' — ' + item.signalLabel,
        '',
        '- Source: ' + item.url,
        '- Affected pages: ' + (item.affectedPages.join(', ') || 'none mapped'),
        '- Last successful check: ' + (item.lastSuccessfulAt || 'none recorded'),
        '- Last checked: ' + (item.lastCheckedAt || 'none recorded'),
        '- Action: ' + item.action,
        '',
      ])
    : ['No open freshness review items.', '']),
];

await writeFile('data/freshness-review-queue.md', lines.join('\n'));

console.log(
  'Freshness review queue built: ' +
    summary.open +
    ' open items across ' +
    summary.affectedPages +
    ' affected pages.'
);
