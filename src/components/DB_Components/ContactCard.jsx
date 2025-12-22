import React from "react";
import { Paper, Typography, Box, Divider, Button } from "@mui/material";
import { useThemeContext } from "../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";
import UseProfile from "../../hooks/UseProfile";

export default function ContactInfoCard({ isRTL }) {
  const { colors } = useThemeContext();
  const { t, i18n } = useTranslation();
  const { contact, error } = UseProfile();

  // استخدمي isRTL إن كان مبعوت؛ وإلا خديه من اتجاه اللغة

  if (error) return <Typography color="error">{error}</Typography>;
  if (!contact) return <Typography>{t("loading")}</Typography>;

  return (
    <Paper
      elevation={0}
      dir={isRTL ? "rtl" : "ltr"}
      sx={{
        p: { xs: 2, sm: 3 },
        pt: 2.5,
        borderRadius: 3,
        border: `1px solid ${colors?.border || "#e8edf2"}`,
        bgcolor: colors?.box || "#fff",
        color: colors?.text || "#000",
        fontFamily: colors?.fontFamily,
        mb: 3,
        width: "100%",
        direction: isRTL ? "rtl" : "ltr",
        textAlign: isRTL ? "right" : "left",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: isRTL ? "row-reverse" : "row",
          mb: { xs: 1.25, sm: 1.5 },
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{ fontSize: 18, color: colors?.text || "#343d4c" }}
        >
          {t("contact_information")}
        </Typography>

        <Button
          size="small"
          variant="outlined"
          sx={{
            fontWeight: 500,
            fontSize: 13,
            py: 0.2,
            px: 1.4,
            color: colors?.textSecondary || "#64748B",
            borderColor: "#e2e8f0",
            background: "#fafbfd",
            borderRadius: 2,
            textTransform: "none",
            boxShadow: "none",
            minWidth: 0,
            "&:hover": { borderColor: "#b6c1d4", background: "#f6faff" },
          }}
        >
          {t("request_edit")}
        </Button>
      </Box>

      <Divider sx={{ mb: { xs: 2, sm: 3 }, bgcolor: colors?.border, height: 1 }} />

      {/* Content */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: { xs: 1.25, sm: 2 },
          width: "100%",
          direction: isRTL ? "rtl" : "ltr",
        }}
      >
        {/* العمود الأول */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 0.6, sm: 1.2 } }}>
          <InfoLabel colors={colors} isRTL={isRTL}>{t("current_city")}</InfoLabel>
          <InfoValue colors={colors} isRTL={isRTL}>{contact.city}</InfoValue>

          <InfoLabel colors={colors} isRTL={isRTL}>{t("current_address")}</InfoLabel>
          <InfoValue colors={colors} isRTL={isRTL}>
            {contact.street + " " + contact.address_city + " " + contact.center}
          </InfoValue>

          <InfoLabel colors={colors} isRTL={isRTL}>{t("home_phone")}</InfoLabel>
          <InfoValue colors={colors} isRTL={isRTL}>{contact.homePhone}</InfoValue>

          <InfoLabel colors={colors} isRTL={isRTL}>{t("personal_email")}</InfoLabel>
          <InfoValue colors={colors} isRTL={isRTL}>{contact.personalEmail}</InfoValue>
        </Box>

        {/* العمود الثاني */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 0.6, sm: 1.2 } }}>
          <InfoLabel colors={colors} isRTL={isRTL}>{t("mobile")}</InfoLabel>
          <InfoValue colors={colors} isRTL={isRTL}>{contact.mobile}</InfoValue>

          <InfoLabel colors={colors} isRTL={isRTL}>{t("alternative_email")}</InfoLabel>
          <InfoValue colors={colors} isRTL={isRTL}>{contact.alternativeEmail}</InfoValue>

          <InfoLabel colors={colors} isRTL={isRTL}>{t("postal_code")}</InfoLabel>
          <InfoValue colors={colors} isRTL={isRTL}>{contact.postalCode}</InfoValue>

          <InfoLabel colors={colors} isRTL={isRTL}>{t("po_box")}</InfoLabel>
          <InfoValue colors={colors} isRTL={isRTL}>{contact.poBox}</InfoValue>
        </Box>
      </Box>
    </Paper>
  );
}

/* Label */
function InfoLabel({ children, colors, isRTL }) {
  return (
    <Typography
      sx={{
        fontSize: 13,
        color: colors?.secondary,
        fontWeight: 500,
        mt: { xs: 0.75, sm: 2 },
        mb: { xs: 0.1, sm: 0.15 },
        lineHeight: { xs: 1.15, sm: 1.25 },
        textAlign: isRTL ? "right" : "left",
      }}
    >
      {children}
    </Typography>
  );
}

/* Value */
function InfoValue({ children, colors, isRTL }) {
  return (
    <Typography
      sx={{
        fontSize: 15.3,
        color: colors?.text || "#222",
        fontWeight: 500,
        mb: { xs: 1.2, sm: 0.5 },
        lineHeight: { xs: 1.2, sm: 1.3 },
        textAlign: isRTL ? "right" : "left",
        wordBreak: "break-word",
        whiteSpace: "normal",
      }}
    >
      {children}
    </Typography>
  );
}
