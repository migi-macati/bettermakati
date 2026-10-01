import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  Store,
  HeartPulse,
  GraduationCap,
  Home as HomeIcon,
  Compass,
  Church,
  Bus,
  Film,
  BarChart3,
  ClipboardCheck,
  Landmark,
} from 'lucide-react';
import Hero from '../components/sections/Hero';
import FeaturedInsightsCarousel from '../components/home/FeaturedInsightsCarousel';
import PhotoCarousel from '../components/ui/PhotoCarousel';
import SEO from '../components/SEO';
import { homeImageSet } from '../data/cityImages';

const quickServices = [
  {
    key: 'business',
    href: '/services/business',
    icon: Store,
  },
  {
    key: 'health',
    href: '/services/health-services',
    icon: HeartPulse,
  },
  {
    key: 'education',
    href: '/services/education',
    icon: GraduationCap,
  },
  {
    key: 'property',
    href: '/services/housing-land-use',
    icon: HomeIcon,
  },
];

const visitPaths = [
  {
    key: 'explore',
    href: '/visit',
    icon: Compass,
  },
  {
    key: 'mobility',
    href: '/mobility',
    icon: Bus,
  },
  {
    key: 'districts',
    href: '/estates',
    icon: Compass,
  },
  {
    key: 'heritage',
    href: '/heritage',
    icon: Church,
  },
];

const visitShortcuts = [
  { key: 'cinemas', href: '/cinemas', icon: Film },
  { key: 'liveDiscovery', href: '/visit#live-discovery', icon: Compass },
];

const publicActionPaths = [
  {
    key: 'accountability',
    href: '/accountability',
    icon: ClipboardCheck,
  },
  {
    key: 'projectsBudget',
    href: '/projects-budget',
    icon: BarChart3,
  },
  {
    key: 'records',
    href: '/records',
    icon: Landmark,
  },
];

const stats = [
  {
    value: '309,770',
    key: 'population',
    source: '2024 POPCEN',
    href: 'https://psa.gov.ph/classification/psgc/barangays/1380300000',
  },
  {
    value: '23',
    key: 'barangays',
    source: 'PSA PSGC',
    href: 'https://psa.gov.ph/classification/psgc/barangays/1380300000',
  },
  {
    value: '1st',
    key: 'incomeClass',
    source: 'PSA PSGC',
    href: 'https://psa.gov.ph/classification/psgc/barangays/1380300000',
  },
  {
    value: '55,572',
    key: 'pioDelPilar',
    sourceKey: 'largestBarangaySource',
    href: 'https://psa.gov.ph/classification/psgc/barangays/1380300000',
  },
];

const Home: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEO
        title={t('home.page.seoTitle')}
        description={t('home.page.seoDescription')}
        keywords={t('home.page.seoKeywords')}
      />

      <Hero />

      <section className="border-b border-primary-100 bg-[#fffdf8] py-5 md:py-7">
        <div className="container px-5 md:px-6 lg:px-8">
          <PhotoCarousel
            images={homeImageSet}
            title={t('home.page.aroundMakati')}
            compact
            priority
            autoRotate
            className="mx-auto max-w-6xl"
          />
        </div>
      </section>

      <section className="bm-home-section bg-[#fffdf8]">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="section-eyebrow">{t('home.page.servicesEyebrow')}</div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-7">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-950">
              {t('home.page.commonServices')}
            </h2>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-700 hover:text-primary-900"
            >
              {t('home.page.viewAllServices')} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickServices.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.key}
                  to={item.href}
                  className="home-service-card bm-home-card"
                >
                  <div className="home-service-card-icon">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-950">{t(`home.page.quickServices.${item.key}.label`)}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {t(`home.page.quickServices.${item.key}.description`)}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-primary-600 ml-auto shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bm-home-section bm-home-band-dark text-white border-b border-primary-900">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="section-eyebrow !text-white/80">
            {t('home.page.publicActionEyebrow')}
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {t('home.page.publicActionTitle')}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-primary-100 md:text-base">
                {t('home.page.publicActionDescription')}
              </p>
            </div>
          </div>
          <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-4">
            {publicActionPaths.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.key}
                  to={item.href}
                  className="bm-home-dark-card"
                >
                  <Icon className="h-6 w-6 text-secondary-500" />
                  <h3 className="mt-4 font-extrabold text-white">
                    {t(`home.page.publicAction.${item.key}.label`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-primary-100">
                    {t(`home.page.publicAction.${item.key}.description`)}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-white">
                    {t('home.page.open')} <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bm-home-section bg-white border-t border-gray-100">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="flex flex-col gap-5 rounded-2xl border border-primary-100 bg-[#fffdf8] p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <div className="section-eyebrow">{t('home.page.participationEyebrow')}</div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-950">
                {t('home.page.participationTitle')}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
                {t('home.page.participationDescription')}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
                <Link to="/get-involved" className="text-primary-700 hover:text-primary-900">
                  {t('home.page.improve')}
                </Link>
                <Link to="/community-tools" className="text-primary-700 hover:text-primary-900">
                  {t('home.page.communityTools')}
                </Link>
              </div>
            </div>
            <Link to="/participate" className="brand-btn-primary shrink-0">
              {t('home.page.participate')} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bm-home-section bg-white border-y border-gray-100">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="section-eyebrow">{t('home.page.exploreEyebrow')}</div>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-7">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-950">
                {t('home.page.exploreTitle')}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
                {t('home.page.exploreDescription')}
              </p>
            </div>
            <Link
              to="/visit"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-700 hover:text-primary-900"
            >
              {t('home.page.explore')} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {visitPaths.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.key}
                  to={item.href}
                  className="civic-card bm-home-card !min-h-0"
                >
                  <Icon className="h-6 w-6 text-primary-700" />
                  <h3 className="font-bold text-gray-950 mt-4">{t(`home.page.quickServices.${item.key}.label`)}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {t(`home.page.visit.${item.key}.description`)}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 mt-4">
                    {t('home.page.open')} <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {visitShortcuts.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.key}
                  to={item.href}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-primary-800 hover:border-primary-300 hover:bg-primary-50"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {t(`home.page.shortcuts.${item.key}`)}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <FeaturedInsightsCarousel />

      <section className="bm-home-section bm-home-band-muted border-y border-primary-100/70">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="section-eyebrow">{t('home.page.glance')}</div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-5 xl:grid-cols-4">
            {stats.map(stat => (
              <a
                key={stat.key}
                href={stat.href}
                target="_blank"
                rel="noreferrer"
                className="stat-card bm-home-card hover:border-primary-300 transition"
              >
                <div className="text-2xl md:text-3xl font-extrabold text-primary-800">
                  {stat.value}
                </div>
                <div className="font-semibold text-gray-900 mt-1">
                  {stat.key === 'pioDelPilar' ? 'Pio Del Pilar' : t(`home.page.stats.${stat.key}`)}
                </div>
                <div className="text-xs text-gray-500 mt-1">{'sourceKey' in stat ? t(`home.page.stats.${stat.sourceKey}`) : stat.source}</div>
              </a>
            ))}
          </div>

          <Link
            to="/statistics#city-comparison-title"
            className="mt-8 flex flex-col gap-4 rounded-2xl border border-primary-200 bg-white p-5 transition hover:border-primary-500 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-700">
                <BarChart3 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                  {t('home.page.cityComparisonEyebrow')}
                </div>
                <h2 className="mt-1 text-lg font-extrabold text-gray-950">
                  {t('home.page.cityComparisonTitle')}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {t('home.page.cityComparisonDescription')}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-primary-700">
              {t('home.page.exploreStatistics')} <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </section>

    </>
  );
};

export default Home;
