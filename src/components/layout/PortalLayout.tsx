import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useVerification } from '../../context/VerificationContext';
import {
  AlertTriangle,
  Bell,
  Building,
  ChevronDown,
  CreditCard,
  Download,
  FileCheck2,
  FileText,
  Globe,
  Hammer,
  LogOut,
  MapPin,
  Menu,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  User,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import type { CurrencyCode } from '../../types';
import { AdminPreviewBanner } from '../AdminPreviewBanner';

export interface PortalLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  role?: 'client' | 'admin' | 'operations' | 'agent' | 'field_agent' | 'corporate';
  activeTab?: string;
  onNavigateTab?: (tab: string) => void;
  statusBadge?: {
    text: string;
    variant?: 'success' | 'warning' | 'info';
  };
  actions?: React.ReactNode;
  onRefresh?: () => void;
  onExport?: () => void;
}

interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  badge?: string | number;
  onClick?: () => void;
}

function NavItem({ icon: Icon, label, active, badge, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition cursor-pointer ${
        active
          ? 'bg-[#07152f] text-white shadow-sm'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon className="h-[17px] w-[17px] shrink-0" />
      <span className="flex-1 text-left truncate">{label}</span>
      {badge !== undefined && badge !== null && (
        <span
          className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
            active ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({
  children,
  title,
  subtitle = 'Thursday, 8 October 2026 · Nairobi HQ',
  role,
  activeTab,
  onNavigateTab,
  statusBadge,
  actions,
  onRefresh,
  onExport,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const {
    currentUser,
    activeRole: contextActiveRole,
    currency,
    setCurrency,
    logout,
    clientRequests,
    agentRequests,
    agents,
    disputes,
    notifications,
    setCommandMenuOpen,
  } = useVerification();

  const effectiveRole = role || contextActiveRole || currentUser?.role || 'client';
  const isAdmin = effectiveRole === 'admin' || effectiveRole === 'operations';
  const isAgent = effectiveRole === 'agent' || effectiveRole === 'field_agent';

  const currencies: CurrencyCode[] = ['KES', 'USD', 'GBP', 'EUR', 'AED', 'CAD', 'AUD'];

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const activeClientRequestsCount = clientRequests.filter(
    (r) => r.requestStatus !== 'COMPLETED' && r.requestStatus !== 'CANCELLED'
  ).length;
  const readyReportsCount = clientRequests.filter(
    (r) => r.qaReview?.publishedToClient || r.requestStatus === 'REPORT_READY'
  ).length;

  const handleNav = (target: string, isTab: boolean = false) => {
    setMobileOpen(false);
    if (isTab && onNavigateTab) {
      onNavigateTab(target);
    } else if (isTab && isAdmin) {
      navigate(`/admin?tab=${target}`);
    } else {
      navigate(target);
    }
  };

  const roleLabel = isAdmin ? 'Operations' : isAgent ? 'Field Agent' : 'Client Portal';
  const subLinkTarget = isAdmin ? '/admin' : isAgent ? '/agent' : '/dashboard';
  const subLinkLabel = isAdmin ? '← Operations Desk' : isAgent ? '← Field Missions' : '← Dashboard';

  // Navigation Items Renderer
  const renderSidebarNav = () => {
    if (isAdmin) {
      return (
        <>
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Workspace
          </p>
          <NavItem
            icon={Wallet}
            label="Overview / Cockpit"
            active={activeTab === 'operations' || location.pathname === '/cockpit'}
            onClick={() => handleNav('/cockpit')}
          />
          <NavItem
            icon={FileText}
            label="Operations Desk"
            active={activeTab === 'requests' || (location.pathname === '/admin' && activeTab !== 'operations')}
            onClick={() => handleNav('requests', true)}
          />
          <NavItem
            icon={CreditCard}
            label="Money In & Out"
            active={activeTab === 'payments' || location.pathname === '/payments'}
            onClick={() => handleNav('payments', true)}
          />
          <NavItem
            icon={Users}
            label="Clients"
            badge="5"
            active={activeTab === 'clients'}
            onClick={() => handleNav('clients', true)}
          />
          <NavItem
            icon={ShieldCheck}
            label="Verifiers"
            badge={agents.length || 5}
            active={activeTab === 'agents'}
            onClick={() => handleNav('agents', true)}
          />
          <NavItem
            icon={FileCheck2}
            label="Reports & QA"
            active={activeTab === 'reports'}
            onClick={() => handleNav('reports', true)}
          />
          <NavItem
            icon={AlertTriangle}
            label="Disputes"
            badge={disputes.length || 1}
            active={activeTab === 'disputes' || location.pathname === '/disputes'}
            onClick={() => handleNav('disputes', true)}
          />
          <NavItem
            icon={TrendingUp}
            label="Intelligence"
            active={activeTab === 'analytics'}
            onClick={() => handleNav('analytics', true)}
          />

          <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Management
          </p>
          <NavItem
            icon={Bell}
            label="Notifications"
            badge={unreadNotifs || 3}
            active={activeTab === 'notifications'}
            onClick={() => handleNav('operations', true)}
          />
          <NavItem
            icon={ShieldCheck}
            label="Audit & Security"
            active={activeTab === 'settings'}
            onClick={() => handleNav('settings', true)}
          />
        </>
      );
    }

    if (isAgent) {
      return (
        <>
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Mission Workspace
          </p>
          <NavItem
            icon={Smartphone}
            label="Active Assignments"
            badge={agentRequests.length || 1}
            active={location.pathname === '/agent' && (!location.hash || location.hash === '#tasks')}
            onClick={() => handleNav('/agent')}
          />
          <NavItem
            icon={MapPin}
            label="GPS Site Check-In"
            active={location.hash === '#checkin'}
            onClick={() => handleNav('/agent#checkin')}
          />
          <NavItem
            icon={FileCheck2}
            label="Evidence Queue"
            active={location.hash === '#evidence'}
            onClick={() => handleNav('/agent#evidence')}
          />
          <NavItem
            icon={Wallet}
            label="Earnings & M-Pesa"
            active={location.hash === '#earnings'}
            onClick={() => handleNav('/agent#earnings')}
          />

          <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Protocols & Trust
          </p>
          <NavItem
            icon={ShieldCheck}
            label="Safeguarding & Ethics"
            onClick={() => handleNav('/legal')}
          />
          <NavItem
            icon={Bell}
            label="Nairobi HQ Dispatch"
            badge="Live"
            onClick={() => handleNav('/agent#dispatch')}
          />
        </>
      );
    }

    // Client Navigation
    return (
      <>
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Workspace
        </p>
        <NavItem
          icon={Wallet}
          label="Overview"
          active={location.pathname === '/dashboard'}
          onClick={() => handleNav('/dashboard')}
        />
        <NavItem
          icon={FileCheck2}
          label="My Requests"
          badge={activeClientRequestsCount || clientRequests.length}
          active={location.pathname === '/requests' || location.pathname.startsWith('/request/')}
          onClick={() => handleNav('/requests')}
        />
        <NavItem
          icon={Plus}
          label="New Verification"
          active={location.pathname === '/new-request'}
          onClick={() => handleNav('/new-request')}
        />
        <NavItem
          icon={Building}
          label="Property Portfolio"
          active={location.pathname === '/properties'}
          onClick={() => handleNav('/properties')}
        />
        <NavItem
          icon={Hammer}
          label="Construction Tracker"
          active={location.pathname === '/construction'}
          onClick={() => handleNav('/construction')}
        />
        <NavItem
          icon={FileText}
          label="Reports Library"
          badge={readyReportsCount > 0 ? readyReportsCount : undefined}
          active={location.pathname === '/reports'}
          onClick={() => handleNav('/reports')}
        />

        <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Communication & Billing
        </p>
        <NavItem
          icon={CreditCard}
          label="Invoices & Payments"
          active={location.pathname === '/payments'}
          onClick={() => handleNav('/payments')}
        />
        <NavItem
          icon={Bell}
          label="Direct Coordinator Relay"
          active={location.pathname === '/messages'}
          onClick={() => handleNav('/messages')}
        />
        <NavItem
          icon={AlertTriangle}
          label="Appeals & Disputes"
          badge={disputes.length > 0 ? disputes.length : undefined}
          active={location.pathname === '/disputes'}
          onClick={() => handleNav('/disputes')}
        />
        <NavItem
          icon={User}
          label="Account & Profile"
          active={location.pathname === '/profile'}
          onClick={() => handleNav('/profile')}
        />
      </>
    );
  };

  const userInitial = currentUser?.name?.[0]?.toUpperCase() || (isAdmin ? 'A' : isAgent ? 'F' : 'C');
  const userDisplayName = currentUser?.name || (isAdmin ? 'Administrator' : isAgent ? 'Field Verifier' : 'Client');
  const userSubtitle = isAdmin
    ? 'Admin HQ'
    : isAgent
    ? 'Verifier · Nairobi'
    : currentUser?.locationAbroad || 'Diaspora Client';

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900 font-sans">
      <AdminPreviewBanner />
      {/* =========================================================
          DESKTOP SIDEBAR (Matches Cockpit structure)
      ========================================================= */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[245px] border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-[78px] items-center border-b border-slate-100 px-6">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#07152f]">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>

            <div>
              <div className="text-[17px] font-bold tracking-tight">
                Diaspora<span className="text-emerald-500">Verify</span>
              </div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                {roleLabel}
              </div>
            </div>
          </div>

          {/* Quick Hub Navigation */}
          <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => navigate(subLinkTarget)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <span>{subLinkLabel}</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-0.5 cursor-pointer"
            >
              <Globe className="w-3 h-3" />
              <span>Public ↗</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            {renderSidebarNav()}
          </nav>

          {/* User Profile Card */}
          <div className="border-t border-slate-100 p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shrink-0">
                  {userInitial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-slate-900">
                    {userDisplayName}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate capitalize">
                    {userSubtitle}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* =========================================================
          MOBILE DRAWER SIDEBAR (< lg)
      ========================================================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative flex w-[270px] max-w-full flex-col bg-white border-r border-slate-200 shadow-2xl">
            <div className="flex h-[78px] items-center justify-between border-b border-slate-100 px-6">
              <div className="flex items-center">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#07152f]">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-[17px] font-bold tracking-tight">
                    Diaspora<span className="text-emerald-500">Verify</span>
                  </div>
                  <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                    {roleLabel}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate(subLinkTarget);
                }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <span>{subLinkLabel}</span>
              </button>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate('/');
                }}
                className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-0.5 cursor-pointer"
              >
                <Globe className="w-3 h-3" />
                <span>Public ↗</span>
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 overflow-y-auto">
              {renderSidebarNav()}
            </nav>

            <div className="border-t border-slate-100 p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shrink-0">
                    {userInitial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-900">
                      {userDisplayName}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate capitalize">
                      {userSubtitle}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MAIN CONTAINER (with header bar matching cockpit)
      ========================================================= */}
      <main className="lg:ml-[245px]">
        {/* TOP HEADER BAR */}
        <header className="sticky top-0 z-20 flex h-[78px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 md:px-8 backdrop-blur">
          {/* Left Title & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl lg:hidden cursor-pointer"
              aria-label="Open mobile menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 line-clamp-1">
                  {title}
                </h1>
                {statusBadge && (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {statusBadge.text}
                  </span>
                )}
              </div>
              <p className="hidden text-xs text-slate-400 sm:block">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Context Back Button */}
            <button
              onClick={() => navigate(subLinkTarget)}
              className="hidden sm:flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {subLinkLabel}
            </button>

            {/* Public Site Button */}
            <button
              onClick={() => navigate('/')}
              className="hidden md:flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-emerald-700 shadow-2xs hover:bg-emerald-50 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Public Site ↗</span>
            </button>

            {/* Currency Selector Pill */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
                title="Change display currency"
              >
                <span className="text-slate-400 font-normal hidden sm:inline">Currency</span>
                <span className="font-bold">{currency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-30 text-xs">
                  {currencies.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCurrency(c);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between cursor-pointer ${
                        currency === c
                          ? 'bg-slate-900 text-white font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{c}</span>
                      {currency === c && <span>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Global Search Shortcut Button */}
            <button
              onClick={() => setCommandMenuOpen(true)}
              className="hidden sm:flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-50 shadow-2xs cursor-pointer"
              title="Search everything (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <kbd className="hidden lg:inline-block rounded bg-slate-100 px-1 py-0.5 text-[10px] font-mono text-slate-500">
                ⌘K
              </kbd>
            </button>

            {/* Refresh Button */}
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="flex h-10 w-10 sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
                title="Refresh live data"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            )}

            {/* Export Button */}
            {onExport && (
              <button
                onClick={onExport}
                className="hidden sm:flex h-10 items-center gap-2 rounded-xl bg-[#0b1733] hover:bg-[#132247] px-4 text-xs font-semibold text-white shadow-2xs transition-colors cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export</span>
              </button>
            )}

            {/* Custom Injected Actions (e.g. + New Verification) */}
            {actions}
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <div className="mx-auto max-w-[1500px] p-4 sm:p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default PortalLayout;
