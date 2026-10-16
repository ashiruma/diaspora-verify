import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SAMPLE_DOSSIER } from '../data/sampleDossierData';
import { Check } from '../components/Icons';

export const DevelopersPage: React.FC = () => {
  const [megaOpen, setMegaOpen] = useState(true);
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'typescript' | 'python'>('curl');
  const [copiedCode, setCopiedCode] = useState(false);

  const curlSnippet = `curl -X GET "https://api.diasporaverify.co.ke/v2/dossiers/${SAMPLE_DOSSIER.referenceId}" \\
  -H "Authorization: Bearer dv_live_9f82c401e8b27" \\
  -H "Accept: application/json"`;

  const tsSnippet = `import { DiasporaVerify } from '@diaspora-verify/sdk';

const client = new DiasporaVerify({ apiKey: process.env.DV_API_KEY });

const dossier = await client.dossiers.retrieve('${SAMPLE_DOSSIER.referenceId}');
console.log('Coordinates:', dossier.location.gpsCoords); // ${SAMPLE_DOSSIER.location.gpsCoords}
console.log('Integrity Hash:', dossier.evidenceHash);`;

  const pySnippet = `import diaspora_verify

client = diaspora_verify.Client(api_key="dv_live_9f82c401e8b27")
dossier = client.dossiers.get("${SAMPLE_DOSSIER.referenceId}")

print(f"Verified Location: {dossier.location.county}")
print(f"Coordinates: {dossier.location.gps_coords}")`;

  const activeSnippet =
    activeCodeTab === 'curl'
      ? curlSnippet
      : activeCodeTab === 'typescript'
      ? tsSnippet
      : pySnippet;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fdf5f6] text-[#231b1c] font-sans antialiased relative selection:bg-[#0e6e66] selection:text-white">
      {/* ---------------- TOP BAR (Orrera Spec) ---------------- */}
      <header className="relative z-40 h-16 flex items-center px-4 sm:px-8 bg-[#fffbfc] border-b border-[#e9d3d6]">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <svg className="w-6 h-8 shrink-0 transition-transform group-hover:scale-105" viewBox="0 0 24 30" aria-hidden="true">
            <path
              d="M12 1.6c-5.3 0-9.6 4.2-9.6 9.4 0 6.9 9.6 17.4 9.6 17.4s9.6-10.5 9.6-17.4c0-5.2-4.3-9.4-9.6-9.4z"
              fill="none"
              stroke="#0e6e66"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="11" r="4.6" fill="none" stroke="#0e6e66" strokeWidth="1.6" />
            <path d="M12 11 L12 7.6 M12 11 L14.6 12.6" stroke="#a9761f" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span className="text-[19px] sm:text-[21px] font-normal text-[#594648] tracking-[-0.1px] whitespace-nowrap">
            Diaspora<span className="text-[#0e6e66] font-semibold">Verify</span> <span className="hidden md:inline text-xs text-[#a9761f] font-mono font-medium ml-1">Platform</span>
          </span>
        </Link>

        {/* Main Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-11 ml-10 xl:ml-16" aria-label="Developers top navigation">
          <Link to="/about" className="text-sm font-medium text-[#594648] hover:text-[#0e6e66] transition-colors">
            Why DiasporaVerify
          </Link>
          <Link to="/services" className="text-sm font-medium text-[#594648] hover:text-[#0e6e66] transition-colors flex items-center gap-1.5">
            <span>Services</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M2.6 5 L7 9.4 L11.4 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <Link to="/sample-report" className="text-sm font-medium text-[#594648] hover:text-[#0e6e66] transition-colors">
            Sample Dossier
          </Link>
          <Link to="/contact?type=quote" className="text-sm font-medium text-[#594648] hover:text-[#0e6e66] transition-colors">
            Pricing
          </Link>
          <button
            type="button"
            onClick={() => setMegaOpen(!megaOpen)}
            className={`text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              megaOpen ? 'text-[#0e6e66] font-bold' : 'text-[#594648] hover:text-[#0e6e66]'
            }`}
          >
            <span>Developers</span>
            <svg className={`w-3.5 h-3.5 transition-transform ${megaOpen ? 'rotate-180 text-[#0e6e66]' : ''}`} viewBox="0 0 14 14" aria-hidden="true">
              <path d="M2.6 5 L7 9.4 L11.4 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </nav>

        {/* Right CTA Pair */}
        <div className="ml-auto flex items-center gap-3 sm:gap-3.5">
          <Link
            to="/contact?type=quote"
            className="inline-flex items-center justify-center h-10 px-4 sm:px-5 rounded border border-[#e9d3d6] text-[#0e6e66] bg-[#fffbfc] hover:border-[#7fb3a9] hover:bg-[#f9f0f1] text-xs sm:text-sm font-medium transition-all"
          >
            Talk to sales
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center h-10 px-4 sm:px-5 rounded bg-[#0e6e66] text-white border border-[#0e6e66] hover:bg-[#0a544e] shadow-sm hover:shadow-md text-xs sm:text-sm font-medium transition-all"
          >
            Start building
          </Link>
        </div>
      </header>

      {/* ---------------- MEGA PANEL (Kombai Orrera Spec) ---------------- */}
      {megaOpen && (
        <section className="relative z-30 bg-[#fffbfc] border-b border-[#e9d3d6] shadow-[0_18px_34px_-26px_rgba(35,27,28,0.38)] animate-in fade-in duration-200">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] px-6 sm:px-12 lg:px-16 py-8 sm:py-10 relative">
            
            {/* Left Column: Heading & Blurb */}
            <div className="pr-4 pb-6 lg:pb-0 border-b lg:border-b-0 border-[#e9d3d6]">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0e6e66]/10 text-[#0e6e66] text-[11px] font-mono font-bold mb-3">
                <span>ORRERA DEVELOPER SPEC</span>
              </div>
              <h2 className="text-[26px] sm:text-[28px] font-normal leading-tight tracking-[-0.3px] text-[#231b1c]">
                Developers
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#6b585a] max-w-[240px]">
                Reference, tooling and worked examples to help you build on DiasporaVerify cadastral coordinates.
              </p>

              <div className="mt-6 pt-5 border-t border-[#e9d3d6] flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono text-[#594648]">Nairobi Pilot Hub API v2.4 Live</span>
              </div>
            </div>

            {/* Right Column: 8-Item Icon Grid */}
            <div className="pt-6 lg:pt-0 lg:pl-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-9 items-start">
              
              {/* Item 1: API Reference */}
              <div className="group">
                <svg className="w-7 h-7 mb-2 block" viewBox="0 0 28 28" aria-hidden="true">
                  <path d="M5 2.5h11l7 7v16H5z" fill="none" stroke="#231b1c" strokeWidth="1.5"/>
                  <path d="M16 2.5v7h7" fill="none" stroke="#231b1c" strokeWidth="1.5"/>
                  <path d="M8.5 12h11M8.5 15.5h11M8.5 19h7" stroke="#231b1c" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="21" cy="20.5" r="5" fill="#0e6e66"/>
                  <path d="M18.7 20.6 L20.4 22.3 L23.3 19" fill="none" stroke="#fffbfc" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <a
                  href="#api-spec"
                  className="block text-sm font-medium text-[#594648] group-hover:text-[#0e6e66] transition-colors leading-snug"
                >
                  API reference
                  <svg className="inline-block w-3 h-3 ml-1 text-[#0e6e66]" viewBox="0 0 13 13" aria-hidden="true">
                    <path d="M3.4 9.6 L9.6 3.4 M4.6 3.4h5v5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <span className="text-[11px] text-[#6b585a] mt-0.5 block">REST, GraphQL & Webhooks</span>
              </div>

              {/* Item 2: Coverage map */}
              <div className="group">
                <svg className="w-7 h-7 mb-2 block" viewBox="0 0 28 28" aria-hidden="true">
                  <rect x="14" y="3.5" width="10.5" height="10.5" fill="#a9761f"/>
                  <circle cx="12" cy="11.5" r="7" fill="none" stroke="#231b1c" strokeWidth="1.6"/>
                  <path d="M6.8 16.8 L2.8 24.8" stroke="#231b1c" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                <a
                  href="#coverage-spec"
                  className="block text-sm font-medium text-[#594648] group-hover:text-[#0e6e66] transition-colors leading-snug"
                >
                  Coverage map
                </a>
                <span className="text-[11px] text-[#6b585a] mt-0.5 block">Nairobi Metro pilot polygons</span>
              </div>

              {/* Item 3: Sample gallery */}
              <div className="group">
                <svg className="w-7 h-7 mb-2 block" viewBox="0 0 28 28" aria-hidden="true">
                  <path d="M2.5 7h23M2.5 14h23M2.5 21h23" stroke="#231b1c" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M8 3.6v6.8M19 10.6v6.8M11 17.6v6.8" stroke="#0e6e66" strokeWidth="2.6" strokeLinecap="round"/>
                </svg>
                <Link
                  to="/sample-report"
                  className="block text-sm font-medium text-[#594648] group-hover:text-[#0e6e66] transition-colors leading-snug"
                >
                  Sample gallery
                </Link>
                <span className="text-[11px] text-[#6b585a] mt-0.5 block">DV-2026-NBI-0205 Dossier</span>
              </div>

              {/* Item 4: Sandbox editor */}
              <div className="group">
                <svg className="w-7 h-7 mb-2 block" viewBox="0 0 28 28" aria-hidden="true">
                  <rect x="3" y="3.5" width="22" height="20" fill="none" stroke="#231b1c" strokeWidth="1.5"/>
                  <path d="M3 8.4h22" stroke="#231b1c" strokeWidth="1.5"/>
                  <path d="M11.5 12 L20.5 15.6 L16.6 17.2 L14.8 21.4z" fill="#a9761f"/>
                </svg>
                <a
                  href="#sandbox-spec"
                  className="block text-sm font-medium text-[#594648] group-hover:text-[#0e6e66] transition-colors leading-snug"
                >
                  Sandbox editor
                </a>
                <span className="text-[11px] text-[#6b585a] mt-0.5 block">Real payload simulator</span>
              </div>

              {/* Item 5: Field notes */}
              <div className="group">
                <svg className="w-7 h-7 mb-2 block" viewBox="0 0 28 28" aria-hidden="true">
                  <rect x="2.5" y="4" width="21" height="18" fill="none" stroke="#231b1c" strokeWidth="1.5"/>
                  <path d="M2.5 9h21" stroke="#231b1c" strokeWidth="1.5"/>
                  <rect x="8" y="12" width="17" height="7.5" fill="#0e6e66"/>
                </svg>
                <a
                  href="#field-spec"
                  className="block text-sm font-medium text-[#594648] group-hover:text-[#0e6e66] transition-colors leading-snug"
                >
                  Field notes
                  <svg className="inline-block w-3 h-3 ml-1 text-[#0e6e66]" viewBox="0 0 13 13" aria-hidden="true">
                    <path d="M3.4 9.6 L9.6 3.4 M4.6 3.4h5v5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <span className="text-[11px] text-[#6b585a] mt-0.5 block">Anti-collusion protocol</span>
              </div>

              {/* Item 6: Production case studies */}
              <div className="group">
                <svg className="w-7 h-7 mb-2 block" viewBox="0 0 28 28" aria-hidden="true">
                  <path d="M14.5 3.5h10.5v7.5h-4.5l-2.6 3v-3h-3.4z" fill="#a9761f"/>
                  <circle cx="10.5" cy="12.5" r="4" fill="none" stroke="#231b1c" strokeWidth="1.6"/>
                  <path d="M2.8 24.5c0-4.4 3.4-7.4 7.7-7.4s7.7 3 7.7 7.4" fill="none" stroke="#231b1c" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                <a
                  href="#case-studies-spec"
                  className="block text-sm font-medium text-[#594648] group-hover:text-[#0e6e66] transition-colors leading-snug"
                >
                  Production case studies
                </a>
                <span className="text-[11px] text-[#6b585a] mt-0.5 block">Construction milestone gating</span>
              </div>

              {/* Item 7: Verified integrators */}
              <div className="group">
                <svg className="w-7 h-7 mb-2 block" viewBox="0 0 28 28" aria-hidden="true">
                  <rect x="6" y="3.5" width="19" height="21" fill="none" stroke="#231b1c" strokeWidth="1.5"/>
                  <path d="M3 7.5h5M3 12h5M3 16.5h5M3 21h5" stroke="#231b1c" strokeWidth="1.4" strokeLinecap="round"/>
                  <circle cx="16" cy="11.5" r="3.4" fill="#0e6e66"/>
                  <path d="M10.8 21c0-2.9 2.3-4.8 5.2-4.8s5.2 1.9 5.2 4.8" fill="#0e6e66"/>
                </svg>
                <a
                  href="#integrators-spec"
                  className="block text-sm font-medium text-[#594648] group-hover:text-[#0e6e66] transition-colors leading-snug"
                >
                  Verified integrators
                  <svg className="inline-block w-3 h-3 ml-1 text-[#0e6e66]" viewBox="0 0 13 13" aria-hidden="true">
                    <path d="M3.4 9.6 L9.6 3.4 M4.6 3.4h5v5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <span className="text-[11px] text-[#6b585a] mt-0.5 block">Ardhisasa & bank escrows</span>
              </div>

              {/* Item 8: Technical papers */}
              <div className="group">
                <svg className="w-7 h-7 mb-2 block" viewBox="0 0 28 28" aria-hidden="true">
                  <path d="M5 2.5h11l7 7v16H5z" fill="none" stroke="#231b1c" strokeWidth="1.5"/>
                  <path d="M16 2.5v7h7" fill="none" stroke="#231b1c" strokeWidth="1.5"/>
                  <path d="M12.2 9.2a3.8 3.8 0 1 1-3.8 3.8h3.8z" fill="#0e6e66"/>
                  <path d="M8.6 22.6v-3.4M12 22.6v-5.6M15.4 22.6v-2.6M18.8 22.6v-4.8" stroke="#231b1c" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <a
                  href="#security-spec"
                  className="block text-sm font-medium text-[#594648] group-hover:text-[#0e6e66] transition-colors leading-snug"
                >
                  Technical papers
                </a>
                <span className="text-[11px] text-[#6b585a] mt-0.5 block">SHA-256 evidence hashing</span>
              </div>
            </div>

            {/* Close Cross */}
            <button
              type="button"
              onClick={() => setMegaOpen(false)}
              className="absolute top-6 right-6 sm:top-8 sm:right-8 w-7 h-7 rounded-full flex items-center justify-center text-[#6b585a] hover:bg-[#f5dfe2] transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M2.6 2.6 L13.4 13.4 M13.4 2.6 L2.6 13.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </section>
      )}

      {/* ---------------- HERO SECTION (Orrera Spec) ---------------- */}
      <main className="relative z-10">
        <section className="relative px-6 sm:px-12 lg:px-16 pt-20 sm:pt-24 pb-16 text-center overflow-hidden">
          {/* Decorative Teal Route Strokes from Orrera */}
          <svg className="absolute left-0 top-16 w-full h-80 pointer-events-none z-0 opacity-80" viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden="true">
            <path d="M120 -40 C 300 60, 420 130, 560 216" fill="none" stroke="#7fb3a9" strokeWidth="9" strokeLinecap="round"/>
            <path d="M700 340 C 900 300, 1120 200, 1360 24" fill="none" stroke="#7fb3a9" strokeWidth="9" strokeLinecap="round"/>
          </svg>

          <div className="relative z-10 max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#efd8db] text-[#a9761f] border border-[#e9d3d6] text-xs font-mono font-bold">
              <span>ORRERA CADASTRAL COORDINATE ENGINE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-semibold leading-[1.18] tracking-[-1px] text-[#231b1c] max-w-3xl mx-auto">
              Every address, junction and doorway in one dependable coordinate set.
            </h1>

            <p className="text-lg sm:text-[19px] leading-relaxed text-[#6b585a] max-w-2xl mx-auto">
              Geocoding, on-ground field auditing and cadastral verification behind a single key — priced per call, versioned per release, with cryptographic SHA-256 evidence logs you can actually verify.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center h-12 px-8 rounded bg-[#0e6e66] hover:bg-[#0a544e] text-white text-base font-medium shadow-md hover:shadow-lg transition-all"
              >
                Start building
              </Link>
              <Link
                to="/contact?type=quote"
                className="inline-flex items-center justify-center h-12 px-7 rounded border border-[#e9d3d6] bg-[#fffbfc] hover:bg-[#f9f0f1] text-[#0e6e66] text-base font-medium transition-all"
              >
                Request Enterprise Key
              </Link>
            </div>
          </div>
        </section>

        {/* ---------------- 3 FEATURE DECKS (Orrera Spec) ---------------- */}
        <section className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Deck A: Dark Slate Card with Big Stat */}
            <article className="orrera-deck orrera-deck-a group">
              <p className="text-xs font-bold uppercase tracking-[1.4px] text-[#d4bec1] mb-9 z-10">
                WHY DIASPORAVERIFY
              </p>
              <p className="text-7xl sm:text-[88px] xl:text-[96px] font-normal leading-none tracking-[-3px] text-white z-10 my-auto">
                184<em className="text-4xl sm:text-5xl font-normal not-italic tracking-[-1px] text-[#7fb3a9]">M+</em>
              </p>
              <h3 className="text-2xl sm:text-[28px] font-normal leading-[1.25] tracking-[-0.3px] text-[#f3e2e5] max-w-[240px] z-10 mt-4">
                verified places and cadastral roads
              </h3>
            </article>

            {/* Deck B: Blush Card with Field Ops Photo & Veil */}
            <article className="orrera-deck orrera-deck-b group">
              <div className="absolute inset-0 z-0">
                <img
                  src="https://images.pexels.com/photos/5025668/pexels-photo-5025668.jpeg?auto=compress&cs=tinysrgb&h=640&w=840"
                  alt="A courier signing off a parcel on a suburban street at golden hour"
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              </div>
              <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#efd8db] via-[#efd8db]/90 sm:via-[#efd8db]/70 to-transparent" />
              
              <p className="text-xs font-bold uppercase tracking-[1.4px] text-[#a9761f] mb-9 z-10">
                FIELD OPS
              </p>
              <h3 className="text-2xl sm:text-[28px] font-normal leading-[1.25] tracking-[-0.3px] text-[#231b1c] max-w-[240px] z-10 my-auto">
                Route every crew from one console
              </h3>
              <div className="z-10 mt-4">
                <svg className="w-9 h-7 text-[#a9761f] transition-transform duration-300 group-hover:translate-x-2" viewBox="0 0 37 28" aria-hidden="true">
                  <path d="M2 14h31M23 4 L34 14 L23 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </article>

            {/* Deck C: Deep Dark Map Plate with Pickable Layers */}
            <article className="orrera-deck orrera-deck-c group">
              <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#2a1719] to-[#201214]">
                <svg className="w-full h-full opacity-90" viewBox="0 0 420 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <g stroke="#361f22" strokeWidth="12">
                    <path d="M-20 74h460M-20 176h460M-20 268h460"/>
                    <path d="M92 -20v360M212 -20v360M330 -20v360"/>
                  </g>
                  <g stroke="#2f191c" strokeWidth="4">
                    <path d="M-20 122h460M-20 222h460M152 -20v360M272 -20v360M386 -20v360"/>
                  </g>
                  <path d="M-20 300 L212 300 L212 222 L330 222 L330 74 L440 74" fill="none" stroke="#3f8f83" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="330" cy="222" r="9" fill="#a9761f"/>
                  <path d="M226 104 h62 v40 h-62z" fill="#321b1e"/>
                  <path d="M244 262 h82 v46 h-82z" fill="#321b1e"/>
                </svg>
                <span className="absolute right-3 bottom-2 text-[9px] tracking-[0.4px] text-white/40 font-mono">
                  Base map © DiasporaVerify Cadastral
                </span>
              </div>
              <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#1e1113] via-[#1e1113]/85 to-transparent" />

              <p className="text-xs font-bold uppercase tracking-[1.4px] text-[#d4bec1] mb-9 z-10">
                PLATFORM
              </p>
              <h3 className="text-2xl sm:text-[28px] font-normal leading-[1.25] tracking-[-0.3px] text-[#f6e5e8] max-w-[240px] z-10 my-auto">
                Pick the layers you actually need
              </h3>
              <div className="z-10 mt-4">
                <svg className="w-9 h-7 text-[#7fb3a9] transition-transform duration-300 group-hover:translate-x-2" viewBox="0 0 37 28" aria-hidden="true">
                  <path d="M2 14h31M23 4 L34 14 L23 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </article>

          </div>
        </section>

        {/* ---------------- INTERACTIVE API PLAYGROUND ---------------- */}
        <section id="api-spec" className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 pb-24">
          <div className="bg-[#fffbfc] rounded-3xl border border-[#e9d3d6] p-6 sm:p-10 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e9d3d6] pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0e6e66]/10 text-[#0e6e66]">
                    REST API v2.4
                  </span>
                  <span className="text-xs text-[#a9761f] font-mono font-semibold">
                    GET /v2/dossiers/{SAMPLE_DOSSIER.referenceId}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-[#231b1c] mt-1">
                  Developer Code Sandbox & JSON Telemetry
                </h3>
                <p className="text-xs sm:text-sm text-[#6b585a] mt-0.5">
                  Inspect the live payload format returned for verified field inspection dossiers.
                </p>
              </div>

              {/* Code Language Switcher */}
              <div className="flex items-center gap-2">
                {(['curl', 'typescript', 'python'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveCodeTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                      activeCodeTab === tab
                        ? 'bg-[#0e6e66] text-white shadow-xs'
                        : 'bg-[#fdf5f6] text-[#594648] hover:bg-[#efd8db]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Block & Response Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Request Code */}
              <div className="rounded-2xl bg-[#1b1616] p-5 text-white font-mono text-xs relative group">
                <div className="flex items-center justify-between text-[11px] text-[#7fb3a9] pb-3 border-b border-white/10 mb-3">
                  <span>REQUEST EXAMPLE ({activeCodeTab.toUpperCase()})</span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 text-white/60 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedCode ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="overflow-x-auto leading-relaxed text-[#fdf5f6]">
                  {activeSnippet}
                </pre>
              </div>

              {/* Response JSON */}
              <div className="rounded-2xl bg-[#fffbfc] border border-[#e9d3d6] p-5 font-mono text-xs overflow-x-auto max-h-[220px]">
                <div className="flex items-center justify-between text-[11px] text-[#0e6e66] font-bold pb-2 border-b border-[#e9d3d6] mb-2">
                  <span>LIVE RESPONSE 200 OK</span>
                  <span className="text-[#a9761f]">SHA-256 SEALED</span>
                </div>
                <pre className="text-[#231b1c] leading-relaxed">
{JSON.stringify({
  status: "success",
  dossierId: SAMPLE_DOSSIER.referenceId,
  serviceCategory: SAMPLE_DOSSIER.serviceCategory,
  location: {
    town: SAMPLE_DOSSIER.location.town,
    county: SAMPLE_DOSSIER.location.county,
    gpsCoords: SAMPLE_DOSSIER.location.gpsCoords
  },
  evidenceTelemetry: {
    photoCount: SAMPLE_DOSSIER.media.length,
    sha256Seal: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    antiSpoofingDistanceMeters: 4.2
  }
}, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---------------- FOOTER (Orrera Minimal) ---------------- */}
      <footer className="border-t border-[#e9d3d6] py-10 px-6 sm:px-12 lg:px-16 text-center text-xs text-[#6b585a]">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#231b1c]">Orrera Location Platform Integration</span>
            <span>·</span>
            <span>DiasporaVerify API Platform v2.4</span>
          </div>
          <div className="flex items-center gap-4 text-[#594648]">
            <Link to="/" className="hover:text-[#0e6e66]">Public Website</Link>
            <Link to="/sample-report" className="hover:text-[#0e6e66]">Sample Report</Link>
            <Link to="/contact" className="hover:text-[#0e6e66]">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DevelopersPage;
