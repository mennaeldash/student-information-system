// src/components/ST-SE-components/EvaluationTabs.jsx
import React from "react";
import { Paper, ButtonBase, Typography, Box } from "@mui/material";
import { useThemeContext } from "../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

export default function EvaluationTabs({ value = "ta", onChange = () => {} }) {
  const { colors } = useThemeContext();
  const { t } = useTranslation();

  const activeBg = colors?.box || "#FFFFFF";
  const inactiveText = colors?.secondary || "#64748B";
  const activeText = colors?.text || "#111827";
  const border = colors?.border || "#E5E7EB";
  const trackBg = colors?.label || "#F1F5F9";

  const tabBtnSx = (active) => ({
    flex: 1,
    height: "100%",
    borderRadius: 1.75,
    bgcolor: active ? activeBg : "transparent",
    boxShadow: active ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    // ✅ no animation at all
    transition: "none !important",
    "& *": { transition: "none !important" },

    // ✅ kill tap highlight / press effects
    WebkitTapHighlightColor: "transparent",
    touchAction: "manipulation",

    "&:hover": { bgcolor: active ? activeBg : "transparent" },
    "&:active": { transform: "none" },

    // ✅ kill focus ring / focus-visible style
    "&:focus": { outline: "none" },
    "&.Mui-focusVisible": { outline: "none", boxShadow: "none" },
  });

  const tabTextSx = (active) => ({
    fontSize: 16,
    fontWeight: active ? 400 : 500,
    color: active ? activeText : inactiveText,
    transition: "none !important",
  });

  // ✅ يمنع الـ focus “اللحظي” اللي بيعمل الحركة
  const preventFocusOnMouseDown = (e) => e.preventDefault();

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-start" }}>
      <Paper
        elevation={0}
        sx={{
          width: 520,
          maxWidth: "100%",
          height: 48,
          borderRadius: 2,
          p: 0.75,
          bgcolor: trackBg,
          border: `1px solid ${border}`,
          display: "flex",
          gap: 0,
          transition: "none !important",
        }}
      >
        <ButtonBase
          onMouseDown={preventFocusOnMouseDown}
          onTouchStart={preventFocusOnMouseDown}
          onClick={() => onChange("ta")}
          disableRipple
          disableTouchRipple
          disableFocusRipple
          sx={tabBtnSx(value === "ta")}
        >
          <Typography sx={tabTextSx(value === "ta")}>
            {t("Evaluate for TA", "Evaluate for TA")}
          </Typography>
        </ButtonBase>

        <ButtonBase
          onMouseDown={preventFocusOnMouseDown}
          onTouchStart={preventFocusOnMouseDown}
          onClick={() => onChange("instructor")}
          disableRipple
          disableTouchRipple
          disableFocusRipple
          sx={tabBtnSx(value === "instructor")}
        >
          <Typography sx={tabTextSx(value === "instructor")}>
            {t("Evaluate for Instructor", "Evaluate for Instructor")}
          </Typography>
        </ButtonBase>
      </Paper>
    </Box>
  );
}
