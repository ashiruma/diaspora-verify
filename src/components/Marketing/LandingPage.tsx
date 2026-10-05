import React from 'react';
import { ShieldCheck, Building, MapPin, Car, Briefcase, Heart, Compass, CheckCircle2, AlertTriangle, Camera, Clock, FileText, Globe, Users, Eye, Phone, MessageSquare, ArrowRight } from '../Icons';
import { FORMAT_CURRENCY } from '../../data/mockData';
import { CurrencyCode } from '../../types';

export const LandingPage: React.FC<{ onGetStarted: () => void; onViewServices: () => void; onViewLegal: () => void; currency: CurrencyCode }> = ({ onGetStarted, onViewServices, onViewLegal, currency }) => {
  return (
    <div className="font-sans text-slate-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 via-emerald-900 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Trusted Eyes and Hands on the Ground in Kenya</h1>
          <p className="text-lg md:text-xl mb-8">Living abroad should not mean relying on guesswork for everything happening back home.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={onGetStarted} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded transition">
              Tell Us Your Task
            </button>
            <button onClick={onViewServices} className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-6 rounded transition">
              View Our Services
            </button>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm opacity-80">
            <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-1" /> Kenya Ground Verified</span>
            <span className="flex items-center"><Eye className="w-4 h-4 mr-1" /> GDPR Compliant</span>
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1" /> SHA‑256 Evidence</span>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">The Diaspora Dilemma</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {icon: <MapPin className="w-8 h-8 text-emerald-600" />, title: 'Can’t See the Site', desc: 'You have no eyes on the ground to confirm progress.'},
              {icon: <AlertTriangle className="w-8 h-8 text-emerald-600" />, title: 'Sending Money on Trust', desc: 'Payments are made blind, risking fraud or incomplete work.'},
              {icon: <Users className="w-8 h-8 text-emerald-600" />, title: 'No Independent Accountability', desc: 'No third‑party verification, disputes stay unresolved.'},
            ].map((c, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded shadow-sm text-center">
                {c.icon}
                <h3 className="font-semibold mt-3 mb-2">{c.title}</h3>
                <p className="text-sm text-slate-600">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Portfolio */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {icon: <Building className="w-8 h-8 text-emerald-600" />, title: 'Construction', desc: 'Baseline & milestone site checks.', boundary: 'Inspector ≠ contractor', uses: ['Foundation validation', 'Progress tracking', 'Payment gating']},
              {icon: <MapPin className="w-8 h-8 text-emerald-600" />, title: 'Property', desc: 'Condition and title verification.', boundary: 'No legal conveyancing', uses: ['Rental property audit', 'Sale verification', 'Insurance checks']},
              {icon: <Car className="w-8 h-8 text-emerald-600" />, title: 'Vehicle', desc: 'VIN, condition, provenance.', boundary: 'No mechanical repair', uses: ['Used‑car purchase', 'Import verification', 'Insurance claim support']},
              {icon: <Briefcase className="w-8 h-8 text-emerald-600" />, title: 'Business', desc: 'Stock, premises, operations.', boundary: 'Not a full audit', uses: ['Inventory snap', 'Vendor compliance', 'Cash‑flow sanity']},
              {icon: <Heart className="w-8 h-8 text-emerald-600" />, title: 'Family', desc: 'Welfare visits and care coordination.', boundary: 'Requires consent', uses: ['Elderly check‑in', 'Medical appointment support', 'Emergency escalation']},
              {icon: <Compass className="w-8 h-8 text-emerald-600" />, title: 'Custom', desc: 'Any lawful local task.', boundary: 'Scope defined upfront', uses: ['Document collection', 'Local courier', 'Specialist referral']},
            ].map((s, i) => (
              <div key={i} className="bg-white p-6 rounded shadow-sm">
                {s.icon}
                <h3 className="font-semibold mt-3 mb-1">{s.title}</h3>
                <p className="text-sm text-slate-600 mb-2">{s.desc}</p>
                <p className="text-xs text-emerald-600 italic mb-2">{s.boundary}</p>
                <ul className="list-disc list-inside text-xs text-slate-500 space-y-1">
                  {s.uses.map((u, j) => (<li key={j}>{u}</li>))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {['Define', 'Assign', 'Act', 'Review', 'Decide'].map((step, i) => (
              <div key={i} className="flex-1 text-center">
                <div className="w-12 h-12 mx-auto bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-bold mb-2">{i+1}</div>
                <h4 className="font-semibold">{step}</h4>
                {i < 4 && <div className="h-1 w-12 bg-emerald-300 mx-auto mt-2"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Guidance */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Pricing Guidance</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {title: 'One‑Time Check', priceK: 15000, desc: 'Confirm a product, location, asset, vendor or single situation before committing money'},
              {title: 'Follow‑Through', priceK: 35000, desc: 'Two or more actions: visit, comparison, purchase coordination, delivery confirmation'},
              {title: 'Ongoing Assistant', priceK: 75000, desc: 'Regular checks and coordination for farm, business, property, or family member'},
            ].map((p, i) => (
              <div key={i} className="bg-white p-6 rounded shadow-sm text-center">
                <h3 className="font-semibold mb-2">{p.title}</h3>
                <p className="text-sm text-slate-600 mb-3">{p.desc}</p>
                <div className="text-2xl font-bold mb-2">{FORMAT_CURRENCY(p.priceK, currency)}</div>
                {p.title === 'Ongoing Assistant' && <div className="text-xs text-slate-500">/mo</div>}
              </div>
            ))}
          <p className="text-center text-sm text-slate-600 mt-4">All prices are indicative. Each task is quoted individually after intake.</p>
        </div>
      </section>

      {/* Sample Report Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto border rounded shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Sample Milestone Report</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Project:</strong> Kiambu Residence</p>
            <p><strong>Visit Date:</strong> 25 Sept 2026</p>
            <p><strong>Status:</strong> Partly Observed</p>
            <p><strong>Key Finding:</strong> Foundation complete, walls at 40% vs 65% claimed.</p>
            <p className="italic text-slate-500">*Report includes SHA‑256 hash of each photo and immutable audit trail.*</p>
          </div>
          <button className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded">Download Sample Report</button>
        </div>
      </section>

      {/* Trust & Boundaries */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Trust & Boundaries</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 max-w-3xl mx-auto">
            <li>A photo is evidence of what it shows, not proof of ownership.</li>
            <li>DiasporaVerify does not hold or release construction funds.</li>
            <li>We separate the inspector from the contractor.</li>
            <li>Every report states what could NOT be confirmed.</li>
          </ul>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-emerald-600 text-white text-center">
        <h2 className="text-xl font-semibold mb-2">Prefer WhatsApp?</h2>
        <p className="mb-4">Send us your task details directly.</p>
        <a href="https://wa.me/254700000000?text=Hello%20DiasporaVerify%2C%20I%20need%20help%20with%20..." className="inline-block bg-white text-emerald-600 font-semibold py-2 px-6 rounded hover:bg-slate-100 transition">
          Chat on WhatsApp
        </a>
      </section>

      {/* Footer CTA */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white text-center">
        <h2 className="text-xl font-semibold mb-4">Ready to start?</h2>
        <p className="mb-6">Tell us the task, location and deadline. We will confirm whether we can help and send a clear quote and plan.</p>
        <button onClick={onGetStarted} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded mr-3">Get Started</button>
        <button onClick={onViewLegal} className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-2 px-6 rounded">Legal & Privacy</button>
      </section>
    </div>
  );
};
