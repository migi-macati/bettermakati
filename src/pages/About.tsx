import { ExternalLink, ShieldCheck } from 'lucide-react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import SEO from '../components/SEO';

export default function About() {
  return (
    <>
      <SEO
        title="About"
        description="About BetterMakati, its source policy and correction process."
      />
      <Section className="p-3 mb-12">
        <div className="section-eyebrow">About the project</div>
        <Heading>BetterMakati</Heading>
        <Text className="mb-4">
          BetterMakati is an independent, open-source civic information portal
          for Makati City. It is part of the BetterLGU community and is not an
          official website of the City Government of Makati.
        </Text>
        <Text className="mb-8">
          The official Makati website remains the authoritative place for city
          transactions and announcements. BetterMakati organizes public
          information and links back to the records behind it.
        </Text>

        <div className="mb-10 rounded-2xl border border-primary-100 bg-primary-50 p-5 md:p-6">
          <div className="flex items-start gap-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-primary-700">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-extrabold text-gray-950">
                How to verify information
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                Use the source link beside each claim. For transactions,
                announcements, or sensitive personal information, confirm the
                details on the{' '}
                <a
                  href="https://www.makati.gov.ph/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-primary-800 underline underline-offset-2"
                >
                  official Makati City website{' '}
                  <ExternalLink className="inline h-3.5 w-3.5" />
                </a>{' '}
                before acting.
              </p>
              <p className="mt-2 text-xs text-gray-600">
                If a page is wrong or stale, use{' '}
                <a
                  href="https://github.com/migi-macati/bettermakati/issues"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-primary-800 underline underline-offset-2"
                >
                  GitHub Issues
                </a>{' '}
                to report it.
              </p>
            </div>
          </div>
        </div>

        <Heading level={2}>Sources</Heading>
        <Text className="mb-3">
          BetterMakati prioritizes the City Government of Makati, the Philippine
          Statistics Authority, national government agencies, official public
          institutions, enacted laws and public records.
        </Text>
        <Text className="mb-3">
          Source links appear beside the facts, figures and records they
          support. Where a direct report or dataset is available, the link opens
          that specific record rather than a general agency homepage.
        </Text>
        <Text className="mb-8">
          Time series keep approved budgets separate from reported receipts and
          expenditures. Census trends use comparable geographic boundaries, and
          any material boundary or definition change is stated beside the data.
          Information that is old, incomplete or uncertain is identified rather
          than filled with estimates.
        </Text>

        <Heading level={2}>Corrections and contributions</Heading>
        <Text className="mb-3">
          Corrections and proposed changes can be submitted through GitHub.
        </Text>
        <p className="mb-2">
          <a
            className="text-primary-700 underline"
            href="https://github.com/migi-macati/bettermakati/issues"
            target="_blank"
            rel="noreferrer"
          >
            Report a correction
          </a>
        </p>
        <p>
          <a
            className="text-primary-700 underline"
            href="https://github.com/migi-macati/bettermakati"
            target="_blank"
            rel="noreferrer"
          >
            View the BetterMakati source code
          </a>
        </p>
      </Section>
    </>
  );
}
