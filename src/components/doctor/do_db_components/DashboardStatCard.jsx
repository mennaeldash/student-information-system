// src/components/doctor/do_db_components/DashboardStatCard.jsx
import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  LinearProgress,
} from "@mui/material";
import { useThemeContext } from "@/services/theme_context.jsx";
import { useTranslation } from "react-i18next";

const DashboardStatCard = ({
  title,
  value,
  subtitle,
  icon,
  progress = 60,
  variant = "default",
  hideProgress = false,
}) => {
  const { colors } = useThemeContext();
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === "ar";

  const textColor = colors?.text || "#0F172A";
  const mutedText = colors?.textSecondary || "#64748B";
  const boxBg = colors?.box || "#FFFFFF";
  const progressBg = colors?.mode === "dark" ? "#334155" : "#E2E8F0";
  const primary = colors?.primary || "#6366F1";

  const variantStyles = {
    courses: {
      barColor: "#6366F1",
      iconBg: colors?.mode === "dark" ? "rgba(99,102,241,0.15)" : "#EEF2FF",
      iconColor: "#6366F1",
    },
    grading: {
      barColor: "#A855F7",
      iconBg: colors?.mode === "dark" ? "rgba(168,85,247,0.15)" : "#F5F3FF",
      iconColor: "#A855F7",
    },
    students: {
      barColor: "#3B82F6",
      iconBg: colors?.mode === "dark" ? "rgba(59,130,246,0.15)" : "#EFF6FF",
      iconColor: "#3B82F6",
    },
    schedule: {
      barColor: "#22C55E",
      iconBg: colors?.mode === "dark" ? "rgba(34,197,94,0.15)" : "#ECFDF5",
      iconColor: "#22C55E",
    },
    default: {
      barColor: primary,
      iconBg: colors?.mode === "dark" ? "rgba(99,102,241,0.15)" : "#EEF2FF",
      iconColor: primary,
    },
  };

  const current = variantStyles[variant] || variantStyles.default;

  const translatedTitle = typeof title === "string" ? t(title) : title;
  const translatedSubtitle =
    typeof subtitle === "string" ? t(subtitle) : subtitle;

  const F = {
    title: "clamp(12px, calc(12px + 6 * (100vw / 1720)), 18px)",
    value: "clamp(18px, calc(18px + 8 * (100vw / 1720)), 28px)",
    subtitle: "clamp(11px, calc(11px + 2 * (100vw / 1720)), 13px)",
  };

  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: boxBg,
        borderRadius: "12px",
        width: "100%",
        flex: "1 1 220px",
        minHeight: 160,
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.25s ease, transform 0.25s ease",
        "&:hover": {
          boxShadow:
            colors?.mode === "dark"
              ? "0 8px 24px rgba(0,0,0,0.35)"
              : "0 8px 24px rgba(0,0,0,0.08)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          position: "relative",
          p: "clamp(14px, 3.5vw, 24px)",
          pb: 2.5,
        }}
      >
        {/* Icon badge */}
        {icon && (
          <Box
            sx={{
              position: "absolute",
              top: 18,
              [isRTL ? "left" : "right"]: 14,
              borderRadius: "8px",
              width: "46px",
              height: "34px",
              backgroundColor: current.iconBg,
              color: current.iconColor || current.barColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        )}

        {/* Title */}
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: F.title,
            color: mutedText,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {translatedTitle}
        </Typography>

        {/* Value + subtitle */}
        <Box sx={{ textAlign: isRTL ? "right" : "left" }}>
          <Typography
            sx={{
              display: "flex",
              alignItems: "baseline",
              gap: "6px",
              fontSize: F.value,
              fontWeight: 600,
              color: colors?.mode === "dark" ? "#FFFFFF" : textColor,
            }}
          >
            {value}
            {translatedSubtitle && (
              <Box
                component="span"
                sx={{
                  fontSize: F.subtitle,
                  fontWeight: 400,
                  color: mutedText,
                }}
              >
                {translatedSubtitle}
              </Box>
            )}
          </Typography>
        </Box>

        {/* Progress bar */}
        {!hideProgress && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              position: "absolute",
              left: 20,
              right: 20,
              bottom: { xs: 16, md: 22 },
              height: 5,
              borderRadius: 999,
              backgroundColor: progressBg,
              overflow: "hidden",
              "& .MuiLinearProgress-bar": {
                backgroundColor: current.barColor,
                borderRadius: 999,
                transition: "width 0.6s ease",
              },
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardStatCard;
