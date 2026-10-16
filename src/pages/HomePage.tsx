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
  Building2,
  Car,
  Briefcase,
  HeartHandshake,
  Compass,
  FileText,
  UserCheck,
  CheckCircle2,
  XCircle,
  ChevronDown
} from "lucide-react";
import { useVerification } from "../context/VerificationContext";
import type { CurrencyCode } from "../types";
import { MASTER_SERVICES } from "../data/servicesData";
import { Footer } from "../components/Public/Footer";
import { SAMPLE_DOSSIER } from "../data/sampleDossierData";
import { COVERAGE_POLICY } from "../data/coverageData";

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

  // Smooth scroll support when navigating via hashes
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
      navigate("/contact?type=quote");
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

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Building2":
        return <Building2 className="w-5 h-5 text-[#4A7A4A]" />;
      case "Compass":
        return <Compass className="w-5 h-5 text-[#A88A48]" />;
      case "Car":
        return <Car className="w-5 h-5 text-[#4A7A4A]" />;
      case "Briefcase":
        return <Briefcase className="w-5 h-5 text-[#B26A46]" />;
      case "HeartHandshake":
        return <HeartHandshake className="w-5 h-5 text-[#A88A48]" />;
      default:
        return <Compass className="w-5 h-5 text-[#4A7A4A]" />;
    }
  };

  const faqs = [
    {
      q: "How does DiasporaVerify differ from sending a relative or contractor to check?",
      a: "Relatives and contractors operate inside personal or commercial relationships that can blur facts, invite pressure, or create conflicts of interest. DiasporaVerify dispatches independent operatives bound by written conflict-of-interest disclosures, trained to verify physical evidence against an agreed checklist with GPS-tagged and time-stamped telemetry."
    },
    {
      q: "What starting prices or fee structures apply?",
      a: "Every project receives an itemized, binding quote based on site location, required verifier travel, inspection depth, and urgency. Basic single-visit residential milestone checks start from transparent baseline rates in our active hubs. Request an obligation-free quote without creating an account to see exact fees for your project."
    },
    {
      q: "What geographic areas do you currently cover?",
      a: COVERAGE_POLICY.summaryText
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
    <div className="min-h-screen bg-[#F0EEE4] text-[#2A3A2A] flex flex-col justify-between text-left font-sans antialiased selection:bg-[#4A7A4A] selection:text-[#F0EEE4]">
      <div>
        
        {/* =========================================================
            1. BOTANICAL GLASSHOUSE HERO (Rare Leaves Inspiration)
        ========================================================= */}
        <section className="relative min-h-[90vh] lg:min-h-[96vh] flex items-center justify-center overflow-hidden py-16 px-4 bg-[#142017]">
          {/* Panoramic sunlit Kenyan highland landscape backdrop */}
          <img
            src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=2000&q=80"
            alt="Sunlit Kenyan highlands terrain"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            decoding="async"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#142017]/70 via-[#142017]/40 to-[#142017]/85 pointer-events-none" />

          {/* Top Etched Brand Header */}
          <div className="absolute top-8 sm:top-12 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10 w-full px-4">
            <div className="font-serif-t etched text-2xl sm:text-3xl lg:text-[38px] leading-none tracking-[0.02em]">
              DiasporaVerify
            </div>
            <div className="text-[9px] sm:text-[10px] tracking-[0.5em] mt-2.5 text-white/80 uppercase font-mono">
              INDEPENDENT KENYA FIELD VERIFICATION · NAIROBI HQ
            </div>
          </div>

          {/* Centered Frosted Glass Panel with Revolving Brass Ring */}
          <div className="relative z-20 my-auto w-full max-w-[820px] px-4">
            <div className="relative">
              
              {/* Revolving Brass Ring */}
              <div className="spin-ring absolute -inset-8 sm:-inset-14 pointer-events-none opacity-80">
                <svg viewBox="0 0 400 400" className="w-full h-full">
                  <circle cx="200" cy="200" r="195" fill="none" stroke="#A88A48" strokeWidth="0.7" strokeDasharray="2 8" />
                  <circle cx="200" cy="200" r="180" fill="none" stroke="#A88A48" strokeWidth="0.4" />
                  <circle cx="200" cy="5" r="3.5" fill="#A88A48" />
                  <circle cx="200" cy="395" r="2.5" fill="#A88A48" />
                </svg>
              </div>

              {/* Glass Overlay Box */}
              <div
                className="relative refract-edge rounded-[2px] px-6 sm:px-14 py-10 sm:py-14 text-center"
                style={{
                  background: 'linear-gradient(180deg, rgba(240,238,228,0.12) 0%, rgba(42,58,42,0.30) 100%)',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  border: '1px solid rgba(255,255,255,0.38)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), inset 0 0 24px rgba(255,255,255,0.08), 0 35px 85px -20px rgba(0,0,0,0.5)',
                }}
              >
                <div className="text-[10px] tracking-[0.5em] text-white/90 mb-5 uppercase font-mono">
                  · INDEPENDENT FIELD SURVEILLANCE ·
                </div>

                <h1 className="font-serif-t etched text-4xl sm:text-6xl lg:text-[72px] leading-[0.98] tracking-[-0.02em]">
                  A quiet, incorruptible <span className="italic font-light">eye</span>
                  <br />
                  on the ground in Kenya.
                </h1>

                <p className="mt-6 text-sm sm:text-[15.5px] text-white/90 max-w-lg mx-auto leading-relaxed">
                  Living abroad should not mean relying on guesswork before sending money. We provide documented visits against an agreed brief, GPS-tagged photographic telemetry, and objective findings before you release funds.
                </p>

                <div className="mt-8 sm:mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                  <button
                    onClick={handleStart}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#4A7A4A] hover:bg-[#2A3A2A] text-[#F0EEE4] text-[12px] tracking-[0.22em] uppercase font-bold transition-all shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Request a Quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <a
                    href="#dossier-preview"
                    className="w-full sm:w-auto px-8 py-3.5 border border-white/40 hover:bg-white/10 text-white text-[12px] tracking-[0.22em] uppercase backdrop-blur-xs font-semibold transition-all cursor-pointer text-center"
                  >
                    Inspect Sample Dossier
                  </a>
                </div>
              </div>

              {/* Bottom Guarantee Stat Strip */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white/90 font-mono">
                <span className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#A88A48]" />
                  <span>4 Pilot Hubs Active</span>
                </span>
                <span className="hidden sm:inline-block w-8 h-px bg-white/30" />
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#A88A48]" />
                  <span>Zero-Conflict Clearance</span>
                </span>
                <span className="hidden sm:inline-block w-8 h-px bg-white/30" />
                <span className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[#A88A48]" />
                  <span>SHA-256 Tamper-Proof</span>
                </span>
              </div>
            </div>
          </div>

          {/* Corner Etched Coordinates */}
          <div className="absolute bottom-6 left-6 sm:left-8 text-white/70 text-[10px] tracking-[0.3em] font-mono pointer-events-none">
            1.2921° S / 36.8219° E · NAIROBI HQ
          </div>
          <div className="absolute bottom-6 right-6 sm:right-8 text-white/70 text-[10px] tracking-[0.3em] font-mono pointer-events-none">
            DOSSIER REF: {SAMPLE_DOSSIER.referenceId}
          </div>
        </section>

        {/* =========================================================
            2. FOLIO I: THE PROBLEM & VALUE PROPOSITION (Archival Comparison)
        ========================================================= */}
        <section className="py-24 sm:py-28 px-6 sm:px-8 bg-[#F0EEE4] border-b border-[#A88A48]/30">
          <div className="max-w-[1320px] mx-auto space-y-14">
            
            <div className="max-w-3xl space-y-3">
              <div className="text-[11px] tracking-[0.45em] text-[#B26A46] uppercase font-mono">
                — FOLIO I · OPERATIONAL PRINCIPLE
              </div>
              <h2 className="font-serif-t text-3xl sm:text-5xl lg:text-[54px] leading-[1.02] tracking-tight text-[#2A3A2A]">
                Distance should not mean reliance on <span className="italic font-light">unverified reassurance.</span>
              </h2>
              <p className="text-sm sm:text-base text-[#2A3A2A]/75 leading-relaxed font-sans">
                When living abroad, asking relatives or contractors for updates often produces reassuring words rather than objective facts. Months later, foundations remain unpoured, vehicles are not in the condition described, or materials are missing from the store.
              </p>
            </div>

            {/* Iron Shelf Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              
              {/* Card 1: Informal Reliance */}
              <div className="glass-pane refract-edge rounded-[2px] p-7 sm:p-9 space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 text-[#B26A46] font-bold text-xs uppercase tracking-wider font-mono">
                    <XCircle className="w-4 h-4 text-[#B26A46] shrink-0" />
                    <span>The Risk of Informal Reliance</span>
                  </div>

                  <h3 className="font-serif-t text-2xl text-[#2A3A2A]">
                    Reassurance without tangible verification
                  </h3>

                  <ul className="space-y-3 text-xs sm:text-sm text-[#2A3A2A]/75">
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#B26A46] mt-2 shrink-0" />
                      <span>Contractors claiming milestone completion to trigger wire transfers before work is physically executed.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#B26A46] mt-2 shrink-0" />
                      <span>Well-meaning relatives pressured by social ties or lacking the technical know-how to spot discrepancies.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#B26A46] mt-2 shrink-0" />
                      <span>WhatsApp photos without GPS coordinate stamps, UTC dates, or verified baseline benchmarks.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#B26A46] mt-2 shrink-0" />
                      <span>Zero neutral audit trail or legal recourse once funds leave your foreign bank account.</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#A88A48]/30 text-xs text-[#2A3A2A]/60 italic font-serif">
                  Informal favors leave the diaspora buyer with 100% of the financial downside when discrepancies emerge.
                </div>
              </div>

              {/* Card 2: The DiasporaVerify Standard */}
              <div className="glass-pane refract-edge rounded-[2px] p-7 sm:p-9 space-y-5 flex flex-col justify-between border-2 border-[#4A7A4A]/40 shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 text-[#4A7A4A] font-bold text-xs uppercase tracking-wider font-mono">
                    <CheckCircle2 className="w-4 h-4 text-[#4A7A4A] shrink-0" />
                    <span>The DiasporaVerify Standard</span>
                  </div>

                  <h3 className="font-serif-t text-2xl text-[#2A3A2A]">
                    Accountable, neutral observation with proof
                  </h3>

                  <ul className="space-y-3 text-xs sm:text-sm text-[#2A3A2A]/85">
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#4A7A4A] mt-1 shrink-0 stroke-[2.5]" />
                      <span><strong>Vetted Neutral Operatives:</strong> Field verifiers with signed, binding conflict-of-interest disclosures.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#4A7A4A] mt-1 shrink-0 stroke-[2.5]" />
                      <span><strong>Checklist Against Your Brief:</strong> Physical observation comparing the ground reality to your invoices and drawings.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#4A7A4A] mt-1 shrink-0 stroke-[2.5]" />
                      <span><strong>Tamper-Evident Telemetry:</strong> High-resolution photos and video telemetry sealed with cryptographic SHA-256 hashes.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#4A7A4A] mt-1 shrink-0 stroke-[2.5]" />
                      <span><strong>Client Governed Decisions:</strong> Clear findings and recommendations so you retain complete control before releasing payments.</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#A88A48]/30 flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#4A7A4A]">Structured oversight for complete peace of mind.</span>
                  <button
                    onClick={handleStart}
                    className="font-bold text-[#2A3A2A] hover:text-[#4A7A4A] underline cursor-pointer"
                  >
                    Start an intake →
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================
            3. FOLIO II: MASTER SERVICES CATALOG (Botanical Shelves)
        ========================================================= */}
        <section id="services" className="py-24 sm:py-28 px-6 sm:px-8 bg-[#F0EEE4] border-b border-[#A88A48]/30">
          <div className="max-w-[1320px] mx-auto space-y-12">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#A88A48]/40 pb-6">
              <div>
                <div className="text-[11px] tracking-[0.45em] text-[#B26A46] uppercase font-mono mb-2">
                  — FOLIO II · SPECIMEN SERVICES
                </div>
                <h2 className="font-serif-t text-4xl sm:text-5xl lg:text-[60px] leading-[0.98] tracking-tight text-[#2A3A2A]">
                  Five Master Categories<br />
                  <span className="italic font-light">of Field Verification</span>
                </h2>
              </div>
              <div className="text-left md:text-right text-[#2A3A2A]/70 max-w-sm text-xs sm:text-[14px] leading-relaxed">
                Each service category has an agreed brief, explicit exclusions, and verified deliverable checklists.
                <button
                  onClick={() => navigate("/services")}
                  className="text-[11px] tracking-[0.25em] uppercase text-[#A88A48] mt-2 block font-mono font-bold hover:underline cursor-pointer"
                >
                  View All Scope Definitions →
                </button>
              </div>
            </div>

            {/* Iron Shelf Rails with Master Services */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 pb-4">
              {MASTER_SERVICES.map((srv) => (
                <article
                  key={srv.id}
                  className="group glass-pane refract-edge rounded-[2px] p-6 space-y-5 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-sm bg-[#4A7A4A]/10 border border-[#A88A48]/30 flex items-center justify-center">
                        {getCategoryIcon(srv.iconName)}
                      </div>
                      <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 bg-[#4A7A4A] text-[#F0EEE4]">
                        Pilot Active
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono tracking-widest uppercase text-[#B26A46] block mb-1">
                        CAT-{srv.slug.slice(0, 3).toUpperCase()}
                      </span>
                      <h3 className="font-serif-t text-2xl text-[#2A3A2A] leading-tight">
                        {srv.title}
                      </h3>
                    </div>

                    <p className="text-xs text-[#2A3A2A]/75 leading-relaxed font-sans">
                      {srv.shortDescription}
                    </p>

                    <div className="pt-3 border-t border-[#A88A48]/30 space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#A88A48] font-bold block">
                        Verified Deliverables
                      </span>
                      <ul className="space-y-1.5 text-xs text-[#2A3A2A]/80">
                        {srv.useCases.slice(0, 3).map((uc, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-[#4A7A4A] mt-0.5 shrink-0 stroke-[2.5]" />
                            <span className="line-clamp-1">{uc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#A88A48]/30 flex items-center justify-between gap-3 text-xs">
                    <button
                      onClick={() => handleServices(srv.slug)}
                      className="font-bold text-[#2A3A2A] hover:text-[#4A7A4A] transition-colors cursor-pointer"
                    >
                      Scope & Details →
                    </button>
                    <button
                      onClick={() => navigate(currentUser ? `/new-request?category=${srv.slug}` : `/contact?type=quote&category=${srv.slug}`)}
                      className="px-4 py-2 bg-[#2A3A2A] hover:bg-[#4A7A4A] text-[#F0EEE4] font-semibold text-[11px] tracking-wider uppercase transition-all shadow-xs cursor-pointer"
                    >
                      Request Quote
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Iron Shelf Base */}
            <div className="iron-shelf" />
            <div className="flex justify-between text-[10px] tracking-[0.3em] uppercase text-[#2A3A2A]/50 font-mono">
              <span>Catalog II · Ground Verification</span>
              <span>Audited Milestones</span>
              <span>Nairobi · Kiambu · Machakos · Kajiado</span>
            </div>
          </div>
        </section>

        {/* =========================================================
            4. FOLIO III: HIGH-FIDELITY SAMPLE DOSSIER (Frosted Archive Card)
        ========================================================= */}
        <section id="dossier-preview" className="py-24 sm:py-28 px-6 sm:px-8 bg-[#2A3A2A] text-[#F0EEE4] overflow-hidden">
          <div className="max-w-[1320px] mx-auto space-y-12 relative">
            
            <div className="max-w-2xl space-y-3">
              <div className="text-[11px] tracking-[0.45em] text-[#A88A48] uppercase font-mono">
                — FOLIO III · DEMONSTRATION DOSSIER
              </div>
              <h2 className="font-serif-t text-4xl sm:text-5xl lg:text-[54px] leading-[0.98] tracking-tight">
                Inspect a real inspection <span className="italic font-light">dossier.</span>
              </h2>
              <p className="text-sm text-white/70 leading-relaxed font-sans">
                See exactly how findings, material counts, discrepancy warnings, photographic telemetry, and QA recommendations are documented before you commit to a mission.
              </p>
            </div>

            {/* Archival Frosted Glass Dossier Card */}
            <div className="glass-pane-dark refract-edge rounded-[2px] p-6 sm:p-10 lg:p-12 space-y-6 text-[#F0EEE4] max-w-4xl border border-white/20">
              
              {/* Dossier Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A88A48] bg-white/5 px-2.5 py-1 rounded border border-[#A88A48]/30">
                    {SAMPLE_DOSSIER.badgeLabel}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                    {SAMPLE_DOSSIER.overallStatus.label}
                  </span>
                  <span className="px-2 py-1 bg-white/10 text-white rounded">
                    {SAMPLE_DOSSIER.referenceId}
                  </span>
                </div>
              </div>

              {/* Mission Profile */}
              <div>
                <h3 className="font-serif-t text-2xl sm:text-3xl text-white">
                  {SAMPLE_DOSSIER.projectTitle}
                </h3>
                <div className="text-xs text-white/60 flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 font-mono">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#A88A48]" />
                    <span>{SAMPLE_DOSSIER.location.town}, {SAMPLE_DOSSIER.location.county} County</span>
                  </span>
                  <span>·</span>
                  <span>GPS: {SAMPLE_DOSSIER.location.gpsCoords}</span>
                </div>
              </div>

              {/* Findings Matrix */}
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-sm bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block">{SAMPLE_DOSSIER.findings[0].title}:</span>
                    <span className="text-[11px] text-white/60">{SAMPLE_DOSSIER.findings[0].summary}</span>
                  </div>
                  <span className="font-mono text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30 shrink-0">
                    Observed
                  </span>
                </div>

                <div className="p-3.5 rounded-sm bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-amber-200 block">{SAMPLE_DOSSIER.findings[1].title}:</span>
                    <span className="text-[11px] text-amber-100/80">{SAMPLE_DOSSIER.findings[1].summary}</span>
                  </div>
                  <span className="font-mono text-[10px] uppercase font-bold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded border border-amber-500/40 shrink-0">
                    {SAMPLE_DOSSIER.cementData.countedInStoreBags} of {SAMPLE_DOSSIER.cementData.invoicedBags} Bags Counted
                  </span>
                </div>

                <div className="p-3.5 rounded-sm bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block">{SAMPLE_DOSSIER.findings[2].title}:</span>
                    <span className="text-[11px] text-white/60">{SAMPLE_DOSSIER.findings[2].summary}</span>
                  </div>
                  <span className="font-mono text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30 shrink-0">
                    Observed
                  </span>
                </div>
              </div>

              {/* Stop-Payment Recommendation Box */}
              <div className="p-4 rounded-sm bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs space-y-1.5">
                <div className="font-bold flex items-center gap-2 text-rose-300 font-mono">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{SAMPLE_DOSSIER.recommendedAction.headline}</span>
                </div>
                <p className="text-[11.5px] leading-relaxed text-rose-200/90 font-sans">
                  {SAMPLE_DOSSIER.recommendedAction.summary}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
                <button
                  onClick={() => navigate("/sample-report")}
                  className="px-6 py-3 bg-[#4A7A4A] hover:bg-[#A88A48] text-[#F0EEE4] text-[11px] uppercase tracking-wider font-bold transition-all shadow-md cursor-pointer flex items-center gap-2 self-start sm:self-auto"
                >
                  <span>Inspect Complete Report</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <div className="text-[10px] text-white/50 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#A88A48]" />
                  <span>SHA-256 Tamper Sealed</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            5. FOLIO IV: 5-STEP REPEATABLE FRAMEWORK
        ========================================================= */}
        <section id="how-it-works" className="py-24 sm:py-28 px-6 sm:px-8 bg-[#F0EEE4] border-b border-[#A88A48]/30">
          <div className="max-w-[1320px] mx-auto space-y-14">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#A88A48]/40 pb-6">
              <div>
                <div className="text-[11px] tracking-[0.45em] text-[#B26A46] uppercase font-mono mb-2">
                  — FOLIO IV · METHODOLOGY
                </div>
                <h2 className="font-serif-t text-4xl sm:text-5xl lg:text-[60px] leading-[0.98] tracking-tight text-[#2A3A2A]">
                  How Every Mission<br />
                  <span className="italic font-light">Is Handled</span>
                </h2>
              </div>
              <button
                onClick={() => navigate("/how-it-works")}
                className="text-[11px] tracking-[0.25em] uppercase text-[#A88A48] font-mono font-bold hover:underline cursor-pointer"
              >
                Read Complete Operating Stage Guide →
              </button>
            </div>

            {/* 5 Process Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                {
                  step: "01",
                  title: "Define the Assignment",
                  icon: FileText,
                  desc: "You specify target location, agreed drawings, invoices, or criteria. Nairobi HQ defines clear scope, exclusions, and deliverables."
                },
                {
                  step: "02",
                  title: "Assign a Suitable Agent",
                  icon: UserCheck,
                  desc: "HQ selects a vetted local operative, executes a signed conflict-of-interest clearance, and confirms lawful site access."
                },
                {
                  step: "03",
                  title: "On-Ground Verification",
                  icon: MapPin,
                  desc: "The assigned verifier visits the site, executes agreed checklist observations, and captures dated GPS telemetry."
                },
                {
                  step: "04",
                  title: "Review Evidence & QA",
                  icon: ShieldCheck,
                  desc: "An operations coordinator audits evidence completeness, flags discrepancies against claims, and certifies findings."
                },
                {
                  step: "05",
                  title: "Deliver Report Dossier",
                  icon: CheckCircle2,
                  desc: "You receive the finalized dossier with verified evidence, explicit limitations, and recommendations so you retain complete control."
                }
              ].map((st) => (
                <div
                  key={st.step}
                  className="glass-pane refract-edge rounded-[2px] p-6 space-y-3 flex flex-col justify-between hover:shadow-lg transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-[#4A7A4A] bg-[#4A7A4A]/10 px-2 py-0.5 rounded border border-[#4A7A4A]/20">
                        Stage {st.step}
                      </span>
                      <st.icon className="w-4 h-4 text-[#A88A48]" />
                    </div>

                    <h3 className="font-serif-t text-xl text-[#2A3A2A] leading-snug">
                      {st.title}
                    </h3>

                    <p className="text-xs text-[#2A3A2A]/75 leading-relaxed font-sans">
                      {st.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="iron-shelf" />
          </div>
        </section>

        {/* =========================================================
            6. FOLIO V: INSTANT SCOPE INQUIRY (Double Brass Frame Desk)
        ========================================================= */}
        <section className="py-24 sm:py-28 px-6 sm:px-8 bg-[#F0EEE4] border-b border-[#A88A48]/30">
          <div className="max-w-[1100px] mx-auto space-y-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="text-[11px] tracking-[0.45em] text-[#B26A46] uppercase font-mono">
                — FOLIO V · PUBLIC INTAKE
              </div>
              <h2 className="font-serif-t text-4xl sm:text-5xl lg:text-[60px] leading-[0.98] tracking-tight text-[#2A3A2A]">
                Request a Free <span className="italic font-light">Scope Consultation</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#2A3A2A]/70 leading-relaxed font-sans">
                No account required to describe a potential mission. A Nairobi HQ coordinator will examine feasibility, establish clear boundaries, and provide an itemized quote within 24 hours.
              </p>
            </div>

            {/* Double Brass Frame Wrapper */}
            <div className="relative border-2 border-[#A88A48] rounded-[6px] p-1.5">
              <div className="absolute inset-[5px] border border-[#A88A48]/40 rounded-[3px] pointer-events-none" />

              <div className="glass-pane refract-edge rounded-[3px] p-8 sm:p-12 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#2A3A2A]/80">
                  <div className="space-y-1.5">
                    <span className="font-bold uppercase tracking-wider text-[#A88A48] font-mono text-[10px] block">
                      1. Immediate Feasibility
                    </span>
                    <p className="leading-relaxed">
                      We check local operative availability in Nairobi, Kiambu, Machakos, and Kajiado before confirming intake.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="font-bold uppercase tracking-wider text-[#A88A48] font-mono text-[10px] block">
                      2. Transparent Tariffs
                    </span>
                    <p className="leading-relaxed">
                      Quotes depend on parcel location, travel distance, checklist depth, and urgency. Zero hidden fees.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="font-bold uppercase tracking-wider text-[#A88A48] font-mono text-[10px] block">
                      3. Zero Obligation
                    </span>
                    <p className="leading-relaxed">
                      Submit scope details freely. You only commit once you accept our written itemized agreement.
                    </p>
                  </div>
                </div>

                <div className="brass-rule h-px w-full" />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="text-xs text-[#2A3A2A]/60 font-mono">
                    Direct Coordinator Desk: <strong className="text-[#2A3A2A]">ops@diasporaverify.co.ke</strong>
                  </div>

                  <button
                    onClick={handleStart}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#4A7A4A] hover:bg-[#2A3A2A] text-[#F0EEE4] text-[12px] tracking-[0.25em] uppercase font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Open Public Quote Form</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================
            7. FREQUENTLY ASKED QUESTIONS
        ========================================================= */}
        <section className="py-24 sm:py-28 px-6 sm:px-8 bg-[#F0EEE4]">
          <div className="max-w-4xl mx-auto space-y-12">
            
            <div className="text-center space-y-3">
              <div className="text-[11px] tracking-[0.45em] text-[#B26A46] uppercase font-mono">
                QUESTIONS &amp; ANSWERS
              </div>
              <h2 className="font-serif-t text-3xl sm:text-5xl text-[#2A3A2A]">
                Frequently Asked <span className="italic font-light">Questions</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#2A3A2A]/70 max-w-xl mx-auto font-sans">
                Clear policies on feasibility, turnaround, pricing, and operational boundaries.
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              {faqs.map((faq, i) => {
                const isOpen = openFaqIndex === i;
                return (
                  <div
                    key={i}
                    className="glass-pane rounded-[2px] border border-[#A88A48]/30 overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                      className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-[#2A3A2A] text-sm sm:text-base cursor-pointer hover:bg-white/40 transition-colors"
                    >
                      <span className="font-serif-t">{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#A88A48] shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-[#4A7A4A]" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-[#2A3A2A]/80 leading-relaxed text-xs sm:text-sm border-t border-[#A88A48]/20 pt-3 font-sans">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-6 border-t border-[#A88A48]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#2A3A2A]/70 font-mono">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4A7A4A]" />
                <span>Operating under Kenya Data Protection Act 2019 standards.</span>
              </span>
              <button
                onClick={handleLegal}
                className="font-bold text-[#A88A48] hover:text-[#4A7A4A] underline cursor-pointer"
              >
                Read Legal & Operating Framework →
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* Canonical Footer */}
      <Footer />
    </div>
  );
}

export default HomePage;
