import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import SEO from '../components/SEO';

const psaUrl = 'https://psa.gov.ph/classification/psgc/barangays/1380300000';

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

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export default function Barangays() {
  return (
    <>
      <SEO
        title="Barangays"
        description="The 23 barangays of Makati City with 2024 POPCEN population."
      />
      <Section className="bg-[#fffdf8]">
        <Heading>Barangays</Heading>
        <Text className="text-gray-600 mb-4">
          Makati has{' '}
          <a className="text-primary-700 underline underline-offset-2" href={psaUrl} target="_blank" rel="noreferrer">
            23 barangays
          </a>
          . Population figures are from the{' '}
          <a className="text-primary-700 underline underline-offset-2" href={psaUrl} target="_blank" rel="noreferrer">
            2024 Census of Population
          </a>
          .
        </Text>

        <div className="overflow-x-auto border rounded-lg bg-white">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 font-semibold">Barangay</th>
                <th className="p-3 font-semibold text-right">2024 population</th>
              </tr>
            </thead>
            <tbody>
              {barangays.map(([name, population]) => (
                <tr id={slug(name)} key={name} className="border-t scroll-mt-28">
                  <td className="p-3">{name}</td>
                  <td className="p-3 text-right">{population}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}
