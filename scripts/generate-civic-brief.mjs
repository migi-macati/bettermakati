import { readFile, writeFile } from 'node:fs/promises';

const args = new Map(
  process.argv.slice(2).map(item => {
    const [key, value = ''] = item.replace(/^--/, '').split('=');
    return [key, value];
  })
);

const cadence = args.get('cadence') || 'daily';
if (!['daily', 'weekly', 'monthly'].includes(cadence)) {
  throw new Error('cadence must be daily, weekly or monthly');
}

const manilaKey = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const value = type => parts.find(part => part.type === type)?.value || '';
  return value('year') + '-' + value('month') + '-' + value('day');
};

const keyToDate = key => {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

const dateKey = date =>
  [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    String(date.getUTCDate()).padStart(2, '0'),
  ].join('-');

const shift = (key, days) => {
  const date = keyToDate(key);
  date.setUTCDate(date.getUTCDate() + days);
  return dateKey(date);
};

const previousMonth = key => {
  const date = keyToDate(key);
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() - 1);
  const start = dateKey(date);
  date.setUTCMonth(date.getUTCMonth() + 1);
  date.setUTCDate(0);
  return { start, end: dateKey(date) };
};

const suppliedDate = args.get('date');
const runDate = suppliedDate || manilaKey();

let period;
if (cadence === 'daily') {
  const day = suppliedDate ? suppliedDate : shift(runDate, -1);
  period = { start: day, end: day };
} else if (cadence === 'weekly') {
  const end = suppliedDate ? suppliedDate : shift(runDate, -1);
  period = { start: shift(end, -6), end };
} else {
  period = suppliedDate
    ? {
        start: suppliedDate.slice(0, 7) + '-01',
        end: suppliedDate,
      }
    : previousMonth(runDate);
}

const cityMonitor = await readFile('src/data/cityMonitor.ts', 'utf8');
const supplement = await readFile('src/data/accountabilitySupplement.ts', 'utf8');
const history = JSON.parse(
  await readFile('data/city-monitor-source-history.json', 'utf8')
);

const baseBlock =
  cityMonitor.split('const baseCityMonitorRecords')[1]?.split(
    'const procurementMonitorRecords'
  )[0] ?? '';
const baseRecords = [
  ...baseBlock.matchAll(
    /\bid:\s*'([^']+)'[\s\S]*?\bdate:\s*'([^']+)'/g
  ),
].map(match => ({ id: match[1], date: match[2] }));

const procurementBlock =
  supplement.split('const procurementSeeds: ProcurementSeed[] = [')[1]?.split(
    'export const procurementProjectEntries'
  )[0] ?? '';
const procurementRecords = [
  ...procurementBlock.matchAll(
    /\bid:\s*'([^']+)'[\s\S]*?\bbidDate:\s*'([^']+)'/g
  ),
].map(match => ({
  id: 'monitor-procurement-' + match[1],
  date: match[2],
}));

const recordIds = [...baseRecords, ...procurementRecords]
  .filter(record => record.date >= period.start && record.date <= period.end)
  .sort((a, b) => b.date.localeCompare(a.date))
  .map(record => record.id);

const runDateKey = iso => manilaKey(new Date(iso));
const relevantRuns = (Array.isArray(history.runs) ? history.runs : []).filter(
  run => {
    const key = runDateKey(run.checkedAt);
    return key >= period.start && key <= period.end;
  }
);

const flattenSignals = field =>
  relevantRuns.flatMap(run =>
    (Array.isArray(run[field]) ? run[field] : []).map(item => ({
      id: item.id,
      label: item.label,
      url: item.url,
      stream: item.stream,
      checkedAt: run.checkedAt,
    }))
  );

const reviewSignals = flattenSignals('changed');
const failedChecks = flattenSignals('failed');

const title =
  cadence === 'daily'
    ? 'Daily Civic Brief'
    : cadence === 'weekly'
      ? 'The Makati Brief'
      : 'State of Makati';

const id =
  cadence === 'daily'
    ? 'daily-' + period.end
    : cadence === 'weekly'
      ? 'weekly-' + period.start + '--' + period.end
      : 'monthly-' + period.start.slice(0, 7);

const archivePath = 'data/civic-briefs.json';
let archive = { version: 1, briefs: [] };
try {
  archive = JSON.parse(await readFile(archivePath, 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const exists = archive.briefs.some(brief => brief.id === id);
if (exists && args.get('replace') !== 'true') {
  console.log('Civic Brief already exists: ' + id);
  process.exit(0);
}

const entry = {
  id,
  cadence,
  title,
  periodStart: period.start,
  periodEnd: period.end,
  publishedAt: new Date().toISOString(),
  recordIds,
  reviewSignals,
  failedChecks,
};

archive.briefs = [
  entry,
  ...archive.briefs.filter(brief => brief.id !== id),
]
  .sort((a, b) => b.periodEnd.localeCompare(a.periodEnd) || b.publishedAt.localeCompare(a.publishedAt))
  .slice(0, 500);

await writeFile(
  archivePath,
  JSON.stringify({ version: 1, briefs: archive.briefs }, null, 2) + '\n'
);

console.log(
  `Published ${id}: ${recordIds.length} validated records, ${reviewSignals.length} review signals, ${failedChecks.length} failed source checks.`
);
