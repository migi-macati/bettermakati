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
          BetterMakati is an independent, open-source civic information portal for Makati City. It is part of the BetterLGU community and is not an official website of the City Government of Makati.
        </Text>
        <Text className="mb-8">
          The official Makati website remains the authoritative place for city transactions and announcements. BetterMakati organizes public information and links back to the records behind it.
        </Text>

        <Heading level={2}>Sources</Heading>
        <Text className="mb-3">
          BetterMakati prioritizes the City Government of Makati, the Philippine Statistics Authority, national government agencies, official public institutions, enacted laws and public records.
        </Text>
        <Text className="mb-8">
          Information that is old, incomplete or uncertain should be identified as such. BetterMakati does not fill gaps with invented data.
        </Text>

        <Heading level={2}>Corrections and contributions</Heading>
        <Text className="mb-3">
          Corrections and proposed changes can be submitted through GitHub.
        </Text>
        <p className="mb-2">
          <a className="text-primary-700 underline" href="https://github.com/migi-macati/bettermakati/issues" target="_blank" rel="noreferrer">Report a correction</a>
        </p>
        <p>
          <a className="text-primary-700 underline" href="https://github.com/migi-macati/bettermakati" target="_blank" rel="noreferrer">View the BetterMakati source code</a>
        </p>
      </Section>
    </>
  );
}
