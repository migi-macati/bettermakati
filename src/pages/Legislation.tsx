import { BookOpen, FileText } from 'lucide-react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';

const links = [
  {
    title: 'Resolutions & Ordinances',
    description: 'Makati local legislation on the official city portal.',
    href: 'https://www.makati.gov.ph/content/resolutions-and-ordinances/author',
    icon: FileText,
  },
  {
    title: 'Makati City Charter',
    description: 'Republic Act No. 7854.',
    href: 'https://lawphil.net/statutes/repacts/ra1995/ra_7854_1995.html',
    icon: BookOpen,
  },
];

export default function Legislation() {
  return (
    <>
      <SEO
        title="Legislation"
        description="Makati resolutions, ordinances and city charter."
      />
      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">City Information</div>
        <Heading>Legislation</Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {links.map(item => {
            const Icon = item.icon;
            return (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-primary-300 hover:shadow-sm transition"
              >
                <Icon className="h-6 w-6 text-primary-700" />
                <h2 className="font-bold text-lg text-gray-950 mt-4">{item.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              </a>
            );
          })}
        </div>
      </Section>
    </>
  );
}
