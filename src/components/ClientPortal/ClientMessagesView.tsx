import React, { useState } from 'react';
import { useVerification } from '../../context/VerificationContext';
import { 
  Send, 
  Smartphone, 
  Briefcase, 
  ShieldCheck, 
  FileText
} from '../Icons';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';

interface ChatMessage {
  id: string;
  sender: 'client' | 'agent' | 'coordinator';
  senderName: string;
  text: string;
  timestamp: string;
}

export const ClientMessagesView: React.FC = () => {
  const { clientRequests, currentUser } = useVerification();
  const [selectedReqId, setSelectedReqId] = useState<string>(clientRequests[0]?.id || '');
  const [inputText, setInputText] = useState('');

  const activeReq = clientRequests.find((r) => r.id === selectedReqId) || clientRequests[0];

  // Dynamic state of messages per request
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>({
    'DV-2026-KJD-0104': [
      {
        id: 'msg-1',
        sender: 'coordinator',
        senderName: 'Amara Kiprotich (Nairobi Ops)',
        text: 'Hello David, verifier Eng. Evans Kiptoo has accepted the mission and verified zero conflict of interest.',
        timestamp: '2026-10-09 10:30',
      },
      {
        id: 'msg-2',
        sender: 'agent',
        senderName: 'Eng. Evans Kiptoo (Verifier)',
        text: 'Arrived at the Kitengela construction site. Currently performing physical bag count for 32.5R cement in the store.',
        timestamp: '2026-10-10 14:15',
      },
      {
        id: 'msg-3',
        sender: 'coordinator',
        senderName: 'Amara Kiprotich (Nairobi Ops)',
        text: 'Warning: 80 bags missing from invoiced bill of quantities. Stop-payment advisory has been attached to your report dossier.',
        timestamp: '2026-10-11 09:40',
      },
    ],
  });

  const activeMessages = activeReq ? (messagesMap[activeReq.id] || [
    {
      id: 'default-1',
      sender: 'coordinator',
      senderName: 'Nairobi Operations Desk',
      text: `Direct communication channel open for mission ${activeReq.id}. All instructions and telemetry are cryptographically logged.`,
      timestamp: activeReq.createdAt.substring(0, 16),
    }
  ]) : [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeReq) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'client',
      senderName: currentUser?.name || 'David Mwangi (Client)',
      text: inputText.trim(),
      timestamp: new Date().toISOString().substring(0, 16).replace('T', ' '),
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeReq.id]: [...(prev[activeReq.id] || []), newMsg],
    }));
    setInputText('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6 font-sans text-left">
      {/* Page Header */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
          Secure Communications
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mt-1">
          Direct, encrypted audit log between you, the Nairobi coordination team, and your deployed field verifier.
        </p>
      </div>

      {clientRequests.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-6 h-6" />}
          title="No active missions to message"
          description="Messages are grouped by active verification requests. Submit a verification request to begin direct communications."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs min-h-[600px]">
          {/* Left: Mission Thread Selector (4 cols) */}
          <div className="md:col-span-4 border-r border-slate-200 p-4 space-y-3 bg-slate-50/50">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
              Active Missions ({clientRequests.length})
            </div>

            <div className="space-y-1.5 overflow-y-auto max-h-[520px]">
              {clientRequests.map((req) => {
                const isSelected = req.id === activeReq?.id;
                return (
                  <button
                    key={req.id}
                    onClick={() => setSelectedReqId(req.id)}
                    className={`w-full p-3 rounded-2xl text-left transition-all ${
                      isSelected
                        ? 'bg-white border border-slate-300 shadow-xs'
                        : 'hover:bg-slate-100/80 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono font-bold text-slate-700">{req.id}</span>
                      <span className="text-[10px] text-slate-400 capitalize">{req.category}</span>
                    </div>
                    <div className="font-bold text-xs text-slate-900 line-clamp-1">
                      {req.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                      <span>{req.location.county}</span>
                      {req.assignedAgent && (
                        <span className="text-emerald-700 font-medium">{req.assignedAgent.name}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Active Mission Chat Stream (8 cols) */}
          <div className="md:col-span-8 flex flex-col justify-between p-6">
            {/* Thread Header */}
            {activeReq && (
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {activeReq.id}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">{activeReq.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Field Verifier: {activeReq.assignedAgent ? activeReq.assignedAgent.name : 'Pending Assignment'} · Location: {activeReq.location.town}, {activeReq.location.county}
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Audit Trail Active</span>
                </div>
              </div>
            )}

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto py-6 space-y-4 max-h-[420px] pr-2">
              {activeMessages.map((msg) => {
                const isClient = msg.sender === 'client';
                const isAgent = msg.sender === 'agent';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400">
                      {isClient ? (
                        <span className="font-semibold text-emerald-800">{msg.senderName}</span>
                      ) : isAgent ? (
                        <span className="font-semibold text-amber-800 flex items-center gap-1">
                          <Smartphone className="w-3 h-3" /> {msg.senderName}
                        </span>
                      ) : (
                        <span className="font-semibold text-blue-800 flex items-center gap-1">
                          <Briefcase className="w-3 h-3" /> {msg.senderName}
                        </span>
                      )}
                      <span>· {msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl max-w-lg text-xs leading-relaxed ${
                        isClient
                          ? 'bg-emerald-700 text-white rounded-tr-xs'
                          : isAgent
                          ? 'bg-amber-50 text-amber-950 border border-amber-200 rounded-tl-xs'
                          : 'bg-slate-100 text-slate-900 rounded-tl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="pt-4 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type instructions or questions for verifier or coordinator..."
                className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-300 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
              <Button
                type="submit"
                variant="secondary"
                size="md"
                leftIcon={<Send className="w-3.5 h-3.5" />}
              >
                Send
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
