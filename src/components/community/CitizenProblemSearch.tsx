import { FormEvent, useMemo, useState } from 'react';
import { ArrowRight, ChevronDown, ExternalLink, LifeBuoy, PhoneCall, Search, ShieldAlert } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  citizenText,
  findCitizenGuides,
  isImmediateDanger,
  type CitizenGuide,
  type CitizenText,
} from '../../data/citizenProblemGuides';

const copy = {
  prompt: citizenText("What's happening in Makati?", 'Ano ang nangyayari sa Makati?'),
  placeholder: citizenText('Describe your concern...', 'Ikuwento ang concern mo...'),
  search: citizenText('Find a next step', 'Hanapin ang next step'),
  lead: citizenText("Let's work through this", 'Hanapan natin ito ng solusyon'),
  first: citizenText('Start here', 'Simulan dito'),
  next: citizenText('Your next step', 'Susunod na hakbang'),
  tried: citizenText("I've already done that", 'Nagawa ko na iyan'),
  officialNow: citizenText('Get official help', 'Humingi ng official assistance'),
  reported: citizenText("I've already contacted them", 'Na-contact ko na sila'),
  retry: citizenText('Start over', 'Simulan ulit'),
  followup: citizenText(
    'Keep the date, office, name or reference number from your earlier report. Follow up through the same official channel and ask for its status. BetterMakati cannot see or track that government case.',
    'Itabi ang petsa, office, pangalan o reference number ng unang report. Mag-follow up sa official channel para sa status. Hindi nakikita o nata-track ng BetterMakati ang government case.'
  ),
  details: citizenText('More steps, rules and official sources', 'Ibang steps, rules at official sources'),
  source: citizenText('Official source', 'Official source'),
  alternate: citizenText('Other possible issue', 'Ibang posibleng concern'),
  browse: citizenText('Browse services', 'Tingnan ang services'),
  missing: citizenText(
    "We don't have a verified answer for that situation yet.",
    'Wala pa kaming verified na sagot sa situation na iyon.'
  ),
  emergency: citizenText('Are you in immediate danger?', 'May immediate danger ba?'),
  emergencyText: citizenText(
    'Get somewhere safe and call emergency responders now. Do not wait for online advice.',
    'Pumunta sa ligtas na lugar at tumawag sa emergency responders. Huwag maghintay ng online advice.'
  ),
  privacy: citizenText(
    'This gives guidance only. No complaint has been submitted to an agency.',
    'Guidance lang ito. Walang na-submit na complaint sa agency.'
  ),
  barangay: citizenText('Find your barangay', 'Hanapin ang barangay mo'),
  map: citizenText('See public-place reports on the Civic Map', 'Tingnan ang public-place reports sa Civic Map'),
};

const localized = (item: CitizenText, fil: boolean) => fil ? item.fil : item.en;

function GuideFlow({ guide, fil }: { guide: CitizenGuide; fil: boolean }) {
  const [step, setStep] = useState(0);
  const [contacted, setContacted] = useState(false);
  const currentStep = Math.min(step, guide.steps.length - 1);
  const mainChannel = guide.channels.find(channel => channel.href.startsWith('tel:') || channel.href.startsWith('https:'));
  const directAction = mainChannel?.href.startsWith('tel:') || mainChannel?.href.startsWith('https:');
  const noise = guide.id === 'neighborhood-noise';

  return (
    <article className="rounded-2xl border border-primary-200 bg-white p-5 shadow-sm md:p-7">
      <p className="text-xs font-bold uppercase tracking-wide text-primary-700">
        {localized(copy.lead, fil)}
      </p>
      <h2 className="mt-2 text-2xl font-extrabold leading-tight text-primary-900 md:text-3xl">
        {localized(guide.title, fil)}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-gray-700">
        {localized(guide.intro, fil)}
      </p>

      <div className="mt-6 rounded-xl border border-primary-100 bg-primary-50 p-4 md:p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-primary-800">
          {localized(step === 0 ? copy.first : copy.next, fil)}
          <span className="ml-2 font-medium normal-case tracking-normal text-gray-600">
            {currentStep + 1} / {guide.steps.length}
          </span>
        </p>
        <p className="mt-2 text-base font-semibold leading-relaxed text-gray-950">
          {localized(guide.steps[currentStep], fil)}
        </p>
        {contacted ? (
          <div className="mt-4 rounded-lg bg-white p-4">
            <p className="text-sm leading-relaxed text-gray-800">
              {localized(copy.followup, fil)}
            </p>
            {mainChannel && (
              <a href={mainChannel.href} className="mt-3 inline-flex min-h-11 items-center gap-2 font-semibold text-primary-800 underline underline-offset-2">
                {mainChannel.name}
                {mainChannel.href.startsWith('tel:') ? <PhoneCall className="h-4 w-4" aria-hidden="true" /> : <ExternalLink className="h-4 w-4" aria-hidden="true" />}
              </a>
            )}
          </div>
        ) : step < guide.steps.length - 1 ? (
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              className="brand-btn-primary"
              onClick={() => setStep(guide.steps.length - 1)}
            >
              {localized(copy.officialNow, fil)}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setStep(value => Math.min(value + 1, guide.steps.length - 1))}
              className="brand-btn-secondary"
            >
              {localized(copy.tried, fil)}
            </button>
          </div>
        ) : (
          <div className="mt-5 flex flex-col gap-3">
            {mainChannel && directAction && (
              <a
                href={mainChannel.href}
                target={mainChannel.href.startsWith('https:') ? '_blank' : undefined}
                rel={mainChannel.href.startsWith('https:') ? 'noopener noreferrer' : undefined}
                className="brand-btn-primary flex max-w-full flex-wrap justify-center text-center sm:w-fit"
              >
                {mainChannel.href.startsWith('tel:')
                  ? (fil ? 'Tawagan ang ' : 'Call ')
                  : (fil ? 'Buksan ang ' : 'Open ')}
                {mainChannel.name}
                {mainChannel.href.startsWith('tel:') ? <PhoneCall className="h-4 w-4" aria-hidden="true" /> : <ExternalLink className="h-4 w-4" aria-hidden="true" />}
              </a>
            )}
            {noise && (
              <Link to="/barangays" className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary-800 underline underline-offset-2">
                {localized(copy.barangay, fil)} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
            <button type="button" onClick={() => setContacted(true)} className="min-h-11 w-fit text-left text-sm font-semibold text-primary-800 underline underline-offset-2">
              {localized(copy.reported, fil)}
            </button>
          </div>
        )}
      </div>

      <div className="mt-4">
        {(step > 0 || contacted) && (
          <button
            type="button"
            onClick={() => { setStep(0); setContacted(false); }}
            className="min-h-11 text-sm font-semibold text-primary-800 underline underline-offset-2"
          >
            {localized(copy.retry, fil)}
          </button>
        )}
        <details className="group mt-2 rounded-xl border border-gray-200 bg-[#fffdf8]">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-bold text-primary-900 [&::-webkit-details-marker]:hidden">
            {localized(copy.details, fil)}
            <ChevronDown className="h-4 w-4 shrink-0 transition group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="border-t border-gray-200 px-4 pb-5 pt-3">
            <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-gray-800">
              {guide.steps.map((item, index) => <li key={index}>{localized(item, fil)}</li>)}
            </ol>
            <p className="mt-4 text-sm leading-relaxed text-gray-700">
              {localized(guide.caution, fil)}
            </p>
            <ul className="mt-4 space-y-3">
              {guide.channels.map(channel => (
                <li key={channel.name + channel.href} className="text-sm">
                  <a
                    href={channel.href}
                    target={channel.href.startsWith('https:') ? '_blank' : undefined}
                    rel={channel.href.startsWith('https:') ? 'noopener noreferrer' : undefined}
                    className="inline-flex min-h-10 items-center gap-1 font-bold text-primary-800 underline underline-offset-2"
                  >
                    {channel.name}
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                  <p className="text-gray-700">{localized(channel.detail, fil)}</p>
                  {channel.source !== channel.href && (
                    <a href={channel.source} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1 text-xs font-semibold text-primary-800 underline underline-offset-2">
                      {localized(copy.source, fil)} <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
            {guide.placeRelated && (
              <Link to="/civic-map" className="mt-3 inline-flex min-h-11 items-center gap-2 font-semibold text-primary-800 underline underline-offset-2">
                {localized(copy.map, fil)} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </div>
        </details>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-gray-600">
        {localized(copy.privacy, fil)}
      </p>
    </article>
  );
}

export default function CitizenProblemSearch({
  initialProblem = '',
  resultOnly = false,
}: {
  initialProblem?: string;
  resultOnly?: boolean;
}) {
  const { i18n } = useTranslation();
  const fil = i18n.resolvedLanguage?.startsWith('fil') ?? false;
  const location = useLocation();
  const transferred = initialProblem ||
    (location.state as { citizenProblem?: string } | null)?.citizenProblem || '';
  const [query, setQuery] = useState(transferred.slice(0, 500));
  const [submitted, setSubmitted] = useState(transferred.trim().slice(0, 500));
  const guides = useMemo(() => findCitizenGuides(submitted), [submitted]);
  const danger = isImmediateDanger(submitted);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.trim().length > 2) setSubmitted(query.trim().slice(0, 500));
  };

  return (
    <section>
      {!resultOnly && (
        <form onSubmit={submit} className="rounded-2xl border border-primary-200 bg-white p-5 shadow-sm md:p-7" role="search">
          <div className="flex items-center gap-2 text-primary-900">
            <LifeBuoy className="h-5 w-5" aria-hidden="true" />
            <h2 className="text-xl font-bold">{localized(copy.prompt, fil)}</h2>
          </div>
          <label htmlFor="citizen-problem" className="sr-only">{localized(copy.prompt, fil)}</label>
          <textarea
            id="citizen-problem"
            rows={3}
            maxLength={500}
            minLength={3}
            required
            className="mt-4 block w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-950"
            value={query}
            placeholder={localized(copy.placeholder, fil)}
            onChange={event => setQuery(event.target.value)}
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <Link to="/hotlines" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary-800 underline underline-offset-2">
              <ShieldAlert className="h-4 w-4" aria-hidden="true" />
              {localized(copy.emergency, fil)}
            </Link>
            <button type="submit" disabled={query.trim().length < 3} className="brand-btn-primary disabled:opacity-50">
              <Search className="h-4 w-4" aria-hidden="true" />
              {localized(copy.search, fil)}
            </button>
          </div>
        </form>
      )}

      {submitted && (
        <div className={resultOnly ? '' : 'mt-6'} role="status" aria-live="polite">
          {danger ? (
            <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-5">
              <h2 className="text-xl font-bold text-red-950">{localized(copy.emergency, fil)}</h2>
              <p className="mt-2 text-sm text-red-950">{localized(copy.emergencyText, fil)}</p>
              <a href="tel:911" className="brand-btn-primary mt-4">
                <PhoneCall className="h-4 w-4" aria-hidden="true" /> Call 911
              </a>
            </div>
          ) : guides.length > 0 ? (
            <div>
              <GuideFlow key={guides[0].id} guide={guides[0]} fil={fil} />
              {guides.length > 1 && (
                <details className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
                  <summary className="cursor-pointer text-sm font-semibold text-primary-900">
                    {localized(copy.alternate, fil)}
                  </summary>
                  <div className="mt-3">
                    <GuideFlow key={guides[1].id} guide={guides[1]} fil={fil} />
                  </div>
                </details>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-primary-200 bg-white p-5">
              <h2 className="text-lg font-bold text-primary-900">{localized(copy.missing, fil)}</h2>
              <div className="mt-3 flex flex-wrap gap-3">
                <Link to="/services" className="brand-btn-secondary">{localized(copy.browse, fil)}</Link>
                <Link to="/hotlines" className="brand-btn-secondary">Hotlines</Link>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
