import { accountabilityEntries } from './accountability';
import {
  createCivicIntelligenceRelationshipIndex,
  civicIntelligenceRefKey,
  type CivicIntelligenceNodeResolver,
  type CivicIntelligenceReference,
  type CivicIntelligenceRelationship,
} from './civicIntelligenceRelationships';
import { civicEcosystemResourceById } from './ecosystemResources';
import {
  integrityGraphNodes,
  integrityRelationshipSources,
  integrityRelationships,
  type IntegrityGraphRecordReference,
  type IntegrityRelationship,
} from './integrityRelationships';
import { publicRecords } from './publicRecords';

const integrityGraphNodeByKey = new Map(
  integrityGraphNodes.map(node => [
    node.ref.recordType + ':' + node.ref.id,
    node,
  ])
);

const integritySourceById = new Map(
  integrityRelationshipSources.map(source => [source.id, source] as const)
);

const publicRecordByUrl = new Map(
  publicRecords.map(record => [record.url, record] as const)
);

const sharedRefFor = (
  ref: IntegrityGraphRecordReference
): CivicIntelligenceReference => {
  if (ref.recordType === 'entity') {
    return { type: 'integrity-entity', id: ref.id };
  }
  if (ref.recordType === 'procurement-award') {
    return {
      type: 'integrity-record',
      id: ref.id,
      recordKind: 'procurement-award',
    };
  }
  if (ref.recordType === 'disclosure') {
    return {
      type: 'integrity-record',
      id: ref.id,
      recordKind: 'disclosure',
    };
  }
  if (ref.recordType === 'audit-finding') {
    return {
      type: 'integrity-record',
      id: ref.id,
      recordKind: 'audit-finding',
    };
  }
  if (ref.recordType === 'audit-action') {
    return {
      type: 'integrity-record',
      id: ref.id,
      recordKind: 'audit-action',
    };
  }
  if (ref.recordType === 'audit-resolution-trail') {
    return {
      type: 'integrity-record',
      id: ref.id,
      recordKind: 'audit-resolution-trail',
    };
  }
  return { type: 'accountability-record', id: ref.id };
};

const relationshipKindFor = (
  relationship: IntegrityRelationship
): CivicIntelligenceRelationship['kind'] => {
  if (
    relationship.kind === 'award-backed-by-accountability' ||
    relationship.kind === 'finding-backed-by-accountability'
  ) {
    return 'evidence-for';
  }
  if (relationship.kind === 'supplier-on-award') {
    return 'related-as-stated';
  }
  return 'documents';
};

const sharedEvidenceFor = (
  relationship: IntegrityRelationship
): CivicIntelligenceRelationship['evidence'] => {
  if (relationship.kind === 'supplier-on-award') {
    return {
      basis: 'source-stated',
      sourceIds: relationship.sourceIds as [string, ...string[]],
      statement:
        'The indexed procurement award record identifies this Integrity entity as a supplier on the award.',
    };
  }

  return {
    basis: 'canonical-id',
    sourceIds: relationship.sourceIds,
    note:
      'This cross-domain edge is projected from the canonical Integrity relationship graph; the underlying record keeps the detailed evidence status and continuity basis.',
  };
};

const projectedIntegrityEdges: CivicIntelligenceRelationship[] =
  integrityRelationships.map(relationship => ({
    id: 'civic-' + relationship.id,
    kind: relationshipKindFor(relationship),
    from: sharedRefFor(relationship.from),
    to: sharedRefFor(relationship.to),
    evidence: sharedEvidenceFor(relationship),
  }));

const publicRecordEdges: CivicIntelligenceRelationship[] = [];

for (const node of integrityGraphNodes) {
  if (node.ref.recordType === 'accountability-entry') continue;

  const targetRef = sharedRefFor(node.ref);
  const matched = new Map<string, (typeof publicRecords)[number]>();

  for (const sourceId of node.sourceIds) {
    const source = integritySourceById.get(sourceId);
    if (!source) continue;
    const publicRecord = publicRecordByUrl.get(source.url);
    if (publicRecord) matched.set(publicRecord.id, publicRecord);
  }

  for (const publicRecord of matched.values()) {
    publicRecordEdges.push({
      id:
        'integrity-public-record-' +
        publicRecord.id +
        '-' +
        civicIntelligenceRefKey(targetRef).replaceAll(':', '-'),
      kind: 'source-for',
      from: { type: 'public-record', id: publicRecord.id },
      to: targetRef,
      evidence: {
        basis: 'shared-canonical-owner',
        note:
          'The Integrity record and Public Records catalog item resolve to the same source URL. This link does not add or upgrade an Integrity finding.',
      },
    });
  }
}

const procurementAwardRefs = [
  ...new Map(
    integrityGraphNodes
      .filter(node => node.ref.recordType === 'procurement-award')
      .map(node => [
        node.ref.id,
        {
          type: 'integrity-record' as const,
          id: node.ref.id,
          recordKind: 'procurement-award' as const,
        },
      ])
  ).values(),
];

const ecosystemEdges: CivicIntelligenceRelationship[] =
  procurementAwardRefs.map(ref => ({
    id: 'integrity-' + ref.id + '-bettergov-philgeps',
    kind: 'continuation-resource',
    from: ref,
    to: {
      type: 'ecosystem-resource',
      id: 'philgeps',
      ecosystem: 'bettergov',
    },
    evidence: {
      basis: 'curated-ecosystem-context',
      checkedOn: '2026-09-25',
      note:
        'The audited BetterGov ecosystem map designates its procurement browser as the procurement handoff. This is discovery context only; it is not evidence for this Makati award and does not assert an exact PhilGEPS notice match.',
    },
  }));

export const integrityCivicRelationships: CivicIntelligenceRelationship[] = [
  ...projectedIntegrityEdges,
  ...publicRecordEdges,
  ...ecosystemEdges,
];

export const integrityCivicRelationshipIndex =
  createCivicIntelligenceRelationshipIndex(
    integrityCivicRelationships
  );

const integrityGraphLabel = (
  ref: IntegrityGraphRecordReference
): string | undefined =>
  integrityGraphNodeByKey.get(ref.recordType + ':' + ref.id)?.label;

const integrityRecordLabel = (
  ref: Extract<CivicIntelligenceReference, { type: 'integrity-record' }>
): string | undefined => {
  const recordType =
    ref.recordKind === 'audit-resolution-trail'
      ? 'audit-resolution-trail'
      : ref.recordKind;
  return integrityGraphLabel({ recordType, id: ref.id });
};

export const integrityCivicNodeResolver: CivicIntelligenceNodeResolver =
  ref => {
    if (ref.type === 'integrity-entity') {
      const label = integrityGraphLabel({
        recordType: 'entity',
        id: ref.id,
      });
      if (!label) return undefined;
      return {
        ref,
        label,
        href: '/integrity?view=suppliers#procurement',
        owner: 'integrity',
      };
    }

    if (ref.type === 'integrity-record') {
      const label = integrityRecordLabel(ref);
      if (!label) return undefined;
      const section =
        ref.recordKind === 'procurement-award'
          ? 'procurement'
          : ref.recordKind === 'disclosure'
            ? 'disclosures'
            : 'audits';
      return {
        ref,
        label,
        href: '/integrity#' + section,
        owner: 'integrity',
      };
    }

    if (ref.type === 'accountability-record') {
      const entry = accountabilityEntries.find(item => item.id === ref.id);
      if (!entry) return undefined;
      return {
        ref,
        label: entry.title,
        href:
          '/accountability?type=' +
          encodeURIComponent(entry.type) +
          '#' +
          entry.id,
        owner: 'accountability',
      };
    }

    if (ref.type === 'public-record') {
      const record = publicRecords.find(item => item.id === ref.id);
      if (!record) return undefined;
      return {
        ref,
        label: record.title,
        href: '/records',
        owner: 'public-records',
      };
    }

    if (ref.type === 'ecosystem-resource') {
      const resource = civicEcosystemResourceById.get(ref.id);
      if (!resource || resource.ecosystem !== ref.ecosystem) {
        return undefined;
      }
      return {
        ref,
        label: resource.name,
        href: resource.href,
        owner: 'ecosystem',
      };
    }

    return undefined;
  };

for (const relationship of integrityCivicRelationships) {
  if (!integrityCivicNodeResolver(relationship.from)) {
    throw new Error(
      'Unresolved Integrity civic relationship source: ' +
        relationship.id
    );
  }
  if (!integrityCivicNodeResolver(relationship.to)) {
    throw new Error(
      'Unresolved Integrity civic relationship target: ' +
        relationship.id
    );
  }
}

const resolvedForRef = (ref: CivicIntelligenceReference) =>
  integrityCivicRelationshipIndex
    .forRef(ref)
    .map(view => ({
      ...view,
      node: integrityCivicNodeResolver(view.related),
    }))
    .filter(item => Boolean(item.node));

export const integrityRelatedRecords = (
  ref: CivicIntelligenceReference
) => resolvedForRef(ref);

export const integrityForAccountability = (
  accountabilityId: string
) =>
  resolvedForRef({
    type: 'accountability-record',
    id: accountabilityId,
  }).filter(
    item =>
      item.related.type === 'integrity-record' ||
      item.related.type === 'integrity-entity'
  );

export const integrityProcurementContextLinks = () => {
  const seen = new Set<string>();
  return procurementAwardRefs
    .flatMap(ref => resolvedForRef(ref))
    .filter(item => item.node?.owner === 'ecosystem')
    .filter(item => {
      const href = item.node?.href;
      if (!href || seen.has(href)) return false;
      seen.add(href);
      return true;
    });
};

export const integrityCivicRelationshipCoverage = {
  projectedIntegrityEdges: projectedIntegrityEdges.length,
  publicRecordEdges: publicRecordEdges.length,
  procurementEcosystemEdges: ecosystemEdges.length,
  placeEdges: 0,
  duplicateProjectAliasEdges: 0,
} as const;
