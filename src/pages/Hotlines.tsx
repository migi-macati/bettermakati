import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import SEO from '../components/SEO';

export default function Hotlines() {
  return (
    <>
      <SEO
        title="Hotlines"
        description="Emergency and essential contact information for Makati City."
      />
      <Section className="p-3 mb-12">
        <Heading>Hotlines & Essential Contacts</Heading>

        <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6 mb-8">
          <div className="text-sm uppercase tracking-wide text-red-700 font-semibold">Emergency</div>
          <div className="text-4xl font-bold mt-1">911</div>
          <p className="text-gray-700 mt-2">
            The Philippines' Unified 911 hotline is free and available 24/7 for police, fire, medical, rescue and other emergencies.
          </p>
        </div>

        <Heading level={2}>Makati City Hall</Heading>
        <div className="border rounded-lg p-5 mb-6">
          <p><strong>Trunkline:</strong> +63 2 8870-1000</p>
          <p><strong>Email:</strong> makati@makati.gov.ph</p>
          <p><strong>Office hours:</strong> Monday to Friday, 8:00 AM–5:00 PM</p>
        </div>

        <Heading level={2}>Makati Action Center</Heading>
        <div className="border rounded-lg p-5 mb-6">
          <p><strong>General concerns / complaints:</strong> 8870-1000</p>
          <p><strong>District I monitoring:</strong> 8870-1432</p>
          <p><strong>District II monitoring:</strong> 8870-1401</p>
          <p><strong>Community and Patient Relations Unit:</strong> 8899-8948</p>
          <p className="text-sm text-gray-600 mt-2">These numbers are from the Makati Action Center Citizen's Charter document currently published on the city portal.</p>
        </div>

        <Heading level={2}>Makati DRRMO</Heading>
        <div className="border rounded-lg p-5 mb-8">
          <p><strong>Office:</strong> 20th Floor, Makati City Hall Building I, J.P. Rizal, Poblacion</p>
          <p><strong>Email:</strong> makatidrrmo@makati.gov.ph</p>
          <p className="mt-2">
            <a className="text-primary-600 underline" href="https://resilient.makati.gov.ph/" target="_blank" rel="noreferrer">Resilient Makati / DRRMO website</a>
          </p>
        </div>

        <Heading level={2}>Sources</Heading>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li><a className="text-primary-600 underline" href="https://ehotlines.e.gov.ph/" target="_blank" rel="noreferrer">PH Emergency Hotlines — official eGov directory</a></li>
          <li><a className="text-primary-600 underline" href="https://www.makati.gov.ph/assets/uploads/downloads/2/481/pdf/Makati%20Action%20Center.pdf" target="_blank" rel="noreferrer">Makati Action Center Citizen's Charter</a></li>
          <li><a className="text-primary-600 underline" href="https://www.makati.gov.ph/" target="_blank" rel="noreferrer">Official Makati City Web Portal</a></li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last verified by BetterMakati: 18 September 2026.</p>
      </Section>
    </>
  );
}
