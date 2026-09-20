import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Building2,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { Link, useParams } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import LastReviewed from '../components/ui/LastReviewed';
import { serviceDirectory, type ServiceDirectoryItem } from '../data/serviceDirectory';
import { officesForAgency } from '../data/governmentServiceOffices';

const mapsUrl = (query: string) =>
  'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);

const prepareByType: Record<string, string[]> = {
  Permit: [
    'A valid government ID and the forms required by the issuing office.',
    'Supporting ownership, business, property or technical documents that apply to the permit.',
    'Payment only after the official office or portal confirms the current fee or assessment.',
  ],
  Clearance: [
    'A valid government ID.',
    'Proof of address, employment, business or purpose when required.',
    'Any prerequisite clearance or certification listed by the issuing office.',
  ],
  Certificate: [
    'A valid government ID.',
    'The record, reference number or supporting document connected with the certificate.',
    'Authorization and IDs when requesting for another person, if allowed.',
  ],
  ID: [
    'A valid government ID or identity documents accepted by the program.',
    'Proof of eligibility, residence, membership or status when required.',
    'Recent supporting records required by the issuing office.',
  ],
  Registration: [
    'Identity and contact information.',
    'The registration or membership documents required for your applicant type.',
    'Supporting business, employment or civil-registry records when applicable.',
  ],
  'Tax & payment': [
    'Your taxpayer, property or account reference number.',
    'The latest assessment, billing statement or prior receipt when applicable.',
    'Use only official payment channels and keep the official receipt.',
  ],
  'Health service': [
    'A valid ID and any program or patient record requested by the facility.',
    'Referral, prescription or prior test result when the service specifically requires one.',
    'Confirm privacy, consent and preparation instructions before laboratory or clinical services.',
  ],
  Assistance: [
    'A valid government ID.',
    'Proof of residence, income, employment or the circumstance for which assistance is requested.',
    'Supporting medical, financial or incident documents when relevant.',
  ],
  Education: [
    'Student and parent/guardian identity information where applicable.',
    'School records requested for the transaction.',
    'Follow the current school-year or admissions schedule.',
  ],
  Other: [
    'A valid government ID.',
    'Documents that establish the transaction, request or concern.',
    'Check the official source for any service-specific requirement.',
  ],
};

const specialGuidance: Record<
  string,
  { prepare?: string[]; steps?: string[]; note?: string }
> = {
  'sss-services': {
    prepare: [
      'SS number or CRN if already registered.',
      'A My.SSS account for online transactions.',
      'A valid ID and supporting civil-status or employment records for updates when applicable.',
    ],
    steps: [
      'Check your My.SSS record and contributions online first.',
      'Use the online transaction if available.',
      'If the case requires branch handling, choose one of the Makati SSS branches shown below.',
    ],
  },
  'philhealth-services': {
    prepare: [
      'PhilHealth Identification Number (PIN), if already registered.',
      'A valid ID and the supporting record needed for any membership update.',
      'Use the Member Portal to view or print the MDR and check contributions.',
    ],
    steps: [
      'Open the PhilHealth Member Portal and check whether the transaction can be completed online.',
      'For membership corrections or cases requiring documents, prepare the PMRF and supporting records.',
      'Use the Makati LHIO below when a walk-in transaction is required.',
    ],
  },
  'pagibig-services': {
    prepare: [
      'Pag-IBIG MID number, if already registered.',
      'A Virtual Pag-IBIG account for online member transactions.',
      'A valid ID and supporting employment or civil-status documents when required.',
    ],
    steps: [
      'Check Virtual Pag-IBIG first for the transaction.',
      'Prepare the service-specific form and supporting records.',
      'Use a Makati Pag-IBIG branch shown below when branch submission is required.',
    ],
  },
  'comelec-voter-services': {
    steps: [
      'Check the current COMELEC voter-service schedule before visiting.',
      'Use BetterMakati Elections for Makati-specific registration and election information.',
      'Bring the identification and supporting documents required for the specific voter transaction.',
    ],
  },
  'national-police-clearance': {
    steps: [
      'Create or sign in to the National Police Clearance System.',
      'Complete the online application and payment instructions.',
      'Follow the appointment and identity-verification instructions shown by PNP.',
    ],
  },
  'nbi-clearance': {
    steps: [
      'Create or sign in to the NBI Clearance online system.',
      'Choose the transaction and available appointment site shown by NBI.',
      'Bring the IDs and reference details required for biometrics and releasing.',
    ],
  },
};

const standardSteps = (item: ServiceDirectoryItem) => [
  `Confirm that ${item.agency} is the correct issuing office for your case.`,
  'Read the official requirements before preparing or submitting personal documents.',
  'Use the online channel when available; otherwise use a verified office or service counter.',
  'Keep the official reference number, acknowledgement or receipt after submission.',
];

export default function ServiceGuide() {
  const { id } = useParams();
  const item = serviceDirectory.find(entry => entry.id === id);

  if (!item) {
    return (
      <Section className="bg-[#fffdf8]">
        <Heading>Service guide not found</Heading>
        <Link to="/services" className="mt-5 inline-flex items-center gap-2 font-bold text-primary-700">
          <ArrowLeft className="h-4 w-4" /> Back to services
        </Link>
      </Section>
    );
  }

  const offices = officesForAgency(item.agency);
  const guidance = specialGuidance[item.id];
  const prepare = guidance?.prepare || prepareByType[item.type] || prepareByType.Other;
  const steps = guidance?.steps || standardSteps(item);
  const destinationIsExternal = item.href.startsWith('http');

  return (
    <>
      <SEO
        title={item.title}
        description={`${item.description} BetterMakati guide with office, preparation and official source information.`}
      />

      <Section className="bg-[#fffdf8]">
        <Link to="/services" className="inline-flex items-center gap-2 text-sm font-bold text-primary-700">
          <ArrowLeft className="h-4 w-4" /> Services
        </Link>

        <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
          <span className="rounded-full bg-primary-50 px-2.5 py-1 text-primary-800">{item.level}</span>
          <span className="rounded-full bg-white px-2.5 py-1 text-gray-600">{item.type}</span>
          <span className="rounded-full bg-white px-2.5 py-1 text-gray-600">{item.category}</span>
        </div>

        <Heading className="mt-3">{item.title}</Heading>
        <p className="mt-2 max-w-3xl text-lg leading-relaxed text-gray-700">{item.description}</p>
        <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-gray-600">
          <Building2 className="h-4 w-4 text-primary-700" />
          {item.agency}
        </div>
        <LastReviewed
          note="BetterMakati is a guide. The issuing agency's current requirements and eligibility rules control."
          className="mt-5"
        />
      </Section>

      <Section className="bg-white">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <div className="section-eyebrow">Prepare</div>
            <Heading level={2}>Before you start</Heading>
            <ul className="mt-5 space-y-3">
              {prepare.map(point => (
                <li key={point} className="flex gap-3 text-sm leading-relaxed text-gray-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="section-eyebrow">Process</div>
            <Heading level={2}>How to start</Heading>
            <ol className="mt-5 space-y-3">
              {steps.map((point, index) => (
                <li key={point} className="flex gap-3 text-sm leading-relaxed text-gray-700">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-800 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {guidance?.note && (
          <div className="mt-6 rounded-xl border border-secondary-200 bg-secondary-50 p-4 text-sm text-gray-700">
            {guidance.note}
          </div>
        )}
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Where to go</div>
        <Heading level={2}>
          {offices.length ? 'Offices that can help' : item.level === 'Barangay' ? 'Start with your barangay' : 'Office information'}
        </Heading>

        {item.level === 'Barangay' ? (
          <div className="mt-5 rounded-2xl border border-primary-100 bg-white p-5">
            <p className="text-sm leading-relaxed text-gray-700">
              Barangay services are handled by the barangay hall. Open your barangay profile for local office and contact information.
            </p>
            <Link to="/barangays" className="brand-btn-primary mt-4">Find your barangay</Link>
          </div>
        ) : offices.length ? (
          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {offices.map(office => (
              <article key={office.id} className="rounded-2xl border border-primary-100 bg-white p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={
                    office.scope === 'In Makati'
                      ? 'rounded-full bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-800'
                      : 'rounded-full bg-secondary-50 px-2.5 py-1 text-xs font-bold text-secondary-900'
                  }>
                    {office.scope}
                  </span>
                  {office.barangay && (
                    <span className="text-xs font-semibold text-gray-500">{office.barangay}</span>
                  )}
                </div>
                <h3 className="mt-3 font-extrabold text-gray-950">{office.name}</h3>
                <div className="mt-3 flex gap-2 text-sm leading-relaxed text-gray-700">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-700" />
                  <span>{office.address}</span>
                </div>
                {office.phone && (
                  <div className="mt-2 flex gap-2 text-sm text-gray-700">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary-700" />
                    <span>{office.phone}</span>
                  </div>
                )}
                {office.email && (
                  <div className="mt-2 flex gap-2 text-sm text-gray-700">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary-700" />
                    <span>{office.email}</span>
                  </div>
                )}
                {office.note && (
                  <p className="mt-3 text-xs leading-relaxed text-gray-500">{office.note}</p>
                )}
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <a
                    href={mapsUrl(office.mapsQuery)}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-primary-700 underline underline-offset-2"
                  >
                    Map
                  </a>
                  <a
                    href={office.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-primary-700 underline underline-offset-2"
                  >
                    Office source
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-sm leading-relaxed text-gray-700">
              BetterMakati has not yet verified a dedicated walk-in office for this exact service. Use the official service source below before travelling.
            </p>
          </div>
        )}
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Official transaction</div>
        <Heading level={2}>Continue with the issuing agency</Heading>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
          Check the agency page for current eligibility, forms, fees, schedules and any appointment requirement.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {destinationIsExternal ? (
            <a href={item.href} target="_blank" rel="noreferrer" className="brand-btn-primary">
              Continue to official service <ExternalLink className="h-4 w-4" />
            </a>
          ) : (
            <Link to={item.href} className="brand-btn-primary">
              Open detailed BetterMakati guide
            </Link>
          )}
          {item.sourceUrl !== item.href && (
            <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="brand-btn-secondary">
              Official source <FileText className="h-4 w-4" />
            </a>
          )}
        </div>
      </Section>
    </>
  );
}
