// src/components/Dashboard.tsx
import React from 'react';
import { useVerification } from '../context/VerificationContext';
import { ClientDashboard } from './ClientPortal/ClientDashboard';
import { OperationsDashboard } from './OperationsPortal/OperationsDashboard';
import { FieldAgentView } from './FieldAgentPortal/FieldAgentView';
import { CorporateDashboard } from './CorporatePortal/CorporateDashboard';

import { useNavigate } from 'react-router-dom';
import { StandardReportModal } from './StandardReportModal';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeRole,
    selectRequest,
    reportModalRequest,
    openReportModal,
    closeReportModal,
  } = useVerification();

  const renderRoleView = () => {
    switch (activeRole) {
      case 'operations':
        return <OperationsDashboard onOpenReport={openReportModal} />;
      case 'field_agent':
        return <FieldAgentView />;
      case 'corporate':
        return <CorporateDashboard />;
      default:
        return <ClientDashboard
          onSelectRequest={(id) => { selectRequest(id); navigate(`/request/${id}`); }}
          onNavigateToConstruction={() => navigate('/construction')}
          onNavigateToNewRequest={() => navigate('/new-request')}
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
