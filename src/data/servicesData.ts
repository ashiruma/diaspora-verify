export interface ServiceCategoryDetail {
  id: string;
  slug: string;
  title: string;
  categoryCode: 'projects_assets' | 'purchases_vehicles' | 'business_support' | 'family_support' | 'custom_requests';
  tagline: string;
  shortDescription: string;
  overview: string;
  iconName: string;
  useCases: string[];
  included: string[];
  excluded: string[];
  evidenceDeliverables: string[];
  accessPermissionsRequired: string[];
  specialistRequirements: string;
  typicalWorkflow: { step: number; title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  disclaimer: string;
}

export const MASTER_SERVICES: ServiceCategoryDetail[] = [
  {
    id: 'projects-assets',
    slug: 'projects-assets',
    title: 'Projects and Assets',
    categoryCode: 'projects_assets',
    tagline: 'Objective physical progress and condition observations for property, construction and agriculture',
    shortDescription: 'Construction milestone observations, property condition checks, farming operations, and ongoing asset monitoring.',
    overview: 'Before releasing milestone payments or advancing funds to contractors, project managers, or caretakers, DiasporaVerify sends independent verifiers to physically visit the site, inspect tangible progress against your agreed brief, and capture dated, verifiable proof.',
    iconName: 'Building2',
    useCases: [
      'Construction progress checks (foundation, framing, lintel, roofing, plastering, finishes)',
      'Vacant land and boundary demarcation observations',
      'Rental property vacancy, maintenance condition and structural checks',
      'Agricultural and farming activity observations (crop health, livestock counts, input utilization)',
      'Heavy equipment and machinery storage or operation inspection'
    ],
    included: [
      'Physical on-site presence by a vetted local verifier',
      'Date-, time-, and GPS-stamped high-resolution photography and video walk-throughs',
      'Observation of active labor, delivered materials, and visible site state',
      'Comparison against client-supplied architectural drawings, bills of quantities, or milestone briefs',
      'Structured 4-state findings report (Observed, Partly Observed, Not Observed, Cannot Confirm)'
    ],
    excluded: [
      'Statutory engineering certifications or structural warranty sign-offs (requires licensed structural engineer)',
      'Legal title conveyance or judicial deed dispute representation (requires advocate)',
      'Direct physical construction management, contractor supervision or physical dispute mediation',
      'Approval of contractor variation claims without independent client review'
    ],
    evidenceDeliverables: [
      'Comprehensive dated photo gallery with GPS coordinate stamps',
      '360-degree site video walk-through with ambient commentary',
      'Standardized milestone checklist comparing visible progress to the client brief',
      'Written observations of stored materials, security condition, and weather impacts',
      'Formal QA Coordinator sign-off with clear statement of unverified items'
    ],
    accessPermissionsRequired: [
      'Explicit written authorization from the title holder or project owner',
      'Notification to the on-site foreman, caretaker, or gate security prior to visit',
      'Clear site entry instructions and emergency local contact number'
    ],
    specialistRequirements: 'Standard tasks are conducted by trained field verifiers. Where engineering calculations, soil mechanics, or statutory sign-offs are required, DiasporaVerify can coordinate with certified Kenya-registered engineers under separate terms.',
    typicalWorkflow: [
      { step: 1, title: 'Scope Definition', description: 'Client submits project details, milestone drawings, and specific items to observe.' },
      { step: 2, title: 'Access & Conflict Check', description: 'HQ checks agent neutrality, verifies site access, and confirms scope.' },
      { step: 3, title: 'Ground Inspection', description: 'Vetted verifier visits site, documents milestones, and captures telemetry.' },
      { step: 4, title: 'QA Audit Review', description: 'Coordinator cross-examines evidence against contractor claims to identify discrepancies.' },
      { step: 5, title: 'Client Decision', description: 'Client receives findings dossier to authorize contractor payments or request remediation.' }
    ],
    faqs: [
      {
        question: 'Can you tell me if my contractor is overcharging me?',
        answer: 'We provide objective physical observations of delivered materials and visible progress compared to your milestone agreement. We highlight physical discrepancies (e.g. contractor claims 100 bags of cement poured, but site shows unpoured slab), empowering you or your quantity surveyor to make informed financial decisions.'
      },
      {
        question: 'Do you inspect rural properties outside Nairobi?',
        answer: 'Our pilot began in the Nairobi Metropolitan Hub (Nairobi, Kiambu, Machakos, Kajiado) and is expanding to secondary hubs based on verified agent availability. Remote rural tasks are quoted individually based on feasibility.'
      }
    ],
    disclaimer: 'DiasporaVerify provides independent observation and documented factual evidence. We do not provide statutory engineering certifications or construction warranties.'
  },
  {
    id: 'purchases-vehicles',
    slug: 'purchases-vehicles',
    title: 'Purchases and Vehicles',
    categoryCode: 'purchases_vehicles',
    tagline: 'Physical verification of item existence, visible condition, vehicle identity and seller credibility',
    shortDescription: 'Product existence checks, vehicle viewing coordination, delivery confirmation, and maintenance follow-up.',
    overview: 'Before wiring significant purchase funds across borders to sellers, dealers, or individuals, ensure the vehicle or merchandise physically exists in the condition advertised. Our local verifiers confirm physical presence, inspect identifiers, and witness handovers.',
    iconName: 'Car',
    useCases: [
      'Vehicle pre-purchase physical inspection and VIN/chassis number verification',
      'Observation of visible bodywork, tires, interior condition, and starting state',
      'Equipment and commercial goods existence verification at supplier warehouses',
      'Delivery confirmation and physical receipt inspection on your behalf',
      'Garage repair progress observation for vehicles undergoing major maintenance'
    ],
    included: [
      'Physical visit to showroom, seller premises, warehouse, or repair garage',
      'Verification of visible serial numbers, VIN plates, and odometer readings',
      'Comprehensive exterior, interior, engine bay, and undercarriage photo package',
      'Observation of engine start, idle sound, and observable fluid leaks',
      'Confirmation that the seller has physical custody of the item'
    ],
    excluded: [
      'Disassembly of engine components, compression testing, or mechanical overhaul guarantees',
      'Official National Transport and Safety Authority (NTSA) logbook transfer processing (buyer must complete via TIMS/eCitizen)',
      'Handling cash payment for the vehicle or holding purchase funds in custody',
      'Guaranteeing clear title against undisclosed bank liens without official registry search'
    ],
    evidenceDeliverables: [
      'High-resolution photos of chassis number, engine number plate, and registration plates',
      'Short video of engine startup, idle, and exhaust appearance',
      'Detailed checklist of visible body scratches, dent repairs, tire tread depth, and cabin wear',
      'Receipt or delivery note photographs where applicable'
    ],
    accessPermissionsRequired: [
      'Seller or dealer consent for physical viewing and photography',
      'Seller contact name, physical showroom/yard address, and appointment window'
    ],
    specialistRequirements: 'Standard vehicle viewings provide cosmetic, identity, and visible running state evidence. For comprehensive mechanical diagnosis, we can coordinate with certified diagnostic mechanics upon request.',
    typicalWorkflow: [
      { step: 1, title: 'Item & Seller Details', description: 'Client provides vehicle listing URL, seller contact, and requested check items.' },
      { step: 2, title: 'Viewing Coordination', description: 'Coordinator contacts seller, confirms location, and schedules verification.' },
      { step: 3, title: 'Physical Inspection', description: 'Verifier photographs VIN, records startup video, and examines visible condition.' },
      { step: 4, title: 'Telemetry Check', description: 'HQ checks VIN legibility, matches photos to listing, and prepares report.' },
      { step: 5, title: 'Secure Report Delivery', description: 'Client reviews dated proof before negotiating price or transferring money.' }
    ],
    faqs: [
      {
        question: 'Can your verifier test-drive the vehicle on the highway?',
        answer: 'Verifiers can observe the seller driving or witness short yard maneuvers. For insurance and safety reasons, verifiers do not conduct high-speed highway test drives unless explicitly arranged with a licensed driver under authorized trade insurance.'
      },
      {
        question: 'Will DiasporaVerify transfer money to the seller for me?',
        answer: 'No. DiasporaVerify strictly separates verification service fees from third-party purchase monies. We provide independent observation so you can execute transactions securely through your own authorized banking channels.'
      }
    ],
    disclaimer: 'Vehicle viewings document physical existence, visible condition, and running state. They do not constitute formal mechanical warranties or legal ownership certification.'
  },
  {
    id: 'business-support',
    slug: 'business-support',
    title: 'Business Support',
    categoryCode: 'business_support',
    tagline: 'Independent premises visits, inventory spot-checks and operational reality verification',
    shortDescription: 'Premises visits, stock and operational observations, record comparison, and agreed follow-up actions.',
    overview: 'Ensure your business operations in Kenya are running as reported. DiasporaVerify conducts unannounced or scheduled visits to verify storefronts, stock levels, operational activity, and supplier commitments without local bias.',
    iconName: 'Briefcase',
    useCases: [
      'Retail shop, kiosk, or branch office operational existence and activity checks',
      'Physical stock counts and inventory spot-checks against supplied ledgers',
      'Verification of business premises physical signage, operating hours, and customer footfall',
      'Follow-up visits with suppliers, distribution agents, or local municipal offices',
      'Observation of tenant occupancy and commercial property operations'
    ],
    included: [
      'On-site presence at commercial premises or warehouse',
      'Observation of active staffing, open trading hours, and observable customer interaction',
      'Sample physical count of agreed high-value stock items',
      'Photographing of physical logbooks, stock registers, and utility meters upon authorization',
      'Comparison between client-supplied inventory records and physical shelf reality'
    ],
    excluded: [
      'Statutory financial audits, certified accounting reviews, or tax filings (requires ICPAK certified accountant)',
      'Arbitration of commercial partnership disputes or debt collection enforcement',
      'Covert surveillance or lawful intercept operations',
      'Legal contract enforcement or direct managerial intervention'
    ],
    evidenceDeliverables: [
      'Dated photos of business exterior, signage, interior floor, and active stock shelves',
      'Stock tally checklist matching sample counts against client inventory expectations',
      'Summary of observed staff presence and customer activity during the visit window',
      'Discrepancy report detailing missing, damaged, or unrecorded merchandise'
    ],
    accessPermissionsRequired: [
      'Business owner authorization and manager notification where applicable',
      'Clear definition of permissible inspection areas (public front vs back-office inventory)'
    ],
    specialistRequirements: 'Standard business spot-checks are executed by trained business verifiers. Specialized accounting or inventory reconciliation can be paired with certified local accountants.',
    typicalWorkflow: [
      { step: 1, title: 'Brief Submission', description: 'Client outlines business location, operating expectations, and stock items to check.' },
      { step: 2, title: 'Visit Planning', description: 'Coordinator sets observation window and prepares tailored inventory checklist.' },
      { step: 3, title: 'Premises Visit', description: 'Verifier documents open trading, observes operations, and counts target stock.' },
      { step: 4, title: 'Discrepancy Analysis', description: 'HQ checks physical tallies against client ledgers and notes unverified areas.' },
      { step: 5, title: 'Executive Delivery', description: 'Client receives findings report with high-res photos and recommended next steps.' }
    ],
    faqs: [
      {
        question: 'Can you do a surprise spot-check on my shop manager?',
        answer: 'We can perform observations during standard business operating hours. However, verifiers must operate lawfully without trespassing or confrontation. Verifiers present client authorization if access to non-public storage rooms is required.'
      },
      {
        question: 'Do you verify business registration documents with the Registrar of Companies (BRS)?',
        answer: 'We physically verify the premises, signage, and trading reality. Official company registry records can be paired with eCitizen search documentation upon request.'
      }
    ],
    disclaimer: 'Business support observations document physical operations and visible inventory. They do not constitute statutory audit or tax advisory opinions.'
  },
  {
    id: 'family-support',
    slug: 'family-support',
    title: 'Family Support',
    categoryCode: 'family_support',
    tagline: 'Compassionate, respectful authorized welfare visits, errand coordination and verified family updates',
    shortDescription: 'Authorized welfare visits, appointment coordination, errands, and objective family wellbeing updates.',
    overview: 'Caring for aging parents or vulnerable relatives from thousands of miles away is emotionally taxing. DiasporaVerify provides respectful, authorized visits by mature, vetted local coordinators to check on home conditions, accompany relatives to appointments, or confirm grocery and medicine deliveries.',
    iconName: 'HeartHandshake',
    useCases: [
      'Authorized visits to elderly parents or relatives in their homes',
      'Home environment observation (water, electricity, cleanliness, security, food supply)',
      'Escorting or coordinating transport for scheduled medical clinic or hospital appointments',
      'Verification that purchased care, medication, or home nursing services are physically provided',
      'Delivering essential household supplies or coordinating minor home repairs'
    ],
    included: [
      'Visits by vetted, background-checked, empathetic welfare coordinators',
      'Respectful, consensual conversation and observation of immediate living conditions',
      'Written notes on apparent physical comfort, accessibility, and caregiver presence',
      'Dated photo updates taken with explicit recipient consent',
      'Immediate escalation to client if critical welfare or safety concerns are observed'
    ],
    excluded: [
      'Emergency 999/medical ambulance rescue services (clients must direct emergencies to standard emergency response)',
      'Administering medical treatments, prescription diagnoses, or direct clinical nursing care',
      'Intervention in contested family custody, matrimonial disputes, or inheritance conflicts',
      'Non-consensual visits where the recipient explicitly refuses entry'
    ],
    evidenceDeliverables: [
      'Compassionate, detailed written update describing the visit and conversation',
      'Consensual photographs of living spaces, garden, or recent home improvements',
      'Care checklist (food in pantry, working utilities, upcoming appointment dates)',
      'Receipts for any client-authorized errand expenses or medicine purchases'
    ],
    accessPermissionsRequired: [
      'Explicit recipient knowledge and consent prior to visit (no unannounced intrusions)',
      'Family relationship context and emergency contact details',
      'Caregiver or compound contact information where applicable'
    ],
    specialistRequirements: 'All family welfare personnel undergo enhanced safeguarding background checks and code-of-conduct training. Professional medical care is coordinated through licensed local healthcare clinics.',
    typicalWorkflow: [
      { step: 1, title: 'Consent & Planning', description: 'Client outlines family situation, recipient expectations, and goals of visit.' },
      { step: 2, title: 'Recipient Contact', description: 'Coordinator introduces DiasporaVerify to recipient respectfully and confirms convenient time.' },
      { step: 3, title: 'Welfare Visit', description: 'Vetted coordinator visits, spends agreed time, checks environment, and assists.' },
      { step: 4, title: 'Safeguarding Review', description: 'Coordinator reviews notes to ensure dignity, privacy, and accuracy.' },
      { step: 5, title: 'Family Delivery', description: 'Client receives thoughtful, clear update detailing findings and recommended care steps.' }
    ],
    faqs: [
      {
        question: 'What if my parent refuses to let the coordinator in?',
        answer: 'We never force entry or cause distress. If a family member declines a visit, the coordinator respectfully withdraws, documents the interaction, and notifies you immediately so you can speak with your loved one.'
      },
      {
        question: 'Can your team pick up prescription medications?',
        answer: 'Yes, if you or the doctor provide an authorized pharmacy prescription and payment is authorized in advance. Verifiers collect medicines from licensed pharmacies and deliver them with receipts.'
      }
    ],
    disclaimer: 'Family support visits are non-clinical welfare observations conducted with recipient consent. DiasporaVerify does not provide emergency medical rescue or clinical healthcare.'
  },
  {
    id: 'custom-requests',
    slug: 'custom-requests',
    title: 'Custom Requests',
    categoryCode: 'custom_requests',
    tagline: 'Tailored, lawful on-ground tasks evaluated individually for feasibility, safety and clear deliverables',
    shortDescription: 'Unique lawful local tasks considered individually after feasibility, access, scope, and risk review.',
    overview: 'Have a requirement that does not fit neatly into standard categories? From verifying university certificate records to inspecting event venues or checking supply chain hubs, we evaluate bespoke requests against rigorous safety, legality, and feasibility standards.',
    iconName: 'Compass',
    useCases: [
      'Event venue and facility inspection prior to booking or catering deposits',
      'Education or training institution accreditation and campus existence checks',
      'Locating and photographing public infrastructure, road access, or utility connections',
      'Checking regional distribution depots or cooperative society offices',
      'Bespoke due diligence for diaspora investment syndicates'
    ],
    included: [
      'Comprehensive feasibility review by Senior Operations Coordinator',
      'Tailored terms of reference, custom checklist, and agreed deliverable criteria',
      'Assignment of verifier with matched regional and situational background',
      'High-resolution photographic, video, and audio evidence where legally permissible',
      'Final executive memorandum detailing observations, findings, and remaining uncertainties'
    ],
    excluded: [
      'Any activity that violates the Constitution or Laws of Kenya',
      'Surveillance of private individuals, private investigator work, or domestic espionage',
      'Bribery, facilitation payments, or unlawful inducement of public officers',
      'Physical dispute intervention or personal security guard services'
    ],
    evidenceDeliverables: [
      'Customized evidence portfolio according to the approved task brief',
      'Primary source documents, stamped receipts, and official communications obtained lawfully',
      'Executive summary with transparent declaration of scope boundaries'
    ],
    accessPermissionsRequired: [
      'Documented legal authority to conduct the requested observation',
      'Clear site or institution access protocols'
    ],
    specialistRequirements: 'Evaluated case-by-case. When specialized expertise is needed, we incorporate qualified local consultants under unified project governance.',
    typicalWorkflow: [
      { step: 1, title: 'Custom Intake', description: 'Client submits detailed brief, desired deliverables, and deadline constraints.' },
      { step: 2, title: 'Feasibility & Risk Audit', description: 'Operations Coordinator evaluates legality, safety, access, and pricing.' },
      { step: 3, title: 'Itemized Quote', description: 'Client receives transparent proposal detailing deliverables and exclusions.' },
      { step: 4, title: 'Controlled Execution', description: 'Approved task is carried out under active HQ monitoring.' },
      { step: 5, title: 'Dossier Closure', description: 'Structured report delivered with comprehensive evidence audit.' }
    ],
    faqs: [
      {
        question: 'How quickly do you review custom request feasibility?',
        answer: 'Our operations desk reviews custom requests within 24 hours on business days, providing either a clear quote with scope limitations or an explanation of why the task cannot be accepted.'
      },
      {
        question: 'Are custom requests kept strictly confidential?',
        answer: 'Yes. All client details, briefings, and evidence are protected under strict non-disclosure obligations and Kenya Data Protection Act compliance.'
      }
    ],
    disclaimer: 'All custom requests must comply strictly with the Laws of Kenya and DiasporaVerify safety standards. We do not accept investigative, covert, or high-risk tasks.'
  }
];

export function getServiceBySlug(slug: string): ServiceCategoryDetail | undefined {
  return MASTER_SERVICES.find(s => s.slug === slug || s.id === slug);
}
