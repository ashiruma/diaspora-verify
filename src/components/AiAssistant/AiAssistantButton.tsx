import React, { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { AiAssistantModal } from './AiAssistantModal';
import { useVerification } from '../../context/VerificationContext';
import { normalizeRole } from '../../auth/authorization';

export const AiAssistantButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState<string | undefined>(undefined);
  const { currentUser } = useVerification();
  const role = normalizeRole(currentUser?.role || 'client');

  useEffect(() => {
    const handleOpenEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ prompt?: string }>;
      if (customEvent.detail?.prompt) {
        setInitialPrompt(customEvent.detail.prompt);
      }
      setIsOpen(true);
    };

    window.addEventListener('open-ai-assistant', handleOpenEvent);
    return () => window.removeEventListener('open-ai-assistant', handleOpenEvent);
  }, []);

  const getButtonLabel = () => {
    switch (role) {
      case 'admin':
        return 'Ops Copilot';
      case 'agent':
        return 'Field Copilot';
      default:
        return 'Ask Assistant';
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setInitialPrompt(undefined);
          setIsOpen(true);
        }}
        className="fixed bottom-5 right-5 z-40 px-3.5 py-2.5 rounded-full bg-slate-900 hover:bg-[#0D5C3A] text-white shadow-xl hover:shadow-2xl border border-slate-700/80 transition-all flex items-center gap-2 text-xs font-bold cursor-pointer group hover:scale-105 active:scale-95"
        title="Open AI Assistant & Platform Guide"
        aria-label="Open AI Assistant"
      >
        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
          <Bot className="w-3.5 h-3.5" />
        </div>
        <span className="hidden sm:inline tracking-tight">{getButtonLabel()}</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </button>

      <AiAssistantModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setInitialPrompt(undefined);
        }}
        initialPrompt={initialPrompt}
      />
    </>
  );
};
