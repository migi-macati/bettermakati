import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import SEO from '../components/SEO';

export default function About() {
  return (
    <>
      <SEO
        title="About & Sources"
        description="About BetterMakati, its source policy and correction process."
      />
      <Section className="p-3 mb-12">
        <Heading>About BetterMakati</Heading>
        <Text className="mb-4">
          BetterMakati is an independent, open-source civic information portal for Makati City. It is part of the BetterLGU community and is not an official website of the City Government of Makati.
        </Text>
        <Text className="mb-8">
          The official Makati website remains the authoritative place for city transactions and official announcements. BetterMakati's role is to make selected public information easier to find, understand and verify.
        </Text>

        <Heading level={2}>v1.0 scope</Heading>
        <ul className="list-disc pl-6 space-y-2 mb-8 text-gray-700">
          <li>Selected high-use public services</li>
          <li>Basic city government and office information</li>
          <li>Current barangay directory</li>
          <li>Primary-source transparency links</li>
          <li>Emergency and essential contacts</li>
        </ul>

        <Heading level={2}>Source policy</Heading>
        <Text className="mb-3">
          BetterMakati prioritizes primary sources: the City Government of Makati, national government agencies, official public institutions and enacted laws or public records.
        </Text>
        <Text className="mb-3">
          Each substantive page should identify its source and verification date. If a source is old, incomplete or potentially stale, the page should say so. BetterMakati does not fill gaps with invented data.
        </Text>
        <Text className="mb-8">
          Future calculated indicators will be explicitly labeled as BetterMakati calculations and will identify the inputs and methodology used.
        </Text>

        <Heading level={2}>Corrections and contributions</Heading>
        <Text className="mb-3">
          Corrections can be submitted through the project's public GitHub issue tracker. Proposed changes can also be made through GitHub pull requests.
        </Text>
        <p className="mb-2">
          <a className="text-primary-600 underline" href="https://github.com/migi-macati/bettermakati/issues" target="_blank" rel="noreferrer">Report a correction</a>
        </p>
        <p>
          <a className="text-primary-600 underline" href="https://github.com/migi-macati/bettermakati" target="_blank" rel="noreferrer">View the BetterMakati source code</a>
        </p>

        <p className="text-xs text-gray-500 mt-8">Page last reviewed: 18 September 2026.</p>
      </Section>
    </>
  );
}
