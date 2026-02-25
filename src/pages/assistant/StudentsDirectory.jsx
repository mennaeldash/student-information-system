// src/pages/assistant/StudentsDirectory.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StudentsDirectory from "../../components/assistant/as_sd_components/StudentsDirectory";
import StudentProfile from "../../components/assistant/as_sd_components/StudentProfile";

export default function StudentsDirectoryPage() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Reset selected student when navigating to StudentsDirectory route
  useEffect(() => {
    // Check if location state has reset flag (from menu click)
    if (location.state?.reset) {
      setSelectedStudent(null);
      sessionStorage.removeItem("selectedStudent");
      // Clear the state to prevent reset on re-render
      navigate(location.pathname, { replace: true, state: {} });
    }

    // Also check sessionStorage on mount (for page refresh)
    const stored = sessionStorage.getItem("selectedStudent");
    if (stored && !location.state?.reset) {
      try {
        const student = JSON.parse(stored);
        setSelectedStudent(student);
      } catch (e) {
        sessionStorage.removeItem("selectedStudent");
      }
    }
  }, [location.state, location.pathname, navigate]);

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    sessionStorage.setItem("selectedStudent", JSON.stringify(student));
  };

  const handleBack = () => {
    setSelectedStudent(null);
    sessionStorage.removeItem("selectedStudent");
  };

  if (selectedStudent) {
    return <StudentProfile student={selectedStudent} onBack={handleBack} />;
  }

  return <StudentsDirectory onSelectStudent={handleSelectStudent} />;
}