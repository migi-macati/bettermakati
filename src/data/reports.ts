export interface ReportCard {
  id: string;
  title: string;
  date: string;
  headline: string;
  subtitle: string;
  href: string;
}

export const reports: ReportCard[] = [
  {
    id: 'makati-overview',
    title: 'Makati Overview',
    date: '23 September 2026',
    headline: 'Four signals from Makati’s latest city data',
    subtitle:
      'A cited overview of the city’s current fiscal, spending and barangay data.',
    href: '/reports/makati-overview',
  },
];

export const makatiOverviewReport = reports[0];
