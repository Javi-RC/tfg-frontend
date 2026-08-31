import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { SESSION_STATUS } from '../constants/session';
import LoadingState from './common/LoadingState';

/**
 * Route guard.
 *
 * It gates on `sessionStatus`, never on the cached user, because that cache
 * lives in localStorage and anyone can edit it from the browser console. While
 * the session probe is in flight the guard renders a loading state and decides
 * nothing; only a server-confirmed session admits, and only the server-confirmed
 * `role` satisfies `allowedRoles`.
 *
 * This is defence in depth, not the boundary: the API must reject every request
 * the guard would have blocked.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string[]} [props.allowedRoles] Roles admitted. Omit to require only a session.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { sessionStatus, hasRole } = useAuth();

  if (sessionStatus === SESSION_STATUS.CHECKING) {
    return <LoadingState />;
  }

  if (!hasRole()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
