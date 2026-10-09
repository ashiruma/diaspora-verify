import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  AlertTriangle 
} from '../Icons';
import { Footer } from './Footer';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col justify-between text-left">
      <div>
        {/* Hero Section */}
        <div className="bg-[#172A3A] text-white py-14 sm:py-20 border-b border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>About DiasporaVerify</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white max-w-3xl">
              Your trusted eyes and hands on the ground in Kenya.
            </h1>

            <p className="text-sm sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              We connect people living abroad with accountable, independent local observation so you never have to make major financial or family decisions based on guesswork.
            </p>
          </div>
        </div>

        {/* Core Principles & Mission */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
          
          {/* Mission & Problem Statement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 font-mono">
                  OUR PURPOSE
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
                  The Problem We Solve
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  People living in the UK, United States, Canada, Europe, Australia, and the Gulf routinely invest in property, fund construction projects, coordinate family welfare, or run businesses back home in Kenya.
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Yet distance creates an acute vulnerability: informal WhatsApp updates, contractor reassurances, and casual photos cannot substitute for objective, verifiable truth. Before wiring another tranche of money, you need someone independent on the ground.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
                Operating from our Nairobi Operations Desk with a controlled Kenya pilot.
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                  OUR PROMISE
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                  The DiasporaVerify Core Promise
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  “Your trusted eyes and hands on the ground in Kenya.”
                </p>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  We provide documented checks against an agreed brief, dated photographs and video telemetry, transparent fees, and honest reporting of what could—and could not—be verified.
                </p>
                <p className="text-xs sm:text-sm text-emerald-300 font-medium">
                  Crucially, you retain 100% control over decisions and spending.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero financial conflict of interest guaranteed.</span>
              </div>
            </div>
          </div>

          {/* Five Core Operational Principles */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                OPERATIONAL DOCTRINE
              </span>
              <h2 className="text-2xl font-bold font-display text-slate-900 mt-1">
                Five Principles That Govern Every Mission
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                These principles guide our coordinators, field verifiers, and quality reviews.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Independence & Neutrality</h3>
                <p className="text-slate-600 leading-relaxed">
                  Our verifiers have no personal or commercial interest in your project, contractor, or seller. Every verifier signs a binding Conflict of Interest clearance prior to assignment.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Documented Evidence</h3>
                <p className="text-slate-600 leading-relaxed">
                  We do not rely on impressions or verbal claims. Every observation is supported by date-, time-, and GPS-stamped photographs, 360-degree video, and physical checklists.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Absolute Transparency</h3>
                <p className="text-slate-600 leading-relaxed">
                  We report what is confirmed, what is partially observed, and what could NOT be confirmed. If a room is locked or a beacon buried, we state it plainly without sugarcoating.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  4
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Client Control</h3>
                <p className="text-slate-600 leading-relaxed">
                  We provide the verified factual basis; you make the decision. We never disburse purchase funds on your behalf, sign contractor waivers, or make commitments without your explicit approval.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                  5
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Named Accountability</h3>
                <p className="text-slate-600 leading-relaxed">
                  Every accepted task has a unique tracking reference, a designated coordinator, a vetted verifier, and a written closure record signed off by quality assurance.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center font-bold">
                  6
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Anti-Collusion Safeguarding</h3>
                <p className="text-slate-600 leading-relaxed">
                  Field agents never receive client phone numbers or email addresses; clients communicate through HQ dispatch relay. This prevents off-platform extortion or kickbacks.
                </p>
              </div>

            </div>
          </div>

          {/* Scope Limitations & Legal Boundaries */}
          <div className="p-6 sm:p-8 rounded-3xl bg-amber-500/10 border border-amber-300 text-xs text-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
              <span>Explicit Scope Limitations & Boundaries</span>
            </div>
            <p className="leading-relaxed">
              To preserve integrity and safety, DiasporaVerify maintains strict service boundaries:
            </p>
            <ul className="space-y-1.5 list-disc list-inside text-slate-700">
              <li>We are <strong>not structural engineers</strong>: our field agents document physical progress against your drawings, but do not issue statutory structural warranty certificates.</li>
              <li>We are <strong>not legal advocates</strong>: we observe physical premises and land markers, but do not provide legal title conveyance or dispute litigation.</li>
              <li>We are <strong>not clinical nurses or emergency rescue</strong>: family support visits are respectful welfare observations conducted with consent; emergencies must be routed to official healthcare channels.</li>
              <li>We are <strong>not private investigators</strong>: we do not accept covert surveillance, matrimonial espionage, or unlawful tracking.</li>
            </ul>
          </div>

          {/* Contact Details & Operations Desk */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold font-display text-slate-900">
                Have questions about our operational model?
              </h3>
              <p className="text-xs text-slate-500">
                Our Nairobi coordinators are available to discuss task feasibility, pilot coverage, and custom requirements.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-emerald-700">
                <span>Email: info@diasporaverify.co.ke</span>
                <span>·</span>
                <span>Nairobi HQ, Kenya</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/contact')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors cursor-pointer shrink-0"
            >
              Contact Our Desk →
            </button>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};
