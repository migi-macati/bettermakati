import { FormEvent, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Bug,
  ClipboardCheck,
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
import { findBarangay } from '../data/barangays';
import { civicAuditPilot } from '../data/civicAuditPilot';

const actionCards = [
  {
    type: 'proposal',
    title: 'Propose something',
    description: 'Send a civic proposal for BetterMakati to document and follow publicly.',
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
    description: 'Offer research, data, design, field documentation or development help.',
    icon: HeartHandshake,
  },
  {
    type: 'contact',
    title: 'Contact BetterMakati',
    description: 'Send a general project message.',
    icon: MessageCircle,
  },
];

type SubmitState = 'idle' | 'submitting' | 'success' | 'duplicate' | 'fallback' | 'error';

export default function GetInvolved() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'idea';
  const initialTool = searchParams.get('tool') || '';
  const initialSubject = searchParams.get('subject') || '';
  const initialBarangay =
    findBarangay(searchParams.get('barangay') || undefined)?.name || '';

  const [type, setType] = useState(initialType);
  const [tool, setTool] = useState(initialTool);
  const [subject, setSubject] = useState(initialSubject);
  const [details, setDetails] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [barangay, setBarangay] = useState(initialBarangay);
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<SubmitState>('idle');
  const [message, setMessage] = useState('');
  const [fallbackUrl, setFallbackUrl] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus('submitting');
    setMessage('Sending your submission…');
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
        setTrackingUrl(data.url || '');

        if (data.duplicate) {
          setStatus('duplicate');
          setMessage(
            data.reference
              ? 'A matching open BetterMakati item already exists as #' + data.reference + '. No new item was created.'
              : 'A matching open BetterMakati item already exists. No new item was created.'
          );
          return;
        }

        setStatus('success');
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
        title={t('corePages.getInvolved.seoTitle')}
        description={t('corePages.getInvolved.seoDescription')}
      />
      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">{t('corePages.getInvolved.eyebrow')}</div>
        <Heading>{t('corePages.getInvolved.title')}</Heading>
        <p className="mt-2 max-w-3xl text-gray-600">
          Choose what you want to send or do.
        </p>

        <div className="mt-5 rounded-2xl border border-primary-200 bg-primary-50 p-5">
          <div className="font-extrabold text-gray-950">
            These forms are for BetterMakati contributions.
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-700">
            Submissions can be tracked publicly by BetterMakati. They are not automatically sent to the Makati City Government.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/participate" className="brand-btn-primary">
              Back to participation choices
            </Link>
            <Link to="/hotlines#makati-action-center" className="brand-btn-secondary">
              Need government action?
            </Link>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                <h2 className="mt-4 font-bold text-gray-950">{action.title}</h2>
                <p className="mt-1 text-sm text-gray-600">{action.description}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-7 rounded-2xl border border-primary-200 bg-primary-50 p-5 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-sm font-bold text-primary-800">
                <ClipboardCheck className="h-5 w-5" />
                Live civic audit
              </div>
              <h2 className="mt-2 text-xl font-extrabold text-gray-950">
                Check accessibility at a public park
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                Record entrance access, step-free access, seating and toilets at one of the pilot parks.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to={civicAuditPilot.route} className="brand-btn-primary">
                Record conditions
              </Link>
              <Link
                to={civicAuditPilot.route + '/results'}
                className="brand-btn-secondary"
              >
                View results
              </Link>
            </div>
          </div>
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
              Find another local civic portal
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Search the BetterLGU Directory by city or municipality.
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
          <div className="section-eyebrow">{t('corePages.getInvolved.submission')}</div>
          <Heading level={2}>{t('corePages.getInvolved.send')}</Heading>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Successful submissions return a public BetterMakati tracking link when
            the native workflow is available. This is not a City Government case
            unless an official channel separately accepts it.
          </p>

          <form
            onSubmit={submit}
            aria-busy={status === 'submitting'}
            aria-describedby="bettermakati-submission-privacy"
            className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="form-field">
                <span>{t('corePages.getInvolved.type')}</span>
                <select value={type} onChange={event => setType(event.target.value)}>
                  <option value="proposal">{t('corePages.getInvolved.proposal')}</option>
                  <option value="idea">{t('corePages.getInvolved.idea')}</option>
                  <option value="source">{t('corePages.getInvolved.source')}</option>
                  <option value="correction">{t('corePages.getInvolved.correction')}</option>
                  <option value="volunteer">{t('corePages.getInvolved.volunteer')}</option>
                  <option value="contact">{t('corePages.getInvolved.contact')}</option>
                </select>
              </label>

              <label className="form-field">
                <span>{t('corePages.getInvolved.tool')}</span>
                <select value={tool} onChange={event => setTool(event.target.value)}>
                  <option value="">{t('corePages.getInvolved.general')}</option>
                  {communityTools.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field md:col-span-2">
                <span>{t('corePages.getInvolved.subject')}</span>
                <input
                  required
                  value={subject}
                  onChange={event => setSubject(event.target.value)}
                  placeholder={t('corePages.getInvolved.shortTitle')}
                />
              </label>

              <label className="form-field md:col-span-2">
                <span>{t('corePages.getInvolved.details')}</span>
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
                <span>{t('corePages.getInvolved.sourceUrl')}</span>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={event => setSourceUrl(event.target.value)}
                  placeholder="https://"
                />
              </label>

              <label className="form-field">
                <span>{t('corePages.getInvolved.area')}</span>
                <input
                  value={barangay}
                  onChange={event => setBarangay(event.target.value)}
                  placeholder={t('corePages.getInvolved.optional')}
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

            <p
              id="bettermakati-submission-privacy"
              className="mt-5 text-xs leading-relaxed text-gray-500"
            >
              Do not include passwords, IDs, medical information or other
              sensitive personal data. Project submissions may be recorded in
              BetterMakati’s public GitHub repository for transparent follow-up.
            </p>

            {status !== 'idle' && (
              <div
                className={`mt-5 rounded-xl border p-4 text-sm ${
                  status === 'success'
                    ? 'border-success-200 bg-success-50 text-success-800'
                    : status === 'duplicate'
                      ? 'border-secondary-200 bg-secondary-50 text-secondary-900'
                    : status === 'error'
                      ? 'border-error-200 bg-error-50 text-error-800'
                      : 'border-secondary-200 bg-secondary-50 text-secondary-900'
                }`}
                role={status === 'error' ? 'alert' : 'status'}
              >
                {message}
                {status === 'success' && trackingUrl && (
                  <a
                    href={trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex min-h-11 items-center gap-1 font-bold underline underline-offset-2"
                  >
                    Track this publicly <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {status === 'duplicate' && trackingUrl && (
                  <a
                    href={trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex min-h-11 items-center gap-1 font-bold underline underline-offset-2"
                  >
                    Open existing item <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {status === 'fallback' && fallbackUrl && (
                  <a
                    href={fallbackUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex min-h-11 items-center gap-1 font-bold underline underline-offset-2"
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
              <a
                href="tel:911"
                className="inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-semibold text-error-700 underline underline-offset-2"
              >
                Emergency? Call 911
              </a>
            </div>
          </form>
        </div>
      </Section>
    </>
  );
}
