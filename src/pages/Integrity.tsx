import { useMemo, useState } from 'react';
import {
  Building2,
  ExternalLink,
  FileSearch,
  History,
  Landmark,
  ReceiptText,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';
import {
  integrityProcurementAwards,
  integrityProcurementAwardsByEntityId,
  integrityProcurementEntities,
} from '../data/integrityData';
import {
  integrityDisclosureByEntityId,
  integrityDisclosureRecords,
} from '../data/integrityDisclosures';
import {
  integrityAuditActions,
  integrityAuditFindings,
  integrityAuditResolutionTrails,
  integrityAuditSourceOnlyRecords,
} from '../data/integrityAuditTrails';
import { integrityRelationshipSources } from '../data/integrityRelationships';
import {
  integrityProcurementContextLinks,
  integrityRelatedRecords,
} from '../data/integrityCivicRelationships';
import { reportsForCivicRecord } from '../data/reportCivicRelationships';
import { publicRecordByUrl } from '../data/publicRecords';

type View =
  | 'all'
  | 'procurement'
  | 'disclosures'
  | 'audits'
  | 'sources';

const money = (millions?: number) => {
  if (millions === undefined) return '—';
  if (Math.abs(millions) >= 1000) {
    return '₱' + (millions / 1000).toFixed(2) + 'B';
  }
  return '₱' + millions.toFixed(2) + 'M';
};

const sourceById = new Map(
  integrityRelationshipSources.map(source => [source.id, source])
);

const sourcesFor = (ids: string[]) =>
  [...new Set(ids)]
    .map(id => sourceById.get(id))
    .filter(
      (
        source
      ): source is (typeof integrityRelationshipSources)[number] =>
        Boolean(source)
    );

const disclosureStatusLabel = (
  status: 'source-backed' | 'unavailable' | 'restricted' | 'not-applicable' | 'not-researched'
) => {
  switch (status) {
    case 'source-backed':
      return 'Source-backed';
    case 'restricted':
      return 'Restricted';
    case 'not-applicable':
      return 'Not applicable';
    case 'not-researched':
      return 'Not researched';
    default:
      return 'Not retrieved';
  }
};

const viewLabels: Array<{ id: View; label: string }> = [
  { id: 'all', label: 'All records' },
  { id: 'procurement', label: 'Suppliers & awards' },
  { id: 'disclosures', label: 'Disclosure research' },
  { id: 'audits', label: 'Audit trails' },
  { id: 'sources', label: 'Sources' },
];

const civicLinksForAward = (awardId: string) => {
  const seen = new Set<string>();
  return integrityRelatedRecords({
    type: 'integrity-record',
    id: awardId,
    recordKind: 'procurement-award',
  }).filter(item => {
    if (
      !item.node ||
      !['accountability', 'public-records'].includes(item.node.owner)
    ) {
      return false;
    }
    if (seen.has(item.node.href)) return false;
    seen.add(item.node.href);
    return true;
  });
};

const civicLinksForFinding = (findingId: string) => {
  const seen = new Set<string>();
  return integrityRelatedRecords({
    type: 'integrity-record',
    id: findingId,
    recordKind: 'audit-finding',
  }).filter(item => {
    if (
      !item.node ||
      !['accountability', 'public-records'].includes(item.node.owner)
    ) {
      return false;
    }
    if (seen.has(item.node.href)) return false;
    seen.add(item.node.href);
    return true;
  });
};

export default function Integrity() {
  const [query, setQuery] = useState('');
  const [view, setView] = useState<View>('all');
  const procurementContextLinks = integrityProcurementContextLinks();

  const needle = query.trim().toLowerCase();

  const visibleEntities = useMemo(() => {
    if (!needle) return integrityProcurementEntities;

    return integrityProcurementEntities.filter(entity => {
      const awards = integrityProcurementAwardsByEntityId.get(entity.id) ?? [];
      const disclosures = integrityDisclosureByEntityId.get(entity.id) ?? [];
      const haystack = [
        entity.canonicalName,
        entity.kind,
        ...awards.flatMap(award => [
          award.referenceNo,
          award.title,
          award.bidOrAwardDate,
        ]),
        ...disclosures.flatMap(disclosure => [
          disclosure.kind,
          disclosure.subjectNameAsStated,
          disclosure.relatedNameAsStated,
          disclosure.assessment.status === 'source-backed'
            ? disclosure.assessment.statementAsStated
            : disclosure.assessment.note,
        ]),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(needle);
    });
  }, [needle]);

  const visibleFindings = useMemo(() => {
    if (!needle) return integrityAuditFindings;

    return integrityAuditFindings.filter(finding => {
      const trail = integrityAuditResolutionTrails.find(
        candidate => candidate.findingId === finding.id
      );
      const actions = integrityAuditActions.filter(
        action => action.findingId === finding.id
      );
      const haystack = [
        finding.title,
        finding.auditPeriod,
        finding.findingAsStated,
        finding.recommendationAsStated,
        ...finding.responsibleBodies,
        ...actions.flatMap(action => [
          action.kind,
          action.statementAsStated,
          action.continuityBasis,
        ]),
        trail?.resolution.status === 'unresolved'
          ? trail.resolution.reason
          : trail?.resolution.statementAsStated,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(needle);
    });
  }, [needle]);

  const visibleSources = useMemo(() => {
    if (!needle) return integrityRelationshipSources;
    return integrityRelationshipSources.filter(source =>
      [
        source.label,
        source.publisher,
        source.publishedOrPeriod,
        source.sourceClass,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(needle)
    );
  }, [needle]);

  const historicalRoleCount = integrityDisclosureRecords.filter(
    record => record.assessment.status === 'source-backed'
  ).length;

  const showProcurement = view === 'all' || view === 'procurement';
  const showDisclosures = view === 'all' || view === 'disclosures';
  const showAudits = view === 'all' || view === 'audits';
  const showSources = view === 'all' || view === 'sources';

  return (
    <>
      <SEO
        title="Integrity records"
        description="Search Makati procurement awards, supplier identities, disclosure research, COA findings, follow-up evidence and source records."
      />

      <Section className="bg-primary-900 text-white">
        <div className="section-eyebrow !text-secondary-300">
          Integrity & audit
        </div>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Heading className="!text-white">Integrity records</Heading>
            <p className="mt-3 max-w-4xl text-base leading-relaxed text-primary-50 sm:text-lg">
              Procurement awards, supplier identities, disclosures and COA follow-up.
            </p>
          </div>
          <SharePage title="Integrity records | BetterMakati" />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              value: integrityProcurementAwards.length,
              label: 'Indexed awards',
            },
            {
              value: integrityProcurementEntities.length,
              label: 'Supplier / JV identities',
            },
            {
              value: integrityDisclosureRecords.length,
              label: 'Disclosure records',
            },
            {
              value: integrityAuditFindings.length,
              label: 'Finding-level audit records',
            },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/15 bg-white/10 p-4"
            >
              <div className="text-2xl font-black text-secondary-300 sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm font-semibold text-primary-50">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <LastReviewed
          date="26 September 2026"
          className="!text-primary-100 [&_strong]:!text-white [&_svg]:!text-secondary-300"
        />
      </Section>

      <Section className="bg-[#fffdf8]">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <label className="form-field">
            <span>Search integrity records</span>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                aria-hidden="true"
              />
              <input
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Supplier, bid reference, audit finding, source…"
                className="!pl-10"
              />
            </div>
          </label>

          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Integrity record view"
          >
            {viewLabels.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                aria-pressed={view === item.id}
                className={
                  view === item.id
                    ? 'min-h-11 rounded-xl bg-primary-700 px-4 text-sm font-bold text-white'
                    : 'min-h-11 rounded-xl border border-gray-300 bg-white px-4 text-sm font-bold text-gray-700 hover:border-primary-400 hover:text-primary-800'
                }
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {needle && (
          <p className="mt-3 text-sm text-gray-600">
            Showing records matching <strong>{query.trim()}</strong>.
          </p>
        )}
      </Section>

      {showProcurement && (
        <Section className="bg-white" id="procurement">
          <div className="section-eyebrow">Procurement</div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Heading level={2}>Suppliers & awards</Heading>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/projects-budget#procurement"
                className="text-sm font-bold text-primary-700 underline"
              >
                Open procurement table
              </Link>
              {procurementContextLinks.map(item =>
                item.node ? (
                  <a
                    key={item.node.href}
                    href={item.node.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold text-primary-700 underline"
                  >
                    {item.node.label}
                    <ExternalLink className="ml-1 inline h-3.5 w-3.5" />
                  </a>
                ) : null
              )}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {visibleEntities.map(entity => {
              const awards =
                integrityProcurementAwardsByEntityId.get(entity.id) ?? [];
              const awardedTotal = awards.reduce(
                (sum, award) => sum + (award.awardedAmountM ?? 0),
                0
              );

              return (
                <article
                  key={entity.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-black text-gray-950">
                          {entity.canonicalName}
                        </h3>
                        <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-800">
                          {entity.kind === 'joint-venture'
                            ? 'Joint venture'
                            : 'Supplier'}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {awards.length} indexed award
                        {awards.length === 1 ? '' : 's'}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                        Winning bids in indexed records
                      </div>
                      <div className="mt-1 text-lg font-black text-gray-950">
                        {money(awardedTotal)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full min-w-[760px] text-left text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 font-bold">Reference</th>
                          <th className="px-4 py-3 font-bold">Award</th>
                          <th className="px-4 py-3 font-bold">Bid date</th>
                          <th className="px-4 py-3 font-bold text-right">
                            Winning bid
                          </th>
                          <th className="px-4 py-3 font-bold">Source</th>
                        </tr>
                      </thead>
                      <tbody>
                        {awards.map(award => (
                          <tr key={award.id} className="border-t border-gray-200">
                            <td className="px-4 py-3 font-mono text-xs font-bold text-gray-700">
                              {award.referenceNo}
                            </td>
                            <td className="px-4 py-3 font-semibold text-gray-900">
                              {award.title}
                              {civicLinksForAward(award.id).length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {civicLinksForAward(award.id).map(item =>
                                    item.node ? (
                                      <Link
                                        key={item.relationship.id}
                                        to={item.node.href}
                                        className="text-xs font-bold text-primary-700 underline underline-offset-2"
                                      >
                                        {item.node.owner === 'accountability'
                                          ? 'Accountability record'
                                          : 'Source catalog'}
                                      </Link>
                                    ) : null
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {award.bidOrAwardDate ?? '—'}
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-gray-900">
                              {money(award.awardedAmountM)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-2">
                                {sourcesFor(award.sourceIds).map(source => {
                                  const publicRecord = publicRecordByUrl.get(source.url);
                                  return (
                                    <span key={source.id} className="inline-flex items-center gap-2">
                                      <a
                                        href={source.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 font-bold text-primary-700 underline"
                                      >
                                        Open
                                        <ExternalLink className="h-3.5 w-3.5" />
                                      </a>
                                      {publicRecord && (
                                        <Link
                                          to={'/records/' + publicRecord.id}
                                          className="font-bold text-primary-700 underline"
                                        >
                                          Public record
                                        </Link>
                                      )}
                                    </span>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>
              );
            })}

            {visibleEntities.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-600">
                No supplier or award record matches this search.
              </div>
            )}
          </div>
        </Section>
      )}

      {showDisclosures && (
        <Section className="bg-[#f5f8f2]" id="disclosures">
          <div className="section-eyebrow">Disclosures</div>
          <Heading level={2}>Disclosure records</Heading>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-700">
            “Not retrieved” means no entity-specific record surfaced in the checked authoritative sources.
          </p>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-primary-100 bg-white">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-primary-50">
                <tr>
                  <th className="px-4 py-3 font-bold">Entity</th>
                  <th className="px-4 py-3 font-bold">Beneficial ownership</th>
                  <th className="px-4 py-3 font-bold">Conflict disclosure</th>
                  <th className="px-4 py-3 font-bold">Recusal / inhibition</th>
                  <th className="px-4 py-3 font-bold">Historical role record</th>
                </tr>
              </thead>
              <tbody>
                {visibleEntities.map(entity => {
                  const records =
                    integrityDisclosureByEntityId.get(entity.id) ?? [];
                  const bo = records.find(
                    record => record.kind === 'beneficial-ownership'
                  );
                  const conflict = records.find(
                    record => record.kind === 'conflict-of-interest'
                  );
                  const recusal = records.find(
                    record => record.kind === 'recusal'
                  );
                  const historical = records.find(
                    record =>
                      record.kind === 'other-disclosure' &&
                      record.assessment.status === 'source-backed'
                  );

                  return (
                    <tr key={entity.id} className="border-t border-gray-200 align-top">
                      <td className="px-4 py-4 font-bold text-gray-950">
                        {entity.canonicalName}
                      </td>
                      {[bo, conflict, recusal].map((record, index) => (
                        <td key={index} className="px-4 py-4">
                          {record ? (
                            <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700">
                              {disclosureStatusLabel(record.assessment.status)}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-4">
                        {historical &&
                        historical.assessment.status === 'source-backed' ? (
                          <div>
                            <div className="font-semibold text-gray-900">
                              {historical.relatedNameAsStated ?? 'Source-stated role'}
                            </div>
                            <div className="mt-1 text-xs leading-relaxed text-gray-600">
                              {historical.assessment.statementAsStated}
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {sourcesFor(
                                historical.assessment.sourceIds
                              ).map(source => (
                                <a
                                  key={source.id}
                                  href={source.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-bold text-primary-700 underline"
                                >
                                  Source
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="font-bold text-gray-800">
              {historicalRoleCount} source-backed historical role statements
            </span>
            {[
              'gppb-ra12009-irr-2025',
              'psdbm-bo-registry-2026',
              'sec-harbor-2026',
            ].map(id => {
              const source = sourceById.get(id);
              return source ? (
                <a
                  key={source.id}
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-primary-700 underline"
                >
                  {source.label}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : null;
            })}
          </div>
        </Section>
      )}

      {showAudits && (
        <Section className="bg-white" id="audits">
          <div className="section-eyebrow">COA follow-up</div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Heading level={2}>Audit finding trails</Heading>
            </div>
            <Link
              to="/accountability?type=audit"
              className="text-sm font-bold text-primary-700 underline"
            >
              Open Accountability audit ledger
            </Link>
          </div>

          <div className="mt-6 space-y-5">
            {visibleFindings.map(finding => {
              const actions = integrityAuditActions.filter(
                action => action.findingId === finding.id
              );
              const trail = integrityAuditResolutionTrails.find(
                candidate => candidate.findingId === finding.id
              );
              const sourceIds = [
                ...finding.sourceIds,
                ...actions.flatMap(action => action.sourceIds),
              ];
              const directSources = sourcesFor(sourceIds);
              const analysisLinks = reportsForCivicRecord({
                type: 'integrity-record',
                id: finding.id,
                recordKind: 'audit-finding',
              });

              return (
                <article
                  key={finding.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                        {finding.auditPeriod}
                      </div>
                      <h3 className="mt-1 text-xl font-black text-gray-950">
                        {finding.title}
                      </h3>
                    </div>
                    {trail && (
                      <span className="inline-flex w-fit rounded-full bg-secondary-100 px-3 py-1.5 text-xs font-black text-secondary-900">
                        {trail.resolution.status === 'unresolved'
                          ? 'Unresolved'
                          : trail.resolution.status}
                      </span>
                    )}
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-xl bg-gray-50 p-4">
                      <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                        Finding
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-gray-800">
                        {finding.findingAsStated}
                      </p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4">
                      <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                        Recommendation
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-gray-800">
                        {finding.recommendationAsStated ?? 'Not stated in the indexed record.'}
                      </p>
                    </div>
                  </div>

                  {actions.length > 0 && (
                    <div className="mt-5">
                      <h4 className="font-black text-gray-950">
                        Later evidence
                      </h4>
                      <div className="mt-3 space-y-3">
                        {actions.map(action => (
                          <div
                            key={action.id}
                            className="rounded-xl border border-gray-200 p-4"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-800">
                                {action.kind.replaceAll('-', ' ')}
                              </span>
                              {action.date && (
                                <span className="text-xs font-semibold text-gray-500">
                                  {action.date}
                                </span>
                              )}
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-gray-700">
                              {action.statementAsStated}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {trail?.resolution.status === 'unresolved' && (
                    <div className="mt-5 rounded-xl border border-secondary-200 bg-secondary-50 p-4">
                      <div className="text-xs font-black uppercase tracking-[0.08em] text-secondary-900">
                        Why unresolved
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-gray-800">
                        {trail.resolution.reason}
                      </p>
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap gap-3">
                    {directSources.map(source => {
                      const publicRecord = publicRecordByUrl.get(source.url);
                      return (
                        <span key={source.id} className="inline-flex items-center gap-2">
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline"
                          >
                            {source.publisher}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                          {publicRecord && (
                            <Link
                              to={'/records/' + publicRecord.id}
                              className="text-sm font-bold text-primary-700 underline"
                            >
                              Public record
                            </Link>
                          )}
                        </span>
                      );
                    })}
                    {civicLinksForFinding(finding.id).map(item =>
                      item.node ? (
                        <Link
                          key={item.relationship.id}
                          to={item.node.href}
                          className="text-sm font-bold text-primary-700 underline"
                        >
                          {item.node.owner === 'accountability'
                            ? 'Accountability record'
                            : 'Source catalog'}
                        </Link>
                      ) : null
                    )}
                    {analysisLinks.map(item =>
                      item.node ? (
                        <Link
                          key={item.relationship.id}
                          to={item.node.href}
                          className="text-sm font-bold text-secondary-900 underline"
                        >
                          Analysis: {item.node.label}
                        </Link>
                      ) : null
                    )}
                  </div>
                </article>
              );
            })}

            {visibleFindings.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-600">
                No finding-level audit record matches this search.
              </div>
            )}
          </div>

          {(!needle ||
            integrityAuditSourceOnlyRecords.some(record =>
              [record.title, record.reason]
                .join(' ')
                .toLowerCase()
                .includes(needle)
            )) && (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-[#fffdf8] p-5">
              <div className="flex items-start gap-3">
                <History className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                    Source-only audit record
                  </div>
                  <h3 className="mt-1 font-black text-gray-950">
                    {integrityAuditSourceOnlyRecords[0]?.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">
                    {integrityAuditSourceOnlyRecords[0]?.reason}
                  </p>
                  {sourceById.get('coa-makati-sef-compliance-2024') && (
                    <a
                      href={
                        sourceById.get('coa-makati-sef-compliance-2024')?.url
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline"
                    >
                      Open COA source
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </Section>
      )}

      {showSources && (
        <Section className="bg-[#f5f8f2]" id="sources">
          <div className="section-eyebrow">Source records</div>
          <Heading level={2}>Sources</Heading>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {visibleSources.map(source => (
              <a
                key={source.id}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
              >
                <div className="flex items-start gap-3">
                  {source.sourceClass === 'audit-institution' ? (
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
                  ) : source.sourceClass === 'city-government' ? (
                    <Landmark className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
                  ) : source.sourceClass === 'public-registry' ? (
                    <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
                  ) : (
                    <FileSearch className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                      {source.publisher}
                    </div>
                    <h3 className="mt-1 font-black text-gray-950">
                      {source.label}
                    </h3>
                    {source.publishedOrPeriod && (
                      <p className="mt-1 text-sm text-gray-600">
                        {source.publishedOrPeriod}
                      </p>
                    )}
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                      Open source
                      <ExternalLink className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </a>
            ))}

            {visibleSources.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-600 md:col-span-2">
                No source matches this search.
              </div>
            )}
          </div>
        </Section>
      )}

      <Section className="bg-white">
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            to="/projects-budget"
            className="rounded-2xl border border-gray-200 p-5 hover:border-primary-300"
          >
            <ReceiptText className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-black text-gray-950">Money & projects</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Budget, procurement and implementation records.
            </p>
          </Link>
          <Link
            to="/accountability"
            className="rounded-2xl border border-gray-200 p-5 hover:border-primary-300"
          >
            <ShieldCheck className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-black text-gray-950">Accountability</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Targets, responsibility, evidence and follow-through.
            </p>
          </Link>
          <Link
            to="/records"
            className="rounded-2xl border border-gray-200 p-5 hover:border-primary-300"
          >
            <Landmark className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-black text-gray-950">Public records</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Primary-source catalogs and official record collections.
            </p>
          </Link>
        </div>

      </Section>
    </>
  );
}
