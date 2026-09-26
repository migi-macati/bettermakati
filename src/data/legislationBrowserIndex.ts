import type { LocalMeasureType } from './localLegislation';

export const legislationBrowserIndexUrl = '/data/makati-legislation-index.json';

export type BrowserLegislationRecord = [
  archiveLegislationId: string,
  measureType: LocalMeasureType,
  officialNumber: string,
  seriesYear: number | null,
  title: string,
  officialDocumentUrl: string | null,
];

export interface BrowserLegislationIndex {
  schemaVersion: number;
  generatedAt: string;
  sourceDate: string;
  archiveUrl: string | null;
  total: number;
  countByType: Partial<Record<LocalMeasureType, number>>;
  years: number[];
  records: BrowserLegislationRecord[];
}

let browserIndexPromise: Promise<BrowserLegislationIndex> | null = null;

export const legislationRecordId = (record: BrowserLegislationRecord) => {
  const [, measureType, officialNumber] = record;
  const slug = officialNumber
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return measureType + '-' + slug;
};

export const legislationRecordDisplay = (record: BrowserLegislationRecord) => {
  const [, measureType, officialNumber] = record;
  return (
    'City ' +
    (measureType === 'ordinance' ? 'Ordinance' : 'Resolution') +
    ' No. ' +
    officialNumber
  );
};

export const legislationRecordHref = (record: BrowserLegislationRecord) =>
  '/legislation?record=' + encodeURIComponent(legislationRecordId(record));

export const loadLegislationBrowserIndex = () => {
  if (!browserIndexPromise) {
    browserIndexPromise = fetch(legislationBrowserIndexUrl).then(response => {
      if (!response.ok) {
        throw new Error('Unable to load legislation index.');
      }
      return response.json() as Promise<BrowserLegislationIndex>;
    });
  }
  return browserIndexPromise;
};

export const matchLegislationRecords = (
  index: BrowserLegislationIndex,
  query: string,
  options: {
    measureType?: 'all' | LocalMeasureType;
    year?: 'all' | string;
    limit?: number;
  } = {}
) => {
  const needle = query.trim().toLowerCase();
  const measureType = options.measureType ?? 'all';
  const year = options.year ?? 'all';
  const limit = options.limit ?? 12;
  const matches: BrowserLegislationRecord[] = [];

  for (const record of index.records) {
    if (measureType !== 'all' && record[1] !== measureType) continue;
    if (year !== 'all' && String(record[3] ?? '') !== year) continue;

    if (
      needle &&
      ![legislationRecordDisplay(record), record[2], record[4]]
        .join(' ')
        .toLowerCase()
        .includes(needle)
    ) {
      continue;
    }

    matches.push(record);
  }

  matches.sort(
    (a, b) =>
      (b[3] ?? 0) - (a[3] ?? 0) ||
      b[2].localeCompare(a[2], undefined, { numeric: true })
  );

  return {
    total: matches.length,
    visible: matches.slice(0, limit),
  };
};
