import emboReportModule from './reports/06-embo-makati-taguig-transition';

interface ReportHistoryConnection {
  reportSlug: string;
  eventIds: readonly string[];
  labels: {
    en: string;
    fil: string;
  };
}

const reportHistoryConnections: readonly ReportHistoryConnection[] = [
  {
    reportSlug: emboReportModule.report.slug,
    eventIds: [
      'sc-boundary-decision',
      'sc-boundary-finality-2022',
      'boundary-transition-2023',
      'embo-schools-transition-2024',
      'embo-electoral-districts-2024',
      'embo-facilities-injunction-2025',
    ],
    labels: {
      en: emboReportModule.report.headline,
      fil: emboReportModule.fil?.headline ?? emboReportModule.report.headline,
    },
  },
];

export const reportsForHistoryEvent = (eventId: string, language?: string) =>
  reportHistoryConnections
    .filter(connection => connection.eventIds.includes(eventId))
    .map(connection => ({
      id: connection.reportSlug,
      label: language?.startsWith('fil')
        ? connection.labels.fil
        : connection.labels.en,
      href: '/reports/' + connection.reportSlug,
    }));
