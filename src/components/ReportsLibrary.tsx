import React, { useState } from 'react';
import { useVerification } from '../context/VerificationContext';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  MapPin, 
  AlertTriangle,
  Award
} from 'lucide-react';
import { StatusBadge, CategoryIcon } from './CommonBadges';
import { hasStopPaymentWarning } from '../data/mockData';
import { EmptyState } from './ui/EmptyState';
import { PortalLayout } from './layout/PortalLayout';

export const ReportsLibrary: React.FC = () => {
  const { requests, clientRequests, currentUser, openReportModal } = useVerification();
  const navigate = useNavigate();
  const accessibleRequests = currentUser?.role === 'admin' ? requests : clientRequests;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');

  // Filter requests that match search, status, category, and county
  const filteredRequests = accessibleRequests.filter(req => {
    const matchesSearch = 
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.location.county.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.location.town.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || req.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || req.category === selectedCategory;
    const matchesCounty = selectedCounty === 'all' || req.location.county.toLowerCase() === selectedCounty.toLowerCase();

    return matchesSearch && matchesStatus && matchesCategory && matchesCounty;
  });

  // Analytics Metrics
  const totalReports = accessibleRequests.length;
  const observedCount = accessibleRequests.filter(r => r.status === 'observed').length;
  const observedRate = totalReports > 0 ? Math.round((observedCount / totalReports) * 100) : 100;
  const stopPaymentCount = accessibleRequests.filter(r => hasStopPaymentWarning(r)).length;
  const avgConfidence = totalReports > 0 
    ? Math.round(accessibleRequests.reduce((sum, r) => sum + (r.confidenceScore?.overall ?? 85), 0) / totalReports)
    : 85;

  const quickCounties = ['all', 'Nairobi', 'Kiambu', 'Machakos', 'Nakuru', 'Kisumu', 'Kilifi'];

  return (
    <PortalLayout
      title="Reports Library"
      subtitle="Immutable Dossiers, GPS Geofencing, and Evidence Logs"
      role={currentUser?.role === 'admin' ? 'admin' : 'client'}
      activeTab="reports"
    >
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="bg-[#171310] text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 border border-[#2D241E]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                OFFICIAL VERIFICATION REGISTER
              </span>
              <span className="text-xs text-stone-400 font-mono">SHA-256 Tamper-Evident</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-normal text-white">
              Verification Reports & Evidence Vault
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl font-light leading-relaxed">
              Browse, inspect, and export verified on-ground inspection dossiers. Every report features transparent confidence scoring, objective observations, GPS geofence checks, and explicit boundary limitations.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold font-mono text-xl">
              {totalReports}
            </div>
            <div>
              <div className="font-bold text-white text-xs">Certified Reports</div>
              <div className="text-[11px] text-stone-400 font-mono">Boots on Ground</div>
            </div>
          </div>
        </div>

        {/* 4 Quick Stat Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white rounded-2xl border border-[#E8E2D8] p-4 space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Dossiers Issued</span>
            <div className="text-2xl font-bold font-mono text-slate-900">{totalReports}</div>
            <p className="text-[11px] text-slate-500">Across 8 counties</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8E2D8] p-4 space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Observed Rate</span>
            <div className="text-2xl font-bold font-mono text-emerald-900">{observedRate}%</div>
            <p className="text-[11px] text-emerald-700 font-medium">Physically verified on site</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8E2D8] p-4 space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Stop-Payment Advisories</span>
            <div className="text-2xl font-bold font-mono text-rose-950">{stopPaymentCount}</div>
            <p className="text-[11px] text-rose-700 font-medium">Funds withheld for variance</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8E2D8] p-4 space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Avg. Reliability</span>
            <div className="text-2xl font-bold font-mono text-slate-900">{avgConfidence}<span className="text-xs text-slate-400 font-normal">/100</span></div>
            <p className="text-[11px] text-slate-500 font-medium">Calibrated evidence metric</p>
          </div>
        </div>

        {/* Search, Filter Bar & Quick County Chips */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E8E2D8] shadow-2xs space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[260px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reports by ID (e.g. DV-2026-KJD-0104), county, or title..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-xs font-medium text-slate-900"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="construction">Construction Oversight</option>
                <option value="property">Property & Land</option>
                <option value="business">Business Site Check</option>
                <option value="vehicle">Vehicle & Machinery</option>
                <option value="family">Family Welfare Support</option>
                <option value="document">Document Search</option>
                <option value="purchase">Materials & Purchase</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 cursor-pointer"
              >
                <option value="all">All Verification Statuses</option>
                <option value="observed">Observed</option>
                <option value="partly_observed">Partly Observed</option>
                <option value="not_observed">Not Observed</option>
                <option value="cannot_confirm">Cannot Confirm</option>
              </select>
            </div>
          </div>

          {/* Quick County Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-[#E8E2D8]/60 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono px-1">County:</span>
            {quickCounties.map((county) => {
              const isSelected = selectedCounty.toLowerCase() === county.toLowerCase();
              return (
                <button
                  key={county}
                  type="button"
                  onClick={() => setSelectedCounty(county)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0D5C3A] text-white shadow-2xs'
                      : 'bg-[#FAF8F5] text-slate-600 hover:text-slate-900 border border-[#E8E2D8] hover:border-slate-300'
                  }`}
                >
                  {county === 'all' ? 'All Kenya Hubs' : `${county} County`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reports Grid */}
        {accessibleRequests.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-8 h-8 text-slate-400" />}
            title="No Verification Reports Available"
            description="Once your on-ground verifications are completed by assigned field agents and reviewed by Nairobi HQ Operations, your official cryptographically verified reports will appear here."
            className="bg-white border-slate-200 py-16"
          />
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E8E2D8] p-12 text-center space-y-3 shadow-2xs">
            <FileText className="w-10 h-10 mx-auto text-slate-300" />
            <h3 className="font-bold text-slate-800 text-sm">No reports match your filters.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search query or resetting your status and county criteria.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedStatus('all'); setSelectedCategory('all'); setSelectedCounty('all'); }}
              className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRequests.map((req) => {
              const isStopPayment = hasStopPaymentWarning(req);
              const score = req.confidenceScore?.overall ?? 85;
              const tier = req.confidenceScore?.ratingTier ?? 'HIGH';

              // Safeguard Rule 2 & Security Rule 9: Never leak agent personal contact details
              const inspectorDisplay = currentUser?.role === 'admin'
                ? (req.assignedAgent?.name || 'Vetted Field Officer')
                : `Vetted Verifier (#FD-${req.assignedAgent?.id?.replace(/[^0-9]/g, '') || '7102'})`;

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl border border-[#E8E2D8] hover:border-emerald-300 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3.5">
                    {/* Top Meta Bar */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800 bg-[#FAF8F5] border border-[#E8E2D8] px-2.5 py-0.5 rounded-lg">
                        {req.id}
                      </span>
                      <StatusBadge status={req.status} size="sm" />
                    </div>

                    {/* Title & Category */}
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1 font-mono">
                        <CategoryIcon category={req.category} className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{req.category.replace('_', ' ')}</span>
                      </div>
                      <h3 className="font-serif font-bold text-base text-slate-900 leading-snug line-clamp-2">
                        {req.title}
                      </h3>
                    </div>

                    {/* Location & Masked Inspector */}
                    <div className="text-xs text-slate-500 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="truncate">{req.location.town}, {req.location.county} County</span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <Award className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>Inspector: <strong className="text-slate-800">{inspectorDisplay}</strong></span>
                      </div>
                    </div>

                    {/* Stop Payment Alert if Triggered */}
                    {isStopPayment && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-900 flex items-center gap-2 font-semibold">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Stop-Payment Advisory Issued</span>
                      </div>
                    )}

                    {/* Confidence Score Metric */}
                    <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Confidence Metric</span>
                        <div className="font-extrabold text-slate-900 text-sm font-mono">
                          {score}/100 <span className="text-[11px] font-bold text-emerald-800">({tier})</span>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-500 text-right font-mono">
                        {req.evidence.length} evidence items<br />
                        <span className="text-emerald-700 font-semibold">SHA-256 hashed</span>
                      </div>
                    </div>

                    {/* Findings Snippet */}
                    <p className="text-xs text-slate-600 line-clamp-2 italic leading-relaxed">
                      "{req.qaReview?.findingsSummary || req.scopeBrief}"
                    </p>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-[#E8E2D8] flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {req.updatedAt.substring(0, 10)}
                    </span>
                    
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => navigate(`/request/${req.id}`)}
                        className="px-2.5 py-1.5 rounded-xl border border-[#E8E2D8] bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                        title="View request timeline & evidence"
                      >
                        Lifecycle
                      </button>

                      <button
                        type="button"
                        onClick={() => openReportModal(req)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#0D5C3A] hover:bg-[#094229] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Open Report</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PortalLayout>
  );
};
