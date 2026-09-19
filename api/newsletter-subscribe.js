const WINDOW_MS = 60_000;
const MAX_REQUESTS = 8;
const buckets = globalThis.__betterMakatiNewsletterBuckets || new Map();
globalThis.__betterMakatiNewsletterBuckets = buckets;

const clientKey = req =>
  String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown')
    .split(',')[0]
    .trim();

const allowed = req => {
  const key = clientKey(req);
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || now - current.startedAt >= WINDOW_MS) {
    buckets.set(key, { startedAt: now, count: 1 });
    return true;
  }
  current.count += 1;
  return current.count <= MAX_REQUESTS;
};

const validEmail = value =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!allowed(req)) {
    return res.status(429).json({ error: 'Too many requests. Please try again shortly.' });
  }

  const email = String(req.body?.email || '').trim().slice(0, 320);
  const frequency = String(req.body?.frequency || 'weekly').trim();
  if (!validEmail(email)) {
    return res.status(400).json({ error: 'Enter a valid email address.' });
  }
  if (!['daily', 'weekly', 'monthly'].includes(frequency)) {
    return res.status(400).json({ error: 'Unsupported frequency.' });
  }

  const webhook = process.env.BETTERMAKATI_NEWSLETTER_WEBHOOK;
  if (!webhook) {
    return res.status(503).json({
      error: 'Private newsletter delivery is not configured on this deployment.',
      rss: '/city-monitor.rss.xml',
    });
  }

  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        frequency,
        source: 'bettermakati',
        consentedAt: new Date().toISOString(),
      }),
    });
    if (!response.ok) {
      return res.status(502).json({ error: 'Newsletter provider rejected the request.' });
    }
    return res.status(201).json({ ok: true });
  } catch {
    return res.status(502).json({ error: 'Newsletter provider is unavailable.' });
  }
}
