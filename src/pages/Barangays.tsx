import { ExternalLink, Home as HomeIcon } from 'lucide-react';
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

const associations = [
  {
    name: 'Bel-Air Village Association (BAVA)',
    barangay: 'Bel-Air',
    href: 'https://www.bava.ph/',
    linkLabel: 'Website',
  },
  {
    name: 'Dasmariñas Village Association (DVA)',
    barangay: 'Dasmariñas',
    href: 'https://dva.org.ph/',
    linkLabel: 'Website',
  },
  {
    name: 'Forbes Park Association (FPA)',
    barangay: 'Forbes Park',
    href: 'https://www.forbesparkassociation.com/',
    linkLabel: 'Website',
  },
  {
    name: 'Magallanes Village Association (MVA)',
    barangay: 'Magallanes',
    href: 'https://www.google.com/maps/search/?api=1&query=Magallanes%20Village%20Association%20Makati',
    linkLabel: 'Map',
  },
  {
    name: 'San Lorenzo Village Association (SLVA)',
    barangay: 'San Lorenzo',
    href: 'https://www.myslv.ph/',
    linkLabel: 'Website',
  },
  {
    name: 'Urdaneta Village Association (UVA)',
    barangay: 'Urdaneta',
    href: 'https://www.google.com/maps/search/?api=1&query=Urdaneta%20Village%20Association%20Makati',
    linkLabel: 'Map',
  },
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

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Residential communities</div>
        <Heading level={2}>Village & homeowners associations</Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
          {associations.map(association => (
            <article key={association.name} className="rounded-2xl border border-primary-100 bg-white p-5">
              <HomeIcon className="h-5 w-5 text-primary-700" />
              <h3 className="font-extrabold text-gray-950 mt-3">{association.name}</h3>
              <p className="text-sm text-gray-500 mt-1">Barangay {association.barangay}</p>
              <a
                href={association.href}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700"
              >
                {association.linkLabel} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
