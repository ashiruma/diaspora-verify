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
import { PortalLayout } from '../layout/PortalLayout';
import { CheckCircle2 } from 'lucide-react';

export const ClientProfileView: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, logout, mfaEnabled, toggleMFA, auditLogs } = useVerification();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [locationAbroad, setLocationAbroad] = useState(currentUser?.locationAbroad || (currentUser?.role === 'admin' ? 'Nairobi HQ · Operations Desk' : ''));
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!currentUser) {
    return null;
  }

  const isAdmin = currentUser.role === 'admin';

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

  // User-specific audit entries or operational logs
  const userAudits = auditLogs.filter(
    (log) => 
      log.performedBy?.id === currentUser.id || 
      log.metadata?.targetEmail === currentUser.email ||
      (isAdmin && (log.performedBy?.role === 'admin' || log.action.includes('ADMIN') || log.action.includes('AUTH') || log.action.includes('USER_LOGGED')))
  );

  return (
    <PortalLayout
      title={isAdmin ? "Operations Admin Profile" : "Account & Security"}
      subtitle={isAdmin ? "Thursday, 8 October 2026 · Operations Administrator Profile" : "Thursday, 8 October 2026 · Diaspora Client Profile"}
      role={isAdmin ? 'admin' : 'client'}
      activeTab="profile"
    >
      <div className="space-y-6">
        {/* Intro */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {isAdmin ? 'Level 4 HQ Clearance Active' : 'Identity & Consent Verified'}
            </div>

            <h2 className="text-2xl font-bold tracking-tight md:text-3xl text-slate-900">
              {isAdmin ? 'Admin Profile & Security Credentials' : 'Account & Security Settings'}
            </h2>

            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              {isAdmin
                ? 'DiasporaVerify Nairobi HQ administrative credentials, high-privilege operations clearance, and security audit history.'
                : 'Diaspora verification credentials, multi-factor authentication (MFA), and audit log history.'}
            </p>
          </div>
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
              {currentUser.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{currentUser.name}</h2>
              <p className="text-xs text-slate-500">{currentUser.email}</p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
            {isAdmin ? 'OPERATIONS ADMIN' : `${currentUser.role.toUpperCase()} ACCOUNT`}
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
              <label className="font-bold text-slate-700">{isAdmin ? 'HQ Operations Direct Line / Mobile' : 'Overseas Phone (SMS / WhatsApp)'}</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={isAdmin ? '+254 700 000 000' : '+1 555 019 2834'}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">{isAdmin ? 'Assigned Duty Station' : 'Residence Abroad'}</label>
              <input
                type="text"
                value={locationAbroad}
                onChange={(e) => setLocationAbroad(e.target.value)}
                placeholder={isAdmin ? 'e.g. Nairobi HQ · Upper Hill' : 'e.g. London, United Kingdom or Dallas, TX'}
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

      {/* Admin Operational Scope Card (Shown for Admin accounts) */}
      {isAdmin && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Operations Clearance & Governance Privileges</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>Escrow Authorization</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Authorized to release verified milestone payouts via M-Pesa & Swift.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>QA & Tamper Review</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Cryptographic SHA-256 seal verification and contradiction flagging.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>Verifier Dispatch</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Vetted field operative task assignment & Nairobi GPS telemetry tracking.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>Anti-Collusion Guard</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Strict zero-contact isolation relay protocol between clients and agents.
              </p>
            </div>
          </div>
        </div>
      )}

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
    </PortalLayout>
  );
};
