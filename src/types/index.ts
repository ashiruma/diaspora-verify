export type ServiceCategory = 
  | 'construction' 
  | 'property' 
  | 'vehicle' 
  | 'business' 
  | 'family' 
  | 'custom';

export type ServiceOfferModel = 
  | 'one-time' 
  | 'follow-through' 
  | 'ongoing-assistant';

export type ProcessStage = 
  | 'define' 
  | 'assign' 
  | 'act' 
  | 'review' 
  | 'decide';

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

export type CurrencyCode = 'KES' | 'USD' | 'GBP' | 'EUR';

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
  type: 'photo' | 'video' | 'receipt' | 'audio_interview' | 'document';
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

export interface VerificationRequest {
  id: string; // e.g. DV-2026-NBI-0104
  title: string;
  category: ServiceCategory;
  offerType: ServiceOfferModel;
  stage: ProcessStage;
  status: VerificationStatus;
  urgency: 'standard' | 'priority' | 'urgent';
  client: {
    name: string;
    locationAbroad: string; // e.g. "London, UK", "Dallas, TX"
    email: string;
    phone: string;
    preferredCurrency: CurrencyCode;
  };
  location: {
    county: string;
    town: string;
    landmark: string;
    gpsCoords: string;
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
  };
  paymentDecisionRecord?: PaymentDecisionRecord;
  milestones?: Milestone[];
  checklist: ChecklistItem[];
  evidence: EvidenceItem[];
  photoComparisons?: PhotoComparison[];
  videoInspectionMarkers?: VideoInspectionMarker[];
  qaReview?: {
    reviewedBy: string;
    reviewedAt: string;
    findingsSummary: string;
    contradictions: string[];
    whatCouldNotBeVerified: string[];
    recommendation: string;
    stopPaymentTriggered: boolean;
    publishedToClient: boolean;
  };
  createdAt: string;
  updatedAt: string;
  scheduledVisitDate?: string;
  completedDate?: string;
  clientDecisionLog?: ClientDecisionEntry[];
}

export type ActiveRole = 'client' | 'operations' | 'field_agent';
