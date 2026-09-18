import { AlertTriangle, Building2, HeartPulse, PhoneCall, ShieldAlert } from 'lucide-react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';

const contactCards = [
  {
    title: 'Makati City Hall',
    icon: Building2,
    lines: ['8870-1000', 'makati@makati.gov.ph', 'Mon–Fri, 8:00 AM–5:00 PM'],
  },
  {
    title: 'Makati Action Center',
    icon: PhoneCall,
    lines: ['General concerns: 8870-1000', 'District I: 8870-1432', 'District II: 8870-1401'],
  },
  {
    title: 'Patient Relations',
    icon: HeartPulse,
    lines: ['Community and Patient Relations Unit', '8899-8948'],
  },
  {
    title: 'Makati DRRMO',
    icon: ShieldAlert,
    lines: ['20/F Makati City Hall Building I', 'makatidrrmo@makati.gov.ph'],
  },
];

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

        <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-6 md:p-8 mb-8 flex flex-col md:flex-row md:items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <div className="text-sm uppercase tracking-[0.12em] text-red-700 font-bold">National emergency hotline</div>
            <div className="text-4xl md:text-5xl font-extrabold mt-1 text-gray-950">911</div>
            <p className="text-gray-700 mt-2">
              Free and available 24/7 for police, fire, medical, rescue and other emergencies.
            </p>
          </div>
          <a href="tel:911" className="brand-btn-primary !bg-red-700 hover:!bg-red-800 self-start md:self-center">
            Call 911 <PhoneCall className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {contactCards.map(card => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="rounded-2xl border border-[#e8dfd0] bg-white p-5 shadow-sm">
                <Icon className="h-6 w-6 text-primary-700" />
                <h2 className="font-bold text-lg text-gray-950 mt-3 mb-2">{card.title}</h2>
                <div className="space-y-1 text-sm text-gray-700">
                  {card.lines.map(line => <p key={line}>{line}</p>)}
                </div>
              </div>
            );
          })}
        </div>

        <Heading level={2}>Sources</Heading>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li><a className="text-primary-700 underline" href="https://ehotlines.e.gov.ph/" target="_blank" rel="noreferrer">PH Emergency Hotlines — official eGov directory</a></li>
          <li><a className="text-primary-700 underline" href="https://www.makati.gov.ph/assets/uploads/downloads/2/481/pdf/Makati%20Action%20Center.pdf" target="_blank" rel="noreferrer">Makati Action Center Citizen's Charter</a></li>
          <li><a className="text-primary-700 underline" href="https://www.makati.gov.ph/" target="_blank" rel="noreferrer">Official Makati City Web Portal</a></li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">Last verified by BetterMakati: 18 September 2026.</p>
      </Section>
    </>
  );
}
