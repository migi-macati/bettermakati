import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router';
import SEO from '../components/SEO';
import { makatiScope } from '../lib/budget2027/scope';
import {
  loadCityProjects,
  loadNationalOverview,
  PROGRAMS,
} from '../lib/budget2027/client';
import type { NationalResult, Project } from '../lib/budget2027/client';

type CityResult = Awaited<ReturnType<typeof loadCityProjects>>;
const pesos = (value: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value);
const cell = (value: unknown) =>
  '"' +
  String(value ?? '')
    .replace(/^[=+@-]/, "'$&")
    .replaceAll('"', '""') +
  '"';
const linkStyle = 'font-semibold text-primary-800 underline underline-offset-4';

export default function Budget2027() {
  const { i18n } = useTranslation();
  const fil = i18n.resolvedLanguage === 'fil';
  const t = (en: string, tl: string) => (fil ? tl : en);
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const program = PROGRAMS.find(p => p === params.get('program')) || '';
  const [city, setCity] = useState<CityResult>();
  const [national, setNational] = useState<NationalResult>();
  const [nationalError, setNationalError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    loadCityProjects('Makati', { signal: controller.signal })
      .then(value => {
        if (!controller.signal.aborted) setCity(value);
      })
      .catch(() => {});
    loadNationalOverview({ signal: controller.signal })
      .then(value => {
        if (!controller.signal.aborted) setNational(value);
      })
      .catch(() => {
        if (!controller.signal.aborted) setNationalError(true);
      });
    return () => controller.abort();
  }, [attempt]);
  const available =
    city?.programs.flatMap(p => (p.status === 'available' ? [p.result] : [])) ||
    [];
  const rawRows = available.flatMap(p => p.rows);
  const all = rawRows.filter(row => makatiScope(row) !== 'excluded');
  const excludedCount = rawRows.length - all.length;
  const rows = all.filter(
    row =>
      (!program || row.dataset === program) &&
      `${row.title} ${row.office || ''}`
        .toLowerCase()
        .includes(query.toLowerCase())
  );
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };
  const missing = t(
    'Not recorded in this version',
    'Walang nakatalang halaga sa bersyong ito'
  );
  const money = (value: number | null) =>
    value === null ? missing : pesos(value);
  const exportCsv = () => {
    const header = [
      'id',
      'program',
      'official_title',
      'office',
      'nep_php',
      'house_second_php',
      'house_third_php',
      'nep_pdf',
      'house_second_pdf',
      'house_third_pdf',
      'source_commit',
      'built_at',
      'retrieved_at',
      'coverage',
      'location_scope',
    ];
    const values = rows.map(row => {
      const source = available.find(p =>
        p.rows.some(r => r.id === row.id && r.dataset === row.dataset)
      )!;
      return [
        row.id,
        row.dataset,
        row.title,
        row.office,
        row.nep_php,
        row.hgab2_php,
        row.hgab3_php,
        row.pdf_url.nep,
        row.pdf_url.hgab2,
        row.pdf_url.hgab3,
        source.meta.source_commit,
        source.meta.built_at,
        source.retrievedAt,
        'Whole-word Makati title candidates; not a citywide allocation; blank amount means missing',
        makatiScope(row),
      ];
    });
    const url = URL.createObjectURL(
      new Blob(
        [
          '\uFEFF' +
            [header, ...values].map(r => r.map(cell).join(',')).join('\r\n'),
        ],
        { type: 'text/csv;charset=utf-8' }
      )
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'makati-budget-2027-title-matches.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const versions: {
    key: keyof Pick<Project, 'nep_php' | 'hgab2_php' | 'hgab3_php'>;
    pdf: string;
    label: string;
  }[] = [
    { key: 'nep_php', pdf: 'nep', label: 'NEP 2027' },
    {
      key: 'hgab2_php',
      pdf: 'hgab2',
      label: t('House · second reading', 'House · ikalawang pagbasa'),
    },
    {
      key: 'hgab3_php',
      pdf: 'hgab3',
      label: t('House · third reading', 'House · ikatlong pagbasa'),
    },
  ];
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
      <SEO
        title={t('Budget 2027 and Makati', 'Budget 2027 at Makati')}
        description={t(
          'National budget proposals and source-linked Makati project matches.',
          'Mga panukala sa pambansang budget at mga proyektong may Makati sa pamagat, kasama ang sources.'
        )}
      />
      <header className="max-w-3xl space-y-3">
        <p className="text-sm font-semibold text-primary-700">
          {t(
            'National government · FY 2027',
            'Pambansang pamahalaan · FY 2027'
          )}
        </p>
        <h1 className="text-3xl font-bold text-gray-950">
          {t(
            'Budget 2027: What does it mean for Makati?',
            'Budget 2027: Ano ang ibig sabihin nito para sa Makati?'
          )}
        </h1>
        <p>
          {t(
            'Compare the executive proposal with the available House project records. These figures describe proposed appropriations, not contracts, spending or completed work.',
            'Ihambing ang panukala ng ehekutibo sa available na House project records. Panukalang alokasyon ang mga halagang ito, hindi kontrata, aktuwal na gastos o natapos na proyekto.'
          )}
        </p>
        <p className="rounded-lg bg-amber-50 p-3 text-sm">
          {t(
            'Checked 2 November 2026: the House reports third-reading approval of HB 10858 on 12 October. The Senate calendar lists interpellations for 23 November–1 December and third reading for 7 December. These are scheduled dates, not completed votes. This page compares NEP and House versions, not an enacted 2027 budget.',
            'Sinuri noong 2 November 2026: ayon sa House, naaprubahan sa ikatlong pagbasa ang HB 10858 noong 12 October. Sa Senate calendar, nakatakda ang interpellations sa 23 November–1 December at ikatlong pagbasa sa 7 December. Iskedyul pa lamang ang mga ito, hindi mga natapos na botohan. NEP at House versions ang inihahambing dito, hindi ang naisabatas na 2027 budget.'
          )}
        </p>
        <p className="flex flex-wrap gap-4 text-sm">
          <a
            className={linkStyle}
            href="https://www.congress.gov.ph/media/press-releases/10320"
          >
            {t(
              'House approval · 12 October',
              'Pag-apruba ng House · 12 October'
            )}
          </a>
          <a
            className={linkStyle}
            href="https://budget-transparency-portal.senate.gov.ph/schedules/gaa-2027"
          >
            {t(
              'Senate timetable · subject to change',
              'Iskedyul ng Senate · maaaring magbago'
            )}
          </a>
        </p>
        <nav
          aria-label={t('On this page', 'Sa pahinang ito')}
          className="flex flex-wrap gap-4"
        >
          <a href="#national" className={linkStyle}>
            {t('National overview', 'Pambansang kabuuan')}
          </a>
          <a href="#projects" className={linkStyle}>
            {t('Makati projects', 'Mga proyekto sa Makati')}
          </a>
          <a href="#method" className={linkStyle}>
            {t('Sources and limits', 'Sources at limitasyon')}
          </a>
        </nav>
      </header>
      <section
        id="national"
        className="space-y-3"
        aria-labelledby="national-heading"
      >
        <h2 id="national-heading" className="text-2xl font-bold">
          {t('The national proposal', 'Ang pambansang panukala')}
        </h2>
        <p className="max-w-3xl">
          {t(
            'DBM’s proposal prioritizes education, healthcare, social protection, food security and infrastructure. These national programs can matter to Makati residents even when their budgets have no city-specific project line. The figures below do not establish individual eligibility, local delivery or savings for the city.',
            'Kabilang sa mga prayoridad ng panukala ng DBM ang edukasyon, healthcare, social protection, food security at infrastructure. Mahalaga rin sa mga taga-Makati ang mga pambansang programang walang hiwalay na project line para sa lungsod. Hindi pinatutunayan ng mga halaga rito ang eligibility ng isang tao, lokal na serbisyo o matitipid ng lungsod.'
          )}
        </p>
        <p className="max-w-3xl text-sm">
          {t(
            'Original-table check, 3 November 2026: DBM’s Table I reports ₱7,200.19 billion for 2027 and ₱6,793.16 billion for 2026, a 5.99% increase. The API totals below agree at that published precision; their extra digits come from the API, not this rounded table.',
            'Pagsuri sa orihinal na table, 3 November 2026: ₱7,200.19 billion para sa 2027 at ₱6,793.16 billion para sa 2026 ang nasa Table I ng DBM, o 5.99% na pagtaas. Tugma rito ang API totals kapag ni-round sa parehong precision; mula sa API ang dagdag na digits, hindi sa rounded table na ito.'
          )}{' '}
          <a
            className={linkStyle}
            href="https://www.dbm.gov.ph/wp-content/uploads/NEP2027/Introduction.pdf#page=1"
          >
            {t(
              'DBM original Table I (PDF page 1)',
              'Orihinal na Table I ng DBM (PDF page 1)'
            )}
          </a>
        </p>
        {!national && !nationalError && (
          <p role="status">
            {t('Loading national figures…', 'Kinukuha ang pambansang datos…')}
          </p>
        )}
        {nationalError && (
          <p role="alert">
            {t(
              'National figures from the API could not be validated. The dated DBM table check above remains available.',
              'Hindi ma-validate ang pambansang datos mula sa API. Available pa rin sa itaas ang may petsang pagsuri sa DBM table.'
            )}
          </p>
        )}
        {national && (
          <>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border p-4">
                <dt>NEP 2027</dt>
                <dd className="text-2xl font-bold break-words">
                  {pesos(national.national.amount)}
                </dd>
              </div>
              <div className="rounded-xl border p-4">
                <dt>
                  {t(
                    '2026 GAA baseline in this dataset',
                    '2026 GAA baseline sa dataset na ito'
                  )}
                </dt>
                <dd className="text-2xl font-bold break-words">
                  {pesos(national.national.base_amount)}
                </dd>
              </div>
            </dl>
            <p className="max-w-3xl">
              {t(
                'This compares different years and budget stages: the 2027 proposal and the API’s 2026 enacted-budget baseline. It is not a national NEP-versus-House comparison. National programs may benefit Makati residents without a project titled “Makati”; no local share is estimated here.',
                'Magkaibang taon at yugto ng budget ang paghahambing na ito: panukala para sa 2027 at ang 2026 enacted-budget baseline ng API. Hindi ito pambansang NEP-versus-House comparison. Maaaring makinabang ang mga taga-Makati sa pambansang programa kahit walang “Makati” sa pamagat; walang tinatayang lokal na bahagi rito.'
              )}
            </p>
            <details className="rounded-lg border p-4">
              <summary className="cursor-pointer font-semibold">
                {t(
                  'Department and fund categories',
                  'Mga kategorya ng departamento at pondo'
                )}{' '}
                ({national.departments.length})
              </summary>
              <p className="mt-3 text-sm">
                {t(
                  'These are the API’s mutually exclusive categories, not the appropriation-source groups in DBM Table I. The API’s Automatic Appropriations amount differs from Table I; the category-by-category correspondence has not been independently reconciled. Do not compare these category amounts directly with Table I or add the two breakdowns together.',
                  'Mga hiwa-hiwalay na kategorya ito ng API, hindi ang mga grupo ayon sa pinagmulan ng appropriation sa Table I ng DBM. Magkaiba ang Automatic Appropriations amount ng API at Table I; hindi pa independiyenteng na-reconcile ang pagtutugma ng bawat kategorya. Huwag direktang ihambing ang mga halagang ito sa Table I o pagsamahin ang dalawang breakdown.'
                )}
              </p>
              <ul className="mt-3 divide-y">
                {national.departments.map(d => (
                  <li
                    key={d.id}
                    className="flex flex-wrap justify-between gap-2 py-2"
                  >
                    <span>{d.description}</span>
                    <span>{pesos(d.amount)}</span>
                  </li>
                ))}
              </ul>
            </details>
            <p className="text-sm text-gray-600">
              {t('Dataset generated', 'Ginawa ang dataset')}:{' '}
              {String(national.meta.generated_at || '—')} ·{' '}
              <a className={linkStyle} href={national.sourceUrl}>
                {t('National data source', 'Source ng pambansang datos')}
              </a>
            </p>
          </>
        )}
      </section>
      <section
        id="projects"
        className="space-y-4"
        aria-labelledby="projects-heading"
      >
        <h2 id="projects-heading" className="text-2xl font-bold">
          {t(
            'Projects with Makati in the title',
            'Mga proyektong may Makati sa pamagat'
          )}
        </h2>
        <p className="max-w-3xl">
          {t(
            'This list retains whole-word Makati title matches across four datasets. It excludes partial-word matches such as Lamakati in South Cotabato. Titles alone do not establish current city boundaries or the complete national allocation for Makati. Shared projects are labeled; their full amounts are not Makati-only allocations. Do not add different budget versions together or treat a missing amount as zero.',
            'Kasama rito ang mga pamagat na may hiwalay na salitang Makati sa apat na dataset. Hindi kasama ang bahagyang tugma gaya ng Lamakati sa South Cotabato. Hindi sapat ang pamagat para matiyak ang kasalukuyang hangganan ng lungsod o ang buong pambansang alokasyon nito. May label ang shared projects; hindi para sa Makati lamang ang buong halaga ng mga ito. Huwag pagsamahin ang mga bersyon ng budget o ituring na zero ang nawawalang halaga.'
          )}
        </p>
        {!city && (
          <p role="status">
            {t(
              'Loading and checking project records…',
              'Kinukuha at sinusuri ang project records…'
            )}
          </p>
        )}
        {city && (
          <>
            <ul
              className="flex flex-wrap gap-3 text-sm"
              aria-label={t('Dataset coverage', 'Sakop ng mga dataset')}
            >
              {city.programs.map(p => (
                <li key={p.dataset}>
                  <strong>{p.dataset.toUpperCase()}</strong>:{' '}
                  {p.status === 'available'
                    ? `${p.result.total} ${t('matches before location review', 'tugma bago suriin ang lokasyon')}`
                    : t('unavailable; not zero', 'hindi available; hindi zero')}
                </li>
              ))}
            </ul>
            {!city.completeQueries && (
              <p role="alert">
                {t(
                  'Some datasets failed validation or could not be loaded. Results below are partial.',
                  'May dataset na hindi ma-validate o makuha. Bahagi lamang ng resulta ang nasa ibaba.'
                )}
              </p>
            )}
            <div className="flex flex-wrap items-end gap-3">
              <label className="flex flex-col gap-1">
                {t(
                  'Filter title or office',
                  'Salain ayon sa pamagat o opisina'
                )}
                <input
                  className="rounded border border-gray-400 p-2"
                  value={query}
                  onChange={e => update('q', e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1">
                {t('Program dataset', 'Dataset ng programa')}
                <select
                  className="rounded border border-gray-400 p-2"
                  value={program}
                  onChange={e => update('program', e.target.value)}
                >
                  <option value="">
                    {t(
                      'All available datasets',
                      'Lahat ng available na dataset'
                    )}
                  </option>
                  {PROGRAMS.map(p => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                className="rounded border px-3 py-2"
                onClick={() => {
                  const p = new URLSearchParams(params);
                  p.delete('q');
                  p.delete('program');
                  setParams(p);
                }}
              >
                {t('Reset filters', 'I-reset ang filters')}
              </button>
              <button
                type="button"
                disabled={!rows.length}
                className="rounded bg-primary-800 px-3 py-2 text-white disabled:opacity-50"
                onClick={exportCsv}
              >
                {t('Export filtered CSV', 'I-export ang naka-filter na CSV')}
              </button>
            </div>
            <p className="text-sm">
              {excludedCount}{' '}
              {t(
                'partial-word matches excluded from this list and CSV.',
                'partial-word matches ang hindi isinama sa listahan at CSV.'
              )}
            </p>
            <p role="status">
              {rows.length} / {all.length}{' '}
              {t(
                'Makati title candidates',
                'kandidatong may Makati sa pamagat'
              )}
            </p>
            {!rows.length && (
              <p>
                {t(
                  'No matching records in the available data. This does not mean there is no funding.',
                  'Walang tugmang record sa available na datos. Hindi ibig sabihin nito na walang pondo.'
                )}
              </p>
            )}
            <ul className="space-y-4">
              {rows.map(row => (
                <li
                  key={`${row.dataset}:${row.id}`}
                  className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
                >
                  <h3 className="font-bold text-lg break-words">{row.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {row.dataset.toUpperCase()} ·{' '}
                    {row.office ||
                      t('Office not recorded', 'Walang nakatalang opisina')}
                  </p>
                  {makatiScope(row) === 'shared' && (
                    <p className="mt-2 text-sm font-semibold">
                      {t(
                        'Shared Makati–Mandaluyong project. The amount covers the project, not Makati’s share.',
                        'Shared project ng Makati–Mandaluyong. Para sa proyekto ang halaga, hindi bahagi ng Makati lamang.'
                      )}
                    </p>
                  )}
                  {row.held && (
                    <p className="mt-2 text-amber-900">
                      {t(
                        'Unconfirmed match across versions',
                        'Hindi pa kumpirmado ang pagtutugma sa mga bersyon'
                      )}
                    </p>
                  )}
                  <dl className="mt-3 grid gap-4 md:grid-cols-3">
                    {versions.map(v => (
                      <div key={v.key}>
                        <dt className="text-sm text-gray-600">{v.label}</dt>
                        <dd className="font-semibold">{money(row[v.key])}</dd>
                        <dd>
                          {row.pdf_url[v.pdf] && (
                            <a
                              className={`${linkStyle} text-sm`}
                              href={row.pdf_url[v.pdf]!}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t(
                                'Open source PDF page',
                                'Buksan ang pahina sa source PDF'
                              )}{' '}
                              · {v.label}
                            </a>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ul>
            <p className="text-sm">
              {
                all.filter(
                  r =>
                    r.lat !== null &&
                    r.lon !== null &&
                    Math.abs(r.lat) <= 90 &&
                    Math.abs(r.lon) <= 180 &&
                    (r.lat !== 0 || r.lon !== 0)
                ).length
              }{' '}
              / {all.length}{' '}
              {t(
                'records have valid coordinates. Missing coordinates remain in this list; no locations are inferred from office addresses.',
                'record ang may valid coordinates. Nananatili sa listahan ang walang coordinates; hindi ginagamit ang address ng opisina bilang lokasyon ng proyekto.'
              )}
            </p>
          </>
        )}
        {(nationalError ||
          city?.programs.some(p => p.status === 'unavailable')) && (
          <button
            className="rounded border px-4 py-2"
            onClick={() => {
              setCity(undefined);
              setNational(undefined);
              setNationalError(false);
              setAttempt(n => n + 1);
            }}
          >
            {t('Retry data', 'Subukang kunin muli ang datos')}
          </button>
        )}
      </section>
      <section
        id="method"
        className="max-w-3xl space-y-3"
        aria-labelledby="method-heading"
      >
        <h2 id="method-heading" className="text-2xl font-bold">
          {t('Sources, dates and limits', 'Sources, petsa at limitasyon')}
        </h2>
        <p>
          {t(
            'Data: BetterGov.PH Budget API, an independent, unofficial reading of budget documents. Project pairings are comparison candidates; a line missing from a snapshot does not prove an insertion, deletion or wrongdoing. Original project titles and agency names are retained in their source language in both views.',
            'Datos: BetterGov.PH Budget API, isang independent at unofficial na pagbasa ng budget documents. Kandidato pa lamang sa paghahambing ang pagtutugma ng proyekto; ang wala sa snapshot ay hindi patunay ng insertion, deletion o iregularidad. Pinananatili sa parehong wika ang orihinal na project titles at pangalan ng ahensya mula sa source.'
          )}
        </p>
        <p>
          {t(
            'On 3 November 2026, BetterMakati checked all 32 recorded version amounts for the 11 retained candidates against their linked source PDF pages: 11 House second-reading, 11 House third-reading and 10 NEP amounts. Filmore’s missing NEP match remains unknown, not proof that the project was absent. This does not verify city boundaries or later data revisions. PDF page numbers may differ from printed page numbers.',
            'Noong 3 November 2026, sinuri ng BetterMakati ang lahat ng 32 nakatalang halaga para sa 11 kandidatong proyekto sa mga naka-link na source PDF page: 11 sa House second reading, 11 sa House third reading at 10 sa NEP. Hindi pa tiyak ang nawawalang NEP match ng Filmore; hindi ito patunay na wala ang proyekto. Hindi nito vine-verify ang hangganan ng lungsod o susunod na pagbabago sa datos. Maaaring magkaiba ang PDF page number at naka-print na page number.'
          )}
        </p>
        <ul className="space-y-2 text-sm break-words">
          {available.map(r => (
            <li key={String(r.meta.dataset_key)}>
              <a className={linkStyle} href={r.sourceUrl}>
                {String(r.meta.dataset_key).toUpperCase()} API
              </a>{' '}
              · {t('Built', 'Ginawa')}: {String(r.meta.built_at)} ·{' '}
              {t('Retrieved', 'Nakuha')}: {r.retrievedAt}
              <br />
              {t('Source commit', 'Source commit')}:{' '}
              {String(r.meta.source_commit)}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-4">
          <a
            className={linkStyle}
            href="https://budget.bettergov.ph/hgab/2027/methodology"
          >
            {t('BetterGov methodology', 'Pamamaraan ng BetterGov')}
          </a>
          <a className={linkStyle} href="https://budget.bettergov.ph/docs">
            {t('API documentation', 'Dokumentasyon ng API')}
          </a>
          <Link className={linkStyle} to="/projects-budget">
            {t('Makati city budget', 'Budget ng lungsod ng Makati')}
          </Link>
          <Link className={linkStyle} to="/accountability">
            {t('Procurement and accountability', 'Procurement at pananagutan')}
          </Link>
        </div>
        <p>
          {t(
            'City budgets, national appropriations and procurement records are different measures. This page does not combine them, estimate Makati’s share of national programs or infer savings for the city.',
            'Magkaibang sukatan ang city budget, pambansang alokasyon at procurement records. Hindi pinagsasama ang mga ito rito, tinatantya ang bahagi ng Makati sa pambansang programa o ipinapalagay ang matitipid ng lungsod.'
          )}
        </p>
      </section>
    </div>
  );
}
