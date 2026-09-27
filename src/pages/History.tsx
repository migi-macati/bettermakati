import { useState } from 'react';
import {
  BookOpen,
  Camera,
  Download,
  ExternalLink,
  FileText,
  Link as LinkIcon,
  Map as MapIcon,
  MapPin,
  Search,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import {
  makatiHistory,
  historyEras,
  historyResearchGaps,
  historyReviewed,
  type HistoryEvent,
  type HistorySource,
} from '../data/makatiHistory';
import SEO from '../components/SEO';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';
import PhotoCarousel from '../components/ui/PhotoCarousel';
import { historyImageSet } from '../data/cityImages';
import { placeRegistryById } from '../data/placeRegistry';
import { findBarangay } from '../data/barangays';
import { heritageCollectionById } from '../data/heritageCollections';

const topics = [...new Set(makatiHistory.map(event => event.topic))];

const evidenceLabels: Record<
  NonNullable<HistoryEvent['evidenceStatus']>,
  string
> = {
  established: 'Established',
  probable: 'Probable',
  contested: 'Contested',
  uncertain: 'Uncertain',
  tradition: 'Tradition',
};

const sourceTypeLabel = (source: HistorySource) =>
  [source.evidenceLevel, source.format, source.locator]
    .filter(Boolean)
    .join(' · ');

const eventSearchText = (event: HistoryEvent) =>
  [
    event.date,
    event.title,
    event.summary,
    event.topic,
    event.note,
    event.evidenceNote,
    ...event.sources.flatMap(source => [
      source.label,
      source.creator,
      source.repository,
      source.locator,
    ]),
    ...(event.relations?.people?.map(item => item.label) ?? []),
    ...(event.relations?.institutions?.map(item => item.label) ?? []),
    ...(event.relations?.barangaySlugs ?? []),
    ...(event.relations?.placeIds?.flatMap(id => {
      const place = placeRegistryById.get(id);
      return place
        ? [place.name, ...((place.aliases ?? []).map(alias => alias.name))]
        : [id];
    }) ?? []),
    ...(event.interpretations?.flatMap(item => [item.label, item.summary]) ?? []),
    ...(event.media?.flatMap(item => [item.title, item.caption]) ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLocaleLowerCase();

const ReferenceChip = ({
  item,
}: {
  item: { label: string; href?: string };
}) => {
  const classes =
    'rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700';

  if (!item.href) return <span className={classes}>{item.label}</span>;

  if (item.href.startsWith('/')) {
    return (
      <Link to={item.href} className={`${classes} hover:border-primary-400 hover:text-primary-800`}>
        {item.label}
      </Link>
    );
  }

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      className={`${classes} hover:border-primary-400 hover:text-primary-800`}
    >
      {item.label}
    </a>
  );
};

const SourceLink = ({
  source,
  compact = false,
}: {
  source: HistorySource;
  compact?: boolean;
}) => (
  <div>
    <a
      href={source.url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-start gap-2 font-semibold text-primary-700 underline decoration-primary-200 underline-offset-4 hover:text-primary-900"
    >
      <span>{source.label}</span>
      <ExternalLink
        className="mt-0.5 h-3.5 w-3.5 shrink-0"
        aria-hidden="true"
      />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
    {!compact && sourceTypeLabel(source) && (
      <p className="mt-1 text-xs leading-relaxed text-gray-500">
        {sourceTypeLabel(source)}
      </p>
    )}
    {!compact && source.citationNote && (
      <p className="mt-1 text-xs leading-relaxed text-gray-600">
        {source.citationNote}
      </p>
    )}
  </div>
);

export default function History() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [era, setEra] = useState('');
  const [topic, setTopic] = useState('');
  const [primaryOnly, setPrimaryOnly] = useState(false);
  const [newestFirst, setNewestFirst] = useState(false);

  const selectedEra = historyEras.find(item => item.label === era);
  const selectedHeritageCollection = heritageCollectionById(
    searchParams.get('collection')
  );
  const words = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);

  const events = makatiHistory
    .filter(
      event =>
        (!selectedEra ||
          (event.year >= selectedEra.from && event.year <= selectedEra.to)) &&
        (!topic || event.topic === topic) &&
        (!selectedHeritageCollection ||
          event.relations?.placeIds?.some(placeId =>
            selectedHeritageCollection.placeIds.includes(placeId)
          )) &&
        (!primaryOnly ||
          event.sources.some(source => source.evidenceLevel === 'Primary')) &&
        words.every(word => eventSearchText(event).includes(word))
    )
    .sort((a, b) => (newestFirst ? b.year - a.year : a.year - b.year));

  const reset = () => {
    setQuery('');
    setEra('');
    setTopic('');
    setPrimaryOnly(false);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('collection');
    nextParams.delete('query');
    setSearchParams(nextParams, { replace: true });
  };

  const download = () => {
    const url = URL.createObjectURL(
      new Blob(
        [
          JSON.stringify(
            {
              reviewed: historyReviewed,
              events,
            },
            null,
            2
          ),
        ],
        { type: 'application/json' }
      )
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bettermakati-history.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <>
      <SEO
        title="History of Makati"
        description="Explore Makati’s source-linked history from San Pedro Macati to the modern city, with archival maps, photographs, legal records and related places."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">History</div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-4xl">
            <Heading>History of Makati</Heading>
            <p className="max-w-3xl text-lg leading-relaxed text-gray-700">
              Follow the people, places, institutions and decisions that changed
              San Pedro Macati into the city we know today.
            </p>
          </div>
          <SharePage title="History of Makati | BetterMakati" />
        </div>

        <LastReviewed label="Timeline review" date={historyReviewed} />

        {selectedHeritageCollection && (
          <div className="mt-5 rounded-2xl border border-secondary-200 bg-secondary-50 p-5">
            <div className="text-xs font-bold uppercase tracking-[0.08em] text-secondary-800">
              Heritage collection
            </div>
            <div className="mt-1 text-lg font-extrabold text-gray-950">
              {selectedHeritageCollection.name}
            </div>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-gray-700">
              Showing timeline entries linked to places in this collection.
            </p>
            <Link
              to={'/heritage#collection-' + selectedHeritageCollection.id}
              className="mt-3 inline-flex text-sm font-bold text-primary-700 underline underline-offset-2"
            >
              Back to this heritage collection
            </Link>
          </div>
        )}

        <PhotoCarousel
          images={historyImageSet}
          title="Places that carry Makati’s history"
          compact
          className="mt-8"
        />

        <div
          className="mt-8 flex gap-2 overflow-x-auto pb-2"
          aria-label="History periods"
        >
          <button
            type="button"
            onClick={() => setEra('')}
            aria-pressed={!era}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${
              !era
                ? 'border-primary-700 bg-primary-700 text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:border-primary-500'
            }`}
          >
            All periods
          </button>
          {historyEras.map(item => {
            const count = makatiHistory.filter(
              event => event.year >= item.from && event.year <= item.to
            ).length;
            const active = era === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setEra(active ? '' : item.label)}
                aria-pressed={active}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${
                  active
                    ? 'border-primary-700 bg-primary-700 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-primary-500'
                }`}
              >
                {item.label} <span className="font-normal opacity-75">{count}</span>
              </button>
            );
          })}
        </div>

        <div
          className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6"
          role="search"
          aria-label="Search history"
        >
          <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <Search className="h-4 w-4 text-primary-700" aria-hidden="true" />
            <label htmlFor="history-query">
              Find a person, place, year, institution or event
            </label>
          </div>

          <input
            id="history-query"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Try Guadalupe, Nielson, Roxas, 1896, cityhood…"
            className="mt-3 w-full rounded-xl border border-gray-300 bg-[#fffdf8] p-3.5"
            type="search"
          />

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-gray-800">
              Topic
              <select
                value={topic}
                onChange={event => setTopic(event.target.value)}
                className="mt-2 block w-full rounded-xl border border-gray-300 bg-white p-3"
              >
                <option value="">All topics</option>
                {topics.map(item => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="text-sm font-semibold text-gray-800">
              Order
              <select
                value={newestFirst ? 'newest' : 'oldest'}
                onChange={event =>
                  setNewestFirst(event.target.value === 'newest')
                }
                className="mt-2 block w-full rounded-xl border border-gray-300 bg-white p-3"
              >
                <option value="oldest">Oldest first</option>
                <option value="newest">Newest first</option>
              </select>
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <label className="flex min-h-11 items-center gap-2 font-semibold text-gray-700">
              <input
                type="checkbox"
                checked={primaryOnly}
                onChange={event => setPrimaryOnly(event.target.checked)}
              />
              Primary-source evidence only
            </label>

            <button
              type="button"
              onClick={reset}
              className="min-h-11 font-bold text-primary-700 underline"
            >
              Clear filters
            </button>

            <button
              type="button"
              onClick={download}
              className="inline-flex min-h-11 items-center gap-2 font-bold text-primary-700"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download results
            </button>
          </div>
        </div>

        <div className="my-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-gray-600" role="status">
            {events.length} {events.length === 1 ? 'event' : 'events'}
          </p>
          {era && (
            <p className="text-sm font-semibold text-primary-800">{era}</p>
          )}
        </div>

        <ol className="space-y-6 border-l-2 border-primary-200 pl-5 sm:pl-8">
          {events.map(event => {
            const showEvidenceStatus =
              event.evidenceStatus && event.evidenceStatus !== 'established';
            const relatedEvents = event.relations?.eventIds
              ?.map(id => makatiHistory.find(item => item.id === id))
              .filter((item): item is HistoryEvent => Boolean(item));
            const relatedPlaces = event.relations?.placeIds?.flatMap(id => {
              const place = placeRegistryById.get(id);
              return place ? [place] : [];
            });
            const relatedBarangays = event.relations?.barangaySlugs?.map(slug => ({
              slug,
              name: findBarangay(slug)?.name ?? slug.replaceAll('-', ' '),
            }));

            return (
              <li
                key={event.id}
                id={event.id}
                className="relative scroll-mt-28"
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-[1.7rem] top-8 h-3 w-3 rounded-full border-2 border-[#fffdf8] bg-primary-700 sm:-left-[2.45rem]"
                />

                <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                  <div className="border-b border-gray-100 p-5 sm:p-7">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="mr-auto font-extrabold text-primary-800">
                        {event.date}
                      </p>
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                        {event.topic}
                      </span>
                      {showEvidenceStatus && event.evidenceStatus && (
                        <span className="rounded-full bg-secondary-100 px-3 py-1 text-xs font-bold text-secondary-900">
                          {evidenceLabels[event.evidenceStatus]}
                        </span>
                      )}
                    </div>

                    <h2 className="mt-3 text-xl font-extrabold leading-tight text-gray-950 sm:text-2xl">
                      <a
                        href={`#${event.id}`}
                        className="group inline-flex items-start gap-2"
                      >
                        <span>{event.title}</span>
                        <LinkIcon
                          aria-label="Link to this event"
                          className="mt-1 h-4 w-4 shrink-0 text-gray-400 group-hover:text-primary-700"
                        />
                      </a>
                    </h2>

                    <p className="mt-3 max-w-4xl leading-relaxed text-gray-700">
                      {event.summary}
                    </p>

                    {(event.evidenceNote || event.note) && (
                      <div className="mt-4 rounded-xl border-l-4 border-secondary-400 bg-secondary-50 px-4 py-3 text-sm leading-relaxed text-gray-700">
                        {event.evidenceNote ?? event.note}
                      </div>
                    )}
                  </div>

                  {event.media && event.media.length > 0 && (
                    <div className="grid gap-3 border-b border-gray-100 bg-gray-50/60 p-5 sm:grid-cols-2 sm:p-6">
                      {event.media.map(media => (
                        <div
                          key={media.id}
                          className="rounded-xl border border-gray-200 bg-white p-4"
                        >
                          <div className="flex items-start gap-3">
                            {media.kind === 'map' ? (
                              <MapIcon
                                className="mt-0.5 h-5 w-5 shrink-0 text-primary-700"
                                aria-hidden="true"
                              />
                            ) : (
                              <Camera
                                className="mt-0.5 h-5 w-5 shrink-0 text-primary-700"
                                aria-hidden="true"
                              />
                            )}
                            <div>
                              <p className="font-bold text-gray-950">
                                {media.title}
                              </p>
                              {media.date && (
                                <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                  {media.kind} · {media.date}
                                </p>
                              )}
                            </div>
                          </div>

                          {media.src && (
                            <img
                              src={media.src}
                              alt={media.alt ?? media.title}
                              className="mt-4 aspect-[16/9] w-full rounded-lg object-cover"
                              loading="lazy"
                            />
                          )}

                          {media.caption && (
                            <p className="mt-3 text-sm leading-relaxed text-gray-600">
                              {media.caption}
                            </p>
                          )}

                          <div className="mt-3 text-xs">
                            <SourceLink source={media.source} compact />
                          </div>

                          {media.rights && (
                            <p className="mt-2 text-xs leading-relaxed text-gray-500">
                              {media.rights}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {event.interpretations &&
                    event.interpretations.length > 0 && (
                      <div className="border-b border-gray-100 p-5 sm:p-6">
                        <div className="space-y-3">
                          {event.interpretations.map(interpretation => (
                            <div
                              key={interpretation.id}
                              className="rounded-xl bg-primary-50 p-4"
                            >
                              <p className="text-sm font-extrabold text-primary-950">
                                {interpretation.label}
                              </p>
                              <p className="mt-1 text-sm leading-relaxed text-gray-700">
                                {interpretation.summary}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {(relatedPlaces?.length ||
                    relatedBarangays?.length ||
                    event.relations?.people?.length ||
                    event.relations?.institutions?.length ||
                    relatedEvents?.length) && (
                    <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
                      <div className="flex flex-wrap gap-2">
                        {relatedPlaces?.map(place => (
                          <Link
                            key={place.id}
                            to={`/civic-map/${place.id}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-secondary-300 bg-secondary-50 px-3 py-1.5 text-xs font-bold text-secondary-900 hover:border-secondary-500"
                          >
                            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                            {place.name}
                          </Link>
                        ))}

                        {relatedBarangays?.map(barangay => (
                          <Link
                            key={barangay.slug}
                            to={`/barangays/${barangay.slug}`}
                            className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-800 hover:border-primary-400"
                          >
                            Barangay {barangay.name}
                          </Link>
                        ))}

                        {event.relations?.people?.map(person => (
                          <ReferenceChip key={person.label} item={person} />
                        ))}

                        {event.relations?.institutions?.map(institution => (
                          <ReferenceChip key={institution.label} item={institution} />
                        ))}
                      </div>

                      {relatedEvents && relatedEvents.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                            Related events
                          </p>
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                            {relatedEvents.map(related => (
                              <a
                                key={related.id}
                                href={`#${related.id}`}
                                className="text-sm font-semibold text-primary-700 underline"
                              >
                                {related.date} · {related.title}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-5 sm:p-6">
                    <details>
                      <summary className="cursor-pointer list-none text-sm font-extrabold text-primary-800">
                        <span className="inline-flex items-center gap-2">
                          <BookOpen
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                          {event.sources.length === 1
                            ? 'Source'
                            : `${event.sources.length} sources`}
                        </span>
                      </summary>
                      <div className="mt-4 space-y-4">
                        {event.sources.map((source, index) => (
                          <div
                            key={source.id ?? `${event.id}-source-${index}`}
                            className="border-l-2 border-gray-200 pl-4 text-sm"
                          >
                            <SourceLink source={source} />
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>

        {events.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <p>No events match these filters.</p>
            <button
              type="button"
              onClick={reset}
              className="mt-3 min-h-11 font-bold text-primary-700 underline"
            >
              Show all events
            </button>
          </div>
        )}

        <details className="mt-12 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <summary className="cursor-pointer list-none">
            <span className="inline-flex items-center gap-2 font-extrabold text-gray-950">
              <FileText className="h-5 w-5 text-primary-700" aria-hidden="true" />
              Open research questions
            </span>
          </summary>
          <ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-relaxed text-gray-700">
            {historyResearchGaps.map(gap => (
              <li key={gap}>{gap}</li>
            ))}
          </ul>
          <Link
            to="/get-involved"
            className="mt-5 inline-flex min-h-11 items-center font-bold text-primary-800 underline"
          >
            Contribute a document or correction →
          </Link>
        </details>
      </Section>
    </>
  );
}
