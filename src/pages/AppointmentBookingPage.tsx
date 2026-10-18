import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Globe,
  MapPin,
  Building2,
  Video,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Download,
  ExternalLink,
  FileText,
  Check,
  Car,
  Briefcase,
  Heart,
  Compass,
  AlertTriangle,
  Lock,
  MessageSquare
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext';
import { 
  DIASPORA_TIMEZONES, 
  getAvailableSlotsForTimezone, 
  getUpcomingBookingDates,
  downloadIcsFile,
  generateGoogleCalendarUrl
} from '../services/appointmentService';
import type { ServiceCategory, AppointmentRecord } from '../types';
import { KENYA_COUNTIES } from '../data/mockData';
import { Footer } from '../components/Public/Footer';

export const AppointmentBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { bookAppointment, currentUser } = useVerification();

  const initialCategory = (searchParams.get('category') as ServiceCategory) || 'construction';
  const initialCounty = searchParams.get('county') || 'Kiambu';

  // Wizard Step State (1: Time & Schedule, 2: Project Scope, 3: Contact & Channel, 4: Confirmed)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Timezone, Date & Slot
  const [selectedTzId, setSelectedTzId] = useState<string>('europe_london');
  const upcomingDates = getUpcomingBookingDates();
  const [selectedDate, setSelectedDate] = useState<string>(upcomingDates[0]?.dateStr || '');
  const activeTzDef = DIASPORA_TIMEZONES.find(t => t.id === selectedTzId) || DIASPORA_TIMEZONES[0];
  const availableSlots = getAvailableSlotsForTimezone(activeTzDef);
  const [selectedSlot, setSelectedSlot] = useState<string>(availableSlots[2]?.localLabel || availableSlots[0]?.localLabel || '');

  // Step 2: Project Details
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'general_intake'>(initialCategory);
  const [selectedCounty, setSelectedCounty] = useState<string>(initialCounty);
  const [townVillage, setTownVillage] = useState<string>('');
  const [projectBrief, setProjectBrief] = useState<string>('');

  // Step 3: Contact & Channel
  const [meetingChannel, setMeetingChannel] = useState<'google_meet' | 'zoom' | 'whatsapp' | 'phone'>('google_meet');
  const [clientName, setClientName] = useState<string>(currentUser?.name || '');
  const [clientEmail, setClientEmail] = useState<string>(currentUser?.email || '');
  const [clientPhone, setClientPhone] = useState<string>(currentUser?.phone || '');
  const [clientCityAbroad, setClientCityAbroad] = useState<string>(activeTzDef.city.split(',')[0] || 'London');
  const [privacyAgreed, setPrivacyAgreed] = useState<boolean>(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Step 4: Confirmed Record
  const [confirmedRecord, setConfirmedRecord] = useState<AppointmentRecord | null>(null);

  // Active slot option details
  const activeSlotObj = availableSlots.find(s => s.localLabel === selectedSlot) || availableSlots[0];

  const handleProceedToStep2 = () => {
    if (!selectedDate || !selectedSlot) {
      setValidationError('Please select an available date and time slot.');
      return;
    }
    setValidationError(null);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToStep3 = () => {
    if (!selectedCounty) {
      setValidationError('Please select the target county in Kenya.');
      return;
    }
    setValidationError(null);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim()) {
      setValidationError('Please complete your name, email, and phone number.');
      return;
    }

    if (!privacyAgreed) {
      setValidationError('Please agree to the privacy and safeguarding protocol.');
      return;
    }

    const nairobiTimeLabel = activeSlotObj ? activeSlotObj.nairobiLabel : '16:00 EAT';

    const newRecord = bookAppointment({
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      clientPhone: clientPhone.trim(),
      clientTimezone: activeTzDef.iana,
      clientCityAbroad: clientCityAbroad.trim(),
      consultationTopic: selectedCategory,
      targetCounty: selectedCounty,
      targetTownVillage: townVillage.trim() || undefined,
      scheduledDate: selectedDate,
      scheduledSlotLocal: selectedSlot,
      scheduledSlotNairobi: nairobiTimeLabel,
      meetingChannel,
      briefNotes: projectBrief.trim() || undefined
    });

    setConfirmedRecord(newRecord);
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categoriesList: { id: ServiceCategory | 'general_intake'; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'construction',
      label: 'Construction Milestone Audit',
      desc: 'Verify foundation, walling, lintel slab, or roofing materials and physical progress.',
      icon: <Building2 className="w-4 h-4 text-emerald-700" />
    },
    {
      id: 'property',
      label: 'Land & Beacon Due Diligence',
      desc: 'Search cadastral boundary beacons, verify vacant possession, and check physical encroachment.',
      icon: <MapPin className="w-4 h-4 text-emerald-700" />
    },
    {
      id: 'vehicle',
      label: 'Vehicle & Equipment Inspection',
      desc: 'Pre-purchase vehicle condition check, chassis/OBD verification, or farm machinery inspection.',
      icon: <Car className="w-4 h-4 text-emerald-700" />
    },
    {
      id: 'business',
      label: 'Business & Commercial Site Check',
      desc: 'Physical premises audit, inventory stock count, and commercial verification.',
      icon: <Briefcase className="w-4 h-4 text-emerald-700" />
    },
    {
      id: 'family',
      label: 'Family Project & Welfare Oversight',
      desc: 'Sensitive, structured support for family build projects or asset welfare coordination.',
      icon: <Heart className="w-4 h-4 text-emerald-700" />
    },
    {
      id: 'general_intake',
      label: 'Custom Mashinani Mission',
      desc: 'Discuss a customized verification task anywhere in Ushago with our operations team.',
      icon: <Compass className="w-4 h-4 text-emerald-700" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#171310] font-sans flex flex-col justify-between selection:bg-emerald-600 selection:text-white text-left">
      <div>
        {/* Header Hero Section */}
        <div className="border-b border-[#E8E2D8] bg-gradient-to-b from-[#F2F7F4] via-[#FAF8F5] to-[#FAF8F5] pt-10 pb-12 sm:pt-14 sm:pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-[#6B6359] hover:text-[#171310] flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>

            <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#171310] leading-tight">
              Book an <span className="text-[#0D5C3A] italic font-serif">Appointment</span>
            </h1>

            <p className="text-sm sm:text-base text-[#57534E] max-w-2xl leading-relaxed font-light">
              Choose a date and time to speak with our Nairobi team about your project in Kenya.
            </p>

            {/* Stepper Pill Indicator */}
            {currentStep < 4 && (
              <div className="pt-4 flex items-center gap-2 text-xs font-semibold">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${currentStep === 1 ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-white border-[#E8E2D8] text-[#78716C]'}`}>
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                  <span>Date & Time</span>
                </div>
                <div className="w-4 h-px bg-[#E8E2D8]" />
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${currentStep === 2 ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-white border-[#E8E2D8] text-[#78716C]'}`}>
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                  <span>Project</span>
                </div>
                <div className="w-4 h-px bg-[#E8E2D8]" />
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${currentStep === 3 ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-white border-[#E8E2D8] text-[#78716C]'}`}>
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                  <span>Your Details</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {validationError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="font-semibold">{validationError}</div>
            </div>
          )}

          {/* =========================================================================
              STEP 1: TIMEZONE & SLOT SELECTION
          ========================================================================= */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Timezone Selector */}
              <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-xs space-y-5">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold font-serif text-[#171310] flex items-center gap-2">
                    <Globe className="w-5 h-5 text-emerald-700" />
                    <span>Select Your Location & Timezone</span>
                  </h2>
                  <p className="text-xs text-[#78716C] mt-1">
                    Slots are displayed in both your local time and Nairobi time.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {DIASPORA_TIMEZONES.map((tz) => {
                    const isSelected = selectedTzId === tz.id;
                    return (
                      <button
                        key={tz.id}
                        type="button"
                        onClick={() => {
                          setSelectedTzId(tz.id);
                          setClientCityAbroad(tz.city.split(',')[0]);
                          const newSlots = getAvailableSlotsForTimezone(tz);
                          if (newSlots[0]) setSelectedSlot(newSlots[0].localLabel);
                        }}
                        className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50/80 border-emerald-600 ring-1 ring-emerald-600 shadow-xs'
                            : 'bg-white border-[#E8E2D8] hover:border-emerald-300 hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-[#171310]">
                          <span>{tz.city}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F4F0EA] border border-[#E8E2D8] text-[#57534E]">
                            {tz.standardAbbr}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#78716C] mt-1">
                          {tz.region}
                        </div>
                        <div className="text-[10px] font-mono text-emerald-800 font-semibold mt-2">
                          {tz.nairobiDiffHours === 0
                            ? 'Same as Nairobi (EAT)'
                            : tz.nairobiDiffHours < 0
                            ? `${Math.abs(tz.nairobiDiffHours)}h behind Nairobi`
                            : `${tz.nairobiDiffHours}h ahead of Nairobi`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date & Time Slot Grid */}
              <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold font-serif text-[#171310] flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-700" />
                    <span>Choose Date & Time</span>
                  </h2>
                  <p className="text-xs text-[#78716C] mt-1">
                    Select a date within the upcoming operational days.
                  </p>
                </div>

                {/* Date Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {upcomingDates.map((item) => {
                    const isSelected = selectedDate === item.dateStr;
                    return (
                      <button
                        key={item.dateStr}
                        type="button"
                        onClick={() => setSelectedDate(item.dateStr)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0D5C3A] border-[#0D5C3A] text-white shadow-xs font-bold'
                            : 'bg-white border-[#E8E2D8] hover:border-emerald-300 text-[#171310]'
                        }`}
                      >
                        <div className={`text-[10px] uppercase font-bold tracking-wider ${isSelected ? 'text-emerald-100' : 'text-[#78716C]'}`}>
                          {item.dayName}
                        </div>
                        <div className="text-sm font-bold mt-0.5">
                          {item.formatted}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Available Slots */}
                <div>
                  <div className="text-xs font-bold text-[#171310] mb-3 flex items-center justify-between">
                    <span>Available Slots ({activeTzDef.standardAbbr}):</span>
                    <span className="text-[11px] font-normal text-[#78716C] font-mono">
                      20 Minutes
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedSlot === slot.localLabel;
                      return (
                        <button
                          key={slot.localLabel}
                          type="button"
                          onClick={() => setSelectedSlot(slot.localLabel)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-600 ring-1 ring-emerald-600 shadow-xs'
                              : 'bg-white border-[#E8E2D8] hover:border-emerald-300'
                          }`}
                        >
                          <div className="text-xs font-bold text-[#171310]">
                            {slot.localLabel}
                          </div>
                          <div className="text-[10px] text-[#78716C] font-mono mt-1">
                            = {slot.nairobiLabel}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Live Synchronized Timezone Banner */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <span className="font-bold text-[#171310] block">Selected Time:</span>
                      <span className="text-[#57534E]">
                        <strong>{selectedSlot}</strong> ({activeTzDef.city}) = <strong className="text-emerald-900">{activeSlotObj?.nairobiLabel}</strong> (Nairobi)
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-[10px] font-bold uppercase tracking-wider font-mono">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Confirmed Slot
                  </span>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleProceedToStep2}
                    className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#0D5C3A] hover:bg-[#094229] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Next: Project Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 2: PROJECT SCOPE & KENYA LOCATION
          ========================================================================= */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold font-serif text-[#171310] flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-700" />
                    <span>Project Details</span>
                  </h2>
                  <p className="text-xs text-[#78716C] mt-1">
                    Select the service category for your project.
                  </p>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categoriesList.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                          isSelected
                            ? 'bg-emerald-50/80 border-emerald-600 ring-1 ring-emerald-600 shadow-xs'
                            : 'bg-white border-[#E8E2D8] hover:border-emerald-300'
                        }`}
                      >
                        <div className="p-2.5 rounded-xl bg-white border border-[#E8E2D8] shrink-0 mt-0.5">
                          {cat.icon}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#171310]">
                            {cat.label}
                          </div>
                          <div className="text-[11px] text-[#78716C] mt-1 leading-snug">
                            {cat.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Target Location in Kenya */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E8E2D8]">
                  <div>
                    <label className="block text-xs font-bold text-[#171310] mb-1.5">
                      Target County in Kenya <span className="text-emerald-700">*</span>
                    </label>
                    <select
                      value={selectedCounty}
                      onChange={(e) => setSelectedCounty(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] text-xs font-medium text-[#171310] focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    >
                      {KENYA_COUNTIES.map((c) => (
                        <option key={c} value={c}>{c} County</option>
                      ))}
                    </select>
                    <span className="text-[10px] text-[#78716C] mt-1 block">
                      Active verification hubs: Kiambu, Nairobi, Machakos, Nakuru, Kakamega, Kisumu, Kilifi.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#171310] mb-1.5">
                      Town, Village, or Mashinani Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={townVillage}
                      onChange={(e) => setTownVillage(e.target.value)}
                      placeholder="e.g. Ruiru Mugutha, Kithimani, Riat Hills, Kitengela"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] text-xs font-medium text-[#171310] focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                    <span className="text-[10px] text-[#78716C] mt-1 block">
                      Assists with preliminary logistics feasibility and travel radius estimate.
                    </span>
                  </div>
                </div>

                {/* Project Brief Notes */}
                <div>
                  <label className="block text-xs font-bold text-[#171310] mb-1.5">
                    Brief Overview / Specific Questions to Cover
                  </label>
                  <textarea
                    rows={3}
                    value={projectBrief}
                    onChange={(e) => setProjectBrief(e.target.value)}
                    placeholder="e.g. Contractor has requested disbursement for roofing timber. Need physical inspection of trusses, cement store inventory, and date-stamped video walkthrough before authorizing bank wire."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] text-xs font-medium text-[#171310] focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-[#E8E2D8]">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-2.5 rounded-full border border-[#E8E2D8] bg-white hover:bg-[#FAF8F5] text-xs font-bold text-[#171310] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleProceedToStep3}
                    className="px-7 py-3 rounded-full bg-[#0D5C3A] hover:bg-[#094229] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Next: Contact Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 3: CONTACT & CHANNEL SELECTION
          ========================================================================= */}
          {currentStep === 3 && (
            <form onSubmit={handleConfirmBooking} className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold font-serif text-[#171310] flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-emerald-700" />
                    <span>Contact Details</span>
                  </h2>
                  <p className="text-xs text-[#78716C] mt-1">
                    Select how you prefer to meet with our Nairobi team.
                  </p>
                </div>

                {/* Channel Radio Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'google_meet', label: 'Google Meet', desc: 'HD Video + Screen share', icon: <Video className="w-4 h-4 text-emerald-700" /> },
                    { id: 'whatsapp', label: 'WhatsApp Audio/Video', desc: 'Direct to your mobile', icon: <Phone className="w-4 h-4 text-emerald-700" /> },
                    { id: 'zoom', label: 'Zoom Meeting', desc: 'Secure meeting room', icon: <Video className="w-4 h-4 text-emerald-700" /> },
                    { id: 'phone', label: 'Direct Phone Call', desc: 'International voice line', icon: <Phone className="w-4 h-4 text-emerald-700" /> }
                  ].map((ch) => {
                    const isSelected = meetingChannel === ch.id;
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setMeetingChannel(ch.id as any)}
                        className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-600 ring-1 ring-emerald-600 shadow-xs'
                            : 'bg-white border-[#E8E2D8] hover:border-emerald-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-[#171310]">
                          {ch.icon}
                          <span>{ch.label}</span>
                        </div>
                        <div className="text-[10px] text-[#78716C] mt-1">
                          {ch.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Contact Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-[#171310] mb-1.5">
                      Your Full Name <span className="text-emerald-700">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. David Mwangi"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] text-xs font-medium text-[#171310] focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#171310] mb-1.5">
                      Email Address <span className="text-emerald-700">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="e.g. david.mwangi@uk-cloud.co.uk"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] text-xs font-medium text-[#171310] focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#171310] mb-1.5">
                      Phone / WhatsApp Number <span className="text-emerald-700">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="e.g. +44 7911 123456 or +1 (214) 555-0199"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] text-xs font-medium text-[#171310] focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                    <span className="text-[10px] text-[#78716C] mt-1 block">
                      Include country code for diaspora routing.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#171310] mb-1.5">
                      Current City Abroad
                    </label>
                    <input
                      type="text"
                      value={clientCityAbroad}
                      onChange={(e) => setClientCityAbroad(e.target.value)}
                      placeholder="e.g. London, Dallas, Toronto, Frankfurt, Dubai"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] text-xs font-medium text-[#171310] focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                {/* Privacy Safeguard Invariant */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <Lock className="w-4 h-4 shrink-0" />
                    <span>Strict Anti-Collusion & Privacy Guarantee</span>
                  </div>
                  <p className="text-[#A8A29E] leading-relaxed text-[11px]">
                    Under our operating framework and the Kenya Data Protection Act 2019, your identity and contact details are maintained strictly at Nairobi Operations Desk level. Field verification agents on the ground never receive your personal phone number, email, or family contact info.
                  </p>
                  <label className="flex items-start gap-2 pt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacyAgreed}
                      onChange={(e) => setPrivacyAgreed(e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-[11px] text-[#E7E5E4]">
                      I agree to the verification framework and appointment terms.
                    </span>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-[#E8E2D8]">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-2.5 rounded-full border border-[#E8E2D8] bg-white hover:bg-[#FAF8F5] text-xs font-bold text-[#171310] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-full bg-[#0D5C3A] hover:bg-[#094229] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Confirm Appointment</span>
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* =========================================================================
              STEP 4: CONFIRMATION & CALENDAR SYNC
          ========================================================================= */}
          {currentStep === 4 && confirmedRecord && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white rounded-3xl border border-emerald-300 p-6 sm:p-10 shadow-lg text-center space-y-6 relative overflow-hidden">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-800">
                  <CheckCircle2 className="w-8 h-8 text-emerald-700 stroke-[2.5]" />
                </div>

                <div>
                  <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-emerald-800 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                    Confirmed · Ref: {confirmedRecord.id}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-4xl font-normal text-[#171310] mt-3">
                    Appointment Booked
                  </h2>
                  <p className="text-xs sm:text-sm text-[#57534E] max-w-xl mx-auto mt-2 leading-relaxed">
                    Thank you, <strong>{confirmedRecord.clientName}</strong>. Your appointment has been scheduled with our Nairobi team.
                  </p>
                </div>

                {/* Summary Card with Dual Timezone */}
                <div className="max-w-xl mx-auto bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl p-5 text-left text-xs space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-[#E8E2D8]">
                    <div>
                      <span className="text-[10px] text-[#78716C] uppercase font-bold tracking-wider block">
                        Your Local Time ({activeTzDef.standardAbbr}):
                      </span>
                      <span className="text-sm font-bold text-[#171310]">
                        {confirmedRecord.scheduledSlotLocal}
                      </span>
                      <span className="text-[11px] text-[#78716C] block">
                        {confirmedRecord.scheduledDate} ({confirmedRecord.clientCityAbroad})
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#78716C] uppercase font-bold tracking-wider block">
                        Nairobi Time (EAT):
                      </span>
                      <span className="text-sm font-bold text-emerald-900 font-mono">
                        {confirmedRecord.scheduledSlotNairobi}
                      </span>
                      <span className="text-[11px] text-[#78716C] block">
                        {confirmedRecord.scheduledDate} (East Africa)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                    <div>
                      <span className="text-[#78716C] block font-medium">Channel:</span>
                      <span className="font-bold text-[#171310] uppercase">{confirmedRecord.meetingChannel.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-[#78716C] block font-medium">Target County:</span>
                      <span className="font-bold text-[#171310]">{confirmedRecord.targetCounty}</span>
                    </div>
                    <div>
                      <span className="text-[#78716C] block font-medium">Category:</span>
                      <span className="font-bold text-[#171310] capitalize">{confirmedRecord.consultationTopic}</span>
                    </div>
                  </div>
                </div>

                {/* Calendar Sync CTAs */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                  <button
                    type="button"
                    onClick={() => downloadIcsFile(confirmedRecord)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-white" />
                    <span>Download .ICS Calendar</span>
                  </button>

                  <a
                    href={generateGoogleCalendarUrl(confirmedRecord)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#E8E2D8] text-[#171310] font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Add to Google Calendar</span>
                  </a>
                </div>

                {/* Next Steps Card */}
                <div className="pt-4 border-t border-[#E8E2D8] text-xs text-[#57534E] max-w-lg mx-auto space-y-2">
                  <div className="font-bold text-[#171310] flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>What Happens Next?</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    1. A confirmation email has been dispatched to <strong>{confirmedRecord.clientEmail}</strong> with your calendar slot and dial-in details.<br />
                    2. If you already have architectural drawings, land title numbers, or contractor bills of quantities (BQ), you can upload them in our intake wizard for advance review.
                  </p>
                </div>

                {/* Bottom Route Navigation */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/new-request')}
                    className="px-6 py-3 rounded-full bg-[#0D5C3A] hover:bg-[#094229] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <FileText className="w-4 h-4 text-white" />
                    <span>Upload Documents in Request Wizard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="px-6 py-3 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#E8E2D8] text-[#171310] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <span>Return to Public Homepage</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};
