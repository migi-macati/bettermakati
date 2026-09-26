import { barangays } from './barangays';
import { cityMonitorRecords } from './cityMonitor';
import {
  createCivicIntelligenceRelationshipIndex,
  type CivicIntelligenceNodeResolver,
  type CivicIntelligenceRelationship,
} from './civicIntelligenceRelationships';
import {
  localLegislationById,
  localLegislationRecords,
  type LocalLegislationCivicRelationship,
  type LocalLegislationRecord,
} from './localLegislation';
import { placeRegistryById } from './placeRegistry';
import { publicRecords } from './publicRecords';
import { serviceDirectory } from './serviceDirectory';

const relationshipKindMap: Record<
  LocalLegislationCivicRelationship['kind'],
  CivicIntelligenceRelationship['kind']
> = {
  'affects-service': 'affects',
  'applies-to-barangay': 'applies-to',
  'affects-place': 'affects',
  'authorizes-project': 'authorizes',
  'funds-project': 'funds',
  'affects-accountability-record': 'affects',
  'supported-by-public-record': 'evidence-for',
};

const targetTypeMap: Record<
  LocalLegislationCivicRelationship['targetType'],
  'service' | 'barangay' | 'place' | 'project' | 'accountability-record' | 'public-record'
> = {
  service: 'service',
  barangay: 'barangay',
  place: 'place',
  project: 'project',
  'accountability-record': 'accountability-record',
  'public-record': 'public-record',
};

const civicRelationshipEdges = (
  record: LocalLegislationRecord
): CivicIntelligenceRelationship[] =>
  record.relationships.map((relationship, index) => ({
    id:
      'legislation-' +
      record.id +
      '-' +
      relationship.kind +
      '-' +
      relationship.targetId +
      '-' +
      index,
    kind: relationshipKindMap[relationship.kind],
    from: { type: 'legislation-record', id: record.id },
    to: {
      type: targetTypeMap[relationship.targetType],
      id: relationship.targetId,
    },
    evidence: {
      basis:
        relationship.evidence.basis === 'official-cross-reference'
          ? ('official-cross-reference' as const)
          : ('source-stated' as const),
      sourceIds: relationship.sourceIds as [string, ...string[]],
      statement: relationship.evidence.statement,
      note: relationship.note,
    },
  }));

const cityMonitorEdges = (
  record: LocalLegislationRecord
): CivicIntelligenceRelationship[] => {
  const recordIds = [
    ...record.lifecycle.flatMap(event =>
      event.cityMonitorRecordId ? [event.cityMonitorRecordId] : []
    ),
    ...record.sessionEvidence.flatMap(evidence =>
      evidence.cityMonitorRecordId ? [evidence.cityMonitorRecordId] : []
    ),
  ];

  return [...new Set(recordIds)].map(cityMonitorRecordId => ({
    id:
      'city-monitor-' +
      cityMonitorRecordId +
      '-legislation-' +
      record.id,
    kind: 'evidence-for',
    from: { type: 'city-monitor-record', id: cityMonitorRecordId },
    to: { type: 'legislation-record', id: record.id },
    evidence: {
      basis: 'canonical-id',
      note:
        'The canonical legislation lifecycle/session-evidence record explicitly stores this City Monitor record ID.',
    },
  }));
};

const publicRecordEdges = (
  record: LocalLegislationRecord
): CivicIntelligenceRelationship[] => {
  const matchedRecords = record.documents.flatMap(document => {
    const publicRecord = publicRecords.find(item => item.url === document.url);
    return publicRecord ? [publicRecord] : [];
  });

  return [...new Map(matchedRecords.map(item => [item.id, item])).values()].map(
    publicRecord => ({
      id:
        'public-record-' +
        publicRecord.id +
        '-legislation-' +
        record.id,
      kind: 'source-for' as const,
      from: { type: 'public-record' as const, id: publicRecord.id },
      to: { type: 'legislation-record' as const, id: record.id },
      evidence: {
        basis: 'shared-canonical-owner' as const,
        note:
          'The legislation record document and Public Records catalog item resolve to the same canonical source URL.',
      },
    })
  );
};

export const legislationCivicRelationships: CivicIntelligenceRelationship[] =
  localLegislationRecords.flatMap(record => [
    ...civicRelationshipEdges(record),
    ...cityMonitorEdges(record),
    ...publicRecordEdges(record),
  ]);

export const legislationCivicRelationshipIndex =
  createCivicIntelligenceRelationshipIndex(
    legislationCivicRelationships
  );

export const legislationCivicNodeResolver: CivicIntelligenceNodeResolver =
  ref => {
    if (ref.type === 'legislation-record') {
      const record = localLegislationById.get(ref.id);
      if (!record) return undefined;
      return {
        ref,
        label: record.reference.display + ' — ' + record.title,
        href: '/legislation?record=' + encodeURIComponent(record.id),
        owner: 'legislation',
      };
    }

    if (ref.type === 'service') {
      const service = serviceDirectory.find(item => item.id === ref.id);
      if (!service) return undefined;
      return {
        ref,
        label: service.title,
        href: '/services/guide/' + service.id,
        owner: 'services',
      };
    }

    if (ref.type === 'barangay') {
      const barangay = barangays.find(item => item.slug === ref.id);
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

    if (ref.type === 'city-monitor-record') {
      const record = cityMonitorRecords.find(item => item.id === ref.id);
      if (!record) return undefined;
      return {
        ref,
        label: record.title,
        href: record.relatedHref ?? '/city-monitor',
        owner: 'city-monitor',
      };
    }

    if (ref.type === 'public-record') {
      const record = publicRecords.find(item => item.id === ref.id);
      if (!record) return undefined;
      return {
        ref,
        label: record.title,
        href: record.relatedHref ?? '/records',
        owner: 'public-records',
      };
    }

    return undefined;
  };

for (const relationship of legislationCivicRelationships) {
  if (!legislationCivicNodeResolver(relationship.from)) {
    throw new Error(
      'Unresolved Legislation relationship source: ' + relationship.id
    );
  }
  if (!legislationCivicNodeResolver(relationship.to)) {
    throw new Error(
      'Unresolved Legislation relationship target: ' + relationship.id
    );
  }
}

export const legislationRelatedRecords = (
  legislationId: string
) =>
  legislationCivicRelationshipIndex
    .forRef({ type: 'legislation-record', id: legislationId })
    .map(view => ({
      ...view,
      node: legislationCivicNodeResolver(view.related),
    }))
    .filter(item => Boolean(item.node));

export const legislationForService = (serviceId: string) =>
  legislationCivicRelationshipIndex
    .forRef({ type: 'service', id: serviceId })
    .filter(view => view.related.type === 'legislation-record')
    .map(view => ({
      ...view,
      node: legislationCivicNodeResolver(view.related),
    }))
    .filter(item => Boolean(item.node));

export const legislationRelationshipCoverage = {
  total: legislationCivicRelationships.length,
  services: legislationCivicRelationships.filter(
    relationship => relationship.to.type === 'service'
  ).length,
  barangays: legislationCivicRelationships.filter(
    relationship => relationship.to.type === 'barangay'
  ).length,
  places: legislationCivicRelationships.filter(
    relationship => relationship.to.type === 'place'
  ).length,
  projects: legislationCivicRelationships.filter(
    relationship => relationship.to.type === 'project'
  ).length,
  accountability: legislationCivicRelationships.filter(
    relationship => relationship.to.type === 'accountability-record'
  ).length,
  cityMonitor: legislationCivicRelationships.filter(
    relationship =>
      relationship.from.type === 'city-monitor-record' ||
      relationship.to.type === 'city-monitor-record'
  ).length,
  publicRecords: legislationCivicRelationships.filter(
    relationship =>
      relationship.from.type === 'public-record' ||
      relationship.to.type === 'public-record'
  ).length,
} as const;
