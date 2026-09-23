import { ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { barangays, findBarangay } from '../../data/barangays';
import { useBarangayScope, withBarangayScope } from '../../hooks/useBarangayScope';

const compactEditionName = (name: string) => name.replace(/\s+/g, '');

export default function BarangayEditionBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { barangay: scopedBarangay, setBarangay } = useBarangayScope();
  const profileMatch = location.pathname.match(/^\/barangays\/([^/]+)$/);
  const profileSlug = profileMatch?.[1];
  const profileBarangay = findBarangay(profileSlug);
  const barangay = profileBarangay || scopedBarangay;

  if (!barangay) return null;

  const slug = barangay.slug;
  const isProfile = Boolean(profileBarangay);
  const items = [
    { label: 'Overview', href: '/barangays/' + slug, active: isProfile && (!location.hash || location.hash === '#overview') },
    { label: 'Services', href: withBarangayScope('/services', slug), active: location.pathname.startsWith('/services') },
    { label: 'Government', href: '/barangays/' + slug + '#representation', active: isProfile && location.hash === '#representation' },
    { label: 'Projects & money', href: withBarangayScope('/projects-budget', slug), active: location.pathname.startsWith('/projects-budget') },
    { label: 'Accountability', href: withBarangayScope('/accountability', slug), active: location.pathname.startsWith('/accountability') },
    { label: 'Map & reports', href: withBarangayScope('/civic-map', slug), active: location.pathname.startsWith('/civic-map') },
    { label: 'Participate', href: withBarangayScope('/participate', slug), active: location.pathname.startsWith('/participate') },
    { label: 'Statistics', href: withBarangayScope('/statistics', slug), active: location.pathname.startsWith('/statistics') },
  ];

  const switchEdition = (nextSlug: string) => {
    if (isProfile) {
      navigate(nextSlug ? '/barangays/' + nextSlug : '/barangays');
      return;
    }
    setBarangay(nextSlug);
  };

  return (
    <div className="border-t border-primary-800 bg-primary-900 text-white">
      <div className="container flex min-h-[52px] items-center gap-2 px-3 sm:px-4">
        <div className="relative shrink-0 border-r border-white/20 pr-2 sm:pr-3">
          <div className="pointer-events-none flex min-h-11 items-center gap-1.5 rounded-lg px-2">
            <span className="text-base font-black tracking-tight sm:text-lg">
              <span className="text-secondary-300">Better</span>
              <span className="text-white">{compactEditionName(barangay.name)}</span>
            </span>
            <ChevronDown className="h-4 w-4 text-primary-100" aria-hidden="true" />
          </div>
          <select
            aria-label="Switch barangay edition"
            value={slug}
            onChange={event => switchEdition(event.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          >
            <option value="">All Makati</option>
            {barangays.map(item => (
              <option key={item.slug} value={item.slug}>
                Better{compactEditionName(item.name)}
              </option>
            ))}
          </select>
        </div>

        <div
          role="navigation"
          aria-label="Barangay local navigation"
          className="min-w-0 flex-1 overflow-x-auto overscroll-x-contain"
        >
          <div className="flex min-w-max items-center gap-1 py-1">
            {items.map(item => (
              <Link
                key={item.label}
                to={item.href}
                aria-current={item.active ? 'page' : undefined}
                className={`inline-flex min-h-10 items-center whitespace-nowrap rounded-lg px-3 text-sm font-bold transition-colors ${
                  item.active
                    ? 'bg-white text-primary-900'
                    : 'text-primary-50 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
