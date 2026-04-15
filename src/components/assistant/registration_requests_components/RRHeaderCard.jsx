import React from "react";
import { Box, Typography } from "@mui/material";
import { useThemeContext } from "@/services/theme_context.jsx";
import { useTranslation } from "react-i18next";

export default function RRHeaderCard({ header }) {
  const { colors } = useThemeContext();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const isDark = colors?.mode === "dark";

  const primaryText = isDark ? colors?.text || "#E5E7EB" : "#000000";
  const mutedText = isDark ? "#CBD5E1" : "rgba(0,0,0,0.70)";

  //  Divider موحد
  const figmaDivider = isDark ? "#374151" : "#D9D9D9";

  const h = header || {};
  const title = h.title || "Course Registration Review";
  const academicYear = h.academicYear || "2025-2026";
  const semester = h.semester || "Second Semester";
  const submissionDate = h.submissionDate || "08/02/2026";
  const statusLabel = h.statusLabel || "Under Review";

  const Badge = (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        px: "16px",
        py: "8px",
        borderRadius: "6px",
        bgcolor: "#FFFBE8",
        height: "33px",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          bgcolor: "#FBBF24",
        }}
      />
      <Typography
        sx={{
          fontFamily: "Inter",
          fontWeight: 400,
          fontSize: "14px",
          lineHeight: "14px",
          color: "#00000",
        }}
      >
        {t(statusLabel)}
      </Typography>
    </Box>
  );

  const SubmissionBlock = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        alignItems: isRTL ? "flex-start" : "flex-end",
      }}
    >
      <Typography
        sx={{
          fontFamily: "Inter",
          fontWeight: 400,
          fontSize: "16px",
          lineHeight: "19px",
          color: mutedText,
          whiteSpace: "nowrap",
        }}
      >
        {t("Submission Date")}: {submissionDate}
      </Typography>
      {Badge}
    </Box>
  );

  return (
    <Box
      dir={isRTL ? "rtl" : "ltr"}
      sx={{
        width: "100%",
        pt: "40px",
        pb: "12px",
        px: "48px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "226px 1fr 226px",
          alignItems: "start",
          "@media (max-width:1280px)": {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          },
        }}
      >
        <Box sx={{ "@media (max-width:1280px)": { display: "none" } }}>
          {isRTL && SubmissionBlock}
        </Box>

        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              fontFamily: "Inter",
              fontWeight: 400,
              fontSize: "30px",
              lineHeight: "30px",
              color: primaryText,
              whiteSpace: "nowrap",
              "@media (max-width:1280px)": {
                fontSize: "26px",
                lineHeight: "28px",
                whiteSpace: "normal",
              },
            }}
          >
            {t(title)}
          </Typography>

          <Box
            sx={{
              mt: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 400,
                fontSize: "18px",
                lineHeight: "18px",
                color: mutedText,
              }}
            >
              {t("Academic Year")} {academicYear}
            </Typography>

            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 400,
                fontSize: "18px",
                lineHeight: "18px",
                color: mutedText,
              }}
            >
              {t(semester)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ "@media (max-width:1280px)": { display: "none" } }}>
          {!isRTL && SubmissionBlock}
        </Box>

        <Box
          sx={{
            display: "none",
            "@media (max-width:1280px)": {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              width: "100%",
            },
          }}
        >
          <Typography
            sx={{
              fontFamily: "Inter",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "19px",
              color: mutedText,
            }}
          >
            {t("Submission Date")}: {submissionDate}
          </Typography>
          {Badge}
        </Box>
      </Box>

      
      <Box
        sx={{
          width: "100%",
          height: "28px",
          display: "flex",
          alignItems: "center",
          mt: "12px",
          "@media (max-width:1280px)": {
            height: "16px",
          },
        }}
      >
        <Box sx={{ width: "100%", height: "1px", bgcolor: figmaDivider }} />
      </Box>
    </Box>
  );
}