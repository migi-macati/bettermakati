import { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  MessagesSquare,
  Scale,
  Send,
  Users,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';
import {
  documentedParticipation,
  openParticipationOpportunities,
  participationCoverageGaps,
  participationReviewed,
} from '../data/participation';

interface CommunityInput {
  number: number;
  title: string;
  state: 'open' | 'closed';
  workflowStatus?: string;
  url: string;
  updatedAt: string;
  comments: number;
  kind: string;
}

export default function Participate() {
  const [params] = useSearchParams();
  const barangayContext = params.get('barangay');
  const [inputs, setInputs] = useState<CommunityInput[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/community-input');
        const data = await response.json();
        if (response.ok && Array.isArray(data.items)) setInputs(data.items);
      } catch {
        setInputs([]);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <>
      <SEO
        title="Participate"
        description="Find civic participation opportunities in Makati and track BetterMakati community proposals, corrections and public-source submissions."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Participation</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Heading>Participate in Makati</Heading>
            <p className="max-w-3xl text-gray-700">
              Find public consultations and track proposals, sources and corrections submitted through BetterMakati.
            </p>
          </div>
          <SharePage title="Participate in Makati | BetterMakati" />
        </div>
        <LastReviewed
          date={participationReviewed}
          note="Official opportunities and BetterMakati submissions are labeled separately."
        />

        {barangayContext && (
          <div className="mt-6 rounded-xl border border-primary-200 bg-primary-50 p-4 text-sm text-gray-700">
            Local context: <strong>{barangayContext.replaceAll('-', ' ')}</strong>. No complete barangay-assembly calendar is indexed yet.
          </div>
        )}

        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-primary-100 bg-white p-6">
            <Users className="h-6 w-6 text-primary-700" />
            <h2 className="mt-4 text-xl font-extrabold text-gray-950">
              Official participation
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Hearings, assemblies and consultations published by the responsible public body.
            </p>
          </div>
          <div className="rounded-2xl border border-secondary-200 bg-secondary-50 p-6">
            <MessagesSquare className="h-6 w-6 text-secondary-800" />
            <h2 className="mt-4 text-xl font-extrabold text-gray-950">
              BetterMakati community input
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Proposals, corrections and source submissions tracked through BetterMakati&apos;s public project workflow.
            </p>
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Open official opportunities</div>
        <Heading level={2}>Participate before a decision</Heading>

        {openParticipationOpportunities.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-secondary-200 bg-secondary-50 p-6">
            <Scale className="h-5 w-5 text-secondary-800" />
            <h3 className="mt-3 font-extrabold text-gray-950">
              No current citywide consultation is indexed here yet
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-700">
              No complete current citywide consultation calendar is indexed yet.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="https://www.makati.gov.ph/content/events"
                target="_blank"
                rel="noreferrer"
                className="brand-btn-secondary"
              >
                Check official city events <ExternalLink className="h-4 w-4" />
              </a>
              <Link
                to="/get-involved?type=source&subject=Public%20participation%20opportunity#submission"
                className="brand-btn-primary"
              >
                Share a consultation notice
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {openParticipationOpportunities.map(item => (
              <article key={item.id} className="rounded-2xl border border-gray-200 bg-white p-5">
                <h3 className="font-extrabold text-gray-950">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.summary}</p>
              </article>
            ))}
          </div>
        )}
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Documented precedent</div>
        <Heading level={2}>Past participation records</Heading>
        <div className="mt-6 space-y-4">
          {documentedParticipation.map(item => (
            <article
              key={item.id}
              className="rounded-2xl border border-primary-100 bg-white p-6"
            >
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                {item.kind} · {item.dates}
              </div>
              <h3 className="mt-2 text-xl font-extrabold text-gray-950">
                {item.title}
              </h3>
              <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-700">
                {item.summary}
              </p>
              {item.outcome && (
                <div className="mt-4 rounded-xl border border-gray-200 bg-[#fffdf8] p-4 text-sm text-gray-700">
                  <strong>Documented outcome:</strong> {item.outcome}
                </div>
              )}
              <a
                href={item.source.url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2"
              >
                {item.source.publisher} source <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </article>
          ))}
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Community proposals & corrections</div>
        <Heading level={2}>Follow BetterMakati input publicly</Heading>
        <p className="max-w-3xl text-sm leading-relaxed text-gray-600">
          Only project issues with civic-input prefixes are shown here. Open and
          closed refer to BetterMakati&apos;s project workflow, not a City
          Government disposition.
        </p>

        <div className="mt-6">
          {loading ? (
            <div className="rounded-xl border border-gray-200 p-5 text-sm text-gray-500">
              Loading public input…
            </div>
          ) : inputs.length === 0 ? (
            <div className="rounded-xl border border-gray-200 p-5 text-sm text-gray-600">
              No public community-input items are available from the project
              feed yet.
            </div>
          ) : (
            <div className="space-y-3">
              {inputs.map(item => (
                <a
                  key={item.number}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-primary-300 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.08em]">
                      <span className="text-primary-700">{item.kind}</span>
                      <span className={item.state === 'closed' ? 'text-gray-500' : 'text-success-700'}>
                        {item.workflowStatus || (item.state === 'closed' ? 'Closed' : 'Received')}
                      </span>
                    </div>
                    <h3 className="mt-2 font-extrabold text-gray-950">
                      #{item.number} {item.title}
                    </h3>
                    <div className="mt-1 text-xs text-gray-500">
                      Updated {new Date(item.updatedAt).toLocaleDateString('en-PH')} · {item.comments} comments
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-primary-700" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link to="/get-involved?type=proposal#submission" className="brand-btn-primary">
            <Send className="h-4 w-4" /> Propose something
          </Link>
          <Link to="/get-involved?type=source#submission" className="brand-btn-secondary">
            Share a public source
          </Link>
          <Link to="/get-involved?type=correction#submission" className="brand-btn-secondary">
            Report a correction
          </Link>
        </div>
      </Section>

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Close the loop</div>
        <Heading level={2}>What remains missing</Heading>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {participationCoverageGaps.map(gap => (
            <article key={gap.id} className="rounded-2xl border border-secondary-200 bg-white p-5">
              <CheckCircle2 className="h-5 w-5 text-secondary-800" />
              <h3 className="mt-3 font-extrabold text-gray-950">{gap.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {gap.description}
              </p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
