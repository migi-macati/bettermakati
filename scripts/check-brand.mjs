import { readFile } from 'node:fs/promises';

const requiredFiles = [
  'public/bettermakati-logo.svg',
  'public/bettermakati-logo-reverse.svg',
  'public/bettermakati-symbol.svg',
  'public/bettermakati-symbol-reverse.svg',
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
const primary = contents['public/bettermakati-logo.svg'];
const reverse = contents['public/bettermakati-logo-reverse.svg'];
const css = contents['src/index.css'];
const brandMark = contents['src/components/BrandMark.tsx'];
const html = contents['index.html'];

if (!primary.includes('#036738')) problems.push('Primary mark is missing approved green #036738.');
if (!primary.includes('#FBBF01')) problems.push('Primary mark is missing approved sun gold #FBBF01.');
if (!reverse.includes('#FFFFFF')) problems.push('Reverse mark must be all white.');

for (const forbidden of ['#005447', '#d5a62d', '#D5A62D']) {
  for (const [file, content] of Object.entries(contents)) {
    if (content.includes(forbidden)) {
      problems.push(`Old brand colour ${forbidden} remains in ${file}.`);
    }
  }
}

for (const token of [
  '--brand-green: #036738',
  '--brand-gold: #fbbf01',
  '--brand-warm-white: #fffdf8',
  "--font-brand: 'Figtree'",
  "--font-ui: 'Inter'",
  "--font-technical: 'Roboto Mono'",
]) {
  if (!css.includes(token)) problems.push('Missing brand token: ' + token);
}

if (!brandMark.includes('/bettermakati-logo.svg')) {
  problems.push('BrandMark is not using the exact official logo asset.');
}
if (!brandMark.includes('/bettermakati-logo-reverse.svg')) {
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
