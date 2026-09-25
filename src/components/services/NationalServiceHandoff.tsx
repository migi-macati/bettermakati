import { ExternalLink, FileText, MapPin } from 'lucide-react';
import Section from '../ui/Section';
import { Heading } from '../ui/Heading';
import type { NationalServiceIntegration } from '../../data/serviceDirectory';

interface NationalServiceHandoffProps {
  agency: string;
  integration: NationalServiceIntegration;
}

export default function NationalServiceHandoff({
  agency,
  integration,
}: NationalServiceHandoffProps) {
  const showOfficialSource =
    integration.officialSourceUrl !== integration.officialActionUrl;
  const betterGov = integration.betterGov;
  const showBetterGov =
    betterGov.status !== 'missing' && Boolean(betterGov.listingUrl);

  return (
    <Section className="bg-white">
      <div className="section-eyebrow">National service</div>
      <Heading level={2}>Continue with {agency}</Heading>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
        Use the issuing agency for the current transaction and requirements.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href={integration.officialActionUrl}
          target="_blank"
          rel="noreferrer"
          className="brand-btn-primary"
        >
          Open official service <ExternalLink className="h-4 w-4" />
        </a>
        {showOfficialSource && (
          <a
            href={integration.officialSourceUrl}
            target="_blank"
            rel="noreferrer"
            className="brand-btn-secondary"
          >
            Official source <FileText className="h-4 w-4" />
          </a>
        )}
      </div>

      {integration.makatiContext?.summary && (
        <div className="mt-6 rounded-xl border border-primary-100 bg-primary-50 p-4">
          <div className="flex gap-3 text-sm leading-relaxed text-gray-700">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
            <span>{integration.makatiContext.summary}</span>
          </div>
        </div>
      )}

      {showBetterGov && (
        <div className="mt-6 border-t border-gray-200 pt-4 text-xs leading-relaxed text-gray-500">
          National directory:{' '}
          <a
            href={betterGov.listingUrl}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-primary-700 underline underline-offset-2"
          >
            BetterGov.ph
          </a>
          {betterGov.matchedService && (
            <span> · {betterGov.matchedService}</span>
          )}
        </div>
      )}
    </Section>
  );
}
