// src/components/doctor/dr-pr-components/PersonalDetails.jsx
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
        sx={{ fontSize: F.label, color: colors?.secondary, ml: 1 }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          minHeight: { xs: 40, md: 48 },
          width: "100%",
          borderRadius: "8px",
          border: `1px solid ${colors?.border || (isDark ? "#374151" : "#E5E7EB")}`,
          bgcolor: colors?.box || "#FFFFFF",
          px: 1.5,
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Typography
          sx={{
            fontSize: F.value,
            color: colors?.text || "#111827",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={value || ""}
        >
          {value || "—"}
        </Typography>
      </Box>
    </Box>
  );
}

export default function PersonalDetails({
  name,
  doctorId,
  nationalId,
  nationality,
  gender,
  dateOfBirth,
}) {
  const { t } = useTranslation();
  const { colors } = useThemeContext();

  const titleSize = "clamp(16px, calc(16px + 10 * (100vw / 1720)), 24px)";

  return (
    <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2.2 }}>
      <Typography sx={{ fontSize: titleSize, fontWeight: 500, color: colors?.text }}>
        {t("Personal Details") || "Personal Details"}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          columnGap: { xs: 2, md: 3 },
          rowGap: 2.5,
        }}
      >
        <ReadonlyField label={t("Name") || "Name"} value={name} />
        <ReadonlyField label={t("Doctor Id") || "Doctor ID"} value={doctorId} />
        <ReadonlyField label={t("National Id") || "National Id"} value={nationalId} />
        <ReadonlyField label={t("Nationality") || "Nationality"} value={nationality} />
        <ReadonlyField label={t("Gender") || "Gender"} value={gender} />
        <ReadonlyField label={t("Date Of Birth") || "Date of Birth"} value={dateOfBirth} />
      </Box>
    </Box>
  );
}
