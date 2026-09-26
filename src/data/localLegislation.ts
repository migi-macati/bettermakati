export type LocalMeasureType = 'ordinance' | 'resolution';

export interface LocalLegislationSource {
  id: string;
  label: string;
  publisher: string;
  url: string;
  sourceClass:
    | 'city-legislation-archive'
    | 'official-measure-document'
    | 'official-city-publication'
    | 'official-session-video'
    | 'official-agenda'
    | 'official-minutes'
    | 'official-transcript'
    | 'other-official';
  role:
    | 'identity'
    | 'official-text'
    | 'lifecycle-evidence'
    | 'session-evidence'
    | 'relationship-evidence'
    | 'record-access'
    | 'context';
  note?: string;
}

export type LocalLegislationCivicRelationshipKind =
  | 'affects-service'
  | 'applies-to-barangay'
  | 'affects-place'
  | 'authorizes-project'
  | 'funds-project'
  | 'affects-accountability-record'
  | 'supported-by-public-record';

export type LocalLegislationCivicTargetType =
  | 'service'
  | 'barangay'
  | 'place'
  | 'project'
  | 'accountability-record'
  | 'public-record';

export interface LocalLegislationCivicRelationship {
  kind: LocalLegislationCivicRelationshipKind;
  targetType: LocalLegislationCivicTargetType;
  targetId: string;
  sourceIds: string[];
  evidence: {
    basis:
      | 'official-title'
      | 'official-text'
      | 'official-agenda-minutes'
      | 'reviewed-official-session-recording'
      | 'official-cross-reference';
    statement: string;
  };
  note?: string;
}

export interface LocalLegislationRecord {
  id: string;
  measureType: LocalMeasureType;
  reference: {
    officialNumber: string;
    seriesYear?: number;
    sequence?: string;
    display: string;
    sourceIds: string[];
  };
  title: string;
  jurisdiction: {
    level: 'city';
    name: 'Makati City';
    legislativeBody: 'Sangguniang Panlungsod ng Makati';
  };
  documents: Array<{
    id: string;
    kind:
      | 'official-text'
      | 'archive-record'
      | 'certified-copy'
      | 'agenda'
      | 'minutes'
      | 'session-video'
      | 'official-transcript'
      | 'bettermakati-reviewed-transcript'
      | 'other';
    label: string;
    url: string;
    publisher: string;
    sourceIds: string[];
    note?: string;
  }>;
  provenance: {
    sourceIds: string[];
    note?: string;
  };
  lifecycle: Array<{
    id: string;
    eventType:
      | 'filed-introduced'
      | 'referred-calendared'
      | 'committee-consideration'
      | 'first-reading'
      | 'second-reading'
      | 'third-final-reading'
      | 'deliberated'
      | 'approved-by-council'
      | 'transmitted-for-mayoral-action'
      | 'mayor-signed-approved'
      | 'mayor-vetoed'
      | 'mayor-other-action'
      | 'published'
      | 'effective'
      | 'implemented'
      | 'amended'
      | 'repealed'
      | 'other-as-stated';
    date?: string;
    actionAsStated?: string;
    evidenceStatus:
      | 'explicit-official-document'
      | 'explicit-official-agenda-minutes'
      | 'reviewed-official-session-recording'
      | 'official-publication'
      | 'official-cross-reference';
    sourceIds: string[];
    cityMonitorRecordId?: string;
    note?: string;
  }>;
  sessionEvidence: Array<{
    cityMonitorRecordId?: string;
    sessionDate: string;
    sessionType:
      | 'regular-session'
      | 'special-session'
      | 'committee-hearing'
      | 'public-hearing'
      | 'other-official-session';
    relationship:
      | 'mentioned'
      | 'calendared'
      | 'referred'
      | 'deliberated'
      | 'read'
      | 'voted'
      | 'approved'
      | 'enacted'
      | 'other-as-stated';
    evidenceStatus:
      | 'official-agenda'
      | 'official-minutes'
      | 'official-measure-text'
      | 'reviewed-official-video'
      | 'multiple-official-sources';
    sourceIds: string[];
    note?: string;
  }>;
  measureRelationships: Array<{
    kind:
      | 'amends'
      | 'amended-by'
      | 'repeals'
      | 'repealed-by'
      | 'implements'
      | 'implemented-by'
      | 'supersedes'
      | 'superseded-by'
      | 'cites'
      | 'related-as-stated';
    targetMeasureId: string;
    sourceIds: string[];
    note?: string;
  }>;
  topics: string[];
  relationships: LocalLegislationCivicRelationship[];
  revision: {
    schemaVersion: 1;
    lastReviewed: string;
    recordStatus: 'verified' | 'provisional' | 'needs-review' | 'retired';
    changeNote?: string;
  };
}

export const localLegislationSources: Record<string, LocalLegislationSource> = {
  'makati-covid-recovery-plan-2020': {
    id: 'makati-covid-recovery-plan-2020',
    label: 'Makati City COVID-19 Recovery Plan — Annex A: City Policies and Legislation',
    publisher: 'City Government of Makati',
    url: 'https://www.makati.gov.ph/assets/uploads/downloads/2/61/681/pdf/Final_Makati%20City%20COVID-19%20Recovery%20Plan.pdf',
    sourceClass: 'official-city-publication',
    role: 'identity',
    note:
      'Annex A lists the measure reference, title and date of approval. It is an official source for the bounded ordinance/resolution batches but is not treated as the full official text of each measure.',
  },
};

export const ordinanceBatch2020CovidResponse = {
  id: 'ordinance-batch-2020-covid-response',
  label: 'COVID-19 response ordinances listed in Annex A of the Makati City COVID-19 Recovery Plan',
  declaredScope:
    'All City Ordinance entries in Annex A, City Policies and Legislation, from 19 March through 6 May 2020.',
  sourceId: 'makati-covid-recovery-plan-2020',
  periodStart: '2020-03-19',
  periodEnd: '2020-05-06',
  expectedCount: 15,
  completenessRule:
    'This batch contains every City Ordinance entry listed in the cited Annex A between 19 March and 6 May 2020. It does not claim to contain every Makati ordinance enacted in 2020.',
  recordEvidenceLevel:
    'Official city publication confirms reference, title-as-listed and date of approval; individual full legal texts are not yet normalized in this batch.',
} as const;

const annexSource = localLegislationSources['makati-covid-recovery-plan-2020'];

const annexVerifiedEnrichment: Record<
  string,
  {
    topics: string[];
    relationships: LocalLegislationCivicRelationship[];
  }
> = {
  '2020-115': {
    topics: ['civil registry', 'COVID-19'],
    relationships: [
      {
        kind: 'affects-service',
        targetType: 'service',
        targetId: 'civil-registration',
        sourceIds: [annexSource.id],
        evidence: {
          basis: 'official-title',
          statement:
            'Annex A titles this ordinance as suspending late registration fees on several civil registry documents during the COVID-19 community quarantine.',
        },
        note:
          'The relationship identifies the explicitly affected service area only; it does not infer current fees, implementation status or later legal effect.',
      },
    ],
  },
  '2020-116': {
    topics: ['civil registry', 'death records', 'COVID-19'],
    relationships: [
      {
        kind: 'affects-service',
        targetType: 'service',
        targetId: 'local-civil-registry-copy',
        sourceIds: [annexSource.id],
        evidence: {
          basis: 'official-title',
          statement:
            'Annex A titles this ordinance as waiving fees for certified true copies of certificates of death during the COVID-19 community quarantine.',
        },
        note:
          'The relationship identifies the explicitly affected service area only; it does not infer current fees, implementation status or later legal effect.',
      },
    ],
  },
};

const ordinanceFromAnnex = (
  officialNumber: string,
  approvalDate: string,
  title: string
): LocalLegislationRecord => {
  const sequence = officialNumber.split('-').at(-1) ?? officialNumber;
  const id = 'ordinance-' + officialNumber;
  const enrichment = annexVerifiedEnrichment[officialNumber] ?? {
    topics: [],
    relationships: [],
  };

  return {
    id,
    measureType: 'ordinance',
    reference: {
      officialNumber,
      seriesYear: 2020,
      sequence,
      display: 'City Ordinance No. ' + officialNumber,
      sourceIds: [annexSource.id],
    },
    title,
    jurisdiction: {
      level: 'city',
      name: 'Makati City',
      legislativeBody: 'Sangguniang Panlungsod ng Makati',
    },
    documents: [
      {
        id: 'annex-a-' + officialNumber,
        kind: 'archive-record',
        label: annexSource.label,
        url: annexSource.url,
        publisher: annexSource.publisher,
        sourceIds: [annexSource.id],
        note:
          'Official city publication listing the ordinance reference, title and date of approval; not the ordinance’s full legal text.',
      },
    ],
    provenance: {
      sourceIds: [annexSource.id],
      note:
        'Identity/title/date are normalized from Annex A only. Authors, readings, vote, mayoral action, effectivity and later legal status remain unset unless separately evidenced.',
    },
    lifecycle: [
      {
        id: 'annex-a-approval-' + officialNumber,
        eventType: 'other-as-stated',
        date: approvalDate,
        actionAsStated: 'Date of approval listed in Annex A',
        evidenceStatus: 'official-publication',
        sourceIds: [annexSource.id],
        note:
          'The source labels the field Date of Approval but does not, in this table alone, identify the approving body or establish other lifecycle stages.',
      },
    ],
    sessionEvidence: [],
    measureRelationships: [],
    topics: enrichment.topics,
    relationships: enrichment.relationships,
    revision: {
      schemaVersion: 1,
      lastReviewed: '2026-09-26',
      recordStatus: 'provisional',
      changeNote:
        'Identity, title-as-listed and approval date are verified against the official Annex A. Full ordinance text, authors, readings, vote, mayoral action, effectivity and later legal status still require measure-level evidence.',
    },
  };
};

export const localOrdinanceRecords: LocalLegislationRecord[] = [
  ordinanceFromAnnex(
    '2020-074',
    '2020-03-19',
    "Mandating the Strict Implementation of Curfew Hours From 8:00 P.M to 5:00 A.M of the Following Day to All Persons Within the City of Makati During A State of Calamity, Public Health Emergency"
  ),
  ordinanceFromAnnex(
    '2020-075',
    '2020-03-19',
    "Extending the Deadline of Payment and Suspending the Imposition of Penalties, Interests, and Surcharges in the Revenue-Generating Activities of the City, Subject to Existing Laws, Rules and Regulations"
  ),
  ordinanceFromAnnex(
    '2020-080',
    '2020-03-26',
    "Temporarily Suspending the Implementation of Sections 21 – 23 of City Ordinance NO. 2003-095, Otherwise Known as the Solid Waste Management Code of the City of Makati, During a State of Calamity, Public Health Emergency and the Like, Subject to Existing Laws, Rules and Regulations"
  ),
  ordinanceFromAnnex(
    '2020-086',
    '2020-04-08',
    "Appropriating the Amount of Three Hundred Forty-Seven Million Nine Hundred Fifty Thousand One Hundred Seven Pesos and 22/10 (P347,950,107.22) as Supplemental Budget No. 2 for Calendar Year 2020 which will be Sourced from the Realignment of Existing Programs, Projects and Activities (PPAs) of the Continuing Appropriations Under the 20% Development Fund for the Purpose of Funding the Various COVID-19-Related Expenses Consistent with Item 2.1 of DILG-DBM Joint Memorandum Circular (JMC) No. 01 Dated 27 March 2020, Subject to Applicable Laws and Auditing Rules and Regulations"
  ),
  ordinanceFromAnnex(
    '2020-087',
    '2020-04-08',
    "Prohibiting Any Person from Committing Any Act of Discrimination Against Any Person who is Infected or Suspected to be Infected with an Infectious/Communicable Disease, Whether as a Patients or as a Front-liner/Service Worker, Subject to Existing Laws, Rules and Regulations"
  ),
  ordinanceFromAnnex(
    '2020-088',
    '2020-04-08',
    "Mandating the Imposition of Quarantine to All Persons who shall be Infected or Suspected to be Infected with an Infectious/Communicable Disease, Providing Penalties for Violations Thereof and for Other Purposes, Subject to Existing Laws, Rules and Regulations"
  ),
  ordinanceFromAnnex(
    '2020-089',
    '2020-04-08',
    "Requiring All Persons Within the Territorial Jurisdiction of the City of Makati to Wear Face Masks or other Similar Protective Equipment Outside their Home Premises During the Existence of a State of Public Health Emergency or Similar Declarations, Providing Penalties for Violations Thereof and For Other Purposes, Subject to Exiting Laws, Rules and Regulations"
  ),
  ordinanceFromAnnex(
    '2020-090',
    '2020-04-15',
    "Extending the Deadline of Payment and Likewise Suspending the Imposition of Penalties, Interests and Surcharges in the Revenue-Generating Activities/Sources of the City Due to the Extension of the Enhanced Community Quarantine Relative to the Coronavirus Disease 2019 (COVID-19) Outbreak, Subject to Existing Laws, Rules and Regulations"
  ),
  ordinanceFromAnnex(
    '2020-092',
    '2020-04-15',
    "Appropriating the Amount of One Hundred Twenty-Four Million Four Hundred Fifty-Three Thousand Pesos (P124,453,000.00) as Supplemental Budget No. 3 for Calendar Year 2020 for the Grand of COVID-19 Hazard Pay and Special Risk Allowance Pursuant to DBM Budget Circular Nos. 2020-1 and 2020-2, among others, Funds of which shall be taken from the Funding Sources Stated in LBP Form no. 8, Subject to Applicable Laws and Auditing Rules and Procedures"
  ),
  ordinanceFromAnnex(
    '2020-095',
    '2020-04-18',
    "Appropriating the Amount of One Hundred Ten Million Eight Hundred Ninety-Two Thousand and Twenty Tow Pesos (P110,892,022.00) as Supplemental Budget No. 4 for Calendar Year 2020 Sourced from the National Government’s Bayanihan Grant to Cities and Municipalities (BGCM) which will be Used for Various Coronavirus Disease 2019 (COVID-19) Related Expenses as Provided by the Pertinent Provisions of Department of Budget and Management (DBM) Local Budget Circular (LBC) No. 125 Dated 7 April 2020 and Likewise Authorizing the Creation of a Special Account in the General Fund (SAGF) for the BGCM as Mandated by Item 3.7 of the Said LBC, Subject to Applicable Laws and Auditing Rules and Procedures"
  ),
  ordinanceFromAnnex(
    '2020-100',
    '2020-04-21',
    "Establishing and Funding the MAKA-Tulong 5K for 500K+ Makatizens Economic Relief Program to Eligible Makatizens who were Affected and Continue to be Affected by the Coronavirus Disease 2019 (COVID-19) Pandemic by Way of Enactment of Supplemental Budget No. 5, Subject to Applicable Laws and Auditing Rules and Procedures"
  ),
  ordinanceFromAnnex(
    '2020-115',
    '2020-04-29',
    "Suspending the Imposition of Late Registration Fees on Several Civil Registry Documents Due to the Implementation of Community Quarantine Relative to the Coronavirus Disease 2019 (COVID-19) Pandemic, Subject to Existing Laws, Rules and Regulations"
  ),
  ordinanceFromAnnex(
    '2020-116',
    '2020-04-29',
    "Waiving the Collection of Fees Pertaining to the Issuance of Certified True Copies of Certificates of Death During the Community Quarantine Relative to the Coronavirus Disease 2019 (COVID-19) Pandemic, Subject to Existing Laws, Rules and Regulations"
  ),
  ordinanceFromAnnex(
    '2020-117',
    '2020-04-29',
    "Waiving the Collection of Cremation Permit Fees, Subject to Existing Laws, Rules and Regulations"
  ),
  ordinanceFromAnnex(
    '2020-128',
    '2020-05-06',
    "Approving the Reprogramming of the Unexpended Balances of 2015 to 2019 LDDRM Fund Amounting to One Hundred Seventy-Two Million Forty-Seven Thousand Six Hundred Thirty-Eight Pesos and 18/100 (PHP 172,047,638.18) for the Purpose of Funding the Programs, Projects and Activities Which Will Address the Coronavirus Disease 2019 (COVID-19) Situation Consistent with DMB Local Budget Circular No. 124 Dated 26 March 2020 and Other Issuances, Subject to Applicable Laws and Auditing Rules and Procedures"
  ),
];


export const resolutionBatch2020CovidResponse = {
  id: 'resolution-batch-2020-covid-response',
  label:
    'COVID-19 response resolutions listed in Annex A of the Makati City COVID-19 Recovery Plan',
  declaredScope:
    'All City Resolution entries in Annex A, City Policies and Legislation, from 16 through 19 March 2020.',
  sourceId: 'makati-covid-recovery-plan-2020',
  periodStart: '2020-03-16',
  periodEnd: '2020-03-19',
  expectedCount: 5,
  completenessRule:
    'This batch contains every City Resolution entry listed in the cited Annex A between 16 and 19 March 2020. It does not claim to contain every Makati resolution adopted in 2020.',
  recordEvidenceLevel:
    'Official city publication confirms reference, title-as-listed and date of approval; individual full legal texts are not yet normalized in this batch.',
} as const;

const resolutionFromAnnex = (
  officialNumber: string,
  approvalDate: string,
  title: string
): LocalLegislationRecord => {
  const sequence = officialNumber.split('-').at(-1) ?? officialNumber;
  const id = 'resolution-' + officialNumber;

  return {
    id,
    measureType: 'resolution',
    reference: {
      officialNumber,
      seriesYear: 2020,
      sequence,
      display: 'City Resolution No. ' + officialNumber,
      sourceIds: [annexSource.id],
    },
    title,
    jurisdiction: {
      level: 'city',
      name: 'Makati City',
      legislativeBody: 'Sangguniang Panlungsod ng Makati',
    },
    documents: [
      {
        id: 'annex-a-resolution-' + officialNumber,
        kind: 'archive-record',
        label: annexSource.label,
        url: annexSource.url,
        publisher: annexSource.publisher,
        sourceIds: [annexSource.id],
        note:
          'Official city publication listing the resolution reference, title and date of approval; not the resolution’s full legal text.',
      },
    ],
    provenance: {
      sourceIds: [annexSource.id],
      note:
        'Identity/title/date are normalized from Annex A only. Authors, readings, vote, mayoral action where applicable, effectivity and later legal status remain unset unless separately evidenced.',
    },
    lifecycle: [
      {
        id: 'annex-a-resolution-approval-' + officialNumber,
        eventType: 'other-as-stated',
        date: approvalDate,
        actionAsStated: 'Date of approval listed in Annex A',
        evidenceStatus: 'official-publication',
        sourceIds: [annexSource.id],
        note:
          'The source labels the field Date of Approval but does not, in this table alone, identify the approving body or establish other lifecycle stages.',
      },
    ],
    sessionEvidence: [],
    measureRelationships: [],
    topics: [],
    relationships: [],
    revision: {
      schemaVersion: 1,
      lastReviewed: '2026-09-26',
      recordStatus: 'provisional',
      changeNote:
        'Identity, title-as-listed and approval date are verified against the official Annex A. Full resolution text, authors, readings, vote, mayoral action where applicable, effectivity and later legal status still require measure-level evidence.',
    },
  };
};

export const localResolutionRecords: LocalLegislationRecord[] = [
  resolutionFromAnnex(
    '2020-016',
    '2020-03-16',
    'Declaring a State of Calamity in the City of Makati due to the Coronavirus Disease 2019 (COVID-19) Pandemic, Subject to Existing Laws, Rules and Regulations'
  ),
  resolutionFromAnnex(
    '2020-017',
    '2020-03-16',
    'Establishing the Restrictions in the Operation of Government and Private Facilities Until 14 April 2020, Unless Extended or Shortened Upon the Recommendation of the Inter-Agency Task Force on Emerging Infectious Diseases (IATF-EID) or the Makati Health Department (MHD), Subject to Existing Laws, Rules and Regulations'
  ),
  resolutionFromAnnex(
    '2020-018',
    '2020-03-19',
    'Enjoining All Establishments, Whether Public or Private, and Households Within the City of Makati to Implement “Ocho-Ocho” for the Purpose of Disinfecting and Sanitizing the Houses, Workplaces and Common Areas Every Day at 8:00am – 8:00pm, Subject to Existing Rules and Regulations'
  ),
  resolutionFromAnnex(
    '2020-019',
    '2020-03-19',
    'Authorizing the Honorable Mayor Mar-Len Abigail S. Binay to Accept, For and In Behalf of the City Government of Makati, All Donations Favorable to the City of Makati During the National Public Health Emergency, and to Sign the Deeds of Donation and All Other Pertinent Documents Relative Thereto, Subject to Existing Laws, Rules and Regulations'
  ),
  resolutionFromAnnex(
    '2020-020',
    '2020-03-19',
    'Authorizing the Honorable Mayor Mar-Len Abigail S. Binay to Enter into and Sign Various Agreements, Contracts, and the Like, For and In Behalf of the City Government of Makati, Which Will Benefit the City of Makati During the National Public Health Emergency, Subject to Existing Laws, Rules and Regulations.'
  ),
];

export const localLegislationRecords: LocalLegislationRecord[] = [
  ...localOrdinanceRecords,
  ...localResolutionRecords,
];

export const localLegislationById = new Map(
  localLegislationRecords.map(record => [record.id, record] as const)
);

export const localLegislationByReference = new Map(
  localLegislationRecords.map(record => [
    record.reference.officialNumber,
    record,
  ] as const)
);
