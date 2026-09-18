import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import SEO from '../components/SEO';

const offices = [
  'Office of the City Mayor',
  'Office of the City Vice Mayor',
  'Offices of the Sangguniang Panlungsod Members',
  'Office of the City Administrator',
  'Finance Department',
  'Department of Engineering and Public Works',
  'Law Department',
  'Makati Health Department',
  'Assessment Department',
  'City Budget Department',
  'Urban Development Department',
  'International Relations Department',
  'Makati Social Welfare Department',
  'Information and Community Relations Department',
  'Youth and Sports Development Department',
  'Education Department',
  'Department of Environmental Services',
  'Public Safety Department',
];

const charterUrl = 'https://lawphil.net/statutes/repacts/ra1995/ra_7854_1995.html';

export default function Government() {
  return (
    <>
      <SEO
        title="Government"
        description="Makati City government leadership and offices."
      />
      <Section className="bg-[#fffdf8]">
        <Heading>Makati City Government</Heading>

        <div id="leadership" className="scroll-mt-28 grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-10">
          <div className="border rounded-lg p-5 bg-white">
            <div className="text-sm text-gray-500">City Mayor</div>
            <a
              href="https://www.pna.gov.ph/articles/1249992"
              target="_blank"
              rel="noreferrer"
              className="inline-block text-xl font-semibold mt-1 text-gray-950 underline decoration-primary-200 underline-offset-4 hover:text-primary-700"
            >
              Maria Lourdes Nancy S. Binay
            </a>
          </div>
          <div className="border rounded-lg p-5 bg-white">
            <div className="text-sm text-gray-500">City Vice Mayor</div>
            <a
              href="https://www.pna.gov.ph/articles/1249992"
              target="_blank"
              rel="noreferrer"
              className="inline-block text-xl font-semibold mt-1 text-gray-950 underline decoration-primary-200 underline-offset-4 hover:text-primary-700"
            >
              Romulo “Kid” Peña Jr.
            </a>
          </div>
        </div>

        <div id="council" className="scroll-mt-28">
          <Heading level={2}>City Council</Heading>
          <Text className="text-gray-700 mb-8">
            The Sangguniang Panlungsod is Makati's legislative body. Under the{' '}
            <a className="text-primary-700 underline underline-offset-2" href={charterUrl} target="_blank" rel="noreferrer">
              Makati City Charter
            </a>
            , the Vice Mayor serves as presiding officer.
          </Text>
        </div>

        <div id="offices" className="scroll-mt-28">
          <div className="flex items-baseline gap-3 mb-4">
            <Heading level={2}>City offices</Heading>
            <a className="text-sm text-primary-700 underline underline-offset-2" href={charterUrl} target="_blank" rel="noreferrer">
              Makati City Charter
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-10">
            {offices.map(office => (
              <div key={office} className="border-b py-2 text-gray-800">{office}</div>
            ))}
          </div>
        </div>

        <div id="city-hall" className="scroll-mt-28">
          <Heading level={2}>Makati City Hall</Heading>
          <div className="border rounded-lg p-5 bg-white">
            <p><strong>Trunkline:</strong> <a className="text-primary-700 underline" href="tel:+63288701000">+63 2 8870-1000</a></p>
            <p><strong>Email:</strong> <a className="text-primary-700 underline" href="mailto:makati@makati.gov.ph">makati@makati.gov.ph</a></p>
            <p><strong>Office hours:</strong> Monday to Friday, 8:00 AM–5:00 PM</p>
            <a className="inline-block text-sm text-primary-700 underline underline-offset-2 mt-3" href="https://www.makati.gov.ph/" target="_blank" rel="noreferrer">
              Official Makati City Web Portal
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
