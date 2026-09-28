import {
  eventRegistry,
  type EventLifecycleStatus,
  type EventRegistryRecord,
} from './eventRegistry';

export type EventEffectiveStatus = EventLifecycleStatus;

export interface EventDuplicateSignals {
  titleMatch: boolean;
  dateOverlap: boolean;
  placeMatch: boolean;
  areaMatch: boolean;
  venueLabelMatch: boolean;
  locationMatch: boolean;
  isCandidate: boolean;
}

export interface EventFeedRecord {
  event: EventRegistryRecord;
  effectiveStatus: EventEffectiveStatus;
}

const eventDatePart = (value: string) => value.slice(0, 10);

export const manilaDateKey = (now: Date) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);

  const values = Object.fromEntries(
    parts
      .filter(part => part.type !== 'literal')
      .map(part => [part.type, part.value])
  );

  return values.year + '-' + values.month + '-' + values.day;
};

const compareDateOnlyWindow = (
  event: EventRegistryRecord,
  now: Date
): EventEffectiveStatus => {
  const today = manilaDateKey(now);
  const start = eventDatePart(event.startsAt);
  const end = eventDatePart(event.endsAt ?? event.startsAt);

  if (today < start) return 'scheduled';
  if (today <= end) return 'ongoing';
  return 'ended';
};

const compareExactWindow = (
  event: EventRegistryRecord,
  now: Date
): EventEffectiveStatus => {
  const current = now.getTime();
  const start = Date.parse(event.startsAt);

  if (current < start) return 'scheduled';

  if (event.endsAt) {
    return current <= Date.parse(event.endsAt) ? 'ongoing' : 'ended';
  }

  // With no sourced end time, avoid inventing a duration. The event remains
  // current until its exact start, then leaves the default feed.
  return current === start ? 'ongoing' : 'ended';
};

export const effectiveEventStatus = (
  event: EventRegistryRecord,
  now = new Date()
): EventEffectiveStatus => {
  if (event.status === 'ended') return 'ended';

  const dateDrivenStatus =
    event.datePrecision === 'exact-datetime'
      ? compareExactWindow(event, now)
      : compareDateOnlyWindow(event, now);

  if (dateDrivenStatus === 'ended') return 'ended';

  if (event.status === 'cancelled' || event.status === 'postponed') {
    return event.status;
  }

  return dateDrivenStatus;
};

export const isCurrentEvent = (
  event: EventRegistryRecord,
  now = new Date()
) => effectiveEventStatus(event, now) !== 'ended';

const currentRank: Record<EventEffectiveStatus, number> = {
  ongoing: 0,
  postponed: 1,
  cancelled: 2,
  scheduled: 3,
  ended: 4,
};

const startSortValue = (event: EventRegistryRecord) =>
  event.datePrecision === 'exact-datetime'
    ? Date.parse(event.startsAt)
    : Date.parse(eventDatePart(event.startsAt) + 'T00:00:00+08:00');

export const currentEventFeed = (
  events: readonly EventRegistryRecord[] = eventRegistry,
  now = new Date()
): EventFeedRecord[] =>
  events
    .map(event => ({
      event,
      effectiveStatus: effectiveEventStatus(event, now),
    }))
    .filter(item => item.effectiveStatus !== 'ended')
    .sort((a, b) => {
      const rankDifference =
        currentRank[a.effectiveStatus] - currentRank[b.effectiveStatus];
      if (rankDifference !== 0) return rankDifference;

      const startDifference =
        startSortValue(a.event) - startSortValue(b.event);
      if (startDifference !== 0) return startDifference;

      return a.event.title.localeCompare(b.event.title, 'en-PH');
    });

export const archivedEventFeed = (
  events: readonly EventRegistryRecord[] = eventRegistry,
  now = new Date()
): EventFeedRecord[] =>
  events
    .map(event => ({
      event,
      effectiveStatus: effectiveEventStatus(event, now),
    }))
    .filter(item => item.effectiveStatus === 'ended')
    .sort((a, b) => {
      const startDifference =
        startSortValue(b.event) - startSortValue(a.event);
      if (startDifference !== 0) return startDifference;

      return a.event.title.localeCompare(b.event.title, 'en-PH');
    });

export const normalizeEventIdentityText = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('en-PH')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

const titleKeys = (event: EventRegistryRecord) =>
  new Set(
    [event.title, ...(event.aliases ?? [])]
      .map(normalizeEventIdentityText)
      .filter(Boolean)
  );

const setsIntersect = (left: Set<string>, right: Set<string>) =>
  [...left].some(value => right.has(value));

const eventDateWindow = (event: EventRegistryRecord) => ({
  start: eventDatePart(event.startsAt),
  end: eventDatePart(event.endsAt ?? event.startsAt),
});

const dateWindowsOverlap = (
  left: EventRegistryRecord,
  right: EventRegistryRecord
) => {
  const a = eventDateWindow(left);
  const b = eventDateWindow(right);
  return a.start <= b.end && b.start <= a.end;
};

const normalizedVenueLabel = (event: EventRegistryRecord) =>
  event.venue.venueLabel
    ? normalizeEventIdentityText(event.venue.venueLabel)
    : '';

export const eventDuplicateSignals = (
  left: EventRegistryRecord,
  right: EventRegistryRecord
): EventDuplicateSignals => {
  if (left.id === right.id) {
    return {
      titleMatch: true,
      dateOverlap: true,
      placeMatch: true,
      areaMatch: true,
      venueLabelMatch: true,
      locationMatch: true,
      isCandidate: false,
    };
  }

  const titleMatch = setsIntersect(titleKeys(left), titleKeys(right));
  const dateOverlap = dateWindowsOverlap(left, right);
  const placeMatch =
    Boolean(left.venue.placeId) &&
    left.venue.placeId === right.venue.placeId;
  const areaMatch = left.venue.areaIds.some(areaId =>
    right.venue.areaIds.includes(areaId)
  );

  const leftVenue = normalizedVenueLabel(left);
  const rightVenue = normalizedVenueLabel(right);
  const venueLabelMatch =
    Boolean(leftVenue) && Boolean(rightVenue) && leftVenue === rightVenue;

  const locationMatch = placeMatch || areaMatch || venueLabelMatch;

  return {
    titleMatch,
    dateOverlap,
    placeMatch,
    areaMatch,
    venueLabelMatch,
    locationMatch,
    isCandidate: titleMatch && dateOverlap && locationMatch,
  };
};

export interface EventDuplicateCandidate {
  leftId: string;
  rightId: string;
  signals: EventDuplicateSignals;
}

export const findEventDuplicateCandidates = (
  events: readonly EventRegistryRecord[] = eventRegistry
): EventDuplicateCandidate[] => {
  const candidates: EventDuplicateCandidate[] = [];

  for (let leftIndex = 0; leftIndex < events.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < events.length;
      rightIndex += 1
    ) {
      const left = events[leftIndex];
      const right = events[rightIndex];
      const signals = eventDuplicateSignals(left, right);

      if (signals.isCandidate) {
        candidates.push({
          leftId: left.id,
          rightId: right.id,
          signals,
        });
      }
    }
  }

  return candidates;
};
