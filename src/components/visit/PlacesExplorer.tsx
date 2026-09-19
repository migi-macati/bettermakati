import { FormEvent, useState } from 'react';
import { ExternalLink, MapPin, Search, UtensilsCrossed } from 'lucide-react';

interface PlaceResult {
  id: string;
  name: string;
  address?: string;
  type?: string;
  mapsUrl?: string;
}

const presets = [
  ['Things to do', 'things to do'],
  ['Restaurants', 'popular restaurants'],
  ['Cafés', 'cafes'],
  ['Markets', 'markets'],
  ['Museums', 'museums'],
  ['Parks', 'parks'],
  ['Shopping', 'shopping'],
  ['Nightlife', 'nightlife'],
] as const;

const mapsSearchUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${query} in Makati City, Metro Manila, Philippines`,
  )}`;

export default function PlacesExplorer() {
  const [query, setQuery] = useState('things to do');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [liveResults, setLiveResults] = useState(false);
  const [fallbackNeeded, setFallbackNeeded] = useState(false);

  const search = async (value: string) => {
    const nextQuery = value.trim();
    if (!nextQuery) return;

    setQuery(nextQuery);
    setLoading(true);
    setFallbackNeeded(false);

    try {
      const response = await fetch(`/api/places?q=${encodeURIComponent(nextQuery)}`);
      if (!response.ok) {
        setResults([]);
        setLiveResults(false);
        setFallbackNeeded(true);
        return;
      }

      const data = await response.json();
      const nextResults = Array.isArray(data.places) ? data.places : [];

      if (!data.enabled || nextResults.length === 0) {
        setResults([]);
        setLiveResults(false);
        setFallbackNeeded(true);
        return;
      }

      setResults(nextResults);
      setLiveResults(true);
      setFallbackNeeded(false);
    } catch {
      setResults([]);
      setLiveResults(false);
      setFallbackNeeded(true);
    } finally {
      setLoading(false);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void search(query);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
      <div className="flex items-center gap-2 text-lg font-bold text-gray-950">
        <MapPin className="h-5 w-5 text-primary-700" />
        Find places in Makati
      </div>

      <form onSubmit={submit} className="mt-4 flex gap-2">
        <input
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="restaurants, museums, parks..."
          className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
        />
        <button type="submit" className="brand-btn-primary" disabled={loading}>
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">{loading ? 'Searching' : 'Search'}</span>
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {presets.map(([label, value]) => (
          <button
            key={label}
            type="button"
            onClick={() => void search(value)}
            className="brand-chip"
          >
            {label}
          </button>
        ))}
      </div>

      {liveResults && results.length > 0 && (
        <div className="mt-6 rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b bg-gray-50 px-4 py-2 text-xs text-gray-500">
            <span>{results.length} places</span>
            <span className="GMP-attribution" translate="no">Google Maps</span>
          </div>
          <div className="divide-y">
            {results.map(place => (
              <a
                key={place.id}
                href={place.mapsUrl || mapsSearchUrl(place.name)}
                target="_blank"
                rel="noreferrer"
                className="flex gap-4 px-4 py-4 hover:bg-primary-50 transition"
              >
                <div className="mt-1 rounded-lg bg-primary-50 p-2 text-primary-700">
                  <UtensilsCrossed className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-gray-950">{place.name}</div>
                  {place.type && <div className="text-xs text-gray-500 mt-1">{place.type}</div>}
                  {place.address && <div className="text-sm text-gray-600 mt-1">{place.address}</div>}
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400 shrink-0 mt-1" />
              </a>
            ))}
          </div>
        </div>
      )}

      {fallbackNeeded && (
        <p className="mt-4 rounded-xl border border-secondary-200 bg-secondary-50 p-3 text-sm text-secondary-900" role="status">
          Live place results are unavailable here. Open the same search in
          Google Maps instead.
        </p>
      )}

      {!liveResults && (
        <a
          href={mapsSearchUrl(query)}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary-700 hover:text-primary-900"
        >
          Open this search in Google Maps <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
