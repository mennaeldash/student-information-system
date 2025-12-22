import React from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Divider,
  Button,
} from "@mui/material";
import Close from "@mui/icons-material/Close";
import { useThemeContext } from "../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

export default function RegistrationSummary({
  selected = [],
  onRemove,
  maxCredits = 18,
  onSubmit,
}) {
  const { colors } = useThemeContext();
  const { t } = useTranslation();

  const totalCredits = selected.reduce((sum, c) => sum + (c.credits || 0), 0);
  const overLimit = totalCredits > maxCredits;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: `1px solid ${colors?.border}`,
        bgcolor: colors?.box,
        p: 2,

        // sticky فقط لما المساحة تسمح (من lg أو لما الحاوية كبيرة)
        position: { xs: "static", lg: "sticky" },
        top: { lg: 16 },
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
        {t("registration_summary.title")}
      </Typography>

      <Typography variant="caption" sx={{ color: colors?.secondary }}>
        {t("registration_summary.selected_courses")}
      </Typography>

      <Box sx={{ mt: 1.5, display: "grid", gap: 1 }}>
        {selected.length === 0 && (
          <Typography variant="body2" sx={{ color: colors?.secondary }}>
            {t("registration_summary.no_courses_selected")}
          </Typography>
        )}

        {selected.map((c) => (
          <Paper
            key={c.id}
            elevation={0}
            sx={{
              p: 1,
              borderRadius: 2,
              border: `1px solid ${colors?.border}`,
              bgcolor: colors?.background,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {c.code} — {c.name}
              </Typography>
              <Typography variant="caption" sx={{ color: colors?.secondary }}>
                {c.credits} {t("credits")}
              </Typography>
            </Box>

            <IconButton size="small" onClick={() => onRemove(c.id)}>
              <Close fontSize="small" />
            </IconButton>
          </Paper>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "grid", gap: 0.5, mb: 1 }}>
        <Typography variant="body2" sx={{ display: "flex", justifyContent: "space-between" }}>
          <span>{t("registration_summary.total_credits")}</span>
          <b>{totalCredits}</b>
        </Typography>
        <Typography variant="body2" sx={{ display: "flex", justifyContent: "space-between", color: colors?.secondary }}>
          <span>{t("registration_summary.maximum_credits")}</span>
          <span>{maxCredits}</span>
        </Typography>
      </Box>

      <Button
        fullWidth
        variant="contained"
        onClick={onSubmit}
        disabled={selected.length === 0 || overLimit}
        sx={{
          borderRadius: 2,
          textTransform: "none",
          boxShadow: "none",
          backgroundColor: colors?.square + " !important",
          color: "white !important",
        }}
      >
        {t("registration_summary.submit_registration")}
      </Button>

      {overLimit && (
        <Typography variant="caption" sx={{ mt: 1, display: "block", color: "#dc2626" }}>
          {t("registration_summary.over_limit")}
        </Typography>
      )}
    </Paper>
  );
}
