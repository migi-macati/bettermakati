import { FormEvent, useEffect, useState } from 'react';
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Mail,
  Newspaper,
  Radio,
  Rss,
  Send,
} from 'lucide-react';
import { Link } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import LastReviewed from '../components/ui/LastReviewed';
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
type SubmitState = 'idle' | 'submitting' | 'success' | 'unavailable' | 'error';

const PAGE_NOW = Date.now();

const periodDays: Record<Period, number> = {
  daily: 1,
  weekly: 7,
  monthly: 30,
};

export default function CivicBriefs() {
  const [period, setPeriod] = useState<Period>('weekly');
  const [runs, setRuns] = useState<MonitorRun[]>([]);
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState<Period>('weekly');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

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
  const newBaselines = relevantRuns.flatMap(run => run.newBaselines);
  const recentRecords = cityMonitorRecords.filter(
    record => !record.historical && new Date(record.date).getTime() >= cutoff
  );

  const subscribe = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitState('submitting');
    setSubmitMessage('');
    try {
      const response = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, frequency }),
      });
      const data = await response.json();
      if (response.ok) {
        setSubmitState('success');
        setSubmitMessage('Subscription request received.');
        setEmail('');
      } else if (response.status === 503) {
        setSubmitState('unavailable');
        setSubmitMessage(
          'Email delivery is not connected on this deployment yet. The RSS feed is live now and contains the same source-change signals.'
        );
      } else {
        setSubmitState('error');
        setSubmitMessage(data.error || 'Subscription failed.');
      }
    } catch {
      setSubmitState('error');
      setSubmitMessage('Subscription failed.');
    }
  };

  return (
    <>
      <SEO
        title="Civic Briefs"
        description="Daily, weekly and monthly BetterMakati civic briefs from City Monitor, plus RSS and privacy-preserving newsletter signup infrastructure."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Distribution layer</div>
        <Heading>Civic Briefs</Heading>
        <p className="mt-2 max-w-4xl text-gray-700 leading-relaxed">
          Briefs summarize validated City Monitor records and official-source
          changes. Media coverage remains separate in Makati in the News.
        </p>
        <LastReviewed note="A source change is described as a source change until the underlying civic event is verified." />

        <div className="mt-6 flex flex-wrap gap-2">
          {([
            ['daily', 'Daily Civic Brief'],
            ['weekly', 'The Makati Brief'],
            ['monthly', 'State of Makati'],
          ] as Array<[Period, string]>).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setPeriod(value)}
              className={`rounded-full border px-4 py-2 text-sm font-bold ${period === value ? 'border-primary-700 bg-primary-700 text-white' : 'border-gray-300 bg-white text-gray-700'}`}
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
        <Heading level={2}>
          {period === 'daily' ? 'Daily Civic Brief' : period === 'weekly' ? 'The Makati Brief' : 'State of Makati'}
        </Heading>

        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-xl border border-primary-100 bg-[#fffdf8] p-4">
            <div className="text-2xl font-extrabold">{recentRecords.length}</div>
            <div className="text-sm text-gray-600">validated civic records</div>
          </div>
          <div className="rounded-xl border border-primary-100 bg-[#fffdf8] p-4">
            <div className="text-2xl font-extrabold">{changed.length}</div>
            <div className="text-sm text-gray-600">source changes detected</div>
          </div>
          <div className="rounded-xl border border-primary-100 bg-[#fffdf8] p-4">
            <div className="text-2xl font-extrabold">{failed.length}</div>
            <div className="text-sm text-gray-600">source checks failed</div>
          </div>
          <div className="rounded-xl border border-primary-100 bg-[#fffdf8] p-4">
            <div className="text-2xl font-extrabold">{newBaselines.length}</div>
            <div className="text-sm text-gray-600">new baselines</div>
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
            No newly validated City Monitor record falls inside this period yet.
            Source-change detections below remain review signals until verified.
          </div>
        )}

        {changed.length > 0 && (
          <div className="mt-7">
            <h3 className="font-extrabold text-gray-950">Needs review</h3>
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
                    Official source changed: <strong>{item.label}</strong>
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-7 flex flex-wrap gap-3">
          <Link to="/city-monitor" className="brand-btn-primary">
            Open City Monitor
          </Link>
          <Link to="/news" className="brand-btn-secondary">
            <Newspaper className="h-4 w-4" /> Media coverage
          </Link>
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Subscribe</div>
        <Heading level={2}>Newsletter & RSS</Heading>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-primary-100 bg-white p-6">
            <Rss className="h-6 w-6 text-primary-700" />
            <h3 className="mt-3 text-xl font-extrabold text-gray-950">RSS is live now</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              The feed publishes City Monitor source-change signals with links
              to the original official source. Validated records can be added to
              the same distribution layer as the structured corpus grows.
            </p>
            <a
              href="/city-monitor.rss.xml"
              target="_blank"
              rel="noreferrer"
              className="brand-btn-secondary mt-5"
            >
              Open RSS feed <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <form onSubmit={subscribe} className="rounded-2xl border border-primary-100 bg-white p-6">
            <Mail className="h-6 w-6 text-primary-700" />
            <h3 className="mt-3 text-xl font-extrabold text-gray-950">Email brief</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Subscriber email addresses must stay private. BetterMakati only
              activates email signup when a private delivery backend is
              configured; addresses are never written to public GitHub issues.
            </p>

            <label className="form-field mt-5">
              <span>Email address</span>
              <input
                type="email"
                required
                value={email}
                onChange={event => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </label>

            <label className="form-field mt-4">
              <span>Frequency</span>
              <select
                value={frequency}
                onChange={event => setFrequency(event.target.value as Period)}
              >
                <option value="daily">Daily Civic Brief</option>
                <option value="weekly">Weekly Makati Brief</option>
                <option value="monthly">Monthly State of Makati</option>
              </select>
            </label>

            {submitState !== 'idle' && (
              <div
                role="status"
                className={`mt-4 rounded-xl border p-4 text-sm ${
                  submitState === 'success'
                    ? 'border-success-200 bg-success-50 text-success-800'
                    : submitState === 'unavailable'
                      ? 'border-secondary-200 bg-secondary-50 text-secondary-900'
                      : submitState === 'error'
                        ? 'border-error-200 bg-error-50 text-error-800'
                        : 'border-gray-200 bg-gray-50 text-gray-700'
                }`}
              >
                {submitState === 'success' && <CheckCircle2 className="mr-2 inline h-4 w-4" />}
                {submitState === 'unavailable' && <AlertCircle className="mr-2 inline h-4 w-4" />}
                {submitMessage}
              </div>
            )}

            <button
              type="submit"
              className="brand-btn-primary mt-5"
              disabled={submitState === 'submitting'}
            >
              <Send className="h-4 w-4" />
              {submitState === 'submitting' ? 'Sending…' : 'Subscribe'}
            </button>
          </form>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Editorial separation</div>
        <Heading level={2}>Three different layers</Heading>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-gray-200 p-5">
            <CalendarDays className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold">Official record</h3>
            <p className="mt-2 text-sm text-gray-600">What the issuing public body published.</p>
          </div>
          <div className="rounded-2xl border border-gray-200 p-5">
            <Radio className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold">BetterMakati summary</h3>
            <p className="mt-2 text-sm text-gray-600">A factual synthesis linked back to the official record.</p>
          </div>
          <div className="rounded-2xl border border-gray-200 p-5">
            <Newspaper className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold">External reporting</h3>
            <p className="mt-2 text-sm text-gray-600">Journalism and media coverage kept in Makati in the News.</p>
          </div>
        </div>
      </Section>
    </>
  );
}
