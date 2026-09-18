import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import SEO from '../components/SEO';

export default function About() {
  return (
    <>
      <SEO
        title="About & Sources"
        description="About BetterMakati, its source policy, independent brand and correction process."
      />
      <Section className="p-3 mb-12">
        <div className="section-eyebrow">About the project</div>
        <Heading>BetterMakati</Heading>
        <Text className="mb-4">
          BetterMakati is an independent, open-source civic information portal for Makati City. It is part of the BetterLGU community and is not an official website of the City Government of Makati.
        </Text>
        <Text className="mb-8">
          The official Makati website remains the authoritative place for city transactions and official announcements. BetterMakati's role is to make selected public information easier to find, understand and verify.
        </Text>

        <Heading level={2}>Independent Makati-inspired identity</Heading>
        <Text className="mb-3">
          BetterMakati does not use the official City seal as its project logo. Its independent visual identity instead takes inspiration from Makati civic symbolism: golden yellow for wealth and prosperity, green for life and progressive Makati, and a blue wave motif recalling the waterways associated with the city's name.
        </Text>
        <Text className="mb-8">
          This keeps the portal recognizably Makati while avoiding the impression that BetterMakati is an official government website.
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
          BetterMakati prioritizes primary sources: the City Government of Makati, the Philippine Statistics Authority, national government agencies, official public institutions, enacted laws and public records.
        </Text>
        <Text className="mb-3">
          Each substantive page should identify its source and verification date. If a source is old, incomplete or potentially stale, the page should say so. BetterMakati does not fill gaps with invented data.
        </Text>
        <Text className="mb-8">
          Future calculated indicators will be explicitly labeled as BetterMakati calculations and will identify the inputs and methodology used.
        </Text>

        <Heading level={2}>Brand and civic references</Heading>
        <ul className="list-disc pl-6 space-y-2 mb-8 text-sm">
          <li><a className="text-primary-700 underline" href="https://rssoncr.psa.gov.ph/sites/default/files/CIF%20CITY%20OF%20MAKATI%202022.pdf" target="_blank" rel="noreferrer">PSA NCR — City of Makati Countryside in Figures 2022, seals and logos</a></li>
          <li><a className="text-primary-700 underline" href="https://www.makati.gov.ph/assets/uploads/staticmenu/docs/1653640559352.pdf" target="_blank" rel="noreferrer">City of Makati — Quick Facts 2021</a></li>
        </ul>

        <Heading level={2}>Corrections and contributions</Heading>
        <Text className="mb-3">
          Corrections can be submitted through the project's public GitHub issue tracker. Proposed changes can also be made through GitHub pull requests.
        </Text>
        <p className="mb-2">
          <a className="text-primary-700 underline" href="https://github.com/migi-macati/bettermakati/issues" target="_blank" rel="noreferrer">Report a correction</a>
        </p>
        <p>
          <a className="text-primary-700 underline" href="https://github.com/migi-macati/bettermakati" target="_blank" rel="noreferrer">View the BetterMakati source code</a>
        </p>

        <p className="text-xs text-gray-500 mt-8">Page last reviewed: 18 September 2026.</p>
      </Section>
    </>
  );
}
