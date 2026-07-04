import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    // Redirect to login page, save the current location for redirect back
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // User is authenticated but does not have the required role
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
