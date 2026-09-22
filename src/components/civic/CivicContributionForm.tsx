import { FormEvent, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  PhoneCall,
  Send,
  Star,
  ThumbsUp,
  Wrench,
} from 'lucide-react';
import type { CivicAsset, CivicContributionKind } from '../../data/civicMap';
import {
  civicIssueCategories,
  civicOfficialChannels,
  criteriaForAsset,
  issueCategoriesForAsset,
  proposalCategoriesForAsset,
} from '../../data/civicMap';

type SubmitState = 'idle' | 'submitting' | 'success' | 'duplicate' | 'fallback' | 'error';

interface DuplicateCase {
  number: number;
  title: string;
  url: string;
  comments: number;
  distanceMeters?: number | null;
}

const kindOptions: Array<{
  id: CivicContributionKind;
  label: string;
  description: string;
  icon: typeof Wrench;
}> = [
  { id: 'report', label: 'Report a problem', description: 'Something is broken, blocked, unsafe or not working.', icon: Wrench },
  { id: 'proposal', label: 'Suggest an improvement', description: 'A physical or service change could make this work better.', icon: ThumbsUp },
  { id: 'review', label: 'Rate this place / service', description: 'Rate the things you have experienced. Skip the rest.', icon: Star },
  { id: 'update', label: 'Update information', description: 'Route, hours, status or mapped information appears outdated.', icon: MessageSquare },
];

export default function CivicContributionForm({
  asset,
  initialKind = 'report',
  onSubmitted,
}: {
  asset: CivicAsset;
  initialKind?: CivicContributionKind;
  onSubmitted?: () => void;
}) {
  const [kind, setKind] = useState<CivicContributionKind>(initialKind);
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [alias, setAlias] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [severity, setSeverity] = useState('normal');
  const [side, setSide] = useState(asset.side === 'both' ? '' : asset.side || '');
  const [scores, setScores] = useState<Record<string, number>>({});
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<SubmitState>('idle');
  const [message, setMessage] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [fallbackUrl, setFallbackUrl] = useState('');
  const [duplicates, setDuplicates] = useState<DuplicateCase[]>([]);
  const [forceNew, setForceNew] = useState(false);

  const issueCategories = useMemo(() => issueCategoriesForAsset(asset.type), [asset.type]);
  const proposals = useMemo(() => proposalCategoriesForAsset(asset.type), [asset.type]);
  const criteria = useMemo(() => criteriaForAsset(asset.type), [asset.type]);

  const selectedIssue = civicIssueCategories.find(item => item.id === category);
  const emergency = kind === 'report' && Boolean(selectedIssue?.emergency);
  const preferredChannel = selectedIssue?.preferredChannel
    ? civicOfficialChannels[selectedIssue.preferredChannel]
    : undefined;

  const chooseKind = (value: CivicContributionKind) => {
    setKind(value);
    setCategory('');
    setStatus('idle');
    setMessage('');
    setTrackingUrl('');
    setFallbackUrl('');
    setDuplicates([]);
    setForceNew(false);
  };

  const requestPayload = () => ({
    action: 'create',
    kind,
    assetId: asset.id,
    assetTitle: asset.title,
    assetType: asset.type,
    category: kind === 'review' ? 'structured-review' : kind === 'update' ? 'information-update' : category,
    subject,
    details,
    location: asset.title,
    lat: asset.lat,
    lng: asset.lng,
    side,
    segmentFrom: asset.from,
    segmentTo: asset.to,
    severity: kind === 'report' ? severity : 'normal',
    preferredChannel: selectedIssue?.preferredChannel || '',
    alias,
    evidenceUrl,
    scores: kind === 'review' ? scores : {},
    forceNew,
    website,
  });

  const submitPayload = async (payload: ReturnType<typeof requestPayload>) => {
    const response = await fetch('/api/civic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = response.status === 204 ? {} : await response.json();

    if (response.status === 409 && Array.isArray(data.duplicates)) {
      setDuplicates(data.duplicates);
      setStatus('duplicate');
      setMessage(data.error || 'A similar open case already exists.');
      return;
    }

    if (response.ok) {
      setStatus('success');
      setTrackingUrl(data.url || '');
      setMessage(
        kind === 'review'
          ? 'Review added to this asset’s public BetterMakati review thread.'
          : 'Submitted to BetterMakati. This is not yet an official government case or referral.'
      );
      setDetails('');
      setEvidenceUrl('');
      setSubject('');
      setForceNew(false);
      onSubmitted?.();
      return;
    }

    if (data.emergency) {
      setStatus('error');
      setMessage(data.error || 'Use the official emergency channel.');
      return;
    }

    if (data.fallbackUrl) {
      setStatus('fallback');
      setFallbackUrl(data.fallbackUrl);
      setMessage('Your submission has not been saved. You can try again or continue with a pre-filled public form on GitHub, which requires a GitHub account.');
      return;
    }

    setStatus('error');
    setMessage(data.error || 'Submission failed. Please try again.');
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (emergency || status === 'submitting') return;
    if (kind === 'review' && Object.keys(scores).length === 0) {
      setStatus('error');
      setMessage('Choose at least one rating. Leave anything you cannot assess unrated.');
      return;
    }
    setStatus('submitting');
    setMessage('');
    setTrackingUrl('');
    setFallbackUrl('');
    try {
      await submitPayload(requestPayload());
    } catch {
      setStatus('error');
      setMessage('Submission failed. Please try again.');
    }
  };

  const confirmDuplicate = async (item: DuplicateCase) => {
    setStatus('submitting');
    try {
      const response = await fetch('/api/civic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'comment',
          issueNumber: item.number,
          commentType: kind === 'proposal' ? 'support' : 'confirm',
          alias,
          details: details
            ? details
            : kind === 'proposal'
              ? 'I support this proposal.'
              : 'I can confirm this issue is present.',
        }),
      });
      const data = response.status === 204 ? {} : await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not add confirmation.');
      setStatus('success');
      setTrackingUrl(item.url);
      onSubmitted?.();
      setMessage(
        kind === 'proposal'
          ? 'Support added to the existing proposal instead of creating a duplicate.'
          : 'Confirmation added to the existing case instead of creating a duplicate.'
      );
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Could not add confirmation.');
    }
  };

  const createSeparate = async () => {
    setForceNew(true);
    setStatus('submitting');
    try {
      await submitPayload({ ...requestPayload(), forceNew: true });
    } catch {
      setStatus('error');
      setMessage('Submission failed. Please try again.');
    }
  };

  return (
    <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm md:p-6">
      <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
        Contribute
      </div>
      <h2 className="mt-1 text-xl font-extrabold text-gray-950">
        What do you want to do here?
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {kindOptions.map(option => {
          const Icon = option.icon;
          const active = kind === option.id;
          return (
            <button
              key={option.id}
              type="button"
              disabled={status === 'submitting'}
              onClick={() => chooseKind(option.id)}
              className={
                active
                  ? 'rounded-xl border border-primary-500 bg-primary-50 p-4 text-left ring-2 ring-primary-100'
                  : 'rounded-xl border border-gray-200 bg-white p-4 text-left hover:border-primary-300'
              }
              aria-pressed={active}
            >
              <Icon className="h-5 w-5 text-primary-700" />
              <div className="mt-2 font-extrabold text-gray-950">{option.label}</div>
              <div className="mt-1 text-xs leading-relaxed text-gray-600">{option.description}</div>
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl border border-secondary-200 bg-secondary-50 p-4 text-xs leading-relaxed text-gray-700">
        <strong>Independent platform.</strong> BetterMakati is not an official City Government or agency reporting system. Ordinary reports are consolidated and reviewed before any government referral. Emergency reports must use official emergency channels.
      </div>

      <form onSubmit={submit} className="mt-6" aria-busy={status === 'submitting'}>
        <fieldset disabled={status === 'submitting'} className="min-w-0">
        <legend className="sr-only">Contribution details</legend>
        {kind === 'report' && (
          <div className="grid gap-5 md:grid-cols-2">
            <label className="form-field md:col-span-2">
              <span>What is the problem?</span>
              <select
                required
                value={category}
                onChange={event => {
                  setCategory(event.target.value);
                  setStatus('idle');
                }}
              >
                <option value="">Choose a problem</option>
                {issueCategories.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.emergency ? 'EMERGENCY — ' : item.urgent ? 'Urgent — ' : ''}
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            {asset.type.includes('segment') && (
              <label className="form-field">
                <span>Side / direction, if relevant</span>
                <select value={side} onChange={event => setSide(event.target.value)}>
                  <option value="">Not specified</option>
                  <option value="north">North side</option>
                  <option value="south">South side</option>
                  <option value="east">East side</option>
                  <option value="west">West side</option>
                  <option value="both">Both sides / whole segment</option>
                </select>
              </label>
            )}

            <label className="form-field">
              <span>How serious is it?</span>
              <select value={severity} onChange={event => setSeverity(event.target.value)}>
                <option value="normal">Ordinary maintenance / service issue</option>
                <option value="high">High priority / safety concern</option>
                <option value="recurring">Recurring / systemic problem</option>
              </select>
            </label>
          </div>
        )}

        {kind === 'proposal' && (
          <label className="form-field">
            <span>What improvement do you suggest?</span>
            <select required value={category} onChange={event => setCategory(event.target.value)}>
              <option value="">Choose an improvement</option>
              {proposals.map(item => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        )}

        {kind === 'review' && (
          <div>
            <div className="text-sm font-bold text-gray-900">Rate what you have experienced</div>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              1 = very poor · 2 = poor · 3 = adequate · 4 = good · 5 = excellent. Leave anything you cannot assess unrated.
            </p>
            <div className="mt-4 space-y-4">
              {criteria.map(item => (
                <fieldset key={item.id} className="min-w-0 rounded-xl border border-gray-200 p-4">
                  <legend className="px-1 font-bold text-gray-900">{item.label}</legend>
                  <div className="mt-1 text-xs text-gray-500">{item.description}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map(score => (
                      <button
                        key={score}
                        type="button"
                        onClick={() => setScores(current => ({ ...current, [item.id]: score }))}
                        aria-label={`${item.label}: ${score} of 5 — ${['Very poor', 'Poor', 'Adequate', 'Good', 'Excellent'][score - 1]}`}
                        aria-pressed={scores[item.id] === score}
                        className={
                          scores[item.id] === score
                            ? 'grid h-11 w-11 place-items-center rounded-full bg-primary-800 text-sm font-extrabold text-white'
                            : 'grid h-11 w-11 place-items-center rounded-full border border-gray-300 bg-white text-sm font-bold text-gray-700 hover:border-primary-400'
                        }
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                  <button type="button" disabled={!scores[item.id]} onClick={() => setScores(current => { const next = { ...current }; delete next[item.id]; return next; })} className="mt-2 min-h-11 text-xs font-bold text-primary-700 underline" aria-label={'Clear rating for ' + item.label}>Clear rating</button>
                </fieldset>
              ))}
            </div>
          </div>
        )}

        {emergency && selectedIssue && (
          <div className="mt-5 rounded-2xl border-2 border-error-300 bg-error-50 p-5 text-error-900">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0" />
              <div>
                <div className="font-extrabold">Do not wait for BetterMakati</div>
                <p className="mt-1 text-sm leading-relaxed">
                  {selectedIssue.label} may require immediate response. BetterMakati is not an emergency dispatcher and will not store this as an ordinary report.
                </p>
                <a href="tel:911" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-error-700 px-4 py-2 font-extrabold text-white">
                  <PhoneCall className="h-4 w-4" /> Call Unified 911
                </a>
                <a
                  href={civicOfficialChannels['911'].source}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 block text-xs font-bold underline underline-offset-2"
                >
                  Official 911 information <ExternalLink className="inline h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {!emergency && (
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {(kind === 'report' || kind === 'proposal' || kind === 'update') && (
              <label className="form-field md:col-span-2">
                <span>Short title</span>
                <input
                  value={subject}
                  onChange={event => setSubject(event.target.value)}
                  placeholder={
                    kind === 'proposal'
                      ? 'Example: Add a raised crosswalk near the corner'
                      : kind === 'update'
                        ? 'Example: Route information has changed'
                        : 'Example: Sidewalk blocked by parked vehicles'
                  }
                />
              </label>
            )}

            <label className="form-field md:col-span-2">
              <span>{kind === 'review' ? 'Review / context' : kind === 'proposal' ? 'Why would this help? Trade-offs or alternatives?' : kind === 'update' ? 'What information should be corrected?' : 'What did you observe?'}</span>
              <textarea
                required={kind !== 'review'}
                rows={5}
                value={details}
                onChange={event => setDetails(event.target.value)}
                placeholder={
                  asset.type === 'transport-route'
                    ? 'Describe the route/service experience. Do not post driver names, plate numbers or personal accusations in this public text.'
                    : 'Describe the condition, when you observed it, and any useful context. Do not include personal or sensitive information.'
                }
              />
            </label>

            <label className="form-field">
              <span>Public name / alias</span>
              <input
                value={alias}
                onChange={event => setAlias(event.target.value)}
                placeholder="Optional · default: Anonymous contributor"
              />
            </label>

            <label className="form-field">
              <span>Evidence link (optional)</span>
              <input
                type="url"
                value={evidenceUrl}
                onChange={event => setEvidenceUrl(event.target.value)}
                placeholder="https://…"
              />
              <span className="text-xs font-normal text-gray-600">Paste a publicly accessible photo or document link. Check that it contains no private information.</span>
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
        )}

        {preferredChannel && !emergency && (
          <div className="mt-5 rounded-xl border border-gray-200 bg-[#fffdf8] p-4 text-sm text-gray-700">
            <strong>Likely official channel:</strong> {preferredChannel.label}. BetterMakati can consolidate this community case, but formal action remains with the responsible authority.
            <div className="mt-2 flex flex-wrap gap-3 text-xs">
              <a href={preferredChannel.href} className="font-bold text-primary-700 underline underline-offset-2">
                Open official channel
              </a>
              {'secondary' in preferredChannel && preferredChannel.secondary && (
                <a href={preferredChannel.secondary} className="font-bold text-primary-700 underline underline-offset-2">
                  Alternate contact
                </a>
              )}
            </div>
          </div>
        )}

        {!emergency && (
          <p className="mt-5 text-xs leading-relaxed text-gray-500">
            No account is required during the Civic Map pilot. Submissions are intended to become public community records. Do not include IDs, medical information, private phone numbers, names of rank-and-file workers, or unverified accusations. BetterMakati may consolidate duplicates and moderate unsafe or irrelevant content.
          </p>
        )}

        {status === 'duplicate' && duplicates.length > 0 && (
          <div role="status" className="mt-5 rounded-2xl border border-secondary-300 bg-secondary-50 p-5">
            <div className="font-extrabold text-gray-950">This may already be reported</div>
            <p className="mt-1 text-sm text-gray-700">
              If this describes the same problem, add your confirmation and details to that case.
            </p>
            <div className="mt-4 space-y-3">
              {duplicates.map(item => (
                <div key={item.number} className="rounded-xl border border-secondary-200 bg-white p-4">
                  <div className="font-bold text-gray-950">#{item.number} {item.title}</div>
                  <div className="mt-1 text-xs text-gray-500">
                    {item.comments} community update{item.comments === 1 ? '' : 's'}
                    {typeof item.distanceMeters === 'number' ? ' · about ' + Math.round(item.distanceMeters) + ' m away' : ''}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => void confirmDuplicate(item)} className="brand-btn-primary">
                      {kind === 'proposal' ? 'Support this proposal' : 'Confirm this issue'}
                    </button>
                    <a href={item.url} target="_blank" rel="noreferrer" className="brand-btn-secondary">
                      Open case
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => void createSeparate()} className="mt-4 text-sm font-bold text-primary-700 underline underline-offset-2">
              This is different — create a separate case
            </button>
          </div>
        )}

        {status !== 'idle' && status !== 'duplicate' && (
          <div
            role="status"
            className={
              status === 'success'
                ? 'mt-5 rounded-xl border border-success-200 bg-success-50 p-4 text-sm text-success-900'
                : status === 'error'
                  ? 'mt-5 rounded-xl border border-error-200 bg-error-50 p-4 text-sm text-error-900'
                  : 'mt-5 rounded-xl border border-secondary-200 bg-secondary-50 p-4 text-sm text-secondary-900'
            }
          >
            <div className="flex gap-2">
              {status === 'success' && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
              <div>
                {message}
                {trackingUrl && (
                  <a href={trackingUrl} target="_blank" rel="noreferrer" className="mt-2 block font-bold underline underline-offset-2">
                    Open public BetterMakati record <ExternalLink className="inline h-3.5 w-3.5" />
                  </a>
                )}
                {fallbackUrl && (
                  <a href={fallbackUrl} target="_blank" rel="noreferrer" className="mt-2 block font-bold underline underline-offset-2">
                    Continue on GitHub <ExternalLink className="inline h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {!emergency && status !== 'success' && status !== 'duplicate' && (
          <div className="mt-6">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="brand-btn-primary"
            >
              <Send className="h-4 w-4" />
              {status === 'submitting'
                ? 'Submitting…'
                : kind === 'review'
                  ? 'Publish review'
                  : kind === 'proposal'
                    ? 'Suggest improvement'
                    : kind === 'update'
                      ? 'Submit update'
                      : 'Report to BetterMakati'}
            </button>
          </div>
        )}
        {status === 'success' && <button type="button" className="brand-btn-secondary mt-5" onClick={() => { setStatus('idle'); setMessage(''); setScores({}); setDetails(''); setEvidenceUrl(''); setSubject(''); setTrackingUrl(''); setCategory(''); setSeverity('normal'); }}>Start another contribution</button>}
        </fieldset>
      </form>
    </div>
  );
}
