import React, { useState } from 'react';
import { useVerification } from '../../context/VerificationContext';
import { 
  MapPin, 
  Plus, 
  ArrowRight,
  X
} from '../Icons';
import { KENYA_COUNTIES } from '../../data/mockData';
import type { PropertyRecord } from '../../types';
import { EmptyState } from '../ui/EmptyState';
import { PortalLayout } from '../layout/PortalLayout';

interface PropertyPortfolioViewProps {
  onNewVerificationForProperty?: (prop: PropertyRecord) => void;
}

export const PropertyPortfolioView: React.FC<PropertyPortfolioViewProps> = ({ onNewVerificationForProperty }) => {
  const { properties, addProperty, updatePropertyInspection, currentUser } = useVerification();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedPropId, setSelectedPropId] = useState<string | null>(null);

  // New property form state
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyRecord['propertyType']>('Residential Land');
  const [county, setCounty] = useState('Kajiado');
  const [town, setTown] = useState('');
  const [landmark, setLandmark] = useState('');
  const [gpsCoords, setGpsCoords] = useState('-1.4892, 36.9583');
  const [beaconNumbersInput, setBeaconNumbersInput] = useState('');
  const [titleDeedRef, setTitleDeedRef] = useState('');
  const [sizeAcres, setSizeAcres] = useState<number>(0.25);
  const [currentStatus, setCurrentStatus] = useState<PropertyRecord['currentStatus']>('Vacant');
  const [monitoringPlan, setMonitoringPlan] = useState<PropertyRecord['monitoringPlan']>('Quarterly');
  const [notes, setNotes] = useState('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !town.trim()) {
      alert('Please provide property title and town.');
      return;
    }

    const beacons = beaconNumbersInput.split(',').map(b => b.trim()).filter(Boolean);
    const newId = addProperty({
      clientId: currentUser?.clientId || currentUser?.id || 'client-live',
      title,
      propertyType,
      county,
      town,
      landmark,
      gpsCoords,
      beaconNumbers: beacons,
      titleDeedRef,
      sizeAcres: Number(sizeAcres) || 0.25,
      currentStatus,
      monitoringPlan,
      nextInspectionDate: new Date(Date.now() + 86400000 * (monitoringPlan === 'Monthly' ? 30 : monitoringPlan === 'Quarterly' ? 90 : 180)).toISOString().substring(0, 10),
      notes,
      verifiedImages: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=720&auto=format&fit=crop&q=75&fm=webp'
      ]
    });

    setToastMessage(`Property "${title}" registered to your portfolio with ${monitoringPlan} monitoring.`);
    setAddModalOpen(false);
    setTitle('');
    setTown('');
    setLandmark('');
    setBeaconNumbersInput('');
    setTitleDeedRef('');
    setNotes('');
    setSelectedPropId(newId);
  };

  const handleUpdatePlan = (propId: string, plan: 'Monthly' | 'Quarterly' | 'Biannual' | 'On-Demand') => {
    updatePropertyInspection(propId, plan);
    setToastMessage(`Monitoring plan updated to ${plan}. Next inspection recalculated.`);
  };

  return (
    <PortalLayout
      title="Property Portfolio"
      subtitle="Thursday, 8 October 2026 · Geotagged Real Estate Assets"
      role="client"
      activeTab="properties"
      actions={
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex h-10 items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Property</span>
        </button>
      }
    >
      <div className="space-y-6">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="bg-emerald-700 text-white px-5 py-3 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-lg">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-4 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              RECURRING PROPERTY MONITORING
            </span>
            <span className="text-xs text-slate-400">Remote Asset Portfolio</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white">
            My Properties & Assets in Kenya
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Save your plots, construction sites, and farms. Schedule recurring photographic check-ins, beacon verification, and fence condition surveys without traveling to Kenya.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 self-start md:self-auto transition"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Property to Portfolio</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Properties</div>
          <div className="text-2xl font-black text-slate-900 font-display mt-0.5">{properties.length}</div>
          <div className="text-[11px] text-emerald-600 font-medium">Mapped & Cataloged</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Active Monitoring</div>
          <div className="text-2xl font-black text-emerald-700 font-display mt-0.5">
            {properties.filter(p => p.monitoringPlan && p.monitoringPlan !== 'On-Demand').length}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Monthly / Quarterly plans</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Historic Inspections</div>
          <div className="text-2xl font-black text-slate-900 font-display mt-0.5">
            {properties.reduce((acc, p) => acc + (p.inspectionHistoryCount || 0), 0)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Dated on-ground audits</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Next Scheduled Visit</div>
          <div className="text-sm font-bold text-slate-900 mt-1">
            {properties.find(p => p.nextInspectionDate)?.nextInspectionDate || 'None Scheduled'}
          </div>
          <div className="text-[11px] text-amber-600 font-medium truncate">
            {properties.find(p => p.nextInspectionDate)?.title || 'Add property to schedule'}
          </div>
        </div>
      </div>

      {/* Property Cards Grid */}
      {properties.length === 0 ? (
        <EmptyState
          icon={<MapPin className="w-8 h-8 text-slate-400" />}
          title="No Properties in Your Portfolio Yet"
          description="Catalog your plots, construction sites, and properties across Kenya to track recurring on-ground inspections, boundaries, and beacon coordinates."
          action={
            <button
              onClick={() => setAddModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Your First Property</span>
            </button>
          }
          className="bg-white border-slate-200 py-16"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {properties.map((prop) => (
          <div
            key={prop.id}
            className={`bg-white rounded-3xl border transition-all overflow-hidden flex flex-col ${
              selectedPropId === prop.id ? 'border-emerald-600 shadow-md ring-2 ring-emerald-500/20' : 'border-slate-200 shadow-xs hover:border-slate-300'
            }`}
          >
            {/* Visual Cover */}
            <div className="relative h-44 bg-slate-100 overflow-hidden">
              <img
                src={prop.verifiedImages?.[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=720&auto=format&fit=crop&q=75&fm=webp'}
                alt={prop.title}
                width={400}
                height={176}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {prop.propertyType}
              </div>
              <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                {prop.monitoringPlan || 'On-Demand'}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{prop.title}</h3>
                
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{prop.town}, {prop.county} County</span>
                </div>

                <div className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                  GPS: {prop.gpsCoords}
                </div>

                {prop.titleDeedRef && (
                  <div className="text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-700">Deed Ref:</span> {prop.titleDeedRef} ({prop.sizeAcres} Acres)
                  </div>
                )}

                {prop.beaconNumbers && prop.beaconNumbers.length > 0 && (
                  <div className="text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Beacons:</span> {prop.beaconNumbers.join(', ')}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 uppercase text-[9px] font-bold">Last Check</span>
                    <div className="font-semibold text-slate-700">{prop.lastInspectionDate || 'Intake baseline'}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[9px] font-bold">Next Check</span>
                    <div className="font-semibold text-emerald-700">{prop.nextInspectionDate || 'On request'}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <select
                  value={prop.monitoringPlan || 'On-Demand'}
                  onChange={(e) => handleUpdatePlan(prop.id, e.target.value as any)}
                  className="text-[11px] font-medium bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none"
                >
                  <option value="Monthly">Plan: Monthly</option>
                  <option value="Quarterly">Plan: Quarterly</option>
                  <option value="Biannual">Plan: Biannual</option>
                  <option value="On-Demand">Plan: On-Demand</option>
                </select>

                <button
                  onClick={() => {
                    if (onNewVerificationForProperty) {
                      onNewVerificationForProperty(prop);
                    } else {
                      setToastMessage(`Initiating on-demand inspection for ${prop.title}`);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold flex items-center gap-1 transition"
                >
                  <span>Verify Now</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Add Property Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Add Property to Portfolio</h2>
                <p className="text-xs text-slate-500">Record your asset coordinates for ongoing remote verification.</p>
              </div>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Property Title / Identifier *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lukenya Ridge 1-Acre Parcel 42"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Residential Land">Residential Land / Plot</option>
                    <option value="Commercial Land">Commercial Land / Highway</option>
                    <option value="House / Villa">House / Bungalow</option>
                    <option value="Apartment Block">Apartment Block / Rentals</option>
                    <option value="Farm / Agricultural">Farm / Agricultural Shamba</option>
                    <option value="Construction Site">Active Construction Site</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">County *</label>
                  <select
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    {KENYA_COUNTIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Town / Area *</label>
                  <input
                    type="text"
                    required
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    placeholder="e.g. Kitengela Acacia"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GPS Coordinates</label>
                  <input
                    type="text"
                    value={gpsCoords}
                    onChange={(e) => setGpsCoords(e.target.value)}
                    placeholder="-1.4892, 36.9583"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Title Deed / Parcel Ref</label>
                  <input
                    type="text"
                    value={titleDeedRef}
                    onChange={(e) => setTitleDeedRef(e.target.value)}
                    placeholder="e.g. KJD/KITENGELA/42910"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Size (Acres)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={sizeAcres}
                    onChange={(e) => setSizeAcres(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Beacon Numbers (comma separated)</label>
                <input
                  type="text"
                  value={beaconNumbersInput}
                  onChange={(e) => setBeaconNumbersInput(e.target.value)}
                  placeholder="e.g. BC-KJD-42A, BC-KJD-42B, BC-KJD-42C"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Monitoring Cadence</label>
                  <select
                    value={monitoringPlan}
                    onChange={(e) => setMonitoringPlan(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Monthly">Monthly Check-ins</option>
                    <option value="Quarterly">Quarterly Check-ins</option>
                    <option value="Biannual">Biannual Check-ins</option>
                    <option value="On-Demand">On-Demand Only</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Land Status</label>
                  <select
                    value={currentStatus}
                    onChange={(e) => setCurrentStatus(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Vacant">Vacant / Unfenced</option>
                    <option value="Under Construction">Under Construction</option>
                    <option value="Occupied / Tenanted">Occupied / Tenanted</option>
                    <option value="Farmed / Cultivated">Farmed / Cultivated</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Special Notes / Inspection Instructions</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Check for unauthorized gravel quarrying on east side; verify beacon numbers with local elder."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Save Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </div>
    </PortalLayout>
  );
};
