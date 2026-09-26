import { BarChart3, FileText, Landmark, MapPin } from 'lucide-react';
import { Link } from 'react-router';
import ServiceSearch from '../home/ServiceSearch';

export default function Hero() {
  return (
    <section className="overflow-visible border-b border-primary-900 bg-primary-800 text-white">
      <div className="container px-5 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20">
        <div className="max-w-4xl">
          <div className="mb-3 text-xs font-extrabold uppercase tracking-[0.12em] text-secondary-400 md:text-sm">
            Makati City · Civic Guide
          </div>

          <h1 className="max-w-4xl text-5xl font-extrabold leading-[0.98] tracking-tight text-white md:text-6xl lg:text-7xl">
            Let&apos;s make Makati{' '}
            <span className="text-secondary-500">Better!</span>
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-primary-50 md:text-xl">
            Find services, explore places and barangays, check public records and
            projects, and take part in city life.
          </p>

          <div className="mt-8 max-w-3xl">
            <ServiceSearch
              scope="site"
              title="What can we help you find?"
              placeholder="Try Yellow Card, Poblacion, business permit, budget..."
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm md:text-base">
            <Link
              to="/services"
              className="hero-principle font-semibold text-white transition hover:text-secondary-300"
            >
              <Landmark className="h-4 w-4 text-secondary-400" aria-hidden="true" />
              Find a service
            </Link>
            <Link
              to="/barangays"
              className="hero-principle font-semibold text-white transition hover:text-secondary-300"
            >
              <MapPin className="h-4 w-4 text-secondary-400" aria-hidden="true" />
              Explore barangays
            </Link>
            <Link
              to="/projects-budget"
              className="hero-principle font-semibold text-white transition hover:text-secondary-300"
            >
              <FileText className="h-4 w-4 text-secondary-400" aria-hidden="true" />
              Budgets &amp; projects
            </Link>
            <Link
              to="/statistics"
              className="hero-principle font-semibold text-white transition hover:text-secondary-300"
            >
              <BarChart3 className="h-4 w-4 text-secondary-400" aria-hidden="true" />
              City statistics
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
