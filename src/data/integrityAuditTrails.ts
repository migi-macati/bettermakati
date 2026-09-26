import { auditFindingEntries } from './accountabilitySupplement';
import type {
  AuditCorrectiveActionEvidence,
  AuditFindingRecord,
  AuditResolutionTrail,
  IntegritySource,
} from './integrityTypes';

export const integrityAuditReviewed = '26 September 2026';

export const integrityAuditSources: IntegritySource[] = [
  {
    id: 'coa-annual-audit-reports',
    label: 'Commission on Audit annual audit reports',
    url: 'https://www.coa.gov.ph/reports/annual-audit-reports/',
    publisher: 'Commission on Audit',
    sourceClass: 'audit-institution',
    retrievedOn: integrityAuditReviewed,
  },
  {
    id: 'gma-2018-development-fund-finding',
    label: 'GMA News report quoting the COA finding and city response',
    url: 'https://www.gmanetwork.com/news/topstories/metro/665703/coa-questions-why-makati-city-used-dev-t-funds-to-repay-loans/story/',
    publisher: 'GMA News',
    publishedOrPeriod: '28 August 2018',
    sourceClass: 'secondary-reporting',
    retrievedOn: integrityAuditReviewed,
  },
  {
    id: 'gma-2018-development-fund-city-response',
    label: 'Makati City response to the 2017 COA finding',
    url: 'https://www.gmanetwork.com/news/topstories/metro/666053/makati-lgu-exec-legality-of-p391-m-dev-t-funds-use-not-in-question/story/',
    publisher: 'GMA News',
    publishedOrPeriod: '30 August 2018',
    sourceClass: 'secondary-reporting',
    retrievedOn: integrityAuditReviewed,
  },
  {
    id: 'coa-makati-2018-audit-archive',
    label: 'COA 2018 local-government annual audit archive — Makati City',
    url: 'https://www.coa.gov.ph/reports/annual-audit-reports/aar-local-government-units/#167-671-cities-1613444677',
    publisher: 'Commission on Audit',
    publishedOrPeriod: '2018',
    sourceClass: 'audit-institution',
    retrievedOn: integrityAuditReviewed,
  },
  {
    id: 'makati-2018-unliquidated-cash-advances',
    label: 'Makati status report of unliquidated cash advances as of 31 December 2018',
    url: 'https://www.makati.gov.ph/assets/uploads/staticmenu/files/cashadvances.pdf',
    publisher: 'City Government of Makati',
    publishedOrPeriod:
      '31 December 2018; liquidation remarks updated in January-February 2019',
    sourceClass: 'city-government',
    retrievedOn: integrityAuditReviewed,
  },
  {
    id: 'makati-deped-sef-q4-2024',
    label: 'Makati Special Education Fund Utilization — Q4 2024',
    url: 'https://www.depedncr.com.ph/wp-content/uploads/2025/05/SEF-MAKATI-CITY-4th-Quarter-2024.pdf',
    publisher: 'City Government of Makati / DepEd NCR',
    publishedOrPeriod: 'Year ended 31 December 2024',
    sourceClass: 'public-institution',
    retrievedOn: integrityAuditReviewed,
  },
  {
    id: 'coa-makati-sef-compliance-2024',
    label: 'Makati City Compliance Audit Report 2024',
    url: 'https://www.coa.gov.ph/wpfd_file/makati-city-compliance-audit-report-2024/',
    publisher: 'Commission on Audit',
    publishedOrPeriod: '2024 audit; published 2025',
    sourceClass: 'audit-institution',
    retrievedOn: integrityAuditReviewed,
  },
];

const sourceIdByUrl = new Map(
  integrityAuditSources.map(source => [source.url, source.id])
);

const findingEntryIds = [
  'audit-2017-development-fund-loan-payments',
  'audit-2018-deped-cash-advances',
  'audit-2018-sef-eligibility',
] as const;

const findingEntries = findingEntryIds.map(id => {
  const entry = auditFindingEntries.find(candidate => candidate.id === id);
  if (!entry?.audit) {
    throw new Error('Missing finding-level audit trace for ' + id);
  }
  return entry;
});

export const integrityAuditFindings: AuditFindingRecord[] =
  findingEntries.map(entry => {
    const audit = entry.audit;
    if (!audit) {
      throw new Error('Missing audit details for ' + entry.id);
    }

    const sourceIds = entry.sources
      .map(source => sourceIdByUrl.get(source.url))
      .filter((sourceId): sourceId is string => Boolean(sourceId));

    if (!sourceIds.length) {
      throw new Error('No canonical audit source resolves for ' + entry.id);
    }

    return {
      id: 'finding-' + entry.id.replace(/^audit-/, ''),
      accountabilityEntryId: entry.id,
      auditPeriod: entry.period,
      title: entry.title,
      findingAsStated: audit.finding,
      recommendationAsStated: audit.recommendation,
      responsibleBodies: entry.responsibleBodies,
      amountM: entry.reportedAmountM,
      sourceIds,
    };
  });

const findingIdByAccountabilityEntryId = new Map(
  integrityAuditFindings.map(finding => [
    finding.accountabilityEntryId,
    finding.id,
  ])
);

const findingId = (accountabilityEntryId: string) => {
  const id = findingIdByAccountabilityEntryId.get(accountabilityEntryId);
  if (!id) {
    throw new Error(
      'No canonical audit finding resolves for ' + accountabilityEntryId
    );
  }
  return id;
};

export const integrityAuditActions: AuditCorrectiveActionEvidence[] = [
  {
    id: 'action-2017-development-fund-management-response',
    findingId: findingId('audit-2017-development-fund-loan-payments'),
    kind: 'management-response',
    statementAsStated:
      auditFindingEntries.find(
        entry => entry.id === 'audit-2017-development-fund-loan-payments'
      )?.audit?.managementResponse ?? '',
    date: '2018-08-30',
    continuityBasis: 'explicit-finding-reference',
    sourceIds: ['gma-2018-development-fund-city-response'],
    notes: [
      'The cited response addresses this specific reported COA finding. It records the city response but does not establish that the recommendation was later implemented or closed.',
    ],
  },
  {
    id: 'action-2017-development-fund-later-audit-summary',
    findingId: findingId('audit-2017-development-fund-loan-payments'),
    kind: 'later-audit-status',
    statementAsStated:
      'The 2018 Makati audit executive summary reported aggregate implementation counts for 23 recommendations from the 2016 and 2017 audits, but the available summary does not map this specific recommendation to one of those statuses.',
    continuityBasis: 'unresolved',
    sourceIds: ['coa-makati-2018-audit-archive'],
    notes: [
      'Aggregate implementation counts are not used to infer the status of this specific 2017 recommendation.',
    ],
  },
  {
    id: 'action-2018-deped-cash-advance-later-control-evidence',
    findingId: findingId('audit-2018-deped-cash-advances'),
    kind: 'implementation-evidence',
    statementAsStated:
      'The city year-end cash-advance status report records later liquidation controls for specific DepEd-Makati advances, including supporting documents returned for compliance and cash balances returned in January-February 2019.',
    continuityBasis: 'unresolved',
    sourceIds: ['makati-2018-unliquidated-cash-advances'],
    notes: [
      'The later report does not identify the ₱4.9M COA finding or certify implementation of the specific recommendation, so it is contextual follow-up rather than closure evidence.',
    ],
  },
  {
    id: 'action-2018-sef-later-reporting-and-compliance-evidence',
    findingId: findingId('audit-2018-sef-eligibility'),
    kind: 'implementation-evidence',
    statementAsStated:
      'By 2024, Makati was publishing the standardized FDP Form 11 Special Education Fund utilization report and COA had conducted a dedicated compliance audit of SEF monitoring, transparency and accountability.',
    continuityBasis: 'unresolved',
    sourceIds: [
      'makati-deped-sef-q4-2024',
      'coa-makati-sef-compliance-2024',
    ],
    notes: [
      'The later records do not contain an item-level implementation-status reference explicitly closing the 2018 ₱30.793M finding.',
    ],
  },
];

export const integrityAuditResolutionTrails: AuditResolutionTrail[] = [
  {
    findingId: findingId('audit-2017-development-fund-loan-payments'),
    actionEvidenceIds: [
      'action-2017-development-fund-management-response',
      'action-2017-development-fund-later-audit-summary',
    ],
    resolution: {
      status: 'unresolved',
      reason:
        'A source-backed management response exists, but the later COA implementation summary is aggregate and does not identify this specific recommendation as implemented, partially implemented or not acted on.',
    },
  },
  {
    findingId: findingId('audit-2018-deped-cash-advances'),
    actionEvidenceIds: [
      'action-2018-deped-cash-advance-later-control-evidence',
    ],
    resolution: {
      status: 'unresolved',
      reason:
        'Later cash-advance records show related liquidation controls but do not explicitly identify or close the ₱4.9M COA finding or its recommendation.',
    },
  },
  {
    findingId: findingId('audit-2018-sef-eligibility'),
    actionEvidenceIds: [
      'action-2018-sef-later-reporting-and-compliance-evidence',
    ],
    resolution: {
      status: 'unresolved',
      reason:
        'Later SEF reporting and audit activity exists, but no retrievable item-level COA status explicitly maps the 2018 ₱30.793M recommendation to a resolved implementation state.',
    },
  },
];

export const integrityAuditTrailByFindingId = new Map(
  integrityAuditResolutionTrails.map(trail => [trail.findingId, trail])
);

export const integrityAuditSourceOnlyRecords = auditFindingEntries
  .filter(entry => !findingIdByAccountabilityEntryId.has(entry.id))
  .map(entry => ({
    accountabilityEntryId: entry.id,
    title: entry.title,
    reason:
      entry.notes?.[0] ??
      'This audit record does not yet expose finding-level text required for a canonical audit finding.',
  }));
