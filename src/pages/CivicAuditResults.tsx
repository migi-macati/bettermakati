import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
} from 'lucide-react';
import { Link } from 'react-router';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import {
  civicAuditPilot,
  civicAuditPilotQuestionLabels,
} from '../data/civicAuditPilot';
import { placeRegistryById } from '../data/placeRegistry';
import {
  observationValueLabel,
  type ObservationResponseType,
} from '../data/structuredObservations';

interface AuditEntityResult {
  entityId: string;
  name: string;
  observationCount: number;
  latestObservedAt: string | null;
  substantiveQuestionCount: number;
  requiredQuestionCount: number;
  isComplete: boolean;
}

interface AuditQuestionResult {
  questionId: (typeof civicAuditPilot.questionIds)[number];
  sampleCount: number;
  distribution: Record<string, number>;
  latestObservedAt: string | null;
}

interface AuditOutput {
  campaignId: string;
  status: 'collecting';
  asOf: string;
  startsAt: string;
  endsAt: string;
  targetCount: number;
  minimumObservationsPerEntity: number;
  observationCount: number;
  observedEntities: number;
  completeEntities: number;
  latestObservedAt: string | null;
  entities: AuditEntityResult[];
  questions: AuditQuestionResult[];
  error?: string;
}

const responseTypeByQuestion: Record<
  (typeof civicAuditPilot.questionIds)[number],
  ObservationResponseType
> = {
  'entrance-access': 'availability',
  'step-free-access': 'stepFreeAccess',
  seating: 'availability',
  toilets: 'availability',
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Manila',
  }).format(new Date(value));

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Manila',
  }).format(new Date(value));

export default function CivicAuditResults() {
  const [data, setData] = useState<AuditOutput | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');

  useEffect(() => {
    const controller = new AbortController();
    void fetch(
      '/api/civic-audit?campaign=' + encodeURIComponent(civicAuditPilot.id),
      { signal: controller.signal }
    )
      .then(async response => {
        const body = (await response.json()) as AuditOutput;
        if (!response.ok) throw new Error(body.error || 'Audit output unavailable');
        setData(body);
        setState('ready');
      })
      .catch(error => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setData(null);
        setState('failed');
      });

    return () => controller.abort();
  }, []);

  const entities = data?.entities ?? civicAuditPilot.targetEntityIds.map(entityId => {
    const place = placeRegistryById.get(entityId);
    return {
      entityId,
      name: place?.name ?? entityId,
      observationCount: 0,
      latestObservedAt: null,
      substantiveQuestionCount: 0,
      requiredQuestionCount: civicAuditPilot.questionIds.length,
      isComplete: false,
    };
  });

  const questions = data?.questions ?? civicAuditPilot.questionIds.map(questionId => ({
    questionId,
    sampleCount: 0,
    distribution: {},
    latestObservedAt: null,
  }));
  const targetCount = data?.targetCount ?? civicAuditPilot.targetEntityIds.length;

  return (
    <>
      <SEO
        title="Public Park Accessibility Check — Live Output | Civic Map"
        description="Live coverage, sample counts and structured observation distributions for BetterMakati's 13-park accessibility audit pilot."
        keywords="Makati park accessibility audit results, public parks, step-free access, park seating, public toilets"
      />

      <Section className="bg-[#fffdf8]">
        <Breadcrumbs
          className="mb-7"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Civic Map', href: '/civic-map' },
            { label: 'Park accessibility check', href: civicAuditPilot.route },
            { label: 'Live output', href: civicAuditPilot.route + '/results' },
          ]}
        />

        <Link
          to={civicAuditPilot.route}
          className="inline-flex items-center gap-1 text-sm font-bold text-primary-700"
        >
          <ArrowLeft className="h-4 w-4" /> Park accessibility check
        </Link>

        <div className="section-eyebrow mt-6">Live audit output</div>
        <Heading>Public park accessibility observations</Heading>
        <p className="mt-3 max-w-4xl text-lg leading-relaxed text-gray-700">
          Coverage and observed conditions from the 13 parks frozen into the pilot.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary-700" />
            {formatDate(civicAuditPilot.startsAt)} to {formatDate(civicAuditPilot.endsAt)}
          </span>
          {data?.asOf && <span>Updated {formatDateTime(data.asOf)}</span>}
        </div>

        {state === 'failed' && (
          <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
            Live observations are temporarily unavailable.
          </div>
        )}

        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-primary-100 bg-white p-4">
            <div className="text-2xl font-extrabold text-gray-950">
              {state !== 'ready' ? '—' : data?.observationCount ?? 0}
            </div>
            <div className="mt-1 text-xs font-bold text-gray-600">campaign observations</div>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-white p-4">
            <div className="text-2xl font-extrabold text-gray-950">
              {state !== 'ready' ? '—' : (data?.observedEntities ?? 0) + '/' + targetCount}
            </div>
            <div className="mt-1 text-xs font-bold text-gray-600">parks with observations</div>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-white p-4">
            <div className="text-2xl font-extrabold text-gray-950">
              {state !== 'ready' ? '—' : (data?.completeEntities ?? 0) + '/' + targetCount}
            </div>
            <div className="mt-1 text-xs font-bold text-gray-600">parks meeting the pilot completion rule</div>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-white p-4">
            <div className="text-lg font-extrabold text-gray-950">
              {state !== 'ready'
                ? '—'
                : data?.latestObservedAt
                  ? formatDate(data.latestObservedAt)
                  : 'None yet'}
            </div>
            <div className="mt-1 text-xs font-bold text-gray-600">latest campaign observation</div>
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Four audit questions</div>
        <Heading level={2}>Observed distributions</Heading>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {questions.map(question => {
            const type = responseTypeByQuestion[question.questionId];
            const distribution = Object.entries(question.distribution).sort(
              (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
            );

            return (
              <article
                key={question.questionId}
                className="rounded-2xl border border-gray-200 bg-[#fffdf8] p-5"
              >
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                  {civicAuditPilotQuestionLabels[question.questionId]}
                </div>
                <div className="mt-2 text-sm font-bold text-gray-700">
                  n={question.sampleCount}
                </div>

                {state === 'failed' ? (
                  <p className="mt-3 text-sm text-gray-500">
                    Live observations unavailable.
                  </p>
                ) : distribution.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {distribution.map(([value, count]) => (
                      <span
                        key={value}
                        className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700"
                      >
                        {observationValueLabel(type, value)} · {count}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-gray-500">
                    No substantive campaign-period answers yet.
                  </p>
                )}

                {question.latestObservedAt && (
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock3 className="h-3.5 w-3.5" />
                    Latest {formatDate(question.latestObservedAt)}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="section-eyebrow">Park coverage</div>
            <Heading level={2}>{targetCount} frozen target parks</Heading>
          </div>
          <Link to={civicAuditPilot.route} className="brand-btn-primary">
            Add an observation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid gap-3">
          {entities.map(entity => {
            const place = placeRegistryById.get(entity.entityId);
            const barangay = place?.location.barangays.join(' · ') || '';
            const stateLabel =
              state === 'failed'
                ? 'Live data unavailable'
                : state === 'loading'
                  ? 'Loading'
                  : entity.isComplete
                    ? 'Complete'
                    : entity.observationCount > 0
                      ? 'In progress'
                      : 'No observations';

            return (
              <article
                key={entity.entityId}
                className="grid gap-4 rounded-2xl border border-primary-100 bg-white p-5 md:grid-cols-[1fr_auto] md:items-center"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-gray-950">{entity.name}</h3>
                    <span
                      className={
                        entity.isComplete
                          ? 'text-xs font-bold text-success-700'
                          : 'text-xs font-bold text-gray-500'
                      }
                    >
                      {stateLabel}
                    </span>
                  </div>
                  {barangay && (
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                      <MapPin className="h-3.5 w-3.5" /> {barangay}
                    </div>
                  )}
                  {state === 'ready' && (
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-600">
                      <span>
                        {entity.observationCount} observation{entity.observationCount === 1 ? '' : 's'}
                      </span>
                      <span>
                        {entity.substantiveQuestionCount}/{entity.requiredQuestionCount} required questions observed
                      </span>
                      {entity.latestObservedAt && (
                        <span>Latest {formatDate(entity.latestObservedAt)}</span>
                      )}
                    </div>
                  )}
                </div>

                <Link
                  to={
                    '/civic-map/' +
                    entity.entityId +
                    '?campaign=' +
                    civicAuditPilot.id +
                    '#observe'
                  }
                  className="brand-btn-secondary md:justify-self-end"
                >
                  {entity.isComplete ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                  Observe
                </Link>
              </article>
            );
          })}
        </div>
      </Section>
    </>
  );
}
