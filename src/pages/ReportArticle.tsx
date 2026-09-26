import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SharePage from '../components/ui/SharePage';
import {
  findReport,
  resolveReportSlug,
} from '../data/reports';
import { reportRelatedRecords } from '../data/reportCivicRelationships';
import { publicRecordByUrl } from '../data/publicRecords';
import type {
  ReportCanonicalRecordRef,
  ReportContentBlock,
  ReportSourceV2,
} from '../data/reportTypes';

const recordTypeLabel: Record<ReportCanonicalRecordRef['recordType'], string> = {
  'statistics-indicator': 'Statistics',
  legislation: 'Legislation',
  'integrity-entity': 'Integrity entity',
  'integrity-disclosure': 'Integrity disclosure',
  'integrity-audit-finding': 'Audit finding',
  place: 'Place',
  project: 'Project',
  'accountability-entry': 'Accountability record',
};

function SourceLink({
  source,
  children,
  className = '',
}: {
  source: ReportSourceV2;
  children: React.ReactNode;
  className?: string;
}) {
  const classes =
    'font-bold text-primary-700 underline underline-offset-2 ' + className;

  if (source.sourceKind === 'canonical-internal') {
    return (
      <Link to={source.href} className={classes}>
        {children}
      </Link>
    );
  }

  const publicRecord = publicRecordByUrl.get(source.href);

  return (
    <span className="inline-flex items-baseline gap-1.5">
      <a
        href={source.href}
        target="_blank"
        rel="noreferrer"
        className={classes}
      >
        {children}
      </a>
      {publicRecord && (
        <Link
          to={'/records/' + publicRecord.id}
          className="whitespace-nowrap font-bold text-primary-700 underline underline-offset-2"
        >
          Public record
        </Link>
      )}
    </span>
  );
}

function EvidenceLinks({
  sourceIds,
  records,
  sourceById,
}: {
  sourceIds?: string[];
  records?: ReportCanonicalRecordRef[];
  sourceById: Map<string, ReportSourceV2>;
}) {
  if ((!sourceIds || sourceIds.length === 0) && (!records || records.length === 0)) {
    return null;
  }

  return (
    <span className="ml-1 inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-1 text-xs">
      {sourceIds?.map(sourceId => {
        const source = sourceById.get(sourceId);
        return source ? (
          <SourceLink
            key={sourceId}
            source={source}
            className="whitespace-nowrap"
          >
            [{sourceId}]
          </SourceLink>
        ) : null;
      })}
      {records?.map(record => (
        <Link
          key={record.recordType + ':' + record.id}
          to={record.href}
          className="whitespace-nowrap font-bold text-primary-700 underline underline-offset-2"
        >
          {recordTypeLabel[record.recordType]}
        </Link>
      ))}
    </span>
  );
}

function ReportBlock({
  block,
  sourceById,
}: {
  block: ReportContentBlock;
  sourceById: Map<string, ReportSourceV2>;
}) {
  if (block.kind === 'paragraph') {
    const evidence =
      block.role === 'fact' ? block.evidence : block.evidence;

    return (
      <div
        className={
          block.role === 'analysis'
            ? 'rounded-2xl border-l-4 border-secondary-400 bg-secondary-50 px-5 py-4'
            : ''
        }
      >
        {block.role === 'analysis' && (
          <div className="mb-2 text-xs font-black uppercase tracking-[0.08em] text-secondary-900">
            Analysis
          </div>
        )}
        <p className="text-base leading-8 text-gray-800 md:text-lg">
          {block.text}
          <EvidenceLinks
            sourceIds={evidence?.sourceIds}
            records={evidence?.records}
            sourceById={sourceById}
          />
        </p>
      </div>
    );
  }

  if (block.kind === 'stat') {
    return (
      <div className="rounded-2xl border border-primary-100 bg-primary-50 p-5">
        <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
          {block.label}
        </div>
        <div className="mt-2 text-3xl font-black tracking-tight text-primary-900">
          {block.value}
        </div>
        {block.detail && (
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            {block.detail}
            <EvidenceLinks
              sourceIds={block.evidence.sourceIds}
              records={block.evidence.records}
              sourceById={sourceById}
            />
          </p>
        )}
        {!block.detail && (
          <EvidenceLinks
            sourceIds={block.evidence.sourceIds}
            records={block.evidence.records}
            sourceById={sourceById}
          />
        )}
      </div>
    );
  }

  if (block.kind === 'table') {
    return (
      <div>
        {block.title && (
          <h3 className="text-lg font-black text-gray-950">{block.title}</h3>
        )}
        {block.caption && (
          <p className="mt-1 text-sm text-gray-600">{block.caption}</p>
        )}
        <div className="mt-3 overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                {block.columns.map(column => (
                  <th
                    key={column.key}
                    className={
                      'px-4 py-3 font-bold text-gray-800 ' +
                      (column.align === 'right' ? 'text-right' : '')
                    }
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t border-gray-200">
                  {block.columns.map(column => (
                    <td
                      key={column.key}
                      className={
                        'px-4 py-3 text-gray-700 ' +
                        (column.align === 'right' ? 'text-right font-semibold' : '')
                      }
                    >
                      {row[column.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 text-right">
          <EvidenceLinks
            sourceIds={block.evidence.sourceIds}
            records={block.evidence.records}
            sourceById={sourceById}
          />
        </div>
      </div>
    );
  }

  const allValues = block.series.flatMap(series =>
    series.points.map(point => point.value)
  );
  const maxValue =
    block.valueLabel === '%' ? 100 : Math.max(...allValues, 1);

  return (
    <figure>
      {block.title && (
        <h3 className="text-lg font-black text-gray-950">{block.title}</h3>
      )}
      {block.caption && (
        <p className="mt-1 text-sm text-gray-600">{block.caption}</p>
      )}
      <div className="mt-4 space-y-6">
        {block.series.map(series => (
          <div key={series.label}>
            {block.series.length > 1 && (
              <div className="mb-3 text-sm font-bold text-gray-700">
                {series.label}
              </div>
            )}
            <div className="space-y-3">
              {series.points.map(point => {
                const width = Math.max(2, (point.value / maxValue) * 100);
                return (
                  <div key={point.label}>
                    <div className="mb-1 flex items-baseline justify-between gap-4 text-sm">
                      <span className="font-semibold text-gray-800">
                        {point.label}
                      </span>
                      <span className="shrink-0 font-mono text-xs font-bold text-gray-600">
                        {point.value.toLocaleString()}
                        {block.valueLabel === '%' ? '%' : ''}
                      </span>
                    </div>
                    <div
                      className="h-3 overflow-hidden rounded-full bg-gray-100"
                      role="img"
                      aria-label={
                        point.label +
                        ': ' +
                        point.value.toLocaleString() +
                        (block.valueLabel ? ' ' + block.valueLabel : '')
                      }
                    >
                      <div
                        className="h-full rounded-full bg-primary-700"
                        style={{ width: width + '%' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <figcaption className="mt-3 text-right">
        <EvidenceLinks
          sourceIds={block.evidence.sourceIds}
          records={block.evidence.records}
          sourceById={sourceById}
        />
      </figcaption>
    </figure>
  );
}

export default function ReportArticle() {
  const { slug } = useParams();
  const canonicalSlug = resolveReportSlug(slug);

  if (slug && canonicalSlug && canonicalSlug !== slug) {
    return <Navigate to={'/reports/' + canonicalSlug} replace />;
  }

  const report = findReport(slug);

  if (!report) {
    return <Navigate to="/reports" replace />;
  }

  const sourceById = new Map(report.sources.map(source => [source.id, source]));
  const underlyingRecords = reportRelatedRecords(report.slug);

  return (
    <>
      <SEO title={report.headline} description={report.subheadline} />

      <Section className="bg-[#fffdf8]">
        <Link
          to="/reports"
          className="inline-flex items-center gap-2 text-sm font-bold text-primary-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Featured Reports & Insights
        </Link>

        <div className="mt-6 text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
          {report.date}
        </div>

        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Heading>{report.headline}</Heading>
          <SharePage title={report.headline + ' | BetterMakati'} />
        </div>

        <p className="mt-4 max-w-4xl text-lg leading-relaxed text-gray-700 md:text-xl">
          {report.subheadline}
        </p>

        <p className="mt-5 max-w-4xl border-l-4 border-primary-600 pl-4 text-base font-semibold leading-relaxed text-gray-900 md:text-lg">
          {report.synthesis}
        </p>
      </Section>

      <Section className="bg-white">
        <article className="mx-auto max-w-4xl space-y-10">
          {report.sections.map(section => (
            <section key={section.id} id={section.id}>
              {section.heading && (
                <h2 className="mb-5 text-2xl font-black tracking-tight text-gray-950 md:text-3xl">
                  {section.heading}
                </h2>
              )}
              <div className="space-y-6">
                {section.blocks.map((block, index) => (
                  <ReportBlock
                    key={section.id + '-' + index}
                    block={block}
                    sourceById={sourceById}
                  />
                ))}
              </div>
            </section>
          ))}

          {report.methodology && (
            <details className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <summary className="cursor-pointer font-black text-gray-950">
                {report.methodology.title ?? 'Methodology & limits'}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-700">
                {report.methodology.text}
                <EvidenceLinks
                  sourceIds={report.methodology.evidence?.sourceIds}
                  records={report.methodology.evidence?.records}
                  sourceById={sourceById}
                />
              </p>
            </details>
          )}
        </article>
      </Section>

      {underlyingRecords.length > 0 && (
        <Section className="bg-[#fffdf8]">
          <div className="mx-auto max-w-4xl">
            <div className="section-eyebrow">Records</div>
            <Heading level={2}>Related records</Heading>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {underlyingRecords.map(item =>
                item.node ? (
                  item.node.owner === 'ecosystem' ? (
                    <a
                      key={item.relationship.id}
                      href={item.node.href}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300"
                    >
                      <div className="font-black text-gray-950">
                        {item.node.label}
                      </div>
                      <div className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                        Open record
                        <ExternalLink className="h-3.5 w-3.5" />
                      </div>
                    </a>
                  ) : (
                    <Link
                      key={item.relationship.id}
                      to={item.node.href}
                      className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300"
                    >
                      <div className="font-black text-gray-950">
                        {item.node.label}
                      </div>
                      <div className="mt-2 text-sm font-bold text-primary-700">
                        Open record
                      </div>
                    </Link>
                  )
                ) : null
              )}
            </div>
          </div>
        </Section>
      )}

      <Section className="bg-[#f5f8f2]">
        <div className="mx-auto max-w-4xl">
          <div className="section-eyebrow">Sources</div>
          <ol className="mt-5 space-y-4 text-sm leading-relaxed text-gray-700">
            {report.sources.map(source => (
              <li key={source.id} className="rounded-xl bg-white p-4">
                <div className="flex flex-wrap items-start gap-x-2 gap-y-1">
                  <SourceLink source={source}>
                    [{source.id}] {source.label}
                  </SourceLink>
                  {source.sourceKind !== 'canonical-internal' && (
                    <ExternalLink
                      className="mt-0.5 h-3.5 w-3.5 text-primary-700"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {[source.publisher, source.publishedOrPeriod]
                    .filter(Boolean)
                    .join(' · ')}
                </div>
                {source.note && (
                  <p className="mt-2 text-sm text-gray-600">{source.note}</p>
                )}
              </li>
            ))}
          </ol>
        </div>
      </Section>
    </>
  );
}
