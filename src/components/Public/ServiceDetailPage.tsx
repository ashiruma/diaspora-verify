import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Car, 
  Briefcase, 
  HeartHandshake, 
  Compass, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  FileText, 
  Lock, 
  AlertTriangle,
  HelpCircle,
  Clock
} from '../Icons';
import { getServiceBySlug } from '../../data/servicesData';
import { Footer } from './Footer';

export const ServiceDetailPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const service = getServiceBySlug(categoryId || '');

  if (!service) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4 font-sans">
        <h2 className="text-2xl font-bold text-slate-900">Service Category Not Found</h2>
        <p className="text-sm text-slate-500">The requested service category does not exist in our catalog.</p>
        <button 
          onClick={() => navigate('/services')}
          className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
        >
          View All Services
        </button>
      </div>
    );
  }

  const getIcon = (name: string) => {
    switch (name) {
      case 'Building2': return <Building2 className="w-8 h-8 text-emerald-400" />;
      case 'Car': return <Car className="w-8 h-8 text-blue-400" />;
      case 'Briefcase': return <Briefcase className="w-8 h-8 text-amber-400" />;
      case 'HeartHandshake': return <HeartHandshake className="w-8 h-8 text-rose-400" />;
      default: return <Compass className="w-8 h-8 text-purple-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col justify-between text-left">
      <div>
        {/* Header Breadcrumbs & Hero */}
        <div className="bg-slate-50 text-slate-900 py-12 sm:py-16 border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => navigate('/services')}
                className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Services</span>
              </button>
            </div>

            <div className="flex items-start gap-4 sm:gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center shrink-0">
                {getIcon(service.iconName)}
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-slate-900">
                  {service.title}
                </h1>
                <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                  {service.tagline}
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate(`/new-request?category=${service.slug}`)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Request a Quote for {service.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/how-it-works')}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs transition-colors cursor-pointer"
              >
                How It Works →
              </button>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          
          {/* Section 1: Service Overview */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-xl font-bold font-display text-slate-900">
              Service Overview
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {service.overview}
            </p>
          </section>

          {/* Section 2: Use Cases */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-xl font-bold font-display text-slate-900">
              Appropriate Use Cases
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {service.useCases.map((uc, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{uc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Inclusions vs Exclusions */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* What is Included */}
            <div className="bg-white rounded-3xl border border-emerald-200/90 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3>What Is Included</h3>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {service.included.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What is Excluded */}
            <div className="bg-white rounded-3xl border border-rose-200/90 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-base">
                <XCircle className="w-5 h-5 text-rose-600" />
                <h3>What Is Excluded (Boundaries)</h3>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {service.excluded.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 4: Evidence Deliverables */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold font-display text-slate-900">
                Evidence You Will Receive
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Findings are categorized using our rigorous 4-state standard: Observed, Partly Observed, Not Observed, or Cannot Confirm.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {service.evidenceDeliverables.map((ev, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{ev}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Access Permissions & Specialist Requirements */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Lock className="w-4 h-4 text-slate-600" />
                <h3>Required Access & Permissions</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                {service.accessPermissionsRequired.map((perm, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-slate-400 font-bold">•</span>
                    <span>{perm}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Clock className="w-4 h-4 text-slate-600" />
                <h3>Specialist Coordination</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {service.specialistRequirements}
              </p>
            </div>
          </section>

          {/* Section 6: Typical Workflow */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900">
                Typical Execution Workflow
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                From brief definition to final report delivery and client decision.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {service.typicalWorkflow.map((step) => (
                <div key={step.step} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                    Stage {step.step}
                  </span>
                  <div className="font-bold text-slate-900">{step.title}</div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 7: FAQs */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-slate-700" />
              <h2 className="text-xl font-bold font-display text-slate-900">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-4">
              {service.faqs.map((faq, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                  <h4 className="font-bold text-slate-900">{faq.question}</h4>
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 8: Disclaimer & Final Quote CTA */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Transparent Quoting & Boundary Notice</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {service.disclaimer} We do not publish unvalidated fixed prices or promise instant completion before access and feasibility are confirmed by Nairobi HQ coordinators.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <div>
                <h3 className="text-lg font-bold">Ready to scope a {service.title} task?</h3>
                <p className="text-xs text-slate-400">Submit your brief without obligation. A coordinator will review feasibility within 24 hours.</p>
              </div>
              <button
                onClick={() => navigate(`/new-request?category=${service.slug}`)}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-colors cursor-pointer shrink-0"
              >
                Request a Service Quote →
              </button>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};
