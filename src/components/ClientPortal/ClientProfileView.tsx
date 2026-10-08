import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVerification } from '../../context/VerificationContext';
import { 
  ShieldCheck, 
  Clock, 
  Check, 
  Lock,
  Layers,
  LogOut
} from '../Icons';
import { Button } from '../ui/Button';

export const ClientProfileView: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, logout, mfaEnabled, toggleMFA, auditLogs } = useVerification();

  const [name, setName] = useState(currentUser?.name || 'David Mwangi');
  const [phone, setPhone] = useState(currentUser?.phone || '+44 7700 900142');
  const [locationAbroad, setLocationAbroad] = useState(currentUser?.locationAbroad || 'London, United Kingdom');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!currentUser) {
    return null;
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      name,
      phone,
      locationAbroad,
    });
    setToastMessage('Profile credentials successfully updated.');
  };

  // User-specific audit entries
  const userAudits = auditLogs.filter(
    (log) => log.performedBy?.id === currentUser.id || log.metadata?.targetEmail === currentUser.email
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans text-left">
      {/* Page Header */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
          Account & Security Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mt-1">
          Diaspora verification credentials, multi-factor authentication (MFA), and audit log history.
        </p>
      </div>

      {toastMessage && (
        <div className="bg-emerald-600 text-white px-5 py-3 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-sm">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-200 stroke-[3]" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Account Info Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-lg font-display">
              {currentUser.name?.charAt(0) || 'D'}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{currentUser.name}</h2>
              <p className="text-xs text-slate-500">{currentUser.email}</p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
            {currentUser.role.toUpperCase()} ACCOUNT
          </span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Full Legal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Email Address (Read Only)</label>
              <input
                type="email"
                value={currentUser.email}
                disabled
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 outline-none cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Overseas Phone (SMS / WhatsApp)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Residence Abroad</label>
              <input
                type="text"
                value={locationAbroad}
                onChange={(e) => setLocationAbroad(e.target.value)}
                placeholder="e.g. London, United Kingdom or Dallas, TX"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="secondary" size="md">
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Security & MFA Settings */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <Lock className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900">Security & Privacy Governance</h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">Multi-Factor Authentication (MFA / 2FA)</span>
              {mfaEnabled ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Active
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-600">
                  Disabled
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 max-w-lg">
              Enforce Time-based One-Time Password (TOTP) authorization before payment disbursement or report export.
            </p>
          </div>

          <Button
            variant={mfaEnabled ? 'outline' : 'secondary'}
            size="sm"
            onClick={toggleMFA}
          >
            {mfaEnabled ? 'Disable 2FA' : 'Enable 2FA (TOTP)'}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Data Protection</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Kenya Data Protection Act 2019 & GDPR Article 6 compliance with zero third-party telemetry sharing.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Cryptographic Integrity</span>
            </div>
            <p className="text-[11px] text-slate-500">
              All ground photos and evidence files are stamped with SHA-256 hashes to guarantee un-manipulated findings.
            </p>
          </div>
        </div>
      </div>

      {/* Account Audit History */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>Security Audit History</span>
        </h2>

        {userAudits.length === 0 ? (
          <p className="text-xs text-slate-400">No session security events recorded yet.</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {userAudits.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 font-mono text-[11px]">{log.action}</div>
                  <div className="text-[10px] text-slate-500">Resource: {log.targetResource} ({log.targetId})</div>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {log.timestamp.substring(0, 19).replace('T', ' ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Session & Clean Sign Out */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Session & Authentication</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Signed in as <span className="font-semibold text-slate-800">{currentUser.email}</span> ({currentUser.role.toUpperCase()} role).
            </p>
          </div>
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300 flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>Sign Out Session</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
