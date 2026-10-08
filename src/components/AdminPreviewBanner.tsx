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
    <div className="sticky top-0 z-50 bg-amber-500 text-slate-950 px-4 py-2 text-xs font-medium shadow-md flex items-center justify-between border-b border-amber-600/30">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-950 text-amber-300 shadow-xs">
          ADMIN PREVIEW
        </span>
        <span className="font-semibold text-slate-900">
          Viewing {viewAsSession.viewRole} experience for{' '}
          <strong className="font-bold underline decoration-slate-900/40 underline-offset-2">
            {viewAsSession.targetName}
          </strong>
        </span>
        <span className="hidden md:inline text-[11px] text-slate-800/80">
          · Underlying role remains ADMIN (Audited session)
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleExit}
          className="bg-slate-950 text-white hover:bg-slate-900 px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-xs"
        >
          Exit Preview ✕
        </button>
      </div>
    </div>
  );
};
