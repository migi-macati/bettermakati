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
export const mobilityGeometrySources: MobilityGeometrySource[] = [
  {
    id: 'osm-mrt3-route-master-8000255',
    label: 'OpenStreetMap · MRT Line 3 route master relation 8000255',
    url: 'https://www.openstreetmap.org/relation/8000255',
    publisher: 'OpenStreetMap contributors',
    checkedOn: mobilityGeometryReviewedOn,
    kind: 'reference-map',
  },
  {
    id: 'osm-mrt3-southbound-route-109159',
    label:
      'OpenStreetMap · MRT Line 3 North Avenue → Taft Avenue route relation 109159',
    url: 'https://www.openstreetmap.org/relation/109159',
    publisher: 'OpenStreetMap contributors',
    checkedOn: mobilityGeometryReviewedOn,
    kind: 'reference-map',
  },
  {
    id: 'osm-mrt3-rail-exposure-snapshot',
    label:
      'OpenStreetMap-derived rail exposure snapshot · MRT Line 3 way geometries',
    url: 'https://github.com/luxizhou/PH_TC_Risk/blob/e207cdb7f24f0b1e63401d049d44652dfc22805c/Project_1_Tropical_cyclon_risks_in_Philippines/OpenStreetMap/rail_exposures.csv',
    publisher: 'PH_TC_Risk / OpenStreetMap contributors',
    checkedOn: mobilityGeometryReviewedOn,
    kind: 'reference-map',
  },
  {
    id: 'traintracks-mrt3-geojson-crosscheck',
    label:
      'TrainTracks · MRT-3 GeoJSON feature Q13422345',
    url: 'https://github.com/karaagexc/TrainTracks/blob/82c5d199eaf4165f5ac21a54ba24a1766d1e20f3/src/data/mrt3.json',
    publisher: 'TrainTracks',
    checkedOn: mobilityGeometryReviewedOn,
    kind: 'reference-map',
  },
];

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
  [
    {
      id: 'mrt3-makati-alignment-2026-09',
      ownerType: 'service',
      ownerId: 'mrt3',
      kind: 'infrastructure-alignment',
      coverage: 'makati-segment',
      geometry: {
        type: 'LineString',
        coordinates: [
          [121.0464023, 14.5701072],
          [121.0463331, 14.5698174],
          [121.04613, 14.5690545],
          [121.0457281, 14.5676731],
          [121.0454381, 14.5667194],
          [121.0454083, 14.5666116],
          [121.0452875, 14.5661742],
          [121.0449635, 14.5650844],
          [121.0447259, 14.5644354],
          [121.0445645, 14.5640806],
          [121.0443237, 14.5636123],
          [121.0440542, 14.5631589],
          [121.0437086, 14.5626731],
          [121.0430071, 14.5618481],
          [121.0424313, 14.5613093],
          [121.0406042, 14.5597563],
          [121.0402596, 14.5594882],
          [121.0391919, 14.5585696],
          [121.0387352, 14.5581823],
          [121.0385109, 14.5579889],
          [121.0378405, 14.5574165],
          [121.0355262, 14.5554401],
          [121.0354176, 14.5553494],
          [121.0353102, 14.5552621],
          [121.0348492, 14.5548959],
          [121.034811, 14.5548695],
          [121.0347805, 14.5548499],
          [121.0347463, 14.5548305],
          [121.034715, 14.5548127],
          [121.0346694, 14.55478],
          [121.0346209, 14.5547421],
          [121.0336836, 14.553952],
          [121.0336463, 14.5539205],
          [121.0336022, 14.5538817],
          [121.0335606, 14.553845],
          [121.0334432, 14.5537382],
          [121.0333829, 14.5536863],
          [121.0333189, 14.5536307],
          [121.0330601, 14.5534175],
          [121.0330104, 14.5533752],
          [121.0328532, 14.5532414],
          [121.0327817, 14.5531834],
          [121.0322291, 14.5527238],
          [121.0295093, 14.5504187],
          [121.029115, 14.5500932],
          [121.0284814, 14.5495675],
          [121.0275404, 14.5487554],
          [121.0274082, 14.548639],
          [121.0262661, 14.5476619],
          [121.0258106, 14.5473275],
          [121.0206831, 14.5430113],
          [121.019828, 14.5423342],
          [121.0190284, 14.5417712],
          [121.0188767, 14.5416656],
          [121.0178432, 14.5410174],
          [121.0174488, 14.5408093],
        ],
      },
      sourceRefs: [
        {
          registry: 'system',
          sourceId: 'mrt3-about-2026',
        },
        {
          registry: 'geometry',
          sourceId: 'osm-mrt3-route-master-8000255',
        },
        {
          registry: 'geometry',
          sourceId: 'osm-mrt3-southbound-route-109159',
        },
        {
          registry: 'geometry',
          sourceId: 'osm-mrt3-rail-exposure-snapshot',
        },
        {
          registry: 'geometry',
          sourceId: 'traintracks-mrt3-geojson-crosscheck',
        },
      ],
      precisionNote:
        'Mapped reference alignment for the MRT-3 Makati station corridor, not a survey, engineering or cadastral product. Coordinates follow one southbound OSM light-rail track alignment from just north of Guadalupe Station through just south of Magallanes Station; they are not a legal Makati-boundary clip and do not depict the full width or both tracks of the railway.',
      tracedFrom:
        'OSM route relation 109159 member ways 810673631, 642764191, 547163412, 810673628, 810673626, 810634546, 799249439, 642764192, 810634542, 642764189 and 38192006; coordinates recovered from the cited OpenStreetMap-derived rail exposure snapshot.',
      checkedAgainst: [
        'OpenStreetMap MRT Line 3 route master relation 8000255',
        'TrainTracks MRT-3 GeoJSON feature Q13422345',
        'Canonical BetterMakati MRT-3 station points: Guadalupe, Buendia, Ayala and Magallanes',
      ],
      reviewedOn: mobilityGeometryReviewedOn,
    },
  ];

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
