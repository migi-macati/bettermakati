import {
  ExternalLink,
  Github,
  RefreshCw,
  Scale,
  ShieldCheck,
} from 'lucide-react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import SEO from '../components/SEO';
import LastReviewed from '../components/ui/LastReviewed';

export default function About() {
  return (
    <>
      <SEO
        title="About"
        description="About BetterMakati, its sources, independence and correction process."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">About</div>
        <Heading>BetterMakati</Heading>
        <Text className="mb-3 max-w-4xl">
          BetterMakati is an independent, open-source civic information and
          participation platform for Makati and part of the BetterLGU community.
          It is not an official City Government of Makati website.
        </Text>
        <Text className="max-w-4xl">
          Public information is organized into searchable services, records,
          dashboards and trackers, while participation tools let people contribute
          observations, proposals, corrections and civic input. Original sources
          remain linked wherever they support the information shown.
        </Text>
        <LastReviewed label="Project policy reviewed" />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <ShieldCheck className="h-5 w-5 text-primary-700" />
            <h2 className="mt-3 font-extrabold text-gray-950">Sources</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Figures and records link to the public source used.
            </p>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <Scale className="h-5 w-5 text-primary-700" />
            <h2 className="mt-3 font-extrabold text-gray-950">
              Political neutrality
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Political pages show sourced records without candidate
              endorsements or BetterMakati ratings.
            </p>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <RefreshCw className="h-5 w-5 text-primary-700" />
            <h2 className="mt-3 font-extrabold text-gray-950">Corrections</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Uncertain or missing information stays labeled until a defensible
              source is available.
            </p>
          </div>
        </div>
      </Section>

      <Section id="identity" className="bg-primary-50">
        <div className="section-eyebrow">Our identity</div>
        <Heading level={2}>Rooted in Makati</Heading>
        <p className="max-w-3xl leading-relaxed text-gray-700">
          The BetterMakati mark brings together a Baybayin-inspired Ma form, two
          flowing hills and a rising sun. The hill-and-sun composition draws on
          the project founder’s Matagumpay flag reference. It is a contemporary
          civic design, not an official seal or a reproduction of a historical
          flag.
        </p>
        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          {[
            {
              src: '/bettermakati-logo.svg',
              title: 'Primary',
              note: 'Exact primary logo supplied by the project owner: green symbol, gold sun, gold Better and green Makati.',
              frame: 'bg-white',
            },
            {
              src: '/bettermakati-logo-reverse.svg',
              title: 'Reverse',
              note: 'Exact all-white reverse logo supplied by the project owner.',
              frame: 'bg-primary-900',
            },
            {
              src: '/bettermakati-symbol.svg',
              title: 'Single gold',
              note: 'Exact symbol-only crop from the approved logo for compact applications.',
              frame: 'bg-primary-900',
            },
          ].map(item => (
            <figure
              key={item.src}
              className="overflow-hidden rounded-2xl border border-primary-100 bg-white"
            >
              <div className={'flex h-40 items-center justify-center p-6 ' + item.frame}>
                <img
                  src={item.src}
                  alt={item.title + ' BetterMakati symbol'}
                  className="h-28 max-w-full"
                  width="180"
                  height="126"
                />
              </div>
              <figcaption className="p-5">
                <h3 className="font-bold text-primary-900">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{item.note}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-gray-600">
          “Baybayin-inspired” describes the design intent; it does not claim
          that this stylized mark is a standard handwritten Ma. Readability with
          Baybayin readers remains to be assessed.
        </p>

        <div className="mt-9 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-primary-100 bg-white p-6">
            <div className="section-eyebrow">Colour system</div>
            <h3 className="text-xl font-extrabold text-gray-950">Official logo colours + warm white.</h3>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                ['#036738', 'Deep green', 'bg-[#036738] text-white'],
                ['#FBBF01', 'Sun gold', 'bg-[#FBBF01] text-gray-950'],
                ['#FFFDF8', 'Warm white', 'bg-[#FFFDF8] text-gray-950 border border-gray-200'],
              ].map(([hex, label, classes]) => (
                <div key={hex}>
                  <div className={'flex h-20 items-end rounded-xl p-3 text-xs font-bold ' + classes}>
                    {hex}
                  </div>
                  <div className="mt-2 text-xs font-bold text-gray-700">{label}</div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Gold is reserved for identity and emphasis rather than small body copy. Semantic alert and data colours remain functional and explicitly labelled.
            </p>
          </div>

          <div className="rounded-2xl border border-primary-100 bg-white p-6">
            <div className="section-eyebrow">Typography</div>
            <div className="space-y-5">
              <div>
                <div className="brand-wordmark text-3xl text-gray-950">Official wordmark artwork</div>
                <p className="mt-1 text-sm text-gray-600">The BetterMakati wordmark is artwork and is never recreated with live text; Figtree remains the display-heading family.</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-950">Inter</div>
                <p className="mt-1 text-sm text-gray-600">Navigation, body copy, forms, tables and civic interfaces.</p>
              </div>
              <div>
                <div className="font-mono text-xl font-semibold text-gray-950">Roboto Mono 2026</div>
                <p className="mt-1 text-sm text-gray-600">Technical labels, code and machine-readable/data contexts.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Source policy</div>
        <Heading level={2}>How information is handled</Heading>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            [
              'Primary sources first',
              'City, PSA, COA, COMELEC, DBM, enacted laws and other official records are preferred where they directly support the claim.',
            ],
            [
              'Definitions stay distinct',
              'Budgets, actual receipts, expenditures, population boundaries and economic indicators are not treated as interchangeable.',
            ],
            [
              'Dates stay visible',
              'Current and historical information is labeled by period or review date.',
            ],
            [
              'No invented gaps',
              'Missing officeholders, project statuses or historical claims remain missing until supported.',
            ],
          ].map(([title, body]) => (
            <div
              key={title}
              className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-5"
            >
              <h3 className="font-extrabold text-gray-950">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Project links</div>
        <Heading level={2}>Verify, review or contribute</Heading>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="https://www.makati.gov.ph/"
            target="_blank"
            rel="noreferrer"
            className="brand-btn-secondary"
          >
            Official Makati website <ExternalLink className="h-4 w-4" />
          </a>
          <a href="/get-involved" className="brand-btn-primary">
            Contribute
          </a>
          <a href="/open-government" className="brand-btn-secondary">
            Open-government methodology
          </a>
          <a href="/status" className="brand-btn-secondary">
            BetterMakati Status
          </a>
          <a
            href="https://github.com/migi-macati/bettermakati"
            target="_blank"
            rel="noreferrer"
            className="brand-btn-secondary"
          >
            <Github className="h-4 w-4" /> Source code
          </a>
        </div>
      </Section>
    </>
  );
}
