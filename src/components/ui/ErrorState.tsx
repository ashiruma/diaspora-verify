import React from 'react';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  actionText?: string;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something didn’t load as expected',
  message,
  onRetry,
  actionText = 'Try Again',
  className = '',
}) => {
  return (
    <div
      className={`text-center py-8 px-6 rounded-2xl border border-rose-100 bg-rose-50/50 flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 mb-2.5">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-xs font-bold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-600 max-w-sm mt-1 mb-3 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 transition-colors shadow-xs"
        >
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
