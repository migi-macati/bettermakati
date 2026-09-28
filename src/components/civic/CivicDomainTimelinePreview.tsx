import { ArrowRight, CalendarDays } from 'lucide-react';
import { Link } from 'react-router';
import { nativeCivicTimelineItems } from '../../data/civicTimelineNative';
import {
  civicCalendarViewForItem,
  civicCalendarViewItems,
  civicTimelinePrimaryValue,
  type CivicCalendarTopic,
  type CivicCalendarView,
} from '../../data/civicTimelineViews';
import type {
  CivicTimelineCanonicalRef,
  CivicTimelineItem,
} from '../../data/civicTimeline';

interface CivicDomainTimelinePreviewProps {
  owner: CivicTimelineCanonicalRef['owner'];
  calendarTopic: Exclude<CivicCalendarTopic, 'all'>;
  heading: string;
  description: string;
  limit?: number;
  className?: string;
}

const viewLabel: Record<CivicCalendarView, string> = {
  'now-next': 'Now & Next',
  published: 'Recently Published',
  archive: 'Archive',
};

const formatTimelineDate = (item: CivicTimelineItem) => {
  const value = civicTimelinePrimaryValue(item);
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Manila',
  };
  if (item.temporal.precision.startsWith('datetime')) {
    options.hour = 'numeric';
    options.minute = '2-digit';
  }
  return new Intl.DateTimeFormat('en-PH', options).format(
    new Date(value.includes('T') ? value : value + 'T00:00:00+08:00')
  );
};

export default function CivicDomainTimelinePreview({
  owner,
  calendarTopic,
  heading,
  description,
  limit = 4,
  className = 'bg-[#fffdf8]',
}: CivicDomainTimelinePreviewProps) {
  const relevant = nativeCivicTimelineItems.filter(
    item => item.canonicalRef.owner === owner
  );
  const now = new Date();
  const nowNext = civicCalendarViewItems(relevant, 'now-next', now);
  const published = civicCalendarViewItems(relevant, 'published', now);
  const archive = civicCalendarViewItems(relevant, 'archive', now);
  const ordered = [...nowNext, ...published, ...archive].slice(0, limit);
  const defaultView: CivicCalendarView = nowNext.length
    ? 'now-next'
    : published.length
      ? 'published'
      : 'archive';

  const params = new URLSearchParams({ topic: calendarTopic });
  if (defaultView !== 'now-next') params.set('view', defaultView);
  const calendarHref = '/calendar?' + params.toString();

  if (!relevant.length) return null;

  return (
    <section className={'border-y border-primary-100 py-10 ' + className}>
      <div className="container px-5 md:px-6 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="section-eyebrow">On the Makati Calendar</div>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 md:text-3xl">
              {heading}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
              {description}
            </p>
          </div>
          <Link
            to={calendarHref}
            className="inline-flex min-h-11 items-center gap-1 text-sm font-bold text-primary-700"
          >
            Open filtered calendar
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {ordered.map(item => {
            const itemView = civicCalendarViewForItem(item, now);
            return (
              <Link
                key={item.id}
                to={item.canonicalHref}
                className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <CalendarDays
                    className="h-5 w-5 text-primary-700"
                    aria-hidden="true"
                  />
                  <span className="rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.07em] text-primary-800">
                    {viewLabel[itemView]}
                  </span>
                </div>
                <div className="mt-4 text-sm font-extrabold text-primary-800">
                  {formatTimelineDate(item)}
                </div>
                <h3 className="mt-1 line-clamp-2 font-extrabold leading-snug text-gray-950">
                  {item.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">
                  {item.summary}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                  Open canonical record
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>

        <p className="mt-4 text-xs leading-relaxed text-gray-500">
          These are time-indexed views of canonical domain records. The Calendar
          does not create a second copy of the underlying record.
        </p>
      </div>
    </section>
  );
}
