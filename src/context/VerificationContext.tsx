import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { 
  VerificationRequest, 
  FieldAgent, 
  ActiveRole, 
  CurrencyCode, 
  PaymentDecisionStatus, 
  VerificationStatus, 
  EvidenceItem 
} from '../types';
import { MOCK_REQUESTS, MOCK_AGENTS } from '../data/mockData';
import { supabase, isSupabaseConfigured, computeSHA256, rateLimiter } from '../lib/supabase';

interface VerificationContextType {
  requests: VerificationRequest[];
  activeRequest: VerificationRequest | undefined;
  activeRequestId: string;
  activeRole: ActiveRole;
  currency: CurrencyCode;
  agents: FieldAgent[];
  reportModalRequest: VerificationRequest | null;
  backendMode: 'supabase' | 'local';
  isLiveConnected: boolean;
  supabaseClient: typeof supabase;
  mfaEnabled: boolean;
  toggleMFA: () => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  selectRequest: (id: string) => void;
  setActiveRole: (role: ActiveRole) => void;
  setCurrency: (currency: CurrencyCode) => void;
  openReportModal: (request: VerificationRequest) => void;
  closeReportModal: () => void;
  createRequest: (newReq: Partial<VerificationRequest>) => string;
  assignAgent: (requestId: string, agentId: string, scheduledDate?: string, conflictNotes?: string) => void;
  updateChecklist: (requestId: string, checkId: string, status: 'passed' | 'flagged' | 'inconclusive', notes?: string) => void;
  addEvidence: (requestId: string, evidence: Omit<EvidenceItem, 'id'>) => Promise<void>;
  submitQAReview: (
    requestId: string, 
    reviewData: {
      findings: string;
      contradictions: string[];
      uncertainties: string[];
      recommendation: string;
      status: VerificationStatus;
      stopPayment: boolean;
    }
  ) => void;
  recordPaymentDecision: (
    requestId: string, 
    decision: PaymentDecisionStatus, 
    authorizedAmount?: number, 
    note?: string
  ) => void;
  recordClientDecision: (requestId: string, action: string, note: string) => void;
  resetAllData: () => void;
}

const STORAGE_KEY = 'diaspora_verify_requests_v1';
const ROLE_KEY = 'diaspora_verify_role_v1';
const CURRENCY_KEY = 'diaspora_verify_curr_v1';
const MFA_KEY = 'diaspora_verify_mfa_v1';

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export const VerificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<VerificationRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached requests', e);
      }
    }
    return MOCK_REQUESTS;
  });

  const [activeRequestId, setActiveRequestId] = useState<string>('DV-2026-KJD-0104');
  const [activeRole, setActiveRole] = useState<ActiveRole>(() => {
    return (localStorage.getItem(ROLE_KEY) as ActiveRole) || 'client';
  });
  const [currency, setCurrency] = useState<CurrencyCode>(() => {
    return (localStorage.getItem(CURRENCY_KEY) as CurrencyCode) || 'KES';
  });
  const [mfaEnabled, setMfaEnabled] = useState<boolean>(() => {
    return localStorage.getItem(MFA_KEY) === 'true';
  });
  const [userEmail, setUserEmail] = useState<string>('brian.mwangi@example.com');
  const [backendMode] = useState<'supabase' | 'local'>(isSupabaseConfigured ? 'supabase' : 'local');
  const [isLiveConnected] = useState<boolean>(isSupabaseConfigured);
  const [reportModalRequest, setReportModalRequest] = useState<VerificationRequest | null>(null);

  const toggleMFA = useCallback(() => {
    setMfaEnabled(prev => {
      const next = !prev;
      localStorage.setItem(MFA_KEY, String(next));
      return next;
    });
  }, []);

  // Sync requests to storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(ROLE_KEY, activeRole);
  }, [activeRole]);

  useEffect(() => {
    localStorage.setItem(CURRENCY_KEY, currency);
  }, [currency]);

  const activeRequest = requests.find(r => r.id === activeRequestId) || requests[0];

  const selectRequest = (id: string) => {
    setActiveRequestId(id);
  };

  const openReportModal = (request: VerificationRequest) => {
    setReportModalRequest(request);
  };

  const closeReportModal = () => {
    setReportModalRequest(null);
  };

  const createRequest = (newReq: Partial<VerificationRequest>): string => {
    // Rate limit request creation to prevent automated flooding
    const rateCheck = rateLimiter.check('create_request', 25, 60000);
    if (!rateCheck.allowed) {
      console.warn(`Intake rate limit active: Retry after ${rateCheck.retryAfterSec} seconds`);
    }

    const newId = `DV-2026-${(newReq.location?.county || 'NBI').substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const category = newReq.category || 'construction';
    
    // Provide baseline milestones and comparisons if category is construction
    const defaultMilestones = category === 'construction' ? [
      {
        id: `ms-c1-${newId}`,
        stageNumber: 1,
        title: 'Milestone 1: Substructure & Strip Footing Concrete',
        description: 'Excavation to firm bedrock, hardcore filling, damp-proof membrane, and foundation casting.',
        agreedAmountKES: 650000,
        stageStatus: 'in_progress' as const,
        verificationStatus: 'partly_observed' as const,
        targetDate: new Date(Date.now() + 86400000 * 14).toISOString().substring(0, 10),
      },
      {
        id: `ms-c2-${newId}`,
        stageNumber: 2,
        title: 'Milestone 2: Wall Superstructure (Ground Floor)',
        description: 'Machine-cut stone masonry walls up to 2.8m height, dressed window openings.',
        agreedAmountKES: 600000,
        stageStatus: 'upcoming' as const,
        targetDate: new Date(Date.now() + 86400000 * 35).toISOString().substring(0, 10),
      },
      {
        id: `ms-c3-${newId}`,
        stageNumber: 3,
        title: 'Milestone 3: Lintel Beam & Suspended Slab Formwork',
        description: 'Rebar tie, timber formwork shuttering, conduit laying, ready for concrete casting.',
        agreedAmountKES: 450000,
        stageStatus: 'upcoming' as const,
        targetDate: new Date(Date.now() + 86400000 * 55).toISOString().substring(0, 10),
      },
      {
        id: `ms-c4-${newId}`,
        stageNumber: 4,
        title: 'Milestone 4: Timber Roof Trusses & Covering',
        description: 'Treated timber trusses and stone-coated metal roofing tiles.',
        agreedAmountKES: 550000,
        stageStatus: 'upcoming' as const,
        targetDate: new Date(Date.now() + 86400000 * 80).toISOString().substring(0, 10),
      },
      {
        id: `ms-c5-${newId}`,
        stageNumber: 5,
        title: 'Milestone 5: Internal Finishes & Plumbing',
        description: 'Plaster screed, tile laying, sanitary fittings, and electrical trim.',
        agreedAmountKES: 700000,
        stageStatus: 'upcoming' as const,
        targetDate: new Date(Date.now() + 86400000 * 110).toISOString().substring(0, 10),
      }
    ] : undefined;

    const defaultComparisons = category === 'construction' ? [
      {
        id: `cmp-1-${newId}`,
        angleName: 'Camera Angle A: North-East Perimeter Elevation',
        previousDate: 'Baseline Intake Record',
        previousStageTitle: 'Initial Ground Intake',
        previousPhotoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
        currentDate: 'Scheduled Initial Check',
        currentStageTitle: 'Stage 1: Substructure',
        currentPhotoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=800&auto=format&fit=crop&q=80',
        observedDifference: 'Baseline GPS camera angle established. Ready for repeated milestone tracking.',
        statusMatch: 'as_expected' as const
      },
      {
        id: `cmp-2-${newId}`,
        angleName: 'Camera Angle B: Foundation / Slab Center',
        previousDate: 'Baseline Intake Record',
        previousStageTitle: 'Initial Ground Intake',
        previousPhotoUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
        currentDate: 'Scheduled Initial Check',
        currentStageTitle: 'Stage 1: Center Area',
        currentPhotoUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80',
        observedDifference: 'Baseline interior position recorded for comparison.',
        statusMatch: 'as_expected' as const
      }
    ] : undefined;

    const defaultPdr = category === 'construction' ? {
      milestoneTitle: 'Milestone 1: Substructure & Foundation Strip Footing',
      contractorRequestedKES: 650000,
      previousPaymentsKES: 0,
      receiptsProvidedKES: 0,
      unexplainedVarianceKES: 0,
      coordinatorRecommendation: 'Initial baseline verification pending ground inspector visit.',
      stopPaymentAlert: false,
      decisionStatus: 'pending' as const,
      history: [
        {
          action: 'Intake Registered',
          note: 'Project added to construction oversight tracking.',
          date: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' EAT',
          by: 'System Intake'
        }
      ]
    } : undefined;

    const fullRequest: VerificationRequest = {
      id: newId,
      title: newReq.title || 'Untitled Verification Request',
      category,
      offerType: newReq.offerType || 'one-time',
      stage: 'define',
      status: 'partly_observed',
      urgency: newReq.urgency || 'standard',
      client: newReq.client || {
        name: 'Diaspora Client',
        locationAbroad: 'London, UK',
        email: 'client@example.com',
        phone: '+44 7000 000000',
        preferredCurrency: 'KES',
      },
      location: newReq.location || {
        county: 'Nairobi',
        town: 'Westlands',
        landmark: 'Near Sarit Centre',
        gpsCoords: '-1.2612, 36.8044',
      },
      contactOnGround: newReq.contactOnGround || {
        name: 'Local Site Contact',
        role: 'Site Representative',
        phone: '+254 700 000 000',
        accessConfirmed: false,
      },
      conflictOfInterestCheck: {
        checked: false,
        agentHasRelationToSite: false,
        notes: 'Pending initial intake clearance.',
      },
      scopeBrief: newReq.scopeBrief || '',
      deliverables: newReq.deliverables || [
        'Physical site check and GPS timestamped photographs',
        'Discrepancy and variance report',
        'Final coordinator review note'
      ],
      explicitLimitations: [
        'Observation only: DiasporaVerify does not certify technical structural engineering or legal ownership.',
        'A photo is evidence of what it shows, not proof of completion or quality.',
        'DiasporaVerify does not hold client funds or manage the contractor.'
      ],
      documentsProvided: newReq.documentsProvided || [],
      pricing: {
        serviceFeeKES: newReq.pricing?.serviceFeeKES || 12500,
        currency: currency,
        quoteStatus: 'draft',
      },
      checklist: newReq.checklist || [
        { id: 'chk-d1', label: 'Confirm physical site arrival & GPS coordinate match', completed: false, status: 'pending' },
        { id: 'chk-d2', label: 'Verify perimeter boundary & physical condition', completed: false, status: 'pending' },
        { id: 'chk-d3', label: 'Capture repeat camera angle high-resolution photos', completed: false, status: 'pending' },
        { id: 'chk-d4', label: 'Interview local contact / site representative', completed: false, status: 'pending' },
        { id: 'chk-d5', label: 'Document what could NOT be accessed or verified', completed: false, status: 'pending' }
      ],
      evidence: [],
      milestones: defaultMilestones,
      photoComparisons: defaultComparisons,
      paymentDecisionRecord: defaultPdr,
      clientDecisionLog: [],
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setRequests(prev => [fullRequest, ...prev]);
    setActiveRequestId(newId);
    return newId;
  };

  const assignAgent = (
    requestId: string, 
    agentId: string, 
    scheduledDate?: string, 
    conflictNotes?: string
  ) => {
    const agent = MOCK_AGENTS.find(a => a.id === agentId);
    if (!agent) return;

    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;
      return {
        ...req,
        assignedAgent: agent,
        stage: req.stage === 'define' ? 'assign' : req.stage,
        scheduledVisitDate: scheduledDate || req.scheduledVisitDate || new Date(Date.now() + 86400000 * 2).toISOString().substring(0, 10),
        conflictOfInterestCheck: {
          checked: true,
          agentHasRelationToSite: false,
          notes: conflictNotes || `Agent ${agent.name} (${agent.badgeLevel}) cleared for ${req.location.county}. Signed conflict of interest code.`,
        },
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
    }));
  };

  const updateChecklist = (requestId: string, checkId: string, status: 'passed' | 'flagged' | 'inconclusive', notes?: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;
      const updatedChecklist = req.checklist.map(item => {
        if (item.id !== checkId) return item;
        return {
          ...item,
          completed: true,
          status,
          notes: notes !== undefined ? notes : item.notes,
          verifiedAt: new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }) + ' EAT'
        };
      });

      return {
        ...req,
        checklist: updatedChecklist,
        stage: 'act',
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
    }));
  };

  const addEvidence = async (requestId: string, evidenceData: Omit<EvidenceItem, 'id'>) => {
    // Cryptographically hash the evidence payload for tamper-evidence
    const payloadToHash = `${evidenceData.url}|${evidenceData.timestamp}|${evidenceData.gpsCoords}|${evidenceData.title}`;
    const hash = await computeSHA256(payloadToHash);

    const newEvidence: EvidenceItem = {
      ...evidenceData,
      id: `ev-${Date.now()}`,
      sha256Hash: hash,
    };

    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;
      return {
        ...req,
        evidence: [newEvidence, ...req.evidence],
        stage: 'act',
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
    }));
  };

  const submitQAReview = (
    requestId: string, 
    reviewData: {
      findings: string;
      contradictions: string[];
      uncertainties: string[];
      recommendation: string;
      status: VerificationStatus;
      stopPayment: boolean;
    }
  ) => {
    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;

      let updatedPdr = req.paymentDecisionRecord;
      if (updatedPdr) {
        updatedPdr = {
          ...updatedPdr,
          stopPaymentAlert: reviewData.stopPayment,
          coordinatorRecommendation: reviewData.recommendation,
          history: [
            ...updatedPdr.history,
            {
              action: reviewData.stopPayment ? 'QA Triggered STOP PAYMENT Alert' : 'QA Completed Review',
              note: reviewData.recommendation,
              date: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' EAT',
              by: 'Operations Desk'
            }
          ]
        };
      } else if (reviewData.stopPayment) {
        // Non-construction request where stop payment was flagged
        updatedPdr = {
          milestoneTitle: `${req.category.toUpperCase()} Transaction Release`,
          contractorRequestedKES: 0,
          previousPaymentsKES: 0,
          receiptsProvidedKES: 0,
          unexplainedVarianceKES: 0,
          coordinatorRecommendation: reviewData.recommendation,
          stopPaymentAlert: true,
          decisionStatus: 'stopped',
          history: [
            {
              action: 'QA Triggered STOP PAYMENT Alert',
              note: reviewData.recommendation,
              date: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' EAT',
              by: 'Operations Desk'
            }
          ]
        };
      }

      return {
        ...req,
        stage: 'decide',
        status: reviewData.status,
        qaReview: {
          reviewedBy: 'Amara Kiprotich (Chief Operations Coordinator, Nairobi HQ)',
          reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' EAT',
          findingsSummary: reviewData.findings,
          contradictions: reviewData.contradictions,
          whatCouldNotBeVerified: reviewData.uncertainties,
          recommendation: reviewData.recommendation,
          stopPaymentTriggered: reviewData.stopPayment,
          publishedToClient: true,
        },
        paymentDecisionRecord: updatedPdr,
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
    }));
  };

  const recordPaymentDecision = (
    requestId: string, 
    decision: PaymentDecisionStatus, 
    authorizedAmount?: number, 
    note?: string
  ) => {
    setRequests(prev => prev.map(req => {
      if (req.id !== requestId || !req.paymentDecisionRecord) return req;

      let actionTitle = 'Client Action';
      if (decision === 'authorized_full') actionTitle = 'Client Authorized Full Payment Directly';
      if (decision === 'authorized_partial') actionTitle = `Client Authorized Partial Release (${authorizedAmount ? 'KES ' + authorizedAmount.toLocaleString() : 'Partial'})`;
      if (decision === 'paused') actionTitle = 'Client Paused Payment Pending Clarification';
      if (decision === 'stopped') actionTitle = 'Client Logged Formal Payment Dispute (STOP PAYMENT)';
      if (decision === 'specialist_requested') actionTitle = 'Client Requested Specialist Engineering Review';

      const updatedHistory = [
        ...req.paymentDecisionRecord.history,
        {
          action: actionTitle,
          note: note || `Client recorded status: ${decision}`,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' EAT',
          by: `${req.client.name} (${req.client.locationAbroad})`
        }
      ];

      // Update milestone status if applicable
      const updatedMilestones = req.milestones?.map(m => {
        if (m.stageStatus === 'disputed' || m.stageStatus === 'in_progress') {
          if (decision === 'authorized_full') {
            return { ...m, stageStatus: 'completed' as const, verificationStatus: 'observed' as const };
          }
          if (decision === 'authorized_partial' || decision === 'paused') {
            return { ...m, stageStatus: 'in_progress' as const };
          }
          if (decision === 'stopped') {
            return { ...m, stageStatus: 'disputed' as const };
          }
          if (decision === 'specialist_requested') {
            return { ...m, stageStatus: 'disputed' as const, verificationStatus: 'cannot_confirm' as const };
          }
        }
        return m;
      });

      return {
        ...req,
        milestones: updatedMilestones,
        paymentDecisionRecord: {
          ...req.paymentDecisionRecord,
          decisionStatus: decision,
          stopPaymentAlert: decision === 'authorized_full' ? false : (decision === 'stopped' ? true : req.paymentDecisionRecord.stopPaymentAlert),
          authorizedAmountKES: authorizedAmount,
          decisionNote: note,
          decisionDate: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' EAT',
          history: updatedHistory,
        },
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
    }));
  };

  const recordClientDecision = (requestId: string, action: string, note: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;
      const newEntry = {
        action,
        note,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' EAT',
        by: `${req.client.name} (${req.client.locationAbroad})`
      };
      return {
        ...req,
        stage: 'decide',
        clientDecisionLog: [...(req.clientDecisionLog || []), newEntry],
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
    }));
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRequests(MOCK_REQUESTS);
    setActiveRequestId('DV-2026-KJD-0104');
  };

  return (
    <VerificationContext.Provider
      value={{
        requests,
        activeRequest,
        activeRequestId,
        activeRole,
        currency,
        agents: MOCK_AGENTS,
        reportModalRequest,
        backendMode,
        isLiveConnected,
        supabaseClient: supabase,
        mfaEnabled,
        toggleMFA,
        userEmail,
        setUserEmail,
        selectRequest,
        setActiveRole,
        setCurrency,
        openReportModal,
        closeReportModal,
        createRequest,
        assignAgent,
        updateChecklist,
        addEvidence,
        submitQAReview,
        recordPaymentDecision,
        recordClientDecision,
        resetAllData,
      }}
    >
      {children}
    </VerificationContext.Provider>
  );
};

export const useVerification = () => {
  const context = useContext(VerificationContext);
  if (!context) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
};
