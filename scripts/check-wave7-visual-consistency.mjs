import { readFile } from 'node:fs/promises';

const css = await readFile('src/index.css', 'utf8');
const problems = [];

if (/h[1-6][^{}]*\\{[^}]*box-shadow:\\s*var\\(--bm-shadow-rest\\)/s.test(css)) {
  problems.push('Heading selectors must not inherit the shared card shadow token.');
}

const cardShadow = `main :is(.home-service-card, .category-card, .civic-card, .community-tool-card, .stat-card) {\n  box-shadow: var(--bm-shadow-rest);\n}`;
if (!css.includes(cardShadow)) {
  problems.push('Shared card shadow selector changed or is missing.');
}

if (problems.length) {
  console.error('W7-8a visual consistency guard failed:\\n- ' + problems.join('\\n- '));
  process.exit(1);
}

console.log('W7-8a visual consistency guard passed: card elevation remains scoped to cards and headings stay free of surface shadows.');
