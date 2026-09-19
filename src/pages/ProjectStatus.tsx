import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Database,
  ExternalLink,
  Eye,
  FileSearch,
  Gauge,
  MessagesSquare,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { Link } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';
import { accountabilityCoverageGaps, accountabilityEntries } from '../data/accountability';
import { barangays } from '../data/barangays';
import { electedOfficials } from '../data/electedOfficials';
import {
  doctrineFoundations,
  doctrinePrinciples,
  doctrineReviewed,
  doctrineStatusLabel,
} from '../data/openGovernmentDoctrine';
import { searchIndex } from '../data/searchIndex';
import { cityMonitorRecords, cityMonitorSources } from '../data/cityMonitor';

interface SourceWatchRun {
  checkedAt: string;
  changed: Array<{ id: string; label: string; url: string }>;
  failed: Array<{ id: string; label: string; url: string; statusCode?: number | null }>;
  newBaselines: Array<{ id: string; label: string; url: string }>;
}

interface CommunityInput {
  number: number;
  title: string;
  state: 'open' | 'closed';
  url: string;
  updatedAt: string;
  comments: number;
  kind: string;
}

export default function ProjectStatus() {
  const [sourceRuns, setSourceRuns] = useState<SourceWatchRun[]>([]);
  const [communityInput, setCommunityInput] = useState<CommunityInput[]>([]);
  const [sourceFeedFailed, setSourceFeedFailed] = useState(false);
  const [inputFeedFailed, setInputFeedFailed] = useState(false);
  const [monitorRuns, setMonitorRuns] = useState<SourceWatchRun[]>([]);
  const [monitorFeedFailed, setMonitorFeedFailed] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/source-watch-history.json', { cache: 'no-store' });
        const data = await response.json();
        if (response.ok && Array.isArray(data.runs)) setSourceRuns(data.runs);
        else setSourceFeedFailed(true);
      } catch {
        setSourceFeedFailed(true);
      }

      try {
        const response = await fetch('/city-monitor-source-history.json', { cache: 'no-store' });
        const data = await response.json();
        if (response.ok && Array.isArray(data.runs)) setMonitorRuns(data.runs);
        else setMonitorFeedFailed(true);
      } catch {
        setMonitorFeedFailed(true);
      }

      try {
        const response = await fetch('/api/community-input');
        const data = await response.json();
        if (response.ok && Array.isArray(data.items)) setCommunityInput(data.items);
        else setInputFeedFailed(true);
      } catch {
        setInputFeedFailed(true);
      }
    };
    void load();
  }, []);

  const latestSourceRun = sourceRuns[0];
  const latestMonitorRun = monitorRuns[0];
  const openCommunityInput = communityInput.filter(item => item.state === 'open').length;
  const knownDoctrineGaps = useMemo(
    () =>
      doctrinePrinciples.reduce((sum, item) => sum + item.gaps.length, 0) +
      doctrineFoundations.reduce((sum, item) => sum + item.gaps.length, 0),
    []
  );

  const coverage = [
    {
      label: 'Barangay profiles',
      value: barangays.length.toLocaleString('en-PH'),
      detail: 'Current Makati barangays represented in BetterMakati',
      icon: Users,
    },
    {
      label: 'Elected-official profiles',
      value: electedOfficials.length.toLocaleString('en-PH'),
      detail: 'Current city/congress profiles in the civic directory',
      icon: Eye,
    },
    {
      label: 'Searchable civic entries',
      value: searchIndex.length.toLocaleString('en-PH'),
      detail: 'Items in BetterMakati’s local search index',
      icon: Search,
    },
    {
      label: 'Accountability records',
      value: accountabilityEntries.length.toLocaleString('en-PH'),
      detail: 'Structured records in the current Accountability Ledger',
      icon: FileSearch,
    },
    {
      label: 'Published accountability gaps',
      value: accountabilityCoverageGaps.length.toLocaleString('en-PH'),
      detail: 'Known ledger coverage gaps shown rather than concealed',
      icon: AlertCircle,
    },
    {
      label: 'City Monitor source channels',
      value: cityMonitorSources.length.toLocaleString('en-PH'),
      detail: 'Official channels in the current City Monitor source directory',
      icon: RefreshCw,
    },
    {
      label: 'Validated City Monitor records',
      value: cityMonitorRecords.length.toLocaleString('en-PH'),
      detail: 'Structured records currently in the validated monitor corpus',
      icon: Database,
    },
    {
      label: 'Methodology gaps',
      value: knownDoctrineGaps.toLocaleString('en-PH'),
      detail: 'Open items in the BetterMakati methodology audit',
      icon: Gauge,
    },
  ];

  const notMeasured = [
    'Search success rate and no-result rate over time',
    'Median time from correction submission to BetterMakati resolution',
    'Participation conversion: viewed opportunity → submitted input → documented response',
    'Coverage completeness against a definitive citywide records inventory',
    'Recurring automated accessibility score from browser-based testing',
    'Usability outcomes for seniors, disabled users, low-bandwidth users and Filipino-first users',
  ];

  return (
    <>
      <SEO
        title="BetterMakati Status"
        description="Current BetterMakati coverage, source monitoring, community input and measurement gaps."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Site status</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Heading>BetterMakati Status</Heading>
            <p className="mt-2 max-w-4xl text-gray-700 leading-relaxed">
              Current coverage, freshness, community input and measurement gaps.
            </p>
          </div>
          <SharePage title="BetterMakati Status" />
        </div>
        <LastReviewed
          date={doctrineReviewed}
          note="Counts reflect the current BetterMakati data model."
        />

        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {coverage.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl border border-primary-100 bg-white p-5">
                <Icon className="h-5 w-5 text-primary-700" />
                <div className="mt-3 text-3xl font-extrabold text-gray-950">{item.value}</div>
                <div className="mt-1 font-bold text-gray-800">{item.label}</div>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">{item.detail}</p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Methodology</div>
        <Heading level={2}>Open-government audit</Heading>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {doctrinePrinciples.map(item => (
            <Link
              key={item.id}
              to={'/open-government#' + item.id}
              className="rounded-2xl border border-gray-200 bg-[#fffdf8] p-5"
            >
              <ShieldCheck className="h-5 w-5 text-primary-700" />
              <h3 className="mt-3 font-extrabold text-gray-950">{item.name}</h3>
              <div className="mt-2 text-xs font-bold text-primary-700">
                {doctrineStatusLabel[item.status]}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                {item.gaps.length} published gap{item.gaps.length === 1 ? '' : 's'}
              </p>
            </Link>
          ))}
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Freshness</div>
        <Heading level={2}>Live signals</Heading>
        <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-primary-100 bg-white p-6">
            <RefreshCw className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">Source-watch history</h3>
            {sourceFeedFailed ? (
              <p className="mt-2 text-sm text-gray-600">
                The published source-watch history could not be read from this deployment.
              </p>
            ) : latestSourceRun ? (
              <>
                <p className="mt-2 text-sm text-gray-600">
                  Last published run:{' '}
                  <strong>{new Date(latestSourceRun.checkedAt).toLocaleString('en-PH')}</strong>
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-[#fffdf8] p-3">
                    <div className="text-xl font-extrabold">{latestSourceRun.changed.length}</div>
                    <div className="text-xs text-gray-500">changed</div>
                  </div>
                  <div className="rounded-xl bg-[#fffdf8] p-3">
                    <div className="text-xl font-extrabold">{latestSourceRun.failed.length}</div>
                    <div className="text-xs text-gray-500">failed</div>
                  </div>
                  <div className="rounded-xl bg-[#fffdf8] p-3">
                    <div className="text-xl font-extrabold">{latestSourceRun.newBaselines.length}</div>
                    <div className="text-xs text-gray-500">baselines</div>
                  </div>
                </div>
              </>
            ) : (
              <p className="mt-2 text-sm text-gray-600">
                No completed public source-watch run has been published yet.
              </p>
            )}
            <Link to="/records" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
              Open source history
            </Link>
          </div>

          <div className="rounded-2xl border border-primary-100 bg-white p-6">
            <RefreshCw className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">City Monitor</h3>
            {monitorFeedFailed ? (
              <p className="mt-2 text-sm text-gray-600">
                The published City Monitor history could not be read from this deployment.
              </p>
            ) : latestMonitorRun ? (
              <>
                <p className="mt-2 text-sm text-gray-600">
                  Last published City Monitor update:{' '}
                  <strong>{new Date(latestMonitorRun.checkedAt).toLocaleString('en-PH')}</strong>
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-[#fffdf8] p-3">
                    <div className="text-xl font-extrabold">{latestMonitorRun.changed.length}</div>
                    <div className="text-xs text-gray-500">changed</div>
                  </div>
                  <div className="rounded-xl bg-[#fffdf8] p-3">
                    <div className="text-xl font-extrabold">{latestMonitorRun.failed.length}</div>
                    <div className="text-xs text-gray-500">failed</div>
                  </div>
                  <div className="rounded-xl bg-[#fffdf8] p-3">
                    <div className="text-xl font-extrabold">{latestMonitorRun.newBaselines.length}</div>
                    <div className="text-xs text-gray-500">baselines</div>
                  </div>
                </div>
              </>
            ) : (
              <p className="mt-2 text-sm text-gray-600">
                No actionable City Monitor source update has been published yet.
              </p>
            )}
            <Link to="/city-monitor" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
              Open City Monitor
            </Link>
          </div>

          <div className="rounded-2xl border border-primary-100 bg-white p-6">
            <MessagesSquare className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">Public community input</h3>
            {inputFeedFailed ? (
              <p className="mt-2 text-sm text-gray-600">
                The public BetterMakati community-input feed is unavailable right now.
              </p>
            ) : (
              <>
                <div className="mt-3 text-3xl font-extrabold text-gray-950">
                  {communityInput.length}
                </div>
                <p className="text-sm text-gray-600">
                  public tracked item{communityInput.length === 1 ? '' : 's'} · {openCommunityInput} open
                </p>
              </>
            )}
            <Link to="/participate" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
              Open participation feed
            </Link>
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Measurement gaps</div>
        <Heading level={2}>Not measured yet</Heading>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          {notMeasured.map(item => (
            <div key={item} className="flex items-start gap-3 rounded-xl border border-secondary-200 bg-secondary-50 p-4">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-secondary-800" />
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-[#fffdf8]">
        <div className="rounded-2xl border border-primary-100 bg-white p-6">
          <Database className="h-5 w-5 text-primary-700" />
          <h2 className="mt-3 text-xl font-extrabold text-gray-950">Audit & source code</h2>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-600">
            Methodology, source code and correction workflow.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/open-government" className="brand-btn-primary">
              Open doctrine & audit
            </Link>
            <Link to="/get-involved?type=correction#submission" className="brand-btn-secondary">
              Challenge this status page
            </Link>
            <a
              href="https://github.com/migi-macati/bettermakati"
              target="_blank"
              rel="noreferrer"
              className="brand-btn-secondary"
            >
              Source code <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
