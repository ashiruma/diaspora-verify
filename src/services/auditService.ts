import type { AuditLogEntry, ActiveRole } from '../types';

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-001',
    action: 'USER_CREATED_REQUEST',
    performedBy: {
      id: 'usr-client-01',
      name: 'David Mwangi',
      role: 'client'
    },
    timestamp: '2026-10-01 09:14:22 EAT',
    targetResource: 'verification_requests',
    targetId: 'DV-2026-KJD-0104',
    metadata: {
      category: 'construction',
      county: 'Kajiado',
      serviceFeeKES: 14500
    }
  },
  {
    id: 'aud-002',
    action: 'PAYMENT_RECEIVED',
    performedBy: {
      id: 'sys-paystack',
      name: 'Paystack Automated Gateway',
      role: 'system'
    },
    timestamp: '2026-10-01 09:18:05 EAT',
    targetResource: 'invoices',
    targetId: 'inv-kjd-0104',
    metadata: {
      amountKES: 14500,
      currency: 'KES',
      reference: 'pstk_txn_89214710'
    }
  },
  {
    id: 'aud-003',
    action: 'AGENT_ASSIGNED',
    performedBy: {
      id: 'usr-ops-01',
      name: 'Amara Kiprotich',
      role: 'operations'
    },
    timestamp: '2026-10-01 11:30:00 EAT',
    targetResource: 'verification_requests',
    targetId: 'DV-2026-KJD-0104',
    metadata: {
      agentId: 'agt-01',
      agentName: 'Evans Kiptoo',
      conflictClearanceSigned: true
    }
  },
  {
    id: 'aud-004',
    action: 'AGENT_CHECKED_IN',
    performedBy: {
      id: 'agt-01',
      name: 'Evans Kiptoo',
      role: 'field_agent'
    },
    timestamp: '2026-10-04 14:12:45 EAT',
    targetResource: 'assignment_checkins',
    targetId: 'chk-0104',
    metadata: {
      gpsCoords: '-1.4892, 36.9583',
      targetCoords: '-1.4892, 36.9583',
      accuracyMeters: 4.2
    }
  },
  {
    id: 'aud-005',
    action: 'EVIDENCE_UPLOADED',
    performedBy: {
      id: 'agt-01',
      name: 'Evans Kiptoo',
      role: 'field_agent'
    },
    timestamp: '2026-10-04 15:45:10 EAT',
    targetResource: 'evidence_items',
    targetId: 'ev-1728047110000',
    metadata: {
      type: 'photo',
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    }
  },
  {
    id: 'aud-006',
    action: 'REPORT_APPROVED_WITH_STOP_PAYMENT',
    performedBy: {
      id: 'usr-ops-01',
      name: 'Amara Kiprotich',
      role: 'operations'
    },
    timestamp: '2026-10-05 08:30:19 EAT',
    targetResource: 'reports',
    targetId: 'DV-2026-KJD-0104',
    metadata: {
      confidenceScore: 84,
      stopPaymentAlert: true,
      varianceKES: 300000
    }
  }
];

export function createAuditLog(
  action: string,
  actor: { id: string; name: string; role: ActiveRole | 'system' },
  targetResource: string,
  targetId: string,
  metadata?: Record<string, any>
): AuditLogEntry {
  return {
    id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    action,
    performedBy: actor,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' EAT',
    targetResource,
    targetId,
    metadata
  };
}
