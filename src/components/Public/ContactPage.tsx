import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertTriangle,
  ArrowLeft
} from '../Icons';
import { Footer } from './Footer';

export const ContactPage: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    countryAbroad: '',
    category: 'projects_assets',
    county: 'Nairobi',
    message: '',
    honeypot: '' // Spam protection bot trap
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Bot trap check
    if (form.honeypot) {
      // Silently discard spam bots
      setSubmitted(true);
      return;
    }

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please complete all required fields.');
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);

    // In a real implementation this sends via configured backend route.
    // For now, simulate clean server recording with verified feedback:
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col justify-between text-left">
      <div>
        {/* Hero Section */}
        <div className="bg-[#172A3A] text-white py-14 sm:py-20 border-b border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>Nairobi HQ Operations Desk</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white max-w-3xl">
              Speak with our coordination desk.
            </h1>

            <p className="text-sm sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Have a question about pilot coverage, pricing principles, or a custom verification task? Send an inquiry or submit a formal brief without obligation.
            </p>
          </div>
        </div>

        {/* Content Section: Form & Verified Business Info */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            
            {/* Left 3 Columns: Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h2 className="text-xl font-bold font-display text-slate-900">
                    Send an Inquiry
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    All inquiries are reviewed directly by our Senior Operations Coordinator within 24 hours.
                  </p>
                </div>

                {submitted ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-3">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Inquiry Received Successfully</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      Thank you, <strong>{form.name}</strong>. Your message has been logged with our Nairobi Operations Desk. A coordinator will review your inquiry and follow up at <strong>{form.email}</strong> within 24 business hours.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setForm({
                            name: '',
                            email: '',
                            phone: '',
                            countryAbroad: '',
                            category: 'projects_assets',
                            county: 'Nairobi',
                            message: '',
                            honeypot: ''
                          });
                        }}
                        className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                      >
                        Send another inquiry →
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    {error && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 font-medium">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Honeypot Spam Trap (Hidden from real users) */}
                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="hp_field">Do not fill this</label>
                      <input 
                        id="hp_field"
                        type="text" 
                        value={form.honeypot} 
                        onChange={e => setForm({ ...form, honeypot: e.target.value })} 
                        tabIndex={-1} 
                        autoComplete="off" 
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          placeholder="e.g. David Mwangi"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          placeholder="e.g. david.mwangi@gmail.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700">Country You Live In</label>
                        <input
                          type="text"
                          value={form.countryAbroad}
                          onChange={e => setForm({ ...form, countryAbroad: e.target.value })}
                          placeholder="e.g. United Kingdom, USA, Canada"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700">Phone or WhatsApp (Optional)</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={e => setForm({ ...form, phone: e.target.value })}
                          placeholder="e.g. +44 7700 900077"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700">Service Category</label>
                        <select
                          value={form.category}
                          onChange={e => setForm({ ...form, category: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
                        >
                          <option value="projects_assets">Projects & Assets (Construction, Property)</option>
                          <option value="purchases_vehicles">Purchases & Vehicles</option>
                          <option value="business_support">Business Support</option>
                          <option value="family_support">Family Welfare Support</option>
                          <option value="custom_requests">Custom Request</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700">Target Kenya County</label>
                        <select
                          value={form.county}
                          onChange={e => setForm({ ...form, county: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
                        >
                          <option value="Nairobi">Nairobi (Primary Pilot Hub)</option>
                          <option value="Kiambu">Kiambu (Primary Pilot Hub)</option>
                          <option value="Machakos">Machakos (Primary Pilot Hub)</option>
                          <option value="Kajiado">Kajiado (Primary Pilot Hub)</option>
                          <option value="Nakuru">Nakuru (Regional Phase 2)</option>
                          <option value="Mombasa">Mombasa (Regional Phase 2)</option>
                          <option value="Other">Other County (Feasibility Dependent)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Your Message or Task Summary *</label>
                      <textarea
                        required
                        rows={4}
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        placeholder="Describe what you need verified or asked about..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 focus:outline-none transition-colors leading-relaxed"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                        <span>{submitting ? 'Sending to Dispatch Desk...' : 'Send Inquiry to Coordinator'}</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400 text-center">
                      Protected by Kenya Data Protection Act (DPA 2019). We never share contact details with third parties.
                    </p>
                  </form>
                )}
              </div>
            </div>

            {/* Right 2 Columns: Official Contact Details & Desk Hours */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4 text-xs">
                <h3 className="font-bold text-slate-900 text-sm">
                  Operations Desk Details
                </h3>

                <div className="space-y-3 text-slate-600">
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-800">Direct Inquiries Email</div>
                      <div className="text-slate-500 font-mono">info@diasporaverify.co.ke</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-800">Physical Operations Center</div>
                      <div className="text-slate-500">Nairobi Operations Desk, Kilimani / Upper Hill, Nairobi, Kenya</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-800">Operating Review Hours</div>
                      <div className="text-slate-500">Monday – Saturday: 08:00 – 18:00 EAT (UTC+3)</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Emergency escalations monitored 24/7</div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-emerald-800 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>24-Hour Review Response Standard</span>
                </div>
              </div>

              {/* Ready to Scope a Full Mission */}
              <div className="bg-[#172A3A] text-white rounded-3xl p-6 shadow-xs space-y-3 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                  READY TO START?
                </span>
                <h3 className="text-base font-bold text-white">
                  Have a specific site or item ready to check?
                </h3>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Use our structured multi-step intake wizard to submit full site directions, contact info, and desired evidence deliverables.
                </p>
                <button
                  onClick={() => navigate('/new-request')}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Launch Service Request Form →
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
