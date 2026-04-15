import React from "react";
import { Box, Typography, Chip, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useThemeContext } from "../../../services/theme_context.jsx";

const ff =
  'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';

function StatusChip({ status = "submitted" }) {
  const { colors } = useThemeContext();

  const map = {
    submitted: {
      label: "Submitted",
      bg: colors?.talab || colors?.infoBg || "#DBEEFF",
      fg: colors?.info || "#2563EB",
    },
    accepted: {
      label: "Accepted",
      bg: colors?.successBg || "#DFF7E7",
      fg: colors?.success || "#16A34A",
    },
    rejected: {
      label: "Rejected",
      bg: colors?.dangerBg || "#FADDDD",
      fg: colors?.danger || "#EF4444",
    },
  };

  const v = map[status] || map.submitted;

  return (
    <Chip
      label={v.label}
      sx={{
        height: "28px",
        borderRadius: "8px",
        bgcolor: v.bg,
        color: v.fg,
        fontFamily: ff,
        fontSize: "12px",
        fontWeight: 400,
        "& .MuiChip-label": {
          px: "14px",
        },
      }}
    />
  );
}

export default function ProjectDetailsHeader({ item, onBack }) {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  const titleColor = colors?.text || (isDark ? "#E2E8F0" : "#111827");
  const secondary = colors?.secondary || (isDark ? "#94A3B8" : "#6B7280");

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
        <IconButton
          onClick={onBack}
          sx={{
            width: 36,
            height: 36,
            borderRadius: "10px",
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: ff,
              fontSize: "18px",
              fontWeight: 600,
              lineHeight: "24px",
              color: titleColor,
              mb: "6px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {item?.title || "AI-Powered Campus Assistant Chatbot"}
          </Typography>

          <Typography
            sx={{
              fontFamily: ff,
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "20px",
              color: secondary,
            }}
          >
            {item?.domain || "AI & Machine Learning"}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          flexShrink: 0,
        }}
      >
        <StatusChip status={item?.status || "submitted"} />

        <Box sx={{ textAlign: "right" }}>
          <Typography
            sx={{
              fontFamily: ff,
              fontSize: "12px",
              fontWeight: 400,
              lineHeight: "18px",
              color: secondary,
            }}
          >
            Academic Year
          </Typography>
          <Typography
            sx={{
              fontFamily: ff,
              fontSize: "18px",
              fontWeight: 500,
              lineHeight: "22px",
              color: titleColor,
            }}
          >
            {item?.academicYear || "2025/2026"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}