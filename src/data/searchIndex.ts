import { makatiHistory } from './makatiHistory';
import { barangays as barangayProfiles, barangayFacilities } from './barangays';
import { electedOfficials } from './electedOfficials';
import { serviceDirectory } from './serviceDirectory';
import { governmentServiceOffices } from './governmentServiceOffices';
import {
  civicAssetTypeLabels,
  civicEntityKindLabels,
  placeRegistry,
  placeRegistryById,
} from './placeRegistry';
import { mobilityServices } from './mobilitySystems';
import { mobilityRouteCorridors } from './mobilityRoutes';
import { mobilityNetworkRelationships } from './mobilityNetwork';
import { cityIndicators } from './cityIndicators';
import { integrityProcurementEntities } from './integrityData';
import { reports } from './reports';
import {
  civicAreaById,
  civicAreaRelationships,
  civicAreas,
  civicOrganizationById,
  civicOrganizations,
} from './areaOrganizationRegistry';
import { visitorExperiences, visitorResources } from './visitorCuration';
import {
  civicTimelineCanonicalRefKey,
  type CivicTimelineItem,
} from './civicTimeline';
import { nativeCivicTimelineItems } from './civicTimelineNative';
import { civicTimelinePrimaryValue } from './civicTimelineViews';

export type SearchGroup =
  | 'Service'
  | 'Visit'
  | 'Government'
  | 'Barangay'
  | 'Record'
  | 'Tool'
  | 'Contact'
  | 'Place'
  | 'Segment'
  | 'Route'
  | 'Area'
  | 'Organization';

export interface SearchItem {
  title: string;
  group: SearchGroup;
  category: string;
  description: string;
  href: string;
  keywords: string;
  serviceId?: string;
  featured?: boolean;
  canonicalKey?: string;
}

const serviceItems: SearchItem[] = serviceDirectory.map(item => ({
  title: item.title,
  group: 'Service',
  category: item.category,
  description: item.description,
  href: '/services/guide/' + item.id,
  serviceId: item.id,
  keywords: [
    item.keywords,
    item.agency,
    item.level,
    item.type,
  ].join(' '),
  featured: item.featured,
}));

const recurringVisitorItems: SearchItem[] = visitorExperiences.flatMap(
  experience => {
    if (experience.kind !== 'recurring-experience') return [];

    return [
      {
        title: experience.name,
        group: 'Visit' as const,
        category: experience.category,
        description: experience.summary,
        href: '/visit#explore-' + experience.id,
        keywords: [
          experience.id,
          ...experience.tags,
          'Explore Makati recurring experience market city context',
        ].join(' '),
        canonicalKey: 'visitor-experience:' + experience.id,
      },
    ];
  }
);

const visitorResourceItems: SearchItem[] = visitorResources.map(resource => ({
  title: resource.name,
  group: 'Visit' as const,
  category:
    resource.role === 'official-city'
      ? 'Official visitor resource'
      : 'Visitor resource',
  description: resource.summary,
  href: '/visit#resources',
  keywords: [
    resource.id,
    resource.role,
    ...(resource.areaRefs ?? []),
    'Explore Makati visitor source guide current information',
  ].join(' '),
  canonicalKey: 'visitor-resource:' + resource.id,
}));

const visitItems: SearchItem[] = [
  {
    title: 'Explore Makati',
    group: 'Visit',
    category: 'Explore',
    description:
      'Understand Makati through places, districts, barangays, heritage, history, mobility and current activity.',
    href: '/visit',
    keywords: [
      'explore visit Makati city orientation places districts barangays heritage history mobility markets current activity',
      'restaurants cafes shopping nightlife live discovery',
      ...visitorExperiences.flatMap(experience => experience.tags),
    ].join(' '),
    featured: true,
    canonicalKey: 'visitor:explore-makati',
  },
  ...recurringVisitorItems,
  {
    title: 'Heritage & Culture',
    group: 'Visit',
    category: 'Heritage',
    description: 'Historical markers, churches, museums and cultural sites.',
    href: '/heritage',
    keywords: 'heritage culture historical sites church museum old makati',
    featured: true,
  },
  {
    title: 'History of Makati',
    group: 'Visit',
    category: 'History',
    description: 'Timeline from San Pedro Macati to the modern city.',
    href: '/history',
    keywords: 'history timeline san pedro macati sampiro cityhood origin name',
    featured: true,
  },
  {
    title: 'Getting around Makati',
    group: 'Visit',
    category: 'Transport',
    description: 'Public transport, route knowledge, transfers and live directions.',
    href: '/mobility',
    keywords:
      'transport commute mrt one ayala bus jeep uv express grab angkas joyride move it',
    featured: true,
  },
  {
    title: 'Cinemas in Makati',
    group: 'Visit',
    category: 'Entertainment',
    description: 'Cinema locations and current showtime links.',
    href: '/cinemas',
    keywords:
      'cinema movie theater showtimes power plant glorietta greenbelt circuit century waltermart cash carry',
  },
  ...visitorResourceItems,
];

const governmentItems: SearchItem[] = [
  {
    title: 'City leadership',
    group: 'Government',
    category: 'Government',
    description: 'Mayor and Vice Mayor.',
    href: '/government#leadership',
    keywords: 'mayor vice mayor leadership executive city hall official',
    featured: true,
  },
  {
    title: 'City Council',
    group: 'Government',
    category: 'Government',
    description: 'Sangguniang Panlungsod.',
    href: '/government#council',
    keywords: 'council councilor legislative sanggunian vice mayor ordinance',
  },
  {
    title: 'Elections & Voting',
    group: 'Government',
    category: 'Elections',
    description:
      'Neutral voter information, 2025 results, Makati election history and the current November 2028 Barangay and SK election schedule.',
    href: '/elections',
    keywords:
      'elections voting vote voter registration precinct polling place comelec barangay sk bske candidates mayor history 1998 2001 2004 2007 2010 2013 2016 2019 2022 2025 2028 Republic Act 12326 postponed schedule',
    featured: true,
    canonicalKey: 'civic-owner:elections:election-record:bske-schedule',
  },
  {
    title: '2025 Makati results by barangay',
    group: 'Government',
    category: 'Elections',
    description: 'See which mayoral candidate carried each of Makati’s current 23 barangays, with exact barangay totals where published.',
    href: '/elections#barangay-results-2025',
    keywords: '2025 election mayor barangay results Nancy Binay Luis Campos Bangkal Bel-Air Carmona Dasmarinas Forbes Park Guadalupe Nuevo Guadalupe Viejo Kasilawan La Paz Magallanes Olympia Palanan Pinagkaisahan Pio Del Pilar Poblacion San Antonio San Isidro San Lorenzo Santa Cruz Singkamas Tejeros Urdaneta Valenzuela',
  },
  {
    title: 'Makati mayoral election history, 1998–2025',
    group: 'Record',
    category: 'Elections',
    description: 'Ten regular Makati mayoral elections with candidates, vote totals, margins, source quality and the 2025 boundary break.',
    href: '/elections#mayoral-history',
    keywords: 'Makati mayor election history historical results 1998 2001 2004 2007 2010 2013 2016 2019 2022 2025 Binay Pena Campos vote margin',
  },
  {
    title: 'City offices',
    group: 'Government',
    category: 'Government',
    description: 'Departments and offices of the City Government of Makati.',
    href: '/government#offices',
    keywords:
      'office department city hall government engineering health social welfare environment budget finance',
    featured: true,
  },
  {
    title: 'Makati statistics',
    group: 'Government',
    category: 'Government',
    description: 'Population and basic city figures.',
    href: '/statistics',
    keywords:
      'statistics population demographic income class data city profile',
  },
  {
    title: 'Legislation',
    group: 'Government',
    category: 'Government',
    description: 'Resolutions, ordinances and the Makati City Charter.',
    href: '/legislation',
    keywords: 'legislation ordinance resolution law charter council',
  },
  {
    title: 'Makati in the News',
    group: 'Government',
    category: 'Government',
    description: 'Current Makati coverage with publisher and official-source handoffs.',
    href: '/news',
    keywords: 'news coverage headline publisher announcement city government update',
  },
  {
    title: 'Estates, Districts & Associations',
    group: 'Government',
    category: 'City geography',
    description:
      'Browse canonical Makati business districts, estates, residential villages and their organizations.',
    href: '/estates',
    keywords:
      'estate district village association homeowners hoa business district managed area organization',
  },
  {
    title: 'Live Makati',
    group: 'Government',
    category: 'Government',
    description: 'Weather, air quality, advisories and utility status sources.',
    href: '/live',
    keywords:
      'live weather air quality aqi rain thunderstorm pagasa meralco outage manila water macea phivolcs advisory',
    featured: true,
  },
];

const recordItems: SearchItem[] = [
  {
    title: 'Projects & Budget',
    group: 'Record',
    category: 'Records',
    description: 'Budget, project disclosures, procurement and audit records.',
    href: '/projects-budget',
    keywords:
      'budget spending projects procurement audit public records transparency contract',
    featured: true,
  },
  {
    title: 'CY 2025 Annual Budget',
    group: 'Record',
    category: 'Records',
    description: 'City annual budget document.',
    href: '/projects-budget#budget',
    keywords: 'annual budget 2025 appropriation spending finance',
  },
  {
    title: 'Project disclosures',
    group: 'Record',
    category: 'Records',
    description: 'Development-fund programs and projects.',
    href: '/projects-budget#projects',
    keywords: 'project tracker infrastructure nta development project status',
  },
  {
    title: 'Procurement',
    group: 'Record',
    category: 'Records',
    description: 'Follow procurement awards toward contracts, implementation and completion evidence.',
    href: '/accountability?type=project',
    keywords: 'procurement bidding award supplier contractor philgeps purchase contract notice to proceed implementation completion evidence',
  },
  {
    title: 'Audit findings & follow-through',
    group: 'Record',
    category: 'Records',
    description: 'Read structured COA observations, recommendations, responses and known follow-up gaps.',
    href: '/accountability?type=audit',
    keywords: 'audit coa finding observation recommendation management response follow up compliance resolution',
  },
];

const toolItems: SearchItem[] = [
  {
    title: 'Saan Ako Lalapit?',
    group: 'Tool',
    category: 'Tools',
    description:
      'Find the right Makati office, service or channel for your concern.',
    href: '/community-tools/saan-ako-lalapit',
    keywords:
      'where office concern help which department saan ako lalapit finder',
    featured: true,
  },
  {
    title: 'Project Tracker',
    group: 'Tool',
    category: 'Tools',
    description: 'Follow projects and procurements from public award records toward implementation and completion evidence.',
    href: '/accountability?type=project',
    keywords:
      'project tracker infrastructure public works procurement award contract notice to proceed implementation completion evidence status',
  },
  {
    title: 'Getting Around',
    group: 'Tool',
    category: 'Tools',
    description: 'Directions, public transport and ride-hailing links.',
    href: '/mobility',
    keywords:
      'commute transport route bus jeep terminal traffic fare mrt grab angkas joyride move it',
  },
  {
    title: 'Makati Calendar',
    group: 'Tool',
    category: 'Civic timeline',
    description:
      'Civic dates, deadlines, meetings, legislation milestones, publications and historical records in one timeline.',
    href: '/calendar',
    keywords:
      'Makati calendar civic timeline deadline public hearing council session barangay assembly legislation procurement election report publication advisory archive',
    featured: true,
    canonicalKey: 'tool:makati-calendar',
  },
  {
    title: 'Live Makati',
    group: 'Tool',
    category: 'Tools',
    description: 'Weather, air quality, utility status and advisories.',
    href: '/live',
    keywords: 'weather aqi pagasa meralco outage water advisory live makati',
  },
  {
    title: 'Opportunities Hub',
    group: 'Tool',
    category: 'Tools',
    description:
      'Planned jobs, scholarships, training and volunteer opportunities tool.',
    href: '/get-involved?type=idea&tool=opportunities-hub#submission',
    keywords:
      'jobs scholarship training internship volunteer opportunities employment',
  },
  {
    title: 'Waste & Collection Guide',
    group: 'Tool',
    category: 'Tools',
    description: 'Planned waste rules and collection information tool.',
    href: '/get-involved?type=idea&tool=waste-guide#submission',
    keywords: 'waste garbage trash collection recycling environment schedule',
  },
];

const statisticsHrefForTopic = (
  topic: (typeof cityIndicators)[number]['topic']
) => {
  if (topic === 'population-demographics') return '/statistics#population-trend';
  if (topic === 'economy-business') return '/statistics#economy-work';
  if (
    [
      'services',
      'land-infrastructure',
      'environment',
      'mobility',
      'health',
      'education',
    ].includes(topic)
  ) {
    return '/statistics#city-systems';
  }
  return '/statistics#statistics-data';
};

const civicIntelligenceItems: SearchItem[] = [
  ...cityIndicators
    .filter(indicator => indicator.revision.status !== 'retired')
    .map(indicator => ({
      title: indicator.title,
      group: 'Record' as const,
      category: 'Statistic',
      description: indicator.definition.description,
      href: statisticsHrefForTopic(indicator.topic),
      keywords: [
        indicator.id,
        indicator.shortLabel ?? '',
        indicator.topic,
        indicator.definition.measure,
        indicator.definition.basis,
        indicator.definition.interpretation ?? '',
        indicator.definition.caveat ?? '',
        indicator.unit.code,
        ...indicator.tags,
        'statistics indicator data',
      ].join(' '),
      canonicalKey: 'indicator:' + indicator.id,
    })),
  ...integrityProcurementEntities.map(entity => ({
    title: entity.canonicalName,
    group: 'Record' as const,
    category: entity.kind === 'joint-venture' ? 'Joint venture' : 'Supplier',
    description:
      entity.kind === 'joint-venture'
        ? 'Source-stated joint-venture identity in indexed Makati procurement awards.'
        : 'Normalized supplier identity in indexed Makati procurement awards.',
    href: '/integrity#procurement',
    keywords: [
      entity.id,
      entity.kind,
      ...entity.sourceIds,
      ...(entity.notes ?? []),
      'integrity procurement supplier contractor award',
    ].join(' '),
    canonicalKey: 'integrity-entity:' + entity.id,
  })),
  ...reports.map(report => ({
    title: report.headline,
    group: 'Record' as const,
    category: 'Report',
    description: report.subheadline,
    href: '/reports/' + report.slug,
    keywords: [
      report.slug,
      report.synthesis,
      'featured report insight analysis',
    ].join(' '),
    canonicalKey: 'report:' + report.slug,
  })),
];

const areaOrganizationItems: SearchItem[] = [
  ...civicAreas.map(area => ({
    title: area.name,
    group: 'Area' as const,
    category:
      area.kind === 'business-district'
        ? 'Business district'
        : area.kind === 'commercial-estate'
          ? 'Commercial estate'
          : area.kind === 'mixed-use-estate'
            ? 'Mixed-use estate'
            : area.kind === 'named-subdistrict'
              ? 'District'
              : area.kind === 'residential-village'
                ? 'Residential village'
                : 'Managed area',
    description:
      area.summary ??
      'Canonical managed area in the BetterMakati Area Registry.',
    href: '/estates#area-' + area.id,
    keywords: [
      area.id,
      ...(area.aliases?.map(alias => alias.name) ?? []),
      ...area.barangaySlugs,
      ...area.tags,
      ...(area.attributes?.flatMap(attribute => [
        attribute.label,
        attribute.value,
      ]) ?? []),
      'area estate district village neighborhood geography',
    ].join(' '),
    canonicalKey: 'area:' + area.id,
  })),
  ...civicOrganizations.map(organization => ({
    title: organization.name,
    group: 'Organization' as const,
    category:
      organization.kind === 'estate-association'
        ? 'Estate association'
        : organization.kind === 'homeowners-association'
          ? 'Homeowners association'
          : organization.kind === 'developer'
            ? 'Developer'
            : organization.kind === 'property-manager'
              ? 'Property manager'
              : 'Organization',
    description:
      organization.summary ??
      'Canonical organization connected to a Makati managed area.',
    href: '/estates#organization-' + organization.id,
    keywords: [
      organization.id,
      ...(organization.abbreviations ?? []),
      ...(organization.aliases?.map(alias => alias.name) ?? []),
      ...organization.tags,
      ...organization.channels.map(channel => channel.label),
      'estate association homeowners hoa developer organization',
    ].join(' '),
    canonicalKey: 'organization:' + organization.id,
  })),
];

const mobilityServiceById = new Map(
  mobilityServices.map(service => [service.id, service])
);

const mobilityNodeLabel = (
  node: { type: 'service' | 'route' | 'place' | 'area'; id: string }
) => {
  if (node.type === 'service') {
    return mobilityServiceById.get(node.id)?.name ?? node.id;
  }
  if (node.type === 'place') {
    return placeRegistryById.get(node.id)?.name ?? node.id;
  }
  return node.id;
};

const mobilitySearchItems: SearchItem[] = [
  ...mobilityServices.map(service => ({
    title: service.name,
    group: 'Route' as const,
    category:
      service.serviceClass === 'public-ferry'
        ? 'Public ferry service'
        : service.serviceClass === 'private-estate-shuttle'
          ? 'Private estate shuttle'
          : 'Public transport system',
    description: service.summary,
    href: '/mobility#transport-anchors',
    keywords: [
      service.id,
      ...(service.aliases ?? []),
      service.mode,
      service.governance,
      service.lifecycle.status,
      ...service.tags,
      ...service.placeConnections.map(connection =>
        placeRegistryById.get(connection.placeId)?.name ?? connection.placeId
      ),
      ...(service.relatedAreaIds ?? []).map(
        areaId => civicAreaById.get(areaId)?.name ?? areaId
      ),
      'mobility public transport commute getting around',
    ].join(' '),
    canonicalKey: 'mobility-service:' + service.id,
  })),
  ...mobilityRouteCorridors.map(route => {
    if (route.recordKind === 'current-service') {
      return {
        title: route.currentService.routeLabel,
        group: 'Route' as const,
        category:
          route.currentService.serviceClass === 'p2p-bus'
            ? 'P2P bus route'
            : route.currentService.serviceClass === 'city-bus'
              ? 'Bus route'
              : 'UV Express route',
        description:
          'Current route from ' +
          route.currentService.originLabel +
          '; identity corroborated by current terminal rosters.',
        href: '/mobility#routes',
        keywords: [
          route.id,
          route.mode,
          route.currentService.routeLabel,
          route.currentService.originLabel,
          route.currentService.destinationLabel,
          route.currentService.serviceClass,
          'One Ayala current route transport commute',
        ].join(' '),
        canonicalKey: 'mobility-route:' + route.id,
      };
    }

    const unresolved =
      route.disposition === 'unresolved-current-status';

    return {
      title: route.historical.from + ' ↔ ' + route.historical.to,
      group: 'Route' as const,
      category: unresolved
        ? 'Historical jeepney route · current status unresolved'
        : route.disposition === 'successor-corridor'
          ? 'Jeepney successor corridor'
          : 'Jeepney current corridor',
      description: unresolved
        ? '2020 Makati city route row retained as historical lineage; exact current route status is unresolved.'
        : '2020 Makati city route row reconciled against later current-corridor evidence.',
      href: '/mobility#routes',
      keywords: [
        route.id,
        route.historical.from,
        route.historical.to,
        route.historical.associationLabel,
        route.disposition,
        route.reconciliationStatus,
        'jeepney route corridor Makati transport commute',
      ].join(' '),
      canonicalKey: 'mobility-route:' + route.id,
    };
  }),
  ...mobilityNetworkRelationships
    .filter(
      relationship =>
        relationship.kind === 'transfer' ||
        relationship.kind === 'service-connected-hub'
    )
    .map(relationship => ({
      title:
        mobilityNodeLabel(relationship.from) +
        ' ↔ ' +
        mobilityNodeLabel(relationship.to),
      group: 'Route' as const,
      category:
        relationship.kind === 'transfer'
          ? 'Transfer'
          : 'System–hub connection',
      description:
        relationship.note ??
        'Verified relationship in the BetterMakati mobility network.',
      href: '/mobility#interchanges',
      keywords: [
        relationship.id,
        relationship.kind,
        mobilityNodeLabel(relationship.from),
        mobilityNodeLabel(relationship.to),
        relationship.evidenceStrength,
        'transfer interchange connection mobility commute',
      ].join(' '),
      canonicalKey: 'mobility-network:' + relationship.id,
    })),
];

const civicRegistryItems: SearchItem[] = [
  {
    title: 'Civic Map',
    group: 'Tool',
    category: 'Participation',
    description: 'Browse civic places, bounded infrastructure segments and transport routes; report non-emergency problems and suggest improvements.',
    href: '/civic-map',
    keywords: 'civic map report pothole sidewalk blocked park public infrastructure road street segment proposal crosswalk trees jeepney route public transport',
    featured: true,
  },
  ...placeRegistry
    .filter(record =>
      record.entityKind === 'place'
        ? record.verification.status === 'verified'
        : record.verification.status !== 'needs-verification'
    )
    .map(record => {
      const geometry = record.location.geometry;
      const entityGroup =
        record.entityKind === 'place'
          ? ('Place' as const)
          : record.entityKind === 'segment'
            ? ('Segment' as const)
            : ('Route' as const);
      const locationText = [
        record.location.address,
        ...record.location.barangays,
        geometry?.street,
        geometry?.from && geometry?.to ? geometry.from + ' to ' + geometry.to : '',
      ]
        .filter(Boolean)
        .join(' · ');
      const description = [record.summary, locationText].filter(Boolean).join(' · ');

      return {
        title: record.name,
        group: entityGroup,
        category: civicAssetTypeLabels[record.primaryCategory],
        description:
          description ||
          civicEntityKindLabels[record.entityKind] + ' in the BetterMakati Civic Registry.',
        href: '/civic-map/' + record.id,
        keywords: [
          civicAssetTypeLabels[record.primaryCategory],
          civicEntityKindLabels[record.entityKind],
          ...record.location.barangays,
          record.location.address ?? '',
          geometry?.street ?? '',
          geometry?.from ?? '',
          geometry?.to ?? '',
          ...(record.aliases?.map(alias => alias.name) ?? []),
          ...(record.servicesAtLocation?.map(service => service.label) ?? []),
          record.management.responsibilityText ?? '',
          ...record.management.bodies.map(body => body.name),
          ...record.tags,
          'civic registry place location map report problem proposal improve observe conditions',
        ].join(' '),
      };
    }),
];
const radicalCivicItems: SearchItem[] = [
  {
    title: 'City Monitor',
    group: 'Record',
    category: 'Government activity',
    description: 'Daily-monitored official activity across council, legislation, speeches, procurement, projects, publications and consultations.',
    href: '/city-monitor',
    keywords: 'city monitor council session legislation ordinance resolution speech mayor SOCA procurement bidding award publication consultation official activity',
    featured: true,
  },
  {
    title: 'Civic Briefs',
    group: 'Tool',
    category: 'Government activity',
    description: 'Daily, weekly and monthly BetterMakati digests from City Monitor.',
    href: '/briefs',
    keywords: 'facebook updates daily brief weekly makati brief monthly state of makati city monitor digest',
    featured: true,
  },
  {
    title: 'Open Government Doctrine',
    group: 'Record',
    category: 'Open Government',
    description: 'BetterMakati methodology, implementation status and OECD-aligned self-audit.',
    href: '/open-government',
    keywords: 'open government doctrine transparency accountability participation presence integrity oecd ogp audit',
    featured: true,
  },
  {
    title: 'BetterMakati Status',
    group: 'Record',
    category: 'Open Government',
    description: 'Public self-accountability: coverage, source monitoring, community input and unmeasured performance gaps.',
    href: '/status',
    keywords: 'bettermakati status performance self audit metrics source watch coverage gaps evaluation',
    featured: true,
  },
  {
    title: 'Integrity & Public Interest',
    group: 'Record',
    category: 'Integrity',
    description: 'Public-service ethics, procurement integrity, beneficial ownership, audit evidence and coverage gaps.',
    href: '/integrity',
    keywords: 'integrity ethics procurement contractor supplier beneficial ownership audit public interest RA 6713 RA 12009',
    featured: true,
  },

  {
    title: 'Accountability Ledger',
    group: 'Record',
    category: 'Accountability',
    description: 'Follow public money, projects, audit findings and promises from source to follow-through.',
    href: '/accountability',
    keywords: 'accountability ledger public money budget project procurement commitment promise audit evidence outcome target status track missing document source gap',
    featured: true,
  },
  {
    title: 'Public Commitments',
    group: 'Record',
    category: 'Accountability',
    description: 'Track sourced city promises and targets against later public evidence.',
    href: '/accountability?type=commitment',
    keywords: 'public commitment promise target pledge delivery evidence deadline accountability follow through',
    featured: true,
  },
  {
    title: 'Public Records',
    group: 'Record',
    category: 'Records',
    description: 'Citizen-facing index of Makati public records, structured data and original sources.',
    href: '/records',
    keywords: 'public records transparency data documents source ordinance audit budget election download',
    featured: true,
  },
  {
    title: 'Participate in Makati',
    group: 'Tool',
    category: 'Participation',
    description: 'Find participation opportunities and follow BetterMakati community input.',
    href: '/participate',
    keywords: 'participate consultation public hearing assembly proposal comment community input feedback',
    featured: true,
  },
  {
    title: 'Today in Makati',
    group: 'Tool',
    category: 'Presence',
    description: 'Personalize BetterMakati by barangay and start with what matters today.',
    href: '/today',
    keywords: 'today my makati barangay local live news event weather personalized',
    featured: true,
  },
];

const contactItems: SearchItem[] = [
  {
    title: 'Hotlines & emergency contacts',
    group: 'Contact',
    category: 'Government',
    description: '911, City Hall, Makati Action Center and essential contacts.',
    href: '/hotlines',
    keywords:
      'hotline phone emergency 911 city hall drrmo action center contact',
    featured: true,
  },
  {
    title: 'Contact BetterMakati',
    group: 'Contact',
    category: 'Tools',
    description: 'Contact the project or report a correction.',
    href: '/contact',
    keywords: 'contact bettermakati correction github issue feedback',
  },
];

const barangayItems: SearchItem[] = barangayProfiles.map(barangay => {
  const facilities = barangayFacilities(barangay.slug, barangay.name);
  const people = [
    barangay.officials?.punongBarangay,
    barangay.officials?.skChairperson,
    barangay.officials?.secretary,
    barangay.officials?.treasurer,
    ...(barangay.officials?.kagawads ?? []),
  ].filter(Boolean);
  const relatedAreaIds = [
    ...new Set([
      ...(barangay.communityAreaIds ?? []),
      ...civicAreaRelationships.flatMap(relationship =>
        relationship.kind === 'within-barangay' &&
        relationship.from.type === 'area' &&
        relationship.to.type === 'barangay' &&
        relationship.to.id === barangay.slug
          ? [relationship.from.id]
          : []
      ),
    ]),
  ];
  const relatedAreaNames = relatedAreaIds.flatMap(areaId => {
    const area = civicAreaById.get(areaId);
    return area ? [area.name] : [];
  });
  const relatedOrganizationNames = civicAreaRelationships.flatMap(
    relationship => {
      if (
        !['managed-by', 'developed-by', 'operated-by'].includes(
          relationship.kind
        ) ||
        relationship.from.type !== 'area' ||
        !relatedAreaIds.includes(relationship.from.id) ||
        relationship.to.type !== 'organization'
      ) {
        return [];
      }
      const organization = civicOrganizationById.get(relationship.to.id);
      return organization ? [organization.name] : [];
    }
  );
  const localPlaces = [
    ...facilities.map(item => item.name),
    ...(barangay.notablePlaces?.map(item => item.name) ?? []),
    ...(barangay.heritageMarkers?.map(item => item.name) ?? []),
    ...relatedAreaNames,
    ...relatedOrganizationNames,
  ];

  return {
    title: `Barangay ${barangay.name}`,
    group: 'Barangay',
    category: 'Barangays',
    description: `Local services, current barangay officials, 2024 population, ${barangay.legislativeDistrict}, facilities, civic records and 2025 mayoral context.`,
    href: `/barangays/${barangay.slug}`,
    keywords: [
      barangay.name,
      'barangay hall local neighborhood population district profile council captain kagawad sk chairperson services facilities 2025 election mayor result voting',
      ...people,
      ...localPlaces,
    ].join(' '),
  };
});

const officeItems: SearchItem[] = governmentServiceOffices.map(office => ({
  title: office.name,
  group: 'Government',
  category: 'Government offices',
  description: office.address,
  href: '/government-offices#' + office.id,
  keywords: [
    office.agency,
    office.scope,
    office.address,
    office.barangay ?? '',
    office.phone ?? '',
    office.email ?? '',
  ].join(' '),
  featured: office.scope === 'In Makati',
}));

const officialItems: SearchItem[] = electedOfficials.map(official => ({
  title: official.displayName,
  group: 'Government',
  category: 'Elected officials',
  description: `${official.office}${official.district ? ' · ' + official.district : ''}.`,
  href: `/officials/${official.slug}`,
  keywords: `${official.name} ${official.displayName} ${official.office} ${official.district ?? ''} elected official councilor congress representative mayor vice mayor`,
}));

const coreSearchIndex: SearchItem[] = [
  ...makatiHistory.map(event => ({
    title: event.title,
    group: 'Record' as const,
    category: 'History',
    description: `${event.date} · ${event.summary}`,
    href: `/history#${event.id}`,
    keywords: `${event.date} ${event.topic} ${event.source.label} history timeline`,
  })),
  ...serviceItems,
  ...civicIntelligenceItems,
  ...radicalCivicItems,
  ...mobilitySearchItems,
  ...civicRegistryItems,
  ...areaOrganizationItems,
  ...visitItems,
  ...governmentItems,
  ...officeItems,
  ...officialItems,
  ...recordItems,
  ...toolItems,
  ...contactItems,
  ...barangayItems,
];

const timelineCanonicalSearchKey = (item: CivicTimelineItem) => {
  const ref = item.canonicalRef;
  if (ref.owner === 'legislation') return 'legislation-record:' + ref.id;
  if (ref.owner === 'reports') return 'report:' + ref.id;
  if (ref.owner === 'statistics') return 'indicator:' + ref.id;
  return 'civic-owner:' + civicTimelineCanonicalRefKey(ref);
};

const timelineSearchDateKeywords = (item: CivicTimelineItem) => {
  const value = civicTimelinePrimaryValue(item);
  const date = new Date(
    value.includes('T') ? value : value + 'T00:00:00+08:00'
  );
  return [
    value,
    new Intl.DateTimeFormat('en-PH', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'Asia/Manila',
    }).format(date),
  ];
};

const civicTimelineSearchGroups = new Map<string, CivicTimelineItem[]>();

for (const item of nativeCivicTimelineItems) {
  const key = timelineCanonicalSearchKey(item);
  const existing = civicTimelineSearchGroups.get(key) ?? [];
  existing.push(item);
  civicTimelineSearchGroups.set(key, existing);
}

const civicTimelineSearchItems: SearchItem[] = [
  ...civicTimelineSearchGroups.entries(),
].map(([canonicalKey, items]) => {
  const ordered = [...items].sort((left, right) =>
    civicTimelinePrimaryValue(right).localeCompare(
      civicTimelinePrimaryValue(left)
    )
  );
  const representative = ordered[0];

  return {
    title: representative.canonicalLabel,
    group: 'Record' as const,
    category: 'Civic timeline',
    description:
      ordered.length +
      ' source-backed dated civic milestone' +
      (ordered.length === 1 ? '' : 's') +
      ' linked to this canonical record.',
    href: representative.canonicalHref,
    keywords: ordered
      .flatMap(item => [
        item.id,
        item.title,
        item.summary,
        item.kind,
        item.temporal.semantic,
        item.actionability,
        ...timelineSearchDateKeywords(item),
        ...item.tags,
        ...item.sourceRefs.flatMap(source => [
          source.label,
          source.publisher,
        ]),
        'Makati Calendar civic timeline date milestone',
      ])
      .join(' '),
    canonicalKey,
  };
});

const civicTimelineSearchByKey = new Map(
  civicTimelineSearchItems.map(item => [item.canonicalKey!, item] as const)
);
const coreCanonicalKeys = new Set(
  coreSearchIndex.flatMap(item =>
    item.canonicalKey ? [item.canonicalKey] : []
  )
);

export const searchIndex: SearchItem[] = [
  ...coreSearchIndex.map(item => {
    if (!item.canonicalKey) return item;
    const timeline = civicTimelineSearchByKey.get(item.canonicalKey);
    if (!timeline) return item;
    return {
      ...item,
      keywords: item.keywords + ' ' + timeline.keywords,
    };
  }),
  ...civicTimelineSearchItems.filter(
    item => !coreCanonicalKeys.has(item.canonicalKey!)
  ),
];
