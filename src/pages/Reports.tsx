import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import SEO from '../components/SEO';
import ReportTeaser from '../components/reports/ReportTeaser';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { publicationReports } from '../data/reports';

export default function Reports() {
  const { t } = useTranslation();
  const leadReport = publicationReports[0];
  const moreReports = publicationReports.slice(1);

  return (
    <>
      <SEO
        title={t('evidence.reports.seoTitle')}
        description={t('evidence.reports.seoDescription')}
      />

      <Section className="bm-editorial-hero border-b border-primary-800 bg-primary-900 text-white">
        <div className="section-eyebrow !text-secondary-300">
          {t('evidence.reports.eyebrow')}
        </div>
        <Heading className="!mb-0 !text-white">
          {t('evidence.reports.title')}
        </Heading>
      </Section>

      <Section className="bm-editorial-section">
        <div className="text-xs font-black uppercase tracking-[0.1em] text-primary-700">
          {t('evidence.reports.latest')}
        </div>
        <div className="mt-4">
          <ReportTeaser report={leadReport} variant="lead" />
        </div>
      </Section>

      {moreReports.length > 0 && (
        <Section className="bm-editorial-section bm-editorial-section-muted border-t border-primary-100">
          <div className="flex items-end justify-between gap-4">
            <Heading level={2} className="!mb-0">
              {t('evidence.reports.more')}
            </Heading>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-5 xl:grid-cols-2">
            {moreReports.map(report => (
              <ReportTeaser key={report.slug} report={report} variant="card" />
            ))}
          </div>
        </Section>
      )}
      <Section className="bm-editorial-timeline border-t border-primary-100">
        <Link
          to="/calendar?topic=publications-data&view=published"
          className="inline-flex min-h-11 items-center text-sm font-bold text-primary-700 underline underline-offset-4"
        >
          {t('evidence.reports.calendarLink')}
        </Link>
      </Section>
    </>
  );
}
