import type { ComponentType } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Database,
  Download,
  ExternalLink,
  Eye,
  Globe2,
  Landmark,
  LockKeyhole,
  MessagesSquare,
  Radio,
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
import {
  doctrineFoundations,
  doctrinePrinciples,
  doctrineReviewed,
  doctrineSources,
  doctrineStatusLabel,
  oecdProvisionAudit,
} from '../data/openGovernmentDoctrine';

const principleIcons = {
  transparency: Eye,
  accountability: ClipboardCheck,
  participation: MessagesSquare,
  presence: Radio,
  integrity: ShieldCheck,
};

const foundationIcons: Record<string, ComponentType<{ className?: string }>> = {
  inclusion: Users,
  privacy: LockKeyhole,
  accessibility: Globe2,
  evidence: CheckCircle2,
  'open-data': Database,
  'civic-space': MessagesSquare,
  institutionalization: Landmark,
  evaluation: Scale,
};

const statusClass = {
  implemented: 'border-success-200 bg-success-50 text-success-800',
  partial: 'border-primary-200 bg-primary-50 text-primary-800',
  early: 'border-secondary-200 bg-secondary-50 text-secondary-900',
  'institution-dependent': 'border-gray-200 bg-gray-50 text-gray-700',
};

const auditCsv = [
  'framework,item,status,better_makati_evidence_or_role,gap_or_institutional_dependency',
  ...doctrinePrinciples.map(item =>
    [
      'BetterMakati doctrine',
      item.name,
      doctrineStatusLabel[item.status],
      item.evidence.join(' | '),
      item.gaps.join(' | '),
    ]
      .map(value => '"' + String(value).replaceAll('"', '""') + '"')
      .join(',')
  ),
  ...doctrineFoundations.map(item =>
    [
      'Cross-cutting foundation',
      item.name,
      doctrineStatusLabel[item.status],
      item.evidence.join(' | '),
      item.gaps.join(' | '),
    ]
      .map(value => '"' + String(value).replaceAll('"', '""') + '"')
      .join(',')
  ),
  ...oecdProvisionAudit.map(item =>
    [
      'OECD Recommendation provision',
      item.number + '. ' + item.title,
      doctrineStatusLabel[item.status],
      item.betterMakatiRole,
      item.institutionalDependency,
    ]
      .map(value => '"' + String(value).replaceAll('"', '""') + '"')
      .join(',')
  ),
].join('\n');

export default function OpenGovernment() {
  return (
    <>
      <SEO
        title="Open Government Doctrine"
        description="BetterMakati’s living open-government doctrine and self-audit across transparency, accountability, participation, presence, integrity and enabling foundations."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Open Makati</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Heading>BetterMakati Open Government Doctrine</Heading>
            <p className="mt-2 max-w-4xl text-gray-700 leading-relaxed">
              A living self-audit for BetterMakati. It applies to this project, not the City Government of Makati.
            </p>
          </div>
          <SharePage title="BetterMakati Open Government Doctrine" />
        </div>

        <LastReviewed
          date={doctrineReviewed}
          note="Status refers to BetterMakati coverage or institutional dependency."
        />

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={`data:text/csv;charset=utf-8,${encodeURIComponent(auditCsv)}`}
            download="bettermakati-open-government-audit.csv"
            className="brand-btn-secondary"
          >
            <Download className="h-4 w-4" /> Download audit CSV
          </a>
          <Link to="/integrity" className="brand-btn-primary">
            Integrity & public interest <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      <Section className="bg-primary-950 text-white">
        <div className="section-eyebrow !text-secondary-200">The doctrine</div>
        <Heading level={2} className="!text-white">Five operating principles</Heading>

        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {doctrinePrinciples.map(item => {
            const Icon = principleIcons[item.id as keyof typeof principleIcons];
            return (
              <Link
                key={item.id}
                to={item.href}
                className="rounded-2xl border border-white/15 bg-white/5 p-5 transition hover:bg-white/10"
              >
                <Icon className="h-6 w-6 text-secondary-200" />
                <div className="mt-4 text-xs font-bold uppercase tracking-[0.08em] text-secondary-200">
                  {item.verb}
                </div>
                <h3 className="mt-1 text-lg font-extrabold text-white">{item.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-primary-100">
                  {item.promise}
                </p>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Living self-audit</div>
        <Heading level={2}>Implementation status</Heading>

        <div className="mt-7 space-y-5">
          {doctrinePrinciples.map(item => {
            const Icon = principleIcons[item.id as keyof typeof principleIcons];
            return (
              <article
                key={item.id}
                id={item.id}
                className="scroll-mt-28 rounded-2xl border border-gray-200 bg-[#fffdf8] p-6"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-700">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                        {item.verb}
                      </div>
                      <h3 className="text-xl font-extrabold text-gray-950">{item.name}</h3>
                    </div>
                  </div>
                  <span className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-bold ${statusClass[item.status]}`}>
                    {doctrineStatusLabel[item.status]}
                  </span>
                </div>

                <p className="mt-4 max-w-4xl text-sm leading-relaxed text-gray-700">
                  {item.description}
                </p>

                <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-success-200 bg-success-50 p-4">
                    <h4 className="font-extrabold text-gray-950">What exists</h4>
                    <ul className="mt-2 space-y-2 text-sm text-gray-700">
                      {item.evidence.map(entry => <li key={entry}>• {entry}</li>)}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-secondary-200 bg-secondary-50 p-4">
                    <h4 className="font-extrabold text-gray-950">What remains</h4>
                    <ul className="mt-2 space-y-2 text-sm text-gray-700">
                      {item.gaps.map(entry => <li key={entry}>• {entry}</li>)}
                    </ul>
                  </div>
                </div>

                <Link to={item.href} className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                  Open the working product <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Cross-cutting requirements</div>
        <Heading level={2}>Foundations</Heading>

        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctrineFoundations.map(item => {
            const Icon = foundationIcons[item.id] || Scale;
            return (
              <article key={item.id} className="rounded-2xl border border-primary-100 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <Icon className="h-5 w-5 text-primary-700" />
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${statusClass[item.status]}`}>
                    {doctrineStatusLabel[item.status]}
                  </span>
                </div>
                <h3 className="mt-3 font-extrabold text-gray-950">{item.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.description}</p>
                <div className="mt-4 text-xs font-bold uppercase tracking-[0.08em] text-primary-700">Existing</div>
                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                  {item.evidence.map(entry => <li key={entry}>• {entry}</li>)}
                </ul>
                <div className="mt-4 text-xs font-bold uppercase tracking-[0.08em] text-secondary-800">Gap</div>
                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                  {item.gaps.map(entry => <li key={entry}>• {entry}</li>)}
                </ul>
              </article>
            );
          })}
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">International benchmark</div>
        <Heading level={2}>OECD 10-provision implementation audit</Heading>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-700">
          Separates project capabilities from actions requiring government adoption.
        </p>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-primary-950 text-white">
              <tr>
                <th className="px-4 py-3">Provision</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">BetterMakati can do</th>
                <th className="px-4 py-3">Institutional dependency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {oecdProvisionAudit.map(item => (
                <tr key={item.number} className="align-top">
                  <td className="px-4 py-4 font-bold text-gray-950">
                    {item.number}. {item.title}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusClass[item.status]}`}>
                      {doctrineStatusLabel[item.status]}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-700">{item.betterMakatiRole}</td>
                  <td className="px-4 py-4 text-gray-600">{item.institutionalDependency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Standards used</div>
        <Heading level={2}>Reference standards</Heading>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {doctrineSources.map(source => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-primary-300"
            >
              <Scale className="h-5 w-5 text-primary-700" />
              <h3 className="mt-3 font-extrabold text-gray-950">{source.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{source.note}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                Open standard <ExternalLink className="h-3.5 w-3.5" />
              </span>
            </a>
          ))}
        </div>
      </Section>
    </>
  );
}
