import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  AlertTriangle, 
  Building, 
  Car, 
  Briefcase, 
  Heart, 
  Compass, 
  FileText,
  UserCheck,
  Award,
  ArrowRight,
  CheckCircle2,
  Phone
} from '../Icons';
import { FORMAT_CURRENCY, KENYA_COUNTIES } from '../../data/mockData';
import { calculateFeeBreakdown } from '../../services/paymentService';
import type { CurrencyCode, ServiceCategory } from '../../types';

interface LandingPageProps {
  onGetStarted: () => void;
  onViewServices: () => void;
  onViewLegal: () => void;
  currency: CurrencyCode;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onGetStarted, 
  onViewLegal, 
  currency: initialCurrency 
}) => {
  // Fee Estimator State
  const [estCategory, setEstCategory] = useState<ServiceCategory>('construction');
  const [estCounty, setEstCounty] = useState<string>('Kiambu');
  const [estUrgency, setEstUrgency] = useState<'standard' | 'priority' | 'urgent'>('standard');
  const [estCurrency, setEstCurrency] = useState<CurrencyCode>(initialCurrency || 'USD');

  const feeBreakdown = calculateFeeBreakdown(estCategory, estUrgency, estCounty, estCurrency);

  const serviceCategories = [
    {
      category: 'construction' as const,
      icon: <Building className="w-7 h-7 text-emerald-600" />,
      title: 'Construction Milestone Oversight',
      tagline: 'Foundation to Roof Gating',
      desc: 'Scheduled physical verification of slab pours, ring beams, block counts, and material deliveries. We verify progress before you release contractor milestone tranches.',
      boundary: 'Inspector ≠ Contractor: DiasporaVerify does not design, build, or release escrow funds.',
      checklist: ['Repeat-angle perimeter photographic audit', 'Physical cement and rebar delivery count', 'Stop-payment discrepancy advisory', 'Foreman site interview']
    },
    {
      category: 'property' as const,
      icon: <MapPin className="w-7 h-7 text-emerald-600" />,
      title: 'Land & Cadastral Verification',
      tagline: 'Beacon & Perimeter Audit',
      desc: 'Ground verification of land parcels before purchase. We locate physical survey beacons, verify perimeter fences, check access roads, and interview adjacent neighbors.',
      boundary: 'Observation Only: Physical ground inspection is not a statutory title conveyancing or registry search.',
      checklist: ['Cadastral corner beacon discovery', 'Boundary encroachment & fence check', 'Access road & utility grid proximity', 'Adjacent plot dispute inquiry']
    },
    {
      category: 'business' as const,
      icon: <Briefcase className="w-7 h-7 text-emerald-600" />,
      title: 'Commercial & Vendor Due Diligence',
      tagline: 'Storefront & Inventory Audit',
      desc: 'Verify that a local supplier, partner shop, or enterprise physically exists. We observe active trading, take inventory snapshots, and verify county business permits.',
      boundary: 'Snapshot Due Diligence: Ground inspection does not replace a statutory CPA forensic financial audit.',
      checklist: ['Physical operating storefront verification', 'In-stock inventory spot audit', 'Display of valid County Trade Permit', 'Active customer foot-traffic check']
    },
    {
      category: 'vehicle' as const,
      icon: <Car className="w-7 h-7 text-emerald-600" />,
      title: 'Vehicle & Equipment Inspection',
      tagline: 'Physical VIN & Condition Scan',
      desc: 'Independent physical inspection of vehicles and machinery in Kenya. We match stamped chassis VINs, perform paint depth gauge scans for hidden accident damage, and test cold starts.',
      boundary: 'Physical Assessment: We verify cosmetic condition and chassis numbers; no mechanical warranty provided.',
      checklist: ['Stamped chassis & engine VIN validation', 'Digital paint depth gauge filler scan', 'Cold engine start & transmission shift', 'Tyre tread depth & underbody check']
    },
    {
      category: 'family' as const,
      icon: <Heart className="w-7 h-7 text-emerald-600" />,
      title: 'Family Welfare Safeguarding',
      tagline: 'Consensual Wellbeing Checks',
      desc: 'Compassionate on-ground check-ins for elderly parents or relatives. We confirm home safety conditions, accompany relatives to medical appointments, and provide immediate updates.',
      boundary: 'Strict Safeguarding: Requires explicit consent of the recipient and a named local emergency contact.',
      checklist: ['Scheduled respectful home visit', 'Physical living conditions observation', 'Medical appointment accompaniment', 'Named emergency escalation protocol']
    },
    {
      category: 'document' as const,
      icon: <FileText className="w-7 h-7 text-emerald-600" />,
      title: 'Document & Institutional Legwork',
      tagline: 'Physical Registry & Records In-Person Check',
      desc: 'Physical visits to institutional offices, academic registrars, hospitals, or local authorities to examine original physical records and document physical correspondence.',
      boundary: 'Legwork Only: Physical inspection of records is not a diplomatic apostille or statutory legal opinion.',
      checklist: ['In-person visit to registry premises', 'High-resolution photo of official stamp/seal', 'Ledger reference number confirmation', 'Written coordinator observation report']
    },
    {
      category: 'custom' as const,
      icon: <Compass className="w-7 h-7 text-emerald-600" />,
      title: 'Bespoke Lawful Mission',
      tagline: 'Tailored Field Verification',
      desc: 'Any lawful, ethical on-ground assignment that requires an independent, professional third party with GPS telemetry, photo evidence, and a certified written report.',
      boundary: 'Lawful Missions Only: All custom tasks undergo strict safety, legal, and conflict-of-interest vetting.',
      checklist: ['Custom client scope definition', 'Vetted specialist verifier dispatch', 'GPS-stamped evidence dossier', 'Formal coordinator sign-off']
    }
  ];

  const steps = [
    {
      num: '01',
      title: 'Define',
      desc: 'Specify your task, exact parcel location, ground contact, and custom inspection checklist.',
      actor: 'Diaspora Client'
    },
    {
      num: '02',
      title: 'Assign',
      desc: 'Operations verifies zero conflict of interest and deploys a vetted, licensed county inspector.',
      actor: 'Nairobi Operations'
    },
    {
      num: '03',
      title: 'Act',
      desc: 'Inspector executes GPS check-in, inspects site, captures calibrated photos, and counts inventory.',
      actor: 'Field Inspector'
    },
    {
      num: '04',
      title: 'Review',
      desc: 'Senior coordinators audit discrepancies, calculate variance, and issue Stop-Payment advisories.',
      actor: 'Chief QA Desk'
    },
    {
      num: '05',
      title: 'Decide',
      desc: 'You receive an immutable, SHA-256 hashed dossier to confidently release or withhold payment.',
      actor: 'Client Decision'
    }
  ];

  return (
    <div className="font-sans text-slate-800 bg-slate-50 min-h-screen">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white overflow-hidden py-24 px-4 sm:px-6 lg:px-8 border-b border-emerald-900/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.08),transparent_50%)]" />
        
        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide uppercase">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Independent Kenya Ground Verification & Remote Due Diligence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-white leading-tight">
            VERIFY KENYA.<br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
              FROM ANYWHERE.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Stop sending money back home on blind trust. We deploy vetted, independent local inspectors to physically verify construction progress, cadastral beacons, inventory, and family wellbeing across all 47 Kenyan counties.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all"
            >
              <span>Initiate Ground Verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#fee-estimator"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/10 backdrop-blur-sm transition-all text-center"
            >
              Calculate Indicative Fee
            </a>
          </div>

          {/* Trust Invariant Badges */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-xs text-slate-400">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero Conflict of Interest</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>SHA-256 Hashed Evidence</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>47 Counties Covered</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Kenya DPA & GDPR Safe</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Diaspora Dilemma vs DiasporaVerify Solution */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            The Remittance Reality
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900">
            Why Hundreds of Diaspora Projects Stall or Disappear
          </h2>
          <p className="text-sm text-slate-600">
            Sending remittances without independent ground verification exposes your hard-earned funds to misleading contractor updates, ghost materials, and family friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-rose-50/70 border border-rose-200 space-y-4">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm uppercase tracking-wider">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>The Blind Remittance Trap</span>
            </div>
            <ul className="space-y-3 text-xs text-rose-950">
              <li className="flex items-start gap-2">
                <span className="font-bold text-rose-600 text-sm">✕</span>
                <span>Contractor sends blurry WhatsApp photos shot from misleading angles hiding incomplete walls.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-rose-600 text-sm">✕</span>
                <span>You release KES 450,000 for Milestone 3, only to find cement was diverted and foundation is unpoured.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-rose-600 text-sm">✕</span>
                <span>Family members feel uncomfortable challenging workers, leading to strained relationships and delayed work.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-rose-600 text-sm">✕</span>
                <span>Land bought from abroad turns out to have missing beacons, road access disputes, or squatters.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/70 border border-emerald-200 space-y-4">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm uppercase tracking-wider">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>The DiasporaVerify Guarantee</span>
            </div>
            <ul className="space-y-3 text-xs text-emerald-950">
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-600 text-sm">✓</span>
                <span>Independent, vetted county inspector arrives on site and logs automated GPS ground check-in.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-600 text-sm">✓</span>
                <span>Repeat-angle photographs with cryptographic SHA-256 hashing to prove exact timestamped progress.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-600 text-sm">✓</span>
                <span>Physical count of bagged materials and verified discrepancy alerts (Stop-Payment advisory).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-600 text-sm">✓</span>
                <span>You hold 100% control of your funds: release payments only when physical milestones are verified.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 7 Core Service Pillars */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              7 Core Service Pillars
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900">
              Field Verification Across Every Dimension
            </h2>
            <p className="text-sm text-slate-600">
              Every service is conducted under strict independence rules, calibrated repeat photography, and explicit boundary disclosures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCategories.map((s, i) => (
              <div 
                key={i} 
                className="bg-slate-50 hover:bg-white rounded-3xl border border-slate-200 p-6 space-y-4 hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                      {s.icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                      {s.tagline}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>

                  <div className="pt-2 border-t border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Inspection Protocol:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {s.checklist.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span className="truncate">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <p className="text-[10px] text-slate-500 italic bg-white p-2 rounded-xl border border-slate-100">
                    <strong>Boundary:</strong> {s.boundary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5-Step Workflow */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Methodology & Invariants
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900">
            The 5-Step Verification Lifecycle
          </h2>
          <p className="text-sm text-slate-600">
            A repeatable, auditable standard designed to safeguard client capital from intake through final decision.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((st, i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3 shadow-sm relative">
              <div className="text-3xl font-black font-display text-emerald-600/40">
                {st.num}
              </div>
              <h4 className="text-base font-bold text-slate-900">{st.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
              <div className="pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Actor: {st.actor}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Fee Estimator */}
      <section id="fee-estimator" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
              Transparent Pricing
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
              Instant Indicative Verification Fee Estimator
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              No hidden fees. Every quote is transparently calculated based on service complexity, county logistics travel, and required urgency.
            </p>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Service Category</label>
                <select
                  value={estCategory}
                  onChange={(e) => setEstCategory(e.target.value as ServiceCategory)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none"
                >
                  <option value="construction">Construction Oversight</option>
                  <option value="property">Land & Property</option>
                  <option value="vehicle">Vehicle & Equipment</option>
                  <option value="business">Commercial & Vendor</option>
                  <option value="family">Family Welfare</option>
                  <option value="document">Document Legwork</option>
                  <option value="custom">Custom Mission</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Target County</label>
                <select
                  value={estCounty}
                  onChange={(e) => setEstCounty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none"
                >
                  {KENYA_COUNTIES.slice(0, 15).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="Other">Other County (Regional Hub)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Turnaround Urgency</label>
                <select
                  value={estUrgency}
                  onChange={(e) => setEstUrgency(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none"
                >
                  <option value="standard">Standard (3–5 Days)</option>
                  <option value="priority">Priority (48 Hours)</option>
                  <option value="urgent">Urgent Deployment (24 Hours)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Currency</label>
                <select
                  value={estCurrency}
                  onChange={(e) => setEstCurrency(e.target.value as CurrencyCode)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none"
                >
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="KES">KES (KSh)</option>
                  <option value="AED">AED (AED)</option>
                  <option value="CAD">CAD (C$)</option>
                  <option value="AUD">AUD (A$)</option>
                </select>
              </div>
            </div>

            {/* Calculated Breakdown Card */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[11px] text-slate-400 block">Indicative Comprehensive Fee</span>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                    {FORMAT_CURRENCY(feeBreakdown.totalKES, estCurrency)}
                  </div>
                </div>

                <button
                  onClick={onGetStarted}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <span>Book This Verification</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-400">
                <div>
                  <span className="text-[10px] text-slate-500 block">Service Base Fee</span>
                  <span className="font-semibold text-slate-200">{FORMAT_CURRENCY(feeBreakdown.serviceBaseFeeKES, estCurrency)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">County Travel Logistics</span>
                  <span className="font-semibold text-slate-200">{FORMAT_CURRENCY(feeBreakdown.countyTravelFeeKES, estCurrency)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Calibrated Equipment QA</span>
                  <span className="font-semibold text-slate-200">{FORMAT_CURRENCY(feeBreakdown.fieldOperationsFeeKES, estCurrency)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Nairobi HQ Platform QA</span>
                  <span className="font-semibold text-slate-200">{FORMAT_CURRENCY(feeBreakdown.platformFeeKES, estCurrency)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Boundaries Invariant Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900">
              Core Trust Principles & Legal Boundaries
            </h2>
            <p className="text-xs text-slate-500">
              Transparent rules governing every assignment and report issued by DiasporaVerify.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Evidence, Not Certification</span>
              </div>
              <p className="leading-relaxed">
                “A photo is evidence of what it shows, not proof of ownership, quality, or completion.” We report observed physical facts without ambiguous green “approved” rubber stamps.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Escrow or Contractor Bias</span>
              </div>
              <p className="leading-relaxed">
                “DiasporaVerify does not hold client funds or contractor escrow.” We keep the inspector completely separate from the contractor. You decide when to release funds.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Conflict of Interest Clearance</span>
              </div>
              <p className="leading-relaxed">
                Every verifier must sign a binding legal declaration certifying zero commercial, financial, or familial relationship to any party associated with the site.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Immediate Assistance Banner */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-emerald-600 text-white">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-lg font-bold flex items-center justify-center sm:justify-start gap-2">
              <Phone className="w-5 h-5 text-emerald-200" />
              <span>Need Immediate Ground Verification in Kenya?</span>
            </h3>
            <p className="text-xs text-emerald-100">
              Speak directly with our Nairobi Operations Coordinator on WhatsApp.
            </p>
          </div>
          <a
            href="https://wa.me/254712345678?text=Hello%20DiasporaVerify%20Operations%2C%20I%20need%20on-ground%20verification%20for%20my%20property%20in%20Kenya."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-white text-emerald-800 font-bold text-xs hover:bg-slate-100 shadow-md transition-all whitespace-nowrap"
          >
            Chat with Operations (+254 712 345 678)
          </a>
        </div>
      </section>

      {/* Footer Call to Action */}
      <footer className="py-14 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-400 text-center space-y-6">
        <div className="max-w-3xl mx-auto space-y-3">
          <h2 className="text-xl font-bold text-white">Ready to Verify Your Asset in Kenya?</h2>
          <p className="text-xs text-slate-400">
            Submit your intake brief in under 3 minutes. Receive a confirmed plan, vetted inspector match, and indicative quote today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onGetStarted}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all"
            >
              Get Started Now
            </button>
            <button
              onClick={onViewLegal}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all"
            >
              Legal, Privacy & Boundaries
            </button>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 pt-6 border-t border-slate-900 max-w-4xl mx-auto">
          DiasporaVerify Holdings Ltd • Nairobi HQ: The Promenade, General Mathenge Dr, Westlands • Regulated under Kenya Data Protection Act 2019 & UK GDPR.
        </div>
      </footer>

    </div>
  );
};
