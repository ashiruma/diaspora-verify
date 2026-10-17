import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Send,
  X,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  PhoneCall,
  RefreshCw,
} from 'lucide-react';
import { useVerification } from '../../context/VerificationContext';
import { AiAssistantService, type AiMessage } from '../../services/aiAssistantService';
import { normalizeRole } from '../../auth/authorization';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose, initialPrompt }) => {
  const navigate = useNavigate();
  const { currentUser, clientRequests, agentRequests, activeRequest } = useVerification();
  const rawRole = currentUser?.role || 'client';
  const role = normalizeRole(rawRole);

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine Role Title & Role Color
  const getRoleHeader = () => {
    switch (role) {
      case 'admin':
        return {
          title: 'Ops Safeguard Copilot',
          subtitle: 'Nairobi Operations & Anti-Collusion Intelligence',
          tag: 'Admin Oversight',
        };
      case 'agent':
        return {
          title: 'Field Site Copilot',
          subtitle: 'Ground Mission Protocol & Checklist Assistant',
          tag: 'Verifier Desk',
        };
      default:
        return {
          title: 'Balozi AI Assistant',
          subtitle: 'Diaspora Project Guide & System Navigator',
          tag: 'Client Concierge',
        };
    }
  };

  const headerInfo = getRoleHeader();

  // Initialize initial greeting or handle initialPrompt when opened
  useEffect(() => {
    if (isOpen) {
      if (initialPrompt) {
        // Automatically send the initial prompt
        const userMessage: AiMessage = {
          id: `usr-${Date.now()}`,
          sender: 'user',
          timestamp: new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }),
          content: initialPrompt,
        };
        setMessages([userMessage]);
        setIsTyping(true);
        setTimeout(() => {
          const response = AiAssistantService.handleQuery(initialPrompt, {
            role,
            user: currentUser,
            requests: role === 'agent' ? agentRequests : clientRequests,
            activeRequest,
          });
          setMessages([userMessage, response]);
          setIsTyping(false);
        }, 350);
      } else if (messages.length === 0) {
        const initialGreeting: AiMessage = {
          id: 'init-1',
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }),
          content:
            role === 'admin'
              ? 'Operations intelligence online. I monitor bi-directional data leak protection, assist in verifier matching, and summarize incoming inspection dossiers. How can I help today?'
              : role === 'agent'
              ? 'Field Copilot ready. I can assist you with your active mission checklist, repeat photo angles, boundary beacon rules, and obstacle reporting to Nairobi HQ.'
              : 'Jambo! I am your DiasporaVerify Assistant. I can help you navigate the system, explain how our ground verifiers work, book a site inspection, or connect you with a human coordinator.',
          suggestedPrompts:
            role === 'admin'
              ? [
                  'Ensure platform is running smoothly and there are no data leaks',
                  'Review who joined recently',
                  'Check unassigned diaspora requests',
                  'Open financial cockpit',
                ]
              : role === 'agent'
              ? [
                  'Remind me about my active projects',
                  'What photos are required for foundation?',
                  'Site access is blocked by watchman',
                  'Standard photo evidence requirements',
                ]
              : [
                  'How does the agency work?',
                  'Help me navigate through the system',
                  'What is the status of my project?',
                  'Speak to a human operations coordinator',
                ],
        };
        setMessages([initialGreeting]);
      }
    }
  }, [isOpen, initialPrompt, role]);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMessage: AiMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }),
      content: query,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate natural response latency (400ms)
    setTimeout(() => {
      const response = AiAssistantService.handleQuery(query, {
        role,
        user: currentUser,
        requests: role === 'agent' ? agentRequests : clientRequests,
        activeRequest,
      });

      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 400);
  };

  const handleActionClick = (path: string) => {
    onClose();
    navigate(path);
  };

  const handleResetConversation = () => {
    setMessages([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs font-sans">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[80vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Bar */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white tracking-tight">{headerInfo.title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold uppercase">
                  {headerInfo.tag}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{headerInfo.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetConversation}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Reset Conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Close Assistant (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Anti-Collusion & Privacy Guarantee Badge */}
        <div className="px-5 py-2 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Anti-Collusion Safeguard Active</span>
          </div>
          <span className="text-[10px] text-slate-400">Zero Contact Leaks Enforced</span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-[#0D5C3A] text-white rounded-br-xs'
                    : msg.securityAlert
                    ? 'bg-rose-50 text-rose-950 border border-rose-300 rounded-bl-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                }`}
              >
                {/* Security alert indicator */}
                {msg.securityAlert && (
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold font-mono text-xs uppercase mb-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Security Protocol Notice</span>
                  </div>
                )}

                {/* Human escalation indicator */}
                {msg.requiresHumanEscalation && (
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold font-mono text-xs uppercase mb-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Human Escalation Triggered</span>
                  </div>
                )}

                <p className="whitespace-pre-line">{msg.content}</p>

                {/* Direct Action Navigation Button */}
                {msg.action && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-1">
                    {msg.action.description && (
                      <span className="text-[11px] text-slate-500 font-normal">
                        {msg.action.description}
                      </span>
                    )}
                    <button
                      onClick={() => handleActionClick(msg.action!.path)}
                      className="self-start px-3.5 py-1.5 rounded-lg bg-[#0D5C3A] hover:bg-[#094229] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer mt-1"
                    >
                      <span>{msg.action.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Timestamp */}
              <span className="text-[10px] text-slate-400 font-mono mt-1 px-1">
                {msg.timestamp}
              </span>

              {/* Suggested Prompt Chips */}
              {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[90%]">
                  {msg.suggestedPrompts.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(chip)}
                      className="px-2.5 py-1 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium transition cursor-pointer text-left"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-200 max-w-[120px] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0D5C3A] animate-ping" />
              <span className="text-xs text-slate-500 font-mono">Thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              role === 'admin'
                ? 'Ask about data leaks, matchmaker, or member directory...'
                : role === 'agent'
                ? 'Ask about mission checklist, site check-in, or report an issue...'
                : 'Ask for help with booking, navigation, or active requests...'
            }
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D5C3A] focus:border-transparent transition bg-slate-50 focus:bg-white"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-[#0D5C3A] hover:bg-[#094229] disabled:opacity-40 text-white font-bold transition shadow-xs cursor-pointer disabled:cursor-not-allowed shrink-0"
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
