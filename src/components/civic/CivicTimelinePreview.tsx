import { ArrowRight, CalendarDays, FileText } from 'lucide-react';
import { Link } from 'react-router';
import { nativeCivicTimelineItems } from '../../data/civicTimelineNative';
import {
  civicCalendarMatchesBarangay,
  civicCalendarViewItems,
  civicTimelinePrimaryValue,
} from '../../data/civicTimelineViews';
import type { CivicTimelineItem } from '../../data/civicTimeline';

interface CivicTimelinePreviewProps {
  barangaySlug?: string;
  contextLabel?: string;
  heading?: string;
  description?: string;
  className?: string;
}

const actionabilityLabel: Record<CivicTimelineItem['actionability'], string> = {
  'action-required': 'Action required',
  'participation-opportunity': 'Participation opportunity',
  'service-impact': 'Service impact',
  'service-available': 'Service available',
  'information-only': 'Information only',
};

const formatTimelineDate = (item: CivicTimelineItem) => {
  const value = civicTimelinePrimaryValue(item);
  const includeTime = item.temporal.precision.startsWith('datetime');
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

const isBarangayScoped = (item: CivicTimelineItem, barangaySlug?: string) =>
  Boolean(
    barangaySlug &&
      item.geography.scope === 'scoped' &&
      item.geography.barangaySlugs?.includes(barangaySlug)
  );

const localFirst = (
  items: CivicTimelineItem[],
  barangaySlug?: string
) =>
  [...items].sort((left, right) => {
    const leftRank = isBarangayScoped(left, barangaySlug) ? 0 : 1;
    const rightRank = isBarangayScoped(right, barangaySlug) ? 0 : 1;
    return leftRank - rightRank;
  });

const PreviewCard = ({
  item,
  barangaySlug,
}: {
  item: CivicTimelineItem;
  barangaySlug?: string;
}) => (
  <article className="rounded-2xl border border-gray-200 bg-white p-5">
    <div className="flex flex-wrap items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.08em]">
      <span className="rounded-full bg-primary-50 px-2.5 py-1 text-primary-800">
        {actionabilityLabel[item.actionability]}
      </span>
      <span className="rounded-full border border-gray-200 px-2.5 py-1 text-gray-600">
        {isBarangayScoped(item, barangaySlug) ? 'Local' : 'Citywide'}
      </span>
    </div>
    <div className="mt-3 text-sm font-extrabold text-primary-800">
      {formatTimelineDate(item)}
    </div>
    <h3 className="mt-1 font-extrabold leading-snug text-gray-950">
      {item.title}
    </h3>
    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">
      {item.summary}
    </p>
    <Link
      to={item.canonicalHref}
      className="mt-4 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-primary-700"
    >
      Open record <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  </article>
);

export default function CivicTimelinePreview({
  barangaySlug,
  contextLabel = 'Makati',
  heading = 'What’s next in Makati',
  description,
  className = 'bg-[#fffdf8]',
}: CivicTimelinePreviewProps) {
  const relevant = nativeCivicTimelineItems.filter(item =>
    civicCalendarMatchesBarangay(item, barangaySlug ?? '')
  );
  const now = new Date();
  const upcoming = localFirst(
    civicCalendarViewItems(relevant, 'now-next', now),
    barangaySlug
  ).slice(0, 4);
  const published = localFirst(
    civicCalendarViewItems(relevant, 'published', now),
    barangaySlug
  ).slice(0, 3);

  const calendarParams = new URLSearchParams();
  if (barangaySlug) calendarParams.set('barangay', barangaySlug);
  const calendarHref =
    '/calendar' +
    (calendarParams.size ? '?' + calendarParams.toString() : '');

  return (
    <section className={'border-y border-primary-100 py-12 ' + className}>
      <div className="container px-5 md:px-6 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="section-eyebrow">On the Makati Calendar</div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 md:text-4xl">
              {heading}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
              {description ??
                (barangaySlug
                  ? 'Barangay-scoped records appear first, together with citywide civic dates that also apply to ' +
                    contextLabel +
                    '.'
                  : 'Source-backed civic dates from the records BetterMakati already maintains.')}
            </p>
          </div>
          <Link
            to={calendarHref}
            className="inline-flex min-h-11 items-center gap-1 text-sm font-bold text-primary-700"
          >
            Open full calendar <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-7 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary-700" aria-hidden="true" />
              <h3 className="text-lg font-extrabold text-gray-950">Now &amp; Next</h3>
            </div>
            {upcoming.length > 0 ? (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {upcoming.map(item => (
                  <PreviewCard
                    key={item.id}
                    item={item}
                    barangaySlug={barangaySlug}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 text-sm leading-relaxed text-gray-600">
                No current or future civic dates are available for this scope yet.
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-700" aria-hidden="true" />
              <h3 className="text-lg font-extrabold text-gray-950">Recently Published</h3>
            </div>
            {published.length > 0 ? (
              <div className="mt-4 space-y-3">
                {published.map(item => (
                  <PreviewCard
                    key={item.id}
                    item={item}
                    barangaySlug={barangaySlug}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 text-sm leading-relaxed text-gray-600">
                No recently published civic record falls within the Calendar’s recent window.
              </div>
            )}
          </div>
        </div>

        <p className="mt-5 text-xs leading-relaxed text-gray-500">
          This preview uses the same reviewed civic dates as the Makati Calendar. Unverified source leads are not shown.
        </p>
      </div>
    </section>
  );
}
