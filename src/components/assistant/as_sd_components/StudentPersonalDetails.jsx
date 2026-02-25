// src/components/assistant/as_sd_components/StudentPersonalDetails.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { useThemeContext } from "../../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

function ReadonlyField({ label, value }) {
  const { theme: appTheme, colors } = useThemeContext();
  const isDark = colors?.mode === "dark" || appTheme === "dark";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Typography
        variant="caption"
        sx={{
          fontSize: { xs: 13, md: 16 },
          color: "#64748B",
          ml: 1,
        }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          width: { xs: "100%", md: 500 },
          height: 48,
          borderRadius: "6px",
          border: `1px solid ${colors?.border || (isDark ? "#374151" : "#E5E7EB")}`,
          bgcolor: colors?.box || "#FFFFFF",
          pr: "8px",
          pl: "16px",
          display: "flex",
          alignItems: "center",
          fontWeight: 400,
          fontSize: { xs: 14, md: 18 },
          color: "#020617",
        }}
      >
        {value || "-"}
      </Box>
    </Box>
  );
}

export default function StudentPersonalDetails({
  name,
  studentId,
  nationalId,
  nationality,
  gender,
  dateOfBirth,
  enrollmentDate,
  religion,
}) {
  const { t } = useTranslation();
  const { colors } = useThemeContext();

  const genderLabel =
    gender && typeof gender === "string"
      ? t(gender.toLowerCase()) || gender
      : gender || "-";

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        maxWidth: 1292,
        pt: "10px",
        pr: "10px",
        pb: "15px",
        pl: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <Typography
        sx={{
          width: 1272,
          height: 32,
          fontFamily: "Inter, sans-serif",
          fontSize: "30px",
          fontWeight: 500,
          lineHeight: "32px",
          letterSpacing: "0%",
          color: colors?.text,
        }}
      >
        {t("Personal Details") || "Personal Details"}
      </Typography>

      <Box
        sx={{
          display: "grid",
          pl: { xs: 0, md: "40px" },
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          columnGap: { xs: "16px", md: "16px" },
          rowGap: "16px",
        }}
      >
        <ReadonlyField label={t("Name") || "Name"} value={name} />
        <ReadonlyField label={t("Student ID") || "Student ID"} value={studentId} />
        <ReadonlyField
          label={t("National Id") || "National Id"}
          value={nationalId}
        />
        <ReadonlyField
          label={t("Nationality") || "Nationality"}
          value={nationality}
        />
        <ReadonlyField label={t("Gender") || "Gender"} value={genderLabel} />
        <ReadonlyField
          label={t("Date of Birth") || "Date of Birth"}
          value={dateOfBirth}
        />
        <ReadonlyField
          label={t("Enrollment Date") || "Enrollment Date"}
          value={enrollmentDate}
        />
        <ReadonlyField label={t("Religion") || "Religion"} value={religion} />
      </Box>
    </Box>
  );
}





