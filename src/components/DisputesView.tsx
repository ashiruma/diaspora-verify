import React, { useState } from 'react';
import { useVerification } from '../context/VerificationContext';
import { 
  CheckCircle2, 
  Plus, 
  X, 
  Check
} from './Icons';
import type { DisputeRecord } from '../types';
import { PortalLayout } from './layout/PortalLayout';

export const DisputesView: React.FC = () => {
  const { 
    disputes, 
    requests, 
    activeRole, 
    createDispute, 
    resolveDispute 
  } = useVerification();

  const [activeTab, setActiveTab] = useState<'all' | 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED'>('all');
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(disputes[0]?.id || null);

  // Resolution modal state (Operations)
  const [resolvingDisputeId, setResolvingDisputeId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [resolutionAction, setResolutionAction] = useState('Re-inspection completed with verified evidence');

  // File new dispute modal state (Client)
  const [newDisputeOpen, setNewDisputeOpen] = useState(false);
  const [selectedReqId, setSelectedReqId] = useState<string>(requests[0]?.id || '');
  const [disputeReason, setDisputeReason] = useState<DisputeRecord['reason']>('Insufficient evidence');
  const [disputeDescription, setDisputeDescription] = useState('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredDisputes = disputes.filter(d => 
    activeTab === 'all' ? true : d.status === activeTab
  );

  const selectedDispute = disputes.find(d => d.id === selectedDisputeId) || disputes[0];

  const handleCreateDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeDescription.trim()) {
      alert('Please explain the reason for the dispute.');
      return;
    }

    const id = createDispute(selectedReqId, disputeReason, disputeDescription);
    setToastMessage(`Dispute filed for ${selectedReqId}. Escalated to Nairobi Operations Desk.`);
    setNewDisputeOpen(false);
    setDisputeDescription('');
    setSelectedDisputeId(id);
  };

  const handleResolveDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingDisputeId) return;

    resolveDispute(resolvingDisputeId, adminNotes, resolutionAction);
    setToastMessage(`Dispute ${resolvingDisputeId} marked as RESOLVED.`);
    setResolvingDisputeId(null);
    setAdminNotes('');
  };

  return (
    <PortalLayout
      title="Disputes & Escalations"
      subtitle="Thursday, 8 October 2026 · Formal Accountability Desk"
      role={activeRole === 'admin' ? 'admin' : 'client'}
      activeTab="disputes"
    >
      <div className="space-y-6">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="bg-emerald-700 text-white px-5 py-3 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-lg">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-4 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
              DISPUTE RESOLUTION & QA ESCALATION
            </span>
            <span className="text-xs text-slate-400">Formal Accountability Desk</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white">
            Client Disputes & Discrepancy Escalation
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Clients can report incomplete assignments, insufficient photographic evidence, or suspected contractor/agent contradictions. Reviewed and resolved independently by Senior Operations Coordinators.
          </p>
        </div>

        {activeRole === 'client' && (
          <button
            onClick={() => setNewDisputeOpen(true)}
            className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/20 self-start md:self-auto transition"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Report Issue / Open Dispute</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        {(['all', 'OPEN', 'UNDER_REVIEW', 'RESOLVED'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === tab 
                ? 'bg-slate-900 text-white' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab === 'all' ? 'All Disputes' : tab.replace('_', ' ')}
            <span className="ml-1.5 opacity-70">
              ({tab === 'all' ? disputes.length : disputes.filter(d => d.status === tab).length})
            </span>
          </button>
        ))}
      </div>

      {/* Main Grid: List + Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left List */}
        <div className="space-y-3">
          {filteredDisputes.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
              No disputes found in this category.
            </div>
          ) : (
            filteredDisputes.map(disp => (
              <div
                key={disp.id}
                onClick={() => setSelectedDisputeId(disp.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedDispute?.id === disp.id 
                    ? 'border-emerald-600 bg-emerald-50/40 shadow-xs' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[11px] font-bold text-slate-700">{disp.requestId}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    disp.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                    disp.status === 'UNDER_REVIEW' ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {disp.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-900 line-clamp-1">{disp.reason}</div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{disp.description}</p>
                <div className="text-[10px] text-slate-400 mt-2 flex justify-between">
                  <span>By: {disp.clientName}</span>
                  <span>{disp.createdAt.substring(0, 10)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Detail Card */}
        <div className="lg:col-span-2">
          {selectedDispute ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                      {selectedDispute.id}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      selectedDispute.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                      selectedDispute.status === 'UNDER_REVIEW' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {selectedDispute.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-2">
                    Dispute: {selectedDispute.reason}
                  </h2>
                  <div className="text-xs text-slate-500">
                    Linked Mission Reference: <strong>{selectedDispute.requestId}</strong>
                  </div>
                </div>

                {activeRole === 'operations' && selectedDispute.status !== 'RESOLVED' && (
                  <button
                    onClick={() => {
                      setResolvingDisputeId(selectedDispute.id);
                      setAdminNotes(selectedDispute.adminNotes || '');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Investigate & Resolve</span>
                  </button>
                )}
              </div>

              {/* Client Statement */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Client Statement ({selectedDispute.clientName})
                </span>
                <p className="text-slate-800 leading-relaxed font-medium">
                  "{selectedDispute.description}"
                </p>
                <div className="text-[11px] text-slate-400 pt-1">
                  Submitted: {selectedDispute.createdAt}
                </div>
              </div>

              {/* Administrative Resolution Record */}
              <div className="space-y-3 text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Operations Investigation & Findings
                </span>
                
                {selectedDispute.adminNotes ? (
                  <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-2">
                    <p className="text-slate-800 font-medium">
                      {selectedDispute.adminNotes}
                    </p>
                    {selectedDispute.resolutionAction && (
                      <div className="text-[11px] text-emerald-800 font-bold flex items-center gap-1.5 pt-1 border-t border-blue-100">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Action: {selectedDispute.resolutionAction}</span>
                      </div>
                    )}
                    {selectedDispute.resolvedAt && (
                      <div className="text-[10px] text-slate-400">
                        Resolved on {selectedDispute.resolvedAt}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 text-amber-900">
                    Awaiting Senior Operations Coordinator review and field evidence re-inspection.
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
              Select a dispute to review details.
            </div>
          )}
        </div>

      </div>

      {/* File Dispute Modal */}
      {newDisputeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">File a Formal Dispute</h2>
                <p className="text-xs text-slate-500">Escalate an assignment for independent re-investigation.</p>
              </div>
              <button onClick={() => setNewDisputeOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDispute} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Verification Mission *</label>
                <select
                  value={selectedReqId}
                  onChange={(e) => setSelectedReqId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-mono"
                >
                  {requests.map(r => (
                    <option key={r.id} value={r.id}>{r.id} — {r.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Dispute *</label>
                <select
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Incorrect information">Incorrect Information in Findings</option>
                  <option value="Insufficient evidence">Insufficient Photographic / Video Evidence</option>
                  <option value="Incomplete assignment">Incomplete Checklist Protocol Execution</option>
                  <option value="Agent misconduct">Agent Conduct / Conflict of Interest Concern</option>
                  <option value="Technical issue">Technical Issue / GPS Telemetry Mismatch</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Explanation & Ground Facts *</label>
                <textarea
                  required
                  rows={4}
                  value={disputeDescription}
                  onChange={(e) => setDisputeDescription(e.target.value)}
                  placeholder="Explain exactly what discrepancy was observed, what was missing from the report, or why the findings are disputed."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewDisputeOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  Submit Dispute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolve Dispute Modal (Operations) */}
      {resolvingDisputeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Resolve Dispute #{resolvingDisputeId}</h2>
                <p className="text-xs text-slate-500">Record administrative findings and formal resolution.</p>
              </div>
              <button onClick={() => setResolvingDisputeId(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResolveDispute} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Resolution Action *</label>
                <input
                  type="text"
                  required
                  value={resolutionAction}
                  onChange={(e) => setResolutionAction(e.target.value)}
                  placeholder="e.g. Re-survey completed; boundary beacons located and re-photographed."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Investigation Notes & Findings *</label>
                <textarea
                  required
                  rows={4}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Summarize investigation, evidence reviewed, conversations with verifier, and final outcome."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResolvingDisputeId(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold"
                >
                  Confirm & Resolve Dispute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </div>
    </PortalLayout>
  );
};
