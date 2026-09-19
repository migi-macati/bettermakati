import { Home, Search } from 'lucide-react';
import { Link } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import ServiceSearch from '../components/home/ServiceSearch';

export default function NotFound() {
  return (
    <>
      <SEO
        title="Page not found"
        description="The BetterMakati page you requested could not be found."
        noIndex
      />
      <Section className="bg-[#fffdf8]">
        <div className="mx-auto max-w-3xl">
          <div className="section-eyebrow">404</div>
          <Heading>We couldn’t find that page</Heading>
          <p className="max-w-2xl text-gray-700">
            The address may have changed, or the information may now live
            somewhere else in BetterMakati.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/" className="brand-btn-primary">
              <Home className="h-4 w-4" /> Home
            </Link>
            <Link to="/search" className="brand-btn-secondary">
              <Search className="h-4 w-4" /> Search BetterMakati
            </Link>
          </div>
          <div className="mt-9">
            <ServiceSearch
              scope="site"
              title="Find the information instead"
              placeholder="Try a service, barangay, official, place or topic"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
