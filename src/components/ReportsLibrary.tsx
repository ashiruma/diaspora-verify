import React, { useState } from 'react';
import { useVerification } from '../context/VerificationContext';
import { 
  FileText, 
  MapPin, 
  AlertTriangle
} from './Icons';
import { StatusBadge } from './CommonBadges';


export const ReportsLibrary: React.FC<{ onOpenReport: (req: any) => void }> = ({ onOpenReport }) => {
  const { requests } = useVerification();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = requests.filter(r => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchesSearch = 
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.location.county.toLowerCase().includes(search.toLowerCase()) ||
      r.client.name.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
              Document Archive
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {requests.length} Published Reports
            </span>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-900 mt-1">
            Verification Reports & Audit Register
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Formal, immutable verification reports complete with geotagged photo evidence, 
            contradiction logs, explicit uncertainty notes, and coordinator digital stamps.
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Search by ID, client, or county..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 rounded-xl border transition-all ${
            filterStatus === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Reports ({requests.length})
        </button>
        <button
          onClick={() => setFilterStatus('observed')}
          className={`px-3 py-1.5 rounded-xl border transition-all ${
            filterStatus === 'observed' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Observed ({requests.filter(r => r.status === 'observed').length})
        </button>
        <button
          onClick={() => setFilterStatus('partly_observed')}
          className={`px-3 py-1.5 rounded-xl border transition-all ${
            filterStatus === 'partly_observed' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Partly Observed ({requests.filter(r => r.status === 'partly_observed').length})
        </button>
        <button
          onClick={() => setFilterStatus('cannot_confirm')}
          className={`px-3 py-1.5 rounded-xl border transition-all ${
            filterStatus === 'cannot_confirm' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Cannot Confirm ({requests.filter(r => r.status === 'cannot_confirm').length})
        </button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(req => {
          const hasStopPayment = req.paymentDecisionRecord?.stopPaymentAlert;

          return (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between hover:border-emerald-400 hover:shadow-md transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-500">{req.id}</span>
                  <StatusBadge status={req.status} size="sm" />
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 line-clamp-2">
                    {req.title}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {req.location.town}, {req.location.county}
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Client Abroad:</span>
                    <span className="font-semibold text-slate-800">{req.client.name}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Field Verifier:</span>
                    <span className="font-semibold text-slate-800">{req.assignedAgent?.name || 'Assigned Officer'}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Date Completed:</span>
                    <span className="font-mono text-slate-700">{req.completedDate || req.updatedAt.substring(0, 10)}</span>
                  </div>
                </div>

                {hasStopPayment && (
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span>Stop-Payment Alert Issued</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  {req.evidence.length} Evidence Items
                </span>
                <button
                  onClick={() => onOpenReport(req)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Open Report</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
