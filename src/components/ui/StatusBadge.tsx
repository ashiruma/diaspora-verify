import React from 'react';
import type { VerificationStatus, DetailedRequestStatus } from '../../types';

export interface StatusBadgeProps {
  status: VerificationStatus | DetailedRequestStatus | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-xs px-3 py-1.5 gap-2 font-semibold',
  };

  // 1. Verification status standards (Rule 1)
  switch (status) {
    case 'observed':
      return (
        <span
          className={`inline-flex items-center rounded-full border bg-emerald-50 text-emerald-800 border-emerald-200 ${sizeClasses[size]} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span>Observed</span>
        </span>
      );
    case 'partly_observed':
      return (
        <span
          className={`inline-flex items-center rounded-full border bg-amber-50 text-amber-800 border-amber-300 ${sizeClasses[size]} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          <span>Partly Observed</span>
        </span>
      );
    case 'not_observed':
      return (
        <span
          className={`inline-flex items-center rounded-full border bg-rose-50 text-rose-800 border-rose-300 ${sizeClasses[size]} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
          <span>Not Observed</span>
        </span>
      );
    case 'cannot_confirm':
      return (
        <span
          className={`inline-flex items-center rounded-full border bg-purple-50 text-purple-800 border-purple-300 ${sizeClasses[size]} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
          <span>Cannot Confirm</span>
        </span>
      );

    // 2. State Machine Lifecycle Statuses
    case 'DRAFT':
      return (
        <span
          className={`inline-flex items-center rounded-md border bg-slate-100 text-slate-700 border-slate-200 ${sizeClasses[size]} ${className}`}
        >
          <span>Draft</span>
        </span>
      );
    case 'SUBMITTED':
      return (
        <span
          className={`inline-flex items-center rounded-md border bg-sky-50 text-sky-800 border-sky-200 ${sizeClasses[size]} ${className}`}
        >
          <span>Submitted</span>
        </span>
      );
    case 'PAYMENT_PENDING':
      return (
        <span
          className={`inline-flex items-center rounded-md border bg-amber-50 text-amber-800 border-amber-200 ${sizeClasses[size]} ${className}`}
        >
          <span>Payment Pending</span>
        </span>
      );
    case 'PAID':
      return (
        <span
          className={`inline-flex items-center rounded-md border bg-emerald-50 text-emerald-800 border-emerald-200 ${sizeClasses[size]} ${className}`}
        >
          <span>Paid</span>
        </span>
      );
    case 'AWAITING_AGENT':
      return (
        <span
          className={`inline-flex items-center rounded-md border bg-indigo-50 text-indigo-800 border-indigo-200 ${sizeClasses[size]} ${className}`}
        >
          <span>Awaiting Agent</span>
        </span>
      );
    case 'AGENT_ASSIGNED':
      return (
        <span
          className={`inline-flex items-center rounded-md border bg-blue-50 text-blue-800 border-blue-200 ${sizeClasses[size]} ${className}`}
        >
          <span>Agent Assigned</span>
        </span>
      );
    case 'ACCEPTED':
      return (
        <span
          className={`inline-flex items-center rounded-md border bg-blue-50 text-blue-800 border-blue-300 ${sizeClasses[size]} ${className}`}
        >
          <span>Accepted</span>
        </span>
      );
    case 'TRAVELLING':
      return (
        <span
          className={`inline-flex items-center rounded-md border bg-teal-50 text-teal-800 border-teal-200 ${sizeClasses[size]} ${className}`}
        >
          <span>Travelling</span>
        </span>
      );
    case 'ON_SITE':
      return (
        <span
          className={`inline-flex items-center rounded-md border bg-amber-50 text-amber-800 border-amber-300 ${sizeClasses[size]} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
          <span>On Site</span>
        </span>
      );
    case 'VERIFYING':
      return (
        <span
          className={`inline-flex items-center rounded-md border bg-amber-50 text-amber-800 border-amber-200 ${sizeClasses[size]} ${className}`}
        >
          <span>Verifying</span>
        </span>
      );
    case 'EVIDENCE_SUBMITTED':
      return (
        <span
          className={`inline-flex items-center rounded-md border bg-purple-50 text-purple-800 border-purple-200 ${sizeClasses[size]} ${className}`}
        >
          <span>Evidence Submitted</span>
        </span>
      );
    case 'UNDER_REVIEW':
      return (
        <span
          className={`inline-flex items-center rounded-md border bg-purple-50 text-purple-800 border-purple-300 ${sizeClasses[size]} ${className}`}
        >
          <span>Under QA Review</span>
        </span>
      );
    case 'ADDITIONAL_INFORMATION_REQUIRED':
      return (
        <span
          className={`inline-flex items-center rounded-md border bg-amber-50 text-amber-800 border-amber-300 ${sizeClasses[size]} ${className}`}
        >
          <span>Info Required</span>
        </span>
      );
    case 'REPORT_READY':
      return (
        <span
          className={`inline-flex items-center rounded-md border bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold ${sizeClasses[size]} ${className}`}
        >
          <span>Report Ready</span>
        </span>
      );
    case 'COMPLETED':
      return (
        <span
          className={`inline-flex items-center rounded-md border bg-emerald-50 text-emerald-800 border-emerald-200 ${sizeClasses[size]} ${className}`}
        >
          <span>Completed</span>
        </span>
      );
    case 'DISPUTED':
      return (
        <span
          className={`inline-flex items-center rounded-md border bg-rose-50 text-rose-800 border-rose-300 font-semibold ${sizeClasses[size]} ${className}`}
        >
          <span>Disputed</span>
        </span>
      );
    case 'CANCELLED':
      return (
        <span
          className={`inline-flex items-center rounded-md border bg-slate-100 text-slate-600 border-slate-300 ${sizeClasses[size]} ${className}`}
        >
          <span>Cancelled</span>
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center rounded-md border bg-slate-100 text-slate-700 border-slate-200 ${sizeClasses[size]} ${className}`}
        >
          <span>{String(status).replace(/_/g, ' ')}</span>
        </span>
      );
  }
};
