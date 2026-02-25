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
  const primary = colors?.primary || "#4F46E5";

  const variantStyles = {
    sessions: {
      barColor: "#3B82F6",
      iconBg: "#EEF2FF",
    },

    hours: {
      barColor: "#22C55E",
      iconBg: "#ECFDF3",
    },

    students: {
      barColor: "#2563EB",
      iconBg: "#F1F5F9",
      iconColor: "#475569",
    },

    week: {
      barColor: "#D97706",
      iconBg: "#f0d7aaff",
    },

    default: {
      barColor: primary,
      iconBg: "#EEF2FF",
    },
  };

  const current = variantStyles[variant] || variantStyles.default;

  const isHours = variant === "hours";
  const isSessions = variant === "sessions";

  const defaultSubtitleByVariant = {
    hours: "hours",
  };

  const resolvedSubtitle = subtitle ?? defaultSubtitleByVariant[variant] ?? null;

  const translatedTitle = typeof title === "string" ? t(title) : title;

  const translatedSubtitle =
    typeof resolvedSubtitle === "string" ? t(resolvedSubtitle) : resolvedSubtitle;


  const F = {
    title: "clamp(12px, calc(12px + 6 * (100vw / 1720)), 18px)",     
    value: "clamp(16px, calc(16px + 8 * (100vw / 1720)), 24px)",   
    subtitle: "clamp(12px, calc(12px + 2 * (100vw / 1720)), 14px)",  
  };

  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: boxBg,
        borderRadius: "12px",
        width: "100%",
        
        flex: "1 1 260px",
        padding: 1,
        minHeight: 170,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          position: "relative",
          p: "clamp(12px, 3.5vw, 24px)",
          
          pb: 2.5,
        }}
      >
        {icon && (
          <Box
            sx={{
              position: "absolute",
              top: 20,
              [isRTL ? "left" : "right"]: 14,
              borderRadius: "6px",
              width: "50px",
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

        <Box sx={{ textAlign: isRTL ? "right" : "left" }}>
          {isHours && (
            <Typography
              sx={{
                display: "flex",
                alignItems: "baseline",
                gap: "8px",
                fontSize: F.value,
                fontWeight: 400,
                color: colors?.mode === "dark" ? "#FFFFFF" : textColor,
              }}
            >
              {value}
              {translatedSubtitle && (
                <Box
                  component="span"
                  sx={{
                    fontSize: F.subtitle,
                    color: mutedText,
                  }}
                >
                  {translatedSubtitle}
                </Box>
              )}
            </Typography>
          )}

          {isSessions && (
            <>
              <Typography
                sx={{
                  fontSize: F.value,
                  fontWeight: 400,
                  
                  color: colors?.mode === "dark" ? "#FFFFFF" : textColor,
                }}
              >
                {value}
              </Typography>

              {translatedSubtitle && (
                <Typography
                  sx={{
                    mt: "2px",
                    fontSize: F.subtitle,
                    color: mutedText,
                  }}
                >
                  {translatedSubtitle}
                </Typography>
              )}
            </>
          )}

          {!isHours && !isSessions && (
            <>
              <Typography
                sx={{
                  
                  fontSize: F.value,
                  fontWeight: 400,
                  color: colors?.mode === "dark" ? "#FFFFFF" : textColor,
                }}
              >
                {value}
              </Typography>

              {translatedSubtitle && (
                <Typography
                  sx={{
                    mt: "2px",
                    fontSize: F.subtitle,
                    color: mutedText,
                  }}
                >
                  {translatedSubtitle}
                </Typography>
              )}
            </>
          )}
        </Box>

        {!hideProgress && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              position: "absolute",
              left: 20,
              right: 20,
              bottom: { xs: 20, md: 28 },
              height: 6,
              borderRadius: 1,
              backgroundColor: progressBg,
              
              overflow: "hidden",
              "& .MuiLinearProgress-bar": {
                backgroundColor: current.barColor,
                transition: "width 0.5s ease",
              },
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardStatCard;
