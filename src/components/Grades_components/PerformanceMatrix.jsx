import React from "react";
import { Box, Typography } from "@mui/material";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Star,
  BarChart3,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useThemeContext } from "../../services/theme_context.jsx";

export default function PerformanceMatrix({
  isVerySmall,
  isTablet,
  isRTL,
  t,
  performanceMatrix,
}) {
  const { colors, mode } = useThemeContext();
  const isDark = mode === "dark";

  // ✅ tint backgrounds (since theme_context doesn't provide them)
  const tintGreen = isDark ? "rgba(34,197,94,0.12)" : "#F0FDF4";
  const tintOrange = isDark ? "rgba(234,88,12,0.12)" : "#FFF7ED";
  const tintBlue = isDark ? "rgba(37,99,235,0.12)" : "#EFF6FF";
  const tintPurple = isDark ? "rgba(164,78,244,0.12)" : "#FAF5FF";

  const pillBlue = isDark ? "rgba(37,99,235,0.16)" : "#DBEAFE";

  const trackBg = colors?.chosen; // نفس اللي استخدمناه قبل كـ track

  const gridCols = isVerySmall ? "1fr" : isTablet ? "1fr" : "repeat(2, 1fr)";

  return (
    <Box
      sx={{
        flex: isTablet ? "unset" : 1,
        width: isTablet ? "100%" : "auto",
        height: "auto",
        p: isVerySmall ? 2 : "16px 24px",
        borderRadius: "8px",
        backgroundColor: colors?.box,
        border: `1px solid ${colors?.border}`,
        boxSizing: "border-box",
      }}
    >
      <Typography
        sx={{
          width: "100%",
          fontSize: isVerySmall ? 18 : 20,
          fontWeight: 500,
          mb: 2,
          color: colors?.text,
          textAlign: isRTL ? "right" : "left",
        }}
      >
        {t?.("Academic Performance Matrix") || "Academic Performance Matrix"}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: gridCols,
          gap: 1,
          direction: isRTL ? "rtl" : "ltr",
          textAlign: isRTL ? "right" : "left",
        }}
      >
        {/* Highest Grade */}
        <CardBox bg={tintGreen} border={colors?.border} pad={isVerySmall}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <ArrowUpCircle size={24} color="#21A753" strokeWidth={2} />
            <TrendingUp size={24} color="#21A753" strokeWidth={2} />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <LabelText isRTL={isRTL} colors={colors}>
              {t?.("HIGHEST GRADE") || "HIGHEST GRADE"}
            </LabelText>

            <Typography sx={{ fontSize: 16, fontWeight: 400, color: colors?.text, mt: 1 }}>
              {performanceMatrix?.highest_grade?.course}
            </Typography>

            <Typography
              sx={{
                fontSize: 25,
                fontWeight: 600,
                color: "#21A753",
                mt: 2,
                lineHeight: 1,
              }}
            >
              {performanceMatrix?.highest_grade?.grade}
            </Typography>
          </Box>
        </CardBox>

        {/* Lowest Grade */}
        <CardBox bg={tintOrange} border={colors?.border} pad={isVerySmall}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <ArrowDownCircle size={24} color="#EA580C" strokeWidth={2} />
            <TrendingDown size={24} color="#EA580C" strokeWidth={2} />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <LabelText isRTL={isRTL} colors={colors}>
              {t?.("LOWEST GRADE") || "LOWEST GRADE"}
            </LabelText>

            <Typography sx={{ fontSize: 16, fontWeight: 400, color: colors?.text, mt: 1 }}>
              {performanceMatrix?.lowest_grade?.course}
            </Typography>

            <Typography
              sx={{
                fontSize: 25,
                fontWeight: 600,
                color: "#EA580C",
                mt: 2,
                lineHeight: 1,
              }}
            >
              {performanceMatrix?.lowest_grade?.grade}
            </Typography>
          </Box>
        </CardBox>

        {/* Current Standing */}
        <CardBox bg={tintBlue} border={colors?.border} pad={isVerySmall} gap={1.5}>
          <Star size={24} color="#2966EC" strokeWidth={2} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <LabelText isRTL={isRTL} colors={colors}>
              {t?.("CURRENT STANDING") || "CURRENT STANDING"}
            </LabelText>

            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "99px",
                height: "37px",
                px: 1.25,
                backgroundColor: pillBlue,
                borderRadius: "20px",
                border: `1px solid ${colors?.border}`,
                boxSizing: "border-box",
              }}
            >
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#1D4ED9", lineHeight: "100%" }}>
                {t?.(performanceMatrix?.current_standing?.status) ||
                  performanceMatrix?.current_standing?.status}
              </Typography>
            </Box>

            <Typography sx={{ fontSize: 14, fontWeight: 400, color: colors?.secondary }}>
              {performanceMatrix?.current_standing?.description}
            </Typography>
          </Box>
        </CardBox>

        {/* Completion Progress */}
        <CardBox bg={tintPurple} border={colors?.border} pad={isVerySmall}>
          <BarChart3 size={24} color="#A44EF4" strokeWidth={2} />

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <LabelText isRTL={isRTL} colors={colors}>
              {t?.("COMPLETION PROGRESS") || "COMPLETION PROGRESS"}
            </LabelText>

            <Typography sx={{ fontSize: 25, fontWeight: 600, color: "#A44EF4", mt: 2, lineHeight: "100%" }}>
              {performanceMatrix?.completion_progress?.percentage}%
            </Typography>

            <Box
              sx={{
                width: "100%",
                height: "8px",
                borderRadius: "9999px",
                backgroundColor: trackBg,
                position: "relative",
                overflow: "hidden",
                mt: "19px",
                border: `1px solid ${colors?.border}`,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "8px",
                  width: `${performanceMatrix?.completion_progress?.percentage || 0}%`,
                  backgroundColor: "#A44EF4",
                  borderRadius: "9999px",
                }}
              />
            </Box>
          </Box>
        </CardBox>
      </Box>
    </Box>
  );
}

/** reusable card box like your old div with padding/radius/gap */
function CardBox({ children, bg, border, pad, gap = 2 }) {
  return (
    <Box
      sx={{
        width: "100%",
        p: pad ? "12px 16px" : "16px 24px",
        borderRadius: "12px",
        backgroundColor: bg,
        display: "flex",
        flexDirection: "column",
        gap,
        boxSizing: "border-box",
        border: `1px solid ${border}`,
      }}
    >
      {children}
    </Box>
  );
}

/** label text with upper/lower behavior based on RTL */
function LabelText({ children, isRTL, colors }) {
  return (
    <Typography
      sx={{
        fontSize: 14,
        fontWeight: 400,
        color: colors?.secondary,
        textTransform: isRTL ? "none" : "uppercase",
      }}
    >
      {children}
    </Typography>
  );
}
