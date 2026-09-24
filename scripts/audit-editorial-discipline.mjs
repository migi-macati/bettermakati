import { readdir, readFile } from 'node:fs/promises';

const pageDir = 'src/pages';
const exempt = new Set([
  'About.tsx',
  'OpenGovernment.tsx',
  'ProjectStatus.tsx',
  'Privacy.tsx',
  'Terms.tsx',
]);

const rules = [
  {
    label: 'editorial-process narration',
    pattern: /BetterMakati\s+(?:should|will not|does not|doesn['’]t|keeps|leaves|publishes|lists|summarizes|has not|hasn['’]t)/gi,
  },
  {
    label: 'instructional meta-heading',
    pattern: /How to\s+(?:read|use)\s+this/gi,
  },
  {
    label: 'coverage disclaimer',
    pattern: /Coverage is not a complete/gi,
  },
  {
    label: 'defensive claim disclaimer',
    pattern: /not a claim to/gi,
  },
  {
    label: 'inference sermon',
    pattern: /rather than be inferred/gi,
  },
];

const files = (await readdir(pageDir))
  .filter(file => file.endsWith('.tsx') && !exempt.has(file))
  .sort();

const problems = [];
for (const file of files) {
  const content = await readFile(pageDir + '/' + file, 'utf8');
  for (const rule of rules) {
    for (const match of content.matchAll(rule.pattern)) {
      const line = content.slice(0, match.index).split('\n').length;
      problems.push(file + ':' + line + ' — ' + rule.label + ': ' + match[0]);
    }
  }
}

if (problems.length) {
  console.error('Editorial-discipline audit failed. Keep methodology and recurring guardrails on dedicated meta pages; keep journey pages factual and task-focused.\n');
  problems.forEach(problem => console.error('- ' + problem));
  process.exit(1);
}

console.log('Editorial-discipline audit passed across ' + files.length + ' citizen-facing pages.');
