import { procurementProjectEntries } from './accountabilitySupplement';
import { barangays } from './barangays';
import { civicAreas } from './areaOrganizationRegistry';
import { cityMonitorRecords } from './cityMonitor';
import { localLegislationRecords } from './localLegislation';
import { mobilityServices } from './mobilitySystems';
import { placeRegistry } from './placeRegistry';
import type { NewsItem } from './newsTypes';

export type NewsCivicTargetType =
  | 'barangay'
  | 'area'
  | 'place'
  | 'mobility-service'
  | 'accountability-record'
  | 'legislation-record'
  | 'city-monitor-record';

export type NewsCivicRelationshipBasis =
  | 'explicit-title-mention'
  | 'explicit-description-mention'
  | 'explicit-reference'
  | 'shared-source-url';

export interface NewsCivicRelationship {
  id: string;
  targetType: NewsCivicTargetType;
  targetId: string;
  label: string;
  href: string;
  basis: NewsCivicRelationshipBasis;
  matchedText?: string;
}

export type NewsMakatiRelevance =
  | 'direct-city'
  | 'direct-entity'
  | 'contextual';

export interface NewsCivicEnrichment {
  relevance: NewsMakatiRelevance;
  relevanceLabel: string;
  relationships: NewsCivicRelationship[];
}

const normalize = (value: string) =>
  value
    .normalize('NFKD')
    .toLocaleLowerCase('en-PH')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const containsPhrase = (text: string, phrase: string) => {
  const haystack = ' ' + normalize(text) + ' ';
  const needle = normalize(phrase);
  return Boolean(needle) && haystack.includes(' ' + needle + ' ');
};

const matchBasis = (
  item: NewsItem,
  phrases: readonly string[]
): { basis: NewsCivicRelationshipBasis; matchedText: string } | undefined => {
  for (const phrase of phrases) {
    if (containsPhrase(item.title, phrase)) {
      return { basis: 'explicit-title-mention', matchedText: phrase };
    }
  }

  for (const phrase of phrases) {
    if (containsPhrase(item.description, phrase)) {
      return { basis: 'explicit-description-mention', matchedText: phrase };
    }
  }

  return undefined;
};

const relationshipKey = (
  targetType: NewsCivicTargetType,
  targetId: string
) => targetType + ':' + targetId;

const durablePlaceCategories = new Set([
  'park',
  'public-office',
  'health-center',
  'community-center',
  'public-market',
  'heritage-site',
  'transport-stop',
  'transport-terminal',
]);

const bareBarangayTitleNames = new Set([
  'poblacion',
  'bel-air',
  'bangkal',
  'singkamas',
  'palanan',
  'kasilawan',
]);

const barangayRelationships = (item: NewsItem): NewsCivicRelationship[] =>
  barangays.flatMap(barangay => {
    const explicitForms = [
      'Barangay ' + barangay.name,
      'Brgy ' + barangay.name,
      'Brgy. ' + barangay.name,
    ];

    let match = matchBasis(item, explicitForms);

    if (
      !match &&
      (barangay.name.includes(' ') ||
        barangay.name.includes('-') ||
        bareBarangayTitleNames.has(barangay.slug)) &&
      containsPhrase(item.title, barangay.name)
    ) {
      match = {
        basis: 'explicit-title-mention',
        matchedText: barangay.name,
      };
    }

    if (!match) return [];

    return [
      {
        id: 'news-' + relationshipKey('barangay', barangay.slug),
        targetType: 'barangay' as const,
        targetId: barangay.slug,
        label: 'Barangay ' + barangay.name,
        href: '/barangays/' + barangay.slug,
        basis: match.basis,
        matchedText: match.matchedText,
      },
    ];
  });

const areaRelationships = (item: NewsItem): NewsCivicRelationship[] =>
  civicAreas.flatMap(area => {
    const phrases = [
      area.name,
      ...(area.aliases?.map(alias => alias.name) ?? []),
    ].filter(value => normalize(value).length >= 5);

    const match = matchBasis(item, phrases);
    if (!match) return [];

    return [
      {
        id: 'news-' + relationshipKey('area', area.id),
        targetType: 'area' as const,
        targetId: area.id,
        label: area.name,
        href: '/estates#area-' + area.id,
        basis: match.basis,
        matchedText: match.matchedText,
      },
    ];
  });

const placeRelationships = (item: NewsItem): NewsCivicRelationship[] =>
  placeRegistry.flatMap(place => {
    if (!durablePlaceCategories.has(place.primaryCategory)) return [];

    const phrases = [
      place.name,
      ...(place.aliases?.map(alias => alias.name) ?? []),
    ].filter(value => normalize(value).length >= 6);

    const match = matchBasis(item, phrases);
    if (!match) return [];

    return [
      {
        id: 'news-' + relationshipKey('place', place.id),
        targetType: 'place' as const,
        targetId: place.id,
        label: place.name,
        href: '/civic-map/' + place.id,
        basis: match.basis,
        matchedText: match.matchedText,
      },
    ];
  });

const mobilityRelationships = (item: NewsItem): NewsCivicRelationship[] =>
  mobilityServices.flatMap(service => {
    const phrases = [
      service.name,
      ...(service.aliases ?? []),
    ].filter(value => normalize(value).length >= 4);

    const match = matchBasis(item, phrases);
    if (!match) return [];

    return [
      {
        id: 'news-' + relationshipKey('mobility-service', service.id),
        targetType: 'mobility-service' as const,
        targetId: service.id,
        label: service.name,
        href: '/mobility#system-' + service.id,
        basis: match.basis,
        matchedText: match.matchedText,
      },
    ];
  });

const accountabilityRelationships = (
  item: NewsItem
): NewsCivicRelationship[] => {
  const text = item.title + ' ' + item.description;

  return procurementProjectEntries.flatMap(record => {
    const referenceNo = record.procurement?.referenceNo;
    if (!referenceNo || !containsPhrase(text, referenceNo)) return [];

    return [
      {
        id: 'news-' + relationshipKey('accountability-record', record.id),
        targetType: 'accountability-record' as const,
        targetId: record.id,
        label: record.title,
        href: '/accountability#' + record.id,
        basis: 'explicit-reference' as const,
        matchedText: referenceNo,
      },
    ];
  });
};

const legislationRelationships = (item: NewsItem): NewsCivicRelationship[] => {
  const text = item.title + ' ' + item.description;

  return localLegislationRecords.flatMap(record => {
    const references = [
      record.reference.display,
      record.reference.officialNumber,
    ].filter(Boolean);

    const matched = references.find(reference =>
      containsPhrase(text, reference)
    );

    if (!matched) return [];

    return [
      {
        id: 'news-' + relationshipKey('legislation-record', record.id),
        targetType: 'legislation-record' as const,
        targetId: record.id,
        label: record.reference.display + ' — ' + record.title,
        href: '/legislation?record=' + encodeURIComponent(record.id),
        basis: 'explicit-reference' as const,
        matchedText: matched,
      },
    ];
  });
};

const cityMonitorRelationships = (item: NewsItem): NewsCivicRelationship[] => {
  const text = item.title + ' ' + item.description;

  return cityMonitorRecords.flatMap(record => {
    const sourceUrls = [
      record.sourceUrl,
      ...(record.documents?.map(document => document.url) ?? []),
    ];
    const sharedUrl = sourceUrls.some(url => url && url === item.link);

    if (sharedUrl) {
      return [
        {
          id: 'news-' + relationshipKey('city-monitor-record', record.id),
          targetType: 'city-monitor-record' as const,
          targetId: record.id,
          label: record.title,
          href: '/city-monitor/' + record.id,
          basis: 'shared-source-url' as const,
        },
      ];
    }

    if (
      record.referenceNo &&
      containsPhrase(text, record.referenceNo)
    ) {
      return [
        {
          id: 'news-' + relationshipKey('city-monitor-record', record.id),
          targetType: 'city-monitor-record' as const,
          targetId: record.id,
          label: record.title,
          href: '/city-monitor/' + record.id,
          basis: 'explicit-reference' as const,
          matchedText: record.referenceNo,
        },
      ];
    }

    return [];
  });
};

export const newsCivicRelationshipsFor = (
  item: NewsItem
): NewsCivicRelationship[] => {
  const relationships = [
    ...barangayRelationships(item),
    ...areaRelationships(item),
    ...placeRelationships(item),
    ...mobilityRelationships(item),
    ...accountabilityRelationships(item),
    ...legislationRelationships(item),
    ...cityMonitorRelationships(item),
  ];

  return [
    ...new Map(
      relationships.map(relationship => [
        relationshipKey(
          relationship.targetType,
          relationship.targetId
        ),
        relationship,
      ])
    ).values(),
  ];
};

export const enrichNewsItem = (item: NewsItem): NewsCivicEnrichment => {
  const relationships = newsCivicRelationshipsFor(item);
  const titleNamesMakati = containsPhrase(item.title, 'Makati');
  const titleNamesEntity = relationships.some(
    relationship => relationship.basis === 'explicit-title-mention'
  );

  if (titleNamesMakati) {
    return {
      relevance: 'direct-city',
      relevanceLabel: 'Directly about Makati',
      relationships,
    };
  }

  if (titleNamesEntity) {
    return {
      relevance: 'direct-entity',
      relevanceLabel: 'Directly about a Makati place or civic entity',
      relationships,
    };
  }

  return {
    relevance: 'contextual',
    relevanceLabel: 'Makati appears in supporting context',
    relationships,
  };
};

export const isTodayNewsCandidate = (item: NewsItem) => {
  if (!item.todayEligible) return false;
  return enrichNewsItem(item).relevance !== 'contextual';
};
