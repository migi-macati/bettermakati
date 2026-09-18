import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import SEO from '../components/SEO';

export default function About() {
  return (
    <>
      <SEO
        title="About"
        description="About BetterMakati, an independent BetterLGU civic information portal for Makati City."
      />
      <Section className="p-3 mb-12">
        <Heading>About BetterMakati</Heading>
        <Text className="mb-4">
          BetterMakati is an independent, open-source civic information portal for Makati City.
        </Text>
        <Text className="mb-4">
          It is part of the BetterLGU community and is not an official website of the City Government of Makati.
        </Text>
        <Heading level={2}>Sources and corrections</Heading>
        <Text className="mb-4">
          BetterMakati aims to publish information only when it can be traced to reliable public sources. Source links and verification dates will be added as the v1.0 dataset is built.
        </Text>
        <Text>
          Project repository: https://github.com/migi-macati/bettermakati
        </Text>
      </Section>
    </>
  );
}
