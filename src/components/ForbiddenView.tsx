import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useVerification } from '../context/VerificationContext';
import { Button } from './ui/Button';

export interface ForbiddenViewProps {
  reason?: string;
  targetResource?: string;
  onBack?: () => void;
}

export const ForbiddenView: React.FC<ForbiddenViewProps> = ({
  reason = 'You do not have permission to access this resource.',
  targetResource,
  onBack,
}) => {
  const navigate = useNavigate();
  const { activeRole, currentUser } = useVerification();

  const handleReturn = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (activeRole === 'admin') {
      navigate('/admin');
    } else if (activeRole === 'agent') {
      navigate('/agent');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-wider">
            403 Authorization Boundary
          </div>
          <h2 className="text-xl font-bold font-display text-slate-900 tracking-tight">
            Access Restricted
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
            {reason}
          </p>
        </div>

        {targetResource && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Target Identifier</div>
            <div className="font-mono text-slate-700 break-all">{targetResource}</div>
            <div className="text-[10px] text-slate-400">
              Authenticated Session: <span className="font-semibold text-slate-600">{currentUser?.email}</span> ({currentUser?.role})
            </div>
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
          <Button variant="primary" onClick={handleReturn}>
            Return to Authorized Workspace
          </Button>
        </div>
      </div>
    </div>
  );
};
