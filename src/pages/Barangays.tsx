import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import SEO from '../components/SEO';

const barangays = [
  ['Bangkal', '18,013'],
  ['Bel-Air', '39,354'],
  ['Carmona', '3,034'],
  ['Dasmariñas', '4,320'],
  ['Forbes Park', '4,183'],
  ['Guadalupe Nuevo', '21,596'],
  ['Guadalupe Viejo', '13,525'],
  ['Kasilawan', '5,007'],
  ['La Paz', '6,682'],
  ['Magallanes', '5,473'],
  ['Olympia', '19,035'],
  ['Palanan', '11,934'],
  ['Pinagkaisahan', '5,323'],
  ['Pio Del Pilar', '55,572'],
  ['Poblacion', '17,088'],
  ['San Antonio', '18,012'],
  ['San Isidro', '6,260'],
  ['San Lorenzo', '14,793'],
  ['Santa Cruz', '6,744'],
  ['Singkamas', '7,485'],
  ['Tejeros', '16,019'],
  ['Urdaneta', '4,720'],
  ['Valenzuela', '5,598'],
];

export default function Barangays() {
  return (
    <>
      <SEO
        title="Barangays"
        description="The current 23 barangays of Makati City with 2024 POPCEN population."
      />
      <Section className="p-3 mb-12">
        <Heading>Barangays</Heading>
        <Text className="text-gray-600 mb-4">
          The Philippine Statistics Authority currently lists 23 barangays in the City of Makati. Population figures below are from the 2024 Census of Population.
        </Text>
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 font-semibold">Barangay</th>
                <th className="p-3 font-semibold text-right">2024 population</th>
              </tr>
            </thead>
            <tbody>
              {barangays.map(([name, population]) => (
                <tr key={name} className="border-t">
                  <td className="p-3">{name}</td>
                  <td className="p-3 text-right">{population}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 rounded-lg bg-gray-50 p-5">
          <Heading level={3}>Why 23, not 33?</Heading>
          <Text className="text-gray-700">
            Older Makati documents can still show 33 barangays. BetterMakati uses the current Philippine Standard Geographic Code rather than carrying the older count forward.
          </Text>
        </div>

        <Heading level={2}>Source</Heading>
        <p>
          <a className="text-primary-600 underline" href="https://psa.gov.ph/classification/psgc/barangays/1380300000" target="_blank" rel="noreferrer">
            Philippine Statistics Authority — City of Makati, PSGC
          </a>
        </p>
        <p className="text-xs text-gray-500 mt-4">Last verified by BetterMakati: 18 September 2026.</p>
      </Section>
    </>
  );
}
