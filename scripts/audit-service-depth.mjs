import { readFile } from 'node:fs/promises';

const directory = await readFile('src/data/serviceDirectory.ts', 'utf8');
const details = await readFile('src/data/serviceGuideDetails.ts', 'utf8');

const directoryIds = [...directory.matchAll(/\bid:\s*'([^']+)'/g)].map(match => match[1]);
const detailBlock = details.split('export const serviceGuideDetails')[1] ?? '';
const detailIds = [...detailBlock.matchAll(/^\s{2}'([^']+)':\s*\{/gm)].map(match => match[1]);

const problems = [];
const duplicateIds = directoryIds.filter((id, index) => directoryIds.indexOf(id) !== index);
if (duplicateIds.length) problems.push('Duplicate service IDs: ' + [...new Set(duplicateIds)].join(', '));

for (const id of detailIds) {
  if (!directoryIds.includes(id)) problems.push('Detailed guide has no directory service: ' + id);
}

const sourceCount = (directory.match(/sourceUrl:/g) ?? []).length;
if (sourceCount < directoryIds.length) {
  problems.push(`Only ${sourceCount} sourceUrl fields for ${directoryIds.length} services.`);
}

if (detailIds.length < 20) {
  problems.push(`Structured service-guide coverage is too low: ${detailIds.length}. Minimum benchmark is 20.`);
}

const verifiedCount = (details.match(/verification:\s*'verified'/g) ?? []).length;
if (verifiedCount < 14) {
  problems.push(`Verified detailed-guide coverage is too low: ${verifiedCount}. Minimum benchmark is 14.`);
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log(
  `Service-depth audit passed: ${directoryIds.length} indexed services; ${detailIds.length} structured guides; ${verifiedCount} verified.`
);
