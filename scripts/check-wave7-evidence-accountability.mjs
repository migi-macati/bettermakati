import fs from 'node:fs';
const files={
 accountability:fs.readFileSync('src/pages/Accountability.tsx','utf8'),
 budget:fs.readFileSync('src/pages/ProjectsBudget.tsx','utf8'),
 records:fs.readFileSync('src/pages/PublicRecords.tsx','utf8'),
 css:fs.readFileSync('src/index.css','utf8')
};
const checks=[
 ['accountability','bm-evidence-page'],['accountability','bm-evidence-handoff'],['accountability','bm-evidence-card'],
 ['budget','bm-evidence-page'],['budget','bm-evidence-card'],
 ['records','bm-evidence-page'],['records','bm-evidence-record'],
 ['css','/* W7-4b — evidence and accountability page family. */'],['css','.bm-evidence-handoff']
];
for(const [file,marker] of checks) if(!files[file].includes(marker)) throw new Error(`W7-4b marker missing: ${file} ${marker}`);
console.log('W7-4b evidence/accountability guard passed.');
