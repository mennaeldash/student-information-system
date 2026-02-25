import React from "react";
import { Navigate } from "react-router-dom";
import { getToken, getUserRole } from "../../services/auth_service";

export default function ProtectedRoute({ allowedRoles, children }) {
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;

  const role = getUserRole();
  if (!role) return <Navigate to="/login" replace />;

  const allowed = (allowedRoles || []).map((r) => String(r).toLowerCase());

  if (allowed.length > 0 && !allowed.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
