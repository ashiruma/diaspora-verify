import React, { useState } from 'react';
import { useVerification } from '../../context/VerificationContext';
import { 
  AlertTriangle, 
  FileText, 
  Check, 
  Award,
  UserCheck,
  Calendar,
  ShieldCheck,
  X
} from '../Icons';
import { StatusBadge, ProcessStageBadge } from '../CommonBadges';
import type { VerificationStatus } from '../../types';
import { FORMAT_CURRENCY, hasStopPaymentWarning } from '../../data/mockData';

export const OperationsDashboard: React.FC<{ onOpenReport: (req: any) => void }> = ({ onOpenReport }) => {
  const { 
    requests, 
    agents, 
    submitQAReview, 
    assignAgent,
    currency 
  } = useVerification();


  const [selectedReqId, setSelectedReqId] = useState<string>(requests[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'triage' | 'qa' | 'agents'>('qa');

  // QA Review form state for selected request
  const activeReq = requests.find(r => r.id === selectedReqId) || requests[0];

  const [qaStatus, setQaStatus] = useState<VerificationStatus>(activeReq?.status || 'observed');
  const [qaFindings, setQaFindings] = useState(activeReq?.qaReview?.findingsSummary || '');
  const [qaRecommendation, setQaRecommendation] = useState(activeReq?.qaReview?.recommendation || '');
  const [stopPaymentAlert, setStopPaymentAlert] = useState(activeReq?.paymentDecisionRecord?.stopPaymentAlert || false);
  const [contradictionInput, setContradictionInput] = useState('');
  const [contradictionsList, setContradictionsList] = useState<string[]>(activeReq?.qaReview?.contradictions || []);
  const [uncertaintyInput, setUncertaintyInput] = useState('');
  const [uncertaintiesList, setUncertaintiesList] = useState<string[]>(activeReq?.qaReview?.whatCouldNotBeVerified || []);

  // Agent Assignment Modal State
  const [assigningReqId, setAssigningReqId] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || '');
  const [scheduledDate, setScheduledDate] = useState<string>('2026-10-14');
  const [conflictNotes, setConflictNotes] = useState<string>('Agent signed conflict-of-interest disclosure; verified zero financial, family, or clan relation to contractor or landowner.');
  const [conflictConfirmed, setConflictConfirmed] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
    });
    setToastMessage(`QA Review and official findings published to Client Portal for ${activeReq.id}!`);
  };

  const assigningRequest = assigningReqId ? requests.find(r => r.id === assigningReqId) : null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      
      {/* Operations Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
              NAIROBI OPERATIONS DESK
            </span>
            <span className="text-xs text-slate-400">Controlled Request Register</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white">
            Operations, Assignment & QA Review
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Triage client requests, assign vetted local verifiers, verify conflicts of interest, 
            and review ground evidence before publishing official audit findings.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-800 p-1.5 rounded-2xl border border-slate-700 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('qa')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'qa' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            QA Review & Publish
          </button>
          <button
            onClick={() => setActiveTab('triage')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'triage' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Intake Register ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('agents')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'agents' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Vetted Agents ({agents.length})
          </button>
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

      {/* Main Tab Content */}
      {activeTab === 'qa' && (
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

                  <button
                    onClick={() => onOpenReport(activeReq)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Preview Report
                  </button>
                </div>

                {/* Evidence Quick Strip */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span>Field Agent Raw Submissions ({activeReq.evidence.length} Items)</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-normal">
                        Agent: <strong className="text-slate-700">{activeReq.assignedAgent?.name || 'Unassigned'}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenAssignModal(activeReq.id)}
                        className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-[10px] font-bold border border-blue-200 transition-colors"
                      >
                        {activeReq.assignedAgent ? 'Reassign' : '+ Assign Agent'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {activeReq.evidence.map(ev => (
                      <div key={ev.id} className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-1.5">
                        <img src={ev.url} alt={ev.title} className="w-full h-20 object-cover rounded-lg" />
                        <div className="text-[10px] font-bold text-slate-800 truncate mt-1">{ev.title}</div>
                        <div className="text-[9px] text-slate-400 font-mono">{ev.gpsCoords}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* QA Review Controls */}
                <div className="space-y-4 border-t border-slate-100 pt-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Coordinator QA Determination (Reference Doc 1 & 2 Standard)
                  </h3>

                  {/* Classification Picker */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      1. Final Verification Classification
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {[
                        { id: 'observed', label: 'Observed', color: 'border-emerald-500 bg-emerald-50 text-emerald-950' },
                        { id: 'partly_observed', label: 'Partly Observed', color: 'border-amber-500 bg-amber-50 text-amber-950' },
                        { id: 'not_observed', label: 'Not Observed', color: 'border-rose-500 bg-rose-50 text-rose-950' },
                        { id: 'cannot_confirm', label: 'Cannot Confirm', color: 'border-purple-500 bg-purple-50 text-purple-950' },
                      ].map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setQaStatus(item.id as VerificationStatus)}
                          className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                            qaStatus === item.id ? `${item.color} ring-2 ring-current/20` : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Findings summary */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      2. Coordinator Findings & Ground Summary
                    </label>
                    <textarea
                      rows={3}
                      value={qaFindings}
                      onChange={(e) => setQaFindings(e.target.value)}
                      placeholder="Summarize the core findings observed on ground..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    />
                  </div>

                  {/* Contradictions & Discrepancies */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      3. Flag Contradictions & Unexplained Variances
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={contradictionInput}
                        onChange={(e) => setContradictionInput(e.target.value)}
                        placeholder="e.g. Contractor claimed 100% slab shuttered; observed only 40% in place"
                        className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddContradiction}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold"
                      >
                        Add Flag
                      </button>
                    </div>

                    {contradictionsList.length > 0 && (
                      <div className="space-y-1 pt-1">
                        {contradictionsList.map((c, i) => (
                          <div key={i} className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center justify-between">
                            <span>• {c}</span>
                            <button
                              type="button"
                              onClick={() => setContradictionsList(prev => prev.filter((_, idx) => idx !== i))}
                              className="text-rose-500 hover:text-rose-700 font-bold text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Explicit Limitations / What could not be verified */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      4. What Could NOT Be Verified (Mandatory Uncertainty Recording)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={uncertaintyInput}
                        onChange={(e) => setUncertaintyInput(e.target.value)}
                        placeholder="e.g. Sub-surface foundation depth; cement origin without mill certificate"
                        className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddUncertainty}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold"
                      >
                        Add Uncertainty
                      </button>
                    </div>

                    {uncertaintiesList.length > 0 && (
                      <div className="space-y-1 pt-1">
                        {uncertaintiesList.map((u, i) => (
                          <div key={i} className="p-2 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-center justify-between">
                            <span>• {u}</span>
                            <button
                              type="button"
                              onClick={() => setUncertaintiesList(prev => prev.filter((_, idx) => idx !== i))}
                              className="text-purple-500 hover:text-purple-700 font-bold text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recommendation & Stop Payment Toggle */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        5. Recommendation to Diaspora Client
                      </label>
                      <textarea
                        rows={2}
                        value={qaRecommendation}
                        onChange={(e) => setQaRecommendation(e.target.value)}
                        placeholder="Actionable recommendation for next step or payment instruction..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      />
                    </div>

                    {/* Stop payment trigger */}
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <span>Trigger Urgent STOP PAYMENT Alert to Client</span>
                        </div>
                        <p className="text-[11px] text-amber-800">
                          Recommended when physical work lags billing by {'>'}25%, materials are missing, or access was denied.
                        </p>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={stopPaymentAlert}
                          onChange={(e) => setStopPaymentAlert(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Publish CTA */}
                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveQAReview}
                      className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Publish Verified QA Report to Client Portal</span>
                    </button>
                  </div>

                </div>

              </div>
            ) : (
              <p className="text-slate-500">Please select a request from the queue.</p>
            )}
          </div>

        </div>
      )}

      {/* Intake Register Tab */}
      {activeTab === 'triage' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Intake Register & Pricing Matrix</h2>
            <span className="text-xs text-slate-500">{requests.length} Active Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Request ID</th>
                  <th className="p-3">Title & Client</th>
                  <th className="p-3">County / Town</th>
                  <th className="p-3">Assigned Verifier</th>
                  <th className="p-3">Stage</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Fee Quote</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-600">{r.id}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{r.title}</div>
                      <div className="text-[11px] text-slate-500">{r.client.name} ({r.client.locationAbroad})</div>
                    </td>
                    <td className="p-3">
                      <div>{r.location.town}</div>
                      <div className="text-[11px] text-slate-500">{r.location.county}</div>
                    </td>
                    <td className="p-3">
                      {r.assignedAgent ? (
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-800">{r.assignedAgent.name}</div>
                          <button
                            onClick={() => handleOpenAssignModal(r.id)}
                            className="text-[10px] text-blue-600 hover:text-blue-800 hover:underline font-semibold"
                          >
                            Reassign
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenAssignModal(r.id)}
                          className="px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[10px] border border-amber-300"
                        >
                          + Assign Agent
                        </button>
                      )}
                    </td>
                    <td className="p-3"><ProcessStageBadge stage={r.stage} /></td>
                    <td className="p-3"><StatusBadge status={r.status} size="sm" /></td>
                    <td className="p-3 font-mono font-semibold">{FORMAT_CURRENCY(r.pricing.serviceFeeKES, currency)}</td>
                    <td className="p-3 space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedReqId(r.id);
                          setActiveTab('qa');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold hover:bg-blue-100"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => handleOpenAssignModal(r.id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
                      >
                        {r.assignedAgent ? 'Reassign' : 'Assign'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vetted Agents Matrix Tab */}
      {activeTab === 'agents' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Vetted Ground Agent Roster</h2>
              <p className="text-xs text-slate-500">Every agent undergoes ID vetting, background checks, and signs conflict disclosures.</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              {agents.length} Active in Field
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {agents.map(agt => (
              <div key={agt.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <img src={agt.avatarUrl} alt={agt.name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500" />
                  <div>
                    <div className="font-bold text-sm text-slate-900">{agt.name}</div>
                    <div className="text-[11px] text-slate-500">{agt.badgeLevel}</div>
                    <div className="text-emerald-700 font-bold text-[10px]">
                      ★ {agt.rating} ({agt.totalInspections} Verified Missions)
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-600">Counties Covered:</span>
                  <div className="flex flex-wrap gap-1">
                    {agt.primaryCounties.map(c => (
                      <span key={c} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] text-slate-700">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-600">Specialties:</span>
                  <div className="text-[11px] text-slate-500">
                    {agt.specialties.join(', ')}
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[11px] text-emerald-800 font-bold">
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    Conflict Clearance Signed
                  </span>
                  <span className="text-slate-400 font-mono">{agt.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assign Verifier Modal */}
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
