import { Link } from 'react-router';
import {
  ArrowRight,
  FileBarChart,
  Landmark,
  MapPin,
  Store,
  HeartPulse,
  GraduationCap,
  Home as HomeIcon,
  Compass,
  UtensilsCrossed,
  Church,
  Bus,
  Film,
} from 'lucide-react';
import Hero from '../components/sections/Hero';
import CommunityToolsGrid from '../components/community/CommunityToolsGrid';
import SEO from '../components/SEO';

const quickServices = [
  {
    label: 'Business permits',
    description: 'New applications and renewals',
    href: '/services/business',
    icon: Store,
  },
  {
    label: 'Health & emergency',
    description: 'Yellow Card and emergency access',
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
    description: 'RPT, zoning and building permits',
    href: '/services/housing-land-use',
    icon: HomeIcon,
  },
];

const visitPaths = [
  {
    label: 'Places to go',
    description: 'Museums, markets, parks, shopping and neighborhoods.',
    href: '/visit',
    icon: Compass,
  },
  {
    label: 'Eat & drink',
    description: 'Restaurants, cafés, markets and nightlife.',
    href: '/visit',
    icon: UtensilsCrossed,
  },
  {
    label: 'Getting around',
    description: 'Public transport, directions and ride-hailing.',
    href: '/mobility',
    icon: Bus,
  },
  {
    label: 'Cinemas',
    description: 'Movie theaters and showtime links.',
    href: '/cinemas',
    icon: Film,
  },
  {
    label: 'Heritage & history',
    description: 'Historic sites, cultural places and the Makati timeline.',
    href: '/heritage',
    icon: Church,
  },
];

const cityPaths = [
  {
    label: 'Government',
    description: 'Officials, city offices and contacts.',
    href: '/government',
    icon: Landmark,
  },
  {
    label: 'Barangays',
    description: 'Barangay directory and population.',
    href: '/barangays',
    icon: MapPin,
  },
  {
    label: 'Projects & Budget',
    description: 'Budget, projects, procurement and audit records.',
    href: '/projects-budget',
    icon: FileBarChart,
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
        description="BetterMakati is an independent civic information portal for Makati City."
        keywords="Makati, Makati City, public services, local government, civic information, tourism, heritage"
      />

      <Hero />

      <section className="bg-[#fffdf8] py-14">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="section-eyebrow">Services</div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-7">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-950">Frequently used services</h2>
            <Link to="/services" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-700 hover:text-primary-900">
              View all services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickServices.map(item => {
              const Icon = item.icon;
              return (
                <Link key={item.label} to={item.href} className="home-service-card">
                  <div className="home-service-card-icon"><Icon className="h-5 w-5" /></div>
                  <div>
                    <h3 className="font-bold text-gray-950">{item.label}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-primary-600 ml-auto shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 border-y border-gray-100">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="section-eyebrow">Visit Makati</div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-7">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-950">Explore, eat and discover</h2>
            <Link to="/visit" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-700 hover:text-primary-900">
              Visit Makati <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {visitPaths.map(item => {
              const Icon = item.icon;
              return (
                <Link key={item.label} to={item.href} className="civic-card !min-h-0">
                  <Icon className="h-6 w-6 text-primary-700" />
                  <h3 className="font-bold text-gray-950 mt-4">{item.label}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 mt-4">
                    Open <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f8f2] py-14 border-y border-primary-100/70">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="section-eyebrow">Makati at a glance</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {stats.map(stat => (
              <a key={stat.label} href={stat.href} target="_blank" rel="noreferrer" className="stat-card hover:border-primary-300 transition">
                <div className="text-2xl md:text-3xl font-extrabold text-primary-800">{stat.value}</div>
                <div className="font-semibold text-gray-900 mt-1">{stat.label}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.source}</div>
              </a>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {cityPaths.map(item => {
              const Icon = item.icon;
              return (
                <Link key={item.label} to={item.href} className="civic-card !min-h-0 bg-white">
                  <Icon className="h-6 w-6 text-primary-700" />
                  <h3 className="font-bold text-gray-950 mt-4">{item.label}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 mt-4">
                    Open <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="section-eyebrow">Community Tools</div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-7">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-950">Tools for everyday Makati</h2>
            <Link to="/community-tools" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-700 hover:text-primary-900">
              View all tools <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <CommunityToolsGrid limit={4} />
        </div>
      </section>

      <section className="bg-[#fffdf8] py-14 border-t border-gray-100">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 rounded-2xl border border-primary-100 bg-white p-6 md:p-8">
            <div>
              <div className="section-eyebrow">Get Involved</div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-950">Improve BetterMakati</h2>
            </div>
            <Link to="/get-involved" className="brand-btn-primary">
              Suggest, contribute or volunteer <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
