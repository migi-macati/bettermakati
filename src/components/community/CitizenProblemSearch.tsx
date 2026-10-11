import { FormEvent, useMemo, useState } from 'react';
import { ArrowRight, ExternalLink, LifeBuoy, PhoneCall, Search, ShieldAlert } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  citizenText,
  findCitizenGuides,
  isImmediateDanger,
  type CitizenText,
} from '../../data/citizenProblemGuides';

const labels = {
  title: citizenText('What problem can we help you solve?', 'Ano ang problema? Paano kami makakatulong?'),
  intro: citizenText(
    'Describe one problem in your own words. You do not need to know the law, barangay office or government agency.',
    'Ikuwento ang isang problema sa sarili mong salita. Hindi mo kailangang alam ang batas o pangalan ng office.'
  ),
  placeholder: citizenText(
    'e.g. Cars block our sidewalk every night...',
    'Hal. May mga kotseng nakaharang sa bangketa tuwing gabi...'
  ),
  button: citizenText('Find a next step', 'Alamin ang puwedeng gawin'),
  safety: citizenText('Immediate danger? Call 911 instead of using this guide.', 'May immediate danger? Tumawag sa 911.'),
  match: citizenText('A useful next step for your concern', 'Mga puwedeng gawin sa concern mo'),
  steps: citizenText('What to do', 'Ano ang puwedeng gawin'),
  contact: citizenText('Official channels and sources', 'Official contacts at sources'),
  unknown: citizenText(
    'We do not yet have a verified guide for that exact problem.',
    'Wala pa kaming verified guide para sa eksaktong problemang iyon.'
  ),
  unknownHelp: citizenText(
    'Try a shorter description with the main issue (for example, “blocked sidewalk”). Or use the service directory or official Makati contact information.',
    'Subukan ang mas maikling description ng main issue (hal. “baradong bangketa”). Maaari rin ang services directory o official Makati contacts.'
  ),
  more: citizenText('Possible interpretations', 'Posibleng concern'),
  privacy: citizenText(
    'Your description is matched on this page. This does not file a complaint or send anything to a government office.',
    'Dito lang mina-match ang description mo. Hindi ito complaint filing o pag-send sa government office.'
  ),
  explore: citizenText('Browse services', 'Tingnan ang services'),
  hotlines: citizenText('Official Makati hotlines', 'Official Makati hotlines'),
  missing: citizenText('Suggest a missing guide', 'Mag-suggest ng kulang na guide'),
  map: citizenText('Explore the Civic Map for public-place conditions', 'Tingnan ang Civic Map para sa public places'),
  safetyDetails: citizenText(
    'Your description may indicate an immediate threat. Seek safety and call emergency responders now. Do not wait for this page.',
    'Posibleng may agarang panganib. Pumunta sa ligtas na lugar at tumawag sa emergency responders ngayon.'
  ),
};

const textFor = (item: CitizenText, fil: boolean) => fil ? item.fil : item.en;

export default function CitizenProblemSearch() {
  const { i18n } = useTranslation();
  const fil = i18n.resolvedLanguage?.startsWith('fil') ?? false;
  const location = useLocation();
  const transferred = (location.state as { citizenProblem?: string } | null)?.citizenProblem ?? '';
  const [query, setQuery] = useState(transferred.slice(0, 500));
  const [submitted, setSubmitted] = useState(transferred.trim().slice(0, 500));
  const guides = useMemo(() => findCitizenGuides(submitted), [submitted]);
  const danger = isImmediateDanger(submitted);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.trim().length < 3) return;
    setSubmitted(query.trim().slice(0, 500));
  };

  return (
    <div className="rounded-2xl border border-primary-200 bg-white p-5 shadow-sm md:p-7">
      <div className="flex items-center gap-2 text-primary-900">
        <LifeBuoy className="h-5 w-5" aria-hidden="true" />
        <h2 className="text-xl font-extrabold md:text-2xl">
          {textFor(labels.title, fil)}
        </h2>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-700 md:text-base">
        {textFor(labels.intro, fil)}
      </p>
      <form className="mt-5" onSubmit={submit} role="search">
        <label htmlFor="citizen-problem" className="sr-only">
          {textFor(labels.title, fil)}
        </label>
        <textarea
          id="citizen-problem"
          value={query}
          maxLength={500}
          rows={3}
          onChange={event => setQuery(event.target.value)}
          placeholder={textFor(labels.placeholder, fil)}
          className="block w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-950 placeholder:text-gray-500 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300"
          required
          minLength={3}
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <Link to="/hotlines" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-error-800 underline underline-offset-2">
            <ShieldAlert className="h-4 w-4" aria-hidden="true" />
            {textFor(labels.safety, fil)}
          </Link>
          <button
            type="submit"
            disabled={query.trim().length < 3}
            className="brand-btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            {textFor(labels.button, fil)}
          </button>
        </div>
      </form>
      {submitted && (
        <div className="mt-6 border-t border-gray-200 pt-6" role="status" aria-live="polite">
          {danger ? (
            <div className="rounded-xl border-2 border-error-300 bg-error-50 p-5">
              <h3 className="text-lg font-bold text-error-950">
                {textFor(labels.safety, fil)}
              </h3>
              <p className="mt-2 text-sm text-error-950">
                {textFor(labels.safetyDetails, fil)}
              </p>
              <a className="brand-btn-primary mt-4" href="tel:911">
                <PhoneCall className="h-4 w-4" aria-hidden="true" />
                911
              </a>
            </div>
          ) : guides.length > 0 ? (
            <div>
              <h3 className="text-xl font-extrabold text-gray-950">
                {textFor(guides.length > 1 ? labels.more : labels.match, fil)}
              </h3>
              <div className="mt-4 space-y-5">
                {guides.map(guide => (
                  <article key={guide.id} className="rounded-xl border border-gray-200 bg-[#fffdf8] p-5">
                    <h4 className="text-lg font-extrabold text-primary-900">
                      {textFor(guide.title, fil)}
                    </h4>
                    <p className="mt-1 text-sm leading-relaxed text-gray-700">
                      {textFor(guide.intro, fil)}
                    </p>
                    <h5 className="mt-4 font-bold text-gray-950">
                      {textFor(labels.steps, fil)}
                    </h5>
                    <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-gray-800">
                      {guide.steps.map((step, index) => (
                        <li key={index}>{textFor(step, fil)}</li>
                      ))}
                    </ol>
                    <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-relaxed text-gray-900">
                      {textFor(guide.caution, fil)}
                    </p>
                    <h5 className="mt-5 font-bold text-gray-950">
                      {textFor(labels.contact, fil)}
                    </h5>
                    <ul className="mt-2 space-y-3">
                      {guide.channels.map(channel => (
                        <li key={channel.href + channel.name} className="text-sm">
                          <a
                            href={channel.href}
                            target={channel.href.startsWith('https:') ? '_blank' : undefined}
                            rel={channel.href.startsWith('https:') ? 'noreferrer' : undefined}
                            className="inline-flex min-h-9 items-center gap-1 font-bold text-primary-800 underline underline-offset-2"
                          >
                            {channel.name}
                            {channel.href.startsWith('https:') ? (
                              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                            ) : <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" />}
                          </a>
                          <p className="text-gray-700">{textFor(channel.detail, fil)}</p>
                          <a
                            href={channel.source}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex min-h-8 items-center text-xs font-semibold text-primary-700 underline underline-offset-2"
                          >
                            {fil ? 'Official source' : 'Official source'} <ExternalLink className="ml-1 h-3 w-3" aria-hidden="true" />
                          </a>
                        </li>
                      ))}
                    </ul>
                    {guide.placeRelated && (
                      <Link className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-primary-800 underline underline-offset-2" to="/civic-map">
                        {textFor(labels.map, fil)} <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-[#fffdf8] p-5">
              <h3 className="font-bold text-gray-950">{textFor(labels.unknown, fil)}</h3>
              <p className="mt-2 text-sm text-gray-700">{textFor(labels.unknownHelp, fil)}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link to="/services" className="brand-btn-secondary">
                  {textFor(labels.explore, fil)}
                </Link>
                <Link to="/hotlines" className="brand-btn-secondary">
                  {textFor(labels.hotlines, fil)}
                </Link>
                <Link to="/get-involved?type=idea" className="inline-flex min-h-11 items-center text-sm font-bold text-primary-800 underline underline-offset-2">
                  {textFor(labels.missing, fil)} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
          <p className="mt-5 text-xs leading-relaxed text-gray-600">
            {textFor(labels.privacy, fil)}
          </p>
        </div>
      )}
    </div>
  );
}
