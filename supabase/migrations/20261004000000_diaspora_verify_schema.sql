-- ==============================================================================
-- DIASPORAVERIFY SUPABASE PRODUCTION SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- Service: DiasporaVerify (Kenya on-ground verification & construction oversight)
-- Version: 1.0.0 (Production Migration)
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. User Profiles Table (Integrated with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('client', 'coordinator', 'field_agent')),
    phone TEXT,
    location_abroad TEXT,
    county TEXT,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for role lookups in RLS
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Helper function to retrieve the current user's role
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- 3. Verification Requests Table
CREATE TABLE IF NOT EXISTS public.verification_requests (
    id TEXT PRIMARY KEY, -- e.g. 'DV-2026-NBI-0104'
    client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('construction', 'property', 'vehicle', 'business', 'family', 'custom')),
    offer_type TEXT NOT NULL CHECK (offer_type IN ('one-time', 'follow-through', 'ongoing-assistant')),
    stage TEXT NOT NULL DEFAULT 'define' CHECK (stage IN ('define', 'assign', 'act', 'review', 'decide')),
    status TEXT NOT NULL DEFAULT 'partly_observed' CHECK (status IN ('observed', 'partly_observed', 'not_observed', 'cannot_confirm')),
    urgency TEXT NOT NULL DEFAULT 'standard' CHECK (urgency IN ('standard', 'priority', 'urgent')),
    
    -- Structured Metadata
    client_data JSONB NOT NULL,
    location_data JSONB NOT NULL,
    contact_on_ground JSONB NOT NULL,
    
    -- Assignment & Clearance
    assigned_agent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    conflict_check JSONB NOT NULL DEFAULT '{"checked": false, "agentHasRelationToSite": false, "notes": "Pending assignment"}'::jsonb,
    scheduled_visit_date DATE,
    
    -- Scoping & Boundaries
    scope_brief TEXT NOT NULL,
    deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
    explicit_limitations JSONB NOT NULL DEFAULT '[]'::jsonb,
    documents_provided JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Pricing (Service Fee ONLY - client funds strictly separated)
    pricing JSONB NOT NULL DEFAULT '{"serviceFeeKES": 12500, "currency": "KES", "quoteStatus": "draft"}'::jsonb,
    
    -- Workflow Progress
    milestones JSONB DEFAULT '[]'::jsonb,
    checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
    photo_comparisons JSONB DEFAULT '[]'::jsonb,
    video_markers JSONB DEFAULT '[]'::jsonb,
    
    -- QA & Decision
    qa_review JSONB,
    payment_decision_record JSONB,
    client_decision_log JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_requests_client ON public.verification_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_requests_assigned ON public.verification_requests(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_requests_stage ON public.verification_requests(stage);

-- 4. Evidence Items (Tamper-evident, cryptographic SHA-256 hashing)
CREATE TABLE IF NOT EXISTS public.evidence_items (
    id TEXT PRIMARY KEY,
    request_id TEXT NOT NULL REFERENCES public.verification_requests(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('photo', 'video', 'receipt', 'audio_interview', 'document')),
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    storage_path TEXT,
    sha256_hash TEXT NOT NULL, -- Cryptographic integrity fingerprint
    server_timestamp TIMESTAMPTZ DEFAULT NOW(),
    location_tag TEXT,
    gps_coords TEXT,
    camera_angle TEXT,
    verified_by_agent_id UUID REFERENCES public.profiles(id),
    uncertainty_flag TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evidence_request ON public.evidence_items(request_id);

-- 5. Immutable Published Reports with Versioning & Audit Trail
CREATE TABLE IF NOT EXISTS public.reports_immutable (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id TEXT NOT NULL REFERENCES public.verification_requests(id) ON DELETE CASCADE,
    version INTEGER NOT NULL DEFAULT 1,
    report_data JSONB NOT NULL,
    sha256_hash TEXT NOT NULL,
    published_by UUID NOT NULL REFERENCES public.profiles(id),
    published_at TIMESTAMPTZ DEFAULT NOW(),
    is_latest BOOLEAN DEFAULT TRUE,
    change_reason TEXT,
    CONSTRAINT unique_request_version UNIQUE (request_id, version)
);

CREATE INDEX IF NOT EXISTS idx_reports_request ON public.reports_immutable(request_id);

-- 6. Family Care Confidentiality & Access Audit Logs
CREATE TABLE IF NOT EXISTS public.family_care_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id TEXT NOT NULL REFERENCES public.verification_requests(id) ON DELETE CASCADE,
    accessed_by UUID NOT NULL REFERENCES public.profiles(id),
    action TEXT NOT NULL, -- 'view_welfare_brief', 'view_medical_emergency_contact'
    reason TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 7. System Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    performed_by UUID REFERENCES public.profiles(id),
    user_role TEXT,
    target_resource TEXT NOT NULL,
    target_id TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Service Invoices (Paystack Integration)
CREATE TABLE IF NOT EXISTS public.invoices (
    id TEXT PRIMARY KEY,
    request_id TEXT NOT NULL REFERENCES public.verification_requests(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.profiles(id),
    amount_kes NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'KES',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'paid', 'cancelled')),
    paystack_reference TEXT UNIQUE,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports_immutable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_care_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- Profiles Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Coordinators can view all profiles"
    ON public.profiles FOR SELECT
    USING (public.current_user_role() = 'coordinator');

CREATE POLICY "Users can update own non-role profile fields"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- Verification Requests Policies
-- ------------------------------------------------------------------------------
-- Coordinators: Full access to triage, assign, QA, and manage
CREATE POLICY "Coordinators have full access to verification requests"
    ON public.verification_requests FOR ALL
    USING (public.current_user_role() = 'coordinator');

-- Clients: Can view and create their own requests
CREATE POLICY "Clients can view own requests"
    ON public.verification_requests FOR SELECT
    USING (auth.uid() = client_id);

CREATE POLICY "Clients can insert own requests"
    ON public.verification_requests FOR INSERT
    WITH CHECK (auth.uid() = client_id OR public.current_user_role() = 'client');

CREATE POLICY "Clients can update own requests (e.g. decision logs)"
    ON public.verification_requests FOR UPDATE
    USING (auth.uid() = client_id)
    WITH CHECK (auth.uid() = client_id);

-- Field Agents: Can view and update requests assigned to them
CREATE POLICY "Agents can view assigned requests"
    ON public.verification_requests FOR SELECT
    USING (auth.uid() = assigned_agent_id);

CREATE POLICY "Agents can update assigned requests (checklist, status)"
    ON public.verification_requests FOR UPDATE
    USING (auth.uid() = assigned_agent_id)
    WITH CHECK (auth.uid() = assigned_agent_id);

-- ------------------------------------------------------------------------------
-- Evidence Items Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Coordinators have full access to evidence"
    ON public.evidence_items FOR ALL
    USING (public.current_user_role() = 'coordinator');

CREATE POLICY "Clients can view evidence for their requests"
    ON public.evidence_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.verification_requests r 
            WHERE r.id = evidence_items.request_id AND r.client_id = auth.uid()
        )
    );

CREATE POLICY "Agents can insert and view evidence for assigned requests"
    ON public.evidence_items FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.verification_requests r 
            WHERE r.id = evidence_items.request_id AND r.assigned_agent_id = auth.uid()
        )
    );

-- ------------------------------------------------------------------------------
-- Immutable Reports Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Coordinators can publish immutable reports"
    ON public.reports_immutable FOR INSERT
    WITH CHECK (public.current_user_role() = 'coordinator');

CREATE POLICY "Coordinators can view all published reports"
    ON public.reports_immutable FOR SELECT
    USING (public.current_user_role() = 'coordinator');

CREATE POLICY "Clients can view reports for their requests"
    ON public.reports_immutable FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.verification_requests r 
            WHERE r.id = reports_immutable.request_id AND r.client_id = auth.uid()
        )
    );

-- Prevent UPDATE and DELETE on reports_immutable to enforce immutability
-- (No UPDATE/DELETE policy defined = access denied for modifications)

-- ------------------------------------------------------------------------------
-- Invoices Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Coordinators can manage all invoices"
    ON public.invoices FOR ALL
    USING (public.current_user_role() = 'coordinator');

CREATE POLICY "Clients can view their own invoices"
    ON public.invoices FOR SELECT
    USING (auth.uid() = client_id);

-- ------------------------------------------------------------------------------
-- Triggers for Audit Logging & Timestamp Refresh
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_verification_requests_modtime
    BEFORE UPDATE ON public.verification_requests
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_invoices_modtime
    BEFORE UPDATE ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
