import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const base = (process.env.VITE_WEBSITE_URL || 'https://bettermakati.org').replace(/\/$/, '');

const sourceHtml = await readFile('dist/index.html', 'utf8');
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);

const staticMeta = {
  '/': ['BetterMakati', 'Understand Makati, find what you need, and see the source.'],
  '/services': ['Makati Services', 'Find Makati public services, requirements and official channels.'],
  '/visit': ['Visit Makati', 'Places, food, mobility, heritage and practical visitor tools for Makati City.'],
  '/mobility': ['Getting Around Makati', 'Public transport, common trips, directions and ride-hailing options in Makati.'],
  '/cinemas': ['Cinemas in Makati', 'Cinema locations and current showtime sources in Makati City.'],
  '/parking': ['Parking in Makati', 'Search parking map listings near destinations in Makati City.'],
  '/whats-on': ["What’s On in Makati", 'Current event discovery and official activity sources in Makati.'],
  '/heritage': ['Heritage & Culture in Makati', 'Historical sites, museums and self-guided heritage routes in Makati.'],
  '/history': ['History of Makati', 'A searchable, source-linked chronology of Makati history.'],
  '/government': ['Makati City Government', 'Current elected officials, city representation, offices and contacts.'],
  '/accountability': ['Makati Accountability Ledger', 'Track sourced public plans, responsible bodies, later evidence and known information gaps in Makati.'],
  '/records': ['Makati Public Records', 'A citizen-facing index of Makati public records, structured datasets and original sources.'],
  '/participate': ['Participate in Makati', 'Find public participation opportunities and follow BetterMakati community input.'],
  '/today': ['Today in Makati', 'A daily civic starting point with My Makati locality, live city sources, news and participation.'],
  '/open-government': ['BetterMakati Open Government Doctrine', 'BetterMakati methodology, implementation status and OECD-aligned self-audit.'],
  '/integrity': ['Integrity & Public Interest', 'Public-service ethics, procurement integrity, beneficial ownership, audit evidence and integrity coverage gaps for Makati civic research.'],
  '/status': ['BetterMakati Status', 'Public self-accountability for BetterMakati: civic coverage, source monitoring, community input and performance gaps.'],
  '/city-monitor': ['Makati City Monitor', 'Daily-monitored official government activity across council, legislation, executive speeches, procurement, projects, publications and consultations.'],
  '/civic-map': ['Makati Civic Map', 'Browse civic places, bounded infrastructure segments and transport routes in Makati.'],
  '/civic-map/reports': ['Civic Map Reports', 'Review public community reports submitted through the Makati Civic Map.'],
  '/civic-map/audits/park-accessibility-2026': ['Makati Public Park Accessibility Check', 'Record structured accessibility observations across 13 verified government/public parks in Makati.'],
  '/briefs': ['BetterMakati Civic Briefs', 'Daily, weekly and monthly civic digests from City Monitor.'],
  '/barangays': ['Makati Barangays', 'Profiles and population data for the 23 barangays of Makati City.'],
  '/elections': ['Makati Elections & Voting', 'Election results, voter information and COMELEC sources for Makati.'],
  '/estates': ['Makati Estates & Associations', 'Estate associations and district resources across Makati City.'],
  '/statistics': ['Makati Statistics', 'Population, economy and comparable city data for Makati.'],
  '/legislation': ['Makati Legislation', 'Find Makati ordinances, resolutions and the City Charter.'],
  '/news': ['Makati in the News', 'Current news coverage about Makati and official city information sources.'],
  '/live': ['Live Makati', 'Weather, air quality, utilities and official advisory sources for Makati.'],
  '/projects-budget': ['Makati Projects & Budget', 'Budgets, actual revenue and spending, projects, procurement and audit records.'],
  '/community-tools': ['BetterMakati Community Tools', 'Practical community-built civic tools for everyday Makati.'],
  '/community-tools/saan-ako-lalapit': ['Saan Ako Lalapit?', 'Find the Makati office, service or channel for your concern.'],
  '/get-involved': ['Get Involved with BetterMakati', 'Share sources, corrections, ideas or volunteer help.'],
  '/contact': ['Contact BetterMakati', 'Contact BetterMakati or find official Makati City contact channels.'],
  '/hotlines': ['Makati Hotlines', 'Emergency and essential contact information for Makati City.'],
  '/about': ['About BetterMakati', 'BetterMakati sources, independence and correction process.'],
  '/privacy': ['Privacy | BetterMakati', 'BetterMakati privacy information.'],
  '/terms': ['Terms of Use | BetterMakati', 'BetterMakati terms of use.'],
};

const humanize = value =>
  value
    .split('-')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const metaFor = pathname => {
  if (staticMeta[pathname]) return staticMeta[pathname];
  if (pathname.startsWith('/civic-map/')) {
    const name = humanize(pathname.split('/').at(-1));
    return [name + ' | Civic Map', 'Public asset information, source records and community observations for ' + name + ', Makati.'];
  }
  if (pathname.startsWith('/barangays/')) {
    const name = humanize(pathname.split('/').at(-1));
    return ['Barangay ' + name, 'Profile, population, representation and community links for Barangay ' + name + ', Makati City.'];
  }
  if (pathname.startsWith('/officials/')) {
    const name = humanize(pathname.split('/').at(-1));
    return [name, 'Makati elected-official profile and 2025 election result.'];
  }
  if (pathname.startsWith('/services/')) {
    const name = humanize(pathname.split('/').at(-1));
    return [name + ' | Makati Services', 'Makati public-service information, requirements and official sources for ' + name + '.'];
  }
  return ['BetterMakati', 'Independent civic information for Makati City.'];
};

const escapeHtml = value =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

for (const url of urls) {
  const pathname = new URL(url).pathname.replace(/\/$/, '') || '/';
  const [title, description] = metaFor(pathname);
  const fullTitle = title.includes('BetterMakati') ? title : title + ' | BetterMakati';
  const canonical = base + pathname;
  const socialImage = base + '/og-image.png';

  let html = sourceHtml
    // Replace the homepage metadata instead of leaving conflicting route tags.
    .replace(/<link\b[^>]*\brel="canonical"[^>]*>/g, '')
    .replace(/<meta\b[^>]*(?:property="og:[^"]+"|name="twitter:[^"]+")[^>]*>/g, '')
    .replace(/<title>[^<]*<\/title>/, '<title>' + escapeHtml(fullTitle) + '</title>')
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
      '<meta data-rh="true" name="description" content="' + escapeHtml(description) + '" />'
    );

  const meta = [
    '<link rel="canonical" href="' + canonical + '" />',
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="BetterMakati" />',
    '<meta property="og:url" content="' + canonical + '" />',
    '<meta property="og:title" content="' + escapeHtml(fullTitle) + '" />',
    '<meta property="og:description" content="' + escapeHtml(description) + '" />',
    '<meta property="og:image" content="' + socialImage + '" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    '<meta name="twitter:title" content="' + escapeHtml(fullTitle) + '" />',
    '<meta name="twitter:description" content="' + escapeHtml(description) + '" />',
    '<meta name="twitter:image" content="' + socialImage + '" />',
  ].map(tag => tag.replace(/^<(link|meta) /, '<$1 data-rh="true" ')).join('\n    ');

  html = html.replace('</head>', '    ' + meta + '\n  </head>');

  const outDir = path.join('dist', pathname.slice(1));
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, 'index.html'), html);
}

console.log('Generated route-specific HTML metadata for ' + urls.length + ' pages.');
