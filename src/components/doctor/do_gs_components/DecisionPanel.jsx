import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useThemeContext } from "../../../services/theme_context.jsx";

const ff =
  'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';

export default function DecisionPanel({
  feedback,
  setFeedback,
  onApprove,
  onReject,
}) {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  const cardBg = colors?.box || (isDark ? "rgba(255,255,255,0.03)" : "#FFFFFF");
  const shadow = isDark ? "none" : "0px 0px 4px rgba(0,0,0,0.25)";
  const titleColor = colors?.text || (isDark ? "#E2E8F0" : "#111827");
  const secondary = colors?.secondary || (isDark ? "#94A3B8" : "#6B7280");
  const border = isDark ? "rgba(255,255,255,0.12)" : "#D9D9D9";

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: "24px",
        bgcolor: cardBg,
        boxShadow: shadow,
        px: "22px",
        py: "18px",
      }}
    >
      <Typography
        sx={{
          fontFamily: ff,
          fontSize: "16px",
          fontWeight: 600,
          lineHeight: "20px",
          color: titleColor,
          mb: "12px",
        }}
      >
        Decision Panel
      </Typography>

      <Typography
        sx={{
          fontFamily: ff,
          fontSize: "12px",
          fontWeight: 400,
          lineHeight: "16px",
          color: secondary,
          mb: "8px",
        }}
      >
        Instructor Comment (Optional)
      </Typography>

      <TextField
        multiline
        minRows={3}
        fullWidth
        value={feedback}
        onChange={(e) => setFeedback?.(e.target.value)}
        placeholder="Add Feedback or Reason for rejection..."
        sx={{
          mb: "16px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            fontFamily: ff,
            bgcolor: "transparent",
            "& fieldset": {
              borderColor: border,
            },
            "&:hover fieldset": {
              borderColor: border,
            },
            "&.Mui-focused fieldset": {
              borderColor: colors?.primary || "#2563EB",
            },
          },
          "& .MuiInputBase-input::placeholder": {
            fontFamily: ff,
            fontSize: "12px",
            opacity: 1,
          },
        }}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
        }}
      >
        <Button
          onClick={onApprove}
          disableElevation
          sx={{
            minWidth: "84px",
            height: "38px",
            borderRadius: "8px",
            bgcolor: colors?.primary || "#2563EB",
            color: "#fff",
            fontFamily: ff,
            fontSize: "12px",
            fontWeight: 400,
            textTransform: "none",
            "&:hover": {
              bgcolor: colors?.primary || "#2563EB",
              opacity: 0.92,
            },
          }}
        >
          Approve
        </Button>

        <Button
          onClick={onReject}
          disableElevation
          sx={{
            minWidth: "84px",
            height: "38px",
            borderRadius: "8px",
            bgcolor: colors?.dangerBg || "#FADDDD",
            color: colors?.danger || "#EF4444",
            fontFamily: ff,
            fontSize: "12px",
            fontWeight: 400,
            textTransform: "none",
            "&:hover": {
              bgcolor: colors?.dangerBg || "#FADDDD",
              opacity: 0.92,
            },
          }}
        >
          Reject
        </Button>
      </Box>
    </Box>
  );
}