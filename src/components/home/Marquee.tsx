import { Sparkles } from 'lucide-react';

export function Marquee() {
  const items = [
    'INDEPENDENT KENYA FIELD DUE DILIGENCE',
    'BOOTS ON THE GROUND IN MASHINANI',
    'ZERO CONFLICT OF INTEREST',
    'SHA-256 TAMPER-PROOF EVIDENCE',
    '48-HOUR FIELD DISPATCH',
    'STOP SENDING MONEY ON BLIND FAITH',
    'FIXED TRANSPARENT QUOTES',
    'NAIROBI · KIAMBU · MACHAKOS · KAJIADO',
  ];

  return (
    <div className="relative w-full overflow-hidden py-1.5 sm:py-2.5 bg-gradient-to-b from-[#FAF9F6] via-transparent to-[#FAF8F5]">
      {/* Ambient warm golden backlight to give glass refraction */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-14 bg-gradient-to-r from-[#b89a62]/15 via-[#c9b08a]/25 to-[#b89a62]/15 blur-2xl"
      />

      {/* Glassmorphic Obsidian Ribbon */}
      <div className="group relative overflow-hidden border-y border-[#c9b08a]/30 bg-[#12100e]/85 py-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),inset_0_-1px_1px_rgba(201,176,138,0.12),0_8px_32px_rgba(0,0,0,0.14)] backdrop-blur-xl">
        {/* Top glass specular reflection */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-[1px] h-px bg-gradient-to-r from-transparent via-[#b89a62]/40 to-transparent" />

        {/* Smooth Vignette Edge Masks (Left & Right) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-40 bg-gradient-to-r from-[#12100e] via-[#12100e]/85 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-40 bg-gradient-to-l from-[#12100e] via-[#12100e]/85 to-transparent z-10" />

        {/* Continuous Kinetic Ticker */}
        <div className="flex whitespace-nowrap animate-marquee-x motion-reduce:animate-none group-hover:[animation-play-state:paused]">
          {/* Primary Track */}
          <div className="flex shrink-0 items-center">
            {items.map((text, i) => (
              <span
                key={`primary-${i}`}
                className="mx-5 sm:mx-7 inline-flex items-center gap-5 sm:gap-7 text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] uppercase text-[#f5eee6] transition-colors"
              >
                <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">{text}</span>
                <Sparkles className="w-3 h-3 text-[#b89a62] drop-shadow-[0_0_8px_rgba(184,154,98,0.7)] shrink-0" />
              </span>
            ))}
          </div>

          {/* Repeated Track 1 */}
          <div className="flex shrink-0 items-center" aria-hidden="true">
            {items.map((text, i) => (
              <span
                key={`clone-1-${i}`}
                className="mx-5 sm:mx-7 inline-flex items-center gap-5 sm:gap-7 text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] uppercase text-[#f5eee6] transition-colors"
              >
                <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">{text}</span>
                <Sparkles className="w-3 h-3 text-[#b89a62] drop-shadow-[0_0_8px_rgba(184,154,98,0.7)] shrink-0" />
              </span>
            ))}
          </div>

          {/* Repeated Track 2 */}
          <div className="flex shrink-0 items-center" aria-hidden="true">
            {items.map((text, i) => (
              <span
                key={`clone-2-${i}`}
                className="mx-5 sm:mx-7 inline-flex items-center gap-5 sm:gap-7 text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] uppercase text-[#f5eee6] transition-colors"
              >
                <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">{text}</span>
                <Sparkles className="w-3 h-3 text-[#b89a62] drop-shadow-[0_0_8px_rgba(184,154,98,0.7)] shrink-0" />
              </span>
            ))}
          </div>
        </div>

        {/* Bottom subtle gold edge */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c9b08a]/30 to-transparent" />
      </div>
    </div>
  );
}
