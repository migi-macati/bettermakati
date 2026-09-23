import { readFile } from 'node:fs/promises';

const directory = await readFile('src/data/serviceDirectory.ts', 'utf8');
const details = await readFile('src/data/serviceGuideDetails.ts', 'utf8');
const watchlist = JSON.parse(await readFile('data/source-watchlist.json', 'utf8'));

const directoryIds = [...directory.matchAll(/\bid:\s*'([^']+)'/g)].map(match => match[1]);
const detailBlock = details.split('export const serviceGuideDetails')[1] ?? '';
const quotedDetailIds = [...detailBlock.matchAll(/^\s{2}'([^']+)':\s*\{/gm)].map(match => match[1]);
const bareDetailIds = [...detailBlock.matchAll(/^\s{2}([A-Za-z][A-Za-z0-9_-]*):\s*\{/gm)].map(match => match[1]);
const detailIds = [...quotedDetailIds, ...bareDetailIds];

const serviceBlocks = directory.split(/\n  \{/).slice(1).map(block => '{' + block);
const featuredIds = serviceBlocks
  .filter(block => /featured:\s*true/.test(block))
  .map(block => block.match(/\bid:\s*'([^']+)'/)?.[1])
  .filter(Boolean);

const problems = [];
const watchedUrls = new Set(watchlist.map(item => item.url));
const detailSourceUrls = [
  ...new Set(
    [...detailBlock.matchAll(/sourceUrl:\s*'([^']+)'/g)].map(match => match[1])
  ),
];
const unwatchedDetailSources = detailSourceUrls.filter(url => !watchedUrls.has(url));
if (unwatchedDetailSources.length) {
  problems.push(
    'Structured guide sources missing from source-watch: ' +
      unwatchedDetailSources.join(', ')
  );
}

const missingFeaturedDetails = featuredIds.filter(id => !detailIds.includes(id));
if (missingFeaturedDetails.length) {
  problems.push(
    'Featured/high-use services without structured transaction guides: ' +
      missingFeaturedDetails.join(', ')
  );
}
const duplicateIds = directoryIds.filter((id, index) => directoryIds.indexOf(id) !== index);
if (duplicateIds.length) problems.push('Duplicate service IDs: ' + [...new Set(duplicateIds)].join(', '));

for (const id of detailIds) {
  if (!directoryIds.includes(id)) problems.push('Detailed guide has no directory service: ' + id);
}

const sourceCount = (directory.match(/sourceUrl:/g) ?? []).length;
if (sourceCount < directoryIds.length) {
  problems.push(`Only ${sourceCount} sourceUrl fields for ${directoryIds.length} services.`);
}

if (directoryIds.length < 151) {
  problems.push(`Service directory unexpectedly shrank to ${directoryIds.length}. Wave 1.2 baseline is 151 indexed services.`);
}

const cityServiceCount = (directory.match(/level:\s*'City'/g) ?? []).length;
if (cityServiceCount < 73) {
  problems.push(`City-service coverage unexpectedly shrank to ${cityServiceCount}. Wave 1.2 baseline is 73 city services.`);
}

if (detailIds.length < 48) {
  problems.push(`Structured service-guide coverage is too low: ${detailIds.length}. Wave 1.2 minimum is 48.`);
}

const verifiedCount = (details.match(/verification:\s*'verified'/g) ?? []).length;
if (verifiedCount < 20) {
  problems.push(`Verified detailed-guide coverage is too low: ${verifiedCount}. Wave 1.2 minimum is 20.`);
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log(
  `Service-depth audit passed: ${directoryIds.length} indexed services (${cityServiceCount} city); ${detailIds.length} structured guides; ${verifiedCount} verified; ${featuredIds.length} featured services all structured; ${detailSourceUrls.length} detailed sources watched.`
);
