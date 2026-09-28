import { civicAreaById } from './areaOrganizationRegistry';
import { findBarangay } from './barangays';
import { placeRegistryById } from './placeRegistry';
import { visitorExperiences } from './visitorCuration';

export type EventSourceKind =
  | 'official-government'
  | 'first-party-organizer'
  | 'first-party-venue'
  | 'organizer-linked-ticketing'
  | 'current-secondary';

export type EventCategory =
  | 'civic-community'
  | 'arts-culture'
  | 'market'
  | 'family'
  | 'performance'
  | 'sports'
  | 'learning'
  | 'fair-expo'
  | 'other';

export type EventLifecycleStatus =
  | 'scheduled'
  | 'ongoing'
  | 'postponed'
  | 'cancelled'
  | 'ended';

export type EventDatePrecision =
  | 'exact-datetime'
  | 'date-only'
  | 'date-range';

export type EventAccessKind =
  | 'free'
  | 'ticketed'
  | 'registration-required'
  | 'open-public'
  | 'unknown';

export type EventEvidenceStrength =
  | 'direct'
  | 'corroborated'
  | 'inferred';

export interface EventRegistrySource {
  id: string;
  label: string;
  url: string;
  publisher: string;
  publishedOn?: string;
  checkedOn: string;
  kind: EventSourceKind;
}

export interface EventAssertion {
  fieldPaths: string[];
  sourceIds: string[];
  evidenceStrength: EventEvidenceStrength;
  note?: string;
}

export interface EventVenueContext {
  placeId?: string;
  venueLabel?: string;
  areaIds: string[];
  barangaySlugs: string[];
}

export interface EventRegistryRecord {
  id: string;
  title: string;
  aliases?: string[];
  category: EventCategory;
  summary: string;

  status: EventLifecycleStatus;
  startsAt: string;
  endsAt?: string;
  allDay: boolean;
  datePrecision: EventDatePrecision;
  timezone: 'Asia/Manila';

  venue: EventVenueContext;
  organizerLabel?: string;
  access: EventAccessKind;

  sourceIds: string[];
  primarySourceId: string;
  visitorExperienceIds?: string[];

  provenance: {
    assertions: EventAssertion[];
  };

  tags: string[];
}

export const eventRegistryReviewedOn = '2026-09-28';

export const eventSources: EventRegistrySource[] = [
  {
    id: 'rockwell-lifestyles-done-2026',
    label: 'Rockwell · Lifestyles Done Rockwell 2026',
    url: 'https://e-rockwell.com/brewing-new-experiences-with-rockwell-blends-by-ucc-at-lifestyles-done-rockwell/',
    publisher: 'Rockwell Land Corporation',
    publishedOn: '2026-09-11',
    checkedOn: eventRegistryReviewedOn,
    kind: 'first-party-organizer',
  },
  {
    id: 'century-september-events-2026',
    label: 'Century City Mall · September Just Got Interesting',
    url: 'https://www.centurycitymall.com.ph/september-just-got-interesting/',
    publisher: 'Century City Mall',
    publishedOn: '2026-09-01',
    checkedOn: eventRegistryReviewedOn,
    kind: 'first-party-venue',
  },
  {
    id: 'makati-bike-for-me-2026',
    label: 'City Government of Makati · 11th Makati Bike for M.E.',
    url: 'https://www.makati.gov.ph/content/events/138299',
    publisher: 'City Government of Makati',
    publishedOn: '2026-05-28',
    checkedOn: eventRegistryReviewedOn,
    kind: 'official-government',
  },
];

/**
 * W5-7b pilot registry.
 *
 * The registry intentionally contains one still-current first-party event plus
 * three ended records from strong item-level sources. Ended pilot records are
 * retained to prove source provenance, canonical context, date precision and
 * lifecycle handling before W5-7c introduces current/archive selectors.
 *
 * No event is promoted from a title-only listing or an undated source.
 */
export const eventRegistry: EventRegistryRecord[] = [
  {
    id: 'lifestyles-done-rockwell-2026',
    title: 'Lifestyles Done Rockwell',
    category: 'fair-expo',
    summary:
      'A month-long Rockwell lifestyle showcase at the North Court of Power Plant Mall.',
    status: 'ongoing',
    startsAt: '2026-09-25',
    endsAt: '2026-10-25',
    allDay: true,
    datePrecision: 'date-range',
    timezone: 'Asia/Manila',
    venue: {
      venueLabel: 'North Court, R1 Level, Power Plant Mall',
      areaIds: ['rockwell-center'],
      barangaySlugs: ['poblacion'],
    },
    organizerLabel: 'Rockwell Land Corporation',
    access: 'unknown',
    sourceIds: ['rockwell-lifestyles-done-2026'],
    primarySourceId: 'rockwell-lifestyles-done-2026',
    provenance: {
      assertions: [
        {
          fieldPaths: [
            'title',
            'category',
            'summary',
            'status',
            'startsAt',
            'endsAt',
            'venue.venueLabel',
            'venue.areaIds',
            'venue.barangaySlugs',
            'organizerLabel',
          ],
          sourceIds: ['rockwell-lifestyles-done-2026'],
          evidenceStrength: 'direct',
        },
      ],
    },
    tags: [
      'Rockwell Center',
      'Power Plant Mall',
      'lifestyle',
      'exhibit',
      'pop-up',
    ],
  },
  {
    id: 'card-expo-ph-century-city-2026',
    title: 'Card Expo PH',
    category: 'fair-expo',
    summary:
      'A two-day card expo listed by Century City Mall at its Events Center.',
    status: 'ended',
    startsAt: '2026-09-26',
    endsAt: '2026-09-27',
    allDay: true,
    datePrecision: 'date-range',
    timezone: 'Asia/Manila',
    venue: {
      venueLabel: 'Events Center, Century City Mall',
      areaIds: ['century-city'],
      barangaySlugs: ['poblacion'],
    },
    access: 'unknown',
    sourceIds: ['century-september-events-2026'],
    primarySourceId: 'century-september-events-2026',
    provenance: {
      assertions: [
        {
          fieldPaths: [
            'title',
            'status',
            'startsAt',
            'endsAt',
            'venue.venueLabel',
            'venue.areaIds',
            'venue.barangaySlugs',
          ],
          sourceIds: ['century-september-events-2026'],
          evidenceStrength: 'direct',
        },
        {
          fieldPaths: ['category', 'summary'],
          sourceIds: ['century-september-events-2026'],
          evidenceStrength: 'inferred',
          note:
            'The source names the event and venue/date window but does not publish a formal event taxonomy.',
        },
      ],
    },
    tags: ['Century City', 'cards', 'expo', 'weekend'],
  },
  {
    id: 'comedy-nights-century-city-2026-09-26',
    title: 'Comedy Nights with Redd Ollero and James Caraan',
    category: 'performance',
    summary:
      'A one-night comedy event listed by Century City Mall at Cinema 4.',
    status: 'ended',
    startsAt: '2026-09-26',
    allDay: true,
    datePrecision: 'date-only',
    timezone: 'Asia/Manila',
    venue: {
      venueLabel: 'Level 3, Cinema 4, Century City Mall',
      areaIds: ['century-city'],
      barangaySlugs: ['poblacion'],
    },
    access: 'unknown',
    sourceIds: ['century-september-events-2026'],
    primarySourceId: 'century-september-events-2026',
    provenance: {
      assertions: [
        {
          fieldPaths: [
            'title',
            'status',
            'startsAt',
            'venue.venueLabel',
            'venue.areaIds',
            'venue.barangaySlugs',
          ],
          sourceIds: ['century-september-events-2026'],
          evidenceStrength: 'direct',
        },
        {
          fieldPaths: ['category', 'summary'],
          sourceIds: ['century-september-events-2026'],
          evidenceStrength: 'inferred',
          note:
            'Performance classification is inferred from the source title and named comedians.',
        },
      ],
    },
    tags: ['Century City', 'comedy', 'performance', 'Cinema 4'],
  },
  {
    id: 'makati-bike-for-me-11-2026',
    title: '11th Makati Bike for M.E.',
    aliases: ['11th Makati Bike for Me'],
    category: 'sports',
    summary:
      'A Makati founding-anniversary cycling activity that began at the Makati City Hall Quadrangle.',
    status: 'ended',
    startsAt: '2026-06-06T05:00:00+08:00',
    allDay: false,
    datePrecision: 'exact-datetime',
    timezone: 'Asia/Manila',
    venue: {
      placeId: 'makati-city-hall',
      venueLabel: 'Makati City Hall Quadrangle',
      areaIds: [],
      barangaySlugs: ['poblacion'],
    },
    organizerLabel:
      'Department of Environmental Services Parks and Green Division (District 1)',
    access: 'open-public',
    sourceIds: ['makati-bike-for-me-2026'],
    primarySourceId: 'makati-bike-for-me-2026',
    provenance: {
      assertions: [
        {
          fieldPaths: [
            'title',
            'aliases',
            'category',
            'summary',
            'status',
            'startsAt',
            'venue.placeId',
            'venue.venueLabel',
            'venue.barangaySlugs',
            'organizerLabel',
            'access',
          ],
          sourceIds: ['makati-bike-for-me-2026'],
          evidenceStrength: 'direct',
        },
      ],
    },
    tags: ['cycling', 'Founding Anniversary', 'Makati City Hall', 'public'],
  },
];

const sourceById = new Map(eventSources.map(source => [source.id, source]));
const visitorExperienceIdSet = new Set(
  visitorExperiences.map(experience => experience.id)
);

const validateDateOnly = (value: string, owner: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(owner + ' must use YYYY-MM-DD.');
  }
};

const validateDateLike = (value: string, owner: string) => {
  if (Number.isNaN(Date.parse(value))) {
    throw new Error('Invalid event date/time for ' + owner + ': ' + value);
  }
};

const datePart = (value: string) => value.slice(0, 10);

export const validateEventRegistry = () => {
  const sourceIds = new Set<string>();
  const eventIds = new Set<string>();

  for (const source of eventSources) {
    if (!source.id.trim() || !source.label.trim() || !source.publisher.trim()) {
      throw new Error('Event source identity fields must not be empty.');
    }
    if (sourceIds.has(source.id)) {
      throw new Error('Duplicate event source ID: ' + source.id);
    }
    sourceIds.add(source.id);

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(source.url);
    } catch {
      throw new Error('Invalid event source URL: ' + source.id);
    }
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Unsupported event source protocol: ' + source.id);
    }

    validateDateOnly(source.checkedOn, source.id + '.checkedOn');
    if (source.publishedOn) {
      validateDateOnly(source.publishedOn, source.id + '.publishedOn');
    }
  }

  for (const event of eventRegistry) {
    if (!event.id.trim() || !event.title.trim() || !event.summary.trim()) {
      throw new Error('Event identity fields must not be empty.');
    }
    if (eventIds.has(event.id)) {
      throw new Error('Duplicate event ID: ' + event.id);
    }
    eventIds.add(event.id);

    validateDateLike(event.startsAt, event.id + '.startsAt');
    if (event.endsAt) {
      validateDateLike(event.endsAt, event.id + '.endsAt');
      if (Date.parse(event.endsAt) < Date.parse(event.startsAt)) {
        throw new Error('Event end precedes start: ' + event.id);
      }
    }

    if (
      event.datePrecision === 'date-only' &&
      !/^\d{4}-\d{2}-\d{2}$/.test(event.startsAt)
    ) {
      throw new Error('Date-only event has non-date start: ' + event.id);
    }

    if (
      event.datePrecision === 'date-range' &&
      (
        !event.endsAt ||
        !/^\d{4}-\d{2}-\d{2}$/.test(event.startsAt) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(event.endsAt)
      )
    ) {
      throw new Error('Date-range event requires date-only start/end: ' + event.id);
    }

    if (
      event.datePrecision === 'exact-datetime' &&
      !event.startsAt.includes('T')
    ) {
      throw new Error('Exact event start must include time: ' + event.id);
    }

    if (
      !event.venue.placeId &&
      !event.venue.venueLabel?.trim()
    ) {
      throw new Error('Event requires a canonical Place or sourced venue label: ' + event.id);
    }

    if (
      event.venue.placeId &&
      !placeRegistryById.has(event.venue.placeId)
    ) {
      throw new Error(
        'Unknown event Place reference ' +
          event.venue.placeId +
          ': ' +
          event.id
      );
    }

    for (const areaId of event.venue.areaIds) {
      if (!civicAreaById.has(areaId)) {
        throw new Error(
          'Unknown event Area reference ' + areaId + ': ' + event.id
        );
      }
    }

    for (const barangaySlug of event.venue.barangaySlugs) {
      if (!findBarangay(barangaySlug)) {
        throw new Error(
          'Unknown event Barangay reference ' +
            barangaySlug +
            ': ' +
            event.id
        );
      }
    }

    if (!event.sourceIds.length) {
      throw new Error('Event must cite at least one source: ' + event.id);
    }
    if (!event.sourceIds.includes(event.primarySourceId)) {
      throw new Error('Event primary source missing from sourceIds: ' + event.id);
    }

    for (const sourceId of event.sourceIds) {
      if (!sourceById.has(sourceId)) {
        throw new Error(
          'Event cites missing source ' + sourceId + ': ' + event.id
        );
      }
    }

    for (const assertion of event.provenance.assertions) {
      if (!assertion.fieldPaths.length || !assertion.sourceIds.length) {
        throw new Error(
          'Event assertion requires fields and sources: ' + event.id
        );
      }
      for (const sourceId of assertion.sourceIds) {
        if (!sourceById.has(sourceId)) {
          throw new Error(
            'Event assertion cites missing source ' +
              sourceId +
              ': ' +
              event.id
          );
        }
      }
    }

    for (const experienceId of event.visitorExperienceIds ?? []) {
      if (!visitorExperienceIdSet.has(experienceId)) {
        throw new Error(
          'Unknown visitor experience reference ' +
            experienceId +
            ': ' +
            event.id
        );
      }
    }

    const reviewedOn = eventRegistryReviewedOn;
    const startDate = datePart(event.startsAt);
    const endDate = datePart(event.endsAt ?? event.startsAt);

    if (
      event.status === 'ongoing' &&
      !(startDate <= reviewedOn && reviewedOn <= endDate)
    ) {
      throw new Error(
        'Ongoing event does not span the registry review date: ' + event.id
      );
    }

    if (event.status === 'ended' && endDate >= reviewedOn) {
      throw new Error(
        'Ended pilot event must end before the registry review date: ' +
          event.id
      );
    }

    if (event.status === 'scheduled' && startDate <= reviewedOn) {
      throw new Error(
        'Scheduled pilot event must start after the registry review date: ' +
          event.id
      );
    }
  }

  if (eventRegistry.length !== 4) {
    throw new Error('W5-7b pilot expects exactly four event records.');
  }

  if (
    eventRegistry.filter(event => event.status === 'ongoing').length !== 1 ||
    eventRegistry.filter(event => event.status === 'ended').length !== 3
  ) {
    throw new Error(
      'W5-7b pilot expects one ongoing and three ended evidence records.'
    );
  }

  return true;
};

validateEventRegistry();

export const eventSourceById = sourceById;
export const eventRegistryById = new Map(
  eventRegistry.map(event => [event.id, event])
);
