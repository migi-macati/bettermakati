import type { ComponentType } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  ExternalLink,
  FileText,
  Gavel,
  Landmark,
  Megaphone,
  Newspaper,
  Radio,
  ScrollText,
  Search,
  ShoppingCart,
} from 'lucide-react';
import { Link } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';
import CitizenSummary from '../components/ui/CitizenSummary';
import {
  cityMonitorRecords,
  cityMonitorReviewed,
  cityMonitorSources,
  cityMonitorTypeLabel,
  legislativeLifecycle,
  procurementLifecycle,
  speechWorkflow,
  type CityMonitorRecord,
  type CityMonitorType,
} from '../data/cityMonitor';

interface MonitorRun {
  checkedAt: string;
  changed: Array<{ id: string; label: string; url: string; stream: string }>;
  failed: Array<{ id: string; label: string; url: string; stream: string }>;
  newBaselines: Array<{ id: string; label: string; url: string; stream: string }>;
}

const typeIcon: Record<CityMonitorType, ComponentType<{ className?: string }>> = {
  'council-session': Gavel,
  legislation: ScrollText,
  'executive-speech': Megaphone,
  procurement: ShoppingCart,
  project: Landmark,
  publication: Newspaper,
  consultation: CalendarDays,
  'official-notice': Radio,
};

const recordInterpretation = (record: CityMonitorRecord) => {
  if (record.type === 'procurement') {
    if (record.status === 'awarded') {
      return 'The public record establishes an award and the reported winning amount. It does not by itself establish that a contract was executed, work was completed or payment was made.';
    }
    return 'This procurement record establishes only the stage shown by the cited source. Later stages require separate public evidence.';
  }

  if (record.type === 'council-session') {
    return 'This establishes the documented volume or occurrence of council activity. It does not by itself show the substance, vote or later implementation of each measure.';
  }

  if (record.type === 'legislation') {
    return 'This establishes the legislative action shown by the source. Check the original measure and later records for amendments, effectivity and implementation.';
  }

  if (record.type === 'executive-speech') {
    return 'Statements and commitments are attributed to the official source. Delivery is tracked separately when later evidence is available.';
  }

  if (record.type === 'project') {
    return 'The record shows the latest sourced project stage. Budget, procurement, implementation and completion should be read as separate evidence points.';
  }

  if (record.type === 'consultation') {
    return 'This confirms a participation opportunity or event. It does not establish what influence public input ultimately had on the decision.';
  }

  return 'This record summarizes the cited official source. Open the original source for controlling details and later updates.';
};

const streamOptions: Array<{ value: 'all' | CityMonitorType; label: string }> = [
  { value: 'all', label: 'All streams' },
  ...Object.entries(cityMonitorTypeLabel).map(([value, label]) => ({
    value: value as CityMonitorType,
    label,
  })),
];

export default function CityMonitor() {
  const [stream, setStream] = useState<'all' | CityMonitorType>('all');
  const [query, setQuery] = useState('');
  const [runs, setRuns] = useState<MonitorRun[]>([]);
  const [historyFailed, setHistoryFailed] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/city-monitor-source-history.json', {
          cache: 'no-store',
        });
        const data = await response.json();
        if (!response.ok || !Array.isArray(data.runs)) throw new Error('history');
        setRuns(data.runs);
      } catch {
        setHistoryFailed(true);
      }
    };
    void load();
  }, []);

  const latestRun = runs[0];

  const visibleRecords = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return cityMonitorRecords.filter(record => {
      const streamMatch = stream === 'all' || record.type === stream;
      const text = [
        record.title,
        record.summary,
        record.referenceNo,
        cityMonitorTypeLabel[record.type],
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return streamMatch && (!needle || text.includes(needle));
    });
  }, [query, stream]);

  return (
    <>
      <SEO
        title="City Monitor"
        description="A continuously monitored record of Makati government activity: council, legislation, executive speeches, procurement, projects, publications, consultations and official notices."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Official activity</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Heading>City Monitor</Heading>
            <p className="mt-2 max-w-4xl text-gray-700 leading-relaxed">
              Council, legislation, speeches, procurement, projects, publications, consultations and notices from monitored official sources.
            </p>
          </div>
          <SharePage title="Makati City Monitor | BetterMakati" />
        </div>

        <LastReviewed
          date={cityMonitorReviewed}
          note="Source changes are reviewed before a record is added."
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/briefs" className="brand-btn-primary">
            Civic Briefs <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/news" className="brand-btn-secondary">
            Makati in the News
          </Link>
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Daily source watch</div>
        <Heading level={2}>Source changes</Heading>

        {historyFailed ? (
          <div className="mt-6 rounded-2xl border border-secondary-200 bg-secondary-50 p-5 text-sm text-gray-700">
            <AlertCircle className="h-5 w-5 text-secondary-800" />
            <p className="mt-2">
              Source history is unavailable. Use the official source directory below.
            </p>
          </div>
        ) : latestRun ? (
          <div className="mt-6 rounded-2xl border border-primary-100 bg-white p-6">
            <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
              Latest published monitor update · {new Date(latestRun.checkedAt).toLocaleString('en-PH')}
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-gray-200 bg-[#fffdf8] p-4">
                <div className="text-2xl font-extrabold text-gray-950">{latestRun.changed.length}</div>
                <div className="text-sm text-gray-600">changed sources</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-[#fffdf8] p-4">
                <div className="text-2xl font-extrabold text-gray-950">{latestRun.failed.length}</div>
                <div className="text-sm text-gray-600">failed checks</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-[#fffdf8] p-4">
                <div className="text-2xl font-extrabold text-gray-950">{latestRun.newBaselines.length}</div>
                <div className="text-sm text-gray-600">new baselines</div>
              </div>
            </div>

            {(latestRun.changed.length > 0 || latestRun.failed.length > 0) && (
              <div className="mt-5 space-y-3">
                {latestRun.changed.map(item => (
                  <a
                    key={'changed-' + item.id}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-3 rounded-xl border border-secondary-200 bg-secondary-50 p-4"
                  >
                    <Radio className="mt-0.5 h-4 w-4 shrink-0 text-secondary-800" />
                    <span className="text-sm text-gray-700">
                      <strong>{item.label}</strong> changed. Review pending before
                      any substantive City Monitor event is published.
                    </span>
                  </a>
                ))}
                {latestRun.failed.map(item => (
                  <a
                    key={'failed-' + item.id}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-3 rounded-xl border border-error-200 bg-error-50 p-4"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-error-700" />
                    <span className="text-sm text-gray-700">
                      <strong>{item.label}</strong> could not be checked successfully.
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600">
            The daily monitor has not published its first actionable source update yet.
          </div>
        )}
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Validated civic records</div>
        <Heading level={2}>Structured records</Heading>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-600">
          Current records will appear here only after the underlying source is
          verified. Historical records below demonstrate the schema and remain
          clearly labelled as historical.
        </p>

        <div className="mt-6 flex flex-col gap-3 md:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search City Monitor</span>
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              type="search"
              placeholder="Search records"
              className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4"
            />
          </label>
          <select
            value={stream}
            onChange={event => setStream(event.target.value as 'all' | CityMonitorType)}
            className="rounded-xl border border-gray-300 bg-white px-4 py-3"
            aria-label="Filter City Monitor stream"
          >
            {streamOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="mt-6 space-y-4">
          {visibleRecords.map(record => {
            const Icon = typeIcon[record.type];
            return (
              <article key={record.id} className="rounded-2xl border border-gray-200 bg-[#fffdf8] p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-700">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                        {cityMonitorTypeLabel[record.type]} · {record.historical ? 'Historical record' : record.status}
                      </div>
                      <h3 className="mt-1 text-xl font-extrabold text-gray-950">{record.title}</h3>
                    </div>
                  </div>
                  <time className="text-sm text-gray-500" dateTime={record.date}>{record.date}</time>
                </div>
                <p className="mt-4 max-w-4xl text-sm leading-relaxed text-gray-700">{record.summary}</p>
                <CitizenSummary
                  className="mt-4"
                  eyebrow="What this tells you"
                  title={cityMonitorTypeLabel[record.type]}
                  summary={recordInterpretation(record)}
                />
                {record.referenceNo && (
                  <div className="mt-3 text-sm text-gray-600">
                    Reference: <strong>{record.referenceNo}</strong>
                  </div>
                )}
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link to={'/city-monitor/' + record.id} className="brand-btn-primary">
                    Open record <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={record.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="brand-btn-secondary"
                  >
                    Original source <ExternalLink className="h-4 w-4" />
                  </a>
                  {record.relatedHref && (
                    <Link to={record.relatedHref} className="brand-btn-secondary">
                      Related BetterMakati record
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Lifecycle rules</div>
        <Heading level={2}>Track the process, not only the final PDF</Heading>

        <div className="mt-6 rounded-2xl border border-secondary-200 bg-secondary-50 p-5">
          <h3 className="font-extrabold text-gray-950">Known source gaps</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            No complete current City Council calendar, measure-stage history or normalized city-publications feed is indexed yet.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-primary-100 bg-white p-6">
            <ScrollText className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">Legislation</h3>
            <ol className="mt-3 space-y-2 text-sm text-gray-700">
              {legislativeLifecycle.map((item, index) => <li key={item}>{index + 1}. {item}</li>)}
            </ol>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-white p-6">
            <ShoppingCart className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">Procurement</h3>
            <ol className="mt-3 space-y-2 text-sm text-gray-700">
              {procurementLifecycle.map((item, index) => <li key={item}>{index + 1}. {item}</li>)}
            </ol>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-white p-6">
            <Megaphone className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">Speeches & SOCA</h3>
            <ol className="mt-3 space-y-2 text-sm text-gray-700">
              {speechWorkflow.map((item, index) => <li key={item}>{index + 1}. {item}</li>)}
            </ol>
            <p className="mt-4 text-xs leading-relaxed text-gray-500">
              An official written text is labeled “Official transcript.” A
              BetterMakati transcript from audio/video must say whether it is
              automated or human-reviewed and preserve the official recording.
            </p>
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Monitored official channels</div>
        <Heading level={2}>Source directory</Heading>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cityMonitorSources.map(source => (
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300"
            >
              <FileText className="h-5 w-5 text-primary-700" />
              <div className="mt-3 text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                {source.cadence} check
              </div>
              <h3 className="mt-1 font-extrabold text-gray-950">{source.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{source.monitoringNote}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                Open source <ExternalLink className="h-3.5 w-3.5" />
              </span>
            </a>
          ))}
        </div>
      </Section>
    </>
  );
}
