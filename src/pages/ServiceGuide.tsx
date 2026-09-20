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

const agencyGuidance: Record<
  string,
  { prepare?: string[]; steps?: string[]; note?: string }
> = {
  'Social Security System': {
    prepare: [
      'Your SS number or CRN and access to My.SSS, when applicable.',
      'A valid ID and the benefit- or loan-specific supporting documents.',
      'An enrolled disbursement account when the SSS transaction requires one.',
    ],
    steps: [
      'Check the SSS service page and your My.SSS account for eligibility and current requirements.',
      'File online when the benefit or transaction is available in My.SSS.',
      'For cases that require over-the-counter processing, use a Makati SSS branch listed below.',
    ],
    note: 'SSS rules differ by benefit. The official SSS benefit page controls the qualifying conditions and filing channel.',
  },
  'Pag-IBIG Fund': {
    prepare: [
      'Your Pag-IBIG MID number and access to Virtual Pag-IBIG, when applicable.',
      'A valid ID and the current application form for the loan, savings or claim transaction.',
      'Proof of income, membership savings or event-specific records when the program requires them.',
    ],
    steps: [
      'Check Virtual Pag-IBIG first for your record and available online transaction.',
      'Review the current program checklist before submitting a form.',
      'Use one of the Makati Pag-IBIG offices below when branch filing or validation is required.',
    ],
    note: 'Loan and provident-claim eligibility varies by contribution history and the specific program.',
  },
  'Philippine Health Insurance Corporation': {
    prepare: [
      'Your PhilHealth Identification Number and Member Data Record, if available.',
      'A valid ID and supporting documents for membership updates.',
      'For benefit use, confirm that the health facility is PhilHealth-accredited and check current eligibility.',
    ],
    steps: [
      'Use the PhilHealth Member Portal to check records, contributions, MDR and YAKAP clinic selection.',
      'For benefit availment, confirm the package and accredited facility before care when practical.',
      'Use the Makati Local Health Insurance Office below for transactions that require walk-in handling.',
    ],
    note: 'PhilHealth benefit rules and packages change. Check the current benefit or circular before relying on an older amount or requirement.',
  },
  'Employees’ Compensation Commission': {
    prepare: [
      'Employment information and records showing the work-related sickness, injury, disability or death.',
      'Medical records, incident reports and receipts relevant to the claim.',
      'SSS details for private-sector workers or GSIS details for public-sector workers.',
    ],
    steps: [
      'Determine whether the claim is under SSS (private sector) or GSIS (public sector).',
      'File the EC benefit claim with the administering system using its current requirements.',
      'Contact the ECC Public Assistance Center in Makati for program guidance, rehabilitation or claim assistance.',
    ],
    note: 'ECC administers the Employees’ Compensation Program, while benefit claims are generally processed through SSS or GSIS depending on employment sector.',
  },
  'Government Service Insurance System': {
    prepare: [
      'Your GSIS BP number or membership record.',
      'A valid ID or GSIS eCard/UMID where required.',
      'The claim- or loan-specific form and supporting records.',
    ],
    steps: [
      'Check GSIS Touch or the relevant GSIS online service first.',
      'Review the benefit or loan requirements for your case.',
      'Use GSIS online filing, a GW@PS facility or the servicing office when in-person handling is required.',
    ],
  },
  'Department of Education – Schools Division Office Makati': {
    prepare: [
      'Student name, school and learner information.',
      'The school record involved in the request.',
      'Parent, guardian or authorization documents when applicable.',
    ],
    steps: [
      'Start with the school when the request concerns a currently enrolled learner.',
      'Use the SDO Makati Records Unit for CAV, record corrections and division-level records services.',
      'Contact the Schools Division Office before visiting if the transaction needs a specific unit.',
    ],
  },
  'Department of Social Welfare and Development': {
    prepare: [
      'A valid government ID.',
      'Proof of the crisis or need being assessed.',
      'Medical, funeral, transportation, income or other supporting records relevant to the assistance requested.',
    ],
    steps: [
      'Check the current DSWD assistance program and documentary checklist.',
      'Use the office serving Makati or the current DSWD online/appointment channel.',
      'Expect eligibility and amount of assistance to be based on social-worker assessment and program rules.',
    ],
  },
  'Department of Health – Metro Manila Center for Health Development': {
    prepare: [
      'Identify whether your need is a resident health service, facility verification or a regulated-facility transaction.',
      'For licensing or regulatory transactions, prepare the DOH application and facility documents.',
      'For routine personal care, check Makati Health Department or an appropriate licensed health facility first.',
    ],
    steps: [
      'Use the DOH-NCR regulatory lists to verify licensed facilities when that is your need.',
      'For facility licensing or regulatory transactions, follow the MMCHD Citizen’s Charter.',
      'The DOH regional office serving Makati is in Mandaluyong; local resident care is often delivered through Makati or accredited providers.',
    ],
  },
  'Department of Labor and Employment': {
    prepare: [
      'A valid ID and the employment, employer or workplace information connected with the concern.',
      'Contracts, payslips, notices, messages or other records relevant to the labor issue when applicable.',
      'For employer regulatory submissions, prepare the current DOLE form and project or establishment records.',
    ],
    steps: [
      'Use the DOLE-NCR client portal when the transaction is available online.',
      'For Makati workplaces and projects, contact the Makati–Pasay Field Office shown below.',
      'Keep the filing or assistance reference for follow-up.',
    ],
  },
  'Department of Trade and Industry': {
    prepare: [
      'A valid ID and basic business or consumer transaction information.',
      'For business-name transactions, prepare the proposed name and owner details.',
      'For consumer complaints, keep receipts, warranties, messages and other proof of the transaction.',
    ],
    steps: [
      'Use DTI online services when the transaction is available digitally.',
      'For MSME advice or transactions requiring assistance, use the Makati Negosyo Center below.',
      'For consumer concerns, follow the current DTI complaint process and preserve the reference number.',
    ],
  },
  'Securities and Exchange Commission': {
    prepare: [
      'Company or proposed-company information and the SEC registration number when applicable.',
      'An eSECURE account when required by the selected electronic transaction.',
      'The corporate documents required for registration, filing or records request.',
    ],
    steps: [
      'Start with the relevant SEC electronic system for registration, filing or verification.',
      'Complete authentication and electronic submission requirements before visiting the headquarters.',
      'Use the SEC headquarters in Bel-Air for transactions or assistance that require onsite handling.',
    ],
  },
  'Technical Education and Skills Development Authority': {
    prepare: [
      'A valid ID and your preferred qualification or training field.',
      'Education or employment records if required by the chosen program.',
      'Check the specific scholarship or training-provider requirements before enrollment.',
    ],
    steps: [
      'Search current TESDA registered programs and scholarship announcements.',
      'Contact the PASMAK district office serving Pasay and Makati for local guidance.',
      'Enroll only with the current provider and program listed or recognized by TESDA.',
    ],
  },
  'Philippine Postal Corporation': {
    prepare: [
      'The item or document to be mailed and the complete recipient address.',
      'A valid ID when required for the selected postal transaction.',
      'Check packaging, prohibited-item and fee rules before going to the counter.',
    ],
    steps: [
      'Choose a Makati post office below.',
      'Ask the counter for the appropriate domestic or international postal product.',
      'Keep the official receipt and tracking number for trackable items.',
    ],
  },
  'Department of Public Works and Highways': {
    prepare: [
      'The exact Makati road, bridge, drainage or infrastructure location.',
      'Photos, dates and a concise description of the issue when reporting a concern.',
      'Distinguish a DPWH national-road concern from a city or barangay road concern before filing.',
    ],
    steps: [
      'Check whether the infrastructure is under DPWH jurisdiction.',
      'For Makati DPWH matters, contact the Metro Manila 2nd District Engineering Office serving the city.',
      'Keep the complaint, request or correspondence reference for follow-up.',
    ],
  },
  'Philippine Charity Sweepstakes Office': {
    prepare: [
      'A valid ID and current medical documents supporting the assistance request.',
      'Hospital, treatment, prescription or billing records required by the Medical Assistance Program.',
      'An email address and mobile number for the online application.',
    ],
    steps: [
      'Create or sign in to the PCSO Online Medical Assistance Program.',
      'Upload only the current documents requested for the type of medical assistance.',
      'Monitor the application through the official PCSO channel.',
    ],
  },
  'Bureau of Internal Revenue': {
    prepare: [
      'TIN and taxpayer registration details, if already registered.',
      'A valid ID and the BIR form for the requested update or transaction.',
      'Know the Makati Revenue District Office that has jurisdiction over your registered address.',
    ],
    steps: [
      'Use ORUS or other BIR online services first when the transaction is available online.',
      'Confirm your RDO before going to an office; Makati is divided among multiple RDOs.',
      'Bring only the current documentary requirements listed by BIR for the transaction.',
    ],
  },
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
  const guidance = specialGuidance[item.id] || agencyGuidance[item.agency];
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
