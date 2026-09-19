import {
  ArrowRight,
  ExternalLink,
  Eye,
  FileSearch,
  Landmark,
  Network,
  Scale,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { Link } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';

const integritySources = [
  {
    title: 'Public-service ethics',
    body:
      'Republic Act No. 6713 sets norms of conduct for public officials and employees, including commitment to public interest, professionalism, political neutrality, responsiveness and openness of information.',
    href: 'https://lawphil.net/statutes/repacts/ra1989/pdf/ra_6713_1989.pdf',
    label: 'RA 6713',
    icon: Scale,
  },
  {
    title: 'Procurement integrity',
    body:
      'Republic Act No. 12009 applies transparency, competition, accountability, participatory procurement, sustainability and professionalism to government procurement, including LGUs.',
    href: 'https://lawphil.net/statutes/repacts/ra2024/ra_12009_2024.html',
    label: 'RA 12009',
    icon: FileSearch,
  },
  {
    title: 'Current procurement IRR',
    body:
      'The GPPB-approved IRR published in February 2025 is the controlling implementation reference identified by GPPB; a later “1st Edition, as of 31 March 2026” version was withdrawn.',
    href: 'https://lawphil.net/statutes/repacts/ra2025/irr_12009_2025.html',
    label: 'Official IRR',
    icon: Landmark,
  },
  {
    title: '2026 IRR advisory',
    body:
      'GPPB Public Advisory No. 09-2026 says a later “1st Edition, as of 31 March 2026” document was withdrawn and directs users back to the GPPB-approved IRR published in February 2025.',
    href: 'https://www.gppb.gov.ph/public-advisory-no-09-2026/',
    label: 'GPPB 2026 advisory',
    icon: ShieldCheck,
  },
  {
    title: 'Beneficial ownership',
    body:
      'The New Government Procurement Act requires beneficial-ownership information for participating legal entities and provides for a public registry framework to strengthen transparency and conflict-of-interest safeguards.',
    href: 'https://www.gppb.gov.ph/enhancing-transparency-beneficial-ownership-disclosure-under-ra-12009/',
    label: 'GPPB guidance',
    icon: Network,
  },
];

const gaps = [
  {
    title: 'Supplier and contractor graph',
    body:
      'BetterMakati does not yet normalize Makati awards, suppliers, contracts and amendments into a citywide reusable entity graph.',
  },
  {
    title: 'Beneficial ownership linkage',
    body:
      'BetterMakati does not yet connect public beneficial-ownership information to specific Makati procurement records.',
  },
  {
    title: 'Conflict and recusal records',
    body:
      'Conflict-of-interest, recusal or disclosure records are not yet systematically indexed. Absence from BetterMakati must never be treated as evidence that no such record exists.',
  },
  {
    title: 'Audit resolution trail',
    body:
      'COA findings are discoverable, but BetterMakati has not yet completed a finding → management response → corrective action → later audit trail.',
  },
];

export default function Integrity() {
  return (
    <>
      <SEO
        title="Integrity & Public Interest"
        description="BetterMakati’s factual integrity layer: public-service ethics, procurement transparency, beneficial ownership, audit records and integrity coverage gaps."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Integrity records</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Heading>Integrity & Public Interest</Heading>
            <p className="mt-2 max-w-4xl text-gray-700 leading-relaxed">
              Public-service ethics, procurement, ownership and audit records.
            </p>
          </div>
          <SharePage title="Integrity & Public Interest | BetterMakati" />
        </div>
        <LastReviewed
          date="19 September 2026"
          note="Evidence only; no person or entity is labeled without a supporting record."
        />
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Public standards</div>
        <Heading level={2}>Rules & records</Heading>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {integritySources.map(item => {
            const Icon = item.icon;
            return (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-primary-300 hover:shadow-sm"
              >
                <Icon className="h-6 w-6 text-primary-700" />
                <div className="mt-4 text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                  {item.label}
                </div>
                <h3 className="mt-1 text-lg font-extrabold text-gray-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.body}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                  Open source <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </a>
            );
          })}
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Related records</div>
        <Heading level={2}>Follow the evidence</Heading>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            {
              title: 'Money & projects',
              body: 'Trace budget, project, procurement and later implementation evidence.',
              href: '/projects-budget',
              icon: FileSearch,
            },
            {
              title: 'Accountability',
              body: 'Connect responsibility, target, evidence, reported status and known gaps.',
              href: '/accountability',
              icon: Eye,
            },
            {
              title: 'Public records',
              body: 'Open primary-source records and source-change history.',
              href: '/records',
              icon: Landmark,
            },
            {
              title: 'Participation',
              body: 'Keep public monitoring and participation beside decision-making and procurement.',
              href: '/participate',
              icon: Users,
            },
          ].map(item => {
            const Icon = item.icon;
            return (
              <Link key={item.title} to={item.href} className="rounded-2xl border border-primary-100 bg-white p-5">
                <Icon className="h-5 w-5 text-primary-700" />
                <h3 className="mt-3 font-extrabold text-gray-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.body}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                  Open <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Published gaps</div>
        <Heading level={2}>Coverage gaps</Heading>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-700">
          Missing links in the current index; not findings of wrongdoing.
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {gaps.map(gap => (
            <article key={gap.title} className="rounded-2xl border border-secondary-200 bg-secondary-50 p-5">
              <Scale className="h-5 w-5 text-secondary-800" />
              <h3 className="mt-3 font-extrabold text-gray-950">{gap.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">{gap.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link to="/open-government" className="brand-btn-primary">
            Open-government doctrine
          </Link>
          <Link to="/get-involved?type=source#submission" className="brand-btn-secondary">
            Share a public integrity source
          </Link>
        </div>
      </Section>
    </>
  );
}
