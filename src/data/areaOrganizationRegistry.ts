export type CivicAreaKind =
  | 'business-district'
  | 'commercial-estate'
  | 'mixed-use-estate'
  | 'named-subdistrict'
  | 'residential-village'
  | 'other-managed-area';

export type CivicOrganizationKind =
  | 'estate-association'
  | 'homeowners-association'
  | 'developer'
  | 'property-manager'
  | 'government'
  | 'other';

export type CivicAreaSourceKind =
  | 'official-primary'
  | 'official-secondary'
  | 'reference-map'
  | 'secondary-reporting'
  | 'other';

export interface CivicAreaRegistrySource {
  id: string;
  label: string;
  url: string;
  publisher?: string;
  publishedOrPeriod?: string;
  checkedOn?: string;
  kind: CivicAreaSourceKind;
}

export interface CivicRegistryAlias {
  name: string;
  kind:
    | 'current-alternate'
    | 'former-name'
    | 'historical-name'
    | 'abbreviation'
    | 'local-name'
    | 'unclassified';
  note?: string;
}

export interface CivicAreaAssertion {
  fieldPaths: string[];
  sourceIds: string[];
  evidenceStrength: 'direct' | 'corroborated' | 'inferred';
  note?: string;
}

export interface CivicAreaGeometry {
  kind:
    | 'official-boundary'
    | 'source-defined-boundary'
    | 'approximate-boundary';
  geometryRef: string;
  sourceIds: string[];
  note?: string;
}

export interface CivicAreaAttribute {
  label: string;
  value: string;
  sourceIds: string[];
  note?: string;
}

export interface CivicAreaRecord {
  id: string;
  name: string;
  kind: CivicAreaKind;
  aliases?: CivicRegistryAlias[];
  summary?: string;

  /**
   * Government geographies the area overlaps or sits within.
   * More than one barangay is allowed. This is not an area polygon.
   */
  barangaySlugs: string[];

  /**
   * Optional sourced geometry. Area records do not require a point,
   * centroid or polygon in order to exist canonically.
   */
  geometry?: CivicAreaGeometry;

  attributes?: CivicAreaAttribute[];

  provenance: {
    assertions: CivicAreaAssertion[];
  };

  tags: string[];
}

export interface CivicOrganizationChannel {
  kind:
    | 'official-website'
    | 'advisories'
    | 'contact'
    | 'resident-portal'
    | 'developer-site'
    | 'other';
  label: string;
  url: string;
  sourceIds: string[];
  note?: string;
}

export interface CivicOrganizationRecord {
  id: string;
  name: string;
  kind: CivicOrganizationKind;
  abbreviations?: string[];
  aliases?: CivicRegistryAlias[];
  summary?: string;
  channels: CivicOrganizationChannel[];
  provenance: {
    assertions: CivicAreaAssertion[];
  };
  tags: string[];
}

export type CivicAreaRelationshipReference =
  | { type: 'area'; id: string }
  | { type: 'organization'; id: string }
  | { type: 'place'; id: string }
  | { type: 'barangay'; id: string };

export type CivicAreaRelationshipKind =
  | 'within-area'
  | 'within-barangay'
  | 'managed-by'
  | 'developed-by'
  | 'operated-by'
  | 'place-within-area';

export interface CivicAreaRelationshipEvidence {
  sourceIds: string[];
  evidenceStrength: 'direct' | 'corroborated' | 'inferred';
  statement?: string;
  checkedOn?: string;
  note?: string;
}

export interface CivicAreaRelationship {
  id: string;
  kind: CivicAreaRelationshipKind;
  from: CivicAreaRelationshipReference;
  to: CivicAreaRelationshipReference;
  evidence: CivicAreaRelationshipEvidence;
}

const nonEmpty = (value: string, field: string) => {
  if (!value.trim()) {
    throw new Error('Civic area registry ' + field + ' must not be empty.');
  }
};

const assertUniqueIds = (
  records: readonly { id: string }[],
  label: string
) => {
  const ids = new Set<string>();

  for (const record of records) {
    nonEmpty(record.id, label + ' id');
    if (ids.has(record.id)) {
      throw new Error('Duplicate ' + label + ' id: ' + record.id);
    }
    ids.add(record.id);
  }

  return ids;
};

const validateUrl = (url: string, field: string) => {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    throw new Error('Invalid Civic area registry ' + field + ': ' + url);
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error(
      'Unsupported Civic area registry URL protocol for ' + field + ': ' + url
    );
  }
};

const relationshipKey = (ref: CivicAreaRelationshipReference) =>
  ref.type + ':' + ref.id;

const expectedRelationshipEnds: Record<
  CivicAreaRelationshipKind,
  [CivicAreaRelationshipReference['type'], CivicAreaRelationshipReference['type']]
> = {
  'within-area': ['area', 'area'],
  'within-barangay': ['area', 'barangay'],
  'managed-by': ['area', 'organization'],
  'developed-by': ['area', 'organization'],
  'operated-by': ['area', 'organization'],
  'place-within-area': ['place', 'area'],
};

export const validateAreaOrganizationRegistry = ({
  sources,
  areas,
  organizations,
  relationships,
}: {
  sources: readonly CivicAreaRegistrySource[];
  areas: readonly CivicAreaRecord[];
  organizations: readonly CivicOrganizationRecord[];
  relationships: readonly CivicAreaRelationship[];
}) => {
  const sourceIds = assertUniqueIds(sources, 'source');
  const areaIds = assertUniqueIds(areas, 'area');
  const organizationIds = assertUniqueIds(organizations, 'organization');
  const relationshipIds = assertUniqueIds(relationships, 'relationship');

  void relationshipIds;

  const requireSources = (
    ids: readonly string[],
    owner: string
  ) => {
    if (!ids.length) {
      throw new Error(owner + ' must cite at least one source.');
    }

    for (const sourceId of ids) {
      if (!sourceIds.has(sourceId)) {
        throw new Error(
          owner + ' cites missing Civic area registry source: ' + sourceId
        );
      }
    }
  };

  for (const source of sources) {
    nonEmpty(source.label, 'source label');
    validateUrl(source.url, 'source URL');
  }

  for (const area of areas) {
    nonEmpty(area.name, 'area name');

    if (new Set(area.barangaySlugs).size !== area.barangaySlugs.length) {
      throw new Error('Duplicate barangay relationship on area: ' + area.id);
    }

    area.provenance.assertions.forEach((assertion, index) =>
      requireSources(
        assertion.sourceIds,
        'Area assertion ' + area.id + '[' + index + ']'
      )
    );

    area.attributes?.forEach((attribute, index) =>
      requireSources(
        attribute.sourceIds,
        'Area attribute ' + area.id + '[' + index + ']'
      )
    );

    if (area.geometry) {
      nonEmpty(area.geometry.geometryRef, 'area geometry reference');
      requireSources(area.geometry.sourceIds, 'Area geometry ' + area.id);
    }
  }

  for (const organization of organizations) {
    nonEmpty(organization.name, 'organization name');

    organization.provenance.assertions.forEach((assertion, index) =>
      requireSources(
        assertion.sourceIds,
        'Organization assertion ' + organization.id + '[' + index + ']'
      )
    );

    for (const channel of organization.channels) {
      nonEmpty(channel.label, 'organization channel label');
      validateUrl(channel.url, 'organization channel URL');
      requireSources(
        channel.sourceIds,
        'Organization channel ' + organization.id + ':' + channel.kind
      );
    }
  }

  for (const relationship of relationships) {
    const [expectedFrom, expectedTo] = expectedRelationshipEnds[
      relationship.kind
    ];

    if (
      relationship.from.type !== expectedFrom ||
      relationship.to.type !== expectedTo
    ) {
      throw new Error(
        'Invalid endpoints for ' +
          relationship.kind +
          ': ' +
          relationshipKey(relationship.from) +
          ' -> ' +
          relationshipKey(relationship.to)
      );
    }

    nonEmpty(relationship.from.id, 'relationship from id');
    nonEmpty(relationship.to.id, 'relationship to id');

    if (
      relationship.kind === 'within-area' &&
      relationship.from.id === relationship.to.id
    ) {
      throw new Error(
        'Area cannot be within itself: ' + relationship.from.id
      );
    }

    if (
      relationship.from.type === 'area' &&
      !areaIds.has(relationship.from.id)
    ) {
      throw new Error(
        'Relationship points from missing area: ' + relationship.from.id
      );
    }
    if (
      relationship.to.type === 'area' &&
      !areaIds.has(relationship.to.id)
    ) {
      throw new Error(
        'Relationship points to missing area: ' + relationship.to.id
      );
    }
    if (
      relationship.from.type === 'organization' &&
      !organizationIds.has(relationship.from.id)
    ) {
      throw new Error(
        'Relationship points from missing organization: ' +
          relationship.from.id
      );
    }
    if (
      relationship.to.type === 'organization' &&
      !organizationIds.has(relationship.to.id)
    ) {
      throw new Error(
        'Relationship points to missing organization: ' + relationship.to.id
      );
    }

    requireSources(
      relationship.evidence.sourceIds,
      'Relationship evidence ' + relationship.id
    );
  }

  return true;
};

/**
 * W5-3b1 introduces the canonical schema only.
 * W5-3b2 will populate source-backed area, organization and relationship records.
 */
export const civicAreaRegistrySources: CivicAreaRegistrySource[] = [];
export const civicAreas: CivicAreaRecord[] = [];
export const civicOrganizations: CivicOrganizationRecord[] = [];
export const civicAreaRelationships: CivicAreaRelationship[] = [];

validateAreaOrganizationRegistry({
  sources: civicAreaRegistrySources,
  areas: civicAreas,
  organizations: civicOrganizations,
  relationships: civicAreaRelationships,
});

export const civicAreaById = new Map(
  civicAreas.map(area => [area.id, area])
);

export const civicOrganizationById = new Map(
  civicOrganizations.map(organization => [organization.id, organization])
);

export const civicAreaRelationshipsFor = (
  ref: CivicAreaRelationshipReference
) =>
  civicAreaRelationships.filter(
    relationship =>
      relationshipKey(relationship.from) === relationshipKey(ref) ||
      relationshipKey(relationship.to) === relationshipKey(ref)
  );
