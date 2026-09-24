import { readFile } from 'node:fs/promises';

const budget = await readFile('src/data/budget2025.ts', 'utf8');
const accountability = await readFile('src/data/accountabilitySupplement.ts', 'utf8');

const lineBlock =
  budget.split('export const selectedBudgetLines2026 = [')[1]?.split(
    'export const capitalBudgetLines2026'
  )[0] ?? '';

const rows = [
  ...lineBlock.matchAll(
    /\{ group: '([^']+)'(?:, accountCode: '([^']+)')?, label: '([^']+)', amountM: ([0-9.]+) \}/g
  ),
].map(match => ({
  group: match[1],
  accountCode: match[2] || null,
  label: match[3],
  amountM: Number(match[4]),
}));

const problems = [];
const expected = new Map([
  ['Personal Services', 6635.88],
  ['Operating', 10473.626],
  ['Capital', 1412.815],
  ['Financial Expenses', 1.09],
  ['Special Purpose', 2476.589],
]);

const closeEnough = (a, b) => Math.abs(a - b) < 0.001;

if (rows.length !== 103) {
  problems.push(
    `Expected 103 citywide 2026 budget lines; found ${rows.length}.`
  );
}

for (const [group, target] of expected) {
  const sum = rows
    .filter(item => item.group === group)
    .reduce((total, item) => total + item.amountM, 0);
  if (!closeEnough(sum, target)) {
    problems.push(
      `${group} lines sum to ${sum.toFixed(3)}M; expected ${target.toFixed(3)}M.`
    );
  }
}

const total = rows.reduce((sum, item) => sum + item.amountM, 0);
if (!closeEnough(total, 21000)) {
  problems.push(
    `2026 citywide line-item total is ${total.toFixed(3)}M; expected 21000.000M.`
  );
}

const officeBlock =
  budget.split('export const officeBudgetTotals2026 = [')[1]?.split(
    'export const selectedBudgetLines2026'
  )[0] ?? '';

const officeRows = [
  ...officeBlock.matchAll(
    /\{ office: "([^"]+)", amountM: ([0-9.]+), pages: "([^"]+)", pageStart: ([0-9]+)(?:, note: "([^"]+)")? \}/g
  ),
].map(match => ({
  office: match[1],
  amountM: Number(match[2]),
  pages: match[3],
  pageStart: Number(match[4]),
  note: match[5] || null,
}));

if (officeRows.length !== 36) {
  problems.push(
    `Expected 36 office/department 2026 appropriation totals; found ${officeRows.length}.`
  );
}

const officeTotal = officeRows.reduce((sum, item) => sum + item.amountM, 0);
if (!closeEnough(officeTotal, 21000)) {
  problems.push(
    `2026 office appropriation total is ${officeTotal.toFixed(3)}M; expected 21000.000M.`
  );
}

const liga = officeRows.find(item => item.office === 'Liga ng mga Barangay');
if (!liga || liga.amountM !== 0 || !liga.note) {
  problems.push(
    'Liga ng mga Barangay must remain explicitly recorded as having no 2026 proposed appropriation shown on its office sheet.'
  );
}

const officeDetailSection =
  budget.split('export const officeBudgetDetails2026:')[1]?.split(
    'export const selectedBudgetLines2026'
  )[0] ?? '';
const officeDetailJson = officeDetailSection
  .slice(officeDetailSection.indexOf('=') + 1)
  .trim()
  .replace(/;\s*$/, '');

let officeDetails = [];
try {
  officeDetails = JSON.parse(officeDetailJson);
} catch {
  problems.push('2026 office line-item detail is not parseable as structured data.');
}

if (officeDetails.length < 5) {
  problems.push(
    `Expected at least 5 normalized office line-item schedules; found ${officeDetails.length}.`
  );
}

const officeTotalByName = new Map(officeRows.map(item => [item.office, item.amountM]));
for (const detail of officeDetails) {
  const target = officeTotalByName.get(detail.office);
  const detailTotal = (detail.lines || []).reduce(
    (sum, item) => sum + Number(item.amountM || 0),
    0
  );
  if (target === undefined) {
    problems.push(`Normalized office detail has no matching office total: ${detail.office}.`);
  } else if (!closeEnough(detailTotal, target)) {
    problems.push(
      `${detail.office} detail sums to ${detailTotal.toFixed(3)}M; expected ${target.toFixed(3)}M.`
    );
  }
}

if (!/totalAppropriationM:\s*24373\.87333413/.test(budget)) {
  problems.push(
    '2025 Current Year (Estimate) total is missing or no longer matches the official 2026 budget report.'
  );
}

const procurementSeedBlock =
  accountability.split('const procurementSeeds: ProcurementSeed[] = [')[1]?.split(
    'export const procurementProjectEntries'
  )[0] ?? '';
const procurementReferences = [
  ...procurementSeedBlock.matchAll(/referenceNo:\s*'([^']+)'/g),
].map(match => match[1]);
if (procurementReferences.length < 21) {
  problems.push(
    `Structured procurement seed coverage fell below 21 records: ${procurementReferences.length}.`
  );
}

const auditBlock =
  accountability.split('export const auditFindingEntries')[1] ?? '';
const auditIds = [...auditBlock.matchAll(/id:\s*'audit-([^']+)'/g)];
if (auditIds.length < 4) {
  problems.push(
    `Structured audit finding coverage fell below 4 records: ${auditIds.length}.`
  );
}

if (!accountability.includes("id: '2024-special-education-fund-utilization'")) {
  problems.push('The structured 2024 Special Education Fund utilization record is missing.');
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log(
  `Budget-depth audit passed: ${rows.length} citywide 2026 lines and ${officeRows.length} office totals each reconcile to ₱21.0B; ${officeDetails.length} office line-item schedules reconcile individually; ${procurementReferences.length} procurement records; ${auditIds.length} audit findings; SEF record present.`
);
