-- ==============================================================================
-- DIASPORAVERIFY 2.0 PRODUCTION SCHEMA EXTENSION & MIGRATIONS
-- Version: 2.0.0
-- Focus: Multi-tenant Organizations, Property Portfolio, Check-ins, Disputes,
-- Audit Logs, and Configurable Checklists
-- ==============================================================================

-- 1. Organizations (Corporate Clients & Multi-user Teams)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    corporate_type TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    billing_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    member_role TEXT NOT NULL DEFAULT 'member' CHECK (member_role IN ('admin', 'manager', 'member')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_org_user UNIQUE (organization_id, user_id)
);

-- 2. Property Portfolio ("My Properties" Recurring Monitoring)
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    property_type TEXT NOT NULL,
    county TEXT NOT NULL,
    town TEXT NOT NULL,
    landmark TEXT,
    gps_coords TEXT NOT NULL,
    beacon_numbers TEXT[] DEFAULT ARRAY[]::TEXT[],
    title_deed_ref TEXT,
    size_acres NUMERIC,
    current_status TEXT NOT NULL DEFAULT 'Vacant',
    monitoring_plan TEXT DEFAULT 'On-Demand',
    last_inspection_date DATE,
    next_inspection_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_properties_client ON public.properties(client_id);
CREATE INDEX IF NOT EXISTS idx_properties_org ON public.properties(organization_id);

-- 3. Property Recurring Inspection Schedules
CREATE TABLE IF NOT EXISTS public.property_inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    frequency TEXT NOT NULL CHECK (frequency IN ('monthly', 'quarterly', 'biannual', 'custom')),
    fee_per_inspection_kes NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    next_scheduled_date DATE NOT NULL,
    auto_renew BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Assignment Check-Ins (GPS Telemetry Verification)
CREATE TABLE IF NOT EXISTS public.assignment_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id TEXT NOT NULL REFERENCES public.verification_requests(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES public.profiles(id),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    gps_coords TEXT NOT NULL,
    target_coords TEXT NOT NULL,
    accuracy_meters NUMERIC,
    distance_meters NUMERIC,
    verified_within_range BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_checkins_request ON public.assignment_checkins(request_id);

-- 5. Disputes Resolution Desk
CREATE TABLE IF NOT EXISTS public.disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id TEXT NOT NULL REFERENCES public.verification_requests(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.profiles(id),
    reason TEXT NOT NULL CHECK (reason IN (
        'Incorrect information',
        'Insufficient evidence',
        'Incomplete assignment',
        'Agent misconduct',
        'Technical issue'
    )),
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'UNDER_REVIEW', 'RESOLVED')),
    admin_notes TEXT,
    resolution_action TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_disputes_request ON public.disputes(request_id);
CREATE INDEX IF NOT EXISTS idx_disputes_client ON public.disputes(client_id);

-- 6. Notifications Dispatch Log
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_role TEXT NOT NULL DEFAULT 'all',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'alert')),
    read BOOLEAN NOT NULL DEFAULT FALSE,
    request_id TEXT REFERENCES public.verification_requests(id) ON DELETE SET NULL,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

-- 7. Configurable Service Checklists
CREATE TABLE IF NOT EXISTS public.service_checklists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    label TEXT NOT NULL,
    description TEXT,
    is_required BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) FOR 2.0 TABLES
-- ==============================================================================
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_checklists ENABLE ROW LEVEL SECURITY;

-- Properties: Clients read/write their own properties; Coordinators read all
CREATE POLICY "Clients manage own properties"
    ON public.properties FOR ALL
    USING (auth.uid() = client_id);

CREATE POLICY "Coordinators view all properties"
    ON public.properties FOR SELECT
    USING (public.current_user_role() = 'coordinator');

-- Disputes: Clients create and view their own disputes; Coordinators manage all
CREATE POLICY "Clients manage own disputes"
    ON public.disputes FOR ALL
    USING (auth.uid() = client_id);

CREATE POLICY "Coordinators manage all disputes"
    ON public.disputes FOR ALL
    USING (public.current_user_role() = 'coordinator');

-- Checkins: Agents insert checkins; Coordinators and Clients view checkins
CREATE POLICY "Agents create checkins"
    ON public.assignment_checkins FOR INSERT
    WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Users view related checkins"
    ON public.assignment_checkins FOR SELECT
    USING (
        public.current_user_role() = 'coordinator' OR
        auth.uid() = agent_id OR
        EXISTS (
            SELECT 1 FROM public.verification_requests r 
            WHERE r.id = assignment_checkins.request_id AND r.client_id = auth.uid()
        )
    );

-- Notifications: Users read own notifications
CREATE POLICY "Users read own notifications"
    ON public.notifications FOR ALL
    USING (auth.uid() = user_id OR target_role = 'all' OR target_role = public.current_user_role());

-- Checklists: Readable by all authenticated users
CREATE POLICY "Anyone can view service checklists"
    ON public.service_checklists FOR SELECT
    USING (true);
