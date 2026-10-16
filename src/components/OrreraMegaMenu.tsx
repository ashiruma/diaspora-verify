import React, { useEffect } from 'react';

interface OrreraMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const OrreraMegaMenu: React.FC<OrreraMegaMenuProps> = ({ isOpen, onClose, onNavigate }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop for outside click */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-[1px]"
        onClick={onClose}
        aria-label="Close developers menu"
      />
      <div className="orrera-mega animate-in fade-in slide-in-from-top-2 duration-150">
        <div className="orrera-mega-inner">
          {/* Left Column: Heading, Subtitle & Direct Link to Hub */}
          <div className="pr-4 pb-6 lg:pb-0 border-b lg:border-b-0 border-[#e9d3d6] flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0e6e66]/10 text-[#0e6e66] text-[10px] font-mono font-bold mb-3">
                <span>ORRERA LOCATION SPEC</span>
              </div>
              <h2 className="text-2xl font-normal leading-tight tracking-tight text-[#231b1c] font-display">
                Developers
              </h2>
              <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-[#6b585a] max-w-[260px]">
                Every address, cadastral parcel and junction in one coordinate set, layers pickable for diaspora field verification.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#e9d3d6] space-y-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigate('/developers');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0e6e66] hover:text-[#0a544e] transition-colors cursor-pointer group"
              >
                <span>Open Full Developer Hub</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </button>
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#594648]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Nairobi Metro API v2.4 Live</span>
              </div>
            </div>
          </div>

          {/* Right Column: 8-Item Icon Grid */}
          <div className="pt-6 lg:pt-0 lg:pl-10 orrera-icongrid">
            {/* 1. API reference */}
            <div
              className="group cursor-pointer"
              onClick={() => {
                onClose();
                onNavigate('/developers#api-spec');
              }}
            >
              <svg className="w-7 h-7 mb-2 block" viewBox="0 0 28 28" aria-hidden="true">
                <path d="M5 2.5h11l7 7v16H5z" fill="none" stroke="#231b1c" strokeWidth="1.5"/>
                <path d="M16 2.5v7h7" fill="none" stroke="#231b1c" strokeWidth="1.5"/>
                <path d="M8.5 12h11M8.5 15.5h11M8.5 19h7" stroke="#231b1c" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="21" cy="20.5" r="5" fill="#0e6e66"/>
                <path d="M18.7 20.6 L20.4 22.3 L23.3 19" fill="none" stroke="#fffbfc" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="block text-xs sm:text-sm font-semibold text-[#594648] group-hover:text-[#0e6e66] transition-colors leading-snug">
                API reference ↗
              </span>
              <span className="text-[11px] text-[#6b585a] mt-0.5 block">REST, GraphQL & Webhooks</span>
            </div>

            {/* 2. Coverage map */}
            <div
              className="group cursor-pointer"
              onClick={() => {
                onClose();
                onNavigate('/developers#coverage-spec');
              }}
            >
              <svg className="w-7 h-7 mb-2 block" viewBox="0 0 28 28" aria-hidden="true">
                <rect x="14" y="3.5" width="10.5" height="10.5" fill="#a9761f"/>
                <circle cx="12" cy="11.5" r="7" fill="none" stroke="#231b1c" strokeWidth="1.6"/>
                <path d="M6.8 16.8 L2.8 24.8" stroke="#231b1c" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <span className="block text-xs sm:text-sm font-semibold text-[#594648] group-hover:text-[#0e6e66] transition-colors leading-snug">
                Coverage map
              </span>
              <span className="text-[11px] text-[#6b585a] mt-0.5 block">Nairobi Metro pilot polygons</span>
            </div>

            {/* 3. Sample gallery */}
            <div
              className="group cursor-pointer"
              onClick={() => {
                onClose();
                onNavigate('/sample-report');
              }}
            >
              <svg className="w-7 h-7 mb-2 block" viewBox="0 0 28 28" aria-hidden="true">
                <path d="M2.5 7h23M2.5 14h23M2.5 21h23" stroke="#231b1c" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M8 3.6v6.8M19 10.6v6.8M11 17.6v6.8" stroke="#0e6e66" strokeWidth="2.6" strokeLinecap="round"/>
              </svg>
              <span className="block text-xs sm:text-sm font-semibold text-[#594648] group-hover:text-[#0e6e66] transition-colors leading-snug">
                Sample gallery
              </span>
              <span className="text-[11px] text-[#6b585a] mt-0.5 block">DV-DEMO-2026-KJD Dossier</span>
            </div>

            {/* 4. Sandbox editor */}
            <div
              className="group cursor-pointer"
              onClick={() => {
                onClose();
                onNavigate('/developers#sandbox-spec');
              }}
            >
              <svg className="w-7 h-7 mb-2 block" viewBox="0 0 28 28" aria-hidden="true">
                <rect x="3" y="3.5" width="22" height="20" fill="none" stroke="#231b1c" strokeWidth="1.5"/>
                <path d="M3 8.4h22" stroke="#231b1c" strokeWidth="1.5"/>
                <path d="M11.5 12 L20.5 15.6 L16.6 17.2 L14.8 21.4z" fill="#a9761f"/>
              </svg>
              <span className="block text-xs sm:text-sm font-semibold text-[#594648] group-hover:text-[#0e6e66] transition-colors leading-snug">
                Sandbox editor
              </span>
              <span className="text-[11px] text-[#6b585a] mt-0.5 block">Real payload simulator</span>
            </div>

            {/* 5. Field notes */}
            <div
              className="group cursor-pointer"
              onClick={() => {
                onClose();
                onNavigate('/developers#field-spec');
              }}
            >
              <svg className="w-7 h-7 mb-2 block" viewBox="0 0 28 28" aria-hidden="true">
                <rect x="2.5" y="4" width="21" height="18" fill="none" stroke="#231b1c" strokeWidth="1.5"/>
                <path d="M2.5 9h21" stroke="#231b1c" strokeWidth="1.5"/>
                <rect x="8" y="12" width="17" height="7.5" fill="#0e6e66"/>
              </svg>
              <span className="block text-xs sm:text-sm font-semibold text-[#594648] group-hover:text-[#0e6e66] transition-colors leading-snug">
                Field notes ↗
              </span>
              <span className="text-[11px] text-[#6b585a] mt-0.5 block">Anti-collusion protocol</span>
            </div>

            {/* 6. Production case studies */}
            <div
              className="group cursor-pointer"
              onClick={() => {
                onClose();
                onNavigate('/developers#case-studies-spec');
              }}
            >
              <svg className="w-7 h-7 mb-2 block" viewBox="0 0 28 28" aria-hidden="true">
                <path d="M14.5 3.5h10.5v7.5h-4.5l-2.6 3v-3h-3.4z" fill="#a9761f"/>
                <circle cx="10.5" cy="12.5" r="4" fill="none" stroke="#231b1c" strokeWidth="1.6"/>
                <path d="M2.8 24.5c0-4.4 3.4-7.4 7.7-7.4s7.7 3 7.7 7.4" fill="none" stroke="#231b1c" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              <span className="block text-xs sm:text-sm font-semibold text-[#594648] group-hover:text-[#0e6e66] transition-colors leading-snug">
                Production case studies
              </span>
              <span className="text-[11px] text-[#6b585a] mt-0.5 block">Construction milestone gating</span>
            </div>

            {/* 7. Verified integrators */}
            <div
              className="group cursor-pointer"
              onClick={() => {
                onClose();
                onNavigate('/developers#integrators-spec');
              }}
            >
              <svg className="w-7 h-7 mb-2 block" viewBox="0 0 28 28" aria-hidden="true">
                <rect x="6" y="3.5" width="19" height="21" fill="none" stroke="#231b1c" strokeWidth="1.5"/>
                <path d="M3 7.5h5M3 12h5M3 16.5h5M3 21h5" stroke="#231b1c" strokeWidth="1.4" strokeLinecap="round"/>
                <circle cx="16" cy="11.5" r="3.4" fill="#0e6e66"/>
                <path d="M10.8 21c0-2.9 2.3-4.8 5.2-4.8s5.2 1.9 5.2 4.8" fill="#0e6e66"/>
              </svg>
              <span className="block text-xs sm:text-sm font-semibold text-[#594648] group-hover:text-[#0e6e66] transition-colors leading-snug">
                Verified integrators ↗
              </span>
              <span className="text-[11px] text-[#6b585a] mt-0.5 block">Ardhisasa & bank escrows</span>
            </div>

            {/* 8. Technical papers */}
            <div
              className="group cursor-pointer"
              onClick={() => {
                onClose();
                onNavigate('/developers#security-spec');
              }}
            >
              <svg className="w-7 h-7 mb-2 block" viewBox="0 0 28 28" aria-hidden="true">
                <path d="M5 2.5h11l7 7v16H5z" fill="none" stroke="#231b1c" strokeWidth="1.5"/>
                <path d="M16 2.5v7h7" fill="none" stroke="#231b1c" strokeWidth="1.5"/>
                <path d="M12.2 9.2a3.8 3.8 0 1 1-3.8 3.8h3.8z" fill="#0e6e66"/>
                <path d="M8.6 22.6v-3.4M12 22.6v-5.6M15.4 22.6v-2.6M18.8 22.6v-4.8" stroke="#231b1c" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="block text-xs sm:text-sm font-semibold text-[#594648] group-hover:text-[#0e6e66] transition-colors leading-snug">
                Technical papers
              </span>
              <span className="text-[11px] text-[#6b585a] mt-0.5 block">SHA-256 evidence hashing</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrreraMegaMenu;
