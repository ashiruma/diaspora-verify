import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useVerification } from '../../context/VerificationContext';
import { 
  AlertTriangle, 
  FileText, 
  Check, 
  Award,
  UserCheck,
  Calendar,
  ShieldCheck,
  X,
  MapPin,
  Clock,
  ShieldAlert,
  Search,
  Filter,
  User
} from '../Icons';
import { StatusBadge, ProcessStageBadge, CategoryIcon } from '../CommonBadges';
import type { VerificationStatus } from '../../types';
import { FORMAT_CURRENCY, hasStopPaymentWarning } from '../../data/mockData';
import { calculateConfidenceScore } from '../../services/confidenceScorer';
import { ROLE_PERMISSIONS } from '../../auth/authorization';

export type OperationsTab = 
  | 'operations' 
  | 'requests' 
  | 'assignments' 
  | 'agents' 
  | 'clients' 
  | 'reports' 
  | 'payments' 
  | 'disputes' 
  | 'analytics' 
  | 'services' 
  | 'settings';

export const OperationsDashboard: React.FC<{ onOpenReport: (req: any) => void }> = ({ onOpenReport }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { 
    requests, 
    agents, 
    submitQAReview, 
    assignAgent,
    currency,
    disputes,
    resolveDispute,
    auditLogs,
    advanceRequestStatus,
    startViewAs
  } = useVerification();

  const [selectedReqId, setSelectedReqId] = useState<string>(requests[0]?.id || '');
  const [activeTab, setActiveTab] = useState<OperationsTab>('operations');

  // Sync activeTab with ?tab= search param
  const tabParam = searchParams.get('tab');
  useEffect(() => {
    if (tabParam === 'requests' || tabParam === 'triage') {
      setActiveTab('requests');
    } else if (tabParam === 'assignments') {
      setActiveTab('assignments');
    } else if (tabParam === 'agents') {
      setActiveTab('agents');
    } else if (tabParam === 'clients') {
      setActiveTab('clients');
    } else if (tabParam === 'reports' || tabParam === 'qa') {
      setActiveTab('reports');
    } else if (tabParam === 'payments') {
      setActiveTab('payments');
    } else if (tabParam === 'disputes') {
      setActiveTab('disputes');
    } else if (tabParam === 'analytics' || tabParam === 'map') {
      setActiveTab('analytics');
    } else if (tabParam === 'services') {
      setActiveTab('services');
    } else if (tabParam === 'settings' || tabParam === 'audit') {
      setActiveTab('settings');
    } else {
      setActiveTab('operations');
    }
  }, [tabParam]);

  const handleTabChange = (tab: OperationsTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // QA Review form state for selected request
  const activeReq = requests.find(r => r.id === selectedReqId) || requests[0];

  const [qaStatus, setQaStatus] = useState<VerificationStatus>(activeReq?.status || 'observed');
  const [qaFindings, setQaFindings] = useState(activeReq?.qaReview?.findingsSummary || '');
  const [qaRecommendation, setQaRecommendation] = useState(activeReq?.qaReview?.recommendation || '');
  const [qaRecommendationType, setQaRecommendationType] = useState<'VERIFIED' | 'PARTIALLY_VERIFIED' | 'UNABLE_TO_VERIFY' | 'REQUIRES_FURTHER_INVESTIGATION'>(
    activeReq?.qaReview?.recommendationType || 'VERIFIED'
  );
  const [stopPaymentAlert, setStopPaymentAlert] = useState(activeReq?.paymentDecisionRecord?.stopPaymentAlert || false);
  const [contradictionInput, setContradictionInput] = useState('');
  const [contradictionsList, setContradictionsList] = useState<string[]>(activeReq?.qaReview?.contradictions || []);
  const [uncertaintyInput, setUncertaintyInput] = useState('');
  const [uncertaintiesList, setUncertaintiesList] = useState<string[]>(activeReq?.qaReview?.whatCouldNotBeVerified || []);

  // Additional Information Request State
  const [showAdditionalInfoForm, setShowAdditionalInfoForm] = useState(false);
  const [additionalInfoNotes, setAdditionalInfoNotes] = useState('');

  // Agent Assignment Modal State
  const [assigningReqId, setAssigningReqId] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || '');
  const [scheduledDate, setScheduledDate] = useState<string>('2026-10-14');
  const [conflictNotes, setConflictNotes] = useState<string>('Agent signed conflict-of-interest disclosure; verified zero financial, family, or clan relation to contractor or landowner.');
  const [conflictConfirmed, setConflictConfirmed] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Map County Filter
  const [selectedCountyFilter, setSelectedCountyFilter] = useState<string>('all');

  // Dispute Resolution State
  const [resolvingDisputeId, setResolvingDisputeId] = useState<string | null>(null);
  const [adminDisputeNotes, setAdminDisputeNotes] = useState('');
  const [disputeResolutionAction, setDisputeResolutionAction] = useState('Re-inspection completed with verified evidence');

  // Triage Search
  const [triageSearch, setTriageSearch] = useState('');
  const [triageCategoryFilter, setTriageCategoryFilter] = useState('all');

  const handleOpenAssignModal = (reqId: string) => {
    const target = requests.find(r => r.id === reqId);
    setAssigningReqId(reqId);
    if (target?.assignedAgent) {
      setSelectedAgentId(target.assignedAgent.id);
    } else {
      setSelectedAgentId(agents[0]?.id || '');
    }
    setScheduledDate(target?.scheduledVisitDate || '2026-10-14');
    setConflictNotes(target?.conflictOfInterestCheck?.notes || 'Agent signed conflict-of-interest disclosure; verified zero financial, family, or clan relation to contractor or landowner.');
    setConflictConfirmed(true);
  };

  const handleConfirmAssignment = () => {
    if (!assigningReqId) return;
    if (!conflictConfirmed) {
      setToastMessage('Error: Conflict-of-interest clearance must be verified before deploying verifier.');
      return;
    }
    assignAgent(assigningReqId, selectedAgentId, scheduledDate, conflictNotes);
    const assignedAgentObj = agents.find(a => a.id === selectedAgentId);
    setToastMessage(`Success: Ground verifier ${assignedAgentObj?.name || selectedAgentId} deployed for mission ${assigningReqId}!`);
    setAssigningReqId(null);
  };

  // Update QA form when active request changes
  const handleSelectRequest = (id: string) => {
    setSelectedReqId(id);
    const req = requests.find(r => r.id === id);
    if (req) {
      setQaStatus(req.status);
      setQaFindings(req.qaReview?.findingsSummary || '');
      setQaRecommendation(req.qaReview?.recommendation || '');
      setQaRecommendationType(req.qaReview?.recommendationType || (req.status === 'observed' ? 'VERIFIED' : req.status === 'partly_observed' ? 'PARTIALLY_VERIFIED' : 'REQUIRES_FURTHER_INVESTIGATION'));
      setStopPaymentAlert(req.paymentDecisionRecord?.stopPaymentAlert || false);
      setContradictionsList(req.qaReview?.contradictions || []);
      setUncertaintiesList(req.qaReview?.whatCouldNotBeVerified || []);
    }
  };

  const handleAddContradiction = () => {
    if (contradictionInput.trim()) {
      setContradictionsList(prev => [...prev, contradictionInput.trim()]);
      setContradictionInput('');
    }
  };

  const handleAddUncertainty = () => {
    if (uncertaintyInput.trim()) {
      setUncertaintiesList(prev => [...prev, uncertaintyInput.trim()]);
      setUncertaintyInput('');
    }
  };

  const handleSaveQAReview = () => {
    if (!activeReq) return;
    submitQAReview(activeReq.id, {
      findings: qaFindings || 'Inspection completed according to brief.',
      contradictions: contradictionsList,
      uncertainties: uncertaintiesList,
      recommendation: qaRecommendation || 'Proceed according to client discretion.',
      status: qaStatus,
      stopPayment: stopPaymentAlert,
      recommendationType: qaRecommendationType,
    });
    setToastMessage(`QA Review and official findings published to Client Portal for ${activeReq.id}!`);
  };

  const handleResolveDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingDisputeId) return;
    resolveDispute(resolvingDisputeId, adminDisputeNotes || 'Senior coordinator re-examined all telemetry and validated resolution.', disputeResolutionAction);
    setToastMessage(`Dispute ${resolvingDisputeId} resolved successfully.`);
    setResolvingDisputeId(null);
    setAdminDisputeNotes('');
  };

  const handleRequestAdditionalInfo = () => {
    if (!activeReq) return;
    if (!additionalInfoNotes.trim()) {
      setToastMessage('Please specify what additional photos, measurements, or clarifications are required.');
      return;
    }
    const res = advanceRequestStatus(activeReq.id, 'ADDITIONAL_INFORMATION_REQUIRED', additionalInfoNotes.trim());
    if (res.success) {
      setToastMessage(`Requested additional evidence for ${activeReq.id}. Field verifier notified.`);
      setShowAdditionalInfoForm(false);
      setAdditionalInfoNotes('');
    } else {
      setToastMessage(res.error || 'Failed to update status.');
    }
  };

  const assigningRequest = assigningReqId ? requests.find(r => r.id === assigningReqId) : null;
  const confidenceData = activeReq ? calculateConfidenceScore(activeReq) : null;

  // Kenya Hubs Data for Regional Map
  const kenyaHubs = [
    {
      region: 'Nairobi Metropolitan',
      counties: ['Nairobi', 'Kiambu', 'Machakos', 'Kajiado'],
      activeAgents: 8,
      slaHours: '24h Turnaround',
      color: 'border-emerald-500 bg-emerald-50/70 text-emerald-950',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      region: 'Rift Valley & Highlands',
      counties: ['Nakuru', 'Uasin Gishu', 'Kericho', 'Nandi'],
      activeAgents: 4,
      slaHours: '48h Turnaround',
      color: 'border-blue-500 bg-blue-50/70 text-blue-950',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      region: 'Coast & Maritime Hub',
      counties: ['Mombasa', 'Kilifi', 'Kwale'],
      activeAgents: 3,
      slaHours: '48h Turnaround',
      color: 'border-amber-500 bg-amber-50/70 text-amber-950',
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      region: 'Western & Lake Basin',
      counties: ['Kisumu', 'Kakamega', 'Bungoma', 'Siaya'],
      activeAgents: 3,
      slaHours: '48h Turnaround',
      color: 'border-teal-500 bg-teal-50/70 text-teal-950',
      badgeColor: 'bg-teal-100 text-teal-800'
    },
    {
      region: 'Central & Mt. Kenya',
      counties: ['Nyeri', 'Meru', 'Embu', 'Kirinyaga'],
      activeAgents: 2,
      slaHours: '48h Turnaround',
      color: 'border-purple-500 bg-purple-50/70 text-purple-950',
      badgeColor: 'bg-purple-100 text-purple-800'
    }
  ];

  const filteredTriageRequests = requests.filter(r => {
    const matchesSearch = 
      r.id.toLowerCase().includes(triageSearch.toLowerCase()) ||
      r.title.toLowerCase().includes(triageSearch.toLowerCase()) ||
      r.location.county.toLowerCase().includes(triageSearch.toLowerCase());
    const matchesCategory = triageCategoryFilter === 'all' || r.category === triageCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // 4 Top Operational Counters
  const requiringAttentionList = requests.filter(r => hasStopPaymentWarning(r) || r.status === 'not_observed');
  const overdueList = requests.filter(r => r.urgency === 'urgent' || (r.scheduledVisitDate && r.scheduledVisitDate < '2026-10-12' && r.requestStatus !== 'COMPLETED'));
  const awaitingReviewList = requests.filter(r => (r.evidence?.length > 0 && !r.qaReview?.publishedToClient) || r.requestStatus === 'UNDER_REVIEW' || r.requestStatus === 'EVIDENCE_SUBMITTED');
  const openDisputesList = disputes.filter(d => d.status === 'OPEN' || d.status === 'UNDER_REVIEW');

  // Derived collections
  const unassignedList = requests.filter(r => !r.assignedAgent || r.requestStatus === 'AGENT_ASSIGNED');
  const clientsList = Array.from(
    new Map(
      requests.map((r) => [
        r.client.email,
        {
          id: r.client.email,
          name: r.client.name,
          email: r.client.email,
          location: r.client.locationAbroad,
          phone: r.client.phone,
          requestCount: requests.filter((x) => x.client.email === r.client.email).length,
        },
      ])
    ).values()
  );
  const totalSettledKES = requests
    .filter((r) => r.pricing.quoteStatus === 'paid')
    .reduce((s, r) => s + r.pricing.serviceFeeKES, 0);
  const totalPendingKES = requests
    .filter((r) => r.pricing.quoteStatus !== 'paid')
    .reduce((s, r) => s + r.pricing.serviceFeeKES, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans">
      
      {/* Top Operational Counters (Operations Center Command Overview) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Counter 1: Requiring Attention */}
        <button 
          onClick={() => {
            if (requiringAttentionList[0]) {
              handleSelectRequest(requiringAttentionList[0].id);
              handleTabChange('reports');
            } else {
              handleTabChange('operations');
            }
          }}
          className="bg-white rounded-2xl border border-rose-200 hover:border-rose-300 p-4 sm:p-5 shadow-xs text-left transition-all space-y-1.5 group cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-rose-800">
            <span>Requiring Attention</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 group-hover:text-rose-700 transition-colors">
            {requiringAttentionList.length}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>Stop-payment & severe alerts</span>
          </div>
        </button>

        {/* Counter 2: Overdue / Critical SLA */}
        <button 
          onClick={() => handleTabChange('requests')}
          className="bg-white rounded-2xl border border-amber-200 hover:border-amber-300 p-4 sm:p-5 shadow-xs text-left transition-all space-y-1.5 group cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-amber-800">
            <span>Overdue / Critical SLA</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 group-hover:text-amber-700 transition-colors">
            {overdueList.length}
          </div>
          <div className="text-[11px] text-slate-500">
            Missions exceeding turnaround target
          </div>
        </button>

        {/* Counter 3: Awaiting QA Review */}
        <button 
          onClick={() => handleTabChange('reports')}
          className="bg-white rounded-2xl border border-blue-200 hover:border-blue-300 p-4 sm:p-5 shadow-xs text-left transition-all space-y-1.5 group cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-blue-800">
            <span>Awaiting Review</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 group-hover:text-blue-700 transition-colors">
            {awaitingReviewList.length}
          </div>
          <div className="text-[11px] text-slate-500">
            Ground evidence submitted for QA
          </div>
        </button>

        {/* Counter 4: Open Disputes */}
        <button 
          onClick={() => handleTabChange('disputes')}
          className="bg-white rounded-2xl border border-purple-200 hover:border-purple-300 p-4 sm:p-5 shadow-xs text-left transition-all space-y-1.5 group cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-purple-800">
            <span>Open Disputes</span>
            <AlertTriangle className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 group-hover:text-purple-700 transition-colors">
            {openDisputesList.length}
          </div>
          <div className="text-[11px] text-slate-500">
            Client appeals pending investigation
          </div>
        </button>
      </div>

      {/* Operations Header & Tab Switcher */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
              NAIROBI HQ OPERATIONS DESK
            </span>
            <span className="text-xs text-slate-400">Controlled Operations Register</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white">
            Operations Center & Register
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Triage client requests, assign vetted local verifiers, verify conflicts of interest, 
            and review ground evidence before publishing official audit findings.
          </p>
        </div>

        {/* Tab Switcher - All 11 Sections per Specification */}
        <div className="flex items-center bg-slate-800 p-1.5 rounded-2xl border border-slate-700 text-xs font-semibold gap-1 max-w-full overflow-x-auto">
          {[
            { id: 'operations' as OperationsTab, label: 'Operations' },
            { id: 'requests' as OperationsTab, label: `Requests (${requests.length})` },
            { id: 'assignments' as OperationsTab, label: `Assignments (${unassignedList.length})` },
            { id: 'agents' as OperationsTab, label: `Agents (${agents.length})` },
            { id: 'clients' as OperationsTab, label: `Clients (${clientsList.length})` },
            { id: 'reports' as OperationsTab, label: 'Reports & QA' },
            { id: 'payments' as OperationsTab, label: 'Payments' },
            { id: 'disputes' as OperationsTab, label: `Disputes (${disputes.length})` },
            { id: 'analytics' as OperationsTab, label: 'Analytics' },
            { id: 'services' as OperationsTab, label: 'Services' },
            { id: 'settings' as OperationsTab, label: 'Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white px-5 py-3.5 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-lg shadow-emerald-600/20 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <Check className="w-4 h-4 stroke-[3] text-emerald-200" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/80 hover:text-white font-bold ml-4 p-1 hover:bg-emerald-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TAB 1: QA REVIEW & PUBLISH */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Select Request Queue (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
              <span>Select Active Inspection</span>
              <span className="text-slate-400">Queue: {requests.length}</span>
            </div>

            <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
              {requests.map(req => {
                const isSelected = req.id === selectedReqId;
                const hasStopPayment = hasStopPaymentWarning(req);

                return (
                  <button
                    key={req.id}
                    onClick={() => handleSelectRequest(req.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono font-bold text-slate-500">{req.id}</span>
                      <StatusBadge status={req.status} size="sm" />
                    </div>

                    <div className="font-bold text-xs text-slate-900 line-clamp-1">
                      {req.title}
                    </div>

                    <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                      <span>{req.location.town}, {req.location.county}</span>
                      {hasStopPayment && (
                        <span className="text-amber-700 font-bold flex items-center gap-0.5">
                          <AlertTriangle className="w-3 h-3" /> Stop Payment
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: QA Form & Evidence Inspection (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {activeReq ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {activeReq.id}
                      </span>
                      <ProcessStageBadge stage={activeReq.stage} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mt-1">
                      {activeReq.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenReport(activeReq)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Preview Official Dossier</span>
                    </button>
                  </div>
                </div>

                {/* Transparent Confidence Score Meter */}
                {confidenceData && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Verification Confidence Score: {confidenceData.overall}/100 ({confidenceData.ratingTier} CONFIDENCE)
                        </span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        confidenceData.overall >= 80 ? 'bg-emerald-100 text-emerald-800' :
                        confidenceData.overall >= 60 ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {confidenceData.ratingTier}
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          confidenceData.overall >= 80 ? 'bg-emerald-500' :
                          confidenceData.overall >= 60 ? 'bg-amber-500' :
                          'bg-rose-500'
                        }`}
                        style={{ width: `${confidenceData.overall}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 pt-1">
                      {confidenceData.factors.slice(0, 3).map((f, i) => (
                        <div key={i} className="bg-white p-2 rounded-xl border border-slate-100">
                          <div className="font-semibold text-slate-800 truncate">{f.name}</div>
                          <div className="text-emerald-700 font-bold">{f.score}/{f.maxScore} pts</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendation Type & Official Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Recommendation Seal Stamp
                    </label>
                    <select
                      value={qaRecommendationType}
                      onChange={(e) => setQaRecommendationType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white outline-none"
                    >
                      <option value="VERIFIED">VERIFIED (Full Ground Alignment)</option>
                      <option value="PARTIALLY_VERIFIED">PARTIALLY VERIFIED (Variance Observed)</option>
                      <option value="UNABLE_TO_VERIFY">UNABLE TO VERIFY (Access/Evidence Block)</option>
                      <option value="REQUIRES_FURTHER_INVESTIGATION">REQUIRES FURTHER INVESTIGATION (Dispute/Anomaly)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Verification Category Status
                    </label>
                    <select
                      value={qaStatus}
                      onChange={(e) => setQaStatus(e.target.value as VerificationStatus)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white outline-none"
                    >
                      <option value="observed">Observed (Clear physical evidence)</option>
                      <option value="partly_observed">Partly Observed (Discrepancy / incomplete)</option>
                      <option value="not_observed">Not Observed (Milestone missing)</option>
                      <option value="cannot_confirm">Cannot Confirm (Access denied / uncertain)</option>
                    </select>
                  </div>
                </div>

                {/* Coordinator Summary Findings */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 block">
                    Chief Operations Findings & Narrative Summary
                  </label>
                  <textarea
                    rows={3}
                    value={qaFindings}
                    onChange={(e) => setQaFindings(e.target.value)}
                    placeholder="Synthesize physical observations, photographic alignment, and ground interviews..."
                    className="w-full p-3 text-xs rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Discrepancies & Contradictions List */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>Identified Contradictions & Variance</span>
                    <span className="text-[11px] text-slate-500 font-normal">e.g. Claimed 65% vs Ground 40%</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={contradictionInput}
                      onChange={(e) => setContradictionInput(e.target.value)}
                      placeholder="e.g. 80 cement bags billed but only 40 bags physically present on site"
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddContradiction}
                      className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black"
                    >
                      + Add
                    </button>
                  </div>
                  {contradictionsList.length > 0 && (
                    <div className="space-y-1 pt-1">
                      {contradictionsList.map((c, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                          <span>• {c}</span>
                          <button
                            onClick={() => setContradictionsList(prev => prev.filter((_, idx) => idx !== i))}
                            className="text-amber-800 hover:text-amber-950 font-bold p-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Explicit Limitations / Uncertainties (Document 1 Standard) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>What Could NOT Be Confirmed (Document 1 Mandatory Boundary)</span>
                    <span className="text-[11px] text-slate-500 font-normal">Must state limits explicitly</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={uncertaintyInput}
                      onChange={(e) => setUncertaintyInput(e.target.value)}
                      placeholder="e.g. Structural steel tensile rating inside cured slab not certified"
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddUncertainty}
                      className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black"
                    >
                      + Add
                    </button>
                  </div>
                  {uncertaintiesList.length > 0 && (
                    <div className="space-y-1 pt-1">
                      {uncertaintiesList.map((u, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-800">
                          <span>• {u}</span>
                          <button
                            onClick={() => setUncertaintiesList(prev => prev.filter((_, idx) => idx !== i))}
                            className="text-slate-600 hover:text-slate-900 font-bold p-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Stop Payment Trigger & Action Recommendation */}
                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-3">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={stopPaymentAlert}
                      onChange={(e) => setStopPaymentAlert(e.target.checked)}
                      className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    <div>
                      <span className="text-xs font-bold text-amber-950 block">
                        Trigger STOP PAYMENT Advisory to Client
                      </span>
                      <span className="text-[11px] text-amber-800 leading-snug block">
                        Activates red alert banner on Client Portal. Recommends client pause release of funds until contractor rectifies material discrepancy.
                      </span>
                    </div>
                  </label>

                  <div>
                    <label className="text-[11px] font-bold text-amber-900 block mb-1">
                      Action Recommendation to Client:
                    </label>
                    <input
                      type="text"
                      value={qaRecommendation}
                      onChange={(e) => setQaRecommendation(e.target.value)}
                      placeholder="e.g. Authorize partial KES 150,000 only; withhold remaining KES 300,000 pending cement audit"
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs outline-none"
                    />
                  </div>
                </div>

                {/* Operations Decision Actions */}
                <div className="pt-2 space-y-3">
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <button
                      onClick={handleSaveQAReview}
                      className="flex-1 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Approve Findings & Publish Official Report</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAdditionalInfoForm(prev => !prev)}
                      className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-700" />
                      <span>Request Additional Evidence</span>
                    </button>
                  </div>

                  {showAdditionalInfoForm && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-3 animate-fadeIn">
                      <div className="text-xs font-bold text-amber-900">
                        Specify Required Clarification or Additional Evidence Angles:
                      </div>
                      <textarea
                        rows={2}
                        value={additionalInfoNotes}
                        onChange={(e) => setAdditionalInfoNotes(e.target.value)}
                        placeholder="e.g. Ground photo of southern survey beacon obstructed by bush; request agent return with clearing tools and retake high-res photo..."
                        className="w-full p-2.5 rounded-xl border border-amber-300 text-xs bg-white outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleRequestAdditionalInfo}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm"
                        >
                          Dispatch Request to Field Verifier
                        </button>
                        <button
                          onClick={() => setShowAdditionalInfoForm(false)}
                          className="px-3 py-2 text-slate-600 hover:bg-amber-100 font-semibold text-xs rounded-xl"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
                Select an inspection from the queue to start QA Review.
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: OPERATIONS & REQUESTS REGISTER */}
      {(activeTab === 'operations' || activeTab === 'requests') && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={triageSearch}
                onChange={(e) => setTriageSearch(e.target.value)}
                placeholder="Search missions by ID, title, or county..."
                className="w-full text-xs outline-none bg-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={triageCategoryFilter}
                onChange={(e) => setTriageCategoryFilter(e.target.value)}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 outline-none"
              >
                <option value="all">All Categories</option>
                <option value="construction">Construction</option>
                <option value="property">Property</option>
                <option value="vehicle">Vehicle</option>
                <option value="business">Business</option>
                <option value="family">Family Care</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Request ID</th>
                    <th className="p-3.5">Client</th>
                    <th className="p-3.5">Service</th>
                    <th className="p-3.5">Agent</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Priority</th>
                    <th className="p-3.5 text-right">Controlled Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTriageRequests.map(req => {
                    const hasStop = hasStopPaymentWarning(req);
                    const urgency = req.urgency || 'standard';

                    return (
                      <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-slate-900">
                          <button
                            onClick={() => navigate(`/request/${req.id}`)}
                            className="hover:underline text-emerald-800"
                            title="Open detail view"
                          >
                            {req.id}
                          </button>
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900">{req.client?.name || 'Client'}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[160px]">
                            {req.client?.locationAbroad || req.client?.email}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 capitalize bg-slate-100 px-2 py-0.5 rounded">
                            <CategoryIcon category={req.category} className="w-3 h-3 text-slate-500" />
                            <span>{req.category}</span>
                          </span>
                        </td>
                        <td className="p-3.5">
                          {req.assignedAgent ? (
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              <span>{req.assignedAgent.name}</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleOpenAssignModal(req.id)}
                              className="text-amber-700 font-semibold flex items-center gap-1 hover:underline"
                            >
                              <Clock className="w-3.5 h-3.5 text-amber-600" /> Unassigned
                            </button>
                          )}
                        </td>
                        <td className="p-3.5">
                          <div className="font-medium text-slate-900">{req.location.town}</div>
                          <div className="text-[11px] text-slate-500">{req.location.county}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="space-y-1">
                            <StatusBadge status={req.status} size="sm" />
                            {hasStop && (
                              <div className="text-[10px] font-bold text-rose-700 flex items-center gap-0.5">
                                <ShieldAlert className="w-3 h-3" /> Stop-Payment
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            urgency === 'urgent'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : urgency === 'priority'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {urgency}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            <button
                              onClick={() => navigate(`/request/${req.id}`)}
                              className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors"
                              title="Open request details"
                            >
                              Open Request
                            </button>
                            <button
                              onClick={() => {
                                startViewAs('client', req.client?.email || req.id, req.client?.name || 'Client', req.client?.email || '');
                                navigate('/dashboard');
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg transition-colors"
                              title="Preview client view"
                            >
                              View Client
                            </button>
                            {req.assignedAgent ? (
                              <button
                                onClick={() => {
                                  startViewAs('agent', req.assignedAgent!.id, req.assignedAgent!.name, req.assignedAgent?.email || '');
                                  navigate('/agent');
                                }}
                                className="px-2.5 py-1 text-[11px] font-bold bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-lg transition-colors cursor-pointer"
                                title="Preview agent view"
                              >
                                View Agent
                              </button>
                            ) : (
                              <button
                                onClick={() => handleOpenAssignModal(req.id)}
                                className="px-2.5 py-1 text-[11px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                                title="Deploy ground verifier"
                              >
                                Deploy Agent
                              </button>
                            )}
                            <button
                              onClick={() => onOpenReport(req)}
                              className="px-2.5 py-1 text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg transition-colors"
                              title="Open verified audit report"
                            >
                              Open Report
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: ASSIGNMENTS & DISPATCH QUEUE */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                  <span>Ground Assignments & Dispatch Queue</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Assign vetted, conflict-cleared ground verifiers to active diaspora verification missions.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold font-mono">
                {unassignedList.length} Awaiting Dispatch
              </span>
            </div>

            {/* Unassigned missions queue */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Missions Awaiting Ground Verifier Deployment
              </h4>
              {unassignedList.length === 0 ? (
                <div className="py-8 text-center rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-400">
                  All active verification requests currently have an assigned ground verifier.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {unassignedList.map((req) => {
                    const localMatches = agents.filter((a) => a.primaryCounties.includes(req.location.county));
                    return (
                      <div
                        key={req.id}
                        className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50/70 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1 max-w-xl">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                              {req.id}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 capitalize bg-white px-2 py-0.5 rounded border border-slate-200">
                              <CategoryIcon category={req.category} className="w-3 h-3 text-slate-500" />
                              <span>{req.category}</span>
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300">
                              {req.urgency || 'standard'} Priority
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900">{req.title}</h4>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{req.location.town}, {req.location.county} County</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>Target Date: {req.scheduledVisitDate || 'Immediate'}</span>
                            </span>
                            {localMatches.length > 0 && (
                              <span className="text-emerald-700 font-semibold text-[11px]">
                                ✓ {localMatches.length} vetted verifiers in {req.location.county}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleOpenAssignModal(req.id)}
                            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                          >
                            <UserCheck className="w-4 h-4" />
                            <span>Deploy Ground Verifier</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Currently Assigned missions */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Active Ground Missions Deployed ({requests.filter(r => r.assignedAgent).length})
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {requests.filter(r => r.assignedAgent).map((req) => (
                  <div key={`assigned-${req.id}`} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-800">{req.id}</span>
                        <StatusBadge status={req.status} size="sm" />
                      </div>
                      <div className="text-xs font-bold text-slate-900">{req.title}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span>Agent: <strong>{req.assignedAgent?.name}</strong></span>
                        <span>•</span>
                        <span>{req.location.town}, {req.location.county}</span>
                        <span>•</span>
                        <span>Visit: {req.scheduledVisitDate || 'Scheduled'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleOpenAssignModal(req.id)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
                      >
                        Re-assign
                      </button>
                      <button
                        onClick={() => {
                          startViewAs('agent', req.assignedAgent!.id, req.assignedAgent!.name, req.assignedAgent?.email || '');
                          navigate('/agent');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-xs font-bold transition-colors"
                      >
                        View Agent View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB: CLIENTS DIRECTORY */}
      {activeTab === 'clients' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-600" />
                  <span>Diaspora Clients Directory</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Global diaspora principals commissioning field due diligence across Kenya.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold font-mono">
                {clientsList.length} Registered Accounts
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clientsList.map((client) => {
                const clientReqs = requests.filter((r) => r.client?.email === client.email);
                return (
                  <div
                    key={client.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{client.name}</h4>
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {client.location}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {clientReqs.length} Missions
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 space-y-1">
                        <div className="truncate">Email: <strong className="text-slate-800">{client.email}</strong></div>
                        <div>Phone: <strong className="text-slate-800">{client.phone}</strong></div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Recent Requests:
                        </span>
                        {clientReqs.slice(0, 2).map((cr) => (
                          <div key={cr.id} className="text-[11px] flex items-center justify-between text-slate-600">
                            <span className="font-mono font-semibold">{cr.id}</span>
                            <span className="truncate max-w-[130px]">{cr.location.county}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => {
                          startViewAs('client', client.id, client.name, client.email);
                          navigate('/dashboard');
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors cursor-pointer text-center"
                      >
                        View Client Experience
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB: PAYMENTS & FINANCIAL RECONCILIATION */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Financial summary overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Total Settled Fees
              </span>
              <div className="text-2xl font-bold font-mono text-emerald-800">
                {FORMAT_CURRENCY(totalSettledKES, currency)}
              </div>
              <div className="text-[11px] text-emerald-600">
                Earned service tariffs cleared to Nairobi HQ
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Pending Quotations / Invoices
              </span>
              <div className="text-2xl font-bold font-mono text-amber-800">
                {FORMAT_CURRENCY(totalPendingKES, currency)}
              </div>
              <div className="text-[11px] text-amber-600">
                Awaiting client settlement prior to agent dispatch
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Commingled Funds Risk
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900">
                0.00 KES
              </div>
              <div className="text-[11px] text-slate-500">
                Strict Doc 1 Invariant: Zero contractor escrow held
              </div>
            </div>
          </div>

          {/* Invoices table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Verification Invoices & Settlement Ledger
                </h3>
                <p className="text-xs text-slate-500">
                  Audit log of service tariffs, regional travel allowances, and M-Pesa / Card settlements.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">
                {requests.length} Total Invoices
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Invoice / Request</th>
                    <th className="p-3.5">Client</th>
                    <th className="p-3.5">Service Category</th>
                    <th className="p-3.5">Total Amount</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Advisory Risk</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map((req) => {
                    const isPaid = req.pricing.quoteStatus === 'paid';
                    const hasStop = hasStopPaymentWarning(req);
                    return (
                      <tr key={`pay-${req.id}`} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-slate-900">
                          {req.id}
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900">{req.client?.name}</div>
                          <div className="text-[11px] text-slate-500">{req.client?.locationAbroad}</div>
                        </td>
                        <td className="p-3.5 capitalize font-medium text-slate-700">
                          {req.category}
                        </td>
                        <td className="p-3.5 font-mono font-bold text-slate-900">
                          {FORMAT_CURRENCY(req.pricing.serviceFeeKES, currency)}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {req.pricing.quoteStatus}
                          </span>
                        </td>
                        <td className="p-3.5">
                          {hasStop ? (
                            <span className="text-[10px] font-bold text-rose-700 flex items-center gap-0.5">
                              <ShieldAlert className="w-3.5 h-3.5" /> Stop-Payment Alert
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium">Standard</span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => navigate(`/request/${req.id}`)}
                              className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors"
                            >
                              Open Request
                            </button>
                            <button
                              onClick={() => {
                                startViewAs('client', req.client?.email || req.id, req.client?.name || 'Client', req.client?.email || '');
                                navigate('/dashboard');
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg transition-colors"
                            >
                              View Client
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ANALYTICS & KENYA OPERATIONS MAP */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span>Kenya Ground Operations Coverage & Regional Density</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time verifier network deployment and active inspection clusters across Kenya's 47 counties.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Filter by Hub:</span>
                <select
                  value={selectedCountyFilter}
                  onChange={(e) => setSelectedCountyFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold outline-none"
                >
                  <option value="all">All Operational Hubs</option>
                  {kenyaHubs.map(h => (
                    <option key={h.region} value={h.region}>{h.region}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Regional Hub Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kenyaHubs
                .filter(h => selectedCountyFilter === 'all' || h.region === selectedCountyFilter)
                .map((hub, i) => {
                  const hubRequests = requests.filter(r => hub.counties.includes(r.location.county));
                  
                  return (
                    <div key={i} className={`p-4 rounded-2xl border ${hub.color} space-y-3 shadow-sm`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-sm">{hub.region}</div>
                          <div className="text-[11px] text-slate-600">
                            {hub.counties.join(', ')}
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${hub.badgeColor}`}>
                          {hub.slaHours}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/60">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Vetted Agents</span>
                          <span className="font-bold text-slate-900">{hub.activeAgents} Officers</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Active Missions</span>
                          <span className="font-bold text-slate-900">{hubRequests.length} Inspections</span>
                        </div>
                      </div>

                      {hubRequests.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                            Active Tasks:
                          </span>
                          {hubRequests.slice(0, 2).map(hr => (
                            <div key={hr.id} className="text-[11px] bg-white/80 p-1.5 rounded-lg border border-slate-200/50 flex items-center justify-between">
                              <span className="font-mono font-bold text-slate-700">{hr.id}</span>
                              <span className="truncate ml-1 text-slate-600">{hr.location.town}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VETTED AGENTS ROSTER */}
      {activeTab === 'agents' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agt) => (
              <div key={agt.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={agt.avatarUrl}
                    alt={agt.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{agt.name}</h3>
                    <div className="text-xs text-blue-600 font-semibold">{agt.badgeLevel}</div>
                    <div className="text-[11px] text-slate-400">★ {agt.rating} • {agt.totalInspections} field audits</div>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-slate-600">
                    <span className="font-semibold text-slate-800">Licensed Counties: </span>
                    {agt.primaryCounties.join(', ')}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Specialties: </span>
                    {agt.specialties.join(', ')}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-[11px] text-emerald-800 font-bold">
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    Conflict Clearance Signed
                  </span>
                  <span className="text-slate-400 font-mono">{agt.id}</span>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      startViewAs('agent', agt.id, agt.name, agt.email);
                      navigate('/agent');
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold transition-colors cursor-pointer text-center"
                  >
                    View Agent Experience
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SERVICES & PRICING CONFIGURATION */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span>Services, Tariffs & County Logistics Matrix</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Standardized fee engine ensuring transparent quoting with zero hidden surcharges.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                Dynamic Engine Active
              </span>
            </div>

            {/* Service Category Base Tariffs */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Service Category Base Fees (Standardized Scope)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {[
                  { name: 'Construction Oversight', fee: 14500, desc: 'Perimeter photo audit, cement bag count, milestone gating' },
                  { name: 'Property & Land Inspection', fee: 12000, desc: 'Beacon search, boundary fence scan, neighbor inquiry' },
                  { name: 'Business Due Diligence', fee: 13500, desc: 'Storefront check, permit audit, inventory spot count' },
                  { name: 'Vehicle & Equipment', fee: 16000, desc: 'VIN match, digital paint gauge scan, cold engine test' },
                  { name: 'Family Welfare Safeguarding', fee: 18000, desc: 'Elderly wellbeing, clinic accompaniment, emergency contact' },
                  { name: 'Document Verification', fee: 11000, desc: 'Physical registry visit, seal & stamp verification' },
                  { name: 'Person Identity Verification', fee: 14000, desc: 'In-person meeting, physical Kenya ID examination' },
                  { name: 'Purchase Verification', fee: 13000, desc: 'Machinery spot check, serial match, invoice copy' },
                  { name: 'General Field Assistance', fee: 12500, desc: 'Physical errands, meeting attendance, document collection' },
                ].map((s, i) => (
                  <div key={i} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{s.name}</span>
                      <span className="font-mono text-emerald-700">{FORMAT_CURRENCY(s.fee, currency)}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* County Travel & Urgency Multipliers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* County Logistics */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  2. Regional Travel & County Dispatch Surcharges
                </h4>
                <div className="divide-y divide-slate-200/80">
                  {[
                    { county: 'Nairobi County (Metro HQ)', fee: 1500 },
                    { county: 'Kiambu County', fee: 2500 },
                    { county: 'Machakos & Kajiado Counties', fee: 3500 },
                    { county: 'Nakuru & Central Rift', fee: 6500 },
                    { county: 'Nyeri, Kirinyaga & Mt. Kenya', fee: 6000 },
                    { county: 'Mombasa & Kilifi (Coast Hub)', fee: 12500 },
                    { county: 'Kisumu & Kakamega (Western Hub)', fee: 11500 },
                    { county: 'Uasin Gishu & Nandi (North Rift)', fee: 10500 },
                  ].map((c, i) => (
                    <div key={i} className="py-2 flex items-center justify-between">
                      <span className="text-slate-700">{c.county}</span>
                      <span className="font-mono font-bold text-slate-900">{FORMAT_CURRENCY(c.fee, currency)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Urgency & Platform Fixed Surcharges */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  3. Urgency SLAs & Platform Infrastructure Tariffs
                </h4>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900">Standard Tier (72h SLA)</div>
                      <div className="text-[10px] text-slate-500">Regular field queue scheduling</div>
                    </div>
                    <span className="font-mono font-bold text-slate-700">+0% Base Fee</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900">Priority Tier (48h SLA)</div>
                      <div className="text-[10px] text-slate-500">Expedited county agent deployment</div>
                    </div>
                    <span className="font-mono font-bold text-amber-700">+20% Base Fee</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900">Urgent Tier (24h SLA)</div>
                      <div className="text-[10px] text-slate-500">Emergency dispatch & instant telemetry</div>
                    </div>
                    <span className="font-mono font-bold text-rose-700">+40% Base Fee</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900">Fixed Platform & SHA-256 Hash Archive</div>
                      <div className="text-[10px] text-slate-500">Cryptographic tamper-evidence storage</div>
                    </div>
                    <span className="font-mono font-bold text-slate-900">{FORMAT_CURRENCY(2000, currency)}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900">Field Operations Allowance</div>
                      <div className="text-[10px] text-slate-500">Hardware calibration & local transport</div>
                    </div>
                    <span className="font-mono font-bold text-slate-900">{FORMAT_CURRENCY(3500, currency)}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 6: DISPUTES RESOLUTION DESK */}
      {activeTab === 'disputes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <span>Disputes & Discrepancy Escalation Desk</span>
              </h3>
              <p className="text-xs text-slate-500">
                Review formal issues filed by Diaspora Clients regarding field observations, telemetry, or contractor discrepancies.
              </p>
            </div>

            <div className="space-y-3">
              {disputes.map(disp => (
                <div key={disp.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                        {disp.id}
                      </span>
                      <span className="font-bold text-xs text-slate-900">
                        Mission: {disp.requestId}
                      </span>
                      <span className="text-xs text-slate-500">
                        Filed by: {disp.clientName}
                      </span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      disp.status === 'OPEN' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                      disp.status === 'UNDER_REVIEW' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {disp.status}
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="font-semibold text-slate-800">Reason: {disp.reason}</div>
                    <p className="text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                      {disp.description}
                    </p>
                  </div>

                  {disp.status !== 'RESOLVED' ? (
                    <div>
                      {resolvingDisputeId === disp.id ? (
                        <form onSubmit={handleResolveDisputeSubmit} className="space-y-2 pt-2 border-t border-slate-200">
                          <label className="text-xs font-bold text-slate-800 block">
                            Senior Coordinator Investigation Finding:
                          </label>
                          <textarea
                            rows={2}
                            value={adminDisputeNotes}
                            onChange={(e) => setAdminDisputeNotes(e.target.value)}
                            placeholder="Detail re-inspection findings, phone interviews, or evidence validation..."
                            className="w-full p-2.5 text-xs rounded-xl border border-slate-300 outline-none bg-white"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={disputeResolutionAction}
                              onChange={(e) => setDisputeResolutionAction(e.target.value)}
                              placeholder="Action taken (e.g. Dispatched senior engineer; re-issued report)"
                              className="flex-1 p-2 text-xs rounded-xl border border-slate-300 bg-white"
                            />
                            <button
                              type="submit"
                              className="px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
                            >
                              Resolve Dispute
                            </button>
                            <button
                              type="button"
                              onClick={() => setResolvingDisputeId(null)}
                              className="px-3 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button
                          onClick={() => {
                            setResolvingDisputeId(disp.id);
                            setAdminDisputeNotes(disp.adminNotes || '');
                          }}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors"
                        >
                          Investigate & Resolve Dispute
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                      <strong>Resolved:</strong> {disp.resolutionAction} ({disp.resolvedAt})
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: SETTINGS & AUDIT TRAIL */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Sub-Roles Matrix Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Admin Sub-Roles & Granular Permissions Matrix</span>
              </h3>
              <p className="text-xs text-slate-500">
                Least-privilege authorization matrix dividing administrative functions into specialized operational scopes (Doc 1 & 2 Standard).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
              {[
                { role: 'super_admin' as const, label: 'Super Admin', desc: 'Full administrative sovereignty & configuration' },
                { role: 'operations' as const, label: 'Operations Desk', desc: 'Request triage, verifier dispatch & dispute handling' },
                { role: 'reviewer' as const, label: 'QA Reviewer', desc: 'Ground evidence audit, contradiction analysis & publication' },
                { role: 'finance' as const, label: 'Finance & Accounts', desc: 'Invoice reconciliation, M-Pesa tariffs & audit analytics' },
                { role: 'support' as const, label: 'Client Support', desc: 'Client account management & inquiry dispute triage' },
              ].map((sub) => {
                const perms = ROLE_PERMISSIONS[sub.role] || [];
                return (
                  <div key={sub.role} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900">{sub.label}</div>
                      <p className="text-[10px] text-slate-500 leading-snug mt-1">{sub.desc}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                        Permissions ({perms.length}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {perms.map((p) => (
                          <span key={p} className="text-[9px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-700">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <span>Immutable Operations Audit Trail</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Cryptographically trackable log of all system transitions, verifier check-ins, payments, and report approvals.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">
                {auditLogs.length} Logged Events
              </span>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white transition-all space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {log.action}
                      </span>
                      <span className="font-semibold text-slate-800">
                        {log.performedBy.name} ({log.performedBy.role})
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">{log.timestamp}</span>
                  </div>

                  <div className="text-[11px] text-slate-600 flex items-center justify-between">
                    <span>Target: <strong>{log.targetResource}</strong> ({log.targetId})</span>
                    <span className="font-mono text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      SHA-256 Verified
                    </span>
                  </div>

                  {log.metadata && (
                    <div className="text-[10px] font-mono text-slate-500 bg-white p-1.5 rounded-lg border border-slate-100 truncate">
                      {JSON.stringify(log.metadata)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Assign Verifier Modal with Mandatory Conflict of Interest Checklist */}
      {assigningReqId && assigningRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5 animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-blue-50 text-blue-800 rounded">
                    {assigningRequest.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Step 2: Assign Ground Verifier
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Assign Vetted Verifier to Mission
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Target: {assigningRequest.location.town}, {assigningRequest.location.county} County
                </p>
              </div>

              <button
                onClick={() => setAssigningReqId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Select Agent */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                1. Select Vetted Verifier Roster
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {agents.map((agt) => {
                  const isSelected = agt.id === selectedAgentId;
                  const coversCounty = agt.primaryCounties.includes(assigningRequest.location.county);

                  return (
                    <div
                      key={agt.id}
                      onClick={() => setSelectedAgentId(agt.id)}
                      className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={agt.avatarUrl}
                          alt={agt.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            {agt.name}
                            {coversCounty && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                                Local County Match
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            ★ {agt.rating} • {agt.totalInspections} audits • {agt.badgeLevel}
                          </div>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Scheduled Visit Date */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                2. Scheduled On-Site Inspection Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Mandatory Conflict of Interest Clearance Check */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-1 flex-1">
                  <div className="font-bold text-amber-900">
                    Mandatory Conflict of Interest Clearance (Reference Doc 1 & 2)
                  </div>
                  <p className="text-[11px] text-amber-800">
                    Verifier must have ZERO familial, financial, contractor, or clan relation to the site owner, contractor, or sellers.
                  </p>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Coordinator Clearance Verification Notes:
                </label>
                <textarea
                  rows={2}
                  value={conflictNotes}
                  onChange={(e) => setConflictNotes(e.target.value)}
                  placeholder="Record verification of zero conflict of interest..."
                  className="w-full px-3 py-1.5 rounded-xl border border-amber-300 bg-white text-xs outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 text-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={conflictConfirmed}
                  onChange={(e) => setConflictConfirmed(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="font-semibold text-amber-950">
                  I certify that conflict disclosure was completed and verified
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAssigningReqId(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAssignment}
                disabled={!conflictConfirmed}
                className={`px-5 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all ${
                  conflictConfirmed
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-slate-300 cursor-not-allowed text-slate-500'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Confirm Assignment & Deploy</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
