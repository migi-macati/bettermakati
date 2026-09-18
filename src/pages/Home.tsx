import { Link } from 'react-router';
import {
  ArrowRight,
  Building2,
  FileText,
  Landmark,
  MapPin,
  Phone,
  SearchCheck,
  Store,
  HeartPulse,
  GraduationCap,
  Home as HomeIcon,
  Users,
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
  { label: 'Government', description: 'Leadership, offices and official contacts.', href: '/government', icon: Landmark },
  { label: 'Barangays', description: 'Current 23-barangay directory and population.', href: '/barangays', icon: MapPin },
  { label: 'Transparency', description: 'Budget, disclosures, legislation and procurement.', href: '/transparency', icon: FileText },
  { label: 'Hotlines', description: 'Emergency and essential Makati contacts.', href: '/hotlines', icon: Phone },
  { label: 'About & Sources', description: 'Methodology, sourcing and corrections.', href: '/about', icon: SearchCheck },
];

const stats = [
  ['309,770', 'Population', '2024 POPCEN'],
  ['23', 'Barangays', 'PSGC current count'],
  ['27.36 km²', 'Land area', 'Official Makati profile'],
  ['1st', 'Income class', 'PSA PSGC'],
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
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-950">Frequently used services</h2>
              <p className="text-gray-600 mt-2">A deliberately small v1.0 directory built from official public sources.</p>
            </div>
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
            {stats.map(([value, label, source]) => (
              <div key={label} className="stat-card">
                <div className="text-2xl md:text-3xl font-extrabold text-primary-800">{value}</div>
                <div className="font-semibold text-gray-900 mt-1">{label}</div>
                <div className="text-xs text-gray-500 mt-1">{source}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Population, barangay count and income class: Philippine Statistics Authority. Land area: City Government of Makati official profile.
          </p>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container mx-auto px-4">
          <div className="section-eyebrow">City information</div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-7">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-950">Understand the city</h2>
              <p className="text-gray-600 mt-2">Find who is responsible, where the source came from, and where to transact officially.</p>
            </div>
          </div>

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

      <section className="bg-[#fff8e6] py-14 border-y border-secondary-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 items-center">
            <div>
              <div className="section-eyebrow text-secondary-800">Independent by design</div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-950">Not another government website.</h2>
              <p className="text-gray-700 mt-4 leading-relaxed max-w-xl">
                The official Makati portal remains the place for official transactions and announcements. BetterMakati focuses on organizing selected public information, showing where it came from, and making it easier to navigate.
              </p>
              <Link to="/about" className="brand-btn-secondary mt-6">
                How BetterMakati works <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="principle-card">
                <Building2 className="h-6 w-6 text-primary-700" />
                <h3>Independent</h3>
                <p>No claim of being an official City Government website.</p>
              </div>
              <div className="principle-card">
                <SearchCheck className="h-6 w-6 text-primary-700" />
                <h3>Traceable</h3>
                <p>Substantive pages point back to authoritative public sources.</p>
              </div>
              <div className="principle-card">
                <Users className="h-6 w-6 text-primary-700" />
                <h3>Useful</h3>
                <p>Built around what residents actually need to find and understand.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section className="bg-[#fffdf8]">
        <div className="rounded-2xl border border-primary-100 bg-white p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5 shadow-sm">
          <div>
            <div className="section-eyebrow">Verified sources</div>
            <Heading level={2} className="!mb-2">See the records behind the summaries.</Heading>
            <p className="text-gray-600">Budget documents, legislation, audit resources and procurement portals in one place.</p>
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
