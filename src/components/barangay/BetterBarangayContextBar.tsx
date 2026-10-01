import { useEffect } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router';
import { barangays, findBarangay } from '../../data/barangays';
import { barangaySliceablePaths, isBarangayContextPath, useBarangayScope } from '../../hooks/useBarangayScope';

const compactEditionName = (name: string) => name.replace(/\s+/g, '');

export default function BetterBarangayContextBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { barangay: scopedBarangay, setBarangay, rememberBarangay } = useBarangayScope();

  const profileMatch = location.pathname.match(/^\/barangays\/([^/]+)$/);
  const profileBarangay = findBarangay(profileMatch?.[1]);
  const isProfile = Boolean(profileBarangay);
  const isSliceable = barangaySliceablePaths.has(location.pathname);
  const isScopedDetail = !isSliceable && isBarangayContextPath(location.pathname) && Boolean(scopedBarangay);

  useEffect(() => {
    if (profileBarangay) rememberBarangay(profileBarangay.slug);
  }, [profileBarangay?.slug]);

  if (!isProfile && !isSliceable && !isScopedDetail) return null;

  const barangay = profileBarangay || scopedBarangay;
  const value = barangay?.slug ?? '';

  const chooseBarangay = (slug: string) => {
    if (isProfile) {
      rememberBarangay(slug);
      navigate(slug ? '/barangays/' + slug : '/barangays');
      return;
    }
    setBarangay(slug);
  };

  return (
    <div className="bm-barangay-context border-t border-primary-800 text-white" role="region" aria-label={t('barangayContext.label')}>
      <div className="container flex min-h-12 items-center justify-between gap-3 px-5 py-1.5 md:px-6 lg:px-8">
        <div className="relative min-w-0 rounded-lg focus-within:ring-2 focus-within:ring-secondary-300 focus-within:ring-offset-2 focus-within:ring-offset-primary-900">
          <div className="pointer-events-none flex min-h-11 min-w-0 items-center gap-1.5">
            <span className="truncate text-base font-black tracking-tight sm:text-lg">
              <span className="text-secondary-300">Better</span>
              <span className="text-white">
                {barangay ? compactEditionName(barangay.name) : t('barangayContext.view')}
              </span>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-primary-100" aria-hidden="true" />
          </div>
          <select value={value} onChange={event => chooseBarangay(event.target.value)} aria-label={t('barangayContext.choose')} className="absolute inset-0 h-full w-full cursor-pointer opacity-0">
            <option value="">{isProfile ? t('barangayContext.allBarangays') : t('barangayContext.allMakati')}</option>
            {barangays.map(item => (
              <option key={item.slug} value={item.slug}>Better{compactEditionName(item.name)}</option>
            ))}
          </select>
        </div>

        <Link
          to={barangay ? '/barangays/' + barangay.slug : '/barangays'}
          aria-label={barangay ? t('barangayContext.openHomepage', { barangay: barangay.name }) : t('barangayContext.openDirectory')}
          className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2 text-sm font-bold text-white hover:bg-white/10 focus-visible:outline-secondary-300 sm:px-3"
        >
          <span>
            {barangay ? (
              <>
                <span className="sm:hidden">{t('barangayContext.homepage')}</span>
                <span className="hidden sm:inline">{t('barangayContext.barangayHomepage')}</span>
              </>
            ) : t('barangayContext.barangays')}
          </span>
          <ArrowRight className="h-4 w-4 text-secondary-300" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
