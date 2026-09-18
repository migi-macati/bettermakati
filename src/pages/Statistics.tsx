import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';

const psaUrl = 'https://psa.gov.ph/classification/psgc/barangays/1380300000';

const stats = [
  ['309,770', 'Population', '2024 POPCEN'],
  ['23', 'Barangays', 'PSGC'],
  ['1st', 'Income class', 'PSGC'],
  ['55,572', 'Pio Del Pilar population', 'Largest barangay by 2024 POPCEN'],
];

export default function Statistics() {
  return (
    <>
      <SEO
        title="Makati Statistics"
        description="Current basic Makati City statistics from the Philippine Statistics Authority."
      />
      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">City Information</div>
        <Heading>Makati Statistics</Heading>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {stats.map(([value, label, note]) => (
            <a
              key={label}
              href={psaUrl}
              target="_blank"
              rel="noreferrer"
              className="stat-card hover:border-primary-300 transition"
            >
              <div className="text-2xl md:text-3xl font-extrabold text-primary-800">{value}</div>
              <div className="font-semibold text-gray-900 mt-1">{label}</div>
              <div className="text-xs text-gray-500 mt-1">{note}</div>
            </a>
          ))}
        </div>

        <div className="mt-8">
          <a href={psaUrl} target="_blank" rel="noreferrer" className="brand-btn-secondary">
            Open PSA Makati profile
          </a>
        </div>
      </Section>
    </>
  );
}
