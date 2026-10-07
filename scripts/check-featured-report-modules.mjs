import { mkdtemp, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';

const files = (await readdir('src/data/reports'))
  .filter(file => file.endsWith('.ts'))
  .sort();

if (files.length === 0) {
  throw new Error('No Featured Report modules were discovered.');
}

const temporaryDirectory = await mkdtemp(
  join(tmpdir(), 'bettermakati-reports-')
);
const entryPath = join(temporaryDirectory, 'entry.ts');
const outputDirectory = join(temporaryDirectory, 'dist');
const bundlePath = join(outputDirectory, 'bundle.mjs');
const imports = files
  .map(
    (file, index) =>
      `import report${index} from ${JSON.stringify(process.cwd() + '/src/data/reports/' + file)};`
  )
  .join('\n');
const moduleNames = files.map((_, index) => `report${index}`).join(', ');

await writeFile(
  entryPath,
  `${imports}\nimport { validateFeaturedReportModules } from ${JSON.stringify(
    process.cwd() + '/src/data/reportModuleValidation.ts'
  )};\nvalidateFeaturedReportModules([${moduleNames}]);\n`
);

try {
  await build({
    root: process.cwd(),
    logLevel: 'silent',
    build: {
      ssr: entryPath,
      outDir: outputDirectory,
      emptyOutDir: false,
      rollupOptions: {
        output: { entryFileNames: 'bundle.mjs' },
      },
    },
  });
  await import(pathToFileURL(bundlePath).href + '?run=' + Date.now());
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}

console.log(
  `Featured Report module check passed: ${files.length} independently discovered modules have unique slugs, valid ENG/FIL shape and resolvable source references.`
);
