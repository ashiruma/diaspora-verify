// src/components/Navbar.tsx
import React, { useState } from 'react';
import { useVerification } from '../context/VerificationContext';
import { ShieldCheck, User, Briefcase, Smartphone, Building, FileText, ChevronDown } from './Icons';
import type { ActiveRole, CurrencyCode } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Navbar component – navigation is now driven by React Router instead of
 * ad‑hoc `currentTab` state. The component no longer receives props; it uses
 * `useNavigate` to change the URL and `useLocation` to highlight the active
 * route.
 */
export const Navbar: React.FC = () => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const {
    activeRole,
    setActiveRole,
    currency,
    setCurrency,
  } = useVerification();

  const navigate = useNavigate();
  const location = useLocation();

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
    },
  ];

  const currencies: CurrencyCode[] = ['KES', 'USD', 'GBP', 'EUR', 'AED', 'CAD', 'AUD'];

  // Helper to set active route and optionally update role‑specific UI
  const handleNav = (path: string) => {
    navigate(path);
  };

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
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav('/')}
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
              onClick={() => handleNav('/')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                location.pathname === '/' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
              onClick={() => handleNav('/construction')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                location.pathname.startsWith('/construction')
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Building className="w-4 h-4 text-emerald-600" />
              <span>Construction Oversight</span>
            </button>
            {/* Additional top‑level links can be added here */}
          </nav>

          {/* Role selector */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen((prev) => !prev)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                roleMenuOpen ? 'bg-slate-200' : 'bg-slate-100'
              }`}
            >
              {rolesConfig.find((r) => r.id === activeRole)?.icon}
              <span className="capitalize">{activeRole.replace('_', ' ')}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {roleMenuOpen && (
              <ul className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-md shadow-lg z-10">
                {rolesConfig.map((role) => (
                  <li key={role.id}>
                    <button
                      onClick={() => {
                        setActiveRole(role.id);
                        setRoleMenuOpen(false);
                        // navigate to a default page for the role
                        handleNav('/');
                      }}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-slate-100"
                    >
                      {role.icon}
                      <span className="ml-2">{role.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Currency selector */}
          <div className="relative">
            <button
              onClick={() => setCurrencyMenuOpen((prev) => !prev)}
              className="flex items-center gap-1 px-3 py-2 rounded-md bg-slate-100 text-sm"
            >
              {currency} <ChevronDown className="w-4 h-4" />
            </button>
            {currencyMenuOpen && (
              <ul className="absolute right-0 mt-2 w-32 bg-white border border-slate-200 rounded-md shadow-lg z-10">
                {currencies.map((c) => (
                  <li key={c}>
                    <button
                      onClick={() => {
                        setCurrency(c);
                        setCurrencyMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-slate-100"
                    >
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
