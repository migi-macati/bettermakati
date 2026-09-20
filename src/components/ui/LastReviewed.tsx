import { CalendarDays } from 'lucide-react';

export default function LastReviewed({
  date = '19 September 2026',
  label = 'Content reviewed',
  note,
  className = '',
}: {
  date?: string;
  label?: string;
  note?: string;
  className?: string;
}) {
  return (
    <div
      className={`mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600 ${className}`}
      role="note"
    >
      <CalendarDays
        className="h-3.5 w-3.5 text-primary-700"
        aria-hidden="true"
      />
      <span>
        <strong className="font-bold text-gray-700">{label}:</strong> {date}
      </span>
      {note && <span>· {note}</span>}
    </div>
  );
}
