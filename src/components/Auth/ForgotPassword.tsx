import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, Lock } from '../Icons';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please provide a valid registered email address.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-left">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4 px-4 sm:px-0">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to DiasporaVerify Home</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#172A3A] flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-slate-900 tracking-tight">
              Reset Your Password
            </h1>
            <p className="text-xs text-slate-500">
              DiasporaVerify Account Recovery & Security
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
          {submitted ? (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Password Reset Link Dispatched</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  If an account exists for <strong>{email}</strong>, a secure password reset link has been dispatched. For security reasons, the link will expire in 60 minutes.
                </p>
              </div>

              <div className="pt-2 text-center space-y-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-emerald-700 transition-colors"
                >
                  <span>Return to Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Enter your registered client or verifier email address. We will verify your account and send a secure one-time password reset link.
              </p>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 font-medium">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Account Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. yourname@domain.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{loading ? 'Verifying Account...' : 'Send Password Reset Link'}</span>
              </button>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-slate-500">
                <Link to="/login" className="hover:text-slate-800 font-semibold">
                  Remember password? Sign In
                </Link>
                <Link to="/register" className="hover:text-slate-800 font-semibold">
                  Create Account
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
