import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import {
  BookOpen,
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
  localLegislationRecords,
  type LocalMeasureType,
} from '../data/localLegislation';

const officialArchive =
  'https://www.makati.gov.ph/content/resolutions-and-ordinances/author';
const charterUrl =
  'https://lawphil.net/statutes/repacts/ra1995/ra_7854_1995.html';

const measureFilters: Array<{
  value: 'all' | LocalMeasureType;
  label: string;
}> = [
  { value: 'all', label: 'All records' },
  { value: 'ordinance', label: 'Ordinances' },
  { value: 'resolution', label: 'Resolutions' },
];

const approvalDateFor = (record: (typeof localLegislationRecords)[number]) =>
  record.lifecycle.find(event => event.date)?.date;

export default function Legislation() {
  const [query, setQuery] = useState('');
  const [measureType, setMeasureType] = useState<'all' | LocalMeasureType>('all');

  const filteredRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return localLegislationRecords.filter(record => {
      if (measureType !== 'all' && record.measureType !== measureType) return false;
      if (!normalizedQuery) return true;

      const haystack = [
        record.reference.display,
        record.reference.officialNumber,
        record.title,
        ...record.topics,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [query, measureType]);

  return (
    <>
      <SEO
        title="Legislation"
        description="Search BetterMakati-indexed ordinances and resolutions, then open the official Makati source record."
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
        <div className="mt-5">
          <Link to="/city-monitor" className="brand-btn-primary">
            Track legislative lifecycle in City Monitor
          </Link>
        </div>

        <div
          className="mt-7 max-w-4xl rounded-2xl border border-primary-100 bg-white p-5"
          role="search"
          aria-label="Search BetterMakati legislation index"
        >
          <label htmlFor="legislation-search" className="font-extrabold text-gray-950">
            Search local records
          </label>
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

          <div className="mt-4 flex flex-wrap gap-2" aria-label="Filter by record type">
            {measureFilters.map(filter => {
              const active = measureType === filter.value;
              const count =
                filter.value === 'all'
                  ? localLegislationRecords.length
                  : localLegislationRecords.filter(
                      record => record.measureType === filter.value
                    ).length;

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
                  {filter.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="section-eyebrow">BetterMakati index</div>
            <Heading level={2}>Local ordinances & resolutions</Heading>
          </div>
          <div className="text-sm font-bold text-gray-600">
            {filteredRecords.length} {filteredRecords.length === 1 ? 'record' : 'records'}
          </div>
        </div>

        {filteredRecords.length ? (
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredRecords.map(record => {
              const approvalDate = approvalDateFor(record);
              const sourceDocument = record.documents[0];

              return (
                <article
                  key={record.id}
                  className="rounded-2xl border border-primary-100 bg-white p-5"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                    <span>{record.measureType}</span>
                    <span aria-hidden="true">·</span>
                    <span>{record.reference.officialNumber}</span>
                    {approvalDate ? (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{approvalDate}</span>
                      </>
                    ) : null}
                  </div>

                  <h3 className="mt-3 text-base font-extrabold leading-snug text-gray-950">
                    {record.title}
                  </h3>

                  {record.topics.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {record.topics.map(topic => (
                        <span key={topic} className="brand-chip">
                          {topic}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {sourceDocument ? (
                    <a
                      href={sourceDocument.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2"
                    >
                      Open official source record
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
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

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="font-extrabold text-gray-950">Search the official archive</h3>
          <p className="mt-1 text-sm text-gray-600">
            Use the City Government of Makati archive for records not yet indexed here.
          </p>
          <a
            href={officialArchive}
            target="_blank"
            rel="noreferrer"
            className="brand-btn-secondary mt-4"
          >
            Official Makati archive <ExternalLink className="h-4 w-4" />
          </a>
        </div>
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
                {record.title}
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
