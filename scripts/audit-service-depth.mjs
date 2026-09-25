import { readFile } from 'node:fs/promises';

const directory = await readFile('src/data/serviceDirectory.ts', 'utf8');
const details = await readFile('src/data/serviceGuideDetails.ts', 'utf8');
const watchlist = JSON.parse(await readFile('data/source-watchlist.json', 'utf8'));
const serviceGuide = await readFile('src/pages/ServiceGuide.tsx', 'utf8');

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
const localServiceIds = serviceBlocks
  .filter(block => /level:\s*'(City|Barangay)'/.test(block))
  .map(block => block.match(/\bid:\s*'([^']+)'/)?.[1])
  .filter(Boolean);
const nationalServiceBlocks = serviceBlocks.filter(block =>
  /level:\s*'National'/.test(block)
);
const nationalServiceIds = nationalServiceBlocks
  .map(block => block.match(/\bid:\s*'([^']+)'/)?.[1])
  .filter(Boolean);
const nationalHandoffBlocks = nationalServiceBlocks.filter(block =>
  /nationalIntegration:\s*\{/.test(block)
);
const nationalHandoffIds = nationalHandoffBlocks
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
const missingLocalDetails = localServiceIds.filter(id => !detailIds.includes(id));
if (missingLocalDetails.length) {
  problems.push(
    'City/barangay services without structured transaction guides: ' +
      missingLocalDetails.join(', ')
  );
}

const missingNationalCoverage = nationalServiceBlocks
  .filter(block => {
    const id = block.match(/\bid:\s*'([^']+)'/)?.[1];
    return id && !detailIds.includes(id) && !/nationalIntegration:\s*\{/.test(block);
  })
  .map(block => block.match(/\bid:\s*'([^']+)'/)?.[1])
  .filter(Boolean);
if (missingNationalCoverage.length) {
  problems.push(
    'National services without a structured guide or official handoff: ' +
      missingNationalCoverage.join(', ')
  );
}

const invalidNationalHandoffs = nationalHandoffBlocks
  .filter(
    block =>
      !/officialActionUrl:\s*'https?:\/\//.test(block) ||
      !/officialSourceUrl:\s*'https?:\/\//.test(block) ||
      !/betterGov:\s*\{[\s\S]*?status:\s*'(listed|partial|missing|submitted)'/.test(block)
  )
  .map(block => block.match(/\bid:\s*'([^']+)'/)?.[1])
  .filter(Boolean);
if (invalidNationalHandoffs.length) {
  problems.push(
    'National handoffs missing official action/source or BetterGov status metadata: ' +
      invalidNationalHandoffs.join(', ')
  );
}

for (const marker of [
  "const betterGovOwnsNationalGuide =",
  "item.nationalIntegration?.betterGov.status === 'listed'",
  "{!betterGovOwnsNationalGuide && (",
]) {
  if (!serviceGuide.includes(marker)) {
    problems.push('National-service deduplication guard missing from ServiceGuide: ' + marker);
  }
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

if (nationalServiceIds.length < 70) {
  problems.push(`National-service coverage unexpectedly shrank to ${nationalServiceIds.length}. Current baseline is 70 national services.`);
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

const nationalStructuredCount = nationalServiceIds.filter(id => detailIds.includes(id)).length;
const nationalLocalContextCount = nationalHandoffBlocks.filter(block =>
  /makatiContext:\s*\{/.test(block)
).length;

console.log(
  `Service-depth audit passed: ${directoryIds.length} indexed services (${cityServiceCount} city, ${nationalServiceIds.length} national); ${localServiceIds.length} city/barangay services all structured; all national services have either a structured guide or official handoff (${nationalStructuredCount} structured, ${nationalHandoffIds.length} handoff records, ${nationalLocalContextCount} handoffs with Makati context); ${verifiedCount} verified detailed guides; ${detailSourceUrls.length} detailed sources watched.`
);
