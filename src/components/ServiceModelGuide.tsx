import React from 'react';
import { 
  ShieldCheck, 
  Building, 
  MapPin, 
  Car, 
  Briefcase, 
  Heart, 
  Compass,
  ArrowLeft
} from './Icons';

export const ServiceModelGuide: React.FC<{ onBookNow: () => void; onBack?: () => void }> = ({ onBookNow, onBack }) => {
  return (
    <div className="space-y-10 max-w-5xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Hero Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            <span>Official Operational Doctrine</span>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Back</span>
            </button>
          )}
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-white">
          DiasporaVerify Service Model & Trust Controls
        </h1>
        <p className="text-slate-300 text-sm sm:base leading-relaxed max-w-3xl">
          Based on the 29 September 2026 Service Model & Construction Oversight Pilot specifications. 
          DiasporaVerify helps a person abroad find out what is happening in Kenya, coordinate a local task, 
          and make an informed decision from evidence.
        </p>
      </div>

      {/* 1. The Promise & Customer */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Section 1</span>
          <h2 className="text-xl font-bold font-display text-slate-900 mt-0.5">The Promise and the Customer</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">Core Brand Promise</h3>
            <p className="italic text-slate-800 font-medium">
              “Your trusted eyes and hands on the ground in Kenya.”
            </p>
            <p>
              The client can ask us to check, follow up, coordinate or monitor an agreed matter 
              when they cannot be there themselves. Trust rests on an independent visit or documented action, 
              clear limits, named accountability and honest reporting of what could NOT be confirmed.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">The SNAP Story & Dilemma</h3>
            <p>
              An illustrative client sends money for a building project and receives reassuring messages. 
              Months later, little has been completed. Another client faces the same gap when a parent 
              needs care, a vehicle needs repairs, or a farm manager asks for more funds: they cannot 
              see the situation firsthand.
            </p>
          </div>
        </div>

        {/* Customer Opener */}
        <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-xs text-emerald-950 space-y-2">
          <span className="font-bold uppercase tracking-wider text-[11px] text-emerald-800">
            Official Customer Opener (30-Day Validation Standard)
          </span>
          <p className="text-sm font-medium leading-relaxed italic">
            “Living abroad should not mean relying on guesswork for everything happening back home. 
            Tell us what you need checked or handled in Kenya. We will agree on the scope, assign the 
            right person on the ground, keep you updated and give you clear evidence and next steps. 
            Whether it is a property, a farm, a vehicle, a business or a family matter, you remain in control of the decision.”
          </p>
        </div>
      </section>

      {/* 2. Service Portfolio & Strict Boundaries */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Section 2</span>
          <h2 className="text-xl font-bold font-display text-slate-900 mt-0.5">Service Portfolio & Legal Boundaries</h2>
          <p className="text-xs text-slate-500 mt-1">
            The breadth is a demand opportunity and an operations risk. A general field agent should NOT be presented as a nurse, engineer, mechanic, lawyer or auditor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-emerald-600" />
              <span>Projects & Assets (Construction)</span>
            </div>
            <p className="text-slate-600">
              Observe and track physical milestones; side-by-side repeat angle photos.
            </p>
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium">
              Boundary: Do not certify structural integrity without a registered engineer.
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Purchases & Land</span>
            </div>
            <p className="text-slate-600">
              Inspect existence, beacons, visible condition, and neighbor inquiries.
            </p>
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium">
              Boundary: Physical check only; refer legal title search to licensed conveyancers.
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-amber-600" />
              <span>Vehicles & Equipment</span>
            </div>
            <p className="text-slate-600">
              Inspect physical condition, paint gauge filler readings, VIN chassis match.
            </p>
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium">
              Boundary: Visual and gauge test; statutory logbook logging through NTSA.
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-purple-600" />
              <span>Business & Farming</span>
            </div>
            <p className="text-slate-600">
              Visit premises, count stock/fertilizer, check irrigation infrastructure.
            </p>
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium">
              Boundary: Reconcile supplied records; do not imply a statutory audit.
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-600" />
              <span>Family Welfare & Care</span>
            </div>
            <p className="text-slate-600">
              Welfare visits, caregiver attendance log checks, clinic accompaniment.
            </p>
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium">
              Boundary: Safeguarding consent mandatory; clinical care by licensed providers only.
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-slate-600" />
              <span>Custom Verification</span>
            </div>
            <p className="text-slate-600">
              Lawful local verification, collection, attendance or coordination.
            </p>
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium">
              Boundary: Accept only after written scope, safe access, and risk plan.
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 5-Step Repeatable Request Process */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Section 3</span>
          <h2 className="text-xl font-bold font-display text-slate-900 mt-0.5">The 5-Step Repeatable Request Process</h2>
        </div>

        <div className="space-y-3 text-xs">
          {[
            {
              step: 'Step 1: DEFINE',
              clientAction: 'Client states decision/task, location, deadline, contacts, access, documents.',
              coordAction: 'Coordinator confirms what can be done and by whom.',
              clientSees: 'Scope, price, timing, deliverables, and explicit limitations.'
            },
            {
              step: 'Step 2: ASSIGN',
              clientAction: 'Client accepts quote and authorizes assignment.',
              coordAction: 'Coordinator selects vetted field agent, checks conflicts of interest, obtains access/consent.',
              clientSees: 'Named responsible person, scheduled visit date, and conflict disclosure.'
            },
            {
              step: 'Step 3: ACT',
              clientAction: 'Client tracks progress notifications.',
              coordAction: 'Assigned agent visits, observes, asks agreed questions, captures dated photos/video, records uncertainty.',
              clientSees: 'Live progress update, timestamped photos, checklist status.'
            },
            {
              step: 'Step 4: REVIEW',
              clientAction: 'Client awaits QA sign-off.',
              coordAction: 'Coordinator checks completeness, contradictions, flags overbilling, escalates to specialist if needed.',
              clientSees: 'Objective findings, unanswered questions, what could NOT be verified.'
            },
            {
              step: 'Step 5: DECIDE',
              clientAction: 'Client approves next action, requests follow-up, releases funds directly, or closes task.',
              coordAction: 'Coordinator archives record and sets up recurring check if on monthly plan.',
              clientSees: 'Final standard report, Payment Decision Record, and next steps.'
            }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">
                  {idx + 1}
                </span>
                <span>{item.step}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1">
                <div>
                  <span className="font-bold text-slate-700">Client Action:</span>
                  <p className="text-slate-600 mt-0.5">{item.clientAction}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Coordinator / Verifier Action:</span>
                  <p className="text-slate-600 mt-0.5">{item.coordAction}</p>
                </div>
                <div>
                  <span className="font-bold text-emerald-800">Client Receives / Sees:</span>
                  <p className="text-slate-700 font-medium mt-0.5">{item.clientSees}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Trust Controls & Verification Classifications */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Section 4 & 5</span>
          <h2 className="text-xl font-bold font-display text-slate-900 mt-0.5">Trust Controls & Verification Classifications</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 space-y-1">
            <span className="font-bold text-emerald-950 uppercase text-[11px]">1. Observed</span>
            <p className="text-emerald-900/90 text-[11px]">
              Direct physical visual confirmation matching claimed scope and specifications.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50 space-y-1">
            <span className="font-bold text-amber-950 uppercase text-[11px]">2. Partly Observed</span>
            <p className="text-amber-900/90 text-[11px]">
              Work or materials partially present, but trailing invoice claims or missing quantities.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-rose-300 bg-rose-50 space-y-1">
            <span className="font-bold text-rose-950 uppercase text-[11px]">3. Not Observed</span>
            <p className="text-rose-900/90 text-[11px]">
              Claimed item, fence, work, or asset was completely absent from physical location.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-purple-300 bg-purple-50 space-y-1">
            <span className="font-bold text-purple-950 uppercase text-[11px]">4. Cannot Confirm</span>
            <p className="text-purple-900/90 text-[11px]">
              Boundary dispute, access refusal, buried foundation, or requiring licensed specialist.
            </p>
          </div>
        </div>

        {/* Fundamental Trust Disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs space-y-2">
          <div className="font-bold text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>The Fundamental Evidence Standard:</span>
          </div>
          <p className="text-slate-300 leading-relaxed italic text-sm">
            “A photo is evidence of what it shows at the moment it was taken, not proof of ownership, 
            quality, structural safety, or final completion.”
          </p>
        </div>
      </section>

      {/* CTA Footer */}
      <div className="text-center pt-4">
        <button
          onClick={onBookNow}
          className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-700/25 transition-all hover:scale-105"
        >
          Book Your First Ground Verification in Kenya
        </button>
      </div>

    </div>
  );
};
