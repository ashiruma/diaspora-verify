import React, { useState } from 'react';
import { useVerification } from '../../context/VerificationContext';
import { 
  FileText, 
  Plus, 
  MapPin, 
  X
} from '../Icons';
import { FORMAT_CURRENCY } from '../../data/mockData';

export const CorporateDashboard: React.FC = () => {
  const { organizations, activeOrgId, setActiveOrgId, requests, properties, currency, openReportModal } = useVerification();

  const org = organizations.find(o => o.id === activeOrgId) || organizations[0];

  const [addMemberModal, setAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'admin' | 'manager' | 'member'>('member');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [teamMembers, setTeamMembers] = useState([
    { id: 'tm-1', name: org.contactPerson, email: org.email, role: 'Organization Admin', activeTasks: 4 },
    { id: 'tm-2', name: 'Eng. Samuel Kilonzo', email: 's.kilonzo@ukkenyasacco.org.uk', role: 'Technical Asset Manager', activeTasks: 3 },
    { id: 'tm-3', name: 'Joyce Maina, CPA', email: 'j.maina@ukkenyasacco.org.uk', role: 'Finance / Audit Officer', activeTasks: 1 },
  ]);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;

    setTeamMembers(prev => [
      ...prev,
      {
        id: `tm-${Date.now()}`,
        name: newMemberName,
        email: newMemberEmail,
        role: newMemberRole === 'admin' ? 'Organization Admin' : newMemberRole === 'manager' ? 'Asset Manager' : 'Team Member',
        activeTasks: 0
      }
    ]);

    setToastMessage(`Added ${newMemberName} (${newMemberRole}) to organization.`);
    setAddMemberModal(false);
    setNewMemberName('');
    setNewMemberEmail('');
  };

  const orgRequests = requests.slice(0, 4);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      
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
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              CORPORATE & INSTITUTIONAL PORTAL
            </span>
            <span className="text-xs text-slate-400">Multi-Asset Governance</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white">
            {org.name}
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Centralized due-diligence and on-ground verification infrastructure for Diaspora SACCOs, institutional real-estate funds, legal firms, and asset managers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={activeOrgId}
            onChange={(e) => setActiveOrgId(e.target.value)}
            className="text-xs bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 font-semibold focus:outline-none"
          >
            {organizations.map(o => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Corporate Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Managed Assets</div>
          <div className="text-2xl font-black text-slate-900 font-display mt-0.5">{properties.length + 12}</div>
          <div className="text-[11px] text-emerald-600 font-medium">Plots, sites & premises</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Active Verifications</div>
          <div className="text-2xl font-black text-indigo-700 font-display mt-0.5">{orgRequests.length}</div>
          <div className="text-[11px] text-slate-500 font-medium">Under field review</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Team Members</div>
          <div className="text-2xl font-black text-slate-900 font-display mt-0.5">{teamMembers.length}</div>
          <div className="text-[11px] text-slate-500 font-medium">RBAC seat access</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Audited Volume</div>
          <div className="text-xl font-bold text-slate-900 font-display mt-1">
            {FORMAT_CURRENCY(4850000, currency)}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">Milestone payouts cleared</div>
        </div>
      </div>

      {/* Main Grid: Active Verifications + Team Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Active Institutional Verifications (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Corporate Asset Missions & Inspections
              </h2>
              <p className="text-xs text-slate-500">Live verification status for {org.name} portfolio assets.</p>
            </div>
            <button
              onClick={() => alert('Batch order wizard initiated.')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Batch Intake</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {orgRequests.map((req) => (
              <div key={req.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {req.id}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {req.requestStatus || 'UNDER_REVIEW'}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">{req.title}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{req.location.town}, {req.location.county} • Verifier: {req.assignedAgent?.name || 'Assigned'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openReportModal(req)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Audit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Team Members */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Organization Team
              </h2>
              <p className="text-xs text-slate-500">{teamMembers.length} authorized delegates</p>
            </div>
            <button
              onClick={() => setAddMemberModal(true)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition"
              title="Add Team Member"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          <div className="space-y-3">
            {teamMembers.map(tm => (
              <div key={tm.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{tm.name}</span>
                  <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                    {tm.role}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 truncate">{tm.email}</div>
                <div className="text-[10px] text-slate-400 flex justify-between pt-1 border-t border-slate-200/60">
                  <span>Assigned Missions: {tm.activeTasks}</span>
                  <span className="text-emerald-600 font-semibold">Active Seat</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Add Member Modal */}
      {addMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold text-slate-900">Add Team Member to {org.name}</h2>
              <button onClick={() => setAddMemberModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Samuel Mutiso"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Corporate Email *</label>
                <input
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="e.g. s.mutiso@org.ke"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Access Role</label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="member">Team Member (View & Order)</option>
                  <option value="manager">Asset Manager (Approve Reports & Decisions)</option>
                  <option value="admin">Organization Admin (Manage Members & Billing)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddMemberModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
