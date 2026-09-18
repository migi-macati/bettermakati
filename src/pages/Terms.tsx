import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';

export default function Terms() {
  return (
    <>
      <SEO title="Terms" description="BetterMakati terms of use." />
      <Section className="bg-[#fffdf8]">
        <Heading>Terms of Use</Heading>
        <div className="prose max-w-3xl mt-6">
          <p>BetterMakati is an independent civic information portal and not an official City Government of Makati website.</p>
          <p>Official agencies and service providers remain the controlling sources for transactions, schedules, fees and requirements.</p>
          <p>
            When Google Maps Platform is used, Google Maps content is subject to the{' '}
            <a href="https://cloud.google.com/maps-platform/terms" target="_blank" rel="noreferrer">Google Maps Platform Terms of Service</a>.
          </p>
        </div>
      </Section>
    </>
  );
}
