// src/components/assistant/as-pr-components/AcademicInformation.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { useThemeContext } from "../../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

function ReadonlyField({ label, value }) {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  // ✅ Responsive fonts → hit ORIGINAL sizes at 1720px+
  // ORIGINAL: label xs13 md16, value xs14 md18
  const F = {
    label: "clamp(13px, calc(13px + 3 * (100vw / 1720)), 16px)", // -> 16 @1720+
    value: "clamp(14px, calc(14px + 4 * (100vw / 1720)), 18px)", // -> 18 @1720+
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Typography
        variant="caption"
        sx={{
          fontSize: F.label, // ✅ fonts only
          color: colors?.secondary || "#6B7280",
          ml: 1,
        }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          minHeight: { xs: 40, md: 48 }, // ✅ unchanged
          width: "100%",
          borderRadius: "8px",
          border: `1px solid ${
            colors?.border || (isDark ? "#374151" : "#E5E7EB")
          }`,
          bgcolor: colors?.box || "#FFFFFF",
          px: 1.5, // ✅ unchanged
          display: "flex",
          alignItems: "center",
          fontWeight: 400,
          fontSize: F.value, // ✅ fonts only
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

  // ✅ Responsive section title → hit ORIGINAL size at 1720px+
  // ORIGINAL: xs18 md24
  const sectionTitleFont =
    "clamp(18px, calc(18px + 6 * (100vw / 1720)), 24px)"; // -> 24 @1720+

  return (
    <Box
      component="section"
      sx={{
        mt: 4, // ✅ unchanged
        pt: 3, // ✅ unchanged
        borderTop: `1px solid ${colors?.border || "#E5E7EB"}`,
        display: "flex",
        flexDirection: "column",
        gap: 2, // ✅ unchanged
      }}
    >
      <Typography
        sx={{
          fontSize: sectionTitleFont, // ✅ fonts only
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
          pl: { xs: 0, md: 6 }, // ✅ unchanged
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, // ✅ unchanged
          columnGap: { xs: 2, md: 3 }, // ✅ unchanged
          rowGap: 2.5, // ✅ unchanged
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
