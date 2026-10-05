import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, ArrowLeft } from '../Icons';

export type LegalDocType = 'terms' | 'privacy' | 'boundaries' | 'code_of_conduct';

interface LegalAndComplianceProps {
  initialDoc?: LegalDocType;
  onBack?: () => void;
}

export const LegalAndCompliance: React.FC<LegalAndComplianceProps> = ({ 
  initialDoc = 'terms',
  onBack 
}) => {
  const [activeDoc, setActiveDoc] = useState<LegalDocType>(initialDoc);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Top Banner & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Return to previous view"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-black font-display text-slate-950 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              Legal & Trust Governance Center
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Statutory Compliance under Kenya Data Protection Act 2019, UK GDPR, and EU GDPR
            </p>
          </div>
        </div>

        {/* Advocate Review Mandatory Notice */}
        <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-semibold flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>DRAFT NOTICE: Pending final certification by a High Court of Kenya Advocate</span>
        </div>
      </div>

      {/* Document Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveDoc('terms')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeDoc === 'terms'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Terms of Service
        </button>
        <button
          onClick={() => setActiveDoc('privacy')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeDoc === 'privacy'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Privacy Policy (Kenya DPA + GDPR)
        </button>
        <button
          onClick={() => setActiveDoc('boundaries')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeDoc === 'boundaries'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Service Boundaries & Disclaimers
        </button>
        <button
          onClick={() => setActiveDoc('code_of_conduct')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeDoc === 'code_of_conduct'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Field Agent Code of Conduct
        </button>
      </div>

      {/* Document Viewer Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8 text-slate-800 text-xs leading-relaxed">

        {/* ------------------------------------------------------------------ */}
        {/* TERMS OF SERVICE */}
        {/* ------------------------------------------------------------------ */}
        {activeDoc === 'terms' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold">Standard Client Agreement</span>
              <h2 className="text-xl font-bold text-slate-950">DiasporaVerify Terms of Service</h2>
              <p className="text-[11px] text-slate-500">Effective Date: October 2026 • Version 1.0 (Pilot Edition)</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-[11px] space-y-1">
              <span className="font-bold">Legal Notice & Institutional Placeholders:</span>
              <p>
                Operated by <strong>[DIASPORAVERIFY_HOLDINGS_LTD]</strong>, a private limited liability company incorporated under the Companies Act of Kenya (Reg No: <strong>[CPR/2026/REGISTERED_NUMBER_PENDING]</strong>), with registered offices at <strong>[OFFICE_SUITE_PLACEHOLDER, NAIROBI, KENYA]</strong>. Official inquiries: <strong>support@diaspora-verify.ke</strong> | WhatsApp: <strong>+254 700 000 000</strong>.
              </p>
            </div>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">1. Nature of the Service</h3>
              <p>
                DiasporaVerify provides independent observation, photographic and video walkthrough records, physical asset checks, and structured decision briefs in Kenya for individuals resident abroad. DiasporaVerify acts strictly as an objective verification coordinator and fact-gatherer.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">2. Separation of Construction Funds & Payments</h3>
              <p>
                Under no circumstances does DiasporaVerify receive, hold, manage, or disburse construction capital, purchase funds, or contractor escrow. All payments for property, materials, or building works must be executed directly by the client to their chosen vendor. DiasporaVerify records client decisions for logging and accountability purposes only.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">3. Quoting, Fees, and Paystack Billing</h3>
              <p>
                Each request is quoted individually following digital intake based on location, access complexity, travel effort, and reporting speed. Service fees are collected via licensed payment gateways (including Paystack Kenya Ltd) prior to dispatch of on-ground personnel. Quotes exclude third-party professional certification fees (e.g. registered structural engineers, licensed land surveyors).
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">4. Limitations of Visual Evidence</h3>
              <p>
                A visual photograph or video walkthrough constitutes evidence solely of visible conditions at the date, time, and coordinates recorded. It does not certify sub-surface reinforcement compression strength, electrical load compliance, soil stability, or statutory ownership validity.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">5. Governing Law & Dispute Resolution</h3>
              <p>
                These Terms are governed by the Laws of the Republic of Kenya. Any dispute arising out of or in connection with these Terms shall be referred to arbitration under the Nairobi Centre for International Arbitration (NCIA) Rules.
              </p>
            </section>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* PRIVACY POLICY */}
        {/* ------------------------------------------------------------------ */}
        {activeDoc === 'privacy' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold">Data Subject Rights & Cross-Border Processing</span>
              <h2 className="text-xl font-bold text-slate-950">Privacy Policy</h2>
              <p className="text-[11px] text-slate-500">Compliance: Kenya Data Protection Act 2019 • UK GDPR • EU Regulation 2016/679</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-[11px] space-y-1">
              <span className="font-bold">ODPC Registration Status:</span>
              <p>
                DiasporaVerify is committed to compliance as a Data Controller and Data Processor with the Office of the Data Protection Commissioner of Kenya (ODPC Certificate Reg: <strong>[ODPC/REG/2026/PENDING_ISSUANCE]</strong>). Data Protection Officer (DPO): <strong>privacy@diaspora-verify.ke</strong>.
              </p>
            </div>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">1. Data We Collect</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Diaspora Client Data:</strong> Full name, country of residence abroad (UK, USA, EU, Gulf states, Canada/Australia), email address, telephone contact, preferred currency.</li>
                <li><strong>Local Contact & Property Data:</strong> County, plot coordinates, physical landmarks, contractor/vendor telephone contacts, title/deed documentation submitted for visual comparison.</li>
                <li><strong>Ground Evidence & Cryptographic Hashes:</strong> High-resolution photos, walkthrough video feeds, GPS coordinate tags, and immutable SHA-256 tamper-evident integrity fingerprints.</li>
                <li><strong>Family Support Sensitive Data:</strong> Welfare observations of elderly relatives or dependents, emergency contact information, and verified guardian consent records.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">2. Lawful Bases for Processing</h3>
              <p>
                We process your personal data under Article 30 of the Kenya Data Protection Act 2019 and Article 6 of the GDPR: (a) Performance of a contract (delivering ground inspection briefs); (b) Explicit consent (for family care accompaniment); (c) Legitimate interest (preventing remittance fraud and identity theft).
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">3. Cross-Border Data Transfers</h3>
              <p>
                Personal data collected from Kenyans abroad in the UK, EU, USA, and Gulf region is transferred to secure cloud infrastructure (Supabase EU/AWS region) and processed by authorized coordinators in Kenya under appropriate safeguards, standard contractual clauses, and encryption in transit (TLS 1.3) and at rest (AES-256).
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">4. Data Subject Rights & Retention</h3>
              <p>
                You retain the right to access, rectify, or request erasure of your data, or restrict processing by emailing <strong>privacy@diaspora-verify.ke</strong>. Inspection records are retained for seven (7) years to support historical property milestones, after which they are permanently anonymized or deleted.
              </p>
            </section>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* SERVICE BOUNDARIES */}
        {/* ------------------------------------------------------------------ */}
        {activeDoc === 'boundaries' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold">Operational Scope & Specialist Referrals</span>
              <h2 className="text-xl font-bold text-slate-950">Service Boundaries & Independence Doctrine</h2>
              <p className="text-[11px] text-slate-500">Document 1 & Document 2 Invariants</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  What DiasporaVerify Does
                </h4>
                <ul className="space-y-1.5 text-[11px] text-slate-600">
                  <li>• Independent physical site visits by vetted local agents.</li>
                  <li>• Repeatable camera angle comparisons across agreed construction milestones.</li>
                  <li>• Physical stock, vehicle, and land beacon existence observation.</li>
                  <li>• Delivery of neutral observation briefs: <em>Observed</em>, <em>Partly Observed</em>, <em>Not Observed</em>, or <em>Cannot Confirm</em>.</li>
                  <li>• Transparent stop-payment warning triggers upon discrepancy detection.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                <h4 className="font-bold text-rose-950 text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  What DiasporaVerify NEVER Does (Boundaries)
                </h4>
                <ul className="space-y-1.5 text-[11px] text-rose-900">
                  <li>• We do NOT certify structural engineering safety or foundation concrete compression.</li>
                  <li>• We do NOT issue official legal title guarantees (refer to licensed Advocates).</li>
                  <li>• We do NOT hold, escrow, or disburse client construction capital.</li>
                  <li>• We do NOT provide clinical medical diagnosis or medical healthcare.</li>
                  <li>• We NEVER display a green "Approved" certification badge that implies statutory sign-off.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* FIELD AGENT CODE OF CONDUCT */}
        {/* ------------------------------------------------------------------ */}
        {activeDoc === 'code_of_conduct' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold">Field Personnel Integrity Protocol</span>
              <h2 className="text-xl font-bold text-slate-950">Field Agent Code of Conduct</h2>
              <p className="text-[11px] text-slate-500">Document 1, Section 5 Trust Controls</p>
            </div>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">1. Strict Conflict of Interest Disclosures</h3>
              <p>
                Every field verifier must sign a mandatory conflict clearance for each assigned job. Agents are strictly prohibited from inspecting sites where they possess any commercial, familial, or referral affiliation with the contractor, vendor, broker, or fund requester.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">2. Anti-Bribery & Zero-Kickback Invariant</h3>
              <p>
                Field personnel are strictly prohibited from soliciting or accepting tips, gifts, meals, or payments from contractors or property sellers. Acceptance of any gratuity constitutes immediate termination and referral to the Directorate of Criminal Investigations (DCI).
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">3. Photographic & Evidence Truthfulness</h3>
              <p>
                Agents must capture live, in-situ photographs with active GPS tagging and authentic timestamps. Any use of cached, staged, altered, or fabricated imagery constitutes gross professional misconduct. When a site area cannot be accessed safely, the agent must explicitly document it as <em>Cannot Confirm</em>.
              </p>
            </section>
          </div>
        )}

      </div>

    </div>
  );
};
