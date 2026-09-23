import { MapPin } from 'lucide-react';
import { Link } from 'react-router';
import { barangays } from '../../data/barangays';
import { useBarangayScope } from '../../hooks/useBarangayScope';

export default function BarangayScopeBar({
  note,
}: {
  note?: string;
}) {
  const { barangay, barangaySlug, setBarangay } = useBarangayScope();

  return (
    <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-primary-200 bg-primary-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" aria-hidden="true" />
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
            {barangay ? 'Barangay view' : 'Location scope'}
          </div>
          <div className="font-extrabold text-gray-950">
            {barangay ? `Barangay ${barangay.name}` : 'All Makati'}
          </div>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">
            {note ??
              (barangay
                ? 'This page is filtered or prioritized for the selected barangay where local data is available.'
                : 'Choose a barangay to bring local information forward.')}
          </p>
          {barangay && (
            <Link
              to={'/barangays/' + barangay.slug}
              className="mt-2 inline-flex text-sm font-bold text-primary-700 underline underline-offset-2"
            >
              Open barangay dashboard
            </Link>
          )}
        </div>
      </div>

      <label className="shrink-0">
        <span className="sr-only">Change barangay scope</span>
        <select
          value={barangaySlug}
          onChange={event => setBarangay(event.target.value)}
          className="min-h-11 w-full rounded-xl border border-primary-200 bg-white px-3 py-2 text-sm font-bold text-gray-800 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 sm:w-56"
        >
          <option value="">All Makati</option>
          {barangays.map(item => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
