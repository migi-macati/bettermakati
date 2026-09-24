import {
  actualFiscalHistory,
  annualBudgetDocuments,
  budgetSources,
  budgetSummary,
  budgetSummary2026,
  dedicatedFunds,
  dedicatedFunds2026,
  developmentFundProject,
  selectedBudgetLines,
  selectedBudgetLines2026,
} from './budget2025';
import { cityMonitorRecords } from './cityMonitor';
import { serviceDirectory } from './serviceDirectory';
import { serviceGuideDetails } from './serviceGuideDetails';
import {
  auditFindingEntries,
  procurementProjectEntries,
  publicCommitmentEntries,
  specialEducationFundEntries,
} from './accountabilitySupplement';
import type { AccountabilityEntry, CoverageGap } from './civicTypes';

export const accountabilityReviewed = '24 September 2026';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const developmentFundEntry: AccountabilityEntry = {
  id: '2025-medical-supplies-development-fund',
  title: developmentFundProject.name,
  type: 'project',
  status: 'completed',
  summary:
    'Quarterly development-fund disclosures show the medical-supplies project progressing from 98.47% in Q1 to 100% in Q4 2025.',
  responsibleBodies: ['City Government of Makati'],
  period: '2025',
  targetDate: developmentFundProject.targetCompletion,
  location: developmentFundProject.location,
  reportedAmountM: developmentFundProject.latestCostM,
  actualAmountM: developmentFundProject.latestCostIncurredM,
  completionPct: developmentFundProject.latestCompletion,
  relatedHref: '/projects-budget#projects',
  lastVerified: accountabilityReviewed,
  sources: developmentFundProject.reports.map(report => ({
    label: `${report.quarter} 2025 20% Development Fund report`,
    url: report.href,
    publisher: 'City Government of Makati',
    publishedOrPeriod: report.quarter + ' 2025',
  })),
  notes: [
    '“Completed” describes the status reported in the cited Q4 disclosure.',
    'BetterMakati does not independently certify physical delivery or quality.',
  ],
};

const fiscalYearEntries: AccountabilityEntry[] = annualBudgetDocuments.map(
  (document): AccountabilityEntry => {
    const actual = actualFiscalHistory.find(item => item.year === document.year);
    const hasActuals = Boolean(actual);

    return {
      id: `${document.year}-city-fiscal-record`,
      title: `${document.year} city fiscal record`,
      type: 'fiscal',
      status: 'reported',
      summary:
        document.year === 2026
          ? 'The 2026 Annual Budget Report records a ₱21.0B budget-year proposed appropriation. Comparable full-year 2026 receipts and expenditures are not yet available in the DBM/BLGF actual series.'
          : hasActuals
            ? 'The annual budget document is indexed together with DBM/BLGF reported receipts and expenditures for the same year.'
            : 'The annual budget document is indexed. Comparable receipts and expenditures are not yet structured in this ledger for the same year.',
      responsibleBodies: ['City Government of Makati'],
      period: String(document.year),
      plannedAmountM:
        document.year === 2026
          ? budgetSummary2026.totalBudgetM
          : document.year === 2025
            ? budgetSummary.totalBudgetM
            : undefined,
      reportedAmountM: actual?.receiptsM,
      actualAmountM: actual?.expendituresM,
      relatedHref: '/projects-budget#budget',
      lastVerified: accountabilityReviewed,
      sources: [
        {
          label: `CY ${document.year} Annual Budget`,
          url: document.href,
          publisher: 'City Government of Makati',
          publishedOrPeriod: String(document.year),
        },
        ...(actual
          ? [
              {
                label: `DBM/BLGF ${document.year} fiscal statement`,
                url: actual.href,
                publisher: 'Department of Budget and Management / BLGF',
                publishedOrPeriod: `${document.year} reported year`,
              },
            ]
          : []),
      ],
      notes: [
        'Budget authority and reported actual receipts/expenditures answer different questions and are kept separate.',
        ...(document.year !== 2025 && document.year !== 2026
          ? [
              'The total approved budget amount for this year has not yet been normalized into the ledger, so the original annual-budget document remains the controlling source.',
            ]
          : []),
        ...(document.year === 2026
          ? [
              'The ₱21.0B figure is the Budget Year (Proposed) total in the 2026 Annual Budget Report; it is not presented here as actual expenditure.',
            ]
          : []),
      ],
    };
  }
);

const dedicatedFundEntries: AccountabilityEntry[] = [
  ...dedicatedFunds2026.map((fund): AccountabilityEntry => ({
    id: `2026-fund-${slugify(fund.label)}`,
    title: `2026 ${fund.label}`,
    type: 'fiscal',
    status: 'planned',
    summary: `${fund.description}. The amount shown is part of the 2026 budget-year proposal and is not evidence that the full amount has been obligated or spent.`,
    responsibleBodies: ['City Government of Makati'],
    period: '2026',
    plannedAmountM: fund.amountM,
    relatedHref: '/projects-budget#budget',
    lastVerified: accountabilityReviewed,
    sources: [
      {
        label: 'CY 2026 Annual Budget Report',
        url: fund.href,
        publisher: 'City Government of Makati',
        publishedOrPeriod: '2026',
      },
    ],
  })),
  ...dedicatedFunds.map((fund): AccountabilityEntry => ({
    id: `2025-fund-${slugify(fund.label)}`,
    title: `2025 ${fund.label}`,
    type: 'fiscal',
    status: 'planned',
    summary: `${fund.description}. The amount shown is an approved 2025 appropriation, not evidence that the full amount was spent.`,
    responsibleBodies: ['City Government of Makati'],
    period: '2025',
    plannedAmountM: fund.amountM,
    relatedHref: '/projects-budget#budget',
    lastVerified: accountabilityReviewed,
    sources: [
      {
        label: 'CY 2025 Annual Budget',
        url: fund.href,
        publisher: 'City Government of Makati',
        publishedOrPeriod: '2025',
      },
    ],
  })),
];

const majorBudgetEntries: AccountabilityEntry[] = [
  ...selectedBudgetLines2026
    .filter(item => item.amountM >= 250 || item.group === 'Capital')
    .map((item): AccountabilityEntry => ({
      id: `2026-budget-${slugify(item.label)}`,
      title: `2026 budget proposal: ${item.label}`,
      type: 'fiscal',
      status: 'planned',
      summary: `${item.group} line in the 2026 Annual Budget Report. This is a budget-year proposed amount and should not be read as evidence of obligation, disbursement or delivery.`,
      responsibleBodies: ['City Government of Makati'],
      period: '2026',
      plannedAmountM: item.amountM,
      relatedHref: '/projects-budget#budget',
      lastVerified: accountabilityReviewed,
      sources: [
        {
          label: 'CY 2026 Annual Budget Report',
          url: budgetSources.annualBudget2026,
          publisher: 'City Government of Makati',
          publishedOrPeriod: '2026',
        },
      ],
      notes:
        item.group === 'Capital'
          ? [
              'This is a capital-outlay budget line, not yet a project-level contract or implementation record.',
            ]
          : undefined,
    })),
  ...selectedBudgetLines
    .filter(item => item.amountM >= 250 || item.group === 'Capital')
    .map((item): AccountabilityEntry => ({
      id: `2025-budget-${slugify(item.label)}`,
      title: `2025 appropriation: ${item.label}`,
      type: 'fiscal',
      status: 'planned',
      summary: `${item.group} line in the 2025 annual budget. This records the approved appropriation and should not be read as evidence that the full amount was obligated or spent.`,
      responsibleBodies: ['City Government of Makati'],
      period: '2025',
      plannedAmountM: item.amountM,
      relatedHref: '/projects-budget#budget',
      lastVerified: accountabilityReviewed,
      sources: [
        {
          label: 'CY 2025 Annual Budget',
          url: budgetSources.annualBudget,
          publisher: 'City Government of Makati',
          publishedOrPeriod: '2025',
        },
      ],
      notes:
        item.group === 'Capital'
          ? [
              'This is a capital-outlay budget line, not yet a project-level contract or implementation record.',
            ]
          : undefined,
    })),
];

const procurementEntries: AccountabilityEntry[] = cityMonitorRecords
  .filter(record => record.type === 'procurement')
  .map((record): AccountabilityEntry => ({
    id: `procurement-${record.id}`,
    title: record.title,
    type: 'project',
    status: record.status === 'completed' ? 'completed' : 'reported',
    summary: record.summary,
    responsibleBodies: [record.sourcePublisher],
    period: record.date.slice(0, 4),
    reportedAmountM:
      record.amount !== undefined ? record.amount / 1_000_000 : undefined,
    relatedHref: record.relatedHref,
    lastVerified: accountabilityReviewed,
    sources: [
      {
        label: record.sourceLabel,
        url: record.sourceUrl,
        publisher: record.sourcePublisher,
        publishedOrPeriod: record.date,
      },
    ],
    notes: [
      ...(record.referenceNo
        ? [`Procurement reference: ${record.referenceNo}.`]
        : []),
      ...(record.status === 'awarded'
        ? [
            'The source reports an award; an award is not evidence that implementation or payment is complete.',
          ]
        : []),
    ],
  }));

const serviceStandardEntries: AccountabilityEntry[] = serviceDirectory.flatMap(
  (service): AccountabilityEntry[] => {
    const detail = serviceGuideDetails[service.id];
    if (
      service.level !== 'City' ||
      !detail ||
      detail.verification !== 'verified' ||
      !detail.processingTime
    ) {
      return [];
    }

    return [
      {
        id: `service-standard-${service.id}`,
        title: `Published service standard: ${service.title}`,
        type: 'service',
        status: 'reported',
        summary: detail.processingTime,
        responsibleBodies: [service.agency],
        period: 'Current published service guide',
        relatedHref: service.href.startsWith('/') ? service.href : undefined,
        lastVerified: detail.lastVerified,
        sources: [
          {
            label: detail.sourceLabel,
            url: detail.sourceUrl,
            publisher: 'City Government of Makati',
            publishedOrPeriod: detail.lastVerified,
          },
        ],
        notes: [
          'This records the published processing standard or guidance. BetterMakati has not independently measured actual transaction times.',
        ],
      },
    ];
  }
);

const cityMonitorCommitmentEntries: AccountabilityEntry[] = cityMonitorRecords.flatMap(
  (record): AccountabilityEntry[] =>
    (record.commitments ?? []).map((commitment, index) => ({
      id: `commitment-${record.id}-${index + 1}`,
      title: commitment.text,
      type: 'commitment',
      status: 'planned',
      summary:
        commitment.sourceNote ||
        'Commitment extracted from the cited official record and queued for follow-through.',
      responsibleBodies: [record.sourcePublisher],
      period: record.date.slice(0, 4),
      targetDate: commitment.target,
      relatedHref: record.relatedHref,
      lastVerified: accountabilityReviewed,
      sources: [
        {
          label: record.sourceLabel,
          url: record.sourceUrl,
          publisher: record.sourcePublisher,
          publishedOrPeriod: record.date,
        },
      ],
      notes: [
        'Commitment status changes only when later public evidence supports an update.',
      ],
    }))
);

const auditEntries: AccountabilityEntry[] = [
  {
    id: 'coa-makati-annual-audit-reports',
    title: 'Commission on Audit annual reports for Makati',
    type: 'audit',
    status: 'reported',
    summary:
      'COA annual audit reports are indexed as the primary audit source. Individual findings, management responses and later resolution status are not yet normalized into finding-level ledger records.',
    responsibleBodies: ['Commission on Audit', 'City Government of Makati'],
    period: 'Annual',
    relatedHref: '/integrity',
    lastVerified: accountabilityReviewed,
    sources: [
      {
        label: 'Commission on Audit annual audit reports',
        url: budgetSources.audit,
        publisher: 'Commission on Audit',
      },
    ],
    notes: [
      'This entry indexes the audit source; it is not itself a finding against the city or any person.',
    ],
  },
];

export const accountabilityEntries: AccountabilityEntry[] = [
  developmentFundEntry,
  ...procurementProjectEntries,
  ...procurementEntries,
  ...serviceStandardEntries,
  ...publicCommitmentEntries,
  ...cityMonitorCommitmentEntries,
  ...specialEducationFundEntries,
  ...dedicatedFundEntries,
  ...majorBudgetEntries,
  ...fiscalYearEntries,
  ...auditFindingEntries,
  ...auditEntries,
];

export interface AccountabilityCoverageArea {
  id: AccountabilityEntry['type'];
  label: string;
  period: string;
  included: string;
  limit: string;
  recordCount: number;
}

const coverageAreaSeed: Array<Omit<AccountabilityCoverageArea, 'recordCount'>> = [
  {
    id: 'fiscal',
    label: 'Budget & spending',
    period: '2014–2026 budget archive; reported fiscal series through 2025',
    included:
      'Annual budget records, selected major appropriations, dedicated funds, Special Education Fund utilization and reported receipts/expenditures.',
    limit:
      'The Accountability Ledger is a follow-through layer, not a duplicate of every budget line. The complete 2026 citywide summary is searchable on Projects & Budget.',
  },
  {
    id: 'project',
    label: 'Projects & procurement',
    period: 'Structured bid-result records currently cover 2024 Q3 and 2025 Q2 plus linked project evidence',
    included:
      'Approved budget, winning bidder, winning amount, bid date and later contract/implementation evidence when it can be linked to the same record.',
    limit:
      'Many awards still lack a separately linked contract, notice to proceed, implementation or completion document.',
  },
  {
    id: 'audit',
    label: 'Audit',
    period: 'Finding-level records currently span selected 2017, 2018 and 2024 audit material',
    included:
      'COA observation, recommendation, management response and later follow-up when the cited public record supports each field.',
    limit:
      'A definitive current inventory of resolved and unresolved Makati COA recommendations has not yet been normalized.',
  },
  {
    id: 'service',
    label: 'Service standards',
    period: 'Current verified city service guides',
    included:
      'Published processing-time standards from city service guides that have structured, verified details in BetterMakati.',
    limit:
      'These are published standards, not independently measured transaction performance.',
  },
  {
    id: 'commitment',
    label: 'Public commitments',
    period: 'Selected source-backed commitments with later evidence',
    included:
      'A sourced promise or target, stated deadline when available, and later evidence that supports an outcome update.',
    limit:
      'Speeches, plans, ordinances and announcements have not yet been comprehensively normalized into a citywide promise inventory.',
  },
];

export const accountabilityCoverageAreas: AccountabilityCoverageArea[] =
  coverageAreaSeed.map(area => ({
    ...area,
    recordCount: accountabilityEntries.filter(entry => entry.type === area.id).length,
  }));

export const accountabilitySourceCount = new Set(
  accountabilityEntries.flatMap(entry => entry.sources.map(source => source.url))
).size;

export const accountabilityCoverageGaps: CoverageGap[] = [
  {
    id: 'project-contract-linkage',
    title: 'Project → procurement → contract linkage is partially structured',
    description:
      'BetterMakati now structures selected bid-result records with approved budget, bidder, winning amount and bid date. Contract, notice-to-proceed, implementation and completion links remain incomplete for many projects.',
    whyItMatters:
      'A complete chain would let residents trace an appropriation through procurement, supplier, contract changes and completion evidence.',
    checkedSources: [
      {
        label: 'PhilGEPS procurement notices',
        url: budgetSources.procurement,
        publisher: 'PhilGEPS',
      },
    ],
    lastChecked: accountabilityReviewed,
  },
  {
    id: 'audit-follow-through',
    title: 'COA finding follow-through remains incomplete',
    description:
      'Selected COA findings and recommendations are now structured, including management response where the source provides it. Later implementation or resolution status is still missing for many observations.',
    whyItMatters:
      'Accountability is stronger when a finding can be followed through response, corrective action and later audit status.',
    checkedSources: [
      {
        label: 'Commission on Audit annual reports',
        url: budgetSources.audit,
        publisher: 'Commission on Audit',
      },
    ],
    lastChecked: accountabilityReviewed,
  },
  {
    id: 'public-commitments',
    title: 'Coverage of public commitments is still partial',
    description:
      'BetterMakati now tracks selected source-backed promises with targets and later evidence, but speeches, plans, ordinances and official announcements have not yet been comprehensively normalized into the commitment tracker.',
    whyItMatters:
      'Public memory should cover promises and targets consistently across administrations and policy areas, not only budgets, awards and audit findings.',
    lastChecked: accountabilityReviewed,
  },
  {
    id: 'barangay-disclosures',
    title: 'Barangay fiscal and project disclosures are not yet complete across all 23 barangays',
    description:
      'BetterMakati now carries broader barangay profiles and officials, but a complete authoritative current set of barangay budgets, procurement, projects and legislative records is still being assembled.',
    whyItMatters:
      'Accountability needs to work at barangay level as well as City Hall.',
    lastChecked: accountabilityReviewed,
  },
];

export const accountabilityStatusLabel: Record<
  AccountabilityEntry['status'],
  string
> = {
  planned: 'Planned',
  'in-progress': 'In progress',
  completed: 'Reported complete',
  reported: 'Reported',
  'source-gap': 'Source gap',
};
