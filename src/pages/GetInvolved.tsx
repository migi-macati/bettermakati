import { FormEvent, useState } from 'react';
import { useSearchParams } from 'react-router';
import {
  Bug,
  Database,
  ExternalLink,
  HeartHandshake,
  Lightbulb,
  MessageCircle,
  MessagesSquare,
  Send,
} from 'lucide-react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import { communityTools } from '../data/communityTools';

const actionCards = [
  {
    type: 'proposal',
    title: 'Propose something',
    description: 'Describe a civic problem, proposed change, evidence and trade-offs.',
    icon: MessagesSquare,
  },
  {
    type: 'idea',
    title: 'Suggest an idea',
    description: 'Propose a civic tool, feature or improvement.',
    icon: Lightbulb,
  },
  {
    type: 'source',
    title: 'Share a source',
    description: 'Send a public record, dataset or useful official link.',
    icon: Database,
  },
  {
    type: 'correction',
    title: 'Report a correction',
    description: 'Flag information that is wrong, stale or incomplete.',
    icon: Bug,
  },
  {
    type: 'volunteer',
    title: 'Volunteer',
    description: 'Offer research, data, design or development help.',
    icon: HeartHandshake,
  },
  {
    type: 'contact',
    title: 'Contact BetterMakati',
    description: 'Send a general project message.',
    icon: MessageCircle,
  },
];

type SubmitState = 'idle' | 'submitting' | 'success' | 'fallback' | 'error';

export default function GetInvolved() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'idea';
  const initialTool = searchParams.get('tool') || '';
  const initialSubject = searchParams.get('subject') || '';

  const [type, setType] = useState(initialType);
  const [tool, setTool] = useState(initialTool);
  const [subject, setSubject] = useState(initialSubject);
  const [details, setDetails] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [barangay, setBarangay] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<SubmitState>('idle');
  const [message, setMessage] = useState('');
  const [fallbackUrl, setFallbackUrl] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');
    setFallbackUrl('');
    setTrackingUrl('');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          tool,
          subject,
          details,
          sourceUrl,
          barangay,
          website,
        }),
      });
      const data = response.status === 204 ? {} : await response.json();

      if (response.ok) {
        setStatus('success');
        setTrackingUrl(data.url || '');
        setMessage(
          data.reference
            ? 'Submitted. Reference #' + data.reference + '.'
            : 'Submitted. Thank you for helping improve BetterMakati.'
        );
        setSubject('');
        setDetails('');
        setSourceUrl('');
        setBarangay('');
        return;
      }

      if (data.fallbackUrl) {
        setFallbackUrl(data.fallbackUrl);
        setStatus('fallback');
        setMessage(
          'The native submission channel is unavailable on this deployment. Your text is still here; you can continue to the pre-filled public GitHub issue.'
        );
        return;
      }

      setStatus('error');
      setMessage(data.error || 'Submission failed. Please try again.');
    } catch {
      setStatus('error');
      setMessage('Submission failed. Please try again.');
    }
  };

  const chooseType = (value: string) => {
    setType(value);
    setStatus('idle');
    const next = new URLSearchParams(searchParams);
    next.set('type', value);
    if (tool) next.set('tool', tool);
    setSearchParams(next);
    document.getElementById('submission')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <SEO
        title="Get Involved"
        description="Suggest ideas, share sources, report corrections, contact or volunteer for BetterMakati."
      />
      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Get Involved</div>
        <Heading>Help improve BetterMakati</Heading>
        <p className="max-w-3xl text-gray-600">
          BetterMakati gets better when residents, researchers and city users
          point us to stronger sources, missing information and useful tools.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">
          {actionCards.map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.type}
                type="button"
                onClick={() => chooseType(action.type)}
                aria-pressed={type === action.type}
                className={`text-left rounded-2xl border bg-white p-5 hover:border-primary-300 hover:shadow-sm transition ${
                  type === action.type ? 'border-primary-500 ring-2 ring-primary-100' : 'border-gray-200'
                }`}
              >
                <Icon className="h-6 w-6 text-primary-700" />
                <h2 className="font-bold text-gray-950 mt-4">{action.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{action.description}</p>
              </button>
            );
          })}
        </div>
      </Section>

      <Section className="bg-white">
        <div className="grid gap-4 md:grid-cols-2">
          <a
            href="https://lgu.bettergov.ph/"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-5 hover:border-primary-300"
          >
            <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
              Working outside Makati?
            </div>
            <h2 className="mt-2 text-lg font-extrabold text-gray-950">
              Find another BetterLGU project
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Check whether your city or municipality already has a local civic portal.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
              BetterLGU Directory <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </a>
          <a
            href="https://www.openbayan.org/"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-5 hover:border-primary-300"
          >
            <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
              Looking for another project?
            </div>
            <h2 className="mt-2 text-lg font-extrabold text-gray-950">
              Browse OpenBayan
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Find other Philippine civic-tech and public-interest projects.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
              Open OpenBayan <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </a>
        </div>
      </Section>

      <Section id="submission" className="bg-[#f5f8f2]">
        <div className="max-w-3xl mx-auto">
          <div className="section-eyebrow">Submission</div>
          <Heading>Send something to BetterMakati</Heading>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            When the native project workflow is available, a successful
            submission returns a public tracking link. This tracks
            BetterMakati&apos;s handling of the submission, not an official City
            Government case unless a government channel separately accepts it.
          </p>

          <form
            onSubmit={submit}
            className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="form-field">
                <span>Submission type</span>
                <select value={type} onChange={event => setType(event.target.value)}>
                  <option value="proposal">Civic proposal</option>
                  <option value="idea">BetterMakati idea</option>
                  <option value="source">Source / data</option>
                  <option value="correction">Correction</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="contact">Contact</option>
                </select>
              </label>

              <label className="form-field">
                <span>Community tool</span>
                <select value={tool} onChange={event => setTool(event.target.value)}>
                  <option value="">General / not specific</option>
                  {communityTools.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field md:col-span-2">
                <span>Subject</span>
                <input
                  required
                  value={subject}
                  onChange={event => setSubject(event.target.value)}
                  placeholder="Short title"
                />
              </label>

              <label className="form-field md:col-span-2">
                <span>Details</span>
                <textarea
                  required
                  rows={7}
                  value={details}
                  onChange={event => setDetails(event.target.value)}
                  placeholder={type === 'proposal'
                    ? 'Problem, proposed change, evidence, possible benefits/costs, alternatives or questions still unanswered.'
                    : 'Describe the idea, source, correction or offer to help.'}
                />
              </label>

              <label className="form-field">
                <span>Source / URL</span>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={event => setSourceUrl(event.target.value)}
                  placeholder="https://"
                />
              </label>

              <label className="form-field">
                <span>Barangay / area</span>
                <input
                  value={barangay}
                  onChange={event => setBarangay(event.target.value)}
                  placeholder="Optional"
                />
              </label>

              <label className="hidden" aria-hidden="true">
                Website
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={event => setWebsite(event.target.value)}
                />
              </label>
            </div>

            <p className="mt-5 text-xs leading-relaxed text-gray-500">
              Do not include passwords, IDs, medical information or other
              sensitive personal data. Project submissions may be recorded in
              BetterMakati’s public GitHub repository for transparent follow-up.
            </p>

            {status !== 'idle' && (
              <div
                className={`mt-5 rounded-xl border p-4 text-sm ${
                  status === 'success'
                    ? 'border-success-200 bg-success-50 text-success-800'
                    : status === 'error'
                      ? 'border-error-200 bg-error-50 text-error-800'
                      : 'border-secondary-200 bg-secondary-50 text-secondary-900'
                }`}
                role="status"
              >
                {message}
                {status === 'success' && trackingUrl && (
                  <a
                    href={trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1 font-bold underline underline-offset-2"
                  >
                    Track this publicly <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {status === 'fallback' && fallbackUrl && (
                  <a
                    href={fallbackUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1 font-bold underline underline-offset-2"
                  >
                    Continue on GitHub <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="brand-btn-primary"
                disabled={status === 'submitting'}
              >
                <Send className="h-4 w-4" />
                {status === 'submitting' ? 'Sending…' : 'Send to BetterMakati'}
              </button>
              <a href="tel:911" className="text-sm text-red-700 font-semibold">
                Emergency? Call 911
              </a>
            </div>
          </form>
        </div>
      </Section>
    </>
  );
}
