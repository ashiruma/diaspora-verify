import React, { useState } from 'react';
import { useVerification } from '../context/VerificationContext';
import { 
  ShieldCheck, 
  User, 
  Briefcase, 
  Smartphone, 
  Building, 
  FileText, 
  Plus, 
  HelpCircle, 
  RefreshCw,
  ChevronDown
} from './Icons';
import type { ActiveRole, CurrencyCode } from '../types';
import { hasStopPaymentWarning } from '../data/mockData';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { 
    activeRole, 
    setActiveRole, 
    currency, 
    setCurrency, 
    resetAllData,
    requests,
    isLiveConnected,
    mfaEnabled,
    toggleMFA
  } = useVerification();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);

  const pendingStopPaymentAlerts = requests.filter(hasStopPaymentWarning).length;

  const rolesConfig: { id: ActiveRole; label: string; sub: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'client',
      label: 'Client View',
      sub: 'Diaspora Abroad (London / Dallas)',
      icon: <User className="w-4 h-4 text-emerald-600" />,
      color: 'border-emerald-500 bg-emerald-50 text-emerald-900',
    },
    {
      id: 'operations',
      label: 'Operations Coordinator',
      sub: 'Nairobi HQ Triage & QA Desk',
      icon: <Briefcase className="w-4 h-4 text-blue-600" />,
      color: 'border-blue-500 bg-blue-50 text-blue-900',
    },
    {
      id: 'field_agent',
      label: 'Field Agent View',
      sub: 'Ground Inspector Mobile Mode',
      icon: <Smartphone className="w-4 h-4 text-amber-600" />,
      color: 'border-amber-500 bg-amber-50 text-amber-900',
    }
  ];

  const currencies: CurrencyCode[] = ['KES', 'USD', 'GBP', 'EUR', 'AED', 'CAD', 'AUD'];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      {/* Top Banner with Trust Anchor */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              KENYA GROUND VERIFICATION
            </span>
            <span className="hidden sm:inline text-slate-400">
              “Your trusted eyes and hands on the ground in Kenya.”
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            {/* Supabase Backend Live Status */}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] ${
              isLiveConnected 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60' 
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isLiveConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              {isLiveConnected ? 'Supabase Postgres + RLS Active' : 'Offline Mode'}
            </span>

            {/* MFA Security Status */}
            {(activeRole === 'operations' || activeRole === 'field_agent') && (
              <button
                onClick={toggleMFA}
                title="Click to toggle MFA state"
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] transition-colors ${
                  mfaEnabled 
                    ? 'bg-blue-900/60 text-blue-200 border border-blue-500/50' 
                    : 'bg-amber-900/50 text-amber-200 border border-amber-600/50 hover:bg-amber-800/60'
                }`}
              >
                <ShieldCheck className="w-3 h-3 text-blue-400" />
                <span>MFA: {mfaEnabled ? 'Verified (AAL2)' : 'Optional (Click to Enable)'}</span>
              </button>
            )}

            {pendingStopPaymentAlerts > 0 && (
              <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                {pendingStopPaymentAlerts} Stop-Payment Warning
              </span>
            )}
            <button 
              onClick={() => {
                if (confirm('Reset mock data back to clean initial state?')) {
                  resetAllData();
                }
              }}
              title="Reset demo data"
              className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden md:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentTab('dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 text-emerald-100" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold font-display tracking-tight text-slate-900">
                    Diaspora<span className="text-emerald-700">Verify</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    PILOT
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Independent On-Ground Verification
                </p>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                currentTab === 'dashboard'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {activeRole === 'operations' ? (
                <>
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>Operations Desk</span>
                </>
              ) : activeRole === 'field_agent' ? (
                <>
                  <Smartphone className="w-4 h-4 text-amber-600" />
                  <span>Field Verifier Tasks</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Requests & Assets</span>
                </>
              )}
            </button>

            <button
              onClick={() => setCurrentTab('construction')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                currentTab === 'construction'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Building className="w-4 h-4 text-emerald-600" />
              <span>Construction Oversight</span>
              <span className="w-2 h-2 rounded-full bg-amber-500" title="Active Discrepancy" />
            </button>

            <button
              onClick={() => setCurrentTab('reports')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                currentTab === 'reports'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4 text-slate-500" />
              Reports & Audits
            </button>

            <button
              onClick={() => setCurrentTab('service_model')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                currentTab === 'service_model'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-slate-500" />
              Trust & Service Model
            </button>
          </nav>

          {/* Right Controls: Role Selector, Currency, CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 flex items-center gap-1 shadow-sm"
              >
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {currencyMenuOpen && (
                <div className="absolute right-0 mt-2 w-28 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
                  {currencies.map(curr => (
                    <button
                      key={curr}
                      onClick={() => {
                        setCurrency(curr);
                        setCurrencyMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between ${
                        currency === curr ? 'bg-emerald-50 text-emerald-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{curr}</span>
                      {curr === 'KES' && <span className="text-[10px] text-slate-400">Local</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold shadow-sm transition-all"
              >
                {rolesConfig.find(r => r.id === activeRole)?.icon}
                <div className="text-left hidden sm:block">
                  <div className="text-[11px] text-slate-500 font-normal leading-none">View As</div>
                  <div className="leading-tight font-bold">{rolesConfig.find(r => r.id === activeRole)?.label}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50">
                  <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Active Persona
                  </div>
                  <div className="space-y-1">
                    {rolesConfig.map(r => (
                      <button
                        key={r.id}
                        onClick={() => {
                          setActiveRole(r.id);
                          setCurrentTab('dashboard');
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full p-2.5 rounded-lg text-left flex items-start gap-2.5 transition-all border ${
                          activeRole === r.id
                            ? r.color
                            : 'border-transparent hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="mt-0.5">{r.icon}</div>
                        <div>
                          <div className="text-xs font-bold">{r.label}</div>
                          <div className="text-[11px] text-slate-500">{r.sub}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Book Request CTA */}
            <button
              onClick={() => setCurrentTab('new_request')}
              className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-md shadow-emerald-700/20 flex items-center gap-1.5 transition-all hover:shadow-lg"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span className="hidden sm:inline">Book Verification</span>
              <span className="sm:hidden">Book</span>
            </button>

          </div>
        </div>
      </div>

      {/* Mobile subnav */}
      <div className="lg:hidden border-t border-slate-100 bg-slate-50 px-4 py-2 flex items-center justify-between text-xs overflow-x-auto space-x-2">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap ${currentTab === 'dashboard' ? 'bg-white shadow-sm text-slate-900 font-bold' : 'text-slate-600'}`}
        >
          {activeRole === 'operations' ? 'Ops Queue' : activeRole === 'field_agent' ? 'Field Tasks' : 'Requests'}
        </button>
        <button
          onClick={() => setCurrentTab('construction')}
          className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap ${currentTab === 'construction' ? 'bg-white shadow-sm text-emerald-800 font-bold' : 'text-slate-600'}`}
        >
          Construction Pilot
        </button>
        <button
          onClick={() => setCurrentTab('reports')}
          className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap ${currentTab === 'reports' ? 'bg-white shadow-sm text-slate-900 font-bold' : 'text-slate-600'}`}
        >
          Reports
        </button>
        <button
          onClick={() => setCurrentTab('service_model')}
          className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap ${currentTab === 'service_model' ? 'bg-white shadow-sm text-slate-900 font-bold' : 'text-slate-600'}`}
        >
          Service Model
        </button>
      </div>
    </header>
  );
};
