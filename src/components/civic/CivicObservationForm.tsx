import { FormEvent, useMemo, useState } from 'react';
import { CheckCircle2, ExternalLink, Send } from 'lucide-react';
import type { PlaceRegistryRecord } from '../../data/placeRegistry';
import {
  observationQuestionSetForPlace,
  observationResponseChoices,
  type ObservationAnswer,
  type ObservationTimeContext,
  type ObservationWeatherContext,
} from '../../data/structuredObservations';

type SubmitState = 'idle' | 'submitting' | 'success' | 'fallback' | 'error';

const localDateTimeValue = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 16);
};

export default function CivicObservationForm({
  place,
  onSubmitted,
}: {
  place: PlaceRegistryRecord;
  onSubmitted?: () => void;
}) {
  const questionSet = useMemo(() => observationQuestionSetForPlace(place), [place]);
  const [observedAt, setObservedAt] = useState(localDateTimeValue);
  const [timeContext, setTimeContext] = useState<ObservationTimeContext>('unknown');
  const [weatherContext, setWeatherContext] = useState<ObservationWeatherContext>('unknown');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [overallNote, setOverallNote] = useState('');
  const [alias, setAlias] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<SubmitState>('idle');
  const [message, setMessage] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [fallbackUrl, setFallbackUrl] = useState('');

  const answerList = (): ObservationAnswer[] =>
    questionSet.questions.flatMap(question => {
      const raw = answers[question.id]?.trim();
      if (!raw) return [];

      if (question.responseType === 'waitMinutes') {
        const value = Number(raw);
        if (!Number.isInteger(value) || value < 0 || value > 240) return [];
        return [{ questionId: question.id, value }];
      }

      return [{ questionId: question.id, value: raw }];
    });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (status === 'submitting') return;

    const submittedAnswers = answerList();
    if (submittedAnswers.length === 0) {
      setStatus('error');
      setMessage('Record at least one condition you actually observed.');
      return;
    }

    const observedDate = new Date(observedAt);
    if (Number.isNaN(observedDate.getTime())) {
      setStatus('error');
      setMessage('Enter a valid observation date and time.');
      return;
    }

    setStatus('submitting');
    setMessage('');
    setTrackingUrl('');
    setFallbackUrl('');

    try {
      const response = await fetch('/api/civic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          kind: 'observation',
          placeId: place.id,
          assetId: place.id,
          assetTitle: place.name,
          assetType: place.primaryCategory,
          familyId: questionSet.familyId,
          questionSetId: questionSet.id,
          observedAt: observedDate.toISOString(),
          timeContext,
          weatherContext,
          answers: submittedAnswers,
          overallNote,
          alias,
          evidenceUrl,
          website,
        }),
      });
      const data = response.status === 204 ? {} : await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Observation saved.');
        setTrackingUrl(data.commentUrl || data.url || '');
        setOverallNote('');
        setEvidenceUrl('');
        setAnswers({});
        onSubmitted?.();
        return;
      }

      if (data.fallbackUrl) {
        setStatus('fallback');
        setFallbackUrl(data.fallbackUrl);
        setMessage('The observation was not saved here. You can continue with the pre-filled public form.');
        return;
      }

      setStatus('error');
      setMessage(data.error || 'The observation could not be saved.');
    } catch {
      setStatus('error');
      setMessage('The observation could not be saved.');
    }
  };

  return (
    <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm md:p-6">
      <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
        Condition snapshot
      </div>
      <h3 className="mt-1 text-xl font-extrabold text-gray-950">{questionSet.label}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">
        Record what you directly observed. Skip anything you did not check.
      </p>

      <form onSubmit={submit} className="mt-6" aria-busy={status === 'submitting'}>
        <fieldset disabled={status === 'submitting'} className="min-w-0">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="form-field">
              <span>Observed at</span>
              <input
                required
                type="datetime-local"
                value={observedAt}
                onChange={event => setObservedAt(event.target.value)}
              />
            </label>

            <label className="form-field">
              <span>Time context</span>
              <select
                value={timeContext}
                onChange={event => setTimeContext(event.target.value as ObservationTimeContext)}
              >
                <option value="unknown">Not specified</option>
                <option value="early-morning">Early morning</option>
                <option value="morning">Morning</option>
                <option value="midday">Midday</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="late-night">Late night</option>
              </select>
            </label>

            <label className="form-field">
              <span>Weather context</span>
              <select
                value={weatherContext}
                onChange={event => setWeatherContext(event.target.value as ObservationWeatherContext)}
              >
                <option value="unknown">Not specified</option>
                <option value="dry">Dry</option>
                <option value="raining">Raining</option>
                <option value="recent-rain">Recent rain</option>
                <option value="not-relevant">Not relevant</option>
              </select>
            </label>
          </div>

          <div className="mt-6 space-y-4">
            {questionSet.questions.map(question => (
              <div key={question.id} className="rounded-xl border border-gray-200 p-4">
                <label className="form-field">
                  <span>{question.label}</span>
                  <span className="text-xs font-normal leading-relaxed text-gray-500">
                    {question.prompt}
                  </span>

                  {question.responseType === 'waitMinutes' ? (
                    <input
                      type="number"
                      min={0}
                      max={240}
                      step={1}
                      inputMode="numeric"
                      value={answers[question.id] ?? ''}
                      onChange={event =>
                        setAnswers(current => ({
                          ...current,
                          [question.id]: event.target.value,
                        }))
                      }
                      placeholder="Minutes · optional"
                    />
                  ) : (
                    <select
                      value={answers[question.id] ?? ''}
                      onChange={event =>
                        setAnswers(current => ({
                          ...current,
                          [question.id]: event.target.value,
                        }))
                      }
                    >
                      <option value="">Skip this question</option>
                      {observationResponseChoices(question.responseType).map(choice => (
                        <option key={choice.value} value={choice.value}>
                          {choice.label}
                        </option>
                      ))}
                    </select>
                  )}
                </label>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="form-field md:col-span-2">
              <span>Context (optional)</span>
              <textarea
                rows={4}
                maxLength={1000}
                value={overallNote}
                onChange={event => setOverallNote(event.target.value)}
                placeholder="Brief factual context only. Do not include names, faces, medical details or allegations about identifiable people."
              />
            </label>

            <label className="form-field">
              <span>Public name / alias</span>
              <input
                maxLength={80}
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

          {status !== 'idle' && status !== 'submitting' && (
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
                    <a
                      href={trackingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 block font-bold underline underline-offset-2"
                    >
                      Open public observation <ExternalLink className="inline h-3.5 w-3.5" />
                    </a>
                  )}
                  {fallbackUrl && (
                    <a
                      href={fallbackUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 block font-bold underline underline-offset-2"
                    >
                      Continue on GitHub <ExternalLink className="inline h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {status !== 'success' && (
            <button type="submit" className="brand-btn-primary mt-6" disabled={status === 'submitting'}>
              <Send className="h-4 w-4" />
              {status === 'submitting' ? 'Saving…' : 'Save observation'}
            </button>
          )}
        </fieldset>
      </form>
    </div>
  );
}
