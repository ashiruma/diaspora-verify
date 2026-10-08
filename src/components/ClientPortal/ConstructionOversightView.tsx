import React, { useState } from 'react';
import { useVerification } from '../../context/VerificationContext';
import { 
  Building, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  User, 
  FileText, 
  SplitSquareHorizontal, 
  Video, 
  Camera, 
  Check, 
  X, 
  Info,
  Lock
} from '../Icons';
import { StatusBadge } from '../CommonBadges';
import { FORMAT_CURRENCY } from '../../data/mockData';
import type { PaymentDecisionStatus } from '../../types';
import { Link } from 'react-router-dom';
import { EmptyState } from '../ui/EmptyState';

export const ConstructionOversightView: React.FC<{ onOpenReport?: () => void }> = () => {
  const { 
    requests, 
    activeRequest, 
    currency, 
    recordPaymentDecision,
    openReportModal,
    selectRequest
  } = useVerification();

  const constructionRequests = requests.filter(r => r.category === 'construction');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    if (activeRequest && activeRequest.category === 'construction') return activeRequest.id;
    return constructionRequests[0]?.id || requests[0]?.id || '';
  });

  const request = requests.find(r => r.id === selectedProjectId) || constructionRequests[0] || activeRequest;

  // Comparison angle state
  const [selectedAngleIndex, setSelectedAngleIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100%
  const [viewMode, setViewMode] = useState<'slider' | 'sideBySide'>('slider');

  // Video player simulator state
  const [activeVideoMarkerIndex, setActiveVideoMarkerIndex] = useState(2);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Decision Modal state
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [selectedDecisionType, setSelectedDecisionType] = useState<PaymentDecisionStatus>('paused');
  const [customAuthorizedAmount, setCustomAuthorizedAmount] = useState(150000);
  const [decisionNote, setDecisionNote] = useState('');
  const [showFullPaymentWarning, setShowFullPaymentWarning] = useState(false);

  if (!request) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-left">
        <EmptyState
          icon={<Building className="w-8 h-8 text-slate-400" />}
          title="No Construction Verifications Found"
          description="You do not have any active or past construction milestone inspections. Submit a verification request to track your foundation, walling, or roofing progress with photo comparisons and stop-payment advisories."
          action={
            <Link
              to="/new-request"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-md transition"
            >
              <span>Request Construction Verification</span>
            </Link>
          }
          className="bg-white border-slate-200 py-16"
        />
      </div>
    );
  }

  const pdr = request.paymentDecisionRecord;
  const comparisons = request.photoComparisons || [];
  const currentComparison = comparisons[selectedAngleIndex] || comparisons[0] || null;
  const videoMarkers = request.videoInspectionMarkers || [];

  const handleOpenDecisionModal = (type: PaymentDecisionStatus) => {
    setSelectedDecisionType(type);
    if (type === 'authorized_full') {
      setShowFullPaymentWarning(true);
    } else {
      setShowFullPaymentWarning(false);
    }
    setDecisionModalOpen(true);
  };

  const handleConfirmDecision = () => {
    let amount = undefined;
    if (selectedDecisionType === 'authorized_full') {
      amount = pdr?.contractorRequestedKES;
    } else if (selectedDecisionType === 'authorized_partial') {
      amount = customAuthorizedAmount;
    } else if (selectedDecisionType === 'specialist_requested') {
      amount = undefined;
    }
    recordPaymentDecision(request.id, selectedDecisionType, amount, decisionNote);
    setDecisionModalOpen(false);
    setDecisionNote('');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      
      {/* Hero Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-900/40 to-transparent pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" />
                Construction Oversight Pilot
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {request.id}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <StatusBadge status={request.status} size="lg" />
              <button
                onClick={() => openReportModal(request)}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur transition-all flex items-center gap-1.5 border border-white/10"
              >
                <FileText className="w-3.5 h-3.5" />
                View Full Audit Report
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
              {request.title}
            </h1>
            <p className="text-slate-300 text-sm mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-emerald-400" />
                {request.location.town}, {request.location.county} County
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4 text-emerald-400" />
                Client: {request.client.name} ({request.client.locationAbroad})
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-emerald-400" />
                Inspected: {request.scheduledVisitDate}
              </span>
            </p>

            {constructionRequests.length > 1 && (
              <div className="flex items-center gap-2 pt-2">
                <span className="text-xs text-slate-400 font-semibold">Active Construction Site:</span>
                <select
                  value={request.id}
                  onChange={(e) => {
                    setSelectedProjectId(e.target.value);
                    selectRequest(e.target.value);
                  }}
                  className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 outline-none font-semibold"
                >
                  {constructionRequests.map(c => (
                    <option key={c.id} value={c.id}>{c.title} ({c.id})</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Critical Stop-Payment Banner if variance detected */}
          {pdr?.stopPaymentAlert && (
            <div className="bg-amber-500/20 border-2 border-amber-500/50 rounded-2xl p-4 text-amber-200 flex items-start gap-3 mt-4">
              <ShieldAlert className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-amber-300 text-sm flex items-center gap-2">
                  <span>OPERATIONS QA ALERT: DISCREPANCY DETECTED BEFORE PAYMENT</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500 text-slate-900 font-black uppercase">
                    Stop Payment Recommended
                  </span>
                </div>
                <p className="text-xs text-amber-100/90 leading-relaxed">
                  {pdr.coordinatorRecommendation}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Milestone Progress Pipeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Milestone Verification Timeline</h2>
            <p className="text-xs text-slate-500">Each milestone is independently verified on-ground before funds are committed.</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            5 Construction Stages
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {request.milestones?.map((ms) => {
            const isDisputed = ms.stageStatus === 'disputed';
            const isCompleted = ms.stageStatus === 'completed';
            const isUpcoming = ms.stageStatus === 'upcoming';

            return (
              <div
                key={ms.id}
                className={`p-4 rounded-xl border relative transition-all ${
                  isDisputed
                    ? 'border-amber-400 bg-amber-50/70 ring-2 ring-amber-300'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/50'
                    : 'border-slate-200 bg-slate-50 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-500">Stage {ms.stageNumber}</span>
                  {isCompleted && (
                    <span className="text-emerald-700 font-bold flex items-center gap-0.5 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  )}
                  {isDisputed && (
                    <span className="text-amber-800 font-black flex items-center gap-0.5 text-[11px] bg-amber-200 px-1.5 py-0.5 rounded">
                      <AlertTriangle className="w-3.5 h-3.5" /> Flagged
                    </span>
                  )}
                  {isUpcoming && (
                    <span className="text-slate-400 text-[11px]">Upcoming</span>
                  )}
                </div>

                <h3 className="font-bold text-xs text-slate-900 line-clamp-2 mb-2">
                  {ms.title}
                </h3>

                <div className="text-xs space-y-1">
                  <div className="font-mono font-semibold text-slate-700">
                    {FORMAT_CURRENCY(ms.agreedAmountKES, currency)}
                  </div>
                  {ms.inspectedDate && (
                    <div className="text-[10px] text-slate-500">
                      Visit: {ms.inspectedDate}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Interactive Side-by-Side Photo Comparison & Discrepancy Evidence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Photo Comparison (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-emerald-600" />
                    Repeatable Camera Angle Comparison
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                    {comparisons.length} Registered Angles
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Side-by-side progression from fixed site GPS coordinates across consecutive visits.
                </p>
              </div>

              {/* View mode toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setViewMode('slider')}
                  className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                    viewMode === 'slider' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <SplitSquareHorizontal className="w-3.5 h-3.5" />
                  Slider
                </button>
                <button
                  onClick={() => setViewMode('sideBySide')}
                  className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                    viewMode === 'sideBySide' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Side-by-Side
                </button>
              </div>
            </div>

            {/* Angle Selector Tabs */}
            {comparisons.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-slate-100">
                {comparisons.map((cmp, idx) => (
                  <button
                    key={cmp.id}
                    onClick={() => setSelectedAngleIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                      selectedAngleIndex === idx
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cmp.statusMatch === 'discrepancy' ? (
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    )}
                    <span>Angle {String.fromCharCode(65 + idx)}</span>
                  </button>
                ))}
              </div>
            )}

            {currentComparison ? (
              <>
                {/* Selected Angle Header & Match Status */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <span className="font-bold text-slate-800">
                    {currentComparison.angleName}
                  </span>
                  {currentComparison.statusMatch === 'discrepancy' ? (
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                      Physical Discrepancy Flagged
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      Consistent With Baseline
                    </span>
                  )}
                </div>

                {/* Interactive Image Container */}
                {viewMode === 'slider' ? (
                  <div className="space-y-3">
                    <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-300 select-none bg-slate-900 shadow-inner">
                      {/* Current (After) Image */}
                      <img
                        src={currentComparison.currentPhotoUrl}
                        alt="Current Visit"
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur text-white px-2.5 py-1 rounded-md text-[11px] font-bold z-10 border border-white/20">
                        CURRENT: {currentComparison.currentStageTitle} ({currentComparison.currentDate})
                      </div>

                      {/* Previous (Before) Image with clip path slider */}
                      <div 
                        className="absolute inset-0 overflow-hidden"
                        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                      >
                        <img
                          src={currentComparison.previousPhotoUrl}
                          alt="Previous Baseline"
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur text-emerald-200 px-2.5 py-1 rounded-md text-[11px] font-bold z-10 border border-emerald-500/30">
                          PREVIOUS: {currentComparison.previousStageTitle} ({currentComparison.previousDate})
                        </div>
                      </div>

                      {/* Divider Line */}
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
                        style={{ left: `${sliderPosition}%` }}
                      >
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg border-2 border-slate-900 flex items-center justify-center text-slate-800 text-xs font-bold">
                          ↔
                        </div>
                      </div>
                    </div>

                    {/* Range Slider Control */}
                    <div className="flex items-center gap-3 px-2">
                      <span className="text-[11px] text-slate-500 font-semibold">Previous Baseline</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderPosition}
                        onChange={(e) => setSliderPosition(Number(e.target.value))}
                        className="flex-1 accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <span className="text-[11px] text-slate-500 font-semibold">Current Milestone</span>
                    </div>
                  </div>
                ) : (
                  /* Side by Side Mode */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-600 uppercase">
                        Previous: {currentComparison.previousStageTitle}
                      </div>
                      <div className="h-64 rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
                        <img
                          src={currentComparison.previousPhotoUrl}
                          alt="Previous"
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{currentComparison.previousDate}</div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-900 uppercase flex items-center justify-between">
                        <span>Current: {currentComparison.currentStageTitle}</span>
                      </div>
                      <div className="h-64 rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
                        <img
                          src={currentComparison.currentPhotoUrl}
                          alt="Current"
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{currentComparison.currentDate}</div>
                    </div>
                  </div>
                )}

                {/* Inspector Ground Notes on this angle */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-slate-500" />
                    <span>Inspector Observation Log:</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed pl-5">
                    {currentComparison.observedDifference}
                  </p>
                </div>
              </>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                <Camera className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No repeat camera angles registered yet</p>
                <p className="text-[11px] text-slate-500">Fixed camera positions will be benchmarked on the inspector's next scheduled visit.</p>
              </div>
            )}

            {/* Video Walkthrough Inspection Markers */}
            <div className="border-t border-slate-200 pt-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Video className="w-4 h-4 text-emerald-600" />
                  Site Walkthrough Video Inspection (4m 12s)
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">Recorded 2026-09-28</span>
              </div>

              {/* Simulated Interactive Video Screen */}
              {videoMarkers.length > 0 && (
                <div className="relative rounded-2xl overflow-hidden bg-slate-950 p-4 border border-slate-800 shadow-md flex flex-col justify-between min-h-[160px]">
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                      <span className="text-[11px] text-white font-mono font-bold">
                        {videoMarkers[activeVideoMarkerIndex]?.timestamp || '00:00'} / 04:12 EAT
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-200 border border-slate-700">
                      Geotagged Video Feed
                    </span>
                  </div>

                  <div className="text-center my-4 z-10 space-y-1.5">
                    <button
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur text-white flex items-center justify-center mx-auto transition-transform hover:scale-110"
                    >
                      {isVideoPlaying ? '❚❚' : '▶'}
                    </button>
                    <div className="text-white text-xs font-bold">
                      {videoMarkers[activeVideoMarkerIndex]?.title}
                    </div>
                    <div className="text-slate-300 text-[11px] max-w-lg mx-auto line-clamp-2">
                      {videoMarkers[activeVideoMarkerIndex]?.note}
                    </div>
                  </div>

                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden z-10">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${((activeVideoMarkerIndex + 1) / (videoMarkers.length || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Video Timeline Markers */}
              <div className="space-y-2">
                {videoMarkers.map((marker, idx) => (
                  <button
                    key={marker.timestamp}
                    onClick={() => setActiveVideoMarkerIndex(idx)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      activeVideoMarkerIndex === idx
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white mt-0.5">
                      {marker.timestamp}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{marker.title}</span>
                        {marker.severity === 'alert' && (
                          <span className="text-[10px] bg-rose-100 text-rose-800 font-black px-1.5 py-0.2 rounded uppercase">
                            Discrepancy
                          </span>
                        )}
                        {marker.severity === 'warning' && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded uppercase">
                            Caution
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 truncate">{marker.note}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Payment Decision Record & Financial Audit (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Document 2 Compliance
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Milestone 3 Audit
                </span>
              </div>
              <h2 className="text-lg font-bold font-display text-slate-900 mt-1">
                Payment Decision Record
              </h2>
              <p className="text-xs text-slate-500">
                “Before you send money, we verify. As you build, we keep checking.”
              </p>
            </div>

            {/* Financial Ledger & Discrepancy Breakdown */}
            {pdr ? (
              <div className="space-y-3">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Contractor Requested:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {FORMAT_CURRENCY(pdr.contractorRequestedKES, currency)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Physical Work Verified Value:</span>
                    <span className="font-mono font-semibold text-emerald-700">
                      ~{FORMAT_CURRENCY(150000, currency)} (40% completion)
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Valid Receipts Furnished:</span>
                    <span className="font-mono text-slate-700">
                      {FORMAT_CURRENCY(pdr.receiptsProvidedKES, currency)}
                    </span>
                  </div>

                  <div className="border-t border-slate-200 pt-2 flex items-center justify-between font-bold text-rose-700 bg-rose-50 -mx-4 -mb-4 p-4 rounded-b-xl">
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      Unverified / Overbilled Variance:
                    </span>
                    <span className="font-mono text-sm">
                      +{FORMAT_CURRENCY(pdr.unexplainedVarianceKES, currency)}
                    </span>
                  </div>
                </div>

                {/* Missing Inventory Callout */}
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-700" />
                    Missing Materials Inventory:
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Invoice lists 120 bags of cement (KES 102,000). On-site count revealed only 40 bags. 
                    <strong> 80 bags (approx KES 68,000) are unaccounted for.</strong>
                  </p>
                </div>

                {/* Current Client Decision Status */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500">Client Decision Status:</span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      pdr.decisionStatus === 'pending'
                        ? 'bg-amber-100 text-amber-900'
                        : pdr.decisionStatus === 'authorized_partial'
                        ? 'bg-blue-100 text-blue-900'
                        : pdr.decisionStatus === 'stopped'
                        ? 'bg-rose-100 text-rose-900'
                        : pdr.decisionStatus === 'paused'
                        ? 'bg-yellow-100 text-yellow-900'
                        : 'bg-emerald-100 text-emerald-900'
                    }`}>
                      {pdr.decisionStatus.replace('_', ' ')}
                    </span>
                  </div>

                  {pdr.authorizedAmountKES !== undefined && (
                    <div className="text-xs text-slate-600 flex justify-between font-mono font-bold">
                      <span>Authorized Amount:</span>
                      <span className="text-slate-900">
                        {FORMAT_CURRENCY(pdr.authorizedAmountKES, currency)}
                      </span>
                    </div>
                  )}

                  {pdr.decisionNote && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="font-semibold text-slate-700">Client Instruction: </span>
                      {pdr.decisionNote}
                    </div>
                  )}
                </div>

                {/* Interactive Action Buttons */}
                <div className="space-y-2.5 pt-2">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Record Your Instruction to Contractor:
                  </div>

                  <button
                    onClick={() => handleOpenDecisionModal('authorized_partial')}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    Authorize Partial Payment (KES 150,000 Verified Materials)
                  </button>

                  <button
                    onClick={() => handleOpenDecisionModal('paused')}
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 transition-all"
                  >
                    <Clock className="w-4 h-4" />
                    Pause Payment & Request Store Delivery Notes
                  </button>

                  <button
                    onClick={() => handleOpenDecisionModal('stopped')}
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs shadow-md shadow-rose-700/20 flex items-center justify-center gap-2 transition-all"
                  >
                    <X className="w-4 h-4" />
                    Enforce Stop Payment & Dispute Overbilling
                  </button>

                  <button
                    onClick={() => handleOpenDecisionModal('specialist_requested')}
                    className="w-full py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white font-bold text-xs shadow-md shadow-purple-700/20 flex items-center justify-center gap-2 transition-all"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    Request Specialist Structural Engineering Review
                  </button>

                  <button
                    onClick={() => handleOpenDecisionModal('authorized_full')}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-500 hover:text-slate-800 hover:bg-slate-50 text-xs font-medium transition-colors"
                  >
                    Authorize Full KES 450,000 (Overrides Ground Findings)
                  </button>
                </div>

                {/* Audit Trail History */}
                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Immutable Decision Ledger:
                  </span>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {pdr.history.map((hist, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-800">
                          <span>{hist.action}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{hist.date}</span>
                        </div>
                        <p className="text-slate-600">{hist.note}</p>
                        <div className="text-[10px] text-slate-400 font-semibold">By: {hist.by}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No payment requests submitted yet</p>
                <p className="text-[11px] text-slate-500">Contractor invoices and variance audits appear here once a milestone claim is submitted.</p>
              </div>
            )}

            {/* Legal Boundary Clause */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
              <div className="font-bold text-slate-700 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
                <span>Service Boundary Notice:</span>
              </div>
              <p>
                DiasporaVerify provides independent on-ground observation. We do NOT manage contractors, 
                hold construction funds, certify structural compression strength, or execute bank transfers. 
                All payments are sent directly by you.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Decision Confirmation Modal */}
      {decisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-200">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Client Instruction Confirmation
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Record Milestone Payment Decision
                </h3>
              </div>
              <button
                onClick={() => setDecisionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {showFullPaymentWarning && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Warning: Diverging from Ground Evidence
                </div>
                <p>
                  You are selecting to release full payment (KES 450,000) despite verified evidence that 
                  slab formwork is only 40% complete and 80 bags of cement are missing.
                </p>
              </div>
            )}

            {selectedDecisionType === 'specialist_requested' && (
              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-purple-800">
                  <ShieldAlert className="w-4 h-4 text-purple-600" />
                  <span>Licensed Structural Specialist Referral (Doc 2 Boundary)</span>
                </div>
                <p>
                  Per DiasporaVerify quality doctrine, foundation, lintel beam, and suspended slab reinforcement 
                  must be inspected by an independent registered structural engineer before concrete is poured. 
                  Payment remains paused until technical certification.
                </p>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Decision Type</label>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800">
                  {selectedDecisionType === 'authorized_partial' && 'Authorize Partial Release (Verified Materials Only)'}
                  {selectedDecisionType === 'paused' && 'Pause Payment & Demand Contractor Evidence'}
                  {selectedDecisionType === 'stopped' && 'Enforce Stop Payment & Dispute Overbilling'}
                  {selectedDecisionType === 'specialist_requested' && 'Request Specialist Structural Engineering Sign-Off'}
                  {selectedDecisionType === 'authorized_full' && 'Authorize Full Requested Amount'}
                </div>
              </div>

              {selectedDecisionType === 'authorized_partial' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Authorized Amount (KES)
                  </label>
                  <input
                    type="number"
                    value={customAuthorizedAmount}
                    onChange={(e) => setCustomAuthorizedAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Equivalent to ~{FORMAT_CURRENCY(customAuthorizedAmount, currency)}
                  </span>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Instruction Note for Contractor & DiasporaVerify Records
                </label>
                <textarea
                  rows={3}
                  value={decisionNote}
                  onChange={(e) => setDecisionNote(e.target.value)}
                  placeholder="e.g. Releasing KES 150,000 for verified materials. Remaining balance will be released upon completion of shuttering and delivery notes for remaining 80 cement bags..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDecisionModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDecision}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-md transition-all"
              >
                Save & Record in Ledger
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
