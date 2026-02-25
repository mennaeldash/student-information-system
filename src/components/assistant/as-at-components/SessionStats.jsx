// src/components/assistant/as-at-components/SessionStats.jsx
import React from "react";
import { Box, Paper, Typography, LinearProgress } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import GroupIcon from "@mui/icons-material/Group";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { useThemeContext } from "../../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

function StatCard({
  title,
  count,
  subtitle,
  percentage,
  icon,
  mainColor,
  badgeBg,
  colors,
  hideProgress = false, // ✅ جديد
}) {
  const isDark = colors?.mode === "dark";
  const cardBg = colors?.box || (isDark ? "#020617" : "#FFFFFF");
  const textMuted = colors?.secondary || (isDark ? "#94A3B8" : "#6B7280");
  const borderColor = colors?.border || (isDark ? "#1E293B" : "#E5E7EB");
  const textColor = colors?.text || (isDark ? "#E2E8F0" : "#111827");

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3.5,
        borderRadius: 2.5,
        bgcolor: cardBg,
        border: `1px solid ${borderColor}`,
        boxShadow: isDark
          ? "0 6px 18px rgba(0,0,0,0.28)"
          : "0 6px 16px rgba(15,23,42,0.04)",
        display: "flex",
        flexDirection: "column",
        gap: 1.25,
        minHeight: 120,
        height: "100%",
        width: "97%",
      }}
    >
      {/* top row: title + icon */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontSize: 12, color: textMuted }}>{title}</Typography>

        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1.5,
            bgcolor: badgeBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {React.cloneElement(icon, { sx: { fontSize: 18, color: mainColor } })}
        </Box>
      </Box>

      {/* number + subtitle */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 700,
              color: textColor,
              lineHeight: 1.05,
            }}
          >
            {count}
          </Typography>
          {subtitle && (
            <Typography sx={{ fontSize: 12, color: textMuted }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box sx={{ width: 72 }} />
      </Box>

      {/* ✅ progress bar (اختياري) */}
      {!hideProgress && (
        <Box sx={{ pt: 0.5 }}>
          <LinearProgress
            variant="determinate"
            value={percentage}
            sx={{
              width: "100%",
              height: 8,
              borderRadius: 999,
              bgcolor: isDark ? "#0b1220" : "#EEF2F7",
              "& .MuiLinearProgress-bar": {
                borderRadius: 999,
                bgcolor: mainColor,
              },
            }}
          />
        </Box>
      )}
    </Paper>
  );
}

export default function SessionStats({ isSemesterView = false }) {
  const { t } = useTranslation();
  const { colors } = useThemeContext();

  // Session view stats (Present / Absent / Total)
  const sessionStats = [
    {
      key: "present",
      title: t("present") || "Present",
      count: 70,
      total: 100,
      icon: <DoneIcon />,
      mainColor: "#22C55E",
      badgeBg: "rgba(187,247,208,0.95)",
    },
    {
      key: "absent",
      title: t("absent") || "Absent",
      count: 30,
      total: 100,
      icon: <CloseIcon />,
      mainColor: "#DC2626",
      badgeBg: "rgba(254,202,202,0.95)",
    },
    {
      key: "total",
      title: t("total") || "Total",
      count: 100,
      total: 100,
      icon: <GroupIcon />,
      mainColor: "#2563EB",
      badgeBg: "rgba(191,219,254,0.95)",
    },
  ];

  // Semester view stats (Session Completed / Canceled / Total)
  const semesterStats = [
    {
      key: "completed",
      title: t("Session Completed") || "Session Completed",
      count: 8,
      total: 8,
      icon: <EventAvailableIcon />,
      mainColor: "#16A34A",
      badgeBg: "rgba(187,247,208,0.95)",
    },
    {
      key: "canceled",
      title: t("session_canceled") || "Session Canceled",
      count: 1,
      total: 1,
      icon: <CloseIcon />,
      mainColor: "#DC2626",
      badgeBg: "rgba(254,202,202,0.95)",
    },
    {
      key: "total",
      title: t("total") || "Total",
      count: 100,
      total: 100,
      icon: <GroupIcon />,
      mainColor: "#2563EB",
      badgeBg: "rgba(191,219,254,0.95)",
    },
  ];

  const data = isSemesterView ? semesterStats : sessionStats;

  return (
    <Box sx={{ mb: 3, width: "100%", ml: 1 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "column", md: "row" },
          gap: 3,
          width: "100%",
        }}
      >
        {data.map((item) => {
          const percentage =
            item.total && item.total > 0
              ? Math.round((item.count / item.total) * 100)
              : 100;

          const subtitle =
            item.total && item.total > 0
              ? `${t("out_of") || "out of"} ${item.total}`
              : "";

          return (
            <Box
              key={item.key}
              sx={{
                flex: 1,
                minWidth: { xs: "100%", md: 0 },
              }}
            >
              <StatCard
                title={item.title}
                count={item.count}
                subtitle={subtitle}
                percentage={percentage}
                icon={item.icon}
                mainColor={item.mainColor}
                badgeBg={item.badgeBg}
                colors={colors}
                hideProgress={item.key === "total"} // ✅ هنا: شيل البار من آخر بوكس
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
