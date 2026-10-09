import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ShieldCheck, Mail, CheckCircle2, ArrowRight, ArrowLeft } from '../Icons';

export const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || 'your email';
  
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
      setResent(true);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-left">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4 px-4 sm:px-0">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#172A3A] flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-slate-900 tracking-tight">
              Verify Your Email
            </h1>
            <p className="text-xs text-slate-500">
              Account Activation & Security Standard
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 text-xs text-slate-600">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 mx-auto">
            <Mail className="w-6 h-6" />
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-base font-bold text-slate-900">
              Check Your Inbox
            </h2>
            <p className="leading-relaxed">
              We have dispatched an activation link to <strong className="text-slate-900">{emailParam}</strong>. Please click the link inside to verify your identity and activate your Client Portal.
            </p>
          </div>

          {resent && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>A fresh activation link has been dispatched to your email.</span>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue to Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleResend}
              disabled={resending}
              className="w-full py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {resending ? 'Dispatching...' : 'Resend Verification Link'}
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            Did not receive the email? Check your spam folder or contact <span className="text-slate-600 font-medium">info@diasporaverify.co.ke</span>.
          </div>
        </div>
      </div>
    </div>
  );
};
