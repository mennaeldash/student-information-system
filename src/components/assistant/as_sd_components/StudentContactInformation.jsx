// src/components/assistant/as_sd_components/StudentContactInformation.jsx
import React from "react";
import { Box, Typography, Card } from "@mui/material";
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

export default function StudentContactInformation({
  personalEmail,
  phoneNumber,
  currentAddress,
}) {
  const { t } = useTranslation();
  const { theme: appTheme, colors } = useThemeContext();
  const isDark = colors?.mode === "dark" || appTheme === "dark";
  const borderColor = colors?.border || (isDark ? "#1E293B" : "#E5E7EB");

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
        mt: "10px",
        borderTop: `1px solid ${borderColor}`,
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
        {t("Contact Information") || "Contact Information"}
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
        <ReadonlyField
          label={t("Personal Email") || "Personal Email"}
          value={personalEmail}
        />
        <ReadonlyField
          label={t("Current Address") || "Current Address"}
          value={currentAddress}
        />
        <ReadonlyField
          label={t("Phone Number") || "Phone Number"}
          value={phoneNumber}
        />
      </Box>
    </Box>
  );
}
