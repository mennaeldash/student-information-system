import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useThemeContext } from "../../services/theme_context.jsx";

export default function GpaSummary({ isVerySmall, isTablet, isRTL, t, gpaData }) {
  const { colors } = useThemeContext();

  const semesterPct = useMemo(() => {
    const v = Number(gpaData?.semester_gpa || 0);
    return Math.max(0, Math.min(100, (v / 4) * 100));
  }, [gpaData]);

  const cumulativePct = useMemo(() => {
    const v = Number(gpaData?.cumulative_gpa || 0);
    return Math.max(0, Math.min(100, (v / 4) * 100));
  }, [gpaData]);

  const trackBg = colors?.chosen; // ✅ نفس فكرة input bg في الثيم
  const barBlue = colors?.primary; // ✅ من theme_context
  const barGreen = "#16A34A"; // لو عايزة كمان من الثيم قولي اضيف key

  return (
    <Box
      sx={{
        flex: isTablet ? "unset" : 1,
        width: isTablet ? "100%" : "auto",
        height: "auto",
        mt: isTablet ? 0 : "40px",

        pt: "66px",
        pb: "85px",
        px: isVerySmall ? "16px" : "30px",

        borderRadius: "8px",
        backgroundColor: colors?.box,
        border: `1px solid ${colors?.border}`,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      <Typography
        sx={{
          fontSize: isVerySmall ? 18 : 22,
          fontWeight: 600,
          lineHeight: "28px",
          mb: "38px",
          color: colors?.text,
          textAlign: isRTL ? "right" : "left",
        }}
      >
        {t?.("GPA Summary") || "GPA Summary"}
      </Typography>

      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "35px" }}>
        {/* Semester GPA */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: colors?.text }}>
              {t?.("Semester GPA") || "Semester GPA"}
            </Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors?.text }}>
              {Number(gpaData?.semester_gpa || 0).toFixed(2)}/4.00
            </Typography>
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "8px",
              borderRadius: "9999px",
              backgroundColor: trackBg,
              position: "relative",
              overflow: "hidden",
              border: `1px solid ${colors?.border}`,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "8px",
                width: `${semesterPct}%`,
                backgroundColor: barBlue,
                borderRadius: "9999px",
              }}
            />
          </Box>
        </Box>

        {/* Cumulative GPA */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: colors?.text }}>
              {t?.("Cumulative GPA") || "Cumulative GPA"}
            </Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors?.text }}>
              {Number(gpaData?.cumulative_gpa || 0).toFixed(2)}/4.00
            </Typography>
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "8px",
              borderRadius: "9999px",
              backgroundColor: trackBg,
              position: "relative",
              overflow: "hidden",
              border: `1px solid ${colors?.border}`,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "8px",
                width: `${cumulativePct}%`,
                backgroundColor: barGreen,
                borderRadius: "9999px",
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
