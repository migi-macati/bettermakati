import { civicAreaById } from './areaOrganizationRegistry';
import { findBarangay } from './barangays';
import { placeRegistryById } from './placeRegistry';

export type VisitorExperienceCategory =
  | 'Culture'
  | 'Green space'
  | 'Market'
  | 'Historic district'
  | 'City district';

export type VisitorCanonicalReference =
  | { type: 'place'; id: string }
  | { type: 'area'; id: string }
  | { type: 'barangay'; id: string };

export type VisitorSourceKind =
  | 'official-government'
  | 'first-party'
  | 'current-secondary';

export interface VisitorCurationSource {
  id: string;
  label: string;
  url: string;
  kind: VisitorSourceKind;
  checkedOn: string;
}

export interface VisitorExternalLink {
  label: string;
  url: string;
  kind: 'current-info' | 'official-resource' | 'live-discovery';
  sourceIds: string[];
}

interface VisitorExperienceBase {
  id: string;
  category: VisitorExperienceCategory;
  summary: string;
  sourceIds: string[];
  contextRefs?: VisitorCanonicalReference[];
  links: VisitorExternalLink[];
  tags: string[];
}

export type VisitorExperience =
  | (VisitorExperienceBase & {
      kind: 'canonical-destination';
      identityRef: VisitorCanonicalReference;
    })
  | (VisitorExperienceBase & {
      kind: 'recurring-experience';
      name: string;
      anchorRefs: VisitorCanonicalReference[];
      mapsQuery: string;
    });

export interface VisitorResource {
  id: string;
  name: string;
  role: 'supplemental-guide' | 'official-city';
  summary: string;
  url: string;
  sourceIds: string[];
  areaRefs?: string[];
}

export const visitorCurationReviewedOn = '2026-09-28';

export const visitorCurationSources: VisitorCurationSource[] = [
  {
    id: 'ayala-museum-booking-2026',
    label: 'Ayala Museum · current visit booking',
    url: 'https://events.ayalamuseum.org/',
    kind: 'first-party',
    checkedOn: visitorCurationReviewedOn,
  },
  {
    id: 'ayala-foundation-contact-2026',
    label: 'Ayala Foundation · contact and museum address',
    url: 'https://ayalafoundation.org/contact-us/',
    kind: 'first-party',
    checkedOn: visitorCurationReviewedOn,
  },
  {
    id: 'ayala-triangle-gardens-2026',
    label: 'Ayala Triangle · Gardens',
    url: 'https://www.ayalatriangle.com/gardens',
    kind: 'first-party',
    checkedOn: visitorCurationReviewedOn,
  },
  {
    id: 'salcedo-market-facebook-2026',
    label: 'Salcedo Community Market · official Facebook',
    url: 'https://www.facebook.com/SalcedoCommunityMarket/',
    kind: 'first-party',
    checkedOn: visitorCurationReviewedOn,
  },
  {
    id: 'salcedo-market-current-2026',
    label: 'What’s On Manila · Salcedo Saturday Market',
    url: 'https://whatsonmnl.com/event/salcedo-saturday-market',
    kind: 'current-secondary',
    checkedOn: visitorCurationReviewedOn,
  },
  {
    id: 'legazpi-market-facebook-2026',
    label: 'Legazpi Sunday Market · official Facebook',
    url: 'https://www.facebook.com/legazpisundaymarket/',
    kind: 'first-party',
    checkedOn: visitorCurationReviewedOn,
  },
  {
    id: 'legazpi-market-current-2026',
    label: 'What’s On Manila · Legazpi Sunday Market',
    url: 'https://whatsonmnl.com/event/legazpi-sunday-market',
    kind: 'current-secondary',
    checkedOn: visitorCurationReviewedOn,
  },
  {
    id: 'legazpi-market-map-2026',
    label: 'Waze · Legazpi Sunday Market',
    url: 'https://www.waze.com/fil/live-map/directions/ph/ncr/makati-city/legazpi-sunday-market?to=place.ChIJ6bzx3g3JlzMRaYZRn-QVC2o',
    kind: 'current-secondary',
    checkedOn: visitorCurationReviewedOn,
  },
  {
    id: 'makati-poblacion-profile-2026',
    label: 'City Government of Makati · Barangay Poblacion',
    url: 'https://www.makati.gov.ph/barangay/poblacion/34',
    kind: 'official-government',
    checkedOn: visitorCurationReviewedOn,
  },
  {
    id: 'ayala-malls-greenbelt-2026',
    label: 'Ayala Malls · Greenbelt',
    url: 'https://www.ayalamalls.com/main/malls/ayala-greenbelt/',
    kind: 'first-party',
    checkedOn: visitorCurationReviewedOn,
  },
  {
    id: 'ali-2025-integrated-report-visitor',
    label: 'Ayala Land · 2025 Integrated Report',
    url: 'https://ir.ayalaland.com.ph/wp-content/uploads/2026/04/ALI-2025-Integrated-Report.pdf',
    kind: 'first-party',
    checkedOn: visitorCurationReviewedOn,
  },
  {
    id: 'make-it-makati-2026',
    label: 'Make It Makati · visitor guide',
    url: 'https://makeitmakati.com/',
    kind: 'first-party',
    checkedOn: visitorCurationReviewedOn,
  },
  {
    id: 'makati-portal-2026',
    label: 'City Government of Makati · official portal',
    url: 'https://www.makati.gov.ph/',
    kind: 'official-government',
    checkedOn: visitorCurationReviewedOn,
  },
];

export const visitorExperiences: VisitorExperience[] = [
  {
    id: 'ayala-museum',
    kind: 'canonical-destination',
    category: 'Culture',
    identityRef: { type: 'place', id: 'ayala-museum' },
    summary:
      'A strong starting point for Philippine history, art, archaeology and the Filipinas Heritage Library.',
    sourceIds: ['ayala-museum-booking-2026', 'ayala-foundation-contact-2026'],
    contextRefs: [{ type: 'area', id: 'ayala-center' }],
    links: [
      {
        label: 'Current museum visit info',
        url: 'https://events.ayalamuseum.org/',
        kind: 'current-info',
        sourceIds: ['ayala-museum-booking-2026'],
      },
    ],
    tags: ['museum', 'history', 'art', 'culture', 'Ayala Center'],
  },
  {
    id: 'ayala-triangle-gardens',
    kind: 'canonical-destination',
    category: 'Green space',
    identityRef: { type: 'place', id: 'ayala-triangle-gardens' },
    summary:
      'A central Makati CBD green space for walking, pausing and orienting yourself in the business district.',
    sourceIds: ['ayala-triangle-gardens-2026'],
    contextRefs: [{ type: 'area', id: 'makati-cbd' }],
    links: [
      {
        label: 'Current gardens info',
        url: 'https://www.ayalatriangle.com/gardens',
        kind: 'current-info',
        sourceIds: ['ayala-triangle-gardens-2026'],
      },
    ],
    tags: ['park', 'walking', 'green space', 'Makati CBD'],
  },
  {
    id: 'salcedo-saturday-market',
    kind: 'recurring-experience',
    name: 'Salcedo Saturday Market',
    category: 'Market',
    summary:
      'A recurring community market experience in Salcedo Village, normally associated with Jaime C. Velasquez Park.',
    sourceIds: ['salcedo-market-facebook-2026', 'salcedo-market-current-2026'],
    anchorRefs: [
      { type: 'place', id: 'jaime-velasquez-park' },
      { type: 'area', id: 'salcedo-village' },
    ],
    mapsQuery: 'Salcedo Saturday Market Makati',
    links: [
      {
        label: 'Current market updates',
        url: 'https://www.facebook.com/SalcedoCommunityMarket/',
        kind: 'current-info',
        sourceIds: ['salcedo-market-facebook-2026'],
      },
    ],
    tags: ['market', 'weekend', 'Salcedo Village', 'food', 'community'],
  },
  {
    id: 'legazpi-sunday-market',
    kind: 'recurring-experience',
    name: 'Legazpi Sunday Market',
    category: 'Market',
    summary:
      'A recurring Sunday market experience in Legazpi Village; exact operating location and schedule remain live information.',
    sourceIds: [
      'legazpi-market-facebook-2026',
      'legazpi-market-current-2026',
      'legazpi-market-map-2026',
    ],
    anchorRefs: [{ type: 'area', id: 'legazpi-village' }],
    mapsQuery: 'Legazpi Sunday Market Makati',
    links: [
      {
        label: 'Current market updates',
        url: 'https://www.facebook.com/legazpisundaymarket/',
        kind: 'current-info',
        sourceIds: ['legazpi-market-facebook-2026'],
      },
      {
        label: 'Current map listing',
        url: 'https://www.waze.com/fil/live-map/directions/ph/ncr/makati-city/legazpi-sunday-market?to=place.ChIJ6bzx3g3JlzMRaYZRn-QVC2o',
        kind: 'live-discovery',
        sourceIds: ['legazpi-market-map-2026'],
      },
    ],
    tags: ['market', 'weekend', 'Legazpi Village', 'food', 'community'],
  },
  {
    id: 'poblacion',
    kind: 'canonical-destination',
    category: 'Historic district',
    identityRef: { type: 'barangay', id: 'poblacion' },
    summary:
      'Makati’s historic civic and cultural core, with heritage sites and contemporary commercial activity.',
    sourceIds: ['makati-poblacion-profile-2026'],
    links: [
      {
        label: 'Official barangay profile',
        url: 'https://www.makati.gov.ph/barangay/poblacion/34',
        kind: 'official-resource',
        sourceIds: ['makati-poblacion-profile-2026'],
      },
    ],
    tags: ['Poblacion', 'history', 'heritage', 'culture', 'district'],
  },
  {
    id: 'ayala-center',
    kind: 'canonical-destination',
    category: 'City district',
    identityRef: { type: 'area', id: 'ayala-center' },
    summary:
      'A useful orientation point for central Makati: museums, landscaped spaces, shopping and major transport connections.',
    sourceIds: ['ayala-malls-greenbelt-2026', 'ali-2025-integrated-report-visitor'],
    contextRefs: [
      { type: 'place', id: 'ayala-museum' },
      { type: 'place', id: 'greenbelt-park' },
    ],
    links: [
      {
        label: 'Explore Greenbelt',
        url: 'https://www.ayalamalls.com/main/malls/ayala-greenbelt/',
        kind: 'live-discovery',
        sourceIds: ['ayala-malls-greenbelt-2026'],
      },
    ],
    tags: ['Ayala Center', 'museum', 'park', 'shopping', 'transport'],
  },
];

export const visitorResources: VisitorResource[] = [
  {
    id: 'make-it-makati',
    name: 'Make It Makati',
    role: 'supplemental-guide',
    summary:
      'Ayala Land visitor guide for its Makati district and estate destinations.',
    url: 'https://makeitmakati.com/',
    sourceIds: ['make-it-makati-2026'],
    areaRefs: ['makati-cbd', 'ayala-center', 'circuit-makati'],
  },
  {
    id: 'makati-official-portal',
    name: 'Official Makati Web Portal',
    role: 'official-city',
    summary: 'Official city information, events and visitor resources.',
    url: 'https://www.makati.gov.ph/',
    sourceIds: ['makati-portal-2026'],
  },
];

const sourceById = new Map(
  visitorCurationSources.map(source => [source.id, source])
);

export const visitorCurationSourceById = sourceById;

const validateUrl = (value: string, owner: string) => {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error('Invalid visitor-curation URL for ' + owner + ': ' + value);
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Unsupported visitor-curation URL for ' + owner + ': ' + value);
  }
};

const assertCanonicalRef = (
  ref: VisitorCanonicalReference,
  owner: string
) => {
  if (ref.type === 'place' && !placeRegistryById.has(ref.id)) {
    throw new Error('Unknown visitor Place reference for ' + owner + ': ' + ref.id);
  }
  if (ref.type === 'area' && !civicAreaById.has(ref.id)) {
    throw new Error('Unknown visitor Area reference for ' + owner + ': ' + ref.id);
  }
  if (ref.type === 'barangay' && !findBarangay(ref.id)) {
    throw new Error(
      'Unknown visitor Barangay reference for ' + owner + ': ' + ref.id
    );
  }
};

export const validateVisitorCuration = () => {
  const sourceIds = new Set<string>();
  const experienceIds = new Set<string>();
  const resourceIds = new Set<string>();

  for (const source of visitorCurationSources) {
    if (sourceIds.has(source.id)) {
      throw new Error('Duplicate visitor-curation source ID: ' + source.id);
    }
    sourceIds.add(source.id);
    validateUrl(source.url, source.id);
    if (source.checkedOn !== visitorCurationReviewedOn) {
      throw new Error('Visitor source review date drift: ' + source.id);
    }
  }

  const validateSourceIds = (ids: readonly string[], owner: string) => {
    if (!ids.length) {
      throw new Error('Visitor-curation record must cite a source: ' + owner);
    }
    for (const sourceId of ids) {
      if (!sourceIds.has(sourceId)) {
        throw new Error(
          'Visitor-curation record cites missing source ' +
            sourceId +
            ': ' +
            owner
        );
      }
    }
  };

  for (const experience of visitorExperiences) {
    if (experienceIds.has(experience.id)) {
      throw new Error('Duplicate visitor experience ID: ' + experience.id);
    }
    experienceIds.add(experience.id);
    validateSourceIds(experience.sourceIds, experience.id);

    if (experience.kind === 'canonical-destination') {
      assertCanonicalRef(experience.identityRef, experience.id);
    } else {
      if (!experience.name.trim() || !experience.mapsQuery.trim()) {
        throw new Error(
          'Recurring visitor experience requires name and map query: ' +
            experience.id
        );
      }
      if (!experience.anchorRefs.length) {
        throw new Error(
          'Recurring visitor experience requires canonical anchors: ' +
            experience.id
        );
      }
      experience.anchorRefs.forEach(ref =>
        assertCanonicalRef(ref, experience.id)
      );
    }

    experience.contextRefs?.forEach(ref =>
      assertCanonicalRef(ref, experience.id)
    );

    for (const link of experience.links) {
      validateUrl(link.url, experience.id + ' link');
      validateSourceIds(link.sourceIds, experience.id + ' link');
    }
  }

  for (const resource of visitorResources) {
    if (resourceIds.has(resource.id)) {
      throw new Error('Duplicate visitor resource ID: ' + resource.id);
    }
    resourceIds.add(resource.id);
    validateUrl(resource.url, resource.id);
    validateSourceIds(resource.sourceIds, resource.id);
    for (const areaId of resource.areaRefs ?? []) {
      if (!civicAreaById.has(areaId)) {
        throw new Error(
          'Unknown visitor resource Area reference for ' +
            resource.id +
            ': ' +
            areaId
        );
      }
    }
  }

  if (visitorExperiences.length !== 6) {
    throw new Error('W5-6c expects exactly six curated orientation records.');
  }

  if (
    visitorExperiences.some(
      experience =>
        experience.id === 'greenbelt' ||
        experience.id.toLowerCase().includes('parking')
    )
  ) {
    throw new Error(
      'Visit curation must not restore standalone Greenbelt or Parking records.'
    );
  }

  return true;
};

validateVisitorCuration();
