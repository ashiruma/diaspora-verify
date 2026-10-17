"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Check,
  MapPin,
  Building2,
  Compass,
  AlertTriangle,
  Lock,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Hammer,
  Globe,
} from "lucide-react";
import { useVerification } from "../context/VerificationContext";
import type { CurrencyCode } from "../types";
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
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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
    } else if (currentUser?.role === "admin") {
      navigate("/admin");
    } else if (currentUser?.role === "agent") {
      navigate("/agent");
    } else if (currentUser?.role === "client") {
      navigate("/dashboard");
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

  const faqs = [
    {
      q: "How does DiasporaVerify differ from sending a relative or contractor to check?",
      a: "Relatives and contractors operate inside family or commercial relationships that can blur facts, invite social pressure, or create conflicts of interest. DiasporaVerify dispatches independent operatives bound by written conflict-of-interest disclosures, trained to verify physical evidence against an agreed checklist with GPS-tagged and time-stamped telemetry."
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
    <div className="min-h-screen bg-[#FAF8F5] text-[#171310] font-sans antialiased selection:bg-emerald-600 selection:text-white">
      {/* =========================================================================
          1. HERO: Editorial Kinfold Lockup with Kenyan Emerald Green Brand Accents
      ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[#E8E2D8] bg-gradient-to-b from-[#F2F7F4] via-[#FAF8F5] to-[#FAF8F5]">
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#17131008_1px,transparent_1px),linear-gradient(to_bottom,#17131008_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />

        {/* Ambient emerald halo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[550px] sm:w-[750px] h-[350px] rounded-full bg-gradient-to-tr from-emerald-500/15 via-[#0D5C3A]/20 to-transparent blur-3xl"
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Eyebrow Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-200 bg-emerald-50/90 text-emerald-800 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] shadow-2xs backdrop-blur-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Independent Kenya Field Due Diligence · Boots in Mashinani</span>
          </div>

          {/* Master Headline: Low-Set Serif with Vibrant Emerald Green Italic Accent */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-[70px] font-normal tracking-tight text-[#171310] leading-[1.08]">
            Building or buying in Kenya?
            <br />
            <span className="text-[#0D5C3A] italic font-serif">Stop sending money on blind faith.</span>
          </h1>

          {/* Subheadline: Clear narrative selling the gap we fill */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#4a443c] leading-relaxed font-light">
            We provide independent eyes on the ground for Diaspora Kenyans.
            We dispatch vetted field agents directly to your project in <strong className="text-[#171310] font-semibold">Mashinani</strong>,
            audit construction milestones, verify land beacons, and capture GPS photo proof before you wire your next payment.
          </p>

          {/* Action CTAs in Loveli Luxury Pill Geometry */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={handleStart}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#0D5C3A] hover:bg-[#094229] text-white font-bold text-xs uppercase tracking-[0.16em] shadow-[0_10px_26px_-10px_rgba(13,92,58,0.5)] transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <span>Book an Appointment</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-[#faf8f5] border border-[#e8e2d8] text-[#171310] font-bold text-xs uppercase tracking-[0.16em] shadow-xs transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>See How It Works ↓</span>
            </a>
          </div>

          {/* Trust Safeguards Bar */}
          <div className="pt-8 border-t border-[#e8e2d8] flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs font-semibold text-[#6b6359]">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0D5C3A]" />
              <span>Zero-Conflict Operatives</span>
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0D5C3A]" />
              <span>4 Active Pilot Hubs</span>
            </span>
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#0D5C3A]" />
              <span>SHA-256 Tamper-Proof Evidence</span>
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0D5C3A]" />
              <span>100% Anti-Collusion Anonymity</span>
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. THE THREE CHARACTERS: The Bridge from Diaspora to Ushago
      ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-[#0D5C3A]">
            The System Architecture
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#171310] tracking-tight">
            How DiasporaVerify Connects the Gap
          </h2>
          <p className="text-sm text-[#6b6359]">
            Three distinct roles working together to protect your investments in Kenya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* 1. The Diaspora Client */}
          <div className="bg-white rounded-3xl p-7 sm:p-8 border border-[#e8e2d8] shadow-xs flex flex-col justify-between space-y-6 hover:border-emerald-600/40 hover:shadow-md transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200/80 flex items-center justify-center font-bold text-lg">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
                Character 1 · Abroad
              </span>
              <h3 className="text-xl font-bold text-[#171310]">The Diaspora Client</h3>
              <p className="text-xs sm:text-sm text-[#4a443c] leading-relaxed">
                You live in London, Dallas, Dubai, or Toronto. You are funding a house, land purchase, or family project back in <strong className="text-[#171310]">Ushago</strong>. You need honest facts without relying on family gossip or unverified contractor claims.
              </p>
            </div>
            <div className="pt-4 border-t border-[#e8e2d8] text-xs font-semibold text-blue-700">
              Requests inspection & stays in control →
            </div>
          </div>

          {/* 2. The Admin & Operations Coordinator (Obsidian Glassmorphism with Emerald Accents) */}
          <div className="relative overflow-hidden bg-[#171310] text-[#faf8f5] rounded-3xl p-7 sm:p-8 border border-emerald-500/30 shadow-[0_12px_36px_rgba(0,0,0,0.18)] flex flex-col justify-between space-y-6 backdrop-blur-xl">
            {/* Ambient green corner reflection */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-10 -right-10 size-36 rounded-full bg-emerald-500/20 blur-2xl"
            />

            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-lg">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                Character 2 · The Bridge
              </span>
              <h3 className="text-xl font-bold text-white">Admin & Operations Desk</h3>
              <p className="text-xs sm:text-sm text-[#f4ede2]/90 leading-relaxed font-light">
                Our central operations team reviews your brief, matches your project with the right vetted local agent, enforces strict conflict-of-interest clearance, and audits all incoming evidence before release.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 text-xs font-semibold text-emerald-400 relative z-10">
              Vets agents & audits ground truth →
            </div>
          </div>

          {/* 3. The Field Agent */}
          <div className="bg-white rounded-3xl p-7 sm:p-8 border border-[#e8e2d8] shadow-xs flex flex-col justify-between space-y-6 hover:border-emerald-600/50 hover:shadow-md transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center justify-center font-bold text-lg">
                <MapPin className="w-5 h-5 text-amber-700" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                Character 3 · Boots on Site
              </span>
              <h3 className="text-xl font-bold text-[#171310]">The Field Agent</h3>
              <p className="text-xs sm:text-sm text-[#4a443c] leading-relaxed">
                The vetted local professional on the ground in Kenya. They travel directly to the site in <strong className="text-[#171310]">Mashinani</strong>, inspect foundation works, count material bags, verify boundary beacons, and take geotagged photos.
              </p>
            </div>
            <div className="pt-4 border-t border-[#e8e2d8] text-xs font-semibold text-amber-800">
              Conducts physical audit & captures evidence →
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. THE PROBLEM WE SOLVE: Informal Reliance vs The DiasporaVerify Standard
      ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] border-y border-[#E8E2D8]">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="font-serif text-3xl font-normal text-[#171310] tracking-tight">
              Why Informal Favors Cost You Thousands
            </h2>
            <p className="text-xs sm:text-sm text-[#6b6359]">
              Contractor promises and casual WhatsApp photos carry 100% of the risk with zero accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Old Way */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider font-mono">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>The High-Risk Way (Informal Reassurance)</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-[#4a443c]">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                  <span>Contractors demanding milestone payments before physical work is executed.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                  <span>Relatives pressured by social ties or lacking the technical eye to spot missing materials.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                  <span>Recycled WhatsApp pictures without GPS stamps, coordinates, or verifiable dates.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                  <span>Zero audit trail or leverage once foreign money transfer is completed.</span>
                </li>
              </ul>
            </div>

            {/* The DiasporaVerify Standard (Emerald Brand Card) */}
            <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 border-2 border-[#0D5C3A] shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#0D5C3A] font-bold text-xs uppercase tracking-wider font-mono">
                <CheckCircle2 className="w-4 h-4 text-[#0D5C3A] shrink-0" />
                <span>The DiasporaVerify Standard (Objective Proof)</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-[#171310] font-medium">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0D5C3A] mt-0.5 shrink-0 stroke-[3]" />
                  <span>Independent verifier with signed, binding conflict-of-interest disclosures.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0D5C3A] mt-0.5 shrink-0 stroke-[3]" />
                  <span>Direct comparison of ground reality against your drawings, invoices, and contracts.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0D5C3A] mt-0.5 shrink-0 stroke-[3]" />
                  <span>Cryptographically hashed (SHA-256) photos with GPS coordinates and timestamps.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0D5C3A] mt-0.5 shrink-0 stroke-[3]" />
                  <span>Actionable stop-payment flags on your private dashboard before releasing funds.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. WHAT WE VERIFY: 4 Core Categories
      ========================================================================= */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e8e2d8] pb-6">
          <div>
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-[#0D5C3A]">
              Scope of Operations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#171310] tracking-tight mt-1">
              What We Verify in Mashinani
            </h2>
          </div>
          <button
            onClick={() => navigate("/services")}
            className="text-xs font-bold text-[#0D5C3A] hover:text-[#094229] transition-colors cursor-pointer flex items-center gap-1 uppercase tracking-wider"
          >
            <span>View All Detailed Scope Guidelines</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Construction */}
          <div className="bg-white rounded-3xl p-6 border border-[#e8e2d8] shadow-2xs hover:shadow-md hover:border-emerald-600/50 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl border border-emerald-200/80 bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-[#171310]">Construction Milestones</h3>
              <p className="text-xs text-[#4a443c] leading-relaxed">
                Foundation slabs, walling, lintels, roof trusses, and site material counts before you approve contractor payment.
              </p>
            </div>
            <button
              onClick={() => handleServices("residential-construction")}
              className="text-xs font-semibold text-[#0D5C3A] hover:underline pt-3 border-t border-[#e8e2d8] text-left cursor-pointer"
            >
              Inspection Checklist →
            </button>
          </div>

          {/* Card 2: Land & Title */}
          <div className="bg-white rounded-3xl p-6 border border-[#e8e2d8] shadow-2xs hover:shadow-md hover:border-emerald-600/50 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl border border-emerald-200/80 bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-[#171310]">Land &amp; Shamba Beacons</h3>
              <p className="text-xs text-[#4a443c] leading-relaxed">
                Boundary beacon physical checks, neighbor confirmation, road reserve clearance, and registry file confirmation.
              </p>
            </div>
            <button
              onClick={() => handleServices("land-boundary")}
              className="text-xs font-semibold text-[#0D5C3A] hover:underline pt-3 border-t border-[#e8e2d8] text-left cursor-pointer"
            >
              Cadastral Scope →
            </button>
          </div>

          {/* Card 3: Family & Mashinani Projects */}
          <div className="bg-white rounded-3xl p-6 border border-[#e8e2d8] shadow-2xs hover:shadow-md hover:border-emerald-600/50 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl border border-emerald-200/80 bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Hammer className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-[#171310]">Mashinani Projects</h3>
              <p className="text-xs text-[#4a443c] leading-relaxed">
                Farms, boreholes, perimeter fencing, greenhouses, solar pumps, and family investment audits in rural Kenya.
              </p>
            </div>
            <button
              onClick={() => handleServices("family-property")}
              className="text-xs font-semibold text-[#0D5C3A] hover:underline pt-3 border-t border-[#e8e2d8] text-left cursor-pointer"
            >
              Field Audit Scope →
            </button>
          </div>

          {/* Card 4: Assets & Vehicles */}
          <div className="bg-white rounded-3xl p-6 border border-[#e8e2d8] shadow-2xs hover:shadow-md hover:border-emerald-600/50 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl border border-emerald-200/80 bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-[#171310]">Asset &amp; Vehicle Handover</h3>
              <p className="text-xs text-[#4a443c] leading-relaxed">
                Physical vehicle inspection, VIN verification, logbook matching, and mechanical checks prior to purchase.
              </p>
            </div>
            <button
              onClick={() => handleServices("vehicle-asset")}
              className="text-xs font-semibold text-[#0D5C3A] hover:underline pt-3 border-t border-[#e8e2d8] text-left cursor-pointer"
            >
              Asset Verification →
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. HOW IT WORKS: 3 Simple Steps in Luxury Obsidian Architecture
      ========================================================================= */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#12100e] text-[#faf8f5] border-y border-emerald-600/30">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-emerald-400">
              End-to-End Workflow
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-white tracking-tight">
              Simple 3-Step Verification Flow
            </h2>
            <p className="text-xs sm:text-sm text-[#f4ede2]/75 font-light">
              No complicated paperwork. Clear pricing and 48-hour ground response.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="space-y-3 p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-3xl font-black font-mono text-emerald-400">01</div>
              <h3 className="text-lg font-bold text-white">Submit Site Details</h3>
              <p className="text-xs sm:text-sm text-[#f4ede2]/80 leading-relaxed font-light">
                Enter your project location in Kenya and what needs to be verified (e.g. walling, beacons, or materials). You receive a binding, transparent quote.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-3 p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-3xl font-black font-mono text-emerald-400">02</div>
              <h3 className="text-lg font-bold text-white">Agent Dispatched to Site</h3>
              <p className="text-xs sm:text-sm text-[#f4ede2]/80 leading-relaxed font-light">
                Nairobi HQ matches a vetted, conflict-cleared agent who travels to the site in Mashinani, performs the physical audit, and records GPS telemetry.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-3 p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-3xl font-black font-mono text-emerald-400">03</div>
              <h3 className="text-lg font-bold text-white">Decide with Verified Proof</h3>
              <p className="text-xs sm:text-sm text-[#f4ede2]/80 leading-relaxed font-light">
                Log into your private dashboard to review high-res photo evidence, discrepancy alerts, and QA recommendations before releasing payment.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-center">
            <button
              onClick={handleStart}
              className="px-8 py-3.5 rounded-full bg-[#0D5C3A] hover:bg-[#094229] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
            >
              <span>Start an Intake Request</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. REAL EVIDENCE DOSSIER PREVIEW: Tangible Sample
      ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl border border-[#e8e2d8] p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e8e2d8] pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                {SAMPLE_DOSSIER.badgeLabel}
              </span>
              <h3 className="text-xl font-bold text-[#171310] mt-2">
                {SAMPLE_DOSSIER.projectTitle}
              </h3>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#6b6359]">
              <span>Ref: {SAMPLE_DOSSIER.referenceId}</span>
              <span>·</span>
              <span>GPS: {SAMPLE_DOSSIER.location.gpsCoords}</span>
            </div>
          </div>

          {/* Evidence findings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#e8e2d8] space-y-1">
              <span className="font-bold text-[#171310] block">{SAMPLE_DOSSIER.findings[0].title}</span>
              <p className="text-[#4a443c] leading-relaxed">
                {SAMPLE_DOSSIER.findings[0].summary}
              </p>
              <span className="inline-block text-[10px] font-mono font-bold text-[#0D5C3A] bg-emerald-50 px-2 py-0.5 rounded mt-1">
                Verified Intact
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
              <span className="font-bold text-amber-900 block">{SAMPLE_DOSSIER.findings[1].title}</span>
              <p className="text-amber-800 leading-relaxed">
                Physical count found {SAMPLE_DOSSIER.cementData.countedInStoreBags} of {SAMPLE_DOSSIER.cementData.invoicedBags} invoiced bags in the storage shed.
              </p>
              <span className="inline-block text-[10px] font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded mt-1">
                Stop-Payment Warning Triggered
              </span>
            </div>
          </div>

          {/* Action recommendation */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">{SAMPLE_DOSSIER.recommendedAction.headline}: </span>
              <span>{SAMPLE_DOSSIER.recommendedAction.summary}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => navigate("/sample-report")}
              className="text-xs font-bold text-[#0D5C3A] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Inspect Full Interactive Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-[#8f867c]">
              SHA-256 Cryptographic Tamper Seal Guaranteed
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. FAQ ACCORDION: Plain Answers
      ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#171310] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#6b6359]">
            Clear guidelines on turnaround times, pricing, and operational limits.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openFaqIndex === i;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#e8e2d8] overflow-hidden shadow-2xs"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-[#171310] text-sm cursor-pointer hover:bg-[#faf8f5] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8f867c] shrink-0 transition-transform ${
                      isOpen ? "rotate-180 text-emerald-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-[#4a443c] text-xs sm:text-sm leading-relaxed border-t border-[#e8e2d8] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6b6359] font-mono">
          <span>Kenya DPA 2019 &amp; Field Integrity Standard</span>
          <button
            onClick={handleLegal}
            className="font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
          >
            Legal &amp; Operating Boundaries →
          </button>
        </div>
      </section>

      {/* =========================================================================
          8. HIGH-CONVERTING CLOSING CTA
      ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0D5C3A] to-[#072E1D] text-white text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-white leading-tight">
            Protect your hard-earned money in Kenya today.
          </h2>
          <p className="text-sm sm:text-base text-emerald-100/90 max-w-xl mx-auto font-light leading-relaxed">
            Don't wait until foundation trenches are filled or money is spent.
            Get independent boots on the ground for complete peace of mind.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={handleStart}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-emerald-50 text-[#0D5C3A] font-bold text-xs uppercase tracking-[0.16em] shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Book an Appointment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/contact?type=quote")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-transparent hover:bg-white/10 border border-white/40 text-white font-bold text-xs uppercase tracking-[0.16em] transition-all cursor-pointer"
            >
              <span>Request Free Quote</span>
            </button>
          </div>
          <div className="text-xs text-emerald-200/70 font-mono pt-4">
            Direct Nairobi Operations Coordinator: ops@diasporaverify.co.ke
          </div>
        </div>
      </section>

      {/* Canonical Footer */}
      <Footer />
    </div>
  );
}

export default HomePage;
