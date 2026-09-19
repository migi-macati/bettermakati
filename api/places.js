const MAKATI_CENTER = {
  latitude: 14.5547,
  longitude: 121.0244,
};

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;
const rateBuckets = globalThis.__betterMakatiPlaceRateBuckets || new Map();
globalThis.__betterMakatiPlaceRateBuckets = rateBuckets;

const clientIp = req => {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return forwarded || String(req.socket?.remoteAddress || 'unknown');
};

const allowed = req => {
  const key = clientIp(req);
  const now = Date.now();
  const current = rateBuckets.get(key);
  if (!current || now - current.startedAt >= WINDOW_MS) {
    rateBuckets.set(key, { startedAt: now, count: 1 });
    return true;
  }
  current.count += 1;
  return current.count <= MAX_REQUESTS;
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (!allowed(req)) {
    return res.status(429).json({ error: 'Too many place searches. Please try again shortly.' });
  }

  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    return res.status(503).json({ enabled: false, places: [] });
  }

  const rawQuery = Array.isArray(req.query.q) ? req.query.q[0] : req.query.q;
  const query = String(rawQuery || '').trim().slice(0, 80);

  if (!query || query.length < 2) {
    return res.status(400).json({ enabled: true, places: [] });
  }

  try {
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': [
          'places.id',
          'places.displayName',
          'places.formattedAddress',
          'places.googleMapsUri',
          'places.primaryTypeDisplayName',
        ].join(','),
      },
      body: JSON.stringify({
        textQuery: `${query} in Makati City, Metro Manila, Philippines`,
        maxResultCount: 10,
        locationBias: {
          circle: {
            center: MAKATI_CENTER,
            radius: 6000,
          },
        },
      }),
    });

    if (!response.ok) {
      return res.status(response.status).json({ enabled: true, places: [] });
    }

    const data = await response.json();

    const places = (data.places || [])
      .filter(place => !place.formattedAddress || /makati/i.test(place.formattedAddress))
      .map(place => ({
        id: place.id,
        name: place.displayName?.text || 'Place',
        address: place.formattedAddress || '',
        type: place.primaryTypeDisplayName?.text || '',
        mapsUrl: place.googleMapsUri || '',
      }));

    return res.status(200).json({ enabled: true, places });
  } catch {
    return res.status(500).json({ enabled: true, places: [] });
  }
}
