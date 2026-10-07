import { reportModuleBySlug } from './reports';
import type { FeaturedReportV2, LocalizedReportCopy } from './reportTypes';

export const localizedReportCopy = (
  report: FeaturedReportV2,
  language?: string
): LocalizedReportCopy => {
  const translated = language?.toLowerCase().startsWith('fil')
    ? reportModuleBySlug.get(report.slug)?.fil
    : undefined;

  return (
    translated ?? {
      headline: report.headline,
      subheadline: report.subheadline,
      synthesis: report.synthesis,
      sections: report.sections,
      methodology: report.methodology,
    }
  );
};
