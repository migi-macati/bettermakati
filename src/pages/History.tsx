import { ExternalLink, Waves } from 'lucide-react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { historyTimeline } from '../data/visitMakati';
import SEO from '../components/SEO';

export default function History() {
  return (
    <>
      <SEO
        title="History of Makati"
        description="A sourced timeline of Makati City history."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">History</div>
        <Heading>From San Pedro Makati to the modern city</Heading>

        <div className="mt-8 rounded-2xl border border-accent-100 bg-accent-50 p-6">
          <Waves className="h-6 w-6 text-accent-700" />
          <h2 className="font-extrabold text-xl text-gray-950 mt-3">The name Makati</h2>
          <p className="text-sm text-gray-700 mt-2 leading-relaxed">
            The city's ecological profile recounts the familiar origin story in which the phrase “Makati na, kumati na,” referring to the ebbing Pasig River, was understood as the name of the place.{' '}
            <a
              href="https://www.makati.gov.ph/assets/uploads/downloads/2/49/241/pdf/I.%20History.pdf"
              target="_blank"
              rel="noreferrer"
              className="text-primary-700 underline underline-offset-2"
            >
              City of Makati
            </a>
          </p>
        </div>

        <div className="relative mt-12 max-w-4xl">
          <div className="absolute left-[3.1rem] top-1 bottom-1 w-px bg-primary-200 md:left-[7.5rem]" aria-hidden="true" />

          <div className="space-y-8">
            {historyTimeline.map(entry => (
              <article key={entry.year + entry.title} className="relative grid grid-cols-[5rem_1fr] md:grid-cols-[9rem_1fr] gap-5">
                <div className="pt-1 text-right font-extrabold text-primary-800">{entry.year}</div>
                <div className="relative rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
                  <span className="absolute -left-[1.78rem] md:-left-[1.78rem] top-6 h-3 w-3 rounded-full border-2 border-white bg-secondary-500 shadow-sm" />
                  <h2 className="font-extrabold text-lg text-gray-950">{entry.title}</h2>
                  <p className="text-sm text-gray-700 mt-2 leading-relaxed">{entry.summary}</p>
                  <a
                    href={entry.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary-700 underline underline-offset-2"
                  >
                    {entry.sourceLabel} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
