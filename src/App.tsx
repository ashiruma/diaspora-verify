import React, { useState } from 'react';
import { VerificationProvider, useVerification } from './context/VerificationContext';
import { Navbar } from './components/Navbar';
import { ClientDashboard } from './components/ClientPortal/ClientDashboard';
import { ConstructionOversightView } from './components/ClientPortal/ConstructionOversightView';
import { NewRequestWizard } from './components/ClientPortal/NewRequestWizard';
import { RequestDetailView } from './components/ClientPortal/RequestDetailView';
import { OperationsDashboard } from './components/OperationsPortal/OperationsDashboard';
import { FieldAgentView } from './components/FieldAgentPortal/FieldAgentView';
import { ReportsLibrary } from './components/ReportsLibrary';
import { ServiceModelGuide } from './components/ServiceModelGuide';
import { StandardReportModal } from './components/StandardReportModal';
import { LegalAndCompliance } from './components/Legal/LegalAndCompliance';
import { ShieldCheck } from './components/Icons';
import { LandingPage } from './components/Marketing/LandingPage';


const AppContent: React.FC = () => {
  const { 
    activeRole, 
    setActiveRole, 
    selectRequest, 
    reportModalRequest, 
    openReportModal, 
    closeReportModal,
    requests 
  } = useVerification();

  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  const handleSelectRequestFromList = (id: string) => {
    selectRequest(id);
    setCurrentTab('request_detail');
  };

  const handleNewRequestSuccess = (newId: string) => {
    selectRequest(newId);
    setCurrentTab('request_detail');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      
      {/* Top Navbar with Persona and Currency Switcher */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Role State Banner (Highlights active persona & allows 1-click toggling) */}
      <div className={`text-xs py-2 px-4 border-b flex items-center justify-between ${
        activeRole === 'client'
          ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
          : activeRole === 'operations'
          ? 'bg-blue-50 text-blue-950 border-blue-200'
          : 'bg-amber-50 text-amber-950 border-amber-200'
      }`}>
        <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded bg-white shadow-xs">
              {activeRole === 'client' && 'Client Mode'}
              {activeRole === 'operations' && 'Coordinator Operations Mode'}
              {activeRole === 'field_agent' && 'Field Verifier Ground Mode'}
            </span>
            <span className="text-[11px] text-slate-600 hidden sm:inline">
              {activeRole === 'client' && 'You are viewing as a Kenyan abroad making critical decisions.'}
              {activeRole === 'operations' && 'Nairobi HQ Triage Desk: Review incoming requests, assign agents & publish QA findings.'}
              {activeRole === 'field_agent' && 'Ground Mobile Mode: Execute site checklists, record camera angles, and log limitations.'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500 font-semibold hidden md:inline">Quick Switch:</span>
            <button
              onClick={() => { setActiveRole('client'); setCurrentTab('dashboard'); }}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${activeRole === 'client' ? 'bg-emerald-700 text-white' : 'bg-white hover:bg-slate-50 text-slate-700'}`}
            >
              Client
            </button>
            <button
              onClick={() => { setActiveRole('operations'); setCurrentTab('dashboard'); }}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${activeRole === 'operations' ? 'bg-blue-700 text-white' : 'bg-white hover:bg-slate-50 text-slate-700'}`}
            >
              Operations
            </button>
            <button
              onClick={() => { setActiveRole('field_agent'); setCurrentTab('dashboard'); }}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${activeRole === 'field_agent' ? 'bg-amber-700 text-white' : 'bg-white hover:bg-slate-50 text-slate-700'}`}
            >
              Field Agent
            </button>
            <button
              onClick={() => { setActiveRole('client'); setCurrentTab('landing'); }}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${currentTab === 'landing' ? 'bg-emerald-700 text-white' : 'bg-white hover:bg-slate-50 text-slate-700'}`}
            >
              Landing
            </button>
          </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentTab === 'dashboard' && (
          activeRole === 'operations' ? (
            <OperationsDashboard onOpenReport={openReportModal} />
          ) : activeRole === 'field_agent' ? (
            <FieldAgentView />
          ) : (
            <ClientDashboard
              onSelectRequest={handleSelectRequestFromList}
              onNavigateToConstruction={() => setCurrentTab('construction')}
              onNavigateToNewRequest={() => setCurrentTab('new_request')}
              onOpenReport={openReportModal}
            />
          )
        )}

        {currentTab === 'construction' && (
          <ConstructionOversightView onOpenReport={() => openReportModal(requests[0])} />
        )}

        {currentTab === 'request_detail' && (
          <RequestDetailView
            onBack={() => setCurrentTab('dashboard')}
            onOpenReport={openReportModal}
          />
        )}

        {currentTab === 'new_request' && (
          <NewRequestWizard
            onSuccess={handleNewRequestSuccess}
            onCancel={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'reports' && (
          <ReportsLibrary onOpenReport={openReportModal} />
        )}

        {currentTab === 'service_model' && (
          <ServiceModelGuide onBookNow={() => setCurrentTab('new_request')} />
        )}}
{currentTab === 'landing' && (
  <LandingPage
    onGetStarted={() => setCurrentTab('new_request')}
    onViewServices={() => setCurrentTab('service_model')}
    onViewLegal={() => setCurrentTab('legal')}
    currency={currencies[0]}
  />
)}

        {currentTab === 'legal' && (
          <LegalAndCompliance onBack={() => setCurrentTab('dashboard')} />
        )}
      </main>

      {/* Footer with Service Principles */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-10 px-4 sm:px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-base font-display">DiasporaVerify</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              “Your trusted eyes and hands on the ground in Kenya.” Trusted on-ground support for Kenyans living abroad.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Operating Version: Pilot Sept 2026
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-white text-xs uppercase tracking-wider">Service Portfolio</div>
            <ul className="space-y-1 text-slate-400 text-xs">
              <li>• Construction & Site Oversight</li>
              <li>• Land & Plot Beacon Checks</li>
              <li>• Vehicle Condition & VIN Audits</li>
              <li>• Business & Farming Asset Audits</li>
              <li>• Family Welfare Accompaniment</li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-white text-xs uppercase tracking-wider">Verification Standards</div>
            <ul className="space-y-1 text-slate-400 text-xs">
              <li>• Observed (Physical Match)</li>
              <li>• Partly Observed (Variance Flag)</li>
              <li>• Not Observed (Item Absent)</li>
              <li>• Cannot Confirm (Access/Legal)</li>
              <li>• Repeatable Camera Angles</li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-white text-xs uppercase tracking-wider">Trust & Boundaries</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              A photo is evidence of what it shows, not proof of ownership, quality, or structural completion. 
              DiasporaVerify separates inspection from contractor payments. Client authorizes decisions directly.
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-800/80 pt-6 mt-8 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-4">
          <div>
            © 2026 DiasporaVerify Kenya. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentTab('service_model')} className="hover:text-white transition-colors">
              Service Doctrine
            </button>
            <button onClick={() => setCurrentTab('construction')} className="hover:text-white transition-colors">
              Construction Pilot
            </button>
            <button onClick={() => setCurrentTab('reports')} className="hover:text-white transition-colors">
              Standard Reports
            </button>
            <button onClick={() => setCurrentTab('legal')} className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Legal, Privacy & Compliance (Kenya DPA + GDPR)
            </button>
          </div>
        </div>
      </footer>

      {/* Standard Audit Report Modal */}
      {reportModalRequest && (
        <StandardReportModal
          request={reportModalRequest}
          onClose={closeReportModal}
        />
      )}

    </div>
  );
};

export function App() {
  return (
    <VerificationProvider>
      <AppContent />
    </VerificationProvider>
  );
}

export default App;
