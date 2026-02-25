// src/components/assistant/as-pr-components/AcademicInformation.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { useThemeContext } from "../../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

function ReadonlyField({ label, value }) {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";


  const F = {
    label: "clamp(13px, calc(13px + 3 * (100vw / 1720)), 16px)", 
    value: "clamp(14px, calc(14px + 4 * (100vw / 1720)), 18px)", 
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Typography
        variant="caption"
        sx={{
          fontSize: F.label, 
          color: colors?.secondary || "#6B7280",
          ml: 1,
        }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          minHeight: { xs: 40, md: 48 }, 
          width: "100%",
          borderRadius: "8px",
          border: `1px solid ${
            colors?.border || (isDark ? "#374151" : "#E5E7EB")
          }`,
          bgcolor: colors?.box || "#FFFFFF",
          px: 1.5, 
          display: "flex",
          alignItems: "center",
          fontWeight: 400,
          fontSize: F.value, 
          color: colors?.text || "#111827",
        }}
      >
        {value}
      </Box>
    </Box>
  );
}

export default function AcademicInformation({
  department,
  university,
  faculty,
  academicDegree,
  graduationYear,
  previousExperience,
}) {
  const { t } = useTranslation();
  const { colors } = useThemeContext();


  const sectionTitleFont =
    "clamp(18px, calc(18px + 6 * (100vw / 1720)), 24px)"; 

  return (
    <Box
      component="section"
      sx={{
        mt: 4, 
        pt: 3, 
        borderTop: `1px solid ${colors?.border || "#E5E7EB"}`,
        display: "flex",
        flexDirection: "column",
        gap: 2, 
      }}
    >
      <Typography
        sx={{
          fontSize: sectionTitleFont, 
          fontWeight: 500,
          color: colors?.text || "#111827",
          lineHeight: 1.2,
        }}
      >
        {t("Academic Information") || "Academic Information"}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, 
          columnGap: { xs: 2, md: 3 }, 
          rowGap: 2.5
        }}
      >
        <ReadonlyField label={t("Department") || "Department"} value={department} />
        <ReadonlyField label={t("University") || "University"} value={university} />
        <ReadonlyField label={t("Faculty") || "Faculty"} value={faculty} />
        <ReadonlyField
          label={t("Academic Degree") || "Academic Degree"}
          value={academicDegree}
        />
        <ReadonlyField
          label={t("Graduation Year") || "Graduation Year"}
          value={graduationYear}
        />
        <ReadonlyField
          label={t("Previous Experience") || "Previous Experience"}
          value={previousExperience}
        />
      </Box>
    </Box>
  );
}
