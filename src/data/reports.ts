import type { FeaturedReportModule, FeaturedReportV2 } from './reportTypes';
import { validateFeaturedReportModules } from './reportModuleValidation';

const discoveredModules = import.meta.glob<FeaturedReportModule>(
  './reports/*.ts',
  { eager: true, import: 'default' }
);

export const reportModules = Object.entries(discoveredModules)
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([, reportModule]) => reportModule);

validateFeaturedReportModules(reportModules);

export const reports: FeaturedReportV2[] = reportModules.map(
  ({ report }) => report
);
export const publicationReports = [...reports].reverse();
export const reportModuleBySlug = new Map(
  reportModules.map(module => [module.report.slug, module] as const)
);

export const reportSlugAliases: Record<string, string> = {
  '2025-local-revenue': '2025-fiscal-profile',
  '2025-social-services': '2025-fiscal-profile',
};

export const resolveReportSlug = (slug?: string) =>
  slug ? (reportSlugAliases[slug] ?? slug) : undefined;

export const findReport = (slug?: string) => {
  const canonicalSlug = resolveReportSlug(slug);
  return reports.find(report => report.slug === canonicalSlug);
};
