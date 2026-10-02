import React from 'react';
import type { VerificationStatus, ProcessStage, ServiceCategory } from '../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  HelpCircle,
  Building,
  MapPin,
  Car,
  Briefcase,
  Heart,
  Compass
} from './Icons';

export const StatusBadge: React.FC<{ status: VerificationStatus; size?: 'sm' | 'md' | 'lg' }> = ({ status, size = 'md' }) => {
  const configs: Record<VerificationStatus, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
    observed: {
      label: 'Observed',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
    },
    partly_observed: {
      label: 'Partly Observed',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
    },
    not_observed: {
      label: 'Not Observed',
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-300',
      icon: <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
    },
    cannot_confirm: {
      label: 'Cannot Confirm',
      bg: 'bg-purple-50',
      text: 'text-purple-800',
      border: 'border-purple-300',
      icon: <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
    }
  };

  const config = configs[status] || configs.observed;
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5 gap-1' : size === 'lg' ? 'text-sm px-3.5 py-1.5 gap-2 font-bold' : 'text-xs px-2.5 py-1 gap-1.5 font-semibold';

  return (
    <span className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export const ProcessStageBadge: React.FC<{ stage: ProcessStage }> = ({ stage }) => {
  const stageMap: Record<ProcessStage, { step: number; name: string; color: string }> = {
    define: { step: 1, name: 'Step 1: Define Scope', color: 'bg-slate-100 text-slate-800 border-slate-300' },
    assign: { step: 2, name: 'Step 2: Assign Agent', color: 'bg-blue-50 text-blue-800 border-blue-200' },
    act: { step: 3, name: 'Step 3: Ground Action', color: 'bg-amber-50 text-amber-800 border-amber-300' },
    review: { step: 4, name: 'Step 4: Review & QA', color: 'bg-purple-50 text-purple-800 border-purple-200' },
    decide: { step: 5, name: 'Step 5: Client Decision', color: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold' }
  };

  const current = stageMap[stage];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border ${current.color}`}>
      <span className="w-2 h-2 rounded-full bg-current opacity-80" />
      <span>{current.name}</span>
    </span>
  );
};

export const CategoryIcon: React.FC<{ category: ServiceCategory; className?: string }> = ({ category, className = "w-4 h-4" }) => {
  switch (category) {
    case 'construction': return <Building className={className} />;
    case 'property': return <MapPin className={className} />;
    case 'vehicle': return <Car className={className} />;
    case 'business': return <Briefcase className={className} />;
    case 'family': return <Heart className={className} />;
    default: return <Compass className={className} />;
  }
};
