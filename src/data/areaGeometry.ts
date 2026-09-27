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
 * Renderable area boundaries are intentionally sparse.
 *
 * Dasmariñas Village is the first published artifact because DVA states that
 * Barangay Dasmariñas is exactly located within the gated village perimeter.
 * The polygon below uses the 2023 PSGC-derived high-resolution barangay trace
 * as a display approximation, checked against DVA's own perimeter description,
 * Village Map and a separate OSM administrative-boundary snapshot.
 */
export const civicAreaGeometryArtifacts: CivicAreaGeometryArtifact[] = [
  {
    id: 'dasmarinas-village-boundary-2026-09',
    areaId: 'dasmarinas-village',
    kind: 'approximate-boundary',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [121.03630348500008, 14.535864222000045],
          [121.0357227090001, 14.537514744000077],
          [121.03469838700005, 14.539200263000055],
          [121.03261826200003, 14.541071922000068],
          [121.03164074500013, 14.542774247000068],
          [121.0306801800001, 14.54532418700006],
          [121.03255968500002, 14.545989328000077],
          [121.03234665500008, 14.547119746000023],
          [121.03265640400004, 14.548401031000026],
          [121.02985204400011, 14.549659965000043],
          [121.02936955400003, 14.550221296000075],
          [121.02148477300013, 14.543573020000052],
          [121.0195819170001, 14.542052689000057],
          [121.0220763420001, 14.53750464500007],
          [121.02496136800005, 14.53210108300004],
          [121.02651239300008, 14.532098977000032],
          [121.02735404500004, 14.532943209000042],
          [121.02863720900005, 14.533443947000023],
          [121.02952792400004, 14.534304501000065],
          [121.0312109140001, 14.53492598400004],
          [121.033448635, 14.533932557000071],
          [121.034401924, 14.534554703000024],
          [121.03523479800003, 14.535583252000041],
          [121.03630348500008, 14.535864222000045],
        ],
      ],
    },
    sourceIds: [
      'dva-about-boundary',
      'dva-village-map',
      'psgc-2023-makati-barangay-geojson',
      'osm-dasmarinas-boundary-snapshot',
    ],
    precisionNote:
      'Approximate display boundary, not a cadastral or survey polygon. DVA states that the barangay is exactly within the gated village perimeter. Coordinates use a public 2023 PSGC-derived Barangay Dasmariñas boundary trace and were retained only after comparison with DVA’s stated perimeter and a separate OSM boundary snapshot. DVA’s 187-hectare figure remains the authoritative land-area statement shown on BetterMakati.',
    tracedFrom:
      '2023 PSGC-derived high-resolution Barangay Dasmariñas GeoJSON published by faeldon/philippines-json-maps',
    checkedAgainst: [
      'Dasmariñas Village Association Village Map',
      'DVA perimeter description: EDSA; Maricaban Creek / Fort Bonifacio; Kayamanan C / Chino Roces; McKinley Road / Forbes',
      'OpenStreetMap administrative relation 103761 snapshot',
    ],
    reviewedOn: '2026-09-27',
  },,
  {
    id: 'forbes-park-village-boundary-2026-09',
    areaId: 'forbes-park-village',
    kind: 'approximate-boundary',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [121.04155706200002, 14.55580192200006],
          [121.03999111000009, 14.555851270000062],
          [121.03858883800002, 14.55611715100002],
          [121.03702125000008, 14.55666140300008],
          [121.0349004840001, 14.554868058000068],
          [121.02936955400003, 14.550221296000075],
          [121.02985204400011, 14.549659965000043],
          [121.03265640400004, 14.548401031000026],
          [121.03234665500008, 14.547119746000023],
          [121.03255968500002, 14.545989328000077],
          [121.0306801800001, 14.54532418700006],
          [121.03164074500013, 14.542774247000068],
          [121.03261826200003, 14.541071922000068],
          [121.03469838700005, 14.539200263000055],
          [121.0357227090001, 14.537514744000077],
          [121.03630348500008, 14.535864222000045],
          [121.03811473400003, 14.536255572000073],
          [121.03922857700003, 14.537444674000032],
          [121.03932390600005, 14.53915056000005],
          [121.03970020400006, 14.53983291400004],
          [121.04168705900008, 14.540715961000048],
          [121.0431119750001, 14.540354715000037],
          [121.04410540300012, 14.540891567000074],
          [121.04472253200004, 14.54079623800004],
          [121.04532962700013, 14.541593990000026],
          [121.04595665700005, 14.541819049000026],
          [121.046393995, 14.542844201000033],
          [121.04555945900007, 14.545043730000033],
          [121.04477925200003, 14.54651477500005],
          [121.04432745100007, 14.548186438000076],
          [121.04360946100007, 14.55010821000008],
          [121.04276723700002, 14.553967494000055],
          [121.04282357400007, 14.554977530000023],
          [121.04155706200002, 14.55580192200006],
        ],
      ],
    },
    sourceIds: [
      'forbes-park-articles',
      'forbes-park-village-map',
      'psgc-2023-makati-barangay-geojson',
      'osm-forbes-park-boundary-snapshot',
    ],
    precisionNote:
      'Approximate display boundary, not a cadastral or survey polygon. FPA’s articles define Forbes Park Subdivision with named outer boundaries including EDSA, Quingua Street, Manila Golf Club, Harvard Road, McKinley Road, Fort Bonifacio, Pili Avenue and the western creek/drainage canal. Coordinates use a public 2023 PSGC-derived Barangay Forbes Park trace only as a display guide after comparison with the FPA village map, those named perimeter features and a separate OSM administrative-boundary snapshot. BetterMakati does not assert legal identity between Barangay Forbes Park and the private subdivision.',
    tracedFrom:
      '2023 PSGC-derived high-resolution Barangay Forbes Park GeoJSON published by faeldon/philippines-json-maps',
    checkedAgainst: [
      'Forbes Park Association Village Map',
      'FPA amended articles and 1964 clarified subdivision boundary description',
      'OpenStreetMap administrative relation 109972 snapshot',
    ],
    reviewedOn: '2026-09-27',
  },
];

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
