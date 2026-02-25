import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthed, getUserRole } from "../../services/auth_service";

export default function RoleGate() {
  if (!isAuthed()) return <Navigate to="/login" replace />;

  const role = getUserRole();

  const roleHome = {
    student: "/student/dashboard",
    طالب: "/student/dashboard",

    ta: "/ta/dashboard",
    assistant: "/ta/dashboard",
    معيد: "/ta/dashboard",

    doctor: "/doctor/dashboard",
    admin: "/admin/dashboard",
  };

  return <Navigate to={roleHome[role] || "/student/dashboard"} replace />;
}
