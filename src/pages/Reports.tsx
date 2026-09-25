import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { reports } from '../data/reports';

export default function Reports() {
  return (
    <>
      <SEO
        title="Featured Reports & Insights"
        description="Featured BetterMakati reports and civic analysis."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Featured Reports & Insights</div>
        <Heading>Featured Reports & Insights</Heading>

        <div className="mt-5 rounded-2xl border border-primary-100 bg-white p-5">
          <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
            Related national data
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-3 text-sm font-bold">
            <a
              href="https://visualizations.bettergov.ph/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary-700 underline underline-offset-2"
            >
              National data research <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://2026-budget.bettergov.ph/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary-700 underline underline-offset-2"
            >
              2026 national budget <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {reports.map(report => (
            <Link
              key={report.slug}
              to={`/reports/${report.slug}`}
              className="block rounded-3xl border border-primary-200 bg-white p-6 transition hover:border-primary-500 hover:shadow-sm md:p-8"
            >
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                {report.date}
              </div>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-950 md:text-3xl">
                {report.headline}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 md:text-base">
                {report.subheadline}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary-700">
                Read more <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
