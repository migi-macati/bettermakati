import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Link2,
  Megaphone,
  Scale,
} from 'lucide-react';
import { Link, useParams } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import {
  cityMonitorRecords,
  cityMonitorTypeLabel,
} from '../data/cityMonitor';

export default function CityMonitorRecordPage() {
  const { id } = useParams();
  const record = cityMonitorRecords.find(item => item.id === id);

  if (!record) {
    return (
      <>
        <SEO title="City Monitor record not found" noIndex />
        <Section className="bg-[#fffdf8]">
          <Heading>City Monitor record not found</Heading>
          <p className="mt-3 text-gray-600">
            This record is not in the current validated City Monitor corpus.
          </p>
          <Link to="/city-monitor" className="brand-btn-primary mt-5">
            <ArrowLeft className="h-4 w-4" /> City Monitor
          </Link>
        </Section>
      </>
    );
  }

  return (
    <>
      <SEO
        title={record.title}
        description={record.summary}
      />

      <Section className="bg-[#fffdf8]">
        <Link
          to="/city-monitor"
          className="inline-flex items-center gap-1 text-sm font-bold text-primary-700"
        >
          <ArrowLeft className="h-4 w-4" /> City Monitor
        </Link>
        <div className="mt-5 text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
          {cityMonitorTypeLabel[record.type]} · {record.historical ? 'Historical record' : record.status}
        </div>
        <Heading>{record.title}</Heading>
        <p className="mt-3 max-w-4xl text-gray-700 leading-relaxed">{record.summary}</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl border border-primary-100 bg-white p-4">
            <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">Date</div>
            <div className="mt-1 font-extrabold text-gray-950">{record.date}</div>
          </div>
          <div className="rounded-xl border border-primary-100 bg-white p-4">
            <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">Status</div>
            <div className="mt-1 font-extrabold text-gray-950">{record.status}</div>
          </div>
          <div className="rounded-xl border border-primary-100 bg-white p-4">
            <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">Source publisher</div>
            <div className="mt-1 font-extrabold text-gray-950">{record.sourcePublisher}</div>
          </div>
        </div>

        <a
          href={record.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="brand-btn-primary mt-6"
        >
          Original source <ExternalLink className="h-4 w-4" />
        </a>
      </Section>

      {(record.summaryBullets?.length || record.measures?.length) && (
        <Section className="bg-white">
          <div className="section-eyebrow">BetterMakati factual summary</div>
          <Heading level={2}>What the record establishes</Heading>
          {record.summaryBullets && (
            <ul className="mt-5 space-y-2 text-sm text-gray-700">
              {record.summaryBullets.map(item => <li key={item}>• {item}</li>)}
            </ul>
          )}
          {record.measures && (
            <div className="mt-6 space-y-3">
              {record.measures.map(item => (
                <div key={item.reference} className="rounded-xl border border-gray-200 p-4">
                  <div className="font-extrabold text-gray-950">{item.reference}</div>
                  {item.title && <div className="mt-1 text-sm text-gray-700">{item.title}</div>}
                  {item.action && <div className="mt-1 text-sm text-gray-600">{item.action}</div>}
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                      Measure source <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </Section>
      )}

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Documents & provenance</div>
        <Heading level={2}>Original record first</Heading>
        <div className="mt-5 space-y-3">
          <a
            href={record.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-3 rounded-xl border border-primary-100 bg-white p-4"
          >
            <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
            <span>
              <strong>{record.sourceLabel}</strong>
              <span className="block text-sm text-gray-600">{record.sourcePublisher}</span>
            </span>
          </a>
          {record.documents?.map(document => (
            <a
              key={document.url}
              href={document.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-3 rounded-xl border border-primary-100 bg-white p-4"
            >
              <Link2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
              <span>
                <strong>{document.label}</strong>
                <span className="block text-xs uppercase tracking-[0.08em] text-gray-500">{document.kind}</span>
              </span>
            </a>
          ))}
        </div>
      </Section>

      {(record.transcript || record.type === 'executive-speech') && (
        <Section className="bg-white">
          <div className="section-eyebrow">Transcript</div>
          <Heading level={2}>Speech provenance</Heading>
          {record.transcript ? (
            <div className="mt-5 rounded-2xl border border-primary-100 bg-[#fffdf8] p-6">
              <Megaphone className="h-5 w-5 text-primary-700" />
              <div className="mt-3 font-extrabold text-gray-950">
                {record.transcript.kind === 'official'
                  ? 'Official transcript'
                  : record.transcript.kind === 'bettermakati-reviewed'
                    ? 'BetterMakati reviewed transcript'
                    : 'BetterMakati automated transcript'}
              </div>
              <p className="mt-2 text-sm text-gray-600">{record.transcript.note}</p>
              {record.transcript.url && (
                <a href={record.transcript.url} className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                  Open transcript <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-secondary-200 bg-secondary-50 p-5 text-sm text-gray-700">
              No transcript has been attached to this record. BetterMakati will
              not reconstruct speech wording without an official text or stable
              source recording.
            </div>
          )}
        </Section>
      )}

      {record.commitments?.length ? (
        <Section className="bg-[#fffdf8]">
          <div className="section-eyebrow">Accountability extraction</div>
          <Heading level={2}>Forward-looking commitments</Heading>
          <div className="mt-5 space-y-3">
            {record.commitments.map(commitment => (
              <div key={commitment.text} className="rounded-xl border border-primary-100 bg-white p-4">
                <Scale className="h-4 w-4 text-primary-700" />
                <div className="mt-2 font-bold text-gray-950">{commitment.text}</div>
                {commitment.target && <div className="mt-1 text-sm text-gray-600">Target: {commitment.target}</div>}
                {commitment.sourceNote && <div className="mt-1 text-xs text-gray-500">{commitment.sourceNote}</div>}
              </div>
            ))}
          </div>
          <Link to="/accountability" className="brand-btn-secondary mt-5">
            Accountability Ledger
          </Link>
        </Section>
      ) : null}
    </>
  );
}
