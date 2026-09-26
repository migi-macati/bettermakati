import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link, useParams } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { publicRecordById } from '../data/publicRecords';

export default function PublicRecordDetail() {
  const { id } = useParams();
  const record = id ? publicRecordById.get(id) : undefined;

  if (!record) {
    return (
      <Section className="bg-[#fffdf8]">
        <Link
          to="/records"
          className="inline-flex items-center gap-1 text-sm font-bold text-primary-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Public Records
        </Link>
        <Heading className="mt-6">Record not found</Heading>
        <p className="mt-3 text-gray-600">
          This Public Records entry is unavailable or its identifier has changed.
        </p>
      </Section>
    );
  }

  return (
    <>
      <SEO
        title={record.title}
        description={record.description}
      />

      <Section className="border-b border-primary-800 bg-primary-900 text-white">
        <Link
          to="/records"
          className="inline-flex items-center gap-1 text-sm font-bold text-secondary-300"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Public Records
        </Link>

        <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold">
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-primary-50">
            {record.category}
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-primary-50">
            {record.sourceClass}
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-primary-50">
            {record.format}
          </span>
        </div>

        <Heading className="mt-4 !text-white">{record.title}</Heading>
        <p className="mt-2 font-semibold text-primary-100">
          {record.publisher}
          {record.period ? ' · ' + record.period : ''}
        </p>
        <p className="mt-4 max-w-4xl text-base leading-relaxed text-primary-50">
          {record.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={record.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-primary-900"
          >
            Open original source
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </Section>

      {record.format === 'PDF' && (
        <Section className="bg-white">
          <div className="section-eyebrow">Document</div>
          <Heading level={2}>Preview</Heading>
          <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
            <iframe
              title={record.title + ' document preview'}
              src={record.url}
              className="h-[72vh] min-h-[560px] w-full"
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-gray-500">
            If the publisher blocks embedded viewing, open the original source above.
          </p>
        </Section>
      )}

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Related records</div>
        <Heading level={2}>Where this source appears</Heading>

        {record.contexts.length > 0 ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {record.contexts.map(context => (
              <Link
                key={context.href + context.label}
                to={context.href}
                className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300"
              >
                <div className="font-extrabold text-gray-950">
                  {context.label}
                </div>
                <div className="mt-2 text-sm font-bold text-primary-700">
                  Open related record
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600">
            No related page is attached to this source.
          </div>
        )}

        {record.usedBy.length > 0 && (
          <div className="mt-5 text-sm text-gray-600">
            Used by: {record.usedBy.join(' · ')}
          </div>
        )}

      </Section>
    </>
  );
}
