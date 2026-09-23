import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router';
import { barangays } from '../../data/barangays';
import { useBarangayScope } from '../../hooks/useBarangayScope';

const compactEditionName = (name: string) => name.replace(/\s+/g, '');

export default function BarangayScopeBar({
  note,
}: {
  note?: string;
}) {
  const { barangay, barangaySlug, setBarangay } = useBarangayScope();

  return (
    <div className="mt-5 border-y border-primary-200 bg-primary-50/70 py-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" aria-hidden="true" />
          <div className="min-w-0">
            <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
              Deep dive into a BetterBarangay
            </div>
            <div className="mt-0.5 text-sm font-semibold text-gray-700">
              {barangay ? (
                <>
                  This page is showing the <span className="font-extrabold text-gray-950">Better{compactEditionName(barangay.name)}</span> view.
                </>
              ) : (
                'Choose a barangay to see this page at a more local level.'
              )}
            </div>
            {barangay && note && (
              <p className="mt-1 max-w-3xl text-xs leading-relaxed text-gray-500">
                {note}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <label className="block">
            <span className="sr-only">Choose barangay view</span>
            <select
              value={barangaySlug}
              onChange={event => setBarangay(event.target.value)}
              aria-label="Choose barangay view"
              className="min-h-11 w-full rounded-xl border border-primary-200 bg-white px-3 py-2 text-sm font-extrabold text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 sm:w-60"
            >
              <option value="">All Makati</option>
              {barangays.map(item => (
                <option key={item.slug} value={item.slug}>
                  Better{compactEditionName(item.name)}
                </option>
              ))}
            </select>
          </label>

          {barangay && (
            <Link
              to={'/barangays/' + barangay.slug}
              className="inline-flex min-h-11 items-center justify-center gap-1 rounded-xl px-3 py-2 text-sm font-bold text-primary-700 hover:bg-white"
            >
              Local homepage <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
