import {
  auditFindingEntries,
  procurementProjectEntries,
} from './accountabilitySupplement';
import {
  integrityEntityById,
  integrityProcurementAwards,
  integrityProcurementEntities,
  integrityProcurementSources,
} from './integrityData';
import {
  integrityDisclosureRecords,
  integrityDisclosureSources,
} from './integrityDisclosures';
import {
  integrityAuditActions,
  integrityAuditFindings,
  integrityAuditResolutionTrails,
  integrityAuditSources,
} from './integrityAuditTrails';
import type {
  IntegrityRecordReference,
  IntegritySource,
} from './integrityTypes';

export type IntegrityGraphRecordReference =
  | IntegrityRecordReference
  | {
      recordType: 'audit-resolution-trail';
      id: string;
    };

export type IntegrityRelationshipKind =
  | 'supplier-on-award'
  | 'award-backed-by-accountability'
  | 'entity-disclosure-record'
  | 'finding-backed-by-accountability'
  | 'finding-action-evidence'
  | 'finding-resolution-trail'
  | 'trail-action-evidence';

export type IntegrityRelationshipBasis =
  | 'canonical-id'
  | 'source-backed'
  | 'research-classification'
  | 'explicit-finding-reference'
  | 'unresolved-continuity';

export interface IntegrityRelationship {
  id: string;
  kind: IntegrityRelationshipKind;
  from: IntegrityGraphRecordReference;
  to: IntegrityGraphRecordReference;
  basis: IntegrityRelationshipBasis;
  sourceIds: string[];
}

export interface IntegrityGraphNode {
  ref: IntegrityGraphRecordReference;
  label: string;
  sourceIds: string[];
}

const unique = (values: string[]) => [...new Set(values)];

export const integrityRelationshipSources: IntegritySource[] = [
  ...integrityProcurementSources,
  ...integrityDisclosureSources,
  ...integrityAuditSources,
].filter(
  (source, index, sources) =>
    sources.findIndex(candidate => candidate.id === source.id) === index
);

const sourceIds = new Set(
  integrityRelationshipSources.map(source => source.id)
);

const procurementAccountabilityById = new Map(
  procurementProjectEntries.map(entry => [entry.id, entry])
);
const auditAccountabilityById = new Map(
  auditFindingEntries.map(entry => [entry.id, entry])
);

const disclosureSourceIds = (record: (typeof integrityDisclosureRecords)[number]) =>
  record.assessment.status === 'source-backed'
    ? [...record.assessment.sourceIds]
    : [...(record.assessment.sourceIds ?? [])];

const auditActionById = new Map(
  integrityAuditActions.map(action => [action.id, action])
);

const auditFindingById = new Map(
  integrityAuditFindings.map(finding => [finding.id, finding])
);

const resolutionTrailId = (findingId: string) =>
  'resolution-' + findingId.replace(/^finding-/, '');

const relationships: IntegrityRelationship[] = [];

for (const award of integrityProcurementAwards) {
  for (const entityId of award.supplierEntityIds) {
    if (!integrityEntityById.has(entityId)) {
      throw new Error('Broken supplier entity target: ' + entityId);
    }

    relationships.push({
      id: 'relationship-' + entityId + '-' + award.id,
      kind: 'supplier-on-award',
      from: { recordType: 'entity', id: entityId },
      to: { recordType: 'procurement-award', id: award.id },
      basis: 'source-backed',
      sourceIds: [...award.sourceIds],
    });
  }

  if (!procurementAccountabilityById.has(award.accountabilityEntryId)) {
    throw new Error(
      'Broken procurement Accountability target: ' +
        award.accountabilityEntryId
    );
  }

  relationships.push({
    id: 'relationship-' + award.id + '-' + award.accountabilityEntryId,
    kind: 'award-backed-by-accountability',
    from: { recordType: 'procurement-award', id: award.id },
    to: {
      recordType: 'accountability-entry',
      id: award.accountabilityEntryId,
    },
    basis: 'canonical-id',
    sourceIds: [...award.sourceIds],
  });
}

for (const disclosure of integrityDisclosureRecords) {
  const entityId = disclosure.subjectEntityId;
  if (!entityId || !integrityEntityById.has(entityId)) {
    throw new Error(
      'Broken disclosure subject entity target: ' + disclosure.id
    );
  }

  relationships.push({
    id: 'relationship-' + entityId + '-' + disclosure.id,
    kind: 'entity-disclosure-record',
    from: { recordType: 'entity', id: entityId },
    to: { recordType: 'disclosure', id: disclosure.id },
    basis:
      disclosure.assessment.status === 'source-backed'
        ? 'source-backed'
        : 'research-classification',
    sourceIds: disclosureSourceIds(disclosure),
  });
}

for (const finding of integrityAuditFindings) {
  if (!auditAccountabilityById.has(finding.accountabilityEntryId)) {
    throw new Error(
      'Broken audit Accountability target: ' + finding.accountabilityEntryId
    );
  }

  relationships.push({
    id:
      'relationship-' +
      finding.id +
      '-' +
      finding.accountabilityEntryId,
    kind: 'finding-backed-by-accountability',
    from: { recordType: 'audit-finding', id: finding.id },
    to: {
      recordType: 'accountability-entry',
      id: finding.accountabilityEntryId,
    },
    basis: 'canonical-id',
    sourceIds: [...finding.sourceIds],
  });
}

for (const action of integrityAuditActions) {
  if (!auditFindingById.has(action.findingId)) {
    throw new Error('Broken audit finding target: ' + action.findingId);
  }

  relationships.push({
    id: 'relationship-' + action.findingId + '-' + action.id,
    kind: 'finding-action-evidence',
    from: { recordType: 'audit-finding', id: action.findingId },
    to: { recordType: 'audit-action', id: action.id },
    basis:
      action.continuityBasis === 'explicit-finding-reference'
        ? 'explicit-finding-reference'
        : 'unresolved-continuity',
    sourceIds: [...action.sourceIds],
  });
}

for (const trail of integrityAuditResolutionTrails) {
  const finding = auditFindingById.get(trail.findingId);
  if (!finding) {
    throw new Error(
      'Broken resolution-trail finding target: ' + trail.findingId
    );
  }

  const trailId = resolutionTrailId(trail.findingId);
  const trailSourceIds = unique(
    trail.actionEvidenceIds.flatMap(actionId => {
      const action = auditActionById.get(actionId);
      if (!action) {
        throw new Error(
          'Broken resolution-trail action target: ' + actionId
        );
      }
      return action.sourceIds;
    })
  );

  relationships.push({
    id: 'relationship-' + trail.findingId + '-' + trailId,
    kind: 'finding-resolution-trail',
    from: { recordType: 'audit-finding', id: trail.findingId },
    to: { recordType: 'audit-resolution-trail', id: trailId },
    basis:
      trail.resolution.status === 'unresolved'
        ? 'unresolved-continuity'
        : 'source-backed',
    sourceIds: trailSourceIds,
  });

  for (const actionId of trail.actionEvidenceIds) {
    const action = auditActionById.get(actionId);
    if (!action) {
      throw new Error(
        'Broken resolution-trail action target: ' + actionId
      );
    }

    relationships.push({
      id: 'relationship-' + trailId + '-' + actionId,
      kind: 'trail-action-evidence',
      from: { recordType: 'audit-resolution-trail', id: trailId },
      to: { recordType: 'audit-action', id: actionId },
      basis:
        action.continuityBasis === 'unresolved'
          ? 'unresolved-continuity'
          : 'explicit-finding-reference',
      sourceIds: [...action.sourceIds],
    });
  }
}

export const integrityRelationships = relationships;

const accountabilityNodes: IntegrityGraphNode[] = [
  ...integrityProcurementAwards.map(award => {
    const entry = procurementAccountabilityById.get(
      award.accountabilityEntryId
    );
    if (!entry) {
      throw new Error(
        'Missing procurement Accountability node: ' +
          award.accountabilityEntryId
      );
    }
    return {
      ref: {
        recordType: 'accountability-entry' as const,
        id: entry.id,
      },
      label: entry.title,
      sourceIds: [...award.sourceIds],
    };
  }),
  ...integrityAuditFindings.map(finding => {
    const entry = auditAccountabilityById.get(finding.accountabilityEntryId);
    if (!entry) {
      throw new Error(
        'Missing audit Accountability node: ' +
          finding.accountabilityEntryId
      );
    }
    return {
      ref: {
        recordType: 'accountability-entry' as const,
        id: entry.id,
      },
      label: entry.title,
      sourceIds: [...finding.sourceIds],
    };
  }),
].filter(
  (node, index, nodes) =>
    nodes.findIndex(
      candidate =>
        candidate.ref.recordType === node.ref.recordType &&
        candidate.ref.id === node.ref.id
    ) === index
);

export const integrityGraphNodes: IntegrityGraphNode[] = [
  ...integrityProcurementEntities.map(entity => ({
    ref: { recordType: 'entity' as const, id: entity.id },
    label: entity.canonicalName,
    sourceIds: [...entity.sourceIds],
  })),
  ...integrityProcurementAwards.map(award => ({
    ref: { recordType: 'procurement-award' as const, id: award.id },
    label: award.title,
    sourceIds: [...award.sourceIds],
  })),
  ...integrityDisclosureRecords.map(disclosure => ({
    ref: { recordType: 'disclosure' as const, id: disclosure.id },
    label: disclosure.kind,
    sourceIds: disclosureSourceIds(disclosure),
  })),
  ...integrityAuditFindings.map(finding => ({
    ref: { recordType: 'audit-finding' as const, id: finding.id },
    label: finding.title,
    sourceIds: [...finding.sourceIds],
  })),
  ...integrityAuditActions.map(action => ({
    ref: { recordType: 'audit-action' as const, id: action.id },
    label: action.kind,
    sourceIds: [...action.sourceIds],
  })),
  ...integrityAuditResolutionTrails.map(trail => {
    const finding = auditFindingById.get(trail.findingId);
    if (!finding) {
      throw new Error(
        'Missing finding for resolution node: ' + trail.findingId
      );
    }
    return {
      ref: {
        recordType: 'audit-resolution-trail' as const,
        id: resolutionTrailId(trail.findingId),
      },
      label: 'Resolution trail: ' + finding.title,
      sourceIds: unique(
        trail.actionEvidenceIds.flatMap(actionId => {
          const action = auditActionById.get(actionId);
          if (!action) {
            throw new Error(
              'Missing action for resolution node: ' + actionId
            );
          }
          return action.sourceIds;
        })
      ),
    };
  }),
  ...accountabilityNodes,
];

const graphNodeKeys = new Set(
  integrityGraphNodes.map(
    node => node.ref.recordType + ':' + node.ref.id
  )
);

for (const relationship of integrityRelationships) {
  const fromKey =
    relationship.from.recordType + ':' + relationship.from.id;
  const toKey = relationship.to.recordType + ':' + relationship.to.id;

  if (!graphNodeKeys.has(fromKey)) {
    throw new Error(
      'Integrity relationship has broken from-target: ' +
        relationship.id +
        ' -> ' +
        fromKey
    );
  }
  if (!graphNodeKeys.has(toKey)) {
    throw new Error(
      'Integrity relationship has broken to-target: ' +
        relationship.id +
        ' -> ' +
        toKey
    );
  }

  for (const sourceId of relationship.sourceIds) {
    if (!sourceIds.has(sourceId)) {
      throw new Error(
        'Integrity relationship has unknown provenance source: ' +
          relationship.id +
          ' -> ' +
          sourceId
      );
    }
  }
}

export const integrityRelationshipsByRecord = new Map<
  string,
  IntegrityRelationship[]
>();

for (const relationship of integrityRelationships) {
  for (const ref of [relationship.from, relationship.to]) {
    const key = ref.recordType + ':' + ref.id;
    const existing = integrityRelationshipsByRecord.get(key) ?? [];
    existing.push(relationship);
    integrityRelationshipsByRecord.set(key, existing);
  }
}
