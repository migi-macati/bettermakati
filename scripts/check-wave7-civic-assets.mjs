import fs from 'node:fs';

const source = fs.readFileSync('src/pages/CivicMap.tsx', 'utf8');
const required = [
  "border-t-4 border-t-secondary-400",
  "rounded-xl border border-primary-200 bg-primary-50/60",
  "border-dashed border-secondary-300 bg-[#fffdf8]",
  "'Destination'",
  "'Bounded infrastructure'",
  "'Network / service route'",
];
for (const marker of required) {
  if (!source.includes(marker)) {
    console.error('W7-7 civic-asset guard missing marker:', marker);
    process.exit(1);
  }
}
console.log('W7-7 civic-asset integration guard passed.');
