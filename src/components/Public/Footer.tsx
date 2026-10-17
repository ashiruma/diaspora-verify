import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Mail, 
  Lock, 
  Building2,
  Car,
  Briefcase,
  HeartHandshake,
  Compass
} from '../Icons';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#12100e] text-[#a8a199] border-t border-[#b89a62]/30 text-left font-sans relative overflow-hidden">
      {/* Top subtle specular hairline */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-emerald-600/40 flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-xl font-bold font-display tracking-tight text-[#faf8f5]">
                Diaspora<span className="text-emerald-400">Verify</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#d6cec3] max-w-sm leading-relaxed">
              Your trusted eyes and hands on the ground in Kenya. Independent on-ground visits, documented evidence, and accountable local coordination before you make decisions or send funds.
            </p>

            <div className="pt-2 text-xs text-[#a8a199] space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Nairobi Operations Desk · Kenya Pilot Foundation</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>info@diasporaverify.co.ke</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Kenya Data Protection Act (DPA 2019) Compliant</span>
              </div>
            </div>
          </div>

          {/* Master Service Categories */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#faf8f5]">
              Service Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => navigate('/services/projects-assets')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <Building2 className="w-3 h-3 text-emerald-500" />
                  <span>Projects & Assets</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/services/purchases-vehicles')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <Car className="w-3 h-3 text-emerald-500" />
                  <span>Purchases & Vehicles</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/services/business-support')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <Briefcase className="w-3 h-3 text-emerald-500" />
                  <span>Business Support</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/services/family-support')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <HeartHandshake className="w-3 h-3 text-emerald-500" />
                  <span>Family Support</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/services/custom-requests')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <Compass className="w-3 h-3 text-emerald-500" />
                  <span>Custom Requests</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Platform & How It Works */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#faf8f5]">
              How It Works & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => navigate('/how-it-works')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  5-Stage Verification Process
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/sample-report')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left text-emerald-400 font-medium"
                >
                  Sample Demonstration Report ↗
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/about')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  About DiasporaVerify & Principles
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/contact')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Contact & Inquiries
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/service-model')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Operational Doctrine & Limits
                </button>
              </li>
            </ul>
          </div>

          {/* Legal, Safeguards & Client Controls */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#faf8f5]">
              Legal & Boundaries
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => navigate('/legal?doc=terms')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Terms of Service & Retainers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/legal?doc=privacy')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Privacy Policy & DPA 2019
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/legal?doc=boundaries')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Operational Scope Limitations
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/legal?doc=codeOfConduct')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Field Agent Code of Conduct
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/login')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left text-[#a8a199]"
                >
                  Client Portal Sign In →
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Operational Disclaimer & Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#26221d] text-[11px] text-[#8c8479] space-y-3">
          <p className="leading-relaxed">
            <strong className="text-[#d6cec3]">Operational Disclaimer:</strong> DiasporaVerify provides independent observation and documented factual evidence. We do not provide statutory structural engineering warranties, legal conveyancing, or clinical medical rescue services. Every accepted mission requires a signed scope brief, verified access permission, and itemized fee agreement.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[#8c8479]">
            <div>
              © {new Date().getFullYear()} DiasporaVerify. All rights reserved. Registered operations in Nairobi, Kenya.
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] uppercase tracking-wider font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30" />
                Active Nairobi Pilot
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
