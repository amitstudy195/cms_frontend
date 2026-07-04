import React from "react";
import { useAuth } from "../../hooks/useAuth";

export const RoleGuard = ({ children, allowedRoles, fallback = null }) => {
  const { currentUser } = useAuth();

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    return fallback;
  }

  return children;
};
