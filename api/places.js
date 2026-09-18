const MAKATI_CENTER = {
  latitude: 14.5547,
  longitude: 121.0244,
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    return res.status(503).json({ enabled: false, places: [] });
  }

  const rawQuery = Array.isArray(req.query.q) ? req.query.q[0] : req.query.q;
  const query = String(rawQuery || '').trim().slice(0, 80);

  if (!query) {
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

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ enabled: true, places });
  } catch {
    return res.status(500).json({ enabled: true, places: [] });
  }
}
