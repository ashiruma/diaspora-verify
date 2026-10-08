import React, { useState } from 'react';
import { useVerification } from '../../context/VerificationContext';
import { 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  Lock,
  Building,
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
  AlertTriangle
} from '../Icons';
import type { ServiceCategory, ServiceOfferModel } from '../../types';
import { KENYA_COUNTIES, FORMAT_CURRENCY } from '../../data/mockData';
import { calculateFeeBreakdown } from '../../services/paymentService';

interface NewRequestWizardProps {
  onSuccess: (newId: string) => void;
  onCancel: () => void;
}

export const NewRequestWizard: React.FC<NewRequestWizardProps> = ({ onSuccess, onCancel }) => {
  const { createRequest, currency } = useVerification();

  const [step, setStep] = useState(1);

  // Step 1: Category & Task
  const [category, setCategory] = useState<ServiceCategory>('property');
  const [offerType, setOfferType] = useState<ServiceOfferModel>('one-time');
  const [title, setTitle] = useState('');

  // Step 2: Location
  const [county, setCounty] = useState('Kajiado');
  const [town, setTown] = useState('');
  const [area, setArea] = useState('');
  const [exactAddress, setExactAddress] = useState('');
  const [gpsCoords, setGpsCoords] = useState('-1.4892, 36.9583');

  // Step 3: Dynamic Category-Specific Questions
  // Property questions
  const [propertyType, setPropertyType] = useState('Land / Plot');
  const [beaconSearchRequested, setBeaconSearchRequested] = useState(true);
  const [fenceCheckRequested, setFenceCheckRequested] = useState(true);
  const [occupancyCheckRequested, setOccupancyCheckRequested] = useState(true);
  const [titleDeedRef, setTitleDeedRef] = useState('');

  // Business questions
  const [businessName, setBusinessName] = useState('');
  const [inventoryCountRequested, setInventoryCountRequested] = useState(true);
  const [permitCheckRequested, setPermitCheckRequested] = useState(true);
  const [staffCheckRequested, setStaffCheckRequested] = useState(true);

  // Vehicle questions
  const [vehicleMakeModel, setVehicleMakeModel] = useState('');
  const [vinNumber, setVinNumber] = useState('');
  const [paintGaugeRequested, setPaintGaugeRequested] = useState(true);
  const [odometerCheckRequested, setOdometerCheckRequested] = useState(true);

  // Document questions
  const [documentType, setDocumentType] = useState('Land Registry Green Card / Title Record');
  const [issuingInstitution, setIssuingInstitution] = useState('Ministry of Lands (Ardhi House)');
  const [registryFileNumber, setRegistryFileNumber] = useState('');

  // Person questions (Rule 13 Safeguarding Invariant)
  const [personName, setPersonName] = useState('');
  const [familyRelationship, setFamilyRelationship] = useState('Parent / Elder');
  const [familyConsentConfirmed, setFamilyConsentConfirmed] = useState(false);
  const [familyEmergencyContact, setFamilyEmergencyContact] = useState('');

  // Purchase questions
  const [purchaseItemName, setPurchaseItemName] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [functionalTestRequested, setFunctionalTestRequested] = useState(true);

  // Field assistance questions
  const [errandDescription, setErrandDescription] = useState('');
  const [officeToVisit, setOfficeToVisit] = useState('');

  // Step 4: Evidence Required Selection
  const [evidenceRequested, setEvidenceRequested] = useState<string[]>([
    'High-Resolution Photos',
    'GPS Telemetry Match',
    'Written Observations',
    'Video Walkthrough'
  ]);

  // Step 5: Urgency
  const [urgency, setUrgency] = useState<'standard' | 'priority' | 'urgent'>('standard');

  // Step 6: Additional Instructions & Attachments & Contact
  const [scopeBrief, setScopeBrief] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState('Site Representative / Seller');
  const [contactPhone, setContactPhone] = useState('+254 ');
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; sizeKb: number; type: string }[]>([]);
  const [agreedToBoundaries, setAgreedToBoundaries] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToBoundaries) {
      alert('Please acknowledge the service boundaries and independence doctrine to proceed.');
      return;
    }

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
    } else if (category === 'business') {
      detailedScope = `Business verification: ${businessName}. Inventory count: ${inventoryCountRequested ? 'Yes' : 'No'}. Permit check: ${permitCheckRequested ? 'Yes' : 'No'}. Staff check: ${staffCheckRequested ? 'Yes' : 'No'}. ${scopeBrief}`;
    } else if (category === 'vehicle') {
      detailedScope = `Vehicle inspection: ${vehicleMakeModel}. VIN: ${vinNumber || 'N/A'}. Paint gauge: ${paintGaugeRequested ? 'Yes' : 'No'}. Odometer: ${odometerCheckRequested ? 'Yes' : 'No'}. ${scopeBrief}`;
    } else if (category === 'document') {
      detailedScope = `Document inspection: ${documentType} at ${issuingInstitution}. File no: ${registryFileNumber || 'N/A'}. ${scopeBrief}`;
    } else if (category === 'purchase') {
      detailedScope = `Purchase verification: ${purchaseItemName} at ${supplierName}. Functional test: ${functionalTestRequested ? 'Yes' : 'No'}. ${scopeBrief}`;
    } else if (category === 'field_assistance') {
      detailedScope = `Field assistance: ${errandDescription} at ${officeToVisit}. ${scopeBrief}`;
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

    onSuccess(newId);
  };

  const categories = [
    { id: 'property', label: 'Property & Land', icon: <MapPin className="w-5 h-5 text-blue-600" />, desc: 'Land beacons, boundary fences, house condition, rentals' },
    { id: 'construction', label: 'Construction Oversight', icon: <Building className="w-5 h-5 text-emerald-600" />, desc: 'Milestone progress, materials count, rebar, slab casting' },
    { id: 'business', label: 'Business & Due Diligence', icon: <Briefcase className="w-5 h-5 text-purple-600" />, desc: 'Physical premises, stock counts, permits, operational check' },
    { id: 'vehicle', label: 'Vehicle Inspection', icon: <Car className="w-5 h-5 text-amber-600" />, desc: 'VIN match, paint depth gauge, chassis rust, test start' },
    { id: 'document', label: 'Document Verification', icon: <FileText className="w-5 h-5 text-indigo-600" />, desc: 'Physical registry check at Ardhi House, courts, ministries' },
    { id: 'person', label: 'Person & Welfare Support', icon: <Users className="w-5 h-5 text-rose-600" />, desc: 'Elderly welfare check, clinic accompaniment, reference check' },
    { id: 'purchase', label: 'Purchase & Machinery', icon: <DollarSign className="w-5 h-5 text-teal-600" />, desc: 'High-value equipment, solar generators, consignment inspection' },
    { id: 'field_assistance', label: 'General Field Assistance', icon: <Compass className="w-5 h-5 text-cyan-600" />, desc: 'Collect documents, attend meetings, physical errands' },
  ];

  const evidenceOptions = [
    { id: 'High-Resolution Photos', icon: <Camera className="w-4 h-4 text-emerald-600" />, label: 'High-Resolution Photos', desc: 'Calibrated timestamped photos of perimeter and key assets' },
    { id: 'Video Walkthrough', icon: <Video className="w-4 h-4 text-blue-600" />, label: 'Video Walkthrough', desc: 'Continuous video walkthrough with commentary' },
    { id: 'GPS Telemetry Match', icon: <MapPin className="w-4 h-4 text-amber-600" />, label: 'GPS / Location Match', desc: 'Hardware-verified GPS coordinates matching target coordinates' },
    { id: 'Document Inspections', icon: <FileText className="w-4 h-4 text-purple-600" />, label: 'Physical Documents', desc: 'Photograph official certificates, permits, or invoices on site' },
    { id: 'Interviews & Audio', icon: <Users className="w-4 h-4 text-cyan-600" />, label: 'Site Interviews', desc: 'Structured interviews with site contact, neighbor, or manager' },
    { id: 'Written Observations', icon: <FileText className="w-4 h-4 text-slate-600" />, label: 'Detailed Written Findings', desc: 'Objective factual observations separated from agent opinions' },
    { id: 'Multiple Angles', icon: <Camera className="w-4 h-4 text-indigo-600" />, label: 'Multiple Independent Angles', desc: 'Calibrated repeat camera angles for periodic milestone tracking' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl space-y-8">
        
        {/* Wizard Header */}
        <div className="border-b border-slate-100 pb-5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Step {step} of 7 • Verification Request Wizard
            </span>
            <button
              onClick={onCancel}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition"
            >
              Cancel
            </button>
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
            '7. Review'
          ].map((label, idx) => (
            <div 
              key={idx}
              className={`p-1.5 rounded-lg transition-colors ${
                step === idx + 1 
                  ? 'bg-emerald-600 text-white font-bold' 
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
          
          {/* STEP 1: What do you need verified? */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 1: What do you need verified?</h2>
                <p className="text-xs text-slate-500 mt-0.5">Select the primary service category for this verification mission.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id as ServiceCategory)}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
                      category === c.id
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-white shadow-xs border border-slate-200 flex-shrink-0">
                      {c.icon}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">{c.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{c.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Request Title / Short Reference (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`e.g. Kitengela Plot Beacon Check or Westlands Storefront Audit`}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Service Engagement Model
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'one-time', title: 'One-Time Verification', desc: 'Single discrete visit & definitive report' },
                    { id: 'follow-through', title: 'Follow-Through (2+ Visits)', desc: 'Multi-stage visit or purchase coordination' },
                    { id: 'ongoing-assistant', title: 'Recurring Monitoring', desc: 'Monthly or quarterly ongoing supervision' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setOfferType(m.id as ServiceOfferModel)}
                      className={`p-3 rounded-xl border text-left text-xs transition ${
                        offerType === m.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div className="font-bold text-slate-900">{m.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Where is it? */}
          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 2: Where is it?</h2>
                <p className="text-xs text-slate-500 mt-0.5">Provide geographical target in Kenya. Accurate location ensures vetted agent routing.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kenya County *
                  </label>
                  <select
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {KENYA_COUNTIES.map(c => (
                      <option key={c} value={c}>{c} County</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Town / Municipality / Ward *
                  </label>
                  <input
                    type="text"
                    required
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    placeholder="e.g. Kitengela, Westlands, Tigoni, Shimanzi"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Area / Neighborhood / Estate
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Acacia Crest, Sarit Centre vicinity, Bofa Beach"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Estimated GPS Coordinates (Optional)
                  </label>
                  <input
                    type="text"
                    value={gpsCoords}
                    onChange={(e) => setGpsCoords(e.target.value)}
                    placeholder="e.g. -1.4892, 36.9583"
                    className="w-full text-sm font-mono px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Exact Physical Directions & Landmarks *
                </label>
                <textarea
                  rows={2}
                  value={exactAddress}
                  onChange={(e) => setExactAddress(e.target.value)}
                  placeholder="e.g. 1.2km off Namanga Road at Acacia Junction, take red-gate feeder road, plot is on the left adjacent to yellow water tank."
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* STEP 3: What exactly should we verify? (Dynamic per category) */}
          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 3: What exactly should we verify?</h2>
                <p className="text-xs text-slate-500 mt-0.5">Dynamic criteria tailored strictly to {category.toUpperCase()} verification.</p>
              </div>

              {/* PROPERTY SPECIFIC QUESTIONS */}
              {category === 'property' && (
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-4 text-xs">
                  <div className="font-bold text-blue-900 text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>Property & Land Scope Protocol</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Property Type</label>
                      <select 
                        value={propertyType} 
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="Land / Plot">Vacant Land / Residential Plot</option>
                        <option value="Commercial Land">Commercial Plot / Highway Parcel</option>
                        <option value="House / Villa">Completed House / Villa</option>
                        <option value="Apartment">Apartment Block / Rental Unit</option>
                        <option value="Agricultural Farm">Agricultural Farm / Shamba</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Title Deed / Green Card Reference</label>
                      <input 
                        type="text" 
                        value={titleDeedRef} 
                        onChange={(e) => setTitleDeedRef(e.target.value)}
                        placeholder="e.g. KJD/KITENGELA/42910"
                        className="w-full p-2 rounded-lg border border-slate-300"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2 font-medium text-slate-800">
                      <input type="checkbox" checked={beaconSearchRequested} onChange={(e) => setBeaconSearchRequested(e.target.checked)} className="rounded text-emerald-600" />
                      <span>Physical beacon discovery (Locate 4 corner cadastral concrete markers)</span>
                    </label>
                    <label className="flex items-center gap-2 font-medium text-slate-800">
                      <input type="checkbox" checked={fenceCheckRequested} onChange={(e) => setFenceCheckRequested(e.target.checked)} className="rounded text-emerald-600" />
                      <span>Boundary fence inspection & encroachment check</span>
                    </label>
                    <label className="flex items-center gap-2 font-medium text-slate-800">
                      <input type="checkbox" checked={occupancyCheckRequested} onChange={(e) => setOccupancyCheckRequested(e.target.checked)} className="rounded text-emerald-600" />
                      <span>Occupancy verification & neighbor inquiry on ownership disputes</span>
                    </label>
                  </div>
                </div>
              )}

              {/* CONSTRUCTION SPECIFIC QUESTIONS */}
              {category === 'construction' && (
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-4 text-xs">
                  <div className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                    <Building className="w-4 h-4 text-emerald-600" />
                    <span>Construction Milestone Oversight Protocol</span>
                  </div>
                  <p className="text-slate-600">
                    We compare physical site progress against billed milestone invoices and reconcile on-site materials.
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 font-medium text-slate-800">
                      <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                      <span>Physical percentage completion assessment vs milestone claim</span>
                    </label>
                    <label className="flex items-center gap-2 font-medium text-slate-800">
                      <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                      <span>Physical store inventory count (Cement bags, rebar bundles, timber)</span>
                    </label>
                    <label className="flex items-center gap-2 font-medium text-slate-800">
                      <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                      <span>Repeat-angle photographs for side-by-side progression tracking</span>
                    </label>
                    <label className="flex items-center gap-2 font-medium text-slate-800">
                      <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                      <span>Site foreman audio interview regarding timeline and subcontractor wages</span>
                    </label>
                  </div>
                </div>
              )}

              {/* BUSINESS SPECIFIC QUESTIONS */}
              {category === 'business' && (
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-4 text-xs">
                  <div className="font-bold text-purple-900 text-sm flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-purple-600" />
                    <span>Business Due Diligence Protocol</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Business Name to Verify</label>
                      <input 
                        type="text" 
                        value={businessName} 
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Apex Agrovet Supplies Ltd"
                        className="w-full p-2 rounded-lg border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Premises Type</label>
                      <select className="w-full p-2 rounded-lg border border-slate-300 bg-white">
                        <option>Retail Storefront / Shop</option>
                        <option>Warehouse / Distribution Hub</option>
                        <option>Office Suite / Corporate Premises</option>
                        <option>Industrial Manufacturing Yard</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2 font-medium text-slate-800">
                      <input type="checkbox" checked={inventoryCountRequested} onChange={(e) => setInventoryCountRequested(e.target.checked)} className="rounded text-purple-600" />
                      <span>Audit physical inventory stock on shelves / in warehouse</span>
                    </label>
                    <label className="flex items-center gap-2 font-medium text-slate-800">
                      <input type="checkbox" checked={permitCheckRequested} onChange={(e) => setPermitCheckRequested(e.target.checked)} className="rounded text-purple-600" />
                      <span>Verify displayed County Business Permit & KRA Tax Compliance Certificate</span>
                    </label>
                    <label className="flex items-center gap-2 font-medium text-slate-800">
                      <input type="checkbox" checked={staffCheckRequested} onChange={(e) => setStaffCheckRequested(e.target.checked)} className="rounded text-purple-600" />
                      <span>Document staff presence and observe customer foot traffic</span>
                    </label>
                  </div>
                </div>
              )}

              {/* VEHICLE SPECIFIC QUESTIONS */}
              {category === 'vehicle' && (
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-4 text-xs">
                  <div className="font-bold text-amber-900 text-sm flex items-center gap-2">
                    <Car className="w-4 h-4 text-amber-600" />
                    <span>Automotive Pre-Purchase Inspection Protocol</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Make, Model & Year</label>
                      <input 
                        type="text" 
                        value={vehicleMakeModel} 
                        onChange={(e) => setVehicleMakeModel(e.target.value)}
                        placeholder="e.g. 2018 Toyota Land Cruiser Prado TX-L"
                        className="w-full p-2 rounded-lg border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Chassis / VIN Number</label>
                      <input 
                        type="text" 
                        value={vinNumber} 
                        onChange={(e) => setVinNumber(e.target.value)}
                        placeholder="e.g. GDJ150-0042918"
                        className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2 font-medium text-slate-800">
                      <input type="checkbox" checked={paintGaugeRequested} onChange={(e) => setPaintGaugeRequested(e.target.checked)} className="rounded text-amber-600" />
                      <span>Digital paint gauge thickness scan (Detect repaired collision body filler)</span>
                    </label>
                    <label className="flex items-center gap-2 font-medium text-slate-800">
                      <input type="checkbox" checked={odometerCheckRequested} onChange={(e) => setOdometerCheckRequested(e.target.checked)} className="rounded text-amber-600" />
                      <span>Odometer reading check and dashboard warning lights verification</span>
                    </label>
                    <label className="flex items-center gap-2 font-medium text-slate-800">
                      <input type="checkbox" defaultChecked className="rounded text-amber-600" />
                      <span>Engine cold-start smoke check and 4WD transfer case test</span>
                    </label>
                  </div>
                </div>
              )}

              {/* DOCUMENT SPECIFIC QUESTIONS */}
              {category === 'document' && (
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-4 text-xs">
                  <div className="font-bold text-indigo-900 text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>Physical Document Inspection Protocol</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Document Description</label>
                      <input 
                        type="text" 
                        value={documentType} 
                        onChange={(e) => setDocumentType(e.target.value)}
                        placeholder="e.g. Land Registry Green Card copy"
                        className="w-full p-2 rounded-lg border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Institution to Visit</label>
                      <input 
                        type="text" 
                        value={issuingInstitution} 
                        onChange={(e) => setIssuingInstitution(e.target.value)}
                        placeholder="e.g. Ardhi House, High Court, Nairobi City County"
                        className="w-full p-2 rounded-lg border border-slate-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Registry Index / Case / Parcel Reference</label>
                    <input 
                      type="text" 
                      value={registryFileNumber} 
                      onChange={(e) => setRegistryFileNumber(e.target.value)}
                      placeholder="e.g. NBI/BLOCK-82/104"
                      className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* PERSON / FAMILY SPECIFIC QUESTIONS (RULE 13 SAFEGUARDING) */}
              {(category === 'family' || category === 'person') && (
                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-4 text-xs">
                  <div className="font-bold text-rose-900 text-sm flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-600" />
                    <span>Family Care & Welfare Safeguarding Protocol</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Subject / Relative Full Name *</label>
                      <input 
                        type="text" 
                        value={personName} 
                        onChange={(e) => setPersonName(e.target.value)}
                        placeholder="e.g. Mary Jepkemboi Kiprop"
                        className="w-full p-2 rounded-lg border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Your Relationship to Subject</label>
                      <input 
                        type="text" 
                        value={familyRelationship} 
                        onChange={(e) => setFamilyRelationship(e.target.value)}
                        placeholder="e.g. Son / Daughter, Legal Guardian"
                        className="w-full p-2 rounded-lg border border-slate-300"
                      />
                    </div>
                  </div>
                  
                  {/* Rule 13 Exact Invariant Block */}
                  <div className="p-3.5 rounded-xl bg-white border-2 border-rose-300 space-y-2">
                    <div className="font-bold text-rose-950 uppercase tracking-wider text-[11px]">
                      Mandatory Recipient Consent & Emergency Safeguarding
                    </div>
                    <label className="flex items-start gap-2 text-rose-900 font-medium">
                      <input 
                        type="checkbox" 
                        checked={familyConsentConfirmed} 
                        onChange={(e) => setFamilyConsentConfirmed(e.target.checked)} 
                        className="mt-0.5 rounded text-rose-600" 
                      />
                      <span>
                        Family Welfare requests require explicit confirmation of care recipient consent or legal guardian authority. I certify that the recipient or their authorized caregiver has given informed consent for this visit.
                      </span>
                    </label>
                    <div className="pt-1">
                      <label className="block font-bold text-rose-900 mb-1">
                        Named emergency contact in Kenya (Name & Phone) *
                      </label>
                      <input 
                        type="text" 
                        value={familyEmergencyContact} 
                        onChange={(e) => setFamilyEmergencyContact(e.target.value)}
                        placeholder="e.g. Dr. Janet Rotich (+254 722 000 000)"
                        className="w-full p-2 rounded-lg border border-rose-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PURCHASE SPECIFIC QUESTIONS */}
              {category === 'purchase' && (
                <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200 space-y-4 text-xs">
                  <div className="font-bold text-teal-900 text-sm flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-teal-600" />
                    <span>Purchase & Asset Inspection Protocol</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Item / Machinery Description</label>
                      <input 
                        type="text" 
                        value={purchaseItemName} 
                        onChange={(e) => setPurchaseItemName(e.target.value)}
                        placeholder="e.g. 50kVA Perkins Diesel Generator"
                        className="w-full p-2 rounded-lg border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Supplier / Vendor Name</label>
                      <input 
                        type="text" 
                        value={supplierName} 
                        onChange={(e) => setSupplierName(e.target.value)}
                        placeholder="e.g. PowerGen Industrial Kenya Ltd"
                        className="w-full p-2 rounded-lg border border-slate-300"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 font-medium text-slate-800">
                    <input type="checkbox" checked={functionalTestRequested} onChange={(e) => setFunctionalTestRequested(e.target.checked)} className="rounded text-teal-600" />
                    <span>Test power-on and functional status before disbursement</span>
                  </label>
                </div>
              )}

              {/* FIELD ASSISTANCE SPECIFIC QUESTIONS */}
              {category === 'field_assistance' && (
                <div className="p-4 rounded-2xl bg-cyan-50/50 border border-cyan-200 space-y-4 text-xs">
                  <div className="font-bold text-cyan-900 text-sm flex items-center gap-2">
                    <Compass className="w-4 h-4 text-cyan-600" />
                    <span>General Field Assistance Protocol</span>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Office / Institution / Location to Visit</label>
                    <input 
                      type="text" 
                      value={officeToVisit} 
                      onChange={(e) => setOfficeToVisit(e.target.value)}
                      placeholder="e.g. High Court Probate Registry, Milimani Law Courts"
                      className="w-full p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Errand / Task Execution Brief</label>
                    <textarea 
                      rows={2}
                      value={errandDescription} 
                      onChange={(e) => setErrandDescription(e.target.value)}
                      placeholder="e.g. Collect certified copies of probate cause grant letters, check filing date in court diary, obtain official receipt."
                      className="w-full p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Evidence Required */}
          {step === 4 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 4: Evidence required</h2>
                <p className="text-xs text-slate-500 mt-0.5">Select every evidence format our field agent must capture on the ground.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {evidenceOptions.map((ev) => {
                  const isSelected = evidenceRequested.includes(ev.id);
                  return (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => toggleEvidence(ev.id)}
                      className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                        isSelected 
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20' 
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="mt-0.5 p-1.5 rounded-lg bg-white border border-slate-200 flex-shrink-0">
                        {ev.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">{ev.label}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            {isSelected ? '✓ Selected' : '+ Add'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{ev.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  All captured evidence is cryptographically fingerprinted using <strong>SHA-256 digests</strong> to prevent post-capture tampering.
                </span>
              </div>
            </div>
          )}

          {/* STEP 5: Urgency */}
          {step === 5 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 5: Urgency & Scheduling</h2>
                <p className="text-xs text-slate-500 mt-0.5">Choose deployment speed. Urgent requests activate rapid field responder dispatch.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {[
                  {
                    id: 'standard',
                    label: 'Standard',
                    timeframe: '3 to 5 business days',
                    multiplier: 'Standard Rate',
                    desc: 'Regular scheduled inspection during next route cycle.',
                    color: 'border-slate-200 hover:border-slate-300'
                  },
                  {
                    id: 'priority',
                    label: 'Priority',
                    timeframe: '48 to 72 hours',
                    multiplier: '+20% Service Fee',
                    desc: 'Priority queueing and scheduled within 48 hours.',
                    color: 'border-blue-300 bg-blue-50/30'
                  },
                  {
                    id: 'urgent',
                    label: 'Urgent',
                    timeframe: 'Within 24 to 36 hours',
                    multiplier: '+40% Service Fee',
                    desc: 'Immediate dedicated agent dispatch to site.',
                    color: 'border-amber-400 bg-amber-50/40'
                  }
                ].map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setUrgency(u.id as any)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
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

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500">Estimated Total for {urgency.toUpperCase()} delivery in {county}:</span>
                  <div className="text-xl font-bold font-display text-slate-900 mt-0.5">
                    {FORMAT_CURRENCY(feeBreakdown.totalKES, currency)}
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  Includes base fee, field operations, travel, & urgency
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Additional Instructions & Attachments */}
          {step === 6 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 6: Additional instructions & Local contact</h2>
                <p className="text-xs text-slate-500 mt-0.5">Specific questions for the agent and details of the person on the ground.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Specific Instructions / Questions for the Verifier *
                </label>
                <textarea
                  rows={4}
                  value={scopeBrief}
                  onChange={(e) => setScopeBrief(e.target.value)}
                  placeholder="e.g. Please check if the neighbor's wall encroaches on our boundary beacon, ask the caretaker who holds the key to the main meter box, and take a photo of the adjacent road drainage."
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Local Contact on Ground */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Contact Name on Ground
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Peter Kariuki (Foreman)"
                    className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Their Role
                  </label>
                  <input
                    type="text"
                    value={contactRole}
                    onChange={(e) => setContactRole(e.target.value)}
                    placeholder="e.g. Plot Seller, Caretaker, Nurse"
                    className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Their Kenyan Phone Number
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+254 720 000 000"
                    className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* File Attachment Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Attach Documents / Architectural Drawings / Invoices
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
                  <div className="mt-2 space-y-1">
                    {uploadedFiles.map((f, i) => (
                      <div key={i} className="text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center justify-between text-slate-700">
                        <span className="truncate">{f.name} ({f.sizeKb} KB)</span>
                        <span className="text-emerald-600 font-bold text-[10px]">Ready</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Service Boundaries Agreement */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
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

          {/* STEP 7: Review Request & Transparent Fee Breakdown */}
          {step === 7 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 7: Review your request & fee breakdown</h2>
                <p className="text-xs text-slate-500 mt-0.5">Verify all mission details before generating official request reference.</p>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Category</span>
                    <div className="font-bold text-slate-900 capitalize">{category.replace('_', ' ')}</div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Location</span>
                    <div className="font-bold text-slate-900">{town || county}, {county}</div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Urgency</span>
                    <div className="font-bold text-slate-900 capitalize">{urgency}</div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Model</span>
                    <div className="font-bold text-slate-900 capitalize">{offerType.replace('-', ' ')}</div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Requested Evidence Formats</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {evidenceRequested.map((ev, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-medium">
                        ✓ {ev}
                      </span>
                    ))}
                  </div>
                </div>

                {contactName && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">On-Ground Contact</span>
                    <div className="font-medium text-slate-800">{contactName} ({contactRole}) — {contactPhone}</div>
                  </div>
                )}
              </div>

              {/* Transparent Fee Breakdown Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden text-xs">
                <div className="bg-slate-900 text-white px-4 py-2.5 font-bold uppercase tracking-wider text-[11px]">
                  Transparent Fee Breakdown
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

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-base shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
                >
                  <span>Submit Request & Generate Reference</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </button>
                <p className="text-[11px] text-center text-slate-400 mt-2">
                  Secure transmission • You will receive an official DV reference code for tracking.
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
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5 transition"
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
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition"
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
