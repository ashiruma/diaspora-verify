// src/components/Dashboard.tsx
import React from 'react';
import { useVerification } from '../context/VerificationContext';
import { ClientDashboard } from './ClientPortal/ClientDashboard';
import { OperationsDashboard } from './OperationsPortal/OperationsDashboard';
import { FieldAgentView } from './FieldAgentPortal/FieldAgentView';

import { StandardReportModal } from './StandardReportModal';
export const Dashboard: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    selectRequest,
    reportModalRequest,
    openReportModal,
    closeReportModal,
    // currentTab removed – navigation handled by router
  } = useVerification();

  // We keep a simple internal state for the active tab inside the route components.
  // The router will render the appropriate component based on the URL.
  // This Dashboard component acts as the default landing page for "/dashboard" and shows a role‑based view.

  const renderRoleView = () => {
    switch (activeRole) {
      case 'operations':
        return <OperationsDashboard onOpenReport={openReportModal} />;
      case 'field_agent':
        return <FieldAgentView />;
      default:
        return <ClientDashboard
          onSelectRequest={(id) => { selectRequest(id); }}
          onNavigateToConstruction={() => setActiveRole('client') /* placeholder – navigation handled by router */}
          onNavigateToNewRequest={() => setActiveRole('client')}
          onOpenReport={openReportModal}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Main Content Area */}
      {renderRoleView()}

      {/* Standard Audit Report Modal */}
      {reportModalRequest && (
        <StandardReportModal request={reportModalRequest} onClose={closeReportModal} />
      )}
    </div>
  );
};
