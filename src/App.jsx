import React from "react";
import "./i18n";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import RoleGate from "./components/auth/RoleGate";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Login from "./pages/student/Login.jsx";
import ForgotPassword from "./pages/student/ForgotPassword.jsx";

import ResponsiveDrawer from "./layouts/ResponsiveDrawer";
import Dashboard from "./pages/DashBoard";
import Courses from "./pages/student/Courses";
import Grades from "./pages/student/Grades";
import Attendance from "./pages/student/Attendence";
import StudentServices from "./pages/student/StudentServices";
import Profile from "./pages/student/Profile";
import Settings from "./pages/student/Settings";

import TAResponsiveDrawer from "./layouts/TAResponsiveDrawer.jsx";
import TAStudentsDirectory from "./pages/assistant/StudentsDirectory.jsx";
import TADashboard from "./pages/assistant/dashboard.jsx";
import TAAttendance from "./pages/assistant/attendance.jsx";
import TACourses from "./pages/assistant/courses.jsx";
import TAGradingSupport from "./pages/assistant/gradingsupport.jsx";
import TASetting from "./pages/assistant/setting.jsx";
import TAProfile from "./pages/assistant/profile.jsx";
import TASections from "./pages/assistant/sections.jsx";
import TASchedule from "./pages/assistant/schedule.jsx";
import TARegistrationRequests from "./pages/assistant/registrationrequests.jsx";

import DoctorResponsiveDrawer from "./layouts/DoctorResponsiveDrawer.jsx";
import DoctorDashboard from "./pages/doctor/dashboard.jsx";
import DoctorProfile from "./pages/doctor/profile.jsx";
import DoctorCourses from "./pages/doctor/courses.jsx";
import DoctorSchedule from "./pages/doctor/schedule.jsx";
import DoctorSettings from "./pages/doctor/settings.jsx";

function Unauthorized() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Unauthorized</h2>
    </div>
  );
}

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/unauthorized", element: <Unauthorized /> },

  { path: "/", element: <Navigate to="/login" replace /> },

  { path: "/role-gate", element: <RoleGate /> },

  {
    path: "/student",
    element: (
      <ProtectedRoute allowedRoles={["student", "طالب"]}>
        <ResponsiveDrawer />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "courses", element: <Courses /> },
      { path: "grades", element: <Grades /> },
      { path: "attendance", element: <Attendance /> },
      { path: "StudentServices", element: <StudentServices /> },
      { path: "profile", element: <Profile /> },
      { path: "settings", element: <Settings /> },
    ],
  },

  {
    path: "/ta",
    element: (
      <ProtectedRoute allowedRoles={["ta", "TA", "assistant", "معيد"]}>
        <TAResponsiveDrawer />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <TADashboard /> },
      { path: "profile", element: <TAProfile /> },
      { path: "attendance", element: <TAAttendance /> },
      { path: "StudentsDirectory", element: <TAStudentsDirectory /> },
      { path: "courses", element: <TACourses /> },
      { path: "courses/sections", element: <TASections /> },
      { path: "courses/schedule", element: <TASchedule /> },
      { path: "gradingsupport", element: <TAGradingSupport /> },
      {path: "registrationrequests", element:<TARegistrationRequests/>},
      { path: "setting", element: <TASetting /> },
    ],
  },

  {
    path: "/doctor",
    element: (
      <ProtectedRoute allowedRoles={["doctor", "دكتور"]}>
        <DoctorResponsiveDrawer />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <DoctorDashboard /> },
      { path: "profile", element: <DoctorProfile /> },
      { path: "courses", element: <DoctorCourses /> },
      { path: "schedule", element: <DoctorSchedule /> },
      { path: "settings", element: <DoctorSettings /> },
    ],
  },

  { path: "*", element: <Navigate to="/login" replace /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
