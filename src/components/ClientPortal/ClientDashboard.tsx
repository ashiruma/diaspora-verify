import React from 'react';
import { useVerification } from '../../context/VerificationContext';
import { 
  Plus, 
  ArrowRight, 
  MapPin, 
  FileText,
  Clock,
  ExternalLink,
  ShieldCheck
} from '../Icons';
import { StatusBadge } from '../ui/StatusBadge';
import { CategoryIcon } from '../CommonBadges';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { useNavigate } from 'react-router-dom';

interface ClientDashboardProps {
  onSelectRequest: (id: string) => void;
  onNavigateToConstruction?: () => void;
  onNavigateToNewRequest: () => void;
  onOpenReport: (req: any) => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  onSelectRequest,
  onNavigateToNewRequest,
  onOpenReport,
}) => {
  const { clientRequests, currentUser } = useVerification();
  const navigate = useNavigate();

  // Summary Metrics: Keep simple, do not create excessive statistics!
  const activeRequests = clientRequests.filter(
    (r) => r.requestStatus !== 'COMPLETED' && r.requestStatus !== 'CANCELLED'
  );
  const reportsAvailable = clientRequests.filter(
    (r) => r.qaReview?.publishedToClient || r.requestStatus === 'REPORT_READY' || r.requestStatus === 'COMPLETED'
  );

  const firstName = currentUser?.name?.split(' ')[0] || 'Client';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 font-sans text-left">
      
      {/* 1. Header & Primary Dominant Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
            Good morning, {firstName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
            Here is the live status of your verification missions across Kenya. Your assigned field verifiers provide dated evidence and objective findings.
          </p>
        </div>

        {/* One Dominant Quick Action */}
        <div className="flex-shrink-0">
          <Button
            variant="secondary"
            size="lg"
            onClick={onNavigateToNewRequest}
            leftIcon={<Plus className="w-4 h-4 stroke-[2.5]" />}
          >
            New Verification
          </Button>
        </div>
      </div>

      {/* 2. Restrained Operational Summary Bar (No excessive statistics) */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-6 py-3 px-3.5 sm:px-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-slate-400 font-medium">Active Requests:</span>
          <span className="font-bold text-slate-900 font-mono text-sm bg-slate-100 px-2 py-0.5 rounded-md">
            {activeRequests.length}
          </span>
        </div>

        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

        <div className="flex items-center gap-2.5">
          <span className="text-slate-400 font-medium">Reports Available:</span>
          <span className="font-bold text-emerald-800 font-mono text-sm bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
            {reportsAvailable.length}
          </span>
        </div>

        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

        <div className="text-slate-400 hidden sm:flex items-center gap-1.5 ml-auto text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Independent on-ground due diligence</span>
        </div>
      </div>

      {/* 3. ACTIVE REQUESTS — What is happening with my requests? */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Active Verifications
            </h2>
            <p className="text-xs text-slate-500">
              Ongoing field missions and progress milestones
            </p>
          </div>
          {activeRequests.length > 0 && (
            <button
              onClick={() => navigate('/requests')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              View all requests ({clientRequests.length}) →
            </button>
          )}
        </div>

        {activeRequests.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-6 h-6" />}
            title="No active verification requests"
            description="You don't have any active field verifications currently underway. All completed audit dossiers are cataloged in Recent Reports below."
            action={
              <Button variant="secondary" onClick={onNavigateToNewRequest}>
                New Verification
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {activeRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 p-4 sm:p-5 shadow-xs transition-all duration-150 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: ID, Service, Location & Title */}
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {req.id}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 capitalize bg-slate-50 border border-slate-200/70 px-2 py-0.5 rounded">
                      <CategoryIcon category={req.category} className="w-3 h-3 text-slate-500" />
                      <span>{req.category}</span>
                    </span>
                    <StatusBadge status={req.requestStatus || req.status} size="sm" />
                  </div>

                  <h3
                    onClick={() => onSelectRequest(req.id)}
                    className="text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    {req.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{req.location.town}, {req.location.county}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Visit: {req.scheduledVisitDate || 'Scheduled'}</span>
                    </span>
                    {req.assignedAgent && (
                      <span className="text-[11px] text-slate-600 font-medium">
                        Verifier: <span className="text-slate-900">{req.assignedAgent.name}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Progress indicator & Primary Action */}
                <div className="flex items-center gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      Stage
                    </div>
                    <div className="text-xs font-bold text-slate-800 capitalize">
                      {req.stage} Phase
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectRequest(req.id)}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. RECENT REPORTS — Completed Dossiers */}
      <section className="space-y-4 pt-4 border-t border-slate-200/60">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Recent Verification Reports
            </h2>
            <p className="text-xs text-slate-500">
              Completed on-ground dossiers with cryptographic proof and objective findings
            </p>
          </div>
          <button
            onClick={() => navigate('/reports')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            All Reports ({reportsAvailable.length}) →
          </button>
        </div>

        {reportsAvailable.length === 0 ? (
          <div className="py-8 text-center rounded-2xl bg-slate-50/50 border border-slate-200 text-xs text-slate-400">
            No published reports yet. When your field verifier completes inspection and Nairobi QA clears findings, immutable reports will appear here.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            {reportsAvailable.slice(0, 3).map((req) => (
              <div
                key={`rep-${req.id}`}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700">{req.id}</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Report Dossier Ready
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{req.title}</h4>
                  <p className="text-[11px] text-slate-500">
                    Location: {req.location.county} · Verified by {req.assignedAgent?.name || 'Field Inspector'} · SHA-256 Digest Sealed
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenReport(req)}
                    leftIcon={<ExternalLink className="w-3.5 h-3.5 text-slate-500" />}
                  >
                    Open Report
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
