import { FormEvent, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  PhoneCall,
  Send,
} from 'lucide-react';
import {
  civicIssueCategories,
  civicOfficialChannels,
  issueCategoriesForAsset,
} from '../../data/civicMap';
import type { PlacePoint, PlaceRegistryRecord } from '../../data/placeRegistry';

type SubmitState = 'idle' | 'submitting' | 'success' | 'duplicate' | 'fallback' | 'error';

interface DuplicateCase {
  number: number;
  title: string;
  url: string;
  comments: number;
  distanceMeters?: number | null;
}

const locationOnlyCategoryIds = new Set([
  'open-manhole',
  'traffic-signal',
  'dangerous-tree',
  'sidewalk-blocked',
  'vehicle-obstruction',
  'graffiti',
  'litter',
  'pothole',
  'broken-sidewalk',
  'curb-ramp',
  'crossing-problem',
  'streetlight',
  'flooding',
  'drainage-blocked',
  'construction-obstruction',
  'damaged-equipment',
  'accessibility-barrier',
]);

const roundCoordinate = (value: number) => Math.round(value * 10000) / 10000;

export default function CivicNearbyReportForm({
  place,
  point,
  onSubmitted,
}: {
  place: PlaceRegistryRecord | null;
  point: PlacePoint;
  onSubmitted?: () => void;
}) {
  const locationMode = place ? 'matched-place' : 'location-only';
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [locationLabel, setLocationLabel] = useState('');
  const [alias, setAlias] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [severity, setSeverity] = useState('normal');
  const [side, setSide] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<SubmitState>('idle');
  const [message, setMessage] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [fallbackUrl, setFallbackUrl] = useState('');
  const [duplicates, setDuplicates] = useState<DuplicateCase[]>([]);
  const [forceNew, setForceNew] = useState(false);

  const issueCategories = useMemo(() => {
    if (place) return issueCategoriesForAsset(place.primaryCategory);
    return civicIssueCategories.filter(
      item => item.emergency || locationOnlyCategoryIds.has(item.id)
    );
  }, [place]);

  const selectedIssue = civicIssueCategories.find(item => item.id === category);
  const emergency = Boolean(selectedIssue?.emergency);
  const preferredChannel = selectedIssue?.preferredChannel
    ? civicOfficialChannels[selectedIssue.preferredChannel]
    : undefined;
  const isSegment = place
    ? ['street-segment', 'sidewalk-segment'].includes(place.primaryCategory)
    : false;

  const requestPayload = () => ({
    action: 'create',
    kind: 'report',
    placeId: place?.id ?? '',
    locationMode,
    assetId: place?.id ?? '',
    assetTitle: place?.name ?? '',
    assetType: place?.primaryCategory ?? '',
    category,
    subject,
    details,
    location: place?.name ?? locationLabel,
    locationLabel: place?.name ?? locationLabel,
    lat: roundCoordinate(point.lat),
    lng: roundCoordinate(point.lng),
    side,
    segmentFrom: place?.location.geometry?.from ?? '',
    segmentTo: place?.location.geometry?.to ?? '',
    severity,
    preferredChannel: selectedIssue?.preferredChannel ?? '',
    alias,
    evidenceUrl,
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
      setMessage('Submitted to BetterMakati. This is not yet an official government case or referral.');
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
      setMessage('Your submission has not been saved. You can try again or continue with the pre-filled public form.');
      return;
    }

    setStatus('error');
    setMessage(data.error || 'Submission failed. Please try again.');
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (emergency || status === 'submitting') return;
    if (!place && !locationLabel.trim()) {
      setStatus('error');
      setMessage('Describe the location before submitting.');
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
          commentType: 'confirm',
          alias,
          details: details || 'I can confirm this issue is present.',
        }),
      });
      const data = response.status === 204 ? {} : await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not add confirmation.');
      setStatus('success');
      setTrackingUrl(item.url);
      setMessage('Confirmation added to the existing case instead of creating a duplicate.');
      onSubmitted?.();
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
        Report a problem
      </div>
      <h2 className="mt-1 text-xl font-extrabold text-gray-950">
        {place ? place.name : 'This location'}
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        {roundCoordinate(point.lat).toFixed(4)}, {roundCoordinate(point.lng).toFixed(4)}
      </p>

      <form onSubmit={submit} className="mt-6" aria-busy={status === 'submitting'}>
        <fieldset disabled={status === 'submitting'} className="min-w-0">
          {!place && (
            <label className="form-field">
              <span>Where exactly is it?</span>
              <input
                required
                value={locationLabel}
                onChange={event => setLocationLabel(event.target.value)}
                placeholder="Example: corner of J.P. Rizal and P. Burgos"
              />
            </label>
          )}

          <div className={!place ? 'mt-5 grid gap-5 md:grid-cols-2' : 'grid gap-5 md:grid-cols-2'}>
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

            {isSegment && (
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

          {emergency && selectedIssue && (
            <div className="mt-5 rounded-2xl border-2 border-error-300 bg-error-50 p-5 text-error-900">
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0" />
                <div>
                  <div className="font-extrabold">Do not wait for BetterMakati</div>
                  <p className="mt-1 text-sm leading-relaxed">
                    {selectedIssue.label} may require immediate response. This will not be submitted as an ordinary civic case.
                  </p>
                  <a href="tel:911" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-error-700 px-4 py-2 font-extrabold text-white">
                    <PhoneCall className="h-4 w-4" /> Call Unified 911
                  </a>
                </div>
              </div>
            </div>
          )}

          {!emergency && (
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="form-field md:col-span-2">
                <span>Short title</span>
                <input
                  value={subject}
                  onChange={event => setSubject(event.target.value)}
                  placeholder="Example: Sidewalk blocked by parked vehicles"
                />
              </label>

              <label className="form-field md:col-span-2">
                <span>What did you observe?</span>
                <textarea
                  required
                  rows={5}
                  value={details}
                  onChange={event => setDetails(event.target.value)}
                  placeholder="Describe the condition, when you observed it, and useful context. Do not include personal or sensitive information."
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
              <strong>Likely official channel:</strong> {preferredChannel.label}
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

          {status === 'duplicate' && duplicates.length > 0 && (
            <div role="status" className="mt-5 rounded-2xl border border-secondary-300 bg-secondary-50 p-5">
              <div className="font-extrabold text-gray-950">This may already be reported</div>
              <p className="mt-1 text-sm text-gray-700">
                If this is the same problem, confirm the existing case instead.
              </p>
              <div className="mt-4 space-y-3">
                {duplicates.map(item => (
                  <div key={item.number} className="rounded-xl border border-secondary-200 bg-white p-4">
                    <div className="font-bold text-gray-950">#{item.number} {item.title}</div>
                    <div className="mt-1 text-xs text-gray-500">
                      {item.comments} community update{item.comments === 1 ? '' : 's'}
                      {typeof item.distanceMeters === 'number'
                        ? ' · about ' + Math.round(item.distanceMeters) + ' m away'
                        : ''}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => void confirmDuplicate(item)} className="brand-btn-primary">
                        Confirm this issue
                      </button>
                      <a href={item.url} target="_blank" rel="noreferrer" className="brand-btn-secondary">
                        Open case
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => void createSeparate()}
                className="mt-4 text-sm font-bold text-primary-700 underline underline-offset-2"
              >
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
            <button type="submit" disabled={status === 'submitting'} className="brand-btn-primary mt-6">
              <Send className="h-4 w-4" />
              {status === 'submitting' ? 'Submitting…' : 'Report to BetterMakati'}
            </button>
          )}
        </fieldset>
      </form>
    </div>
  );
}
