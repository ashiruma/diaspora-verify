import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Users, 
  Smartphone, 
  FileCheck2, 
  ArrowRight, 
  CheckCircle2, 
  Eye
} from '../Icons';
import { Footer } from './Footer';

export const HowItWorksPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStage, setActiveStage] = useState<number>(1);

  const stages = [
    {
      stage: 1,
      code: 'DEFINE',
      title: 'Stage 1: Define Scope & Feasibility',
      short: 'Define',
      icon: Search,
      summary: 'The client explains the task, location, deadline and desired outcome. The coordinator defines scope, pricing, limitations and deliverables.',
      whatHappens: [
        'You submit an intake brief specifying the county, town, local contact, and target outcome.',
        'A dedicated Nairobi HQ coordinator reviews the request for physical feasibility, legality, and safety within 24 hours.',
        'HQ prepares an itemized quote in KES (or preferred foreign currency) clearly separating service fees from third-party expenses.',
        'Explicit limitations, access boundaries, and deliverable checklists are established before any commitment.'
      ],
      whatCustomerSees: 'An itemized quotation in the Client Portal with explicit deliverable checklists, exclusions, and quote acceptance controls. You can accept, decline, or request scope adjustments.',
      keyPrinciple: 'Submission does not mean acceptance. No field work begins until scope and costs are mutually agreed.'
    },
    {
      stage: 2,
      code: 'ASSIGN',
      title: 'Stage 2: Assign Vetted Agent & Conflict Clearance',
      short: 'Assign',
      icon: Users,
      summary: 'The coordinator selects a suitable vetted person or specialist, checks conflicts of interest, and confirms access or consent.',
      whatHappens: [
        'HQ selects an agent based on verified coverage in the specific county and proven domain category experience.',
        'The agent signs a mandatory Conflict of Interest declaration affirming they have no personal or commercial ties to the target property, contractor, seller, or family members.',
        'Access permissions are confirmed with the local site contact, caretaker, or recipient.',
        'A precise inspection window and safety protocol are logged into dispatch telemetry.'
      ],
      whatCustomerSees: 'A dispatch confirmation notification showing the scheduled inspection window and the assigned verifier\'s operational badge. All contact details remain routed through the HQ Dispatch Relay to prevent collusion.',
      keyPrinciple: 'Strict neutrality. Verifiers never have pre-existing ties to contractors, sellers, or family caretakers.'
    },
    {
      stage: 3,
      code: 'ACT',
      title: 'Stage 3: Act on the Ground & Capture Evidence',
      short: 'Act',
      icon: Smartphone,
      summary: 'The assigned person performs approved work and records relevant dated evidence, observations and uncertainties.',
      whatHappens: [
        'The verifier arrives on site and logs a GPS-verified check-in at the physical coordinates.',
        'Photographs and 360-degree videos are recorded with cryptographic timestamp metadata.',
        'The verifier methodically completes the agreed inspection checklist.',
        'Objective factual observations are recorded, including anything that could NOT be verified (e.g. locked rooms, obscured boundaries, absent caretakers).'
      ],
      whatCustomerSees: 'Live status progression in your Client Portal: Traveling → On Site → Evidence Submitted. Verifiers do not publish raw unreviewed notes directly to clients.',
      keyPrinciple: 'Direct observation only. Verifiers record what is tangibly seen and note what could not be inspected.'
    },
    {
      stage: 4,
      code: 'REVIEW',
      title: 'Stage 4: Quality Review & Contradiction Audit',
      short: 'Review',
      icon: FileCheck2,
      summary: 'The coordinator reviews completeness, inconsistencies, evidence quality and issues requiring escalation.',
      whatHappens: [
        'A Senior QA Coordinator inspects every uploaded photograph, video file, and checklist entry.',
        'Metadata is audited for timestamp coherence and geolocation alignment.',
        'Field observations are cross-examined against contractor claims or seller statements to flag discrepancies.',
        'Findings are classified into our 4 unambiguous standards: Observed, Partly Observed, Not Observed, or Cannot Confirm.',
        'If a critical risk or deception is uncovered, an immediate Stop-Payment alert is prepared.'
      ],
      whatCustomerSees: 'Status shifts to "Report Under Review". Once signed off by QA, the full confidential audit report is released to your secure Client Portal.',
      keyPrinciple: 'Independent editorial control. Reports are vetted for rigor before client publication.'
    },
    {
      stage: 5,
      code: 'DECIDE',
      title: 'Stage 5: Decide, Approve or Follow Up',
      short: 'Decide',
      icon: Eye,
      summary: 'The client receives findings and decides whether to close the task, request follow-up or approve another action.',
      whatHappens: [
        'You log into the Client Portal and review the complete executive summary, photo gallery, and telemetry.',
        'You inspect identified contradictions, expenses incurred, and unverified areas.',
        'You make informed decisions: authorize contractor milestone payments, pause disbursements, negotiate vehicle pricing, or request a secondary follow-up.',
        'The case record is formally archived with an immutable cryptographic evidence hash.'
      ],
      whatCustomerSees: 'The complete digital dossier with download options, high-resolution media galleries, and decision action buttons (Close Task, Request Clarification, or Schedule Follow-through).',
      keyPrinciple: 'Client retains absolute control of decisions and funds. DiasporaVerify provides the verified factual basis.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col justify-between text-left">
      <div>
        {/* Hero Section */}
        <div className="bg-[#172A3A] text-white py-14 sm:py-20 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white max-w-3xl">
              How DiasporaVerify Works: From Request to Objective Evidence.
            </h1>

            <p className="text-sm sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              We do not rely on informal favors or casual promises. Every mission follows a repeatable five-stage operational framework ensuring accountability, client control, and zero conflicts of interest.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('/new-request')}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Request a Service</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/sample-report')}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                View Sample Report ↗
              </button>
            </div>
          </div>
        </div>

        {/* 5-Stage Interactive Framework */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
          
          {/* Stage Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 p-1.5 bg-slate-200/70 rounded-2xl border border-slate-300/80">
            {stages.map((st) => {
              const Icon = st.icon;
              const isActive = activeStage === st.stage;
              return (
                <button
                  key={st.stage}
                  onClick={() => setActiveStage(st.stage)}
                  className={`p-3 rounded-xl text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                    isActive
                      ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <div className="text-[10px] uppercase font-bold text-slate-400 leading-none">
                      Stage {st.stage}
                    </div>
                    <div className="text-xs truncate">{st.short}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Deep-Dive Card */}
          {(() => {
            const current = stages[activeStage - 1];
            const Icon = current.icon;
            return (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-8 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#172A3A] text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 font-mono">
                        Stage {current.stage} of 5 · {current.code}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
                        {current.title}
                      </h2>
                    </div>
                  </div>

                  <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                    Mandatory Standard
                  </span>
                </div>

                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                  {current.summary}
                </p>

                {/* Two Column Layout: What Happens vs What Customer Sees */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      What Happens Behind the Scenes
                    </h3>
                    <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
                      {current.whatHappens.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-6">
                    <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2 text-xs">
                      <h3 className="font-bold text-blue-950 text-sm flex items-center gap-2">
                        <Eye className="w-4 h-4 text-blue-700" />
                        What You See in the Client Portal
                      </h3>
                      <p className="text-slate-700 leading-relaxed">
                        {current.whatCustomerSees}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1.5 text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                        Operational Guarantee
                      </span>
                      <p className="text-slate-800 font-medium leading-relaxed">
                        {current.keyPrinciple}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stage Pagination Controls */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <button
                    disabled={activeStage === 1}
                    onClick={() => setActiveStage(prev => Math.max(1, prev - 1))}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    ← Previous Stage
                  </button>

                  <span className="text-xs text-slate-400 font-mono">
                    Stage {activeStage} / 5
                  </span>

                  <button
                    disabled={activeStage === 5}
                    onClick={() => setActiveStage(prev => Math.min(5, prev + 1))}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Next Stage →
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Trust Comparison Table: Informal vs DiasporaVerify */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-xl font-bold font-display text-slate-900">
                Why a Structured Framework Matters
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Comparing conventional informal approaches against DiasporaVerify's accountable process.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
                    <th className="py-3 px-4 font-bold">Element</th>
                    <th className="py-3 px-4 font-bold text-rose-700 bg-rose-50/50">Informal Family / Friend Request</th>
                    <th className="py-3 px-4 font-bold text-emerald-800 bg-emerald-50/50">DiasporaVerify Standard</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900">Accountability</td>
                    <td className="py-3 px-4 bg-rose-50/20 text-rose-950">Awkward to demand proof; personal relationship tension</td>
                    <td className="py-3 px-4 bg-emerald-50/20 text-emerald-950 font-medium">Professional service with signed brief and QA sign-off</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900">Conflict of Interest</td>
                    <td className="py-3 px-4 bg-rose-50/20 text-rose-950">Unverified ties to builders, sellers, or contractors</td>
                    <td className="py-3 px-4 bg-emerald-50/20 text-emerald-950 font-medium">Mandatory signed Conflict Clearance on every mission</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900">Evidence Quality</td>
                    <td className="py-3 px-4 bg-rose-50/20 text-rose-950">Blurred WhatsApp photos without dates or metadata</td>
                    <td className="py-3 px-4 bg-emerald-50/20 text-emerald-950 font-medium">Cryptographic GPS, date/time telemetry, and 360° video</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900">Honesty on Limits</td>
                    <td className="py-3 px-4 bg-rose-50/20 text-rose-950">Reluctance to deliver bad news or admit unverified items</td>
                    <td className="py-3 px-4 bg-emerald-50/20 text-emerald-950 font-medium">Rigorous 4-state reporting including "Cannot Confirm"</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900">Spending Separation</td>
                    <td className="py-3 px-4 bg-rose-50/20 text-rose-950">Lump-sum transfers mingled with personal expenses</td>
                    <td className="py-3 px-4 bg-emerald-50/20 text-emerald-950 font-medium">Service fees itemized and separated from purchase funds</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Final Call to Action */}
          <div className="p-8 rounded-3xl bg-[#172A3A] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-display">Have a task that needs eyes on the ground?</h3>
              <p className="text-xs text-slate-300">Submit an intake brief. Our coordinators review feasibility without obligation.</p>
            </div>
            <button
              onClick={() => navigate('/new-request')}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-colors cursor-pointer shrink-0"
            >
              Start Your Request →
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
