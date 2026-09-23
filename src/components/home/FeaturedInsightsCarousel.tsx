import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import { Link } from 'react-router';
import useCarousel from '../../hooks/useCarousel';
import { featuredInsights } from '../../data/reports';

export default function FeaturedInsightsCarousel() {
  const carousel = useCarousel(featuredInsights.length, 7000);
  const insight = featuredInsights[carousel.index];

  return (
    <section
      className="border-b border-primary-100 bg-white py-8"
      aria-labelledby="featured-insights-title"
      aria-roledescription="carousel"
      {...carousel.interactions}
    >
      <div className="container px-5 md:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="section-eyebrow">Featured insights</div>
            <h2
              id="featured-insights-title"
              className="text-xl font-extrabold tracking-tight text-gray-950 md:text-2xl"
            >
              What the data is saying
            </h2>
          </div>
          <Link
            to="/reports"
            className="hidden text-sm font-bold text-primary-700 hover:text-primary-900 sm:inline-flex"
          >
            All reports
          </Link>
        </div>

        <article className="mt-5 rounded-2xl border border-primary-200 bg-[#fffdf8] p-5 md:p-7">
          <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
            {insight.reportTitle}
          </div>
          <h3 className="mt-2 max-w-5xl text-2xl font-extrabold leading-tight tracking-tight text-gray-950 md:text-3xl">
            {insight.headline}
          </h3>
          <div className="mt-3 text-xs font-semibold text-gray-500">
            {insight.reportDate}
          </div>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-gray-600 md:text-base">
            {insight.subtitle}
          </p>
          <Link
            to={insight.href}
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary-700"
          >
            Read more <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </article>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <span
            className="text-sm text-gray-600"
            aria-live={carousel.rotating ? 'off' : 'polite'}
          >
            {carousel.index + 1} of {featuredInsights.length}
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
                {carousel.paused ? 'Resume insights' : 'Pause insights'}
              </button>
            )}
            <button
              type="button"
              onClick={() => carousel.move(-1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 text-primary-800 hover:bg-primary-50"
              aria-label="Previous featured insight"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => carousel.move(1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 text-primary-800 hover:bg-primary-50"
              aria-label="Next featured insight"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <Link
          to="/reports"
          className="mt-4 inline-flex text-sm font-bold text-primary-700 hover:text-primary-900 sm:hidden"
        >
          All reports
        </Link>
      </div>
    </section>
  );
}
