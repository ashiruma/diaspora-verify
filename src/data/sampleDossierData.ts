/**
 * DiasporaVerify — Canonical Sample Audit Dossier Data
 * 
 * Source of truth for the illustrative demonstration report.
 * Rendered consistently across HomePage preview and SampleReportPage.
 * 
 * NOTE: This is an illustrative synthetic case study designed to demonstrate
 * DiasporaVerify's 4-state finding schema, GPS telemetry, and stop-payment protocol.
 * It is NOT a real client case and contains zero real-world client/contractor PII.
 */

export interface SampleFindingItem {
  id: string;
  title: string;
  category: 'Observed' | 'Partly Observed' | 'Cannot Confirm' | 'Discrepancy';
  summary: string;
  detailedFinding: string;
  statusBadge: 'observed' | 'partly_observed' | 'cannot_confirm' | 'discrepancy';
}

export interface SampleMediaItem {
  id: string;
  category: 'milestone' | 'materials' | 'telemetry';
  title: string;
  timestamp: string;
  gps: string;
  status: 'observed' | 'partly_observed' | 'cannot_confirm';
  desc: string;
  url: string;
  sha256Hash: string;
}

export const SAMPLE_DOSSIER = {
  // Unambiguous demonstration label
  badgeLabel: 'DEMO REPORT · ILLUSTRATIVE CASE STUDY',
  isDemo: true,
  referenceId: 'DV-DEMO-2026-KJD',
  qaReportRef: 'Standard QA Review Report · Reference: DV-DEMO-2026-KJD',
  
  // Project particulars
  projectTitle: 'Kitengela Residential Villa — Milestone 3 (Lintel Beam & Cement Stock)',
  serviceCategory: 'Projects & Asset Verification (Construction Oversight)',
  location: {
    county: 'Kajiado',
    town: 'Kitengela (Acacia Area)',
    landmark: '1.2km off Namanga Road',
    gpsCoords: '-1.4892, 36.9583',
  },
  
  // Inspection metadata
  auditDate: '04 Oct 2026, 11:15 EAT',
  auditCompletedDate: '04 Oct 2026, 16:30 EAT',
  verifier: {
    name: 'Evans K.',
    badgeId: 'AGT-0104',
    title: 'Senior Field Verifier (Nairobi Hub)',
    conflictClearanceSigned: true,
  },
  qaReviewer: {
    title: 'Nairobi Operations Lead QA Reviewer',
    status: 'Approved & Published for Demonstration',
  },
  
  // Scope and boundaries
  agreedScope: 'Verify physical completion of first-floor lintel ring beam casting. Confirm physical delivery of 100 bags of Portland cement billed under invoice INV-482. Inspect north boundary wall construction.',
  explicitExclusions: 'Laboratory core testing of concrete compressive strength (requires licensed materials testing lab). Mediation of contractor wage dispute. Structural engineering certification.',
  
  // AIRTIGHT CEMENT & FINANCIAL RECONCILIATION DATA
  cementData: {
    invoicedBags: 100,
    invoiceRef: 'INV-482',
    countedInStoreBags: 42,
    contractorClaimedMixedBags: 58,
    structurallyEstimatedInLintelBags: 25,
    unexplainedVarianceBags: 33, // 58 claimed - 25 calculated = 33 bags discrepancy
    costPerBagKES: 850,
  },
  
  financials: {
    currency: 'KES',
    contractorRequestedKES: 185000,
    authorizedLaborPortionKES: 45000,
    recommendedWithheldKES: 140000,
  },
  
  // Overall status
  overallStatus: {
    code: 'PARTLY_VERIFIED',
    label: 'PARTLY VERIFIED / CAUTION',
    stopPaymentAlertActive: true,
  },
  
  // Client Recommended Action Box
  recommendedAction: {
    headline: 'Recommended Client Action (Stop-Payment Alert):',
    summary: 'Pause KES 140,000 disbursement for unverified cement stock until contractor produces signed supplier delivery notes. Authorize only KES 45,000 for verified lintel labor.',
    fullRecommendation: 'Critical Material Discrepancy: Contractor requested approval of KES 185,000 for Milestone 3 completion and cement restocking. However, physical on-ground inventory counted only 42 bags of the 100 bags billed under invoice INV-482. While contractor claimed 58 bags were mixed into the lintel beam, structural volume indicates only ~25 bags utilized, leaving a 33-bag (KES 28,050) unexplained variance. We advise pausing KES 140,000 and authorizing at most KES 45,000 for verified labor.',
  },
  
  // Itemized findings in standard 4-state schema
  findings: [
    {
      id: 'f1',
      title: 'Lintel Ring Beam Casting',
      category: 'Observed',
      statusBadge: 'observed',
      summary: 'Ring beam is physically in place across all external walls. Concrete cured with no visible honeycomb voids.',
      detailedFinding: 'Ring beam is physically in place across all external walls. Concrete cured with no visible honeycomb voids. Rebar tie-ins observed according to milestone plan.',
    },
    {
      id: 'f2',
      title: 'Cement Delivery (100 Bags Billed under INV-482)',
      category: 'Partly Observed',
      statusBadge: 'partly_observed',
      summary: 'Only 42 bags found in store. Lintel volume accounts for ~25 bags. 33 bags unexplained variance.',
      detailedFinding: 'Only 42 bags found in storage. Contractor claimed 58 bags were already mixed; however, volume calculations for the lintel beam indicate only ~25 bags utilized. 33 bags discrepancy.',
    },
    {
      id: 'f3',
      title: 'North Boundary Demarcation Wall',
      category: 'Observed',
      statusBadge: 'observed',
      summary: '2.4m natural stone masonry completed along north boundary line per beacon coordinates.',
      detailedFinding: '2.4m natural stone masonry completed along north boundary line per beacon coordinates. Razor wire bracket preparations installed.',
    },
    {
      id: 'f4',
      title: 'South-East Beacon Demarcation Peg B-4',
      category: 'Cannot Confirm',
      statusBadge: 'cannot_confirm',
      summary: 'Corner beacon obscured under soil excavation mound. Could not verify without excavation.',
      detailedFinding: 'Concrete survey marker obscured by excavated soil mound. Physical boundary peg could not be visually confirmed without unapproved excavation.',
    },
  ] as SampleFindingItem[],

  // Media Gallery items with cryptographic hashes & realistic nearby coordinates
  media: [
    {
      id: 'm1',
      category: 'milestone',
      title: 'First-Floor Lintel Ring Beam Concrete Cast',
      timestamp: '2026-10-04 11:24:18 EAT',
      gps: '-1.4892, 36.9583 (Accuracy: ±2.8m)',
      status: 'observed',
      desc: 'Formwork struck; reinforced concrete cured and solid. Rebar ties visible and aligned to drawing section C-2.',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=720&auto=format&fit=crop&q=75&fm=webp',
      sha256Hash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9060',
    },
    {
      id: 'm2',
      category: 'materials',
      title: 'Cement Bags in Storage Shed (42 Counted)',
      timestamp: '2026-10-04 11:42:05 EAT',
      gps: '-1.4893, 36.9585 (Accuracy: ±3.1m)',
      status: 'partly_observed',
      desc: 'Counted 42 intact bags stacked on dry wooden pallets. Invoiced tally was 100 bags. Remaining 58 bags not present in storage.',
      url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=720&auto=format&fit=crop&q=75&fm=webp',
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
    {
      id: 'm3',
      category: 'milestone',
      title: 'External Perimeter Boundary Wall Demarcation',
      timestamp: '2026-10-04 12:05:40 EAT',
      gps: '-1.4891, 36.9581 (Accuracy: ±2.5m)',
      status: 'observed',
      desc: 'North boundary wall standing at 2.4m height with razor-wire bracket preparations in place. Mortar pointing complete.',
      url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=720&auto=format&fit=crop&q=75&fm=webp',
      sha256Hash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
    },
    {
      id: 'm4',
      category: 'telemetry',
      title: 'Survey Beacon Demarcation Marker B-4 Area',
      timestamp: '2026-10-04 12:22:15 EAT',
      gps: '-1.4890, 36.9580 (Accuracy: ±1.9m)',
      status: 'cannot_confirm',
      desc: 'Concrete marker obscured by excavated soil mound. Physical boundary peg could not be visually confirmed without excavation.',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=720&auto=format&fit=crop&q=75&fm=webp',
      sha256Hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    },
  ] as SampleMediaItem[],

  // Cryptographic evidence integrity note
  cryptographicSeal: {
    algorithm: 'SHA-256',
    dossierDigest: 'sha256:7f83b165a29f8c01b4491733cfb7b190d62c65bf0bcda32b57b277d9ad9fa90b',
    meaning: 'The SHA-256 cryptographic digest certifies that all photos, checklist ratings, and timestamps in this dossier have remained bit-level immutable since QA review sign-off. It does not certify uninspected structural internals or off-camera site conditions.',
  },
};
