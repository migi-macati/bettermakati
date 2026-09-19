import { FormEvent, useState } from 'react';
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

const officialArchive =
  'https://www.makati.gov.ph/content/resolutions-and-ordinances/author';
const charterUrl =
  'https://lawphil.net/statutes/repacts/ra1995/ra_7854_1995.html';

const topics = [
  'Budget',
  'Traffic',
  'Zoning',
  'Business',
  'Health',
  'Environment',
  'Barangay',
];

const archiveSearch = (query: string) =>
  'https://www.google.com/search?q=' +
  encodeURIComponent(
    'site:makati.gov.ph/content/resolutions-and-ordinances ' + query + ' Makati'
  );

export default function Legislation() {
  const [query, setQuery] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    window.open(archiveSearch(value), '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <SEO
        title="Legislation"
        description="Find Makati ordinances, resolutions and the city charter using official public records."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">City records</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Heading>Legislation</Heading>
            <p className="max-w-3xl text-gray-600">
              Find local ordinances and resolutions, understand the record type,
              and open the controlling source on the official Makati portal.
            </p>
          </div>
          <SharePage title="Makati Legislation | BetterMakati" />
        </div>
        <LastReviewed note="BetterMakati does not replace the official legislative record." />
        <div className="mt-5">
          <Link to="/city-monitor" className="brand-btn-primary">
            Track legislative lifecycle in City Monitor
          </Link>
        </div>

        <form
          onSubmit={submit}
          className="mt-7 max-w-3xl rounded-2xl border border-primary-100 bg-white p-5"
          role="search"
        >
          <label htmlFor="legislation-search" className="font-extrabold text-gray-950">
            Search Makati legislation
          </label>
          <p className="mt-1 text-sm text-gray-600">
            Searches the official Makati legislation pages through a
            site-restricted web search while BetterMakati builds a structured
            local-law index.
          </p>
          <div className="mt-4 flex gap-2">
            <input
              id="legislation-search"
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="e.g., parking, zoning, senior citizens"
              className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            />
            <button type="submit" className="brand-btn-primary">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {topics.map(topic => (
              <a
                key={topic}
                href={archiveSearch(topic)}
                target="_blank"
                rel="noreferrer"
                className="brand-chip"
              >
                {topic}
              </a>
            ))}
          </div>
        </form>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Official records</div>
        <Heading level={2}>Primary sources</Heading>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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
              Open the City Government of Makati&apos;s legislative record.
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

      <Section className="bg-white">
        <div className="section-eyebrow">How to read the record</div>
        <Heading level={2}>Ordinance or resolution?</Heading>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <FileSearch className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">Ordinance</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              A local law enacted by the Sangguniang Panlungsod. For a legal or
              transactional question, open the original ordinance and any later
              amendments rather than relying only on a summary.
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

        <div className="mt-6 rounded-2xl border border-secondary-200 bg-secondary-50 p-5 text-sm leading-relaxed text-gray-700">
          BetterMakati keeps the original city record one click away. Search
          results are an aid to discovery, not a substitute for the ordinance,
          resolution or later amendment that controls the legal text.
        </div>
      </Section>

      <Section className="bg-[#fffdf8]">
        <div className="rounded-2xl border border-primary-100 bg-white p-6">
          <div className="section-eyebrow">Before a decision</div>
          <Heading level={2}>Participation belongs beside legislation</Heading>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-700">
            BetterMakati&apos;s participation hub publishes consultation
            opportunities it can source and explicitly shows when a complete
            current hearing or consultation calendar has not been located.
          </p>
          <Link to="/participate" className="brand-btn-primary mt-5">
            Open Participation Hub
          </Link>
        </div>
      </Section>
    </>
  );
}
