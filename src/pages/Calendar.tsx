import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import {
  Archive,
  ArrowRight,
  CalendarDays,
  ExternalLink,
  FileText,
  Filter,
  Info,
  MapPin,
  Search,
  X,
} from 'lucide-react';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';
import { barangays, findBarangay } from '../data/barangays';
import { placeRegistryById } from '../data/placeRegistry';
import { resolveDistrictReference } from '../data/districtReferences';
import {
  nativeCivicTimelineItems,
  nativeCivicTimelineReviewedAt,
} from '../data/civicTimelineNative';
import {
  civicCalendarActionabilityOptions,
  civicCalendarMatchesBarangay,
  civicCalendarMatchesDateRange,
  civicCalendarMatchesQuery,
  civicCalendarTopicForKind,
  civicCalendarTopicOptions,
  civicCalendarViewCounts,
  civicCalendarViewItems,
  civicCalendarViewOptions,
  civicTimelineEndValue,
  civicTimelinePrimaryValue,
  type CivicCalendarTopic,
  type CivicCalendarView,
} from '../data/civicTimelineViews';
import type {
  CivicTimelineActionability,
  CivicTimelineItem,
} from '../data/civicTimeline';

const calendarReviewed = '2026-09-29';

const kindLabels: Record<CivicTimelineItem['kind'], string> = {
  deadline: 'Deadline',
  meeting: 'Meeting',
  'public-hearing': 'Public hearing',
  'barangay-assembly': 'Barangay assembly',
  consultation: 'Consultation',
  'service-change': 'Service change',
  'service-availability': 'Service availability',
  'road-closure': 'Road closure',
  advisory: 'Advisory',
  'election-milestone': 'Election milestone',
  'legislation-milestone': 'Legislation',
  'procurement-milestone': 'Procurement',
  'project-milestone': 'Project milestone',
  publication: 'Publication',
  'statistics-release': 'Statistics release',
  'report-release': 'Report release',
  'audit-release': 'Audit release',
  'record-update': 'Record update',
};

const semanticLabels: Record<CivicTimelineItem['temporal']['semantic'], string> = {
  occurrence: 'Occurrence',
  deadline: 'Deadline',
  'effective-change': 'Effective change',
  'publication-release': 'Published',
  'target-milestone': 'Target milestone',
};

const actionabilityLabels: Record<CivicTimelineActionability, string> = {
  'action-required': 'Action required',
  'participation-opportunity': 'Participation opportunity',
  'service-impact': 'Service impact',
  'service-available': 'Service available',
  'information-only': 'Information only',
};

const statusLabels: Record<CivicTimelineItem['status'], string> = {
  scheduled: 'Scheduled',
  active: 'Active',
  completed: 'Completed',
  cancelled: 'Cancelled',
  postponed: 'Postponed',
  published: 'Published',
  superseded: 'Superseded',
};

const formatDateValue = (value: string, includeTime: boolean) => {
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Manila',
  };
  if (includeTime) {
    options.hour = 'numeric';
    options.minute = '2-digit';
  }
  return new Intl.DateTimeFormat('en-PH', options).format(
    new Date(value.includes('T') ? value : value + 'T00:00:00+08:00')
  );
};

const timelineDateLabel = (item: CivicTimelineItem) => {
  const primary = civicTimelinePrimaryValue(item);
  const end = civicTimelineEndValue(item);
  const includeTime = item.temporal.precision.startsWith('datetime');
  const first = formatDateValue(primary, includeTime);
  return end ? first + ' – ' + formatDateValue(end, includeTime) : first;
};

const geographyLinks = (item: CivicTimelineItem) => {
  if (item.geography.scope === 'citywide') return [];
  const links: Array<{ key: string; label: string; href: string }> = [];

  for (const slug of item.geography.barangaySlugs ?? []) {
    const barangay = findBarangay(slug);
    if (barangay) {
      links.push({
        key: 'barangay:' + slug,
        label: 'Barangay ' + barangay.name,
        href: '/barangays/' + slug,
      });
    }
  }

  for (const areaId of item.geography.areaIds ?? []) {
    const area = resolveDistrictReference({ type: 'area', id: areaId });
    links.push({
      key: 'area:' + areaId,
      label: area.label,
      href: area.href,
    });
  }

  for (const placeId of item.geography.placeIds ?? []) {
    const place = placeRegistryById.get(placeId);
    if (place) {
      links.push({
        key: 'place:' + placeId,
        label: place.name,
        href: '/civic-map/' + placeId,
      });
    }
  }
  return links;
};

const TimelineCard = ({ item }: { item: CivicTimelineItem }) => {
  const primarySource =
    item.sourceRefs.find(source => source.id === item.primarySourceId) ??
    item.sourceRefs[0];
  const locations = geographyLinks(item);

  return (
    <article
      id={'timeline-item-' + item.id}
      className="scroll-mt-28 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.08em]">
        <span className="rounded-full bg-primary-50 px-2.5 py-1 text-primary-800">
          {kindLabels[item.kind]}
        </span>
        <span className="rounded-full bg-secondary-50 px-2.5 py-1 text-secondary-800">
          {semanticLabels[item.temporal.semantic]}
        </span>
        <span className="rounded-full border border-gray-200 px-2.5 py-1 text-gray-600">
          {statusLabels[item.status]}
        </span>
      </div>

      <div className="mt-4 text-sm font-extrabold text-primary-800">
        <time dateTime={civicTimelinePrimaryValue(item)}>
          {timelineDateLabel(item)}
        </time>
      </div>
      <h2 className="mt-2 text-xl font-extrabold leading-snug text-gray-950">
        {item.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.summary}</p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-primary-200 px-2.5 py-1 font-bold text-primary-800">
          {actionabilityLabels[item.actionability]}
        </span>
        {item.geography.scope === 'citywide' && (
          <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2.5 py-1 font-bold text-gray-600">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            Citywide
          </span>
        )}
      </div>

      {locations.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {locations.map(location => (
            <Link
              key={location.key}
              to={location.href}
              className="inline-flex min-h-11 items-center rounded-full border border-gray-200 px-3 py-1.5 text-xs font-bold text-primary-700 hover:border-primary-300 hover:bg-primary-50"
            >
              {location.label}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-gray-100 pt-4 text-sm">
        <Link
          to={item.canonicalHref}
          className="inline-flex min-h-11 items-center gap-1 font-bold text-primary-700"
        >
          Open record <ArrowRight className="h-4 w-4" />
        </Link>
        <a
          href={primarySource.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center gap-1 font-bold text-gray-600 hover:text-primary-700"
        >
          Original source <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
      <div className="mt-2 text-xs leading-relaxed text-gray-500">
        Record: {item.canonicalLabel} · Source: {primarySource.publisher}
      </div>
    </article>
  );
};

const validView = (value: string | null): CivicCalendarView =>
  civicCalendarViewOptions.some(option => option.id === value)
    ? (value as CivicCalendarView)
    : 'now-next';

const validTopic = (value: string | null): CivicCalendarTopic =>
  civicCalendarTopicOptions.some(option => option.id === value)
    ? (value as CivicCalendarTopic)
    : 'all';

const validActionability = (
  value: string | null
): 'all' | CivicTimelineActionability =>
  civicCalendarActionabilityOptions.some(option => option.id === value)
    ? (value as 'all' | CivicTimelineActionability)
    : 'all';

export default function Calendar() {
  const [params, setParams] = useSearchParams();
  const now = useMemo(() => new Date(), []);

  const view = validView(params.get('view'));
  const topic = validTopic(params.get('topic'));
  const barangaySlug = params.get('barangay') ?? '';
  const actionability = validActionability(params.get('action'));
  const query = params.get('q') ?? '';
  const from = params.get('from') ?? '';
  const to = params.get('to') ?? '';

  const setParam = (key: string, value: string, defaultValue = '') => {
    const next = new URLSearchParams(params);
    if (!value || value === defaultValue) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const filtered = useMemo(
    () =>
      nativeCivicTimelineItems.filter(item => {
        if (
          topic !== 'all' &&
          civicCalendarTopicForKind(item.kind) !== topic
        ) {
          return false;
        }
        if (!civicCalendarMatchesBarangay(item, barangaySlug)) return false;
        if (
          actionability !== 'all' &&
          item.actionability !== actionability
        ) {
          return false;
        }
        if (!civicCalendarMatchesQuery(item, query)) return false;
        return civicCalendarMatchesDateRange(item, from, to);
      }),
    [topic, barangaySlug, actionability, query, from, to]
  );

  const counts = useMemo(
    () => civicCalendarViewCounts(filtered, now),
    [filtered, now]
  );
  const visible = useMemo(
    () => civicCalendarViewItems(filtered, view, now),
    [filtered, view, now]
  );
  const activeView = civicCalendarViewOptions.find(
    option => option.id === view
  )!;

  const hasFilters =
    topic !== 'all' ||
    Boolean(barangaySlug) ||
    actionability !== 'all' ||
    Boolean(query) ||
    Boolean(from) ||
    Boolean(to);

  const clearFilters = () => {
    const next = new URLSearchParams();
    if (view !== 'now-next') next.set('view', view);
    setParams(next, { replace: true });
  };

  return (
    <>
      <SEO
        title="Makati Calendar"
        description="See source-backed Makati civic dates, deadlines, meetings, legislation milestones, publications and historical records in one civic timeline."
        keywords="Makati calendar, civic calendar, deadlines, public hearings, council sessions, legislation, procurement, elections, reports"
      />

      <section className="border-b border-primary-900 bg-primary-900 text-white">
        <div className="container px-5 py-10 md:px-6 md:py-12 lg:px-8">
          <div className="flex max-w-5xl flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-secondary-400 md:text-sm">
                Civic time
              </div>
              <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white md:text-6xl">
                Makati Calendar
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-primary-100">
                What&apos;s coming up, what changed, and what was just published
                across Makati civic life.
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-primary-100">
                This brings together public deadlines, meetings, project and
                legislation milestones, elections, reports and other civic dates.
                Unverified source leads are kept out until they are reviewed.
              </p>
              <LastReviewed
                date={calendarReviewed}
                note="Reviewed civic dates only; unverified source leads are excluded."
                className="mt-5 !text-primary-100 [&_strong]:!text-white [&_svg]:!text-secondary-400"
              />
            </div>
            <SharePage title="Makati Calendar | BetterMakati" />
          </div>
        </div>
      </section>

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Choose a view</div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {civicCalendarViewOptions.map(option => {
            const Icon =
              option.id === 'now-next'
                ? CalendarDays
                : option.id === 'published'
                  ? FileText
                  : Archive;
            const selected = option.id === view;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  setParam(
                    'view',
                    option.id,
                    option.id === 'now-next' ? 'now-next' : ''
                  )
                }
                aria-pressed={selected}
                className={
                  'min-h-28 rounded-2xl border p-5 text-left transition ' +
                  (selected
                    ? 'border-primary-700 bg-primary-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-primary-300')
                }
              >
                <div className="flex items-center justify-between gap-3">
                  <Icon className="h-5 w-5 text-primary-700" aria-hidden="true" />
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-primary-800">
                    {counts[option.id]}
                  </span>
                </div>
                <div className="mt-3 font-extrabold text-gray-950">{option.label}</div>
                <p className="mt-1 text-xs leading-relaxed text-gray-600">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-7 rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 font-extrabold text-gray-950">
            <Filter className="h-5 w-5 text-primary-700" aria-hidden="true" />
            Filter the civic timeline
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-gray-600">Topic</span>
              <select
                value={topic}
                onChange={event => setParam('topic', event.target.value, 'all')}
                className="min-h-11 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-950"
              >
                {civicCalendarTopicOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-gray-600">Barangay</span>
              <select
                value={barangaySlug}
                onChange={event => setParam('barangay', event.target.value)}
                className="min-h-11 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-950"
              >
                <option value="">All barangays + citywide</option>
                {barangays.map(barangay => (
                  <option key={barangay.slug} value={barangay.slug}>{barangay.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-gray-600">Actionability</span>
              <select
                value={actionability}
                onChange={event => setParam('action', event.target.value, 'all')}
                className="min-h-11 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-950"
              >
                {civicCalendarActionabilityOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-gray-600">Search</span>
              <span className="relative block">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={event => setParam('q', event.target.value)}
                  placeholder="Title, source, topic…"
                  className="min-h-11 w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-950"
                />
              </span>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-gray-600">From</span>
              <input
                type="date"
                value={from}
                onChange={event => setParam('from', event.target.value)}
                className="min-h-11 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-950"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-gray-600">To</span>
              <input
                type="date"
                value={to}
                onChange={event => setParam('to', event.target.value)}
                className="min-h-11 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-950"
              />
            </label>
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 hover:border-primary-300 hover:bg-primary-50"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              Clear filters
            </button>
          )}
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="section-eyebrow">{activeView.label}</div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 md:text-4xl">
              {visible.length === 1
                ? '1 civic timeline item'
                : visible.length + ' civic timeline items'}
            </h2>
            <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
              {visible.length} {visible.length === 1 ? 'civic timeline item' : 'civic timeline items'} in {activeView.label}
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
              {activeView.description}
            </p>
          </div>
          <div className="text-xs text-gray-500">
            Native timeline verified{' '}
            {new Intl.DateTimeFormat('en-PH', {
              dateStyle: 'medium',
              timeStyle: 'short',
              timeZone: 'Asia/Manila',
            }).format(new Date(nativeCivicTimelineReviewedAt))}
          </div>
        </div>

        {visible.length > 0 ? (
          <div className="mt-7 grid grid-cols-1 gap-4 xl:grid-cols-2">
            {visible.map(item => <TimelineCard key={item.id} item={item} />)}
          </div>
        ) : (
          <div className="mt-7 rounded-2xl border border-primary-100 bg-white p-6">
            <div className="font-extrabold text-gray-950">
              No civic dates match this view yet.
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
              BetterMakati does not fill gaps with entertainment listings,
              source-health signals or unverified notices. Clear a filter, check
              another view, or use City Monitor for the underlying official
              source-monitoring layer.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to="/city-monitor" className="brand-btn-secondary">City Monitor</Link>
              <Link to="/today" className="brand-btn-secondary">Today in Makati</Link>
            </div>
          </div>
        )}
      </Section>

      <Section className="bg-white">
        <div className="rounded-2xl border border-secondary-200 bg-secondary-50 p-6">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-secondary-800" aria-hidden="true" />
            <div>
              <h2 className="font-extrabold text-gray-950">How the Makati Calendar works</h2>
              <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-700">
                Each date links back to the BetterMakati record where the
                underlying information belongs. Legislation stays in Legislation,
                procurement stays in the Accountability Ledger, election history
                stays in Elections, and reports stay in Reports &amp; Insights.
              </p>
              <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-700">
                Unverified source leads are excluded until the date and its
                relationship to a public record are supported by evidence.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
