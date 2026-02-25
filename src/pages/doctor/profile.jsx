// src/pages/doctor/profile.jsx
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useThemeContext } from "../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

import ProfileHeader from "../../components/doctor/do_pr_components/ProfileHeader";
import PersonalDetails from "../../components/doctor/do_pr_components/PersonalDetails";
import ContactInformation from "../../components/doctor/do_pr_components/ContactInformation";
import AcademicInformation from "../../components/doctor/do_pr_components/AcademicInformation";

const STORAGE_KEY = "DOCTOR_PROFILE_LOCAL";

const MOCK_PROFILE = {
  name: "mohammed tarek",
  status: "Active",
  personal: {
    doctorId: "DOC-0001",
    nationalId: "1234567891011",
    nationality: "Egypt",
    gender: "Male",
    dateOfBirth: "August 22, 1995",
  },
  contact: {
    personalEmail: "doctor@gmail.com",
    primaryEmail: "doctor@eelums.edu",
    phoneNumber: "+201023456789",
    currentAddress: "Fayoum",
  },
  academic: {
    department: "Computer Science",
    university: "Fayoum University",
    faculty: "Computers and Information",
    academicDegree: "PhD",
    gpa: "—",
    graduationYear: "—",
    previousExperience: "Professor / Lecturer",
  },
};

export default function DoctorProfile() {
  const { colors, theme: appTheme } = useThemeContext();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const isDark = colors?.mode === "dark" || appTheme === "dark";

  const pageBg = colors?.background || (isDark ? "#020617" : "#F3F4F6");
  const panelBg = colors?.box || (isDark ? "#0B1220" : "#FFFFFF");
  const borderColor = colors?.border || (isDark ? "#1E293B" : "#E5E7EB");

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : MOCK_PROFILE;
    } catch {
      return MOCK_PROFILE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {}
  }, [profile]);

  return (
    <Box
      dir={isRTL ? "rtl" : "ltr"}
      sx={{
        width: "100%",
        minHeight: "100%",
        bgcolor: pageBg,
        pt: { xs: 2, sm: 3, md: 4 },
        pb: { xs: 4, sm: 6, md: 8 },
        px: { xs: 2, sm: 3, md: 4, lg: 5 },
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          width: "100%",
          bgcolor: panelBg,
          border: `1px solid ${borderColor}`,
          borderRadius: 2.5,
          boxShadow: isDark
            ? "0 10px 28px rgba(0,0,0,0.28)"
            : "0 10px 28px rgba(15,23,42,0.06)",
          p: { xs: 2, sm: 3, md: 3.5 },
          display: "flex",
          flexDirection: "column",
          gap: { xs: 2, md: 2.25 },
          boxSizing: "border-box",
        }}
      >
        <ProfileHeader profile={profile} setProfile={setProfile} />

        <PersonalDetails
          name={profile.name}
          doctorId={profile.personal.doctorId}
          nationalId={profile.personal.nationalId}
          nationality={profile.personal.nationality}
          gender={profile.personal.gender}
          dateOfBirth={profile.personal.dateOfBirth}
        />

        <ContactInformation
          personalEmail={profile.contact.personalEmail}
          primaryEmail={profile.contact.primaryEmail}
          phoneNumber={profile.contact.phoneNumber}
          currentAddress={profile.contact.currentAddress}
        />

        <AcademicInformation
          department={profile.academic.department}
          university={profile.academic.university}
          faculty={profile.academic.faculty}
          academicDegree={profile.academic.academicDegree}
          gpa={profile.academic.gpa}
          graduationYear={profile.academic.graduationYear}
          previousExperience={profile.academic.previousExperience}
        />
      </Box>
    </Box>
  );
}
