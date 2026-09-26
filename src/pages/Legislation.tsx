import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import {
  BookOpen,
  ChevronDown,
  ExternalLink,
  FileSearch,
  FileText,
  Search,
} from 'lucide-react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';
import { openCongressMakatiRecords } from '../data/openCongressMakati';
import {
  localLegislationById,
  localLegislationRecords,
  type LocalMeasureType,
} from '../data/localLegislation';

const officialArchive =
  'https://www.makati.gov.ph/content/resolutions-and-ordinances/author';
const charterUrl =
  'https://lawphil.net/statutes/repacts/ra1995/ra_7854_1995.html';
const browserIndexUrl = '/data/makati-legislation-index.json';
const visibleResultLimit = 60;

type BrowserLegislationRecord = [
  archiveLegislationId: string,
  measureType: LocalMeasureType,
  officialNumber: string,
  seriesYear: number | null,
  title: string,
  officialDocumentUrl: string | null,
];

interface BrowserLegislationIndex {
  schemaVersion: number;
  generatedAt: string;
  sourceDate: string;
  archiveUrl: string | null;
  total: number;
  countByType: Partial<Record<LocalMeasureType, number>>;
  years: number[];
  records: BrowserLegislationRecord[];
}

const fallbackRecords: BrowserLegislationRecord[] = localLegislationRecords.map(
  record => [
    '',
    record[1],
    record.reference.officialNumber,
    record.reference.seriesYear ?? null,
    record[4],
    record.documents.find(document => document.kind === 'official-text')?.url ??
      null,
  ]
);

const recordIdFor = (record: BrowserLegislationRecord) => {
  const [, measureType, officialNumber] = record;
  const slug = officialNumber
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return measureType + '-' + slug;
};

const displayFor = (record: BrowserLegislationRecord) => {
  const [, measureType, officialNumber] = record;
  return (
    'City ' +
    (measureType === 'ordinance' ? 'Ordinance' : 'Resolution') +
    ' No. ' +
    officialNumber
  );
};

const measureFilters: Array<{
  value: 'all' | LocalMeasureType;
  label: string;
}> = [
  { value: 'all', label: 'All records' },
  { value: 'ordinance', label: 'Ordinances' },
  { value: 'resolution', label: 'Resolutions' },
];

export default function Legislation() {
  const [query, setQuery] = useState('');
  const [measureType, setMeasureType] = useState<'all' | LocalMeasureType>('all');
  const [year, setYear] = useState('all');
  const [archiveIndex, setArchiveIndex] = useState<BrowserLegislationIndex | null>(
    null
  );
  const [archiveError, setArchiveError] = useState(false);
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(browserIndexUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Unable to load legislation index.');
        }
        return response.json() as Promise<BrowserLegislationIndex>;
      })
      .then(index => {
        if (!cancelled) setArchiveIndex(index);
      })
      .catch(() => {
        if (!cancelled) setArchiveError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const records = archiveIndex?.records ?? fallbackRecords;

  const resultSet = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const matches = records.filter(record => {
      if (measureType !== 'all' && record[1] !== measureType) return false;
      if (year !== 'all' && String(record[3] ?? '') !== year) return false;
      if (!normalizedQuery) return true;

      const seed = localLegislationById.get(recordIdFor(record));
      const haystack = [
        displayFor(record),
        record[2],
        record[4],
        ...(seed?.topics ?? []),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });

    matches.sort(
      (a, b) =>
        (b.seriesYear ?? 0) - (a.seriesYear ?? 0) ||
        b.officialNumber.localeCompare(a.officialNumber, undefined, {
          numeric: true,
        })
    );

    return {
      total: matches.length,
      visible: matches.slice(0, visibleResultLimit),
    };
  }, [records, query, measureType, year]);

  const indexedTotal = archiveIndex?.total ?? fallbackRecords.length;
  const ordinanceCount =
    archiveIndex?.countByType.ordinance ??
    fallbackRecords.filter(record => record[1] === 'ordinance').length;
  const resolutionCount =
    archiveIndex?.countByType.resolution ??
    fallbackRecords.filter(record => record[1] === 'resolution').length;

  return (
    <>
      <SEO
        title="Legislation"
        description="Search BetterMakati-indexed Makati ordinances and resolutions, inspect the local record, then open the official source."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">City records</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Heading>Legislation</Heading>
            <p className="max-w-3xl text-gray-600">
              Search Makati ordinances and resolutions indexed by BetterMakati.
            </p>
          </div>
          <SharePage title="Makati Legislation | BetterMakati" />
        </div>
        <LastReviewed />

        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/city-monitor" className="brand-btn-primary">
            Track legislative lifecycle
          </Link>
          <a
            href={officialArchive}
            target="_blank"
            rel="noreferrer"
            className="brand-btn-secondary"
          >
            Official Makati archive <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <div
          className="mt-7 max-w-5xl rounded-2xl border border-primary-100 bg-white p-5"
          role="search"
          aria-label="Search BetterMakati legislation index"
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <label htmlFor="legislation-search" className="font-extrabold text-gray-950">
              Search local records
            </label>
            <span className="text-sm font-bold text-gray-500">
              {indexedTotal.toLocaleString()} indexed
            </span>
          </div>

          <div className="relative mt-3">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              id="legislation-search"
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Reference number, title or topic"
              className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {measureFilters.map(filter => {
              const active = measureType === filter.value;
              const count =
                filter.value === 'all'
                  ? indexedTotal
                  : filter.value === 'ordinance'
                    ? ordinanceCount
                    : resolutionCount;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setMeasureType(filter.value)}
                  aria-pressed={active}
                  className={
                    active
                      ? 'brand-chip border-primary-700 bg-primary-700 text-white'
                      : 'brand-chip'
                  }
                >
                  {filter.label} ({count.toLocaleString()})
                </button>
              );
            })}

            {archiveIndex?.years.length ? (
              <label className="relative ml-0 sm:ml-2">
                <span className="sr-only">Filter by year</span>
                <select
                  value={year}
                  onChange={event => setYear(event.target.value)}
                  className="appearance-none rounded-full border border-gray-300 bg-white py-2 pl-4 pr-9 text-sm font-bold text-gray-700 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                >
                  <option value="all">All years</option>
                  {archiveIndex.years.map(item => (
                    <option key={item} value={String(item)}>
                      {item}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                  aria-hidden="true"
                />
              </label>
            ) : null}
          </div>

          {!archiveIndex && !archiveError ? (
            <p className="mt-4 text-sm text-gray-500">Loading full archive…</p>
          ) : null}
          {archiveError ? (
            <p className="mt-4 text-sm text-gray-600">
              Showing the verified local set. The full archive index is unavailable.
            </p>
          ) : null}
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="section-eyebrow">BetterMakati index</div>
            <Heading level={2}>Local ordinances & resolutions</Heading>
          </div>
          <div className="text-sm font-bold text-gray-600">
            {resultSet.total.toLocaleString()}{' '}
            {resultSet.total === 1 ? 'record' : 'records'}
          </div>
        </div>

        {resultSet.visible.length ? (
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {resultSet.visible.map(record => {
              const seed = localLegislationById.get(recordIdFor(record));
              const expanded = expandedRecordId === recordIdFor(record);
              const sourceUrl =
                record[5] ||
                archiveIndex?.archiveUrl ||
                officialArchive;

              return (
                <article
                  key={recordIdFor(record)}
                  className="rounded-2xl border border-primary-100 bg-white p-5"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                    <span>{record[1]}</span>
                    <span aria-hidden="true">·</span>
                    <span>{record[2]}</span>
                    {record[3] ? (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{record[3]}</span>
                      </>
                    ) : null}
                  </div>

                  <h3 className="mt-3 text-base font-extrabold leading-snug text-gray-950">
                    {record[4]}
                  </h3>

                  {seed?.topics.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {seed.topics.map(topic => (
                        <span key={topic} className="brand-chip">
                          {topic}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm font-bold">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedRecordId(expanded ? null : recordIdFor(record))
                      }
                      className="text-primary-700 underline underline-offset-2"
                      aria-expanded={expanded}
                    >
                      {expanded ? 'Hide record' : 'View record'}
                    </button>
                    <a
                      href={sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary-700 underline underline-offset-2"
                    >
                      {record[5]
                        ? 'Official document'
                        : 'Official archive'}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  {expanded ? (
                    <dl className="mt-5 grid grid-cols-1 gap-3 border-t border-gray-200 pt-4 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="font-bold text-gray-500">BetterMakati ID</dt>
                        <dd className="mt-1 break-words text-gray-900">{recordIdFor(record)}</dd>
                      </div>
                      <div>
                        <dt className="font-bold text-gray-500">Official reference</dt>
                        <dd className="mt-1 text-gray-900">{displayFor(record)}</dd>
                      </div>
                      {record[0] ? (
                        <div className="sm:col-span-2">
                          <dt className="font-bold text-gray-500">Makati archive ID</dt>
                          <dd className="mt-1 break-all font-mono text-xs text-gray-700">
                            {record[0]}
                          </dd>
                        </div>
                      ) : null}
                    </dl>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-700">
            No indexed record matches this search.
          </div>
        )}

        {resultSet.total > visibleResultLimit ? (
          <p className="mt-5 text-sm text-gray-600">
            Showing the first {visibleResultLimit} matches. Refine the search or year
            filter to narrow the list.
          </p>
        ) : null}
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Primary sources</div>
        <Heading level={2}>City charter & official archive</Heading>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <a
            href={officialArchive}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-primary-100 bg-white p-6 hover:border-primary-300 hover:shadow-sm"
          >
            <FileText className="h-6 w-6 text-primary-700" />
            <h3 className="mt-4 text-lg font-extrabold text-gray-950">
              Resolutions & ordinances
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              City Government of Makati legislative archive.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
              Official archive <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </a>

          <a
            href={charterUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-primary-100 bg-white p-6 hover:border-primary-300 hover:shadow-sm"
          >
            <BookOpen className="h-6 w-6 text-primary-700" />
            <h3 className="mt-4 text-lg font-extrabold text-gray-950">
              Makati City Charter
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Republic Act No. 7854, the statute that converted Makati into a
              highly urbanized city and defines its city government.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
              Lawphil <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </a>
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Makati in Congress</div>
        <Heading level={2}>National bills that directly name Makati</Heading>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-700">
          Reviewed Open Congress records with Makati named in the bill title.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {openCongressMakatiRecords.map(record => (
            <article
              key={record.bill}
              className="rounded-2xl border border-primary-100 bg-white p-5"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                <span>{record.bill}</span>
                <span aria-hidden="true">·</span>
                <span>{record.congress}</span>
              </div>
              <h3 className="mt-3 text-base font-extrabold leading-snug text-gray-950">
                {record[4]}
              </h3>
              <p className="mt-2 text-sm text-gray-600">Filed {record.filed}</p>

              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm font-bold">
                <a
                  href={record.recordUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-primary-700 underline underline-offset-2"
                >
                  Senate LDR record <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a
                  href={record.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-primary-700 underline underline-offset-2"
                >
                  House bill PDF <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a
                  href={record.upstreamUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-primary-700 underline underline-offset-2"
                >
                  Open Congress data <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Record types</div>
        <Heading level={2}>Ordinance or resolution?</Heading>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <FileSearch className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">Ordinance</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              A local law enacted by the Sangguniang Panlungsod. Later ordinances
              may amend or repeal earlier provisions.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <FileText className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">Resolution</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              A formal action or expression of the city council. Resolutions
              can concern approvals, requests, authorizations and other council
              actions but do not all operate as general local laws.
            </p>
          </div>
        </div>
      </Section>

      <Section className="bg-[#fffdf8]">
        <div className="rounded-2xl border border-primary-100 bg-white p-6">
          <div className="section-eyebrow">Public participation</div>
          <Heading level={2}>Hearings & consultations</Heading>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-700">
            Check indexed public hearings, consultations and participation opportunities.
          </p>
          <Link to="/participate" className="brand-btn-primary mt-5">
            Open Participation Hub
          </Link>
        </div>
      </Section>
    </>
  );
}
