import {
  ExternalLink,
  Github,
  Scale,
  ShieldCheck,
  RefreshCw,
  Eye,
  ClipboardCheck,
  MessagesSquare,
  Radio,
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
        description="About BetterMakati, its independence, source policy, editorial principles and correction process."
      />
      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">About the project</div>
        <Heading>BetterMakati</Heading>
        <Text className="mb-3 max-w-4xl">
          BetterMakati is an independent, open-source civic information portal
          for Makati City. It is part of the BetterLGU community and is not an
          official website of the City Government of Makati.
        </Text>
        <Text className="mb-3 max-w-4xl">
          The official Makati website remains the authoritative place for city
          transactions and announcements. BetterMakati organizes public
          information, translates difficult records into usable interfaces, and
          links back to the evidence behind them.
        </Text>
        <LastReviewed label="Project policy reviewed" />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <ShieldCheck className="h-5 w-5 text-primary-700" />
            <h2 className="mt-3 font-extrabold text-gray-950">Verify the source</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Claims, figures and records should point to the public source used.
              Official agencies remain controlling for transactions and notices.
            </p>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <Scale className="h-5 w-5 text-primary-700" />
            <h2 className="mt-3 font-extrabold text-gray-950">Independent & neutral</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              BetterMakati is not a city-government communications channel,
              campaign site or candidate endorsement platform. Political pages
              are designed around sourced civic information.
            </p>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <RefreshCw className="h-5 w-5 text-primary-700" />
            <h2 className="mt-3 font-extrabold text-gray-950">Correct, don’t conceal</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Information that is incomplete, uncertain or stale should be
              labeled and corrected rather than silently filled with estimates.
            </p>
          </div>
        </div>
      </Section>

      <Section className="bg-primary-950 text-white">
        <div className="section-eyebrow !text-secondary-200">Product principles</div>
        <Heading level={2} className="!text-white">The five radicals</Heading>
        <p className="mt-2 max-w-4xl text-primary-100">
          These are operating rules for every major BetterMakati page, not
          claims about the City Government itself.
        </p>
        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: Eye,
              title: 'Radical transparency',
              body: 'Every factual claim should be traceable to a source, and important missing information should be visible rather than silently omitted.',
            },
            {
              icon: ClipboardCheck,
              title: 'Radical accountability',
              body: 'Every trackable public plan or commitment should connect responsibility, target, later evidence and outcome without BetterMakati assigning political scores.',
            },
            {
              icon: MessagesSquare,
              title: 'Radical participation',
              body: 'Every invitation for community input should have a visible process and, where BetterMakati controls the workflow, a trackable outcome rather than a black box.',
            },
            {
              icon: Radio,
              title: 'Radical presence',
              body: 'Useful civic information should be available where and when people need it, with locality and current context brought forward without requiring an account or precise GPS.',
            },
            {
              icon: ShieldCheck,
              title: 'Radical integrity',
              body: 'Public-interest decisions, money, relationships and ethical obligations should be open to factual scrutiny without insinuation, guilt by association or partisan interpretation.',
            },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-2xl border border-white/15 bg-white/5 p-5">
                <Icon className="h-5 w-5 text-secondary-200" />
                <h3 className="mt-3 font-extrabold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-primary-100">{item.body}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href="/open-government" className="brand-btn-primary">
            Open doctrine & living audit
          </a>
          <a href="/status" className="brand-btn-secondary">
            BetterMakati Status
          </a>
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Editorial principles</div>
        <Heading level={2}>How BetterMakati handles information</Heading>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ['Primary sources first', 'City, PSA, COA, COMELEC, DBM, enacted laws and other official records are preferred where they directly support the claim.'],
            ['Definitions matter', 'Budgets, actual receipts, expenditures, population boundaries and economic indicators are kept conceptually distinct.'],
            ['Time matters', 'Current information should show its period or review date. Historical evidence is not presented as if it describes current conditions.'],
            ['No invented gaps', 'Missing officeholders, project statuses or historical claims remain missing until a defensible source is available.'],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-primary-100 bg-white p-5">
              <h3 className="font-extrabold text-gray-950">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Sources & freshness</div>
        <Heading level={2}>How to verify information</Heading>
        <Text className="mb-3 max-w-4xl">
          Source links appear beside the facts, figures and records they
          support. Where a direct report or dataset is available, BetterMakati
          should link that specific record rather than a general agency homepage.
        </Text>
        <Text className="mb-3 max-w-4xl">
          A scheduled source-watch workflow checks selected high-value official
          records for changes. A changed source is flagged for human review; it
          does not automatically overwrite a published figure.
        </Text>
        <p className="mt-5">
          <a
            href="https://www.makati.gov.ph/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-bold text-primary-700 underline underline-offset-2"
          >
            Official Makati City website <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </p>
      </Section>

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Open project</div>
        <Heading level={2}>Corrections and contributions</Heading>
        <p className="max-w-3xl text-gray-600">
          Report a correction, submit a public source, suggest a tool or offer
          research and development help through BetterMakati&apos;s contribution
          form. The code and change history remain open on GitHub.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href="/get-involved" className="brand-btn-primary">
            Contribute
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
