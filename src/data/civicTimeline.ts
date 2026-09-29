export const civicTimelineTimeZone = 'Asia/Manila' as const;

export type CivicTimelineKind =
  | 'deadline'
  | 'meeting'
  | 'public-hearing'
  | 'barangay-assembly'
  | 'consultation'
  | 'service-change'
  | 'service-availability'
  | 'road-closure'
  | 'advisory'
  | 'election-milestone'
  | 'legislation-milestone'
  | 'procurement-milestone'
  | 'project-milestone'
  | 'publication'
  | 'statistics-release'
  | 'report-release'
  | 'audit-release'
  | 'record-update';

export type CivicTimelineTemporalSemantic =
  | 'occurrence'
  | 'deadline'
  | 'effective-change'
  | 'publication-release'
  | 'target-milestone';

export type CivicTimelineExcludedTemporalSemantic =
  | 'observation-period'
  | 'source-period-label'
  | 'verification-review'
  | 'status-as-of';

export const excludedCivicTimelineTemporalSemantics: readonly CivicTimelineExcludedTemporalSemantic[] =
  [
    'observation-period',
    'source-period-label',
    'verification-review',
    'status-as-of',
  ];

export type CivicTimelineSourceDateRole =
  | 'occurrence-date'
  | 'deadline-date'
  | 'effective-date'
  | 'publication-date'
  | 'target-date';

export type CivicTimelineStatus =
  | 'scheduled'
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'postponed'
  | 'published'
  | 'superseded';

export type CivicTimelineActionability =
  | 'action-required'
  | 'participation-opportunity'
  | 'service-impact'
  | 'service-available'
  | 'information-only';

export type CivicTimelineSourceKind =
  | 'official-primary'
  | 'official-secondary'
  | 'canonical-internal'
  | 'first-party'
  | 'current-secondary';

export type CivicTimelineEvidenceBasis =
  | 'canonical-owner'
  | 'source-stated'
  | 'official-publication'
  | 'reviewed-monitor-candidate';

export type CivicTimelineChangeType =
  | 'new'
  | 'updated'
  | 'rescheduled'
  | 'cancelled'
  | 'postponed'
  | 'superseded';

export type CivicTimelineCanonicalRef =
  | {
      owner: 'city-monitor';
      type: 'city-monitor-record';
      id: string;
    }
  | {
      owner: 'legislation';
      type: 'legislation-record';
      id: string;
    }
  | {
      owner: 'elections';
      type: 'election-record';
      id: string;
    }
  | {
      owner: 'accountability';
      type: 'accountability-entry';
      id: string;
    }
  | {
      owner: 'reports';
      type: 'report';
      id: string;
    }
  | {
      owner: 'statistics';
      type: 'statistics-indicator';
      id: string;
    }
  | {
      owner: 'public-records';
      type: 'public-record';
      id: string;
    }
  | {
      owner: 'services';
      type: 'service';
      id: string;
    }
  | {
      owner: 'barangays';
      type: 'barangay';
      id: string;
    }
  | {
      owner: 'mobility';
      type: 'mobility-service' | 'mobility-route' | 'place';
      id: string;
    };

export interface CivicTimelineCanonicalDescriptor {
  ref: CivicTimelineCanonicalRef;
  label: string;
  href: string;
}

export type CivicTimelineCanonicalResolver = (
  ref: CivicTimelineCanonicalRef
) => CivicTimelineCanonicalDescriptor | undefined;

export type CivicTimelineGeography =
  | {
      scope: 'citywide';
      basis: 'canonical-owner' | 'source-stated';
    }
  | {
      scope: 'scoped';
      basis:
        | 'canonical-owner'
        | 'source-stated'
        | 'explicit-relationship';
      barangaySlugs?: string[];
      areaIds?: string[];
      placeIds?: string[];
      routeIds?: string[];
      segmentIds?: string[];
    };

export interface CivicTimelineSourceRef {
  id: string;
  label: string;
  url: string;
  publisher: string;
  kind: CivicTimelineSourceKind;
  checkedOn?: string;
}

export interface CivicTimelineTemporalOrigin {
  role: CivicTimelineSourceDateRole;
  sourceFields: [string, ...string[]];
  sourceIds: [string, ...string[]];
}

export type CivicTimelineTemporal =
  | {
      semantic: 'occurrence';
      precision: 'date';
      startsAt: string;
      origin: CivicTimelineTemporalOrigin & { role: 'occurrence-date' };
    }
  | {
      semantic: 'occurrence';
      precision: 'datetime';
      startsAt: string;
      origin: CivicTimelineTemporalOrigin & { role: 'occurrence-date' };
    }
  | {
      semantic: 'occurrence';
      precision: 'date-range';
      startsAt: string;
      endsAt: string;
      origin: CivicTimelineTemporalOrigin & { role: 'occurrence-date' };
    }
  | {
      semantic: 'occurrence';
      precision: 'datetime-range';
      startsAt: string;
      endsAt: string;
      origin: CivicTimelineTemporalOrigin & { role: 'occurrence-date' };
    }
  | {
      semantic: 'deadline';
      precision: 'date';
      dueAt: string;
      origin: CivicTimelineTemporalOrigin & { role: 'deadline-date' };
    }
  | {
      semantic: 'deadline';
      precision: 'datetime';
      dueAt: string;
      origin: CivicTimelineTemporalOrigin & { role: 'deadline-date' };
    }
  | {
      semantic: 'effective-change';
      precision: 'date';
      effectiveAt: string;
      origin: CivicTimelineTemporalOrigin & { role: 'effective-date' };
    }
  | {
      semantic: 'effective-change';
      precision: 'datetime';
      effectiveAt: string;
      origin: CivicTimelineTemporalOrigin & { role: 'effective-date' };
    }
  | {
      semantic: 'effective-change';
      precision: 'date-range';
      effectiveAt: string;
      endsAt: string;
      origin: CivicTimelineTemporalOrigin & { role: 'effective-date' };
    }
  | {
      semantic: 'effective-change';
      precision: 'datetime-range';
      effectiveAt: string;
      endsAt: string;
      origin: CivicTimelineTemporalOrigin & { role: 'effective-date' };
    }
  | {
      semantic: 'publication-release';
      precision: 'date';
      publishedAt: string;
      origin: CivicTimelineTemporalOrigin & { role: 'publication-date' };
    }
  | {
      semantic: 'publication-release';
      precision: 'datetime';
      publishedAt: string;
      origin: CivicTimelineTemporalOrigin & { role: 'publication-date' };
    }
  | {
      semantic: 'target-milestone';
      precision: 'date';
      targetAt: string;
      origin: CivicTimelineTemporalOrigin & { role: 'target-date' };
    }
  | {
      semantic: 'target-milestone';
      precision: 'datetime';
      targetAt: string;
      origin: CivicTimelineTemporalOrigin & { role: 'target-date' };
    };

export interface CivicTimelineAction {
  label: string;
  href: string;
  kind:
    | 'apply'
    | 'register'
    | 'comment'
    | 'attend'
    | 'pay'
    | 'check-status'
    | 'view-source'
    | 'other';
}

export interface CivicTimelineUpdateState {
  revision: number;
  changeType: CivicTimelineChangeType;
  supersedesTimelineItemId?: string;
  note?: string;
}

export interface CivicTimelineProjectionInput {
  id: string;
  kind: CivicTimelineKind;
  title: string;
  summary: string;
  status: CivicTimelineStatus;
  actionability: CivicTimelineActionability;
  canonicalRef: CivicTimelineCanonicalRef;
  temporal: CivicTimelineTemporal;
  geography: CivicTimelineGeography;
  sourceRefs: [CivicTimelineSourceRef, ...CivicTimelineSourceRef[]];
  primarySourceId: string;
  provenance: {
    basis: CivicTimelineEvidenceBasis;
    lastVerifiedAt: string;
    note?: string;
  };
  update: CivicTimelineUpdateState;
  action?: CivicTimelineAction;
  tags: string[];
}

export interface CivicTimelineItem extends CivicTimelineProjectionInput {
  canonicalLabel: string;
  canonicalHref: string;
}

export const civicTimelineKindSemantics: Record<
  CivicTimelineKind,
  readonly CivicTimelineTemporalSemantic[]
> = {
  deadline: ['deadline'],
  meeting: ['occurrence'],
  'public-hearing': ['occurrence'],
  'barangay-assembly': ['occurrence'],
  consultation: ['occurrence', 'deadline'],
  'service-change': ['effective-change', 'deadline'],
  'service-availability': ['occurrence'],
  'road-closure': ['occurrence', 'effective-change'],
  advisory: [
    'occurrence',
    'effective-change',
    'deadline',
    'publication-release',
  ],
  'election-milestone': [
    'occurrence',
    'deadline',
    'effective-change',
    'publication-release',
  ],
  'legislation-milestone': [
    'occurrence',
    'effective-change',
    'publication-release',
  ],
  'procurement-milestone': [
    'occurrence',
    'deadline',
    'target-milestone',
    'publication-release',
  ],
  'project-milestone': [
    'occurrence',
    'effective-change',
    'target-milestone',
    'publication-release',
  ],
  publication: ['publication-release'],
  'statistics-release': ['publication-release'],
  'report-release': ['publication-release'],
  'audit-release': ['publication-release'],
  'record-update': ['publication-release', 'effective-change'],
};

export const civicTimelineCanonicalRefKey = (
  ref: CivicTimelineCanonicalRef
) => ref.owner + ':' + ref.type + ':' + ref.id;

export const manilaDateKey = (now = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: civicTimelineTimeZone,
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

const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;
const manilaDateTimePattern =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?\+08:00$/;

const assertDateOnly = (value: string, owner: string) => {
  if (
    !dateOnlyPattern.test(value) ||
    Number.isNaN(Date.parse(value + 'T00:00:00+08:00'))
  ) {
    throw new Error(owner + ' must be a valid YYYY-MM-DD date.');
  }
};

const assertManilaDateTime = (value: string, owner: string) => {
  if (!manilaDateTimePattern.test(value) || Number.isNaN(Date.parse(value))) {
    throw new Error(
      owner +
        ' must be an explicit Asia/Manila datetime ending in +08:00.'
    );
  }
};

const assertPublicTemporalValue = (
  value: string,
  precision: 'date' | 'datetime',
  owner: string
) => {
  if (precision === 'date') assertDateOnly(value, owner);
  else assertManilaDateTime(value, owner);
};

const temporalStart = (temporal: CivicTimelineTemporal) => {
  switch (temporal.semantic) {
    case 'occurrence':
      return temporal.startsAt;
    case 'deadline':
      return temporal.dueAt;
    case 'effective-change':
      return temporal.effectiveAt;
    case 'publication-release':
      return temporal.publishedAt;
    case 'target-milestone':
      return temporal.targetAt;
  }
};

const temporalEnd = (temporal: CivicTimelineTemporal) =>
  'endsAt' in temporal ? temporal.endsAt : undefined;

const temporalValueToEpoch = (
  value: string,
  precision: CivicTimelineTemporal['precision']
) =>
  precision.startsWith('date') && !precision.startsWith('datetime')
    ? Date.parse(value + 'T00:00:00+08:00')
    : Date.parse(value);

const forbiddenSourceDateFieldSegments = new Set([
  'checkedOn',
  'checkedAt',
  'reviewedOn',
  'lastReviewed',
  'lastVerified',
  'reconciledOn',
  'statusAsOf',
  'period',
  'asOf',
]);

const sourceFieldSegments = (fieldPath: string) =>
  fieldPath
    .replace(/\[\d+\]/g, '.')
    .split('.')
    .map(segment => segment.trim())
    .filter(Boolean);

const validateTemporalOrigin = (
  temporal: CivicTimelineTemporal,
  sourceIds: Set<string>,
  itemId: string
) => {
  const origin = temporal.origin;

  for (const fieldPath of origin.sourceFields) {
    if (!fieldPath.trim()) {
      throw new Error('Timeline source field cannot be empty: ' + itemId);
    }

    const forbiddenSegment = sourceFieldSegments(fieldPath).find(segment =>
      forbiddenSourceDateFieldSegments.has(segment)
    );

    if (forbiddenSegment) {
      throw new Error(
        'Timeline item ' +
          itemId +
          ' cannot project maintenance/observation field ' +
          fieldPath +
          ' (' +
          forbiddenSegment +
          ').'
      );
    }
  }

  for (const sourceId of origin.sourceIds) {
    if (!sourceIds.has(sourceId)) {
      throw new Error(
        'Timeline temporal origin cites missing source ' +
          sourceId +
          ': ' +
          itemId
      );
    }
  }
};

const validateTemporal = (
  temporal: CivicTimelineTemporal,
  sourceIds: Set<string>,
  itemId: string
) => {
  const isRange =
    temporal.precision === 'date-range' ||
    temporal.precision === 'datetime-range';
  const pointPrecision = temporal.precision.startsWith('datetime')
    ? 'datetime'
    : 'date';

  const start = temporalStart(temporal);
  assertPublicTemporalValue(start, pointPrecision, itemId + '.temporal');

  const end = temporalEnd(temporal);
  if (isRange) {
    if (!end) {
      throw new Error('Timeline range requires an end: ' + itemId);
    }
    assertPublicTemporalValue(
      end,
      pointPrecision,
      itemId + '.temporal.endsAt'
    );

    if (
      temporalValueToEpoch(end, temporal.precision) <
      temporalValueToEpoch(start, temporal.precision)
    ) {
      throw new Error('Timeline range ends before it starts: ' + itemId);
    }
  } else if (end) {
    throw new Error(
      'Timeline point precision cannot carry an end value: ' + itemId
    );
  }

  validateTemporalOrigin(temporal, sourceIds, itemId);
};

const validateUrl = (url: string, owner: string) => {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('Invalid Civic Timeline URL for ' + owner + ': ' + url);
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error(
      'Unsupported Civic Timeline URL protocol for ' + owner + ': ' + url
    );
  }
};

const assertUniqueNonEmpty = (
  values: string[] | undefined,
  owner: string
) => {
  if (!values) return;
  if (values.some(value => !value.trim())) {
    throw new Error(owner + ' contains an empty identifier.');
  }
  if (new Set(values).size !== values.length) {
    throw new Error(owner + ' contains duplicate identifiers.');
  }
};

const validateGeography = (
  geography: CivicTimelineGeography,
  itemId: string
) => {
  if (geography.scope === 'citywide') return;

  const groups = [
    geography.barangaySlugs,
    geography.areaIds,
    geography.placeIds,
    geography.routeIds,
    geography.segmentIds,
  ];
  if (!groups.some(group => group && group.length > 0)) {
    throw new Error(
      'Scoped Civic Timeline geography requires at least one canonical geography reference: ' +
        itemId
    );
  }

  assertUniqueNonEmpty(
    geography.barangaySlugs,
    itemId + '.geography.barangaySlugs'
  );
  assertUniqueNonEmpty(geography.areaIds, itemId + '.geography.areaIds');
  assertUniqueNonEmpty(geography.placeIds, itemId + '.geography.placeIds');
  assertUniqueNonEmpty(geography.routeIds, itemId + '.geography.routeIds');
  assertUniqueNonEmpty(
    geography.segmentIds,
    itemId + '.geography.segmentIds'
  );
};

export const validateCivicTimelineProjectionInput = (
  input: CivicTimelineProjectionInput
) => {
  if (!input.id.trim() || !input.title.trim() || !input.summary.trim()) {
    throw new Error('Civic Timeline identity fields must not be empty.');
  }

  if (!input.canonicalRef.id.trim()) {
    throw new Error('Civic Timeline canonical reference ID must not be empty.');
  }

  const allowedSemantics = civicTimelineKindSemantics[input.kind];
  if (!allowedSemantics.includes(input.temporal.semantic)) {
    throw new Error(
      'Civic Timeline kind/temporal semantic mismatch for ' +
        input.id +
        ': ' +
        input.kind +
        ' / ' +
        input.temporal.semantic
    );
  }

  const sourceIds = new Set<string>();
  for (const source of input.sourceRefs) {
    if (
      !source.id.trim() ||
      !source.label.trim() ||
      !source.publisher.trim()
    ) {
      throw new Error(
        'Civic Timeline source identity fields must not be empty: ' + input.id
      );
    }
    if (sourceIds.has(source.id)) {
      throw new Error(
        'Duplicate Civic Timeline source ' + source.id + ': ' + input.id
      );
    }
    sourceIds.add(source.id);
    validateUrl(source.url, source.id);
    if (source.checkedOn) {
      assertDateOnly(source.checkedOn, source.id + '.checkedOn');
    }
  }

  if (!sourceIds.has(input.primarySourceId)) {
    throw new Error(
      'Civic Timeline primary source is missing from sourceRefs: ' + input.id
    );
  }

  validateTemporal(input.temporal, sourceIds, input.id);
  validateGeography(input.geography, input.id);

  if (
    Number.isNaN(Date.parse(input.provenance.lastVerifiedAt))
  ) {
    throw new Error(
      'Invalid Civic Timeline provenance verification timestamp: ' + input.id
    );
  }

  if (!Number.isInteger(input.update.revision) || input.update.revision < 1) {
    throw new Error(
      'Civic Timeline revision must be a positive integer: ' + input.id
    );
  }

  if (
    ['rescheduled', 'superseded'].includes(input.update.changeType) &&
    !input.update.supersedesTimelineItemId?.trim()
  ) {
    throw new Error(
      'Rescheduled/superseded Civic Timeline item requires the prior item ID: ' +
        input.id
    );
  }

  if (
    input.update.changeType === 'cancelled' &&
    input.status !== 'cancelled'
  ) {
    throw new Error(
      'Cancelled Civic Timeline update must use cancelled status: ' + input.id
    );
  }

  if (
    input.update.changeType === 'postponed' &&
    input.status !== 'postponed'
  ) {
    throw new Error(
      'Postponed Civic Timeline update must use postponed status: ' + input.id
    );
  }

  if (
    input.update.changeType === 'superseded' &&
    input.status !== 'superseded'
  ) {
    throw new Error(
      'Superseded Civic Timeline update must use superseded status: ' + input.id
    );
  }

  if (input.action) {
    if (!input.action.label.trim()) {
      throw new Error('Civic Timeline action label is empty: ' + input.id);
    }
    validateUrl(input.action.href, input.id + '.action');
  }

  assertUniqueNonEmpty(input.tags, input.id + '.tags');

  return true;
};

export const projectCivicTimelineItem = (
  input: CivicTimelineProjectionInput,
  resolveCanonical: CivicTimelineCanonicalResolver
): CivicTimelineItem => {
  validateCivicTimelineProjectionInput(input);

  const canonical = resolveCanonical(input.canonicalRef);
  if (!canonical) {
    throw new Error(
      'Unresolved Civic Timeline canonical owner: ' +
        civicTimelineCanonicalRefKey(input.canonicalRef)
    );
  }

  if (
    civicTimelineCanonicalRefKey(canonical.ref) !==
    civicTimelineCanonicalRefKey(input.canonicalRef)
  ) {
    throw new Error(
      'Civic Timeline resolver returned a different canonical record for ' +
        input.id
    );
  }

  if (!canonical.label.trim() || !canonical.href.trim()) {
    throw new Error(
      'Civic Timeline canonical descriptor is incomplete: ' + input.id
    );
  }

  return {
    ...input,
    canonicalLabel: canonical.label,
    canonicalHref: canonical.href,
  };
};
