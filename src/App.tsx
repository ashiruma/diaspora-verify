import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { VerificationProvider, useVerification } from './context/VerificationContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

// Route-level code splitting & dynamic imports
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const LandingPage = lazy(() => import('./components/Marketing/LandingPage').then(m => ({ default: m.LandingPage })));
const ServiceModelGuide = lazy(() => import('./components/ServiceModelGuide').then(m => ({ default: m.ServiceModelGuide })));
const LegalAndCompliance = lazy(() => import('./components/Legal/LegalAndCompliance').then(m => ({ default: m.LegalAndCompliance })));
const Dashboard = lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })));
const NotFound = lazy(() => import('./components/NotFound').then(m => ({ default: m.NotFound })));
const ConstructionOversightView = lazy(() => import('./components/ClientPortal/ConstructionOversightView').then(m => ({ default: m.ConstructionOversightView })));
const RequestDetailView = lazy(() => import('./components/ClientPortal/RequestDetailView').then(m => ({ default: m.RequestDetailView })));
const NewRequestWizard = lazy(() => import('./components/ClientPortal/NewRequestWizard').then(m => ({ default: m.NewRequestWizard })));
const ReportsLibrary = lazy(() => import('./components/ReportsLibrary').then(m => ({ default: m.ReportsLibrary })));
const PropertyPortfolioView = lazy(() => import('./components/ClientPortal/PropertyPortfolioView').then(m => ({ default: m.PropertyPortfolioView })));
const DisputesView = lazy(() => import('./components/DisputesView').then(m => ({ default: m.DisputesView })));
const OperationsDashboard = lazy(() => import('./components/OperationsPortal/OperationsDashboard').then(m => ({ default: m.OperationsDashboard })));
const OperationsCockpit = lazy(() => import('./components/OperationsPortal/OperationsCockpit').then(m => ({ default: m.OperationsCockpit })));
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.default })));
const FieldAgentView = lazy(() => import('./components/FieldAgentPortal/FieldAgentView').then(m => ({ default: m.FieldAgentView })));
const CorporateDashboard = lazy(() => import('./components/CorporatePortal/CorporateDashboard').then(m => ({ default: m.CorporateDashboard })));
const CommandMenu = lazy(() => import('./components/ui/CommandMenu').then(m => ({ default: m.CommandMenu })));
const StandardReportModal = lazy(() => import('./components/StandardReportModal').then(m => ({ default: m.StandardReportModal })));
const ClientRequestsListView = lazy(() => import('./components/ClientPortal/ClientRequestsListView').then(m => ({ default: m.ClientRequestsListView })));
const ClientPaymentsView = lazy(() => import('./components/ClientPortal/ClientPaymentsView').then(m => ({ default: m.ClientPaymentsView })));
const ClientMessagesView = lazy(() => import('./components/ClientPortal/ClientMessagesView').then(m => ({ default: m.ClientMessagesView })));
const ClientProfileView = lazy(() => import('./components/ClientPortal/ClientProfileView').then(m => ({ default: m.ClientProfileView })));
const Login = lazy(() => import('./components/Auth/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./components/Auth/Register').then(m => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('./components/Auth/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('./components/Auth/ResetPassword').then(m => ({ default: m.ResetPassword })));
const VerifyEmail = lazy(() => import('./components/Auth/VerifyEmail').then(m => ({ default: m.VerifyEmail })));
const ServicesPage = lazy(() => import('./components/Public/ServicesPage').then(m => ({ default: m.ServicesPage })));
const ServiceDetailPage = lazy(() => import('./components/Public/ServiceDetailPage').then(m => ({ default: m.ServiceDetailPage })));
const HowItWorksPage = lazy(() => import('./components/Public/HowItWorksPage').then(m => ({ default: m.HowItWorksPage })));
const SampleReportPage = lazy(() => import('./components/Public/SampleReportPage').then(m => ({ default: m.SampleReportPage })));
const AboutPage = lazy(() => import('./components/Public/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./components/Public/ContactPage').then(m => ({ default: m.ContactPage })));

const RouteLoadingFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center p-8" aria-busy="true" aria-label="Loading page">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Loading DiasporaVerify...</span>
    </div>
  </div>
);

function AppRoutes() {
  const navigate = useNavigate();
  const { 
    openReportModal, 
    closeReportModal, 
    reportModalRequest, 
    currency,
    commandMenuOpen,
    setCommandMenuOpen,
    currentUser,
    activeRole
  } = useVerification();

  const handleBackFromRequest = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else if (currentUser?.role === 'admin' || activeRole === 'admin' || activeRole === 'operations') {
      navigate('/admin');
    } else if (currentUser?.role === 'agent' || activeRole === 'agent' || activeRole === 'field_agent') {
      navigate('/agent');
    } else {
      navigate('/requests');
    }
  };

  const handleBackToPublic = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <Navbar />
      <ErrorBoundary>
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
          {/* Authentication & Account Recovery Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Public & Informational Routes */}
          <Route 
            path="/" 
            element={
              <HomePage 
                onGetStarted={() => navigate('/new-request')} 
                onViewServices={() => navigate('/services')} 
                onViewLegal={() => navigate('/legal')} 
                currency={currency} 
              />
            } 
          />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:categoryId" element={<ServiceDetailPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/sample-report" element={<SampleReportPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route 
            path="/landing" 
            element={
              <HomePage 
                onGetStarted={() => navigate('/new-request')} 
                onViewServices={() => navigate('/services')} 
                onViewLegal={() => navigate('/legal')} 
                currency={currency} 
              />
            } 
          />
          <Route 
            path="/landing-classic" 
            element={
              <LandingPage 
                onGetStarted={() => navigate('/new-request')} 
                onViewServices={() => navigate('/services')} 
                onViewLegal={() => navigate('/legal')} 
                currency={currency} 
              />
            } 
          />
          <Route path="/legal" element={<LegalAndCompliance onBack={handleBackToPublic} />} />
          <Route 
            path="/service-model" 
            element={<ServiceModelGuide onBookNow={() => navigate('/new-request')} onBack={handleBackToPublic} />} 
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
                <NewRequestWizard 
                  onSuccess={(newId) => navigate(`/request/${newId}`)} 
                  onCancel={() => {
                    if (currentUser?.role === 'admin' || activeRole === 'admin') {
                      navigate('/admin');
                    } else {
                      navigate('/dashboard');
                    }
                  }} 
                />
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
                <RequestDetailView onBack={handleBackFromRequest} onOpenReport={openReportModal} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/requests/:id" 
            element={
              <ProtectedRoute allowedRoles={['client', 'admin']}>
                <RequestDetailView onBack={handleBackFromRequest} onOpenReport={openReportModal} />
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

          {/* Admin Financial & Operations Cockpit */}
          <Route 
            path="/cockpit" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <OperationsCockpit />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/cockpit" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <OperationsCockpit />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/page" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-page" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPage />
              </ProtectedRoute>
            } 
          />

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
      </Suspense>
      </ErrorBoundary>

      {/* Global Ctrl+K / Cmd+K Search Command Menu */}
      <Suspense fallback={null}>
        <CommandMenu isOpen={commandMenuOpen} onClose={() => setCommandMenuOpen(false)} />
      </Suspense>

      {/* Global Standard Audit Report Modal */}
      {reportModalRequest && (
        <Suspense fallback={null}>
          <StandardReportModal request={reportModalRequest} onClose={closeReportModal} />
        </Suspense>
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
