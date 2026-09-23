import { ArrowRight } from 'lucide-react';
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
