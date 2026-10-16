// src/components/Dashboard.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVerification } from '../context/VerificationContext';
import { ClientDashboard } from './ClientPortal/ClientDashboard';
import { StandardReportModal } from './StandardReportModal';
import { normalizeRole } from '../auth/authorization';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    viewAsSession,
    selectRequest,
    reportModalRequest,
    openReportModal,
    closeReportModal,
  } = useVerification();

  const role = normalizeRole(currentUser?.role || 'client');

  // Enforce role dashboard separation:
  // Admin belongs on /admin (unless actively previewing as client via viewAsSession)
  // Field Agent belongs on /agent
  useEffect(() => {
    if (!currentUser) return;
    if (role === 'admin' && !(viewAsSession?.active && viewAsSession.viewRole === 'client')) {
      navigate('/admin', { replace: true });
    } else if (role === 'agent') {
      navigate('/agent', { replace: true });
    }
  }, [role, currentUser, viewAsSession, navigate]);

  return (
    <>
      <ClientDashboard
        onSelectRequest={(id) => {
          selectRequest(id);
          navigate(`/request/${id}`);
        }}
        onNavigateToConstruction={() => navigate('/construction')}
        onNavigateToNewRequest={() => navigate('/new-request')}
        onOpenReport={openReportModal}
      />

      {/* Standard Audit Report Modal */}
      {reportModalRequest && (
        <StandardReportModal request={reportModalRequest} onClose={closeReportModal} />
      )}
    </>
  );
};

export default Dashboard;
