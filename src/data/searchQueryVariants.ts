/**
 * Bounded, local-only query expansion for BetterMakati's canonical search.
 * The original query always ranks first; expansions are weaker candidates.
 * This is lexical normalization, not semantic understanding or AI.
 */
const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const termSynonyms: Record<string, string[]> = {
  brgy: ['barangay'],
  bgy: ['barangay'],
  govt: ['government'],
  gov: ['government'],
  stats: ['statistics'],
  doc: ['document', 'record'],
  docs: ['documents', 'records'],
  bid: ['bidding', 'procurement'],
  bids: ['bidding', 'procurement'],
  commute: ['mobility', 'transport'],
  transportation: ['mobility', 'transport'],
  law: ['legislation'],
  laws: ['legislation'],
  ordinance: ['legislation'],
  ordinances: ['legislation'],
  resolution: ['legislation'],
  resolutions: ['legislation'],
  hotline: ['hotlines'],
  hotlines: ['emergency'],
  cedula: ['community tax certificate'],
  amilyar: ['real property tax'],
  rpt: ['real property tax'],
  basura: ['garbage', 'waste collection'],
  baha: ['flooding', 'drainage'],
  binabaha: ['flooding'],
  kuryente: ['electricity', 'power outage'],
  brownout: ['power outage'],
  trabaho: ['employment', 'jobs'],
  sahod: ['salary', 'wages'],
  gamot: ['medicine', 'medicines'],
  lisensya: ['license'],
  buwis: ['tax'],
  paaralan: ['school'],
  eskwela: ['school'],
  ospital: ['hospital'],
  birthcert: ['birth certificate'],
};

const questionFillers = new Set([
  'a', 'an', 'the', 'i', 'my', 'me', 'we', 'our', 'is', 'are', 'do',
  'does', 'can', 'could', 'would', 'want', 'need', 'get', 'find',
  'how', 'where', 'what', 'when', 'to', 'for', 'of', 'in', 'at',
  'please', 'help', 'with', 'about', 'apply', 'application',
  'ako', 'ko', 'po', 'ba', 'ang', 'ng', 'sa', 'mga', 'na',
  'saan', 'paano', 'pwede', 'puwede', 'pwedeng', 'puwedeng',
  'gusto', 'kailangan', 'kumuha', 'makakuha', 'mag', 'magpa',
]);

/** Primary exact-name query remains untouched; no network or user-data storage. */
export const queryVariants = (query: string): string[] => {
  const original = normalize(query.slice(0, 500));
  if (!original) return [];

  const variants = new Set<string>([original]);
  const words = original.split(' ').filter(Boolean);
  const focus = words.filter(word => !questionFillers.has(word));
  const reduced = focus.length > 0 && focus.length < words.length;
  if (reduced) variants.add(focus.join(' '));

  for (const tokens of reduced ? [words, focus] : [words]) {
    tokens.forEach((token, index) => {
      for (const synonym of termSynonyms[token] ?? []) {
        const next = [...tokens];
        next[index] = synonym;
        variants.add(next.join(' '));
      }
    });
  }

  return [...variants].slice(0, 24);
};
