import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useVerification } from '../context/VerificationContext';
import { Eye } from './Icons';

export interface ViewAsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ViewAsModal: React.FC<ViewAsModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { startViewAs, agents, requests } = useVerification();
  const [viewAsTab, setViewAsTab] = useState<'clients' | 'agents'>('clients');

  // Lock background scroll and listen for Escape key
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  // Derive unique clients list
  const uniqueClientsMap = new Map<string, { id: string; name: string; email: string; location: string }>();
  requests.forEach((r) => {
    if (r.client?.email && !uniqueClientsMap.has(r.client.email)) {
      uniqueClientsMap.set(r.client.email, {
        id: `client-${r.client.email.split('@')[0]}`,
        name: r.client.name,
        email: r.client.email,
        location: r.client.locationAbroad,
      });
    }
  });

  const fallbackClients = [
    { id: 'client-01', name: 'Amara Okafor', email: 'amara.okafor@diaspora.co.uk', location: 'London, United Kingdom' },
    { id: 'client-02', name: 'Dr. Kwame Mensah', email: 'kwame.mensah@diaspora.org', location: 'Toronto, Canada' },
    { id: 'client-03', name: 'Zainab Al-Mansoori', email: 'zainab@investments.ae', location: 'Dubai, UAE' },
    { id: 'client-04', name: 'David Kiprono Chemweno', email: 'david.chemweno@techcorp.com', location: 'Dallas, TX, USA' },
  ];

  const clientsList = Array.from(uniqueClientsMap.values());
  const displayClients = clientsList.length > 0 ? clientsList : fallbackClients;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-as-modal-title"
    >
      <div 
        className="bg-white rounded-3xl p-5 sm:p-7 max-w-xl w-full shadow-2xl border border-slate-200 text-left space-y-5 my-auto relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
              <Eye className="w-3 h-3 text-amber-700" />
              <span>Audited Simulation Mode</span>
            </div>
            <h3 id="view-as-modal-title" className="text-base sm:text-lg font-bold text-slate-900 font-display">
              Admin "View As" Experience
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md">
              Simulate the exact portal experience of a diaspora client or on-ground field verifier. Your underlying authentication and privileges remain <strong>ADMIN</strong>.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100/80 border border-slate-200/60 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setViewAsTab('clients')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              viewAsTab === 'clients'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Diaspora Clients</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
              {displayClients.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setViewAsTab('agents')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              viewAsTab === 'agents'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Field Operatives</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono">
              {agents.length}
            </span>
          </button>
        </div>

        {/* Tab Contents: Clients */}
        {viewAsTab === 'clients' && (
          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
            {displayClients.map((client) => (
              <div
                key={client.email}
                className="p-3.5 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-emerald-50/30 hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {client.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate">{client.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{client.email} · {client.location}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    startViewAs('client', client.id, client.name, client.email);
                    onClose();
                    navigate('/dashboard');
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-2xs transition-colors shrink-0 cursor-pointer text-center"
                >
                  Preview Client →
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab Contents: Agents */}
        {viewAsTab === 'agents' && (
          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="p-3.5 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-amber-50/30 hover:border-amber-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-900 border border-amber-300/60 flex items-center justify-center font-bold text-sm shrink-0">
                    {agent.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate">{agent.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">
                      <span className="font-semibold text-amber-800">{agent.badgeLevel}</span> · {agent.primaryCounties.join(', ')}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    startViewAs('agent', agent.id, agent.name, agent.email);
                    onClose();
                    navigate('/agent');
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-2xs transition-colors shrink-0 cursor-pointer text-center"
                >
                  Preview Agent →
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer Notice */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>View-As sessions are recorded in the Nairobi HQ security audit log.</span>
          <button
            type="button"
            onClick={onClose}
            className="font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ViewAsModal;
