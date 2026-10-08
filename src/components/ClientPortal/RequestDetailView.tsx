import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVerification } from '../../context/VerificationContext';
import { 
  MapPin, 
  User, 
  Clock, 
  FileText, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Award,
  Check,
  X,
  ShieldAlert,
  ShieldCheck,
  Send,
  Calendar,
  Layers,
  ArrowRight,
  DollarSign
} from '../Icons';

import { canUserAccessRequest } from '../../auth/authorization';
import { ForbiddenView } from '../ForbiddenView';
import { Timeline } from '../ui/Timeline';
import { EvidenceGallery } from '../ui/EvidenceGallery';
import { StatusBadge, ProcessStageBadge } from '../CommonBadges';
import { FORMAT_CURRENCY, hasStopPaymentWarning } from '../../data/mockData';

interface RequestDetailViewProps {
  onBack: () => void;
  onOpenReport: (req: any) => void;
}

export const RequestDetailView: React.FC<RequestDetailViewProps> = ({ onBack, onOpenReport }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    requests, 
    activeRequest, 
    selectRequest, 
    currency, 
    recordClientDecision, 
    payInvoice,
    currentUser,
    viewAsSession
  } = useVerification();

  const req = (id ? requests.find(r => r.id === id) : activeRequest) || activeRequest;

  // IDOR & Horizontal Privilege Escalation Protection evaluated immediately
  const accessCheck = req ? canUserAccessRequest(currentUser, req, viewAsSession) : { allowed: false, reason: 'Request not found' };

  useEffect(() => {
    // Only update global activeRequest if the user is authorized to access this record!
    if (id && req && req.id !== activeRequest?.id && accessCheck.allowed) {
      selectRequest(req.id);
    }
  }, [id, req, activeRequest?.id, selectRequest, accessCheck.allowed]);

  const [decisionAction, setDecisionAction] = useState<string>('Approve Findings & Authorize Payment');
  const [decisionNote, setDecisionNote] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Real Payment Flow State
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card' | 'bank'>('mpesa');
  const [paymentPhone, setPaymentPhone] = useState(accessCheck.allowed ? (req?.client?.phone || '+254 712 345 678') : '+254 712 345 678');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentTxRef, setPaymentTxRef] = useState<string | null>(null);

  if (!req) {
    return (
      <ForbiddenView
        reason="The requested verification record could not be found."
        targetResource={id || 'Unknown'}
        onBack={onBack}
      />
    );
  }

  if (!accessCheck.allowed) {
    return (
      <ForbiddenView
        reason={accessCheck.reason || 'You do not have authorization to view this verification record.'}
        targetResource={req.id}
        onBack={onBack}
      />
    );
  }

  const isStopPayment = hasStopPaymentWarning(req);

  const steps = [
    { num: 1, key: 'define', title: 'Define Scope & Quote', desc: 'Brief, boundaries, deliverables' },
    { num: 2, key: 'assign', title: 'Assign Vetted Agent', desc: 'Conflict clearance & scheduling' },
    { num: 3, key: 'act', title: 'Ground Action & Evidence', desc: 'Visit, photos, checklists' },
    { num: 4, key: 'review', title: 'Coordinator Review & QA', desc: 'Contradiction checks & limitations' },
    { num: 5, key: 'decide', title: 'Client Decision', desc: 'Approval, pause, or follow-up' },
  ];

  const handleRecordDecision = (e: React.FormEvent) => {
    e.preventDefault();
    recordClientDecision(req.id, decisionAction, decisionNote || `Decision recorded by diaspora client: ${decisionAction}`);
    setToastMessage(`Decision "${decisionAction}" successfully logged on official request ledger.`);
    setDecisionNote('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 py-6">
      
      {/* Back and Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Requests</span>
        </button>

        <button
          onClick={() => onOpenReport(req)}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
        >
          <FileText className="w-4 h-4" />
          <span>Generate Standard Audit Report</span>
        </button>
      </div>

      {/* In-app Toast Banner */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white px-5 py-3 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-lg shadow-emerald-600/20 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <Check className="w-4 h-4 stroke-[3] text-emerald-200" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/80 hover:text-white font-bold ml-4 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Prominent Stop Payment Alert Banner if active */}
      {isStopPayment && (
        <div className="bg-amber-500 text-slate-950 p-5 rounded-3xl shadow-xl border-2 border-amber-600 space-y-2">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-slate-950 flex-shrink-0" />
            <h2 className="text-sm sm:text-base font-black tracking-wide uppercase">
              URGENT STOP-PAYMENT ADVISORY TRIGGERED BY NAIROBI OPERATIONS DESK
            </h2>
          </div>
          <p className="text-xs font-medium text-slate-900 leading-relaxed max-w-3xl">
            Ground evidence reveals significant material shortages, physical progress lagging claimed milestones, 
            or critical boundary contradictions. <strong>DiasporaVerify advises withholding contractor milestone disbursement</strong> until 
            reconciled or rectified.
          </p>
          {req.qaReview?.contradictions && req.qaReview.contradictions.length > 0 && (
            <div className="pt-1">
              <span className="text-[11px] font-black uppercase text-slate-900">Flagged Ground Discrepancies:</span>
              <ul className="list-disc list-inside text-xs text-slate-950 font-semibold space-y-0.5 mt-0.5">
                {req.qaReview.contradictions.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Main Card Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
              {req.id}
            </span>
            <ProcessStageBadge stage={req.stage} />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {req.category}
            </span>
          </div>

          <StatusBadge status={req.status} size="lg" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold font-display text-slate-900">
            {req.title}
          </h1>
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900 text-white">
            Status: {req.requestStatus || 'UNDER_REVIEW'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 border-t border-slate-100 pt-3">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            {req.location.town}, {req.location.county} County ({req.location.gpsCoords})
          </span>
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-slate-400" />
            Client: {req.client.name} ({req.client.locationAbroad})
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            Created: {req.createdAt.substring(0, 10)}
          </span>
        </div>
      </div>

      {/* 8-Stage Animated Lifecycle Timeline */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Field Verification Lifecycle
            </h2>
            <div className="text-sm font-bold text-slate-900">
              Current Stage: <span className="text-emerald-700 capitalize">{req.requestStatus?.replace(/_/g, ' ') || 'Under Review'}</span>
            </div>
          </div>
          <div className="text-xs font-semibold text-slate-500">
            Phase: <span className="capitalize font-bold text-slate-800">{req.stage}</span> (Step {req.stage === 'define' ? 1 : req.stage === 'assign' ? 2 : req.stage === 'act' ? 3 : req.stage === 'review' ? 4 : 5} of 5)
          </div>
        </div>

        <Timeline
          steps={[
            {
              id: 't-1',
              label: 'Submitted',
              description: 'Intake scope defined',
              timestamp: req.createdAt?.substring(0, 10),
              status: 'completed'
            },
            {
              id: 't-2',
              label: 'Paid',
              description: req.pricing.quoteStatus === 'paid' ? 'Fee settled' : 'Payment pending',
              status: req.pricing.quoteStatus === 'paid' ? 'completed' : 'current'
            },
            {
              id: 't-3',
              label: 'Agent Assigned',
              description: req.assignedAgent ? req.assignedAgent.name : 'Pending assignment',
              status: req.assignedAgent ? 'completed' : req.pricing.quoteStatus === 'paid' ? 'current' : 'upcoming'
            },
            {
              id: 't-4',
              label: 'Accepted',
              description: req.conflictOfInterestCheck.checked ? 'Conflict clear verified' : 'Awaiting signoff',
              status: req.conflictOfInterestCheck.checked ? 'completed' : req.assignedAgent ? 'current' : 'upcoming'
            },
            {
              id: 't-5',
              label: 'On Site',
              description: req.checkInRecord ? 'GPS confirmed' : req.scheduledVisitDate || 'Scheduled',
              status: (req.checkInRecord || ['ON_SITE', 'VERIFYING', 'EVIDENCE_SUBMITTED', 'UNDER_REVIEW', 'REPORT_READY', 'COMPLETED'].includes(req.requestStatus || '')) ? 'completed' : req.conflictOfInterestCheck.checked ? 'current' : 'upcoming'
            },
            {
              id: 't-6',
              label: 'Evidence Submitted',
              description: `${req.evidence?.length || 0} items captured`,
              status: (req.evidence?.length > 0 || ['EVIDENCE_SUBMITTED', 'UNDER_REVIEW', 'REPORT_READY', 'COMPLETED'].includes(req.requestStatus || '')) ? 'completed' : req.checkInRecord ? 'current' : 'upcoming'
            },
            {
              id: 't-7',
              label: 'Under Review',
              description: req.qaReview ? `By ${req.qaReview.reviewedBy}` : 'QA inspection',
              status: req.qaReview ? 'completed' : (req.evidence?.length > 0) ? 'current' : 'upcoming'
            },
            {
              id: 't-8',
              label: 'Report Ready',
              description: req.qaReview?.publishedToClient ? 'Dossier published' : 'Final review',
              status: (req.qaReview?.publishedToClient || req.requestStatus === 'REPORT_READY' || req.requestStatus === 'COMPLETED') ? 'completed' : req.qaReview ? 'current' : 'upcoming'
            }
          ]}
        />
      </div>

      {/* Check-In Telemetry Card (When on site) */}
      {req.checkInRecord && (
        <div className="bg-emerald-950 text-white p-5 rounded-3xl border border-emerald-800 shadow-md flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Ground Check-In Telemetry Confirmed
              </span>
            </div>
            <div className="text-sm font-bold text-white">
              Agent {req.checkInRecord.agentName} arrived at site coordinates.
            </div>
            <div className="text-xs text-slate-300 font-mono">
              Recorded GPS: {req.checkInRecord.gpsCoords} • Telemetry accuracy: ±{req.checkInRecord.accuracyMeters || 4}m • {req.checkInRecord.timestamp}
            </div>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold">
            ✓ Physical Proximity Verified ({req.checkInRecord.distanceMeters || 12}m from target)
          </div>
        </div>
      )}

      {/* 5-Step Process Visual Stepper (Direct from Document 1, Section 3) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            5-Step Repeatable Request Process (Doc 1 Standard)
          </h2>
          <p className="text-xs text-slate-500">
            Every mission receives a defined scope, price, named responsible person, QA review, and client instruction.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {steps.map((s) => {
            const isCurrent = req.stage === s.key;
            return (
              <div
                key={s.key}
                className={`p-3.5 rounded-2xl border text-xs transition-all ${
                  isCurrent
                    ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    isCurrent ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {s.num}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider">
                      Current
                    </span>
                  )}
                </div>
                <div className="font-bold text-slate-900">{s.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{s.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep-dive sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Scope, Checklist, Evidence, QA Review & Client Decision */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Step 1: Scope & Boundaries */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              Step 1: Agreed Task Brief & Deliverables
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              {req.scopeBrief}
            </p>

            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-bold text-slate-800">Agreed Deliverables:</span>
              <ul className="space-y-1">
                {req.deliverables.map((del, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
              <span className="font-bold flex items-center gap-1.5 text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                Explicit Limitations & Boundaries (Doc 1 Standard):
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800/90">
                {req.explicitLimitations.map((lim, i) => (
                  <li key={i}>{lim}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Step 3: Ground Checklist & Evidence */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Step 3: On-Ground Inspection Checklist
            </h3>

            <div className="space-y-2">
              {req.checklist.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border text-xs flex items-start justify-between gap-3 ${
                    item.status === 'passed'
                      ? 'border-emerald-200 bg-emerald-50/40'
                      : item.status === 'flagged'
                      ? 'border-amber-300 bg-amber-50/60'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-900">{item.label}</div>
                    {item.notes && (
                      <p className="text-[11px] text-slate-600 font-normal">{item.notes}</p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {item.status === 'passed' && (
                      <span className="text-emerald-700 font-bold text-[10px] uppercase bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-200">
                        Passed
                      </span>
                    )}
                    {item.status === 'flagged' && (
                      <span className="text-amber-800 font-black text-[10px] uppercase bg-amber-200 px-2 py-0.5 rounded-lg border border-amber-300">
                        Flagged
                      </span>
                    )}
                    {item.status === 'inconclusive' && (
                      <span className="text-purple-800 font-bold text-[10px] uppercase bg-purple-100 px-2 py-0.5 rounded-lg border border-purple-200">
                        Inconclusive
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Authoritative Field Evidence Experience */}
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Authoritative Field Evidence ({req.evidence.length})
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Cryptographically sealed with SHA-256 integrity fingerprints and GPS telemetry. Click any item to inspect in high resolution.
                </p>
              </div>
              <EvidenceGallery items={req.evidence} requestId={req.id} />
            </div>
          </div>

          {/* Step 4: Nairobi Operations Desk QA Review (when available) */}
          {req.qaReview && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-800 border border-blue-500/20">
                    Step 4: Coordinator QA Determination
                  </span>
                  <span className="text-xs text-slate-400 font-mono">By {req.qaReview.reviewedBy}</span>
                </div>
                <StatusBadge status={req.status} size="sm" />
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-slate-800 block mb-1">Findings Summary:</span>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    {req.qaReview.findingsSummary}
                  </p>
                </div>

                {req.qaReview.contradictions.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
                    <span className="font-bold text-rose-900 block">
                      Discrepancies & Contradictions Flagged:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-rose-800">
                      {req.qaReview.contradictions.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {req.qaReview.whatCouldNotBeVerified.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
                    <span className="font-bold text-purple-900 block">
                      Mandatory Uncertainty Recording (What Could NOT Be Confirmed):
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-purple-800">
                      {req.qaReview.whatCouldNotBeVerified.map((u, i) => (
                        <li key={i}>{u}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <span className="font-bold text-slate-800 block mb-1">Coordinator Recommendation:</span>
                  <p className="text-slate-800 font-semibold bg-blue-50/60 p-3 rounded-xl border border-blue-100 leading-relaxed">
                    {req.qaReview.recommendation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Interactive Client Decision Ledger */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Send className="w-4 h-4 text-emerald-600" />
                  Step 5: Client Action & Instruction Ledger
                </h3>
                <p className="text-xs text-slate-500">
                  DiasporaVerify never holds contractor escrow. As the principal, record your formal instruction based on verified findings.
                </p>
              </div>
            </div>

            <form onSubmit={handleRecordDecision} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1.5">
                  Select Formal Instruction / Payment Action:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { action: 'Approve Findings & Authorize Payment', color: 'border-emerald-500 bg-emerald-50 text-emerald-950' },
                    { action: 'Pause Payment & Issue Rectification Notice', color: 'border-amber-500 bg-amber-50 text-amber-950' },
                    { action: 'Request Specialist Follow-Up Inspection', color: 'border-blue-500 bg-blue-50 text-blue-950' },
                  ].map((btn, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setDecisionAction(btn.action)}
                      className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                        decisionAction === btn.action
                          ? `${btn.color} ring-2 ring-current/20`
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {btn.action}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Client Instruction Note / Direct Message to Contractor & Desk:
                </label>
                <textarea
                  rows={2}
                  value={decisionNote}
                  onChange={(e) => setDecisionNote(e.target.value)}
                  placeholder="Record your specific instruction (e.g. Authorizing 40% payout only; withholding KES 300,000 until cement delivery reconciled)..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Log Client Instruction on Request Ledger</span>
                </button>
              </div>
            </form>

            {/* Past decision ledger */}
            {req.clientDecisionLog && req.clientDecisionLog.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Past Client Instructions Log ({req.clientDecisionLog.length})
                </span>
                <div className="space-y-2">
                  {req.clientDecisionLog.map((log, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-slate-900">{log.action}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{log.date}</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{log.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right 1 Col: Assigned Agent, Trust Check, Pricing */}
        <div className="space-y-6">
          
          {/* Step 2: Assigned Agent Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Step 2: Named Ground Accountability
            </h3>

            {req.assignedAgent ? (
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={req.assignedAgent.avatarUrl}
                    alt={req.assignedAgent.name}
                    width={48}
                    height={48}
                    loading="lazy"
                    decoding="async"
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
                  />
                  <div>
                    <div className="font-bold text-sm text-slate-900">{req.assignedAgent.name}</div>
                    <div className="text-slate-500 text-[11px]">{req.assignedAgent.badgeLevel}</div>
                    <div className="text-emerald-700 font-semibold text-[10px]">
                      ★ {req.assignedAgent.rating} ({req.assignedAgent.totalInspections} audits)
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] space-y-1">
                  <div className="font-bold text-slate-700 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    Conflict of Interest Clearance:
                  </div>
                  <p className="text-slate-600 leading-snug">
                    {req.conflictOfInterestCheck.notes}
                  </p>
                </div>

                {req.scheduledVisitDate && (
                  <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Inspection Date: <strong>{req.scheduledVisitDate}</strong></span>
                  </div>
                )}

                <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 text-[10px] text-blue-900 flex items-start gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-700 flex-shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    <strong>Safeguarding & Anti-Collusion Standard:</strong> Verifier personal phone & email are protected by Nairobi HQ. All instructions, photos, and reports are audited by Nairobi QA to preserve 100% audit independence.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Agent assignment in progress by coordinator.</p>
            )}
          </div>

          {/* Verification Confidence Score Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-sm space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Verification Confidence Metric
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {req.confidenceScore?.ratingTier || 'HIGH'}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-display text-white">
                {req.confidenceScore?.overall ?? 85}
              </span>
              <span className="text-slate-400 text-sm font-semibold">/ 100</span>
            </div>

            <p className="text-[11px] text-slate-300 leading-snug">
              Deterministic calculation based on physical GPS check-in, photographic depth, and signed conflict clearance.
            </p>
          </div>

          {/* Official Verification Report Dossier */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold uppercase tracking-wider text-slate-400 text-xs">
                Official Report Dossier
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                (req.qaReview?.publishedToClient || req.requestStatus === 'REPORT_READY' || req.requestStatus === 'COMPLETED')
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {(req.qaReview?.publishedToClient || req.requestStatus === 'REPORT_READY' || req.requestStatus === 'COMPLETED')
                  ? 'Dossier Ready'
                  : 'QA In Progress'}
              </span>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              {(req.qaReview?.publishedToClient || req.requestStatus === 'REPORT_READY' || req.requestStatus === 'COMPLETED')
                ? 'Standard Field Audit Dossier certified by Nairobi QA desk. Includes cryptographic SHA-256 fingerprint, GPS breadcrumb, and contractor disbursement advisory.'
                : 'Field observations and photographic evidence are currently undergoing contradiction analysis at the Nairobi QA Operations Desk.'}
            </p>

            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={() => onOpenReport(req)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>View Report</span>
              </button>
              <button
                onClick={() => window.print()}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Download Report (PDF)</span>
              </button>
            </div>
          </div>

          {/* Pricing & Service Terms */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-slate-400 text-xs">
              Service Fee & Payment
            </h3>
            <div className="flex items-center justify-between text-slate-700">
              <span>DiasporaVerify Service Fee:</span>
              <span className="font-mono font-bold text-base text-slate-900">
                {FORMAT_CURRENCY(req.pricing.serviceFeeKES, currency)}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500 text-[11px]">
              <span>Payment Status:</span>
              <span className={`font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                req.pricing.quoteStatus === 'paid' 
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                  : 'text-amber-800 bg-amber-50 border-amber-300'
              }`}>
                {req.pricing.quoteStatus}
              </span>
            </div>

            {/* Pay Now Button if unpaid */}
            {req.pricing.quoteStatus !== 'paid' && (
              <button
                onClick={() => setPayModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Pay Fee via M-Pesa / Card</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-500 italic leading-relaxed">
              “DiasporaVerify separates client funds from service fee. Client authorizes all decisions directly.”
            </div>
          </div>

          {/* Dispute Action Link */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-xs space-y-2">
            <span className="font-bold text-slate-700 block">Notice a Discrepancy?</span>
            <p className="text-[11px] text-slate-500 leading-snug">
              If physical evidence is missing or conflicts with reality, escalate directly to Senior Operations.
            </p>
            <button
              onClick={() => navigate('/disputes')}
              className="inline-block text-[11px] font-bold text-rose-600 hover:text-rose-700 text-left"
            >
              Report Issue / Open Formal Dispute →
            </button>
          </div>

          {/* Construction Shortcut if applicable */}
          {req.category === 'construction' && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border border-amber-200 p-6 shadow-sm space-y-3 text-xs">
              <div className="flex items-center gap-2 text-amber-900 font-bold">
                <Layers className="w-4 h-4 text-amber-700" />
                <span>Milestone 3 Oversight Module</span>
              </div>
              <p className="text-amber-800 text-[11px] leading-relaxed">
                This project has active repeat-angle photo comparisons, simulated video walkthrough markers, and a Payment Decision Record ledger.
              </p>
              <button
                onClick={() => onOpenReport(req)}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Open Full Audit Report
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Real Payment Modal */}
      {payModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Payment Gateway
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Authorize Verification Fee
                </h3>
              </div>
              <button
                onClick={() => setPayModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Fee Breakdown Overview */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Mission ID:</span>
                <span className="font-mono font-bold text-slate-900">{req.id}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Location:</span>
                <span className="font-semibold text-slate-800">{req.location.town}, {req.location.county}</span>
              </div>
              {req.pricing.feeBreakdown && (
                <div className="border-t border-slate-200/80 pt-2 space-y-1 text-[11px] text-slate-500">
                  <div className="flex justify-between">
                    <span>Base Field Verification:</span>
                    <span>{FORMAT_CURRENCY(req.pricing.feeBreakdown.serviceBaseFeeKES, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>County Travel & Logistics:</span>
                    <span>{FORMAT_CURRENCY(req.pricing.feeBreakdown.countyTravelFeeKES, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Equipment & Operations:</span>
                    <span>{FORMAT_CURRENCY(req.pricing.feeBreakdown.fieldOperationsFeeKES, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SHA-256 Storage & Platform:</span>
                    <span>{FORMAT_CURRENCY(req.pricing.feeBreakdown.platformFeeKES, currency)}</span>
                  </div>
                </div>
              )}
              <div className="border-t border-slate-300 pt-2 flex justify-between font-bold text-sm text-slate-900">
                <span>Total Due:</span>
                <span className="font-mono text-emerald-700">{FORMAT_CURRENCY(req.pricing.serviceFeeKES, currency)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Select Payment Channel:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'mpesa' as const, label: 'M-Pesa STK', sub: 'Instant KE prompt' },
                  { id: 'card' as const, label: 'Card Payment', sub: 'Visa / Mastercard' },
                  { id: 'bank' as const, label: 'Bank Wire', sub: 'Direct Transfer' },
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      paymentMethod === m.id
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold">{m.label}</div>
                    <div className="text-[10px] text-slate-400">{m.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Form Fields */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsProcessingPayment(true);
                try {
                  const methodName = paymentMethod === 'mpesa' 
                    ? `M-Pesa STK Push (${paymentPhone})` 
                    : paymentMethod === 'card' 
                    ? `International Card (•••• ${cardNumber.slice(-4) || '4242'})` 
                    : 'Bank Wire / SWIFT';

                  const result = await payInvoice(req.id, methodName);
                  if (result.success) {
                    setPaymentTxRef(result.txRef);
                    setToastMessage(`Payment of ${FORMAT_CURRENCY(req.pricing.serviceFeeKES, currency)} confirmed via ${methodName}! Reference: ${result.txRef}`);
                    setTimeout(() => {
                      setPayModalOpen(false);
                      setIsProcessingPayment(false);
                      setPaymentTxRef(null);
                    }, 1200);
                  }
                } catch (err: any) {
                  alert(`Payment error: ${err?.message || 'Gateway error'}`);
                  setIsProcessingPayment(false);
                }
              }}
              className="space-y-4"
            >
              {paymentMethod === 'mpesa' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    M-Pesa Phone Number (Prompt will be sent to this line):
                  </label>
                  <input
                    type="text"
                    value={paymentPhone}
                    onChange={(e) => setPaymentPhone(e.target.value)}
                    placeholder="+254 7XX XXX XXX"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-500">
                    Enter mobile number to receive instant USSD PIN authorization on your device.
                  </p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Card Number:</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Expiry MM/YY:</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        required
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">CVC:</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="123"
                        required
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'bank' && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="font-bold text-slate-900">DiasporaVerify Trust Clearing Account:</div>
                  <div>Bank: <strong>NCBA Bank Kenya</strong> (Upper Hill Branch)</div>
                  <div>Account: <strong>100 482 910 201</strong></div>
                  <div>SWIFT: <strong>CBAFKENX</strong></div>
                  <div className="text-[11px] text-emerald-700 font-bold">Reference: {req.id}</div>
                </div>
              )}

              {paymentTxRef ? (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-center space-y-1 text-xs text-emerald-900">
                  <Check className="w-5 h-5 mx-auto text-emerald-600 stroke-[3]" />
                  <div className="font-bold">Payment Verified! Reference: {paymentTxRef}</div>
                  <div className="text-[11px] text-emerald-700">Updating mission to PAID & Awaiting Verifier...</div>
                </div>
              ) : (
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>
                      {isProcessingPayment 
                        ? 'Authorizing Transaction...' 
                        : `Authorize ${FORMAT_CURRENCY(req.pricing.serviceFeeKES, currency)}`}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayModalOpen(false)}
                    className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
