import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { reports } from '../data/reports';
import type { FeaturedReportV2 } from '../data/reportTypes';

function ReportCard({
  report,
  lead = false,
}: {
  report: FeaturedReportV2;
  lead?: boolean;
}) {
  if (lead) {
    return (
      <Link
        to={`/reports/${report.slug}`}
        className="group block overflow-hidden rounded-3xl border border-primary-700 bg-primary-900 text-white transition hover:border-secondary-400 hover:shadow-lg"
      >
        <article className="grid gap-8 p-6 md:p-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.75fr)] lg:items-end lg:p-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.1em] text-secondary-300">
              {report.date}
            </div>
            <h2 className="mt-3 max-w-4xl text-3xl font-black leading-tight tracking-tight text-white md:text-4xl lg:text-5xl">
              {report.headline}
            </h2>
          </div>

          <div>
            <p className="text-base leading-relaxed text-primary-50 md:text-lg">
              {report.subheadline}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-secondary-300">
              Read more
              <ArrowRight
                className="h-4 w-4 transition group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link
      to={`/reports/${report.slug}`}
      className="group block h-full rounded-3xl border border-gray-200 bg-white p-6 transition hover:border-primary-400 hover:shadow-md md:p-7"
    >
      <article className="flex h-full flex-col">
        <div className="text-xs font-bold uppercase tracking-[0.1em] text-primary-700">
          {report.date}
        </div>
        <h2 className="mt-3 text-2xl font-black leading-tight tracking-tight text-gray-950 md:text-3xl">
          {report.headline}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-gray-600 md:text-base">
          {report.subheadline}
        </p>
        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-black text-primary-700">
          Read more
          <ArrowRight
            className="h-4 w-4 transition group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </article>
    </Link>
  );
}

export default function Reports() {
  const publicationOrder = [...reports].reverse();
  const leadReport = publicationOrder[0];
  const moreReports = publicationOrder.slice(1);

  return (
    <>
      <SEO
        title="Featured Reports & Insights"
        description="BetterMakati reports and civic analysis built from Makati statistics, budgets and public records."
      />

      <Section className="border-b border-primary-800 bg-primary-900 text-white">
        <div className="section-eyebrow !text-secondary-300">
          Reports & Insights
        </div>
        <Heading className="!mb-0 !text-white">
          Featured Reports & Insights
        </Heading>
      </Section>

      <Section className="bg-[#fffdf8]">
        <div className="text-xs font-black uppercase tracking-[0.1em] text-primary-700">
          Latest
        </div>
        <div className="mt-4">
          <ReportCard report={leadReport} lead />
        </div>
      </Section>

      {moreReports.length > 0 && (
        <Section className="border-t border-primary-100 bg-white">
          <div className="flex items-end justify-between gap-4">
            <Heading level={2} className="!mb-0">
              More reports
            </Heading>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {moreReports.map(report => (
              <ReportCard key={report.slug} report={report} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
