export interface FeaturedInsight {
  id: string;
  reportTitle: string;
  reportDate: string;
  headline: string;
  subtitle: string;
  href: string;
}

export const makatiOverviewReport = {
  title: 'Makati Overview',
  date: '23 September 2026',
  href: '/reports/makati-overview',
  subtitle:
    'Four material signals from BetterMakati’s current fiscal, spending and barangay data, with an internal evidence trail for every finding.',
};

export const featuredInsights: FeaturedInsight[] = [
  {
    id: 'budget-growth',
    reportTitle: makatiOverviewReport.title,
    reportDate: makatiOverviewReport.date,
    headline:
      'Nearly three-quarters of the ₱2B increase in the 2026 budget plan comes from higher operating expenses.',
    subtitle:
      'The proposed budget rises from ₱19B to ₱21B. Maintenance and Other Operating Expenses account for about ₱1.49B of that increase; this is budget authority, not actual spending.',
    href: '/reports/makati-overview#budget-growth',
  },
  {
    id: 'local-revenue',
    reportTitle: makatiOverviewReport.title,
    reportDate: makatiOverviewReport.date,
    headline:
      '93.5% of Makati’s reported 2025 receipts came from local sources.',
    subtitle:
      'Taxes, fees, charges and local non-tax revenue accounted for ₱23.05B of ₱24.66B in reported receipts, showing how strongly the city’s fiscal base depends on locally generated revenue.',
    href: '/reports/makati-overview#local-revenue',
  },
  {
    id: 'social-services',
    reportTitle: makatiOverviewReport.title,
    reportDate: makatiOverviewReport.date,
    headline:
      'More than half of reported 2025 city spending was classified as social services.',
    subtitle:
      'Social services accounted for ₱12.31B, or 55.2% of reported expenditure by function, covering health, education, welfare and related services.',
    href: '/reports/makati-overview#social-services',
  },
  {
    id: 'population-concentration',
    reportTitle: makatiOverviewReport.title,
    reportDate: makatiOverviewReport.date,
    headline:
      'Three barangays account for 37.6% of Makati’s 2024 population.',
    subtitle:
      'Pio Del Pilar, Bel-Air and Guadalupe Nuevo together had 116,522 residents out of the city total of 309,770, showing how unevenly population is distributed across 23 barangays.',
    href: '/reports/makati-overview#population-concentration',
  },
];
