import { useEffect, useState } from 'react';
import {
  Bell,
  ExternalLink,
  Newspaper,
  Radio,
} from 'lucide-react';
import { Link } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import {
  cityMonitorRecords,
  cityMonitorTypeLabel,
} from '../data/cityMonitor';

interface MonitorRun {
  checkedAt: string;
  changed: Array<{ id: string; label: string; url: string; stream: string }>;
  failed: Array<{ id: string; label: string; url: string; stream: string }>;
  newBaselines: Array<{ id: string; label: string; url: string; stream: string }>;
}

type Period = 'daily' | 'weekly' | 'monthly';

const PAGE_NOW = Date.now();

const periodDays: Record<Period, number> = {
  daily: 1,
  weekly: 7,
  monthly: 30,
};

export default function CivicBriefs() {
  const [period, setPeriod] = useState<Period>('weekly');
  const [runs, setRuns] = useState<MonitorRun[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/city-monitor-source-history.json', { cache: 'no-store' });
        const data = await response.json();
        if (response.ok && Array.isArray(data.runs)) setRuns(data.runs);
      } catch {
        setRuns([]);
      }
    };
    void load();
  }, []);

  const cutoff = PAGE_NOW - periodDays[period] * 24 * 60 * 60 * 1000;
  const relevantRuns = runs.filter(run => new Date(run.checkedAt).getTime() >= cutoff);
  const changed = relevantRuns.flatMap(run => run.changed);
  const failed = relevantRuns.flatMap(run => run.failed);
  const recentRecords = cityMonitorRecords.filter(
    record => !record.historical && new Date(record.date).getTime() >= cutoff
  );

  const title =
    period === 'daily'
      ? 'Daily Civic Brief'
      : period === 'weekly'
        ? 'The Makati Brief'
        : 'State of Makati';

  return (
    <>
      <SEO
        title="Civic Briefs"
        description="Daily, weekly and monthly BetterMakati summaries from City Monitor."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Updates</div>
        <Heading>Civic Briefs</Heading>
        <p className="mt-2 max-w-3xl text-gray-700">
          Daily, weekly and monthly summaries from City Monitor.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {([
            ['daily', 'Daily'],
            ['weekly', 'Weekly'],
            ['monthly', 'Monthly'],
          ] as Array<[Period, string]>).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setPeriod(value)}
              className={`rounded-full border px-4 py-2 text-sm font-bold ${
                period === value
                  ? 'border-primary-700 bg-primary-700 text-white'
                  : 'border-gray-300 bg-white text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">
          {period === 'daily' ? 'Last 24 hours' : period === 'weekly' ? 'Last 7 days' : 'Last 30 days'}
        </div>
        <Heading level={2}>{title}</Heading>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-primary-100 bg-[#fffdf8] p-4">
            <div className="text-2xl font-extrabold">{recentRecords.length}</div>
            <div className="text-sm text-gray-600">validated records</div>
          </div>
          <div className="rounded-xl border border-primary-100 bg-[#fffdf8] p-4">
            <div className="text-2xl font-extrabold">{changed.length}</div>
            <div className="text-sm text-gray-600">source changes</div>
          </div>
          <div className="rounded-xl border border-primary-100 bg-[#fffdf8] p-4">
            <div className="text-2xl font-extrabold">{failed.length}</div>
            <div className="text-sm text-gray-600">failed checks</div>
          </div>
        </div>

        {recentRecords.length > 0 ? (
          <div className="mt-7 space-y-3">
            {recentRecords.map(record => (
              <article key={record.id} className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                  {cityMonitorTypeLabel[record.type]}
                </div>
                <h3 className="mt-1 font-extrabold text-gray-950">{record.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{record.summary}</p>
                <a
                  href={record.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary-700"
                >
                  Source <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-7 rounded-2xl border border-gray-200 bg-[#fffdf8] p-5 text-sm text-gray-600">
            No new validated records in this period.
          </div>
        )}

        {changed.length > 0 && (
          <div className="mt-7">
            <h3 className="font-extrabold text-gray-950">Source changes awaiting review</h3>
            <div className="mt-3 space-y-2">
              {changed.slice(0, 20).map((item, index) => (
                <a
                  key={item.id + '-' + index}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 rounded-xl border border-secondary-200 bg-secondary-50 p-4"
                >
                  <Radio className="mt-0.5 h-4 w-4 shrink-0 text-secondary-800" />
                  <span className="text-sm text-gray-700">
                    <strong>{item.label}</strong>
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-7 flex flex-wrap gap-3">
          <Link to="/city-monitor" className="brand-btn-primary">
            City Monitor
          </Link>
          <Link to="/news" className="brand-btn-secondary">
            <Newspaper className="h-4 w-4" /> Makati in the News
          </Link>
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Follow</div>
        <Heading level={2}>Follow city updates</Heading>
        <div className="mt-6 max-w-2xl rounded-2xl border border-primary-100 bg-white p-6">
          <Bell className="h-6 w-6 text-primary-700" />
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            Explore source-linked records in City Monitor, or subscribe to its RSS feed
            for detected changes in monitored official sources. Each change still
            needs review before it can be treated as a government action.
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold text-primary-700">
            <Link to="/city-monitor" className="underline underline-offset-4">Open City Monitor</Link>
            <a href="/city-monitor.rss.xml" className="underline underline-offset-4">Source-change RSS feed</a>
          </div>
        </div>
      </Section>
    </>
  );
}
