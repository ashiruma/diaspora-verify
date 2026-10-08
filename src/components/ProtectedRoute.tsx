import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useVerification } from '../context/VerificationContext';
import { canAccessRoute, normalizeRole, type UserRole } from '../auth/authorization';
import { ForbiddenView } from './ForbiddenView';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const location = useLocation();
  const { currentUser, isAuthenticated, viewAsSession } = useVerification();

  // 0. Enforce authentication: redirect to /login with redirect query parameter
  if (!isAuthenticated || !currentUser) {
    const redirectUrl = `/login?redirect=${encodeURIComponent(location.pathname + location.search)}`;
    return <Navigate to={redirectUrl} replace />;
  }

  const normRole = normalizeRole(currentUser.role);

  // 1. Check general route authorization
  const routeCheck = canAccessRoute(currentUser, location.pathname, viewAsSession);
  if (!routeCheck.allowed) {
    return (
      <ForbiddenView
        reason={routeCheck.message || 'You do not have permission to access this resource.'}
        targetResource={location.pathname}
      />
    );
  }

  // 2. Check explicit allowedRoles boundary if provided
  if (allowedRoles && allowedRoles.length > 0) {
    // Admin has access, or if previewing as client/agent
    const isAdmin = normRole === 'admin';
    const isAllowed = allowedRoles.includes(normRole) || (isAdmin && viewAsSession.active && allowedRoles.includes(viewAsSession.viewRole));

    if (!isAllowed && !isAdmin) {
      return (
        <ForbiddenView
          reason={`Access Restricted: Your active account role (${normRole.toUpperCase()}) cannot access this section.`}
          targetResource={location.pathname}
        />
      );
    }
  }

  return children;
};
