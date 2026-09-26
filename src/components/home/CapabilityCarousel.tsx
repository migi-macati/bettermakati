import {
  ArrowRight,
  Building2,
  ClipboardList,
  Landmark,
  MapPinned,
  MessageSquareWarning,
  Navigation,
} from 'lucide-react';
import { Link } from 'react-router';

const entryPoints = [
  {
    title: 'Get a service',
    description: 'Permits, IDs, health, education, property and other government services.',
    href: '/services',
    icon: ClipboardList,
  },
  {
    title: 'Explore your barangay',
    description: 'Local officials, contacts, services, places, projects, statistics and records.',
    href: '/barangays',
    icon: MapPinned,
  },
  {
    title: 'Find a place',
    description: 'Parks, clinics, heritage sites, cinemas, government offices and other places.',
    href: '/civic-map',
    icon: Building2,
  },
  {
    title: 'Check government & public records',
    description: 'Budgets, projects, legislation, procurement, audit records and source documents.',
    href: '/records',
    icon: Landmark,
  },
  {
    title: 'Report a local issue',
    description: 'Check an existing place or issue, then add a localized report when needed.',
    href: '/civic-map',
    icon: MessageSquareWarning,
  },
  {
    title: 'Visit or get around Makati',
    description: 'Transport, parking, events, food, heritage and places to go.',
    href: '/visit',
    icon: Navigation,
  },
];

export default function CapabilityCarousel() {
  return (
    <section
      className="border-b border-primary-100 bg-[#fffdf8] py-10"
      aria-labelledby="what-brings-you-here"
    >
      <div className="container px-5 md:px-6 lg:px-8">
        <div className="section-eyebrow">Start here</div>
        <h2
          id="what-brings-you-here"
          className="text-3xl font-extrabold tracking-tight text-gray-950 md:text-4xl"
        >
          What brings you here?
        </h2>

        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {entryPoints.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.href}
                className="group rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-400 hover:shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-700 transition group-hover:bg-primary-100">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-extrabold leading-snug text-gray-950">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      {item.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                      Open <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
