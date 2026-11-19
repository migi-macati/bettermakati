import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';

// Checks the published representation, not PSA source validity or forecast accuracy.
function checkScenarios(module) {
  for (const [language, article] of [
    ['ENG', module.report],
    ['FIL', module.fil],
  ]) {
    const blocks = article.sections.find(
      section => section.id === 'outlook'
    ).blocks;
    const table = blocks.find(block => block.kind === 'table');
    const chart = blocks.find(block => block.kind === 'chart');
    assert.equal(table.rows.length, 3, `${language}: scenario rows`);
    assert.equal(chart.series.length, 3, `${language}: scenario series`);
    for (const [index, rate] of [0.02, 0.045, 0.065].entries()) {
      const row = table.rows[index];
      const series = chart.series[index];
      assert.equal(row.assumption, `${(rate * 100).toFixed(1)}% yearly`);
      assert.equal(series.points.length, 4);
      for (const [pointIndex, year] of [2025, 2030, 2035, 2040].entries()) {
        const expected = (1.266 * (1 + rate) ** (year - 2025)).toFixed(3);
        const context = `${language}: ${row.scenario} ${year}`;
        assert.equal(series.points[pointIndex].label, String(year), context);
        assert.equal(
          series.points[pointIndex].value,
          Number(expected),
          context
        );
        if (year !== 2025)
          assert.equal(row[`y${year}`], `₱${expected}T`, context);
      }
      const share = (5.5 * ((1 + rate) / 1.04) ** 15).toFixed(2);
      assert.equal(
        row.nationalShare,
        `${share}%`,
        `${language}: ${row.scenario} national share`
      );
    }
  }
}

// Frozen, cell-addressed PSA extraction; source access and editorial review are
// recorded separately in docs/editorial-audits/BM-E001-sector-source-20261119.json.
const sectorEvidence = JSON.parse(
  await readFile(
    new URL(
      '../docs/editorial-audits/BM-E001-sector-source-20261119.json',
      import.meta.url
    ),
    'utf8'
  )
);
function checkSectors(module) {
  const percent = value => `${value.toFixed(2)}%`.replace('-', '−');
  for (const [language, article] of [
    ['ENG', module.report],
    ['FIL', module.fil],
  ]) {
    const rows = article.sections
      .find(s => s.id === 'sector-structure')
      .blocks.find(b => b.kind === 'table').rows;
    assert.equal(rows.length, 15, `${language}: sector row count`);
    for (const source of sectorEvidence.sectors) {
      const row = rows.find(r => r.sector === source.sector);
      assert.ok(row, `${language}: ${source.sector}`);
      assert.equal(row.realGva, `₱${(source.value2025 / 1e6).toFixed(2)}B`);
      assert.equal(row.share, percent(source.share2025));
      assert.equal(row.growth, percent(source.growth2025));
      const shareOfNetGrowth =
        ((source.value2025 - source.value2024) /
          (sectorEvidence.gdp['2025'] - sectorEvidence.gdp['2024'])) *
        100;
      assert.equal(row.growthContribution, percent(shareOfNetGrowth));
    }
    assert.equal(rows[14].realGva, 'Suppressed');
    assert.equal(rows[14].share, '—');
  }
}

const directory = await mkdtemp(join(tmpdir(), 'bettermakati-gdp-'));
try {
  await build({
    configFile: false,
    logLevel: 'silent',
    build: {
      ssr: resolve('src/data/reports/09-makati-2025-economy.ts'),
      outDir: directory,
      emptyOutDir: false,
      rollupOptions: { output: { entryFileNames: 'report.mjs' } },
    },
  });
  const { default: module } = await import(
    pathToFileURL(join(directory, 'report.mjs')).href
  );
  checkScenarios(module);
  checkSectors(module);
  const wrongUnit = structuredClone(module);
  wrongUnit.report.sections
    .find(s => s.id === 'sector-structure')
    .blocks.find(b => b.kind === 'table').rows[0].realGva = '₱0.62B';
  assert.throws(() => checkSectors(wrongUnit));
  const wrongContribution = structuredClone(module);
  wrongContribution.fil.sections
    .find(s => s.id === 'sector-structure')
    .blocks.find(b => b.kind === 'table').rows[0].growthContribution = '2.89%';
  assert.throws(() => checkSectors(wrongContribution));
  console.log(
    'BM-E001: all 14 sector rows match PSA cells in ENG/FIL; unit and percentage-point confusion controls rejected.'
  );
  // Prove that the guard rejects each previously published erroneous value.
  for (const [index, year, oldValue] of [
    [0, 2035, 1.544],
    [1, 2035, 1.967],
    [1, 2040, 2.451],
    [2, 2035, 2.377],
    [2, 2040, 3.257],
  ]) {
    const broken = structuredClone(module);
    const table = broken.report.sections
      .find(s => s.id === 'outlook')
      .blocks.find(b => b.kind === 'table');
    table.rows[index][`y${year}`] = `₱${oldValue.toFixed(3)}T`;
    assert.throws(() => checkScenarios(broken));
  }
  const brokenFil = structuredClone(module);
  brokenFil.fil.sections
    .find(s => s.id === 'outlook')
    .blocks.find(b => b.kind === 'chart').series[0].points[1].value = 0;
  assert.throws(() => checkScenarios(brokenFil));
  console.log(
    'BM-E001: ENG/FIL scenario tables, charts and national shares match disclosed compounding; six negative controls rejected. Source verification remains separate.'
  );
} finally {
  await rm(directory, { recursive: true, force: true });
}
