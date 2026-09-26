import { useSearchParams } from 'react-router';
import SEO from '../components/SEO';
import ServiceSearch from '../components/home/ServiceSearch';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';

export default function Search() {
  const [params] = useSearchParams();
  const initialQuery = params.get('q') || '';

  return (
    <>
      <SEO
        title="Search"
        description="Search BetterMakati services, barangays, officials, records, places and civic tools."
        noIndex
      />
      <Section className="bg-[#fffdf8]">
        <div className="mx-auto max-w-3xl">
          <div className="section-eyebrow">Search</div>
          <Heading>Search BetterMakati</Heading>
          <p className="mb-6 text-gray-600">
            One search for services, barangays, civic places, officials, records,
            visitor information and community tools.
          </p>
          <ServiceSearch
            scope="site"
            title="What are you looking for?"
            placeholder="e.g., Yellow Card, Poblacion Park, budget, cinema"
            initialQuery={initialQuery}
          />
        </div>
      </Section>
    </>
  );
}
