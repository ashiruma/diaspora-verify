import React from 'react';
import { useVerification } from '../../context/VerificationContext';
import { 
  Plus, 
  ArrowRight, 
  MapPin, 
  FileText,
  Clock,
  ExternalLink,
} from '../Icons';
import { StatusBadge } from '../ui/StatusBadge';
import { CategoryIcon } from '../CommonBadges';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { useNavigate } from 'react-router-dom';
import { PortalLayout } from '../layout/PortalLayout';
import { CheckCircle2, TrendingUp, Wallet, MoreHorizontal, FileCheck2 } from 'lucide-react';

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
  const escrowTotalKES = clientRequests.reduce((sum, r) => sum + (r.pricing?.serviceFeeKES || 0), 0);
  const siteCount = new Set(clientRequests.map(r => r.location.town)).size || 1;

  return (
    <PortalLayout
      title="Client Portal Overview"
      subtitle="Thursday, 8 October 2026 · Nairobi Ground Operations"
      role="client"
      activeTab="dashboard"
      actions={
        <Button
          variant="secondary"
          size="md"
          onClick={onNavigateToNewRequest}
          leftIcon={<Plus className="w-4 h-4 stroke-[2.5]" />}
        >
          New Verification
        </Button>
      }
    >
      <div className="space-y-6">
        {/* PAGE INTRO (Cockpit Style) */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Active Diaspora Safeguard Protection
            </div>

            <h2 className="text-2xl font-bold tracking-tight md:text-3xl text-slate-900">
              Good morning, {firstName}
            </h2>

            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Live status of your verification missions across Kenya. Your assigned field verifiers provide dated evidence and objective findings.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate('/requests')}
              className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <FileText className="h-4 w-4 text-slate-500" />
              View All Requests
            </button>

            <button
              onClick={onNavigateToNewRequest}
              className="flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              New Verification
            </button>
          </div>
        </div>

        {/* KPI CARDS (Matches Cockpit Grid Structure) */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Card 1 */}
          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <Clock className="h-5 w-5" />
              </div>
              <MoreHorizontal className="h-5 w-5 text-slate-300" />
            </div>
            <p className="mt-5 text-xs font-medium uppercase tracking-wide text-slate-400">
              Active Missions
            </p>
            <div className="mt-1 flex items-end justify-between gap-3">
              <p className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
                {activeRequests.length}
              </p>
              <span className="mb-1 inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" />
                Live on-ground
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              In progress across Kenya
            </p>
          </div>

          {/* Card 2 */}
          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <MoreHorizontal className="h-5 w-5 text-slate-300" />
            </div>
            <p className="mt-5 text-xs font-medium uppercase tracking-wide text-slate-400">
              Reports Ready
            </p>
            <div className="mt-1 flex items-end justify-between gap-3">
              <p className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
                {reportsAvailable.length}
              </p>
              <span className="mb-1 inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                QA Certified
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Signed audit dossiers
            </p>
          </div>

          {/* Card 3 */}
          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <MapPin className="h-5 w-5 text-emerald-600" />
              </div>
              <MoreHorizontal className="h-5 w-5 text-slate-300" />
            </div>
            <p className="mt-5 text-xs font-medium uppercase tracking-wide text-slate-400">
              Monitored Locations
            </p>
            <div className="mt-1 flex items-end justify-between gap-3">
              <p className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
                {siteCount}
              </p>
              <span className="mb-1 inline-flex items-center gap-1 text-xs font-bold text-blue-600">
                Geotagged
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Towns & sites tracked
            </p>
          </div>

          {/* Card 4 */}
          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
              <MoreHorizontal className="h-5 w-5 text-slate-300" />
            </div>
            <p className="mt-5 text-xs font-medium uppercase tracking-wide text-slate-400">
              Escrow Protected
            </p>
            <div className="mt-1 flex items-end justify-between gap-3">
              <p className="text-xl font-bold tracking-tight text-slate-900 font-mono">
                KES {escrowTotalKES.toLocaleString()}
              </p>
              <span className="mb-1 inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                Safeguarded
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Milestone released funds
            </p>
          </div>
        </section>

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
    </PortalLayout>
  );
};
