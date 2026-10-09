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
  DollarSign,
  LogOut,
  LogIn,
  UserPlus,
  Eye,
  Search,
  Menu,
  X,
  Users,
  Phone,
  Globe
} from './Icons';
import type { CurrencyCode } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminPreviewBanner } from './AdminPreviewBanner';
import { normalizeRole } from '../auth/authorization';

export const Navbar: React.FC = () => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [viewAsModalOpen, setViewAsModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    activeRole,
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
    requests,
    clientRequests,
  } = useVerification();

  const navigate = useNavigate();
  const location = useLocation();

  // On standalone fullscreen cockpit, cockpit provides its own dedicated sidebar and top bar
  if (location.pathname === '/cockpit' || location.pathname === '/admin/cockpit') {
    return null;
  }

  const unreadCount = notifications.filter(n => !n.read).length;
  const currentNormalizedRole = normalizeRole(activeRole);
  const isPublicPage = 
    location.pathname === '/' || 
    location.pathname === '/landing' || 
    location.pathname === '/landing-classic' || 
    location.pathname === '/legal' || 
    location.pathname === '/service-model';

  const currencies: CurrencyCode[] = ['KES', 'USD', 'GBP', 'EUR', 'AED', 'CAD', 'AUD'];

  const handleNav = (path: string) => {
    navigate(path);
    setNotifMenuOpen(false);
    setRoleMenuOpen(false);
    setMobileMenuOpen(false);
  };


  // Role-Specific Navigation Links
  const clientNavLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: <FileText className="w-3.5 h-3.5 text-slate-500" /> },
    { path: '/requests', label: 'My Requests', icon: <FileText className="w-3.5 h-3.5 text-emerald-600" /> },
    { path: '/properties', label: 'Properties', icon: <MapPin className="w-3.5 h-3.5 text-emerald-600" /> },
    { path: '/reports', label: 'Reports', icon: <FileText className="w-3.5 h-3.5 text-blue-600" /> },
    { path: '/', label: 'Public Site ↗', icon: <Globe className="w-3.5 h-3.5 text-slate-400" /> },
  ];

  const agentNavLinks = [
    { path: '/agent', label: 'Field Tasks', icon: <Smartphone className="w-3.5 h-3.5 text-amber-600" /> },
    { path: '/agent#checkin', label: 'GPS Check-In', icon: <MapPin className="w-3.5 h-3.5 text-emerald-600" /> },
    { path: '/agent#earnings', label: 'Earnings', icon: <DollarSign className="w-3.5 h-3.5 text-blue-600" /> },
    { path: '/', label: 'Public Site ↗', icon: <Globe className="w-3.5 h-3.5 text-slate-400" /> },
  ];

  const adminNavLinks = [
    { path: '/admin', label: 'Operations Desk', icon: <Briefcase className="w-3.5 h-3.5 text-blue-600" /> },
    { path: '/cockpit', label: 'Cockpit', icon: <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> },
    { path: '/admin?tab=payments', label: 'Money In & Out', icon: <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> },
    { path: '/admin?tab=clients', label: 'Client Base', icon: <Users className="w-3.5 h-3.5 text-amber-600" /> },
    { path: '/admin?tab=contacts', label: 'Contacts', icon: <Phone className="w-3.5 h-3.5 text-indigo-600" /> },
    { path: '/admin?tab=settings', label: 'Audit & Security', icon: <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> },
    { path: '/', label: 'Public Site ↗', icon: <Globe className="w-3.5 h-3.5 text-slate-400" /> },
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Admin Impersonation Preview Banner */}
      <AdminPreviewBanner />

      {/* Admin Presence Bar: Displayed when an authenticated Admin is viewing public pages */}
      {isAuthenticated && currentUser && currentNormalizedRole === 'admin' && isPublicPage && (
        <div className="bg-[#061329] text-slate-300 text-xs py-1.5 px-3 sm:px-6 border-b border-slate-800 w-full max-w-full overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0 max-w-full">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                ADMIN ACTIVE
              </span>
              <span className="text-slate-300 text-xs font-medium truncate">
                Viewing Public Site as <strong className="text-white">{currentUser.name}</strong> ({currentNormalizedRole.toUpperCase()})
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs shrink-0">
              <button
                onClick={() => handleNav('/admin')}
                className="font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Return to Operations Desk →</span>
              </button>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <button
                onClick={() => handleNav('/cockpit')}
                className="text-slate-300 hover:text-white transition-colors cursor-pointer hidden sm:inline"
              >
                <span>Financial Cockpit ↗</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Public Trust Anchor Bar (Displayed only for unauthenticated guests) */}
      {!isAuthenticated || !currentUser ? (
        <div className="bg-[#061329] text-slate-300 text-xs py-1.5 px-3 sm:px-6 border-b border-slate-800/80 w-full max-w-full overflow-hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide bg-emerald-400/10 text-emerald-300 border border-emerald-400/30 shrink-0">
                KENYA GROUND VERIFICATION
              </span>
              <span className="hidden sm:inline text-slate-300 text-[11px] truncate">
                Independent on-ground due diligence
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 text-[11px] shrink-0">
              <button 
                onClick={() => handleNav('/how-it-works')} 
                className="text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                How it works
              </button>
              <span className="text-slate-700">|</span>
              <button 
                onClick={() => handleNav('/sample-report')} 
                className="text-slate-300 hover:text-white transition-colors cursor-pointer hidden sm:inline"
              >
                Sample report
              </button>
              <span className="text-slate-700 hidden sm:inline">|</span>
              <button 
                onClick={() => handleNav('/legal')} 
                className="text-slate-300 hover:text-white transition-colors cursor-pointer hidden xs:inline"
              >
                Legal & Compliance
              </button>
              <span className="text-slate-700 hidden xs:inline">|</span>
              <button 
                onClick={() => handleNav('/')} 
                className="text-emerald-300 hover:text-emerald-200 font-bold transition-colors cursor-pointer"
              >
                Public site →
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 w-full max-w-full overflow-hidden">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-3 min-w-0">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            <button
              onClick={() => handleNav(!isAuthenticated || !currentUser ? '/' : currentNormalizedRole === 'admin' ? '/admin' : currentNormalizedRole === 'agent' ? '/agent' : '/dashboard')}
              className="flex items-center gap-2 sm:gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-700 transition-colors shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-bold font-display tracking-tight text-slate-900">
                    Diaspora<span className="text-emerald-700">Verify</span>
                  </span>
                  {isAuthenticated && currentUser ? (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 hidden sm:inline-block">
                      {currentNormalizedRole.toUpperCase()}
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 hidden sm:inline-block">
                      KENYA PILOT
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-medium hidden md:block">
                  Field Verification & Safeguarding
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 py-1">
            {!isAuthenticated || !currentUser ? (
              <>
                <button
                  onClick={() => handleNav('/services')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    location.pathname.startsWith('/services')
                      ? 'bg-slate-100 text-slate-900 border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Services
                </button>
                <button
                  onClick={() => handleNav('/how-it-works')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    location.pathname === '/how-it-works'
                      ? 'bg-slate-100 text-slate-900 border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  How It Works
                </button>
                <button
                  onClick={() => handleNav('/sample-report')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    location.pathname === '/sample-report'
                      ? 'bg-slate-100 text-slate-900 border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Sample Report
                </button>
                <button
                  onClick={() => handleNav('/about')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    location.pathname === '/about'
                      ? 'bg-slate-100 text-slate-900 border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  About
                </button>
                <button
                  onClick={() => handleNav('/contact')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    location.pathname === '/contact'
                      ? 'bg-slate-100 text-slate-900 border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Contact
                </button>
                <button
                  onClick={() => handleNav('/legal')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    location.pathname === '/legal'
                      ? 'bg-slate-100 text-slate-900 border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Legal
                </button>
              </>
            ) : (
              activeNavLinks.map((link) => {
                const isActive = 
                  location.pathname === link.path || 
                  (link.path.includes('?') && location.pathname + location.search === link.path);
                return (
                  <button
                    key={link.path}
                    onClick={() => handleNav(link.path)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive 
                        ? 'bg-slate-100 text-slate-900 font-semibold border border-slate-200 shadow-2xs' 
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
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
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
                      className={`w-full text-left px-3 py-1.5 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
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
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-500" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => handleNav('/new-request')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-white" />
                  <span>Get Started</span>
                </button>
              </div>
            ) : (
              <>
                {/* Client Quick Action: New Verification */}
                {currentNormalizedRole === 'client' && (
                  <button
                    onClick={() => handleNav('/new-request')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-white" />
                    <span className="hidden sm:inline">New Verification</span>
                    <span className="sm:hidden">New</span>
                  </button>
                )}

                {/* Admin Command Menu Shortcut */}
                {currentNormalizedRole === 'admin' && (
                  <button
                    onClick={() => setCommandMenuOpen(true)}
                    className="hidden xl:inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs text-slate-600 transition-colors cursor-pointer"
                    title="Search records (Ctrl+K or ⌘K)"
                  >
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium">Search</span>
                    <kbd className="text-[10px] font-mono px-1 py-0.5 rounded bg-white border border-slate-300 text-slate-500 shadow-2xs">
                      ⌘K
                    </kbd>
                  </button>
                )}

                {/* Admin "View As" Quick Launcher */}
                {currentNormalizedRole === 'admin' && (
                  <button
                    onClick={() => setViewAsModalOpen(true)}
                    className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-900 border border-amber-200/90 hover:bg-amber-500/20 whitespace-nowrap transition-colors cursor-pointer"
                    title="View Experience as Client or Agent"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-700" />
                    <span>View As...</span>
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
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent hover:border-slate-200 relative transition-colors cursor-pointer"
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
                            className="text-[10px] text-emerald-700 hover:underline font-semibold cursor-pointer"
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
                    className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                      {currentUser?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="text-left hidden xl:block leading-tight">
                      <div className="text-xs font-bold text-slate-900 truncate max-w-[110px]">
                        {currentUser?.name?.split(' ')[0] || 'Account'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium capitalize">
                        {currentNormalizedRole}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {roleMenuOpen && (
                    <div className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 text-left space-y-1">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {currentNormalizedRole === 'admin' 
                            ? 'HQ Operations Administrator' 
                            : currentNormalizedRole === 'agent' 
                            ? 'Field Agent Workspace' 
                            : 'Diaspora Client Workspace'}
                        </div>
                        <div className="text-xs font-semibold text-slate-800 mt-0.5 truncate">
                          {currentUser?.email}
                        </div>
                      </div>

                      {/* Admin-Only Controls */}
                      {currentNormalizedRole === 'admin' && (
                        <div className="space-y-1">
                          <button
                            onClick={() => {
                              setRoleMenuOpen(false);
                              navigate('/admin');
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                          >
                            <span>Operations Command Desk</span>
                            <span className="text-[10px] text-blue-600 font-bold">HQ</span>
                          </button>
                          <button
                            onClick={() => {
                              setRoleMenuOpen(false);
                              navigate('/cockpit');
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                          >
                            <span>Financial Cockpit</span>
                            <span className="text-[10px] text-emerald-600 font-bold">LIVE</span>
                          </button>
                          <button
                            onClick={() => {
                              setRoleMenuOpen(false);
                              navigate('/');
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                          >
                            <span>View Public Site</span>
                            <Globe className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                          <button
                            onClick={() => {
                              setRoleMenuOpen(false);
                              setViewAsModalOpen(true);
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-amber-900 bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200 flex items-center justify-between cursor-pointer"
                          >
                            <span>Launch "View As" Preview...</span>
                            <span className="text-[10px] text-amber-700 font-bold">Audited</span>
                          </button>
                        </div>
                      )}

                      {/* Client-Only Quick Navigation */}
                      {currentNormalizedRole === 'client' && (
                        <div className="space-y-0.5">
                          <button
                            onClick={() => {
                              setRoleMenuOpen(false);
                              navigate('/dashboard');
                            }}
                            className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                            <span>Dashboard Overview</span>
                          </button>
                          <button
                            onClick={() => {
                              setRoleMenuOpen(false);
                              navigate('/requests');
                            }}
                            className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-emerald-600" />
                            <span>My Requests ({clientRequests.length})</span>
                          </button>
                          <button
                            onClick={() => {
                              setRoleMenuOpen(false);
                              navigate('/properties');
                            }}
                            className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                          >
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>My Properties</span>
                          </button>
                          <button
                            onClick={() => {
                              setRoleMenuOpen(false);
                              navigate('/');
                            }}
                            className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                          >
                            <Globe className="w-3.5 h-3.5 text-slate-400" />
                            <span>Public Website</span>
                          </button>
                        </div>
                      )}

                      {/* Agent-Only Quick Navigation */}
                      {currentNormalizedRole === 'agent' && (
                        <div className="space-y-0.5">
                          <button
                            onClick={() => {
                              setRoleMenuOpen(false);
                              navigate('/agent');
                            }}
                            className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                          >
                            <Smartphone className="w-3.5 h-3.5 text-amber-600" />
                            <span>Assigned Field Tasks</span>
                          </button>
                          <button
                            onClick={() => {
                              setRoleMenuOpen(false);
                              navigate('/');
                            }}
                            className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                          >
                            <Globe className="w-3.5 h-3.5 text-slate-400" />
                            <span>Public Website</span>
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
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
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
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center justify-between transition-colors cursor-pointer"
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

                {/* Mobile Menu Toggle Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="xl:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                  aria-label="Toggle navigation menu"
                >
                  {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              </>
            )}

          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-lg animate-in fade-in duration-150">
          {!isAuthenticated || !currentUser ? (
            <>
              <button
                onClick={() => handleNav('/services')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Services
              </button>
              <button
                onClick={() => handleNav('/how-it-works')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                How It Works
              </button>
              <button
                onClick={() => handleNav('/sample-report')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-emerald-700 hover:bg-emerald-50 cursor-pointer font-bold"
              >
                Sample Report ↗
              </button>
              <button
                onClick={() => handleNav('/about')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                About DiasporaVerify
              </button>
              <button
                onClick={() => handleNav('/contact')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Contact & Inquiries
              </button>
              <button
                onClick={() => handleNav('/legal')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Legal & Compliance
              </button>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => handleNav('/login')}
                  className="flex-1 py-2 text-center rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('/new-request')}
                  className="flex-1 py-2 text-center rounded-xl bg-emerald-600 text-xs font-bold text-white cursor-pointer"
                >
                  Get Started
                </button>
              </div>
            </>
          ) : (
            <>
              {activeNavLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </button>
              ))}
              {currentNormalizedRole === 'admin' && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setViewAsModalOpen(true);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center gap-2 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-700" />
                  <span>Launch "View As" Mode...</span>
                </button>
              )}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span>Sign Out ({currentUser?.name?.split(' ')[0]})</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}

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
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
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
                      className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-xs flex items-center justify-between cursor-pointer"
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
                      className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all text-xs flex items-center justify-between cursor-pointer"
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
