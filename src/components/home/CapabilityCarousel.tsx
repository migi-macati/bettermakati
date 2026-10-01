import {
  ArrowRight,
  ClipboardList,
  HeartPulse,
  Landmark,
  MapPinned,
  MessageSquareWarning,
  SunMedium,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { barangays } from '../../data/barangays';
import { useBarangayScope } from '../../hooks/useBarangayScope';

const compactEditionName = (name: string) => name.replace(/\s+/g, '');

const entryPoints = [
  { key: 'urgent', href: '/hotlines', icon: HeartPulse },
  { key: 'service', href: '/services', icon: ClipboardList },
  { key: 'now', href: '/today', icon: SunMedium },
  { key: 'evidence', href: '/accountability', icon: Landmark },
  { key: 'participate', href: '/participate', icon: MessageSquareWarning },
];

export default function CapabilityCarousel() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { preferredBarangay, rememberBarangay } = useBarangayScope();

  const chooseBarangay = (slug: string) => {
    if (!slug) {
      rememberBarangay('');
      navigate('/barangays');
      return;
    }
    rememberBarangay(slug);
    navigate('/barangays/' + slug);
  };

  return (
    <aside
      className="min-w-0 rounded-3xl border border-secondary-200/70 bg-[#fffdf8] p-5 text-gray-950 shadow-[0_24px_64px_rgba(0,0,0,0.2)] md:p-5 lg:p-6"
      aria-labelledby="what-brings-you-here"
    >
      <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-primary-700">
        {t('home.capability.eyebrow')}
      </div>
      <h2
        id="what-brings-you-here"
        className="mt-1 text-2xl font-extrabold tracking-tight text-gray-950 md:text-3xl"
      >
        {t('home.capability.title')}
      </h2>

      <div className="mt-4 divide-y divide-gray-200">
        <div className="flex min-h-[76px] items-center gap-3 py-2.5 first:pt-1">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary-50 text-secondary-800">
            <MapPinned className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-extrabold leading-snug text-gray-950">
              {preferredBarangay
                ? t('home.capability.yourBarangay', { barangay: 'Better' + compactEditionName(preferredBarangay.name) })
                : t('home.capability.goBarangay')}
            </div>
            <label className="mt-1 block">
              <span className="sr-only">{t('home.capability.chooseBarangay')}</span>
              <select
                value={preferredBarangay?.slug ?? ''}
                onChange={event => chooseBarangay(event.target.value)}
                className="min-h-11 w-full rounded-lg border border-secondary-200 bg-white px-2.5 py-1.5 text-xs font-bold text-primary-900 outline-none focus:border-secondary-500 focus:ring-2 focus:ring-secondary-100"
              >
                <option value="">{t('home.capability.chooseBarangay')}</option>
                {barangays.map(barangay => (
                  <option key={barangay.slug} value={barangay.slug}>
                    Better{compactEditionName(barangay.name)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-secondary-700" aria-hidden="true" />
        </div>

        {entryPoints.map(item => {
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              to={item.href}
              className="group flex min-h-[64px] items-center gap-3 py-2.5 last:pb-1"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-700 transition group-hover:bg-primary-100">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-extrabold leading-snug text-gray-950">
                  {t(`home.capability.entries.${item.key}.title`)}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-gray-600">
                  {t(`home.capability.entries.${item.key}.description`)}
                </span>
              </span>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-secondary-700 transition group-hover:translate-x-0.5 group-hover:text-secondary-600"
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
