import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Car, 
  Briefcase, 
  HeartHandshake, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle
} from '../Icons';
import { MASTER_SERVICES } from '../../data/servicesData';
import { Footer } from './Footer';

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();

  const getIcon = (name: string) => {
    switch (name) {
      case 'Building2': return <Building2 className="w-6 h-6 text-emerald-600" />;
      case 'Car': return <Car className="w-6 h-6 text-blue-600" />;
      case 'Briefcase': return <Briefcase className="w-6 h-6 text-amber-600" />;
      case 'HeartHandshake': return <HeartHandshake className="w-6 h-6 text-rose-600" />;
      default: return <Compass className="w-6 h-6 text-purple-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col justify-between text-left">
      <div>
        {/* Hero Section */}
        <div className="bg-[#172A3A] text-white py-14 sm:py-20 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
            <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white max-w-3xl">
              Verified ground support across five defined categories.
            </h1>

            <p className="text-sm sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Every request receives a defined scope, a vetted local verifier, dated evidence, and an objective findings report. You retain full control over decisions and spending.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Itemized quotes
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Anti-collusion dispatch
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Zero unvalidated fixed prices
              </span>
            </div>
          </div>
        </div>

        {/* 5 Service Categories List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
              Five Master Service Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              Select a category to inspect detailed use cases, evidence deliverables, required permissions, and service boundaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {MASTER_SERVICES.map((srv) => (
              <div 
                key={srv.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group hover:border-slate-300"
              >
                <div className="p-6 sm:p-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {getIcon(srv.iconName)}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      CAT-{srv.slug.slice(0, 3).toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold font-display text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {srv.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {srv.shortDescription}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Typical Checks Include:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {srv.useCases.slice(0, 3).map((uc, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{uc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 sm:p-6 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => navigate(`/services/${srv.slug}`)}
                    className="text-xs font-bold text-slate-800 hover:text-emerald-700 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>View Full Details & Limits</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => navigate(`/new-request?category=${srv.slug}`)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                  >
                    Request Quote
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Operational Boundaries Callout */}
          <div className="p-6 sm:p-8 rounded-3xl bg-amber-500/10 border border-amber-300 text-xs text-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>Mandatory Operational Boundaries & Pilot Scope</span>
            </div>
            <p className="leading-relaxed">
              DiasporaVerify operates with clear limits. Our field verifiers document visible physical reality; they are not presented as structural engineers, registered advocates, nurses, mechanics, or forensic auditors. Every accepted request begins with an agreed brief, confirmed access permissions, and an itemized fee quote before any fieldwork starts.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
