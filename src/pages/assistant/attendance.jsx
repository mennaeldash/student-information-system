// src/pages/assistant/Attendance.jsx
import React, { useState } from "react";
import { Box, Button } from "@mui/material";

import CourseSectionSelector from "../../components/assistant/as-at-components/CourseSectionSelector.jsx";
import SessionStats from "../../components/assistant/as-at-components/SessionStats.jsx";
import AttendanceEntry from "../../components/assistant/as-at-components/AttendanceEntry.jsx";

// ✅ تاب التاني فقط
import SemesterAttendanceAdvanced from "../../components/assistant/as-at-components/SemesterAttendanceAdvanced.jsx";

import { useThemeContext } from "../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

export default function Attendance() {
  const { theme: appTheme, colors } = useThemeContext();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [activeTab, setActiveTab] = useState(0); // 0: Session, 1: Semester

  // ✅ دي خاصة بالتاب الأول فقط
  const [sessionStats, setSessionStats] = useState({
    present: 0,
    absent: 0,
    total: 100,
  });

  const isDark = colors?.mode === "dark" || appTheme === "dark";
  const cardBg = colors?.box || (isDark ? "#020617" : "#FFFFFF");
  const bgColor = colors?.background || (isDark ? "#020617" : "#F3F4F6");
  const textColor = colors?.text || (isDark ? "#E2E8F0" : "#111827");
  const mutedTextColor = colors?.secondary || (isDark ? "#94A3B8" : "#6B7280");

  const tabs = [
    { key: "Session Attendance", index: 0 },
    { key: "Semester Attendance", index: 1 },
  ];

  return (
    <Box
      dir={isRTL ? "rtl" : "ltr"}
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: bgColor,
        color: textColor,
        px: { xs: 1, sm: 1.5, md: 2 },
        py: { xs: 2, md: 3 },
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          maxWidth: { xs: "100%", md: 1400, lg: 1600, xl: 1920 },
          width: "100%",
          mx: "auto",
        }}
      >
        {/* Segment Control */}
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 2.5, mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              width: { xs: "100%", sm: 797 },
              maxWidth: { xs: "100%", sm: 797 },
              height: 55,
              borderRadius: "8px",
              bgcolor: isDark ? "rgba(255,255,255,0.05)" : "#F4F4F5",
              p: "8px 10px",
              gap: { xs: 1.5, sm: "91px" },
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {tabs.map((tab) => {
              const active = activeTab === tab.index;
              return (
                <Button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.index)}
                  disableElevation
                  disableRipple
                  sx={{
                    textTransform: "none",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: "18px",
                    lineHeight: "20px",
                    width: { xs: "50%", sm: 400 },
                    height: 40,
                    borderRadius: "8px",
                    p: "10px",
                    color: active ? textColor : mutedTextColor,
                    bgcolor: active ? cardBg : "transparent",
                    boxShadow: active && !isDark ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: textColor,
                      backgroundColor: active
                        ? cardBg
                        : isDark
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(255,255,255,0.5)",
                    },
                  }}
                >
                  {t(tab.key) || tab.key}
                </Button>
              );
            })}
          </Box>
        </Box>

  {/* Session Attendance */}
{activeTab === 0 && (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
    <CourseSectionSelector showDateTime />
    <SessionStats stats={sessionStats} />
    <AttendanceEntry onStatsChange={setSessionStats} />
  </Box>
)}

{/* Semester Attendance */}
{activeTab === 1 && (
  <Box>
    <SemesterAttendanceAdvanced />
  </Box>
)}

      </Box>
    </Box>
  );
}
