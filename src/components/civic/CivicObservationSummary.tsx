import { useEffect, useMemo, useState } from 'react';
import { Clock3, ExternalLink } from 'lucide-react';
import type { PlaceRegistryRecord } from '../../data/placeRegistry';
import {
  isNotObservedValue,
  observationQuestionSetForPlace,
  observationValueLabel,
  type ObservationAnswer,
} from '../../data/structuredObservations';

interface StoredObservation {
  id: number;
  placeId: string;
  familyId: string;
  questionSetId: string;
  observedAt: string;
  submittedAt: string;
  timeContext?: string;
  weatherContext?: string;
  answers: ObservationAnswer[];
  overallNote?: string;
  evidenceUrl?: string;
  publicAlias?: string;
  url?: string;
}

interface ObservationResponse {
  observations?: StoredObservation[];
  threadUrl?: string;
  error?: string;
}

const DAY_MS = 86_400_000;
const SUMMARY_WINDOW_DAYS = 90;

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));

const freshness = (observedAt: string) => {
  const ageDays = Math.max(
    0,
    Math.floor((Date.now() - new Date(observedAt).getTime()) / DAY_MS)
  );
  if (ageDays <= 30) return { label: 'Fresh', detail: ageDays + ' days old' };
  if (ageDays <= 90) return { label: 'Recent', detail: ageDays + ' days old' };
  return { label: 'Older', detail: ageDays + ' days old' };
};

const median = (values: number[]) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
};

export default function CivicObservationSummary({
  place,
  refreshKey = 0,
}: {
  place: PlaceRegistryRecord;
  refreshKey?: number;
}) {
  const [observations, setObservations] = useState<StoredObservation[]>([]);
  const [threadUrl, setThreadUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const questionSet = useMemo(() => observationQuestionSetForPlace(place), [place]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setFailed(false);

    void fetch('/api/civic-observation?placeId=' + encodeURIComponent(place.id), {
      signal: controller.signal,
    })
      .then(async response => {
        const data = (await response.json()) as ObservationResponse;
        if (!response.ok) throw new Error(data.error || 'Observation feed unavailable');
        setObservations(Array.isArray(data.observations) ? data.observations : []);
        setThreadUrl(data.threadUrl || '');
      })
      .catch(error => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setObservations([]);
        setThreadUrl('');
        setFailed(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [place.id, refreshKey]);

  const latestObservedAt = observations[0]?.observedAt;
  const freshnessInfo = latestObservedAt ? freshness(latestObservedAt) : null;
  const windowStart = Date.now() - SUMMARY_WINDOW_DAYS * DAY_MS;

  const summaries = questionSet.questions.flatMap(question => {
    const answerRows = observations
      .flatMap(observation =>
        observation.answers
          .filter(answer => answer.questionId === question.id)
          .map(answer => ({
            answer,
            observedAt: observation.observedAt,
          }))
      )
      .filter(row => !isNotObservedValue(row.answer.value))
      .sort(
        (a, b) =>
          new Date(b.observedAt).getTime() - new Date(a.observedAt).getTime()
      );

    if (!answerRows.length) return [];

    const latest = answerRows[0];
    const recentRows = answerRows.filter(
      row => new Date(row.observedAt).getTime() >= windowStart
    );

    if (question.responseType === 'waitMinutes') {
      const values = recentRows
        .map(row => Number(row.answer.value))
        .filter(Number.isFinite);
      const medianValue = median(values);
      return [
        {
          id: question.id,
          label: question.label,
          latestValue: observationValueLabel(
            question.responseType,
            latest.answer.value
          ),
          latestObservedAt: latest.observedAt,
          sampleCount: values.length,
          distribution:
            values.length > 0
              ? [
                  'median ' + String(medianValue) + ' min',
                  'range ' + Math.min(...values) + '–' + Math.max(...values) + ' min',
                ]
              : [],
        },
      ];
    }

    const counts = new Map<string, number>();
    for (const row of recentRows) {
      const label = observationValueLabel(question.responseType, row.answer.value);
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }

    return [
      {
        id: question.id,
        label: question.label,
        latestValue: observationValueLabel(
          question.responseType,
          latest.answer.value
        ),
        latestObservedAt: latest.observedAt,
        sampleCount: recentRows.length,
        distribution: [...counts.entries()]
          .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
          .map(([label, count]) => label + ' · ' + count),
      },
    ];
  });

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-[#fffdf8] p-5 text-sm text-gray-600">
        Loading condition observations…
      </div>
    );
  }

  if (failed) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-[#fffdf8] p-5 text-sm text-gray-600">
        Condition observations are temporarily unavailable.
      </div>
    );
  }

  if (!observations.length) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-[#fffdf8] p-5">
        <div className="font-extrabold text-gray-950">No observations yet</div>
        <a
          href="#observe"
          className="mt-2 inline-flex text-sm font-bold text-primary-700 underline underline-offset-2"
        >
          Record current conditions
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-5 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
            Observed conditions
          </div>
          <h3 className="mt-1 text-xl font-extrabold text-gray-950">
            Recent condition snapshot
          </h3>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
            <span>{observations.length} observation{observations.length === 1 ? '' : 's'}</span>
            {latestObservedAt && <span>Latest: {formatDate(latestObservedAt)}</span>}
          </div>
        </div>

        {freshnessInfo && (
          <div className="rounded-full border border-primary-200 bg-white px-3 py-1.5 text-xs font-bold text-primary-800">
            {freshnessInfo.label} · {freshnessInfo.detail}
          </div>
        )}
      </div>

      {summaries.length > 0 ? (
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {summaries.map(summary => (
            <article key={summary.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                {summary.label}
              </div>
              <div className="mt-1 font-extrabold text-gray-950">
                {summary.latestValue}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                <Clock3 className="h-3.5 w-3.5" />
                Observed {formatDate(summary.latestObservedAt)}
              </div>

              <div className="mt-3 border-t border-gray-100 pt-3">
                <div className="text-xs font-bold text-gray-600">
                  Last {SUMMARY_WINDOW_DAYS} days · n={summary.sampleCount}
                </div>
                {summary.distribution.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {summary.distribution.map(item => (
                      <span
                        key={item}
                        className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="mt-1 text-xs text-gray-500">
                    No substantive answers in the last {SUMMARY_WINDOW_DAYS} days.
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5 text-sm text-gray-600">
          These observations contain no substantive condition answers yet.
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-gray-500">
        <span>Fresh ≤30 days · Recent 31–90 days · Older &gt;90 days</span>
        {threadUrl && (
          <a
            href={threadUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-bold text-primary-700 underline underline-offset-2"
          >
            Public observation record <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
