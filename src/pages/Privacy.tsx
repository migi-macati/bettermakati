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
          <p>
            BetterMakati does not require an account for ordinary browsing and
            does not ask visitors to provide identity information to read public
            pages.
          </p>

          <h2>Browsing and technical logs</h2>
          <p>
            The hosting platform and serverless functions may process ordinary
            technical request information such as IP address, browser details,
            requested URL, timestamps and error logs for security and operation.
            BetterMakati does not use this notice to claim that hosting providers
            retain nothing.
          </p>

          <h2>Search and third-party services</h2>
          <p>
            Site-wide BetterMakati search runs against the site&apos;s own search
            index. Visitor place search may call Google Maps Platform when that
            integration is enabled. Live weather and air-quality cards request
            data from Open-Meteo. Opening an external link transfers you to that
            provider and its privacy terms.
          </p>
          <p>
            Google Maps content is subject to the{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
              Google Privacy Policy
            </a>
            .
          </p>

          <h2>Contributions</h2>
          <p>
            The BetterMakati contribution form asks only for the content needed
            to understand the submission. Do not submit passwords, government
            IDs, medical records or other sensitive personal information.
            Project submissions may be recorded as public GitHub issues for
            transparent follow-up.
          </p>

          <h2>Cookies and local storage</h2>
          <p>
            BetterMakati currently does not require advertising cookies or a
            user account. Third-party services reached from the site may use
            their own cookies or storage according to their policies.
          </p>

          <h2>Changes</h2>
          <p>
            This notice should be updated before BetterMakati introduces a new
            analytics, newsletter, account or data-collection feature that
            materially changes how visitor information is handled.
          </p>
        </div>
      </Section>
    </>
  );
}
