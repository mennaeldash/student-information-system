import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import ResponsiveDrawer from "./layouts/ResponsiveDrawer";

import Login from "./pages/student/Login.jsx";
import ForgotPassword from "./pages/student/ForgotPassword.jsx";

import Dashboard from "./pages/DashBoard";
import Courses from "./pages/student/Courses";
import Grades from "./pages/student/Grades";
import Attendance from "./pages/student/Attendence";
import StudentServices from "./pages/student/StudentServices";
import Profile from "./pages/student/Profile";
import Settings from "./pages/student/Settings";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/forgot-password", element: <ForgotPassword /> },

  // ✅ Layout
  {
    path: "/",
    element: <ResponsiveDrawer />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },

      { path: "dashboard", element: <Dashboard /> },
      { path: "courses", element: <Courses /> },
      { path: "grades", element: <Grades /> },
      { path: "attendance", element: <Attendance /> },
      { path: "StudentServices", element: <StudentServices /> },
      { path: "profile", element: <Profile /> },
      { path: "settings", element: <Settings /> },
    ],
  },

  // ✅ لو حد كتب مسار غلط
  { path: "*", element: <Navigate to="/login" replace /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
