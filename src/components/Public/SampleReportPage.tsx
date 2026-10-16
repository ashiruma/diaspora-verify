import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  AlertTriangle, 
  FileCheck2, 
  MapPin, 
  Calendar, 
  ArrowLeft, 
  Download
} from '../Icons';
import { Footer } from './Footer';
import { SAMPLE_DOSSIER } from '../../data/sampleDossierData';
import { useVerification } from '../../context/VerificationContext';

export const SampleReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useVerification();
  const [activeMediaFilter, setActiveMediaFilter] = useState<'all' | 'milestone' | 'materials' | 'telemetry'>('all');

  const filteredMedia = activeMediaFilter === 'all' 
    ? SAMPLE_DOSSIER.media 
    : SAMPLE_DOSSIER.media.filter(m => m.category === activeMediaFilter);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col justify-between text-left">
      <div>
        {/* Prominent Mandatory Spec Notice */}
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold text-center border-b border-amber-600/30 flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-slate-950 shrink-0" />
          <span>This is an illustrative demonstration report, not a real client case. All names, coordinates, and images are for demonstration purposes.</span>
        </div>

        {/* Header Breadcrumb */}
        <div className="bg-slate-50 text-slate-900 py-10 sm:py-14 border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-slate-900">
                  Field Verification & Findings Dossier
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">
                  Standard QA Review Report · Reference: <strong className="text-slate-900 font-mono">{SAMPLE_DOSSIER.referenceId}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print Dossier</span>
                </button>
                <button
                  onClick={() => navigate(currentUser ? '/new-request' : '/contact?type=quote')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Request Similar Audit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Report Content Body */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          
          {/* Executive Overview Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Project Title
                </span>
                <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900">
                  {SAMPLE_DOSSIER.projectTitle}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  {SAMPLE_DOSSIER.overallStatus.label}
                </span>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Location</span>
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>{SAMPLE_DOSSIER.location.town}, {SAMPLE_DOSSIER.location.county}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Visit Date & Time</span>
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>{SAMPLE_DOSSIER.auditDate}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Assigned Verifier</span>
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>{SAMPLE_DOSSIER.verifier.name} (ID #{SAMPLE_DOSSIER.verifier.badgeId})</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">QA Coordinator</span>
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <FileCheck2 className="w-3 h-3 text-blue-600" />
                  <span>{SAMPLE_DOSSIER.qaReviewer.title}</span>
                </div>
              </div>
            </div>

            {/* Scope & Exclusions Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-900">Agreed Scope of Work:</h4>
                <p className="text-slate-600 leading-relaxed">
                  {SAMPLE_DOSSIER.agreedScope}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2">
                <h4 className="font-bold text-rose-950">Explicit Exclusions:</h4>
                <p className="text-rose-900 leading-relaxed">
                  {SAMPLE_DOSSIER.explicitExclusions}
                </p>
              </div>
            </div>
          </div>

          {/* Key Findings in 4 Standard Invariant Categories */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-display text-slate-900">
                  Itemized Verification Findings
                </h3>
                <p className="text-xs text-slate-500">
                  Rigorous categorization strictly enforcing Reference Document standards.
                </p>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                Standard 4-State Schema
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SAMPLE_DOSSIER.findings.map((f) => {
                const borderClass = f.statusBadge === 'observed'
                  ? 'border-emerald-200'
                  : f.statusBadge === 'partly_observed'
                  ? 'border-amber-200'
                  : f.statusBadge === 'cannot_confirm'
                  ? 'border-purple-200'
                  : 'border-rose-200';
                
                const badgeClass = f.statusBadge === 'observed'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : f.statusBadge === 'partly_observed'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : f.statusBadge === 'cannot_confirm'
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200';

                return (
                  <div key={f.id} className={`bg-white rounded-2xl border ${borderClass} p-5 shadow-xs space-y-2.5`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{f.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${badgeClass}`}>
                        {f.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {f.detailedFinding}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Evidence Gallery Preview with Telemetry */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold font-display text-slate-900">
                  Cryptographic Evidence Gallery (4 Records)
                </h3>
                <p className="text-xs text-slate-500">
                  Every image is stamped with GPS telemetry and validated by the HQ dispatch engine.
                </p>
              </div>

              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs">
                {(['all', 'milestone', 'materials', 'telemetry'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveMediaFilter(tab)}
                    className={`px-2.5 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                      activeMediaFilter === tab ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredMedia.map((m) => (
                <div key={m.id} className="rounded-2xl border border-slate-200 overflow-hidden flex flex-col bg-slate-50/50">
                  <div className="relative h-48 bg-slate-800 overflow-hidden">
                    <img 
                      src={m.url} 
                      alt={m.title}
                      width={800}
                      height={400}
                      className="w-full h-full object-cover" 
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
                      {m.timestamp}
                    </div>
                    <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded">
                      GPS: {m.gps}
                    </div>
                  </div>

                  <div className="p-4 space-y-1.5 text-xs flex-1 flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{m.title}</div>
                      <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">{m.desc}</p>
                    </div>
                    <div className="pt-2 text-[10px] text-slate-400 font-mono">
                      Telemetry verified by Nairobi HQ Relay
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contradictions, Discrepancies & Stop-Payment Alert */}
          <div className="p-6 sm:p-8 rounded-3xl bg-rose-50 border-2 border-rose-300 text-xs text-slate-900 space-y-4">
            <div className="flex items-center gap-2 text-rose-950 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>{SAMPLE_DOSSIER.recommendedAction.headline}</span>
            </div>

            <div className="space-y-2 text-slate-800 leading-relaxed">
              <p>
                {SAMPLE_DOSSIER.recommendedAction.fullRecommendation}
              </p>
              <div className="p-3 bg-white/80 rounded-xl border border-rose-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Invoiced Bags</span>
                  <span className="font-bold text-slate-800">{SAMPLE_DOSSIER.cementData.invoicedBags} ({SAMPLE_DOSSIER.cementData.invoiceRef})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Counted In Store</span>
                  <span className="font-bold text-slate-800">{SAMPLE_DOSSIER.cementData.countedInStoreBags} Bags</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Estimated In Lintel</span>
                  <span className="font-bold text-slate-800">~{SAMPLE_DOSSIER.cementData.structurallyEstimatedInLintelBags} Bags</span>
                </div>
                <div>
                  <span className="text-rose-600 block text-[9px] uppercase font-bold">Unexplained Variance</span>
                  <span className="font-bold text-rose-700">{SAMPLE_DOSSIER.cementData.unexplainedVarianceBags} Bags</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-rose-200/80 flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-[11px] text-rose-900 font-bold">
                STOP-PAYMENT ALERT ACTIVE ON MILESTONE 3 (WITHHOLD KES {SAMPLE_DOSSIER.financials.recommendedWithheldKES.toLocaleString()})
              </span>
              <span className="text-[11px] text-slate-500">
                Logged in Audit Trail by HQ Coordinator
              </span>
            </div>
          </div>

          {/* Report Review Sign-Off & Closure Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 text-xs text-slate-600 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Nairobi HQ Quality Assurance Sign-Off</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">
                HASH: {SAMPLE_DOSSIER.cryptographicSeal.dossierDigest.slice(0, 24)}...
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Review Status</span>
                <div className="font-bold text-emerald-800 mt-0.5">{SAMPLE_DOSSIER.qaReviewer.status}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Audit Completed</span>
                <div className="font-bold text-slate-800 mt-0.5">{SAMPLE_DOSSIER.auditCompletedDate}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Client Action Required</span>
                <div className="font-bold text-slate-800 mt-0.5">Disbursement Decision Pending</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
              <p>
                <strong>Cryptographic Integrity Note:</strong> {SAMPLE_DOSSIER.cryptographicSeal.meaning}
              </p>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};
