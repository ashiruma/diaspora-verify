import assert from 'node:assert/strict';
import { test, describe } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import {
  normalizeRole,
  canUserAccessRequest,
  canAccessRoute,
  ROLE_PERMISSIONS,
} from '../src/auth/authorization.ts';

// Verify migration file source code
const rlsMigrationPath = path.resolve('supabase/migrations/20261008010000_diaspora_verify_role_security.sql');
const rlsMigration = fs.readFileSync(rlsMigrationPath, 'utf-8');

describe('DiasporaVerify Strict Role Security & IDOR Isolation Invariants', () => {

  test('Security Rule 1: Role Normalization Invariant (Real Source Import)', () => {
    assert.strictEqual(normalizeRole('client'), 'client');
    assert.strictEqual(normalizeRole('Client'), 'client');
    assert.strictEqual(normalizeRole('field_agent'), 'agent');
    assert.strictEqual(normalizeRole('agent'), 'agent');
    assert.strictEqual(normalizeRole('operations'), 'admin');
    assert.strictEqual(normalizeRole('coordinator'), 'admin');
    assert.strictEqual(normalizeRole('admin'), 'admin');
    assert.strictEqual(normalizeRole('corporate'), 'admin');
    assert.strictEqual(normalizeRole('unknown_attacker_role'), 'client');
  });

  test('Security Rule 2: Client IDOR Prevention (Horizontal Access Control - Real Import)', () => {
    const clientA = { id: 'usr-1', email: 'david.mwangi.uk@gmail.com', name: 'David Mwangi', role: 'client' };
    const clientB = { id: 'usr-2', email: 'wambui.seattle@yahoo.com', name: 'Grace Wambui', role: 'client' };

    const requestA = { id: 'DV-2026-KJD-0104', client: { email: 'david.mwangi.uk@gmail.com', name: 'David Mwangi' } };
    const requestB = { id: 'DV-2026-NBI-0205', client: { email: 'wambui.seattle@yahoo.com', name: 'Grace Wambui' } };

    // Client A accessing Request A: PERMITTED
    const checkA_A = canUserAccessRequest(clientA, requestA);
    assert.strictEqual(checkA_A.allowed, true);

    // Client A attempting to access Client B's request: BLOCKED WITH 403 / IDOR
    const checkA_B = canUserAccessRequest(clientA, requestB);
    assert.strictEqual(checkA_B.allowed, false);
    assert.ok(checkA_B.reason && checkA_B.reason.includes('IDOR_ACCESS_DENIED'));

    // Client B attempting to access Client A's request: BLOCKED WITH 403 / IDOR
    const checkB_A = canUserAccessRequest(clientB, requestA);
    assert.strictEqual(checkB_A.allowed, false);
    assert.ok(checkB_A.reason && checkB_A.reason.includes('IDOR_ACCESS_DENIED'));
  });

  test('Security Rule 3: Agent Horizontal Isolation & Task Boundary (Real Import)', () => {
    const agent1 = { id: 'usr-agt-1', agentId: 'agt-01', email: 'evans.kiptoo@diasporaverify.co.ke', name: 'Evans Kiptoo', role: 'agent' };
    const agent2 = { id: 'usr-agt-2', agentId: 'agt-02', email: 'faith.mutua@diasporaverify.co.ke', name: 'Faith Mutua', role: 'agent' };

    const task1 = { id: 'DV-01', assignedAgent: { id: 'agt-01', email: 'evans.kiptoo@diasporaverify.co.ke' } };
    const task2 = { id: 'DV-02', assignedAgent: { id: 'agt-02', email: 'faith.mutua@diasporaverify.co.ke' } };
    const unassignedTask = { id: 'DV-03', assignedAgent: null };

    // Agent 1 on task 1: ALLOWED
    assert.strictEqual(canUserAccessRequest(agent1, task1).allowed, true);
    // Agent 2 on task 2: ALLOWED
    assert.strictEqual(canUserAccessRequest(agent2, task2).allowed, true);

    // Agent 1 on task 2: DENIED (Cannot inspect other agents' jobs)
    const blockedCheck = canUserAccessRequest(agent1, task2);
    assert.strictEqual(blockedCheck.allowed, false);
    assert.ok(blockedCheck.reason && blockedCheck.reason.includes('AGENT_UNASSIGNED'));

    // Agent 1 on unassigned task: DENIED
    assert.strictEqual(canUserAccessRequest(agent1, unassignedTask).allowed, false);
  });

  test('Security Rule 4: Route-Level Authorization & Redirection Guards (Real Import)', () => {
    const clientUser = { id: 'c-1', email: 'client@example.com', name: 'Client 1', role: 'client' };
    const agentUser = { id: 'a-1', agentId: 'agt-01', email: 'agent@example.com', name: 'Agent 1', role: 'agent' };
    const adminUser = { id: 'adm-1', email: 'admin@example.com', name: 'Admin 1', role: 'admin' };

    // Client route boundaries
    assert.strictEqual(canAccessRoute(clientUser, '/dashboard').allowed, true);
    assert.strictEqual(canAccessRoute(clientUser, '/requests').allowed, true);
    assert.strictEqual(canAccessRoute(clientUser, '/payments').allowed, true);
    assert.strictEqual(canAccessRoute(clientUser, '/messages').allowed, true);
    assert.strictEqual(canAccessRoute(clientUser, '/profile').allowed, true);
    assert.strictEqual(canAccessRoute(clientUser, '/admin').allowed, false);
    assert.strictEqual(canAccessRoute(clientUser, '/admin').redirectTo, '/dashboard');
    assert.strictEqual(canAccessRoute(clientUser, '/operations').allowed, false);
    assert.strictEqual(canAccessRoute(clientUser, '/agent').allowed, false);
    assert.strictEqual(canAccessRoute(clientUser, '/corporate').allowed, false);

    // Agent route boundaries: strictly /agent only! Forbidden from client & admin routes
    assert.strictEqual(canAccessRoute(agentUser, '/agent').allowed, true);
    assert.strictEqual(canAccessRoute(agentUser, '/admin').allowed, false);
    assert.strictEqual(canAccessRoute(agentUser, '/admin').redirectTo, '/agent');
    assert.strictEqual(canAccessRoute(agentUser, '/operations').allowed, false);
    assert.strictEqual(canAccessRoute(agentUser, '/corporate').allowed, false);
    assert.strictEqual(canAccessRoute(agentUser, '/dashboard').allowed, false);
    assert.strictEqual(canAccessRoute(agentUser, '/dashboard').redirectTo, '/agent');
    assert.strictEqual(canAccessRoute(agentUser, '/new-request').allowed, false);
    assert.strictEqual(canAccessRoute(agentUser, '/construction').allowed, false);
    assert.strictEqual(canAccessRoute(agentUser, '/requests').allowed, false);
    assert.strictEqual(canAccessRoute(agentUser, '/request/DV-2026-NBI-0205').allowed, false);
    assert.strictEqual(canAccessRoute(agentUser, '/payments').allowed, false);
    assert.strictEqual(canAccessRoute(agentUser, '/messages').allowed, false);
    assert.strictEqual(canAccessRoute(agentUser, '/profile').allowed, false);
    assert.strictEqual(canAccessRoute(agentUser, '/properties').allowed, false);
    assert.strictEqual(canAccessRoute(agentUser, '/reports').allowed, false);
    assert.strictEqual(canAccessRoute(agentUser, '/disputes').allowed, false);

    // Admin routing checks: operational supervisor
    assert.strictEqual(canAccessRoute(adminUser, '/admin').allowed, true);
    assert.strictEqual(canAccessRoute(adminUser, '/dashboard').allowed, true);
    assert.strictEqual(canAccessRoute(adminUser, '/agent').allowed, true);
  });

  test('Security Rule 5: Admin "View-As" Mode Maintains Admin Identity & Limits Data Leak (Real Import)', () => {
    const admin = { id: 'adm-01', role: 'admin', email: 'ops@diasporaverify.co.ke', name: 'Ops Admin' };
    const clientXRequest = { id: 'DV-X', client: { email: 'client.x@domain.com', name: 'Client X' } };
    const clientYRequest = { id: 'DV-Y', client: { email: 'client.y@domain.com', name: 'Client Y' } };

    // Standard Admin can see everything
    assert.strictEqual(canUserAccessRequest(admin, clientXRequest).allowed, true);
    assert.strictEqual(canUserAccessRequest(admin, clientYRequest).allowed, true);

    // Enter View-As as Client X:
    const viewAsSession = {
      active: true,
      viewRole: 'client',
      targetId: 'cx-01',
      targetName: 'Client X',
      targetEmail: 'client.x@domain.com',
      startedAt: '2026-10-08T04:00:00Z',
    };

    // Client X's request is visible:
    assert.strictEqual(canUserAccessRequest(admin, clientXRequest, viewAsSession).allowed, true);

    // Client Y's request is blocked in preview mode to simulate exact client isolation:
    const checkBlockedY = canUserAccessRequest(admin, clientYRequest, viewAsSession);
    assert.strictEqual(checkBlockedY.allowed, false);
    assert.ok(checkBlockedY.reason && checkBlockedY.reason.includes('ADMIN PREVIEW'));
  });

  test('Security Rule 6: Admin Sub-Roles Matrix & Least-Privilege Granularity (Real Import)', () => {
    assert.ok(ROLE_PERMISSIONS.super_admin.includes('requests.read'));
    assert.ok(ROLE_PERMISSIONS.super_admin.includes('reports.approve'));
    assert.ok(ROLE_PERMISSIONS.super_admin.includes('payments.manage'));
    assert.ok(ROLE_PERMISSIONS.super_admin.includes('agents.manage'));

    // Operations sub-role cannot manage payments
    assert.ok(ROLE_PERMISSIONS.operations.includes('requests.assign'));
    assert.strictEqual(ROLE_PERMISSIONS.operations.includes('payments.manage'), false);

    // Reviewer sub-role cannot manage agents or payments
    assert.ok(ROLE_PERMISSIONS.reviewer.includes('reports.approve'));
    assert.strictEqual(ROLE_PERMISSIONS.reviewer.includes('agents.manage'), false);
    assert.strictEqual(ROLE_PERMISSIONS.reviewer.includes('payments.manage'), false);

    // Finance sub-role can manage payments but not approve reports or assign agents
    assert.ok(ROLE_PERMISSIONS.finance.includes('payments.manage'));
    assert.strictEqual(ROLE_PERMISSIONS.finance.includes('reports.approve'), false);
    assert.strictEqual(ROLE_PERMISSIONS.finance.includes('requests.assign'), false);
  });

  test('Security Rule 7: Supabase RLS Migration Integrity', () => {
    // Verify RLS policies are generated and sound
    assert.ok(rlsMigration.includes('ENABLE ROW LEVEL SECURITY'));
    assert.ok(rlsMigration.includes('CREATE TABLE IF NOT EXISTS public.admin_permissions'));
    assert.ok(rlsMigration.includes('CREATE TABLE IF NOT EXISTS public.admin_view_as_logs'));
    assert.ok(rlsMigration.includes('CREATE POLICY "Clients read own requests"'));
    assert.ok(rlsMigration.includes('CREATE POLICY "Agents read assigned requests"'));
    assert.ok(rlsMigration.includes('CREATE POLICY "Admins manage all requests"'));
    assert.ok(rlsMigration.includes('is_admin()'));
  });

  test('Security Rule 8: App Routes & Navigation Guards Registered', () => {
    const appSource = fs.readFileSync(path.resolve('src/App.tsx'), 'utf-8');
    assert.ok(appSource.includes('<ProtectedRoute allowedRoles={[\'client\', \'admin\']}>'));
    assert.ok(appSource.includes('<ProtectedRoute allowedRoles={[\'admin\']}>'));
    assert.ok(appSource.includes('<ProtectedRoute allowedRoles={[\'agent\', \'admin\']}>'));
    assert.ok(appSource.includes('path="/admin"'));
    assert.ok(appSource.includes('path="/operations"'));
    assert.ok(appSource.includes('path="/requests"'));
    assert.ok(appSource.includes('path="/payments"'));
    assert.ok(appSource.includes('path="/messages"'));
    assert.ok(appSource.includes('path="/profile"'));
    assert.ok(appSource.includes('<CommandMenu'));
  });
});
