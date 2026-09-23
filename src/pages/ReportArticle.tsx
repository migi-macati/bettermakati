import { ArrowLeft } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SharePage from '../components/ui/SharePage';
import { findReport } from '../data/reports';

export default function ReportArticle() {
  const { slug } = useParams();
  const report = findReport(slug);

  if (!report) {
    return <Navigate to="/reports" replace />;
  }

  const sourceById = new Map(report.sources.map(source => [source.id, source]));

  return (
    <>
      <SEO title={report.headline} description={report.subheadline} />

      <Section className="bg-[#fffdf8]">
        <Link
          to="/reports"
          className="inline-flex items-center gap-2 text-sm font-bold text-primary-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Featured Reports & Insights
        </Link>

        <div className="mt-6 text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
          {report.date}
        </div>

        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Heading>{report.headline}</Heading>
          <SharePage title={report.headline + ' | BetterMakati'} />
        </div>

        <p className="mt-4 max-w-4xl text-lg leading-relaxed text-gray-700 md:text-xl">
          {report.subheadline}
        </p>
      </Section>

      <Section className="bg-white">
        <article className="mx-auto max-w-3xl">
          <div className="space-y-6 text-base leading-8 text-gray-800 md:text-lg">
            {report.paragraphs.map((paragraph, index) => (
              <p key={index}>
                {paragraph.text}{' '}
                {paragraph.sourceIds.map(sourceId => {
                  const source = sourceById.get(sourceId);
                  return source ? (
                    <Link
                      key={sourceId}
                      to={source.href}
                      className="font-bold text-primary-700 underline underline-offset-2"
                      aria-label={`Source ${sourceId}: ${source.label}`}
                    >
                      [{sourceId}]
                    </Link>
                  ) : null;
                })}
              </p>
            ))}
          </div>
        </article>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="mx-auto max-w-3xl">
          <div className="section-eyebrow">Sources</div>
          <ol className="mt-5 space-y-3 text-sm leading-relaxed text-gray-700">
            {report.sources.map(source => (
              <li key={source.id}>
                <Link
                  to={source.href}
                  className="font-bold text-primary-700 underline underline-offset-2"
                >
                  [{source.id}] {source.label}
                </Link>{' '}
                — {source.note}
              </li>
            ))}
          </ol>
        </div>
      </Section>
    </>
  );
}
