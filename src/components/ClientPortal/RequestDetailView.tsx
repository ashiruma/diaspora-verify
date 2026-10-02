import React, { useState } from 'react';
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
  Send,
  Calendar,
  Layers
} from '../Icons';

import { StatusBadge, ProcessStageBadge } from '../CommonBadges';
import { FORMAT_CURRENCY, hasStopPaymentWarning } from '../../data/mockData';

interface RequestDetailViewProps {
  onBack: () => void;
  onOpenReport: (req: any) => void;
}

export const RequestDetailView: React.FC<RequestDetailViewProps> = ({ onBack, onOpenReport }) => {
  const { activeRequest, currency, recordClientDecision } = useVerification();

  const [decisionAction, setDecisionAction] = useState<string>('Approve Findings & Authorize Payment');
  const [decisionNote, setDecisionNote] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!activeRequest) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p className="text-slate-500">Request not found.</p>
        <button onClick={onBack} className="mt-4 text-emerald-600 font-bold text-sm">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const req = activeRequest;
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

        <h1 className="text-2xl font-bold font-display text-slate-900">
          {req.title}
        </h1>

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

            {/* Evidence Gallery */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Captured Visual Evidence ({req.evidence.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {req.evidence.map((ev) => (
                  <div key={ev.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 p-2.5 space-y-2">
                    <div className="h-36 rounded-xl overflow-hidden bg-slate-900">
                      <img src={ev.url} alt={ev.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="font-bold text-slate-900 truncate">{ev.title}</div>
                      <div className="text-[10px] text-slate-500">{ev.cameraAngle}</div>
                      <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                        <span>{ev.timestamp}</span>
                        <span>{ev.locationTag}</span>
                      </div>
                      {ev.uncertaintyFlag && (
                        <div className="p-1 rounded bg-rose-50 border border-rose-200 text-[10px] text-rose-800 font-semibold truncate">
                          ⚠️ {ev.uncertaintyFlag}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
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
              </div>
            ) : (
              <p className="text-xs text-slate-500">Agent assignment in progress by coordinator.</p>
            )}
          </div>

          {/* Pricing & Service Terms */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-slate-400 text-xs">
              Service Fee & Terms
            </h3>
            <div className="flex items-center justify-between text-slate-700">
              <span>DiasporaVerify Service Fee:</span>
              <span className="font-mono font-bold text-base text-slate-900">
                {FORMAT_CURRENCY(req.pricing.serviceFeeKES, currency)}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500 text-[11px]">
              <span>Payment Status:</span>
              <span className="font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {req.pricing.quoteStatus}
              </span>
            </div>

            <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-500 italic leading-relaxed">
              “DiasporaVerify separates client funds from service fee. Client authorizes all decisions directly.”
            </div>
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

    </div>
  );
};
