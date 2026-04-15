// src/components/doctor/do_db_components/AlertsTimeline.jsx
import React from "react";
import { Card, CardContent, Box, Typography } from "@mui/material";
import { useThemeContext } from "@/services/theme_context.jsx";
import { useTranslation } from "react-i18next";
import {
  Bell,
  CalendarDays,
  AlertTriangle,
  ClipboardCheck,
} from "lucide-react";

const alertsData = [
  {
    id: 1,
    icon: Bell,
    iconColor: "#EF4444",
    iconBg: "#FEE2E2",
    iconBgDark: "rgba(239,68,68,0.15)",
    title: "Grade Submission",
    description: "CS101 — due in 2 days",
    time: "Today",
  },
  {
    id: 2,
    icon: CalendarDays,
    iconColor: "#3B82F6",
    iconBg: "#DBEAFE",
    iconBgDark: "rgba(59,130,246,0.15)",
    title: "Faculty Meeting",
    description: "Department review at 3:00 PM",
    time: "Tomorrow",
  },
  {
    id: 3,
    icon: AlertTriangle,
    iconColor: "#F59E0B",
    iconBg: "#FEF3C7",
    iconBgDark: "rgba(245,158,11,0.15)",
    title: "Attendance Warning",
    description: "5 students below threshold in CS201",
    time: "2 days ago",
  },
  {
    id: 4,
    icon: ClipboardCheck,
    iconColor: "#22C55E",
    iconBg: "#DCFCE7",
    iconBgDark: "rgba(34,197,94,0.15)",
    title: "Project Grading Complete",
    description: "AI Chatbot — 24 submissions graded",
    time: "3 days ago",
  },
];

const AlertsTimeline = () => {
  const { colors } = useThemeContext();
  const { t } = useTranslation();

  const isDark = colors?.mode === "dark";
  const boxBg = colors?.box || "#FFFFFF";
  const textColor = colors?.text || "#0F172A";
  const mutedText = colors?.textSecondary || "#64748B";
  const primary = colors?.primary || "#6366F1";

  const F = {
    headerTitle: "clamp(14px, calc(14px + 6 * (100vw / 1720)), 20px)",
    headerLink: "clamp(13px, calc(13px + 5 * (100vw / 1720)), 18px)",
    itemTitle: "clamp(13px, calc(13px + 2 * (100vw / 1720)), 15px)",
    itemDesc: "clamp(11px, calc(11px + 2 * (100vw / 1720)), 13px)",
    itemTime: "clamp(10px, calc(10px + 1 * (100vw / 1720)), 12px)",
  };

  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: boxBg,
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        minHeight: 280,
        width: "100%",
      }}
    >
      <CardContent
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "100%",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 0.5,
          }}
        >
          <Typography
            sx={{
              fontSize: F.headerTitle,
              fontWeight: 600,
              color: textColor,
              lineHeight: 1.2,
            }}
          >
            {t("Alerts & Tasks")}
          </Typography>

          <Typography
            sx={{
              fontSize: F.headerLink,
              fontWeight: 600,
              color: primary,
              cursor: "pointer",
              userSelect: "none",
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              transition: "opacity 0.2s",
              "&:hover": { opacity: 0.8 },
            }}
          >
            {t("View All")}
          </Typography>
        </Box>

        {/* Alert List */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {alertsData.map((alert) => {
            const IconComp = alert.icon;

            return (
              <Box
                key={alert.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  backgroundColor: isDark ? "#0F172A" : "#F9FAFB",
                  borderRadius: "10px",
                  border: `1px solid ${isDark ? "#1F2937" : "#F1F5F9"}`,
                  px: "14px",
                  py: "12px",
                  transition: "border-color 0.2s ease, background-color 0.2s ease",
                  "&:hover": {
                    borderColor: isDark ? "#334155" : "#E2E8F0",
                    backgroundColor: isDark ? "#1E293B" : "#F1F5F9",
                  },
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    backgroundColor: isDark
                      ? alert.iconBgDark
                      : alert.iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <IconComp size={16} color={alert.iconColor} />
                </Box>

                {/* Text content */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: F.itemTitle,
                      fontWeight: 600,
                      color: textColor,
                      lineHeight: 1.3,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {t(alert.title)}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: F.itemDesc,
                      fontWeight: 400,
                      color: mutedText,
                      lineHeight: 1.4,
                      mt: 0.2,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {t(alert.description)}
                  </Typography>
                </Box>

                {/* Time */}
                <Typography
                  sx={{
                    fontSize: F.itemTime,
                    fontWeight: 400,
                    color: mutedText,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {t(alert.time)}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AlertsTimeline;
