import React from 'react';

export interface TimelineStep {
  id: string;
  label: string;
  description?: string;
  timestamp?: string;
  status: 'completed' | 'current' | 'upcoming' | 'flagged';
}

export interface TimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ steps, className = '' }) => {
  return (
    <div className={`w-full py-4 ${className}`}>
      {/* Desktop Horizontal View */}
      <div className="hidden lg:flex items-start justify-between relative">
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />
        
        {steps.map((step, idx) => {
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';
          const isFlagged = step.status === 'flagged';

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center text-center flex-1 px-1">
              {/* Node Icon */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                  isCompleted
                    ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-50'
                    : isCurrent
                    ? 'bg-slate-900 text-white shadow-sm ring-4 ring-slate-100 animate-pulse'
                    : isFlagged
                    ? 'bg-amber-500 text-white ring-4 ring-amber-50'
                    : 'bg-white text-slate-400 border-2 border-slate-300'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                ) : isFlagged ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              {/* Title and metadata */}
              <div className="mt-2.5 space-y-0.5">
                <div
                  className={`text-xs font-bold ${
                    isCurrent ? 'text-slate-900' : isCompleted ? 'text-slate-800' : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </div>
                {step.timestamp && (
                  <div className="text-[10px] text-slate-400 font-medium">{step.timestamp}</div>
                )}
                {step.description && (
                  <div className="text-[10px] text-slate-500 max-w-[120px] mx-auto line-clamp-1">
                    {step.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile / Tablet Vertical View */}
      <div className="lg:hidden space-y-4 relative pl-6 before:content-[''] before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {steps.map((step, idx) => {
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';
          const isFlagged = step.status === 'flagged';

          return (
            <div key={step.id} className="relative flex items-start gap-3">
              <div
                className={`absolute -left-6 top-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  isCompleted
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-slate-900 text-white ring-4 ring-slate-100'
                    : isFlagged
                    ? 'bg-amber-500 text-white ring-4 ring-amber-50'
                    : 'bg-white text-slate-400 border-2 border-slate-300'
                }`}
              >
                {isCompleted ? '✓' : idx + 1}
              </div>
              <div className="space-y-0.5 text-left">
                <div className={`text-xs font-bold ${isCurrent ? 'text-slate-900' : 'text-slate-700'}`}>
                  {step.label}
                </div>
                {step.description && <p className="text-[11px] text-slate-500">{step.description}</p>}
                {step.timestamp && <p className="text-[10px] text-slate-400">{step.timestamp}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
