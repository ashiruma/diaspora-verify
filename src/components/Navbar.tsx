import React, { useState } from 'react';
import { useVerification } from '../context/VerificationContext';
import { 
  ShieldCheck, 
  User, 
  Briefcase, 
  Smartphone, 
  Building, 
  FileText, 
  ChevronDown, 
  Bell, 
  Check, 
  MapPin, 
  AlertTriangle,
  Compass
} from './Icons';
import type { ActiveRole, CurrencyCode } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);

  const {
    activeRole,
    setActiveRole,
    currency,
    setCurrency,
    notifications,
    markNotificationRead,
    clearAllNotifications,
  } = useVerification();

  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = notifications.filter(n => !n.read).length;

  const rolesConfig: { id: ActiveRole; label: string; sub: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'client',
      label: 'Diaspora Client',
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
      label: 'Field Inspector',
      sub: 'Ground Mobile Mode',
      icon: <Smartphone className="w-4 h-4 text-amber-600" />, 
      color: 'border-amber-500 bg-amber-50 text-amber-900',
    },
    {
      id: 'corporate',
      label: 'Corporate & Sacco',
      sub: 'Institutions, Banks & Portfolios',
      icon: <Building className="w-4 h-4 text-purple-600" />, 
      color: 'border-purple-500 bg-purple-50 text-purple-900',
    },
  ];

  const currencies: CurrencyCode[] = ['KES', 'USD', 'GBP', 'EUR', 'AED', 'CAD', 'AUD'];

  const handleNav = (path: string) => {
    navigate(path);
    setNotifMenuOpen(false);
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: <FileText className="w-4 h-4 text-slate-500" /> },
    { path: '/properties', label: 'Properties', icon: <MapPin className="w-4 h-4 text-emerald-600" /> },
    { path: '/construction', label: 'Construction', icon: <Building className="w-4 h-4 text-amber-600" /> },
    { path: '/reports', label: 'Reports', icon: <FileText className="w-4 h-4 text-blue-600" /> },
    { path: '/disputes', label: 'Disputes', icon: <AlertTriangle className="w-4 h-4 text-rose-500" /> },
    { path: '/service-model', label: 'How It Works', icon: <Compass className="w-4 h-4 text-teal-600" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      {/* Top Banner with Trust Anchor */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              KENYA GROUND VERIFICATION
            </span>
            <span className="hidden sm:inline text-slate-400 text-[11px]">
              “VERIFY KENYA. FROM ANYWHERE.” — Independent on-ground due-diligence.
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <button 
              onClick={() => handleNav('/landing')} 
              className="text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              Public Site Overview →
            </button>
            <span className="text-slate-600">|</span>
            <button 
              onClick={() => handleNav('/legal')} 
              className="text-slate-400 hover:text-white"
            >
              Legal & Compliance
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 flex-shrink-0">
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
                    v2.0
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Independent On-Ground Verification
                </p>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-slate-100 text-slate-900 border border-slate-200' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Role, Currency, Notifications */}
          <div className="flex items-center gap-2">
            
            {/* Direct Request CTA */}
            <button
              onClick={() => handleNav('/new-request')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
            >
              <span>+ Request Verification</span>
            </button>

            {/* Notifications Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifMenuOpen(prev => !prev)}
                className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-scaleUp">
                  <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-emerald-400" />
                      <span>Notifications ({unreadCount} new)</span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[10px] text-emerald-300 hover:underline font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 8).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationRead(notif.id);
                            if (notif.link) handleNav(notif.link);
                            setNotifMenuOpen(false);
                          }}
                          className={`p-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                            !notif.read ? 'bg-emerald-50/40' : 'bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-slate-900">{notif.title}</span>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">{notif.timestamp}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-0.5 leading-snug">{notif.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        No notifications yet.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Selector */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen((prev) => !prev)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  roleMenuOpen ? 'bg-slate-200 border-slate-300' : 'bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                {rolesConfig.find((r) => r.id === activeRole)?.icon}
                <span className="capitalize hidden sm:inline">{activeRole.replace('_', ' ')}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {roleMenuOpen && (
                <ul className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-1.5 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Active Persona:
                  </div>
                  {rolesConfig.map((role) => {
                    const isSelected = role.id === activeRole;
                    return (
                      <li key={role.id}>
                        <button
                          onClick={() => {
                            setActiveRole(role.id);
                            setRoleMenuOpen(false);
                            handleNav('/dashboard');
                          }}
                          className={`flex items-start w-full px-3 py-2 rounded-xl text-left transition-colors ${
                            isSelected ? 'bg-slate-100' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="mt-0.5">{role.icon}</div>
                          <div className="ml-2.5 flex-1">
                            <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                              <span>{role.label}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                            </div>
                            <div className="text-[10px] text-slate-500">{role.sub}</div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyMenuOpen((prev) => !prev)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800"
              >
                <span>{currency}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {currencyMenuOpen && (
                <ul className="absolute right-0 mt-2 w-32 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-1 space-y-0.5">
                  {currencies.map((c) => (
                    <li key={c}>
                      <button
                        onClick={() => {
                          setCurrency(c);
                          setCurrencyMenuOpen(false);
                        }}
                        className={`w-full px-3 py-1.5 text-xs font-bold text-left rounded-xl transition-colors ${
                          c === currency ? 'bg-emerald-50 text-emerald-800' : 'hover:bg-slate-50 text-slate-700'
                        }`}
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
      </div>
    </header>
  );
};
