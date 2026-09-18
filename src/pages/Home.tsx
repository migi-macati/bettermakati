import { Link } from 'react-router';
import { Building2, FileText, Landmark, MapPin, Phone, SearchCheck } from 'lucide-react';
import Hero from '../components/sections/Hero';
import ServicesSection from '../components/home/ServicesSection';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import SEO from '../components/SEO';

const quickLinks = [
  { label: 'Government', description: 'Leadership, city offices and official contacts.', href: '/government', icon: Landmark },
  { label: 'Barangays', description: 'The current 23 barangays and 2024 POPCEN population.', href: '/barangays', icon: MapPin },
  { label: 'Transparency', description: 'Budget, disclosure, legislation and procurement source links.', href: '/transparency', icon: FileText },
  { label: 'Hotlines', description: 'Emergency and essential Makati contact information.', href: '/hotlines', icon: Phone },
  { label: 'About & Sources', description: 'How BetterMakati verifies information and handles corrections.', href: '/about', icon: SearchCheck },
];

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="Home"
        description="BetterMakati is an independent civic information portal for Makati City."
        keywords="Makati, Makati City, public services, local government, civic information"
      />
      <main className="flex-grow">
        <Hero />

        <Section>
          <div className="rounded-lg border border-primary-100 bg-primary-50 p-5 mb-8">
            <div className="flex gap-3">
              <Building2 className="h-6 w-6 text-primary-600 shrink-0 mt-0.5" />
              <div>
                <Heading level={3}>Independent, not official</Heading>
                <Text className="text-gray-700">
                  BetterMakati organizes public information and links back to authoritative sources. Official transactions remain with the City Government of Makati and other responsible agencies.
                </Text>
              </div>
            </div>
          </div>

          <Heading level={2}>Explore Makati civic information</Heading>
          <Text className="text-gray-600 mb-6">
            The first release focuses on a small, verified set of useful information rather than trying to reproduce the entire official city website.
          </Text>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {quickLinks.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className="border rounded-lg p-5 hover:border-primary-400 hover:shadow-sm transition"
                >
                  <Icon className="h-6 w-6 text-primary-600 mb-3" />
                  <h3 className="font-semibold text-lg text-gray-900">{item.label}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </Link>
              );
            })}
          </div>
        </Section>

        <ServicesSection />
      </main>
    </>
  );
};

export default Home;
