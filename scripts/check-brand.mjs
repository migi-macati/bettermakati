import { readFile } from 'node:fs/promises';

const requiredFiles = [
  'public/bettermakati-mark.svg',
  'public/bettermakati-mark-white.svg',
  'public/bettermakati-mark-gold.svg',
  'public/bettermakati-mark-mono.svg',
  'public/bettermakati-icon.svg',
  'src/components/BrandMark.tsx',
  'src/index.css',
  'index.html',
];

const contents = Object.fromEntries(
  await Promise.all(
    requiredFiles.map(async file => [file, await readFile(file, 'utf8')])
  )
);

const problems = [];
const primary = contents['public/bettermakati-mark.svg'];
const reverse = contents['public/bettermakati-mark-white.svg'];
const css = contents['src/index.css'];
const brandMark = contents['src/components/BrandMark.tsx'];
const html = contents['index.html'];

if (!primary.includes('#176238')) problems.push('Primary mark is missing approved green #176238.');
if (!primary.includes('#DCA514')) problems.push('Primary mark is missing approved sun gold #DCA514.');
if (!reverse.includes('#FFFFFF')) problems.push('Reverse mark must be all white.');

for (const forbidden of ['#005447', '#d5a62d', '#D5A62D']) {
  for (const [file, content] of Object.entries(contents)) {
    if (content.includes(forbidden)) {
      problems.push(`Old brand colour ${forbidden} remains in ${file}.`);
    }
  }
}

for (const token of [
  '--brand-green: #176238',
  '--brand-gold: #dca514',
  '--brand-warm-white: #fffdf8',
  "--font-brand: 'Figtree'",
  "--font-ui: 'Inter'",
  "--font-technical: 'Roboto Mono'",
]) {
  if (!css.includes(token)) problems.push('Missing brand token: ' + token);
}

if (!brandMark.includes('brand-wordmark-better')) {
  problems.push('BrandMark is not using the approved Better/Makati wordmark treatment.');
}
if (!brandMark.includes('/bettermakati-mark-white.svg')) {
  problems.push('BrandMark does not support the reverse white mark.');
}

for (const font of ['Figtree', 'Inter', 'Roboto+Mono']) {
  if (!html.includes(font)) problems.push('Brand font is not loaded in index.html: ' + font);
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log('Brand identity guardrails passed.');
