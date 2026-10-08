export type ServiceCategory = 
  | 'construction' 
  | 'property' 
  | 'vehicle' 
  | 'business' 
  | 'family' 
  | 'document'
  | 'person'
  | 'purchase'
  | 'field_assistance'
  | 'custom';

export type ServiceOfferModel = 
  | 'one-time' 
  | 'follow-through' 
  | 'ongoing-assistant';

// High-level 5-stage lifecycle matching invariant Rule 2
export type ProcessStage = 
  | 'define' 
  | 'assign' 
  | 'act' 
  | 'review' 
  | 'decide';

// Granular 15-state production state machine
export type DetailedRequestStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'AWAITING_AGENT'
  | 'AGENT_ASSIGNED'
  | 'ACCEPTED'
  | 'TRAVELLING'
  | 'ON_SITE'
  | 'VERIFYING'
  | 'EVIDENCE_SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ADDITIONAL_INFORMATION_REQUIRED'
  | 'REPORT_READY'
  | 'COMPLETED'
  | 'DISPUTED'
  | 'CANCELLED';

// Verification status categories strictly matching invariant Rule 1
export type VerificationStatus = 
  | 'observed' 
  | 'partly_observed' 
  | 'not_observed' 
  | 'cannot_confirm';

export type PaymentDecisionStatus = 
  | 'pending' 
  | 'authorized_full' 
  | 'authorized_partial' 
  | 'paused' 
  | 'stopped' 
  | 'specialist_requested';

export type CurrencyCode = 'KES' | 'USD' | 'GBP' | 'EUR' | 'AED' | 'CAD' | 'AUD';

export interface FieldAgent {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatarUrl: string;
  badgeLevel: 'Senior Ground Verifier' | 'Construction Specialist' | 'Welfare & Care Coordinator' | 'Agricultural Inspector';
  primaryCounties: string[];
  totalInspections: number;
  rating: number;
  conflictClearanceSigned: boolean;
  specialties: string[];
  // Trust & Performance metrics
  completionRate?: number;
  averageResponseHours?: number;
  disputeRate?: number;
  identityVerified?: boolean;
  phoneVerified?: boolean;
  trainingCompleted?: boolean;
  activeJobsCount?: number;
  totalEarningsKES?: number;
}

export interface DocumentRecord {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  sizeKb: number;
  url?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
  completed: boolean;
  status: 'passed' | 'flagged' | 'inconclusive' | 'pending';
  notes?: string;
  verifiedAt?: string;
}

export interface EvidenceItem {
  id: string;
  type: 'photo' | 'video' | 'receipt' | 'audio_interview' | 'document' | 'gps' | 'text_observation';
  title: string;
  description: string;
  url: string;
  timestamp: string;
  locationTag: string;
  gpsCoords: string;
  cameraAngle?: string;
  verifiedByAgentId: string;
  tags: string[];
  uncertaintyFlag?: string; // what could not be confirmed
  sha256Hash?: string; // Cryptographic integrity hash
  originalFilename?: string;
  fileSizeBytes?: number;
  uploadStatus?: 'uploaded' | 'pending' | 'failed';
}

export interface PhotoComparison {
  id: string;
  angleName: string;
  previousDate: string;
  previousStageTitle: string;
  previousPhotoUrl: string;
  currentDate: string;
  currentStageTitle: string;
  currentPhotoUrl: string;
  observedDifference: string;
  statusMatch: 'discrepancy' | 'as_expected' | 'inconclusive';
}

export interface VideoInspectionMarker {
  timestamp: string; // e.g. "01:15"
  title: string;
  note: string;
  severity: 'info' | 'warning' | 'alert';
}

export interface Milestone {
  id: string;
  stageNumber: number;
  title: string;
  description: string;
  agreedAmountKES: number;
  stageStatus: 'completed' | 'in_progress' | 'disputed' | 'upcoming';
  verificationStatus?: VerificationStatus;
  targetDate: string;
  inspectedDate?: string;
}

export interface PaymentDecisionRecord {
  milestoneTitle: string;
  contractorRequestedKES: number;
  previousPaymentsKES: number;
  receiptsProvidedKES: number;
  unexplainedVarianceKES: number;
  coordinatorRecommendation: string;
  stopPaymentAlert: boolean;
  decisionStatus: PaymentDecisionStatus;
  authorizedAmountKES?: number;
  decisionNote?: string;
  decisionDate?: string;
  history: {
    action: string;
    note: string;
    date: string;
    by: string;
  }[];
}

export interface ClientDecisionEntry {
  action: string;
  note: string;
  date: string;
  by: string;
}

export interface CheckInRecord {
  id: string;
  requestId: string;
  agentId: string;
  agentName: string;
  timestamp: string;
  gpsCoords: string;
  accuracyMeters?: number;
  targetCoords: string;
  distanceMeters?: number;
  verifiedWithinRange: boolean;
  notes?: string;
}

export interface ConfidenceFactor {
  name: string;
  score: number;
  maxScore: number;
  rationale: string;
}

export interface VerificationConfidence {
  overall: number; // 0-100
  ratingTier: 'HIGH' | 'MODERATE' | 'LOW' | 'INCONCLUSIVE';
  factors: ConfidenceFactor[];
  methodologyNote: string;
}

export interface FeeBreakdown {
  serviceBaseFeeKES: number;
  fieldOperationsFeeKES: number;
  countyTravelFeeKES: number;
  urgencyFeeKES: number;
  platformFeeKES: number;
  totalKES: number;
  currency: CurrencyCode;
}

export interface VerificationRequest {
  id: string; // e.g. DV-2026-NBI-0104
  title: string;
  category: ServiceCategory;
  offerType: ServiceOfferModel;
  stage: ProcessStage; // High-level 5-stage: define, assign, act, review, decide
  requestStatus?: DetailedRequestStatus; // 15-state state machine
  status: VerificationStatus; // observed, partly_observed, not_observed, cannot_confirm
  urgency: 'standard' | 'priority' | 'urgent';
  client: {
    name: string;
    locationAbroad: string; // e.g. "London, UK", "Dallas, TX"
    email: string;
    phone: string;
    preferredCurrency: CurrencyCode;
    organizationName?: string;
  };
  location: {
    county: string;
    town: string;
    landmark: string;
    gpsCoords: string;
    addressNotes?: string;
  };
  contactOnGround: {
    name: string;
    role: string; // e.g. "Contractor Foreman", "Plot Seller", "Mother", "Farm Manager"
    phone: string;
    accessConfirmed: boolean;
    notes?: string;
  };
  assignedAgent?: FieldAgent;
  conflictOfInterestCheck: {
    checked: boolean;
    agentHasRelationToSite: boolean;
    notes: string;
  };
  scopeBrief: string;
  deliverables: string[];
  explicitLimitations: string[];
  documentsProvided: DocumentRecord[];
  pricing: {
    serviceFeeKES: number;
    currency: CurrencyCode;
    quoteStatus: 'draft' | 'accepted' | 'invoiced' | 'paid';
    feeBreakdown?: FeeBreakdown;
  };
  paymentDecisionRecord?: PaymentDecisionRecord;
  milestones?: Milestone[];
  checklist: ChecklistItem[];
  evidence: EvidenceItem[];
  photoComparisons?: PhotoComparison[];
  videoInspectionMarkers?: VideoInspectionMarker[];
  checkInRecord?: CheckInRecord;
  confidenceScore?: VerificationConfidence;
  qaReview?: {
    reviewedBy: string;
    reviewedAt: string;
    findingsSummary: string;
    contradictions: string[];
    whatCouldNotBeVerified: string[];
    recommendation: string;
    stopPaymentTriggered: boolean;
    publishedToClient: boolean;
    recommendationType?: 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'UNABLE_TO_VERIFY' | 'REQUIRES_FURTHER_INVESTIGATION';
  };
  createdAt: string;
  updatedAt: string;
  scheduledVisitDate?: string;
  completedDate?: string;
  clientDecisionLog?: ClientDecisionEntry[];
  propertyId?: string;
  disputeId?: string;
}

export type ActiveRole = 'client' | 'agent' | 'admin' | 'operations' | 'field_agent' | 'corporate';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: ActiveRole;
  phone?: string;
  locationAbroad?: string;
  mfaEnabled: boolean;
  organizationId?: string;
}

export interface PropertyRecord {
  id: string;
  clientId: string;
  title: string;
  propertyType: 'Residential Land' | 'Commercial Land' | 'House / Villa' | 'Apartment Block' | 'Farm / Agricultural' | 'Construction Site';
  county: string;
  town: string;
  landmark: string;
  gpsCoords: string;
  beaconNumbers?: string[];
  titleDeedRef?: string;
  sizeAcres?: number;
  currentStatus: 'Vacant' | 'Under Construction' | 'Occupied / Tenanted' | 'Farmed / Cultivated';
  monitoringPlan?: 'Monthly' | 'Quarterly' | 'Biannual' | 'On-Demand';
  lastInspectionDate?: string;
  nextInspectionDate?: string;
  inspectionHistoryCount: number;
  notes?: string;
  verifiedImages?: string[];
}

export interface PropertyInspectionPlan {
  id: string;
  propertyId: string;
  frequency: 'monthly' | 'quarterly' | 'biannual';
  feePerInspectionKES: number;
  status: 'active' | 'paused' | 'cancelled';
  startDate: string;
  nextInspectionDate: string;
  autoRenew: boolean;
}

export interface DisputeRecord {
  id: string;
  requestId: string;
  clientId: string;
  clientName: string;
  reason: 'Incorrect information' | 'Insufficient evidence' | 'Incomplete assignment' | 'Agent misconduct' | 'Technical issue';
  description: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED';
  adminNotes?: string;
  resolutionAction?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  performedBy: {
    id: string;
    name: string;
    role: string;
  };
  timestamp: string;
  targetResource: string;
  targetId: string;
  metadata?: Record<string, any>;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  targetRole: ActiveRole | 'all';
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  timestamp: string;
  link?: string;
  requestId?: string;
}

export interface OrganizationRecord {
  id: string;
  name: string;
  corporateType: 'Real Estate Developer' | 'Diaspora Investment SACCO' | 'Law Firm / Conveyancing' | 'Asset Management' | 'Family Trust';
  contactPerson: string;
  email: string;
  phone: string;
  memberCount: number;
  activeRequestsCount: number;
  totalProperties: number;
  billingEmail: string;
  createdAt: string;
}
