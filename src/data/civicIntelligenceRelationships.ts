/**
 * Cross-domain Civic Intelligence relationship model.
 *
 * Canonical records remain owned by their domain modules. This layer stores
 * references and relationship evidence only; it does not copy titles, URLs,
 * amounts, dates, status fields or source records from those modules.
 */

export type CivicIntelligenceNodeType =
  | 'indicator'
  | 'legislation-record'
  | 'integrity-entity'
  | 'integrity-record'
  | 'report'
  | 'place'
  | 'segment'
  | 'route'
  | 'barangay'
  | 'service'
  | 'project'
  | 'accountability-record'
  | 'city-monitor-record'
  | 'public-record'
  | 'ecosystem-resource';

export type CivicIntelligenceIntegrityRecordKind =
  | 'procurement-award'
  | 'disclosure'
  | 'audit-finding'
  | 'audit-action'
  | 'audit-resolution-trail';

export type CivicIntelligenceEcosystem =
  | 'bettergov'
  | 'betterlgu';

type BasicCivicIntelligenceReferenceType = Exclude<
  CivicIntelligenceNodeType,
  'integrity-record' | 'ecosystem-resource'
>;

export type CivicIntelligenceReference =
  | {
      type: BasicCivicIntelligenceReferenceType;
      id: string;
    }
  | {
      type: 'integrity-record';
      id: string;
      recordKind: CivicIntelligenceIntegrityRecordKind;
    }
  | {
      type: 'ecosystem-resource';
      id: string;
      ecosystem: CivicIntelligenceEcosystem;
    };

export type CivicIntelligenceRelationshipKind =
  | 'applies-to'
  | 'affects'
  | 'located-in'
  | 'context-for'
  | 'evidence-for'
  | 'documents'
  | 'monitors'
  | 'synthesizes'
  | 'source-for'
  | 'authorizes'
  | 'funds'
  | 'implemented-by'
  | 'comparison-context'
  | 'continuation-resource'
  | 'related-as-stated';

export type CivicIntelligenceRelationshipEvidence =
  | {
      basis:
        | 'canonical-id'
        | 'shared-canonical-owner'
        | 'declared-analysis-input'
        | 'explicit-geography';
      sourceIds?: string[];
      note?: string;
    }
  | {
      basis: 'official-cross-reference' | 'source-stated';
      sourceIds: [string, ...string[]];
      statement: string;
      checkedOn?: string;
      note?: string;
    }
  | {
      basis: 'curated-ecosystem-context';
      note: string;
      checkedOn?: string;
    };

export interface CivicIntelligenceRelationship {
  id: string;
  kind: CivicIntelligenceRelationshipKind;
  from: CivicIntelligenceReference;
  to: CivicIntelligenceReference;
  evidence: CivicIntelligenceRelationshipEvidence;
}

/**
 * Labels and routes are resolved from canonical owners at render time.
 * A resolver may be composed from domain-specific resolvers without making
 * this relationship module import those domains.
 */
export interface CivicIntelligenceNodeDescriptor {
  ref: CivicIntelligenceReference;
  label: string;
  href: string;
  owner:
    | 'statistics'
    | 'legislation'
    | 'integrity'
    | 'reports'
    | 'place-registry'
    | 'barangays'
    | 'services'
    | 'accountability'
    | 'city-monitor'
    | 'public-records'
    | 'ecosystem';
}

export type CivicIntelligenceNodeResolver = (
  ref: CivicIntelligenceReference
) => CivicIntelligenceNodeDescriptor | undefined;

export type CivicIntelligenceRelationshipDirection =
  | 'outbound'
  | 'inbound';

export interface CivicIntelligenceRelationshipView {
  relationship: CivicIntelligenceRelationship;
  direction: CivicIntelligenceRelationshipDirection;
  self: CivicIntelligenceReference;
  related: CivicIntelligenceReference;
}

export interface ResolvedCivicIntelligenceRelationshipView
  extends CivicIntelligenceRelationshipView {
  selfNode?: CivicIntelligenceNodeDescriptor;
  relatedNode?: CivicIntelligenceNodeDescriptor;
}

const nonEmpty = (value: string, field: string) => {
  if (!value.trim()) {
    throw new Error('Civic Intelligence ' + field + ' must not be empty.');
  }
};

export const civicIntelligenceRefKey = (
  ref: CivicIntelligenceReference
): string => {
  const suffix =
    ref.type === 'integrity-record'
      ? ':' + ref.recordKind
      : ref.type === 'ecosystem-resource'
        ? ':' + ref.ecosystem
        : '';
  return ref.type + suffix + ':' + ref.id;
};

export const sameCivicIntelligenceRef = (
  left: CivicIntelligenceReference,
  right: CivicIntelligenceReference
) => civicIntelligenceRefKey(left) === civicIntelligenceRefKey(right);

const semanticEdgeKey = (
  relationship: CivicIntelligenceRelationship
): string => {
  const ends = [
    civicIntelligenceRefKey(relationship.from),
    civicIntelligenceRefKey(relationship.to),
  ].sort();
  return relationship.kind + ':' + ends.join('<->');
};

const validateReference = (ref: CivicIntelligenceReference) => {
  nonEmpty(ref.id, 'reference id');

  if (ref.type === 'ecosystem-resource') {
    if (!['bettergov', 'betterlgu'].includes(ref.ecosystem)) {
      throw new Error(
        'Unsupported Civic Intelligence ecosystem: ' + ref.ecosystem
      );
    }
  }
};

export const validateCivicIntelligenceRelationships = (
  relationships: readonly CivicIntelligenceRelationship[]
) => {
  const ids = new Set<string>();
  const semanticEdges = new Set<string>();

  for (const relationship of relationships) {
    nonEmpty(relationship.id, 'relationship id');
    validateReference(relationship.from);
    validateReference(relationship.to);

    if (ids.has(relationship.id)) {
      throw new Error(
        'Duplicate Civic Intelligence relationship id: ' + relationship.id
      );
    }
    ids.add(relationship.id);

    if (
      sameCivicIntelligenceRef(relationship.from, relationship.to)
    ) {
      throw new Error(
        'Civic Intelligence relationship cannot link a record to itself: ' +
          relationship.id
      );
    }

    const semanticKey = semanticEdgeKey(relationship);
    if (semanticEdges.has(semanticKey)) {
      throw new Error(
        'Duplicate/reverse Civic Intelligence relationship must be derived as a backlink, not stored twice: ' +
          semanticKey
      );
    }
    semanticEdges.add(semanticKey);

    if (
      relationship.evidence.basis === 'official-cross-reference' ||
      relationship.evidence.basis === 'source-stated'
    ) {
      if (!relationship.evidence.sourceIds.length) {
        throw new Error(
          'Source-backed Civic Intelligence relationship needs source ids: ' +
            relationship.id
        );
      }
      nonEmpty(
        relationship.evidence.statement,
        'source-backed evidence statement'
      );
    }

    if (
      relationship.evidence.basis === 'curated-ecosystem-context'
    ) {
      nonEmpty(
        relationship.evidence.note,
        'ecosystem-context evidence note'
      );
    }
  }

  return true;
};

export const createCivicIntelligenceRelationshipIndex = (
  relationships: readonly CivicIntelligenceRelationship[]
) => {
  validateCivicIntelligenceRelationships(relationships);

  const byNode = new Map<
    string,
    CivicIntelligenceRelationshipView[]
  >();

  const append = (
    ref: CivicIntelligenceReference,
    view: CivicIntelligenceRelationshipView
  ) => {
    const key = civicIntelligenceRefKey(ref);
    const current = byNode.get(key) ?? [];
    current.push(view);
    byNode.set(key, current);
  };

  for (const relationship of relationships) {
    append(relationship.from, {
      relationship,
      direction: 'outbound',
      self: relationship.from,
      related: relationship.to,
    });
    append(relationship.to, {
      relationship,
      direction: 'inbound',
      self: relationship.to,
      related: relationship.from,
    });
  }

  return {
    all: [...relationships],
    forRef: (ref: CivicIntelligenceReference) => [
      ...(byNode.get(civicIntelligenceRefKey(ref)) ?? []),
    ],
    outboundFrom: (ref: CivicIntelligenceReference) =>
      (byNode.get(civicIntelligenceRefKey(ref)) ?? []).filter(
        view => view.direction === 'outbound'
      ),
    inboundTo: (ref: CivicIntelligenceReference) =>
      (byNode.get(civicIntelligenceRefKey(ref)) ?? []).filter(
        view => view.direction === 'inbound'
      ),
  };
};

export const resolveCivicIntelligenceRelationshipViews = (
  views: readonly CivicIntelligenceRelationshipView[],
  resolver: CivicIntelligenceNodeResolver
): ResolvedCivicIntelligenceRelationshipView[] =>
  views.map(view => ({
    ...view,
    selfNode: resolver(view.self),
    relatedNode: resolver(view.related),
  }));

export const composeCivicIntelligenceNodeResolvers = (
  ...resolvers: CivicIntelligenceNodeResolver[]
): CivicIntelligenceNodeResolver =>
  ref => {
    for (const resolver of resolvers) {
      const node = resolver(ref);
      if (node) return node;
    }
    return undefined;
  };
