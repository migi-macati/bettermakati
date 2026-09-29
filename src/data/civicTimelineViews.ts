import {
  manilaDateKey,
  type CivicTimelineActionability,
  type CivicTimelineItem,
  type CivicTimelineKind,
} from './civicTimeline';

export type CivicCalendarView = 'now-next' | 'published' | 'archive';

export type CivicCalendarTopic =
  | 'all'
  | 'legislation'
  | 'meetings'
  | 'projects-procurement'
  | 'elections'
  | 'publications-data'
  | 'services'
  | 'advisories';

export const civicCalendarRecentPublicationDays = 45;

export const civicCalendarViewOptions: Array<{
  id: CivicCalendarView;
  label: string;
  description: string;
}> = [
  {
    id: 'now-next',
    label: 'Now & Next',
    description: 'Current and future civic dates that have a canonical owner.',
  },
  {
    id: 'published',
    label: 'Recently Published',
    description: 'Source-backed civic information published during the last 45 days.',
  },
  {
    id: 'archive',
    label: 'Archive',
    description: 'Past civic milestones retained for traceability and research.',
  },
];

export const civicCalendarTopicOptions: Array<{
  id: CivicCalendarTopic;
  label: string;
}> = [
  { id: 'all', label: 'All topics' },
  { id: 'legislation', label: 'Legislation' },
  { id: 'meetings', label: 'Meetings & participation' },
  { id: 'projects-procurement', label: 'Projects & procurement' },
  { id: 'elections', label: 'Elections' },
  { id: 'publications-data', label: 'Reports, records & data' },
  { id: 'services', label: 'Services & deadlines' },
  { id: 'advisories', label: 'Advisories & mobility' },
];

export const civicCalendarActionabilityOptions: Array<{
  id: 'all' | CivicTimelineActionability;
  label: string;
}> = [
  { id: 'all', label: 'All action states' },
  { id: 'action-required', label: 'Action required' },
  { id: 'participation-opportunity', label: 'Participation opportunity' },
  { id: 'service-impact', label: 'Service impact' },
  { id: 'service-available', label: 'Service available' },
  { id: 'information-only', label: 'Information only' },
];

export const civicTimelinePrimaryValue = (item: CivicTimelineItem) => {
  switch (item.temporal.semantic) {
    case 'occurrence':
      return item.temporal.startsAt;
    case 'deadline':
      return item.temporal.dueAt;
    case 'effective-change':
      return item.temporal.effectiveAt;
    case 'publication-release':
      return item.temporal.publishedAt;
    case 'target-milestone':
      return item.temporal.targetAt;
  }
};

export const civicTimelineEndValue = (item: CivicTimelineItem) =>
  'endsAt' in item.temporal ? item.temporal.endsAt : undefined;

const dateKey = (value: string) => value.slice(0, 10);

const dateKeyDistance = (from: string, to: string) =>
  Math.floor(
    (Date.parse(to + 'T00:00:00Z') - Date.parse(from + 'T00:00:00Z')) /
      86_400_000
  );

const isCurrentOrFuture = (item: CivicTimelineItem, now: Date) => {
  const primary = civicTimelinePrimaryValue(item);
  const end = civicTimelineEndValue(item);
  const isDateTime = item.temporal.precision.startsWith('datetime');

  if (isDateTime) {
    const endMs = end ? Date.parse(end) : Date.parse(primary);
    return endMs >= now.getTime();
  }

  return dateKey(end ?? primary) >= manilaDateKey(now);
};

export const civicCalendarViewForItem = (
  item: CivicTimelineItem,
  now = new Date()
): CivicCalendarView => {
  if (item.status === 'superseded') return 'archive';

  const primaryDay = dateKey(civicTimelinePrimaryValue(item));
  const today = manilaDateKey(now);

  if (
    item.temporal.semantic === 'publication-release' &&
    primaryDay <= today &&
    dateKeyDistance(primaryDay, today) <= civicCalendarRecentPublicationDays
  ) {
    return 'published';
  }

  return isCurrentOrFuture(item, now) ? 'now-next' : 'archive';
};

export const civicCalendarTopicForKind = (
  kind: CivicTimelineKind
): Exclude<CivicCalendarTopic, 'all'> => {
  if (kind === 'legislation-milestone') return 'legislation';
  if (['meeting', 'public-hearing', 'barangay-assembly', 'consultation'].includes(kind)) {
    return 'meetings';
  }
  if (kind === 'procurement-milestone' || kind === 'project-milestone') {
    return 'projects-procurement';
  }
  if (kind === 'election-milestone') return 'elections';
  if (
    ['publication', 'statistics-release', 'report-release', 'audit-release', 'record-update'].includes(
      kind
    )
  ) {
    return 'publications-data';
  }
  if (
    kind === 'deadline' ||
    kind === 'service-change' ||
    kind === 'service-availability'
  ) {
    return 'services';
  }
  return 'advisories';
};

export const civicCalendarMatchesBarangay = (
  item: CivicTimelineItem,
  barangaySlug: string
) => {
  if (!barangaySlug) return true;
  if (item.geography.scope === 'citywide') return true;
  return item.geography.barangaySlugs?.includes(barangaySlug) ?? false;
};

export const civicCalendarMatchesQuery = (
  item: CivicTimelineItem,
  query: string
) => {
  const normalized = query.trim().toLocaleLowerCase('en-PH');
  if (!normalized) return true;

  return [
    item.title,
    item.summary,
    item.canonicalLabel,
    item.kind,
    item.temporal.semantic,
    item.actionability,
    ...item.tags,
    ...item.sourceRefs.flatMap(source => [source.label, source.publisher]),
  ]
    .join(' ')
    .toLocaleLowerCase('en-PH')
    .includes(normalized);
};

export const civicCalendarMatchesDateRange = (
  item: CivicTimelineItem,
  from: string,
  to: string
) => {
  if (!from && !to) return true;
  const start = dateKey(civicTimelinePrimaryValue(item));
  const end = dateKey(civicTimelineEndValue(item) ?? start);
  if (from && end < from) return false;
  if (to && start > to) return false;
  return true;
};

export const civicCalendarViewItems = (
  items: readonly CivicTimelineItem[],
  view: CivicCalendarView,
  now = new Date()
) =>
  items
    .filter(item => civicCalendarViewForItem(item, now) === view)
    .sort((left, right) => {
      const direction = view === 'now-next' ? 1 : -1;
      const byDate =
        civicTimelinePrimaryValue(left).localeCompare(
          civicTimelinePrimaryValue(right)
        ) * direction;
      return byDate || left.title.localeCompare(right.title, 'en-PH');
    });

export const civicCalendarViewCounts = (
  items: readonly CivicTimelineItem[],
  now = new Date()
) =>
  civicCalendarViewOptions.reduce(
    (counts, option) => {
      counts[option.id] = items.filter(
        item => civicCalendarViewForItem(item, now) === option.id
      ).length;
      return counts;
    },
    { 'now-next': 0, published: 0, archive: 0 } as Record<
      CivicCalendarView,
      number
    >
  );
