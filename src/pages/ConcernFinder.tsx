import ServiceSearch from '../components/home/ServiceSearch';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';

export default function ConcernFinder() {
  return (
    <>
      <SEO
        title="Saan Ako Lalapit?"
        description="Find the Makati office, service or channel for your concern."
      />
      <Section className="bg-[#fffdf8]">
        <div className="max-w-3xl mx-auto">
          <div className="section-eyebrow">Community Tool</div>
          <Heading>Saan Ako Lalapit?</Heading>
          <div className="mt-7">
            <ServiceSearch
              scope="site"
              title="Describe what you need"
              placeholder="e.g., complaint, scholarship, property tax"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
