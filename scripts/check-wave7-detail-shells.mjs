import fs from 'node:fs';
const files={
 record:fs.readFileSync('src/pages/PublicRecordDetail.tsx','utf8'),
 official:fs.readFileSync('src/pages/OfficialProfile.tsx','utf8'),
 project:fs.readFileSync('src/pages/ProjectStatus.tsx','utf8'),
 monitor:fs.readFileSync('src/pages/CityMonitorRecordPage.tsx','utf8'),
 css:fs.readFileSync('src/index.css','utf8')
};
const checks=[
 ['record','bm-detail-hero'],['record','bm-detail-source-panel'],['record','bm-detail-related-card'],
 ['official','bm-detail-page'],['official','bm-detail-meta-card'],['official','bm-detail-source-panel'],
 ['project','bm-detail-page'],['monitor','bm-detail-page'],['monitor','bm-detail-meta-card'],['monitor','bm-detail-related-card'],
 ['css','/* W7-4c — directory and detail shells. */']
];
for(const [file,marker] of checks) if(!files[file].includes(marker)) throw new Error(`W7-4c marker missing: ${file} ${marker}`);
console.log('W7-4c detail-shell guard passed.');
