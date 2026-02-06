// src/components/CO_components/payment/PaymentHistory.jsx
import React from "react";
import { Paper, Box, Typography, Divider } from "@mui/material";
import { useThemeContext } from "../../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

export default function PaymentHistory({ items = [] }) {
  const { colors } = useThemeContext();
  const { t } = useTranslation();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: `1px solid ${colors?.border}`,
        bgcolor: colors?.box,
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
        {t("payment.history", "Payment History")}
      </Typography>

      <Box sx={{ display: "grid", gap: 1 }}>
        {items.map((it, idx) => (
          <Box
            key={idx}
            sx={{
              p: 1.25,
              borderRadius: 2,
              bgcolor: "background.default",
            }}
          >
            <Typography sx={{ fontWeight: 500, fontSize: 14 }}>{it.title}</Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
              <Typography sx={{ color: "text.secondary", fontSize: 12 }}>{it.date}</Typography>
              <Typography sx={{ fontWeight: 500, fontSize: 13 }}>EGP {it.amount.toFixed(2)}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Typography sx={{ color: "success.main", fontSize: 12, fontWeight: 500,color:"black" }}>
              {t(`payment.${it.status}`, it.status)}
            </Typography>
          </Box>
        ))}

        {items.length > 0 && (
          <Typography
            variant="caption"
            sx={{ textAlign: "center", mt: 1, color: "text.secondary" }}
          >
            {t("payment.view_all", "View All Payments")}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
