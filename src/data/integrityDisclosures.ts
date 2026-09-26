import { integrityProcurementEntities } from './integrityData';
import type {
  IntegrityDisclosureRecord,
  IntegritySource,
} from './integrityTypes';

export const integrityDisclosureReviewed = '26 September 2026';

export const integrityDisclosureSources: IntegritySource[] = [
  {
    id: 'gppb-ra12009-irr-2025',
    label: 'Implementing Rules and Regulations of Republic Act No. 12009',
    url: 'https://www.gppb.gov.ph/wp-content/uploads/2025/02/Implementing-Rules-and-Regulations-of-RA-12009.pdf',
    publisher: 'Government Procurement Policy Board',
    publishedOrPeriod: 'Effective 25 February 2025',
    sourceClass: 'national-government',
    retrievedOn: integrityDisclosureReviewed,
  },
  {
    id: 'gppb-resolution-11-2025',
    label: 'GPPB Resolution No. 11-2025',
    url: 'https://www.gppb.gov.ph/wp-content/uploads/2026/02/GPPB_Resolution_No._11-2025_30012026.gppb_.pdf',
    publisher: 'Government Procurement Policy Board',
    publishedOrPeriod: '6 October 2025',
    sourceClass: 'national-government',
    retrievedOn: integrityDisclosureReviewed,
  },
  {
    id: 'psdbm-bo-registry-2026',
    label: 'PS-DBM update on PhilGEPS Beneficial Ownership Registry',
    url: 'https://www.ps-philgeps.gov.ph/home/index.php/about-ps/news/8452-ps-dbm-dbm-unodc-strengthen-transparency-accountability-in-gov-t-procurement-under-ngpa',
    publisher: 'Procurement Service - Department of Budget and Management',
    publishedOrPeriod: '17 April 2026',
    sourceClass: 'national-government',
    retrievedOn: integrityDisclosureReviewed,
  },
  {
    id: 'sec-harbor-2026',
    label: 'SEC HARBOR beneficial-ownership filing system',
    url: 'https://harbor.sec.gov.ph/',
    publisher: 'Securities and Exchange Commission',
    publishedOrPeriod: '2026',
    sourceClass: 'public-registry',
    retrievedOn: integrityDisclosureReviewed,
  },
  {
    id: 'makati-q3-2017-bid-results',
    label: 'Makati City Projects Bidded Out - 3rd Quarter 2017',
    url: 'https://www.makati.gov.ph/assets/uploads/staticmenu/files/3rd_quarter_bid_result.pdf',
    publisher: 'City Government of Makati',
    publishedOrPeriod: '2017 Q3',
    sourceClass: 'city-government',
    retrievedOn: integrityDisclosureReviewed,
  },
];

const registryFrameworkSourceIds = [
  'gppb-ra12009-irr-2025',
  'gppb-resolution-11-2025',
  'psdbm-bo-registry-2026',
  'sec-harbor-2026',
];

const relationshipFrameworkSourceIds = ['gppb-ra12009-irr-2025'];

const entityResearchRecords: IntegrityDisclosureRecord[] =
  integrityProcurementEntities.flatMap(
    (entity): IntegrityDisclosureRecord[] => [
    {
      id: 'bo-research-' + entity.id,
      kind: 'beneficial-ownership',
      subjectEntityId: entity.id,
      assessment: {
        status: 'unavailable',
        checkedOn: integrityDisclosureReviewed,
        sourceIds: registryFrameworkSourceIds,
        note:
          'PS-DBM states that a public PhilGEPS beneficial-ownership registry is operating and progressively expanding. Targeted authoritative-domain searches on 26 September 2026 did not surface a retrievable entity-specific beneficial-ownership record for this normalized Makati supplier. This is a retrieval status only and is not evidence of non-filing, concealment or absence of beneficial owners.',
      },
    },
    {
      id: 'conflict-research-' + entity.id,
      kind: 'conflict-of-interest',
      subjectEntityId: entity.id,
      assessment: {
        status: 'unavailable',
        checkedOn: integrityDisclosureReviewed,
        sourceIds: relationshipFrameworkSourceIds,
        note:
          'Targeted searches of authoritative Makati, PhilGEPS and GPPB public surfaces did not surface a source-backed conflict-of-interest determination or disclosure tied to this normalized supplier. No inference is made from the absence of a retrievable record.',
      },
    },
    {
      id: 'recusal-research-' + entity.id,
      kind: 'recusal',
      subjectEntityId: entity.id,
      assessment: {
        status: 'unavailable',
        checkedOn: integrityDisclosureReviewed,
        sourceIds: relationshipFrameworkSourceIds,
        note:
          'Targeted searches of authoritative Makati, PhilGEPS and GPPB public surfaces did not surface a procurement recusal or inhibition record tied to this normalized supplier. No inference is made from the absence of a retrievable record.',
      },
    },
    ]
  );

const historicalRoleDisclosures: IntegrityDisclosureRecord[] = [
  {
    id: 'historical-role-runr-rodel-paz-2017',
    kind: 'other-disclosure',
    subjectEntityId: 'supplier-runr-enterprise-and-services-company',
    subjectNameAsStated: 'RUNR Enterprises and Services Company',
    relatedNameAsStated: 'Rodel Paz',
    assessment: {
      status: 'source-backed',
      statementAsStated:
        'Makati City bid results identified Rodel Paz as Managing Partner of RUNR Enterprises and Services Company.',
      sourceIds: ['makati-q3-2017-bid-results'],
      asOfDate: '2017-07-04',
    },
    notes: [
      'This is a historical role statement from the cited procurement disclosure. It is not treated as current beneficial ownership, current management status, or a conflict-of-interest finding.',
    ],
  },
  {
    id: 'historical-role-tj-grill-adelbert-ramas-2017',
    kind: 'other-disclosure',
    subjectEntityId: 'supplier-tj-grill-corp',
    subjectNameAsStated: 'TJ Grill Corporation',
    relatedNameAsStated: 'Adelbert Ramas',
    assessment: {
      status: 'source-backed',
      statementAsStated:
        'Makati City bid results identified Adelbert Ramas as Owner of TJ Grill Corporation.',
      sourceIds: ['makati-q3-2017-bid-results'],
      asOfDate: '2017-07-07',
    },
    notes: [
      'This source-stated 2017 role is preserved as historical evidence only. It is not treated as a current beneficial-ownership declaration.',
    ],
  },
  {
    id: 'historical-role-jppm-benjamin-murie-2017',
    kind: 'other-disclosure',
    subjectEntityId: 'supplier-jppm-construction-and-supply',
    subjectNameAsStated: 'JPPM Construction and Supply',
    relatedNameAsStated: 'Benjamin Murie',
    assessment: {
      status: 'source-backed',
      statementAsStated:
        'Makati City bid results identified Benjamin Murie as Owner of JPPM Construction and Supply.',
      sourceIds: ['makati-q3-2017-bid-results'],
      asOfDate: '2017-07-10',
    },
    notes: [
      'The cited city record is historical. BetterMakati does not infer that the 2017 owner label establishes current ownership or beneficial ownership in 2026.',
    ],
  },
];

export const integrityDisclosureRecords: IntegrityDisclosureRecord[] = [
  ...entityResearchRecords,
  ...historicalRoleDisclosures,
];

export const integrityDisclosureByEntityId = new Map(
  integrityProcurementEntities.map(entity => [
    entity.id,
    integrityDisclosureRecords.filter(
      record => record.subjectEntityId === entity.id
    ),
  ])
);
