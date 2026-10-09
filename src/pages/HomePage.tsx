"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  Check,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { useVerification } from "../context/VerificationContext";
import type { CurrencyCode } from "../types";
import { MASTER_SERVICES } from "../data/servicesData";
import { Footer } from "../components/Public/Footer";

export interface HomePageProps {
  onGetStarted?: () => void;
  onViewServices?: () => void;
  onViewLegal?: () => void;
  currency?: CurrencyCode;
}

export function HomePage({
  onGetStarted,
  onViewServices,
  onViewLegal,
}: HomePageProps = {}) {
  const navigate = useNavigate();
  const { currentUser } = useVerification();
  const isAdmin = currentUser?.role === "admin";
  const isClient = currentUser?.role === "client";

  // Smooth scroll support when navigating via hashes (e.g. #how-it-works)
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 150);
      }
    }
  }, []);

  const handleLegal = () => {
    if (onViewLegal) {
      onViewLegal();
    } else {
      navigate("/legal");
    }
  };

  const handleStart = () => {
    if (onGetStarted) {
      onGetStarted();
    } else if (isAdmin) {
      navigate("/admin");
    } else if (isClient) {
      navigate("/dashboard");
    } else {
      navigate("/new-request");
    }
  };

  const handleServices = (categorySlug?: string) => {
    if (categorySlug) {
      navigate(`/services/${categorySlug}`);
    } else if (onViewServices) {
      onViewServices();
    } else {
      navigate("/services");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#07152f] flex flex-col justify-between text-left font-sans">
      <div>
        {/* =========================================================
            1 & 2. HERO SECTION
            Strict Spec: "Your trusted eyes and hands on the ground in Kenya."
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#172A3A]">
          {/* Subtle background ambient blur */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />
            <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
                backgroundSize: "50px 50px",
              }}
            />
          </div>

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:grid-cols-[1.1fr_.9fr]">
            {/* LEFT COLUMN: HERO HEADLINE & CORE PROMISE */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-emerald-300">
                <ShieldCheck className="h-4 w-4" />
                Nairobi Pilot Foundation · Independent Ground Observation
              </div>

              <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl font-display">
                Your trusted eyes and hands on the ground in Kenya.
              </h1>

              <p className="text-base sm:text-lg leading-relaxed text-slate-300 max-w-2xl">
                Living abroad should not mean relying on guesswork before sending money. We provide independent on-ground visits, documented checks against an agreed brief, dated photographs and video telemetry, and objective findings so you remain in full control of decisions.
              </p>

              {/* PRIMARY & SECONDARY CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:items-center">
                {isAdmin ? (
                  <>
                    <button
                      onClick={() => navigate("/admin")}
                      className="flex h-12 sm:h-14 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 sm:px-8 text-sm sm:text-base font-bold text-[#061329] shadow-lg transition hover:bg-emerald-400 cursor-pointer"
                    >
                      Go to Operations Desk
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => navigate("/cockpit")}
                      className="flex h-12 sm:h-14 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-6 text-sm sm:text-base font-semibold text-white backdrop-blur transition hover:bg-white/10 cursor-pointer"
                    >
                      Financial Cockpit ↗
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleStart}
                      className="flex h-12 sm:h-14 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 sm:px-8 text-sm sm:text-base font-bold text-[#061329] shadow-lg transition hover:bg-emerald-400 cursor-pointer"
                    >
                      Request a Service
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => navigate("/how-it-works")}
                      className="flex h-12 sm:h-14 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-6 text-sm sm:text-base font-semibold text-white backdrop-blur transition hover:bg-white/10 cursor-pointer"
                    >
                      How It Works
                    </button>
                  </>
                )}
              </div>

              {/* CORE PROMISE HIGHLIGHTS */}
              <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-4 text-xs text-slate-300">
                <div>
                  <div className="text-lg font-bold font-mono text-emerald-400">Defined</div>
                  <div className="text-[11px] text-slate-400">Agreed scope & fee</div>
                </div>
                <div>
                  <div className="text-lg font-bold font-mono text-emerald-400">Neutral</div>
                  <div className="text-[11px] text-slate-400">Conflict clearance</div>
                </div>
                <div>
                  <div className="text-lg font-bold font-mono text-emerald-400">Control</div>
                  <div className="text-[11px] text-slate-400">Client retains decisions</div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: SAMPLE REPORT SUMMARY CARD */}
            <div className="relative mx-auto w-full max-w-[480px]">
              <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white p-6 sm:p-7 shadow-2xl text-slate-900 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      ILLUSTRATIVE AUDIT DOSSIER
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                    DV-DEMO-2026-NBI
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    Construction & Material Stock Check
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Kitengela, Kajiado · Milestone 3</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-600 font-medium">Lintel Ring Beam Casting:</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Observed
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="text-slate-700 font-medium">100 Cement Bags Invoiced:</span>
                    <span className="font-bold text-amber-800 bg-white px-2 py-0.5 rounded border border-amber-300">
                      Partly Observed (42 Bags)
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Recommended Client Action:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Pause KES 185,000 disbursement until contractor reconciles 58 missing bags.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <button
                    onClick={() => navigate("/sample-report")}
                    className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Inspect Full Demonstration Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-slate-400">QA Signed Off</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            3. SUPPORTING COPY & CUSTOMER PROBLEM
        ========================================================= */}
        <section className="bg-white py-16 sm:py-20 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono">
                THE CUSTOMER PROBLEM
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-display text-slate-900 tracking-tight">
                Distance should not mean reliance on unverified reassurance.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                When living abroad, asking relatives or contractors for updates often produces reassuring messages rather than objective facts. Months later, foundations remain unpoured, vehicles are not in the condition described, or family care remains uncoordinated.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium text-slate-800">
                DiasporaVerify eliminates the guesswork. We agree on the scope, assign the right vetted person on the ground, verify their neutrality, keep you updated, and provide structured evidence and recommended next steps.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================
            6. HOW IT WORKS OVERVIEW (5 STAGES)
        ========================================================= */}
        <section id="how-it-works" className="bg-[#f8fafc] py-16 sm:py-20 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono">
                  OUR REPEATABLE PROCESS
                </span>
                <h2 className="text-2xl sm:text-4xl font-bold font-display text-slate-900 mt-1">
                  How Every Mission Is Handled
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  A structured five-stage framework ensuring complete client control and transparency.
                </p>
              </div>

              <button
                onClick={() => navigate("/how-it-works")}
                className="text-xs font-bold text-slate-900 hover:text-emerald-700 flex items-center gap-1 transition-colors self-start sm:self-auto"
              >
                <span>Read Full Stage Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                {
                  step: 1,
                  title: "Define",
                  desc: "You explain the task, location, and deadline. HQ defines scope, pricing, limitations, and deliverables."
                },
                {
                  step: 2,
                  title: "Assign",
                  desc: "HQ selects a vetted local verifier, checks conflicts of interest, and confirms access or consent."
                },
                {
                  step: 3,
                  title: "Act",
                  desc: "Assigned person visits site, documents agreed checks, and captures dated photo and video evidence."
                },
                {
                  step: 4,
                  title: "Review",
                  desc: "Coordinator inspects completeness, audits contradictions, and verifies evidence quality."
                },
                {
                  step: 5,
                  title: "Decide",
                  desc: "You receive findings and decide whether to close the task, request follow-up, or authorize funds."
                }
              ].map((st) => (
                <div key={st.step} className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-2 shadow-xs text-xs">
                  <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                    Stage 0{st.step}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">{st.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-[11px]">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            7. FIVE SERVICE CATEGORY CARDS
        ========================================================= */}
        <section id="services" className="bg-white py-16 sm:py-20 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono">
                  FIVE MASTER CATEGORIES
                </span>
                <h2 className="text-2xl sm:text-4xl font-bold font-display text-slate-900 mt-1">
                  What We Verify on the Ground
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                  Each service category has an agreed scope, explicit exclusions, and verified deliverable checklists.
                </p>
              </div>

              <button
                onClick={() => navigate("/services")}
                className="text-xs font-bold text-slate-900 hover:text-emerald-700 flex items-center gap-1 transition-colors self-start sm:self-auto"
              >
                <span>View All Category Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MASTER_SERVICES.map((srv) => (
                <div 
                  key={srv.id}
                  className="rounded-3xl border border-slate-200/90 bg-[#f8fafc] p-6 space-y-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        CAT-{srv.slug.slice(0, 3).toUpperCase()}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Pilot Active
                      </span>
                    </div>

                    <h3 className="text-lg font-bold font-display text-slate-900">
                      {srv.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {srv.shortDescription}
                    </p>

                    <ul className="space-y-1.5 pt-2 border-t border-slate-200 text-xs text-slate-700">
                      {srv.useCases.slice(0, 2).map((uc, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{uc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleServices(srv.slug)}
                      className="text-xs font-bold text-slate-800 hover:text-emerald-700 transition-colors cursor-pointer"
                    >
                      Scope & Details →
                    </button>

                    <button
                      onClick={() => navigate(`/new-request?category=${srv.slug}`)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                    >
                      Request Quote
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            8. TRUST & ACCOUNTABILITY SECTION
        ========================================================= */}
        <section className="bg-[#172A3A] text-white py-16 sm:py-20 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                ACCOUNTABILITY BY DESIGN
              </span>
              <h2 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-white">
                Built Around Integrity, Not Informal Favors.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Trust rests on independent observation, clear limitations, named accountability, and honest reporting of what could not be confirmed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-slate-300">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">Conflict Clearance</h3>
                <p className="leading-relaxed text-slate-400">
                  Every verifier signs a binding declaration confirming zero personal or commercial ties to the contractor, seller, or family caretakers.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <Lock className="w-6 h-6 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">Anti-Collusion Relay</h3>
                <p className="leading-relaxed text-slate-400">
                  Clients and agents never exchange private phone numbers. All communication and instructions flow securely through the HQ Dispatch Relay.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <Camera className="w-6 h-6 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">Cryptographic Proof</h3>
                <p className="leading-relaxed text-slate-400">
                  Photographs and 360-degree videos include validated GPS coordinate stamps, UTC timestamps, and tamper-evident SHA-256 evidence hashes.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <Check className="w-6 h-6 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">Client Control</h3>
                <p className="leading-relaxed text-slate-400">
                  Service fees are itemized and strictly separated from third-party purchase monies. We never disburse funds without explicit client sign-off.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800 text-xs text-slate-400">
              <span>Governed by the Kenya Data Protection Act (DPA 2019) and strict QA mandates.</span>
              <button
                onClick={handleLegal}
                className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
              >
                Read Legal & Operating Framework →
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================
            9. SAMPLE REPORT PREVIEW SECTION
        ========================================================= */}
        <section className="bg-white py-16 sm:py-20 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-xl">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block">
                  TRANSPARENCY STANDARD
                </span>
                <h3 className="text-xl sm:text-3xl font-bold font-display text-slate-900">
                  Inspect Our Demonstration Report Dossier
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  See exactly how findings, material counts, unverified items, photographic telemetry, and QA recommendations are presented before committing to a service.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <button
                  onClick={() => navigate("/sample-report")}
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  View Sample Report ↗
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            10. FREQUENTLY ASKED QUESTIONS
        ========================================================= */}
        <section className="bg-[#f8fafc] py-16 sm:py-20 border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono">
                QUESTIONS & ANSWERS
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-display text-slate-900">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Clear policies on feasibility, turnaround, pricing, and boundaries.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {[
                {
                  q: "Does submitting a request guarantee you will accept it?",
                  a: "No. Every request undergoes a feasibility, legality, and safety review by our Nairobi Operations Desk. If access cannot be secured, if the task violates Kenyan law, or if the risk profile is unacceptable, we decline the task with an explanation."
                },
                {
                  q: "Do you offer fixed flat prices across all of Kenya?",
                  a: "No. We do not publish unvalidated fixed prices. Costs depend on location distance, county access logistics, complexity, and specialist requirements. You receive an itemized quote in KES (or preferred currency) before any commitment."
                },
                {
                  q: "What geographic areas do you currently cover?",
                  a: "Our pilot foundation operates within the Nairobi Metropolitan Hub (Nairobi, Kiambu, Machakos, Kajiado), with phased expansion into secondary regional hubs based on validated demand and vetted agent availability."
                },
                {
                  q: "Can DiasporaVerify hold purchase funds or wire money to sellers?",
                  a: "No. We strictly separate verification service fees from third-party purchase monies. We do not act as an escrow agent or wallet service. We provide independent observation so you can execute transactions securely through your own bank."
                },
                {
                  q: "Can your verifiers provide structural engineering warranties or legal certification?",
                  a: "No. Our field agents are trained observers, not structural engineers or advocates. We document tangible progress against your brief. Statutory certifications must be completed by certified professionals under dedicated appointments."
                }
              ].map((faq, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-1.5 shadow-2xs">
                  <h4 className="font-bold text-slate-900 text-sm">{faq.q}</h4>
                  <p className="text-slate-600 leading-relaxed text-xs">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            11. FINAL CONVERSION SECTION
        ========================================================= */}
        <section className="bg-[#172A3A] text-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-white">
              Ready to verify what's happening on the ground?
            </h2>
            <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Submit your request details without obligation. A Nairobi coordinator will review feasibility, establish clear boundaries, and provide an itemized quote within 24 hours.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleStart}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg transition-colors cursor-pointer"
              >
                Request a Service Now →
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-white/20 hover:bg-white/10 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Speak with a Coordinator
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* =========================================================
          12. SHARED CANONICAL FOOTER
      ========================================================= */}
      <Footer />
    </div>
  );
}

export default HomePage;
