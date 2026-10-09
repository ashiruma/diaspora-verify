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

export const SampleReportPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeMediaFilter, setActiveMediaFilter] = useState<'all' | 'milestone' | 'materials' | 'telemetry'>('all');

  const demoMedia = [
    {
      id: 'm1',
      category: 'milestone',
      title: 'First-Floor Lintel Ring Beam Concrete Cast',
      timestamp: '2026-10-04 11:24:18 EAT',
      gps: '-1.2921, 36.8219 (Accuracy: ±2.8m)',
      status: 'observed',
      desc: 'Formwork struck; reinforced concrete cured and solid. Rebar ties visible and aligned to drawing section C-2.',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'm2',
      category: 'materials',
      title: 'Unused Bamburi Portland Cement Bags in Storage Shed',
      timestamp: '2026-10-04 11:42:05 EAT',
      gps: '-1.2923, 36.8221 (Accuracy: ±3.1m)',
      status: 'partly_observed',
      desc: 'Counted 42 intact bags stacked on dry wooden pallets. Invoiced tally was 100 bags. Remaining 58 bags unaccounted for.',
      url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'm3',
      category: 'milestone',
      title: 'External Perimeter Boundary Wall Demarcation',
      timestamp: '2026-10-04 12:05:40 EAT',
      gps: '-1.2919, 36.8215 (Accuracy: ±2.5m)',
      status: 'observed',
      desc: 'North boundary wall standing at 2.4m height with razor-wire bracket preparations in place. Mortar pointing complete.',
      url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'm4',
      category: 'telemetry',
      title: 'Survey Beacon Demarcation Marker B-4',
      timestamp: '2026-10-04 12:22:15 EAT',
      gps: '-1.2918, 36.8214 (Accuracy: ±1.9m)',
      status: 'cannot_confirm',
      desc: 'Concrete marker obscured by excavated soil mound. Physical boundary peg could not be visually confirmed without excavation.',
      url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const filteredMedia = activeMediaFilter === 'all' 
    ? demoMedia 
    : demoMedia.filter(m => m.category === activeMediaFilter);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col justify-between text-left">
      <div>
        {/* Prominent Mandatory Spec Notice */}
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold text-center border-b border-amber-600/30 flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-slate-950 shrink-0" />
          <span>This is an illustrative demonstration report, not a real client case. All names, coordinates, and images are for demonstration purposes.</span>
        </div>

        {/* Header Breadcrumb */}
        <div className="bg-[#172A3A] text-white py-10 sm:py-14 border-b border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-white">
                  Field Verification & Findings Dossier
                </h1>
                <p className="text-xs sm:text-sm text-slate-300">
                  Standard QA Review Report · Reference: <strong className="text-white font-mono">DV-DEMO-2026-NBI</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print Dossier</span>
                </button>
                <button
                  onClick={() => navigate('/new-request')}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
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
                  Kitengela Residential Villa — Milestone 3 (Lintel Beam & Cement Stock)
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  PARTLY VERIFIED / CAUTION
                </span>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Location</span>
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>Kitengela, Kajiado</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Visit Date & Time</span>
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>04 Oct 2026, 11:15 EAT</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Assigned Verifier</span>
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Evans K. (ID #AGT-0104)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">QA Coordinator</span>
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <FileCheck2 className="w-3 h-3 text-blue-600" />
                  <span>Nairobi HQ Lead Reviewer</span>
                </div>
              </div>
            </div>

            {/* Scope & Exclusions Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-900">Agreed Scope of Work:</h4>
                <p className="text-slate-600 leading-relaxed">
                  Verify completion of first-floor lintel ring beam casting. Confirm physical delivery of 100 bags of Portland cement billed under invoice INV-482. Inspect north boundary wall construction.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2">
                <h4 className="font-bold text-rose-950">Explicit Exclusions:</h4>
                <p className="text-rose-900 leading-relaxed">
                  Laboratory core testing of concrete compressive strength (requires licensed materials lab). Mediation of contractor wage dispute. Structural engineering certification.
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
              
              {/* Item 1: Observed */}
              <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">Lintel Ring Beam Casting</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Observed
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ring beam is physically in place across all external walls. Concrete cured with no visible honeycomb voids. Rebar tie-ins observed according to milestone plan.
                </p>
              </div>

              {/* Item 2: Partly Observed */}
              <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">Cement Delivery (100 Bags Billed)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                    Partly Observed
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Only 42 bags found in storage. Contractor claimed 58 bags were already mixed; however, volume calculations for the lintel beam indicate only ~25 bags utilized. 33 bags discrepancy.
                </p>
              </div>

              {/* Item 3: Observed */}
              <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">North Boundary Demarcation Wall</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Observed
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Perimeter masonry standing at 2.4 meters as agreed. Mortar pointing complete and foundation beam backfilled.
                </p>
              </div>

              {/* Item 4: Cannot Confirm */}
              <div className="bg-white rounded-2xl border border-purple-200 p-5 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">Survey Beacon B-4 Alignment</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                    Cannot Confirm
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Beacon peg buried under 1.5m excavated trench mound. Verifier did not have authorization or equipment to excavate without disturbing neighboring foundation.
                </p>
              </div>

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
              <span>Contradictions & Recommended Financial Action</span>
            </div>

            <div className="space-y-2 text-slate-800 leading-relaxed">
              <p>
                <strong>Critical Material Discrepancy:</strong> Contractor requested approval of <strong>KES 185,000</strong> for Milestone 3 completion and cement restocking. However, our physical on-ground count identified only 42 bags of the 100 bags billed under invoice INV-482.
              </p>
              <p>
                <strong>Coordinator Recommendation:</strong> We advise <strong>pausing the KES 185,000 disbursement</strong>. Authorize payment only for the verified lintel labor portion (KES 45,000), withholding cement funds until the contractor produces physical supplier delivery receipts signed by the site foreman.
              </p>
            </div>

            <div className="pt-3 border-t border-rose-200/80 flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-[11px] text-rose-900 font-bold">
                STOP-PAYMENT ALERT ACTIVE ON MILESTONE 3
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
                HASH: sha256:7f83b165...a90b
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Review Status</span>
                <div className="font-bold text-emerald-800 mt-0.5">Approved & Published to Client</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Audit Completed</span>
                <div className="font-bold text-slate-800 mt-0.5">04 Oct 2026, 16:30 EAT</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Client Action Required</span>
                <div className="font-bold text-slate-800 mt-0.5">Disbursement Decision Pending</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};
