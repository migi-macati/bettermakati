import SEO from '../components/SEO';
import ReportTeaser from '../components/reports/ReportTeaser';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { publicationReports } from '../data/reports';
import CivicDomainTimelinePreview from '../components/civic/CivicDomainTimelinePreview';

export default function Reports() {
  const leadReport = publicationReports[0];
  const moreReports = publicationReports.slice(1);

  return (
    <>
      <SEO
        title="Featured Reports & Insights"
        description="BetterMakati reports and civic analysis built from Makati statistics, budgets and public records."
      />

      <Section className="bm-editorial-hero border-b border-primary-800 bg-primary-900 text-white">
        <div className="section-eyebrow !text-secondary-300">
          Civic analysis
        </div>
        <Heading className="!mb-0 !text-white">
          Featured Reports & Insights
        </Heading>
      </Section>

      <Section className="bm-editorial-section">
        <div className="text-xs font-black uppercase tracking-[0.1em] text-primary-700">
          Latest
        </div>
        <div className="mt-4">
          <ReportTeaser report={leadReport} variant="lead" />
        </div>
      </Section>

      <CivicDomainTimelinePreview
        owner="reports"
        calendarTopic="publications-data"
        heading="Report releases"
        description="BetterMakati report publication dates also appear in Recently Published, separate from the periods covered by their source data."
        className="bm-editorial-timeline"
      />

      {moreReports.length > 0 && (
        <Section className="bm-editorial-section bm-editorial-section-muted border-t border-primary-100">
          <div className="flex items-end justify-between gap-4">
            <Heading level={2} className="!mb-0">
              More reports
            </Heading>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {moreReports.map(report => (
              <ReportTeaser key={report.slug} report={report} variant="card" />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
