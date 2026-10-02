import Section from '../components/ui/Section';
import { useParams, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import {
  serviceCategories,
  getCategorySubcategories,
  type Subcategory,
  type CategoryIndex,
} from '../data/yamlLoader';
import {
  Building2,
  ExternalLink,
  GraduationCap,
  HeartPulse,
  House,
  MapPin,
  Search,
  Users,
} from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SEO from '../components/SEO';
import LastReviewed from '../components/ui/LastReviewed';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Banner } from '@bettergov/kapwa/banner';
import { useEffect, useMemo, useState } from 'react';
import {
  serviceDirectory,
  serviceDirectoryCategories,
  serviceDirectoryLevels,
  type ServiceLevel,
} from '../data/serviceDirectory';
import PhotoCarousel from '../components/ui/PhotoCarousel';
import { servicesImageSet } from '../data/cityImages';
import { useBarangayScope, withBarangayScope } from '../hooks/useBarangayScope';
import {
  civicAssetTypeLabels,
  placesByBarangay,
} from '../data/placeRegistry';
import { manilaDateKey } from '../data/civicTimeline';

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const editDistance = (a: string, b: string) => {
  if (a === b) return 0;
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  const current = new Array<number>(b.length + 1);
  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    for (let j = 0; j <= b.length; j += 1) previous[j] = current[j];
  }
  return previous[b.length];
};

const fuzzyWordMatch = (word: string, tokens: string[]) => {
  if (word.length < 4) return false;
  const tolerance = word.length >= 8 ? 2 : 1;
  return tokens.some(
    token =>
      Math.abs(token.length - word.length) <= tolerance &&
      editDistance(word, token) <= tolerance
  );
};

const Services: React.FC = () => {
  const { t } = useTranslation();
  const { category } = useParams();
  const [categoryIndex, setCategoryIndex] = useState<CategoryIndex>({
    layout: 'list',
    pages: [],
  });
  const [loading, setLoading] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [directoryQuery, setDirectoryQuery] = useState('');
  const [directoryLevel, setDirectoryLevel] = useState<'All' | ServiceLevel>('All');
  const [directoryCategory, setDirectoryCategory] = useState('All');
  const { barangay } = useBarangayScope();
  const scopedServiceHref = (href: string) => withBarangayScope(href, barangay?.slug);
  const localServicePlaces = barangay
    ? placesByBarangay(barangay.name).filter(
        place =>
          place.verification.status === 'verified' &&
          (
            place.primaryCategory === 'health-center' ||
            place.primaryCategory === 'community-center' ||
            place.tags.includes('service')
          )
      )
    : [];
  const subcategories: Subcategory[] = categoryIndex.pages;

  const categoryData = serviceCategories.categories.find(c => c.slug === category);
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Building2,
    HeartPulse,
    GraduationCap,
    Users,
    House,
  };
  const Icon = categoryData?.icon ? iconMap[categoryData.icon] : undefined;

  useEffect(() => {
    if (!category && barangay) {
      setDirectoryLevel('Barangay');
    }
  }, [barangay, category]);

  useEffect(() => {
    if (category && categoryData) {
      setLoading(true);
      setLoadFailed(false);
      getCategorySubcategories(category)
        .then(setCategoryIndex)
        .catch(() => {
          setCategoryIndex({ layout: 'list', pages: [] });
          setLoadFailed(true);
        })
        .finally(() => setLoading(false));
    }
  }, [category, categoryData]);

  const todayKey = manilaDateKey();

  const visibleDirectory = useMemo(() => {
    const query = normalize(directoryQuery);
    return serviceDirectory
      .filter(
        item =>
          !item.availabilityWindow ||
          item.availabilityWindow.endsOn >= todayKey
      )
      .filter(item => directoryLevel === 'All' || item.level === directoryLevel)
      .filter(item => directoryCategory === 'All' || item.category === directoryCategory)
      .filter(item => {
        if (!query) return true;
        const haystack = normalize(
          [
            item.title,
            item.description,
            item.agency,
            item.category,
            item.level,
            item.type,
            item.keywords,
          ].join(' ')
        );
        const tokens = haystack.split(' ').filter(Boolean);
        return query
          .split(' ')
          .filter(Boolean)
          .every(word => haystack.includes(word) || fuzzyWordMatch(word, tokens));
      })
      .sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return a.title.localeCompare(b.title);
      });
  }, [directoryCategory, directoryLevel, directoryQuery, todayKey]);

  if (!category) {
    return (
      <>
        <SEO
          title={t('servicesGovernment.servicesPage.seoTitle')}
          description={t('servicesGovernment.servicesPage.seoDescription')}
          keywords="Makati services, permits, clearances, certificates, IDs, barangay, national government, health, business, civil registry"
        />

        <section className="bm-service-hero border-b border-primary-900 text-white">
          <div className="container px-5 py-12 md:px-6 md:py-16 lg:px-8">
            <div className="max-w-4xl">
              <div className="mb-3 text-xs font-extrabold uppercase tracking-[0.12em] text-secondary-200 md:text-sm">
                Services
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl">
                {t('servicesGovernment.servicesPage.title')}
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-relaxed text-primary-50 md:text-xl">
                {t('servicesGovernment.servicesPage.intro')}
              </p>

              <label className="relative mt-7 block max-w-3xl">
                <span className="sr-only">{t('servicesGovernment.servicesPage.searchLabel')}</span>
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={directoryQuery}
                  onChange={event => setDirectoryQuery(event.target.value)}
                  placeholder={t('servicesGovernment.servicesPage.searchPlaceholder')}
                  className="bm-service-search w-full py-3.5 pl-12 pr-4 text-base"
                />
              </label>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-primary-50">
                <span className="font-medium text-primary-100">{t('servicesGovernment.servicesPage.startWith')}</span>
                <Link to={scopedServiceHref('/services/guide/new-business-permit')} className="min-h-11 content-center font-semibold underline decoration-white/40 underline-offset-4 hover:text-secondary-300">
                  Business permit
                </Link>
                <Link to={scopedServiceHref('/services/guide/yellow-card')} className="min-h-11 content-center font-semibold underline decoration-white/40 underline-offset-4 hover:text-secondary-300">
                  Yellow Card
                </Link>
                <Link to={scopedServiceHref('/services/guide/community-tax-certificate')} className="min-h-11 content-center font-semibold underline decoration-white/40 underline-offset-4 hover:text-secondary-300">
                  Cedula
                </Link>
                <Link to={scopedServiceHref('/services/guide/real-property-tax')} className="min-h-11 content-center font-semibold underline decoration-white/40 underline-offset-4 hover:text-secondary-300">
                  Real property tax
                </Link>
              </div>

              <div className="mt-5 flex flex-wrap gap-2" aria-label={t('servicesGovernment.servicesPage.levelLabel')}>
                {serviceDirectoryLevels.map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDirectoryLevel(level)}
                    aria-pressed={directoryLevel === level}
                    className={
                      directoryLevel === level
                        ? 'min-h-11 rounded-full bg-secondary-500 px-4 py-2 text-sm font-bold text-primary-900'
                        : 'min-h-11 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:border-white/60 hover:bg-white/15'
                    }
                  >
                    {level}
                  </button>
                ))}
              </div>

              <label className="mt-4 block max-w-sm">
                <span className="sr-only">{t('servicesGovernment.servicesPage.categoryLabel')}</span>
                <select
                  value={directoryCategory}
                  onChange={event => setDirectoryCategory(event.target.value)}
                  className="w-full rounded-xl border border-white/30 bg-white px-4 py-3 text-sm font-semibold text-gray-900"
                >
                  <option value="All">{t('servicesGovernment.servicesPage.allCategories')}</option>
                  {serviceDirectoryCategories.map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </section>

        <Section className="bg-[#fffdf8]">
          <LastReviewed date="2026-09-29"
            note={t('servicesGovernment.servicesPage.reviewNote')}
            className="mt-0"
          />

          {barangay && (
            <div className="mt-5 rounded-2xl border border-primary-100 bg-white p-5">
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                {t('servicesGovernment.servicesPage.localStart')}
              </div>
              <div className="mt-1 text-lg font-extrabold text-gray-950">
                Barangay {barangay.name} Hall
              </div>
              <div className="mt-3 grid gap-2 text-sm text-gray-600">
                {barangay.hallAddress && <div>{barangay.hallAddress}</div>}
                {barangay.hallPhone && <div>{barangay.hallPhone}</div>}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {barangay.hallEmail && (
                  <a href={'mailto:' + barangay.hallEmail} className="brand-btn-primary">
                    {t('servicesGovernment.servicesPage.emailBarangay')}
                  </a>
                )}
                <a
                  href={barangay.officialPageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="brand-btn-secondary"
                >
                  {t('servicesGovernment.servicesPage.officialBarangay')}
                </a>
                <Link to={'/barangays/' + barangay.slug} className="brand-btn-secondary">
                  {t('servicesGovernment.servicesPage.barangayHomepage')}
                </Link>
              </div>
            </div>
          )}

          {barangay && localServicePlaces.length > 0 && (
            <div className="mt-4 rounded-2xl border border-primary-100 bg-white p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                    Service locations
                  </div>
                  <div className="mt-1 text-lg font-extrabold text-gray-950">
                    In Barangay {barangay.name}
                  </div>
                </div>
                <Link
                  to={withBarangayScope('/civic-map', barangay.slug)}
                  className="inline-flex items-center gap-1 text-sm font-bold text-primary-700"
                >
                  Open local map <MapPin className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {localServicePlaces.map(place => (
                  <Link
                    key={place.id}
                    to={withBarangayScope('/civic-map/' + place.id, barangay.slug)}
                    className="rounded-xl border border-gray-200 p-4 transition hover:border-primary-300"
                  >
                    <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                      {civicAssetTypeLabels[place.primaryCategory]}
                    </div>
                    <div className="mt-1 font-extrabold text-gray-950">{place.name}</div>
                    {place.location.address && (
                      <div className="mt-1 text-sm leading-relaxed text-gray-600">
                        {place.location.address}
                      </div>
                    )}
                    {(place.servicesAtLocation?.length ?? 0) > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        {place.servicesAtLocation?.slice(0, 2).map(service => service.label).join(' · ')}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 grid gap-3 rounded-2xl border border-primary-100 bg-white p-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                {t('servicesGovernment.servicesPage.unsureOffice')}
              </div>
              <div className="mt-1 text-lg font-extrabold text-gray-950">{t('servicesGovernment.servicesPage.concernFinder')}</div>
              <p className="mt-1 text-sm text-gray-600">
                {t('servicesGovernment.servicesPage.concernFinderHelp')}
              </p>
            </div>
            <Link to="/community-tools/saan-ako-lalapit" className="brand-btn-primary">
              {t('servicesGovernment.servicesPage.findWhere')}
            </Link>
          </div>

          <div className="mt-4">
            <Link to="/government-offices" className="text-sm font-bold text-primary-700 underline underline-offset-2">
              {t('servicesGovernment.servicesPage.governmentOffices')}
            </Link>
          </div>

          <PhotoCarousel
            images={servicesImageSet}
            title={t('servicesGovernment.servicesPage.photoTitle')}
            compact
            className="mt-7"
          />
        </Section>

        <Section className="bg-white">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="section-eyebrow">{t('servicesGovernment.servicesPage.directory')}</div>
              <Heading level={2}>{t('servicesGovernment.servicesPage.governmentServices')}</Heading>
            </div>
            <div className="text-sm text-gray-500">
              {t('servicesGovernment.servicesPage.results', { count: visibleDirectory.length })}
            </div>
          </div>

          <div className="bm-service-directory mt-6 divide-y divide-gray-200 overflow-hidden">
            {visibleDirectory.map(item => {
              return (
                <article
                  key={item.id}
                  className="bm-service-directory-row grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                      <span className="rounded-full bg-primary-50 px-2.5 py-1 text-primary-800">
                        {item.level}
                      </span>
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">
                        {item.type}
                      </span>
                    </div>
                    <h3 className="mt-2 text-lg font-extrabold text-gray-950">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      {item.description}
                    </p>
                    <div className="mt-2 text-xs text-gray-500">{item.agency}</div>
                  </div>

                  <Link
                    to={scopedServiceHref(`/services/guide/${item.id}`)}
                    className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary-800 px-4 py-2 text-sm font-bold text-white hover:bg-primary-900"
                  >
                    Open guide
                  </Link>
                </article>
              );
            })}
            {visibleDirectory.length === 0 && (
              <div className="p-8 text-center">
                <div className="font-extrabold text-gray-950">
                  No indexed service matches this search yet.
                </div>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-gray-600">
                  Clear the filters and try a broader task, or use the service-help routes below if you are unsure what the service is called.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setDirectoryQuery('');
                      setDirectoryLevel('All');
                      setDirectoryCategory('All');
                    }}
                    className="brand-btn-secondary"
                  >
                    {t('servicesGovernment.servicesPage.clearFilters')}
                  </button>
                  <Link to="/community-tools/saan-ako-lalapit" className="brand-btn-primary">
                    {t('servicesGovernment.servicesPage.useConcernFinder')}
                  </Link>
                  <Link to="/government-offices" className="brand-btn-secondary">
                    {t('servicesGovernment.servicesPage.browseOffices')}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </Section>

        <Section className="bg-[#fffdf8]">
          <div className="section-eyebrow">{t('servicesGovernment.servicesPage.beyondMakati')}</div>
          <Heading level={2}>{t('servicesGovernment.servicesPage.needElsewhere')}</Heading>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <a
              href="https://bettergov.ph/services"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
            >
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                {t('servicesGovernment.servicesPage.nationalGovernment')}
              </div>
              <h3 className="mt-2 text-lg font-extrabold text-gray-950">
                {t('servicesGovernment.servicesPage.browseBetterGov')}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                {t('servicesGovernment.servicesPage.searchNational')}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                {t('servicesGovernment.servicesPage.openBetterGov')} <ExternalLink className="h-4 w-4" />
              </span>
            </a>
            <a
              href="https://lgu.bettergov.ph/"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
            >
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                {t('servicesGovernment.servicesPage.anotherLgu')}
              </div>
              <h3 className="mt-2 text-lg font-extrabold text-gray-950">
                {t('servicesGovernment.servicesPage.findAnotherLgu')}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                {t('servicesGovernment.servicesPage.betterLguHelp')}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                {t('servicesGovernment.servicesPage.openBetterLgu')} <ExternalLink className="h-4 w-4" />
              </span>
            </a>
          </div>
        </Section>

        <Section id="digital" className="bg-[#f5f8f2]">
          <div className="section-eyebrow">{t('servicesGovernment.servicesPage.digitalChannels')}</div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.makati.gov.ph/"
              target="_blank"
              rel="noreferrer"
              className="brand-btn-secondary"
            >
              Makati Web Portal <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=project.smsgt.makaapp&hl=en"
              target="_blank"
              rel="noreferrer"
              className="brand-btn-secondary"
            >
              Makatizen App <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href="https://e.gov.ph/"
              target="_blank"
              rel="noreferrer"
              className="brand-btn-secondary"
            >
              eGovPH <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href="https://gov.ph/"
              target="_blank"
              rel="noreferrer"
              className="brand-btn-secondary"
            >
              GOV.PH <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </Section>
      </>
    );
  }

  if (!categoryData) {
    return (
      <Section className="p-3 mb-12">
        <Breadcrumbs
          className="mb-8"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Services', href: scopedServiceHref('/services') },
            { label: category || t('servicesGovernment.servicesPage.categoryNotFound') },
          ]}
        />
        <Banner
          type="error"
          title={t('servicesGovernment.servicesPage.categoryNotFound')}
          description={t('servicesGovernment.servicesPage.categoryMissing')}
          icon
        />
      </Section>
    );
  }

  return (
    <>
      <SEO
        title={categoryData.category}
        description={categoryData.description}
        keywords={`${categoryData.category}, Makati City services`}
      />
      <Section className="p-3 mb-12">
        <Breadcrumbs
          className="mb-8"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Services', href: scopedServiceHref('/services') },
            { label: categoryData.category },
          ]}
        />
        {Icon && <Icon className="h-8 w-8 mb-4 text-primary-600 rounded-md" />}
        <Heading>{categoryData.category}</Heading>
        <Text className="text-gray-600 mb-3">{categoryData.description}</Text>
        <LastReviewed date="2026-09-25"
          note={t('servicesGovernment.servicesPage.categoryReviewNote')}
          className="mb-6"
        />

        {loading ? (
          <div className="flex items-center justify-center p-8" role="status">
            <Text>{t('servicesGovernment.servicesPage.loading')}</Text>
          </div>
        ) : loadFailed ? (
          <div
            role="alert"
            className="rounded-xl border border-warning-200 bg-warning-50 p-5 text-sm text-warning-950"
          >
            {t('servicesGovernment.servicesPage.loadFailed')}
          </div>
        ) : subcategories.length === 0 ? (
          <Banner
            type="info"
            title={t('servicesGovernment.servicesPage.noneListed')}
            description={t('servicesGovernment.servicesPage.chooseAnother')}
          />
        ) : (
          <div className={
            categoryIndex.layout === 'grid'
              ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
              : 'space-y-4'
          }>
            {subcategories.map(subcategory => (
              <Link
                key={subcategory.slug}
                to={scopedServiceHref(`/services/${category}/${subcategory.slug}`)}
              >
                <Card hoverable className="mb-4 h-full">
                  <CardContent>
                    <h4 className="text-lg font-medium text-gray-900">
                      {subcategory.name}
                    </h4>
                    {subcategory.description && (
                      <p className="mt-2 text-sm text-gray-600">
                        {subcategory.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </>
  );
};

export default Services;
