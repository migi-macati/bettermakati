import { Link } from 'react-router';
import {
  ArrowRight,
  FileText,
  Landmark,
  MapPin,
  Phone,
  SearchCheck,
  Store,
  HeartPulse,
  GraduationCap,
  Home as HomeIcon,
} from 'lucide-react';
import Hero from '../components/sections/Hero';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
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
  { label: 'Government', description: 'Leadership, offices and contacts.', href: '/government', icon: Landmark },
  { label: 'Barangays', description: 'Barangay directory and population.', href: '/barangays', icon: MapPin },
  { label: 'Transparency', description: 'Budget, disclosures, legislation and procurement.', href: '/transparency', icon: FileText },
  { label: 'Hotlines', description: 'Emergency and essential Makati contacts.', href: '/hotlines', icon: Phone },
  { label: 'About BetterMakati', description: 'About the project and corrections.', href: '/about', icon: SearchCheck },
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
    value: '27.36 km²',
    label: 'Land area',
    source: 'City profile',
    href: 'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/1653640559352.pdf',
  },
  {
    value: '1st',
    label: 'Income class',
    source: 'PSA PSGC',
    href: 'https://psa.gov.ph/classification/psgc/barangays/1380300000',
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
        <div className="container mx-auto px-4">
          <div className="section-eyebrow">Start here</div>
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

      <section className="bg-[#f5f8f2] py-14 border-y border-primary-100/70">
        <div className="container mx-auto px-4">
          <div className="section-eyebrow">Makati at a glance</div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-950 mb-7">A quick civic snapshot</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {stats.map(stat => (
              <div key={stat.label} className="stat-card">
                <div className="text-2xl md:text-3xl font-extrabold text-primary-800">{stat.value}</div>
                <div className="font-semibold text-gray-900 mt-1">{stat.label}</div>
                <a
                  href={stat.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-xs text-primary-700 underline underline-offset-2 mt-1"
                >
                  {stat.source}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container mx-auto px-4">
          <div className="section-eyebrow">City information</div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-950 mb-7">Explore Makati</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {civicLinks.map(item => {
              const Icon = item.icon;
              return (
                <Link key={item.label} to={item.href} className="civic-card">
                  <Icon className="h-6 w-6 text-primary-700" />
                  <h3 className="font-bold text-gray-950 mt-4">{item.label}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Section className="bg-[#fffdf8]">
        <div className="rounded-2xl border border-primary-100 bg-white p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5 shadow-sm">
          <div>
            <div className="section-eyebrow">Public records</div>
            <Heading level={2} className="!mb-2">Budget, legislation and procurement</Heading>
            <p className="text-gray-600">City budget documents, local legislation, audit resources and procurement portals.</p>
          </div>
          <Link to="/transparency" className="brand-btn-primary shrink-0">
            Open transparency <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
};

export default Home;
