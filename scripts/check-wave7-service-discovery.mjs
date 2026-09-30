import fs from 'node:fs';
const files = {
  services: fs.readFileSync('src/pages/Services.tsx','utf8'),
  guide: fs.readFileSync('src/pages/ServiceGuide.tsx','utf8'),
  offices: fs.readFileSync('src/pages/GovernmentOffices.tsx','utf8'),
  css: fs.readFileSync('src/index.css','utf8'),
};
const checks=[
 ['services','bm-service-hero'],['services','bm-service-search'],['services','bm-service-directory'],
 ['guide','bm-service-guide-section'],['offices','bm-service-discovery'],['offices','bm-service-card'],
 ['css','/* W7-4a — service and discovery page family. */'],['css','.bm-service-search'],['css','.bm-service-card']
];
for(const [file,marker] of checks) if(!files[file].includes(marker)) throw new Error(`W7-4a marker missing: ${file} ${marker}`);
console.log('W7-4a service/discovery guard passed.');
