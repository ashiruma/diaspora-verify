import React, { useState } from 'react';
import { useVerification } from '../context/VerificationContext';
import { 
  ShieldCheck, 
  User, 
  Briefcase, 
  Smartphone, 
  FileText, 
  ChevronDown, 
  Bell, 
  Check, 
  MapPin, 
  AlertTriangle,
  MessageSquare,
  DollarSign,
  Clock,
  Award,
  LogOut,
  LogIn,
  UserPlus
} from './Icons';
import type { ActiveRole, CurrencyCode } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminPreviewBanner } from './AdminPreviewBanner';
import { normalizeRole } from '../auth/authorization';

export const Navbar: React.FC = () => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [viewAsModalOpen, setViewAsModalOpen] = useState(false);

  const {
    activeRole,
    setActiveRole,
    currency,
    setCurrency,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    currentUser,
    isAuthenticated,
    logout,
    startViewAs,
    setCommandMenuOpen,
    agents,
    requests
  } = useVerification();

  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = notifications.filter(n => !n.read).length;
  const currentNormalizedRole = normalizeRole(activeRole);

  const rolesConfig: { id: ActiveRole; label: string; sub: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'client',
      label: 'Diaspora Client',
      sub: 'Diaspora Abroad (London / Dallas)',
      icon: <User className="w-4 h-4 text-emerald-600" />, 
      color: 'border-emerald-500 bg-emerald-50 text-emerald-900',
    },
    {
      id: 'agent',
      label: 'Field Verifier (Agent)',
      sub: 'Ground Mobile Mode',
      icon: <Smartphone className="w-4 h-4 text-amber-600" />, 
      color: 'border-amber-500 bg-amber-50 text-amber-900',
    },
    {
      id: 'admin',
      label: 'Operations Center (Admin)',
      sub: 'Nairobi HQ Triage & QA Desk',
      icon: <Briefcase className="w-4 h-4 text-blue-600" />, 
      color: 'border-blue-500 bg-blue-50 text-blue-900',
    },
  ];

  const currencies: CurrencyCode[] = ['KES', 'USD', 'GBP', 'EUR', 'AED', 'CAD', 'AUD'];

  const handleNav = (path: string) => {
    navigate(path);
    setNotifMenuOpen(false);
    setRoleMenuOpen(false);
  };

  const handleRoleSwitch = (newRole: ActiveRole) => {
    setActiveRole(newRole);
    setRoleMenuOpen(false);
    const norm = normalizeRole(newRole);
    if (norm === 'admin') navigate('/admin');
    else if (norm === 'agent') navigate('/agent');
    else navigate('/dashboard');
  };

  // Role-Specific Navigation Links
  const clientNavLinks = [
    { path: '/dashboard', label: 'Overview', icon: <FileText className="w-3.5 h-3.5 text-slate-500" /> },
    { path: '/requests', label: 'My Requests', icon: <FileText className="w-3.5 h-3.5 text-emerald-600" /> },
    { path: '/reports', label: 'Reports', icon: <FileText className="w-3.5 h-3.5 text-blue-600" /> },
    { path: '/properties', label: 'My Properties', icon: <MapPin className="w-3.5 h-3.5 text-emerald-600" /> },
    { path: '/payments', label: 'Payments', icon: <DollarSign className="w-3.5 h-3.5 text-amber-600" /> },
    { path: '/messages', label: 'Messages', icon: <MessageSquare className="w-3.5 h-3.5 text-purple-600" /> },
    { path: '/profile', label: 'Profile', icon: <User className="w-3.5 h-3.5 text-slate-500" /> },
  ];

  const agentNavLinks = [
    { path: '/agent', label: 'Assignments & Today', icon: <Smartphone className="w-3.5 h-3.5 text-amber-600" /> },
    { path: '/agent#checkin', label: 'GPS Check-In', icon: <MapPin className="w-3.5 h-3.5 text-emerald-600" /> },
    { path: '/agent#earnings', label: 'Earnings & Performance', icon: <DollarSign className="w-3.5 h-3.5 text-blue-600" /> },
  ];

  const adminNavLinks = [
    { path: '/admin', label: 'Operations', icon: <Briefcase className="w-3.5 h-3.5 text-blue-600" /> },
    { path: '/admin?tab=requests', label: 'Requests', icon: <FileText className="w-3.5 h-3.5 text-slate-600" /> },
    { path: '/admin?tab=assignments', label: 'Assignments', icon: <Clock className="w-3.5 h-3.5 text-amber-600" /> },
    { path: '/admin?tab=agents', label: 'Agents', icon: <Smartphone className="w-3.5 h-3.5 text-amber-600" /> },
    { path: '/admin?tab=clients', label: 'Clients', icon: <User className="w-3.5 h-3.5 text-emerald-600" /> },
    { path: '/admin?tab=reports', label: 'Reports', icon: <FileText className="w-3.5 h-3.5 text-emerald-600" /> },
    { path: '/admin?tab=payments', label: 'Payments', icon: <DollarSign className="w-3.5 h-3.5 text-amber-600" /> },
    { path: '/admin?tab=disputes', label: 'Disputes', icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> },
    { path: '/admin?tab=analytics', label: 'Analytics', icon: <Award className="w-3.5 h-3.5 text-blue-600" /> },
    { path: '/admin?tab=services', label: 'Services', icon: <FileText className="w-3.5 h-3.5 text-purple-600" /> },
    { path: '/admin?tab=settings', label: 'Settings', icon: <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> },
  ];

  const activeNavLinks =
    currentNormalizedRole === 'admin'
      ? adminNavLinks
      : currentNormalizedRole === 'agent'
      ? agentNavLinks
      : clientNavLinks;

  // Unique clients for "View As Client" picker
  const clientsList = Array.from(
    new Map(
      requests.map((r) => [
        r.client.email,
        { id: r.client.email, name: r.client.name, email: r.client.email, location: r.client.locationAbroad }
      ])
    ).values()
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      {/* Admin Impersonation Preview Banner */}
      <AdminPreviewBanner />

      {/* Trust Anchor & Quick Legal Link Bar */}
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
              onClick={() => handleNav('/service-model')} 
              className="text-slate-400 hover:text-white"
            >
              How It Works
            </button>
            <span className="text-slate-700">|</span>
            <button 
              onClick={() => handleNav('/legal')} 
              className="text-slate-400 hover:text-white"
            >
              Legal & Compliance
            </button>
            <span className="text-slate-700">|</span>
            <button 
              onClick={() => handleNav('/landing')} 
              className="text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              Public Site →
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
              onClick={() => handleNav(!isAuthenticated || !currentUser ? '/' : currentNormalizedRole === 'admin' ? '/admin' : currentNormalizedRole === 'agent' ? '/agent' : '/dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-700 transition-colors">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold font-display tracking-tight text-slate-900">
                    Diaspora<span className="text-emerald-700">Verify</span>
                  </span>
                  {isAuthenticated && currentUser ? (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {currentNormalizedRole.toUpperCase()}
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      KENYA PILOT
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                  Field Verification & Safeguarding
                </p>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto max-w-3xl py-1">
            {!isAuthenticated || !currentUser ? (
              <>
                <button
                  onClick={() => handleNav('/service-model')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    location.pathname === '/service-model'
                      ? 'bg-slate-100 text-slate-900 border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  How It Works
                </button>
                <button
                  onClick={() => handleNav('/legal')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    location.pathname === '/legal'
                      ? 'bg-slate-100 text-slate-900 border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Legal & Compliance
                </button>
                <button
                  onClick={() => handleNav('/')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    location.pathname === '/' || location.pathname === '/landing'
                      ? 'bg-slate-100 text-slate-900 border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Public Site
                </button>
              </>
            ) : (
              activeNavLinks.map((link) => {
                const isActive = location.pathname === link.path || (link.path.includes('?') && location.pathname + location.search === link.path);
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
              })
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setCurrencyMenuOpen(!currencyMenuOpen);
                  setRoleMenuOpen(false);
                  setNotifMenuOpen(false);
                }}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center gap-1 transition-colors"
              >
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {currencyMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-24 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50">
                  {currencies.map((curr) => (
                    <button
                      key={curr}
                      onClick={() => {
                        setCurrency(curr);
                        setCurrencyMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 ${
                        currency === curr ? 'text-emerald-700 bg-emerald-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{curr}</span>
                      {currency === curr && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {!isAuthenticated || !currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('/login')}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-500" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => handleNav('/register')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5 text-white" />
                  <span>Get Started</span>
                </button>
              </div>
            ) : (
              <>
                {/* Admin Command Menu Shortcut */}
                {currentNormalizedRole === 'admin' && (
                  <button
                    onClick={() => setCommandMenuOpen(true)}
                    className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs text-slate-600 transition-colors"
                    title="Search records (Ctrl+K)"
                  >
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Search</span>
                    <kbd className="text-[10px] font-mono px-1 py-0.5 rounded bg-white border border-slate-300 text-slate-500">
                      ⌘K
                    </kbd>
                  </button>
                )}

                {/* Admin "View As" Quick Launcher */}
                {currentNormalizedRole === 'admin' && (
                  <button
                    onClick={() => setViewAsModalOpen(true)}
                    className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors"
                    title="View Experience as Client or Agent"
                  >
                    <span>Preview Mode...</span>
                  </button>
                )}

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotifMenuOpen(!notifMenuOpen);
                      setRoleMenuOpen(false);
                      setCurrencyMenuOpen(false);
                    }}
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent hover:border-slate-200 relative transition-colors"
                    aria-label="View notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                    )}
                  </button>

                  {notifMenuOpen && (
                    <div className="absolute right-0 mt-1.5 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 text-left">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                        <span className="text-xs font-bold text-slate-900">Notifications ({unreadCount})</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={clearAllNotifications}
                            className="text-[10px] text-emerald-700 hover:underline font-semibold"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {notifications.length === 0 ? (
                          <p className="text-xs text-slate-400 py-4 text-center">No notifications.</p>
                        ) : (
                          notifications.slice(0, 5).map((n) => (
                            <div
                              key={n.id}
                              onClick={() => {
                                markNotificationRead(n.id);
                                if (n.requestId) handleNav(`/request/${n.requestId}`);
                              }}
                              className={`p-2 rounded-xl text-xs cursor-pointer transition-colors ${
                                n.read ? 'bg-white hover:bg-slate-50' : 'bg-emerald-50/50 border border-emerald-100'
                              }`}
                            >
                              <div className="font-semibold text-slate-900">{n.title}</div>
                              <div className="text-[11px] text-slate-500 mt-0.5">{n.message}</div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Role Switcher & User Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setRoleMenuOpen(!roleMenuOpen);
                      setCurrencyMenuOpen(false);
                      setNotifMenuOpen(false);
                    }}
                    className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-xs"
                  >
                    <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs">
                      {currentUser?.name?.[0] || 'U'}
                    </div>
                    <div className="text-left hidden md:block">
                      <div className="text-xs font-bold text-slate-900 line-clamp-1">{currentUser?.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium capitalize">{currentNormalizedRole}</div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {roleMenuOpen && (
                    <div className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 text-left space-y-1">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Switch Role Portal
                        </div>
                        <div className="text-xs font-semibold text-slate-800 mt-0.5 truncate">
                          {currentUser?.email}
                        </div>
                      </div>

                      {rolesConfig.map((r) => {
                        const isSelected = currentNormalizedRole === normalizeRole(r.id);
                        return (
                          <button
                            key={r.id}
                            onClick={() => handleRoleSwitch(r.id)}
                            className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                              isSelected ? r.color + ' border' : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="mt-0.5">{r.icon}</div>
                            <div className="flex-1">
                              <div className="text-xs font-bold flex items-center justify-between">
                                <span>{r.label}</span>
                                {isSelected && <span className="text-[10px] font-black">ACTIVE</span>}
                              </div>
                              <div className="text-[10px] text-slate-500 mt-0.5">{r.sub}</div>
                            </div>
                          </button>
                        );
                      })}

                      {currentNormalizedRole === 'admin' && (
                        <div className="pt-2 border-t border-slate-100 mt-1">
                          <button
                            onClick={() => {
                              setRoleMenuOpen(false);
                              setViewAsModalOpen(true);
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-amber-900 hover:bg-amber-50 flex items-center justify-between"
                          >
                            <span>Launch "View As" Preview...</span>
                            <span className="text-[10px] text-amber-700">Audit-logged</span>
                          </button>
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-100 mt-1 space-y-1">
                        {currentNormalizedRole === 'client' && (
                          <button
                            onClick={() => {
                              setRoleMenuOpen(false);
                              navigate('/profile');
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <User className="w-3.5 h-3.5 text-slate-500" />
                            <span>Account Profile</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setRoleMenuOpen(false);
                            logout();
                            navigate('/login');
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center justify-between transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <LogOut className="w-3.5 h-3.5 text-rose-600" />
                            <span>Sign Out</span>
                          </div>
                          <span className="text-[10px] text-slate-400">End Session</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

          </div>
        </div>
      </div>

      {/* Admin "View As" Selector Modal */}
      {viewAsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Admin "View As" Preview Mode</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inspect the platform from a specific client or agent's perspective. Your underlying role remains ADMIN.
                </p>
              </div>
              <button
                onClick={() => setViewAsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  View Client Experience
                </h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {clientsList.map((client) => (
                    <button
                      key={client.email}
                      onClick={() => {
                        startViewAs('client', client.id, client.name, client.email);
                        setViewAsModalOpen(false);
                        navigate('/dashboard');
                      }}
                      className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{client.name}</div>
                        <div className="text-[11px] text-slate-500">{client.email} · {client.location}</div>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700">Preview Client →</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  View Agent Experience
                </h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {agents.slice(0, 4).map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => {
                        startViewAs('agent', agent.id, agent.name, agent.email);
                        setViewAsModalOpen(false);
                        navigate('/agent');
                      }}
                      className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{agent.name}</div>
                        <div className="text-[11px] text-slate-500">{agent.badgeLevel} · {agent.primaryCounties.join(', ')}</div>
                      </div>
                      <span className="text-[11px] font-semibold text-amber-700">Preview Agent →</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
