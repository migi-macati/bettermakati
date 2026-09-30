import { Link } from 'react-router';
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
    label: 'Business permits',
    description: 'New applications and renewals',
    href: '/services/business',
    icon: Store,
  },
  {
    label: 'Health services',
    description: 'Yellow Card, clinics and care access',
    href: '/services/health-services',
    icon: HeartPulse,
  },
  {
    label: 'Education',
    description: 'UMak admissions and scholarships',
    href: '/services/education',
    icon: GraduationCap,
  },
  {
    label: 'Property & land use',
    description: 'Property tax, zoning and building permits',
    href: '/services/housing-land-use',
    icon: HomeIcon,
  },
];

const visitPaths = [
  {
    label: 'Explore Makati',
    description:
      'Start with durable places, districts and city experiences, then follow their civic context.',
    href: '/visit',
    icon: Compass,
  },
  {
    label: 'Getting around',
    description: 'Public transport, transfers, routes and live directions.',
    href: '/mobility',
    icon: Bus,
  },
  {
    label: 'Areas & districts',
    description: 'Understand Makati CBD, Ayala Center, Rockwell, Circuit and other city areas.',
    href: '/estates',
    icon: Compass,
  },
  {
    label: 'Heritage & history',
    description: 'Historic sites, self-guided routes and the Makati timeline.',
    href: '/heritage',
    icon: Church,
  },
];

const visitShortcuts = [
  { label: 'Cinemas', href: '/cinemas', icon: Film },
  { label: 'Live place discovery', href: '/visit#live-discovery', icon: Compass },
];

const publicActionPaths = [
  {
    label: 'Accountability',
    description: 'Track projects, procurement, audit findings and public commitments.',
    href: '/accountability',
    icon: ClipboardCheck,
  },
  {
    label: 'Projects & budget',
    description: 'See where city money comes from, where it goes and what is being built.',
    href: '/projects-budget',
    icon: BarChart3,
  },
  {
    label: 'Public records',
    description: 'Open the underlying documents, datasets and source records behind civic claims.',
    href: '/records',
    icon: Landmark,
  },
];

const stats = [
  {
    value: '309,770',
    label: 'Population',
    source: '2024 POPCEN',
    href: 'https://psa.gov.ph/classification/psgc/barangays/1380300000',
  },
  {
    value: '23',
    label: 'Barangays',
    source: 'PSA PSGC',
    href: 'https://psa.gov.ph/classification/psgc/barangays/1380300000',
  },
  {
    value: '1st',
    label: 'Income class',
    source: 'PSA PSGC',
    href: 'https://psa.gov.ph/classification/psgc/barangays/1380300000',
  },
  {
    value: '55,572',
    label: 'Pio Del Pilar',
    source: 'Largest barangay by 2024 population',
    href: 'https://psa.gov.ph/classification/psgc/barangays/1380300000',
  },
];

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="Home"
        description="BetterMakati is an independent civic information and participation platform for Makati."
        keywords="Makati, Makati City, public services, local government, civic information, civic participation, city exploration, heritage"
      />

      <Hero />

      <section className="border-b border-primary-100 bg-[#fffdf8] py-5 md:py-7">
        <div className="container px-5 md:px-6 lg:px-8">
          <PhotoCarousel
            images={homeImageSet}
            title="Around Makati"
            compact
            priority
            autoRotate
            className="mx-auto max-w-6xl"
          />
        </div>
      </section>

      <section className="bg-[#fffdf8] py-14">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="section-eyebrow">Services</div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-7">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-950">
              Common services
            </h2>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-700 hover:text-primary-900"
            >
              View all services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickServices.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className="home-service-card"
                >
                  <div className="home-service-card-icon">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-950">{item.label}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-primary-600 ml-auto shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-primary-900 py-12 text-white border-b border-primary-900">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="section-eyebrow !text-white/80">
            Public action & evidence
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Follow decisions, money and the records behind them.
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-primary-100 md:text-base">
                Start with accountability, then move into budgets, projects and the original public records when you need the source.
              </p>
            </div>
          </div>
          <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-4">
            {publicActionPaths.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className="rounded-2xl border border-white/15 bg-white/5 p-5 transition hover:bg-white/10 hover:border-secondary-500"
                >
                  <Icon className="h-6 w-6 text-secondary-500" />
                  <h3 className="mt-4 font-extrabold text-white">
                    {item.label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-primary-100">
                    {item.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-white">
                    Open <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 border-t border-gray-100">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="flex flex-col gap-5 rounded-2xl border border-primary-100 bg-[#fffdf8] p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <div className="section-eyebrow">Participation</div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-950">
                Take part in Makati
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
                Start here for non-emergency public-place reports, civic participation and the right route for a community concern.
              </p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
                <Link to="/get-involved" className="text-primary-700 hover:text-primary-900">
                  Improve BetterMakati
                </Link>
                <Link to="/community-tools" className="text-primary-700 hover:text-primary-900">
                  More community tools
                </Link>
              </div>
            </div>
            <Link to="/participate" className="brand-btn-primary shrink-0">
              Participate in Makati <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 border-y border-gray-100">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="section-eyebrow">Explore Makati</div>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-7">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-950">
                Understand the city as you explore it
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
                Move from places and experiences into districts, barangays,
                heritage, history, mobility and current activity.
              </p>
            </div>
            <Link
              to="/visit"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-700 hover:text-primary-900"
            >
              Explore Makati <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {visitPaths.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className="civic-card !min-h-0"
                >
                  <Icon className="h-6 w-6 text-primary-700" />
                  <h3 className="font-bold text-gray-950 mt-4">{item.label}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 mt-4">
                    Open <ArrowRight className="h-4 w-4" />
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
                  key={item.label}
                  to={item.href}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-primary-800 hover:border-primary-300 hover:bg-primary-50"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <FeaturedInsightsCarousel />

      <section className="bg-[#f5f8f2] py-14 border-y border-primary-100/70">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="section-eyebrow">Makati at a glance</div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-5 xl:grid-cols-4">
            {stats.map(stat => (
              <a
                key={stat.label}
                href={stat.href}
                target="_blank"
                rel="noreferrer"
                className="stat-card hover:border-primary-300 transition"
              >
                <div className="text-2xl md:text-3xl font-extrabold text-primary-800">
                  {stat.value}
                </div>
                <div className="font-semibold text-gray-900 mt-1">
                  {stat.label}
                </div>
                <div className="text-xs text-gray-500 mt-1">{stat.source}</div>
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
                  City comparison
                </div>
                <h2 className="mt-1 text-lg font-extrabold text-gray-950">
                  Compare Makati with other Philippine cities
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Compare 2024 GDP per person using the same PSA definition and
                  price basis.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-primary-700">
              Explore statistics <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </section>


      

      

      

      

      

      

      

    </>
  );
};

export default Home;
