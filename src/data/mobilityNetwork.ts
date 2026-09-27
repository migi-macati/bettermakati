import { civicAreaById } from './areaOrganizationRegistry';
import {
  mobilityRouteCorridors,
  mobilityRouteSources,
} from './mobilityRoutes';
import {
  mobilityServices,
  mobilitySources,
} from './mobilitySystems';
import { placeRegistryById } from './placeRegistry';

export type MobilityNetworkNodeType =
  | 'service'
  | 'route'
  | 'place'
  | 'area';

export interface MobilityNetworkNodeRef {
  type: MobilityNetworkNodeType;
  id: string;
}

export type MobilityNetworkRelationshipKind =
  | 'service-serves-place'
  | 'service-related-area'
  | 'route-uses-terminal'
  | 'service-connected-hub'
  | 'transfer';

export type MobilityNetworkSourceRegistry =
  | 'system'
  | 'route'
  | 'network';

export interface MobilityNetworkSourceRef {
  registry: MobilityNetworkSourceRegistry;
  sourceId: string;
}

export interface MobilityNetworkSource {
  id: string;
  label: string;
  url: string;
  publisher?: string;
  publishedOrPeriod?: string;
  checkedOn: string;
  kind:
    | 'official-primary'
    | 'government-reporting'
    | 'first-party'
    | 'other';
}

export interface MobilityNetworkRelationship {
  id: string;
  kind: MobilityNetworkRelationshipKind;
  from: MobilityNetworkNodeRef;
  to: MobilityNetworkNodeRef;
  sourceRefs: MobilityNetworkSourceRef[];
  evidenceStrength: 'direct' | 'corroborated';
  note?: string;
}

export const mobilityNetworkReviewedOn = '2026-09-27';

export const mobilityNetworkSources: MobilityNetworkSource[] = [
  {
    id: 'one-ayala-intermodal-connection',
    label:
      'Ayala Land · One Ayala intermodal transport hub and MRT/EDSA Carousel connections',
    url: 'https://groundbreakers.ayalaland.com.ph/articles/the-ultimate-mixed-use-development-in-makati-cbd-enhancing-connectivity-with-ease-and-convenience.html',
    publisher: 'Ayala Land, Inc.',
    checkedOn: mobilityNetworkReviewedOn,
    kind: 'first-party',
  },
  {
    id: 'pia-buendia-busway-mrt-connection-2021',
    label:
      'PIA / DOTr · EDSA Busway Buendia Station connected to MRT-3 facility',
    url: 'https://mirror.pia.gov.ph/news/2021/11/22/edsa-busway-buendia-station-bukas-na-sa-publiko-ngayong-lunes',
    publisher: 'Philippine Information Agency / Department of Transportation',
    publishedOrPeriod: '2021-11-22',
    checkedOn: mobilityNetworkReviewedOn,
    kind: 'government-reporting',
  },
  {
    id: 'pia-mrt-bus-carousel-transfer-points-2024',
    label:
      'PIA / DOTr · MRT-3 stations near EDSA Bus Carousel pick-up/drop-off points',
    url: 'https://pia.gov.ph/news/select-mrt-3-stations-to-remain-accessible-this-holy-week/',
    publisher: 'Philippine Information Agency / Department of Transportation',
    publishedOrPeriod: '2024-03-21',
    checkedOn: mobilityNetworkReviewedOn,
    kind: 'government-reporting',
  },
];

const servicePlaceRelationships: MobilityNetworkRelationship[] =
  mobilityServices.flatMap(service =>
    service.placeConnections.map(connection => ({
      id:
        'service-place-' +
        service.id +
        '-' +
        connection.placeId,
      kind: 'service-serves-place' as const,
      from: { type: 'service' as const, id: service.id },
      to: { type: 'place' as const, id: connection.placeId },
      sourceRefs: connection.sourceIds.map(sourceId => ({
        registry: 'system' as const,
        sourceId,
      })),
      evidenceStrength: 'direct' as const,
      note:
        'Canonical service connection role: ' +
        connection.role +
        (connection.note ? '. ' + connection.note : ''),
    }))
  );

const serviceAreaRelationships: MobilityNetworkRelationship[] =
  mobilityServices.flatMap(service =>
    (service.relatedAreaIds ?? []).map(areaId => {
      const areaAssertion = service.provenance.assertions.find(assertion =>
        assertion.fieldPaths.includes('relatedAreaIds')
      );

      if (!areaAssertion) {
        throw new Error(
          'Mobility service related Area lacks provenance assertion: ' +
            service.id +
            ' -> ' +
            areaId
        );
      }

      return {
        id: 'service-area-' + service.id + '-' + areaId,
        kind: 'service-related-area' as const,
        from: { type: 'service' as const, id: service.id },
        to: { type: 'area' as const, id: areaId },
        sourceRefs: areaAssertion.sourceIds.map(sourceId => ({
          registry: 'system' as const,
          sourceId,
        })),
        evidenceStrength: areaAssertion.evidenceStrength,
        note:
          'Area relationship is carried from the canonical mobility-service provenance rather than inferred from proximity.',
      };
    })
  );

const routeTerminalRelationships: MobilityNetworkRelationship[] =
  mobilityRouteCorridors.flatMap(route => {
    if (route.recordKind !== 'current-service') return [];

    return route.currentService.terminalPlaceIds.map(placeId => ({
      id: 'route-terminal-' + route.id + '-' + placeId,
      kind: 'route-uses-terminal' as const,
      from: { type: 'route' as const, id: route.id },
      to: { type: 'place' as const, id: placeId },
      sourceRefs: route.currentEvidenceSourceIds.map(sourceId => ({
        registry: 'route' as const,
        sourceId,
      })),
      evidenceStrength: 'corroborated' as const,
      note:
        'Current terminal relationship inherits the route evidence class; schedule, gate, fare and intermediate stops are not inferred.',
    }));
  });

const explicitNetworkRelationships: MobilityNetworkRelationship[] = [
  {
    id: 'service-hub-mrt3-one-ayala',
    kind: 'service-connected-hub',
    from: { type: 'service', id: 'mrt3' },
    to: { type: 'place', id: 'one-ayala-terminal' },
    sourceRefs: [
      {
        registry: 'network',
        sourceId: 'one-ayala-intermodal-connection',
      },
    ],
    evidenceStrength: 'direct',
    note:
      'Ayala Land states that One Ayala directly connects to MRT-3 Ayala Station.',
  },
  {
    id: 'service-hub-edsa-busway-one-ayala',
    kind: 'service-connected-hub',
    from: { type: 'service', id: 'edsa-busway' },
    to: { type: 'place', id: 'one-ayala-terminal' },
    sourceRefs: [
      {
        registry: 'network',
        sourceId: 'one-ayala-intermodal-connection',
      },
    ],
    evidenceStrength: 'direct',
    note:
      'Ayala Land states that One Ayala accommodates city buses including the EDSA Carousel and discusses the EDSA Busway Ayala stop.',
  },
  {
    id: 'transfer-mrt3-ayala-one-ayala',
    kind: 'transfer',
    from: { type: 'place', id: 'mrt3-ayala' },
    to: { type: 'place', id: 'one-ayala-terminal' },
    sourceRefs: [
      {
        registry: 'network',
        sourceId: 'one-ayala-intermodal-connection',
      },
    ],
    evidenceStrength: 'direct',
    note:
      'Direct internal/elevated connection documented by Ayala Land. This is a transfer relationship, not a claim that the two facilities are the same Place.',
  },
  {
    id: 'transfer-edsa-busway-ayala-one-ayala',
    kind: 'transfer',
    from: { type: 'place', id: 'edsa-busway-ayala' },
    to: { type: 'place', id: 'one-ayala-terminal' },
    sourceRefs: [
      {
        registry: 'network',
        sourceId: 'one-ayala-intermodal-connection',
      },
    ],
    evidenceStrength: 'direct',
    note:
      'One Ayala is documented as the intermodal hub serving the EDSA Carousel / Busway Ayala connection.',
  },
  {
    id: 'transfer-mrt3-ayala-edsa-busway-ayala',
    kind: 'transfer',
    from: { type: 'place', id: 'mrt3-ayala' },
    to: { type: 'place', id: 'edsa-busway-ayala' },
    sourceRefs: [
      {
        registry: 'network',
        sourceId: 'one-ayala-intermodal-connection',
      },
    ],
    evidenceStrength: 'corroborated',
    note:
      'Transfer is represented through the documented One Ayala intermodal connection; no claim of a shared platform or same facility is made.',
  },
  {
    id: 'transfer-mrt3-buendia-edsa-busway-buendia',
    kind: 'transfer',
    from: { type: 'place', id: 'mrt3-buendia' },
    to: { type: 'place', id: 'edsa-busway-buendia' },
    sourceRefs: [
      {
        registry: 'network',
        sourceId: 'pia-buendia-busway-mrt-connection-2021',
      },
      {
        registry: 'network',
        sourceId: 'pia-mrt-bus-carousel-transfer-points-2024',
      },
    ],
    evidenceStrength: 'corroborated',
    note:
      'Government sources describe the Busway Buendia station as connected to the MRT-3 facility and identify Buendia among MRT-3 stations near Bus Carousel pick-up/drop-off points.',
  },
  {
    id: 'transfer-mrt3-guadalupe-edsa-busway-guadalupe',
    kind: 'transfer',
    from: { type: 'place', id: 'mrt3-guadalupe' },
    to: { type: 'place', id: 'edsa-busway-guadalupe' },
    sourceRefs: [
      {
        registry: 'network',
        sourceId: 'pia-mrt-bus-carousel-transfer-points-2024',
      },
    ],
    evidenceStrength: 'direct',
    note:
      'DOTr/PIA identifies Guadalupe among MRT-3 stations near EDSA Bus Carousel pick-up/drop-off points. BetterMakati records a transfer opportunity, not a shared concourse.',
  },
];

export const mobilityNetworkRelationships: MobilityNetworkRelationship[] = [
  ...servicePlaceRelationships,
  ...serviceAreaRelationships,
  ...routeTerminalRelationships,
  ...explicitNetworkRelationships,
];

const systemSourceIds = new Set(mobilitySources.map(source => source.id));
const routeSourceIds = new Set(
  mobilityRouteSources.map(source => source.id)
);
const networkSourceIds = new Set(
  mobilityNetworkSources.map(source => source.id)
);
const serviceIds = new Set(mobilityServices.map(service => service.id));
const routeIds = new Set(
  mobilityRouteCorridors.map(route => route.id)
);

const nodeExists = (node: MobilityNetworkNodeRef) => {
  if (node.type === 'service') return serviceIds.has(node.id);
  if (node.type === 'route') return routeIds.has(node.id);
  if (node.type === 'place') return placeRegistryById.has(node.id);
  return civicAreaById.has(node.id);
};

export const validateMobilityNetworkRelationships = (
  relationships: readonly MobilityNetworkRelationship[]
) => {
  const ids = new Set<string>();
  const unorderedTransfers = new Set<string>();

  for (const source of mobilityNetworkSources) {
    if (!source.id.trim() || !source.url.trim()) {
      throw new Error(
        'Mobility network source ID and URL must not be empty.'
      );
    }
  }

  for (const relationship of relationships) {
    if (ids.has(relationship.id)) {
      throw new Error(
        'Duplicate mobility network relationship ID: ' +
          relationship.id
      );
    }
    ids.add(relationship.id);

    if (!nodeExists(relationship.from)) {
      throw new Error(
        'Mobility network relationship references missing from-node: ' +
          relationship.id
      );
    }
    if (!nodeExists(relationship.to)) {
      throw new Error(
        'Mobility network relationship references missing to-node: ' +
          relationship.id
      );
    }
    if (!relationship.sourceRefs.length) {
      throw new Error(
        'Mobility network relationship has no source refs: ' +
          relationship.id
      );
    }

    for (const sourceRef of relationship.sourceRefs) {
      const sourceSet =
        sourceRef.registry === 'system'
          ? systemSourceIds
          : sourceRef.registry === 'route'
            ? routeSourceIds
            : networkSourceIds;

      if (!sourceSet.has(sourceRef.sourceId)) {
        throw new Error(
          'Mobility network relationship ' +
            relationship.id +
            ' cites missing ' +
            sourceRef.registry +
            ' source: ' +
            sourceRef.sourceId
        );
      }
    }

    if (relationship.kind === 'route-uses-terminal') {
      if (
        relationship.from.type !== 'route' ||
        relationship.to.type !== 'place'
      ) {
        throw new Error(
          'route-uses-terminal must connect route -> place: ' +
            relationship.id
        );
      }
    }

    if (relationship.kind === 'service-serves-place') {
      if (
        relationship.from.type !== 'service' ||
        relationship.to.type !== 'place'
      ) {
        throw new Error(
          'service-serves-place must connect service -> place: ' +
            relationship.id
        );
      }
    }

    if (relationship.kind === 'transfer') {
      if (
        relationship.from.type !== 'place' ||
        relationship.to.type !== 'place'
      ) {
        throw new Error(
          'transfer must connect place <-> place: ' +
            relationship.id
        );
      }

      const key = [relationship.from.id, relationship.to.id]
        .sort()
        .join('::');

      if (unorderedTransfers.has(key)) {
        throw new Error(
          'Duplicate symmetric mobility transfer: ' + key
        );
      }
      unorderedTransfers.add(key);
    }
  }

  return true;
};

validateMobilityNetworkRelationships(mobilityNetworkRelationships);

export const mobilityNetworkRelationshipsForNode = (
  type: MobilityNetworkNodeType,
  id: string
) =>
  mobilityNetworkRelationships.filter(
    relationship =>
      (relationship.from.type === type &&
        relationship.from.id === id) ||
      (relationship.to.type === type &&
        relationship.to.id === id)
  );

export const mobilityTransfersForPlace = (placeId: string) =>
  mobilityNetworkRelationships.filter(
    relationship =>
      relationship.kind === 'transfer' &&
      (relationship.from.id === placeId ||
        relationship.to.id === placeId)
  );
