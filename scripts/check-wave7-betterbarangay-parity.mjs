import fs from 'node:fs';
const page=fs.readFileSync('src/pages/BarangayProfile.tsx','utf8');
const css=fs.readFileSync('src/index.css','utf8');
for(const marker of ['bm-barangay-hero','bm-barangay-section','bm-barangay-band-muted','bm-barangay-card']) if(!page.includes(marker)) throw new Error('W7-5 page marker missing: '+marker);
for(const marker of ['/* W7-5 — BetterBarangay visual parity. */','.bm-barangay-hero','.bm-barangay-card']) if(!css.includes(marker)) throw new Error('W7-5 CSS marker missing: '+marker);
for(const marker of ['ServiceSearch','PhotoCarousel','withBarangayScope']) if(!page.includes(marker)) throw new Error('W7-5 preserved behavior marker missing: '+marker);
console.log('W7-5 BetterBarangay parity guard passed.');
