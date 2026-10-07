import {
  actualSpendingByFunction,
  budgetByType,
  budgetByType2026,
  budgetByTypeCurrentEstimate2025,
  budgetCurrentEstimate2025,
  budgetSources,
  budgetSummary,
  budgetSummary2026,
  localRevenueBreakdown,
  revenueSources,
} from './budget2025';
import {
  barangays,
  currentMakatiPopulation2024,
  psaBarangaySource,
} from './barangays';
import {
  cityIndicatorById,
  cityIndicatorObservations,
  cityIndicatorSources,
} from './cityIndicators';
import {
  integrityAuditActions,
  integrityAuditFindings,
  integrityAuditResolutionTrails,
  integrityAuditSourceOnlyRecords,
  integrityAuditSources,
} from './integrityAuditTrails';
import type { ReportSourceV2 } from './reportTypes';

export const reportPublishedOn = '26 September 2026';
export const reviewedOn = reportPublishedOn;

export const moneyB = (millions: number) =>
  '₱' + (millions / 1000).toFixed(2).replace(/\.00$/, '') + 'B';

export const moneyM = (millions: number) =>
  '₱' +
  millions.toLocaleString('en-PH', {
    minimumFractionDigits: Number.isInteger(millions) ? 0 : 2,
    maximumFractionDigits: 3,
  }) +
  'M';

export const percent = (value: number) => value.toFixed(1) + '%';

export const pctChange = (from: number, to: number) =>
  ((to - from) / from) * 100;

export const adoptedMooe =
  budgetByType.find(item =>
    item.label.startsWith('Maintenance & Other Operating')
  )?.amountM ?? 0;
export const proposedMooe =
  budgetByType2026.find(item =>
    item.label.startsWith('Maintenance & Other Operating')
  )?.amountM ?? 0;
export const currentEstimateMooe =
  budgetByTypeCurrentEstimate2025.find(item =>
    item.label.startsWith('Maintenance & Other Operating')
  )?.amountM ?? 0;

export const adoptedIncreaseM =
  budgetSummary2026.totalBudgetM - budgetSummary.totalBudgetM;
export const mooeIncreaseM = proposedMooe - adoptedMooe;
export const mooeShareOfIncrease =
  adoptedIncreaseM === 0 ? 0 : (mooeIncreaseM / adoptedIncreaseM) * 100;
export const proposedVsCurrentEstimate = pctChange(
  budgetCurrentEstimate2025.totalAppropriationM,
  budgetSummary2026.totalBudgetM
);

export const budgetComponentRows = [
  {
    component: 'Personal Services',
    adopted2025:
      budgetByType.find(item => item.label === 'Personal Services')?.amountM ??
      0,
    currentEstimate2025:
      budgetByTypeCurrentEstimate2025.find(
        item => item.label === 'Personal Services'
      )?.amountM ?? 0,
    proposed2026:
      budgetByType2026.find(item => item.label === 'Personal Services')
        ?.amountM ?? 0,
  },
  {
    component: 'Maintenance & Other Operating Expenses',
    adopted2025: adoptedMooe,
    currentEstimate2025: currentEstimateMooe,
    proposed2026: proposedMooe,
  },
  {
    component: 'Capital Outlay',
    adopted2025:
      budgetByType.find(item => item.label === 'Capital Outlay')?.amountM ?? 0,
    currentEstimate2025:
      budgetByTypeCurrentEstimate2025.find(
        item => item.label === 'Capital Outlay'
      )?.amountM ?? 0,
    proposed2026:
      budgetByType2026.find(item => item.label === 'Capital Outlay')?.amountM ??
      0,
  },
  {
    component: 'Special Purpose Appropriations',
    adopted2025:
      budgetByType.find(item => item.label === 'Special Purpose Appropriations')
        ?.amountM ?? 0,
    currentEstimate2025:
      budgetByTypeCurrentEstimate2025.find(
        item => item.label === 'Special Purpose Appropriations'
      )?.amountM ?? 0,
    proposed2026:
      budgetByType2026.find(
        item => item.label === 'Special Purpose Appropriations'
      )?.amountM ?? 0,
  },
];

export const localReceipts = revenueSources.find(
  item => item.label === 'Local sources'
);
export const externalReceipts = revenueSources.find(
  item => item.label === 'External sources'
);
export const nonIncomeReceipts = revenueSources.find(
  item => item.label === 'Non-income receipts'
);
export const businessTax = localRevenueBreakdown.find(
  item => item.label === 'Business tax'
);
export const basicRPT = localRevenueBreakdown.find(
  item => item.label === 'Basic real property tax'
);
export const sefTax = localRevenueBreakdown.find(
  item => item.label === 'Special Education Fund tax'
);
export const topThreeLocalRevenueM =
  (businessTax?.amountM ?? 0) +
  (basicRPT?.amountM ?? 0) +
  (sefTax?.amountM ?? 0);
export const topThreeLocalRevenueShare = localReceipts?.amountM
  ? (topThreeLocalRevenueM / localReceipts.amountM) * 100
  : 0;
export const socialServices = actualSpendingByFunction.find(
  item => item.label === 'Social Services'
);

export const sortedBarangays = [...barangays].sort(
  (a, b) => b.population2024 - a.population2024
);
export const topThreeBarangays = sortedBarangays.slice(0, 3);
export const topThreePopulation = topThreeBarangays.reduce(
  (sum, barangay) => sum + barangay.population2024,
  0
);
export const topThreePopulationShare =
  (topThreePopulation / currentMakatiPopulation2024) * 100;
export const smallestBarangay = sortedBarangays.at(-1);
export const largestBarangay = sortedBarangays[0];
export const largestToSmallestRatio =
  largestBarangay && smallestBarangay
    ? largestBarangay.population2024 / smallestBarangay.population2024
    : 0;
export const barangaysUnder6000 = sortedBarangays.filter(
  barangay => barangay.population2024 < 6000
);

export const populationIndicator = cityIndicatorById.get('population-total');
export const populationGrowthIndicator = cityIndicatorById.get(
  'population-growth-rate'
);
export const populationTrend = cityIndicatorObservations('population-total');
export const populationGrowthTrend = cityIndicatorObservations(
  'population-growth-rate'
);
export const populationGrowthSource =
  cityIndicatorSources['psa-openstat-population-growth-2024'];
export const currentBoundarySource =
  cityIndicatorSources['psa-psgc-makati-current'];

if (
  !populationIndicator ||
  !populationGrowthIndicator ||
  !populationGrowthSource ||
  !currentBoundarySource
) {
  throw new Error(
    'Population flagship report requires canonical Wave 4 indicator metadata.'
  );
}

export const numericObservation = (
  value: number | string | boolean | undefined,
  label: string
) => {
  if (typeof value !== 'number') {
    throw new Error(
      'Population flagship report requires numeric ' + label + '.'
    );
  }
  return value;
};

export const population2010 = numericObservation(
  populationTrend[0]?.value,
  '2010 population'
);
export const population2015 = numericObservation(
  populationTrend[1]?.value,
  '2015 population'
);
export const population2020 = numericObservation(
  populationTrend[2]?.value,
  '2020 population'
);
export const population2024 = numericObservation(
  populationTrend[3]?.value,
  '2024 population'
);
export const growth2010to2015 = numericObservation(
  populationGrowthTrend[0]?.value,
  '2010–2015 growth rate'
);
export const growth2015to2020 = numericObservation(
  populationGrowthTrend[1]?.value,
  '2015–2020 growth rate'
);
export const growth2020to2024 = numericObservation(
  populationGrowthTrend[2]?.value,
  '2020–2024 growth rate'
);
export const populationAdded2020to2024 = population2024 - population2020;
export const growthAccelerationPp = growth2020to2024 - growth2015to2020;

export const auditSourceById = new Map(
  integrityAuditSources.map(source => [source.id, source] as const)
);

export const auditRegistryToReportSourceId: Record<string, string> = {
  'coa-annual-audit-reports': '3',
  'gma-2018-development-fund-finding': '4',
  'gma-2018-development-fund-city-response': '5',
  'coa-makati-2018-audit-archive': '6',
  'makati-2018-unliquidated-cash-advances': '7',
  'makati-deped-sef-q4-2024': '8',
  'coa-makati-sef-compliance-2024': '9',
};

export const auditReportSourceIds = (registryIds: string[]) => {
  const mapped = registryIds
    .map(id => auditRegistryToReportSourceId[id])
    .filter((id): id is string => Boolean(id));
  return ['1', ...new Set(mapped)] as [string, ...string[]];
};

export const auditFindingsWithTrails = integrityAuditFindings.map(finding => {
  const trail = integrityAuditResolutionTrails.find(
    candidate => candidate.findingId === finding.id
  );
  if (!trail) {
    throw new Error(
      'Records flagship requires an audit trail for ' + finding.id
    );
  }
  const actions = integrityAuditActions.filter(
    action => action.findingId === finding.id
  );
  return { finding, trail, actions };
});

if (
  auditFindingsWithTrails.length !== 3 ||
  !auditFindingsWithTrails.every(
    item => item.trail.resolution.status === 'unresolved'
  )
) {
  throw new Error(
    'Records flagship expects exactly three finding-level audit trails without item-specific closure.'
  );
}

export const auditDirectSource = (registryId: string) => {
  const source = auditSourceById.get(registryId);
  if (!source) {
    throw new Error('Records flagship source missing: ' + registryId);
  }
  const id = auditRegistryToReportSourceId[registryId];
  if (!id) {
    throw new Error('Records flagship source mapping missing: ' + registryId);
  }
  return {
    id,
    label: source.label,
    href: source.url,
    sourceKind:
      source.sourceClass === 'secondary-reporting'
        ? ('secondary' as const)
        : ('official-external' as const),
    publisher: source.publisher,
    publishedOrPeriod: source.publishedOrPeriod,
    checkedOn: reviewedOn,
  };
};

export const auditFollowUpSourceIds = (findingId: string) =>
  auditReportSourceIds(
    integrityAuditActions
      .filter(action => action.findingId === findingId)
      .flatMap(action => action.sourceIds)
  );

export const auditFindingSourceIds = (findingId: string) => {
  const finding = integrityAuditFindings.find(item => item.id === findingId);
  if (!finding) {
    throw new Error('Records flagship finding missing: ' + findingId);
  }
  return auditReportSourceIds(finding.sourceIds);
};

export const recordsFlagshipSources: [ReportSourceV2, ...ReportSourceV2[]] = [
  {
    id: '1',
    label: 'Integrity — audit finding trails',
    href: '/integrity#audits',
    sourceKind: 'canonical-internal',
    publisher: 'BetterMakati',
    note: 'Canonical finding, action-evidence and resolution-trail records.',
    checkedOn: reviewedOn,
  },
  {
    id: '2',
    label: 'Accountability — audit ledger',
    href: '/accountability?type=audit',
    sourceKind: 'canonical-internal',
    publisher: 'BetterMakati',
    note: 'Underlying canonical Accountability entries from which finding-level records are derived.',
    checkedOn: reviewedOn,
  },
  ...[
    'coa-annual-audit-reports',
    'gma-2018-development-fund-finding',
    'gma-2018-development-fund-city-response',
    'coa-makati-2018-audit-archive',
    'makati-2018-unliquidated-cash-advances',
    'makati-deped-sef-q4-2024',
    'coa-makati-sef-compliance-2024',
  ].map(auditDirectSource),
];

export {
  actualSpendingByFunction,
  budgetByType,
  budgetByType2026,
  budgetByTypeCurrentEstimate2025,
  budgetCurrentEstimate2025,
  budgetSources,
  budgetSummary,
  budgetSummary2026,
  localRevenueBreakdown,
  revenueSources,
  barangays,
  currentMakatiPopulation2024,
  psaBarangaySource,
  cityIndicatorById,
  cityIndicatorObservations,
  cityIndicatorSources,
  integrityAuditActions,
  integrityAuditFindings,
  integrityAuditResolutionTrails,
  integrityAuditSourceOnlyRecords,
  integrityAuditSources,
};
