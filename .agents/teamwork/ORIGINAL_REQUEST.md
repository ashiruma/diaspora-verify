# Original User Request

## 2026-10-03T16:27:11Z

Review the existing DiasporaVerify web app and make it **secure, sustainable and sellable** to its target markets, turning it from a browser-only demo (React 19 + TypeScript + Vite, mock data in localStorage, repo `github.com/ashiruma/diaspora-verify`, deployed on Vercel) into a **pilot-ready MVP** for Kenyans abroad who need trusted on-the-ground checks and coordination in Kenya. Deliver working code plus an audit report and business documents.

Working directory: C:\Users\ADMIN\.gemini\antigravity\scratch\diaspora-verify
Integrity mode: development

Reference material (the product spec, summarised from the founder's two documents dated 29 Sep 2026):
- **Service Model & Pilot**: promise "Your trusted eyes and hands on the ground in Kenya". Five service areas (Projects & assets, Purchases & vehicles, Business support, Family support, Custom requests), each with stated professional boundaries. A 5-step request process (Define → Assign → Act → Review → Decide). Three offers (One-time check, Follow-through, Ongoing personal assistant), each quoted per request after intake. Client funds must stay separate from the service fee. Trust controls: field-agent vetting and code of conduct; original, date-, time- and location-stamped evidence with stated limits; consent and safeguarding for care requests; independence and conflict-of-interest disclosure. No unproven marketing claims (e.g. no "60% faster", no fabricated testimonials). Customer opener: "Living abroad should not mean relying on guesswork for everything happening back home. Tell us what you need checked or handled in Kenya. We will agree on the scope, assign the right person on the ground, keep you updated and give you clear evidence and next steps. Whether it is a property, a farm, a vehicle, a business or a family matter, you remain in control of the decision." CTA: "Tell us the task, location and deadline. We will confirm whether we can help and send a clear quote and plan."
- **Construction Oversight Pilot**: Baseline check, milestone check and ongoing oversight. Report statuses are exactly *observed / partly observed / not observed / cannot confirm*. DiasporaVerify records the client's payment decision but **never holds or releases construction funds**, never certifies structural safety, and never shows a green "approved" label. A stop-payment recommendation is issued on access denial, contradictory photos, missing receipts or disputes. A qualified specialist review is offered for foundations, reinforcement and electrical work.
- The existing app, its README and `test/verify_business_logic.mjs` encode these rules. They must stay true.

Target markets: diaspora clients in the **UK, USA, EU, Gulf states (UAE, Saudi Arabia, Qatar), Canada/Australia**, plus **Kenya-based family members** ordering on someone's behalf. Applicable data-protection law includes the Kenya Data Protection Act 2019 (including ODPC registration), UK GDPR and EU GDPR.

Priority order (finish each tier before moving to the next; all tiers are in scope):
1. Security and real backend → 2. Legal and trust pages → 3. Marketing site and payments → 4. Research and economics reports → 5. Offline field app, analytics, notifications, pitch deck.

Credentials note: the founder will create the hosted Supabase project and supply the project URL and anon key via environment variables; the service-role key and any Paystack test secret key will only ever be set as server-side Vercel environment variables by the founder and must never be committed or requested in chat. If hosted credentials are not available in the environment when you need them, develop and test against a local Supabase instance (e.g. Supabase CLI) and document exactly how to point the app at the hosted project. If Paystack test keys are unavailable, build the flow and test it with a mocked Paystack API and signed/forged webhook fixtures.

## Requirements

### R1. Real backend, roles and data protection (Tier 1)
Replace localStorage mock persistence with Supabase (Postgres, Auth, Storage), using the founder's Supabase project. The client side may only use the URL and anon key. The service-role key may only appear in server-side Vercel environment variables and must never be committed. Implement three roles (client, coordinator, field agent) and support the full 5-step lifecycle end to end, including quotes, agent assignment with a recorded conflict-of-interest declaration, checklists, evidence upload, coordinator review, report publishing and the client decision log.

Security requirements:
- Access rules are enforced in the database itself: clients see only their own data, agents see only jobs assigned to them, coordinators see everything.
- Coordinator and field-agent accounts must use MFA. Clients sign in with a magic link or password.
- Evidence is tamper-evident: each file gets a SHA-256 hash, a server timestamp and its recorded GPS location. Published reports are immutable; any change creates a new version with an audit trail.
- Family-care welfare data can only be seen by named coordinators, and every access is logged.
- Client- and third-party-facing image downloads have EXIF/GPS metadata stripped. Originals are kept privately.
- Intake forms and sign-in are rate-limited.
- Security headers/CSP are configured for Vercel.
- The OWASP Top 10 has been reviewed.
- No secrets exist anywhere in the repo history.

### R2. Legal, trust and compliance (Tier 2)
Add public Terms of Service, Privacy Policy (Kenya DPA 2019 + UK/EU GDPR), service-boundaries and disclaimers page, and field-agent code of conduct, with consent flows for family-care requests (requester relationship, consent or guardian authority, emergency escalation contact). Clearly mark every legal document as a draft requiring review by a qualified lawyer. Use clearly marked placeholders for company name, registration number, address, contact email and WhatsApp number.

### R3. Sellable public presence and payments (Tier 3)
Build a public marketing site (landing page around the customer opener and CTA, service portfolio, how it works, pricing guidance, downloadable sample report) that works without signing in and shows prices in GBP, USD, EUR, AED, CAD, AUD and KES. Add in-app quotes and invoices for **service fees only**, paid through **Paystack in test mode** (cards + M-Pesa). An invoice may only be marked paid after server-side verification of the transaction or webhook signature.

### R4. Market, economics and audit documents (Tier 4)
Produce, in a `docs/` folder:
- **(a) Security / sustainability / sellability audit report**: findings, what was fixed, and residual risks.
- **(b) Market and competitor research**: market sizing based on Kenyan diaspora remittance data, at least 5 competitors or alternatives, pricing benchmarks, positioning for each of the 6 markets, and a 30-day pilot go-to-market plan.
- **(c) Unit economics**: for each offer, covering field-agent pay, travel, coordinator time and payment fees, with break-even pricing per market. Provide it as a spreadsheet/CSV with visible formulas or assumptions.
- **(d) Monthly infrastructure cost estimate** at 10, 100 and 1,000 requests a month.
- **(e) Operations runbook**: audit logs, data retention and deletion schedule, backups, and incident-response checklist.
- **(f) Investor/partner pitch deck outline.**

Every market or financial figure must cite a source URL or be explicitly labelled as an assumption.

### R5. Field resilience, growth and maintainability (Tier 5)
- **Field app**: the agent experience must be installable and usable on low-end Android phones. Agents can complete checklists and capture photos offline, and the data syncs automatically when they reconnect.
- **Messaging and analytics**: add WhatsApp click-to-chat intake with a prefilled message, email notifications when a request changes status, and privacy-friendly analytics that track the started-vs-submitted request funnel without consent-requiring cookies.
- **Testing and CI**: add unit and end-to-end tests, plus a GitHub Actions CI workflow that runs lint, type-check, tests, build, a dependency audit and a secret scan.
- **Handover docs**: update the README so another developer can set the project up from a fresh clone.

## Acceptance Criteria

### Security (R1)
- [ ] An automated access-control test suite runs against the Supabase database with at least: two clients, one assigned agent, one unassigned agent, one coordinator and an anonymous user. It proves that client A cannot read or write client B's requests, evidence, reports or invoices; that an unassigned agent cannot read a job; and that anonymous users can read no private data. All tests pass.
- [ ] A test proves a coordinator or agent session without MFA (`aal1`) is denied access to operations data, and the same account with MFA (`aal2`) is allowed.
- [ ] A test uploads an evidence file and confirms the stored SHA-256 matches the file. A test edits a published report and confirms the original version is still retrievable and an audit-log entry exists.
- [ ] A test confirms the client-facing download of a GPS-tagged JPEG contains no GPS/EXIF data, while the private original still does.
- [ ] A test confirms that reading family-care welfare data creates an access-log entry, and that a non-named coordinator is denied.
- [ ] A test confirms that repeated intake or sign-in submissions above the defined limit are rejected.
- [ ] A secret scan (e.g. gitleaks) of the **full git history** passes. A search of the production `dist/` bundle finds no service-role key or other secret.
- [ ] `npm audit --audit-level=high` reports 0 high/critical vulnerabilities, or each remaining one is documented with a justification.
- [ ] `vercel.json` sets CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy and frame-ancestors, and a check script verifies them.
- [ ] `docs/` contains an OWASP Top 10 table mapping each item to a mitigation or an accepted risk.

### Core lifecycle (R1)
- [ ] A Playwright end-to-end test completes the full flow against the real backend: (1) client signs up and submits a request; (2) coordinator quotes it and assigns an agent with a conflict-of-interest declaration; (3) agent completes the checklist and uploads evidence; (4) coordinator reviews and publishes a report using one of the four statuses; (5) client records a decision. Data must persist after a reload and be visible in a separate browser context for the correct role only.
- [ ] Reference rules still hold: the four statuses are used exactly; no UI text or styling presents an "approved" certification; no flow lets DiasporaVerify hold or release construction funds; the stop-payment warning still triggers on the documented conditions; the existing `test/verify_business_logic.mjs` still passes (it may be extended).

### Legal and trust (R2)
- [ ] Terms, Privacy, Boundaries and Code-of-conduct pages are publicly reachable, and every one is marked as a draft for legal review.
- [ ] The Privacy Policy covers: controller identity placeholder, data collected, lawful bases, retention periods, international transfers (Kenya ↔ UK/EU/US/Gulf), data-subject rights and how to exercise them, ODPC registration placeholder, and contact/DPO placeholder.
- [ ] An end-to-end test proves a family-care request cannot be submitted without relationship confirmation, consent or guardian-authority acknowledgement, and an emergency contact.

### Sellability (R3)
- [ ] The landing, services, how-it-works, pricing and sample-report pages load without signing in.
- [ ] Lighthouse (mobile) on the landing page scores at least 90 for Performance, Accessibility, Best Practices and SEO.
- [ ] Prices can be shown in GBP, USD, EUR, AED, CAD, AUD and KES.
- [ ] An automated content check finds no unproven performance claims, fabricated testimonials or "approved/certified" wording in public pages.
- [ ] A test-mode Paystack flow creates an invoice, starts payment and marks the invoice paid only after server-side verification. A test proves a forged or unsigned webhook is rejected and leaves the invoice unpaid.

### Documents (R4) — independent agent-as-judge review
- [ ] Each document in R4 (a)–(f) exists.
- [ ] Every numeric market or financial claim has a source URL or an explicit "assumption" label (the reviewer checks a random 10 claims).
- [ ] The competitor table has at least 5 entries.
- [ ] Each of the 6 markets has its own positioning and pricing section.
- [ ] The unit-economics file recalculates correctly when an input changes.

### Resilience, growth and maintainability (R5)
- [ ] The field app passes Lighthouse PWA installability checks.
- [ ] A Playwright test with the network set offline completes a checklist and captures a photo. When the network is restored, the test confirms the data synced to Supabase with a matching SHA-256.
- [ ] Clicking the WhatsApp intake link opens `wa.me` with a prefilled message.
- [ ] A test confirms a status change triggers an email through a test/capture mail provider.
- [ ] A test confirms analytics funnel events fire, and no consent-requiring cookies are set.
- [ ] A GitHub Actions workflow runs lint, type-check, unit tests, end-to-end tests, build, dependency audit and secret scan, and passes on `main`.
- [ ] An independent agent follows only the README from a fresh clone (with provided env vars) and gets the app running locally with tests passing.

## 2026-10-03T16:34:52Z

Founder update — credentials and status (2026-10-03):

1. Hosted Supabase project is now available. Public client values (safe for the browser; still keep them in a gitignored env file such as `.env.local`, never hard-coded):
   - Supabase URL: https://mfpaeazewapznhyoxvca.supabase.co
   - Publishable (anon) key: sb_publishable_iq5N3ZLHtJQrA6iH9AunRA_p3EmeypP
   The founder supplied these under `NEXT_PUBLIC_*` names, but this is a Vite app, so use whatever prefix the build actually needs (e.g. `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY`) and document the exact Vercel env var names in the README. The service-role/secret key will NOT be provided in chat; the founder sets it server-side in Vercel only. Use local Supabase for anything that needs elevated privileges (migrations against hosted, seeding test users, the RLS test suite) unless a server-side key is present in the environment, and document how to apply migrations to the hosted project.
2. Paystack: build the full flow now with mocked Paystack API and signed/forged webhook fixtures; the founder will add test keys later.
3. The founder confirmed the code is pushed to GitHub at `ashiruma/diaspora-verify` (branch `main`), so the GitHub Actions CI is in scope to run there.

No change to requirements or acceptance criteria.
