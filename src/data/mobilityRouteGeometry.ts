import {
  mobilityRouteById,
  mobilityRouteSources,
} from './mobilityRoutes';
import {
  mobilityServiceById,
  mobilitySources,
} from './mobilitySystems';

export type MobilityGeometryPosition = [lng: number, lat: number];

export interface MobilityLineStringGeometry {
  type: 'LineString';
  coordinates: MobilityGeometryPosition[];
}

export interface MobilityMultiLineStringGeometry {
  type: 'MultiLineString';
  coordinates: MobilityGeometryPosition[][];
}

export type MobilityRenderableRouteGeometry =
  | MobilityLineStringGeometry
  | MobilityMultiLineStringGeometry;

export type MobilityGeometryKind =
  | 'infrastructure-alignment'
  | 'service-alignment'
  | 'approximate-corridor'
  | 'historical-lineage';

export type MobilityGeometryCoverage =
  | 'full-system'
  | 'makati-segment'
  | 'route-corridor'
  | 'historical-reference';

export type MobilityGeometryOwnerType = 'service' | 'route';

export type MobilityGeometrySourceRegistry =
  | 'system'
  | 'route'
  | 'geometry';

export interface MobilityGeometrySourceRef {
  registry: MobilityGeometrySourceRegistry;
  sourceId: string;
}

export interface MobilityGeometrySource {
  id: string;
  label: string;
  url: string;
  publisher?: string;
  publishedOrPeriod?: string;
  checkedOn: string;
  kind:
    | 'official-primary'
    | 'official-secondary'
    | 'official-historical-map'
    | 'reference-map'
    | 'secondary-reporting'
    | 'other';
}

export interface MobilityRouteGeometryArtifact {
  id: string;
  ownerType: MobilityGeometryOwnerType;
  ownerId: string;
  kind: MobilityGeometryKind;
  coverage: MobilityGeometryCoverage;
  geometry: MobilityRenderableRouteGeometry;
  sourceRefs: MobilityGeometrySourceRef[];
  precisionNote: string;
  tracedFrom?: string;
  checkedAgainst?: string[];
  reviewedOn: string;
}

export const mobilityGeometryReviewedOn = '2026-09-28';

/**
 * Geometry-specific sources belong here only when their coordinate/shape data
 * is actually used by a published artifact. System identity/status sources
 * stay in mobilitySystems.ts and route evidence stays in mobilityRoutes.ts.
 */
export const mobilityGeometrySources: MobilityGeometrySource[] = [];

/**
 * W5-4e1 establishes the repository-owned LineString/MultiLineString artifact
 * contract. No route geometry is published until a fixed alignment has both:
 *
 * 1. authoritative/current evidence for the system or service identity; and
 * 2. a defensible coordinate trace whose provenance is explicit.
 *
 * Endpoint names, station points and old Makati GIS lines are not enough on
 * their own to manufacture a current route polyline.
 */
export const mobilityRouteGeometryArtifacts: MobilityRouteGeometryArtifact[] =
  [];

const systemSourceIds = new Set(mobilitySources.map(source => source.id));
const routeSourceIds = new Set(
  mobilityRouteSources.map(source => source.id)
);
const geometrySourceIds = new Set(
  mobilityGeometrySources.map(source => source.id)
);

const sourceExists = (ref: MobilityGeometrySourceRef) => {
  if (ref.registry === 'system') {
    return systemSourceIds.has(ref.sourceId);
  }
  if (ref.registry === 'route') {
    return routeSourceIds.has(ref.sourceId);
  }
  return geometrySourceIds.has(ref.sourceId);
};

const ownerExists = (
  ownerType: MobilityGeometryOwnerType,
  ownerId: string
) =>
  ownerType === 'service'
    ? mobilityServiceById.has(ownerId)
    : mobilityRouteById.has(ownerId);

const ownerGeometryId = (
  ownerType: MobilityGeometryOwnerType,
  ownerId: string
) => {
  if (ownerType === 'service') {
    return mobilityServiceById.get(ownerId)?.geometryArtifactId;
  }
  return mobilityRouteById.get(ownerId)?.geometryArtifactId;
};

const validatePosition = (
  position: MobilityGeometryPosition,
  owner: string
) => {
  const [lng, lat] = position;

  if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
    throw new Error(owner + ' has non-finite coordinates.');
  }

  /**
   * Validation envelope intentionally covers Metro Manila rather than Makati
   * alone because canonical routes may connect Makati to external terminals.
   */
  if (lng < 120.8 || lng > 121.25 || lat < 14.35 || lat > 14.9) {
    throw new Error(
      owner +
        ' has coordinates outside the Metro Manila validation envelope: ' +
        lng +
        ', ' +
        lat
    );
  }
};

const validateLine = (
  line: MobilityGeometryPosition[],
  owner: string
) => {
  if (line.length < 2) {
    throw new Error(owner + ' must contain at least two positions.');
  }

  for (const position of line) {
    validatePosition(position, owner);
  }

  const distinct = new Set(
    line.map(([lng, lat]) => lng + ',' + lat)
  );

  if (distinct.size < 2) {
    throw new Error(owner + ' must contain at least two distinct positions.');
  }
};

export const validateMobilityRouteGeometryArtifacts = (
  artifacts: readonly MobilityRouteGeometryArtifact[]
) => {
  const ids = new Set<string>();
  const activeOwners = new Set<string>();

  for (const source of mobilityGeometrySources) {
    if (!source.id.trim() || !source.url.trim()) {
      throw new Error(
        'Mobility geometry source ID and URL must not be empty.'
      );
    }
  }

  for (const artifact of artifacts) {
    if (!artifact.id.trim()) {
      throw new Error('Mobility geometry artifact ID must not be empty.');
    }
    if (ids.has(artifact.id)) {
      throw new Error(
        'Duplicate mobility geometry artifact ID: ' + artifact.id
      );
    }
    ids.add(artifact.id);

    if (!ownerExists(artifact.ownerType, artifact.ownerId)) {
      throw new Error(
        'Mobility geometry artifact references missing owner: ' +
          artifact.ownerType +
          ':' +
          artifact.ownerId
      );
    }

    const ownerKey = artifact.ownerType + ':' + artifact.ownerId;
    if (activeOwners.has(ownerKey)) {
      throw new Error(
        'Only one active default mobility geometry artifact is allowed per owner: ' +
          ownerKey
      );
    }
    activeOwners.add(ownerKey);

    if (
      ownerGeometryId(artifact.ownerType, artifact.ownerId) !==
      artifact.id
    ) {
      throw new Error(
        'Mobility geometry artifact is not reciprocally linked by its owner: ' +
          artifact.id
      );
    }

    if (!artifact.sourceRefs.length) {
      throw new Error(
        'Mobility geometry artifact must cite at least one source: ' +
          artifact.id
      );
    }

    for (const sourceRef of artifact.sourceRefs) {
      if (!sourceExists(sourceRef)) {
        throw new Error(
          'Mobility geometry artifact ' +
            artifact.id +
            ' cites missing ' +
            sourceRef.registry +
            ' source: ' +
            sourceRef.sourceId
        );
      }
    }

    if (!artifact.precisionNote.trim()) {
      throw new Error(
        'Mobility geometry artifact requires a precision note: ' +
          artifact.id
      );
    }

    if (artifact.geometry.type === 'LineString') {
      validateLine(
        artifact.geometry.coordinates,
        'Mobility geometry ' + artifact.id
      );
    } else {
      if (!artifact.geometry.coordinates.length) {
        throw new Error(
          'Mobility MultiLineString must contain at least one line: ' +
            artifact.id
        );
      }

      artifact.geometry.coordinates.forEach((line, index) =>
        validateLine(
          line,
          'Mobility geometry ' + artifact.id + ' line ' + index
        )
      );
    }
  }

  const artifactIdSet = new Set(artifacts.map(artifact => artifact.id));

  for (const service of mobilityServiceById.values()) {
    if (
      service.geometryArtifactId &&
      !artifactIdSet.has(service.geometryArtifactId)
    ) {
      throw new Error(
        'Mobility service references missing geometry artifact: ' +
          service.id +
          ' -> ' +
          service.geometryArtifactId
      );
    }
  }

  for (const route of mobilityRouteById.values()) {
    if (
      route.geometryArtifactId &&
      !artifactIdSet.has(route.geometryArtifactId)
    ) {
      throw new Error(
        'Mobility route references missing geometry artifact: ' +
          route.id +
          ' -> ' +
          route.geometryArtifactId
      );
    }
  }

  return true;
};

validateMobilityRouteGeometryArtifacts(
  mobilityRouteGeometryArtifacts
);

export const mobilityRouteGeometryById = new Map(
  mobilityRouteGeometryArtifacts.map(artifact => [
    artifact.id,
    artifact,
  ])
);

export const mobilityRouteGeometryForOwner = (
  ownerType: MobilityGeometryOwnerType,
  ownerId: string
) =>
  mobilityRouteGeometryArtifacts.find(
    artifact =>
      artifact.ownerType === ownerType &&
      artifact.ownerId === ownerId
  );

export const boundsForMobilityRouteGeometry = (
  geometry: MobilityRenderableRouteGeometry
) => {
  const positions =
    geometry.type === 'LineString'
      ? geometry.coordinates
      : geometry.coordinates.flat();

  if (!positions.length) return undefined;

  const lngs = positions.map(position => position[0]);
  const lats = positions.map(position => position[1]);

  return {
    west: Math.min(...lngs),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    north: Math.max(...lats),
  };
};
