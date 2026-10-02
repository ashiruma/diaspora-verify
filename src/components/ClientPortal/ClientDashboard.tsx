import React, { useState } from 'react';
import { useVerification } from '../../context/VerificationContext';
import { 
  ShieldCheck,
  MapPin, 
  Building, 
  FileText, 
  Plus, 
  AlertTriangle, 
  DollarSign, 
  CheckCircle2, 
  Search, 
  User
} from '../Icons';

import { StatusBadge, ProcessStageBadge, CategoryIcon } from '../CommonBadges';
import { SERVICE_CATEGORIES_CONFIG, FORMAT_CURRENCY, hasStopPaymentWarning } from '../../data/mockData';
import type { ServiceCategory } from '../../types';


interface ClientDashboardProps {
  onSelectRequest: (id: string) => void;
  onNavigateToConstruction: () => void;
  onNavigateToNewRequest: () => void;
  onOpenReport: (req: any) => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  onSelectRequest,
  onNavigateToConstruction,
  onNavigateToNewRequest,
  onOpenReport,
}) => {
  const { requests, currency, selectRequest } = useVerification();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Stats calculation
  const totalRequests = requests.length;
  const stopPaymentAlerts = requests.filter(hasStopPaymentWarning).length;
  const verifiedEvidenceCount = requests.reduce((acc, r) => acc + r.evidence.length, 0);
  const totalPaymentsAuditedKES = requests.reduce((acc, r) => acc + (r.paymentDecisionRecord?.contractorRequestedKES || 0), 0);

  const filteredRequests = requests.filter(r => {
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.county.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.town.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      
      {/* Customer Facing Opener Hero (Direct from Document 1, Section 6) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-700/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold tracking-wide uppercase">
            <span>🇰🇪 Trusted On-Ground Support For People Abroad</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-white leading-tight">
            “Living abroad should not mean relying on guesswork for everything happening back home.”
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Tell us what you need checked or handled in Kenya. We will agree on the scope, 
            assign the right vetted person on the ground, keep you updated with dated evidence, 
            and give you clear findings and next steps. <strong>You remain in control of the decision.</strong>
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onNavigateToNewRequest}
              className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-bold text-sm px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Book a Ground Verification
            </button>
            <button
              onClick={onNavigateToConstruction}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-5 py-3 rounded-xl backdrop-blur border border-white/10 flex items-center gap-2 transition-all"
            >
              <Building className="w-4 h-4 text-emerald-400" />
              <span>Explore Construction Oversight Pilot</span>
            </button>
          </div>
        </div>

        {/* 3 Pillars Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-700/60 pt-6 mt-8 text-xs text-slate-300">
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
              ✓
            </div>
            <div>
              <div className="font-bold text-white">Independent Visit</div>
              <p className="text-slate-400 text-[11px]">Separated from sellers and contractors. Clear boundaries.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
              ✓
            </div>
            <div>
              <div className="font-bold text-white">Named Accountability</div>
              <p className="text-slate-400 text-[11px]">Vetted field agents with signed conflict clearances.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
              ✓
            </div>
            <div>
              <div className="font-bold text-white">Honest Reporting</div>
              <p className="text-slate-400 text-[11px]">Clear record of what was observed and what could not be confirmed.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Verifications</div>
            <div className="text-2xl font-black text-slate-900 font-display">{totalRequests}</div>
            <div className="text-[11px] text-emerald-600 font-medium">5 Kenyan Counties</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Funds Under Audit</div>
            <div className="text-2xl font-black text-slate-900 font-display">
              {FORMAT_CURRENCY(totalPaymentsAuditedKES, currency)}
            </div>
            <div className="text-[11px] text-slate-500">Contractor Claims Verified</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Evidence Items</div>
            <div className="text-2xl font-black text-slate-900 font-display">{verifiedEvidenceCount}</div>
            <div className="text-[11px] text-slate-500">Photos, GPS & Logs</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between ${
          stopPaymentAlerts > 0 ? 'bg-amber-50 border-amber-300' : 'bg-white border-slate-200'
        }`}>
          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Discrepancy Alerts</div>
            <div className="text-2xl font-black text-amber-800 font-display">{stopPaymentAlerts}</div>
            <div className="text-[11px] text-amber-700 font-semibold">Stop Payment Active</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Service Portfolio Category Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Your Active Requests & Assets</h2>
            <p className="text-xs text-slate-500">Track progress across construction, land, vehicles, business, and family.</p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search request, county, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Requests ({requests.length})
          </button>

          {SERVICE_CATEGORIES_CONFIG.map(cat => {
            const count = requests.filter(r => r.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <CategoryIcon category={cat.id as ServiceCategory} className="w-3.5 h-3.5" />
                <span>{cat.shortName}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Request Cards Grid */}
        <div className="space-y-4 pt-2">
          {filteredRequests.map((req) => {
            const isConstruction = req.category === 'construction';
            const hasStopPayment = hasStopPaymentWarning(req);

            return (
              <div
                key={req.id}
                className={`p-5 rounded-2xl border transition-all hover:shadow-md ${
                  hasStopPayment
                    ? 'border-amber-300 bg-amber-50/20'
                    : 'border-slate-200 bg-white hover:border-emerald-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left Column: Details & Title */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {req.id}
                      </span>
                      <ProcessStageBadge stage={req.stage} />
                      <StatusBadge status={req.status} />

                      {hasStopPayment && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-900 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Stop Payment Alert
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {req.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        {req.location.town}, {req.location.county}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        Contact: {req.contactOnGround.name}
                      </span>
                      {req.assignedAgent && (
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Agent: {req.assignedAgent.name}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-1">
                      {req.scopeBrief}
                    </p>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    
                    {isConstruction ? (
                      <button
                        onClick={() => {
                          selectRequest(req.id);
                          onNavigateToConstruction();
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Building className="w-3.5 h-3.5" />
                        Open Construction Oversight
                      </button>
                    ) : (
                      <button
                        onClick={() => onSelectRequest(req.id)}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        View Verification Lifecycle
                      </button>
                    )}

                    <button
                      onClick={() => onOpenReport(req)}
                      className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Report
                    </button>

                  </div>

                </div>
              </div>
            );
          })}

          {filteredRequests.length === 0 && (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
              <p className="text-xs text-slate-500">No requests found matching your filters.</p>
              <button
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
