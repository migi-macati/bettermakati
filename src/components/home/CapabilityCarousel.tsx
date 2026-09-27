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
    description: 'Permits, IDs, health, education and other government services.',
    href: '/services',
    icon: ClipboardList,
  },
  {
    title: 'Explore your barangay',
    description: 'Officials, contacts, services, places, projects and local records.',
    href: '/barangays',
    icon: MapPinned,
  },
  {
    title: 'Find a place',
    description: 'Parks, clinics, heritage sites, cinemas and government offices.',
    href: '/civic-map',
    icon: Building2,
  },
  {
    title: 'Check government & public records',
    description: 'Budgets, projects, legislation, procurement and audit records.',
    href: '/records',
    icon: Landmark,
  },
  {
    title: 'Report a local issue',
    description: 'Check a place or issue, then add a localized report when needed.',
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
    <aside
      className="min-w-0 rounded-3xl border border-white/20 bg-[#fffdf8] p-5 text-gray-950 shadow-[0_22px_60px_rgba(0,0,0,0.18)] md:p-6"
      aria-labelledby="what-brings-you-here"
    >
      <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-primary-700">
        Start here
      </div>
      <h2
        id="what-brings-you-here"
        className="mt-1 text-2xl font-extrabold tracking-tight text-gray-950 md:text-3xl"
      >
        What brings you here?
      </h2>

      <div className="mt-4 divide-y divide-gray-200">
        {entryPoints.map(item => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              to={item.href}
              className="group flex min-h-[72px] items-center gap-3 py-3 first:pt-1 last:pb-1"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-700 transition group-hover:bg-primary-100">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-extrabold leading-snug text-gray-950">
                  {item.title}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-gray-600">
                  {item.description}
                </span>
              </span>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-primary-600 transition group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
