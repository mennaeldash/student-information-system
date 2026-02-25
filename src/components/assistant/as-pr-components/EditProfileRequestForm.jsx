// src/components/assistant/as-pr-components/EditProfileRequestForm.jsx
import React from "react";
import { Box, Typography, TextField, Divider } from "@mui/material";
import { useThemeContext } from "../../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

export default function EditProfileRequestForm({ form, setForm }) {
  const { colors } = useThemeContext();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const border = colors?.border || "#E5E7EB";
  const boxBg = colors?.box || "#FFFFFF";
  const textColor = colors?.text || "#111827";
  const muted = colors?.textSecondary || colors?.secondary || "#6B7280";

  const F = {
    sectionTitle: "clamp(18px, calc(16px + 4 * (100vw / 1720)), 30px)",
    label: "clamp(16px, calc(16px + 2 * (100vw / 1720)), 18px)",
  };

  const onChange = (key) => (e) => {
    const v = e.target.value;
    setForm((p) => ({ ...p, [key]: v }));
  };

  const grid = {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
    gap: 3,
    width: "100%",
    minWidth: 0,
    px: "40px",
    direction: isRTL ? "rtl" : "ltr",
  };

  const tfSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      bgcolor: boxBg,
      pl: "8px",
    },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: border },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: border },

    "& .MuiInputLabel-root": {
      fontSize: F.label,
      color: muted,
    },
  };

  const disabledTfSx = {
    ...tfSx,
    "& .MuiOutlinedInput-root": {
      ...tfSx["& .MuiOutlinedInput-root"],
      bgcolor: "#F3F4F6",
    },
  };

  const SectionTitle = ({ children }) => (
    <Typography
      sx={{
        fontSize: F.sectionTitle,
        fontWeight: 500,
        color: textColor,
        mb: 1.5,
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
        px: "20px",
        textAlign: isRTL ? "right" : "left",
      }}
    >
      {children}
    </Typography>
  );

  const Field = ({
    topLabel,
    disabled = false,
    sx,
    ...props
  }) => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <Typography
        sx={{
          fontSize: F.label,
          color: muted,
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
          textAlign: isRTL ? "right" : "left",
        }}
      >
        {topLabel}
      </Typography>

      <TextField
        {...props}
        label=""
        placeholder=""
        fullWidth
        disabled={disabled}
        sx={disabled ? disabledTfSx : tfSx}
        InputLabelProps={{ shrink: false }}
      />
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <SectionTitle>{t("Personal Details") || "Personal Details"}</SectionTitle>

        <Box sx={grid}>
          <Field
            topLabel={t("Name") || "Name"}
            value={form.name || ""}
            onChange={onChange("name")}
          />

          <Field
            topLabel={t("TA ID") || "TA ID"}
            value={form.taId || ""}
            onChange={onChange("taId")}
            disabled
          />

          <Field
            topLabel={t("National Id") || "National Id"}
            value={form.nationalId || ""}
            onChange={onChange("nationalId")}
          />

          <Field
            topLabel={t("Nationality") || "Nationality"}
            value={form.nationality || ""}
            onChange={onChange("nationality")}
          />

          <Field
            topLabel={t("Gender") || "Gender"}
            value={form.gender || ""}
            onChange={onChange("gender")}
          />

          <Field
            topLabel={t("Date of Birth") || "Date of Birth"}
            value={form.dateOfBirth || ""}
            onChange={onChange("dateOfBirth")}
          />
        </Box>

        <Divider sx={{ mt: 4 }} />
      </Box>

      <Box>
        <SectionTitle>
          {t("Contact Information") || "Contact Information"}
        </SectionTitle>

        <Box sx={grid}>
          <Field
            topLabel={t("Personal Email") || "Personal Email"}
            value={form.personalEmail || ""}
            onChange={onChange("personalEmail")}
          />

          <Field
            topLabel={t("Primary Email") || "Primary Email"}
            value={form.primaryEmail || ""}
            onChange={onChange("primaryEmail")}
            disabled
          />

          <Field
            topLabel={t("Phone Number") || "Phone Number"}
            value={form.phoneNumber || ""}
            onChange={onChange("phoneNumber")}
          />

          <Field
            topLabel={t("Current Address") || "Current Address"}
            value={form.currentAddress || ""}
            onChange={onChange("currentAddress")}
          />
        </Box>

        <Divider sx={{ mt: 4 }} />
      </Box>

      {/* Academic Information */}
      <Box>
        <SectionTitle>
          {t("Academic Information") || "Academic Information"}
        </SectionTitle>

        <Box sx={grid}>
          <Field
            topLabel={t("Department") || "Department"}
            value={form.department || ""}
            onChange={onChange("department")}
          />

          <Box sx={{ display: { xs: "none", md: "block" } }} />
        </Box>
      </Box>
    </Box>
  );
}
