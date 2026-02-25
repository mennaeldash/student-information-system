
// src/components/assistant/as-pr-components/EditProfileRequestDialog.jsx
import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { useThemeContext } from "../../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

export default function EditProfileRequestDialog({
  open,
  onClose,
  onSubmit,
  children,
}) {
  const { colors } = useThemeContext();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const paperBg = colors?.box || "#FFFFFF";
  const textColor = colors?.text || "#111827";
  const muted = colors?.textSecondary || colors?.secondary || "#6B7280";
  const border = colors?.border || "#E5E7EB";
  const primary = colors?.tabtn || colors?.primary || "#1F609D";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      PaperProps={{
        sx: {
          bgcolor: paperBg,
          borderRadius: "8px",
          width: { xs: "95vw", sm: "92vw", md: "964px" },
          maxWidth: "964px",
          boxShadow: "0px 0px 4px rgba(0,0,0,0.25)",
          overflow: "hidden",
          direction: isRTL ? "rtl" : "ltr",
        },
      }}
    >
      <DialogContent
        sx={{
          pt: "30px",
          pr: "20px",
          pb: "30px",
          pl: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
          <Typography
            sx={{
              fontSize: "clamp(18px, calc(22px + 6 * (100vw / 1720)), 30px)",
              fontWeight: 500,
              color: textColor,
                  fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
         
              lineHeight: 1.15,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {t("Edit Profile Request") || "Edit Profile Request"}
          </Typography>

          <Typography
            sx={{
              fontSize: "clamp(14px, calc(12px + 2 * (100vw / 1720)), 14px)",
              fontWeight: 400,
              color: muted,
              lineHeight: 1.3,
              
              textAlign: isRTL ? "right" : "left",
              mt:"8.5px"
            }}
          >
            {t(
              "Submit a change request. Some fields are locked by the university."
            ) ||
              "Submit a change request. Some fields are locked by the university."}
          </Typography>
        </Box>


        <Box sx={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {children}
        </Box>

        {/* Footer buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: isRTL ? "flex-start" : "flex-end",
            gap: 1,
            mt: 1,
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              textTransform: "none",
              borderRadius: "6px",
              height: "32px",
              px: 2,
              fontSize: "clamp(12px, calc(12px + 2 * (100vw / 1720)), 14px)",
              borderColor: border,
              color: textColor,
              "&:hover": { borderColor: border },
            }}
          >
            {t("Cancel") || "Cancel"}
          </Button>

          <Button
            onClick={onSubmit}
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: "6px",
              height: "32px",
              px: 2.2,
              fontSize: "clamp(12px, calc(12px + 2 * (100vw / 1720)), 14px)",
              backgroundColor: primary,
              boxShadow: "none",
              "&:hover": { backgroundColor: primary },
            }}
          >
            {t("Submit") || "Submit"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
