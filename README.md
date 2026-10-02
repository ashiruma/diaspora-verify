# DiasporaVerify Web Platform 🇰🇪
> **“Your trusted eyes and hands on the ground in Kenya.”**
> *Trusted on-ground support for people abroad | Based on the 29 September 2026 Service Model & Construction Oversight Pilot*

---

## 🌟 Overview

**DiasporaVerify** is a full-featured web application designed for Kenyans and investors living abroad (London, Dallas, Toronto, Dubai, Sydney, etc.) who need independent visual verification, local task coordination, and evidence-backed decision records back home in Kenya.

The platform directly implements:
- **Reference Document 1: DiasporaVerify Service Model and Pilot**
- **Reference Document 2: DiasporaVerify Construction Oversight Pilot**

---

## 🚀 Key Modules & Capabilities

### 1. 👤 Client Portal (Diaspora Kenyans Abroad)
- **Customer Opener & Value Proposition**: Clear framing addressing the SNAP story ("Living abroad should not mean relying on guesswork... You remain in control of the decision").
- **Interactive Multi-Category Dashboard**:
  - Filter across 6 service domains: **Projects & Construction**, **Property & Land Pre-Purchase**, **Purchases & Vehicles**, **Business & Farming Operations**, **Family Welfare & Care Coordination**, and **Custom Requests**.
  - Dynamic currency conversion toggle (**KES**, **USD**, **GBP**, **EUR**) with live conversions.
  - Multi-stat indicators: Active Verifications, Funds Under Audit, Verified Evidence Items, Discrepancy Alerts.
- **Interactive Intake Protocol (New Request Wizard)**:
  - 4-Step Intake flow: Category & Engagement Model (`One-Time Check`, `Follow-Through`, `Ongoing Personal Assistant`), Location (County, Town, Landmark, GPS), Scope Brief & Document Upload simulation, Fee Quote estimation with SLA urgency tiers.
  - Mandatory Service Boundary & Independence Acknowledgment.
- **5-Step Repeatable Request Process Visualizer**:
  - Step 1: **Define** (Scope, deliverables, limitations, fee quote)
  - Step 2: **Assign** (Vetted agent card, contact info, conflict clearance)
  - Step 3: **Act** (Interactive ground checklist, geotagged evidence gallery)
  - Step 4: **Review** (Coordinator QA findings, contradiction flags, explicit uncertainty log)
  - Step 5: **Decide** (Client action buttons, immutable decision ledger)

### 2. 🏗️ Construction Oversight Module (Document 2 Flagship)
- **Milestone Verification Pipeline**: Stages 1 through 5 (Foundation Strip Footing -> Wall Superstructure -> Lintel Ring Beam & Suspended Slab -> Timber Roof Trusses -> Internal Finishes).
- **Interactive Side-by-Side Photo Comparison Slider**:
  - Compare previous milestone signoff vs current inspection across repeatable fixed-camera angles (`Angle A: North-East Elevation`, `Angle B: Ceiling Shuttering`, `Angle C: Storage Shed Cement Reserve`).
  - Dual view modes: **Interactive Range Slider** (draggable Before/After divider) and **Side-by-Side**.
  - Discrepancy pins and inspector ground notes highlighting incomplete work.
- **Video Walkthrough Inspection Log**:
  - Timestamped video review markers (00:24 Entrance & Aggregate; 01:12 Lintel Rebar; 02:08 Formwork Missing [Alert]; 03:35 Foreman Peter Interview [Warning]).
- **Payment Decision Record & Interactive Client Actions**:
  - Financial reconciliation: Contractor invoice (KES 450,000) vs Physical work verified (~40%, KES 150,000) vs Receipts supplied (KES 150,000) = **KES 300,000 overbilled variance**.
  - Missing materials inventory audit: 80 bags of cement missing (~KES 68,000).
  - Client Action Triggers:
    - *Authorize Partial Payment (KES 150,000 verified materials)*
    - *Pause Payment & Request Store Delivery Notes*
    - *Enforce Stop Payment & Dispute Overbilling*
    - *Authorize Full Payment (with divergence warning modal)*
  - Immutable decision ledger with timestamps, notes, and authorized amounts.

### 3. 🧭 Operations Coordinator & QA Desk (Nairobi HQ)
- **Controlled Request Register**: Triage incoming client briefs and monitor active files across Kenyan counties.
- **Field Verifier Roster & Assignment Matrix**:
  - Vetted agents across Nairobi, Kiambu, Machakos, Kajiado, Nakuru, Uasin Gishu, Mombasa, and Murang'a.
  - Conflict-of-interest check and signoff verification.
- **QA Review Determination Interface**:
  - Standard verification classifications: `Observed` | `Partly Observed` | `Not Observed` | `Cannot Confirm`.
  - Contradiction flagger and explicit uncertainty recorder.
  - Urgent **STOP PAYMENT Alert** trigger.
  - One-click publishing to the Client Portal.

### 4. 📱 Field Agent Ground Inspector Mode
- **Mobile-Optimized Viewport**: Includes a toggleable smartphone frame simulator.
- **Ground Mission Briefing**: GPS coordinate match, local keyholder phone link, and access constraints.
- **Interactive Digital Checklist**: Item-by-item status toggles (`Passed`, `Flagged`, `Inconclusive`).
- **Real-Time Evidence Logger**: Capture photos with camera angle tags, timestamp, GPS coords, and notes on obstructions or what could NOT be accessed.

### 5. 📄 Standard Verification Report & Printable PDF
- Formal audit document with Report Serial Number, verification badge, and inspection parameters.
- Clean print-to-PDF styles (`window.print()`).
- Prominent service boundary disclaimers:
  > *“A photo is evidence of what it shows at the moment it was taken, not proof of ownership, quality, structural safety, or final completion.”*
  > *“DiasporaVerify does not hold construction funds or release money directly. We maintain strict inspector independence. All payments are executed directly by the client.”*

### 6. 📘 Service Model & Trust Doctrine
- Visual walkthrough of the core customer promise, SNAP story, 5-step process, service boundaries, trust controls, and 30-day pilot validation framework.

---

## 🗂️ Rich Real-World Scenarios Included

1. **Kitengela 4-Bed Bungalow (Construction)**: Lintel & Slab casting check. Contractor requested KES 450,000; inspector found slab formwork only 40% complete and 80 bags cement missing. Stop Payment alert issued.
2. **Konza Buffer Zone Plot (Property)**: 50x100 plot. Seller brochure claimed fenced gated community with beacons; inspector found unfenced land, only 1 eroded beacon, and neighbor boundary dispute. Status: `Cannot Confirm`.
3. **Mama Mary Care in Eldoret (Family Welfare)**: Elderly mother diabetes clinic accompaniment to MTRH, nurse attendance logs verified, pharmacy receipts reconciled with safeguarding consent. Status: `Observed`.
4. **Maragua Avocado & Macadamia Farm (Business/Farming)**: 20 bags DAP fertilizer verified in store, drip irrigation materials present, but lateral pipe installation only 55% complete. Status: `Partly Observed`.
5. **Mombasa Port CFS Yard (Vehicle Inspection)**: 2018 Toyota Prado. Digital coating thickness gauge detected heavy body filler (480 microns) on rear quarter panel from undisclosed collision. Status: `Partly Observed`.

---

## 🛠️ Tech Stack & Architecture

- **React 19** + **TypeScript**
- **Vite** bundler
- **Tailwind CSS** (via custom branded CDN config)
- **Inline SVG Icons System** (Zero external icon dependency errors, 100% React 19 compatible)
- **HTML5 Canvas / CSS Range Sliders** for Side-by-Side before/after photo comparisons
- **LocalStorage State Sync** with quick demo reset button
- Built-in **Node Test Runner** (`node --test`) for core business logic verification

---

## 🧪 Verification & Testing

Run the automated test suite:
```bash
node test/verify_business_logic.mjs
```

Build the production bundle:
```bash
npm run build
```
