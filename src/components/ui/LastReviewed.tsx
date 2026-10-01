import { CalendarDays } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function LastReviewed({
  date,
  label,
  note,
  className = '',
}: {
  date: string;
  label?: string;
  note?: string;
  className?: string;
}) {
  const { t } = useTranslation();
  const displayLabel = label ?? t('lastReviewed.label');

  return (
    <div className={`mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600 ${className}`} role="note">
      <CalendarDays className="h-3.5 w-3.5 text-primary-700" aria-hidden="true" />
      <span>
        <strong className="font-bold text-gray-700">{displayLabel}:</strong> {date}
      </span>
      {note && <span>· {note}</span>}
    </div>
  );
}
