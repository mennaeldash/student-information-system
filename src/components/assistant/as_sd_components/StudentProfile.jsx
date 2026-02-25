// src/components/assistant/as_sd_components/StudentProfile.jsx
import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Typography, GlobalStyles, Card } from "@mui/material";
import { useThemeContext } from "../../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SchoolIcon from "@mui/icons-material/School";
import { FileDown, Printer, IdCard, Receipt, User } from "lucide-react";
import StudentPersonalDetails from "./StudentPersonalDetails";
import StudentContactInformation from "./StudentContactInformation";
import StudentAcademicInformation from "./StudentAcademicInformation";
import DirectoryGrades from "./DirectoryGrades";
import DirectoryPayment from "./DirectoryPayment";

export default function StudentProfile({ student, onBack }) {
  const { theme: appTheme, colors } = useThemeContext();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const isDark = colors?.mode === "dark" || appTheme === "dark";
  const contentRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0); // 0: Basic Information, 1: Academic Grades, 2: Payment & Financial

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const cardBg = colors?.box || (isDark ? "#020617" : "#FFFFFF");
  const borderColor = colors?.border || (isDark ? "#1E293B" : "#E5E7EB");
  const bgColor = colors?.background || (isDark ? "#020617" : "#F3F4F6");
  const textColor = colors?.text || (isDark ? "#E2E8F0" : "#111827");
  const mutedTextColor = colors?.secondary || (isDark ? "#94A3B8" : "#6B7280");

  const tabs = [
    {
      key: "Basic Information",
      index: 0,
      icon: IdCard,
    },
    {
      key: "Academic Grades",
      index: 1,
      icon: SchoolIcon,
    },
    {
      key: "Payment & Financial",
      index: 2,
      icon: Receipt,
    },
  ];

  useEffect(() => {
    // Add print styles
    const style = document.createElement("style");
    style.id = "student-profile-print-styles";
    style.textContent = `
      @media print {
        /* Hide sidebar/drawer */
        .MuiDrawer-root,
        .MuiDrawer-paper,
        [class*="Drawer"],
        nav[class*="drawer"],
        aside,
        [role="navigation"] {
          display: none !important;
        }
        
        /* Hide AppBar */
        .MuiAppBar-root,
        header[class*="AppBar"],
        [class*="AppBar"],
        [class*="Toolbar"],
        header {
          display: none !important;
        }
        
        /* Hide no-print elements */
        .no-print,
        [class*="no-print"],
        button[class*="no-print"] {
          display: none !important;
        }
        
        /* Hide back button */
        button:has(svg[data-testid*="ArrowBack"]),
        button:has(svg[class*="ArrowBack"]) {
          display: none !important;
        }
        
        /* Adjust main content */
        main,
        [class*="main"],
        [role="main"],
        #root > div {
          margin-left: 0 !important;
          margin-right: 0 !important;
          margin-top: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          padding: 0 !important;
        }
        
        /* Page setup */
        @page {
          margin: 15mm;
          size: A4;
        }
        
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: auto !important;
          overflow: visible !important;
        }
        
        /* Ensure content is visible and properly formatted */
        * {
          visibility: visible !important;
          box-shadow: none !important;
        }
        
        /* Print-friendly colors */
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        /* Remove backgrounds that might interfere */
        body {
          background: white !important;
        }
      }
    `;
    
    // Remove existing style if present
    const existingStyle = document.getElementById("student-profile-print-styles");
    if (existingStyle) {
      existingStyle.remove();
    }
    
    document.head.appendChild(style);

    return () => {
      const styleToRemove = document.getElementById("student-profile-print-styles");
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, []);

  if (!student) {
    return null;
  }

  const handleDownloadPDF = async () => {
    try {
      // Dynamically import html2pdf.js
      const html2pdf = (await import("html2pdf.js")).default;
      
      // Get the content element (excluding buttons)
      const element = contentRef.current;
      if (!element) return;

      // Hide buttons temporarily
      const buttons = element.querySelectorAll(".no-print");
      buttons.forEach((btn) => {
        btn.style.display = "none";
      });

      // Configure PDF options
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${student.name || "Student"}_Profile.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false,
        },
        jsPDF: { 
          unit: "mm", 
          format: "a4", 
          orientation: "portrait" 
        },
      };

      // Generate and download PDF
      await html2pdf().set(opt).from(element).save();

      // Show buttons back
      buttons.forEach((btn) => {
        btn.style.display = "";
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Fallback to print dialog
      window.print();
    }
  };

  // Create profile header
  const StudentProfileHeader = () => {
    const isActive = student.status === "Active" || !student.status;
    const isDark = colors?.mode === "dark";

    // Green badge colors matching the image
    const badgeBg = isActive
      ? "#DCFCE7" // Light green background
      : isDark
      ? "rgba(220, 38, 38, 0.15)"
      : "#FDE8E8";

    const badgeText = isActive ? "#16A34A" : "#DC2626"; // Dark green text
    const badgeBorder = isActive ? "#16A34A" : "#DC2626"; // Dark green border

    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: 1311,
          height: { xs: "auto", md: 108 },
          display: "flex",
          alignItems: "center",
          gap: "20px",
          pb: "20px",
          mb: "20px",
          borderBottom: `1px solid ${colors?.border || "#E5E7EB"}`,
        }}
      >
        {/* Avatar */}
        <Box
          sx={{
            width: 85,
            height: 85,
            borderRadius: "50px",
            border: `1px solid ${colors?.border || "#E5E7EB"}`,
            borderWidth: "1px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors?.secondary || "#6B7280",
            bgcolor: colors?.box || "#FFFFFF",
            flexShrink: 0,
            pt: "7px",
            pr: "10px",
            pb: "7px",
            pl: "10px",
            boxSizing: "border-box",
          }}
        >
          <User size={40} strokeWidth={1.5} />
        </Box>

        {/* Name + Badge */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
          <Typography
            sx={{
              fontFamily: "Inter, sans-serif",
              fontSize: "30px",
              fontWeight: 400,
              lineHeight: "32px",
              letterSpacing: "0%",
              color: colors?.text || "#111827",
            }}
          >
            {student.fullName || student.name}
          </Typography>

          <Box
            sx={{
              width: 90,
              height: 26,
              borderRadius: "8px",
              padding: "10px",
              gap: "10px",
              borderWidth: "0.5px",
              fontSize: 13,
              fontWeight: 500,
              bgcolor: badgeBg,
              color: badgeText,
              border: `0.5px solid ${badgeBorder}`,
              fontFamily: "Inter, sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
            }}
          >
            {isActive ? t("Active") || "Active" : t("Inactive") || "Inactive"}
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box
      ref={contentRef}
      sx={{
        width: "100%",
        pt: { xs: 2, sm: 3, md: 4 },
        pb: { xs: 4, sm: 6, md: 8 },
        px: { xs: 1, sm: 1.5, md: 2 },
        boxSizing: "border-box",
        direction: isRTL ? "rtl" : "ltr",
        display: "flex",
        flexDirection: "column",
        gap: { xs: 1, md: 0.2 },
        bgcolor: bgColor,
      }}
    >
      <Box sx={{ maxWidth: { xs: "100%", md: 1400, lg: 1600, xl: 1920 }, width: "100%", mx: "auto" }}>
      {/* Segment Control (Switcher) */}
      <Box 
        sx={{ 
          width: "100%", 
          display: "flex", 
          justifyContent: "center", 
          mt: 2.5, 
          mb: 3,
          direction: isRTL ? "rtl" : "ltr",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: 965 },
            height: 60,
            borderRadius: "8px",
            bgcolor: isDark ? "rgba(255,255,255,0.05)" : "#F4F4F5",
            border: `1px solid ${isDark ? "#1E293B" : "#E5E7EB"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "flex-start", md: "center" },
            pt: "8px",
            pr: "70px",
            pb: "8px",
            pl: "10px",
            gap: "91px",
            overflowX: { xs: "auto", md: "hidden" },
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-x",
            "&::-webkit-scrollbar": { display: "none" },
            boxSizing: "border-box",
          }}
        >
          {tabs.map((tab) => {
            const active = activeTab === tab.index;
            const IconComponent = tab.icon;
            const isMuiIcon = IconComponent === SchoolIcon;
            return (
              <Button
                key={tab.key}
                onClick={() => handleTabChange(tab.index)}
                disableElevation
                disableRipple
                startIcon={
                  IconComponent && active
                    ? isMuiIcon
                      ? <IconComponent sx={{ fontSize: 16, color: isDark ? "#E2E8F0" : "#111827" }} />
                      : <IconComponent size={16} color={isDark ? "#E2E8F0" : "#111827"} />
                    : null
                }
                sx={{
                  textTransform: "none",
                  fontSize: 18,
                  fontWeight: active ? 600 : 400,
                  width: 338,
                  height: 50,
                  padding: "10px",
                  borderRadius: "8px",
                  color: active 
                    ? (isDark ? "#E2E8F0" : "#111827") 
                    : (isDark ? "#94A3B8" : "#71717A"),
                  bgcolor: active 
                    ? (isDark ? "#020617" : "#FFFFFF") 
                    : "transparent",
                  border: active 
                    ? `1px solid ${isDark ? "#1E293B" : "#E5E7EB"}` 
                    : "1px solid transparent",
                  boxShadow: active && !isDark ? "0 1px 2px rgba(0,0,0,.05)" : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  transition: "background-color .15s, color .15s, border-color .15s",
                  whiteSpace: "nowrap",
                  "&:hover": {
                    color: active 
                      ? (isDark ? "#E2E8F0" : "#111827") 
                      : (isDark ? "#94A3B8" : "#71717A"),
                    backgroundColor: active 
                      ? (isDark ? "#020617" : "#FFFFFF") 
                      : "transparent",
                    borderColor: active 
                      ? (isDark ? "#1E293B" : "#E5E7EB") 
                      : "transparent",
                  },
                  "& .MuiButton-startIcon": { 
                    margin: 0,
                  },
                }}
              >
                {t(tab.key) || tab.key}
              </Button>
            );
          })}
        </Box>
      </Box>

      {/* Basic Information View */}
      {activeTab === 0 && (
        <Card
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 1360,
            bgcolor: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: "8px",
            pt: "30px",
            pr: "20px",
            pb: "30px",
            pl: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          {/* Profile Header */}
          <StudentProfileHeader />

          {/* Personal Details */}
          <StudentPersonalDetails
            name={student.fullName || student.name}
            studentId={student.studentId}
            nationalId={student.nationalId || "-"}
            nationality={student.nationality}
            gender={student.gender || "-"}
            dateOfBirth={student.dateOfBirth || "-"}
            enrollmentDate={student.enrollmentDate || "-"}
            religion={student.religion || "-"}
          />

          {/* Academic Information */}
          <StudentAcademicInformation
            program={student.program}
            department={student.department || "-"}
            level={student.level}
            cumulativeGpa={student.cumulativeGpa || student.gpa || "-"}
            creditHours={student.credits}
          />

          {/* Contact Information */}
          <StudentContactInformation
            personalEmail={student.personalEmail || student.email}
            phoneNumber={student.phone}
            currentAddress={student.currentAddress || "-"}
          />

          {/* Action Buttons */}
          <Box
            className="no-print"
            sx={{
              mt: 3,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: { xs: "stretch", sm: "flex-end" },
              gap: 2,
              "@media print": {
                display: "none !important",
              },
            }}
          >
            <Button
              variant="outlined"
              startIcon={<FileDown size={16} color="#3B82F6" />}
              sx={{
                textTransform: "none",
                borderRadius: "8px",
                minWidth: "auto",
                width: { xs: "100%", sm: "auto" },
                height: 40,
                px: 2,
                borderWidth: "1px",
                borderColor: "#3B82F6",
                color: "#3B82F6",
                bgcolor: "#FFFFFF",
                fontSize: 14,
                fontWeight: 400,
                gap: 1,
                "&:hover": {
                  borderColor: "#2563EB",
                  color: "#2563EB",
                  bgcolor: "#FFFFFF",
                },
                "& .MuiButton-startIcon": {
                  margin: 0,
                },
                "& .MuiButton-startIcon svg": {
                  color: "#3B82F6",
                },
                "&:hover .MuiButton-startIcon svg": {
                  color: "#2563EB",
                },
              }}
              onClick={handleDownloadPDF}
            >
              {t("Download PDF") || "Download PDF"}
            </Button>
            <Button
              variant="outlined"
              startIcon={<Printer size={16} color="#6B7280" />}
              sx={{
                textTransform: "none",
                borderRadius: "8px",
                minWidth: "auto",
                width: { xs: "100%", sm: "auto" },
                height: 40,
                px: 2,
                borderWidth: "1px",
                borderColor: "#6B7280",
                color: "#6B7280",
                bgcolor: "#FFFFFF",
                fontSize: 14,
                fontWeight: 400,
                gap: 1,
                "&:hover": {
                  borderColor: "#4B5563",
                  color: "#4B5563",
                  bgcolor: "#FFFFFF",
                },
                "& .MuiButton-startIcon": {
                  margin: 0,
                },
                "& .MuiButton-startIcon svg": {
                  color: "#6B7280",
                },
                "&:hover .MuiButton-startIcon svg": {
                  color: "#4B5563",
                },
              }}
              onClick={() => {
                setTimeout(() => {
                  window.print();
                }, 100);
              }}
            >
              {t("Print") || "Print"}
            </Button>
          </Box>
        </Card>
      )}

      {/* Academic Grades View */}
      {activeTab === 1 && <DirectoryGrades student={student} />}

      {/* Payment & Financial View */}
      {activeTab === 2 && (
        <Card
          elevation={0}
          sx={{
            bgcolor: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: "8px",
            p: { xs: 2, sm: 3 },
          }}
        >
          <DirectoryPayment student={student} />
        </Card>
      )}
      </Box>
    </Box>
  );
}
