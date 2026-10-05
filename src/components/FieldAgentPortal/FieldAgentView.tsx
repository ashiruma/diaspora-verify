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
  ChevronDown,
  ChevronUp
} from '../Icons';
import { StatusBadge } from '../CommonBadges';

export const FieldAgentView: React.FC = () => {
  const { 
    requests, 
    activeRequest, 
    updateChecklist, 
    addEvidence 
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

  const req = requests.find(r => r.id === selectedReqId) || requests[0];

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

  const handleAddEvidenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim()) {
      setToastMessage('Please enter a photo title or angle description.');
      return;
    }

    addEvidence(req.id, {
      type: 'photo',
      title: photoTitle.trim(),
      description: photoNotes || 'Visual inspection photo captured on site.',
      url: simulatedImageUrl,
      timestamp: new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }) + ' EAT',
      locationTag: `${req.location.town}, ${req.location.county}`,
      gpsCoords: req.location.gpsCoords,
      cameraAngle: photoAngle,
      verifiedByAgentId: req.assignedAgent?.id || 'agt-01',
      tags: ['Field Evidence', req.category],
      uncertaintyFlag: photoUncertainty.trim() || undefined,
    });

    setPhotoTitle('');
    setPhotoNotes('');
    setPhotoUncertainty('');
    setToastMessage(`Evidence captured and synchronized with Nairobi HQ for ${req.id}!`);
  };

  // Sample photo choices for simulated camera
  const samplePhotos = [
    { label: 'Slab / Columns Underway', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=800&auto=format&fit=crop&q=80' },
    { label: 'Cement / Materials Shed', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80' },
    { label: 'Perimeter Boundary Fence', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80' },
    { label: 'Completed Masonry Walling', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
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

        {/* Live GPS Telemetry */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 text-xs space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white">Verifier: {req.assignedAgent?.name || 'Local Ground Verifier'}</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            GPS: {req.location.gpsCoords}
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

      {/* Active Mission Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
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

                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex-shrink-0 ${
                    item.status === 'passed'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : item.status === 'flagged'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {item.status}
                  </span>
                </div>

                {/* Status action buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => handleSetChecklistStatus(item.id, 'passed')}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                        item.status === 'passed'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      ✓ Pass (Confirmed)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetChecklistStatus(item.id, 'flagged')}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                        item.status === 'flagged'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                      }`}
                    >
                      ⚠ Flag Discrepancy
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetChecklistStatus(item.id, 'inconclusive')}
                      className={`px-3 py-1 rounded-lg font-semibold text-xs transition-all ${
                        item.status === 'inconclusive'
                          ? 'bg-slate-700 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      ? Inconclusive
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (isEditing) {
                        setEditingCheckId(null);
                      } else {
                        handleOpenEditNote(item.id, item.notes);
                      }
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                  >
                    {isEditing ? (
                      <>Cancel <ChevronUp className="w-3.5 h-3.5" /></>
                    ) : (
                      <>{item.notes ? 'Edit Ground Note' : '+ Add Note'} <ChevronDown className="w-3.5 h-3.5" /></>
                    )}
                  </button>
                </div>

                {/* In-line note editor */}
                {isEditing && (
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      Field Inspector Specific Observation:
                    </label>
                    <textarea
                      rows={2}
                      value={itemNoteText}
                      onChange={(e) => setItemNoteText(e.target.value)}
                      placeholder="e.g. Counted 40 bags of Bamburi cement in shed; contractor billed for 120 bags..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingCheckId(null)}
                        className="px-3 py-1 rounded-lg border border-slate-300 text-xs text-slate-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveItemNote(item.id, item.status)}
                        className="px-4 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-time Evidence Logger Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Camera className="w-4 h-4 text-emerald-600" />
            2. Capture Calibrated Photographic Evidence
          </h3>
          <p className="text-xs text-slate-500">
            Reference Document standard: Every milestone requires identical repeat camera angles and explicit recording of unconfirmed items.
          </p>
        </div>

        <form onSubmit={handleAddEvidenceSubmit} className="space-y-4 text-xs">
          
          {/* Preset Photo Simulation */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block">
              Simulated Camera Capture Feed:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {samplePhotos.map((photo, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => {
                    setSimulatedImageUrl(photo.url);
                    setPhotoTitle(photo.label);
                  }}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    simulatedImageUrl === photo.url
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <img src={photo.url} alt={photo.label} className="w-full h-16 object-cover rounded-lg mb-1" />
                  <div className="text-[10px] font-bold text-slate-800 line-clamp-1">{photo.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Repeat Camera Angle</label>
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
              <label className="font-bold text-slate-800 block mb-1">Photo Subject Title</label>
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
            <label className="font-bold text-slate-800 block mb-1">Inspector Ground Observation</label>
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
            <label className="font-bold text-rose-900 flex items-center gap-1.5">
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
            <span>Upload Calibrated Evidence & Sync to Nairobi HQ</span>
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

    </div>
  );
};
