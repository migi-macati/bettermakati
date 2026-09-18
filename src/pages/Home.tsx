import { Link } from 'react-router';
import {
  ArrowRight,
  FileText,
  Landmark,
  MapPin,
  Store,
  HeartPulse,
  GraduationCap,
  Home as HomeIcon,
  Scale,
  ReceiptText,
  Lightbulb,
  Database,
  HeartHandshake,
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

const civicLinks = [
  { label: 'Government', description: 'Officials, city offices and contacts.', href: '/government', icon: Landmark },
  { label: 'Barangays', description: 'Barangay directory and population.', href: '/barangays', icon: MapPin },
  { label: 'City Statistics', description: 'Population and other basic city figures.', href: '/statistics', icon: FileText },
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

const recordLinks = [
  {
    label: 'Annual Budget',
    description: 'CY 2025',
    href: 'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/Annual%20Budget%202025.pdf',
    icon: ReceiptText,
  },
  {
    label: 'Resolutions & Ordinances',
    description: 'Local legislation',
    href: 'https://www.makati.gov.ph/content/resolutions-and-ordinances/author',
    icon: Scale,
  },
  {
    label: 'Procurement',
    description: 'PhilGEPS notices',
    href: 'https://notices.philgeps.gov.ph/',
    icon: FileText,
  },
];

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="Home"
        description="BetterMakati is an independent civic information portal for Makati City."
        keywords="Makati, Makati City, public services, local government, civic information"
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
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="section-eyebrow">City information</div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-950 mb-7">Explore Makati</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {civicLinks.map(item => {
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

      <section className="bg-[#fff8e6] py-14 border-y border-secondary-100">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="section-eyebrow text-secondary-800">Projects & Budget</div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-7">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-950">Go straight to the records</h2>
            <Link to="/projects-budget" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-700 hover:text-primary-900">
              Projects & budget <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recordLinks.map(item => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-[#ead6a0] bg-white/80 p-5 hover:bg-white hover:shadow-sm transition"
                >
                  <Icon className="h-6 w-6 text-secondary-700" />
                  <h3 className="font-bold text-gray-950 mt-4">{item.label}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#fffdf8] py-14">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="section-eyebrow">Get Involved</div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-7 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-950">Help build BetterMakati</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                <Link to="/get-involved?type=idea#submission" className="home-service-card">
                  <Lightbulb className="h-5 w-5 text-primary-700" />
                  <span className="font-bold">Suggest an idea</span>
                </Link>
                <Link to="/get-involved?type=source#submission" className="home-service-card">
                  <Database className="h-5 w-5 text-primary-700" />
                  <span className="font-bold">Share a source</span>
                </Link>
                <Link to="/get-involved?type=volunteer#submission" className="home-service-card">
                  <HeartHandshake className="h-5 w-5 text-primary-700" />
                  <span className="font-bold">Volunteer</span>
                </Link>
              </div>
            </div>
            <Link to="/get-involved" className="brand-btn-primary">
              Get involved <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
