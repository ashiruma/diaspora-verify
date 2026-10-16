import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Leaf,
  Truck,
  ShieldCheck,
  Sun,
  Droplets,
  Ruler,
  ArrowUpRight,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

export const RareLeavesPage: React.FC = () => {
  const [activeFamily, setActiveFamily] = useState('All');
  const [selectedEssay, setSelectedEssay] = useState('Araceae');
  const [symptoms, setSymptoms] = useState<string[]>(['Yellowing lower leaves']);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [doctorSubmitted, setDoctorSubmitted] = useState(false);
  const [cartCount, setCartCount] = useState(3);

  const specimenList = [
    {
      id: 'spec-1',
      latin: 'Monstera deliciosa',
      variety: 'albo',
      common: 'Variegated Swiss Cheese',
      price: '$320',
      badge: 'Rare',
      badgeColor: 'bg-[#B26A46]',
      sun: 'Bright',
      water: 'Weekly',
      pot: '6" pot',
      shelf: 'Shelf I · East Wing',
      shelfGroup: 'Aroids & Figs',
      temp: '14°–22° C',
      image: 'https://images.pexels.com/photos/8284916/pexels-photo-8284916.jpeg?auto=compress&cs=tinysrgb&w=720&q=80',
    },
    {
      id: 'spec-2',
      latin: 'Ficus elastica',
      variety: '',
      common: 'Burgundy Rubber Tree',
      price: '$84',
      badge: '',
      badgeColor: '',
      sun: 'Medium',
      water: '10 days',
      pot: '8" pot',
      shelf: 'Shelf I · East Wing',
      shelfGroup: 'Aroids & Figs',
      temp: '14°–22° C',
      image: 'https://images.pexels.com/photos/7189341/pexels-photo-7189341.jpeg?auto=compress&cs=tinysrgb&w=720&q=80',
    },
    {
      id: 'spec-3',
      latin: 'Zamioculcas zamiifolia',
      variety: '',
      common: 'Zanzibar Gem · ZZ',
      price: '$48',
      badge: 'New',
      badgeColor: 'bg-[#4A7A4A]',
      sun: 'Low',
      water: '3 weeks',
      pot: '6" pot',
      shelf: 'Shelf I · East Wing',
      shelfGroup: 'Aroids & Figs',
      temp: '14°–22° C',
      image: 'https://images.pexels.com/photos/3952024/pexels-photo-3952024.jpeg?auto=compress&cs=tinysrgb&w=720&q=80',
    },
    {
      id: 'spec-4',
      latin: 'Philodendron gloriosum',
      variety: '',
      common: 'Velvet Leaf Philodendron',
      price: '$156',
      badge: '',
      badgeColor: '',
      sun: 'Filtered',
      water: 'Weekly',
      pot: '7" pot',
      shelf: 'Shelf II · South Wing',
      shelfGroup: 'Velvet & Variegated',
      temp: '18°–24° C',
      image: 'https://images.pexels.com/photos/6249224/pexels-photo-6249224.jpeg?auto=compress&cs=tinysrgb&w=720&q=80',
    },
    {
      id: 'spec-5',
      latin: 'Monstera adansonii',
      variety: '',
      common: 'Swiss Cheese Vine',
      price: '$62',
      badge: 'Last One',
      badgeColor: 'bg-[#A88A48]',
      sun: 'Bright',
      water: '5 days',
      pot: '5" pot',
      shelf: 'Shelf II · South Wing',
      shelfGroup: 'Velvet & Variegated',
      temp: '18°–24° C',
      image: 'https://images.pexels.com/photos/7193632/pexels-photo-7193632.jpeg?auto=compress&cs=tinysrgb&w=720&q=80',
    },
    {
      id: 'spec-6',
      latin: 'Anthurium clarinervium',
      variety: '',
      common: 'Velvet Cardboard Anthurium',
      price: '$118',
      badge: '',
      badgeColor: '',
      sun: 'Bright',
      water: '5 days',
      pot: '6" pot',
      shelf: 'Shelf II · South Wing',
      shelfGroup: 'Velvet & Variegated',
      temp: '18°–24° C',
      image: 'https://images.pexels.com/photos/6207811/pexels-photo-6207811.jpeg?auto=compress&cs=tinysrgb&w=720&q=80',
    },
  ];

  const handleToggleSymptom = (s: string) => {
    if (symptoms.includes(s)) {
      setSymptoms(symptoms.filter((x) => x !== s));
    } else {
      setSymptoms([...symptoms, s]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0EEE4] text-[#2A3A2A] font-sans antialiased selection:bg-[#4A7A4A] selection:text-[#F0EEE4]">
      
      {/* Return to DiasporaVerify Header Banner */}
      <div className="bg-[#2A3A2A] text-[#F0EEE4] text-xs py-2 px-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#A88A48] animate-pulse" />
          <span className="font-mono uppercase tracking-wider text-[11px] text-[#A88A48]">
            Kombai Reference Showcase: Rare Leaves (ID: rare-leaves)
          </span>
        </div>
        <Link
          to="/"
          className="text-[11px] font-semibold text-[#F0EEE4] hover:text-[#A88A48] transition-colors flex items-center gap-1"
        >
          <span>← Return to DiasporaVerify Platform</span>
        </Link>
      </div>

      {/* ============ TOP BAR ============ */}
      <header className="relative z-30 border-b border-[#2A3A2A]/10 bg-[#F0EEE4]/90 backdrop-blur-md">
        <div className="max-w-[1320px] mx-auto px-6 sm:px-8 py-5 flex items-center justify-between text-[13px] tracking-[0.18em] uppercase">
          <div className="flex items-center gap-2.5 text-[#2A3A2A]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#4A7A4A]" />
            <span className="font-medium">Est. 2014 · Portland, OR</span>
          </div>

          <nav className="hidden md:flex items-center gap-9 text-[#2A3A2A]/80 font-medium">
            <a href="#specimens" className="hover:text-[#4A7A4A] transition-colors">Specimens</a>
            <a href="#care-library" className="hover:text-[#4A7A4A] transition-colors">Care Library</a>
            <a href="#plant-doctor" className="hover:text-[#4A7A4A] transition-colors">Plant Doctor</a>
            <a href="#shipping" className="hover:text-[#4A7A4A] transition-colors">Shipping</a>
            <a href="#journal" className="hover:text-[#4A7A4A] transition-colors">Journal</a>
          </nav>

          <div className="flex items-center gap-5 text-[#2A3A2A]">
            <span className="text-[11px] font-mono cursor-pointer flex items-center gap-1">
              <span>USD</span>
              <ChevronDown className="w-3 h-3 text-[#2A3A2A]/60" />
            </span>
            <button className="text-base text-[#2A3A2A]/80 hover:text-[#4A7A4A] cursor-pointer" aria-label="Search">
              <Search className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setCartCount(c => c + 1)}
              className="text-base relative text-[#2A3A2A] hover:text-[#4A7A4A] cursor-pointer" 
              aria-label="Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1.5 -right-2 text-[9px] bg-[#B26A46] text-[#F0EEE4] rounded-full w-4 h-4 grid place-items-center font-mono font-bold shadow-xs">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ============ HERO SECTION ============ */}
      <section className="relative min-h-[88vh] lg:min-h-[94vh] flex items-center justify-center overflow-hidden py-16 px-4">
        {/* Full-bleed sunlit conservatory video / backdrop */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="https://kombai-assets-dev.b-cdn.net/generated_assets/a993fd29-0101-46bc-9b8b-13bc576c1070/81cc2b1e0ab94a48bc059072af24501a.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="https://images.unsplash.com/photo-1493673272479-a20888bcee10?auto=format&w=1600&q=75&fit=crop"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A3A2A]/20 via-transparent to-[#2A3A2A]/50 pointer-events-none" />

        {/* Top etched name */}
        <div className="absolute top-8 sm:top-12 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10 w-full px-4">
          <div className="font-serif-t etched text-3xl sm:text-4xl lg:text-[42px] leading-none tracking-[0.02em]">
            Verriére &amp; Vine
          </div>
          <div className="text-[9px] sm:text-[10px] tracking-[0.5em] mt-2.5 text-white/80 uppercase font-mono">
            RARE HOUSEPLANTS · SHIPPED NATIONALLY
          </div>
        </div>

        {/* Centered Frosted Glass Panel with Revolving Brass Ring */}
        <div className="relative z-20 my-auto w-full max-w-[760px] px-4">
          <div className="relative">
            {/* Revolving Brass Ring */}
            <div className="spin-ring absolute -inset-8 sm:-inset-12 pointer-events-none opacity-80">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                <circle cx="200" cy="200" r="195" fill="none" stroke="#A88A48" strokeWidth="0.7" strokeDasharray="2 8" />
                <circle cx="200" cy="200" r="180" fill="none" stroke="#A88A48" strokeWidth="0.4" />
                <circle cx="200" cy="5" r="3.5" fill="#A88A48" />
                <circle cx="200" cy="395" r="2.5" fill="#A88A48" />
              </svg>
            </div>

            {/* Glass Overlay Box */}
            <div
              className="relative refract-edge rounded-[2px] px-6 sm:px-14 py-10 sm:py-14 text-center"
              style={{
                background: 'linear-gradient(180deg, rgba(240,238,228,0.08) 0%, rgba(42,58,42,0.22) 100%)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.35)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45), inset 0 0 22px rgba(255,255,255,0.08), 0 30px 80px -20px rgba(0,0,0,0.4)',
              }}
            >
              <div className="text-[10px] tracking-[0.5em] text-white/85 mb-5 uppercase font-mono">
                · THE GLASSHOUSE ·
              </div>

              <h1 className="font-serif-t etched text-4xl sm:text-6xl lg:text-[76px] leading-[0.95] tracking-[-0.02em]">
                A quiet <span className="italic font-light">conservatory</span>
                <br />
                of rare leaves.
              </h1>

              <p className="mt-6 text-sm sm:text-[15px] text-white/90 max-w-md mx-auto leading-relaxed">
                Hand-grown specimens — <span className="italic font-serif">Monstera, Philodendron, Anthurium</span> — packed in insulated crates and delivered to your door.
              </p>

              <div className="mt-8 sm:mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="#specimens"
                  className="w-full sm:w-auto px-7 py-3.5 bg-[#4A7A4A] hover:bg-[#2A3A2A] text-[#F0EEE4] text-[12px] tracking-[0.25em] uppercase font-semibold transition-all shadow-md cursor-pointer"
                >
                  Enter the Catalog
                </a>
                <a
                  href="#plant-doctor"
                  className="w-full sm:w-auto px-7 py-3.5 border border-white/40 hover:bg-white/10 text-white text-[12px] tracking-[0.25em] uppercase backdrop-blur-xs font-semibold transition-all cursor-pointer"
                >
                  Plant Doctor
                </a>
              </div>
            </div>

            {/* Bottom Guarantee Stat Strip */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white/90 font-mono">
              <span className="flex items-center gap-2">
                <Leaf className="w-3.5 h-3.5 text-[#A88A48]" />
                <span>240+ Species</span>
              </span>
              <span className="hidden sm:inline-block w-8 h-px bg-white/30" />
              <span className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#A88A48]" />
                <span>48-State Shipping</span>
              </span>
              <span className="hidden sm:inline-block w-8 h-px bg-white/30" />
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A88A48]" />
                <span>Live-Arrival Guarantee</span>
              </span>
            </div>
          </div>
        </div>

        {/* Corner Etched Coordinates */}
        <div className="absolute bottom-6 left-6 sm:left-8 text-white/70 text-[10px] tracking-[0.3em] font-mono pointer-events-none">
          45.5152° N / 122.6784° W
        </div>
        <div className="absolute bottom-6 right-6 sm:right-8 text-white/70 text-[10px] tracking-[0.3em] font-mono pointer-events-none">
          PANE №01 / ENTRY
        </div>
      </section>

      {/* ============ FOLIO II: THE SPECIMEN CATALOG ============ */}
      <section id="specimens" className="relative py-24 sm:py-28 px-6 sm:px-8 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 20% 10%, rgba(74,122,74,0.08), transparent 50%), radial-gradient(circle at 80% 80%, rgba(178,106,70,0.08), transparent 50%)',
          }}
        />

        <div className="max-w-[1320px] mx-auto relative">
          
          {/* Section Head */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 border-b border-[#A88A48]/40 pb-6">
            <div>
              <div className="text-[11px] tracking-[0.45em] text-[#B26A46] uppercase font-mono mb-2">
                — FOLIO II
              </div>
              <h2 className="font-serif-t text-4xl sm:text-5xl lg:text-[64px] leading-[0.95] tracking-[-0.02em] text-[#2A3A2A]">
                The Specimen<br />
                <span className="italic font-light">Catalog</span>
              </h2>
            </div>
            <div className="text-left md:text-right text-[#2A3A2A]/70 max-w-sm text-xs sm:text-[14px] leading-relaxed">
              Each plant is photographed on its glass shelf in the conservatory the morning before it ships.
              <span className="text-[11px] tracking-[0.3em] uppercase text-[#A88A48] mt-2 block font-mono">
                Showing 6 of 247
              </span>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2 mb-10 text-[12px]">
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#2A3A2A]/60 mr-2 font-mono">
              Family ·
            </span>
            {['All', 'Araceae', 'Moraceae', 'Marantaceae', 'Asparagaceae'].map((fam) => {
              const active = activeFamily === fam;
              return (
                <button
                  key={fam}
                  onClick={() => setActiveFamily(fam)}
                  className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                    active
                      ? 'bg-[#4A7A4A] text-[#F0EEE4] font-semibold shadow-xs'
                      : 'border border-[#2A3A2A]/20 italic font-serif text-[#2A3A2A] hover:border-[#4A7A4A]'
                  }`}
                >
                  {fam}
                </button>
              );
            })}
            <span className="ml-auto text-[11px] tracking-[0.3em] uppercase text-[#2A3A2A]/60 font-mono">
              Sort: New Arrivals ▾
            </span>
          </div>

          {/* SHELF 1: Aroids & Figs */}
          <div className="relative mb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7 pb-5">
              {specimenList.slice(0, 3).map((plant) => (
                <article
                  key={plant.id}
                  className="group glass-pane refract-edge rounded-[2px] p-5 transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  {plant.badge && (
                    <div
                      className={`absolute top-4 left-4 z-10 text-[10px] tracking-[0.3em] uppercase px-2 py-1 ${plant.badgeColor} text-[#F0EEE4] font-mono`}
                    >
                      {plant.badge}
                    </div>
                  )}
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#F0EEE4] mb-5">
                    <img
                      className="breeze w-full h-full object-cover"
                      src={plant.image}
                      alt={plant.common}
                      decoding="async"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="italic font-serif text-[22px] text-[#2A3A2A] leading-tight">
                        {plant.latin}
                        {plant.variety && (
                          <span className="not-italic text-[11px] uppercase tracking-[0.3em] text-[#A88A48] ml-1.5 font-sans font-bold">
                            {plant.variety}
                          </span>
                        )}
                      </h3>
                      <p className="text-[13px] text-[#2A3A2A]/70 mt-1">{plant.common}</p>
                    </div>
                    <div className="font-serif-t text-[28px] text-[#2A3A2A] -mt-1">{plant.price}</div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-[#A88A48]/30 flex items-center gap-4 text-[12px] text-[#2A3A2A]/70">
                    <span className="flex items-center gap-1.5 text-[#A88A48]">
                      <Sun className="w-3.5 h-3.5" />
                      <span className="text-[#2A3A2A]/70">{plant.sun}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-[#A88A48]">
                      <Droplets className="w-3.5 h-3.5" />
                      <span className="text-[#2A3A2A]/70">{plant.water}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-[#A88A48]">
                      <Ruler className="w-3.5 h-3.5" />
                      <span className="text-[#2A3A2A]/70">{plant.pot}</span>
                    </span>
                    <button
                      onClick={() => setCartCount(c => c + 1)}
                      className="ml-auto text-[#4A7A4A] hover:text-[#2A3A2A] transition-colors p-1"
                      title="Add specimen to bag"
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Iron Shelf Rail */}
            <div className="iron-shelf" />
            <div className="flex justify-between mt-3 text-[10px] tracking-[0.3em] uppercase text-[#2A3A2A]/50 font-mono">
              <span>Shelf I · East Wing</span>
              <span className="italic font-serif not-italic">Aroids &amp; Figs</span>
              <span>14°–22° C</span>
            </div>
          </div>

          {/* SHELF 2: Velvet & Variegated */}
          <div className="relative mb-14">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7 pb-5">
              {specimenList.slice(3, 6).map((plant) => (
                <article
                  key={plant.id}
                  className="group glass-pane refract-edge rounded-[2px] p-5 transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  {plant.badge && (
                    <div
                      className={`absolute top-4 left-4 z-10 text-[10px] tracking-[0.3em] uppercase px-2 py-1 ${plant.badgeColor} text-[#F0EEE4] font-mono`}
                    >
                      {plant.badge}
                    </div>
                  )}
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#F0EEE4] mb-5">
                    <img
                      className="breeze w-full h-full object-cover"
                      src={plant.image}
                      alt={plant.common}
                      decoding="async"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="italic font-serif text-[22px] text-[#2A3A2A] leading-tight">
                        {plant.latin}
                      </h3>
                      <p className="text-[13px] text-[#2A3A2A]/70 mt-1">{plant.common}</p>
                    </div>
                    <div className="font-serif-t text-[28px] text-[#2A3A2A] -mt-1">{plant.price}</div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-[#A88A48]/30 flex items-center gap-4 text-[12px] text-[#2A3A2A]/70">
                    <span className="flex items-center gap-1.5 text-[#A88A48]">
                      <Sun className="w-3.5 h-3.5" />
                      <span className="text-[#2A3A2A]/70">{plant.sun}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-[#A88A48]">
                      <Droplets className="w-3.5 h-3.5" />
                      <span className="text-[#2A3A2A]/70">{plant.water}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-[#A88A48]">
                      <Ruler className="w-3.5 h-3.5" />
                      <span className="text-[#2A3A2A]/70">{plant.pot}</span>
                    </span>
                    <button
                      onClick={() => setCartCount(c => c + 1)}
                      className="ml-auto text-[#4A7A4A] hover:text-[#2A3A2A] transition-colors p-1"
                      title="Add specimen to bag"
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Iron Shelf Rail */}
            <div className="iron-shelf" />
            <div className="flex justify-between mt-3 text-[10px] tracking-[0.3em] uppercase text-[#2A3A2A]/50 font-mono">
              <span>Shelf II · South Wing</span>
              <span>Velvet &amp; Variegated</span>
              <span>18°–24° C</span>
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="inline-flex items-center gap-3 px-9 py-4 border border-[#2A3A2A] text-[#2A3A2A] text-[12px] tracking-[0.3em] uppercase hover:bg-[#2A3A2A] hover:text-[#F0EEE4] transition-all cursor-pointer font-semibold">
              <span>Browse all 247 specimens</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ============ FOLIO III: CARE LIBRARY ============ */}
      <section id="care-library" className="relative py-28 px-6 sm:px-8 bg-[#2A3A2A] text-[#F0EEE4] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1493673272479-a20888bcee10?auto=format&w=1600&q=70&fit=crop"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none"
          decoding="async"
          loading="lazy"
          alt=""
        />

        <div className="max-w-[1320px] mx-auto relative grid grid-cols-12 gap-10">
          
          {/* Left Index Sidebar */}
          <aside className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="sticky top-12 space-y-6">
              <div>
                <div className="text-[11px] tracking-[0.45em] text-[#A88A48] uppercase font-mono mb-2">
                  — FOLIO III
                </div>
                <h2 className="font-serif-t text-4xl sm:text-[44px] leading-[0.95]">
                  The Care<br />
                  <span className="italic font-light">Library</span>
                </h2>
              </div>

              <div className="brass-rule h-px w-full" />

              <div>
                <div className="text-[10px] tracking-[0.35em] uppercase text-[#F0EEE4]/50 mb-3 font-mono">
                  Plant Families
                </div>
                <ul className="space-y-1 text-[15px]">
                  {[
                    { name: 'Araceae', count: '·24' },
                    { name: 'Moraceae', count: '·12' },
                    { name: 'Marantaceae', count: '·18' },
                    { name: 'Begoniaceae', count: '·09' },
                    { name: 'Gesneriaceae', count: '·07' },
                    { name: 'Asparagaceae', count: '·15' },
                    { name: 'Piperaceae', count: '·11' },
                  ].map((f) => {
                    const isSelected = selectedEssay === f.name;
                    return (
                      <li key={f.name}>
                        <button
                          onClick={() => setSelectedEssay(f.name)}
                          className={`w-full text-left pl-3 py-1.5 italic font-serif transition-colors flex items-center justify-between cursor-pointer border-l-2 ${
                            isSelected
                              ? 'border-[#A88A48] text-white font-medium'
                              : 'border-transparent text-white/60 hover:text-white'
                          }`}
                        >
                          <span>{f.name}</span>
                          <span className="not-italic text-[11px] text-[#A88A48] font-mono tracking-widest">
                            {f.count}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="p-5 border border-[#A88A48]/30 rounded-sm bg-white/[0.03] space-y-2">
                <div className="text-[10px] tracking-[0.3em] uppercase text-[#A88A48] font-mono">
                  New Essay
                </div>
                <p className="text-[13px] leading-snug text-white/85">
                  Reading the leaves: a field guide to <span className="italic font-serif">Monstera</span> stress signals.
                </p>
              </div>
            </div>
          </aside>

          {/* Editorial Articles & Reading Plates */}
          <div className="col-span-12 md:col-span-8 lg:col-span-9 space-y-16">
            
            {/* Article 1 */}
            <article className="grid md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-7 space-y-4">
                <div className="text-[10px] tracking-[0.4em] uppercase text-[#A88A48] font-mono">
                  Volume 04 · Aroids
                </div>
                <h3 className="font-serif-t text-3xl sm:text-[40px] leading-[1.05]">
                  On the patience of the <span className="italic font-light">aroid family</span> — a slow choreography of light, water, and time.
                </h3>
                <p className="drop-cap text-[15px] leading-[1.85] text-[#F0EEE4]/85">
                  The Araceae are a quiet kind of plant. They do not announce themselves the way a flowering jasmine might, nor do they sulk like a fiddle-leaf fig. Instead, members of this family — <span className="italic font-serif">Monstera, Philodendron, Anthurium, Alocasia</span> — keep a slow, deliberate calendar. A new leaf may take six weeks to unfurl. A petiole may lengthen for a month before the lamina opens. This is the rhythm to which the grower must learn to listen.
                </p>
                <p className="text-[15px] leading-[1.85] text-[#F0EEE4]/80">
                  Light, in particular, is misread more often than it is understood. Bright indirect — the phrase repeated in every care card — really means the brightness of an east-facing window an hour after sunrise, filtered through a sheer curtain of cotton voile.
                </p>
              </div>

              <figure className="md:col-span-5 relative">
                <div className="relative refract-edge rounded-[2px] overflow-hidden border border-white/15">
                  <img
                    className="w-full h-[400px] object-cover"
                    src="https://images.unsplash.com/photo-1525498128493-380d1990a112?auto=format&w=900&q=80&fit=crop"
                    alt="Monstera deliciosa fenestrated lamina"
                    decoding="async"
                    loading="lazy"
                  />
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </div>
                <figcaption className="text-[11px] tracking-[0.25em] uppercase text-[#F0EEE4]/55 mt-3 font-mono">
                  Plate I · <span className="italic font-serif">Monstera deliciosa</span>, fenestrated lamina
                </figcaption>
              </figure>
            </article>

            <div className="brass-rule h-px w-full" />

            {/* Article 2 */}
            <article className="grid md:grid-cols-12 gap-8 items-start">
              <figure className="md:col-span-5 order-2 md:order-1 relative">
                <div className="relative refract-edge rounded-[2px] overflow-hidden border border-white/15">
                  <img
                    className="w-full h-[360px] object-cover"
                    src="https://images.unsplash.com/photo-1604866830513-d54766457f45?auto=format&w=900&q=80&fit=crop"
                    alt="The unfurling petiole"
                    decoding="async"
                    loading="lazy"
                  />
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </div>
                <figcaption className="text-[11px] tracking-[0.25em] uppercase text-[#F0EEE4]/55 mt-3 font-mono">
                  Plate II · the unfurling petiole
                </figcaption>
              </figure>

              <div className="md:col-span-7 order-1 md:order-2 space-y-3">
                <div className="text-[10px] tracking-[0.4em] uppercase text-[#A88A48] font-mono">
                  Chapter II · Watering
                </div>
                <h4 className="font-serif-t text-2xl sm:text-[30px] leading-tight">
                  Water by weight, never by calendar.
                </h4>
                <p className="text-[15px] leading-[1.85] text-[#F0EEE4]/85">
                  Lift the pot. If it feels lighter than yesterday — perceptibly, the way a half-finished cup of coffee feels lighter than a full one — it is time. If not, wait. The aroid root system is opportunistic; it will rot in standing moisture and will pause its growth in drought, but it will never forgive both in the same week.
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
                  {['Monstera', 'Philodendron', 'Anthurium', 'Alocasia'].map((p) => (
                    <span key={p} className="px-3 py-1 border border-[#A88A48]/40 italic font-serif text-[#A88A48]">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </article>

            <div className="flex items-center justify-between pt-6 border-t border-white/10 text-[11px] tracking-[0.3em] uppercase text-white/50 font-mono">
              <span>Continue reading · 14 min</span>
              <span className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                <span>Page 04 / 17</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOLIO IV: PLANT DOCTOR ============ */}
      <section id="plant-doctor" className="relative py-28 px-6 sm:px-8 overflow-hidden">
        <div className="max-w-[1320px] mx-auto relative">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="text-[11px] tracking-[0.45em] text-[#B26A46] uppercase font-mono">
              — FOLIO IV
            </div>
            <h2 className="font-serif-t text-4xl sm:text-5xl lg:text-[64px] leading-[0.95] tracking-[-0.02em] text-[#2A3A2A]">
              The Plant <span className="italic font-light">Doctor</span>
            </h2>
            <p className="text-sm sm:text-[15px] text-[#2A3A2A]/70 leading-relaxed">
              Yellowing leaf? Brown crisp? Suspicious webbing? Upload a photograph and our resident horticulturist will diagnose within the hour.
            </p>
          </div>

          {/* Double Frame Wrapper */}
          <div className="relative border-2 border-[#A88A48] rounded-[6px] p-1.5 max-w-5xl mx-auto">
            <div className="absolute inset-[5px] border border-[#A88A48]/40 rounded-[3px] pointer-events-none" />
            
            <div className="glass-pane refract-edge rounded-[3px] p-6 sm:p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Left Column: Upload */}
              <div className="lg:col-span-5 space-y-4">
                <div className="text-[10px] tracking-[0.4em] uppercase text-[#B26A46] font-mono">
                  Step 01
                </div>
                <h3 className="font-serif-t text-2xl sm:text-[34px] leading-tight text-[#2A3A2A]">
                  Submit a leaf <span className="italic font-light">for examination.</span>
                </h3>
                <p className="text-xs sm:text-[14px] text-[#2A3A2A]/70 leading-relaxed">
                  A clear, well-lit photograph of the affected leaf — both sides if possible. Include a portion of the stem.
                </p>

                {/* Upload Box */}
                <div
                  onClick={() => setUploadedFile('leaf-sample-specimen-48.jpg')}
                  className="border-2 border-dashed border-[#A88A48]/60 hover:border-[#A88A48] rounded-sm p-8 sm:p-10 text-center bg-white/40 hover:bg-white/60 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#4A7A4A]/10 grid place-items-center text-[#4A7A4A] mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  {uploadedFile ? (
                    <div className="text-xs text-[#2A3A2A] font-semibold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#4A7A4A]" />
                      <span>{uploadedFile} (Attached)</span>
                    </div>
                  ) : (
                    <>
                      <div className="text-xs font-semibold text-[#2A3A2A]">
                        Drop high-res photo or browse
                      </div>
                      <div className="text-[10px] font-mono text-[#2A3A2A]/50 mt-1 uppercase">
                        PNG, JPG or HEIC up to 25MB
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Right Column: Symptoms & Submit */}
              <div className="lg:col-span-7 space-y-5 lg:border-l lg:border-[#A88A48]/20 lg:pl-10">
                <div className="text-[10px] tracking-[0.4em] uppercase text-[#B26A46] font-mono">
                  Step 02 · Observation
                </div>
                <h4 className="font-serif-t text-xl sm:text-[26px] text-[#2A3A2A]">
                  Observed symptoms
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    'Yellowing lower leaves',
                    'Crispy brown leaf tips',
                    'Soft, dark spots',
                    'Fine white webbing',
                    'Stunted or curled growth',
                    'Pale, bleached foliage',
                  ].map((s) => {
                    const checked = symptoms.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleToggleSymptom(s)}
                        className={`p-3 rounded-sm border text-left transition-all flex items-center justify-between cursor-pointer ${
                          checked
                            ? 'bg-[#4A7A4A] text-[#F0EEE4] border-[#4A7A4A]'
                            : 'bg-white/40 border-[#A88A48]/30 text-[#2A3A2A] hover:bg-white/70'
                        }`}
                      >
                        <span>{s}</span>
                        {checked && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#2A3A2A]/70 font-mono block">
                    Notes for the horticulturist:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Recently repotted 2 weeks ago into chunky aroid mix, kept 4 feet from south window..."
                    className="w-full p-3 rounded-sm border border-[#A88A48]/40 bg-white/60 text-xs text-[#2A3A2A] outline-none focus:border-[#4A7A4A] resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setDoctorSubmitted(true)}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#4A7A4A] hover:bg-[#2A3A2A] text-[#F0EEE4] text-[12px] tracking-[0.25em] uppercase font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Request Diagnosis · Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {doctorSubmitted && (
                  <div className="p-3 bg-[#4A7A4A]/10 border border-[#4A7A4A]/30 text-xs text-[#2A3A2A] rounded-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#4A7A4A]" />
                    <span>Case #DR-4819 submitted to resident nursery doctor. Expect email within 60 minutes.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SHIPPING & GUARANTEE STRIP ============ */}
      <section id="shipping" className="py-20 px-6 sm:px-8 border-t border-[#A88A48]/30 bg-[#F0EEE4]">
        <div className="max-w-[1320px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-sm border border-[#A88A48]/30 bg-white/40 space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#A88A48]/10 text-[#A88A48] grid place-items-center mb-3">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-serif-t text-xl text-[#2A3A2A]">72-Hour Climate Crate</h4>
            <p className="text-xs text-[#2A3A2A]/70 leading-relaxed">
              Every specimen is nestled in biodegradable wood wool with 72-hour heat or cooling packs matched to your destination zip code.
            </p>
          </div>

          <div className="p-6 rounded-sm border border-[#A88A48]/30 bg-white/40 space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#4A7A4A]/10 text-[#4A7A4A] grid place-items-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-serif-t text-xl text-[#2A3A2A]">Live-Arrival Guarantee</h4>
            <p className="text-xs text-[#2A3A2A]/70 leading-relaxed">
              If your plant arrives with shipping trauma, snap a photo within 48 hours for immediate botanical replacement or full refund.
            </p>
          </div>

          <div className="p-6 rounded-sm border border-[#A88A48]/30 bg-white/40 space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#B26A46]/10 text-[#B26A46] grid place-items-center mb-3">
              <Leaf className="w-5 h-5" />
            </div>
            <h4 className="font-serif-t text-xl text-[#2A3A2A]">Botanical Passport</h4>
            <p className="text-xs text-[#2A3A2A]/70 leading-relaxed">
              Each plant includes an archival card documenting date of propagation, soil recipe, and nursery greenhouse quadrant.
            </p>
          </div>
        </div>
      </section>

      {/* ============ BOUTIQUE FOOTER ============ */}
      <footer className="bg-[#2A3A2A] text-[#F0EEE4] py-16 px-6 sm:px-8 border-t border-[#A88A48]/30">
        <div className="max-w-[1320px] mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 border-b border-white/10 pb-12">
            <div className="space-y-3 max-w-sm">
              <div className="font-serif-t text-3xl tracking-tight text-[#F0EEE4]">
                Verriére &amp; Vine
              </div>
              <p className="text-xs text-white/60 leading-relaxed font-sans">
                Specimen-grade rare tropical houseplants propagated with quiet patience under glass in the Pacific Northwest.
              </p>
              <div className="text-[10px] tracking-[0.3em] font-mono text-[#A88A48] uppercase">
                45.5152° N / 122.6784° W
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#A88A48]">
                  Catalog
                </div>
                <ul className="space-y-1.5 text-white/70">
                  <li><a href="#specimens" className="hover:text-white">Aroids &amp; Monstera</a></li>
                  <li><a href="#specimens" className="hover:text-white">Velvet Anthurium</a></li>
                  <li><a href="#specimens" className="hover:text-white">Rare Variegata</a></li>
                  <li><a href="#specimens" className="hover:text-white">Specimen Trees</a></li>
                </ul>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#A88A48]">
                  Care &amp; Help
                </div>
                <ul className="space-y-1.5 text-white/70">
                  <li><a href="#care-library" className="hover:text-white">Care Library</a></li>
                  <li><a href="#plant-doctor" className="hover:text-white">Plant Doctor</a></li>
                  <li><a href="#shipping" className="hover:text-white">Shipping FAQ</a></li>
                  <li><a href="#shipping" className="hover:text-white">Live Guarantee</a></li>
                </ul>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#A88A48]">
                  Platform
                </div>
                <ul className="space-y-1.5 text-white/70">
                  <li><Link to="/" className="hover:text-white text-[#A88A48]">DiasporaVerify HQ</Link></li>
                  <li><Link to="/register" className="hover:text-white">Nova Sign Up</Link></li>
                  <li><Link to="/services" className="hover:text-white">Field Services</Link></li>
                  <li><Link to="/contact" className="hover:text-white">Public Quote</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-white/50">
            <div>
              © 2014–2026 Verriére &amp; Vine Botanical Boutique · Kombai Inspiration: Rare Leaves
            </div>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-[#A88A48] hover:underline">
                Back to DiasporaVerify Platform →
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
