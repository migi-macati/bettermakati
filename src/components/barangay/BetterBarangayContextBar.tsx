import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { barangays, findBarangay } from '../../data/barangays';
import { useBarangayScope } from '../../hooks/useBarangayScope';

const sliceableRoutes = new Set([
  '/services',
  '/projects-budget',
  '/accountability',
  '/participate',
  '/statistics',
  '/civic-map',
]);

const compactEditionName = (name: string) => name.replace(/\s+/g, '');

export default function BetterBarangayContextBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { barangay: scopedBarangay, setBarangay } = useBarangayScope();

  const profileMatch = location.pathname.match(/^\/barangays\/([^/]+)$/);
  const profileBarangay = findBarangay(profileMatch?.[1]);
  const isProfile = Boolean(profileBarangay);
  const isSliceable = sliceableRoutes.has(location.pathname);

  if (!isProfile && !isSliceable) return null;

  const barangay = profileBarangay || scopedBarangay;
  const value = barangay?.slug ?? '';

  const chooseBarangay = (slug: string) => {
    if (isProfile) {
      navigate(slug ? '/barangays/' + slug : '/barangays');
      return;
    }
    setBarangay(slug);
  };

  return (
    <div
      className="border-t border-primary-800 bg-primary-900 text-white"
      role="region"
      aria-label="BetterBarangay view"
    >
      <div className="container flex min-h-12 items-center justify-between gap-3 px-4 py-1.5">
        <div className="relative min-w-0">
          <div className="pointer-events-none flex min-h-10 min-w-0 items-center gap-1.5">
            <span className="truncate text-base font-black tracking-tight sm:text-lg">
              <span className="text-secondary-300">Better</span>
              <span className="text-white">
                {barangay ? compactEditionName(barangay.name) : 'Barangay View'}
              </span>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-primary-100" aria-hidden="true" />
          </div>

          <select
            value={value}
            onChange={event => chooseBarangay(event.target.value)}
            aria-label="Choose BetterBarangay view"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          >
            <option value="">BetterBarangay View</option>
            {barangays.map(item => (
              <option key={item.slug} value={item.slug}>
                Better{compactEditionName(item.name)}
              </option>
            ))}
          </select>
        </div>

        <Link
          to={barangay ? '/barangays/' + barangay.slug : '/barangays'}
          className="inline-flex min-h-10 shrink-0 items-center gap-1 rounded-lg px-2 text-sm font-bold text-white hover:bg-white/10 sm:px-3"
        >
          <span>
            {barangay ? 'Barangay Homepage' : 'Barangays'}
          </span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
