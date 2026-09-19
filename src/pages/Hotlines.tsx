import {
  AlertTriangle,
  Building2,
  HeartPulse,
  PhoneCall,
  ShieldAlert,
} from 'lucide-react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import LastReviewed from '../components/ui/LastReviewed';

const actionCenterSource =
  'https://www.makati.gov.ph/assets/uploads/downloads/2/481/pdf/Makati%20Action%20Center.pdf';

const contactCards = [
  {
    title: 'Makati City Hall',
    icon: Building2,
    href: 'https://www.makati.gov.ph/',
    lines: ['8870-1000', 'makati@makati.gov.ph', 'Mon–Fri, 8:00 AM–5:00 PM'],
  },
  {
    title: 'Makati Action Center',
    icon: PhoneCall,
    href: actionCenterSource,
    lines: [
      'General concerns: 8870-1000',
      'District I: 8870-1432',
      'District II: 8870-1401',
    ],
  },
  {
    title: 'Patient Relations',
    icon: HeartPulse,
    href: actionCenterSource,
    lines: ['Community and Patient Relations Unit', '8899-8948'],
  },
  {
    title: 'Makati DRRMO',
    icon: ShieldAlert,
    href: 'https://resilient.makati.gov.ph/',
    lines: ['20/F Makati City Hall Building I', 'makatidrrmo@makati.gov.ph'],
  },
];

const phoneFromLine = (line: string) => {
  const match = line.match(/(\d{3,4}-\d{3,4})$/);
  return match ? `tel:+632${match[1].replace('-', '')}` : null;
};

export default function Hotlines() {
  return (
    <>
      <SEO
        title="Hotlines"
        description="Emergency and essential contact information for Makati City."
      />
      <Section className="p-3 mb-12">
        <div className="section-eyebrow">Essential contacts</div>
        <Heading>Hotlines & Emergency Information</Heading>
        <LastReviewed note="Confirm urgent contact details with the linked official source when possible." />

        <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-6 md:p-8 mb-8 flex flex-col md:flex-row md:items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <a
              href="https://ehotlines.e.gov.ph/"
              target="_blank"
              rel="noreferrer"
              className="text-sm uppercase tracking-[0.12em] text-red-700 font-bold underline underline-offset-2"
            >
              National emergency hotline
            </a>
            <div className="text-4xl md:text-5xl font-extrabold mt-1 text-gray-950">
              911
            </div>
            <p className="text-gray-700 mt-2">
              Police, fire, medical, rescue and other emergencies.
            </p>
          </div>
          <a
            href="tel:911"
            className="brand-btn-primary !bg-red-700 hover:!bg-red-800 self-start md:self-center"
          >
            Call 911 <PhoneCall className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contactCards.map(card => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="rounded-2xl border border-[#e8dfd0] bg-white p-5 shadow-sm"
              >
                <Icon className="h-6 w-6 text-primary-700" />
                <a
                  href={card.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block font-bold text-lg text-gray-950 mt-3 mb-2 underline decoration-primary-200 underline-offset-4 hover:text-primary-700"
                >
                  {card.title}
                </a>
                <div className="space-y-1 text-sm text-gray-700">
                  {card.lines.map(line => {
                    const phoneHref = phoneFromLine(line);
                    if (line.includes('@')) {
                      return (
                        <p key={line}>
                          <a
                            href={`mailto:${line}`}
                            className="underline underline-offset-2 hover:text-primary-700"
                          >
                            {line}
                          </a>
                        </p>
                      );
                    }
                    if (phoneHref) {
                      return (
                        <p key={line}>
                          <a
                            href={phoneHref}
                            className="underline underline-offset-2 hover:text-primary-700"
                          >
                            {line}
                          </a>
                        </p>
                      );
                    }
                    return <p key={line}>{line}</p>;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </>
  );
}
