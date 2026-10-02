import type { VerificationRequest, FieldAgent } from '../types';

export const MOCK_AGENTS: FieldAgent[] = [
  {
    id: 'agt-01',
    name: 'Evans Kiptoo',
    phone: '+254 722 419 802',
    email: 'evans.kiptoo@diasporaverify.co.ke',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    badgeLevel: 'Construction Specialist',
    primaryCounties: ['Nairobi', 'Kajiado', 'Machakos', 'Kiambu'],
    totalInspections: 84,
    rating: 4.9,
    conflictClearanceSigned: true,
    specialties: ['Structural Masonry', 'Reinforced Concrete', 'Material Audits', 'Contractor Reconciliation'],
  },
  {
    id: 'agt-02',
    name: 'Grace Njeri Mwangi',
    phone: '+254 714 832 109',
    email: 'grace.njeri@diasporaverify.co.ke',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    badgeLevel: 'Senior Ground Verifier',
    primaryCounties: ['Nairobi', 'Machakos', 'Murang\'a', 'Kiambu'],
    totalInspections: 112,
    rating: 5.0,
    conflictClearanceSigned: true,
    specialties: ['Land Registry Liaison', 'Beacon & Boundary Verification', 'Property Condition Surveys'],
  },
  {
    id: 'agt-03',
    name: 'Dr. Sharon Chemutai',
    phone: '+254 733 912 405',
    email: 'sharon.chemutai@diasporaverify.co.ke',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813576-0c9f13197607?w=150&auto=format&fit=crop&q=80',
    badgeLevel: 'Welfare & Care Coordinator',
    primaryCounties: ['Uasin Gishu', 'Nandi', 'Nakuru', 'Kisumu'],
    totalInspections: 67,
    rating: 4.95,
    conflictClearanceSigned: true,
    specialties: ['Elderly Wellbeing Audits', 'Clinical Appointment Accompaniment', 'Medication Stock Tracking', 'Safeguarding'],
  },
  {
    id: 'agt-04',
    name: 'Joseph Ochieng',
    phone: '+254 721 556 771',
    email: 'joseph.ochieng@diasporaverify.co.ke',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    badgeLevel: 'Agricultural Inspector',
    primaryCounties: ['Murang\'a', 'Kiambu', 'Kirinyaga', 'Nakuru'],
    totalInspections: 53,
    rating: 4.85,
    conflictClearanceSigned: true,
    specialties: ['Crop Vitality Audits', 'Irrigation Infrastructure', 'Farm Input Verification', 'Livestock Counts'],
  },
  {
    id: 'agt-05',
    name: 'Patrick Mutua',
    phone: '+254 729 330 198',
    email: 'patrick.mutua@diasporaverify.co.ke',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    badgeLevel: 'Senior Ground Verifier',
    primaryCounties: ['Mombasa', 'Kilifi', 'Kwale'],
    totalInspections: 78,
    rating: 4.88,
    conflictClearanceSigned: true,
    specialties: ['Automotive Physical Inspection', 'NTSA & Port Yard Clearances', 'Chassis & Engine Verification'],
  }
];

export const MOCK_REQUESTS: VerificationRequest[] = [
  {
    id: 'DV-2026-KJD-0104',
    title: 'Kitengela 4-Bed Bungalow — Milestone 3: Lintel Beam & Slab Casting Verification',
    category: 'construction',
    offerType: 'follow-through',
    stage: 'decide',
    status: 'partly_observed',
    urgency: 'priority',
    client: {
      name: 'David Mwangi',
      locationAbroad: 'London, United Kingdom',
      email: 'david.mwangi.uk@gmail.com',
      phone: '+44 7700 900142',
      preferredCurrency: 'KES',
    },
    location: {
      county: 'Kajiado',
      town: 'Kitengela (Acacia Area, Plot 42/B)',
      landmark: 'Near Acacia Crest Academy, 1.2km off Namanga Road',
      gpsCoords: '-1.4892, 36.9583',
    },
    contactOnGround: {
      name: 'Peter Kariuki (Site Foreman / General Contractor)',
      role: 'Head Contractor',
      phone: '+254 720 188 349',
      accessConfirmed: true,
      notes: 'Foreman present during inspection. Was initially hesitant to open locked cement store.',
    },
    assignedAgent: MOCK_AGENTS[0], // Evans Kiptoo
    conflictOfInterestCheck: {
      checked: true,
      agentHasRelationToSite: false,
      notes: 'Agent has zero commercial or familial relationship with contractor Peter Kariuki or landowner David Mwangi.',
    },
    scopeBrief: 'Verify physical completion of Milestone 3: ring beam reinforcement (lintel level) and first-floor suspended slab formwork before authorizing requested KES 450,000 contractor milestone payment. Reconcile delivered cement bags with receipts.',
    deliverables: [
      'Side-by-side repeat angle photos (Lintel beam, columns, slab props)',
      'Video walkthrough with site foreman audio interview',
      'Inventory count of 32.5R cement bags in site store',
      'Discrepancy statement comparing invoice vs physical work',
      'Payment Decision Record with recommendations'
    ],
    explicitLimitations: [
      'Visual observation only: Not a certified structural engineering sign-off.',
      'DiasporaVerify does not hold client funds or manage the contractor.',
      'A photo is evidence of what it shows, not proof of concrete compression strength or sub-surface rebar tensile capacity.'
    ],
    documentsProvided: [
      { id: 'doc-01', name: 'Approved_Architectural_Floor_Plan_Bungalow.pdf', type: 'Architectural Plan', uploadDate: '2026-08-14', sizeKb: 3420 },
      { id: 'doc-02', name: 'Contractor_Milestone_Schedule_Contract.pdf', type: 'Construction Contract', uploadDate: '2026-08-14', sizeKb: 1180 },
      { id: 'doc-03', name: 'Milestone_3_Payment_Invoice_KES450k.pdf', type: 'Contractor Invoice', uploadDate: '2026-09-26', sizeKb: 450 }
    ],
    pricing: {
      serviceFeeKES: 14500,
      currency: 'KES',
      quoteStatus: 'paid',
    },
    paymentDecisionRecord: {
      milestoneTitle: 'Milestone 3: Lintel Beam & Slab Formwork / Casting',
      contractorRequestedKES: 450000,
      previousPaymentsKES: 1250000,
      receiptsProvidedKES: 150000,
      unexplainedVarianceKES: 300000,
      coordinatorRecommendation: 'CRITICAL DISCREPANCY DETECTED. Formwork is only 40% complete and rebar tie is incomplete. Contractor billed full 100% completion (KES 450,000). 80 bags of cement billed (KES 68,000) could not be found in the store or reconciled. Recommended action: PAUSE full payment immediately. Release at most KES 150,000 for verified materials upon receipt verification.',
      stopPaymentAlert: true,
      decisionStatus: 'pending',
      history: [
        {
          action: 'Milestone Invoice Submitted by Contractor',
          note: 'Contractor requested KES 450,000 claiming slab casting was ready for pour.',
          date: '2026-09-26 10:14 EAT',
          by: 'Contractor Portal',
        },
        {
          action: 'Site Verification Visit Executed',
          note: 'Inspector Evans Kiptoo conducted physical audit and recorded discrepancies.',
          date: '2026-09-28 14:30 EAT',
          by: 'Evans Kiptoo (Field Agent)',
        },
        {
          action: 'QA Review Flagged Discrepancy & Issued Stop Payment Notice',
          note: 'Coordinator flagged KES 300,000 overbilling and missing cement stock.',
          date: '2026-09-29 09:45 EAT',
          by: 'QA Operations Desk',
        }
      ]
    },
    milestones: [
      {
        id: 'ms-01',
        stageNumber: 1,
        title: 'Milestone 1: Substructure & Foundation Strip Footing',
        description: 'Excavation to firm ground, blinding concrete, strip footing, hardcore filling, damp-proof membrane.',
        agreedAmountKES: 650000,
        stageStatus: 'completed',
        verificationStatus: 'observed',
        targetDate: '2026-07-20',
        inspectedDate: '2026-07-22',
      },
      {
        id: 'ms-02',
        stageNumber: 2,
        title: 'Milestone 2: Wall Superstructure (Ground Floor to Lintel Base)',
        description: 'Machine-cut stone masonry walls up to 2.8m height, window openings dressed, door frames fixed.',
        agreedAmountKES: 600000,
        stageStatus: 'completed',
        verificationStatus: 'observed',
        targetDate: '2026-08-30',
        inspectedDate: '2026-09-02',
      },
      {
        id: 'ms-03',
        stageNumber: 3,
        title: 'Milestone 3: Lintel Ring Beam & Suspended Slab Formwork',
        description: 'Rebar tie Y12/Y10, timber formwork shuttering, BRC mesh, electrical conduits lay, ready for concrete casting.',
        agreedAmountKES: 450000,
        stageStatus: 'disputed',
        verificationStatus: 'partly_observed',
        targetDate: '2026-09-26',
        inspectedDate: '2026-09-28',
      },
      {
        id: 'ms-04',
        stageNumber: 4,
        title: 'Milestone 4: Timber Roof Trusses & Decra Tile Covering',
        description: 'Treated cypress timber trusses, fascia boards, underlay insulation, stone-coated metal roofing tiles.',
        agreedAmountKES: 550000,
        stageStatus: 'upcoming',
        targetDate: '2026-11-15',
      },
      {
        id: 'ms-05',
        stageNumber: 5,
        title: 'Milestone 5: Plaster, Plumbing & Internal Finishes',
        description: 'Cement screed plastering, conduit wiring pull, tile installation, sanitary fittings.',
        agreedAmountKES: 700000,
        stageStatus: 'upcoming',
        targetDate: '2027-01-20',
      }
    ],
    checklist: [
      { id: 'chk-01', label: 'Verify physical presence on registered plot coordinates', completed: true, status: 'passed', notes: 'GPS confirmed -1.4892, 36.9583 matching title deed beacon map.', verifiedAt: '14:15 EAT' },
      { id: 'chk-02', label: 'Confirm lintel ring beam rebar tie specifications (Y12 & Y10)', completed: true, status: 'passed', notes: 'Rebar tied along 85% of perimeter. Stirrups spaced at 150mm as specified in structural drawings.', verifiedAt: '14:40 EAT' },
      { id: 'chk-03', label: 'Verify slab timber shuttering & props installation', completed: true, status: 'flagged', notes: 'DISCREPANCY: Shuttering boards installed on lounge only (~40% of total floor area). Timber props missing in bedrooms 2 and 3.', verifiedAt: '15:05 EAT' },
      { id: 'chk-04', label: 'Physical count of 32.5R Cement bags in on-site store', completed: true, status: 'flagged', notes: 'Foreman claimed 120 bags purchased with client funds. Counted only 40 bags in store. 80 bags unaccounted for.', verifiedAt: '15:25 EAT' },
      { id: 'chk-05', label: 'Record access restrictions or foreman objections', completed: true, status: 'passed', notes: 'Foreman Peter initially objected to photos of the empty store; complied after coordinator phone call.', verifiedAt: '15:40 EAT' }
    ],
    evidence: [
      {
        id: 'ev-01',
        type: 'photo',
        title: 'North Elevation — Lintel Beam Level',
        description: 'Front view showing lintel beam rebar cage tied. Noticeable absence of slab formwork props on eastern wing.',
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=800&auto=format&fit=crop&q=80',
        timestamp: '2026-09-28 14:32 EAT',
        locationTag: 'Acacia Plot 42/B, Kitengela',
        gpsCoords: '-1.4892, 36.9583',
        cameraAngle: 'Repeat Camera Angle 1 (North-East Perimeter)',
        verifiedByAgentId: 'agt-01',
        tags: ['Structure', 'Lintel Beam', 'Rebar']
      },
      {
        id: 'ev-02',
        type: 'photo',
        title: 'Interior View — Slab Shuttering Incomplete',
        description: 'Timber props and plywood boards placed in main lounge only. Bedrooms remain open to sky with no formwork erected.',
        url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80',
        timestamp: '2026-09-28 14:50 EAT',
        locationTag: 'Interior Lounge / Bedroom Corridor',
        gpsCoords: '-1.4893, 36.9584',
        cameraAngle: 'Repeat Camera Angle 2 (Central Corridor to Lounge)',
        verifiedByAgentId: 'agt-01',
        tags: ['Formwork', 'Shuttering', 'Discrepancy']
      },
      {
        id: 'ev-03',
        type: 'photo',
        title: 'Cement Storage Audit — 40 Bags Present',
        description: 'Physical count in secure site shed shows 40 bags of Simba 32.5R cement. Invoice billed 120 bags.',
        url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80',
        timestamp: '2026-09-28 15:20 EAT',
        locationTag: 'Material Store Shed',
        gpsCoords: '-1.4891, 36.9582',
        cameraAngle: 'Storage Shed Interior',
        verifiedByAgentId: 'agt-01',
        tags: ['Materials', 'Cement', 'Audit', 'Discrepancy']
      },
      {
        id: 'ev-04',
        type: 'video',
        title: 'Full Site Walkthrough & Foreman Peter Interview',
        description: '4m 12s video showing complete perimeter walk, elevation scans, and interview discussing formwork timeline.',
        url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&auto=format&fit=crop&q=80',
        timestamp: '2026-09-28 15:45 EAT',
        locationTag: 'Kitengela Site Grounds',
        gpsCoords: '-1.4892, 36.9583',
        verifiedByAgentId: 'agt-01',
        tags: ['Video', 'Foreman Interview', 'Walkthrough']
      }
    ],
    photoComparisons: [
      {
        id: 'cmp-01',
        angleName: 'Camera Angle A: North-East Perimeter Elevation',
        previousDate: '2026-09-02 (Milestone 2 Signoff)',
        previousStageTitle: 'Stage 2: Wall Masonry (Completed)',
        previousPhotoUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
        currentDate: '2026-09-28 (Milestone 3 Inspection)',
        currentStageTitle: 'Stage 3: Current Visit',
        currentPhotoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=800&auto=format&fit=crop&q=80',
        observedDifference: 'Walls have reached 2.8m lintel height. Timber shuttering sideboards installed on top course; rebar cage visible. No concrete has been poured.',
        statusMatch: 'as_expected'
      },
      {
        id: 'cmp-02',
        angleName: 'Camera Angle B: Main Lounge Overhead Ceiling / Slab Props',
        previousDate: '2026-09-02 (Milestone 2 Signoff)',
        previousStageTitle: 'Stage 2: Open Ceiling Cavity',
        previousPhotoUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
        currentDate: '2026-09-28 (Milestone 3 Inspection)',
        currentStageTitle: 'Stage 3: Claimed 100% Shuttered Slab',
        currentPhotoUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80',
        observedDifference: 'Contractor claimed 100% shuttered and propped ready for concrete pump. Observation: Only 40% shuttered. Remaining 60% of slab area has zero timber decking or props in place.',
        statusMatch: 'discrepancy'
      },
      {
        id: 'cmp-03',
        angleName: 'Camera Angle C: Material Storage Shed & Cement Reserve',
        previousDate: '2026-09-02 (Milestone 2 Signoff)',
        previousStageTitle: 'Stage 2: Residual 15 Bags',
        previousPhotoUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=80',
        currentDate: '2026-09-28 (Milestone 3 Inspection)',
        currentStageTitle: 'Stage 3: Billed 120 Bags',
        currentPhotoUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80',
        observedDifference: 'Invoice claimed 120 bags delivered for slab casting. Physical audit counted only 40 bags. Discrepancy of 80 missing bags (value ~KES 68,000).',
        statusMatch: 'discrepancy'
      }
    ],
    videoInspectionMarkers: [
      { timestamp: '00:24', title: 'Perimeter Access & Aggregate Pile', note: 'Ballast and quarry dust delivered on roadside; ballast volume approx 15 tonnes.', severity: 'info' },
      { timestamp: '01:12', title: 'Lintel Rebar Inspection', note: 'Confirmed 4-bar Y12 rebar cage with stirrups. Quality of tie wire is acceptable.', severity: 'info' },
      { timestamp: '02:08', title: 'Critical Discrepancy: Bedroom Formwork Missing', note: 'Camera pans to Bedroom 2 & Master. Zero timber decking installed despite billing 100%.', severity: 'alert' },
      { timestamp: '03:35', title: 'Interview with Foreman Peter', note: 'Foreman admits supplier delayed delivery of Marine Plywood and remaining 80 cement bags.', severity: 'warning' }
    ],
    qaReview: {
      reviewedBy: 'Amara Kiprotich (Chief Operations Coordinator, Nairobi HQ)',
      reviewedAt: '2026-09-29 09:45 EAT',
      findingsSummary: 'Milestone 3 is only PARTIALLY COMPLETE (approx 42% physical progress). Contractor invoice of KES 450,000 is premature and overstates completed works by at least KES 300,000. 80 bags of cement are missing from on-site storage.',
      contradictions: [
        'Contractor claim: "Slab fully shuttered and ready for concrete casting"',
        'Observation: 60% of ceiling space has zero timber decking or props',
        'Invoice item: 120 bags 32.5R cement billed; only 40 bags physically in store'
      ],
      whatCouldNotBeVerified: [
        'Whether missing 80 bags are held at hardware supplier warehouse or were diverted',
        'Tensile yield of unbranded rebar bars without laboratory mill certificate'
      ],
      recommendation: 'PAUSE full payment of KES 450,000. Authorize maximum of KES 150,000 for verified materials ONLY after contractor produces delivery note for remaining cement. Advise repeat inspection before concrete pour.',
      stopPaymentTriggered: true,
      publishedToClient: true,
    },
    createdAt: '2026-09-25 18:30:00',
    updatedAt: '2026-09-29 10:15:00',
    scheduledVisitDate: '2026-09-28',
    completedDate: '2026-09-29',
  },
  {
    id: 'DV-2026-MCK-0219',
    title: 'Konza Technopolis Buffer Zone — 50x100 Plot Pre-Purchase Land Verification',
    category: 'property',
    offerType: 'one-time',
    stage: 'review',
    status: 'cannot_confirm',
    urgency: 'standard',
    client: {
      name: 'Faith Chebet',
      locationAbroad: 'Dallas, Texas, USA',
      email: 'faith.chebet@txhealth.org',
      phone: '+1 214 555 0192',
      preferredCurrency: 'USD',
    },
    location: {
      county: 'Machakos',
      town: 'Konza Buffer Zone (Off Malili Road)',
      landmark: '3.4km from Konza Technopolis Main Gate, near Ilpolosat Hills',
      gpsCoords: '-1.7144, 37.1982',
    },
    contactOnGround: {
      name: 'Musa Muthama (Land Agent for "Savannah Ridge Properties")',
      role: 'Selling Agent',
      phone: '+254 722 990 114',
      accessConfirmed: true,
      notes: 'Seller claimed plot is fully fenced, beaconed, with electricity adjacent.',
    },
    assignedAgent: MOCK_AGENTS[1], // Grace Njeri Mwangi
    conflictOfInterestCheck: {
      checked: true,
      agentHasRelationToSite: false,
      notes: 'No relation to selling firm or buyer.',
    },
    scopeBrief: 'Inspect 50x100 residential plot (Title No. MACHAKOS/MALILI/4198). Confirm presence of corner beacons, physical fencing, access road condition, and adjacent power line as claimed in seller marketing brochure before client sends USD $4,500 purchase deposit.',
    deliverables: [
      'Beacon discovery and GPS coordinates verification',
      'Fencing and physical boundary condition photos',
      'Neighbor and local elder confirmation of ownership disputes',
      'Road access and utility proximity report'
    ],
    explicitLimitations: [
      'Visual ground check only: Does not substitute for an official Ministry of Lands Registry search or a licensed Land Surveyor beacon certificate.',
      'A photo proves ground visibility, not legal ownership.'
    ],
    documentsProvided: [
      { id: 'doc-11', name: 'Seller_Marketing_Brochure_Savannah_Ridge.pdf', type: 'Brochure', uploadDate: '2026-09-20', sizeKb: 2100 },
      { id: 'doc-12', name: 'Green_Card_Mutation_Copy_4198.pdf', type: 'Registry Document', uploadDate: '2026-09-20', sizeKb: 1400 }
    ],
    pricing: {
      serviceFeeKES: 12000,
      currency: 'USD',
      quoteStatus: 'paid',
    },
    checklist: [
      { id: 'chk-11', label: 'Verify access road suitability during dry and wet weather', completed: true, status: 'passed', notes: 'Murram access road exists, accessible by standard 2WD vehicle in dry weather.', verifiedAt: '11:10 EAT' },
      { id: 'chk-12', label: 'Locate 4 corner cadastral concrete beacons', completed: true, status: 'flagged', notes: 'CRITICAL: Only 1 eroded concrete beacon found. Remaining 3 corners are overgrown bush with zero beacon marks.', verifiedAt: '11:35 EAT' },
      { id: 'chk-13', label: 'Confirm chain-link or barbed-wire fencing claimed by seller', completed: true, status: 'flagged', notes: 'Seller brochure claimed "Chain-link perimeter fence". Observed: completely unfenced open savanna.', verifiedAt: '11:50 EAT' },
      { id: 'chk-14', label: 'Check power grid proximity', completed: true, status: 'flagged', notes: 'Nearest Kenya Power transformer line is 1.4km away, not adjacent as marketed.', verifiedAt: '12:15 EAT' },
      { id: 'chk-15', label: 'Neighbor boundary inquiry', completed: true, status: 'flagged', notes: 'Adjacent farmer Mr. Kyalo claims plot 4198 encroaches onto his family grazing pathway.', verifiedAt: '12:30 EAT' }
    ],
    evidence: [
      {
        id: 'ev-11',
        type: 'photo',
        title: 'Unfenced Open Land View',
        description: 'Plot area is completely unfenced open scrubland, contradicting brochure claim of "chain-link fenced gated community".',
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
        timestamp: '2026-09-27 11:20 EAT',
        locationTag: 'Konza Buffer Zone Plot 4198',
        gpsCoords: '-1.7144, 37.1982',
        verifiedByAgentId: 'agt-02',
        tags: ['Land', 'Fencing', 'False Claim']
      },
      {
        id: 'ev-12',
        type: 'photo',
        title: 'Single Weathered Beacon Found',
        description: 'Only north-west corner has a weathered concrete marker with illegible number. Other 3 corners unmarked.',
        url: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=800&auto=format&fit=crop&q=80',
        timestamp: '2026-09-27 11:42 EAT',
        locationTag: 'North-West Corner',
        gpsCoords: '-1.7142, 37.1980',
        verifiedByAgentId: 'agt-02',
        tags: ['Beacon', 'Survey']
      }
    ],
    qaReview: {
      reviewedBy: 'Amara Kiprotich (Chief Operations Coordinator)',
      reviewedAt: '2026-09-28 16:00 EAT',
      findingsSummary: 'High risk detected. Ground realities directly contradict the seller marketing materials. Beacons are missing, no fencing exists, and an adjacent neighbor claims an encroachment dispute. STOP PAYMENT of deposit recommended.',
      contradictions: [
        'Brochure claims perimeter fence installed — ground is completely unfenced',
        'Brochure claims electricity adjacent — nearest line is 1.4km',
        'Only 1 of 4 required beacons physically verified'
      ],
      whatCouldNotBeVerified: [
        'True boundary perimeter without a registered Kenya Survey department licensed surveyor',
        'Validity of adjacent farmer Kyalo boundary dispute claim'
      ],
      recommendation: 'DO NOT PAY DEPOSIT (USD $4,500). Demand that seller hires a licensed surveyor to re-establish all 4 beacons and clear neighbor boundary dispute in writing before proceeding.',
      stopPaymentTriggered: true,
      publishedToClient: true,
    },
    createdAt: '2026-09-22 14:00:00',
    updatedAt: '2026-09-28 16:30:00',
    scheduledVisitDate: '2026-09-27',
    completedDate: '2026-09-28',
  },
  {
    id: 'DV-2026-ELD-0341',
    title: 'Mama Mary Kiprop — Elderly Medical & Welfare Accompaniment',
    category: 'family',
    offerType: 'ongoing-assistant',
    stage: 'act',
    status: 'observed',
    urgency: 'standard',
    client: {
      name: 'Brian Kiprop',
      locationAbroad: 'Toronto, Canada',
      email: 'brian.kiprop@rogers.ca',
      phone: '+1 416 555 7820',
      preferredCurrency: 'KES',
    },
    location: {
      county: 'Uasin Gishu',
      town: 'Eldoret (Elgon View Estate)',
      landmark: 'Near Boma Inn, off Nandi Road',
      gpsCoords: '0.5052, 35.2819',
    },
    contactOnGround: {
      name: 'Mama Mary Jepkemboi Kiprop (Mother, age 74) & Nurse Janet',
      role: 'Family Member & Home Care Nurse',
      phone: '+254 722 334 112',
      accessConfirmed: true,
      notes: 'Full informed consent obtained from both client Brian and Mama Mary. Coordinator accompanied to MTRH clinic.',
    },
    assignedAgent: MOCK_AGENTS[2], // Dr. Sharon Chemutai
    conflictOfInterestCheck: {
      checked: true,
      agentHasRelationToSite: false,
      notes: 'Professional welfare coordinator role only.',
    },
    scopeBrief: 'Monthly wellness visit: Check living conditions, verify home nurse Janet attendance logs, accompany Mama Mary to Endocrinology clinic at Moi Teaching & Referral Hospital (MTRH), verify diabetes medication prescription, and deliver monthly grocery supplies.',
    deliverables: [
      'Documented wellness checklist and vital signs review with clinic nurse',
      'Pharmacy official receipts and medication inventory photos',
      'Pantry stock verification',
      'Direct audio check-in recording with Mama Mary'
    ],
    explicitLimitations: [
      'DiasporaVerify provides accompaniment and welfare observation; we do not provide clinical treatment or prescribe medication.',
      'Clinical decisions remain solely with licensed medical staff at MTRH.'
    ],
    documentsProvided: [
      { id: 'doc-21', name: 'MTRH_Endocrine_Clinic_Card_MamaMary.pdf', type: 'Medical Card', uploadDate: '2026-09-15', sizeKb: 890 }
    ],
    pricing: {
      serviceFeeKES: 18000,
      currency: 'KES',
      quoteStatus: 'paid',
    },
    checklist: [
      { id: 'chk-21', label: 'Obtain safeguarding & family consent form', completed: true, status: 'passed', notes: 'Consent signed and stored securely in HIPAA-equivalent vault.', verifiedAt: '09:00 EAT' },
      { id: 'chk-22', label: 'Verify Home Nurse attendance register', completed: true, status: 'passed', notes: 'Nurse Janet attended 24 of 26 scheduled days. Blood sugar logs up to date (fasting avg 6.8 mmol/L).', verifiedAt: '09:30 EAT' },
      { id: 'chk-23', label: 'Accompany to MTRH Endocrinology Outpatient Clinic', completed: true, status: 'passed', notes: 'Dr. Rotich reviewed patient; renewed Metformin & Glimepiride prescriptions.', verifiedAt: '12:45 EAT' },
      { id: 'chk-24', label: 'Reconcile pharmacy medication receipts', completed: true, status: 'passed', notes: 'Purchased 60 days supply at Goodlife Pharmacy Eldoret for KES 8,400. Official ETR receipt verified.', verifiedAt: '14:10 EAT' }
    ],
    evidence: [
      {
        id: 'ev-21',
        type: 'photo',
        title: 'Medication Supply & Goodlife ETR Receipt',
        description: '2-month prescription box sealed with verified batch number and original Kenya Revenue Authority ETR receipt.',
        url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
        timestamp: '2026-09-28 14:15 EAT',
        locationTag: 'Elgon View Residence, Eldoret',
        gpsCoords: '0.5052, 35.2819',
        verifiedByAgentId: 'agt-03',
        tags: ['Welfare', 'Pharmacy', 'Receipt']
      },
      {
        id: 'ev-22',
        type: 'photo',
        title: 'Caregiver Logbook & Vitals Chart',
        description: 'Morning and evening blood pressure and glucose tracking charts signed by caregiver Janet.',
        url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
        timestamp: '2026-09-28 09:40 EAT',
        locationTag: 'Elgon View Residence, Eldoret',
        gpsCoords: '0.5052, 35.2819',
        verifiedByAgentId: 'agt-03',
        tags: ['Care', 'Logbook', 'Health']
      }
    ],
    qaReview: {
      reviewedBy: 'Amara Kiprotich (Chief Operations Coordinator)',
      reviewedAt: '2026-09-29 08:30 EAT',
      findingsSummary: 'Mama Mary is in good spirits and health. Caregiver logs are accurate and verified. Clinic visit completed with doctor notes. All pharmacy expenses matched with ETR fiscal receipt.',
      contradictions: [],
      whatCouldNotBeVerified: ['Next clinic appointment scheduled for 18 November 2026.'],
      recommendation: 'Everything observed matches agreed scope. Client can proceed with scheduled caregiver monthly stipend.',
      stopPaymentTriggered: false,
      publishedToClient: true,
    },
    createdAt: '2026-09-15 11:00:00',
    updatedAt: '2026-09-29 08:45:00',
    scheduledVisitDate: '2026-09-28',
    completedDate: '2026-09-28',
  },
  {
    id: 'DV-2026-MRG-0455',
    title: 'Maragua 3-Acre Macadamia & Avocado Farm — Drip Irrigation Audit',
    category: 'business',
    offerType: 'follow-through',
    stage: 'review',
    status: 'partly_observed',
    urgency: 'standard',
    client: {
      name: 'Grace Wanjiku',
      locationAbroad: 'Sydney, Australia',
      email: 'grace.wanjiku@sydneyuni.edu.au',
      phone: '+61 411 928 334',
      preferredCurrency: 'USD',
    },
    location: {
      county: 'Murang\'a',
      town: 'Maragua Ridge (Kamahuha Ward)',
      landmark: 'Near Kamahuha Secondary School, off Murang\'a Road',
      gpsCoords: '-0.8122, 37.1294',
    },
    contactOnGround: {
      name: 'Simon Kamau (Farm Manager)',
      role: 'Farm Manager',
      phone: '+254 721 884 102',
      accessConfirmed: true,
      notes: 'Farm manager requested KES 180,000 for completing full drip irrigation piping and 20 bags DAP fertilizer.',
    },
    assignedAgent: MOCK_AGENTS[3], // Joseph Ochieng
    conflictOfInterestCheck: {
      checked: true,
      agentHasRelationToSite: false,
      notes: 'Inspector has no ties to farm manager or suppliers.',
    },
    scopeBrief: 'Audit farm activities: Count DAP fertilizer bags in farm store, measure length of HDPE drip lateral lines laid across the 3-acre Hass avocado blocks, check solar water pump operation at the borehole, and verify farmer labor expense claims.',
    deliverables: [
      'Physical count of 20 bags DAP 50kg in farm store',
      'Drip line installation progress across blocks A, B and C',
      'Solar submersible pump water flow test',
      'Labor attendance log check'
    ],
    explicitLimitations: [
      'Visual and operational observation only: Not an agronomic soil fertility certification or legal financial audit.',
      'Crop yield projections are estimates and cannot be guaranteed.'
    ],
    documentsProvided: [
      { id: 'doc-31', name: 'Agrovet_Receipt_DAP_Pipes_KES180k.pdf', type: 'Pro-forma Invoice', uploadDate: '2026-09-23', sizeKb: 610 }
    ],
    pricing: {
      serviceFeeKES: 13500,
      currency: 'USD',
      quoteStatus: 'paid',
    },
    checklist: [
      { id: 'chk-31', label: 'Verify 20 bags DAP 50kg in farm store against Agrovet receipt', completed: true, status: 'passed', notes: '20 bags of YaraMila DAP found sealed in dry store. Batch numbers match receipt.', verifiedAt: '10:45 EAT' },
      { id: 'chk-32', label: 'Inspect drip irrigation lateral lines across all 3 acres', completed: true, status: 'flagged', notes: 'Block A (1 acre) 100% laid; Block B (1 acre) trenching complete but pipes not joined; Block C untouched. Overall progress ~55%.', verifiedAt: '11:30 EAT' },
      { id: 'chk-33', label: 'Solar borehole pump operational test', completed: true, status: 'passed', notes: 'Pump switched on; 5,000L raised tank filled at approx 45 liters/minute in peak sunshine.', verifiedAt: '12:15 EAT' }
    ],
    evidence: [
      {
        id: 'ev-31',
        type: 'photo',
        title: 'Block A Drip Lines Laid Around Hass Trees',
        description: 'Drip emitters installed along 120 avocado seedlings with functional water emission.',
        url: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?w=800&auto=format&fit=crop&q=80',
        timestamp: '2026-09-27 11:15 EAT',
        locationTag: 'Block A, Maragua Farm',
        gpsCoords: '-0.8122, 37.1294',
        verifiedByAgentId: 'agt-04',
        tags: ['Agriculture', 'Irrigation', 'Avocado']
      },
      {
        id: 'ev-32',
        type: 'photo',
        title: 'Block B Unjoined Piping Rolls in Field',
        description: 'Black HDPE coils lying on ground. Lateral trenches dug but fittings not installed.',
        url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80',
        timestamp: '2026-09-27 11:45 EAT',
        locationTag: 'Block B, Maragua Farm',
        gpsCoords: '-0.8124, 37.1296',
        verifiedByAgentId: 'agt-04',
        tags: ['Agriculture', 'Work-In-Progress']
      }
    ],
    qaReview: {
      reviewedBy: 'Amara Kiprotich (Chief Operations Coordinator)',
      reviewedAt: '2026-09-28 14:00 EAT',
      findingsSummary: 'Materials have been delivered legitimately. However, installation labor is only ~55% complete. Recommending releasing only the materials portion (KES 110,000) and withholding installation balance (KES 70,000) until Block B & C are fully connected.',
      contradictions: ['Manager requested full KES 180,000 claiming "irrigation commissioning complete" when 2 blocks remain unplumbed.'],
      whatCouldNotBeVerified: ['Underground main pipeline pressure rating without hydrostatic gauge test.'],
      recommendation: 'Authorize partial payment of KES 110,000 (materials & fertilizer verified). Hold KES 70,000 labor balance until completion check.',
      stopPaymentTriggered: false,
      publishedToClient: true,
    },
    createdAt: '2026-09-20 09:30:00',
    updatedAt: '2026-09-28 14:30:00',
    scheduledVisitDate: '2026-09-27',
    completedDate: '2026-09-28',
  },
  {
    id: 'DV-2026-MSA-0582',
    title: 'Mombasa Port CFS Yard — 2018 Toyota Land Cruiser Prado Pre-Purchase Inspection',
    category: 'vehicle',
    offerType: 'one-time',
    stage: 'review',
    status: 'partly_observed',
    urgency: 'urgent',
    client: {
      name: 'Kevin Otieno',
      locationAbroad: 'Dubai, UAE',
      email: 'kevin.otieno.dxb@gmail.com',
      phone: '+971 50 284 1993',
      preferredCurrency: 'USD',
    },
    location: {
      county: 'Mombasa',
      town: 'Shimanzi (Container Freight Station Yard 4)',
      landmark: 'Near KPA Gate 5, Shimanzi Industrial Area',
      gpsCoords: '-4.0435, 39.6582',
    },
    contactOnGround: {
      name: 'Salim Baraza (Auto Port Yard Sales Representative)',
      role: 'Car Yard Dealer',
      phone: '+254 733 441 908',
      accessConfirmed: true,
      notes: 'Car dealer claimed vehicle is 100% Grade 4.5 pristine import with zero body repairs.',
    },
    assignedAgent: MOCK_AGENTS[4], // Patrick Mutua
    conflictOfInterestCheck: {
      checked: true,
      agentHasRelationToSite: false,
      notes: 'No association with auto dealership.',
    },
    scopeBrief: 'Inspect 2018 Toyota Land Cruiser Prado TX-L (Chassis: GDJ150-0042918). Match physical VIN plate with import customs C17B entry form. Run digital paint coating thickness gauge across panels to test for collision filler. Test engine cold start and 4WD selector.',
    deliverables: [
      'Chassis plate and engine number stamping photos',
      'Paint depth micrometer readings map (8 panels)',
      'Underbody chassis rust and suspension bushings check',
      'Engine idle sound recording and dashboard OBD indicators'
    ],
    explicitLimitations: [
      'Visual and operational test: Not a full mechanical teardown or dynamometer test.',
      'Registration validity requires final NTSA TIMS logging by authorized clearing agent.'
    ],
    documentsProvided: [
      { id: 'doc-41', name: 'Japan_Export_Certificate_Copy.pdf', type: 'Export Document', uploadDate: '2026-09-24', sizeKb: 750 }
    ],
    pricing: {
      serviceFeeKES: 16000,
      currency: 'USD',
      quoteStatus: 'paid',
    },
    checklist: [
      { id: 'chk-41', label: 'Match physical VIN plate GDJ150-0042918 on bulkhead', completed: true, status: 'passed', notes: 'VIN plate rivets and stamping match import bill of lading.', verifiedAt: '14:20 EAT' },
      { id: 'chk-42', label: 'Paint depth gauge inspection (Standard 90-120 microns)', completed: true, status: 'flagged', notes: 'ALERT: Right rear quarter panel reads 480 microns (heavy body filler detected indicating repaired accident damage). Factory paint elsewhere is 105 microns.', verifiedAt: '14:45 EAT' },
      { id: 'chk-43', label: 'Chassis underside & suspension check', completed: true, status: 'passed', notes: 'Chassis rails straight; minor surface coastal salt patina on exhaust hanger; no weld seams observed.', verifiedAt: '15:10 EAT' },
      { id: 'chk-44', label: 'Engine start, AC & 4WD H4/L4 transfer case test', completed: true, status: 'passed', notes: 'Engine starts without smoke. Transfer case switches into 4L smoothly.', verifiedAt: '15:35 EAT' }
    ],
    evidence: [
      {
        id: 'ev-41',
        type: 'photo',
        title: 'Paint Gauge Reading 480 Microns on Rear Fender',
        description: 'Digital gauge display on right rear quarter panel. Significant body filler found beneath clearcoat.',
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
        timestamp: '2026-09-27 14:46 EAT',
        locationTag: 'Shimanzi CFS Yard, Mombasa',
        gpsCoords: '-4.0435, 39.6582',
        verifiedByAgentId: 'agt-05',
        tags: ['Vehicle', 'Paint Gauge', 'Defect']
      },
      {
        id: 'ev-42',
        type: 'photo',
        title: 'VIN Bulkhead Plate Verification',
        description: 'Original stamped aluminum plate matches import paperwork and engine code 1GD-FTV.',
        url: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&auto=format&fit=crop&q=80',
        timestamp: '2026-09-27 14:22 EAT',
        locationTag: 'Shimanzi CFS Yard, Mombasa',
        gpsCoords: '-4.0435, 39.6582',
        verifiedByAgentId: 'agt-05',
        tags: ['Vehicle', 'VIN', 'Verification']
      }
    ],
    qaReview: {
      reviewedBy: 'Amara Kiprotich (Chief Operations Coordinator)',
      reviewedAt: '2026-09-28 10:00 EAT',
      findingsSummary: 'Vehicle is mechanically sound, but seller claim of "accident-free Grade 4.5" is FALSE. Digital paint gauge confirmed heavy body filler (480 microns) on the rear right quarter panel from an undisclosed accident repair.',
      contradictions: ['Dealer claimed zero body repairs; rear quarter panel contains heavy bondo/filler.'],
      whatCouldNotBeVerified: ['Whether airbag on passenger curtain side deployed during past incident.'],
      recommendation: 'Use evidence to negotiate a KES 250,000 price discount with the dealer, or reject unit if client wanted untouched factory finish.',
      stopPaymentTriggered: false,
      publishedToClient: true,
    },
    createdAt: '2026-09-23 15:00:00',
    updatedAt: '2026-09-28 10:15:00',
    scheduledVisitDate: '2026-09-27',
    completedDate: '2026-09-28',
  }
];

export const KENYA_COUNTIES = [
  'Nairobi', 'Kajiado', 'Kiambu', 'Machakos', 'Nakuru', 'Uasin Gishu', 
  'Mombasa', 'Kilifi', 'Kisumu', 'Murang\'a', 'Kirinyaga', 'Nyeri', 
  'Meru', 'Kakamega', 'Laikipia', 'Trans Nzoia'
];

export const SERVICE_CATEGORIES_CONFIG = [
  {
    id: 'construction',
    name: 'Projects & Construction Oversight',
    shortName: 'Construction',
    tagline: 'Site visits, milestone tracking, and payment verification before sending funds.',
    icon: 'Building',
    color: 'emerald',
    boundaryNote: 'Observe and track physical milestones; use qualified structural engineers for technical certification.',
    typicalUseCases: ['Foundation casting checks', 'Wall lintel inspections', 'Roof truss verification', 'Contractor material audits']
  },
  {
    id: 'property',
    name: 'Property & Land Pre-Purchase',
    shortName: 'Land & Property',
    tagline: 'Beacon inspection, fence verification, boundary checks, and neighbor inquiries.',
    icon: 'MapPin',
    color: 'blue',
    boundaryNote: 'Physical beacon check only; refer legal title search and official deed survey to registered land surveyors and conveyancing lawyers.',
    typicalUseCases: ['Plot beacon verification', 'Encroachment risk checks', 'Access road condition', 'Utility proximity check']
  },
  {
    id: 'vehicle',
    name: 'Purchases & Vehicles',
    shortName: 'Vehicles & Purchases',
    tagline: 'Physical condition checks, VIN chassis match, paint gauge testing, and dealer audits.',
    icon: 'Car',
    color: 'amber',
    boundaryNote: 'Visual and gauge checks; refer engine mechanical compression and statutory logbook transfer to licensed mechanics and NTSA.',
    typicalUseCases: ['Import car yard checks', 'Chassis VIN match', 'Body filler detection', 'High-value equipment condition']
  },
  {
    id: 'business',
    name: 'Business & Farming Operations',
    shortName: 'Business & Farm',
    tagline: 'Stock counts, premises checks, farm input audits, and operational reconciliation.',
    icon: 'Briefcase',
    color: 'purple',
    boundaryNote: 'Ground observation and asset inventory; does not imply a statutory audit or agricultural yield guarantee.',
    typicalUseCases: ['Farm drip irrigation checks', 'Fertilizer & input verification', 'Retail stock count', 'Equipment delivery verification']
  },
  {
    id: 'family',
    name: 'Family Welfare & Care Coordination',
    shortName: 'Family Support',
    tagline: 'Elderly welfare visits, medical clinic accompaniment, caregiver tracking, and school checks.',
    icon: 'Heart',
    color: 'rose',
    boundaryNote: 'Safeguarding consent required; we provide accompaniment and welfare reporting, not clinical diagnosis or medical care.',
    typicalUseCases: ['Elderly parent welfare check', 'Clinic appointment accompaniment', 'Medication inventory check', 'Home care nurse verification']
  },
  {
    id: 'custom',
    name: 'Custom Verification Requests',
    shortName: 'Custom Request',
    tagline: 'Tailored on-ground research, legal document collection, or urgent local verification.',
    icon: 'Compass',
    color: 'slate',
    boundaryNote: 'Accepted only after written scope, safe access, risk review, and clear delivery brief are agreed.',
    typicalUseCases: ['School fee receipt delivery', 'Cemetery memorial check', 'Specialized ground collection', 'Contractor meeting facilitation']
  }
];

export const CURRENCY_RATES: Record<string, { symbol: string; rateToKES: number }> = {
  KES: { symbol: 'KES', rateToKES: 1 },
  USD: { symbol: '$', rateToKES: 0.0077 }, // 1 KES = 0.0077 USD (~130 KES per USD)
  GBP: { symbol: '£', rateToKES: 0.0060 }, // 1 KES = 0.0060 GBP (~165 KES per GBP)
  EUR: { symbol: '€', rateToKES: 0.0071 }  // 1 KES = 0.0071 EUR (~140 KES per EUR)
};

export const FORMAT_CURRENCY = (amountKES?: number | null, currency: string = 'KES'): string => {
  if (amountKES === undefined || amountKES === null || isNaN(amountKES)) {
    return currency === 'KES' ? 'KES 0' : '$0';
  }
  if (currency === 'KES') {
    return `KES ${Math.round(amountKES).toLocaleString('en-KE')}`;
  }
  const config = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const converted = amountKES * config.rateToKES;
  return `${config.symbol}${Math.round(converted).toLocaleString('en-US')}`;
};

export const hasStopPaymentWarning = (req: VerificationRequest): boolean => {
  return Boolean(req.paymentDecisionRecord?.stopPaymentAlert || req.qaReview?.stopPaymentTriggered);
};

