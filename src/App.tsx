import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { VerificationProvider, useVerification } from './context/VerificationContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/Marketing/LandingPage';
import { ServiceModelGuide } from './components/ServiceModelGuide';
import { LegalAndCompliance } from './components/Legal/LegalAndCompliance';
import { Dashboard } from './components/Dashboard';
import { NotFound } from './components/NotFound';
import { ConstructionOversightView } from './components/ClientPortal/ConstructionOversightView';
import { RequestDetailView } from './components/ClientPortal/RequestDetailView';
import { NewRequestWizard } from './components/ClientPortal/NewRequestWizard';
import { ReportsLibrary } from './components/ReportsLibrary';
import { PropertyPortfolioView } from './components/ClientPortal/PropertyPortfolioView';
import { DisputesView } from './components/DisputesView';
import { OperationsDashboard } from './components/OperationsPortal/OperationsDashboard';
import { FieldAgentView } from './components/FieldAgentPortal/FieldAgentView';
import { CorporateDashboard } from './components/CorporatePortal/CorporateDashboard';

function AppRoutes() {
  const navigate = useNavigate();
  const { openReportModal, currency } = useVerification();

  return (
    <>
      <Navbar />
      <Routes>
        <Route 
          path="/" 
          element={
            <LandingPage 
              onGetStarted={() => navigate('/new-request')} 
              onViewServices={() => navigate('/service-model')} 
              onViewLegal={() => navigate('/legal')} 
              currency={currency} 
            />
          } 
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route 
          path="/properties" 
          element={<PropertyPortfolioView onNewVerificationForProperty={() => navigate('/new-request')} />} 
        />
        <Route path="/construction" element={<ConstructionOversightView />} />
        <Route 
          path="/request/:id" 
          element={<RequestDetailView onBack={() => navigate('/dashboard')} onOpenReport={openReportModal} />} 
        />
        <Route 
          path="/new-request" 
          element={<NewRequestWizard onSuccess={(newId) => navigate(`/request/${newId}`)} onCancel={() => navigate('/dashboard')} />} 
        />
        <Route path="/reports" element={<ReportsLibrary />} />
        <Route path="/disputes" element={<DisputesView />} />
        <Route 
          path="/service-model" 
          element={<ServiceModelGuide onBookNow={() => navigate('/new-request')} />} 
        />
        <Route 
          path="/operations" 
          element={<OperationsDashboard onOpenReport={openReportModal} />} 
        />
        <Route path="/agent" element={<FieldAgentView />} />
        <Route path="/corporate" element={<CorporateDashboard />} />
        <Route 
          path="/landing" 
          element={
            <LandingPage 
              onGetStarted={() => navigate('/new-request')} 
              onViewServices={() => navigate('/service-model')} 
              onViewLegal={() => navigate('/legal')} 
              currency={currency} 
            />
          } 
        />
        <Route path="/legal" element={<LegalAndCompliance />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export function App() {
  return (
    <VerificationProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </VerificationProvider>
  );
}

export default App;
