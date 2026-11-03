/** Pure checks shared by the discovery audit and its regression tests. */
export function validateProjectPages(pages) {
  if (!Array.isArray(pages) || !pages.length) throw new Error('No response pages');
  const first = pages[0];
  const total = first.data?.total;
  if (!Number.isSafeInteger(total) || total < 0) throw new Error('Invalid total');
  const rows = [];
  for (const page of pages) {
    if (page.data?.total !== total || !Array.isArray(page.data?.rows)) throw new Error('Changed total or invalid page');
    for (const key of ['source_commit', 'built_at', 'dataset_key']) {
      if (!first.meta?.[key] || page.meta?.[key] !== first.meta[key]) throw new Error(`Missing or changed ${key}`);
    }
    if (page.meta?.currency !== 'PHP' || page.meta?.scale !== 'pesos' || page.meta?.fiscal_year !== 2027) throw new Error('Unexpected units or year');
    rows.push(...page.data.rows);
  }
  if (rows.length !== total) throw new Error('Incomplete pagination');
  const ids = rows.map(row => row.id);
  if (ids.some(id => typeof id !== 'string' || !id) || new Set(ids).size !== ids.length) throw new Error('Missing or duplicate IDs');
  const sums = {};
  for (const field of ['nep_php', 'hgab2_php', 'hgab3_php']) {
    const amounts = rows.map(row => row[field]);
    if (amounts.some(n => n !== null && (!Number.isSafeInteger(n) || n < 0))) throw new Error(`Invalid ${field}`);
    const present = amounts.filter(n => n !== null);
    const sum = present.reduce((a, b) => a + b, 0);
    if (!Number.isSafeInteger(sum)) throw new Error('Unsafe aggregate');
    const reported = first.data.sums?.[field];
    if (reported !== sum && !(present.length === 0 && reported === null)) throw new Error(`Unreconciled ${field}`);
    sums[field] = { sum_php: present.length ? sum : null, rows_with_amount: present.length, missing_rows: total - present.length };
  }
  let valid = 0, missing = 0, invalid = 0;
  for (const row of rows) {
    if (row.lat == null && row.lon == null) missing++;
    else if (Number.isFinite(row.lat) && Number.isFinite(row.lon) && Math.abs(row.lat) <= 90 && Math.abs(row.lon) <= 180 && !(row.lat === 0 && row.lon === 0)) valid++;
    else invalid++;
  }
  return { total, sums, coordinates: { valid, missing, invalid, provenance_verified: false }, offices: [...new Set(rows.map(r => r.office).filter(Boolean))].sort(), source_meta: first.meta, disclaimers: first.disclaimers ?? [], ids };
}
