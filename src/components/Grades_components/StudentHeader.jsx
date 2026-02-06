import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { UserRound } from "lucide-react";
import { useThemeContext } from "../../services/theme_context.jsx";

export default function StudentHeader({
  isVerySmall,
  isDesktop,
  isRTL,
  studentInfo,
  t,
}) {
  const { colors, mode } = useThemeContext();
  const isDark = mode === "dark";

  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        p: isVerySmall ? 2 : 3,
        borderRadius: "8px",
        backgroundColor: colors?.box,
        border: `1px solid ${colors?.border}`,
        display: "flex",
        flexDirection: isVerySmall ? "column" : "row",
        alignItems: "center",
        gap: isVerySmall ? 1.5 : 2.5,
        boxSizing: "border-box",
        mb: isVerySmall ? 2 : 2.5,
      }}
    >
      {/* Avatar */}
      <Box
        sx={{
          width: isVerySmall ? 60 : 80,
          height: isVerySmall ? 60 : 80,
          minWidth: isVerySmall ? 60 : 80,
          minHeight: isVerySmall ? 60 : 80,
          borderRadius: "50%",
          border: `1px solid ${colors?.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors?.chosen, 
          color: colors?.text,
          boxSizing: "border-box",
        }}
      >
        <UserRound size={isVerySmall ? 30 : 40} strokeWidth={2} color={colors?.text} />
      </Box>

      {/* Info */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          flex: 1,
          minWidth: 0,
          textAlign: isVerySmall ? "center" : isRTL ? "right" : "left",
        }}
      >
        {/* Name + Status */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
            justifyContent: isVerySmall ? "center" : "flex-start",
          }}
        >
          <Typography
            sx={{
              width: isDesktop ? "316px" : "auto",
              maxWidth: "100%",
              fontSize: isVerySmall ? 18 : 22,
              fontWeight: 400,
              m: 0,
              p: 0,
              color: colors?.text,
              lineHeight: isVerySmall ? "24px" : "32px",
              whiteSpace: isVerySmall ? "normal" : "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {studentInfo?.name}
          </Typography>

          <Chip
            label={studentInfo?.status}
            sx={{
              height: 26,
              px: 1,
              borderRadius: "8px",
              fontSize: 14,
              fontWeight: 400,
              flexShrink: 0,
              backgroundColor: isDark ? "rgba(34,197,94,0.16)" : "#DCFCE7",
              color: isDark ? "#86EFAC" : "#166534",
              border: `0.5px solid ${isDark ? "rgba(34,197,94,0.5)" : "#166534"}`,
              "& .MuiChip-label": { px: 0.5 },
            }}
          />
        </Box>

        {/* ID */}
        <Typography
          sx={{
            m: 0,
            p: 0,
            fontSize: isVerySmall ? 16 : 20,
            fontWeight: 400,
            color: colors?.secondary,
            lineHeight: "20px",
          }}
        >
          {t?.("id") || "ID"} : {studentInfo?.id}
        </Typography>
      </Box>
    </Box>
  );
}
