-- ==============================================================================
-- DIASPORAVERIFY ROLE SECURITY & IDOR ISOLATION MIGRATIONS
-- Version: 2.1.0
-- Focus: Fine-grained RLS policies enforcing client-only and agent-only row isolation,
-- Admin sub-roles & permissions, and Admin View-As Audit Logging
-- ==============================================================================

-- 1. Admin Role & Permissions Table
CREATE TABLE IF NOT EXISTS public.admin_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sub_role TEXT NOT NULL CHECK (sub_role IN ('super_admin', 'operations', 'reviewer', 'finance', 'support')),
    permissions TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    granted_by UUID REFERENCES public.profiles(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_permissions_admin ON public.admin_permissions(admin_id);

-- 2. Admin "View-As" Session Audit Log Table
CREATE TABLE IF NOT EXISTS public.admin_view_as_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES public.profiles(id),
    admin_email TEXT NOT NULL,
    view_role TEXT NOT NULL CHECK (view_role IN ('client', 'agent')),
    target_id TEXT NOT NULL,
    target_email TEXT,
    target_name TEXT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    reason TEXT DEFAULT 'Operational customer support & QA audit inspection',
    ip_address TEXT,
    metadata JSONB DEFAULT '{}'::JSONB
);

CREATE INDEX IF NOT EXISTS idx_view_as_admin ON public.admin_view_as_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_view_as_target ON public.admin_view_as_logs(target_id);

-- 3. Security Helper Functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND (role IN ('coordinator', 'admin', 'operations'))
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_assigned_agent(p_request_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.verification_requests
        WHERE id = p_request_id AND assigned_agent_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_request_owner(p_request_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.verification_requests
        WHERE id = p_request_id AND client_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Enable RLS on verification_requests & audit logs
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_view_as_logs ENABLE ROW LEVEL SECURITY;

-- 5. Fine-grained RLS Policies for verification_requests
-- Drop overlapping legacy policies if they exist
DROP POLICY IF EXISTS "Clients read own requests" ON public.verification_requests;
DROP POLICY IF EXISTS "Agents read assigned requests" ON public.verification_requests;
DROP POLICY IF EXISTS "Admins manage all requests" ON public.verification_requests;

-- Client Row Isolation: Clients strictly access their own verification records
CREATE POLICY "Clients read own requests"
    ON public.verification_requests FOR SELECT
    USING (
        auth.uid() = client_id
    );

CREATE POLICY "Clients insert own requests"
    ON public.verification_requests FOR INSERT
    WITH CHECK (
        auth.uid() = client_id
    );

-- Agent Row Isolation: Field Agents strictly access requests assigned to them
CREATE POLICY "Agents read assigned requests"
    ON public.verification_requests FOR SELECT
    USING (
        auth.uid() = assigned_agent_id
    );

-- Admin Row Policy: Full operational management across all requests
CREATE POLICY "Admins manage all requests"
    ON public.verification_requests FOR ALL
    USING (
        public.is_admin()
    );

-- 6. RLS Policies for admin_view_as_logs
CREATE POLICY "Admins manage view-as logs"
    ON public.admin_view_as_logs FOR ALL
    USING (
        public.is_admin()
    );

-- 7. RLS Policies for admin_permissions
CREATE POLICY "Admins view permissions"
    ON public.admin_permissions FOR SELECT
    USING (
        public.is_admin()
    );
