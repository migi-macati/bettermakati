import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ExternalLink,
  FileSearch,
  HandHeart,
  Lightbulb,
  MapPinned,
  PencilLine,
  PhoneCall,
  Scale,
  Send,
  ShieldAlert,
  ClipboardCheck,
} from 'lucide-react';
import { Link } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';
import {
  documentedParticipation,
  openParticipationOpportunities,
  participationReviewed,
} from '../data/participation';
import { civicAuditPilot } from '../data/civicAuditPilot';
import { useBarangayScope, withBarangayScope } from '../hooks/useBarangayScope';

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
  const { barangay } = useBarangayScope();
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
        description="Join official Makati participation opportunities, report local problems, suggest improvements, document public places and contribute to BetterMakati."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Participation</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Heading>What do you want to do?</Heading>
            <p className="max-w-3xl text-gray-700">
              Choose the task that matches what you want to contribute.
            </p>
          </div>
          <SharePage title="Participate in Makati | BetterMakati" />
        </div>
        <LastReviewed date={participationReviewed} />

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-primary-200 bg-primary-50 p-5">
            <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
              Need government action?
            </div>
            <h2 className="mt-2 text-lg font-extrabold text-gray-950">
              Use an official Makati channel
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              BetterMakati does not automatically submit complaints or service requests to the City Government. Use an official city contact or find the responsible service or office.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to="/hotlines#makati-action-center" className="brand-btn-primary">
                Makati Action Center contacts
              </Link>
              <Link to="/community-tools/saan-ako-lalapit" className="brand-btn-secondary">
                Find the right service or office
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-secondary-200 bg-secondary-50 p-5">
            <div className="text-xs font-bold uppercase tracking-[0.08em] text-secondary-800">
              Contributing through BetterMakati?
            </div>
            <h2 className="mt-2 text-lg font-extrabold text-gray-950">
              BetterMakati records are public civic evidence
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Civic Map reports, observations, corrections, sources and ideas create or improve BetterMakati records. A Civic Map case becomes an official government referral only when separate referral evidence is recorded.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-error-200 bg-error-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-extrabold text-error-950">Emergency or immediate danger?</div>
            <p className="mt-1 text-sm text-error-900">
              Do not wait for a participation or reporting workflow.
            </p>
          </div>
          <a href="tel:911" className="brand-btn-primary !bg-error-700 !text-white hover:!bg-error-800">
            Call 911
          </a>
        </div>

        {barangay && (
          <div className="mt-5 rounded-2xl border border-primary-100 bg-white p-5">
            <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
              BetterBarangay context
            </div>
            <div className="mt-1 text-lg font-extrabold text-gray-950">
              Local actions for {barangay.name}, citywide opportunities where noted
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Local problem reports, place improvements and source submissions below keep the {barangay.name} context. Official consultation listings and project-wide community input remain citywide unless they explicitly identify a barangay.
            </p>
          </div>
        )}

        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <a
            href="#official-opportunities"
            className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
          >
            <Scale className="h-5 w-5 text-primary-700" />
            <div className="mt-3 font-extrabold text-gray-950">
              Join an official consultation
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Check published hearings, consultations and other participation opportunities.
            </p>
          </a>

          <Link
            to="/hotlines#makati-action-center"
            className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
          >
            <PhoneCall className="h-5 w-5 text-primary-700" />
            <div className="mt-3 font-extrabold text-gray-950">
              Contact Makati government
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Use the official Makati Action Center contacts for a concern that needs city-government action.
            </p>
          </Link>

          <Link
            to={withBarangayScope('/civic-map/report', barangay?.slug)}
            className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
          >
            <ShieldAlert className="h-5 w-5 text-primary-700" />
            <div className="mt-3 font-extrabold text-gray-950">
              Report a local problem to BetterMakati
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Create a public BetterMakati case for a non-emergency issue. It is not a city-government case unless a separate referral is recorded.
            </p>
          </Link>

          <Link
            to={withBarangayScope('/civic-map', barangay?.slug)}
            className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
          >
            <MapPinned className="h-5 w-5 text-primary-700" />
            <div className="mt-3 font-extrabold text-gray-950">
              Suggest a place improvement
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Find a civic place or segment, then propose a specific improvement.
            </p>
          </Link>

          <Link
            to={civicAuditPilot.route}
            className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
          >
            <ClipboardCheck className="h-5 w-5 text-primary-700" />
            <div className="mt-3 font-extrabold text-gray-950">
              Record current conditions
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Join the public-park accessibility check and record what you observe.
            </p>
          </Link>

          <Link
            to="/get-involved?type=correction#submission"
            className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
          >
            <PencilLine className="h-5 w-5 text-primary-700" />
            <div className="mt-3 font-extrabold text-gray-950">
              Correct BetterMakati
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Flag information that is wrong, stale or incomplete.
            </p>
          </Link>

          <Link
            to={withBarangayScope('/get-involved?type=source#submission', barangay?.slug)}
            className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
          >
            <FileSearch className="h-5 w-5 text-primary-700" />
            <div className="mt-3 font-extrabold text-gray-950">
              Share a public source
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Send an official notice, public record, dataset or useful source.
            </p>
          </Link>

          <Link
            to="/get-involved?type=idea#submission"
            className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
          >
            <Lightbulb className="h-5 w-5 text-primary-700" />
            <div className="mt-3 font-extrabold text-gray-950">
              Suggest a BetterMakati idea
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Propose a site feature, civic tool or project improvement.
            </p>
          </Link>

          <Link
            to="/get-involved?type=volunteer#submission"
            className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
          >
            <HandHeart className="h-5 w-5 text-primary-700" />
            <div className="mt-3 font-extrabold text-gray-950">
              Volunteer
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Offer research, data, design, documentation or development help.
            </p>
          </Link>
        </div>
      </Section>

      <Section className="bg-white" id="official-opportunities">
        <div className="section-eyebrow">Official participation</div>
        <Heading level={2}>Open opportunities</Heading>

        {openParticipationOpportunities.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-[#fffdf8] p-6">
            <div className="font-extrabold text-gray-950">
              No current citywide consultation is indexed here.
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="https://www.makati.gov.ph/content/events"
                target="_blank"
                rel="noreferrer"
                className="brand-btn-secondary"
              >
                Check Makati events <ExternalLink className="h-4 w-4" />
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
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {openParticipationOpportunities.map(item => (
              <article
                key={item.id}
                className="rounded-2xl border border-gray-200 bg-white p-5"
              >
                <h3 className="font-extrabold text-gray-950">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.summary}</p>
              </article>
            ))}
          </div>
        )}
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="section-eyebrow">Current civic audit</div>
            <Heading level={2}>Public park accessibility check</Heading>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
              Record entrance access, step-free access, seating and toilets at one of 13 public parks.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to={civicAuditPilot.route} className="brand-btn-primary">
              Join the audit <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to={civicAuditPilot.route + '/results'} className="brand-btn-secondary">
              View live output
            </Link>
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">BetterMakati community input</div>
        <Heading level={2}>Track proposals, corrections and sources</Heading>

        <div className="mt-6">
          {loading ? (
            <div className="rounded-xl border border-gray-200 p-5 text-sm text-gray-500">
              Loading public input…
            </div>
          ) : inputs.length === 0 ? (
            <div className="rounded-xl border border-gray-200 p-5 text-sm text-gray-600">
              No community-input items are available from the project feed yet.
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
          <Link to="/get-involved?type=idea#submission" className="brand-btn-primary">
            <Send className="h-4 w-4" /> Suggest an idea
          </Link>
          <Link to="/get-involved?type=source#submission" className="brand-btn-secondary">
            Share a source
          </Link>
          <Link to="/get-involved?type=correction#submission" className="brand-btn-secondary">
            Report a correction
          </Link>
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Past official participation</div>
        <Heading level={2}>Documented records</Heading>
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
        <div className="section-eyebrow">Beyond Makati</div>
        <Heading level={2}>Other civic channels</Heading>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <a
            href="https://lgu.bettergov.ph/"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-primary-100 bg-white p-5 hover:border-primary-300"
          >
            <h3 className="font-extrabold text-gray-950">Another LGU</h3>
            <p className="mt-2 text-sm text-gray-600">
              Find another local civic portal in the BetterLGU directory.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
              Open BetterLGU <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </a>

          <a
            href="https://petition.ph/"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-primary-100 bg-white p-5 hover:border-primary-300"
          >
            <h3 className="font-extrabold text-gray-950">Public petitions</h3>
            <p className="mt-2 text-sm text-gray-600">
              Start or find a public petition on Petitions.ph.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
              Open Petitions.ph <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </a>

          <a
            href="https://www.openbayan.org/"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-primary-100 bg-white p-5 hover:border-primary-300"
          >
            <h3 className="font-extrabold text-gray-950">Other civic-tech projects</h3>
            <p className="mt-2 text-sm text-gray-600">
              Browse community public-interest projects on OpenBayan.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
              Open OpenBayan <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </a>
        </div>
      </Section>
    </>
  );
}
