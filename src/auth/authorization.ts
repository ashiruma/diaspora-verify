import type { 
  VerificationRequest 
} from '../types';

export type UserRole = 'client' | 'agent' | 'admin';

export type AdminSubRole = 'super_admin' | 'operations' | 'reviewer' | 'finance' | 'support';

export type Permission =
  | 'requests.read'
  | 'requests.create'
  | 'requests.assign'
  | 'requests.update'
  | 'reports.read'
  | 'reports.approve'
  | 'agents.manage'
  | 'clients.manage'
  | 'payments.manage'
  | 'analytics.view'
  | 'disputes.manage';

export const ROLE_PERMISSIONS: Record<AdminSubRole, Permission[]> = {
  super_admin: [
    'requests.read',
    'requests.create',
    'requests.assign',
    'requests.update',
    'reports.read',
    'reports.approve',
    'agents.manage',
    'clients.manage',
    'payments.manage',
    'analytics.view',
    'disputes.manage',
  ],
  operations: [
    'requests.read',
    'requests.assign',
    'requests.update',
    'reports.read',
    'agents.manage',
    'disputes.manage',
  ],
  reviewer: [
    'requests.read',
    'reports.read',
    'reports.approve',
  ],
  finance: [
    'requests.read',
    'payments.manage',
    'analytics.view',
  ],
  support: [
    'requests.read',
    'clients.manage',
    'disputes.manage',
  ],
};

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  subRole?: AdminSubRole;
  agentId?: string; // set when role === 'agent'
  clientId?: string; // set when role === 'client'
  phone?: string;
  locationAbroad?: string;
  mfaEnabled: boolean;
}

export interface ViewAsSession {
  active: boolean;
  viewRole: 'client' | 'agent';
  targetId: string;
  targetName: string;
  targetEmail: string;
  startedAt: string;
}

/**
 * Standardize legacy role strings ('operations' -> 'admin', 'field_agent' -> 'agent')
 */
export function normalizeRole(role: string): UserRole {
  const r = role.toLowerCase();
  if (r === 'operations' || r === 'coordinator' || r === 'admin' || r === 'corporate') {
    return 'admin';
  }
  if (r === 'field_agent' || r === 'agent') {
    return 'agent';
  }
  return 'client';
}

/**
 * Get canonical dashboard route for a given user role
 */
export function getRoleDashboardPath(role: string): string {
  const norm = normalizeRole(role);
  if (norm === 'admin') return '/admin';
  if (norm === 'agent') return '/agent';
  return '/dashboard';
}

/**
 * IDOR & Horizontal Privilege Escalation Protection for Requests
 */
export function canUserAccessRequest(
  user: AuthenticatedUser | null | undefined,
  request: VerificationRequest,
  viewAs?: ViewAsSession
): { allowed: boolean; reason?: string } {
  if (!user) {
    return { allowed: false, reason: 'UNAUTHENTICATED' };
  }

  // 1. Admin Preview Mode
  if (user.role === 'admin') {
    if (viewAs?.active) {
      if (viewAs.viewRole === 'client') {
        const matchesClient =
          request.client?.email?.toLowerCase() === viewAs.targetEmail?.toLowerCase() ||
          request.client?.name?.toLowerCase() === viewAs.targetName?.toLowerCase();
        if (!matchesClient) {
          return {
            allowed: false,
            reason: `ADMIN PREVIEW: Target client ${viewAs.targetName} does not own request ${request.id}.`,
          };
        }
        return { allowed: true };
      }
      if (viewAs.viewRole === 'agent') {
        const matchesAgent =
          request.assignedAgent?.id === viewAs.targetId ||
          request.assignedAgent?.email?.toLowerCase() === viewAs.targetEmail?.toLowerCase();
        if (!matchesAgent) {
          return {
            allowed: false,
            reason: `ADMIN PREVIEW: Target agent ${viewAs.targetName} is not assigned to request ${request.id}.`,
          };
        }
        return { allowed: true };
      }
    }
    // Standard admin has full operational visibility
    return { allowed: true };
  }

  // 2. Client role: strictly own requests only (IDOR boundary)
  if (user.role === 'client') {
    const isOwner =
      request.client?.email?.toLowerCase() === user.email.toLowerCase() ||
      (user.clientId && (request as any).client_id === user.clientId);

    if (!isOwner) {
      return {
        allowed: false,
        reason: `IDOR_ACCESS_DENIED: Verification record ${request.id} does not belong to your client account.`,
      };
    }
    return { allowed: true };
  }

  // 3. Agent role: strictly assigned jobs only
  if (user.role === 'agent') {
    const isAssigned =
      request.assignedAgent?.id === user.agentId ||
      request.assignedAgent?.email?.toLowerCase() === user.email.toLowerCase();

    if (!isAssigned) {
      return {
        allowed: false,
        reason: `AGENT_UNASSIGNED: You are not assigned to field verification ${request.id}.`,
      };
    }
    return { allowed: true };
  }

  return { allowed: false, reason: 'UNAUTHORIZED_ROLE' };
}

/**
 * Route level authorization checks
 */
export function canAccessRoute(
  user: AuthenticatedUser | null | undefined,
  pathname: string,
  _viewAs?: ViewAsSession
): { allowed: boolean; redirectTo?: string; message?: string } {
  if (!user) {
    return {
      allowed: false,
      redirectTo: `/login?redirect=${encodeURIComponent(pathname)}`,
      message: 'Authentication required. Please sign in to access this resource.',
    };
  }

  const norm = normalizeRole(user.role);

  // Admin in standard or preview mode
  if (norm === 'admin') {
    return { allowed: true };
  }

  // Client checks
  if (norm === 'client') {
    if (pathname.startsWith('/admin') || pathname.startsWith('/operations')) {
      return {
        allowed: false,
        redirectTo: '/dashboard',
        message: 'Access Denied: You do not have permission to access the Operations Center.',
      };
    }
    if (pathname.startsWith('/agent')) {
      return {
        allowed: false,
        redirectTo: '/dashboard',
        message: 'Access Denied: You do not have permission to access the Field Agent Portal.',
      };
    }
    if (pathname.startsWith('/corporate')) {
      return {
        allowed: false,
        redirectTo: '/dashboard',
        message: 'Access Denied: You do not have permission to access Corporate Oversight.',
      };
    }
  }

  // Agent checks
  if (norm === 'agent') {
    if (pathname.startsWith('/admin') || pathname.startsWith('/operations') || pathname.startsWith('/corporate')) {
      return {
        allowed: false,
        redirectTo: '/agent',
        message: 'Access Denied: Field verifiers cannot access the Operations Center or Corporate portals.',
      };
    }
    if (
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/new-request') ||
      pathname.startsWith('/construction') ||
      pathname.startsWith('/requests') ||
      pathname.startsWith('/request/') ||
      pathname.startsWith('/payments') ||
      pathname.startsWith('/messages') ||
      pathname.startsWith('/profile') ||
      pathname.startsWith('/properties') ||
      pathname.startsWith('/reports') ||
      pathname.startsWith('/disputes')
    ) {
      return {
        allowed: false,
        redirectTo: '/agent',
        message: 'Access Denied: Field verifiers cannot access Diaspora Client records, reports, or payment portals. Please use your Field Agent Mobile Workspace.',
      };
    }
  }

  return { allowed: true };
}
