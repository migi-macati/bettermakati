import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const ts = createRequire(import.meta.url)('typescript');
const moduleUrl = source => 'data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText).toString('base64');
const variants = moduleUrl(readFileSync('src/data/searchQueryVariants.ts', 'utf8'));
const ranking = readFileSync('src/data/searchRanking.ts', 'utf8').replace("'./searchQueryVariants'", JSON.stringify(variants));
const { scoreItem } = await import(moduleUrl(ranking));
const item = (title, group = 'Record', description = '', keywords = '') => ({title, group, description, keywords, category: '', href: '/'});
const guide = item('Makati Health Plus / Yellow Card', 'Service');
const history = item('Yellow Card programme recognition', 'Record', '2002 programme award');
assert.ok(scoreItem(guide, 'yellow card') > scoreItem(history, 'yellow card'));
assert.ok(scoreItem(guide, 'yelow card') > 0);
assert.equal(scoreItem(item('Makati Youth Home', 'Place', 'Bahay Pag-asa'), 'baha'), 0);
assert.equal(scoreItem(item('Barangay Magallanes', 'Barangay'), 'bike lane'), 0);
assert.equal(scoreItem(item('Makati City Police Station', 'Place'), 'Makati GDP'), 0);
assert.ok(scoreItem(item('Real GDP growth'), 'Makati GDP') > 0);
assert.equal(scoreItem(item('Barangay Bangkal', 'Barangay'), 'maingay ang kapitbahay'), 0);
assert.ok(scoreItem(item('Drainage'), 'baha') > 0);
assert.ok(scoreItem(item('Community Tax Certificate', 'Service', '', 'cedula'), 'cedla') > 0);
assert.ok(scoreItem(item('Yellow Card programme recognition'), 'yellow card recognition') > scoreItem(guide, 'yellow card recognition'));
console.log('10 search ranking regressions passed');

// Exercise the shipped index too: fixture-only tests missed the original defects.
const { createServer } = await import('vite');
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { searchIndex } = await server.ssrLoadModule('/src/data/searchIndex.ts');
  const rank = query => searchIndex.map(value => ({ ...value, score: scoreItem(value, query) }))
    .filter(value => value.score > 0).sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  assert.equal(rank('yellow card')[0].title, 'Makati Health Plus / Yellow Card');
  assert.ok(!rank('baha').some(value => value.title === 'Makati Youth Home'));
  assert.ok(!rank('Makati GDP').some(value => value.title === 'Makati City Police Station'));
  assert.ok(rank('Makati GDP').length < 30);
  assert.equal(rank('brgy poblacion')[0].title, 'Barangay Poblacion');
  assert.equal(rank('historical sites')[0].title, 'Heritage & Culture');
  console.log('6 shipped-index relevance assertions passed');
} finally { await server.close(); }
