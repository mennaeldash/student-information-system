// src/components/ST-SE-components/EvaluationCommentBox.jsx
import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useThemeContext } from "../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

export default function EvaluationCommentBox({
  value,
  onChange,
  onSave,
  disabled = false,
}) {
  const { colors } = useThemeContext();
  const { t } = useTranslation();

  return (
    <Box sx={{ mt: 0 }}>
      <Typography
        sx={{
          fontSize: 16,
          fontWeight: 500,
          mb: 1,
          color: colors?.text,
        }}
      >
        {t("Comments")} *
      </Typography>

    <TextField
  multiline
  rows={4}
  fullWidth
  value={value}
  onChange={(e) => onChange(e.target.value)}
  placeholder="Write your comment here..."
  sx={{
    borderRadius: "8px",

    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",

      "& fieldset": {
        border: `1px solid ${colors?.border}`,
      },

      "&:hover fieldset": {
        border: `1px solid ${colors?.border}`,
      },

      "&.Mui-focused fieldset": {
        border: `1px solid ${colors?.border}`,
      },
    },

    "& .MuiOutlinedInput-root.Mui-focused": {
      boxShadow: "none",
      outline: "none",
    },

    "& textarea": {
      outline: "none",
    },

    "& textarea:focus": {
      outline: "none",
      boxShadow: "none",
    },

    "& textarea:focus-visible": {
      outline: "none",
      boxShadow: "none",
    },
  }}
/>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={disabled}
          sx={{
            px: 7,
            py: 1,
            borderRadius: "8px",
            textTransform: "none",
            fontSize: 16,
            backgroundColor:"#1F609D"
          }}
        >
          {disabled ? t("Saved") : t("Save")}
        </Button>
      </Box>
    </Box>
  );
}
