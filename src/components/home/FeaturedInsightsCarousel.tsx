import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import { Link } from 'react-router';
import useCarousel from '../../hooks/useCarousel';
import { publicationReports } from '../../data/reports';
import ReportTeaser from '../reports/ReportTeaser';

export default function FeaturedInsightsCarousel() {
  const carousel = useCarousel(publicationReports.length, 7000);
  const report = publicationReports[carousel.index];

  return (
    <section
      className="border-b border-primary-100 bg-white py-8"
      aria-labelledby="featured-reports-title"
      aria-roledescription="carousel"
      {...carousel.interactions}
    >
      <div className="container px-5 md:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <h2
            id="featured-reports-title"
            className="text-xl font-extrabold tracking-tight text-gray-950 md:text-2xl"
          >
            Featured Reports & Insights
          </h2>
          <Link
            to="/reports"
            className="hidden text-sm font-bold text-primary-700 hover:text-primary-900 sm:inline-flex"
          >
            View all
          </Link>
        </div>

        <div className="mt-5">
          <ReportTeaser report={report} variant="carousel" />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <span
            className="text-sm text-gray-600"
            aria-live={carousel.rotating ? 'off' : 'polite'}
          >
            {carousel.index + 1} of {publicationReports.length}
          </span>
          <div className="flex items-center gap-2">
            {!carousel.reducedMotion && (
              <button
                type="button"
                onClick={() => carousel.setPaused(!carousel.paused)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-gray-200 px-3 text-sm font-semibold text-primary-800 hover:bg-primary-50"
              >
                {carousel.paused ? (
                  <Play className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Pause className="h-4 w-4" aria-hidden="true" />
                )}
                {carousel.paused ? 'Resume' : 'Pause'}
              </button>
            )}
            <button
              type="button"
              onClick={() => carousel.move(-1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 text-primary-800 hover:bg-primary-50"
              aria-label="Previous featured report"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => carousel.move(1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 text-primary-800 hover:bg-primary-50"
              aria-label="Next featured report"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <Link
          to="/reports"
          className="mt-4 inline-flex text-sm font-bold text-primary-700 hover:text-primary-900 sm:hidden"
        >
          View all
        </Link>
      </div>
    </section>
  );
}
