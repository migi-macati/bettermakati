import {
  civicAreaById,
  civicAreaRegistrySources,
  civicAreas,
} from './areaOrganizationRegistry';

export type CivicAreaGeometryKind =
  | 'official-boundary'
  | 'source-defined-boundary'
  | 'approximate-boundary';

export type GeoPosition = [lng: number, lat: number];
export type GeoLinearRing = GeoPosition[];

export interface CivicAreaPolygonGeometry {
  type: 'Polygon';
  coordinates: GeoLinearRing[];
}

export interface CivicAreaMultiPolygonGeometry {
  type: 'MultiPolygon';
  coordinates: GeoLinearRing[][];
}

export type CivicAreaRenderableGeometry =
  | CivicAreaPolygonGeometry
  | CivicAreaMultiPolygonGeometry;

export interface CivicAreaGeometryArtifact {
  id: string;
  areaId: string;
  kind: CivicAreaGeometryKind;
  geometry: CivicAreaRenderableGeometry;
  sourceIds: string[];
  precisionNote: string;
  tracedFrom?: string;
  checkedAgainst?: string[];
  reviewedOn: string;
}

const geometrySourceIds = new Set(
  civicAreaRegistrySources.map(source => source.id)
);

const positionKey = ([lng, lat]: GeoPosition) => lng + ',' + lat;

const validateRing = (
  ring: GeoLinearRing,
  artifactId: string,
  ringLabel: string
) => {
  if (ring.length < 4) {
    throw new Error(
      'Area geometry ' +
        artifactId +
        ' ' +
        ringLabel +
        ' must contain at least four positions.'
    );
  }

  for (const [lng, lat] of ring) {
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
      throw new Error(
        'Area geometry ' +
          artifactId +
          ' contains a non-finite coordinate.'
      );
    }

    if (lng < 120.9 || lng > 121.2 || lat < 14.4 || lat > 14.7) {
      throw new Error(
        'Area geometry ' +
          artifactId +
          ' coordinate is outside the Makati / Metro Manila validation envelope: ' +
          lng +
          ', ' +
          lat
      );
    }
  }

  const first = ring[0];
  const last = ring[ring.length - 1];
  if (positionKey(first) !== positionKey(last)) {
    throw new Error(
      'Area geometry ' +
        artifactId +
        ' ' +
        ringLabel +
        ' must be closed.'
    );
  }

  const uniquePositions = new Set(
    ring.slice(0, -1).map(positionKey)
  );

  if (uniquePositions.size < 3) {
    throw new Error(
      'Area geometry ' +
        artifactId +
        ' ' +
        ringLabel +
        ' must contain at least three distinct positions.'
    );
  }
};

export const validateCivicAreaGeometryArtifacts = (
  artifacts: readonly CivicAreaGeometryArtifact[]
) => {
  const ids = new Set<string>();
  const areaIds = new Set<string>();

  for (const artifact of artifacts) {
    if (!artifact.id.trim()) {
      throw new Error('Area geometry artifact ID must not be empty.');
    }
    if (ids.has(artifact.id)) {
      throw new Error('Duplicate area geometry artifact ID: ' + artifact.id);
    }
    ids.add(artifact.id);

    if (!civicAreaById.has(artifact.areaId)) {
      throw new Error(
        'Area geometry artifact points to missing area: ' + artifact.areaId
      );
    }
    if (areaIds.has(artifact.areaId)) {
      throw new Error(
        'Only one active geometry artifact is allowed per area: ' +
          artifact.areaId
      );
    }
    areaIds.add(artifact.areaId);

    if (!artifact.sourceIds.length) {
      throw new Error(
        'Area geometry artifact must cite at least one source: ' + artifact.id
      );
    }
    for (const sourceId of artifact.sourceIds) {
      if (!geometrySourceIds.has(sourceId)) {
        throw new Error(
          'Area geometry artifact cites missing registry source: ' +
            artifact.id +
            ' -> ' +
            sourceId
        );
      }
    }

    if (!artifact.precisionNote.trim()) {
      throw new Error(
        'Area geometry artifact must carry a precision note: ' + artifact.id
      );
    }

    const polygons =
      artifact.geometry.type === 'Polygon'
        ? [artifact.geometry.coordinates]
        : artifact.geometry.coordinates;

    if (!polygons.length) {
      throw new Error(
        'Area geometry artifact contains no polygon: ' + artifact.id
      );
    }

    polygons.forEach((polygon, polygonIndex) => {
      if (!polygon.length) {
        throw new Error(
          'Area geometry artifact polygon has no rings: ' +
            artifact.id +
            '[' +
            polygonIndex +
            ']'
        );
      }

      polygon.forEach((ring, ringIndex) =>
        validateRing(
          ring,
          artifact.id,
          'polygon ' + polygonIndex + ' ring ' + ringIndex
        )
      );
    });

    const area = civicAreaById.get(artifact.areaId);
    if (area?.geometryId !== artifact.id) {
      throw new Error(
        'Area geometry artifact is not referenced by its canonical area: ' +
          artifact.id
      );
    }
  }

  for (const area of civicAreas) {
    if (area.geometryId && !ids.has(area.geometryId)) {
      throw new Error(
        'Canonical area references a missing geometry artifact: ' +
          area.id +
          ' -> ' +
          area.geometryId
      );
    }
  }

  return true;
};

/**
 * W5-3d2 establishes the renderable GeoJSON-compatible artifact model.
 *
 * This array is intentionally empty after direct visual verification showed
 * that the previously cited Ayala Land slide does not draw Circuit Makati's
 * estate boundary. The first publishable polygon is deferred to the next
 * source-backed tracing step.
 */
export const civicAreaGeometryArtifacts: CivicAreaGeometryArtifact[] = [];

validateCivicAreaGeometryArtifacts(civicAreaGeometryArtifacts);

export const civicAreaGeometryById = new Map(
  civicAreaGeometryArtifacts.map(artifact => [artifact.id, artifact])
);

export const civicAreaGeometryByAreaId = new Map(
  civicAreaGeometryArtifacts.map(artifact => [artifact.areaId, artifact])
);

export const boundsForAreaGeometry = (
  geometry: CivicAreaRenderableGeometry
) => {
  const positions =
    geometry.type === 'Polygon'
      ? geometry.coordinates.flat()
      : geometry.coordinates.flat(2);

  if (!positions.length) return undefined;

  const lngs = positions.map(([lng]) => lng);
  const lats = positions.map(([, lat]) => lat);

  return {
    west: Math.min(...lngs),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    north: Math.max(...lats),
  };
};
