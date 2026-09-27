import { barangays } from './barangays';
import {
  civicAreaById,
  civicAreaRelationships,
  civicOrganizationById,
  type CivicAreaRelationshipKind,
} from './areaOrganizationRegistry';
import {
  createCivicIntelligenceRelationshipIndex,
  type CivicIntelligenceNodeResolver,
  type CivicIntelligenceRelationship,
} from './civicIntelligenceRelationships';
import { placeRegistryById } from './placeRegistry';

const civicRelationshipKindForAreaRelationship: Record<
  CivicAreaRelationshipKind,
  CivicIntelligenceRelationship['kind']
> = {
  'within-area': 'located-in',
  'within-barangay': 'located-in',
  'managed-by': 'managed-by',
  'developed-by': 'developed-by',
  'operated-by': 'operated-by',
  'place-within-area': 'located-in',
};

const civicReferenceForAreaRef = (
  ref:
    | { type: 'area'; id: string }
    | { type: 'organization'; id: string }
    | { type: 'place'; id: string }
    | { type: 'barangay'; id: string }
) => ({
  type: ref.type,
  id: ref.id,
}) as const;

export const areaOrganizationCivicRelationships: CivicIntelligenceRelationship[] =
  civicAreaRelationships.map(relationship => ({
    id: 'area-registry-' + relationship.id,
    kind: civicRelationshipKindForAreaRelationship[relationship.kind],
    from: civicReferenceForAreaRef(relationship.from),
    to: civicReferenceForAreaRef(relationship.to),
    evidence: {
      basis: 'source-stated' as const,
      sourceIds: relationship.evidence.sourceIds as [string, ...string[]],
      statement:
        relationship.evidence.statement ??
        'This relationship is explicitly stored in the canonical Area + Organization Registry.',
      checkedOn: relationship.evidence.checkedOn,
      note:
        (relationship.evidence.note
          ? relationship.evidence.note + ' '
          : '') +
        'Evidence strength in the canonical area registry: ' +
        relationship.evidence.evidenceStrength +
        '.',
    },
  }));

export const areaOrganizationCivicRelationshipIndex =
  createCivicIntelligenceRelationshipIndex(
    areaOrganizationCivicRelationships
  );

export const areaOrganizationCivicNodeResolver: CivicIntelligenceNodeResolver =
  ref => {
    if (ref.type === 'area') {
      const area = civicAreaById.get(ref.id);
      if (!area) return undefined;
      return {
        ref,
        label: area.name,
        href: '/estates#area-' + area.id,
        owner: 'area-registry',
      };
    }

    if (ref.type === 'organization') {
      const organization = civicOrganizationById.get(ref.id);
      if (!organization) return undefined;
      return {
        ref,
        label: organization.name,
        href: '/estates#organization-' + organization.id,
        owner: 'area-registry',
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

    return undefined;
  };

for (const relationship of areaOrganizationCivicRelationships) {
  if (!areaOrganizationCivicNodeResolver(relationship.from)) {
    throw new Error(
      'Unresolved Area/Organization Civic Intelligence relationship source: ' +
        relationship.id
    );
  }

  if (!areaOrganizationCivicNodeResolver(relationship.to)) {
    throw new Error(
      'Unresolved Area/Organization Civic Intelligence relationship target: ' +
        relationship.id
    );
  }
}

export const civicRelationshipsForArea = (areaId: string) =>
  areaOrganizationCivicRelationshipIndex.forRef({
    type: 'area',
    id: areaId,
  });

export const civicRelationshipsForOrganization = (
  organizationId: string
) =>
  areaOrganizationCivicRelationshipIndex.forRef({
    type: 'organization',
    id: organizationId,
  });

export const civicRelationshipsForAreaPlace = (placeId: string) =>
  areaOrganizationCivicRelationshipIndex.forRef({
    type: 'place',
    id: placeId,
  });

export const civicRelationshipsForAreaBarangay = (
  barangaySlug: string
) =>
  areaOrganizationCivicRelationshipIndex.forRef({
    type: 'barangay',
    id: barangaySlug,
  });

export const areaOrganizationCivicRelationshipCoverage = {
  total: areaOrganizationCivicRelationships.length,
  areas: civicAreaById.size,
  organizations: civicOrganizationById.size,
  places: areaOrganizationCivicRelationships.filter(
    relationship =>
      relationship.from.type === 'place' ||
      relationship.to.type === 'place'
  ).length,
  barangays: areaOrganizationCivicRelationships.filter(
    relationship =>
      relationship.from.type === 'barangay' ||
      relationship.to.type === 'barangay'
  ).length,
  management: areaOrganizationCivicRelationships.filter(
    relationship =>
      relationship.kind === 'managed-by' ||
      relationship.kind === 'operated-by'
  ).length,
  development: areaOrganizationCivicRelationships.filter(
    relationship => relationship.kind === 'developed-by'
  ).length,
} as const;
