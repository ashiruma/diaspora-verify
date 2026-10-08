"use client";

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Camera,
  Check,
  ClipboardCheck,
  FileCheck2,
  Globe2,
  Landmark,
  MapPin,
  Search,
  Shield,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react";
import { useVerification } from "../context/VerificationContext";
import type { CurrencyCode } from "../types";

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

  const handleStart = () => {
    if (onGetStarted) {
      onGetStarted();
    } else if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/new-request");
    }
  };

  const handleServices = () => {
    if (onViewServices) {
      onViewServices();
    } else {
      navigate("/service-model");
    }
  };

  const handleLegal = (doc?: string) => {
    if (onViewLegal) {
      onViewLegal();
    } else {
      navigate(doc ? `/legal?doc=${doc}` : "/legal");
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#f7faf9] text-[#07152f]">
      {/* =========================================================
          HERO SECTION
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#061329]">
        {/* Background effects */}
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

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 md:py-24 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          {/* LEFT COLUMN */}
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
              Independent Kenya ground verification
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[.98] tracking-[-0.045em] text-white sm:text-6xl lg:text-[72px]">
              VERIFY WHAT'S
              <span className="block text-emerald-400">REALLY HAPPENING.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Before you send more money, get independent eyes on the ground.
              We deploy vetted local verifiers across Kenya to confirm
              property, construction, inventory, businesses and family
              wellbeing.
            </p>

            {/* ROLE-AWARE HERO CTA BUTTONS */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              {isAdmin ? (
                <>
                  <button
                    onClick={() => navigate("/admin")}
                    className="group flex h-14 items-center justify-center gap-3 rounded-xl bg-emerald-500 px-7 text-base font-bold text-[#061329] shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400 cursor-pointer"
                  >
                    Go to Operations Desk
                    <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                  </button>

                  <button
                    onClick={() => navigate("/cockpit")}
                    className="flex h-14 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-7 text-base font-semibold text-white backdrop-blur transition hover:bg-white/10 cursor-pointer"
                  >
                    Financial Cockpit ↗
                  </button>
                </>
              ) : isClient ? (
                <>
                  <button
                    onClick={() => navigate("/new-request")}
                    className="group flex h-14 items-center justify-center gap-3 rounded-xl bg-emerald-500 px-7 text-base font-bold text-[#061329] shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400 cursor-pointer"
                  >
                    Start a Verification
                    <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                  </button>

                  <button
                    onClick={() => navigate("/dashboard")}
                    className="flex h-14 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-7 text-base font-semibold text-white backdrop-blur transition hover:bg-white/10 cursor-pointer"
                  >
                    My Dashboard →
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleStart}
                    className="group flex h-14 items-center justify-center gap-3 rounded-xl bg-emerald-500 px-7 text-base font-bold text-[#061329] shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400 cursor-pointer"
                  >
                    Start a verification
                    <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                  </button>

                  <button
                    onClick={() => scrollToSection("how-it-works")}
                    className="flex h-14 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-7 text-base font-semibold text-white backdrop-blur transition hover:bg-white/10 cursor-pointer"
                  >
                    See how it works
                  </button>
                </>
              )}
            </div>

            {/* TRUST METRICS */}
            <div className="mt-12 grid max-w-xl grid-cols-3 border-y border-white/10 py-5">
              <Stat number="47" label="Counties" />
              <Stat number="100%" label="Independent" />
              <Stat number="24/7" label="Evidence access" />
            </div>
          </div>

          {/* RIGHT COLUMN - REPORT CARD PREVIEW */}
          <div className="relative mx-auto w-full max-w-[500px]">
            {/* Floating location */}
            <div className="absolute -left-5 top-10 z-20 hidden rounded-xl border border-white/10 bg-white p-3 shadow-2xl sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                <MapPin className="h-5 w-5 text-emerald-600" />
              </div>

              <div className="ml-3">
                <p className="text-[10px] font-semibold uppercase text-slate-400">
                  Verified location
                </p>
                <p className="text-sm font-bold text-slate-900">Nairobi, Kenya</p>
              </div>
            </div>

            {/* Main report */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white p-6 shadow-[0_30px_100px_rgba(0,0,0,.35)] sm:p-8">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-100 blur-3xl" />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      Verification report
                    </div>

                    <h3 className="mt-2 text-xl font-bold text-slate-900">
                      Construction progress
                    </h3>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                    <FileCheck2 className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>

                {/* Evidence visual box */}
                <div className="relative mt-6 h-48 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-600 to-emerald-800">
                  <div className="absolute inset-0 opacity-20">
                    <div className="h-full w-full bg-[linear-gradient(135deg,transparent_40%,rgba(255,255,255,.3)_41%,transparent_42%)] bg-[length:40px_40px]" />
                  </div>

                  <div className="absolute bottom-4 left-4 rounded-lg bg-black/50 px-3 py-2 text-xs text-white backdrop-blur">
                    <div className="flex items-center gap-2">
                      <Camera className="h-3.5 w-3.5" />
                      Field evidence captured
                    </div>
                  </div>

                  <div className="absolute right-4 top-4 rounded-full bg-emerald-400 px-3 py-1.5 text-[10px] font-black uppercase text-[#061329]">
                    Verified
                  </div>
                </div>

                {/* Verification rows */}
                <div className="mt-6 space-y-3">
                  <EvidenceRow label="Physical location" value="Confirmed" />
                  <EvidenceRow label="Construction progress" value="82% complete" />
                  <EvidenceRow label="GPS evidence" value="Captured" />
                  <EvidenceRow label="Photo evidence" value="24 files" />
                </div>

                <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-50 p-4">
                  <div>
                    <p className="text-xs text-slate-400">
                      Verification confidence
                    </p>
                    <p className="mt-1 text-2xl font-black text-slate-900">98%</p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-emerald-100 bg-white">
                    <BadgeCheck className="h-6 w-6 text-emerald-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating verifier badge */}
            <div className="absolute -bottom-5 -right-5 hidden rounded-xl border border-white/10 bg-white p-3 shadow-2xl sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#061329] text-xs font-bold text-white">
                  JV
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-900">Verified inspector</p>
                  <p className="text-[10px] text-slate-400">
                    Vetted · GPS enabled
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          TRUST STRIP
      ========================================================= */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-semibold text-slate-500 sm:justify-between">
            <span className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-emerald-500" />
              Construction
            </span>

            <span className="flex items-center gap-2">
              <Landmark className="h-4 w-4 text-emerald-500" />
              Property & Land
            </span>

            <span className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-emerald-500" />
              Inventory
            </span>

            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-500" />
              Family welfare
            </span>

            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              Business due diligence
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================
          PROBLEM
      ========================================================= */}
      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-emerald-600">
              The problem
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl text-slate-950">
              Distance should never mean
              <span className="text-slate-400"> blind trust.</span>
            </h2>
          </div>

          <div>
            <p className="text-lg leading-8 text-slate-600">
              When you're abroad, photos from family, contractors or agents
              aren't always enough. You need independent evidence from someone
              who has actually been there.
            </p>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              DiasporaVerify connects you with vetted local professionals who
              physically inspect, document and report what is happening on the
              ground.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}
      <section id="how-it-works" className="bg-[#f3f7f5] py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-[.2em] text-emerald-600">
              How it works
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950">
              From request to evidence
            </h2>

            <p className="mt-4 text-slate-500">
              A simple, accountable process designed for people who can't be
              physically present.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-4">
            <Process
              number="01"
              icon={Search}
              title="Tell us what to verify"
              text="Describe the property, project, person, business or situation you need checked."
            />

            <Process
              number="02"
              icon={Users}
              title="We assign a verifier"
              text="A vetted local verifier is selected based on location, expertise and availability."
            />

            <Process
              number="03"
              icon={Smartphone}
              title="Evidence is captured"
              text="The verifier visits the site and records photos, GPS data and structured findings."
            />

            <Process
              number="04"
              icon={FileCheck2}
              title="You receive the report"
              text="Get a clear digital report with evidence, findings and recommendations."
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          SERVICES
      ========================================================= */}
      <section id="services" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[.2em] text-emerald-600">
                What we verify
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl text-slate-950">
                Real-world checks.
                <br />
                <span className="text-slate-400">Real evidence.</span>
              </h2>
            </div>

            <p className="max-w-md text-slate-500">
              Built for diaspora clients, companies, investors and
              organisations that need reliable information from Kenya.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Service
              icon={Building2}
              title="Construction verification"
              text="Confirm project progress, materials, workmanship and activity on site."
              onLearnMore={handleServices}
            />

            <Service
              icon={MapPin}
              title="Land & property checks"
              text="Verify location, physical condition, occupancy and visible site details."
              onLearnMore={handleServices}
            />

            <Service
              icon={ClipboardCheck}
              title="Inventory inspection"
              text="Confirm assets, stock, equipment and physical inventory."
              onLearnMore={handleServices}
            />

            <Service
              icon={Users}
              title="Family welfare"
              text="Independent welfare visits for families and loved ones in Kenya."
              onLearnMore={handleServices}
            />

            <Service
              icon={Landmark}
              title="Business due diligence"
              text="Verify business premises, operations and observable commercial activity."
              onLearnMore={handleServices}
            />

            <Service
              icon={ShieldCheck}
              title="Custom verification"
              text="Need something specific? Build a verification mission around your requirements."
              onLearnMore={handleServices}
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          COVERAGE
      ========================================================= */}
      <section
        id="coverage"
        className="overflow-hidden bg-[#061329] py-24 text-white"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-emerald-400">
              Nationwide coverage
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Kenya is closer
              <br />
              <span className="text-emerald-400">than you think.</span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Our model is designed to support field verification across all
              47 counties, connecting remote decision-makers with trusted
              people on the ground.
            </p>

            <div className="mt-8 grid max-w-md grid-cols-2 gap-3">
              <CoverageStat value="47" label="Counties" />
              <CoverageStat value="Local" label="Vetted verifiers" />
              <CoverageStat value="GPS" label="Evidence" />
              <CoverageStat value="Digital" label="Reporting" />
            </div>
          </div>

          {/* MAP DISPLAY */}
          <div className="relative h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
            <div className="absolute inset-0 opacity-20">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
                  backgroundSize: "45px 45px",
                }}
              />
            </div>

            {/* Kenya shape representation */}
            <div className="absolute left-1/2 top-1/2 h-[300px] w-[230px] -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-[48%_52%_45%_55%] border-2 border-emerald-400/40 bg-emerald-400/5" />

            {[
              ["Nairobi", "54%", "57%"],
              ["Mombasa", "78%", "82%"],
              ["Kisumu", "29%", "53%"],
              ["Nakuru", "43%", "43%"],
            ].map(([name, left, top]) => (
              <div key={name} className="absolute" style={{ left, top }}>
                <div className="h-3 w-3 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,.8)]" />

                <span className="absolute left-5 top-[-4px] whitespace-nowrap text-xs font-semibold text-emerald-200">
                  {name}
                </span>
              </div>
            ))}

            <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/10 bg-black/20 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Globe2 className="h-4 w-4 text-emerald-400" />
                Field verification network
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          COMPLIANCE
      ========================================================= */}
      <section id="compliance" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="rounded-3xl bg-[#f3f7f5] p-8 md:p-12">
            <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#061329]">
                  <ShieldCheck className="h-6 w-6 text-emerald-400" />
                </div>

                <h2 className="mt-6 text-3xl font-black text-slate-950">
                  Built around trust.
                  <br />
                  Designed for accountability.
                </h2>

                <p className="mt-4 leading-7 text-slate-500">
                  Every verification is structured to create an auditable
                  record of what was requested, who performed it, where it
                  happened and what evidence was collected.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <ComplianceItem text="Vetted field verifiers" />
                <ComplianceItem text="Identity & assignment controls" />
                <ComplianceItem text="GPS-tagged evidence" />
                <ComplianceItem text="Structured verification reports" />
                <ComplianceItem text="Audit trail" />
                <ComplianceItem text="Client data safeguards" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section id="start" className="px-5 pb-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-[#061329] px-6 py-20 text-center sm:px-12">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-[100px]" />

          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[.2em] text-emerald-400">
              Before you send the money
            </p>

            <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-black tracking-tight text-white sm:text-6xl">
              Don't rely on promises.
              <span className="block text-emerald-400">Verify first.</span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Tell us what you need checked and we'll help you turn distance
              into evidence.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              {isAdmin ? (
                <>
                  <button
                    onClick={() => navigate("/admin")}
                    className="flex h-14 items-center justify-center gap-3 rounded-xl bg-emerald-500 px-8 font-bold text-[#061329] hover:bg-emerald-400 transition cursor-pointer"
                  >
                    Go to Operations Desk
                    <ArrowRight className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => navigate("/cockpit")}
                    className="flex h-14 items-center justify-center rounded-xl border border-white/15 px-8 font-semibold text-white hover:bg-white/5 transition cursor-pointer"
                  >
                    Financial Cockpit ↗
                  </button>
                </>
              ) : isClient ? (
                <>
                  <button
                    onClick={() => navigate("/new-request")}
                    className="flex h-14 items-center justify-center gap-3 rounded-xl bg-emerald-500 px-8 font-bold text-[#061329] hover:bg-emerald-400 transition cursor-pointer"
                  >
                    Start a Verification
                    <ArrowRight className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => navigate("/dashboard")}
                    className="flex h-14 items-center justify-center rounded-xl border border-white/15 px-8 font-semibold text-white hover:bg-white/5 transition cursor-pointer"
                  >
                    Go to My Dashboard →
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleStart}
                    className="flex h-14 items-center justify-center gap-3 rounded-xl bg-emerald-500 px-8 font-bold text-[#061329] hover:bg-emerald-400 transition cursor-pointer"
                  >
                    Start a verification
                    <ArrowRight className="h-5 w-5" />
                  </button>

                  <button
                    onClick={handleServices}
                    className="flex h-14 items-center justify-center rounded-xl border border-white/15 px-8 font-semibold text-white hover:bg-white/5 transition cursor-pointer"
                  >
                    Calculate indicative fee
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-8 text-xs text-slate-400 sm:flex-row lg:px-8">
          <div>© 2026 DiasporaVerify. Field Verification & Safeguarding.</div>

          <div className="flex gap-6">
            <button
              onClick={() => handleLegal("privacy")}
              className="hover:text-slate-600 transition cursor-pointer"
            >
              Privacy
            </button>
            <button
              onClick={() => handleLegal("terms")}
              className="hover:text-slate-600 transition cursor-pointer"
            >
              Terms
            </button>
            <button
              onClick={() => handleLegal("boundaries")}
              className="hover:text-slate-600 transition cursor-pointer"
            >
              Safeguarding
            </button>
            <button
              onClick={() => handleLegal("code_of_conduct")}
              className="hover:text-slate-600 transition cursor-pointer"
            >
              Code of Conduct
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;

/* ===============================================================
   COMPONENTS
=============================================================== */

export function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="border-r border-white/10 px-4 first:pl-0 last:border-0">
      <div className="text-xl font-black text-white">{number}</div>
      <div className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">
        {label}
      </div>
    </div>
  );
}

export function EvidenceRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
      <div className="flex items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50">
          <Check className="h-3 w-3 text-emerald-600" />
        </div>

        <span className="text-sm text-slate-600">{label}</span>
      </div>

      <span className="text-xs font-bold text-slate-800">{value}</span>
    </div>
  );
}

export function Process({
  number,
  icon: Icon,
  title,
  text,
}: {
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#061329] text-emerald-400">
          <Icon className="h-5 w-5" />
        </div>

        <span className="text-4xl font-black text-slate-100">{number}</span>
      </div>

      <h3 className="mt-6 font-bold text-slate-900">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}

export function Service({
  icon: Icon,
  title,
  text,
  onLearnMore,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
  onLearnMore?: () => void;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-500 group-hover:text-white">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="mt-6 text-lg font-bold text-slate-900">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">{text}</p>

      <button
        onClick={onLearnMore}
        className="mt-5 flex items-center gap-1 text-xs font-bold text-emerald-600 cursor-pointer hover:underline"
      >
        Learn more
        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
      </button>
    </div>
  );
}

export function CoverageStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
      <div className="text-xl font-black text-white">{value}</div>
      <div className="mt-1 text-xs text-slate-400">{label}</div>
    </div>
  );
}

export function ComplianceItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50">
        <Check className="h-4 w-4 text-emerald-600" />
      </div>

      <span className="text-sm font-semibold text-slate-700">{text}</span>
    </div>
  );
}
