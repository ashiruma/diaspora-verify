import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useVerification } from '../../context/VerificationContext';
import { 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  Lock,
  Building,
  Building2,
  MapPin,
  Car,
  Briefcase,
  Heart,
  DollarSign,
  Compass,
  Users,
  Camera,
  Video,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Printer,
  Download,
  X,
  ShieldCheck,
  Clock
} from '../Icons';
import type { ServiceCategory, ServiceOfferModel, CurrencyCode } from '../../types';
import { KENYA_COUNTIES, FORMAT_CURRENCY } from '../../data/mockData';
import { calculateFeeBreakdown } from '../../services/paymentService';

interface NewRequestWizardProps {
  onSuccess: (newId: string) => void;
  onCancel: () => void;
}

// 5 Master Service Pillars matching canonical Specification
interface MasterCategoryDef {
  id: string; // Master Slug
  title: string;
  tagline: string;
  icon: React.ReactNode;
  defaultInternal: ServiceCategory;
  subTypes: {
    id: ServiceCategory;
    label: string;
    description: string;
    defaultTitle: string;
  }[];
}

const MASTER_PILLARS: MasterCategoryDef[] = [
  {
    id: 'projects-assets',
    title: 'Projects & Assets',
    tagline: 'Construction milestones, land boundaries, perimeter walls, and property condition',
    icon: <Building2 className="w-5 h-5 text-emerald-600" />,
    defaultInternal: 'construction',
    subTypes: [
      {
        id: 'construction',
        label: 'Construction Milestone Oversight',
        description: 'Physical progress inspection (slab, lintel, roofing, finishes) and materials stock tally.',
        defaultTitle: 'Construction Milestone Inspection'
      },
      {
        id: 'property',
        label: 'Land Boundary & Plot Verification',
        description: 'Cadastral beacon search, perimeter fence condition, encroachment, and vacancy check.',
        defaultTitle: 'Land Parcel & Beacon Verification'
      }
    ]
  },
  {
    id: 'purchases-vehicles',
    title: 'Purchases & Vehicles',
    tagline: 'Independent pre-purchase inspection of motor vehicles, machinery & high-value equipment',
    icon: <Car className="w-5 h-5 text-amber-600" />,
    defaultInternal: 'vehicle',
    subTypes: [
      {
        id: 'vehicle',
        label: 'Vehicle Pre-Purchase Inspection',
        description: 'Chassis/VIN verification, paint depth gauge, computer OBD-II scan, and test-drive observation.',
        defaultTitle: 'Pre-Purchase Motor Vehicle Inspection'
      },
      {
        id: 'purchase',
        label: 'Machinery & Equipment Check',
        description: 'Solar installations, water pumps, generators, and physical supplier consignment inspection.',
        defaultTitle: 'High-Value Equipment & Machinery Check'
      }
    ]
  },
  {
    id: 'business-support',
    title: 'Business Support',
    tagline: 'Commercial premises check, physical stock count, and statutory permit verification',
    icon: <Briefcase className="w-5 h-5 text-blue-600" />,
    defaultInternal: 'business',
    subTypes: [
      {
        id: 'business',
        label: 'Commercial Due Diligence & Storefront Audit',
        description: 'Physical premises confirmation, inventory/stock count, county permit check, and staff presence.',
        defaultTitle: 'Commercial Business Premises Audit'
      }
    ]
  },
  {
    id: 'family-support',
    title: 'Family Support',
    tagline: 'Dignified welfare observations, clinic accompaniment & compassionate care coordination',
    icon: <Heart className="w-5 h-5 text-rose-600" />,
    defaultInternal: 'family',
    subTypes: [
      {
        id: 'family',
        label: 'Family Welfare & Elderly Well-being Visit',
        description: 'Living conditions check, nutrition & comfort observation, and respectful family coordination.',
        defaultTitle: 'Family Welfare & Well-being Check-in'
      },
      {
        id: 'person',
        label: 'Medical Clinic & Appointment Accompaniment',
        description: 'Escorting family member to hospital/clinic, appointment attendance, and facility observation.',
        defaultTitle: 'Clinic Visit & Care Accompaniment'
      }
    ]
  },
  {
    id: 'custom-requests',
    title: 'Custom Requests',
    tagline: 'Ministry & land registry document retrieval, official follow-ups, and specialized missions',
    icon: <Compass className="w-5 h-5 text-purple-600" />,
    defaultInternal: 'document',
    subTypes: [
      {
        id: 'document',
        label: 'Ministry & Registry Document Search',
        description: 'Physical document follow-up at Ardhi House, Sheria House, Huduma Centre, or County Lands.',
        defaultTitle: 'Official Registry Document Search'
      },
      {
        id: 'custom',
        label: 'Bespoke Field Assignment',
        description: 'Tailored on-ground mission, specialized verification, or custom coordination.',
        defaultTitle: 'Custom On-Ground Field Assignment'
      },
      {
        id: 'field_assistance',
        label: 'General Ground Errand & Meeting Attendance',
        description: 'Representational presence at site meetings, document collection, and local administrative tasks.',
        defaultTitle: 'General Field Assistance & Coordination'
      }
    ]
  }
];

export const NewRequestWizard: React.FC<NewRequestWizardProps> = ({ onSuccess, onCancel }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { createRequest, currency, setCurrency, currentUser, isAuthenticated } = useVerification();

  const [step, setStep] = useState(1);
  const [draftSavedToast, setDraftSavedToast] = useState(false);
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);

  // Quote identifier generated deterministically for review
  const [quoteId] = useState(() => Math.floor(1000 + Math.random() * 9000).toString());

  // Step 1: Master Pillar & Sub-type
  const [masterPillar, setMasterPillar] = useState<string>('projects-assets');
  const [category, setCategory] = useState<ServiceCategory>('construction');
  const [offerType, setOfferType] = useState<ServiceOfferModel>('one-time');
  const [title, setTitle] = useState('Construction Milestone Inspection');

  // Step 2: Location & County Coverage
  const [county, setCounty] = useState('Nairobi');
  const [town, setTown] = useState('');
  const [area, setArea] = useState('');
  const [exactAddress, setExactAddress] = useState('');
  const [gpsCoords, setGpsCoords] = useState('-1.2921, 36.8219');

  // Local Site Contact
  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState('Site Representative / Foreman');
  const [contactPhone, setContactPhone] = useState('+254 ');

  // Step 3: Category-Specific Structured Brief
  // Projects & Assets (Construction & Property)
  const [propertyType, setPropertyType] = useState('Residential Villa');
  const [milestoneStage, setMilestoneStage] = useState('First Floor Lintel Ring Beam');
  const [cementBagsBilled, setCementBagsBilled] = useState('100');
  const [rebarSteelCheck, setRebarSteelCheck] = useState(true);
  const [beaconSearchRequested, setBeaconSearchRequested] = useState(true);
  const [fenceCheckRequested, setFenceCheckRequested] = useState(true);
  const [occupancyCheckRequested, setOccupancyCheckRequested] = useState(true);
  const [titleDeedRef, setTitleDeedRef] = useState('');

  // Purchases & Vehicles
  const [vehicleMakeModel, setVehicleMakeModel] = useState('');
  const [vinNumber, setVinNumber] = useState('');
  const [dealershipLocation, setDealershipLocation] = useState('');
  const [paintGaugeRequested, setPaintGaugeRequested] = useState(true);
  const [odometerCheckRequested, setOdometerCheckRequested] = useState(true);
  const [obdScanRequested, setObdScanRequested] = useState(true);
  const [testDriveAuthorized, setTestDriveAuthorized] = useState(true);
  const [purchaseItemName, setPurchaseItemName] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [functionalTestRequested, setFunctionalTestRequested] = useState(true);

  // Business Support
  const [businessName, setBusinessName] = useState('');
  const [storefrontAddress, setStorefrontAddress] = useState('');
  const [inventoryCountRequested, setInventoryCountRequested] = useState(true);
  const [permitCheckRequested, setPermitCheckRequested] = useState(true);
  const [staffCheckRequested, setStaffCheckRequested] = useState(true);

  // Family Support (Preserving Rule 13 Invariants)
  const [personName, setPersonName] = useState('');
  const [familyRelationship, setFamilyRelationship] = useState('Parent / Elder');
  const [familyConsentConfirmed, setFamilyConsentConfirmed] = useState(false);
  const [familyEmergencyContact, setFamilyEmergencyContact] = useState('');
  const [wellnessFocus, setWellnessFocus] = useState('General living condition & nutrition observation');

  // Custom Requests & Documents
  const [documentType, setDocumentType] = useState('Land Registry Green Card / Title Record');
  const [issuingInstitution, setIssuingInstitution] = useState('Ministry of Lands (Ardhi House)');
  const [registryFileNumber, setRegistryFileNumber] = useState('');
  const [errandDescription, setErrandDescription] = useState('');
  const [officeToVisit, setOfficeToVisit] = useState('');

  // Step 4: Evidence Required Selection
  const [evidenceRequested, setEvidenceRequested] = useState<string[]>([
    'High-Resolution Photos',
    'GPS Telemetry Match',
    'Written Observations',
    'Video Walkthrough'
  ]);

  // Step 5: Urgency & Timing
  const [urgency, setUrgency] = useState<'standard' | 'priority' | 'urgent'>('standard');
  const [preferredDate, setPreferredDate] = useState('');

  // Step 6: Detailed Instructions & Attachments
  const [scopeBrief, setScopeBrief] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; sizeKb: number; type: string }[]>([]);
  const [agreedToBoundaries, setAgreedToBoundaries] = useState(false);

  // Pre-populate category from URL search params (e.g. ?category=projects-assets)
  useEffect(() => {
    const paramCat = searchParams.get('category');
    if (paramCat) {
      const matchedPillar = MASTER_PILLARS.find(p => p.id === paramCat || p.subTypes.some(st => st.id === paramCat));
      if (matchedPillar) {
        setMasterPillar(matchedPillar.id);
        const sub = matchedPillar.subTypes.find(st => st.id === paramCat) || matchedPillar.subTypes[0];
        setCategory(sub.id);
        setTitle(sub.defaultTitle);
      }
    }
  }, [searchParams]);

  // Check for saved draft in localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dv_intake_draft');
      if (saved && !hasRestoredDraft) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.title) {
          setHasRestoredDraft(true);
        }
      }
    } catch (e) {
      console.warn('Could not inspect draft', e);
    }
  }, [hasRestoredDraft]);

  const handleRestoreDraft = () => {
    try {
      const saved = localStorage.getItem('dv_intake_draft');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.masterPillar) setMasterPillar(data.masterPillar);
        if (data.category) setCategory(data.category);
        if (data.title) setTitle(data.title);
        if (data.county) setCounty(data.county);
        if (data.town) setTown(data.town);
        if (data.area) setArea(data.area);
        if (data.exactAddress) setExactAddress(data.exactAddress);
        if (data.contactName) setContactName(data.contactName);
        if (data.contactRole) setContactRole(data.contactRole);
        if (data.contactPhone) setContactPhone(data.contactPhone);
        if (data.scopeBrief) setScopeBrief(data.scopeBrief);
        if (data.urgency) setUrgency(data.urgency);
        if (data.familyConsentConfirmed !== undefined) setFamilyConsentConfirmed(data.familyConsentConfirmed);
        if (data.familyEmergencyContact) setFamilyEmergencyContact(data.familyEmergencyContact);
        setHasRestoredDraft(false);
      }
    } catch (e) {
      console.error('Failed to restore draft', e);
    }
  };

  const handleSaveDraft = () => {
    try {
      const draftPayload = {
        masterPillar,
        category,
        title,
        county,
        town,
        area,
        exactAddress,
        contactName,
        contactRole,
        contactPhone,
        scopeBrief,
        urgency,
        familyConsentConfirmed,
        familyEmergencyContact,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('dv_intake_draft', JSON.stringify(draftPayload));
      setDraftSavedToast(true);
      setTimeout(() => setDraftSavedToast(false), 3500);
    } catch (e) {
      console.error('Failed to save draft', e);
    }
  };

  // Calculate pricing breakdown via centralized service
  const feeBreakdown = calculateFeeBreakdown(category, urgency, county, currency);

  const toggleEvidence = (evName: string) => {
    setEvidenceRequested(prev => 
      prev.includes(evName) ? prev.filter(e => e !== evName) : [...prev, evName]
    );
  };

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

  const removeUploadedFile = (idx: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSelectMasterPillar = (pillarId: string) => {
    setMasterPillar(pillarId);
    const pillar = MASTER_PILLARS.find(p => p.id === pillarId);
    if (pillar && pillar.subTypes.length > 0) {
      setCategory(pillar.subTypes[0].id);
      setTitle(pillar.subTypes[0].defaultTitle);
    }
  };

  const handleSelectSubType = (subId: ServiceCategory, defaultTitle: string) => {
    setCategory(subId);
    setTitle(defaultTitle);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToBoundaries) {
      alert('Please acknowledge the service boundaries and independence doctrine to proceed.');
      return;
    }

    // Rule 13 Safeguarding Invariant
    if (category === 'family' || category === 'person') {
      if (!familyConsentConfirmed) {
        alert('Family Welfare requests require explicit confirmation of care recipient consent or legal guardian authority.');
        return;
      }
      if (!familyEmergencyContact.trim()) {
        alert('Please provide a named emergency contact and phone number in Kenya for family care requests.');
        return;
      }
    }

    // Dynamic scope construction
    let detailedScope = scopeBrief;
    if (category === 'property') {
      detailedScope = `Property check: ${propertyType}. Title ref: ${titleDeedRef || 'N/A'}. Beacons: ${beaconSearchRequested ? 'Yes' : 'No'}. Fence check: ${fenceCheckRequested ? 'Yes' : 'No'}. Occupancy: ${occupancyCheckRequested ? 'Yes' : 'No'}. ${scopeBrief}`;
    } else if (category === 'construction') {
      detailedScope = `Construction Milestone: ${milestoneStage}. Property: ${propertyType}. Cement stock check: ${cementBagsBilled} bags billed. Rebar inspection: ${rebarSteelCheck ? 'Yes' : 'No'}. ${scopeBrief}`;
    } else if (category === 'business') {
      detailedScope = `Business verification: ${businessName} at ${storefrontAddress || 'site'}. Inventory count: ${inventoryCountRequested ? 'Yes' : 'No'}. Permit check: ${permitCheckRequested ? 'Yes' : 'No'}. Staff check: ${staffCheckRequested ? 'Yes' : 'No'}. ${scopeBrief}`;
    } else if (category === 'vehicle') {
      detailedScope = `Vehicle inspection: ${vehicleMakeModel}. VIN: ${vinNumber || 'N/A'}. Yard: ${dealershipLocation || 'N/A'}. Paint gauge: ${paintGaugeRequested ? 'Yes' : 'No'}. Odometer: ${odometerCheckRequested ? 'Yes' : 'No'}. OBD scan: ${obdScanRequested ? 'Yes' : 'No'}. Test-drive auth: ${testDriveAuthorized ? 'Yes' : 'No'}. ${scopeBrief}`;
    } else if (category === 'document') {
      detailedScope = `Document inspection: ${documentType} at ${issuingInstitution}. File no: ${registryFileNumber || 'N/A'}. ${scopeBrief}`;
    } else if (category === 'purchase') {
      detailedScope = `Purchase verification: ${purchaseItemName} at ${supplierName}. Functional test: ${functionalTestRequested ? 'Yes' : 'No'}. ${scopeBrief}`;
    } else if (category === 'family' || category === 'person') {
      detailedScope = `Family welfare visit: ${personName} (${familyRelationship}). Focus: ${wellnessFocus}. Emergency contact: ${familyEmergencyContact}. ${scopeBrief}`;
    } else if (category === 'field_assistance') {
      detailedScope = `Field assistance: ${errandDescription} at ${officeToVisit}. ${scopeBrief}`;
    }

    // If unauthenticated, redirect to register/login saving draft
    if (!isAuthenticated || !currentUser) {
      handleSaveDraft();
      navigate(`/register?redirect=/new-request`);
      return;
    }

    const newId = createRequest({
      title: title || `${category.toUpperCase()} Verification in ${town || county}`,
      category,
      offerType,
      urgency,
      scopeBrief: detailedScope,
      location: {
        county,
        town: town || `${county} Central`,
        landmark: area ? `${area}, near ${exactAddress || 'local center'}` : exactAddress || 'Local center',
        gpsCoords: gpsCoords || '-1.2921, 36.8219',
        addressNotes: exactAddress
      },
      contactOnGround: {
        name: contactName || 'Local Site Contact',
        role: contactRole,
        phone: contactPhone,
        accessConfirmed: true,
      },
      deliverables: [
        ...evidenceRequested.map(ev => `Physical verification: ${ev}`),
        'Discrepancy statement and observation notes',
        'Transparent Verification Confidence Score'
      ],
      pricing: {
        serviceFeeKES: feeBreakdown.totalKES,
        currency,
        quoteStatus: 'draft',
        feeBreakdown
      },
      documentsProvided: uploadedFiles.map((f, i) => ({
        id: `doc-new-${i}`,
        name: f.name,
        type: f.type,
        uploadDate: new Date().toISOString().substring(0, 10),
        sizeKb: f.sizeKb,
      }))
    });

    // Clear saved draft on successful submission
    try {
      localStorage.removeItem('dv_intake_draft');
    } catch {}

    onSuccess(newId);
  };

  const evidenceOptions = [
    { id: 'High-Resolution Photos', icon: <Camera className="w-4 h-4 text-emerald-600" />, label: 'High-Resolution Photos', desc: 'Calibrated timestamped photos of perimeter and key assets' },
    { id: 'Video Walkthrough', icon: <Video className="w-4 h-4 text-blue-600" />, label: 'Video Walkthrough', desc: 'Continuous video walkthrough with commentary' },
    { id: 'GPS Telemetry Match', icon: <MapPin className="w-4 h-4 text-amber-600" />, label: 'GPS / Location Match', desc: 'Hardware-verified GPS coordinates matching target coordinates' },
    { id: 'Document Inspections', icon: <FileText className="w-4 h-4 text-purple-600" />, label: 'Physical Documents', desc: 'Photograph official certificates, permits, or invoices on site' },
    { id: 'Interviews & Audio', icon: <Users className="w-4 h-4 text-cyan-600" />, label: 'Site Interviews', desc: 'Structured interviews with site contact, neighbor, or manager' },
    { id: 'Written Observations', icon: <FileText className="w-4 h-4 text-slate-600" />, label: 'Detailed Written Findings', desc: 'Objective factual observations separated from agent opinions' },
  ];

  const currentPillarDef = MASTER_PILLARS.find(p => p.id === masterPillar) || MASTER_PILLARS[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans text-left">
      {/* Toast Notification for Saved Draft */}
      {draftSavedToast && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs border border-slate-700 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Draft request saved securely to your browser.</span>
        </div>
      )}

      {/* Restorable Draft Banner */}
      {hasRestoredDraft && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>You have an uncompleted draft from an earlier session.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRestoreDraft}
              className="px-3 py-1 rounded-lg bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition cursor-pointer"
            >
              Resume Draft
            </button>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('dv_intake_draft');
                setHasRestoredDraft(false);
              }}
              className="px-2 py-1 text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl space-y-8">
        
        {/* Wizard Header */}
        <div className="border-b border-slate-100 pb-5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Step {step} of 7 • Verification Request Wizard
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-2">
            Request an On-Ground Verification in Kenya
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            “VERIFY KENYA. FROM ANYWHERE. Tell us the task, location, and required evidence. We assign a vetted local agent with strict conflict clearance.”
          </p>
        </div>

        {/* Step Indicator Bar */}
        <div className="grid grid-cols-7 gap-1 text-[10px] font-semibold text-center border-b border-slate-100 pb-4 overflow-x-auto">
          {[
            '1. Category',
            '2. Location',
            '3. Scope',
            '4. Evidence',
            '5. Urgency',
            '6. Details',
            '7. Quote Dossier'
          ].map((label, idx) => (
            <div 
              key={idx}
              className={`p-1.5 rounded-lg transition-colors ${
                step === idx + 1 
                  ? 'bg-slate-900 text-white font-bold' 
                  : step > idx + 1 
                  ? 'bg-emerald-50 text-emerald-800' 
                  : 'text-slate-400'
              }`}
            >
              {label}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* STEP 1: What do you need verified? (5 Master Pillars) */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 1: What do you need verified?</h2>
                <p className="text-xs text-slate-500 mt-0.5">Select from our 5 master service pillars and define the target focus.</p>
              </div>

              {/* Master Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {MASTER_PILLARS.map((p) => {
                  const isSelected = masterPillar === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectMasterPillar(p.id)}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/40 shadow-xs ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="p-2 rounded-xl bg-white shadow-2xs border border-slate-200 w-fit">
                          {p.icon}
                        </div>
                        <div className="font-bold text-sm text-slate-900">{p.title}</div>
                        <div className="text-xs text-slate-500 leading-snug">{p.tagline}</div>
                      </div>
                      <div className="pt-3 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                        {isSelected ? '✓ Selected Pillar' : 'Select Pillar →'}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Sub-Service Focus Area */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Specific Focus for {currentPillarDef.title}:
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Determines checklist & questions
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentPillarDef.subTypes.map((sub) => {
                    const isSubSelected = category === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => handleSelectSubType(sub.id, sub.defaultTitle)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSubSelected
                            ? 'border-slate-900 bg-white shadow-xs ring-2 ring-slate-900/10'
                            : 'border-slate-200 bg-white/70 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">{sub.label}</span>
                          {isSubSelected && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">{sub.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Service Model Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Engagement Model
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'one-time', title: 'One-Time Verification', desc: 'Single comprehensive physical site inspection with full dossier' },
                    { id: 'follow-through', title: 'Phased Follow-Through', desc: 'Multi-visit tracking across milestones or follow-up remediation' },
                    { id: 'ongoing-assistant', title: 'Recurring Assistance', desc: 'Scheduled monthly checks for properties, farms or businesses' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setOfferType(m.id as ServiceOfferModel)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        offerType === m.id
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-2xs ring-1 ring-emerald-500/20'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-900">{m.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Request Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Request Title / Short Reference (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Kitengela Villa Lintel Inspection or Westlands Storefront Audit"
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Location & County Coverage */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 2: Where is the task located in Kenya?</h2>
                <p className="text-xs text-slate-500 mt-0.5">Specify county, town, and local landmarks. Travel logistics are calculated automatically.</p>
              </div>

              {/* Pilot Direct Coverage Notice */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold">Nairobi Metropolitan Pilot Foundation Active:</span>
                    <p className="text-[11px] text-emerald-800">
                      Nairobi, Kiambu, Machakos, and Kajiado benefit from same-day dispatch and optimal logistics rates.
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px] uppercase tracking-wider shrink-0">
                  Primary Pilot Hub
                </span>
              </div>

              {/* County Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    County *
                  </label>
                  <select
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                  >
                    <optgroup label="Nairobi Metropolitan Pilot (Fastest SLA)">
                      <option value="Nairobi">Nairobi County (HQ Hub)</option>
                      <option value="Kiambu">Kiambu County (Thika, Ruiru, Kikuyu)</option>
                      <option value="Machakos">Machakos County (Mlolongo, Syokimau, Athi River)</option>
                      <option value="Kajiado">Kajiado County (Kitengela, Ongata Rongai, Ngong)</option>
                    </optgroup>
                    <optgroup label="Regional Hubs (Phased Dispatch)">
                      {KENYA_COUNTIES.filter(c => !['Nairobi', 'Kiambu', 'Machakos', 'Kajiado'].includes(c)).map(c => (
                        <option key={c} value={c}>{c} County</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Town / Sub-County *
                  </label>
                  <input
                    type="text"
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    placeholder="e.g. Kitengela, Westlands, Kilimani, Ruiru"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  />
                </div>
              </div>

              {/* Area & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Specific Area / Neighborhood / Landmark
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Acacia Estate, Near Deliverance Church"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    GPS Coordinates / Pin (Optional)
                  </label>
                  <input
                    type="text"
                    value={gpsCoords}
                    onChange={(e) => setGpsCoords(e.target.value)}
                    placeholder="-1.2921, 36.8219"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Detailed Directions / Access Notes
                </label>
                <textarea
                  rows={2}
                  value={exactAddress}
                  onChange={(e) => setExactAddress(e.target.value)}
                  placeholder="e.g. Off Namanga Highway, take second left after Shell petrol station, black gate opposite borehole."
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Local Contact on Ground & Anti-Collusion Protection */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    On-Ground Access Contact (Foreman, Caretaker, or Seller)
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Masked by HQ Dispatch
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Peter Kariuki"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Role / Relationship
                    </label>
                    <input
                      type="text"
                      value={contactRole}
                      onChange={(e) => setContactRole(e.target.value)}
                      placeholder="e.g. Site Foreman, Land Seller"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Kenyan Phone Number
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+254 722 000 000"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Anti-collusion protocol: Your personal email and phone number are strictly concealed from local ground personnel. DiasporaVerify contacts this individual solely to coordinate physical gate access.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Category-Specific Structured Brief */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 3: Structured Task Brief & Specifications</h2>
                <p className="text-xs text-slate-500 mt-0.5">Category-specific questions to ensure clear objectives and objective evidence.</p>
              </div>

              {/* Projects & Assets: Construction Brief */}
              {category === 'construction' && (
                <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
                    <Building className="w-4 h-4 text-emerald-600" />
                    <span>Construction Milestone Inspection Checklist</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Current Milestone Under Review
                      </label>
                      <input
                        type="text"
                        value={milestoneStage}
                        onChange={(e) => setMilestoneStage(e.target.value)}
                        placeholder="e.g. First Floor Lintel Ring Beam & Slab Preparation"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Structure Type
                      </label>
                      <input
                        type="text"
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        placeholder="e.g. 4-Bedroom Residential Villa"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Materials Verification Count (Stop-Payment Safeguard)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] text-slate-600">Cement Bags Billed by Contractor:</span>
                        <input
                          type="number"
                          value={cementBagsBilled}
                          onChange={(e) => setCementBagsBilled(e.target.value)}
                          placeholder="100"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white mt-1 text-xs"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-4">
                        <input
                          type="checkbox"
                          checked={rebarSteelCheck}
                          onChange={(e) => setRebarSteelCheck(e.target.checked)}
                          id="rebarCheck"
                          className="rounded text-emerald-600"
                        />
                        <label htmlFor="rebarCheck" className="text-slate-700 font-medium cursor-pointer">
                          Inspect steel rebar tie-ins & structural spacing
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Projects & Assets: Property & Land Plot */}
              {category === 'property' && (
                <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>Land Parcel & Demarcation Checklist</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Plot / Parcel Designation
                      </label>
                      <input
                        type="text"
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        placeholder="e.g. 50x100 Residential Plot / 5 Acres Agricultural"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Title Deed / Registry Reference (Optional)
                      </label>
                      <input
                        type="text"
                        value={titleDeedRef}
                        onChange={(e) => setTitleDeedRef(e.target.value)}
                        placeholder="e.g. KAJIADO/KITENGELA/4829"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <label className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={beaconSearchRequested}
                        onChange={(e) => setBeaconSearchRequested(e.target.checked)}
                        className="rounded text-emerald-600"
                      />
                      <span>Locate 4 concrete beacons</span>
                    </label>
                    <label className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={fenceCheckRequested}
                        onChange={(e) => setFenceCheckRequested(e.target.checked)}
                        className="rounded text-emerald-600"
                      />
                      <span>Verify boundary fence/wall</span>
                    </label>
                    <label className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={occupancyCheckRequested}
                        onChange={(e) => setOccupancyCheckRequested(e.target.checked)}
                        className="rounded text-emerald-600"
                      />
                      <span>Check unauthorized squatters</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Purchases & Vehicles: Motor Vehicle Inspection */}
              {category === 'vehicle' && (
                <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
                    <Car className="w-4 h-4 text-amber-600" />
                    <span>Vehicle Pre-Purchase Diagnostic Brief</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Vehicle Make, Model & Year
                      </label>
                      <input
                        type="text"
                        value={vehicleMakeModel}
                        onChange={(e) => setVehicleMakeModel(e.target.value)}
                        placeholder="e.g. Toyota Prado TX 2018"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Chassis / VIN Number
                      </label>
                      <input
                        type="text"
                        value={vinNumber}
                        onChange={(e) => setVinNumber(e.target.value)}
                        placeholder="e.g. KDJ150-004829"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Dealership / Yard Location
                      </label>
                      <input
                        type="text"
                        value={dealershipLocation}
                        onChange={(e) => setDealershipLocation(e.target.value)}
                        placeholder="e.g. Kiambu Road Auto Yard"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    <label className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={paintGaugeRequested}
                        onChange={(e) => setPaintGaugeRequested(e.target.checked)}
                        className="rounded text-emerald-600"
                      />
                      <span>Paint depth gauge</span>
                    </label>
                    <label className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={odometerCheckRequested}
                        onChange={(e) => setOdometerCheckRequested(e.target.checked)}
                        className="rounded text-emerald-600"
                      />
                      <span>Odometer verification</span>
                    </label>
                    <label className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={obdScanRequested}
                        onChange={(e) => setObdScanRequested(e.target.checked)}
                        className="rounded text-emerald-600"
                      />
                      <span>OBD-II computer scan</span>
                    </label>
                    <label className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={testDriveAuthorized}
                        onChange={(e) => setTestDriveAuthorized(e.target.checked)}
                        className="rounded text-emerald-600"
                      />
                      <span>Seller test-drive auth</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Purchases & Equipment */}
              {category === 'purchase' && (
                <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>Machinery & Commercial Goods Verification</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Equipment / Item Name
                      </label>
                      <input
                        type="text"
                        value={purchaseItemName}
                        onChange={(e) => setPurchaseItemName(e.target.value)}
                        placeholder="e.g. 50kVA Perkins Diesel Generator or Solar Inverter Set"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Supplier / Vendor Name
                      </label>
                      <input
                        type="text"
                        value={supplierName}
                        onChange={(e) => setSupplierName(e.target.value)}
                        placeholder="e.g. Industrial Area Machinery Ltd"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <label className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={functionalTestRequested}
                      onChange={(e) => setFunctionalTestRequested(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span>Witness live power-on test & observe operational output gauges</span>
                  </label>
                </div>
              )}

              {/* Business Support */}
              {category === 'business' && (
                <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span>Commercial Due Diligence & Storefront Audit</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Registered Business Trading Name
                      </label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Apex Hardware & Construction Supplies"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Commercial Premises / Suite
                      </label>
                      <input
                        type="text"
                        value={storefrontAddress}
                        onChange={(e) => setStorefrontAddress(e.target.value)}
                        placeholder="e.g. Ground Floor, Westlands Plaza, Stall 4B"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <label className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inventoryCountRequested}
                        onChange={(e) => setInventoryCountRequested(e.target.checked)}
                        className="rounded text-emerald-600"
                      />
                      <span>Physical stock count sample</span>
                    </label>
                    <label className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={permitCheckRequested}
                        onChange={(e) => setPermitCheckRequested(e.target.checked)}
                        className="rounded text-emerald-600"
                      />
                      <span>Single business permit check</span>
                    </label>
                    <label className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={staffCheckRequested}
                        onChange={(e) => setStaffCheckRequested(e.target.checked)}
                        className="rounded text-emerald-600"
                      />
                      <span>Staff count & open trade check</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Family Support (Preserving Rule 13 Safeguarding Invariant) */}
              {(category === 'family' || category === 'person') && (
                <div className="space-y-4 p-5 rounded-2xl bg-rose-50/60 border border-rose-200 text-xs">
                  <div className="font-bold text-sm text-rose-950 border-b border-rose-200 pb-2 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-600" />
                    <span>Family Welfare Safeguarding & Consent Brief</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-rose-950 uppercase tracking-wider mb-1">
                        Care Recipient Name *
                      </label>
                      <input
                        type="text"
                        value={personName}
                        onChange={(e) => setPersonName(e.target.value)}
                        placeholder="e.g. Mama Grace Wambui"
                        className="w-full px-3 py-2 rounded-xl border border-rose-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-rose-950 uppercase tracking-wider mb-1">
                        Relationship to Client
                      </label>
                      <input
                        type="text"
                        value={familyRelationship}
                        onChange={(e) => setFamilyRelationship(e.target.value)}
                        placeholder="e.g. Mother, Grandparent, Relative"
                        className="w-full px-3 py-2 rounded-xl border border-rose-300 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-rose-950 uppercase tracking-wider mb-1">
                      Observation Focus
                    </label>
                    <input
                      type="text"
                      value={wellnessFocus}
                      onChange={(e) => setWellnessFocus(e.target.value)}
                      placeholder="e.g. Living conditions, compound safety, physical comfort, clinic accompaniment"
                      className="w-full px-3 py-2 rounded-xl border border-rose-300 bg-white"
                    />
                  </div>

                  {/* Mandatory Safeguarding Invariant Requirements (Rule 13) */}
                  <div className="p-4 rounded-xl bg-white border border-rose-200 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={familyConsentConfirmed}
                        onChange={(e) => setFamilyConsentConfirmed(e.target.checked)}
                        id="familyConsentConfirmed"
                        className="rounded text-rose-600 mt-0.5"
                      />
                      <label htmlFor="familyConsentConfirmed" className="text-rose-950 font-bold leading-snug cursor-pointer">
                        Care Recipient Consent: Family Welfare requests require explicit confirmation of care recipient consent or legal guardian authority.
                      </label>
                    </div>

                    <div>
                      <label className="block font-bold text-rose-950 mb-1">
                        Kenyan Emergency Contact *
                      </label>
                      <input
                        type="text"
                        value={familyEmergencyContact}
                        onChange={(e) => setFamilyEmergencyContact(e.target.value)}
                        placeholder="Please provide a named emergency contact and phone number in Kenya (e.g. Dr. Kamau, +254 722 111 222)"
                        className="w-full px-3 py-2 rounded-xl border border-rose-300 bg-rose-50/30 text-rose-950"
                      />
                    </div>

                    <p className="text-[11px] text-slate-500 italic">
                      Notice: DiasporaVerify verifiers are polite observers. We do not provide clinical emergency rescue or distribute unmonitored cash disbursements.
                    </p>
                  </div>
                </div>
              )}

              {/* Custom Requests & Documents */}
              {(category === 'document' || category === 'custom' || category === 'field_assistance') && (
                <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-purple-600" />
                    <span>Official Registry Search & Custom Mission Brief</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Institution / Office to Visit
                      </label>
                      <input
                        type="text"
                        value={issuingInstitution}
                        onChange={(e) => setIssuingInstitution(e.target.value)}
                        placeholder="e.g. Ministry of Lands (Ardhi House), Sheria House"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Document / Record Type
                      </label>
                      <input
                        type="text"
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                        placeholder="e.g. Title Deed Green Card, Official Search, Business Certificate"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      File / Parcel / Tracking Number
                    </label>
                    <input
                      type="text"
                      value={registryFileNumber}
                      onChange={(e) => setRegistryFileNumber(e.target.value)}
                      placeholder="e.g. NAIROBI/BLOCK 82/104"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono"
                    />
                  </div>

                  {(category === 'field_assistance' || category === 'custom') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Specific Office or Venue to Visit
                        </label>
                        <input
                          type="text"
                          value={officeToVisit}
                          onChange={(e) => setOfficeToVisit(e.target.value)}
                          placeholder="e.g. County Planning Office or Supplier Warehouse"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Errand Objective / Description
                        </label>
                        <input
                          type="text"
                          value={errandDescription}
                          onChange={(e) => setErrandDescription(e.target.value)}
                          placeholder="e.g. Inquire on approval status of building plan"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* STEP 4: Evidence Required Selection */}
          {step === 4 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 4: Select required evidence deliverables</h2>
                <p className="text-xs text-slate-500 mt-0.5">Which verified proof formats must be captured and logged in your report dossier?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {evidenceOptions.map((ev) => {
                  const isChecked = evidenceRequested.includes(ev.id);
                  return (
                    <div
                      key={ev.id}
                      onClick={() => toggleEvidence(ev.id)}
                      className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        isChecked 
                          ? 'border-emerald-600 bg-emerald-50/40 shadow-2xs ring-1 ring-emerald-500/20' 
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="mt-0.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by parent onClick
                          className="rounded text-emerald-600"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          {ev.icon}
                          <span className="font-bold text-xs text-slate-900">{ev.label}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">{ev.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>All evidence items are stamped with GPS hardware coordinates and tamper-evident SHA-256 hashes.</span>
                <span className="font-mono text-[10px] text-emerald-700 font-bold shrink-0">
                  Cryptographic Standard
                </span>
              </div>
            </div>
          )}

          {/* STEP 5: Urgency & Timing */}
          {step === 5 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 5: When do you need this verified?</h2>
                <p className="text-xs text-slate-500 mt-0.5">Choose your desired turnaround window. Urgency surcharges are clearly itemized.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {[
                  {
                    id: 'standard',
                    label: 'Standard',
                    timeframe: '3 to 5 business days',
                    multiplier: 'Base Fee',
                    desc: 'Regular scheduled inspection queue. Optimal route coordination.',
                    color: 'border-slate-200 hover:border-slate-300'
                  },
                  {
                    id: 'priority',
                    label: 'Priority',
                    timeframe: '24 to 48 hours',
                    multiplier: '+20% Service Surcharge',
                    desc: 'Prioritized verifier assignment with fast-track report review.',
                    color: 'border-blue-300 bg-blue-50/30'
                  },
                  {
                    id: 'urgent',
                    label: 'Urgent',
                    timeframe: 'Within 24 hours / Same-Day',
                    multiplier: '+40% Service Surcharge',
                    desc: 'Emergency queue with dedicated verifier dispatched immediately.',
                    color: 'border-amber-400 bg-amber-50/40'
                  }
                ].map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setUrgency(u.id as any)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      urgency === u.id
                        ? 'border-emerald-600 bg-emerald-50 shadow-sm ring-2 ring-emerald-500/20'
                        : `${u.color} hover:bg-slate-50`
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-slate-900">{u.label}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                        {u.multiplier}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-emerald-700 mb-1">{u.timeframe}</div>
                    <p className="text-xs text-slate-500 leading-snug">{u.desc}</p>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target Preferred Visit Date (Optional)
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500">Estimated Total for {urgency.toUpperCase()} delivery in {county}:</span>
                  <div className="text-xl font-bold font-display text-slate-900 mt-0.5">
                    {FORMAT_CURRENCY(feeBreakdown.totalKES, currency)}
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  Includes base fee, field operations, travel logistics & urgency
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Additional Instructions, Attachments & Boundaries */}
          {step === 6 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 6: Additional instructions & supporting documents</h2>
                <p className="text-xs text-slate-500 mt-0.5">Add specific questions for the agent and upload drawings, bills of quantities, or invoices.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Specific Instructions / Questions for the Verifier *
                </label>
                <textarea
                  rows={4}
                  value={scopeBrief}
                  onChange={(e) => setScopeBrief(e.target.value)}
                  placeholder="e.g. Please verify whether the neighbor's wall encroaches on our boundary beacon, check if the delivered cement matches brand Portland 42.5R, and photograph the roof truss joist tie-ins."
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Supporting Document Uploads */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Attach Documents / Architectural Drawings / Supplier Invoices
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-slate-50 transition cursor-pointer relative">
                  <input
                    type="file"
                    onChange={handleSimulateUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-slate-700">Click or drag files to upload</span>
                  <p className="text-[11px] text-slate-400">PDF, PNG, JPG, or DOCX up to 25MB</p>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {uploadedFiles.map((f, i) => (
                      <div key={i} className="text-xs bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl flex items-center justify-between text-slate-700">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{f.name} ({f.sizeKb} KB)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-600 font-bold text-[10px]">Ready</span>
                          <button
                            type="button"
                            onClick={() => removeUploadedFile(i)}
                            className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Service Boundaries Agreement */}
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Service Boundaries & Independence Doctrine</span>
                </div>
                <p className="text-[11px] text-amber-900/80 leading-relaxed">
                  DiasporaVerify provides independent observation and factual evidence collection. A photograph proves what it shows, not legal ownership or engineering structural strength. DiasporaVerify does not hold contractor funds in escrow.
                </p>
                <label className="flex items-center gap-2 font-bold text-amber-950 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToBoundaries}
                    onChange={(e) => setAgreedToBoundaries(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>I acknowledge the service boundaries and authorize DiasporaVerify ground deployment.</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 7: Official Quote Dossier Review & Submission */}
          {step === 7 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 7: Official Quote Dossier & Acceptance</h2>
                <p className="text-xs text-slate-500 mt-0.5">Review your itemized quote before confirming ground deployment.</p>
              </div>

              {/* Official Quote Dossier Card */}
              <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 space-y-6 text-xs">
                
                {/* Dossier Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      OFFICIAL QUOTE DOSSIER
                    </span>
                    <h3 className="text-lg font-bold font-display text-slate-900 mt-1">
                      {title}
                    </h3>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Quote Ref: <strong className="text-slate-800 font-mono">QUO-2026-NBI-{quoteId}</strong> · Valid for 14 Days
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition text-xs font-semibold cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Quote</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition text-xs font-semibold cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Save Draft</span>
                    </button>
                  </div>
                </div>

                {/* Mission Scope & Location Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Pillar</span>
                    <div className="font-bold text-slate-900">{currentPillarDef.title}</div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Location</span>
                    <div className="font-bold text-slate-900">{town || county}, {county}</div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Urgency</span>
                    <div className="font-bold text-slate-900 capitalize">{urgency} ({urgency === 'urgent' ? '24h' : urgency === 'priority' ? '48h' : '3-5 days'})</div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Model</span>
                    <div className="font-bold text-slate-900 capitalize">{offerType.replace('-', ' ')}</div>
                  </div>
                </div>

                {/* Evidence Checklist Deliverables */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Contracted Evidence Deliverables:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {evidenceRequested.map((ev, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-medium">
                        ✓ {ev}
                      </span>
                    ))}
                  </div>
                </div>

                {/* On Ground Contact Preview */}
                {contactName && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">On-Ground Access Contact:</span>
                    <div className="font-medium text-slate-800 mt-0.5">{contactName} ({contactRole}) — {contactPhone}</div>
                  </div>
                )}

                {/* Transparent Fee Breakdown Table with Currency Selector */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden text-xs">
                  <div className="bg-slate-900 text-white px-4 py-2.5 font-bold uppercase tracking-wider text-[11px] flex items-center justify-between">
                    <span>Transparent Fee Breakdown</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-400 uppercase font-mono mr-1">Currency:</span>
                      {(['KES', 'USD', 'GBP', 'EUR'] as CurrencyCode[]).map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setCurrency(c)}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer transition ${
                            currency === c ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100 p-4 space-y-2">
                    <div className="flex justify-between text-slate-600">
                      <span>Base Service Intake & Mission Scoping</span>
                      <span className="font-semibold">{FORMAT_CURRENCY(feeBreakdown.serviceBaseFeeKES, currency)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 pt-1.5">
                      <span>Field Operations & Telemetry Equipment Allowance</span>
                      <span className="font-semibold">{FORMAT_CURRENCY(feeBreakdown.fieldOperationsFeeKES, currency)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 pt-1.5">
                      <span>{county} County Logistics & Ground Travel Fee</span>
                      <span className="font-semibold">{FORMAT_CURRENCY(feeBreakdown.countyTravelFeeKES, currency)}</span>
                    </div>
                    {feeBreakdown.urgencyFeeKES > 0 && (
                      <div className="flex justify-between text-amber-700 pt-1.5">
                        <span>Urgency Priority Surcharge ({urgency})</span>
                        <span className="font-bold">{FORMAT_CURRENCY(feeBreakdown.urgencyFeeKES, currency)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-600 pt-1.5">
                      <span>Platform Cryptographic Storage & QA Review</span>
                      <span className="font-semibold">{FORMAT_CURRENCY(feeBreakdown.platformFeeKES, currency)}</span>
                    </div>
                    <div className="flex justify-between text-slate-900 pt-3 border-t-2 border-slate-900 font-bold text-sm">
                      <span>Total Service Fee Quote</span>
                      <span className="text-base text-emerald-700">{FORMAT_CURRENCY(feeBreakdown.totalKES, currency)}</span>
                    </div>
                  </div>
                </div>

                {/* Financial Separation Guarantee */}
                <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                  <strong>Strict Financial Separation:</strong> DiasporaVerify fees cover independent verification and dossier curation only. We never disburse purchase funds to third-party sellers or contractors.
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-slate-950 font-bold text-base shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Accept Quote & Confirm Request</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </button>
                <p className="text-[11px] text-center text-slate-400">
                  {isAuthenticated 
                    ? 'Authenticated as client · Reference and dispatch tracking will activate immediately.' 
                    : 'You will be prompted to create your client account to track the dispatched verifier.'}
                </p>
              </div>
            </div>
          )}

          {/* Navigation Control Buttons */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(prev => prev - 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 7 && (
              <button
                type="button"
                onClick={() => {
                  if (step === 2 && !town.trim()) {
                    alert('Please enter the town or area name in Kenya.');
                    return;
                  }
                  setStep(prev => prev + 1);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>Continue to Step {step + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};
