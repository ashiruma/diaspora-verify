import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVerification } from '../../context/VerificationContext';
import { 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  FileText, 
  Clock, 
  ArrowRight,
  ShieldAlert,
  Smartphone
} from '../Icons';
import { StatusBadge } from '../ui/StatusBadge';
import { CategoryIcon } from '../CommonBadges';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { hasStopPaymentWarning } from '../../data/mockData';

export const ClientRequestsListView: React.FC = () => {
  const { clientRequests, openReportModal } = useVerification();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRequests = clientRequests.filter((req) => {
    const matchesSearch =
      req.id.toLowerCase().includes(search.toLowerCase()) ||
      req.title.toLowerCase().includes(search.toLowerCase()) ||
      req.location.town.toLowerCase().includes(search.toLowerCase()) ||
      req.location.county.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || req.category === categoryFilter;

    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = req.requestStatus !== 'COMPLETED' && req.requestStatus !== 'CANCELLED';
    } else if (statusFilter === 'completed') {
      matchesStatus = req.requestStatus === 'COMPLETED' || req.requestStatus === 'REPORT_READY';
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6 font-sans text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
            My Verification Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mt-1">
            Track and inspect your independent ground verification missions across Kenya. Filter by status, county, or service category.
          </p>
        </div>

        <Button
          variant="secondary"
          size="md"
          onClick={() => navigate('/new-request')}
          leftIcon={<Plus className="w-4 h-4 stroke-[2.5]" />}
        >
          New Verification
        </Button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px] max-w-md bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, title, town, or county..."
            className="w-full text-xs outline-none bg-transparent text-slate-800 placeholder-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs font-medium px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 outline-none"
            >
              <option value="all">All Categories</option>
              <option value="construction">Construction</option>
              <option value="property">Property</option>
              <option value="vehicle">Vehicle</option>
              <option value="business">Business</option>
              <option value="family">Family Care</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-medium px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Missions</option>
            <option value="completed">Completed & Reports Ready</option>
          </select>
        </div>
      </div>

      {/* Request List */}
      {filteredRequests.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-6 h-6" />}
          title="No verification requests found"
          description={
            search || categoryFilter !== 'all' || statusFilter !== 'all'
              ? 'No requests matched your filter criteria. Try adjusting your search query or filters.'
              : 'You have not submitted any verification requests yet.'
          }
          action={
            <Button variant="secondary" onClick={() => navigate('/new-request')}>
              Create Request
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((req) => {
            const isStopPayment = hasStopPaymentWarning(req);
            const isReportReady = req.qaReview?.publishedToClient || req.requestStatus === 'REPORT_READY' || req.requestStatus === 'COMPLETED';

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-5 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {req.id}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 capitalize bg-slate-50 border border-slate-200/70 px-2 py-0.5 rounded">
                      <CategoryIcon category={req.category} className="w-3 h-3 text-slate-500" />
                      <span>{req.category}</span>
                    </span>
                    <StatusBadge status={req.requestStatus || req.status} size="sm" />
                    {isStopPayment && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                        <ShieldAlert className="w-3 h-3 text-amber-700" /> Stop Payment
                      </span>
                    )}
                  </div>

                  <h3
                    onClick={() => navigate(`/request/${req.id}`)}
                    className="text-sm sm:text-base font-bold text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    {req.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {req.location.town}, {req.location.county}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {req.createdAt.substring(0, 10)}
                    </span>
                    {req.assignedAgent && (
                      <span className="flex items-center gap-1 text-slate-700 font-medium">
                        <Smartphone className="w-3.5 h-3.5 text-amber-600" />
                        {req.assignedAgent.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center flex-shrink-0">
                  {isReportReady && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openReportModal(req)}
                      leftIcon={<FileText className="w-3.5 h-3.5 text-emerald-600" />}
                    >
                      Audit Report
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/request/${req.id}`)}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
