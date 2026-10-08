import React, { useState } from 'react';
import { useVerification } from '../../context/VerificationContext';
import { 
  MapPin, 
  Camera, 
  Phone,
  Upload,
  AlertTriangle,
  Clock,
  Check,
  X,
  ShieldAlert,
  ShieldCheck,
  DollarSign,
  Award,
  RefreshCw,
  AlertCircle
} from '../Icons';
import { StatusBadge } from '../CommonBadges';

export const FieldAgentView: React.FC = () => {
  const { 
    requests, 
    activeRequest, 
    updateChecklist, 
    addEvidence,
    performCheckIn,
    acceptAssignment,
    rejectAssignment,
    advanceRequestStatus
  } = useVerification();

  const [selectedReqId, setSelectedReqId] = useState<string>(activeRequest?.id || requests[0]?.id || '');

  // Evidence upload form state
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoAngle, setPhotoAngle] = useState('Repeat Camera Angle 1 (North-East Perimeter)');
  const [photoNotes, setPhotoNotes] = useState('');
  const [photoUncertainty, setPhotoUncertainty] = useState('');
  const [simulatedImageUrl, setSimulatedImageUrl] = useState('https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=800&auto=format&fit=crop&q=80');

  // Active editing checklist item
  const [editingCheckId, setEditingCheckId] = useState<string | null>(null);
  const [itemNoteText, setItemNoteText] = useState<string>('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check-In State
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [checkInNotes, setCheckInNotes] = useState('Arrived at site boundary. Cleared entry gate with watchman.');

  // Offline simulation state
  const [offlineMode, setOfflineMode] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [offlineQueue, setOfflineQueue] = useState<Array<{
    requestId: string;
    evidence: any;
  }>>([]);
  const [hudTime] = useState(() => new Date().toLocaleTimeString('en-KE'));

  // Assignment Acceptance / Rejection State
  const [conflictCertified, setConflictCertified] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [showDeclineForm, setShowDeclineForm] = useState(false);

  const req = requests.find(r => r.id === selectedReqId) || requests[0];
  const agent = req.assignedAgent || {
    id: 'agt-01',
    name: 'Eng. Peter Mwangi',
    phone: '+254 712 345 678',
    email: 'p.mwangi@diaspora-verify.ke',
    countyCoverage: ['Kiambu', 'Nairobi', 'Machakos', 'Kajiado'],
    badgeLevel: 'Senior Structural Inspector (BORAQS Reg)',
    conflictClearanceSigned: true,
  };

  const handleSetChecklistStatus = (checkId: string, status: 'passed' | 'flagged' | 'inconclusive') => {
    updateChecklist(req.id, checkId, status);
    setToastMessage(`Checklist item updated to "${status.toUpperCase()}".`);
  };

  const handleOpenEditNote = (checkId: string, currentNotes: string = '') => {
    setEditingCheckId(checkId);
    setItemNoteText(currentNotes);
  };

  const handleSaveItemNote = (checkId: string, currentStatus: any) => {
    updateChecklist(req.id, checkId, currentStatus, itemNoteText);
    setEditingCheckId(null);
    setToastMessage('Observation note saved to checklist item.');
  };

  // Perform GPS Check-In
  const handleExecuteCheckIn = async () => {
    setIsCheckingIn(true);
    try {
      const liveGPS = req.location.gpsCoords || '-1.2612, 36.8044';
      const result = await performCheckIn(req.id, liveGPS, checkInNotes);
      if (result.success) {
        setToastMessage(`✓ GPS Ground Check-in recorded! Verified distance: ${result.distanceMeters}m from site marker.`);
      } else {
        setToastMessage(`Check-in notice: ${result.message}`);
      }
    } catch (err: any) {
      setToastMessage(`Failed to record check-in: ${err?.message || 'GPS Timeout'}`);
    } finally {
      setIsCheckingIn(false);
    }
  };

  // Handle Assignment Accept
  const handleAcceptAssignment = () => {
    if (!conflictCertified) {
      setToastMessage('Mandatory: You must certify zero conflict of interest before accepting this assignment.');
      return;
    }
    acceptAssignment(req.id);
    setToastMessage(`Assignment accepted for ${req.id}. Ready for on-ground deployment.`);
  };

  // Handle Assignment Reject
  const handleRejectAssignment = () => {
    if (!declineReason.trim()) {
      setToastMessage('Please provide a specific reason for declining or declaring conflict.');
      return;
    }
    rejectAssignment(req.id, declineReason.trim());
    setShowDeclineForm(false);
    setDeclineReason('');
    setToastMessage(`Mission ${req.id} returned to Operations triage pool.`);
  };

  // Handle Start Travelling
  const handleStartTravelling = () => {
    const res = advanceRequestStatus(req.id, 'TRAVELLING', 'Field agent departed for location.');
    if (res.success) {
      setToastMessage(`Status updated: Travelling to site for mission ${req.id}.`);
    } else {
      setToastMessage(res.error || 'Cannot transition to Travelling.');
    }
  };

  // Handle Final Mission Submission to QA Desk
  const handleSubmitMissionDossier = () => {
    if (req.evidence.length === 0) {
      setToastMessage('Mandatory: Upload at least 1 verified field photo before submitting mission dossier.');
      return;
    }
    const res = advanceRequestStatus(req.id, 'EVIDENCE_SUBMITTED', 'Field agent completed on-ground audit and submitted evidence dossier.');
    if (res.success) {
      setToastMessage(`✓ Mission ${req.id} dossier successfully submitted to Nairobi HQ Operations QA Desk!`);
    } else {
      setToastMessage(res.error || 'Submission failed.');
    }
  };

  // Submit Evidence with Progress & Offline Queue
  const handleAddEvidenceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim()) {
      setToastMessage('Please enter a photo title or angle description.');
      return;
    }

    const evidencePayload = {
      type: 'photo' as const,
      title: photoTitle.trim(),
      description: photoNotes || 'Visual inspection photo captured on site.',
      url: simulatedImageUrl,
      timestamp: new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }) + ' EAT',
      locationTag: `${req.location.town}, ${req.location.county}`,
      gpsCoords: req.location.gpsCoords,
      cameraAngle: photoAngle,
      verifiedByAgentId: agent.id,
      tags: ['Field Evidence', req.category],
      uncertaintyFlag: photoUncertainty.trim() || undefined,
    };

    if (offlineMode) {
      // Store in local offline queue
      setOfflineQueue(prev => [...prev, { requestId: req.id, evidence: evidencePayload }]);
      setToastMessage(`Device is OFFLINE: Photo buffered in secure local cache (${offlineQueue.length + 1} queued).`);
      setPhotoTitle('');
      setPhotoNotes('');
      setPhotoUncertainty('');
      return;
    }

    // Online simulation with progress bar
    setUploadProgress(15);
    setUploadError(null);

    try {
      await new Promise(r => setTimeout(r, 250));
      setUploadProgress(55);
      await new Promise(r => setTimeout(r, 250));
      setUploadProgress(90);

      await addEvidence(req.id, evidencePayload);
      setUploadProgress(100);

      setTimeout(() => {
        setUploadProgress(null);
      }, 500);

      setPhotoTitle('');
      setPhotoNotes('');
      setPhotoUncertainty('');
      setToastMessage(`Evidence captured, hashed (SHA-256), and synchronized with Nairobi HQ for ${req.id}!`);
    } catch {
      setUploadProgress(null);
      setUploadError('Network upload failed due to spotty cell signal. Click retry below.');
    }
  };

  // Sync Offline Queue
  const handleSyncOfflineQueue = async () => {
    if (offlineQueue.length === 0) return;
    setUploadProgress(10);
    for (let i = 0; i < offlineQueue.length; i++) {
      const item = offlineQueue[i];
      await addEvidence(item.requestId, item.evidence);
      setUploadProgress(Math.round(((i + 1) / offlineQueue.length) * 100));
    }
    setOfflineQueue([]);
    setUploadProgress(null);
    setToastMessage(`Synchronized all queued evidence items to Nairobi HQ cloud registry.`);
  };

  // Sample photo choices for simulated camera
  const samplePhotos = [
    { label: 'Slab / Columns Underway', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=800&auto=format&fit=crop&q=80' },
    { label: 'Cement / Materials Shed', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80' },
    { label: 'Perimeter Boundary Fence', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80' },
    { label: 'Completed Masonry Walling', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80' },
  ];

  const isAssignedPendingAcceptance = req.requestStatus === 'AGENT_ASSIGNED';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              FIELD VERIFIER APP • MOBILE GROUND MODE
            </span>
            <span className="text-xs text-slate-400">Nairobi Operations Network</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
            Ground Verification & Evidence Capture
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Execute inspection checklist, capture calibrated repeat-angle photographs, log verified materials, and flag on-ground uncertainties.
          </p>
        </div>

        {/* Live GPS Telemetry Indicator */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 text-xs space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white">Verifier: {agent.name}</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            GPS: {req.location.gpsCoords}
          </div>
        </div>
      </div>

      {/* Agent Trust & Earnings Dashboard */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Verifier Rating</span>
            </div>
            <div className="text-lg font-bold text-slate-900">4.96 <span className="text-xs text-amber-600">★★★★★</span></div>
            <div className="text-[10px] text-slate-500">54 verified field audits</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Earnings (This Month)</span>
            </div>
            <div className="text-lg font-bold text-emerald-700">KES 82,500</div>
            <div className="text-[10px] text-slate-500">M-Pesa B2C instant ready</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Independence Pledge</span>
            </div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Cleared & Signed
            </div>
            <div className="text-[10px] text-slate-500">Zero contractor affiliation</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
              <MapPin className="w-4 h-4 text-purple-600" />
              <span>Licensed Counties</span>
            </div>
            <div className="text-xs font-bold text-slate-900 truncate">
              Kiambu, Nairobi, Kajiado
            </div>
            <div className="text-[10px] text-slate-500">4 active counties</div>
          </div>
        </div>
      </div>

      {/* In-app Toast Banner */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white px-5 py-3 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-lg shadow-emerald-600/20 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <Check className="w-4 h-4 stroke-[3] text-emerald-200" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/80 hover:text-white font-bold ml-4 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Task Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
          Select Assigned Mission ({requests.length} Available):
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {requests.map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedReqId(r.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
                r.id === req.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="font-mono font-bold mr-1">{r.id}:</span>
              <span>{r.location.county} ({r.category})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Assignment Acceptance Banner (If Status is AGENT_ASSIGNED) */}
      {isAssignedPendingAcceptance && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 uppercase">
                  New Assignment Pending Your Confirmation
                </span>
                <span className="text-xs font-mono font-bold text-amber-800">{req.id}</span>
              </div>
              <h3 className="text-base font-bold text-amber-950">
                Mission Deployment Offer: {req.title}
              </h3>
              <p className="text-xs text-amber-900">
                Scheduled Visit: <strong>{req.scheduledVisitDate || 'Immediate'}</strong> | Location: <strong>{req.location.town}, {req.location.county}</strong>
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-amber-800 font-medium">Verifier Fee</div>
              <div className="text-lg font-black text-amber-950">KES 7,500</div>
            </div>
          </div>

          <div className="bg-white/80 border border-amber-200 rounded-2xl p-3.5 text-xs text-slate-700 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Independence & Conflict-of-Interest Declaration (Document 1 Invariant)
            </div>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={conflictCertified}
                onChange={(e) => setConflictCertified(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span className="text-xs text-slate-800 leading-snug">
                I formally declare that I have <strong>zero commercial or familial relationship</strong> to the property owner, contractor, foreman, vendor, or any interested party on this parcel.
              </span>
            </label>
          </div>

          {!showDeclineForm ? (
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleAcceptAssignment}
                disabled={!conflictCertified}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Accept Assignment & Lock Schedule</span>
              </button>
              <button
                onClick={() => setShowDeclineForm(true)}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Decline or Declare Conflict</span>
              </button>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-2xl border border-rose-200 space-y-3">
              <label className="text-xs font-bold text-rose-900 block">
                Specify Reason for Declining / Disclosing Conflict:
              </label>
              <input
                type="text"
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g. Discovered contractor is a distant family acquaintance; unable to verify impartially"
                className="w-full px-3 py-2 rounded-xl border border-rose-300 text-xs outline-none"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRejectAssignment}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                >
                  Confirm Rejection & Return to Pool
                </button>
                <button
                  onClick={() => setShowDeclineForm(false)}
                  className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Mission Details & Live GPS Check-In */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
              {req.id}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {req.category}
            </span>
          </div>
          <StatusBadge status={req.status} size="md" />
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900">{req.title}</h2>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
            <span className="flex items-center gap-1 text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {req.location.town}, {req.location.county} County ({req.location.landmark})
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Scheduled: {req.scheduledVisitDate || 'Today'}
            </span>
          </div>
        </div>

        {/* Travel Status Indicator & Action */}
        {req.requestStatus === 'ACCEPTED' && (
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-blue-900">
              <span className="font-bold block">Assignment Scheduled & Ready:</span>
              <span className="text-blue-700">Departing for location? Notify Nairobi HQ and client.</span>
            </div>
            <button
              onClick={handleStartTravelling}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Start Travelling to Site</span>
            </button>
          </div>
        )}

        {req.requestStatus === 'TRAVELLING' && (
          <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl flex items-center gap-2 text-xs text-amber-950 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span>En route to site. Complete GPS Arrival Check-In below once at parcel perimeter.</span>
          </div>
        )}

        {/* Live GPS On-Site Arrival Card */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${req.checkInRecord ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`} />
              <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
                Ground Telemetry & Arrival Check-In
              </span>
            </div>
            {req.checkInRecord ? (
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ARRIVED & VERIFIED ON-SITE ({req.checkInRecord.timestamp})
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                CHECK-IN REQUIRED UPON ENTRY
              </span>
            )}
          </div>

          {req.checkInRecord ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-slate-800/80 p-3 rounded-xl border border-slate-700 font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block">Check-in Coords</span>
                <span className="text-emerald-300">{req.checkInRecord.gpsCoords}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Perimeter Proximity</span>
                <span className="text-emerald-300">{req.checkInRecord.distanceMeters}m (Accurate &plusmn;{req.checkInRecord.accuracyMeters}m)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Verifier Note</span>
                <span className="text-slate-200 truncate">{req.checkInRecord.notes}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-slate-300">
                Click upon arrival at parcel coordinates <span className="font-mono text-amber-300 font-bold">{req.location.gpsCoords}</span>. Proximity check validates device within 150m.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  value={checkInNotes}
                  onChange={(e) => setCheckInNotes(e.target.value)}
                  placeholder="Arrival notes (e.g. Gate opened by foreman Mwenda)"
                  className="w-full sm:flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none"
                />
                <button
                  onClick={handleExecuteCheckIn}
                  disabled={isCheckingIn}
                  className="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  {isCheckingIn ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Locking GPS...</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Check In on Site</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* On-Site Contact Bar */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Ground Contact Person</span>
            <div className="font-bold text-slate-900">{req.contactOnGround.name} ({req.contactOnGround.role})</div>
            <div className="text-slate-500 font-mono text-[11px]">{req.contactOnGround.phone}</div>
          </div>
          <a
            href={`tel:${req.contactOnGround.phone}`}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Ground Contact</span>
          </a>
        </div>
      </div>

      {/* Ground Inspection Checklist with Note-Taking */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              1. Ground Inspection Checklist & Evidence Protocol
            </h3>
            <p className="text-xs text-slate-500">
              Verify each mandatory physical item. Record discrepancies and specific observations on ground.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold">
            {req.checklist.filter(c => c.status === 'passed').length} / {req.checklist.length} Passed
          </span>
        </div>

        <div className="space-y-3">
          {req.checklist.map((item) => {
            const isEditing = editingCheckId === item.id;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  item.status === 'passed'
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : item.status === 'flagged'
                    ? 'border-amber-300 bg-amber-50/70'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="font-bold text-xs text-slate-900 leading-snug">
                      {item.label}
                    </div>
                    {item.notes && !isEditing && (
                      <p className="text-xs text-slate-600 bg-white/80 p-2 rounded-xl border border-slate-100">
                        {item.notes}
                      </p>
                    )}
                  </div>

                  {/* Status Toggle Buttons */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleSetChecklistStatus(item.id, 'passed')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        item.status === 'passed'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-800'
                      }`}
                    >
                      ✓ Passed
                    </button>
                    <button
                      onClick={() => handleSetChecklistStatus(item.id, 'flagged')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        item.status === 'flagged'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-800'
                      }`}
                    >
                      ! Flag
                    </button>
                    <button
                      onClick={() => handleSetChecklistStatus(item.id, 'inconclusive')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        item.status === 'inconclusive'
                          ? 'bg-slate-700 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      ? Inconclusive
                    </button>
                  </div>
                </div>

                {/* Inline Observation Note Form */}
                {isEditing ? (
                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    <textarea
                      rows={2}
                      value={itemNoteText}
                      onChange={(e) => setItemNoteText(e.target.value)}
                      placeholder="Add specific field measurements, counts, or reasons for flagging..."
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveItemNote(item.id, item.status)}
                        className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                      >
                        Save Note
                      </button>
                      <button
                        onClick={() => setEditingCheckId(null)}
                        className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs hover:bg-slate-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{item.verifiedAt ? `Observed at ${item.verifiedAt}` : 'Awaiting check'}</span>
                    <button
                      onClick={() => handleOpenEditNote(item.id, item.notes)}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      {item.notes ? 'Edit Observation Note' : '+ Add Field Note'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Evidence Capture Camera & Offline Queue Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>2. Calibrated Ground Camera & Evidence Capture</span>
            </h3>
            <p className="text-xs text-slate-500">
              Photographs are digitally hashed (SHA-256) and paired with orientation angles to prove site progress.
            </p>
          </div>

          {/* Offline Mode Toggle & Queue */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={offlineMode}
                onChange={(e) => setOfflineMode(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
              />
              <span>Offline Mode (Remote Site)</span>
            </label>

            {offlineQueue.length > 0 && (
              <button
                onClick={handleSyncOfflineQueue}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync Offline Queue ({offlineQueue.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Upload Progress Bar (Online Upload Animation) */}
        {uploadProgress !== null && (
          <div className="space-y-1.5 bg-blue-50 border border-blue-200 p-3 rounded-2xl animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-bold text-blue-900">
              <span>Syncing calibrated photograph to Nairobi HQ...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {uploadError && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{uploadError}</span>
            </div>
            <button
              onClick={() => setUploadError(null)}
              className="text-rose-700 font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <form onSubmit={handleAddEvidenceSubmit} className="space-y-4">
          {/* Simulated Viewfinder */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video max-h-64 border border-slate-300">
            <img
              src={simulatedImageUrl}
              alt="Live Viewfinder"
              className="w-full h-full object-cover opacity-90"
            />
            
            {/* Viewfinder Overlay HUD */}
            <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between text-[11px] font-mono text-emerald-400">
              <div className="flex items-center justify-between bg-black/50 p-1.5 rounded-lg backdrop-blur-sm">
                <span>[CAM-01 ACTIVE]</span>
                <span>{req.location.gpsCoords}</span>
                <span>{hudTime} EAT</span>
              </div>
              <div className="flex items-center justify-between bg-black/50 p-1.5 rounded-lg backdrop-blur-sm">
                <span>CALIBRATION: 50mm EQV</span>
                <span>ANGLE: {photoAngle}</span>
              </div>
            </div>
          </div>

          {/* Quick Photo Presets */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Simulate Camera Capture Subject:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {samplePhotos.map((photo, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSimulatedImageUrl(photo.url)}
                  className={`p-2 rounded-xl text-[11px] font-bold text-left border transition-all truncate ${
                    simulatedImageUrl === photo.url
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {photo.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-800 text-xs block mb-1">Repeat Camera Angle</label>
              <select
                value={photoAngle}
                onChange={(e) => setPhotoAngle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none bg-white font-medium"
              >
                <option value="Repeat Camera Angle 1 (North-East Perimeter)">Repeat Camera Angle 1 (North-East Perimeter)</option>
                <option value="Repeat Camera Angle 2 (Central Ceiling / Slab Props)">Repeat Camera Angle 2 (Central Ceiling / Slab Props)</option>
                <option value="Material Storage Shed & Bags">Material Storage Shed & Bags</option>
                <option value="Road Access & Perimeter Fence">Road Access & Perimeter Fence</option>
                <option value="Water Meter / Submersible Pump">Water Meter / Submersible Pump</option>
                <option value="Survey Beacon Boundary Marker">Survey Beacon Boundary Marker</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-800 text-xs block mb-1">Photo Subject Title</label>
              <input
                type="text"
                value={photoTitle}
                onChange={(e) => setPhotoTitle(e.target.value)}
                placeholder="e.g. Ring beam reinforcement spacing check"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-800 text-xs block mb-1">Inspector Ground Observation</label>
            <textarea
              rows={2}
              value={photoNotes}
              onChange={(e) => setPhotoNotes(e.target.value)}
              placeholder="Record physical details, counts, or anomalies visible in this photo..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none resize-none"
            />
          </div>

          {/* Explicit Limitations / Refusal */}
          <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1.5">
            <label className="font-bold text-rose-900 text-xs flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              What Could NOT Be Confirmed / Site Obstruction (Document 1 Standard)
            </label>
            <p className="text-[11px] text-rose-800">
              Mandatory field if access was restricted, container was locked, or measurements could not be verified safely.
            </p>
            <input
              type="text"
              value={photoUncertainty}
              onChange={(e) => setPhotoUncertainty(e.target.value)}
              placeholder="e.g. Foreman refused access to tool container; sub-surface rebar concealed under fresh pour"
              className="w-full px-3 py-2 rounded-xl border border-rose-300 bg-white text-xs outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>{offlineMode ? 'Queue Offline to Local Device Storage' : 'Upload Calibrated Evidence & Sync to Nairobi HQ'}</span>
          </button>
        </form>
      </div>

      {/* Captured Evidence Gallery on this Mission */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              3. Captured Evidence Gallery ({req.evidence.length} Items)
            </h3>
            <p className="text-xs text-slate-500">
              Calibrated photographic record for mission {req.id}.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            {req.location.county} County
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {req.evidence.map((ev) => (
            <div key={ev.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 p-2.5 space-y-2 shadow-sm">
              <div className="h-36 rounded-xl overflow-hidden bg-slate-900">
                <img src={ev.url} alt={ev.title} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-xs text-slate-900 line-clamp-1">{ev.title}</div>
                <div className="text-[10px] text-slate-500">{ev.cameraAngle || 'Standard Angle'}</div>
                <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                  <span>{ev.timestamp}</span>
                  <span>{ev.locationTag}</span>
                </div>
                {ev.sha256Hash && (
                  <div className="text-[9px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center justify-between truncate" title={`SHA-256: ${ev.sha256Hash}`}>
                    <span className="font-semibold">SHA-256:</span>
                    <span className="truncate ml-1">{ev.sha256Hash.substring(0, 12)}...{ev.sha256Hash.substring(ev.sha256Hash.length - 6)}</span>
                  </div>
                )}
                {ev.uncertaintyFlag && (
                  <div className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-[10px] text-rose-900 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-rose-600 flex-shrink-0" />
                    <span className="truncate">{ev.uncertaintyFlag}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Final Mission Submission Card */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-3xl p-6 shadow-xl border border-emerald-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Step 4: Finalize Ground Mission
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Status: {req.requestStatus}
            </span>
          </div>
          <h3 className="text-base font-bold text-white">
            Ready to Submit Completed Mission to Operations?
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            {req.checklist.filter(c => c.completed).length} of {req.checklist.length} checklist items verified • {req.evidence.length} evidence items hashed & synchronized.
          </p>
        </div>

        <div>
          {req.requestStatus === 'EVIDENCE_SUBMITTED' || req.requestStatus === 'UNDER_REVIEW' || req.requestStatus === 'REPORT_READY' || req.requestStatus === 'COMPLETED' ? (
            <div className="px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold text-xs flex items-center gap-1.5">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Dossier Submitted to QA Desk</span>
            </div>
          ) : (
            <button
              onClick={handleSubmitMissionDossier}
              className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Submit Mission Dossier to Operations</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
