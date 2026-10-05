import React, { useState } from 'react';
import { useVerification } from '../../context/VerificationContext';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  FileText, 
  Lock
} from '../Icons';
import type { ServiceCategory, ServiceOfferModel } from '../../types';
import { SERVICE_CATEGORIES_CONFIG, KENYA_COUNTIES, FORMAT_CURRENCY } from '../../data/mockData';


interface NewRequestWizardProps {
  onSuccess: (newId: string) => void;
  onCancel: () => void;
}

export const NewRequestWizard: React.FC<NewRequestWizardProps> = ({ onSuccess, onCancel }) => {
  const { createRequest, currency } = useVerification();

  const [step, setStep] = useState(1);

  // Form state
  const [category, setCategory] = useState<ServiceCategory>('construction');
  const [offerType, setOfferType] = useState<ServiceOfferModel>('follow-through');
  const [title, setTitle] = useState('');
  const [decisionPrompt, setDecisionPrompt] = useState('');
  const [county, setCounty] = useState('Kajiado');
  const [town, setTown] = useState('');
  const [landmark, setLandmark] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState('Contractor / Site Foreman');
  const [contactPhone, setContactPhone] = useState('+254 ');
  const [scopeBrief, setScopeBrief] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; sizeKb: number; type: string }[]>([]);
  const [agreedToBoundaries, setAgreedToBoundaries] = useState(false);
  const [urgency, setUrgency] = useState<'standard' | 'priority' | 'urgent'>('standard');

  // Family Care Safeguarding State (Document 1, Section 5)
  const [familyRelationship, setFamilyRelationship] = useState('Son / Daughter');
  const [familyConsentConfirmed, setFamilyConsentConfirmed] = useState(false);
  const [familyEmergencyContact, setFamilyEmergencyContact] = useState('');

  // Calculate quoted fee
  const baseFees: Record<ServiceCategory, number> = {
    construction: 14500,
    property: 12000,
    vehicle: 16000,
    business: 13500,
    family: 18000,
    custom: 15000,
  };

  const urgencyMultiplier = urgency === 'urgent' ? 1.4 : urgency === 'priority' ? 1.2 : 1.0;
  const estimatedFeeKES = Math.round(baseFees[category] * urgencyMultiplier);

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFiles(prev => [
        ...prev,
        {
          name: file.name,
          sizeKb: Math.round(file.size / 1024),
          type: file.type || 'Document'
        }
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToBoundaries) {
      alert('Please acknowledge the service boundaries to proceed.');
      return;
    }

    if (category === 'family') {
      if (!familyConsentConfirmed) {
        alert('Family Welfare requests require explicit confirmation of care recipient consent or legal guardian authority.');
        return;
      }
      if (!familyEmergencyContact.trim()) {
        alert('Please provide a named emergency contact and phone number in Kenya for family care requests.');
        return;
      }
    }

    const newId = createRequest({
      title: title || `${category.toUpperCase()} Verification in ${town || county}`,
      category,
      offerType,
      urgency,
      scopeBrief: scopeBrief || `Ground verification for ${decisionPrompt}`,
      location: {
        county,
        town: town || `${county} Central`,
        landmark: landmark || 'Local center',
        gpsCoords: '-1.2921, 36.8219',
      },
      contactOnGround: {
        name: contactName || 'Local Contact',
        role: contactRole,
        phone: contactPhone,
        accessConfirmed: true,
      },
      pricing: {
        serviceFeeKES: estimatedFeeKES,
        currency,
        quoteStatus: 'draft',
      },
      documentsProvided: uploadedFiles.map((f, i) => ({
        id: `doc-new-${i}`,
        name: f.name,
        type: f.type,
        uploadDate: new Date().toISOString().substring(0, 10),
        sizeKb: f.sizeKb,
      }))
    });

    onSuccess(newId);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl space-y-8">
        
        {/* Wizard Header */}
        <div className="border-b border-slate-100 pb-5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Step {step} of 4 • Intake Protocol
            </span>
            <button
              onClick={onCancel}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-900 mt-2">
            Book Ground Verification in Kenya
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            “Tell us the task, location and deadline. We will agree on the scope, assign the right person, and keep you updated.”
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-100'}`}>1</span>
            <span>Task & Category</span>
          </div>
          <div className="h-0.5 w-12 bg-slate-200" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-100'}`}>2</span>
            <span>Location & Access</span>
          </div>
          <div className="h-0.5 w-12 bg-slate-200" />
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-100'}`}>3</span>
            <span>Scope & Brief</span>
          </div>
          <div className="h-0.5 w-12 bg-slate-200" />
          <div className={`flex items-center gap-2 ${step >= 4 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step >= 4 ? 'bg-emerald-600 text-white' : 'bg-slate-100'}`}>4</span>
            <span>Review & Quote</span>
          </div>
        </div>

        {/* Step 1: Category & Core Decision Question */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                1. Select Service Domain
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICE_CATEGORIES_CONFIG.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id as ServiceCategory)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      category === cat.id
                        ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="font-bold text-xs text-slate-900 mb-0.5">{cat.name}</div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{cat.tagline}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Commercial Model (From Document 1, Section 4) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                2. Engagement Model
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setOfferType('one-time')}
                  className={`p-3 rounded-xl border text-left text-xs ${
                    offerType === 'one-time'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold">One-Time Check</div>
                  <div className="text-[11px] text-slate-500 font-normal">Single inspection before paying for asset.</div>
                </button>

                <button
                  type="button"
                  onClick={() => setOfferType('follow-through')}
                  className={`p-3 rounded-xl border text-left text-xs ${
                    offerType === 'follow-through'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold">Follow-Through</div>
                  <div className="text-[11px] text-slate-500 font-normal">Multi-visit milestones with stage signoffs.</div>
                </button>

                <button
                  type="button"
                  onClick={() => setOfferType('ongoing-assistant')}
                  className={`p-3 rounded-xl border text-left text-xs ${
                    offerType === 'ongoing-assistant'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold">Ongoing Assistant</div>
                  <div className="text-[11px] text-slate-500 font-normal">Monthly plan for family, farm, or business.</div>
                </button>
              </div>
            </div>

            {/* Request Title */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Project / Request Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Ruiru 3-Bedroom Roofing Inspection or Kitengela Plot Survey"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Core Decision Question (From Document 1, Section 1) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                “What consequential decision or task are you unable to handle confidently from abroad?”
              </label>
              <input
                type="text"
                value={decisionPrompt}
                onChange={(e) => setDecisionPrompt(e.target.value)}
                placeholder="e.g. Contractor is demanding KES 400k for roofing, but family sent blurry photos..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>


            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <span>Continue to Location</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Location & Contacts */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Kenyan County</label>
                <select
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {KENYA_COUNTIES.map(c => (
                    <option key={c} value={c}>{c} County</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Town / Area / Ward</label>
                <input
                  type="text"
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                  placeholder="e.g. Kitengela Acacia, Ruiru Membley, Eldoret Elgon View"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Landmark / Nearest Road / GPS Notes</label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. 500m past Total Energies, green gate opposite church"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Ground Contact / Keyholder Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Contact Full Name</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Peter Kariuki"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1">Role / Relationship</label>
                  <input
                    type="text"
                    value={contactRole}
                    onChange={(e) => setContactRole(e.target.value)}
                    placeholder="e.g. Contractor, Caregiver, Seller"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1">Kenyan Phone (Safaricom / Airtel)</label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Family Care Consent & Safeguarding (Document 1, Section 5) */}
            {category === 'family' && (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 space-y-3">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-xs">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <span>Family Welfare Safeguarding & Consent Verification</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-amber-950 mb-1">Your Relationship to Recipient</label>
                    <select
                      value={familyRelationship}
                      onChange={(e) => setFamilyRelationship(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs outline-none"
                    >
                      <option value="Son / Daughter">Son / Daughter</option>
                      <option value="Parent">Parent</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Grandchild">Grandchild</option>
                      <option value="Legal Guardian">Legal Guardian</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-amber-950 mb-1">Emergency Medical / Family Contact in Kenya *</label>
                    <input
                      type="text"
                      value={familyEmergencyContact}
                      onChange={(e) => setFamilyEmergencyContact(e.target.value)}
                      placeholder="Dr. Name or Next-of-Kin Phone"
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs outline-none"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2 pt-2 border-t border-amber-200/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={familyConsentConfirmed}
                    onChange={(e) => setFamilyConsentConfirmed(e.target.checked)}
                    className="mt-0.5 rounded text-amber-700 focus:ring-amber-500"
                  />
                  <span className="text-[11px] text-amber-950 font-medium">
                    I confirm that the care recipient has granted consent for this welfare visit, or I hold appropriate legal guardian authority. I acknowledge DiasporaVerify does not provide clinical emergency response or medical care.
                  </span>
                </label>
              </div>
            )}

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <span>Continue to Scope</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Scope Brief & Document Upload */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Detailed Task Brief & Specific Questions for the Inspector
              </label>
              <textarea
                rows={4}
                value={scopeBrief}
                onChange={(e) => setScopeBrief(e.target.value)}
                placeholder="Specify exactly what you want the field agent to look for, photograph, count, or ask the contact..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                Upload Relevant Documents (Plans, Invoices, Contracts, Photos)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-2 hover:bg-slate-50 transition-colors">
                <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-xs text-slate-600">
                  <label className="text-emerald-700 font-bold hover:underline cursor-pointer">
                    Browse files
                    <input type="file" onChange={handleSimulateUpload} className="hidden" />
                  </label>
                  <span> or drop architectural plans, receipts, or contracts</span>
                </div>
                <p className="text-[11px] text-slate-400">PDF, JPG, PNG up to 25MB</p>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-1.5 mt-3">
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                      <span className="font-semibold text-slate-700">{f.name}</span>
                      <span className="text-slate-400 font-mono text-[11px]">{f.sizeKb} KB</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Turnaround Urgency</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setUrgency('standard')}
                  className={`p-2.5 rounded-xl border text-xs text-center ${
                    urgency === 'standard' ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-950' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Standard (48 Hours)
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('priority')}
                  className={`p-2.5 rounded-xl border text-xs text-center ${
                    urgency === 'priority' ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-950' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Priority (24 Hours)
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('urgent')}
                  className={`p-2.5 rounded-xl border text-xs text-center ${
                    urgency === 'urgent' ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-950' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Urgent (Same Day)
                </button>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <span>Review Terms & Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review Quote & Service Boundary Acknowledgment */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Price Quote Summary */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>ESTIMATED SERVICE FEE QUOTE</span>
                <span className="font-mono">{urgency.toUpperCase()} SLA</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black font-display text-emerald-400">
                  {FORMAT_CURRENCY(estimatedFeeKES, currency)}
                </span>
                <span className="text-xs text-slate-300">
                  Includes travel, ground agent, dated photo evidence & QA review
                </span>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-2">
                “Separate client funds from service fee. DiasporaVerify quotes each task after intake. Client authorizes decisions directly.”
              </div>
            </div>

            {/* Scope Summary */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Service Category:</span>
                <span className="font-bold text-slate-900 uppercase">{category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-bold text-slate-900">{town || 'Central'}, {county} County</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contact on Ground:</span>
                <span className="font-bold text-slate-900">{contactName || 'Unassigned'} ({contactRole})</span>
              </div>
            </div>

            {/* Mandatory Trust & Service Boundaries Agreement (Document 1, Section 5) */}
            <div className="p-4 rounded-xl border-2 border-emerald-500/30 bg-emerald-50/50 space-y-3 text-xs">
              <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-700" />
                <span>Mandatory Service Boundary & Independence Acknowledgment</span>
              </div>

              <div className="space-y-2 text-[11px] text-slate-700 leading-relaxed">
                <p>
                  • <strong>Evidence Standard:</strong> A photo is evidence of what it shows, not proof of ownership, soil capacity, or structural compression strength.
                </p>
                <p>
                  • <strong>Fund Separation:</strong> DiasporaVerify does not hold construction funds or release money to contractors. You retain 100% control of payments.
                </p>
                <p>
                  • <strong>Named Accountability:</strong> An independent vetted field agent without commercial conflict of interest will execute the brief.
                </p>
              </div>

              <label className="flex items-start gap-2.5 pt-2 border-t border-emerald-200/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToBoundaries}
                  onChange={(e) => setAgreedToBoundaries(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs font-bold text-emerald-950">
                  I understand and accept these service boundaries and authorize DiasporaVerify to assign a local agent.
                </span>
              </label>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                disabled={!agreedToBoundaries}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-700/20"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Confirm & Submit Request</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
