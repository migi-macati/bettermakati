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
          <p>
            BetterMakati is an independent civic information portal and not an
            official City Government of Makati website.
          </p>

          <h2>Official information controls</h2>
          <p>
            Official agencies and service providers remain the controlling
            sources for transactions, schedules, fees, requirements, emergency
            instructions, election procedures and legal records. BetterMakati
            can summarize and organize those records but does not replace them.
          </p>

          <h2>Accuracy and freshness</h2>
          <p>
            BetterMakati aims to identify source dates, review dates and
            uncertainty where they matter. Public records and third-party
            information can change after publication. Users should follow the
            cited source for a time-sensitive or consequential action.
          </p>

          <h2>External services</h2>
          <p>
            External sites, maps, schedules and booking services are operated by
            their respective providers. BetterMakati is not responsible for
            their availability or transactions. When Google Maps Platform is
            used, Google Maps content is subject to the{' '}
            <a href="https://cloud.google.com/maps-platform/terms" target="_blank" rel="noreferrer">
              Google Maps Platform Terms of Service
            </a>
            .
          </p>

          <h2>Emergency use</h2>
          <p>
            Do not rely on BetterMakati as the sole channel during an emergency.
            In the Philippines, the national emergency hotline is 911; official
            emergency authorities control instructions during an incident.
          </p>

          <h2>Civic Map community content</h2>
          <p>
            Civic Map reports, ratings, proposals and comments are
            community-submitted information. They are not official government
            findings, case numbers, approvals or commitments unless BetterMakati
            separately documents the relevant official record. BetterMakati may
            consolidate duplicate submissions, moderate content, correct
            categorization, or remove content that is unsafe, irrelevant,
            abusive, privacy-invasive or unsupported.
          </p>
          <p>
            Contributors should describe observable conditions and avoid
            publishing sensitive personal information, unverified accusations
            or unnecessary identifying information about individual workers,
            drivers or bystanders. Ordinary Civic Map submission does not
            guarantee that any government body will act on or receive the
            report.
          </p>

          <h2>Open-source project</h2>
          <p>
            BetterMakati&apos;s source code and change history are publicly
            viewable on GitHub. Third-party records, logos, maps and linked
            content remain subject to their own rights and terms.
          </p>
        </div>
      </Section>
    </>
  );
}
