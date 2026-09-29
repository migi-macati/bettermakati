import { findBarangay } from './barangays';
import { placeRegistryById } from './placeRegistry';
import {
  civicIntelligenceRefKey,
  createCivicIntelligenceRelationshipIndex,
  type CivicIntelligenceNodeDescriptor,
  type CivicIntelligenceNodeResolver,
  type CivicIntelligenceReference,
  type CivicIntelligenceRelationship,
} from './civicIntelligenceRelationships';
import type { CivicTimelineCanonicalRef } from './civicTimeline';
import { nativeCivicTimelineItems } from './civicTimelineNative';
import { civicCalendarViewForItem } from './civicTimelineViews';

const timelineItemById = new Map(
  nativeCivicTimelineItems.map(item => [item.id, item] as const)
);

const civicRefForTimelineCanonical = (
  ref: CivicTimelineCanonicalRef
): CivicIntelligenceReference | undefined => {
  if (ref.owner === 'city-monitor' && ref.type === 'city-monitor-record') {
    return { type: 'city-monitor-record', id: ref.id };
  }
  if (ref.owner === 'legislation' && ref.type === 'legislation-record') {
    return { type: 'legislation-record', id: ref.id };
  }
  if (ref.owner === 'elections' && ref.type === 'election-record') {
    return { type: 'election-record', id: ref.id };
  }
  if (ref.owner === 'accountability' && ref.type === 'accountability-entry') {
    return { type: 'accountability-record', id: ref.id };
  }
  if (ref.owner === 'reports' && ref.type === 'report') {
    return { type: 'report', id: ref.id };
  }
  if (ref.owner === 'statistics' && ref.type === 'statistics-indicator') {
    return { type: 'indicator', id: ref.id };
  }
  if (ref.owner === 'public-records' && ref.type === 'public-record') {
    return { type: 'public-record', id: ref.id };
  }
  if (ref.owner === 'services' && ref.type === 'service') {
    return { type: 'service', id: ref.id };
  }
  if (ref.owner === 'barangays' && ref.type === 'barangay') {
    return { type: 'barangay', id: ref.id };
  }
  if (ref.owner === 'mobility' && ref.type === 'place') {
    return { type: 'place', id: ref.id };
  }

  // Mobility services/routes currently use a separate canonical vocabulary.
  // Do not force them into the shared service/route graph until their IDs have
  // an explicit shared resolver.
  return undefined;
};

const descriptorOwnerForTimelineCanonical = (
  ref: CivicTimelineCanonicalRef
): CivicIntelligenceNodeDescriptor['owner'] | undefined => {
  switch (ref.owner) {
    case 'city-monitor':
      return 'city-monitor';
    case 'legislation':
      return 'legislation';
    case 'elections':
      return 'elections';
    case 'accountability':
      return 'accountability';
    case 'reports':
      return 'reports';
    case 'statistics':
      return 'statistics';
    case 'public-records':
      return 'public-records';
    case 'services':
      return 'services';
    case 'barangays':
      return 'barangays';
    case 'mobility':
      return ref.type === 'place' ? 'place-registry' : undefined;
  }
};

const canonicalDescriptorByRefKey = new Map<
  string,
  CivicIntelligenceNodeDescriptor
>();

const canonicalEdges: CivicIntelligenceRelationship[] =
  nativeCivicTimelineItems.flatMap(item => {
    const canonicalRef = civicRefForTimelineCanonical(item.canonicalRef);
    const owner = descriptorOwnerForTimelineCanonical(item.canonicalRef);
    if (!canonicalRef || !owner) return [];

    const key = civicIntelligenceRefKey(canonicalRef);
    const existing = canonicalDescriptorByRefKey.get(key);
    const descriptor: CivicIntelligenceNodeDescriptor = {
      ref: canonicalRef,
      label: item.canonicalLabel,
      href: item.canonicalHref,
      owner,
    };

    if (
      existing &&
      (existing.label !== descriptor.label || existing.href !== descriptor.href)
    ) {
      throw new Error(
        'Timeline canonical descriptor conflict for ' + key
      );
    }
    canonicalDescriptorByRefKey.set(key, descriptor);

    return [
      {
        id: 'timeline-' + item.id + '-chronicles-' + key.replaceAll(':', '-'),
        kind: 'chronicles' as const,
        from: { type: 'timeline-item' as const, id: item.id },
        to: canonicalRef,
        evidence: {
          basis: 'canonical-id' as const,
          note:
            'This timeline item is a time-indexed projection of the canonical record identified by its canonicalRef. It does not create a second civic record.',
        },
      },
    ];
  });

const geographyEdges: CivicIntelligenceRelationship[] =
  nativeCivicTimelineItems.flatMap(item => {
    if (item.geography.scope !== 'scoped') return [];
    const edges: CivicIntelligenceRelationship[] = [];

    for (const barangaySlug of item.geography.barangaySlugs ?? []) {
      edges.push({
        id: 'timeline-' + item.id + '-barangay-' + barangaySlug,
        kind: 'applies-to',
        from: { type: 'timeline-item', id: item.id },
        to: { type: 'barangay', id: barangaySlug },
        evidence: {
          basis: 'explicit-geography',
          note:
            'The canonical timeline projection explicitly scopes this item to the barangay.',
        },
      });
    }

    for (const placeId of item.geography.placeIds ?? []) {
      edges.push({
        id: 'timeline-' + item.id + '-place-' + placeId,
        kind: 'applies-to',
        from: { type: 'timeline-item', id: item.id },
        to: { type: 'place', id: placeId },
        evidence: {
          basis: 'explicit-geography',
          note:
            'The canonical timeline projection explicitly scopes this item to the place.',
        },
      });
    }

    return edges;
  });

export const timelineCivicRelationships: CivicIntelligenceRelationship[] = [
  ...canonicalEdges,
  ...geographyEdges,
];

export const timelineCivicRelationshipIndex =
  createCivicIntelligenceRelationshipIndex(timelineCivicRelationships);

export const timelineCivicNodeResolver: CivicIntelligenceNodeResolver =
  ref => {
    if (ref.type === 'timeline-item') {
      const item = timelineItemById.get(ref.id);
      if (!item) return undefined;
      const params = new URLSearchParams({
        view: civicCalendarViewForItem(item),
      });
      return {
        ref,
        label: item.title,
        href:
          '/calendar?' +
          params.toString() +
          '#timeline-item-' +
          encodeURIComponent(item.id),
        owner: 'timeline',
      };
    }

    const canonical = canonicalDescriptorByRefKey.get(
      civicIntelligenceRefKey(ref)
    );
    if (canonical) return canonical;

    if (ref.type === 'barangay') {
      const barangay = findBarangay(ref.id);
      if (!barangay) return undefined;
      return {
        ref,
        label: barangay.name,
        href: '/barangays/' + barangay.slug,
        owner: 'barangays',
      };
    }

    if (ref.type === 'place') {
      const place = placeRegistryById.get(ref.id);
      if (!place) return undefined;
      return {
        ref,
        label: place.name,
        href: '/civic-map/' + place.id,
        owner: 'place-registry',
      };
    }

    return undefined;
  };

for (const relationship of timelineCivicRelationships) {
  if (!timelineCivicNodeResolver(relationship.from)) {
    throw new Error(
      'Unresolved timeline civic relationship source: ' + relationship.id
    );
  }
  if (!timelineCivicNodeResolver(relationship.to)) {
    throw new Error(
      'Unresolved timeline civic relationship target: ' + relationship.id
    );
  }
}

const resolvedForRef = (ref: CivicIntelligenceReference) =>
  timelineCivicRelationshipIndex
    .forRef(ref)
    .map(view => ({
      ...view,
      node: timelineCivicNodeResolver(view.related),
    }))
    .filter(item => Boolean(item.node));

export const timelineForCivicRecord = (
  ref: Exclude<CivicIntelligenceReference, { type: 'timeline-item' }>
) =>
  resolvedForRef(ref).filter(
    item =>
      item.related.type === 'timeline-item' &&
      item.relationship.kind === 'chronicles'
  );

export const timelineForBarangay = (barangaySlug: string) =>
  resolvedForRef({ type: 'barangay', id: barangaySlug }).filter(
    item => item.related.type === 'timeline-item'
  );

export const timelineForPlace = (placeId: string) =>
  resolvedForRef({ type: 'place', id: placeId }).filter(
    item => item.related.type === 'timeline-item'
  );

export const timelineCivicRelationshipCoverage = {
  timelineItems: nativeCivicTimelineItems.length,
  canonicalEdges: canonicalEdges.length,
  explicitBarangayEdges: geographyEdges.filter(
    relationship => relationship.to.type === 'barangay'
  ).length,
  explicitPlaceEdges: geographyEdges.filter(
    relationship => relationship.to.type === 'place'
  ).length,
  skippedMobilityCanonicalRefs: nativeCivicTimelineItems.filter(
    item =>
      item.canonicalRef.owner === 'mobility' &&
      item.canonicalRef.type !== 'place'
  ).length,
} as const;
