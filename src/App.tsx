import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
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
import { ProtectedRoute } from './components/ProtectedRoute';
import { CommandMenu } from './components/ui/CommandMenu';
import { StandardReportModal } from './components/StandardReportModal';
import { ClientRequestsListView } from './components/ClientPortal/ClientRequestsListView';
import { ClientPaymentsView } from './components/ClientPortal/ClientPaymentsView';
import { ClientMessagesView } from './components/ClientPortal/ClientMessagesView';
import { ClientProfileView } from './components/ClientPortal/ClientProfileView';

function AppRoutes() {
  const navigate = useNavigate();
  const { 
    openReportModal, 
    closeReportModal, 
    reportModalRequest, 
    currency,
    commandMenuOpen,
    setCommandMenuOpen 
  } = useVerification();

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public & Informational Routes */}
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
        <Route 
          path="/service-model" 
          element={<ServiceModelGuide onBookNow={() => navigate('/new-request')} />} 
        />

        {/* Diaspora Client Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['client', 'admin']}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/requests" 
          element={
            <ProtectedRoute allowedRoles={['client', 'admin']}>
              <ClientRequestsListView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/payments" 
          element={
            <ProtectedRoute allowedRoles={['client', 'admin']}>
              <ClientPaymentsView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/messages" 
          element={
            <ProtectedRoute allowedRoles={['client', 'admin']}>
              <ClientMessagesView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute allowedRoles={['client', 'admin']}>
              <ClientProfileView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/properties" 
          element={
            <ProtectedRoute allowedRoles={['client', 'admin']}>
              <PropertyPortfolioView onNewVerificationForProperty={() => navigate('/new-request')} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/construction" 
          element={
            <ProtectedRoute allowedRoles={['client', 'admin']}>
              <ConstructionOversightView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/new-request" 
          element={
            <ProtectedRoute allowedRoles={['client', 'admin']}>
              <NewRequestWizard onSuccess={(newId) => navigate(`/request/${newId}`)} onCancel={() => navigate('/dashboard')} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute allowedRoles={['client', 'admin']}>
              <ReportsLibrary />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/disputes" 
          element={
            <ProtectedRoute allowedRoles={['client', 'admin']}>
              <DisputesView />
            </ProtectedRoute>
          } 
        />

        {/* Single Request Detail — with IDOR check inside and protected route */}
        <Route 
          path="/request/:id" 
          element={
            <ProtectedRoute allowedRoles={['client', 'admin']}>
              <RequestDetailView onBack={() => navigate('/dashboard')} onOpenReport={openReportModal} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/requests/:id" 
          element={
            <ProtectedRoute allowedRoles={['client', 'admin']}>
              <RequestDetailView onBack={() => navigate('/dashboard')} onOpenReport={openReportModal} />
            </ProtectedRoute>
          } 
        />

        {/* Admin Operations Center at /admin (and legacy /operations redirect) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <OperationsDashboard onOpenReport={openReportModal} />
            </ProtectedRoute>
          } 
        />
        <Route path="/operations" element={<Navigate to="/admin" replace />} />

        {/* Field Agent Portal */}
        <Route 
          path="/agent" 
          element={
            <ProtectedRoute allowedRoles={['agent', 'admin']}>
              <FieldAgentView />
            </ProtectedRoute>
          } 
        />

        {/* Corporate Oversight */}
        <Route 
          path="/corporate" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CorporateDashboard />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Global Ctrl+K / Cmd+K Search Command Menu */}
      <CommandMenu isOpen={commandMenuOpen} onClose={() => setCommandMenuOpen(false)} />

      {/* Global Standard Audit Report Modal */}
      {reportModalRequest && (
        <StandardReportModal request={reportModalRequest} onClose={closeReportModal} />
      )}
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
