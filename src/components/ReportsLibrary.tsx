import React, { useState } from 'react';
import { useVerification } from '../context/VerificationContext';
import { 
  FileText, 
  Search, 
  MapPin, 
  AlertTriangle
} from './Icons';
import { StatusBadge, CategoryIcon } from './CommonBadges';
import { hasStopPaymentWarning } from '../data/mockData';
import { EmptyState } from './ui/EmptyState';
import { PortalLayout } from './layout/PortalLayout';

export const ReportsLibrary: React.FC = () => {
  const { requests, clientRequests, currentUser, openReportModal } = useVerification();
  const accessibleRequests = currentUser?.role === 'admin' ? requests : clientRequests;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter requests that have reports ready or are in review/completed
  const filteredRequests = accessibleRequests.filter(req => {
    const matchesSearch = 
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.location.county.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.location.town.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || req.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || req.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <PortalLayout
      title="Reports Library"
      subtitle="Thursday, 8 October 2026 · Verified Inspection Certificates"
      role={currentUser?.role === 'admin' ? 'admin' : 'client'}
      activeTab="reports"
    >
      <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              OFFICIAL VERIFICATION REGISTER
            </span>
            <span className="text-xs text-slate-400">Cryptographically Signed Reports</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white">
            Verification Reports Library
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Browse, inspect, and export verified on-ground inspection dossiers. Every report features transparent confidence scores, objective findings, SHA-256 evidence digests, and explicit boundary limitations.
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3 text-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 flex items-center justify-center text-emerald-400 font-bold">
            {accessibleRequests.length}
          </div>
          <div>
            <div className="font-bold text-white text-xs">Total Reports Issued</div>
            <div className="text-[11px] text-slate-400">Across 8 Kenyan Counties</div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports by ID (e.g. DV-2026-KJD-0104), county, or title..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none"
          >
            <option value="all">All Service Categories</option>
            <option value="construction">Construction Oversight</option>
            <option value="property">Property & Land</option>
            <option value="business">Business Due Diligence</option>
            <option value="vehicle">Vehicle Inspection</option>
            <option value="family">Family Welfare Support</option>
            <option value="document">Document Verification</option>
            <option value="purchase">Purchases & Machinery</option>
            <option value="field_assistance">Field Assistance</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none"
          >
            <option value="all">All Verification Statuses</option>
            <option value="observed">Observed</option>
            <option value="partly_observed">Partly Observed</option>
            <option value="not_observed">Not Observed</option>
            <option value="cannot_confirm">Cannot Confirm</option>
          </select>
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
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <FileText className="w-10 h-10 mx-auto text-slate-300" />
          <h3 className="font-bold text-slate-800 text-sm">No reports match your search criteria.</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords or resetting status and category filters.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedStatus('all'); setSelectedCategory('all'); }}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((req) => {
            const isStopPayment = hasStopPaymentWarning(req);
            const score = req.confidenceScore?.overall ?? 85;
            const tier = req.confidenceScore?.ratingTier ?? 'HIGH';

            return (
              <div
                key={req.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-slate-300 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Meta Bar */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                      {req.id}
                    </span>
                    <StatusBadge status={req.status} size="sm" />
                  </div>

                  {/* Title & Category */}
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      <CategoryIcon category={req.category} className="w-3.5 h-3.5" />
                      <span>{req.category.replace('_', ' ')}</span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">
                      {req.title}
                    </h3>
                  </div>

                  {/* Location & Agent */}
                  <div className="text-xs text-slate-500 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span className="truncate">{req.location.town}, {req.location.county}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Inspector: <strong>{req.assignedAgent?.name || 'Vetted Officer'}</strong>
                    </div>
                  </div>

                  {/* Stop Payment Alert if Triggered */}
                  {isStopPayment && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-[11px] text-amber-900 flex items-center gap-2 font-medium">
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>Stop-Payment Advisory Issued</span>
                    </div>
                  )}

                  {/* Confidence Score Pill */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Confidence Metric</span>
                      <div className="font-extrabold text-slate-900 text-sm">
                        {score}/100 <span className="text-[11px] font-semibold text-emerald-700">({tier})</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 text-right">
                      {req.evidence.length} evidence items<br />
                      SHA-256 hashed
                    </div>
                  </div>

                  {/* Findings Snippet */}
                  <p className="text-xs text-slate-600 line-clamp-2 italic">
                    "{req.qaReview?.findingsSummary || req.scopeBrief}"
                  </p>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400">
                    Issued {req.updatedAt.substring(0, 10)}
                  </span>
                  
                  <button
                    onClick={() => openReportModal(req)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Open Report</span>
                  </button>
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
