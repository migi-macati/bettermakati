import { readFile, readdir } from 'node:fs/promises';

export const readReportModuleSources = async () => {
  const registry = await readFile('src/data/reports.ts', 'utf8');
  const sharedData = await readFile('src/data/reportSharedData.ts', 'utf8');
  const files = (await readdir('src/data/reports'))
    .filter(file => file.endsWith('.ts'))
    .sort();
  const modules = (
    await Promise.all(
      files.map(file => readFile('src/data/reports/' + file, 'utf8'))
    )
  ).join('\n');
  return registry + '\n' + sharedData + '\n' + modules;
};
