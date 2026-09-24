import type { CityMonitorRecord, CityMonitorType } from './cityMonitor';

export type CivicBriefCadence = 'daily' | 'weekly' | 'monthly';

export interface CivicBriefReviewSignal {
  id: string;
  label: string;
  url: string;
  stream: string;
  checkedAt: string;
}

export interface CivicBriefArchiveEntry {
  id: string;
  cadence: CivicBriefCadence;
  title: string;
  periodStart: string;
  periodEnd: string;
  publishedAt: string;
  recordIds: string[];
  reviewSignals: CivicBriefReviewSignal[];
  failedChecks: CivicBriefReviewSignal[];
}

export interface CivicBriefSection {
  id: 'official' | 'projects' | 'participation';
  label: string;
  types: CityMonitorType[];
  description: string;
}

export const civicBriefsReviewed = '24 September 2026';

export const civicBriefCadence = {
  daily: {
    label: 'Daily Civic Brief',
    shortLabel: 'Daily',
    targetItems: 'Up to 10 validated items',
    description:
      'A short daily scan of newly validated City Monitor activity plus source-change signals still awaiting review.',
  },
  weekly: {
    label: 'The Makati Brief',
    shortLabel: 'Weekly',
    targetItems: 'Weekly civic digest',
    description:
      'A weekly digest of official activity, projects and procurement, participation opportunities, accountability-linked records and source-review signals.',
  },
  monthly: {
    label: 'State of Makati',
    shortLabel: 'Monthly',
    targetItems: 'Monthly civic summary',
    description:
      'A monthly analytical summary of validated City Monitor activity, including stream counts, procurement value, barangay relevance and source-review workload.',
  },
} satisfies Record<
  CivicBriefCadence,
  {
    label: string;
    shortLabel: string;
    targetItems: string;
    description: string;
  }
>;

export const civicBriefSections: CivicBriefSection[] = [
  {
    id: 'official',
    label: 'Official activity',
    types: [
      'council-session',
      'legislation',
      'executive-speech',
      'publication',
      'official-notice',
    ],
    description:
      'Council, legislation, executive statements, official publications and notices.',
  },
  {
    id: 'projects',
    label: 'Projects & procurement',
    types: ['procurement', 'project'],
    description:
      'Procurement stages and project evidence that have been validated as permanent City Monitor records.',
  },
  {
    id: 'participation',
    label: 'Participation opportunities',
    types: ['consultation'],
    description:
      'Validated consultations, hearings and participation opportunities.',
  },
];

const manilaDateParts = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const value = (type: string) =>
    parts.find(part => part.type === type)?.value ?? '';
  return {
    year: Number(value('year')),
    month: Number(value('month')),
    day: Number(value('day')),
  };
};

const dateKeyFromUtcDate = (date: Date) =>
  [
    String(date.getUTCFullYear()).padStart(4, '0'),
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    String(date.getUTCDate()).padStart(2, '0'),
  ].join('-');

const keyToUtcDate = (key: string) => {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

const shiftDateKey = (key: string, days: number) => {
  const date = keyToUtcDate(key);
  date.setUTCDate(date.getUTCDate() + days);
  return dateKeyFromUtcDate(date);
};

export const currentManilaDateKey = (date = new Date()) => {
  const { year, month, day } = manilaDateParts(date);
  return [
    String(year).padStart(4, '0'),
    String(month).padStart(2, '0'),
    String(day).padStart(2, '0'),
  ].join('-');
};

export const rollingBriefPeriod = (
  cadence: CivicBriefCadence,
  date = new Date()
) => {
  const end = currentManilaDateKey(date);
  if (cadence === 'daily') return { start: end, end };
  if (cadence === 'weekly') return { start: shiftDateKey(end, -6), end };

  const { year, month } = manilaDateParts(date);
  return {
    start:
      String(year).padStart(4, '0') +
      '-' +
      String(month).padStart(2, '0') +
      '-01',
    end,
  };
};

export const briefPeriodLabel = (start: string, end: string) => {
  const format = (key: string, withYear: boolean) =>
    new Intl.DateTimeFormat('en-PH', {
      timeZone: 'UTC',
      month: 'short',
      day: 'numeric',
      ...(withYear ? { year: 'numeric' as const } : {}),
    }).format(keyToUtcDate(key));

  if (start === end) return format(end, true);
  const sameYear = start.slice(0, 4) === end.slice(0, 4);
  return format(start, !sameYear) + ' – ' + format(end, true);
};

export const recordsForPeriod = (
  records: CityMonitorRecord[],
  start: string,
  end: string,
  barangaySlug = ''
) =>
  records
    .filter(record => record.date >= start && record.date <= end)
    .filter(
      record =>
        !barangaySlug ||
        !record.barangaySlug ||
        record.barangaySlug === barangaySlug
    )
    .sort((a, b) => b.date.localeCompare(a.date));

export const recordsForSection = (
  records: CityMonitorRecord[],
  section: CivicBriefSection
) => records.filter(record => section.types.includes(record.type));

export const accountabilityLinkedRecords = (records: CityMonitorRecord[]) =>
  records.filter(record => record.relatedHref?.startsWith('/accountability'));

export const procurementValue = (records: CityMonitorRecord[]) =>
  records
    .filter(record => record.type === 'procurement' && record.amount !== undefined)
    .reduce((sum, record) => sum + (record.amount ?? 0), 0);

export const civicBriefStreamCounts = (records: CityMonitorRecord[]) =>
  records.reduce<Record<CityMonitorType, number>>(
    (counts, record) => {
      counts[record.type] += 1;
      return counts;
    },
    {
      'council-session': 0,
      legislation: 0,
      'executive-speech': 0,
      procurement: 0,
      project: 0,
      publication: 0,
      consultation: 0,
      'official-notice': 0,
    }
  );

export const briefArchiveHref = (briefId: string) =>
  '/briefs?brief=' + encodeURIComponent(briefId);

export const briefLiveHref = (
  cadence: CivicBriefCadence,
  barangaySlug = ''
) =>
  '/briefs?period=' +
  cadence +
  (barangaySlug ? '&barangay=' + encodeURIComponent(barangaySlug) : '');
