import { useState } from 'react';
import {
  BookOpen,
  ExternalLink,
  Landmark,
  Link as LinkIcon,
  Search,
  Download,
} from 'lucide-react';
import { Link } from 'react-router';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import {
  makatiHistory,
  historyEras,
  historyResearchGaps,
  historyReviewed,
} from '../data/makatiHistory';
import SEO from '../components/SEO';

const topics = [...new Set(makatiHistory.map(event => event.topic))];
export default function History() {
  const [query, setQuery] = useState('');
  const [era, setEra] = useState('');
  const [topic, setTopic] = useState('');
  const [primaryOnly, setPrimaryOnly] = useState(false);
  const [newestFirst, setNewestFirst] = useState(false);
  const selectedEra = historyEras.find(item => item.label === era);
  const words = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  const events = makatiHistory
    .filter(
      event =>
        (!selectedEra ||
          (event.year >= selectedEra.from && event.year <= selectedEra.to)) &&
        (!topic || event.topic === topic) &&
        (!primaryOnly || event.source.kind === 'Legal record') &&
        words.every(word =>
          `${event.date} ${event.title} ${event.summary} ${event.topic} ${event.source.label} ${event.note ?? ''}`
            .toLocaleLowerCase()
            .includes(word)
        )
    )
    .sort((a, b) => (newestFirst ? b.year - a.year : a.year - b.year));
  const reset = () => {
    setQuery('');
    setEra('');
    setTopic('');
    setPrimaryOnly(false);
  };
  const download = () => {
    const url = URL.createObjectURL(
      new Blob(
        [
          JSON.stringify(
            {
              reviewed: historyReviewed,
              scope:
                'Research chronology; incomplete coverage. See individual notes.',
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
        description="Explore Makati’s history through a searchable, source-linked chronology, from San Pedro Macati to cityhood and contemporary change."
      />
      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">The city through time</div>
        <Heading>Many histories. One Makati.</Heading>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-gray-700">
          Beyond the skyline: explore the communities, institutions, conflicts
          and decisions that shaped San Pedro Macati and the modern city.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Landmark,
              value: `${makatiHistory.length} milestones`,
              text: 'A growing research chronology',
            },
            {
              icon: BookOpen,
              value: 'Read the evidence',
              text: 'A direct citation for every entry',
            },
            {
              icon: Search,
              value: 'Follow a thread',
              text: 'Search by place, topic or period',
            },
          ].map(({ icon: Icon, value, text }) => (
            <div
              key={value}
              className="rounded-2xl border border-primary-100 bg-white p-5"
            >
              <Icon aria-hidden="true" className="h-5 w-5 text-primary-700" />
              <p className="mt-3 font-extrabold text-gray-950">{value}</p>
              <p className="mt-1 text-sm text-gray-600">{text}</p>
            </div>
          ))}
        </div>
        <details className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
          <summary className="cursor-pointer font-bold text-primary-800">
            How to read this timeline · names, dates and evidence
          </summary>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-700">
            <p>
              We use <strong>San Pedro Macati</strong>, the name in{' '}
              <a
                className="underline"
                href="https://lawphil.net/statutes/acts/act1914/act_2390_1914.html"
                target="_blank"
                rel="noreferrer"
              >
                Act 2390
              </a>
              . The familiar ebbing-river naming story is a tradition recounted
              in the city profile, not a verified account of a specific
              encounter.
            </p>
            <p>
              <strong>Legal record</strong> identifies an act, order or
              judgment. <strong>Institutional history</strong> is an
              organization’s retrospective account.{' '}
              <strong>Scholarly account</strong> identifies research, including
              interpretation of older records. These are different forms of
              evidence, not interchangeable certifications.
            </p>
            <p>
              Exact dates appear only where the cited source supports them.
              Period entries are positioned by chronological context. Historical
              territorial references do not describe today’s boundaries. Event
              dates, enactment, ratification and implementation are
              distinguished.
            </p>
            <p>
              Editorial review: {historyReviewed}. Coverage is still incomplete;
              this is not a claim to have verified every event or every
              competing account.
            </p>
          </div>
        </details>
        <div
          className="mt-10 rounded-2xl border border-gray-200 bg-white p-5"
          role="search"
          aria-label="Search history"
        >
          <label
            className="block text-sm font-bold text-gray-900"
            htmlFor="history-query"
          >
            Find a person, place, year or event
          </label>
          <input
            id="history-query"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Try Guadalupe, railway, cityhood…"
            className="mt-2 w-full rounded-lg border border-gray-300 p-3"
            type="search"
          />
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <label className="text-sm font-semibold">
              Period
              <select
                value={era}
                onChange={event => setEra(event.target.value)}
                className="mt-2 block w-full rounded-lg border border-gray-300 bg-white p-3"
              >
                <option value="">All periods</option>
                {historyEras.map(item => (
                  <option key={item.label}>{item.label}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold">
              Topic
              <select
                value={topic}
                onChange={event => setTopic(event.target.value)}
                className="mt-2 block w-full rounded-lg border border-gray-300 bg-white p-3"
              >
                <option value="">All topics</option>
                {topics.map(item => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold">
              Order
              <select
                value={newestFirst ? 'newest' : 'oldest'}
                onChange={event =>
                  setNewestFirst(event.target.value === 'newest')
                }
                className="mt-2 block w-full rounded-lg border border-gray-300 bg-white p-3"
              >
                <option value="oldest">Oldest first</option>
                <option value="newest">Newest first</option>
              </select>
            </label>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-5 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={primaryOnly}
                onChange={event => setPrimaryOnly(event.target.checked)}
              />{' '}
              Legal records only
            </label>
            <button
              onClick={reset}
              className="min-h-11 font-bold text-primary-700 underline"
            >
              Clear filters
            </button>
            <button
              onClick={download}
              className="inline-flex min-h-11 items-center gap-2 font-bold text-primary-700"
            >
              <Download className="h-4 w-4" aria-hidden="true" /> Download
              results & sources
            </button>
          </div>
        </div>
        <p className="my-6 text-sm font-semibold text-gray-600" role="status">
          Showing {events.length} of {makatiHistory.length} milestones
        </p>
        <ol className="space-y-6 border-l-2 border-primary-200 pl-5 sm:pl-8">
          {events.map(event => (
            <li key={event.id} id={event.id} className="relative scroll-mt-28">
              <span
                aria-hidden="true"
                className="absolute -left-[1.7rem] top-7 h-3 w-3 rounded-full bg-primary-700 sm:-left-[2.45rem]"
              />
              <article className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-extrabold text-primary-800">
                    {event.date}
                  </p>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                    {event.topic}
                  </span>
                </div>
                <h2 className="mt-3 text-xl font-extrabold text-gray-950">
                  <a
                    href={`#${event.id}`}
                    className="group inline-flex items-center gap-2"
                  >
                    {event.title}
                    <LinkIcon
                      aria-label="Link to this event"
                      className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-primary-700"
                    />
                  </a>
                </h2>
                <p className="mt-3 leading-relaxed text-gray-700">
                  {event.summary}
                </p>
                {event.note && (
                  <p className="mt-4 border-l-2 border-amber-300 pl-3 text-sm leading-relaxed text-gray-600">
                    <strong>Research note:</strong> {event.note}
                  </p>
                )}
                <div className="mt-5 border-t border-gray-100 pt-4">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {event.source.kind}
                  </span>
                  <a
                    href={event.source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 underline underline-offset-4"
                  >
                    {event.source.label}
                    <ExternalLink
                      className="h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ol>
        {events.length === 0 && (
          <div className="rounded-xl bg-white p-8 text-center">
            <p>No milestones match these filters.</p>
            <button
              onClick={reset}
              className="mt-3 min-h-11 font-bold text-primary-700 underline"
            >
              Show all milestones
            </button>
          </div>
        )}
        <aside className="mt-12 rounded-2xl bg-primary-50 p-6 sm:p-8">
          <h2 className="text-xl font-extrabold text-primary-950">
            Help complete the record
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            Comprehensive history includes what is still missing. These are
            research priorities, not established timeline claims:
          </p>
          <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed text-gray-700">
            {historyResearchGaps.map(gap => (
              <li key={gap}>{gap}</li>
            ))}
          </ul>
          <Link
            to="/get-involved"
            className="mt-6 inline-flex min-h-11 items-center font-bold text-primary-800 underline"
          >
            Contribute a document or correction →
          </Link>
        </aside>
      </Section>
    </>
  );
}
