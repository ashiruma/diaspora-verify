// src/App.tsx (updated with React Router)
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { VerificationProvider } from './context/VerificationContext';
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

export function App() {
  return (
    <VerificationProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/construction" element={<ConstructionOversightView />} />
          <Route path="/request/:id" element={<RequestDetailView onBack={() => {}} onOpenReport={() => {}} />} />
          <Route path="/new-request" element={<NewRequestWizard onSuccess={() => {}} onCancel={() => {}} />} />
          <Route path="/reports" element={<ReportsLibrary />} />
          <Route path="/service-model" element={<ServiceModelGuide onBookNow={() => {}} />} />
          <Route path="/landing" element={<LandingPage onGetStarted={() => {}} onViewServices={() => {}} onViewLegal={() => {}} currency={"KES" as any} />} />
          <Route path="/legal" element={<LegalAndCompliance />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </VerificationProvider>
  );
}

export default App;
