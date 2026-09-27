export type CivicAreaKind =
  | 'business-district'
  | 'commercial-estate'
  | 'mixed-use-estate'
  | 'named-subdistrict'
  | 'residential-village'
  | 'other-managed-area';

export type CivicOrganizationKind =
  | 'estate-association'
  | 'homeowners-association'
  | 'developer'
  | 'property-manager'
  | 'government'
  | 'other';

export type CivicAreaSourceKind =
  | 'official-primary'
  | 'official-secondary'
  | 'reference-map'
  | 'secondary-reporting'
  | 'other';

export interface CivicAreaRegistrySource {
  id: string;
  label: string;
  url: string;
  publisher?: string;
  publishedOrPeriod?: string;
  checkedOn?: string;
  kind: CivicAreaSourceKind;
}

export interface CivicRegistryAlias {
  name: string;
  kind:
    | 'current-alternate'
    | 'former-name'
    | 'historical-name'
    | 'abbreviation'
    | 'local-name'
    | 'unclassified';
  note?: string;
}

export interface CivicAreaAssertion {
  fieldPaths: string[];
  sourceIds: string[];
  evidenceStrength: 'direct' | 'corroborated' | 'inferred';
  note?: string;
}

export interface CivicAreaGeometry {
  kind:
    | 'official-boundary'
    | 'source-defined-boundary'
    | 'approximate-boundary';
  geometryRef: string;
  sourceIds: string[];
  note?: string;
}

export interface CivicAreaAttribute {
  label: string;
  value: string;
  sourceIds: string[];
  note?: string;
}

export interface CivicAreaRecord {
  id: string;
  name: string;
  kind: CivicAreaKind;
  aliases?: CivicRegistryAlias[];
  summary?: string;

  /**
   * Government geographies the area overlaps or sits within.
   * More than one barangay is allowed. This is not an area polygon.
   */
  barangaySlugs: string[];

  /**
   * Optional sourced geometry. Area records do not require a point,
   * centroid or polygon in order to exist canonically.
   */
  geometry?: CivicAreaGeometry;

  attributes?: CivicAreaAttribute[];

  provenance: {
    assertions: CivicAreaAssertion[];
  };

  tags: string[];
}

export interface CivicOrganizationChannel {
  kind:
    | 'official-website'
    | 'advisories'
    | 'contact'
    | 'resident-portal'
    | 'developer-site'
    | 'other';
  label: string;
  url: string;
  sourceIds: string[];
  note?: string;
}

export interface CivicOrganizationRecord {
  id: string;
  name: string;
  kind: CivicOrganizationKind;
  abbreviations?: string[];
  aliases?: CivicRegistryAlias[];
  summary?: string;
  channels: CivicOrganizationChannel[];
  provenance: {
    assertions: CivicAreaAssertion[];
  };
  tags: string[];
}

export type CivicAreaRelationshipReference =
  | { type: 'area'; id: string }
  | { type: 'organization'; id: string }
  | { type: 'place'; id: string }
  | { type: 'barangay'; id: string };

export type CivicAreaRelationshipKind =
  | 'within-area'
  | 'within-barangay'
  | 'managed-by'
  | 'developed-by'
  | 'operated-by'
  | 'place-within-area';

export interface CivicAreaRelationshipEvidence {
  sourceIds: string[];
  evidenceStrength: 'direct' | 'corroborated' | 'inferred';
  statement?: string;
  checkedOn?: string;
  note?: string;
}

export interface CivicAreaRelationship {
  id: string;
  kind: CivicAreaRelationshipKind;
  from: CivicAreaRelationshipReference;
  to: CivicAreaRelationshipReference;
  evidence: CivicAreaRelationshipEvidence;
}

const nonEmpty = (value: string, field: string) => {
  if (!value.trim()) {
    throw new Error('Civic area registry ' + field + ' must not be empty.');
  }
};

const assertUniqueIds = (
  records: readonly { id: string }[],
  label: string
) => {
  const ids = new Set<string>();

  for (const record of records) {
    nonEmpty(record.id, label + ' id');
    if (ids.has(record.id)) {
      throw new Error('Duplicate ' + label + ' id: ' + record.id);
    }
    ids.add(record.id);
  }

  return ids;
};

const validateUrl = (url: string, field: string) => {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    throw new Error('Invalid Civic area registry ' + field + ': ' + url);
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error(
      'Unsupported Civic area registry URL protocol for ' + field + ': ' + url
    );
  }
};

const relationshipKey = (ref: CivicAreaRelationshipReference) =>
  ref.type + ':' + ref.id;

const expectedRelationshipEnds: Record<
  CivicAreaRelationshipKind,
  [CivicAreaRelationshipReference['type'], CivicAreaRelationshipReference['type']]
> = {
  'within-area': ['area', 'area'],
  'within-barangay': ['area', 'barangay'],
  'managed-by': ['area', 'organization'],
  'developed-by': ['area', 'organization'],
  'operated-by': ['area', 'organization'],
  'place-within-area': ['place', 'area'],
};

export const validateAreaOrganizationRegistry = ({
  sources,
  areas,
  organizations,
  relationships,
}: {
  sources: readonly CivicAreaRegistrySource[];
  areas: readonly CivicAreaRecord[];
  organizations: readonly CivicOrganizationRecord[];
  relationships: readonly CivicAreaRelationship[];
}) => {
  const sourceIds = assertUniqueIds(sources, 'source');
  const areaIds = assertUniqueIds(areas, 'area');
  const organizationIds = assertUniqueIds(organizations, 'organization');
  const relationshipIds = assertUniqueIds(relationships, 'relationship');

  void relationshipIds;

  const requireSources = (
    ids: readonly string[],
    owner: string
  ) => {
    if (!ids.length) {
      throw new Error(owner + ' must cite at least one source.');
    }

    for (const sourceId of ids) {
      if (!sourceIds.has(sourceId)) {
        throw new Error(
          owner + ' cites missing Civic area registry source: ' + sourceId
        );
      }
    }
  };

  for (const source of sources) {
    nonEmpty(source.label, 'source label');
    validateUrl(source.url, 'source URL');
  }

  for (const area of areas) {
    nonEmpty(area.name, 'area name');

    if (new Set(area.barangaySlugs).size !== area.barangaySlugs.length) {
      throw new Error('Duplicate barangay relationship on area: ' + area.id);
    }

    area.provenance.assertions.forEach((assertion, index) =>
      requireSources(
        assertion.sourceIds,
        'Area assertion ' + area.id + '[' + index + ']'
      )
    );

    area.attributes?.forEach((attribute, index) =>
      requireSources(
        attribute.sourceIds,
        'Area attribute ' + area.id + '[' + index + ']'
      )
    );

    if (area.geometry) {
      nonEmpty(area.geometry.geometryRef, 'area geometry reference');
      requireSources(area.geometry.sourceIds, 'Area geometry ' + area.id);
    }
  }

  for (const organization of organizations) {
    nonEmpty(organization.name, 'organization name');

    organization.provenance.assertions.forEach((assertion, index) =>
      requireSources(
        assertion.sourceIds,
        'Organization assertion ' + organization.id + '[' + index + ']'
      )
    );

    for (const channel of organization.channels) {
      nonEmpty(channel.label, 'organization channel label');
      validateUrl(channel.url, 'organization channel URL');
      requireSources(
        channel.sourceIds,
        'Organization channel ' + organization.id + ':' + channel.kind
      );
    }
  }

  for (const relationship of relationships) {
    const [expectedFrom, expectedTo] = expectedRelationshipEnds[
      relationship.kind
    ];

    if (
      relationship.from.type !== expectedFrom ||
      relationship.to.type !== expectedTo
    ) {
      throw new Error(
        'Invalid endpoints for ' +
          relationship.kind +
          ': ' +
          relationshipKey(relationship.from) +
          ' -> ' +
          relationshipKey(relationship.to)
      );
    }

    nonEmpty(relationship.from.id, 'relationship from id');
    nonEmpty(relationship.to.id, 'relationship to id');

    if (
      relationship.kind === 'within-area' &&
      relationship.from.id === relationship.to.id
    ) {
      throw new Error(
        'Area cannot be within itself: ' + relationship.from.id
      );
    }

    if (
      relationship.from.type === 'area' &&
      !areaIds.has(relationship.from.id)
    ) {
      throw new Error(
        'Relationship points from missing area: ' + relationship.from.id
      );
    }
    if (
      relationship.to.type === 'area' &&
      !areaIds.has(relationship.to.id)
    ) {
      throw new Error(
        'Relationship points to missing area: ' + relationship.to.id
      );
    }
    if (
      relationship.from.type === 'organization' &&
      !organizationIds.has(relationship.from.id)
    ) {
      throw new Error(
        'Relationship points from missing organization: ' +
          relationship.from.id
      );
    }
    if (
      relationship.to.type === 'organization' &&
      !organizationIds.has(relationship.to.id)
    ) {
      throw new Error(
        'Relationship points to missing organization: ' + relationship.to.id
      );
    }

    requireSources(
      relationship.evidence.sourceIds,
      'Relationship evidence ' + relationship.id
    );
  }

  return true;
};

const areaRegistryCheckedOn = '2026-09-27';

export const civicAreaRegistrySources: CivicAreaRegistrySource[] = [
  {
    id: 'ayala-land-estates-about',
    label: 'Ayala Land Estates · About Us',
    url: 'https://www.ayalalandestates.com.ph/about-us',
    publisher: 'Ayala Land Estates',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'apmc-makati-cbd-drill',
    label: 'APMC · MACEA, APMC and Barangays Collaborate in Successful Makati CBD Estate-Wide Drill',
    url: 'https://www.ayalaproperty.com.ph/news-and-updates/macea-apmc-and-barangays-collaborate-in-successful-makati-cbd-estatewide-drill',
    publisher: 'Ayala Property Management Corporation',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'macea-website',
    label: 'Makati Central Estate Association · official website',
    url: 'https://macea.com.ph/',
    publisher: 'Makati Central Estate Association, Inc.',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'macea-contact',
    label: 'Makati Central Estate Association · Contact Us',
    url: 'https://macea.com.ph/contact-us/',
    publisher: 'Makati Central Estate Association, Inc.',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'macea-circulars',
    label: 'Makati Central Estate Association · Memorandum Circulars',
    url: 'https://macea.com.ph/memorandum-circular/',
    publisher: 'Makati Central Estate Association, Inc.',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'macea-salcedo-legazpi-roadworks',
    label: 'MACEA · Asphalting works in Makati',
    url: 'https://macea.com.ph/2021/08/03/it-all-started-with-gravel-stones-asphalting-works-in-makati/',
    publisher: 'Makati Central Estate Association, Inc.',
    publishedOrPeriod: '2021',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'macea-mcbd-security',
    label: 'MACEA · Security measures and help desks in MCBD',
    url: 'https://macea.com.ph/2022/02/25/macea-adds-security-measures-help-desks-in-mcbd/',
    publisher: 'Makati Central Estate Association, Inc.',
    publishedOrPeriod: '2022',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'apmc-ayala-center-estate',
    label: 'APMC · Ayala Center Rolls Out the Future of Estate Security',
    url: 'https://www.ayalaproperty.com.ph/news-and-updates/ayala-center-makati-rolls-out-the-future-of-estate-security-with-its-first-byd-electric-security-patrol-car',
    publisher: 'Ayala Property Management Corporation',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'makati-ayala-fire-station',
    label: 'City Government of Makati · Fire stations directory',
    url: 'https://www.makati.gov.ph/content/makati-hotlines-firestations',
    publisher: 'City Government of Makati',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'ayala-land-estates-circuit',
    label: 'Ayala Land Estates · Circuit Makati',
    url: 'https://www.ayalalandestates.com.ph/estates/circuit-makati',
    publisher: 'Ayala Land Estates',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'ayala-land-estates-circuit-area',
    label: 'Ayala Land Estates · Property Showcase Presentation',
    url: 'https://admin.ayalalandestates.com.ph/wp-content/uploads/2025/05/VERMOSA-Property-Showcase-Presentation.pdf',
    publisher: 'Ayala Land Estates',
    publishedOrPeriod: '2025',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'makati-lccap-2019',
    label: 'City Government of Makati · Local Climate Change Action Plan 2019',
    url: 'https://www.makati.gov.ph/assets/uploads/downloads/2/841/842/pdf/Makati%20LCCAP%202019.pdf',
    publisher: 'City Government of Makati',
    publishedOrPeriod: '2019',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'ali-2022-definitive-information-statement',
    label: 'Ayala Land · 2022 Definitive Information Statement',
    url: 'https://ir.ayalaland.com.ph/wp-content/uploads/2022/04/ALI-SEC-Form-20-IS-2022-Definitive-2022-04-04.pdf',
    publisher: 'Ayala Land, Inc.',
    publishedOrPeriod: '2022',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'century-properties-corporate-profile',
    label: 'Century Properties · Corporate Profile',
    url: 'https://www.century-properties.com/corporate-profile/',
    publisher: 'Century Properties Group',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'century-properties-management',
    label: 'Century Properties · Century Properties Management, Inc.',
    url: 'https://www.century-properties.com/residences/century-properties-management-inc/',
    publisher: 'Century Properties Group',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'makati-poblacion-profile',
    label: 'City Government of Makati · Barangay Poblacion profile',
    url: 'https://www.makati.gov.ph/barangay/poblacion/34page?tab=1',
    publisher: 'City Government of Makati',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'century-2026-bond-prospectus',
    label: 'Century Properties · 2026 Bond Prospectus',
    url: 'https://www.century-properties.com/wp-content/uploads/2026/01/CPG-Bonds-Revised-Preliminary-Prospectus-as-of-14-January-2026_-January-21-2026.pdf',
    publisher: 'Century Properties Group',
    publishedOrPeriod: '2026',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'rockwell-center-makati',
    label: 'Rockwell Land · Rockwell Center Makati',
    url: 'https://e-rockwell.com/location/makati/',
    publisher: 'Rockwell Land Corporation',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'rockwell-contact',
    label: 'Rockwell Land · Contact Us',
    url: 'https://e-rockwell.com/contact-us/',
    publisher: 'Rockwell Land Corporation',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'pse-rockwell-land',
    label: 'PSE EDGE · Rockwell Land Corporation',
    url: 'https://edge.pse.com.ph/companyInformation/form.do?cmpy_id=635',
    publisher: 'Philippine Stock Exchange',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'bava-website',
    label: 'Bel-Air Village Association · official website',
    url: 'https://www.bava.ph/',
    publisher: 'Bel-Air Village Association',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'bava-about',
    label: 'Bel-Air Village Association · About Us',
    url: 'https://www.bava.ph/about-us',
    publisher: 'Bel-Air Village Association',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'dva-audited-financial-statements',
    label: 'Dasmariñas Village Association · Audited Financial Statements 2023 and 2022',
    url: 'https://dva.org.ph/wp-content/uploads/2025/06/DVA-AFS-2023-and-2022.pdf',
    publisher: 'Dasmariñas Village Association, Inc.',
    publishedOrPeriod: '2023 and 2022',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'dva-contact',
    label: 'Dasmariñas Village Association · Contact Us',
    url: 'https://dva.org.ph/contact-us/',
    publisher: 'Dasmariñas Village Association, Inc.',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'forbes-park-website',
    label: 'Forbes Park Association · official website',
    url: 'https://www.forbesparkassociation.com/',
    publisher: 'Forbes Park Association, Inc.',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'forbes-park-about',
    label: 'Forbes Park Association · About',
    url: 'https://www.forbesparkassociation.com/about',
    publisher: 'Forbes Park Association, Inc.',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'forbes-park-articles',
    label: 'Forbes Park Association · Articles of Incorporation',
    url: 'https://www.forbesparkassociation.com/copy-of-about-us',
    publisher: 'Forbes Park Association, Inc.',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'san-lorenzo-village-portal',
    label: 'San Lorenzo Village Association · MySLV',
    url: 'https://www.myslv.ph/',
    publisher: 'San Lorenzo Village Association',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'sc-urdaneta-village-association',
    label: 'Supreme Court E-Library · Urdaneta Village Association, Inc.',
    url: 'https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/1/65203',
    publisher: 'Supreme Court of the Philippines',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'makati-urdaneta-association-directory',
    label: 'City Government of Makati · Urdaneta Village Association directory listing',
    url: 'https://www.makati.gov.ph/assets/uploads/downloads/576/417/pdf/57607072015144517.pdf',
    publisher: 'City Government of Makati',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
  {
    id: 'sc-magallanes-village-association',
    label: 'Supreme Court E-Library · Metro Properties v. Magallanes Village Association',
    url: 'https://elibrary.judiciary.gov.ph/assets/pdf/philrep_ebooks/Volume_510.pdf',
    publisher: 'Supreme Court of the Philippines',
    checkedOn: areaRegistryCheckedOn,
    kind: 'official-primary',
  },
];

export const civicAreas: CivicAreaRecord[] = [
  {
    id: 'makati-cbd',
    name: 'Makati Central Business District',
    kind: 'business-district',
    aliases: [
      { name: 'Makati CBD', kind: 'abbreviation' },
    ],
    summary:
      'The broader central business district planned and developed around the Ayala commercial core.',
    barangaySlugs: [],
    provenance: {
      assertions: [
        {
          fieldPaths: ['name', 'kind'],
          sourceIds: ['ayala-land-estates-about'],
          evidenceStrength: 'direct',
        },
        {
          fieldPaths: ['aliases'],
          sourceIds: ['apmc-makati-cbd-drill'],
          evidenceStrength: 'direct',
        },
      ],
    },
    tags: ['business district', 'CBD', 'Ayala'],
  },
  {
    id: 'ayala-center',
    name: 'Ayala Center',
    kind: 'commercial-estate',
    summary:
      'A commercial and mixed-use estate in Barangay San Lorenzo within the broader Makati CBD.',
    barangaySlugs: ['san-lorenzo'],
    provenance: {
      assertions: [
        {
          fieldPaths: ['name', 'kind'],
          sourceIds: ['apmc-ayala-center-estate'],
          evidenceStrength: 'direct',
        },
        {
          fieldPaths: ['barangaySlugs'],
          sourceIds: ['makati-ayala-fire-station'],
          evidenceStrength: 'direct',
        },
      ],
    },
    tags: ['commercial estate', 'retail', 'Makati CBD', 'San Lorenzo'],
  },
  {
    id: 'salcedo-village',
    name: 'Salcedo Village',
    kind: 'named-subdistrict',
    summary:
      'A named Makati CBD subdistrict in Barangay Bel-Air with MACEA-documented estate operations.',
    barangaySlugs: ['bel-air'],
    provenance: {
      assertions: [
        {
          fieldPaths: ['name', 'kind', 'barangaySlugs'],
          sourceIds: ['macea-salcedo-legazpi-roadworks'],
          evidenceStrength: 'corroborated',
          note:
            'MACEA identifies Salcedo Village and ties the road works to Barangay Bel-Air; the subdistrict classification is BetterMakati normalization.',
        },
      ],
    },
    tags: ['Makati CBD', 'Salcedo Village', 'Bel-Air'],
  },
  {
    id: 'legazpi-village',
    name: 'Legazpi Village',
    kind: 'named-subdistrict',
    summary:
      'A named Makati CBD subdistrict in Barangay San Lorenzo with MACEA-documented estate operations.',
    barangaySlugs: ['san-lorenzo'],
    provenance: {
      assertions: [
        {
          fieldPaths: ['name', 'kind', 'barangaySlugs'],
          sourceIds: ['macea-salcedo-legazpi-roadworks', 'macea-contact'],
          evidenceStrength: 'corroborated',
          note:
            'MACEA identifies Legazpi Village and ties the road works to Barangay San Lorenzo; the subdistrict classification is BetterMakati normalization.',
        },
      ],
    },
    tags: ['Makati CBD', 'Legazpi Village', 'San Lorenzo'],
  },
  {
    id: 'circuit-makati',
    name: 'Circuit Makati',
    kind: 'mixed-use-estate',
    summary:
      'A mixed-use Ayala Land estate on the former Sta. Ana Race Track site in Barangay Carmona.',
    barangaySlugs: ['carmona'],
    attributes: [
      {
        label: 'Documented land area',
        value: '25.4 hectares',
        sourceIds: ['ayala-land-estates-circuit-area'],
      },
    ],
    provenance: {
      assertions: [
        {
          fieldPaths: ['name', 'kind'],
          sourceIds: ['ayala-land-estates-circuit'],
          evidenceStrength: 'direct',
        },
        {
          fieldPaths: ['barangaySlugs'],
          sourceIds: ['makati-lccap-2019'],
          evidenceStrength: 'direct',
        },
      ],
    },
    tags: ['mixed-use estate', 'Carmona', 'Ayala Land'],
  },
  {
    id: 'century-city',
    name: 'Century City',
    kind: 'mixed-use-estate',
    summary:
      'A mixed-use community along Kalayaan Avenue in Barangay Poblacion.',
    barangaySlugs: ['poblacion'],
    attributes: [
      {
        label: 'Documented land area',
        value: '3.4 hectares',
        sourceIds: ['century-properties-corporate-profile'],
      },
    ],
    provenance: {
      assertions: [
        {
          fieldPaths: ['name', 'kind'],
          sourceIds: ['century-properties-corporate-profile'],
          evidenceStrength: 'direct',
        },
        {
          fieldPaths: ['barangaySlugs'],
          sourceIds: [
            'century-properties-management',
            'makati-poblacion-profile',
          ],
          evidenceStrength: 'corroborated',
        },
      ],
    },
    tags: ['mixed-use estate', 'Poblacion', 'Kalayaan Avenue'],
  },
  {
    id: 'rockwell-center',
    name: 'Rockwell Center',
    kind: 'mixed-use-estate',
    summary:
      'Rockwell Land’s flagship masterplanned mixed-use district in Barangay Poblacion.',
    barangaySlugs: ['poblacion'],
    provenance: {
      assertions: [
        {
          fieldPaths: ['name', 'kind'],
          sourceIds: ['rockwell-center-makati'],
          evidenceStrength: 'direct',
        },
        {
          fieldPaths: ['barangaySlugs'],
          sourceIds: ['makati-poblacion-profile'],
          evidenceStrength: 'direct',
        },
      ],
    },
    tags: ['mixed-use district', 'Poblacion', 'Rockwell Land'],
  },
  {
    id: 'bel-air-village',
    name: 'Bel-Air Village',
    kind: 'residential-village',
    summary:
      'A private residential subdivision represented by the Bel-Air Village Association.',
    barangaySlugs: [],
    attributes: [
      {
        label: 'Documented land area',
        value: '787,234 square meters',
        sourceIds: ['bava-about'],
      },
    ],
    provenance: {
      assertions: [
        {
          fieldPaths: ['name', 'kind'],
          sourceIds: ['bava-about'],
          evidenceStrength: 'direct',
        },
      ],
    },
    tags: ['residential village', 'private subdivision'],
  },
  {
    id: 'dasmarinas-village',
    name: 'Dasmariñas Village',
    kind: 'residential-village',
    summary:
      'A private residential subdivision served by Dasmariñas Village Association, Inc.',
    barangaySlugs: [],
    provenance: {
      assertions: [
        {
          fieldPaths: ['name', 'kind'],
          sourceIds: ['dva-audited-financial-statements'],
          evidenceStrength: 'direct',
        },
      ],
    },
    tags: ['residential village', 'private subdivision'],
  },
  {
    id: 'forbes-park-village',
    name: 'Forbes Park',
    kind: 'residential-village',
    aliases: [
      { name: 'Forbes Park Subdivision', kind: 'current-alternate' },
    ],
    summary:
      'A private residential community represented by Forbes Park Association, Inc.',
    barangaySlugs: [],
    provenance: {
      assertions: [
        {
          fieldPaths: ['name', 'kind', 'aliases'],
          sourceIds: ['forbes-park-about', 'forbes-park-articles'],
          evidenceStrength: 'direct',
        },
      ],
    },
    tags: ['residential village', 'private subdivision'],
  },
  {
    id: 'san-lorenzo-village',
    name: 'San Lorenzo Village',
    kind: 'residential-village',
    summary:
      'A residential community represented by the San Lorenzo Village Association.',
    barangaySlugs: [],
    attributes: [
      {
        label: 'Established',
        value: 'June 1954',
        sourceIds: ['san-lorenzo-village-portal'],
      },
    ],
    provenance: {
      assertions: [
        {
          fieldPaths: ['name', 'kind'],
          sourceIds: ['san-lorenzo-village-portal'],
          evidenceStrength: 'direct',
        },
      ],
    },
    tags: ['residential village'],
  },
  {
    id: 'urdaneta-village',
    name: 'Urdaneta Village',
    kind: 'residential-village',
    summary:
      'A Makati residential village represented by Urdaneta Village Association, Inc.',
    barangaySlugs: [],
    provenance: {
      assertions: [
        {
          fieldPaths: ['name', 'kind'],
          sourceIds: [
            'sc-urdaneta-village-association',
            'makati-urdaneta-association-directory',
          ],
          evidenceStrength: 'corroborated',
        },
      ],
    },
    tags: ['residential village'],
  },
  {
    id: 'magallanes-village',
    name: 'Magallanes Village',
    kind: 'residential-village',
    summary:
      'A Makati residential village represented by Magallanes Village Association, Inc.',
    barangaySlugs: [],
    provenance: {
      assertions: [
        {
          fieldPaths: ['name', 'kind'],
          sourceIds: ['sc-magallanes-village-association'],
          evidenceStrength: 'direct',
        },
      ],
    },
    tags: ['residential village'],
  },
];

export const civicOrganizations: CivicOrganizationRecord[] = [
  {
    id: 'makati-central-estate-association',
    name: 'Makati Central Estate Association, Inc.',
    kind: 'estate-association',
    abbreviations: ['MACEA'],
    aliases: [
      {
        name: 'Makati Commercial Estate Association',
        kind: 'historical-name',
      },
    ],
    summary:
      'Estate association with documented operations in the Makati CBD, including Salcedo Village and Legazpi Village.',
    channels: [
      {
        kind: 'official-website',
        label: 'MACEA website',
        url: 'https://macea.com.ph/',
        sourceIds: ['macea-website'],
      },
      {
        kind: 'advisories',
        label: 'MACEA memorandum circulars',
        url: 'https://macea.com.ph/memorandum-circular/',
        sourceIds: ['macea-circulars'],
      },
      {
        kind: 'contact',
        label: 'MACEA contact page',
        url: 'https://macea.com.ph/contact-us/',
        sourceIds: ['macea-contact'],
      },
    ],
    provenance: {
      assertions: [
        {
          fieldPaths: ['name', 'abbreviations'],
          sourceIds: ['macea-website'],
          evidenceStrength: 'direct',
        },
        {
          fieldPaths: ['aliases'],
          sourceIds: ['macea-website'],
          evidenceStrength: 'direct',
          note:
            'The official site uses the earlier Makati Commercial Estate Association wording in its historical narrative.',
        },
      ],
    },
    tags: ['estate association', 'Makati CBD'],
  },
  {
    id: 'ayala-center-estate-association',
    name: 'Ayala Center Estate Association, Inc.',
    kind: 'estate-association',
    abbreviations: ['ACEA'],
    summary: 'Estate association for Ayala Center.',
    channels: [
      {
        kind: 'other',
        label: 'Ayala Center estate information via APMC',
        url: 'https://www.ayalaproperty.com.ph/news-and-updates/ayala-center-makati-rolls-out-the-future-of-estate-security-with-its-first-byd-electric-security-patrol-car',
        sourceIds: ['apmc-ayala-center-estate'],
      },
    ],
    provenance: {
      assertions: [
        {
          fieldPaths: ['name', 'abbreviations', 'kind'],
          sourceIds: ['apmc-ayala-center-estate'],
          evidenceStrength: 'direct',
        },
      ],
    },
    tags: ['estate association', 'Ayala Center'],
  },
  {
    id: 'circuit-makati-estate-association',
    name: 'Circuit Makati Estate Association, Inc.',
    kind: 'estate-association',
    abbreviations: ['CMEA'],
    summary: 'Estate association for Circuit Makati.',
    channels: [
      {
        kind: 'developer-site',
        label: 'Circuit Makati estate page',
        url: 'https://www.ayalalandestates.com.ph/estates/circuit-makati',
        sourceIds: ['ayala-land-estates-circuit'],
        note:
          'Public estate information via Ayala Land Estates; no dedicated CMEA portal was verified in W5-3a2.',
      },
    ],
    provenance: {
      assertions: [
        {
          fieldPaths: ['name', 'kind'],
          sourceIds: ['ali-2022-definitive-information-statement'],
          evidenceStrength: 'direct',
        },
      ],
    },
    tags: ['estate association', 'Circuit Makati'],
  },
  {
    id: 'century-city-estate-association',
    name: 'Century City Estate Association',
    kind: 'estate-association',
    summary:
      'Century City estate-management organization identified in Century Properties disclosures.',
    channels: [],
    provenance: {
      assertions: [
        {
          fieldPaths: ['name', 'kind'],
          sourceIds: ['century-2026-bond-prospectus'],
          evidenceStrength: 'direct',
        },
      ],
    },
    tags: ['estate association', 'Century City'],
  },
  {
    id: 'rockwell-land-corporation',
    name: 'Rockwell Land Corporation',
    kind: 'developer',
    summary:
      'Developer and principal official public-facing organization for Rockwell Center.',
    channels: [
      {
        kind: 'official-website',
        label: 'Rockwell website',
        url: 'https://e-rockwell.com/',
        sourceIds: ['rockwell-center-makati'],
      },
      {
        kind: 'contact',
        label: 'Rockwell Land contact page',
        url: 'https://e-rockwell.com/contact-us/',
        sourceIds: ['rockwell-contact'],
      },
    ],
    provenance: {
      assertions: [
        {
          fieldPaths: ['name', 'kind'],
          sourceIds: ['rockwell-contact', 'pse-rockwell-land'],
          evidenceStrength: 'corroborated',
        },
      ],
    },
    tags: ['developer', 'Rockwell Center'],
  },
  {
    id: 'bel-air-village-association',
    name: 'Bel-Air Village Association',
    kind: 'homeowners-association',
    abbreviations: ['BAVA'],
    channels: [
      {
        kind: 'official-website',
        label: 'BAVA website',
        url: 'https://www.bava.ph/',
        sourceIds: ['bava-website'],
      },
    ],
    provenance: {
      assertions: [
        {
          fieldPaths: ['name', 'kind', 'abbreviations'],
          sourceIds: ['bava-website', 'bava-about'],
          evidenceStrength: 'corroborated',
        },
      ],
    },
    tags: ['homeowners association', 'Bel-Air Village'],
  },
  {
    id: 'dasmarinas-village-association',
    name: 'Dasmariñas Village Association, Inc.',
    kind: 'homeowners-association',
    abbreviations: ['DVA'],
    channels: [
      {
        kind: 'official-website',
        label: 'DVA website',
        url: 'https://dva.org.ph/',
        sourceIds: ['dva-contact'],
      },
      {
        kind: 'contact',
        label: 'DVA contact page',
        url: 'https://dva.org.ph/contact-us/',
        sourceIds: ['dva-contact'],
      },
    ],
    provenance: {
      assertions: [
        {
          fieldPaths: ['name', 'kind'],
          sourceIds: ['dva-audited-financial-statements'],
          evidenceStrength: 'direct',
        },
      ],
    },
    tags: ['homeowners association', 'Dasmariñas Village'],
  },
  {
    id: 'forbes-park-association',
    name: 'Forbes Park Association, Inc.',
    kind: 'homeowners-association',
    abbreviations: ['FPA'],
    channels: [
      {
        kind: 'official-website',
        label: 'Forbes Park Association website',
        url: 'https://www.forbesparkassociation.com/',
        sourceIds: ['forbes-park-website'],
      },
    ],
    provenance: {
      assertions: [
        {
          fieldPaths: ['name', 'kind'],
          sourceIds: ['forbes-park-articles'],
          evidenceStrength: 'direct',
        },
        {
          fieldPaths: ['abbreviations'],
          sourceIds: ['forbes-park-website'],
          evidenceStrength: 'direct',
        },
      ],
    },
    tags: ['homeowners association', 'Forbes Park'],
  },
  {
    id: 'san-lorenzo-village-association',
    name: 'San Lorenzo Village Association',
    kind: 'homeowners-association',
    abbreviations: ['SLVA'],
    channels: [
      {
        kind: 'resident-portal',
        label: 'MySLV',
        url: 'https://www.myslv.ph/',
        sourceIds: ['san-lorenzo-village-portal'],
      },
    ],
    provenance: {
      assertions: [
        {
          fieldPaths: ['name', 'kind', 'abbreviations'],
          sourceIds: ['san-lorenzo-village-portal'],
          evidenceStrength: 'direct',
        },
      ],
    },
    tags: ['homeowners association', 'San Lorenzo Village'],
  },
  {
    id: 'urdaneta-village-association',
    name: 'Urdaneta Village Association, Inc.',
    kind: 'homeowners-association',
    abbreviations: ['UVA'],
    channels: [],
    provenance: {
      assertions: [
        {
          fieldPaths: ['name', 'kind'],
          sourceIds: [
            'sc-urdaneta-village-association',
            'makati-urdaneta-association-directory',
          ],
          evidenceStrength: 'corroborated',
        },
      ],
    },
    tags: ['homeowners association', 'Urdaneta Village'],
  },
  {
    id: 'magallanes-village-association',
    name: 'Magallanes Village Association, Inc.',
    kind: 'homeowners-association',
    abbreviations: ['MVA'],
    channels: [],
    provenance: {
      assertions: [
        {
          fieldPaths: ['name', 'kind'],
          sourceIds: ['sc-magallanes-village-association'],
          evidenceStrength: 'direct',
        },
      ],
    },
    tags: ['homeowners association', 'Magallanes Village'],
  },
];

export const civicAreaRelationships: CivicAreaRelationship[] = [
  {
    id: 'ayala-center-within-makati-cbd',
    kind: 'within-area',
    from: { type: 'area', id: 'ayala-center' },
    to: { type: 'area', id: 'makati-cbd' },
    evidence: {
      sourceIds: ['apmc-makati-cbd-drill', 'apmc-ayala-center-estate'],
      evidenceStrength: 'corroborated',
      statement:
        'APMC treats Ayala Center as an estate within the broader Makati CBD context while distinguishing ACEA from MACEA.',
      checkedOn: areaRegistryCheckedOn,
    },
  },
  {
    id: 'ayala-center-within-san-lorenzo',
    kind: 'within-barangay',
    from: { type: 'area', id: 'ayala-center' },
    to: { type: 'barangay', id: 'san-lorenzo' },
    evidence: {
      sourceIds: ['makati-ayala-fire-station'],
      evidenceStrength: 'direct',
      statement:
        'The City of Makati lists Park Square in Ayala Center as Barangay San Lorenzo.',
      checkedOn: areaRegistryCheckedOn,
    },
  },
  {
    id: 'ayala-center-managed-by-acea',
    kind: 'managed-by',
    from: { type: 'area', id: 'ayala-center' },
    to: { type: 'organization', id: 'ayala-center-estate-association' },
    evidence: {
      sourceIds: ['apmc-ayala-center-estate'],
      evidenceStrength: 'direct',
      statement:
        'APMC states that Ayala Center is the first estate under Ayala Center Estate Association, Inc.',
      checkedOn: areaRegistryCheckedOn,
    },
  },
  {
    id: 'salcedo-village-within-makati-cbd',
    kind: 'within-area',
    from: { type: 'area', id: 'salcedo-village' },
    to: { type: 'area', id: 'makati-cbd' },
    evidence: {
      sourceIds: ['macea-mcbd-security'],
      evidenceStrength: 'direct',
      statement:
        'MACEA describes Salcedo Village security operations within its MCBD program.',
      checkedOn: areaRegistryCheckedOn,
    },
  },
  {
    id: 'salcedo-village-within-bel-air',
    kind: 'within-barangay',
    from: { type: 'area', id: 'salcedo-village' },
    to: { type: 'barangay', id: 'bel-air' },
    evidence: {
      sourceIds: ['macea-salcedo-legazpi-roadworks'],
      evidenceStrength: 'direct',
      statement:
        'MACEA identifies the Salcedo Village work area with Barangay Bel-Air.',
      checkedOn: areaRegistryCheckedOn,
    },
  },
  {
    id: 'salcedo-village-operated-by-macea',
    kind: 'operated-by',
    from: { type: 'area', id: 'salcedo-village' },
    to: { type: 'organization', id: 'makati-central-estate-association' },
    evidence: {
      sourceIds: [
        'macea-salcedo-legazpi-roadworks',
        'macea-mcbd-security',
      ],
      evidenceStrength: 'corroborated',
      statement:
        'MACEA documents road, security and help-desk operations in Salcedo Village.',
      checkedOn: areaRegistryCheckedOn,
      note:
        'This records documented estate operations and does not assert exclusive jurisdiction over every parcel.',
    },
  },
  {
    id: 'legazpi-village-within-makati-cbd',
    kind: 'within-area',
    from: { type: 'area', id: 'legazpi-village' },
    to: { type: 'area', id: 'makati-cbd' },
    evidence: {
      sourceIds: ['macea-salcedo-legazpi-roadworks'],
      evidenceStrength: 'direct',
      statement:
        'MACEA documents Legazpi Village works as part of its Makati estate operations.',
      checkedOn: areaRegistryCheckedOn,
    },
  },
  {
    id: 'legazpi-village-within-san-lorenzo',
    kind: 'within-barangay',
    from: { type: 'area', id: 'legazpi-village' },
    to: { type: 'barangay', id: 'san-lorenzo' },
    evidence: {
      sourceIds: ['macea-salcedo-legazpi-roadworks'],
      evidenceStrength: 'direct',
      statement:
        'MACEA identifies the Legazpi Village work area with Barangay San Lorenzo.',
      checkedOn: areaRegistryCheckedOn,
    },
  },
  {
    id: 'legazpi-village-operated-by-macea',
    kind: 'operated-by',
    from: { type: 'area', id: 'legazpi-village' },
    to: { type: 'organization', id: 'makati-central-estate-association' },
    evidence: {
      sourceIds: ['macea-salcedo-legazpi-roadworks', 'macea-contact'],
      evidenceStrength: 'corroborated',
      statement:
        'MACEA documents estate road works in Legazpi Village and maintains its office in the area.',
      checkedOn: areaRegistryCheckedOn,
      note:
        'This records documented estate operations and does not assert exclusive jurisdiction over every parcel.',
    },
  },
  {
    id: 'circuit-makati-within-carmona',
    kind: 'within-barangay',
    from: { type: 'area', id: 'circuit-makati' },
    to: { type: 'barangay', id: 'carmona' },
    evidence: {
      sourceIds: ['makati-lccap-2019'],
      evidenceStrength: 'direct',
      statement:
        'The City of Makati identifies Circuit Makati, formerly the Sta. Ana Race Track, in Carmona.',
      checkedOn: areaRegistryCheckedOn,
    },
  },
  {
    id: 'circuit-makati-managed-by-cmea',
    kind: 'managed-by',
    from: { type: 'area', id: 'circuit-makati' },
    to: { type: 'organization', id: 'circuit-makati-estate-association' },
    evidence: {
      sourceIds: ['ali-2022-definitive-information-statement'],
      evidenceStrength: 'direct',
      statement:
        'Ayala Land filings identify Circuit Makati Estate Association, Inc. as the estate association for the Circuit Makati development.',
      checkedOn: areaRegistryCheckedOn,
    },
  },
  {
    id: 'century-city-within-poblacion',
    kind: 'within-barangay',
    from: { type: 'area', id: 'century-city' },
    to: { type: 'barangay', id: 'poblacion' },
    evidence: {
      sourceIds: ['century-properties-management', 'makati-poblacion-profile'],
      evidenceStrength: 'corroborated',
      statement:
        'Century Properties and the City Government of Makati identify Century City with Poblacion, Makati.',
      checkedOn: areaRegistryCheckedOn,
    },
  },
  {
    id: 'century-city-managed-by-estate-association',
    kind: 'managed-by',
    from: { type: 'area', id: 'century-city' },
    to: { type: 'organization', id: 'century-city-estate-association' },
    evidence: {
      sourceIds: ['century-2026-bond-prospectus'],
      evidenceStrength: 'direct',
      statement:
        'Century Properties disclosures identify Century City Estate Association as a Century City management entity.',
      checkedOn: areaRegistryCheckedOn,
    },
  },
  {
    id: 'rockwell-center-within-poblacion',
    kind: 'within-barangay',
    from: { type: 'area', id: 'rockwell-center' },
    to: { type: 'barangay', id: 'poblacion' },
    evidence: {
      sourceIds: ['makati-poblacion-profile'],
      evidenceStrength: 'direct',
      statement:
        'The City Government of Makati identifies Rockwell Center as part of Barangay Poblacion.',
      checkedOn: areaRegistryCheckedOn,
    },
  },
  {
    id: 'rockwell-center-developed-by-rockwell-land',
    kind: 'developed-by',
    from: { type: 'area', id: 'rockwell-center' },
    to: { type: 'organization', id: 'rockwell-land-corporation' },
    evidence: {
      sourceIds: ['rockwell-center-makati', 'pse-rockwell-land'],
      evidenceStrength: 'corroborated',
      statement:
        'Rockwell Land presents Rockwell Center Makati as its flagship masterplanned development and PSE records identify Rockwell Land Corporation.',
      checkedOn: areaRegistryCheckedOn,
    },
  },
  {
    id: 'bel-air-village-managed-by-bava',
    kind: 'managed-by',
    from: { type: 'area', id: 'bel-air-village' },
    to: { type: 'organization', id: 'bel-air-village-association' },
    evidence: {
      sourceIds: ['bava-website', 'bava-about'],
      evidenceStrength: 'corroborated',
      statement:
        'BAVA identifies itself as the association serving Bel-Air Village.',
      checkedOn: areaRegistryCheckedOn,
    },
  },
  {
    id: 'dasmarinas-village-managed-by-dva',
    kind: 'managed-by',
    from: { type: 'area', id: 'dasmarinas-village' },
    to: { type: 'organization', id: 'dasmarinas-village-association' },
    evidence: {
      sourceIds: ['dva-audited-financial-statements'],
      evidenceStrength: 'direct',
      statement:
        'DVA financial statements identify the association as serving owners, lessees and occupants of properties in Dasmariñas Village.',
      checkedOn: areaRegistryCheckedOn,
    },
  },
  {
    id: 'forbes-park-managed-by-fpa',
    kind: 'managed-by',
    from: { type: 'area', id: 'forbes-park-village' },
    to: { type: 'organization', id: 'forbes-park-association' },
    evidence: {
      sourceIds: ['forbes-park-website', 'forbes-park-articles'],
      evidenceStrength: 'corroborated',
      statement:
        'Forbes Park Association identifies Forbes Park as the private residential community it manages.',
      checkedOn: areaRegistryCheckedOn,
    },
  },
  {
    id: 'san-lorenzo-village-managed-by-slva',
    kind: 'managed-by',
    from: { type: 'area', id: 'san-lorenzo-village' },
    to: { type: 'organization', id: 'san-lorenzo-village-association' },
    evidence: {
      sourceIds: ['san-lorenzo-village-portal'],
      evidenceStrength: 'direct',
      statement:
        'The MySLV portal identifies San Lorenzo Village Association with the San Lorenzo Village residential community.',
      checkedOn: areaRegistryCheckedOn,
    },
  },
  {
    id: 'urdaneta-village-managed-by-uva',
    kind: 'managed-by',
    from: { type: 'area', id: 'urdaneta-village' },
    to: { type: 'organization', id: 'urdaneta-village-association' },
    evidence: {
      sourceIds: [
        'sc-urdaneta-village-association',
        'makati-urdaneta-association-directory',
      ],
      evidenceStrength: 'corroborated',
      statement:
        'Supreme Court and city records identify Urdaneta Village Association, Inc. as the homeowners association for Urdaneta Village.',
      checkedOn: areaRegistryCheckedOn,
    },
  },
  {
    id: 'magallanes-village-managed-by-mva',
    kind: 'managed-by',
    from: { type: 'area', id: 'magallanes-village' },
    to: { type: 'organization', id: 'magallanes-village-association' },
    evidence: {
      sourceIds: ['sc-magallanes-village-association'],
      evidenceStrength: 'direct',
      statement:
        'Supreme Court jurisprudence identifies Magallanes Village Association, Inc. and association membership tied to covered Magallanes Village lots.',
      checkedOn: areaRegistryCheckedOn,
    },
  },
];

validateAreaOrganizationRegistry({
  sources: civicAreaRegistrySources,
  areas: civicAreas,
  organizations: civicOrganizations,
  relationships: civicAreaRelationships,
});

export const civicAreaById = new Map(
  civicAreas.map(area => [area.id, area])
);

export const civicOrganizationById = new Map(
  civicOrganizations.map(organization => [organization.id, organization])
);

export const civicAreaRelationshipsFor = (
  ref: CivicAreaRelationshipReference
) =>
  civicAreaRelationships.filter(
    relationship =>
      relationshipKey(relationship.from) === relationshipKey(ref) ||
      relationshipKey(relationship.to) === relationshipKey(ref)
  );
