"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Check,
  MapPin,
  AlertTriangle,
  Lock,
  Camera,
  Building2,
  Car,
  Briefcase,
  HeartHandshake,
  Compass,
  FileText,
  UserCheck,
  CheckCircle2,
  XCircle,
  Shield,
  ChevronDown,
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
  const isAgent = currentUser?.role === "agent";

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Smooth scroll support when navigating via hashes (e.g. #how-it-works, #services)
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
    } else if (isAgent) {
      navigate("/agent");
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

  // Helper to dynamically render category icons
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Building2":
        return <Building2 className="w-5 h-5 text-emerald-600" />;
      case "Car":
        return <Car className="w-5 h-5 text-emerald-600" />;
      case "Briefcase":
        return <Briefcase className="w-5 h-5 text-emerald-600" />;
      case "HeartHandshake":
        return <HeartHandshake className="w-5 h-5 text-emerald-600" />;
      default:
        return <Compass className="w-5 h-5 text-emerald-600" />;
    }
  };

  const faqs = [
    {
      q: "Does submitting a request guarantee you will accept it?",
      a: "No. Every request undergoes a formal feasibility, legality, and safety review by our Nairobi Operations Desk. If physical access cannot be secured lawfully, if the task violates Kenyan law, or if the risk profile is unacceptable, we decline the assignment with an honest written explanation."
    },
    {
      q: "Do you offer fixed flat prices across all of Kenya?",
      a: "No. We do not publish unvalidated flat prices. Service costs reflect location logistics, county distance, complexity, and specialist observation requirements. You receive a fully itemized quote in KES (or your preferred currency) before committing or making any payment."
    },
    {
      q: "What geographic areas do you currently cover?",
      a: "Our pilot foundation operates within the Nairobi Metropolitan Hub (Nairobi, Kiambu, Machakos, and Kajiado counties), with disciplined phased expansion into secondary regional hubs based on validated demand and verified operative availability."
    },
    {
      q: "Can DiasporaVerify hold purchase funds or wire money to sellers?",
      a: "No. We strictly separate verification service fees from third-party purchase monies. We do not act as an escrow agent, escrow wallet, or money transmitter. We provide independent observation so you can execute transactions securely through your own bank or direct channels."
    },
    {
      q: "Can your verifiers provide structural engineering warranties or legal certification?",
      a: "No. Our field agents are trained, objective observers, not structural engineers or advocates. We document tangible progress against your agreed brief. Statutory structural certifications or title conveyance must be performed by certified licensed professionals under separate appointments."
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#07152f] flex flex-col justify-between text-left font-sans antialiased selection:bg-emerald-500 selection:text-white">
      <div>
        {/* =========================================================
            1. HERO SECTION (Spacious Two-Column Architecture)
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#172A3A] text-white">
          {/* Subtle Ambient Depth Lighting */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-40 -top-40 h-[580px] w-[580px] rounded-full bg-emerald-500/10 blur-[130px]" />
            <div className="absolute -right-40 bottom-0 h-[580px] w-[580px] rounded-full bg-blue-500/10 blur-[130px]" />
            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
              {/* LEFT COLUMN: Strategic Value Proposition */}
              <div className="lg:col-span-7 space-y-6 sm:space-y-7">
                {/* Primary Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black leading-[1.08] tracking-tight text-white font-display">
                  Your trusted eyes and hands on the ground in Kenya.
                </h1>

                {/* Supporting Paragraph */}
                <p className="text-base sm:text-lg leading-relaxed text-slate-300 max-w-2xl font-normal">
                  Living abroad should not mean relying on guesswork before sending money. We provide independent on-ground visits, documented checks against an agreed brief, dated photographs and video telemetry, and objective findings so you remain in full control of decisions.
                </p>

                {/* Clear Calls to Action */}
                <div className="flex flex-col sm:flex-row gap-3.5 sm:items-center pt-2">
                  <button
                    onClick={handleStart}
                    className="flex h-13 sm:h-14 items-center justify-center gap-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-8 text-base font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:translate-y-[-1px] cursor-pointer"
                  >
                    <span>Request Verification</span>
                    <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                  </button>

                  <button
                    onClick={() => {
                      const el = document.getElementById("services");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                      } else {
                        navigate("/services");
                      }
                    }}
                    className="flex h-13 sm:h-14 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 px-7 text-base font-semibold text-white backdrop-blur transition-all cursor-pointer"
                  >
                    <span>Explore Our Services</span>
                  </button>
                </div>

                {/* 3 Core Trust Indicators */}
                <div className="pt-6 sm:pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs text-slate-300">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Camera className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">Documented Evidence</div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        GPS coordinate stamps, UTC time & raw tamper-proof photos.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">Neutral Verifiers</div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        Zero commercial, familial, or personal ties to parties.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Lock className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">Client Control</div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        Separate service fees; you retain fund decisions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Realistic High-Fidelity Product Preview */}
              <div className="lg:col-span-5 w-full">
                <div className="relative mx-auto w-full max-w-[520px]">
                  {/* Subtle Card Glow Frame */}
                  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-emerald-500/20 via-transparent to-blue-500/20 blur-lg opacity-70" />

                  <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white p-6 sm:p-7 shadow-2xl text-slate-900 space-y-4">
                    {/* Dossier Header Bar */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                          LIVE FIELD DOSSIER
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                          PARTIALLY VERIFIED
                        </span>
                        <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                          DV-2026-NBI-0205
                        </span>
                      </div>
                    </div>

                    {/* Mission Profile */}
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                        Kitengela Milestone 3 · Structural Lintel & Stock Audit
                      </h3>
                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>Kitengela, Kajiado County</span>
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          GPS: -1.4872, 36.9602
                        </span>
                      </div>
                    </div>

                    {/* Findings Matrix */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="space-y-0.5 pr-2">
                          <span className="text-slate-800 font-semibold block">Ring Beam Concrete Lintel:</span>
                          <span className="text-[11px] text-slate-500">Poured and vibrated per structural drawing</span>
                        </div>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 shrink-0">
                          Observed
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                        <div className="space-y-0.5 pr-2">
                          <span className="text-amber-950 font-semibold block">100 Cement Bags Invoiced:</span>
                          <span className="text-[11px] text-amber-800">Only 42 bags physically counted on site</span>
                        </div>
                        <span className="font-bold text-amber-800 bg-white px-2.5 py-1 rounded-md border border-amber-300 shrink-0">
                          42 of 100 Bags
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="space-y-0.5 pr-2">
                          <span className="text-slate-800 font-semibold block">Boundary Beacons & Demarcation:</span>
                          <span className="text-[11px] text-slate-500">Corner beacons aligned with survey map</span>
                        </div>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 shrink-0">
                          Observed
                        </span>
                      </div>
                    </div>

                    {/* Actionable Stop-Payment Warning Box */}
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-xs space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-rose-800">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Recommended Client Action:</span>
                      </div>
                      <p className="text-[11.5px] leading-relaxed text-rose-900">
                        Pause KES 185,000 contractor milestone release until contractor accounts for the 58 unaccounted cement bags.
                      </p>
                    </div>

                    {/* Card Footer: Cryptographic Stamp & Action */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-slate-100">
                      <button
                        onClick={() => navigate("/sample-report")}
                        className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                      >
                        <span>Inspect Full Demonstration Report</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>SHA-256 Tamper Sealed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            2. THE PROBLEM & VALUE PROPOSITION (Strategic Comparison)
        ========================================================= */}
        <section className="bg-white py-20 lg:py-28 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="max-w-3xl space-y-3 mb-12 sm:mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono">
                THE CUSTOMER PROBLEM
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 tracking-tight">
                Distance should not mean reliance on unverified reassurance.
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                When living abroad, asking relatives or contractors for updates often produces reassuring messages rather than objective facts. Months later, foundations remain unpoured, vehicles are not in the condition described, or family care remains uncoordinated.
              </p>
            </div>

            {/* Structured Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* The Risk of Informal Reliance */}
              <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-7 sm:p-9 space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 text-rose-700 font-bold text-sm uppercase tracking-wide">
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>The Risk of Informal Reliance</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 font-display">
                    Reassurance without tangible verification
                  </h3>

                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                      <span>Contractors reporting complete milestones to trigger wire transfers before physical work is executed.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                      <span>Well-meaning relatives pressured by social ties or lacking the technical know-how to spot discrepancies.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                      <span>WhatsApp photos without location stamps, dates, or verifiable references.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                      <span>Zero independent audit trail or recourse once money leaves your overseas account.</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 italic">
                  Informal favors leave you with the financial downside when discrepancies emerge.
                </div>
              </div>

              {/* The DiasporaVerify Standard */}
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50/30 p-7 sm:p-9 space-y-5 flex flex-col justify-between shadow-xs">
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-sm uppercase tracking-wide">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>The DiasporaVerify Standard</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 font-display">
                    Accountable, neutral observation with proof
                  </h3>

                  <ul className="space-y-3 text-sm text-slate-700">
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 mt-1 shrink-0 stroke-[2.5]" />
                      <span><strong>Vetted Neutral Operatives:</strong> Field verifiers with signed conflict-of-interest clearances.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 mt-1 shrink-0 stroke-[2.5]" />
                      <span><strong>Checklist Against Your Brief:</strong> Physical observation comparing the reality to your agreed drawings or invoices.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 mt-1 shrink-0 stroke-[2.5]" />
                      <span><strong>Tamper-Evident Telemetry:</strong> High-resolution photos and video walk-throughs with validated GPS & UTC timestamps.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 mt-1 shrink-0 stroke-[2.5]" />
                      <span><strong>Client Governed:</strong> Clear findings and recommendations so you retain 100% control before releasing funds.</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center justify-between">
                  <span>Structured oversight for peace of mind.</span>
                  <button
                    onClick={handleStart}
                    className="font-bold underline hover:text-emerald-900 cursor-pointer"
                  >
                    Start an intake →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            3. HOW IT WORKS (Structured 5-Stage Process)
        ========================================================= */}
        <section id="how-it-works" className="bg-[#f8fafc] py-20 lg:py-28 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono">
                  OUR REPEATABLE PROCESS
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 mt-1.5 tracking-tight">
                  How Every Mission Is Handled
                </h2>
                <p className="text-sm text-slate-500 mt-1.5 max-w-2xl">
                  A structured five-stage framework ensuring complete client control and transparency from intake to final report.
                </p>
              </div>

              <button
                onClick={() => navigate("/how-it-works")}
                className="text-xs font-bold text-slate-900 hover:text-emerald-700 flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
              >
                <span>Read Full Stage Guide</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* 5-Step Process Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {[
                {
                  step: "01",
                  title: "Define the Assignment",
                  icon: FileText,
                  desc: "You specify the task, target location, milestones, drawings, or inspection criteria. Nairobi HQ defines clear scope, limitations, itemized pricing, and deliverables."
                },
                {
                  step: "02",
                  title: "Assign a Suitable Agent",
                  icon: UserCheck,
                  desc: "HQ selects a vetted local operative, executes a signed conflict-of-interest clearance, and confirms lawful site access or recipient consent."
                },
                {
                  step: "03",
                  title: "Conduct On-Ground Verification",
                  icon: MapPin,
                  desc: "The assigned verifier visits the site, executes agreed checklist observations, and captures dated, time-stamped, GPS-tagged photographic telemetry."
                },
                {
                  step: "04",
                  title: "Review Evidence & QA",
                  icon: ShieldCheck,
                  desc: "An operations coordinator audits evidence completeness, flags contradictions against contractor claims, and certifies forensic findings."
                },
                {
                  step: "05",
                  title: "Deliver Report & Next Steps",
                  icon: CheckCircle2,
                  desc: "You receive the finalized dossier with verified evidence, explicit limitations, and recommended next actions so you remain in full control of decisions."
                }
              ].map((st) => (
                <div
                  key={st.step}
                  className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-3 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-block">
                        Stage {st.step}
                      </span>
                      <st.icon className="w-4 h-4 text-slate-400" />
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {st.title}
                    </h3>

                    <p className="text-slate-600 leading-relaxed text-xs">
                      {st.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            4. VERIFICATION SERVICES (Master Category Grid)
        ========================================================= */}
        <section id="services" className="bg-white py-20 lg:py-28 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono">
                  FIVE MASTER CATEGORIES
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 mt-1.5 tracking-tight">
                  What We Verify on the Ground in Kenya
                </h2>
                <p className="text-sm text-slate-500 mt-1.5 max-w-2xl">
                  Each service category has an agreed brief, explicit exclusions, and verified deliverable checklists. We do not make unverified promises.
                </p>
              </div>

              <button
                onClick={() => navigate("/services")}
                className="text-xs font-bold text-slate-900 hover:text-emerald-700 flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
              >
                <span>View All Category Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Responsive Service Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {MASTER_SERVICES.map((srv) => (
                <div
                  key={srv.id}
                  className="rounded-3xl border border-slate-200 bg-[#f8fafc] p-7 space-y-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Top Tag Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shadow-2xs">
                          {getCategoryIcon(srv.iconName)}
                        </div>
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          CAT-{srv.slug.slice(0, 3).toUpperCase()}
                        </span>
                      </div>

                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Pilot Active
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-display text-slate-900">
                      {srv.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {srv.shortDescription}
                    </p>

                    {/* Scope Deliverables */}
                    <div className="pt-3 border-t border-slate-200/80 space-y-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                        Core Deliverables
                      </span>
                      <ul className="space-y-2 text-xs text-slate-700">
                        {srv.useCases.slice(0, 3).map((uc, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                            <span className="line-clamp-1">{uc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bottom Action Controls */}
                  <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between gap-3">
                    <button
                      onClick={() => handleServices(srv.slug)}
                      className="text-xs font-bold text-slate-800 hover:text-emerald-700 transition-colors cursor-pointer"
                    >
                      Scope & Details →
                    </button>

                    <button
                      onClick={() => navigate(`/new-request?category=${srv.slug}`)}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
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
            5. TRUST & ACCOUNTABILITY FRAMEWORK
        ========================================================= */}
        <section className="bg-[#172A3A] text-white py-20 lg:py-28 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                ACCOUNTABILITY BY DESIGN
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white">
                Built Around Neutrality, Not Informal Favors.
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Trust rests on independent observation, clear limitations, named accountability, and honest reporting of what could not be confirmed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-slate-300">
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-bold text-white text-base">Conflict Clearance</h3>
                <p className="leading-relaxed text-slate-400 text-xs">
                  Every verifier signs a binding declaration confirming zero personal or commercial ties to the contractor, seller, or family caretakers.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-bold text-white text-base">Anti-Collusion Relay</h3>
                <p className="leading-relaxed text-slate-400 text-xs">
                  Clients and agents never exchange private phone numbers. All communication and instructions flow securely through the HQ Dispatch Relay.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-bold text-white text-base">Cryptographic Proof</h3>
                <p className="leading-relaxed text-slate-400 text-xs">
                  Photographs and 360-degree videos include validated GPS coordinate stamps, UTC timestamps, and tamper-evident SHA-256 evidence hashes.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-bold text-white text-base">Client Control</h3>
                <p className="leading-relaxed text-slate-400 text-xs">
                  Service fees are itemized and strictly separated from third-party purchase monies. We never disburse funds without explicit client sign-off.
                </p>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Governed by the Kenya Data Protection Act (DPA 2019) and strict QA mandates.</span>
              </span>
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
            6. SAMPLE REPORT PREVIEW CALLOUT
        ========================================================= */}
        <section className="bg-white py-20 lg:py-24 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#f8fafc] rounded-3xl border border-slate-200 p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
                  Inspect Our Demonstration Report Dossier
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  See exactly how findings, material counts, unverified items, photographic telemetry, and QA recommendations are presented before committing to a service.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 shrink-0 w-full lg:w-auto">
                <button
                  onClick={() => navigate("/sample-report")}
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>View Sample Report</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate("/how-it-works")}
                  className="px-6 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors flex items-center justify-center cursor-pointer"
                >
                  How Reports Are Built
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            7. FREQUENTLY ASKED QUESTIONS (Spacious & Clean)
        ========================================================= */}
        <section className="bg-[#f8fafc] py-20 lg:py-28 border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono">
                QUESTIONS & ANSWERS
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-500 max-w-xl mx-auto">
                Clear policies on feasibility, turnaround, pricing, and operational boundaries.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {faqs.map((faq, i) => {
                const isOpen = openFaqIndex === i;
                return (
                  <div
                    key={i}
                    className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                      className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base cursor-pointer hover:bg-slate-50/50 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-emerald-600" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-slate-600 leading-relaxed text-xs sm:text-sm border-t border-slate-100 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================
            8. FINAL CONVERSION SECTION
        ========================================================= */}
        <section className="bg-[#172A3A] text-white py-20 lg:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white">
              Ready to verify what's happening on the ground?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Submit your request details without obligation. A Nairobi coordinator will review feasibility, establish clear boundaries, and provide an itemized quote within 24 hours.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={handleStart}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:translate-y-[-1px] cursor-pointer"
              >
                Request Verification Now →
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="w-full sm:w-auto px-7 py-4 rounded-xl border border-white/20 hover:bg-white/10 text-white font-semibold text-sm backdrop-blur transition-all cursor-pointer"
              >
                Speak with a Coordinator
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* =========================================================
          9. CANONICAL FOOTER
      ========================================================= */}
      <Footer />
    </div>
  );
}

export default HomePage;
