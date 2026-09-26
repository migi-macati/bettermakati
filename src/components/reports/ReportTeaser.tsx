import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import type { FeaturedReportV2 } from '../../data/reportTypes';

export type ReportTeaserVariant = 'lead' | 'card' | 'carousel';

export default function ReportTeaser({
  report,
  variant = 'card',
}: {
  report: FeaturedReportV2;
  variant?: ReportTeaserVariant;
}) {
  if (variant === 'lead') {
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

  if (variant === 'carousel') {
    return (
      <article className="rounded-2xl border border-primary-200 bg-[#fffdf8] p-5 md:p-7">
        <div className="text-xs font-bold uppercase tracking-[0.1em] text-primary-700">
          {report.date}
        </div>
        <h3 className="mt-2 max-w-5xl text-2xl font-black leading-tight tracking-tight text-gray-950 md:text-3xl">
          {report.headline}
        </h3>
        <p className="mt-3 max-w-4xl text-sm leading-relaxed text-gray-600 md:text-base">
          {report.subheadline}
        </p>
        <Link
          to={`/reports/${report.slug}`}
          className="group mt-5 inline-flex items-center gap-2 text-sm font-black text-primary-700"
        >
          Read more
          <ArrowRight
            className="h-4 w-4 transition group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </article>
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
