import Section from '../components/ui/Section';
import { useParams, Link } from 'react-router';
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
import { useBarangayScope } from '../hooks/useBarangayScope';

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
  const { category } = useParams();
  const [categoryIndex, setCategoryIndex] = useState<CategoryIndex>({
    layout: 'list',
    pages: [],
  });
  const [loading, setLoading] = useState(false);
  const [directoryQuery, setDirectoryQuery] = useState('');
  const [directoryLevel, setDirectoryLevel] = useState<'All' | ServiceLevel>('All');
  const [directoryCategory, setDirectoryCategory] = useState('All');
  const { barangay } = useBarangayScope();
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
      getCategorySubcategories(category)
        .then(setCategoryIndex)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [category, categoryData]);

  const visibleDirectory = useMemo(() => {
    const query = normalize(directoryQuery);
    return serviceDirectory
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
  }, [directoryCategory, directoryLevel, directoryQuery]);

  if (!category) {
    return (
      <>
        <SEO
          title="Services"
          description="Search Makati city, barangay and major national government services, permits, clearances, certificates, IDs and assistance."
          keywords="Makati services, permits, clearances, certificates, IDs, barangay, national government, health, business, civil registry"
        />

        <Section className="bg-[#fffdf8]">
          <div className="section-eyebrow">Services</div>
          <Heading>Find a government service</Heading>
          <Text className="mt-2 max-w-3xl text-gray-600">
            City, barangay and major national services used by people and businesses in Makati.
          </Text>
          <LastReviewed
            note="Requirements can change. Open the linked official source before acting."
            className="mt-4"
          />

          {barangay && (
            <div className="mt-4 rounded-2xl border border-primary-100 bg-white p-5">
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                Local starting point
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
                    Email barangay hall
                  </a>
                )}
                <a
                  href={barangay.officialPageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="brand-btn-secondary"
                >
                  Official barangay page
                </a>
                <Link to={'/barangays/' + barangay.slug} className="brand-btn-secondary">
                  Barangay dashboard
                </Link>
              </div>
            </div>
          )}

          <div className="mt-5 grid gap-3 rounded-2xl border border-primary-100 bg-white p-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                Not sure which office handles it?
              </div>
              <div className="mt-1 text-lg font-extrabold text-gray-950">Saan Ako Lalapit?</div>
              <p className="mt-1 text-sm text-gray-600">
                Describe the task or problem and start with the service that handles it.
              </p>
            </div>
            <Link to="/community-tools/saan-ako-lalapit" className="brand-btn-primary">
              Find where to go
            </Link>
          </div>

          <div className="mt-4">
            <Link to="/government-offices" className="text-sm font-bold text-primary-700 underline underline-offset-2">
              Government offices in and serving Makati
            </Link>
          </div>

          <PhotoCarousel
            images={servicesImageSet}
            title="Public service in Makati"
            compact
            className="mt-7"
          />

          <div className="mt-7 max-w-3xl">
            <label className="relative block">
              <span className="sr-only">Search government services</span>
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
                aria-hidden="true"
              />
              <input
                type="search"
                value={directoryQuery}
                onChange={event => setDirectoryQuery(event.target.value)}
                placeholder="Search permit, clearance, ID, test or service"
                className="w-full rounded-2xl border border-gray-300 bg-white py-3.5 pl-12 pr-4 text-base outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-2" aria-label="Government level">
            {serviceDirectoryLevels.map(level => (
              <button
                key={level}
                type="button"
                onClick={() => setDirectoryLevel(level)}
                aria-pressed={directoryLevel === level}
                className={
                  directoryLevel === level
                    ? 'rounded-full bg-primary-800 px-4 py-2 text-sm font-bold text-white'
                    : 'rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-primary-300'
                }
              >
                {level}
              </button>
            ))}
          </div>

          <div className="mt-4 max-w-sm">
            <label className="text-sm font-bold text-gray-800" htmlFor="service-category-filter">
              Category
            </label>
            <select
              id="service-category-filter"
              value={directoryCategory}
              onChange={event => setDirectoryCategory(event.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm"
            >
              <option value="All">All categories</option>
              {serviceDirectoryCategories.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </Section>

        <Section className="bg-white">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="section-eyebrow">Directory</div>
              <Heading level={2}>Government services</Heading>
            </div>
            <div className="text-sm text-gray-500">
              {visibleDirectory.length} results
            </div>
          </div>

          <div className="mt-6 divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {visibleDirectory.map(item => {
              return (
                <article
                  key={item.id}
                  className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center"
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
                    to={`/services/guide/${item.id}`}
                    className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary-800 px-4 py-2 text-sm font-bold text-white hover:bg-primary-900"
                  >
                    Open guide
                  </Link>
                </article>
              );
            })}
            {visibleDirectory.length === 0 && (
              <div className="p-8 text-center text-sm text-gray-600">
                No indexed service matches this search yet.
              </div>
            )}
          </div>
        </Section>

        <Section className="bg-[#fffdf8]">
          <div className="section-eyebrow">Beyond Makati</div>
          <Heading level={2}>Need somewhere else?</Heading>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <a
              href="https://bettergov.ph/services"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
            >
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                National government
              </div>
              <h3 className="mt-2 text-lg font-extrabold text-gray-950">
                Browse BetterGov services
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                Search national government services.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                Open BetterGov <ExternalLink className="h-4 w-4" />
              </span>
            </a>
            <a
              href="https://lgu.bettergov.ph/"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
            >
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                Another city or municipality
              </div>
              <h3 className="mt-2 text-lg font-extrabold text-gray-950">
                Find another LGU
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                Not from Makati or need another LGU? Search the BetterLGU Directory.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                Open BetterLGU <ExternalLink className="h-4 w-4" />
              </span>
            </a>
          </div>
        </Section>

        <Section id="digital" className="bg-[#f5f8f2]">
          <div className="section-eyebrow">Official digital channels</div>
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
        <Breadcrumbs className="mb-8" />
        <Banner
          type="error"
          title="Category not found"
          description="The category you are looking for does not exist."
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
        <Breadcrumbs className="mb-8" />
        {Icon && <Icon className="h-8 w-8 mb-4 text-primary-600 rounded-md" />}
        <Heading>{categoryData.category}</Heading>
        <Text className="text-gray-600 mb-3">{categoryData.description}</Text>
        <LastReviewed
          note="Time-sensitive service requirements may change."
          className="mb-6"
        />

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Text>Loading services...</Text>
          </div>
        ) : subcategories.length === 0 ? (
          <Banner
            type="info"
            title="No services listed"
            description="Choose another service category."
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
                to={`/services/${category}/${subcategory.slug}`}
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
