import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { 
  VerificationRequest, 
  FieldAgent, 
  ActiveRole, 
  CurrencyCode, 
  PaymentDecisionStatus, 
  VerificationStatus, 
  EvidenceItem,
  DetailedRequestStatus,
  PropertyRecord,
  DisputeRecord,
  AuditLogEntry,
  NotificationItem,
  OrganizationRecord,
  CheckInRecord
} from '../types';
import type { AuthenticatedUser, ViewAsSession, UserRole } from '../auth/authorization';
import { normalizeRole } from '../auth/authorization';
import { DEMO_USERS, ADDITIONAL_DEMO_USERS, AUTH_USER_KEY, REGISTERED_USERS_KEY } from '../auth/demoUsers';
export { DEMO_USERS, ADDITIONAL_DEMO_USERS, AUTH_USER_KEY, REGISTERED_USERS_KEY };
import { MOCK_REQUESTS, MOCK_AGENTS, MOCK_DISPUTES, MOCK_ORGANIZATIONS } from '../data/mockData';
import { MOCK_PROPERTIES } from '../services/propertyService';
import { INITIAL_AUDIT_LOGS, createAuditLog } from '../services/auditService';
import { INITIAL_NOTIFICATIONS, createNotification } from '../services/notificationService';
import { canTransition, mapStatusToStage } from '../services/stateMachine';
import { calculateConfidenceScore } from '../services/confidenceScorer';
import { calculateFeeBreakdown } from '../services/paymentService';
import { supabase, isSupabaseConfigured, computeSHA256, rateLimiter } from '../lib/supabase';

interface VerificationContextType {
  requests: VerificationRequest[];
  clientRequests: VerificationRequest[];
  agentRequests: VerificationRequest[];
  activeRequest: VerificationRequest | undefined;
  activeRequestId: string;
  activeRole: ActiveRole;
  currency: CurrencyCode;
  agents: FieldAgent[];
  currentUser: AuthenticatedUser | null;
  isAuthenticated: boolean;
  setCurrentUser: (user: AuthenticatedUser | null) => void;
  login: (user: AuthenticatedUser, remember?: boolean) => void;
  logout: () => void;
  registerUser: (data: {
    name: string;
    email: string;
    phone: string;
    locationAbroad: string;
    password?: string;
    role?: UserRole;
  }) => AuthenticatedUser;
  viewAsSession: ViewAsSession;
  startViewAs: (role: 'client' | 'agent', targetId: string, targetName: string, targetEmail?: string) => void;
  exitViewAs: () => void;
  commandMenuOpen: boolean;
  setCommandMenuOpen: (open: boolean) => void;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
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
  acceptAssignment: (requestId: string) => void;
  rejectAssignment: (requestId: string, reason: string) => void;
  advanceRequestStatus: (requestId: string, targetStatus: DetailedRequestStatus, reason?: string) => { success: boolean; error?: string };
  performCheckIn: (requestId: string, gpsCoords: string, notes?: string) => Promise<{ success: boolean; distanceMeters: number; message: string }>;
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
      recommendationType?: 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'UNABLE_TO_VERIFY' | 'REQUIRES_FURTHER_INVESTIGATION';
    }
  ) => void;
  recordPaymentDecision: (
    requestId: string, 
    decision: PaymentDecisionStatus, 
    authorizedAmount?: number, 
    note?: string
  ) => void;
  recordClientDecision: (requestId: string, action: string, note: string) => void;
  payInvoice: (requestId: string, method?: string) => Promise<{ success: boolean; txRef: string }>;
  
  // Properties Portfolio
  properties: PropertyRecord[];
  addProperty: (property: Omit<PropertyRecord, 'id' | 'inspectionHistoryCount'>) => string;
  updatePropertyInspection: (propertyId: string, plan: 'Monthly' | 'Quarterly' | 'Biannual' | 'On-Demand') => void;

  // Disputes Resolution Desk
  disputes: DisputeRecord[];
  createDispute: (requestId: string, reason: DisputeRecord['reason'], description: string) => string;
  resolveDispute: (disputeId: string, adminNotes: string, resolutionAction: string) => void;

  // Audit Logs
  auditLogs: AuditLogEntry[];

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Corporate Organizations
  organizations: OrganizationRecord[];
  activeOrgId: string;
  setActiveOrgId: (id: string) => void;

  resetAllData: () => void;
}

const STORAGE_KEY = 'diaspora_verify_requests_v2';
const ROLE_KEY = 'diaspora_verify_role_v2';
const CURRENCY_KEY = 'diaspora_verify_curr_v2';
const MFA_KEY = 'diaspora_verify_mfa_v2';
const PROPERTIES_KEY = 'diaspora_verify_properties_v2';
const DISPUTES_KEY = 'diaspora_verify_disputes_v2';

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export const VerificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize Requests with calculated confidence scores and requestStatus
  const [requests, setRequests] = useState<VerificationRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached requests', e);
      }
    }
    return MOCK_REQUESTS.map(req => {
      const status: DetailedRequestStatus = 
        req.qaReview?.publishedToClient ? 'REPORT_READY' :
        req.evidence?.length > 0 ? 'UNDER_REVIEW' :
        req.assignedAgent ? 'ACCEPTED' : 'PAID';
      
      const enrichedReq: VerificationRequest = {
        ...req,
        requestStatus: req.requestStatus || status,
        pricing: {
          ...req.pricing,
          feeBreakdown: calculateFeeBreakdown(req.category, req.urgency, req.location.county, req.pricing.currency)
        }
      };
      enrichedReq.confidenceScore = calculateConfidenceScore(enrichedReq);
      return enrichedReq;
    });
  });

  const [activeRequestId, setActiveRequestId] = useState<string>('DV-2026-KJD-0104');
  
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(() => {
    const savedAuth = localStorage.getItem(AUTH_USER_KEY);
    if (savedAuth) {
      try {
        return JSON.parse(savedAuth);
      } catch (e) {
        console.error('Failed to parse cached auth user', e);
      }
    }
    return null;
  });

  const isAuthenticated = Boolean(currentUser);

  const [activeRole, setActiveRoleState] = useState<ActiveRole>(() => {
    if (currentUser) return currentUser.role;
    const savedRole = localStorage.getItem(ROLE_KEY) as ActiveRole;
    return savedRole || 'client';
  });

  const [viewAsSession, setViewAsSession] = useState<ViewAsSession>({
    active: false,
    viewRole: 'client',
    targetId: '',
    targetName: '',
    targetEmail: '',
    startedAt: '',
  });

  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const login = useCallback((user: AuthenticatedUser, remember: boolean = true) => {
    setCurrentUser(user);
    setActiveRoleState(user.role);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    localStorage.setItem(ROLE_KEY, user.role);
    if (remember) {
      localStorage.setItem('diaspora_verify_remember_v2', 'true');
    }
    const log = createAuditLog(
      'USER_LOGGED_IN',
      { id: user.id, name: user.name, role: user.role },
      'auth_session',
      user.id,
      { email: user.email, role: user.role, timestamp: new Date().toISOString() }
    );
    setAuditLogs(prev => [log, ...prev]);
  }, []);

  const logout = useCallback(() => {
    if (currentUser) {
      const log = createAuditLog(
        'USER_LOGGED_OUT',
        { id: currentUser.id, name: currentUser.name, role: currentUser.role },
        'auth_session',
        currentUser.id,
        { email: currentUser.email, timestamp: new Date().toISOString() }
      );
      setAuditLogs(prev => [log, ...prev]);
    }
    setCurrentUser(null);
    setViewAsSession({
      active: false,
      viewRole: 'client',
      targetId: '',
      targetName: '',
      targetEmail: '',
      startedAt: '',
    });
    localStorage.removeItem(AUTH_USER_KEY);
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
    }
  }, [currentUser]);

  const registerUser = useCallback((data: {
    name: string;
    email: string;
    phone: string;
    locationAbroad: string;
    password?: string;
    role?: UserRole;
  }): AuthenticatedUser => {
    const role: UserRole = data.role ? normalizeRole(data.role) : 'client';
    const newUser: AuthenticatedUser = {
      id: `usr-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      locationAbroad: data.locationAbroad.trim(),
      role,
      clientId: role === 'client' ? `client-${Date.now()}` : undefined,
      agentId: role === 'agent' ? `agt-${Date.now()}` : undefined,
      mfaEnabled: false,
    };

    try {
      const existing = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
      const updated = [...existing.filter((u: any) => u.email !== newUser.email), { ...newUser, password: data.password }];
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    login(newUser);
    return newUser;
  }, [login]);

  // Sync Supabase Auth Session if available
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && !currentUser) {
        const userRole = normalizeRole((session.user.user_metadata?.role as string) || 'client');
        const authUser: AuthenticatedUser = {
          id: session.user.id,
          email: session.user.email || 'user@diasporaverify.demo',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Authenticated User',
          role: userRole,
          clientId: userRole === 'client' ? session.user.id : undefined,
          agentId: userRole === 'agent' ? session.user.id : undefined,
          phone: session.user.phone || session.user.user_metadata?.phone,
          locationAbroad: session.user.user_metadata?.locationAbroad || 'Diaspora',
          mfaEnabled: false,
        };
        login(authUser);
      }
    }).catch(() => {});

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user && !currentUser) {
        const userRole = normalizeRole((session.user.user_metadata?.role as string) || 'client');
        const authUser: AuthenticatedUser = {
          id: session.user.id,
          email: session.user.email || 'user@diasporaverify.demo',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Authenticated User',
          role: userRole,
          clientId: userRole === 'client' ? session.user.id : undefined,
          agentId: userRole === 'agent' ? session.user.id : undefined,
          phone: session.user.phone || session.user.user_metadata?.phone,
          locationAbroad: session.user.user_metadata?.locationAbroad || 'Diaspora',
          mfaEnabled: false,
        };
        login(authUser);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [currentUser, login]);

  const startViewAs = (role: 'client' | 'agent', targetId: string, targetName: string, targetEmail: string = '') => {
    if (!currentUser) return;
    const session: ViewAsSession = {
      active: true,
      viewRole: role,
      targetId,
      targetName,
      targetEmail,
      startedAt: new Date().toISOString()
    };
    setViewAsSession(session);
    const log = createAuditLog(
      'ADMIN_VIEW_AS_STARTED',
      { id: currentUser.id, name: currentUser.name, role: 'admin' },
      role === 'client' ? 'client_experience' : 'agent_experience',
      targetId,
      { targetName, targetEmail, startedAt: session.startedAt }
    );
    setAuditLogs(prev => [log, ...prev]);
  };

  const exitViewAs = () => {
    if (viewAsSession.active && currentUser) {
      const log = createAuditLog(
        'ADMIN_VIEW_AS_ENDED',
        { id: currentUser.id, name: currentUser.name, role: 'admin' },
        viewAsSession.viewRole === 'client' ? 'client_experience' : 'agent_experience',
        viewAsSession.targetId,
        { targetName: viewAsSession.targetName, endedAt: new Date().toISOString() }
      );
      setAuditLogs(prev => [log, ...prev]);
    }
    setViewAsSession({
      active: false,
      viewRole: 'client',
      targetId: '',
      targetName: '',
      targetEmail: '',
      startedAt: '',
    });
  };

  const setActiveRole = (role: ActiveRole) => {
    setActiveRoleState(role);
    const norm = normalizeRole(role);
    let targetUser: AuthenticatedUser = currentUser || DEMO_USERS[norm];
    if (norm === 'admin') {
      targetUser = currentUser?.role === 'admin' ? currentUser : DEMO_USERS.admin;
    } else if (norm === 'agent') {
      targetUser = currentUser?.role === 'agent' ? currentUser : DEMO_USERS.agent;
      setViewAsSession({ active: false, viewRole: 'client', targetId: '', targetName: '', targetEmail: '', startedAt: '' });
    } else {
      targetUser = currentUser?.role === 'client' ? currentUser : DEMO_USERS.client;
      setViewAsSession({ active: false, viewRole: 'client', targetId: '', targetName: '', targetEmail: '', startedAt: '' });
    }

    if (currentUser) {
      setCurrentUser(targetUser);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(targetUser));
      const log = createAuditLog(
        'ROLE_SWITCHED',
        { id: currentUser.id, name: currentUser.name, role: activeRole },
        'user_session',
        role,
        { previousRole: activeRole, nextRole: role }
      );
      setAuditLogs(prev => [log, ...prev]);
    }
  };

  const [currency, setCurrency] = useState<CurrencyCode>(() => {
    return (localStorage.getItem(CURRENCY_KEY) as CurrencyCode) || 'KES';
  });
  const [mfaEnabled, setMfaEnabled] = useState<boolean>(() => {
    return localStorage.getItem(MFA_KEY) === 'true';
  });
  const [userEmail, setUserEmail] = useState<string>('david.mwangi.uk@gmail.com');
  const [backendMode] = useState<'supabase' | 'local'>(isSupabaseConfigured ? 'supabase' : 'local');
  const [isLiveConnected] = useState<boolean>(isSupabaseConfigured);
  const [reportModalRequest, setReportModalRequest] = useState<VerificationRequest | null>(null);

  // Additional 2.0 Entities State
  const [properties, setProperties] = useState<PropertyRecord[]>(() => {
    const saved = localStorage.getItem(PROPERTIES_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return MOCK_PROPERTIES;
  });

  const [disputes, setDisputes] = useState<DisputeRecord[]>(() => {
    const saved = localStorage.getItem(DISPUTES_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return MOCK_DISPUTES;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [organizations] = useState<OrganizationRecord[]>(MOCK_ORGANIZATIONS);
  const [activeOrgId, setActiveOrgId] = useState<string>('org-001');

  const toggleMFA = useCallback(() => {
    setMfaEnabled(prev => {
      const next = !prev;
      localStorage.setItem(MFA_KEY, String(next));
      return next;
    });
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(ROLE_KEY, activeRole);
  }, [activeRole]);

  useEffect(() => {
    localStorage.setItem(CURRENCY_KEY, currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem(PROPERTIES_KEY, JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem(DISPUTES_KEY, JSON.stringify(disputes));
  }, [disputes]);

  const activeRequest = requests.find(r => r.id === activeRequestId) || requests[0];

  const clientRequests = React.useMemo(() => {
    if (!currentUser) return [];
    const targetEmail = viewAsSession.active && viewAsSession.viewRole === 'client'
      ? viewAsSession.targetEmail
      : normalizeRole(activeRole) === 'client'
      ? (currentUser.email || userEmail)
      : userEmail;

    return requests.filter(r => 
      r.client?.email?.toLowerCase() === targetEmail?.toLowerCase() ||
      ((currentUser.email?.toLowerCase().includes('jane.doe') || currentUser.email?.toLowerCase().includes('david.mwangi')) &&
       (r.client?.email?.toLowerCase().includes('david.mwangi') || r.client?.name?.toLowerCase().includes('david mwangi'))) ||
      (viewAsSession.active && viewAsSession.viewRole === 'client' && r.client?.name?.toLowerCase() === viewAsSession.targetName?.toLowerCase())
    );
  }, [requests, viewAsSession, activeRole, currentUser, userEmail]);

  const agentRequests = React.useMemo(() => {
    if (!currentUser) return [];
    const targetAgentId = viewAsSession.active && viewAsSession.viewRole === 'agent'
      ? viewAsSession.targetId
      : normalizeRole(activeRole) === 'agent'
      ? (currentUser.agentId || 'agt-01')
      : 'agt-01';

    return requests.filter(r => 
      r.assignedAgent?.id === targetAgentId ||
      ((currentUser.agentId === 'agt-018' || currentUser.email?.toLowerCase().includes('brian.omondi')) &&
       (r.assignedAgent?.id === 'agt-01' || r.assignedAgent?.id === 'agt-018')) ||
      (r.assignedAgent?.email?.toLowerCase() === currentUser.email?.toLowerCase()) ||
      (viewAsSession.active && viewAsSession.viewRole === 'agent' && r.assignedAgent?.name?.toLowerCase() === viewAsSession.targetName?.toLowerCase())
    );
  }, [requests, viewAsSession, activeRole, currentUser]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandMenuOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const selectRequest = (id: string) => {
    setActiveRequestId(id);
  };

  const openReportModal = (request: VerificationRequest) => {
    setReportModalRequest(request);
  };

  const closeReportModal = () => {
    setReportModalRequest(null);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // State Machine Transition Handler
  const advanceRequestStatus = (
    requestId: string, 
    targetStatus: DetailedRequestStatus, 
    reason?: string
  ): { success: boolean; error?: string } => {
    const target = requests.find(r => r.id === requestId);
    if (!target) return { success: false, error: 'Request not found' };

    const currentStatus = target.requestStatus || 'DRAFT';
    if (!canTransition(currentStatus, targetStatus)) {
      return { 
        success: false, 
        error: `Cannot transition from ${currentStatus} to ${targetStatus}. Follow official state machine.` 
      };
    }

    const newStage = mapStatusToStage(targetStatus);

    setRequests(prev => prev.map(r => {
      if (r.id !== requestId) return r;
      const updated: VerificationRequest = {
        ...r,
        requestStatus: targetStatus,
        stage: newStage,
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      updated.confidenceScore = calculateConfidenceScore(updated);
      return updated;
    }));

    // Log to immutable audit log
    const log = createAuditLog(
      `STATUS_TRANSITION_TO_${targetStatus}`,
      { id: 'usr-current', name: activeRole === 'operations' ? 'Operations Desk' : 'Active User', role: activeRole },
      'verification_requests',
      requestId,
      { previousStatus: currentStatus, newStatus: targetStatus, reason }
    );
    setAuditLogs(prev => [log, ...prev]);

    // Dispatch notification
    const notif = createNotification(
      'all',
      `Request ${requestId} status updated`,
      `Assignment transitioned from ${currentStatus} to ${targetStatus}.${reason ? ` Reason: ${reason}` : ''}`,
      'info',
      requestId,
      `/request/${requestId}`
    );
    setNotifications(prev => [notif, ...prev]);

    return { success: true };
  };

  // Check-In Telemetry Execution
  const performCheckIn = async (
    requestId: string, 
    gpsCoords: string, 
    notes?: string
  ): Promise<{ success: boolean; distanceMeters: number; message: string }> => {
    const target = requests.find(r => r.id === requestId);
    if (!target) return { success: false, distanceMeters: 9999, message: 'Request not found' };

    const checkRecord: CheckInRecord = {
      id: `chk-${Date.now()}`,
      requestId,
      agentId: target.assignedAgent?.id || 'agt-01',
      agentName: target.assignedAgent?.name || 'Assigned Field Verifier',
      timestamp: new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }) + ' EAT',
      gpsCoords,
      accuracyMeters: 4.5,
      targetCoords: target.location.gpsCoords,
      distanceMeters: 12,
      verifiedWithinRange: true,
      notes: notes || 'Physical ground arrival recorded via mobile GPS sensor.'
    };

    setRequests(prev => prev.map(r => {
      if (r.id !== requestId) return r;
      const updated: VerificationRequest = {
        ...r,
        checkInRecord: checkRecord,
        requestStatus: 'ON_SITE',
        stage: 'act',
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      updated.confidenceScore = calculateConfidenceScore(updated);
      return updated;
    }));

    // Audit Log
    setAuditLogs(prev => [
      createAuditLog(
        'AGENT_CHECKED_IN',
        { id: checkRecord.agentId, name: checkRecord.agentName, role: 'field_agent' },
        'assignment_checkins',
        requestId,
        { gpsCoords, targetCoords: target.location.gpsCoords, verifiedWithinRange: true }
      ),
      ...prev
    ]);

    // Notification
    setNotifications(prev => [
      createNotification(
        'client',
        'Field Agent Checked In on Site',
        `Agent ${checkRecord.agentName} arrived at ${target.location.town}, ${target.location.county} and verified GPS presence.`,
        'success',
        requestId,
        `/request/${requestId}`
      ),
      ...prev
    ]);

    return {
      success: true,
      distanceMeters: 12,
      message: `Check-in recorded. Verified within 12 meters of ${target.location.landmark}.`
    };
  };

  const acceptAssignment = (requestId: string) => {
    advanceRequestStatus(requestId, 'ACCEPTED', 'Field agent accepted scheduled mission.');
  };

  const rejectAssignment = (requestId: string, reason: string) => {
    advanceRequestStatus(requestId, 'AWAITING_AGENT', `Agent declined: ${reason}. Returned to triage pool.`);
  };

  const payInvoice = async (requestId: string, method: string = 'M-Pesa STK Push'): Promise<{ success: boolean; txRef: string }> => {
    const txRef = `TXN-${Date.now().toString().slice(-8)}`;
    
    setRequests(prev => prev.map(r => {
      if (r.id !== requestId) return r;
      const updated: VerificationRequest = {
        ...r,
        pricing: {
          ...r.pricing,
          quoteStatus: 'paid'
        },
        requestStatus: 'AWAITING_AGENT',
        stage: 'assign',
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      updated.confidenceScore = calculateConfidenceScore(updated);
      return updated;
    }));

    setAuditLogs(prev => [
      createAuditLog(
        'PAYMENT_RECEIVED',
        { id: 'usr-client', name: 'Client via Payment Gateway', role: 'client' },
        'invoices',
        requestId,
        { method, txRef, status: 'PAID' }
      ),
      ...prev
    ]);

    setNotifications(prev => [
      createNotification(
        'operations',
        'Payment Received & Verified',
        `Client paid service fee for ${requestId} via ${method}. Ready for ground agent assignment.`,
        'success',
        requestId,
        `/request/${requestId}`
      ),
      ...prev
    ]);

    return { success: true, txRef };
  };

  const createRequest = (newReq: Partial<VerificationRequest>): string => {
    const rateCheck = rateLimiter.check('create_request', 25, 60000);
    if (!rateCheck.allowed) {
      console.warn(`Intake rate limit active: Retry after ${rateCheck.retryAfterSec} seconds`);
    }

    const countyCode = (newReq.location?.county || 'NBI').substring(0, 3).toUpperCase();
    const newId = `DV-2026-${countyCode}-${Math.floor(1000 + Math.random() * 9000)}`;
    const category = newReq.category || 'construction';
    const urgency = newReq.urgency || 'standard';
    const county = newReq.location?.county || 'Nairobi';

    const feeBreakdown = calculateFeeBreakdown(category, urgency, county, currency);

    // Baseline checklists per service category
    const defaultChecklists: Record<string, { id: string; label: string; completed: boolean; status: 'pending' }[]> = {
      property: [
        { id: 'chk-pr1', label: 'Verify access road & physical boundary condition', completed: false, status: 'pending' },
        { id: 'chk-pr2', label: 'Locate physical corner concrete cadastral beacons', completed: false, status: 'pending' },
        { id: 'chk-pr3', label: 'Inspect perimeter fence & check for encroachment', completed: false, status: 'pending' },
        { id: 'chk-pr4', label: 'Observe power grid & water utility proximity', completed: false, status: 'pending' },
        { id: 'chk-pr5', label: 'Interview adjacent plot neighbor regarding dispute history', completed: false, status: 'pending' }
      ],
      business: [
        { id: 'chk-bz1', label: 'Verify physical storefront existence & operating signage', completed: false, status: 'pending' },
        { id: 'chk-bz2', label: 'Observe physical business activity & customer foot traffic', completed: false, status: 'pending' },
        { id: 'chk-bz3', label: 'Conduct physical inventory count of claimed assets/stock', completed: false, status: 'pending' },
        { id: 'chk-bz4', label: 'Inspect displayed County Business Permit & KRA PIN', completed: false, status: 'pending' },
        { id: 'chk-bz5', label: 'Document verified staff presence vs claimed headcount', completed: false, status: 'pending' }
      ],
      vehicle: [
        { id: 'chk-vh1', label: 'Match physical VIN plate and engine stamping with paperwork', completed: false, status: 'pending' },
        { id: 'chk-vh2', label: 'Digital paint gauge thickness scan across panels for body filler', completed: false, status: 'pending' },
        { id: 'chk-vh3', label: 'Odometer reading verification & dashboard warning check', completed: false, status: 'pending' },
        { id: 'chk-vh4', label: 'Tyre tread depth & underbody chassis inspection', completed: false, status: 'pending' },
        { id: 'chk-vh5', label: 'Engine cold start test & transmission selector test', completed: false, status: 'pending' }
      ],
      document: [
        { id: 'chk-dc1', label: 'Physical visit to issuing institution/registry premises', completed: false, status: 'pending' },
        { id: 'chk-dc2', label: 'Inspect original physical document presented by counterparty', completed: false, status: 'pending' },
        { id: 'chk-dc3', label: 'Confirm file reference number in physical registry index', completed: false, status: 'pending' },
        { id: 'chk-dc4', label: 'Photograph official stamps, seal embossment, and signatures', completed: false, status: 'pending' },
        { id: 'chk-dc5', label: 'Record limitations: Document inspected, not statutory apostille', completed: false, status: 'pending' }
      ],
      person: [
        { id: 'chk-ps1', label: 'Confirm physical meeting & visual presence of subject', completed: false, status: 'pending' },
        { id: 'chk-ps2', label: 'Inspect Kenya National ID or Passport presented physically', completed: false, status: 'pending' },
        { id: 'chk-ps3', label: 'Conduct structured brief questionnaire & observe welfare', completed: false, status: 'pending' },
        { id: 'chk-ps4', label: 'Verify living/residential premise address on the ground', completed: false, status: 'pending' },
        { id: 'chk-ps5', label: 'Record safeguarding notes and explicit recipient consent', completed: false, status: 'pending' }
      ],
      purchase: [
        { id: 'chk-pc1', label: 'Physical presence inspection at supplier warehouse/store', completed: false, status: 'pending' },
        { id: 'chk-pc2', label: 'Serial number and model specification matching with invoice', completed: false, status: 'pending' },
        { id: 'chk-pc3', label: 'Test equipment power-on and functional status', completed: false, status: 'pending' },
        { id: 'chk-pc4', label: 'Inspect packaging integrity, seal, and accessories', completed: false, status: 'pending' },
        { id: 'chk-pc5', label: 'Obtain counterparty delivery note & VAT ETR receipt copy', completed: false, status: 'pending' }
      ],
      field_assistance: [
        { id: 'chk-fa1', label: 'Arrival at specified government office or target venue', completed: false, status: 'pending' },
        { id: 'chk-fa2', label: 'Execute client physical errand / document collection brief', completed: false, status: 'pending' },
        { id: 'chk-fa3', label: 'Obtain official stamped acknowledgment or reception slip', completed: false, status: 'pending' },
        { id: 'chk-fa4', label: 'Securely package items or documents collected on ground', completed: false, status: 'pending' },
        { id: 'chk-fa5', label: 'Provide timestamped handover photo and recipient signature', completed: false, status: 'pending' }
      ]
    };

    const chosenChecklist = defaultChecklists[category] || [
      { id: 'chk-d1', label: 'Confirm physical site arrival & GPS coordinate match', completed: false, status: 'pending' },
      { id: 'chk-d2', label: 'Verify perimeter boundary & physical condition', completed: false, status: 'pending' },
      { id: 'chk-d3', label: 'Capture repeat camera angle high-resolution photos', completed: false, status: 'pending' },
      { id: 'chk-d4', label: 'Interview local contact / site representative', completed: false, status: 'pending' },
      { id: 'chk-d5', label: 'Document what could NOT be accessed or verified', completed: false, status: 'pending' }
    ];

    const fullRequest: VerificationRequest = {
      id: newId,
      title: newReq.title || `${category.toUpperCase()} Verification in ${newReq.location?.town || county}`,
      category,
      offerType: newReq.offerType || 'one-time',
      stage: 'define',
      requestStatus: 'SUBMITTED',
      status: 'partly_observed',
      urgency,
      client: newReq.client || {
        name: 'Diaspora Client',
        locationAbroad: 'London, UK',
        email: userEmail,
        phone: '+44 7700 900000',
        preferredCurrency: currency,
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
        serviceFeeKES: feeBreakdown.totalKES,
        currency,
        quoteStatus: 'draft',
        feeBreakdown
      },
      checklist: chosenChecklist,
      evidence: [],
      clientDecisionLog: [],
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    fullRequest.confidenceScore = calculateConfidenceScore(fullRequest);

    setRequests(prev => [fullRequest, ...prev]);
    setActiveRequestId(newId);

    // Audit Log
    setAuditLogs(prev => [
      createAuditLog(
        'USER_CREATED_REQUEST',
        { id: 'usr-client', name: fullRequest.client.name, role: 'client' },
        'verification_requests',
        newId,
        { category, county, feeKES: feeBreakdown.totalKES }
      ),
      ...prev
    ]);

    // Notification
    setNotifications(prev => [
      createNotification(
        'operations',
        'New Request Submitted',
        `Intake ${newId} created for ${category} verification in ${county}. Awaiting quote acceptance.`,
        'info',
        newId,
        `/request/${newId}`
      ),
      ...prev
    ]);

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
      const updated: VerificationRequest = {
        ...req,
        assignedAgent: agent,
        requestStatus: 'AGENT_ASSIGNED',
        stage: req.stage === 'define' ? 'assign' : req.stage,
        scheduledVisitDate: scheduledDate || req.scheduledVisitDate || new Date(Date.now() + 86400000 * 2).toISOString().substring(0, 10),
        conflictOfInterestCheck: {
          checked: true,
          agentHasRelationToSite: false,
          notes: conflictNotes || `Agent ${agent.name} (${agent.badgeLevel}) cleared for ${req.location.county}. Signed conflict of interest code.`,
        },
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      updated.confidenceScore = calculateConfidenceScore(updated);
      return updated;
    }));

    setAuditLogs(prev => [
      createAuditLog(
        'AGENT_ASSIGNED',
        { id: 'usr-ops', name: 'Amara Kiprotich (Operations)', role: 'operations' },
        'verification_requests',
        requestId,
        { agentId, agentName: agent.name, scheduledDate }
      ),
      ...prev
    ]);

    setNotifications(prev => [
      createNotification(
        'field_agent',
        'New Mission Assigned',
        `You have been assigned to verification ${requestId} in ${requests.find(r => r.id === requestId)?.location.county}. Please review brief and accept.`,
        'info',
        requestId,
        `/request/${requestId}`
      ),
      createNotification(
        'client',
        'Field Agent Assigned',
        `Vetted officer ${agent.name} (${agent.badgeLevel}) has been assigned to your verification with conflict-of-interest clearance.`,
        'info',
        requestId,
        `/request/${requestId}`
      ),
      ...prev
    ]);
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

      const updated: VerificationRequest = {
        ...req,
        checklist: updatedChecklist,
        requestStatus: 'VERIFYING',
        stage: 'act',
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      updated.confidenceScore = calculateConfidenceScore(updated);
      return updated;
    }));
  };

  const addEvidence = async (requestId: string, evidenceData: Omit<EvidenceItem, 'id'>) => {
    const payloadToHash = `${evidenceData.url}|${evidenceData.timestamp}|${evidenceData.gpsCoords}|${evidenceData.title}`;
    const hash = await computeSHA256(payloadToHash);

    const newEvidence: EvidenceItem = {
      ...evidenceData,
      id: `ev-${Date.now()}`,
      sha256Hash: hash,
      uploadStatus: 'uploaded'
    };

    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;
      const updated: VerificationRequest = {
        ...req,
        evidence: [newEvidence, ...req.evidence],
        requestStatus: 'EVIDENCE_SUBMITTED',
        stage: 'act',
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      updated.confidenceScore = calculateConfidenceScore(updated);
      return updated;
    }));

    setAuditLogs(prev => [
      createAuditLog(
        'EVIDENCE_UPLOADED',
        { id: evidenceData.verifiedByAgentId, name: 'Field Agent', role: 'field_agent' },
        'evidence_items',
        newEvidence.id,
        { requestId, type: evidenceData.type, sha256Hash: hash }
      ),
      ...prev
    ]);
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
      recommendationType?: 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'UNABLE_TO_VERIFY' | 'REQUIRES_FURTHER_INVESTIGATION';
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

      const updated: VerificationRequest = {
        ...req,
        stage: 'decide',
        requestStatus: 'REPORT_READY',
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
          recommendationType: reviewData.recommendationType || (reviewData.status === 'observed' ? 'VERIFIED' : reviewData.status === 'partly_observed' ? 'PARTIALLY_VERIFIED' : 'REQUIRES_FURTHER_INVESTIGATION')
        },
        paymentDecisionRecord: updatedPdr,
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      updated.confidenceScore = calculateConfidenceScore(updated);
      return updated;
    }));

    setAuditLogs(prev => [
      createAuditLog(
        reviewData.stopPayment ? 'REPORT_APPROVED_WITH_STOP_PAYMENT' : 'REPORT_APPROVED_AND_PUBLISHED',
        { id: 'usr-ops', name: 'Amara Kiprotich', role: 'operations' },
        'reports',
        requestId,
        { stopPayment: reviewData.stopPayment, status: reviewData.status }
      ),
      ...prev
    ]);

    setNotifications(prev => [
      createNotification(
        'client',
        reviewData.stopPayment ? 'URGENT: Stop-Payment Advisory on Report' : 'Official Verification Report Ready',
        reviewData.stopPayment 
          ? `Nairobi Operations issued a Stop-Payment advisory on ${requestId} due to unverified ground items.` 
          : `Your official on-ground verification report for ${requestId} has been verified and published.`,
        reviewData.stopPayment ? 'alert' : 'success',
        requestId,
        `/request/${requestId}`
      ),
      ...prev
    ]);
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
        requestStatus: 'COMPLETED',
        clientDecisionLog: [...(req.clientDecisionLog || []), newEntry],
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
    }));

    setAuditLogs(prev => [
      createAuditLog(
        'CLIENT_RECORDED_FINAL_DECISION',
        { id: 'usr-client', name: 'Diaspora Client', role: 'client' },
        'verification_requests',
        requestId,
        { action, note }
      ),
      ...prev
    ]);
  };

  // Property Portfolio Functions
  const addProperty = (newProp: Omit<PropertyRecord, 'id' | 'inspectionHistoryCount'>): string => {
    const newId = `prop-${Date.now()}`;
    const fullProp: PropertyRecord = {
      ...newProp,
      id: newId,
      inspectionHistoryCount: 0
    };
    setProperties(prev => [fullProp, ...prev]);
    return newId;
  };

  const updatePropertyInspection = (propertyId: string, plan: 'Monthly' | 'Quarterly' | 'Biannual' | 'On-Demand') => {
    setProperties(prev => prev.map(p => {
      if (p.id !== propertyId) return p;
      return {
        ...p,
        monitoringPlan: plan,
        nextInspectionDate: new Date(Date.now() + 86400000 * (plan === 'Monthly' ? 30 : plan === 'Quarterly' ? 90 : 180)).toISOString().substring(0, 10)
      };
    }));
  };

  // Disputes Resolution Desk Functions
  const createDispute = (requestId: string, reason: DisputeRecord['reason'], description: string): string => {
    const dispId = `disp-${Date.now()}`;
    const target = requests.find(r => r.id === requestId);
    const newDispute: DisputeRecord = {
      id: dispId,
      requestId,
      clientId: 'usr-client',
      clientName: target?.client.name || 'Diaspora Client',
      reason,
      description,
      status: 'OPEN',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    setDisputes(prev => [newDispute, ...prev]);

    // Update request state
    advanceRequestStatus(requestId, 'DISPUTED', `Client filed dispute: ${reason}`);

    setAuditLogs(prev => [
      createAuditLog(
        'DISPUTE_FILED_BY_CLIENT',
        { id: 'usr-client', name: target?.client.name || 'Client', role: 'client' },
        'disputes',
        dispId,
        { requestId, reason, description }
      ),
      ...prev
    ]);

    setNotifications(prev => [
      createNotification(
        'operations',
        'Dispute Opened by Client',
        `Client filed dispute on ${requestId} (${reason}). Requires senior coordinator investigation.`,
        'alert',
        requestId,
        `/disputes`
      ),
      ...prev
    ]);

    return dispId;
  };

  const resolveDispute = (disputeId: string, adminNotes: string, resolutionAction: string) => {
    setDisputes(prev => prev.map(d => {
      if (d.id !== disputeId) return d;
      return {
        ...d,
        status: 'RESOLVED',
        adminNotes,
        resolutionAction,
        resolvedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
    }));

    const targetDisp = disputes.find(d => d.id === disputeId);
    if (targetDisp) {
      advanceRequestStatus(targetDisp.requestId, 'REPORT_READY', `Dispute resolved: ${resolutionAction}`);
    }

    setAuditLogs(prev => [
      createAuditLog(
        'DISPUTE_RESOLVED_BY_ADMIN',
        { id: 'usr-ops', name: 'Amara Kiprotich', role: 'operations' },
        'disputes',
        disputeId,
        { resolutionAction, adminNotes }
      ),
      ...prev
    ]);
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PROPERTIES_KEY);
    localStorage.removeItem(DISPUTES_KEY);
    setRequests(MOCK_REQUESTS);
    setProperties(MOCK_PROPERTIES);
    setDisputes(MOCK_DISPUTES);
    setActiveRequestId('DV-2026-KJD-0104');
  };

  return (
    <VerificationContext.Provider
      value={{
        requests,
        clientRequests,
        agentRequests,
        activeRequest,
        activeRequestId,
        activeRole,
        currency,
        agents: MOCK_AGENTS,
        currentUser,
        isAuthenticated,
        setCurrentUser,
        login,
        logout,
        registerUser,
        viewAsSession,
        startViewAs,
        exitViewAs,
        commandMenuOpen,
        setCommandMenuOpen,
        toastMessage,
        setToastMessage,
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
        acceptAssignment,
        rejectAssignment,
        advanceRequestStatus,
        performCheckIn,
        updateChecklist,
        addEvidence,
        submitQAReview,
        recordPaymentDecision,
        recordClientDecision,
        payInvoice,
        properties,
        addProperty,
        updatePropertyInspection,
        disputes,
        createDispute,
        resolveDispute,
        auditLogs,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        organizations,
        activeOrgId,
        setActiveOrgId,
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
