import React from 'react';
import { useVerification } from '../context/VerificationContext';
import { useNavigate } from 'react-router-dom';

export const AdminPreviewBanner: React.FC = () => {
  const { viewAsSession, exitViewAs } = useVerification();
  const navigate = useNavigate();

  if (!viewAsSession || !viewAsSession.active) {
    return null;
  }

  const handleExit = () => {
    exitViewAs();
    navigate('/admin');
  };

  return (
    <div className="sticky top-0 z-50 bg-amber-500 text-slate-950 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-medium shadow-md flex items-center justify-between gap-2 border-b border-amber-600/30 w-full max-w-full overflow-hidden">
      <div className="flex items-center gap-2 min-w-0">
        <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-950 text-amber-300 shadow-xs flex-shrink-0">
          PREVIEW
        </span>
        <span className="font-semibold text-slate-950 text-xs truncate">
          Viewing {viewAsSession.viewRole}: <strong className="font-bold underline decoration-slate-900/30 underline-offset-2">{viewAsSession.targetName}</strong>
        </span>
        <span className="hidden lg:inline text-[11px] text-slate-800/80 flex-shrink-0">
          · Underlying role remains ADMIN (Audited session)
        </span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleExit}
          className="bg-slate-950 text-white hover:bg-slate-900 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap"
        >
          Exit Preview ✕
        </button>
      </div>
    </div>
  );
};
