// src/components/CO_components/payment/PaymentStepper.jsx
import React from "react";
import { Box, ButtonBase, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../../../services/theme_context.jsx";

const STEPS = [
  { key: "method",  label: "Payment Method"  },
  { key: "details", label: "Payment Details" },
  { key: "receipt", label: "Payment Receipt" },
];

export default function PaymentStepper({
  step = 0,
  onChange = () => {},
  lockForward = false, // لو true يمنع القفز لأبعد من الخطوة الحالية (زي الكومبوننت القديم)
}) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { colors } = useThemeContext();

  const canGo = (i) => (lockForward ? i <= step : true);

  return (
    <Box
      dir={i18n.dir()}
      sx={{
        mt: 1.5,
        width: "100%",
        borderRadius: 3,
        p: 0.5,
        backgroundColor: "#F4F4F5",
        height: 36,
        alignItems: "center",
        display: "flex",
      }}
      role="tablist"
      aria-label={t("payment.process")}
    >
      {/* نفس توزيع Tabs: أزرار مرنة متساوية العرض */}
      <Box sx={{ display: "flex", width: "100%", height: "100%", gap: 0.5 }}>
        {STEPS.map((s, i) => {
          const selected = i === step;

          return (
            <ButtonBase
              key={s.key}
              onClick={() => canGo(i) && onChange(i)}
              disabled={!canGo(i)}
              role="tab"
              aria-selected={selected}
              sx={{
                flex: 1,
                height: "28px",
                borderRadius: 2,
                px: 1,
                cursor: canGo(i) ? "pointer" : "not-allowed",
                bgcolor: selected
                  ? theme.palette.mode === "dark"
                    ? "#0B1220"
                    : "#fff"
                  : "transparent",
                color: selected
                  ? colors?.text || theme.palette.text.primary
                  : colors?.secondary || theme.palette.text.secondary,
                border: "none",
                transition: "background-color .15s ease",
                "&:hover": {
                  bgcolor: selected
                    ? theme.palette.mode === "dark"
                      ? "#0B1220"
                      : "#fff"
                    : "rgba(0,0,0,0.04)",
                },
                "&.Mui-disabled": { opacity: 0.6 },
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontSize: 14,
                  fontWeight: selected ? 500 : 400,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                {i + 1}. {t(s.label)}
              </Typography>
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
}
