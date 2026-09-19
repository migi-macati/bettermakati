import {
  budgetSources,
  budgetSummary,
  developmentFundProject,
} from './budget2025';
import type { AccountabilityEntry, CoverageGap } from './civicTypes';

export const accountabilityReviewed = '19 September 2026';

export const accountabilityEntries: AccountabilityEntry[] = [
  {
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
  },
  {
    id: '2025-city-fiscal-plan-and-actuals',
    title: '2025 city fiscal plan and reported actuals',
    type: 'fiscal',
    status: 'reported',
    summary:
      'BetterMakati keeps the approved annual budget separate from later reported receipts and expenditures so plan and actual results are not conflated.',
    responsibleBodies: ['City Government of Makati'],
    period: '2025',
    plannedAmountM: budgetSummary.totalBudgetM,
    reportedAmountM: budgetSummary.actualReceiptsM,
    actualAmountM: budgetSummary.actualExpendituresM,
    relatedHref: '/projects-budget#budget',
    lastVerified: accountabilityReviewed,
    sources: [
      {
        label: 'CY 2025 Annual Budget',
        url: budgetSources.annualBudget,
        publisher: 'City Government of Makati',
        publishedOrPeriod: '2025',
      },
      {
        label: 'DBM/BLGF fiscal actuals table',
        url: budgetSources.actuals,
        publisher: 'Department of Budget and Management / BLGF',
        publishedOrPeriod: '2025 actuals',
      },
    ],
    notes: [
      'The approved budget, actual receipts and actual expenditures answer different questions and should not be treated as a single performance score.',
    ],
  },
];

export const accountabilityCoverageGaps: CoverageGap[] = [
  {
    id: 'project-contract-linkage',
    title: 'Project → procurement → contract linkage is not yet complete',
    description:
      'Public procurement sources are linked, but BetterMakati has not yet normalized award and contract records into a reliable project-by-project chain.',
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
    title: 'COA findings are not yet linked to later management action',
    description:
      'Audit reports are available as source documents, but findings, management responses and subsequent resolution status are not yet structured into longitudinal records.',
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
    id: 'barangay-disclosures',
    title: 'Current barangay disclosures are not yet complete across all 23 barangays',
    description:
      'BetterMakati has population and district profiles for all current barangays, but does not yet have a complete authoritative current set of barangay officials, budgets, projects and legislative records.',
    whyItMatters:
      'Radical accountability has to work at barangay level, not only at City Hall.',
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
