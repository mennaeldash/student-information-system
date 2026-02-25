// src/components/assistant/as_rr_components/RegistrationRequestCard.jsx
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useThemeContext } from "../../../services/theme_context.jsx";

const ff =
  'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';

function StatusChip({ status }) {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  const map = {
    under_review: {
      label: "Under Review",
      dot: colors?.warning || "#F59E0B",
      bg: colors?.warningBg || "#FFFEBB",
      fg: colors?.warning || "#F59E0B",
    },
    approved: {
      label: "Approved",
      dot: colors?.success || "#16A34A",
      bg: colors?.successBg || "#EFFFF4",
      fg: colors?.success || "#16A34A",
    },
    edit_requested: {
      label: "Edit Requested",
      dot: colors?.edit || "#D97706",
      bg: colors?.editBg || "#FFF5E6",
      fg: colors?.edit || "#D97706",
    },
    rejected: {
      label: "Rejected",
      dot: colors?.danger || "#EF4444",
      bg: colors?.dangerBg || "#FFECEC",
      fg: colors?.danger || "#EF4444",
    },
  };

  const v = map[status] || map.under_review;

  return (
    <Box
      sx={{
        width: "126px",
        height: "31px",
        borderRadius: "6px",
        px: "16px",
        py: "8px",
        display: "flex",
        alignItems: "center",
        gap: "5px",
        bgcolor: isDark ? "rgba(255,255,255,0.06)" : "#FFFBEB",
        boxSizing: "border-box",
        justifyContent: "center",
      }}
    >
      <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: v.dot, flex: "0 0 auto" }} />
      <Typography
        sx={{
          fontFamily: ff,
          fontSize: "12px",
          fontWeight: 400,
          color: isDark ? "rgba(226,232,240,0.85)" : "black",
          whiteSpace: "nowrap",
        }}
      >
        {v.label}
      </Typography>
    </Box>
  );
}

export default function RegistrationRequestCard({ item, onView }) {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  const textMain = isDark ? "rgba(226,232,240,0.95)" : "#111827";
  const textSub = isDark ? "rgba(226,232,240,0.70)" : (colors?.textSecondary || "#6B7280");

  const cardBg = isDark ? (colors?.rrCardBg || "rgba(255,255,255,0.03)") : (colors?.rrCardBg || "#F8F8F8");
  const cardBorder = isDark ? "rgba(255,255,255,0.10)" : (colors?.border || "#E5E7EB");
  const divider = isDark ? "rgba(255,255,255,0.10)" : (colors?.rrDivider || "#D9D9D9");

  const btnBg = isDark ? (colors?.rrBtnBg || "rgba(255,255,255,0.08)") : (colors?.rrBtnBg || "#D3E4F7");
  const btnFg = isDark ? (colors?.rrBtnFg || colors?.primary || "#9EC8FF") : (colors?.rrBtnFg || "#2563EB");
  const btnHover = isDark ? (colors?.rrBtnHover || "rgba(255,255,255,0.12)") : (colors?.rrBtnHover || "rgba(211,228,247,0.85)");

  return (
    <Box
      sx={{
        width: "635px",
        height: "224px",
        borderRadius: "8px",
        bgcolor: cardBg,
        border: `1px solid ${cardBorder}`,
        boxShadow: isDark ? "none" : "0px 0px 4px rgba(0,0,0,0.25)",
        overflow: "hidden",
        position: "relative",
        isolation: "isolate",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "75px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pt: "6px",
          pr: "7px",
          pb: "1px",
          pl: "12px",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 2,
          "& *": { textDecoration: "none !important" },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
          <Box
            sx={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              bgcolor: "#71717A",
              flex: "0 0 auto",
            }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              noWrap
              sx={{
                fontFamily: ff,
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "20px",
                color: textMain,
              }}
            >
              {item?.studentName}
            </Typography>
            <Typography
              sx={{
                fontFamily: ff,
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "20px",
                color: textSub,
              }}
            >
              {item?.studentId}
            </Typography>
          </Box>
        </Box>

        <StatusChip status={item?.status} />
      </Box>

      <Box sx={{ width: "100%", height: "1px", bgcolor: divider, position: "relative", zIndex: 2 }} />

      <Box
        sx={{
          width: "100%",
          height: "76px",
          display: "flex",
          alignItems: "center",
          px: "28px",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Box sx={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", columnGap: "26px" }}>
          <Box>
            <Typography sx={{ fontFamily: ff, fontSize: "15px", fontWeight: 400, lineHeight: "20px", color: textSub }}>
              Program
            </Typography>
            <Typography sx={{ fontFamily: ff, fontSize: "15px", fontWeight: 400, lineHeight: "20px", color: textMain }}>
              {item?.program}
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ fontFamily: ff, fontSize: "15px", fontWeight: 400, lineHeight: "20px", color: textSub }}>
              Level
            </Typography>
            <Typography sx={{ fontFamily: ff, fontSize: "15px", fontWeight: 400, lineHeight: "20px", color: textMain }}>
              {item?.level}
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ fontFamily: ff, fontSize: "15px", fontWeight: 400, lineHeight: "20px", color: textSub }}>
              Request Credit
            </Typography>
            <Typography sx={{ fontFamily: ff, fontSize: "15px", fontWeight: 400, lineHeight: "20px", color: textMain }}>
              {item?.requestCredit}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          width: "calc(100% - 24px)",
          height: "1px",
          bgcolor: divider,
          mx: "12px",
          position: "relative",
          zIndex: 2,
                    mt: "4px",

          
        }}
      />

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          pr: "12px",
          pb: "12px",
          pt: "12px",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Button
          onClick={() => onView?.(item)}
          sx={{
            width: "140px",
            height: "40px",
            borderRadius: "8px",
            bgcolor: btnBg,
            color: btnFg,
            textTransform: "none",
            fontFamily: ff,
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "20px",
            boxShadow: "none",
            "&:hover": { bgcolor: btnHover, boxShadow: "none" },
          }}
        >
          View Request
        </Button>
      </Box>

      <Box sx={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", bgcolor: "transparent" }} />
    </Box>
  );
}