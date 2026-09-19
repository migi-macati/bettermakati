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
          BetterMakati is an independent, open-source civic information portal
          for Makati City and part of the BetterLGU community. It is not an
          official City Government website.
        </Text>
        <Text className="max-w-4xl">
          Public information is organized into searchable services, records,
          dashboards and trackers, with links to the original sources.
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
            <h2 className="mt-3 font-extrabold text-gray-950">Political neutrality</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Political pages show sourced records without candidate endorsements or BetterMakati ratings.
            </p>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <RefreshCw className="h-5 w-5 text-primary-700" />
            <h2 className="mt-3 font-extrabold text-gray-950">Corrections</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Uncertain or missing information stays labeled until a defensible source is available.
            </p>
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Source policy</div>
        <Heading level={2}>How information is handled</Heading>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ['Primary sources first', 'City, PSA, COA, COMELEC, DBM, enacted laws and other official records are preferred where they directly support the claim.'],
            ['Definitions stay distinct', 'Budgets, actual receipts, expenditures, population boundaries and economic indicators are not treated as interchangeable.'],
            ['Dates stay visible', 'Current and historical information is labeled by period or review date.'],
            ['No invented gaps', 'Missing officeholders, project statuses or historical claims remain missing until supported.'],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-5">
              <h3 className="font-extrabold text-gray-950">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
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
