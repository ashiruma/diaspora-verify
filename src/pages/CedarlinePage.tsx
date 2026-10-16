import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useVerification } from '../context/VerificationContext';
import { formatCurrency } from '../services/paymentService';

interface CedarlineListing {
  id: string;
  badge: string;
  priceKES: number;
  beds?: number;
  baths?: number;
  sqft?: number;
  acres?: number;
  beacons?: number;
  status: string;
  address: string;
  provenance: string;
  image: string;
  type: 'sale' | 'rent' | 'land';
}

const CEDARLINE_LISTINGS: CedarlineListing[] = [
  {
    id: 'cedar-1',
    badge: 'Featured · Title Verified',
    priceKES: 72500000,
    beds: 3,
    baths: 2,
    sqft: 2140,
    status: 'Active Verified',
    address: '118 Miotoni Ridge, Karen Hardy, Nairobi',
    provenance: 'Listing ID #DV-KRN-1074, Evans K. verifier. Ardhisasa registry validated.',
    image: 'https://images.pexels.com/photos/7598368/pexels-photo-7598368.jpeg?auto=compress&cs=tinysrgb&w=700',
    type: 'sale',
  },
  {
    id: 'cedar-2',
    badge: 'On market Jun 12 · Escrow Ready',
    priceKES: 165000000,
    beds: 4,
    baths: 4,
    sqft: 4186,
    status: 'Under Due Diligence',
    address: '6120 Pan Africa Insurance Ave, Runda, Nairobi',
    provenance: 'Listing ID #DV-RND-2118, Landmark Survey Verified. Beacon markers intact.',
    image: 'https://images.pexels.com/photos/19119703/pexels-photo-19119703.jpeg?auto=compress&cs=tinysrgb&w=700',
    type: 'sale',
  },
  {
    id: 'cedar-3',
    badge: 'Featured · Milestone 3 Audited',
    priceKES: 63000000,
    beds: 4,
    baths: 3,
    sqft: 2764,
    status: 'Active Build',
    address: '2207 Acacia Ridge, Kitengela, Kajiado',
    provenance: 'Listing ID #DV-DEMO-2026-KJD, Ring beam verified. Materials audit completed.',
    image: 'https://images.pexels.com/photos/7746919/pexels-photo-7746919.jpeg?auto=compress&cs=tinysrgb&w=700',
    type: 'sale',
  },
  {
    id: 'cedar-4',
    badge: 'Mature Landscaping · Gated Estate',
    priceKES: 60800000,
    beds: 3,
    baths: 3,
    sqft: 2095,
    status: 'Active Verified',
    address: '415 Sunset Boulevard, Tigoni, Kiambu',
    provenance: 'Listing ID #DV-TGN-2039, Boundary peg verified. Riparian setback clean.',
    image: 'https://images.pexels.com/photos/33350017/pexels-photo-33350017.jpeg?auto=compress&cs=tinysrgb&w=700',
    type: 'sale',
  },
  {
    id: 'cedar-5',
    badge: 'Freehold Title · 4 Beacons Verified',
    priceKES: 28500000,
    acres: 0.5,
    beacons: 4,
    status: 'Title Deeds Ready',
    address: 'Plot 42, Ololua Ridge, Ngong, Kajiado',
    provenance: 'Listing ID #DV-NGG-4812, Geotagged survey beacons verified ±1.8m accuracy.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=720&auto=format&fit=crop&q=75&fm=webp',
    type: 'land',
  },
  {
    id: 'cedar-6',
    badge: 'Executive Rental · Diplomats Welcome',
    priceKES: 450000,
    beds: 5,
    baths: 5,
    sqft: 5200,
    status: 'Available Immediately',
    address: '24 Whispers Avenue, Gigiri, Nairobi',
    provenance: 'Listing ID #DV-GGR-0921, UN Security Zone clearance & boundary wall certified.',
    image: 'https://images.pexels.com/photos/26953738/pexels-photo-26953738.jpeg?auto=compress&cs=tinysrgb&w=700',
    type: 'rent',
  },
];

export const CedarlinePage: React.FC = () => {
  const navigate = useNavigate();
  const { currency } = useVerification();
  const [activeTab, setActiveTab] = useState<'all' | 'sale' | 'rent' | 'land'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRail, setActiveRail] = useState<'search' | 'alerts' | 'saved' | 'lending' | 'inbox'>('search');
  const [savedIds, setSavedIds] = useState<string[]>(['cedar-1', 'cedar-3']);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const filteredListings = CEDARLINE_LISTINGS.filter(item => {
    if (activeRail === 'saved' && !savedIds.includes(item.id)) return false;
    if (activeTab !== 'all' && item.type !== activeTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.address.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q) ||
        item.provenance.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f6f7f7] text-[#141a1d] font-sans antialiased selection:bg-[#155c48]/20 selection:text-[#0f4838]">
      
      {/* ══════════ CEDARLINE MASTHEAD ══════════ */}
      <header className="bg-[#fdfefe] border-b border-[#e3e7e8] sticky top-0 z-40">
        <div className="max-w-[1560px] mx-auto px-6 sm:px-10 h-18 flex items-center justify-between gap-6">
          
          {/* Left Category Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[15px] font-[520]" aria-label="Cedarline categories">
            <button
              onClick={() => setActiveTab('sale')}
              className={`transition-colors py-1 relative cursor-pointer ${
                activeTab === 'sale' ? 'text-[#0f4838] font-bold' : 'text-[#141a1d] hover:text-[#155c48]'
              }`}
            >
              Buy
              {activeTab === 'sale' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#155c48] rounded-full" />}
            </button>
            <button
              onClick={() => setActiveTab('rent')}
              className={`transition-colors py-1 relative cursor-pointer ${
                activeTab === 'rent' ? 'text-[#0f4838] font-bold' : 'text-[#141a1d] hover:text-[#155c48]'
              }`}
            >
              Rent
              {activeTab === 'rent' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#155c48] rounded-full" />}
            </button>
            <button
              onClick={() => setActiveTab('land')}
              className={`transition-colors py-1 relative cursor-pointer ${
                activeTab === 'land' ? 'text-[#0f4838] font-bold' : 'text-[#141a1d] hover:text-[#155c48]'
              }`}
            >
              Land & Plots
              {activeTab === 'land' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#155c48] rounded-full" />}
            </button>
            <Link
              to="/contact?type=quote"
              className="text-[#141a1d] hover:text-[#155c48] transition-colors py-1"
            >
              Get financing & Escrow
            </Link>
            <Link
              to="/services"
              className="text-[#141a1d] hover:text-[#155c48] transition-colors py-1"
            >
              Field Verifiers
            </Link>
          </nav>

          {/* Center Brand Mark & Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <svg className="w-7 h-7 text-[#155c48] transition-transform group-hover:scale-105" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <path d="M16 3.2 28 12v2.6L16 6.4 4 14.6V12L16 3.2Z" fill="currentColor"/>
              <path d="M16 11.4 26.4 19v9.6h-7.1v-6.2h-6.6v6.2H5.6V19L16 11.4Z" fill="currentColor" opacity=".55"/>
            </svg>
            <div className="flex flex-col">
              <span className="text-[23px] sm:text-[25px] font-extrabold tracking-[-0.035em] text-[#141a1d] leading-none">
                Cedarline
              </span>
              <span className="text-[10px] uppercase font-bold text-[#155c48] tracking-widest mt-0.5">
                Diaspora Verified
              </span>
            </div>
          </Link>

          {/* Right Action Links & User Account */}
          <nav className="flex items-center gap-6 text-[15px] font-[520] ml-auto lg:ml-0" aria-label="Cedarline secondary">
            <Link
              to="/dashboard"
              className="hidden md:inline-block text-[#141a1d] hover:text-[#155c48] transition-colors py-1"
            >
              My Portfolio
            </Link>
            <Link
              to="/contact?type=quote"
              className="hidden sm:inline-block text-[#141a1d] hover:text-[#155c48] transition-colors py-1"
            >
              Request Due Diligence
            </Link>
            <button
              onClick={() => navigate('/login?redirect=/profile')}
              className="w-9 h-9 rounded-full bg-[#155c48] hover:bg-[#0f4838] text-white flex items-center justify-center transition-all shadow-xs cursor-pointer"
              title="Account & Profile"
              aria-label="Your account"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="9" r="3.3"/><path d="M5.6 19.2a6.9 6.9 0 0 1 12.8 0"/>
              </svg>
            </button>
          </nav>

        </div>
      </header>

      {/* ══════════ CEDARLINE FRAME (RAIL + MAIN COL) ══════════ */}
      <div className="flex items-stretch border-t border-[#e3e7e8]">
        
        {/* Left Sticky Icon Rail */}
        <aside className="w-[76px] shrink-0 border-r border-[#e3e7e8] bg-[#fdfefe] hidden sm:block">
          <div className="sticky top-18 py-6 px-1.5 flex flex-col gap-2">
            
            <button
              type="button"
              onClick={() => {
                setActiveRail('search');
                setActiveTab('all');
              }}
              className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl transition-all cursor-pointer ${
                activeRail === 'search'
                  ? 'bg-[#e8f0ec] text-[#0f4838]'
                  : 'text-[#141a1d] hover:bg-[#e8f0ec]/50 hover:text-[#0f4838]'
              }`}
              title="Search Listings"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="6.5"/><path d="m15.8 15.8 4.4 4.4"/>
              </svg>
              <span className="text-[11px] font-semibold text-[#48545c]">Search</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRail('alerts')}
              className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl transition-all cursor-pointer relative ${
                activeRail === 'alerts'
                  ? 'bg-[#e8f0ec] text-[#0f4838]'
                  : 'text-[#141a1d] hover:bg-[#e8f0ec]/50 hover:text-[#0f4838]'
              }`}
              title="Price & Deed Alerts"
            >
              <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-rose-500" />
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 9.4a6 6 0 1 0-12 0c0 5.6-2.1 7.1-2.1 7.1h16.2S18 15 18 9.4Z"/><path d="M13.7 20.1a2 2 0 0 1-3.4 0"/>
              </svg>
              <span className="text-[11px] font-semibold text-[#48545c]">Alerts</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRail('saved')}
              className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl transition-all cursor-pointer ${
                activeRail === 'saved'
                  ? 'bg-[#e8f0ec] text-[#0f4838]'
                  : 'text-[#141a1d] hover:bg-[#e8f0ec]/50 hover:text-[#0f4838]'
              }`}
              title="Saved Properties"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={savedIds.length > 0 ? 'text-[#155c48]' : 'text-slate-400'}>
                <path d="M12 20.3 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 0 1 19.4 13Z"/>
              </svg>
              <span className="text-[11px] font-semibold text-[#48545c]">Saved ({savedIds.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRail('lending')}
              className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl transition-all cursor-pointer ${
                activeRail === 'lending'
                  ? 'bg-[#e8f0ec] text-[#0f4838]'
                  : 'text-[#141a1d] hover:bg-[#e8f0ec]/50 hover:text-[#0f4838]'
              }`}
              title="Diaspora Mortgage & Bank Escrows"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="8.6"/><path d="M12 7.3v9.4"/><path d="M14.4 9.6a2.7 2.7 0 0 0-2.4-1.2c-1.5 0-2.5.8-2.5 1.9 0 2.6 5 1.4 5 4 0 1.2-1.1 2-2.6 2a2.8 2.8 0 0 1-2.5-1.3"/>
              </svg>
              <span className="text-[11px] font-semibold text-[#48545c]">Lending</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRail('inbox')}
              className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl transition-all cursor-pointer ${
                activeRail === 'inbox'
                  ? 'bg-[#e8f0ec] text-[#0f4838]'
                  : 'text-[#141a1d] hover:bg-[#e8f0ec]/50 hover:text-[#0f4838]'
              }`}
              title="Field Dispatch Relay"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3.6 12.6h4.2l1.4 2.4h5.6l1.4-2.4h4.2"/><path d="M5.4 6.6h13.2l1.8 6v4.2a1.6 1.6 0 0 1-1.6 1.6H5.2a1.6 1.6 0 0 1-1.6-1.6v-4.2Z"/>
              </svg>
              <span className="text-[11px] font-semibold text-[#48545c]">Inbox</span>
            </button>

          </div>
        </aside>

        {/* Right Main Content Column */}
        <main className="flex-1 min-w-0">
          
          {/* ══════════ HERO SECTION ══════════ */}
          <section className="relative h-[432px] overflow-hidden bg-gradient-to-br from-[#5d7a63] via-[#3d5445] to-[#2b3a30] isolate">
            <img
              src="https://images.pexels.com/photos/26953738/pexels-photo-26953738.jpeg?auto=compress&cs=tinysrgb&w=1800"
              alt="Two-storey luxury villa with manicured front lawn in Nairobi — photo by Diogo Miranda"
              className="absolute inset-0 w-full h-full object-cover object-[50%_46%]"
            />
            {/* Gradient Dark Veil */}
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-[rgba(14,20,17,0.78)] via-[rgba(14,20,17,0.52)] to-transparent" />

            <div className="relative z-20 h-full max-w-[1240px] mx-auto px-6 sm:px-12 lg:px-16 flex flex-col justify-center gap-7">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#e8f0ec] text-xs font-mono font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>KENYA REAL ESTATE DUE DILIGENCE</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.038em] text-[#fbfcfb] leading-[1.05] drop-shadow-md max-w-xl">
                  Listings. Leases.<br />Land. Lending.
                </h1>
              </div>

              {/* Cedarline Floating Search Bar */}
              <div className="flex items-center w-full max-w-[580px] bg-[#fdfefe] rounded-xl px-4 sm:px-6 h-16 shadow-[0_24px_50px_-22px_rgba(20,26,29,0.32)] border border-white/40 focus-within:ring-2 focus-within:ring-[#155c48]">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search an estate, town, plot LR or county..."
                  className="flex-1 min-w-0 border-0 outline-none bg-transparent text-[16px] text-[#141a1d] placeholder:text-[#6d7981]"
                />
                <button
                  type="button"
                  className="w-11 h-11 rounded-lg bg-[#e8f0ec] hover:bg-[#155c48] text-[#155c48] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="Search"
                >
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="6.5"/><path d="m15.8 15.8 4.4 4.4"/>
                  </svg>
                </button>
              </div>

              {/* Quick Geographic Chips */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-white/80">
                <span className="font-semibold text-white">Popular Hubs:</span>
                {['Karen', 'Runda', 'Kitengela', 'Kilimani', 'Tigoni', 'Diani Beach'].map((hub) => (
                  <button
                    key={hub}
                    onClick={() => setSearchQuery(hub)}
                    className="px-2.5 py-0.5 rounded-full bg-black/30 hover:bg-black/50 border border-white/20 text-white transition-colors cursor-pointer"
                  >
                    {hub}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ══════════ LISTINGS SHELF ══════════ */}
          <section className="px-6 sm:px-12 lg:px-16 py-12 lg:py-16">
            
            {/* Shelf Head */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-[27px] font-bold tracking-tight text-[#141a1d]">
                  {activeRail === 'saved'
                    ? `Saved Properties (${savedIds.length})`
                    : activeTab === 'land'
                    ? 'Verified Land Parcels with GPS Beacons'
                    : activeTab === 'rent'
                    ? 'Audited Residential Leases & Villas'
                    : 'Pick up where you left off: Nairobi Metro, Verified For Diaspora'}
                </h2>
                <p className="text-sm sm:text-base text-[#48545c] mt-1 font-medium">
                  {filteredListings.length} verified listings cataloged with tamper-evident audit trails.
                </p>
              </div>

              {/* Carousel Controls */}
              <div className="flex items-center gap-3 self-start sm:self-auto">
                <button
                  type="button"
                  disabled={carouselIndex === 0}
                  onClick={() => setCarouselIndex(Math.max(0, carouselIndex - 1))}
                  className="w-11 h-11 rounded-full border border-[#d3d9db] bg-[#fdfefe] hover:border-[#155c48] hover:text-[#0f4838] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                  aria-label="Previous listings"
                >
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 5.5 8 12l6.5 6.5"/>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setCarouselIndex(carouselIndex + 1)}
                  className="w-11 h-11 rounded-full border border-[#d3d9db] bg-[#fdfefe] hover:border-[#155c48] hover:text-[#0f4838] flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                  aria-label="Next listings"
                >
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.5 5.5 16 12l-6.5 6.5"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Cedarline Listing Cards Grid */}
            {filteredListings.length === 0 ? (
              <div className="rounded-2xl border border-[#e3e7e8] bg-[#fdfefe] p-12 text-center space-y-3">
                <p className="text-base font-semibold text-[#141a1d]">No properties match your current search.</p>
                <p className="text-xs text-[#6d7981]">Try clearing your search query or switching to All categories.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveTab('all');
                    setActiveRail('search');
                  }}
                  className="px-4 py-2 rounded-lg bg-[#155c48] text-white text-xs font-bold hover:bg-[#0f4838] transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {filteredListings.map((item) => (
                  <article
                    key={item.id}
                    className="group bg-[#fdfefe] border border-[#e3e7e8] rounded-xl overflow-hidden shadow-[0_6px_20px_-8px_rgba(20,26,29,0.18)] hover:shadow-[0_18px_36px_-18px_rgba(20,26,29,0.30)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Media Container */}
                      <div className="relative aspect-[16/11] bg-slate-200 overflow-hidden border-b border-[#e3e7e8]">
                        <img
                          src={item.image}
                          alt={item.address}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* Status Badge */}
                        <span className="absolute top-3 left-3 z-10 bg-[#155c48] text-[#f2f7f4] text-xs font-semibold px-2.5 py-1 rounded shadow-md">
                          {item.badge}
                        </span>
                        {/* Heart Favorite Button */}
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(item.id, e)}
                          className="absolute top-2.5 right-2.5 z-10 w-9 h-9 flex items-center justify-center text-white drop-shadow-md hover:scale-110 transition-transform cursor-pointer"
                          aria-label="Save this home"
                        >
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill={savedIds.includes(item.id) ? '#155c48' : 'none'}
                            stroke={savedIds.includes(item.id) ? '#155c48' : 'currentColor'}
                            strokeWidth="2"
                          >
                            <path d="M12 20.3 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 0 1 19.4 13Z"/>
                          </svg>
                        </button>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 sm:p-5 space-y-2">
                        {/* Price */}
                        <div className="text-2xl font-bold tracking-tight text-[#141a1d]">
                          {formatCurrency(item.priceKES, currency)}
                        </div>

                        {/* Facts Row */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#48545c]">
                          {item.beds !== undefined && (
                            <>
                              <span><b>{item.beds}</b> bds</span>
                              <span className="w-px h-3 bg-[#d3d9db]" />
                            </>
                          )}
                          {item.baths !== undefined && (
                            <>
                              <span><b>{item.baths}</b> ba</span>
                              <span className="w-px h-3 bg-[#d3d9db]" />
                            </>
                          )}
                          {item.sqft !== undefined && (
                            <>
                              <span><b>{item.sqft.toLocaleString()}</b> sqft</span>
                              <span className="w-px h-3 bg-[#d3d9db]" />
                            </>
                          )}
                          {item.acres !== undefined && (
                            <>
                              <span><b>{item.acres}</b> Acres</span>
                              <span className="w-px h-3 bg-[#d3d9db]" />
                            </>
                          )}
                          {item.beacons !== undefined && (
                            <>
                              <span><b>{item.beacons}</b> Beacons</span>
                              <span className="w-px h-3 bg-[#d3d9db]" />
                            </>
                          )}
                          <span className="font-semibold text-[#155c48]">{item.status}</span>
                        </div>

                        {/* Address */}
                        <p className="text-[14.5px] font-semibold text-[#141a1d] line-clamp-2 leading-snug pt-1">
                          {item.address}
                        </p>

                        {/* Provenance Line */}
                        <p className="text-[11.5px] text-[#5f6a72] leading-relaxed line-clamp-2 pt-1 border-t border-[#e3e7e8]">
                          {item.provenance}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="p-4 pt-0">
                      <Link
                        to="/contact?type=quote"
                        className="w-full py-2.5 rounded-lg border border-[#e3e7e8] hover:border-[#155c48] hover:bg-[#e8f0ec] text-[#155c48] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Book On-Ground Inspection</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* ══════════ PRE-PURCHASE DUE DILIGENCE BANNER ══════════ */}
          <section className="mx-6 sm:mx-12 lg:mx-16 mb-16 rounded-2xl bg-[#0f4838] text-white p-8 sm:p-12 relative overflow-hidden shadow-xl">
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-[#7fb3a9]">
                INDEPENDENT SAFEGUARDING PROTOCOL
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                Buying Land or Property Remotely? Verify Before Wiring Funds.
              </h3>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                DiasporaVerify dispatches bonded local field agents to verify physical beacon markers, check registry titles at Ardhisasa, interview neighbors, and verify boundaries with tamper-evident SHA-256 sealed photo dossiers.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/contact?type=quote"
                  className="px-5 py-3 rounded-xl bg-white text-[#0f4838] text-xs font-bold hover:bg-[#f6f7f7] transition-all shadow-md"
                >
                  Request Pre-Purchase Due Diligence
                </Link>
                <Link
                  to="/sample-report"
                  className="px-5 py-3 rounded-xl border border-white/30 text-white text-xs font-semibold hover:bg-white/10 transition-all"
                >
                  View Sample Verification Report
                </Link>
              </div>
            </div>
            {/* Background Cedar Silhouette */}
            <svg className="absolute -right-8 -bottom-10 w-72 h-72 text-white/5 pointer-events-none" viewBox="0 0 32 32" fill="currentColor">
              <path d="M16 3.2 28 12v2.6L16 6.4 4 14.6V12L16 3.2Z"/>
              <path d="M16 11.4 26.4 19v9.6h-7.1v-6.2h-6.6v6.2H5.6V19L16 11.4Z"/>
            </svg>
          </section>

        </main>
      </div>

    </div>
  );
};

export default CedarlinePage;
