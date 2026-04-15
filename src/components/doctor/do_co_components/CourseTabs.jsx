import React from "react";
import { Box } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GridViewIcon from "@mui/icons-material/GridView";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import BarChartIcon from "@mui/icons-material/BarChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../../../services/theme_context.jsx";

/**
 * CourseTabs — Figma-exact pill-style tab bar, theme-aware.
 *
 * Container: ~1021px max, h55, r12, bg tatab, p10
 * Active tab: chosen bg, text color, r8
 * Inactive: transparent, secondary text
 */
export default function CourseTabs({ activeTab, onChange }) {
  const { t } = useTranslation();
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  const tabs = [
    { label: t("courses.courseInfo"), icon: <MenuBookIcon sx={{ fontSize: 17 }} /> },
    { label: t("courses.sections"), icon: <GridViewIcon sx={{ fontSize: 17 }} /> },
    { label: t("courses.students"), icon: <PeopleAltIcon sx={{ fontSize: 17 }} /> },
    { label: t("courses.gradeStructure"), icon: <BarChartIcon sx={{ fontSize: 17 }} /> },
    { label: t("courses.grades"), icon: <TrendingUpIcon sx={{ fontSize: 17 }} /> },
  ];

  // Tab bar background: use tatab token (dark: #0f172a / light: #F4F4F5)
  const tabBarBg = colors?.tatab ?? (isDark ? "#0F172A" : "#F4F4F5");
  // Active pill background: chosen token (dark: #1E293B / light: #FFFFFF)
  const activeBg = isDark ? (colors?.chosen ?? "#1E293B") : "#FFFFFF";
  // Active text: white in dark for strong contrast, black in light
  const activeText = isDark ? "#FFFFFF" : "#000000";
  // Inactive text
  const inactiveText = colors?.secondary ?? (isDark ? "#94A3B8" : "#64748B");

  return (
    <Box
      sx={{
        maxWidth: 950,
        height: { xs: "auto", sm: 55 },
        bgcolor: tabBarBg,
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "none",
        borderRadius: "12px",
        p: "16px",
        mb: 2.5,
        display: "flex",
        alignItems: "center",
        gap: "15px",
        overflowX: "auto",
        /* Hide scrollbar but keep scroll functionality */
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
      }}
    >
      {tabs.map((tab, idx) => (
        <Box
          key={idx}
          onClick={() => onChange(idx)}
          sx={{
            height: 40,
            px: "30px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            borderRadius: "8px",
            cursor: "pointer",
            whiteSpace: "nowrap",
            flexShrink: 0,
            transition: "background 0.15s, color 0.15s",
            fontSize: "0.975rem",
            fontWeight: activeTab === idx ? 600 : 500,
            color: activeTab === idx ? activeText : inactiveText,
            bgcolor: activeTab === idx ? activeBg : "transparent",
            boxShadow:
              activeTab === idx
                ? isDark
                  ? "0 1px 3px rgba(0,0,0,0.4)"
                  : "0 1px 2px rgba(0,0,0,0.06)"
                : "none",
            "&:hover": {
              color: activeTab === idx ? activeText : colors?.text ?? "#334155",
              bgcolor:
                activeTab === idx
                  ? activeBg
                  : isDark
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.04)",
            },
            userSelect: "none",
          }}
        >
          {tab.icon}
          {tab.label}
        </Box>
      ))}
    </Box>
  );
}
