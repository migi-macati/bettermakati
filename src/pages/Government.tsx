import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import SEO from '../components/SEO';

const offices = [
  'Office of the City Mayor',
  'Office of the City Vice Mayor',
  'Sangguniang Panlungsod and Office of the Sangguniang Panlungsod Secretary',
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
  'Office of the City Building Official',
  'City Civil Registration Office',
  'General Services Department',
  'Makati Action Center',
  'Ospital ng Makati',
];

export default function Government() {
  return (
    <>
      <SEO
        title="Government"
        description="Verified basic information about Makati City government, leadership and offices."
      />
      <Section className="p-3 mb-12">
        <Heading>Makati City Government</Heading>
        <Text className="text-gray-600 mb-8">
          Basic institutional information only. BetterMakati does not rate, endorse or evaluate political officials.
        </Text>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="border rounded-lg p-5">
            <div className="text-sm text-gray-500">City Mayor</div>
            <div className="text-xl font-semibold mt-1">Maria Lourdes Nancy S. Binay</div>
            <p className="text-sm text-gray-600 mt-2">
              Proclaimed after the May 2025 local election. Her name also appears as City Mayor on Makati's CY 2025 fourth-quarter development-fund disclosure published in 2026.
            </p>
          </div>
          <div className="border rounded-lg p-5">
            <div className="text-sm text-gray-500">City Vice Mayor</div>
            <div className="text-xl font-semibold mt-1">Romulo “Kid” Peña Jr.</div>
            <p className="text-sm text-gray-600 mt-2">
              Reelected vice mayor in the May 2025 local election, according to the Makati City Board of Canvassers proclamation reported by the Philippine News Agency.
            </p>
          </div>
        </div>

        <Heading level={2}>City Council</Heading>
        <Text className="text-gray-700 mb-8">
          The Sangguniang Panlungsod is Makati's legislative body. Under the Makati City Charter, the Vice Mayor presides over the council. BetterMakati will add a fully sourced member-by-member directory after the current council roster is verified against an authoritative city source.
        </Text>

        <Heading level={2}>Selected city offices</Heading>
        <Text className="text-gray-600 mb-4">
          This v1.0 directory uses the Makati City Charter and an official city profile for the office structure. It lists offices, not current department heads, until those appointments are separately verified.
        </Text>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-10">
          {offices.map(office => (
            <div key={office} className="border-b py-2 text-gray-800">{office}</div>
          ))}
        </div>

        <Heading level={2}>City Hall contact</Heading>
        <div className="border rounded-lg p-5 mb-10">
          <p><strong>Trunkline:</strong> +63 2 8870-1000</p>
          <p><strong>Email:</strong> makati@makati.gov.ph</p>
          <p><strong>Office hours:</strong> Monday to Friday, 8:00 AM–5:00 PM</p>
        </div>

        <Heading level={2}>Sources</Heading>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li><a className="text-primary-600 underline" href="https://www.pna.gov.ph/articles/1249992" target="_blank" rel="noreferrer">Philippine News Agency — 2025 Makati proclamation</a></li>
          <li><a className="text-primary-600 underline" href="https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/Q4%2020%20NTAU.pdf" target="_blank" rel="noreferrer">City of Makati — CY 2025 Q4 20% NTA utilization disclosure</a></li>
          <li><a className="text-primary-600 underline" href="https://issuances-library.senate.gov.ph/legislative%2Bissuances/Republic%20Act%20No.%207854" target="_blank" rel="noreferrer">Republic Act No. 7854 — Makati City Charter</a></li>
          <li><a className="text-primary-600 underline" href="https://www.makati.gov.ph/" target="_blank" rel="noreferrer">Official Makati City Web Portal</a></li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last verified by BetterMakati: 18 September 2026.</p>
      </Section>
    </>
  );
}
