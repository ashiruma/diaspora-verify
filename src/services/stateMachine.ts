import type { DetailedRequestStatus, ProcessStage } from '../types';

/**
 * Valid state transitions for the DiasporaVerify 15-state state machine.
 * Prevents unauthorized or invalid skips in the verification lifecycle.
 */
export const VALID_TRANSITIONS: Record<DetailedRequestStatus, DetailedRequestStatus[]> = {
  DRAFT: ['SUBMITTED', 'CANCELLED'],
  SUBMITTED: ['PAYMENT_PENDING', 'CANCELLED'],
  PAYMENT_PENDING: ['PAID', 'CANCELLED'],
  PAID: ['AWAITING_AGENT', 'CANCELLED'],
  AWAITING_AGENT: ['AGENT_ASSIGNED', 'CANCELLED'],
  AGENT_ASSIGNED: ['ACCEPTED', 'AWAITING_AGENT', 'CANCELLED'],
  ACCEPTED: ['TRAVELLING', 'AWAITING_AGENT', 'CANCELLED'],
  TRAVELLING: ['ON_SITE', 'CANCELLED'],
  ON_SITE: ['VERIFYING', 'CANCELLED'],
  VERIFYING: ['EVIDENCE_SUBMITTED', 'CANCELLED'],
  EVIDENCE_SUBMITTED: ['UNDER_REVIEW', 'CANCELLED'],
  UNDER_REVIEW: ['ADDITIONAL_INFORMATION_REQUIRED', 'REPORT_READY', 'DISPUTED'],
  ADDITIONAL_INFORMATION_REQUIRED: ['VERIFYING', 'EVIDENCE_SUBMITTED', 'CANCELLED'],
  REPORT_READY: ['COMPLETED', 'DISPUTED'],
  COMPLETED: ['DISPUTED'],
  DISPUTED: ['UNDER_REVIEW', 'COMPLETED', 'CANCELLED'],
  CANCELLED: ['DRAFT']
};

/**
 * Validates whether a state transition is permitted.
 */
export function canTransition(current: DetailedRequestStatus, target: DetailedRequestStatus): boolean {
  if (current === target) return true;
  const allowed = VALID_TRANSITIONS[current] || [];
  return allowed.includes(target);
}

/**
 * Maps a detailed 15-state status to the high-level 5-stage lifecycle.
 * Preserves Rule 2: define -> assign -> act -> review -> decide.
 */
export function mapStatusToStage(status: DetailedRequestStatus): ProcessStage {
  switch (status) {
    case 'DRAFT':
    case 'SUBMITTED':
    case 'PAYMENT_PENDING':
    case 'PAID':
      return 'define';

    case 'AWAITING_AGENT':
    case 'AGENT_ASSIGNED':
    case 'ACCEPTED':
      return 'assign';

    case 'TRAVELLING':
    case 'ON_SITE':
    case 'VERIFYING':
    case 'EVIDENCE_SUBMITTED':
      return 'act';

    case 'UNDER_REVIEW':
    case 'ADDITIONAL_INFORMATION_REQUIRED':
      return 'review';

    case 'REPORT_READY':
    case 'COMPLETED':
    case 'DISPUTED':
    case 'CANCELLED':
    default:
      return 'decide';
  }
}

/**
 * Human-readable metadata for each detailed state.
 */
export interface StatusMetadata {
  label: string;
  description: string;
  badgeClass: string;
  stepIndex: number; // 1 to 15
}

export const STATUS_METADATA: Record<DetailedRequestStatus, StatusMetadata> = {
  DRAFT: {
    label: 'Draft',
    description: 'Request intake being drafted by client abroad.',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    stepIndex: 1
  },
  SUBMITTED: {
    label: 'Submitted',
    description: 'Submitted to Nairobi HQ for quote review and feasibility check.',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    stepIndex: 2
  },
  PAYMENT_PENDING: {
    label: 'Payment Pending',
    description: 'Scope approved; awaiting escrow/service fee payment.',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-300',
    stepIndex: 3
  },
  PAID: {
    label: 'Paid',
    description: 'Payment confirmed; ready for ground verifier assignment.',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    stepIndex: 4
  },
  AWAITING_AGENT: {
    label: 'Awaiting Agent',
    description: 'Triage desk matching vetted ground inspector in target county.',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    stepIndex: 5
  },
  AGENT_ASSIGNED: {
    label: 'Agent Assigned',
    description: 'Field agent assigned with signed conflict clearance.',
    badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-300',
    stepIndex: 6
  },
  ACCEPTED: {
    label: 'Agent Accepted',
    description: 'Field agent accepted assignment and scheduled visit date.',
    badgeClass: 'bg-teal-50 text-teal-700 border-teal-300',
    stepIndex: 7
  },
  TRAVELLING: {
    label: 'Travelling to Site',
    description: 'Field agent en route to physical location in Kenya.',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse',
    stepIndex: 8
  },
  ON_SITE: {
    label: 'On Site (Checked In)',
    description: 'GPS telemetry confirmed agent physical presence on ground.',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-400 font-bold',
    stepIndex: 9
  },
  VERIFYING: {
    label: 'Verifying in Progress',
    description: 'Capturing calibrated evidence, measuring, and executing checklist.',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300 font-medium',
    stepIndex: 10
  },
  EVIDENCE_SUBMITTED: {
    label: 'Evidence Submitted',
    description: 'Field agent submitted complete evidence dossier to Operations.',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-300',
    stepIndex: 11
  },
  UNDER_REVIEW: {
    label: 'Under Internal Review',
    description: 'Nairobi QA desk verifying evidence hashes and contradictions.',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-400 font-bold',
    stepIndex: 12
  },
  ADDITIONAL_INFORMATION_REQUIRED: {
    label: 'Additional Info Needed',
    description: 'QA desk requested further photographic angle or document clarification.',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-400',
    stepIndex: 12
  },
  REPORT_READY: {
    label: 'Report Ready',
    description: 'Official Verification Report published to Client Portal.',
    badgeClass: 'bg-emerald-600 text-white border-emerald-700 font-bold',
    stepIndex: 13
  },
  COMPLETED: {
    label: 'Completed & Decided',
    description: 'Client reviewed report and recorded decision/closed task.',
    badgeClass: 'bg-slate-900 text-emerald-400 border-slate-950 font-bold',
    stepIndex: 14
  },
  DISPUTED: {
    label: 'Disputed',
    description: 'Formal dispute filed; escalated to Senior Operations Desk.',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-400 font-bold',
    stepIndex: 15
  },
  CANCELLED: {
    label: 'Cancelled',
    description: 'Request cancelled by client or operations before execution.',
    badgeClass: 'bg-slate-200 text-slate-600 border-slate-300',
    stepIndex: 0
  }
};
