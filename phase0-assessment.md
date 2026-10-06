# Phase 0 – System Audit Assessment

## Overview
The DiasporaVerify project is a **React 19 + TypeScript** single‑page application built with Vite. It uses **Supabase** (Postgres + RLS) for auth, storage and mock data persistence, and a client‑side mock Paystack flow. The UI is driven by a top‑level `currentTab` string state and a `VerificationContext` that stores request data, role, currency, and MFA state.

Below is a systematic audit covering the **four** required dimensions:

1. **What should be preserved** – stable, production‑ready components and architecture.
2. **What should be refactored** – code that works but can be improved for scalability, maintainability or security.
3. **What should be replaced** – placeholders or incomplete implementations that must be swapped out.
4. **What is missing** – essential functionality, infrastructure or best‑practice gaps needed for a commercial SaaS product.

---

## 1️⃣ Preserve
| Area | Reason | Files / Assets |
|------|--------|----------------|
| **Supabase Auth & RLS** | Uses `createClient` with environment variables; RLS policies are already defined in Supabase UI, providing row‑level security for users and agents. | `src/lib/supabase.ts` (client wrapper) |
| **Role‑based UI toggles** | Quick‑switch buttons and `Navbar` role menu correctly isolate views for **client**, **operations**, and **field_agent**. | `src/App.tsx`, `src/components/Navbar.tsx` |
| **Data schemas** | TypeScript interfaces in `src/types/index.ts` comprehensively model requests, agents, evidence, milestones, payments, etc. | `src/types/index.ts` |
| **Mock data & seeded state** | `MOCK_REQUESTS`, `MOCK_AGENTS`, and related helpers provide a realistic demo dataset and persist to `localStorage`. | `src/data/mockData.ts`, `src/data/mockRequests.ts`, `src/data/mockAgents.ts` |
| **Security headers** | `vercel.json` ships CSP, HSTS, Referrer‑Policy, and other hardening headers for the Vercel deployment. | `vercel.json` |
| **Testing suite** | `test/verify_business_logic.mjs` validates core business rules (status transitions, currency conversion, audit‑log hashing). All tests pass after recent changes. | `test/verify_business_logic.mjs` |
| **Component styling** | Consistent Tailwind utility usage and design system (colors, badge components) ensures a unified look and easy theming. | `src/components/**` |
| **MFA toggle** | UI toggle in `Navbar` and state persistence via `localStorage` – useful for admin/field‑agent security. | `src/context/VerificationContext.tsx`, `src/components/Navbar.tsx` |

---

## 2️⃣ Refactor
| Area | Issue | Suggested Refactor |
|------|-------|-------------------|
| **Routing** | Current navigation relies on a string `currentTab` and manual conditional rendering – not scalable as new pages grow. | Introduce **React Router v6** (or similar) with route definitions (`/dashboard`, `/construction`, `/request/:id`, `/landing`, …). This provides URL deep‑linking, browser back/forward support, and easier code‑splitting. |
| **State persistence** | `VerificationContext` stores everything in `localStorage` and falls back to mock data. This mixes demo and production concerns. | Separate **local dev store** from **production store**: when `backendMode === 'supabase'` fetch from Supabase tables; otherwise use mock data. Abstract the storage layer into a service (`dataService.ts`). |
| **Currency handling** | Currency list is duplicated in `Navbar` (`currencies` constant) and used elsewhere via `currency` state; hard‑coded conversion rates live in `mockData`. |
| | Consolidate currency utilities (`CURRENCY_RATES`, `FORMAT_CURRENCY`) into a dedicated `utils/currency.ts` module and import wherever needed. |
| **Repeated UI patterns** | Buttons, badge containers, and quick‑switch blocks appear in multiple components with near‑identical markup. |
| | Extract reusable **Button**, **Badge**, and **Card** components into `src/components/UI/`. |
| **Evidence upload simulation** | `FieldAgentView` uses a static image URL and a mock `addEvidence` that does not compute a SHA‑256 hash or upload to storage. |
| | Refactor `addEvidence` to compute `sha256Hash` (using the shared `computeSHA256` utility) and optionally push to Supabase Storage when `backendMode === 'supabase'`. |
| **Context API usage** | `useVerification` returns many values, but components often import the entire context and pick only a few fields, causing unnecessary re‑renders. |
| | Split the context into **multiple contexts** (e.g., `RequestsContext`, `UserContext`, `UIContext`) or use selector hooks (`useRequests`, `useUser`) to limit updates. |
| **Hard‑coded strings** | UI strings (e.g., “Landing”, “Service Doctrine”) are scattered, making localisation difficult. |
| | Centralise UI copy in a `src/i18n/en.ts` (or similar) and reference keys throughout the app. |

---

## 3️⃣ Replace
| Component / Feature | Why Replace | Recommendation |
|---------------------|------------|----------------|
| **Mock Paystack flow** (`InvoiceView` & payment decision) | Only simulates a 2‑second delay; no server‑side verification, no webhook handling, no fraud protection. | Implement a **real Paystack (or Stripe) server‑less verification endpoint** under `api/payments/verify` (Vercel Serverless Function). Use the Paystack SDK to verify the transaction reference and update the request’s `paymentDecisionRecord`. |
| **Local mock data persistence** (`localStorage` fallback) | Not suitable for multi‑tenant SaaS; data is per‑browser and bypasses RLS. | Replace with **Supabase tables** for `requests`, `agents`, `evidence`, `payments`. Create migration scripts (`supabase/migrations/*.sql`) and enable RLS policies for each role (client, operations, field_agent). |
| **Ad‑hoc routing via `currentTab`** | Limits deep linking, SEO and future modularity. | Switch to a **router library** as noted in Refactor section. |
| **Static landing page component** (`LandingPage`) | Currently only displays static copy; no CTA integration with the request wizard. | Enhance to **fetch marketing content from a CMS** (e.g., Contentful) or Supabase `marketing_pages` table, enabling A/B testing and dynamic updates without redeploy. |
| **Hard‑coded currency list in `Navbar`** | Duplicate source of truth. | Use the centralized currency utility (refactor). |
| **Manual state resets via `resetAllData`** | Clears mock data but also wipes any persisted Supabase data if mis‑used. | Guard the reset function to only affect local dev mode; expose a separate **admin console** for production data management. |

---

## 4️⃣ Missing – What Must Be Added Before Commercial Launch
| Category | Gap | Action Items |
|----------|-----|-------------|
| **Backend API layer** | No server‑side endpoints for request CRUD, agent assignment, evidence upload, payment verification, or audit logs. | • Create Vercel **API routes** (`/api/requests`, `/api/agents`, `/api/evidence`, `/api/payments`).<br>• Use Supabase client inside these functions, enforce RLS based on user JWT.<br>• Add OpenAPI spec for internal documentation. |
| **Role‑based RLS policies** | Supabase tables exist, but policies are not defined in code. | • Write SQL policies for `client`, `operations`, `field_agent` roles (e.g., `client` can only read/write their own requests).<br>• Store policies in `supabase/migrations` and version‑control them. |
| **Audit‑log & Immutable Evidence** | Evidence items have optional `sha256Hash` but no enforcement; no immutable log of actions. | • Compute SHA‑256 on every uploaded file (`computeSHA256` utility) and store hash in Supabase.
• Create an **audit_log** table with immutable inserts (append‑only) for every status change, checklist update, payment decision, and evidence upload.
| **Notification system** | Users never receive email/SMS updates on status changes, assignments, or payment alerts. | • Integrate **SendGrid** (email) and **Twilio** (SMS/WhatsApp) via server‑less functions.
• Trigger notifications on relevant RLS‑protected events (e.g., `onAssignment`, `onStopPaymentAlert`). |
| **Map & Geolocation UI** | No interactive map for selecting locations or visualising GPS coordinates. | • Add a **Leaflet** or **Mapbox** component in the request wizard (step 2) for selecting a point; store lat/long in request.
| **CI/CD & Testing** | Only a local test suite; no automated linting, type‑checking, or deployment pipeline. | • Add **GitHub Actions** workflow: lint → type‑check → unit‑test → build → Vercel preview deployment.
• Enforce **code coverage** thresholds. |
| **Security hardening** | No rate‑limiting on API endpoints; no CSRF protection for forms. | • Use the shared `http_client` (science‑skills-common) for rate limiting.
• Add CSRF tokens to form submissions.
| **Analytics & Monitoring** | No telemetry for usage, performance, or error tracking. | • Integrate **Vercel Analytics** or **Amplitude** for front‑end events.
• Use **Sentry** for error reporting (both client and server). |
| **Enterprise multi‑tenant support** | The data model does not include organizational entities or team permissions. | • Add `Organization` and `TeamMember` tables with many‑to‑many relations.
• Extend RLS policies to scope data by `organization_id`. |
| **Legal & Compliance docs** | Legal page is static; no versioning or consent tracking for data processing. | • Store legal documents in Supabase with version metadata.
• Capture user consent timestamps in a `user_consent` table. |
| **Documentation & Developer Onboarding** | No README, architecture diagram, or contribution guide. | • Write a **README.md** with setup steps, environment variables, and contribution workflow.
• Add architecture diagram (Mermaid) in `docs/architecture.md`. |

---

## Next Steps
1. **Confirm** the high‑level plan (preserve/refactor/replace/missing) with the product owner.
2. Prioritise **API implementation** and **Supabase RLS policies** – these are foundational for security and multi‑tenant SaaS.
3. Replace the mock payment flow with a real verification endpoint.
4. Migrate routing to React Router to enable deep linking and SEO.
5. Incrementally address the refactor‑replace items in sprints, writing tests for each new feature.

---

**Artifacts**: This assessment is saved as `phase0-assessment.md` in the project root.

*Let me know if you’d like a more detailed implementation plan for any section, or if you’d like to start on a specific refactor.*
