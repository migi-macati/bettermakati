import { accountabilityEntries } from './accountability';
import { procurementProjectEntries } from './accountabilitySupplement';
import { findBarangay } from './barangays';
import {
  cityMonitorRecords,
  cityMonitorSources,
  type CityMonitorRecord,
} from './cityMonitor';
import { currentCouncilSessionSeeds } from './councilSessions';
import { makatiMayoralHistory } from './electionHistory';
import {
  localLegislationById,
  localLegislationRecords,
  localLegislationSources,
  type LocalLegislationRecord,
} from './localLegislation';
import { placeRegistryById } from './placeRegistry';
import { reports } from './reports';
import {
  manilaDateKey,
  projectCivicTimelineItem,
  type CivicTimelineCanonicalResolver,
  type CivicTimelineGeography,
  type CivicTimelineItem,
  type CivicTimelineProjectionInput,
  type CivicTimelineSourceKind,
  type CivicTimelineSourceRef,
  type CivicTimelineStatus,
  type CivicTimelineTemporal,
} from './civicTimeline';

export const nativeCivicTimelineReviewedAt =
  '2026-09-28T10:44:00+08:00';

const cityMonitorById = new Map(
  cityMonitorRecords.map(record => [record.id, record] as const)
);
const accountabilityEntryById = new Map(
  accountabilityEntries.map(entry => [entry.id, entry] as const)
);
const historicalElectionById = new Map(
  makatiMayoralHistory.map(race => ['mayoral-' + race.year, race] as const)
);
const reportBySlug = new Map(reports.map(report => [report.slug, report] as const));

export const resolveNativeCivicTimelineCanonical: CivicTimelineCanonicalResolver =
  ref => {
    if (ref.owner === 'city-monitor' && ref.type === 'city-monitor-record') {
      const record = cityMonitorById.get(ref.id);
      if (!record) return undefined;
      return {
        ref,
        label: record.title,
        href: '/city-monitor/' + encodeURIComponent(record.id),
      };
    }

    if (ref.owner === 'legislation' && ref.type === 'legislation-record') {
      const record = localLegislationById.get(ref.id);
      if (!record) return undefined;
      return {
        ref,
        label: record.reference.display + ' — ' + record.title,
        href: '/legislation?record=' + encodeURIComponent(record.id),
      };
    }

    if (ref.owner === 'elections' && ref.type === 'election-record') {
      const race = historicalElectionById.get(ref.id);
      if (!race) return undefined;
      return {
        ref,
        label: 'Makati mayoral election ' + race.year,
        href: '/elections',
      };
    }

    if (ref.owner === 'accountability' && ref.type === 'accountability-entry') {
      const entry = accountabilityEntryById.get(ref.id);
      if (!entry) return undefined;
      return {
        ref,
        label: entry.title,
        href: entry.relatedHref ?? '/accountability?type=' + entry.type,
      };
    }

    if (ref.owner === 'reports' && ref.type === 'report') {
      const report = reportBySlug.get(ref.id);
      if (!report) return undefined;
      return {
        ref,
        label: report.headline,
        href: '/reports/' + encodeURIComponent(report.slug),
      };
    }

    return undefined;
  };

const sourceTuple = (
  sources: CivicTimelineSourceRef[],
  owner: string
): [CivicTimelineSourceRef, ...CivicTimelineSourceRef[]] => {
  if (!sources.length) {
    throw new Error('Native Civic Timeline source set is empty: ' + owner);
  }
  return [sources[0], ...sources.slice(1)];
};

const sourceKindForPublishedSource = (
  url: string,
  publisher: string
): CivicTimelineSourceKind => {
  const normalized = (url + ' ' + publisher).toLowerCase();
  if (
    normalized.includes('.gov.ph') ||
    normalized.includes('city government of makati') ||
    normalized.includes('commission on elections') ||
    normalized.includes('comelec')
  ) {
    return 'official-primary';
  }
  return 'current-secondary';
};

const timelineDateStatus = (date: string): CivicTimelineStatus =>
  date > manilaDateKey() ? 'scheduled' : 'completed';

const scopedGeography = ({
  barangaySlugs = [],
  placeIds = [],
}: {
  barangaySlugs?: string[];
  placeIds?: string[];
}): CivicTimelineGeography => {
  const barangays = [...new Set(barangaySlugs.filter(Boolean))];
  const places = [...new Set(placeIds.filter(Boolean))];

  if (!barangays.length && !places.length) {
    return { scope: 'citywide', basis: 'canonical-owner' };
  }

  for (const slug of barangays) {
    if (!findBarangay(slug)) {
      throw new Error(
        'Native Civic Timeline has unknown barangay reference: ' + slug
      );
    }
  }
  for (const placeId of places) {
    if (!placeRegistryById.has(placeId)) {
      throw new Error(
        'Native Civic Timeline has unknown Place reference: ' + placeId
      );
    }
  }

  return {
    scope: 'scoped',
    basis: 'explicit-relationship',
    ...(barangays.length ? { barangaySlugs: barangays } : {}),
    ...(places.length ? { placeIds: places } : {}),
  };
};

const legislationGeography = (
  record: LocalLegislationRecord
): CivicTimelineGeography =>
  scopedGeography({
    barangaySlugs: record.relationships
      .filter(relationship => relationship.targetType === 'barangay')
      .map(relationship => relationship.targetId),
    placeIds: record.relationships
      .filter(relationship => relationship.targetType === 'place')
      .map(relationship => relationship.targetId),
  });

const legislationSources = (
  sourceIds: string[],
  owner: string
): [CivicTimelineSourceRef, ...CivicTimelineSourceRef[]] =>
  sourceTuple(
    sourceIds.map(sourceId => {
      const source = localLegislationSources[sourceId];
      if (!source) {
        throw new Error(
          'Native Civic Timeline legislation source is missing: ' +
            sourceId +
            ' (' +
            owner +
            ')'
        );
      }
      return {
        id: source.id,
        label: source.label,
        url: source.url,
        publisher: source.publisher,
        kind: 'official-primary' as const,
      };
    }),
    owner
  );

const legislationLifecycleTemporal = (
  event: LocalLegislationRecord['lifecycle'][number],
  sourceIds: [string, ...string[]]
): CivicTimelineTemporal => {
  if (!event.date) {
    throw new Error('Dated legislation projector received an undated event.');
  }

  if (event.eventType === 'published') {
    return {
      semantic: 'publication-release',
      precision: 'date',
      publishedAt: event.date,
      origin: {
        role: 'publication-date',
        sourceFields: ['lifecycle[].date'],
        sourceIds,
      },
    };
  }

  if (
    event.eventType === 'effective' ||
    event.eventType === 'amended' ||
    event.eventType === 'repealed'
  ) {
    return {
      semantic: 'effective-change',
      precision: 'date',
      effectiveAt: event.date,
      origin: {
        role: 'effective-date',
        sourceFields: ['lifecycle[].date'],
        sourceIds,
      },
    };
  }

  return {
    semantic: 'occurrence',
    precision: 'date',
    startsAt: event.date,
    origin: {
      role: 'occurrence-date',
      sourceFields: ['lifecycle[].date'],
      sourceIds,
    },
  };
};

const lifecycleLabel = (
  event: LocalLegislationRecord['lifecycle'][number]
) =>
  event.actionAsStated ??
  event.eventType
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const nativeLegislationTimelineItems: CivicTimelineItem[] =
  localLegislationRecords.flatMap(record => {
    const geography = legislationGeography(record);

    const lifecycleItems = record.lifecycle.flatMap((event, index) => {
      if (!event.date) return [];

      const sources = legislationSources(
        event.sourceIds,
        record.id + ':lifecycle:' + event.id
      );
      const sourceIds = sources.map(source => source.id) as [
        string,
        ...string[],
      ];
      const temporal = legislationLifecycleTemporal(event, sourceIds);
      const isPublished = temporal.semantic === 'publication-release';

      const input: CivicTimelineProjectionInput = {
        id:
          'legislation:' +
          record.id +
          ':lifecycle:' +
          event.id +
          ':' +
          index,
        kind: 'legislation-milestone',
        title: record.reference.display + ' — ' + lifecycleLabel(event),
        summary:
          event.note ??
          event.actionAsStated ??
          'Source-backed legislative lifecycle milestone.',
        status:
          event.date > manilaDateKey()
            ? 'scheduled'
            : isPublished
              ? 'published'
              : 'completed',
        actionability: 'information-only',
        canonicalRef: {
          owner: 'legislation',
          type: 'legislation-record',
          id: record.id,
        },
        temporal,
        geography,
        sourceRefs: sources,
        primarySourceId: sources[0].id,
        provenance: {
          basis:
            event.evidenceStatus === 'official-publication'
              ? 'official-publication'
              : 'source-stated',
          lastVerifiedAt: nativeCivicTimelineReviewedAt,
          note: event.note,
        },
        update: {
          revision: 1,
          changeType: 'new',
        },
        tags: [
          'legislation',
          record.measureType,
          event.eventType,
          ...record.topics,
        ],
      };

      return [
        projectCivicTimelineItem(
          input,
          resolveNativeCivicTimelineCanonical
        ),
      ];
    });

    const sessionItems = record.sessionEvidence.flatMap((session, index) => {
      const sources = legislationSources(
        session.sourceIds,
        record.id + ':session:' + index
      );
      const sourceIds = sources.map(source => source.id) as [
        string,
        ...string[],
      ];
      const kind =
        session.sessionType === 'public-hearing'
          ? ('public-hearing' as const)
          : ('meeting' as const);
      const future = session.sessionDate > manilaDateKey();

      const input: CivicTimelineProjectionInput = {
        id:
          'legislation:' +
          record.id +
          ':session:' +
          session.sessionDate +
          ':' +
          index,
        kind,
        title:
          record.reference.display +
          ' — ' +
          session.sessionType.replaceAll('-', ' '),
        summary:
          'The canonical legislation record links this measure to a source-backed ' +
          session.sessionType.replaceAll('-', ' ') +
          ' where it was ' +
          session.relationship.replaceAll('-', ' ') +
          '.',
        status: future ? 'scheduled' : 'completed',
        actionability:
          future && session.sessionType === 'public-hearing'
            ? 'participation-opportunity'
            : 'information-only',
        canonicalRef: {
          owner: 'legislation',
          type: 'legislation-record',
          id: record.id,
        },
        temporal: {
          semantic: 'occurrence',
          precision: 'date',
          startsAt: session.sessionDate,
          origin: {
            role: 'occurrence-date',
            sourceFields: ['sessionEvidence[].sessionDate'],
            sourceIds,
          },
        },
        geography,
        sourceRefs: sources,
        primarySourceId: sources[0].id,
        provenance: {
          basis: 'source-stated',
          lastVerifiedAt: nativeCivicTimelineReviewedAt,
          note: session.note,
        },
        update: {
          revision: 1,
          changeType: 'new',
        },
        tags: [
          'legislation',
          'session',
          session.sessionType,
          session.relationship,
        ],
      };

      return [
        projectCivicTimelineItem(
          input,
          resolveNativeCivicTimelineCanonical
        ),
      ];
    });

    return [...lifecycleItems, ...sessionItems];
  });

const councilSource = cityMonitorSources.find(
  source => source.id === 'makati-council-videos'
);
if (!councilSource) {
  throw new Error('Native Civic Timeline council source is missing.');
}

export const nativeCouncilSessionTimelineItems: CivicTimelineItem[] =
  currentCouncilSessionSeeds.map(session => {
    const sourceRefs: [CivicTimelineSourceRef] = [
      {
        id: councilSource.id,
        label: councilSource.label,
        url: session.discoveryUrl,
        publisher: councilSource.publisher,
        kind: 'official-primary',
      },
    ];

    const input: CivicTimelineProjectionInput = {
      id: 'council-session:' + session.id,
      kind:
        session.sessionType === 'public-hearing'
          ? 'public-hearing'
          : 'meeting',
      title: session.titleAsPublished,
      summary:
        'Officially listed Makati City Council session. BetterMakati preserves the session date without inferring attendance, votes or measure action from the listing alone.',
      status: timelineDateStatus(session.date),
      actionability:
        session.date > manilaDateKey() &&
        session.sessionType === 'public-hearing'
          ? 'participation-opportunity'
          : 'information-only',
      canonicalRef: {
        owner: 'city-monitor',
        type: 'city-monitor-record',
        id: session.id,
      },
      temporal: {
        semantic: 'occurrence',
        precision: 'date',
        startsAt: session.date,
        origin: {
          role: 'occurrence-date',
          sourceFields: ['CouncilSessionSeed.date'],
          sourceIds: [councilSource.id],
        },
      },
      geography: {
        scope: 'citywide',
        basis: 'source-stated',
      },
      sourceRefs,
      primarySourceId: councilSource.id,
      provenance: {
        basis: 'source-stated',
        lastVerifiedAt: nativeCivicTimelineReviewedAt,
        note: session.recording.note,
      },
      update: {
        revision: 1,
        changeType: 'new',
      },
      tags: ['city council', 'session', session.sessionType],
    };

    return projectCivicTimelineItem(
      input,
      resolveNativeCivicTimelineCanonical
    );
  });

const directCityMonitorKinds = new Set<CityMonitorRecord['type']>([
  'procurement',
  'publication',
  'consultation',
  'official-notice',
]);

const isDirectCityMonitorRecord = (record: CityMonitorRecord) =>
  directCityMonitorKinds.has(record.type) &&
  !record.id.startsWith('monitor-') &&
  /^\d{4}-\d{2}-\d{2}$/.test(record.date) &&
  /^https?:\/\//.test(record.sourceUrl);

const directCityMonitorTemporal = (
  record: CityMonitorRecord,
  sourceId: string
): CivicTimelineTemporal => {
  if (record.type === 'publication' || record.type === 'official-notice') {
    return {
      semantic: 'publication-release',
      precision: 'date',
      publishedAt: record.date,
      origin: {
        role: 'publication-date',
        sourceFields: ['CityMonitorRecord.date'],
        sourceIds: [sourceId],
      },
    };
  }

  return {
    semantic: 'occurrence',
    precision: 'date',
    startsAt: record.date,
    origin: {
      role: 'occurrence-date',
      sourceFields: ['CityMonitorRecord.date'],
      sourceIds: [sourceId],
    },
  };
};

const directCityMonitorKind = (
  record: CityMonitorRecord
): CivicTimelineProjectionInput['kind'] => {
  if (record.type === 'procurement') return 'procurement-milestone';
  if (record.type === 'consultation') return 'consultation';
  if (record.type === 'publication') return 'publication';
  return 'advisory';
};

export const nativeDirectCityMonitorTimelineItems: CivicTimelineItem[] =
  cityMonitorRecords.filter(isDirectCityMonitorRecord).map(record => {
    const sourceId = 'city-monitor:' + record.id + ':source';
    const sourceRefs: [CivicTimelineSourceRef] = [
      {
        id: sourceId,
        label: record.sourceLabel,
        url: record.sourceUrl,
        publisher: record.sourcePublisher,
        kind: sourceKindForPublishedSource(
          record.sourceUrl,
          record.sourcePublisher
        ),
      },
    ];
    const temporal = directCityMonitorTemporal(record, sourceId);

    const input: CivicTimelineProjectionInput = {
      id: 'city-monitor:' + record.id,
      kind: directCityMonitorKind(record),
      title: record.title,
      summary: record.summary,
      status:
        temporal.semantic === 'publication-release' &&
        record.date <= manilaDateKey()
          ? 'published'
          : timelineDateStatus(record.date),
      actionability:
        record.type === 'consultation' && record.date > manilaDateKey()
          ? 'participation-opportunity'
          : record.type === 'official-notice'
            ? 'service-impact'
            : 'information-only',
      canonicalRef: {
        owner: 'city-monitor',
        type: 'city-monitor-record',
        id: record.id,
      },
      temporal,
      geography: scopedGeography({
        barangaySlugs: record.barangaySlug ? [record.barangaySlug] : [],
        placeIds: record.placeIds ?? [],
      }),
      sourceRefs,
      primarySourceId: sourceId,
      provenance: {
        basis: 'canonical-owner',
        lastVerifiedAt: nativeCivicTimelineReviewedAt,
      },
      update: {
        revision: 1,
        changeType: 'new',
      },
      tags: [
        'city monitor',
        record.type,
        ...(record.stage ? [record.stage] : []),
      ],
    };

    return projectCivicTimelineItem(
      input,
      resolveNativeCivicTimelineCanonical
    );
  });

export const nativeProcurementTimelineItems: CivicTimelineItem[] =
  procurementProjectEntries.flatMap(entry => {
    const bidDate = entry.procurement?.bidDate;
    if (!bidDate || !/^\d{4}-\d{2}-\d{2}$/.test(bidDate)) return [];

    const sourceRefs = sourceTuple(
      entry.sources.map((source, index) => ({
        id: 'accountability:' + entry.id + ':source:' + (index + 1),
        label: source.label,
        url: source.url,
        publisher: source.publisher,
        kind: sourceKindForPublishedSource(source.url, source.publisher),
      })),
      entry.id
    );
    const primarySourceId = sourceRefs[0].id;

    const input: CivicTimelineProjectionInput = {
      id: 'accountability:' + entry.id + ':bid-result',
      kind: 'procurement-milestone',
      title: 'Bid result — ' + entry.title,
      summary: entry.summary,
      status: timelineDateStatus(bidDate),
      actionability: 'information-only',
      canonicalRef: {
        owner: 'accountability',
        type: 'accountability-entry',
        id: entry.id,
      },
      temporal: {
        semantic: 'occurrence',
        precision: 'date',
        startsAt: bidDate,
        origin: {
          role: 'occurrence-date',
          sourceFields: ['procurement.bidDate'],
          sourceIds: [primarySourceId],
        },
      },
      geography: scopedGeography({
        barangaySlugs: entry.barangaySlug ? [entry.barangaySlug] : [],
      }),
      sourceRefs,
      primarySourceId,
      provenance: {
        basis: 'canonical-owner',
        lastVerifiedAt: nativeCivicTimelineReviewedAt,
        note:
          'This projects only the exact bid-result date already owned by the Accountability record; later contract/implementation stages remain source gaps unless separately evidenced.',
      },
      update: {
        revision: 1,
        changeType: 'new',
      },
      tags: [
        'procurement',
        'bid result',
        ...(entry.procurement?.referenceNo
          ? [entry.procurement.referenceNo]
          : []),
      ],
    };

    return [
      projectCivicTimelineItem(
        input,
        resolveNativeCivicTimelineCanonical
      ),
    ];
  });

const electionSourceKind = (
  quality: (typeof makatiMayoralHistory)[number]['sourceQuality']
): CivicTimelineSourceKind =>
  quality === 'official' ? 'official-primary' : 'current-secondary';

export const nativeElectionArchiveTimelineItems: CivicTimelineItem[] =
  makatiMayoralHistory.map(race => {
    const canonicalId = 'mayoral-' + race.year;
    const sourceId = 'election:' + race.year + ':source';
    const sourceRefs: [CivicTimelineSourceRef] = [
      {
        id: sourceId,
        label: race.sourceLabel,
        url: race.sourceUrl,
        publisher:
          race.sourceQuality === 'official'
            ? 'Commission on Elections'
            : 'Published election source',
        kind: electionSourceKind(race.sourceQuality),
      },
    ];

    const input: CivicTimelineProjectionInput = {
      id: 'election:' + canonicalId + ':election-day',
      kind: 'election-milestone',
      title: 'Makati mayoral election — ' + race.year,
      summary:
        'Historical Makati election-day entry projected from the canonical Elections dataset.',
      status: 'completed',
      actionability: 'information-only',
      canonicalRef: {
        owner: 'elections',
        type: 'election-record',
        id: canonicalId,
      },
      temporal: {
        semantic: 'occurrence',
        precision: 'date',
        startsAt: race.electionDate,
        origin: {
          role: 'occurrence-date',
          sourceFields: ['HistoricalMayoralRace.electionDate'],
          sourceIds: [sourceId],
        },
      },
      geography: {
        scope: 'citywide',
        basis: 'canonical-owner',
      },
      sourceRefs,
      primarySourceId: sourceId,
      provenance: {
        basis: 'canonical-owner',
        lastVerifiedAt: nativeCivicTimelineReviewedAt,
        note: race.geographyNote,
      },
      update: {
        revision: 1,
        changeType: 'new',
      },
      tags: ['elections', 'mayoral', String(race.year)],
    };

    return projectCivicTimelineItem(
      input,
      resolveNativeCivicTimelineCanonical
    );
  });

const reportMonthNumber: Record<string, string> = {
  January: '01',
  February: '02',
  March: '03',
  April: '04',
  May: '05',
  June: '06',
  July: '07',
  August: '08',
  September: '09',
  October: '10',
  November: '11',
  December: '12',
};

const reportPublicationDateKey = (displayDate: string) => {
  const match = displayDate.match(/^(\d{1,2}) ([A-Za-z]+) (\d{4})$/);
  if (!match) {
    throw new Error(
      'Report publication date does not use D Month YYYY: ' + displayDate
    );
  }
  const month = reportMonthNumber[match[2]];
  if (!month) {
    throw new Error('Unknown report publication month: ' + match[2]);
  }
  return match[3] + '-' + month + '-' + match[1].padStart(2, '0');
};

export const nativeReportReleaseTimelineItems: CivicTimelineItem[] =
  reports.map(report => {
    const publishedAt = reportPublicationDateKey(report.date);
    const sourceId = 'report:' + report.slug + ':canonical';
    const sourceRefs: [CivicTimelineSourceRef] = [
      {
        id: sourceId,
        label: report.headline,
        url: 'https://bettermakati.org/reports/' + encodeURIComponent(report.slug),
        publisher: 'BetterMakati',
        kind: 'canonical-internal',
      },
    ];

    const input: CivicTimelineProjectionInput = {
      id: 'report:' + report.slug + ':release',
      kind: 'report-release',
      title: 'Report published — ' + report.headline,
      summary: report.subheadline,
      status: 'published',
      actionability: 'information-only',
      canonicalRef: {
        owner: 'reports',
        type: 'report',
        id: report.slug,
      },
      temporal: {
        semantic: 'publication-release',
        precision: 'date',
        publishedAt,
        origin: {
          role: 'publication-date',
          sourceFields: ['FeaturedReportV2.date'],
          sourceIds: [sourceId],
        },
      },
      geography: {
        scope: 'citywide',
        basis: 'canonical-owner',
      },
      sourceRefs,
      primarySourceId: sourceId,
      provenance: {
        basis: 'canonical-owner',
        lastVerifiedAt: nativeCivicTimelineReviewedAt,
      },
      update: {
        revision: 1,
        changeType: 'new',
      },
      tags: ['reports', 'BetterMakati publication', report.slug],
    };

    return projectCivicTimelineItem(
      input,
      resolveNativeCivicTimelineCanonical
    );
  });

const timelineValue = (item: CivicTimelineItem) => {
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

export const nativeCivicTimelineItems: CivicTimelineItem[] = [
  ...nativeLegislationTimelineItems,
  ...nativeCouncilSessionTimelineItems,
  ...nativeDirectCityMonitorTimelineItems,
  ...nativeProcurementTimelineItems,
  ...nativeElectionArchiveTimelineItems,
  ...nativeReportReleaseTimelineItems,
].sort(
  (left, right) =>
    timelineValue(right).localeCompare(timelineValue(left)) ||
    left.title.localeCompare(right.title, 'en-PH')
);

const timelineIds = new Set<string>();
for (const item of nativeCivicTimelineItems) {
  if (timelineIds.has(item.id)) {
    throw new Error('Duplicate native Civic Timeline item ID: ' + item.id);
  }
  timelineIds.add(item.id);

  if (!resolveNativeCivicTimelineCanonical(item.canonicalRef)) {
    throw new Error(
      'Native Civic Timeline canonical reference does not resolve: ' +
        item.id
    );
  }
}

export const nativeCivicTimelineCoverage = {
  legislation: nativeLegislationTimelineItems.length,
  councilSessions: nativeCouncilSessionTimelineItems.length,
  directCityMonitor: nativeDirectCityMonitorTimelineItems.length,
  procurement: nativeProcurementTimelineItems.length,
  electionArchive: nativeElectionArchiveTimelineItems.length,
  reportReleases: nativeReportReleaseTimelineItems.length,
  total: nativeCivicTimelineItems.length,
} as const;
