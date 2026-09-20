export type ServiceDetailVerification = 'verified' | 'partial';

export interface ServiceRequirement {
  item: string;
  whereToSecure?: string;
  note?: string;
}

export interface ServiceFee {
  label: string;
  amount: string;
  note?: string;
}

export interface ServiceGuideDetail {
  verification: ServiceDetailVerification;
  sourceLabel: string;
  sourceUrl: string;
  lastVerified: string;
  classification?: string;
  transactionType?: string;
  whoMayAvail?: string;
  requirements: ServiceRequirement[];
  steps: string[];
  fees?: ServiceFee[];
  processingTime?: string;
  notes?: string[];
}

const checked = '2026-09-20';

export const serviceGuideDetails: Record<string, ServiceGuideDetail> = {
  'new-business-permit': {
    verification: 'verified',
    sourceLabel: 'Makati BPLO Business Permit Application Form (2025 update)',
    sourceUrl: 'https://www.makati.gov.ph/assets/uploads/online_forms/pdf/522/business%20permit%20form%202025%20update1111.pdf',
    lastVerified: checked,
    whoMayAvail: 'Applicants opening a business establishment in Makati.',
    requirements: [
      { item: 'Business Permit Application Form, duly filled and signed', whereToSecure: 'Makati BPLO / official city form' },
      { item: 'Locational Clearance for Business and Barangay Clearance', whereToSecure: 'City zoning / barangay' },
      { item: 'Proof of business-name/entity registration', whereToSecure: 'DTI, SEC or CDA, as applicable' },
      { item: 'Lease contract if leased, or TCT/Tax Declaration if owned', whereToSecure: 'Property owner / Registry of Deeds / City Assessor' },
      { item: 'Comprehensive General Liability Insurance, when applicable', whereToSecure: 'Insurance provider' },
      { item: 'Fire Safety Inspection Certificate for Business', whereToSecure: 'Bureau of Fire Protection' },
    ],
    steps: [
      'Complete the Makati business permit application form.',
      'Secure the locational and barangay clearances and gather entity/property documents.',
      'Secure the BFP Fire Safety Inspection Certificate required for permit issuance.',
      'Submit the complete application to BPLO and follow the official assessment and payment instructions.',
      'Claim or download the permit using the channel indicated by BPLO.',
    ],
    fees: [{ label: 'Business taxes and regulatory fees', amount: 'Varies', note: 'Determined by city assessment based on business activity and declarations.' }],
    processingTime: 'The city permits guide states permits are released within two hours after a complete set of documents and payment of all fees; actual end-to-end time depends on prerequisite clearances.',
  },
  'renew-business-permit': {
    verification: 'verified',
    sourceLabel: 'Makati BPLO Business Permit Application Form (2025 update)',
    sourceUrl: 'https://www.makati.gov.ph/assets/uploads/online_forms/pdf/522/business%20permit%20form%202025%20update1111.pdf',
    lastVerified: checked,
    whoMayAvail: 'Existing Makati businesses renewing their city business permit.',
    requirements: [
      { item: 'Business Permit Application Form, duly filled and signed', whereToSecure: 'Makati BPLO / official city form' },
      { item: 'Previous-year Mayor’s Business Permit, billing assessment or official receipt', whereToSecure: 'Applicant records / Makati BPLO' },
      { item: 'Income Tax Return and Financial Statements for the preceding taxable year', whereToSecure: 'BIR / applicant records' },
      { item: 'Comprehensive General Liability Insurance, when applicable', whereToSecure: 'Insurance provider' },
      { item: 'Fire Safety Inspection Certificate for Business', whereToSecure: 'Bureau of Fire Protection' },
    ],
    steps: [
      'Complete the renewal section of the Makati business permit form.',
      'Prepare the prior permit/assessment, tax and financial records, insurance and FSIC.',
      'Submit to BPLO for assessment.',
      'Pay only through the official city payment channel indicated in the assessment.',
      'Claim or download the renewed permit.',
    ],
    fees: [{ label: 'Business taxes and regulatory fees', amount: 'Varies', note: 'Based on city assessment and declared gross sales/receipts.' }],
  },
  'food-handler-health-certificate': {
    verification: 'partial',
    sourceLabel: 'Makati Citizen’s Charter / Permits and Clearances guide',
    sourceUrl: 'https://www.makati.gov.ph/assets/uploads/downloads/2/481/pdf/Makati%20Citizen%27s%20Charter%20-%20FOR%20PRINT.pdf',
    lastVerified: checked,
    classification: 'Simple',
    transactionType: 'G2C',
    whoMayAvail: 'Food handlers working in food establishments.',
    requirements: [
      { item: 'Chest X-ray findings', whereToSecure: 'City-owned X-ray or private facility', note: 'Makati source documents differ on the stated validity period; confirm the current EHSD rule before applying.' },
      { item: 'Fecalysis / stool examination', whereToSecure: 'Makati Health Department or private laboratory', note: 'The city charter lists one-month validity.' },
      { item: 'Basic Food Safety and Environmental Health/Sanitation orientation or seminar', whereToSecure: 'Environmental Health Sanitation Division' },
      { item: 'Official receipt for the health certificate and Mayor’s Permit', whereToSecure: 'City payment counter / official payment channel' },
      { item: 'ID photo', whereToSecure: 'Applicant' },
    ],
    steps: [
      'Complete the required medical tests.',
      'Attend the required food-safety / environmental-health orientation.',
      'Pay the assessed city fees through the official channel.',
      'Submit the complete requirements to the Environmental Health Sanitation Division.',
      'Receive the health certificate after validation.',
    ],
    notes: ['BetterMakati flags the conflicting chest-X-ray validity stated in different Makati source documents instead of choosing one without confirmation.'],
  },
  'community-tax-certificate': {
    verification: 'verified',
    sourceLabel: 'Makati Citizen’s Charter — Payment of Community Tax (Individual)',
    sourceUrl: 'https://www.makati.gov.ph/assets/uploads/downloads/2/481/pdf/Makati%20Citizen%27s%20Charter%20-%20FOR%20PRINT.pdf',
    lastVerified: checked,
    classification: 'Simple',
    transactionType: 'G2C',
    whoMayAvail: 'Individuals subject to community tax; the charter lists property owners, administrators, authorized representatives and lessees.',
    requirements: [
      { item: 'Application Form', whereToSecure: 'Teller / receiving clerk' },
      { item: 'Identification card for student and/or non-working applicant', whereToSecure: 'Applicant' },
      { item: 'Income Tax Return for working applicant and/or applicant with business', whereToSecure: 'Applicant / BIR records' },
    ],
    steps: [
      'Fill out the community-tax application form and submit it to the teller.',
      'Pay the corresponding community tax.',
      'Receive the Community Tax Certificate.',
    ],
    fees: [
      { label: 'Basic community tax', amount: '₱5.00', note: 'For persons 18 years old and above under the cited city ordinance.' },
      { label: 'Additional community tax', amount: '₱1.00 per ₱1,000 of applicable income', note: 'Subject to the city ordinance formula and maximum additional community tax.' },
    ],
    processingTime: '1–2 minutes in the cited Citizen’s Charter after form submission, subject to queue and complete information.',
  },
  'marriage-license': {
    verification: 'verified',
    sourceLabel: 'Makati City Civil Registration Office — Issuance of Marriage License',
    sourceUrl: 'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/1602120937269.pdf',
    lastVerified: checked,
    classification: 'City civil-registry transaction',
    whoMayAvail: 'Couples applying for a marriage license in Makati, subject to residency and Family Code requirements.',
    requirements: [
      { item: 'Pre-Marriage Counseling Certificate', whereToSecure: 'DSWD-accredited pre-marriage counselor / Makati Social Welfare Department' },
      { item: 'Birth Certificate — PSA or LCR copy, or Baptismal Certificate', whereToSecure: 'PSA / Local Civil Registry / church, as applicable' },
      { item: 'PSA CENOMAR', whereToSecure: 'Philippine Statistics Authority' },
      { item: 'Barangay Certificate for Makati residents', whereToSecure: 'Barangay Hall' },
      { item: 'Valid ID', whereToSecure: 'Applicant' },
      { item: 'Community Tax Certificate (Cedula)', whereToSecure: 'City / authorized issuing office' },
      { item: 'Parental advice for applicants age 21 to below 25, with parent ID', whereToSecure: 'Parent / applicant' },
      { item: 'Parental consent for applicants age 18 to below 21, with parent ID', whereToSecure: 'Parent / applicant' },
      { item: 'Additional foreigner, annulment/divorce or widow/widower documents when applicable', whereToSecure: 'Embassy, courts, PSA or relevant issuing office' },
    ],
    steps: [
      'Secure the requirements checklist and payment order.',
      'Pay the pre-marriage counseling, marriage-license, application-form and filing fees.',
      'Attend the scheduled pre-marriage counseling and family-planning seminar.',
      'Both applicants complete and submit the marriage-license application and requirements.',
      'Appear for administration of oath when instructed.',
      'Wait through the statutory posting period.',
      'Present the claim slip and receive the marriage license.',
    ],
    fees: [
      { label: 'Pre-marriage counseling certificate', amount: '₱100.00' },
      { label: 'Marriage license fee', amount: '₱100.00' },
      { label: 'Application form', amount: '₱50.00' },
      { label: 'Filing fee', amount: '₱50.00' },
    ],
    processingTime: 'The cited CCRO guide states two weeks processing and a 10-day posting period.',
  },
  'yellow-card': {
    verification: 'partial',
    sourceLabel: 'Makati Health Plus Program Citizen’s Charter / application form',
    sourceUrl: 'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/1715048169416.pdf',
    lastVerified: checked,
    classification: 'Complex',
    transactionType: 'G2C',
    whoMayAvail: 'Qualified categories listed by Makati Health Plus, including registered Makati voters/residents and specified Makati/NGA employee and social-welfare categories.',
    requirements: [
      { item: 'Voter’s Certificate, when required for applicant category', whereToSecure: 'COMELEC Makati' },
      { item: 'Updated PhilHealth Member Data Record', whereToSecure: 'PhilHealth' },
      { item: 'Proof of PhilHealth payment/employment, when applicable', whereToSecure: 'PhilHealth / employer' },
      { item: 'Certificate of Live Birth for new applicants, when applicable', whereToSecure: 'PSA or Local Civil Registry' },
      { item: 'Marriage Certificate if married, for new applicants', whereToSecure: 'PSA or Local Civil Registry' },
      { item: 'Barangay Certificate for new applicants', whereToSecure: 'Barangay of residence' },
      { item: 'Additional documents for dependents, seniors, PWDs, relocatees or NGA employees as applicable', whereToSecure: 'Relevant issuing office' },
    ],
    steps: [
      'Identify the Makati Health Plus applicant category that applies to you.',
      'Prepare the category-specific requirements and current PhilHealth record.',
      'Submit the application through the current Makati Health Plus / Action Center channel.',
      'Complete any interview, validation or home-visit step required for the applicant category.',
      'Follow the official claim/release instruction for the card.',
    ],
    notes: ['Requirements vary substantially by applicant category; BetterMakati shows the common core and sends the user to the official checklist for category-specific documents.'],
  },
  'emergency-assistance': {
    verification: 'verified',
    sourceLabel: 'Makati Citizen’s Charter / national emergency hotline directory',
    sourceUrl: 'https://www.makati.gov.ph/assets/uploads/downloads/2/481/pdf/Makati%20Citizen%27s%20Charter%20-%20FOR%20PRINT.pdf',
    lastVerified: checked,
    whoMayAvail: 'Anyone reporting or needing emergency assistance in Makati.',
    requirements: [
      { item: 'Type of incident or assistance needed', whereToSecure: 'Caller / witness' },
      { item: 'Exact incident location and nearby landmark', whereToSecure: 'Caller / witness' },
      { item: 'A callback number when available', whereToSecure: 'Caller' },
      { item: 'Other details requested by the emergency call taker', whereToSecure: 'Caller / witness' },
    ],
    steps: [
      'For an immediate emergency, call 911.',
      'State the emergency and exact location first.',
      'Answer the call taker’s questions and follow safety instructions.',
      'Stay reachable for follow-up unless doing so would put you in danger.',
    ],
    fees: [{ label: 'Emergency hotline', amount: 'No application fee' }],
    processingTime: 'Emergency response is prioritized by incident and available responders rather than a standard transaction time.',
  },
  'makati-action-center': {
    verification: 'verified',
    sourceLabel: 'Makati Action Center Citizen’s Charter',
    sourceUrl: 'https://www.makati.gov.ph/assets/uploads/downloads/2/481/pdf/Makati%20Action%20Center.pdf',
    lastVerified: checked,
    whoMayAvail: 'Residents and other people raising a Makati city-service concern, feedback or complaint.',
    requirements: [
      { item: 'Clear description of the concern, request, feedback or complaint', whereToSecure: 'Citizen' },
      { item: 'Location, office or service involved when relevant', whereToSecure: 'Citizen' },
      { item: 'Contact information for coordination or follow-up when needed', whereToSecure: 'Citizen' },
      { item: 'Supporting details or records relevant to the concern, when applicable', whereToSecure: 'Citizen' },
    ],
    steps: [
      'Contact the Makati Action Center through the appropriate city contact point.',
      'Describe the concern and the city office, service or location involved.',
      'Provide supporting details needed for referral or coordination.',
      'Keep any reference or follow-up instruction provided by MAC.',
    ],
    fees: [{ label: 'Citizen concern / feedback coordination', amount: 'No application fee stated' }],
    notes: ['The Makati Action Center coordinates concerns with responsible city units; it does not replace emergency 911 response.'],
  },
  'real-property-tax': {
    verification: 'verified',
    sourceLabel: 'Makati Real Property Tax Division Citizen’s Charter',
    sourceUrl: 'https://www.makati.gov.ph/assets/uploads/downloads/2/481/pdf/Real%20Property%20Tax%20Division.pdf',
    lastVerified: checked,
    whoMayAvail: 'Property owners, administrators, authorized representatives and lessees identified by the Real Property Tax Division.',
    requirements: [
      { item: 'Previous realty-tax official receipts', whereToSecure: 'Taxpayer records / Real Property Tax Division' },
      { item: 'Notice of Assessment', whereToSecure: 'Makati Assessment Department' },
      { item: 'Tax Declaration', whereToSecure: 'Makati Assessment Department' },
    ],
    steps: [
      'Prepare the property records needed to identify the correct tax account.',
      'Have the Real Property Tax Division determine or confirm the current assessment.',
      'Pay only the amount shown through an official Makati payment channel.',
      'Keep the official receipt as proof of payment.',
    ],
    fees: [{ label: 'Real property tax due', amount: 'Varies by property assessment', note: 'BetterMakati does not calculate a taxpayer’s liability. The city assessment controls.' }],
    notes: ['Confirm current discounts, penalties and statutory payment deadlines with the city before acting.'],
  },
  'locational-clearance-building': {
    verification: 'partial',
    sourceLabel: 'Makati Permits and Clearances guide',
    sourceUrl: 'https://www.makati.gov.ph/assets/uploads/downloads/402/243/pdf/40207032015120611.pdf',
    lastVerified: checked,
    whoMayAvail: 'Applicants for covered building projects requiring zoning/locational review before building-permit issuance.',
    requirements: [
      { item: 'Accomplished and notarized application for locational clearance', whereToSecure: 'City zoning / Urban Development office' },
      { item: 'Barangay clearance', whereToSecure: 'Barangay Hall' },
      { item: 'Signed and sealed architectural plans', whereToSecure: 'Licensed design professional / applicant' },
      { item: 'Ownership documents and latest real-property-tax receipt if owner', whereToSecure: 'Owner / Registry of Deeds / city tax records' },
      { item: 'Lease and authorization documents if lessee', whereToSecure: 'Property owner / applicant' },
      { item: 'Completed building-permit application forms', whereToSecure: 'Office of the Building Official / city form' },
    ],
    steps: [
      'Prepare the project plans and ownership/lease documents.',
      'Secure barangay clearance and submit for locational/zoning clearance.',
      'Complete the building-permit forms and required technical plans.',
      'Follow the permitting office’s review sequence for the specific project.',
      'Complete additional technical, fire-safety or special-location requirements when applicable.',
    ],
    fees: [{ label: 'Clearance and permit fees', amount: 'Varies by project', note: 'Use the current official assessment for the specific project.' }],
    notes: ['Additional requirements depend on project type, property, zoning and location; the older permits guide is used as a source but the current permitting office controls.'],
  },
  'building-permit': {
    verification: 'partial',
    sourceLabel: 'Makati Permits and Clearances guide',
    sourceUrl: 'https://www.makati.gov.ph/assets/uploads/downloads/402/243/pdf/40207032015120611.pdf',
    lastVerified: checked,
    whoMayAvail: 'Owners or authorized applicants undertaking covered construction or building work in Makati.',
    requirements: [
      { item: 'Approved or applicable locational clearance before building-permit issuance', whereToSecure: 'City zoning / Urban Development office' },
      { item: 'Completed building-permit application forms', whereToSecure: 'Office of the Building Official' },
      { item: 'Signed and sealed architectural and required technical plans', whereToSecure: 'Licensed design professionals' },
      { item: 'Property ownership, lease or authorization documents applicable to the project', whereToSecure: 'Applicant / property owner / Registry of Deeds' },
      { item: 'Other ancillary permits and technical clearances required for the project', whereToSecure: 'Relevant city/BFP offices' },
    ],
    steps: [
      'Confirm zoning/locational requirements for the site.',
      'Prepare building and ancillary permit forms plus signed/sealed plans.',
      'Submit the complete project package to the Office of the Building Official.',
      'Respond to technical review comments and complete required inspections/clearances.',
      'Pay only the official project assessment and receive the issued permit before covered work begins.',
    ],
    fees: [{ label: 'Building and ancillary permit fees', amount: 'Varies by project', note: 'Computed from the applicable code/city assessment.' }],
    notes: ['Project-specific engineering, zoning, fire-safety and ownership requirements can materially change the checklist.'],
  },
  'umak-admissions': {
    verification: 'partial',
    sourceLabel: 'University of Makati Admissions',
    sourceUrl: 'https://www.umak.edu.ph/admissions/',
    lastVerified: checked,
    whoMayAvail: 'Applicants meeting the current UMak requirements for their applicant type and intended academic program.',
    requirements: [
      { item: 'Applicant information and records required for the current admission cycle', whereToSecure: 'Applicant / current school' },
      { item: 'Program- and applicant-type requirements published by UMak', whereToSecure: 'UMak Admissions' },
      { item: 'Any examination, interview or other admission step announced for the cycle', whereToSecure: 'UMak Admissions' },
    ],
    steps: [
      'Open the current UMak Admissions page and select the applicable applicant type.',
      'Check the requirements and schedule for the intended program.',
      'Complete the current UMak application instructions.',
      'Complete any required examination, interview or validation step.',
      'Check the official UMak admission-results channel when instructed.',
    ],
    fees: [{ label: 'Application / admission fees', amount: 'Check the current UMak notice', note: 'BetterMakati does not hard-code an academic-cycle fee that may change.' }],
    notes: ['Admission periods, program requirements and applicant categories change by academic cycle.'],
  },
  'umak-scholarships': {
    verification: 'partial',
    sourceLabel: 'University of Makati Scholarships and Grants',
    sourceUrl: 'https://www.umak.edu.ph/admissions/scholarships/',
    lastVerified: checked,
    whoMayAvail: 'UMak students who meet the eligibility rules of the applicable academic, achievement, special or sponsored scholarship.',
    requirements: [
      { item: 'Eligibility under the selected scholarship category', whereToSecure: 'UMak Scholarship Guidelines' },
      { item: 'Current scholarship documentary requirements', whereToSecure: 'UMak Scholarship Guidelines / applicant records' },
      { item: 'OLEA account for online submission when required by the scholarship process', whereToSecure: 'UMak' },
    ],
    steps: [
      'Identify the scholarship category that applies to you.',
      'Read the current UMak scholarship guidelines and eligibility rules.',
      'Prepare the documents required for that scholarship category.',
      'Submit through OLEA or the current official channel when instructed.',
      'Monitor the official UMak notice or student account for the result.',
    ],
    fees: [{ label: 'Scholarship application', amount: 'No separate fee stated on the referenced UMak guide' }],
    notes: ['UMak states incoming undergraduates receive an Academic Scholarship with tuition exemption upon admission; other scholarship categories follow their own rules.'],
  },

  'sss-sickness-benefit': {
    verification: 'verified',
    sourceLabel: 'SSS Sickness Benefit',
    sourceUrl: 'https://www.sss.gov.ph/sickness-benefit/',
    lastVerified: checked,
    whoMayAvail: 'Qualified SSS members unable to work due to sickness or injury.',
    requirements: [
      { item: 'At least four days of hospital or home confinement due to sickness or injury', whereToSecure: 'Medical provider / member records' },
      { item: 'At least three monthly contributions within the applicable 12-month period before the semester of sickness or injury', whereToSecure: 'My.SSS contribution record' },
      { item: 'Required sickness notification to employer or SSS, depending on membership status', whereToSecure: 'Employer / My.SSS / SSS channel' },
      { item: 'For employed members, current company sick leave with pay must generally have been used up, except for stated exceptions', whereToSecure: 'Employer' },
    ],
    steps: [
      'Check contribution eligibility in My.SSS.',
      'Notify the employer or SSS within the rules for your membership type.',
      'Prepare the medical and employment documents required for the claim.',
      'File through the current My.SSS/employer or SSS branch process indicated by SSS.',
    ],
    fees: [{ label: 'Application fee', amount: 'None stated by SSS' }],
  },
  'sss-maternity-benefit': {
    verification: 'verified',
    sourceLabel: 'SSS Maternity Benefit',
    sourceUrl: 'https://www.sss.gov.ph/maternity-benefit/',
    lastVerified: checked,
    whoMayAvail: 'Female SSS members who meet the contribution and notification rules for childbirth, miscarriage or emergency termination of pregnancy.',
    requirements: [
      { item: 'At least three monthly contributions in the applicable 12-month period before the semester of contingency', whereToSecure: 'My.SSS contribution record' },
      { item: 'Pregnancy notification to employer if employed, or directly to SSS for SE/VM/NWS/OFW members', whereToSecure: 'Employer / My.SSS / SSS Mobile App' },
      { item: 'Supporting birth, fetal-death or medical documents for the contingency', whereToSecure: 'LCR/PSA / hospital / physician, as applicable' },
      { item: 'Approved disbursement account where required', whereToSecure: 'My.SSS DAEM' },
    ],
    steps: [
      'Check contribution eligibility and submit maternity notification.',
      'Prepare the supporting civil-registry or medical documents for the contingency.',
      'File the Maternity Benefit Application online through My.SSS when applicable.',
      'Monitor the claim and disbursement through the official SSS channel.',
    ],
    processingTime: 'Filed online through My.SSS for covered claims; actual adjudication time depends on claim completeness and case type.',
  },
  'sss-retirement-benefit': {
    verification: 'verified',
    sourceLabel: 'SSS Retirement Benefit',
    sourceUrl: 'https://www.sss.gov.ph/retirement-benefit/',
    lastVerified: checked,
    whoMayAvail: 'SSS members who meet the age, employment-status and contribution rules for optional or technical retirement.',
    requirements: [
      { item: 'My.SSS account for online filing', whereToSecure: 'SSS website' },
      { item: 'Contribution record; 120 monthly contributions are required for a monthly pension', whereToSecure: 'My.SSS' },
      { item: 'UMID enrolled as ATM or approved DAEM disbursement account for online filing', whereToSecure: 'SSS / participating financial channel' },
      { item: 'Additional separation, guardianship, portability or other documents for special cases', whereToSecure: 'Employer / government issuing office, as applicable' },
    ],
    steps: [
      'Check age and contribution eligibility in My.SSS.',
      'Enroll or confirm the required disbursement account.',
      'File the retirement claim online if your case is eligible for online filing.',
      'Use an SSS branch for cases SSS lists as requiring over-the-counter filing.',
    ],
    fees: [{ label: 'Application fee', amount: 'None stated by SSS' }],
  },
  'pagibig-multi-purpose-loan': {
    verification: 'verified',
    sourceLabel: 'Pag-IBIG Multi-Purpose Loan Application Form V08 / STL checklist',
    sourceUrl: 'https://www.pagibigfund.gov.ph/document/pdf/dlforms/providentrelated/SLF065_MultiPurposeLoanApplicationForm_V08.pdf',
    lastVerified: checked,
    whoMayAvail: 'Pag-IBIG members meeting the current membership-savings, recent-contribution, account-standing and proof-of-income conditions.',
    requirements: [
      { item: 'At least 24 monthly membership savings, or equivalent savings under the Fund rules', whereToSecure: 'Pag-IBIG membership record' },
      { item: 'At least one membership saving within the last six months before application', whereToSecure: 'Pag-IBIG membership record' },
      { item: 'Existing Pag-IBIG housing, MPL or calamity loan accounts must not be in default', whereToSecure: 'Pag-IBIG account record' },
      { item: 'Multi-Purpose Loan Application Form', whereToSecure: 'Pag-IBIG website or branch' },
      { item: 'Valid ID acceptable to Pag-IBIG', whereToSecure: 'Government issuing office' },
      { item: 'Proof of income', whereToSecure: 'Employer / applicant financial records' },
    ],
    steps: [
      'Check your membership savings and existing Pag-IBIG loan standing.',
      'Complete the current MPL application form.',
      'Prepare the valid ID and proof-of-income documents for your employment type.',
      'Submit through the current Virtual Pag-IBIG or branch channel available for your case.',
      'Monitor approval and loan release through the official Pag-IBIG channel.',
    ],
    fees: [{ label: 'Interest', amount: '10.5% p.a. in the cited MPL form', note: 'Confirm the current rate before accepting the loan.' }],
    processingTime: 'Processing starts only upon submission of complete documents; actual release time varies by filing and validation channel.',
  },
  'pagibig-mp2': {
    verification: 'verified',
    sourceLabel: 'Pag-IBIG Modified Pag-IBIG II Enrollment Form V06',
    sourceUrl: 'https://www.pagibigfund.gov.ph/document/pdf/dlforms/providentrelated/PFF226_ModifiedPagIBIGIIEnrollmentForm_V06.pdf',
    lastVerified: checked,
    whoMayAvail: 'Active Pag-IBIG I members and specified former-member / former natural-born Filipino categories under the current MP2 rules.',
    requirements: [
      { item: 'Modified Pag-IBIG II Enrollment Form', whereToSecure: 'Pag-IBIG website or branch' },
      { item: 'Valid ID acceptable to Pag-IBIG', whereToSecure: 'Government issuing office' },
      { item: 'Additional citizenship/source-of-fund documents when applicable', whereToSecure: 'DFA / financial or property records' },
    ],
    steps: [
      'Confirm you are eligible for MP2 under the current membership rules.',
      'Enroll for an MP2 account through the official Pag-IBIG channel.',
      'Make the initial savings payment and keep the reference/receipt.',
      'Monitor the account through Virtual Pag-IBIG.',
    ],
    fees: [{ label: 'Minimum MP2 savings', amount: '₱500.00', note: 'The cited enrollment form states this as the minimum savings amount.' }],
    processingTime: 'Five-year membership term from the date of initial MP2 payment under the cited program terms.',
  },
  'philhealth-yakap': {
    verification: 'verified',
    sourceLabel: 'PhilHealth YAKAP / Member Portal clinic-registration guidance',
    sourceUrl: 'https://www.philhealth.gov.ph/yakap/',
    lastVerified: checked,
    whoMayAvail: 'PhilHealth members and qualified dependents covered by the YAKAP program.',
    requirements: [
      { item: 'PhilHealth Identification Number (PIN)', whereToSecure: 'PhilHealth' },
      { item: 'PhilHealth Member Portal account for online selection', whereToSecure: 'PhilHealth Member Portal' },
      { item: 'Updated member/dependent records', whereToSecure: 'PhilHealth' },
    ],
    steps: [
      'Update or register your PhilHealth membership and obtain your PIN.',
      'Log in to the PhilHealth Member Portal or use eGovPH / LHIO.',
      'Select “YAKAP Clinic” and search by province or city/municipality.',
      'Choose a clinic for the member and each dependent as needed.',
      'Schedule the First Patient Encounter with the selected clinic and complete the current empanelment requirements.',
      'Use the YAKAP clinic for follow-up consultations, covered diagnostics, laboratory services and prescriptions.',
    ],
    fees: [{ label: 'Clinic selection / empanelment', amount: 'No separate fee stated by PhilHealth' }],
    notes: ['PhilHealth states YAKAP includes primary-care consultations, selected laboratory/diagnostic services, medicines and cancer-screening benefits subject to current program rules.'],
  },
  'nbi-clearance': {
    verification: 'verified',
    sourceLabel: 'NBI — How to Apply for NBI Clearance / Citizen’s Charter',
    sourceUrl: 'https://nbi.gov.ph/how-to-apply-nbi-clearance/',
    lastVerified: checked,
    whoMayAvail: 'Applicants requiring NBI clearance for employment or other lawful purposes.',
    requirements: [
      { item: 'Online NBI clearance account/application', whereToSecure: 'NBI Clearance website' },
      { item: 'Valid government-issued ID selected during application', whereToSecure: 'Government issuing office' },
      { item: 'Reference number and proof of payment', whereToSecure: 'NBI online application / chosen payment channel' },
    ],
    steps: [
      'Register or sign in to the NBI Clearance online system.',
      'Apply for clearance and select the government ID you will present.',
      'Choose a branch and appointment schedule.',
      'Pay using an official payment option and save the reference number.',
      'Appear for biometric/image capture and releasing; applicants with a record hit follow NBI’s return/verification instruction.',
    ],
    fees: [{ label: 'Basic clearance fee', amount: '₱130.00', note: 'The current NBI how-to page states a ₱130 basic fee plus the applicable e-payment service charge; confirm the amount shown in your transaction.' }],
  },
  'nbi-first-time-jobseeker': {
    verification: 'verified',
    sourceLabel: 'NBI Citizen’s Charter — First Time Job Seekers',
    sourceUrl: 'https://nbi.gov.ph/citizens-charter/nbi-clearance-first-time-job-seekers/',
    lastVerified: checked,
    whoMayAvail: 'Qualified first-time jobseekers using the statutory first-time-jobseeker process.',
    requirements: [
      { item: 'Barangay Certification on official barangay letterhead, dry-sealed and signed by the Punong Barangay or authorized officer', whereToSecure: 'Barangay Hall' },
      { item: 'Two valid government-issued IDs or acceptable certificates', whereToSecure: 'Government issuing offices' },
      { item: 'Online first-time-jobseeker application', whereToSecure: 'NBI first-time-jobseeker portal' },
    ],
    steps: [
      'Secure the barangay first-time-jobseeker certification.',
      'Complete the NBI online first-time-jobseeker application.',
      'Proceed to the designated lane for biometrics and present the certification and IDs.',
      'Complete verification; applicants with a hit follow the scheduled verification/releasing process.',
      'Receive the printed NBI Clearance.',
    ],
    fees: [{ label: 'NBI clearance fee', amount: 'Free of charge', note: 'For qualified first-time jobseekers following the NBI Citizen’s Charter process.' }],
    processingTime: 'The NBI Citizen’s Charter lists about 2 minutes 15 seconds for a no-hit online applicant after reaching the processing lane, excluding queue and travel time.',
  },
  'national-police-clearance': {
    verification: 'partial',
    sourceLabel: 'PNP National Police Clearance System',
    sourceUrl: 'https://pnpclearance.ph/',
    lastVerified: checked,
    whoMayAvail: 'Applicants requiring a National Police Clearance.',
    requirements: [
      { item: 'NPCS account and online application', whereToSecure: 'PNP National Police Clearance System' },
      { item: 'Valid government-issued ID accepted by NPCS', whereToSecure: 'Government issuing office' },
      { item: 'Appointment/payment reference generated by NPCS', whereToSecure: 'PNP National Police Clearance System' },
    ],
    steps: [
      'Register or sign in to the National Police Clearance System.',
      'Complete the application, select a police station and appointment, and follow the official payment instruction.',
      'Appear at the selected station for identity verification and biometrics when required.',
      'Receive the clearance after the PNP database check and processing.',
    ],
    processingTime: 'The clearance is valid for six months according to the current NPCS information page.',
    notes: ['NPCS states renewal may be available without appearance for up to three years from the last appearance if its renewal conditions are met.'],
  },
  passport: {
    verification: 'partial',
    sourceLabel: 'DFA Passport Appointment System',
    sourceUrl: 'https://passport.gov.ph/',
    lastVerified: checked,
    whoMayAvail: 'Philippine citizens applying for a new or renewed passport, subject to DFA requirements.',
    requirements: [
      { item: 'Confirmed DFA passport appointment unless exempt under current DFA rules', whereToSecure: 'passport.gov.ph' },
      { item: 'Completed application and the civil-registry/identity documents required for the applicant type', whereToSecure: 'DFA / PSA / relevant government issuing office' },
      { item: 'Original supporting documents and photocopies as specified by DFA', whereToSecure: 'Applicant / issuing office' },
    ],
    steps: [
      'Read the current DFA requirement list for your applicant type.',
      'Schedule an appointment through passport.gov.ph.',
      'Prepare the exact original and photocopy requirements.',
      'Appear at the selected DFA consular site for document validation, biometrics and payment.',
      'Track and claim or receive the passport using the selected release method.',
    ],
    fees: [{ label: 'Passport fee', amount: 'See current DFA appointment/consular fee schedule', note: 'BetterMakati does not hard-code a fee that may vary by processing and site.' }],
  },
};

export const detailedServiceGuideIds = Object.keys(serviceGuideDetails);
export const detailedServiceGuideCount = detailedServiceGuideIds.length;
export const verifiedServiceGuideCount = Object.values(serviceGuideDetails).filter(
  item => item.verification === 'verified'
).length;
