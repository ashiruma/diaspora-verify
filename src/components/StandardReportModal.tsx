import React from 'react';
import type { VerificationRequest } from '../types';
import { 
  ShieldCheck, 
  Printer, 
  X, 
  AlertTriangle, 
  HelpCircle,
  Award
} from './Icons';
import { StatusBadge } from './CommonBadges';
import { FORMAT_CURRENCY } from '../data/mockData';
import { useVerification } from '../context/VerificationContext';

interface StandardReportModalProps {
  request: VerificationRequest;
  onClose: () => void;
}

export const StandardReportModal: React.FC<StandardReportModalProps> = ({ request, onClose }) => {
  const { currency } = useVerification();

  const handlePrint = () => {
    window.print();
  };

  const pdr = request.paymentDecisionRecord;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Control Bar (Hidden when printing) */}
        <div className="no-print bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              OFFICIAL VERIFICATION REPORT
            </span>
            <span className="text-xs text-slate-400 font-mono">
              #{request.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 bg-white print:p-0 print:overflow-visible">
          
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-6 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 flex items-center justify-center text-white shadow-md">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-black font-display tracking-tight text-slate-950">
                    Diaspora<span className="text-emerald-700">Verify</span>
                  </h1>
                  <p className="text-xs text-slate-500 font-medium tracking-wide">
                    INDEPENDENT GROUND VERIFICATION REGISTER • KENYA
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Report Serial Number</div>
                <div className="font-mono font-bold text-sm text-slate-900">{request.id}</div>
                <div className="text-xs text-slate-500 mt-0.5">Date Issued: {request.updatedAt.substring(0, 10)}</div>
              </div>
            </div>

            {/* Service Brand Promise Stamp */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
              <span className="italic">
                “Your trusted eyes and hands on the ground in Kenya.”
              </span>
              <span className="font-semibold text-slate-800">
                Independent Visit • Named Accountability • Objective Observation
              </span>
            </div>
          </div>

          {/* Section 1: Core Subject & Parties */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div className="space-y-1">
              <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Client (Abroad)</div>
              <div className="font-bold text-slate-900 text-sm">{request.client.name}</div>
              <div className="text-slate-600">{request.client.locationAbroad}</div>
              <div className="text-slate-500 text-[11px]">{request.client.email}</div>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Inspection Location</div>
              <div className="font-bold text-slate-900">{request.location.town}</div>
              <div className="text-slate-600">{request.location.county} County, Kenya</div>
              <div className="font-mono text-[11px] text-emerald-700 font-semibold">{request.location.gpsCoords}</div>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Assigned Field Verifier</div>
              <div className="font-bold text-slate-900">{request.assignedAgent?.name || 'Assigned Officer'}</div>
              <div className="text-slate-600">{request.assignedAgent?.badgeLevel}</div>
              <div className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                <Award className="w-3 h-3" />
                Conflict of Interest Cleared
              </div>
            </div>
          </div>

          {/* Section 2: Verification Status & Summary */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                1. Executive Verification Classification
              </h2>
              <StatusBadge status={request.status} size="lg" />
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-800">Agreed Brief & Scope:</span>
                <p className="text-slate-600 leading-relaxed">{request.scopeBrief}</p>
              </div>

              {request.qaReview && (
                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <span className="font-bold text-slate-800">Coordinator Findings:</span>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {request.qaReview.findingsSummary}
                  </p>

                  {/* Discrepancies & Contradictions */}
                  {request.qaReview.contradictions.length > 0 && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-900 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-rose-800">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span>Identified Contradictions & Discrepancies:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                        {request.qaReview.contradictions.map((contra, i) => (
                          <li key={i}>{contra}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* What Could NOT be verified */}
                  {request.qaReview.whatCouldNotBeVerified.length > 0 && (
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-purple-900 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-purple-800">
                        <HelpCircle className="w-4 h-4 text-purple-600" />
                        <span>What Could NOT Be Verified (Explicit Limitations):</span>
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                        {request.qaReview.whatCouldNotBeVerified.map((unk, i) => (
                          <li key={i}>{unk}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Financial Reconciliations & Milestone Decision */}
          {pdr && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                2. Milestone Payment Audit & Decision Ledger
              </h2>

              <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Financial Item</th>
                      <th className="p-3">Reported / Claimed</th>
                      <th className="p-3">Verified On-Ground</th>
                      <th className="p-3">Variance / Flag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">{pdr.milestoneTitle}</td>
                      <td className="p-3 font-mono">{FORMAT_CURRENCY(pdr.contractorRequestedKES, currency)}</td>
                      <td className="p-3 font-mono text-emerald-700">~{FORMAT_CURRENCY(150000, currency)} (40% complete)</td>
                      <td className="p-3 font-mono font-bold text-rose-600">+{FORMAT_CURRENCY(pdr.unexplainedVarianceKES, currency)} Overbilled</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">Cement & Materials Receipts</td>
                      <td className="p-3 font-mono">120 bags billed</td>
                      <td className="p-3 font-mono">40 bags in store</td>
                      <td className="p-3 font-mono text-rose-600">80 bags missing (~KES 68k)</td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td className="p-3 text-slate-900">Recorded Client Action:</td>
                      <td colSpan={3} className="p-3 uppercase text-emerald-800 font-mono">
                        {pdr.decisionStatus.replace('_', ' ')}
                        {pdr.authorizedAmountKES && ` (KES ${pdr.authorizedAmountKES.toLocaleString()})`}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 4: On-Ground Physical Evidence Gallery */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              3. Date & Geotagged Visual Evidence
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {request.evidence.map((ev) => (
                <div key={ev.id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 space-y-2 p-2">
                  <div className="h-44 rounded-lg overflow-hidden bg-slate-900">
                    <img src={ev.url} alt={ev.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="px-1 text-xs space-y-1">
                    <div className="font-bold text-slate-900">{ev.title}</div>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{ev.description}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                      <span>{ev.timestamp}</span>
                      <span>GPS: {ev.gpsCoords}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Trust Controls & Legal Disclaimer */}
          <div className="border-t-2 border-slate-200 pt-6 space-y-3 text-[11px] text-slate-500">
            <div className="font-bold text-slate-800 uppercase tracking-wider text-xs">
              4. Mandatory Trust Controls & Service Boundaries
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700">Evidence Standard Limitation:</span>
                <p>
                  A photo or video is evidence of what it visually shows at the timestamp recorded, 
                  not legal proof of ownership, soil bearing capacity, structural compression safety, 
                  or mechanical longevity.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700">Financial & Management Independence:</span>
                <p>
                  DiasporaVerify does not hold client construction funds, manage local contractors, or 
                  release funds directly. We maintain strict inspector independence. All payment transactions 
                  are executed directly by the client.
                </p>
              </div>
            </div>

            {/* QA Coordinator Stamp & Signature */}
            <div className="pt-4 flex flex-wrap items-center justify-between border-t border-slate-100 text-xs text-slate-600">
              <div>
                <span className="font-bold text-slate-800">Coordinator Sign-off: </span>
                <span>Amara Kiprotich (Nairobi Operations Desk)</span>
              </div>
              <div className="font-mono text-emerald-800 font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                DIGITALLY STAMPED & VERIFIED
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
