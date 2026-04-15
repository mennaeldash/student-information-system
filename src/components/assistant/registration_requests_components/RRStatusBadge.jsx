import React from "react";
import { Box, Typography } from "@mui/material";
import { AlertCircle, CheckCircle2, XCircle, Info } from "lucide-react";
import { useThemeContext } from "@/services/theme_context.jsx";
import { useTranslation } from "react-i18next";

export default function RRStatusBadge({ label = "Under Review", tone = "warning" }) {
  const { colors } = useThemeContext();
  const { t } = useTranslation();
  const isDark = colors?.mode === "dark";

  const map = {
    warning: {
      bg: isDark ? "rgba(250, 173, 20, 0.12)" : "#FFF7E6",
      border: isDark ? "rgba(250, 173, 20, 0.35)" : "#FFD591",
      text: isDark ? "#FCD34D" : "#8C6D1F",
      Icon: AlertCircle,
    },
    success: {
      bg: isDark ? "rgba(34, 197, 94, 0.12)" : "#F6FFED",
      border: isDark ? "rgba(34, 197, 94, 0.35)" : "#B7EB8F",
      text: isDark ? "#86EFAC" : "#237804",
      Icon: CheckCircle2,
    },
    danger: {
      bg: isDark ? "rgba(239, 68, 68, 0.12)" : "#FFF1F0",
      border: isDark ? "rgba(239, 68, 68, 0.35)" : "#FFA39E",
      text: isDark ? "#FCA5A5" : "#A8071A",
      Icon: XCircle,
    },
    info: {
      bg: isDark ? "rgba(59, 130, 246, 0.12)" : "#E6F7FF",
      border: isDark ? "rgba(59, 130, 246, 0.35)" : "#91D5FF",
      text: isDark ? "#93C5FD" : "#0958D9",
      Icon: Info,
    },
  };

  const cfg = map[tone] || map.warning;
  const Icon = cfg.Icon;

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        px: "10px",
        py: "6px",
        borderRadius: "9999px",
        bgcolor: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.text,
        whiteSpace: "nowrap",
      }}
    >
      <Icon size={14} />
      <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, lineHeight: "12px", color: "inherit" }}>
        {t(label)}
      </Typography>
    </Box>
  );
}