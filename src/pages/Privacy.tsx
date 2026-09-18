import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';

export default function Privacy() {
  return (
    <>
      <SEO title="Privacy" description="BetterMakati privacy information." />
      <Section className="bg-[#fffdf8]">
        <Heading>Privacy</Heading>
        <div className="prose max-w-3xl mt-6">
          <p>BetterMakati does not require an account for ordinary browsing.</p>
          <p>
            The visitor place finder may use Google Maps Platform when enabled. Use of Google Maps content is subject to the{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Google Privacy Policy</a>.
          </p>
          <p>
            Contributions submitted through GitHub are handled on GitHub and are subject to GitHub's own privacy terms.
          </p>
        </div>
      </Section>
    </>
  );
}
