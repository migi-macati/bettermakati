import { Link } from 'react-router';
import ServiceSearch from '../home/ServiceSearch';

const popularStarts = [
  { label: 'Business permit', href: '/services/business/new-business-permit' },
  { label: 'Yellow Card', href: '/services/health-services/makati-health-plus' },
  { label: 'Cedula', href: '/services/guide/community-tax-certificate' },
  { label: 'Find your barangay', href: '/barangays' },
];

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

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-primary-50">
            <span className="font-medium text-primary-100">Start with:</span>
            {popularStarts.map(item => (
              <Link
                key={item.label}
                to={item.href}
                className="min-h-11 content-center font-semibold underline decoration-white/40 underline-offset-4 transition hover:text-secondary-300 hover:decoration-secondary-300"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
