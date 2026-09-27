import { civicAreaById } from './areaOrganizationRegistry';
import { placeRegistryById } from './placeRegistry';

export type MobilityServiceClass =
  | 'public-mass-transit'
  | 'public-ferry'
  | 'private-estate-shuttle';

export type MobilityMode = 'rail' | 'busway' | 'ferry' | 'shuttle';

export type MobilityLifecycleStatus =
  | 'operating'
  | 'temporarily-suspended'
  | 'under-construction'
  | 'future'
  | 'closed'
  | 'unknown';

export type MobilitySourceKind =
  | 'official-primary'
  | 'official-secondary'
  | 'government-reporting'
  | 'first-party'
  | 'secondary-reporting'
  | 'other';

export interface MobilitySource {
  id: string;
  label: string;
  url: string;
  publisher?: string;
  publishedOrPeriod?: string;
  checkedOn: string;
  kind: MobilitySourceKind;
}

export interface MobilityResponsibleBody {
  name: string;
  role:
    | 'operator'
    | 'public-authority'
    | 'regulator'
    | 'estate-owner'
    | 'service-provider'
    | 'other';
  sourceIds: string[];
  note?: string;
}

export interface MobilityPlaceConnection {
  placeId: string;
  role:
    | 'station'
    | 'terminal'
    | 'served-stop'
    | 'transfer-hub'
    | 'interchange';
  sourceIds: string[];
  note?: string;
}

export interface MobilityLink {
  kind:
    | 'official-site'
    | 'current-service-info'
    | 'operating-hours'
    | 'route-schedule'
    | 'source';
  label: string;
  url: string;
  sourceIds: string[];
  note?: string;
}

export interface MobilityAssertion {
  fieldPaths: string[];
  sourceIds: string[];
  evidenceStrength: 'direct' | 'corroborated' | 'inferred';
  note?: string;
}

export interface MobilityServiceRecord {
  id: string;
  name: string;
  aliases?: string[];
  serviceClass: MobilityServiceClass;
  mode: MobilityMode;
  governance: 'public' | 'private';
  summary: string;
  lifecycle: {
    status: MobilityLifecycleStatus;
    statusAsOf: string;
    sourceIds: string[];
    note?: string;
  };
  responsibleBodies: MobilityResponsibleBody[];
  placeConnections: MobilityPlaceConnection[];
  relatedAreaIds?: string[];

  /**
   * Optional repository-owned default alignment artifact.
   * Geometry lives in mobilityRouteGeometry.ts.
   */
  geometryArtifactId?: string;

  links: MobilityLink[];
  provenance: {
    assertions: MobilityAssertion[];
  };
  tags: string[];
}

export const mobilityRegistryReviewedOn = '2026-09-27';

export const mobilitySources: MobilitySource[] = [
  {
    id: 'mrt3-about-2026',
    label: 'DOTr MRT-3 · About Us / station information',
    url: 'https://www.dotrmrt3.gov.ph/about-us',
    publisher: 'Department of Transportation — MRT-3',
    checkedOn: mobilityRegistryReviewedOn,
    kind: 'official-primary',
  },
  {
    id: 'mrt3-operating-hours-2026',
    label: 'DOTr MRT-3 · Operating Hours',
    url: 'https://www.dotrmrt3.gov.ph/operating-hours.pdf',
    publisher: 'Department of Transportation — MRT-3',
    checkedOn: mobilityRegistryReviewedOn,
    kind: 'official-primary',
  },
  {
    id: 'pia-edsa-busway-wifi-2026',
    label: 'PIA · DOTr/DICT free Wi-Fi rollout at 17 EDSA Busway stations',
    url: 'https://pia.gov.ph/news/dotr-dict-launch-free-wi-fi-for-all-covering-17-edsa-busway-stations/',
    publisher: 'Philippine Information Agency',
    publishedOrPeriod: '2026-01-16',
    checkedOn: mobilityRegistryReviewedOn,
    kind: 'government-reporting',
  },
  {
    id: 'pia-edsa-busway-modernization-2026',
    label: 'PIA · DOTr vows further modernization of EDSA Busway',
    url: 'https://pia.gov.ph/news/dotr-vows-further-modernization-of-edsa-busway/',
    publisher: 'Philippine Information Agency',
    publishedOrPeriod: '2026',
    checkedOn: mobilityRegistryReviewedOn,
    kind: 'government-reporting',
  },
  {
    id: 'pia-ferry-resumption-2026',
    label: 'PIA · MMDA temporary Pasig River Ferry suspension and resumption notice',
    url: 'https://pia.gov.ph/news/mmda-suspends-operations-of-pasig-river-ferry-starting-april-1/',
    publisher: 'Philippine Information Agency',
    publishedOrPeriod: '2026',
    checkedOn: mobilityRegistryReviewedOn,
    kind: 'government-reporting',
  },
  {
    id: 'pia-ferry-wifi-2026',
    label: 'PIA · MMDA/DICT free Wi-Fi for Pasig River Ferry passengers',
    url: 'https://pia.gov.ph/news/mmda-dict-launch-free-wi-fi-for-ferry-passengers/',
    publisher: 'Philippine Information Agency',
    publishedOrPeriod: '2026',
    checkedOn: mobilityRegistryReviewedOn,
    kind: 'government-reporting',
  },
  {
    id: 'century-city-shuttle-2026',
    label: 'Century Properties · Clean, Convenient, Connected: Commuting to Makati Just Got Easier',
    url: 'https://www.century-properties.com/clean-convenient-connected-commuting-to-makati-just-got-easier/',
    publisher: 'Century Properties Group',
    publishedOrPeriod: '2026-05-30',
    checkedOn: mobilityRegistryReviewedOn,
    kind: 'first-party',
  },
  {
    id: 'century-city-shuttle-live',
    label: 'Century City Transport Hub · current route and schedule portal',
    url: 'https://ccth.framer.ai/',
    publisher: 'Century City Transport Hub',
    checkedOn: mobilityRegistryReviewedOn,
    kind: 'first-party',
  },
];

const sourceIdSet = new Set(mobilitySources.map(source => source.id));

const requireSources = (ids: readonly string[], owner: string) => {
  if (!ids.length) {
    throw new Error(owner + ' must cite at least one mobility source.');
  }

  for (const sourceId of ids) {
    if (!sourceIdSet.has(sourceId)) {
      throw new Error(owner + ' cites missing mobility source: ' + sourceId);
    }
  }
};

const validateUrl = (url: string, owner: string) => {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    throw new Error(owner + ' has an invalid URL: ' + url);
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error(owner + ' has unsupported URL protocol: ' + url);
  }
};

export const mobilityServices: MobilityServiceRecord[] = [
  {
    id: 'mrt3',
    name: 'MRT-3',
    aliases: ['Metro Rail Transit Line 3'],
    serviceClass: 'public-mass-transit',
    mode: 'rail',
    governance: 'public',
    summary:
      'Operating urban rail service along EDSA with four canonical BetterMakati stations in Makati.',
    lifecycle: {
      status: 'operating',
      statusAsOf: mobilityRegistryReviewedOn,
      sourceIds: ['mrt3-about-2026', 'mrt3-operating-hours-2026'],
    },
    responsibleBodies: [
      {
        name: 'Department of Transportation — MRT-3',
        role: 'operator',
        sourceIds: ['mrt3-about-2026'],
      },
    ],
    placeConnections: [
      {
        placeId: 'mrt3-guadalupe',
        role: 'station',
        sourceIds: ['mrt3-about-2026'],
      },
      {
        placeId: 'mrt3-buendia',
        role: 'station',
        sourceIds: ['mrt3-about-2026'],
      },
      {
        placeId: 'mrt3-ayala',
        role: 'station',
        sourceIds: ['mrt3-about-2026'],
      },
      {
        placeId: 'mrt3-magallanes',
        role: 'station',
        sourceIds: ['mrt3-about-2026'],
      },
    ],
    links: [
      {
        kind: 'official-site',
        label: 'DOTr MRT-3',
        url: 'https://www.dotrmrt3.gov.ph/about-us',
        sourceIds: ['mrt3-about-2026'],
      },
      {
        kind: 'operating-hours',
        label: 'Current operating hours',
        url: 'https://www.dotrmrt3.gov.ph/operating-hours.pdf',
        sourceIds: ['mrt3-operating-hours-2026'],
        note:
          'Use the live official source instead of freezing first/last-train times in canonical data.',
      },
    ],
    provenance: {
      assertions: [
        {
          fieldPaths: ['name', 'serviceClass', 'mode', 'lifecycle.status'],
          sourceIds: ['mrt3-about-2026'],
          evidenceStrength: 'direct',
        },
        {
          fieldPaths: ['placeConnections'],
          sourceIds: ['mrt3-about-2026'],
          evidenceStrength: 'direct',
        },
      ],
    },
    tags: ['rail', 'MRT-3', 'EDSA', 'public transport'],
  },
  {
    id: 'edsa-busway',
    name: 'EDSA Busway',
    aliases: ['EDSA Carousel'],
    serviceClass: 'public-mass-transit',
    mode: 'busway',
    governance: 'public',
    summary:
      'Operating median busway along EDSA with three currently verified canonical BetterMakati stations in Makati.',
    lifecycle: {
      status: 'operating',
      statusAsOf: mobilityRegistryReviewedOn,
      sourceIds: [
        'pia-edsa-busway-wifi-2026',
        'pia-edsa-busway-modernization-2026',
      ],
      note:
        'Do not infer that planned or under-construction stations are already operating.',
    },
    responsibleBodies: [
      {
        name: 'Department of Transportation',
        role: 'public-authority',
        sourceIds: [
          'pia-edsa-busway-wifi-2026',
          'pia-edsa-busway-modernization-2026',
        ],
      },
    ],
    placeConnections: [
      {
        placeId: 'edsa-busway-guadalupe',
        role: 'station',
        sourceIds: ['pia-edsa-busway-wifi-2026'],
      },
      {
        placeId: 'edsa-busway-buendia',
        role: 'station',
        sourceIds: ['pia-edsa-busway-wifi-2026'],
      },
      {
        placeId: 'edsa-busway-ayala',
        role: 'station',
        sourceIds: ['pia-edsa-busway-wifi-2026'],
      },
    ],
    links: [
      {
        kind: 'current-service-info',
        label: 'Government current-service reference',
        url: 'https://pia.gov.ph/news/dotr-dict-launch-free-wi-fi-for-all-covering-17-edsa-busway-stations/',
        sourceIds: ['pia-edsa-busway-wifi-2026'],
        note:
          'BetterMakati does not treat third-party commuter route maps as the canonical authority for system identity/status.',
      },
    ],
    provenance: {
      assertions: [
        {
          fieldPaths: ['name', 'aliases', 'serviceClass', 'mode', 'lifecycle.status'],
          sourceIds: [
            'pia-edsa-busway-wifi-2026',
            'pia-edsa-busway-modernization-2026',
          ],
          evidenceStrength: 'corroborated',
        },
        {
          fieldPaths: ['placeConnections'],
          sourceIds: ['pia-edsa-busway-wifi-2026'],
          evidenceStrength: 'direct',
        },
      ],
    },
    tags: ['bus', 'busway', 'EDSA', 'EDSA Carousel', 'public transport'],
  },
  {
    id: 'pasig-river-ferry',
    name: 'Pasig River Ferry Service',
    serviceClass: 'public-ferry',
    mode: 'ferry',
    governance: 'public',
    summary:
      'Operating passenger ferry service with two currently verified canonical BetterMakati stations in Makati.',
    lifecycle: {
      status: 'operating',
      statusAsOf: mobilityRegistryReviewedOn,
      sourceIds: ['pia-ferry-resumption-2026', 'pia-ferry-wifi-2026'],
      note:
        'Temporary weather, holiday or operational suspensions should remain live-service information rather than changing the stable service identity.',
    },
    responsibleBodies: [
      {
        name: 'Metropolitan Manila Development Authority',
        role: 'operator',
        sourceIds: ['pia-ferry-resumption-2026', 'pia-ferry-wifi-2026'],
      },
    ],
    placeConnections: [
      {
        placeId: 'pasig-ferry-guadalupe',
        role: 'station',
        sourceIds: ['pia-ferry-wifi-2026'],
      },
      {
        placeId: 'pasig-ferry-valenzuela',
        role: 'station',
        sourceIds: ['pia-ferry-wifi-2026'],
      },
    ],
    links: [
      {
        kind: 'current-service-info',
        label: 'Current government service reference',
        url: 'https://pia.gov.ph/news/mmda-dict-launch-free-wi-fi-for-ferry-passengers/',
        sourceIds: ['pia-ferry-wifi-2026'],
        note:
          'Systemwide station counts and daily schedules remain live/volatile rather than frozen canonical facts.',
      },
    ],
    provenance: {
      assertions: [
        {
          fieldPaths: ['name', 'serviceClass', 'mode', 'lifecycle.status'],
          sourceIds: ['pia-ferry-resumption-2026', 'pia-ferry-wifi-2026'],
          evidenceStrength: 'corroborated',
        },
        {
          fieldPaths: ['placeConnections'],
          sourceIds: ['pia-ferry-wifi-2026'],
          evidenceStrength: 'direct',
        },
      ],
    },
    tags: ['ferry', 'river transport', 'MMDA', 'Pasig River', 'public transport'],
  },
  {
    id: 'century-city-shuttle',
    name: 'Century City Shuttle',
    aliases: ['Century City E-Bus'],
    serviceClass: 'private-estate-shuttle',
    mode: 'shuttle',
    governance: 'private',
    summary:
      'Operating private estate shuttle serving Century City and selected Makati transport connections.',
    lifecycle: {
      status: 'operating',
      statusAsOf: mobilityRegistryReviewedOn,
      sourceIds: ['century-city-shuttle-2026'],
    },
    responsibleBodies: [
      {
        name: 'Century Properties Group',
        role: 'estate-owner',
        sourceIds: ['century-city-shuttle-2026'],
        note:
          'First-party publisher and estate owner; a separate contracted vehicle operator is not inferred from the reviewed source.',
      },
    ],
    placeConnections: [
      {
        placeId: 'mrt3-buendia',
        role: 'served-stop',
        sourceIds: ['century-city-shuttle-2026'],
      },
      {
        placeId: 'one-ayala-terminal',
        role: 'served-stop',
        sourceIds: ['century-city-shuttle-2026'],
        note:
          'The first-party article identifies One Ayala / McKinley Exchange as a service connection.',
      },
    ],
    relatedAreaIds: ['century-city'],
    links: [
      {
        kind: 'source',
        label: 'Century Properties service announcement',
        url: 'https://www.century-properties.com/clean-convenient-connected-commuting-to-makati-just-got-easier/',
        sourceIds: ['century-city-shuttle-2026'],
      },
      {
        kind: 'route-schedule',
        label: 'Current route and schedule',
        url: 'https://ccth.framer.ai/',
        sourceIds: ['century-city-shuttle-live'],
        note:
          'Fares, departure times and exact stop sequence are deliberately left at the live service portal.',
      },
    ],
    provenance: {
      assertions: [
        {
          fieldPaths: [
            'name',
            'aliases',
            'serviceClass',
            'mode',
            'governance',
            'lifecycle.status',
          ],
          sourceIds: ['century-city-shuttle-2026'],
          evidenceStrength: 'direct',
        },
        {
          fieldPaths: ['placeConnections', 'relatedAreaIds'],
          sourceIds: ['century-city-shuttle-2026'],
          evidenceStrength: 'direct',
          note:
            'Century City Mall is described by the first-party source as the main terminal but is not duplicated here because it is not yet a canonical BetterMakati Place.',
        },
      ],
    },
    tags: ['shuttle', 'e-bus', 'Century City', 'private estate transport'],
  },
];

export const validateMobilityServices = (
  services: readonly MobilityServiceRecord[]
) => {
  const ids = new Set<string>();

  for (const source of mobilitySources) {
    if (!source.id.trim() || !source.label.trim()) {
      throw new Error('Mobility source ID and label must not be empty.');
    }
    validateUrl(source.url, 'Mobility source ' + source.id);
  }

  for (const service of services) {
    if (!service.id.trim() || !service.name.trim()) {
      throw new Error('Mobility service ID and name must not be empty.');
    }
    if (ids.has(service.id)) {
      throw new Error('Duplicate mobility service ID: ' + service.id);
    }
    ids.add(service.id);

    if (
      service.geometryArtifactId !== undefined &&
      !service.geometryArtifactId.trim()
    ) {
      throw new Error(
        'Mobility service geometryArtifactId must not be empty: ' +
          service.id
      );
    }

    requireSources(
      service.lifecycle.sourceIds,
      'Mobility lifecycle ' + service.id
    );

    const placeIds = new Set<string>();
    for (const connection of service.placeConnections) {
      if (!placeRegistryById.has(connection.placeId)) {
        throw new Error(
          'Mobility service ' +
            service.id +
            ' references missing Place: ' +
            connection.placeId
        );
      }
      if (placeIds.has(connection.placeId)) {
        throw new Error(
          'Mobility service ' +
            service.id +
            ' duplicates Place connection: ' +
            connection.placeId
        );
      }
      placeIds.add(connection.placeId);
      requireSources(
        connection.sourceIds,
        'Mobility Place connection ' +
          service.id +
          ' -> ' +
          connection.placeId
      );
    }

    for (const areaId of service.relatedAreaIds ?? []) {
      if (!civicAreaById.has(areaId)) {
        throw new Error(
          'Mobility service ' +
            service.id +
            ' references missing Area: ' +
            areaId
        );
      }
    }

    for (const body of service.responsibleBodies) {
      requireSources(
        body.sourceIds,
        'Mobility responsible body ' + service.id + ':' + body.name
      );
    }

    for (const link of service.links) {
      validateUrl(link.url, 'Mobility link ' + service.id + ':' + link.label);
      requireSources(
        link.sourceIds,
        'Mobility link ' + service.id + ':' + link.label
      );
    }

    for (const [index, assertion] of service.provenance.assertions.entries()) {
      requireSources(
        assertion.sourceIds,
        'Mobility assertion ' + service.id + '[' + index + ']'
      );
    }
  }

  return true;
};

validateMobilityServices(mobilityServices);

export const mobilityServiceById = new Map(
  mobilityServices.map(service => [service.id, service])
);

export const mobilityServicesForPlace = (placeId: string) =>
  mobilityServices.filter(service =>
    service.placeConnections.some(connection => connection.placeId === placeId)
  );

export const mobilityServicesForArea = (areaId: string) =>
  mobilityServices.filter(service => service.relatedAreaIds?.includes(areaId));
