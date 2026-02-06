// src/components/CO_components/payment/PaymentSummary.jsx
import React from "react";
import { Paper, Box, Typography, Divider, Chip } from "@mui/material";
import { useThemeContext } from "../../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

export default function PaymentSummary({ data = {} }) {
  const { colors } = useThemeContext();
  const { t } = useTranslation();

  // Fallbacks لو القيم ناقصة
  const tuition = Number(data.tuition ?? 0);
  const admin = Number(data.admin ?? 0);
  const knowledge = Number(data.knowledge ?? 0);
  const technology = Number(data.technology ?? 0);

  const total =
    data.total != null ? Number(data.total) : tuition + admin + knowledge + technology;

  // status: paid | pending_payment
  const status = data.status ?? "pending_payment";
  const isPaid = status === "paid";

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: `1px solid ${colors?.border}`,
        bgcolor: colors?.box,
        minWidth: 0,
      }}
    >
      {/* العنوان والوصف */}
      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
        {t("payment.summary", "Payment Summary")}
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 1.5 }}>
        {t("payment.summary_desc", "Details of your current payment")}
      </Typography>

      {/* السطور */}
      <Box sx={{ display: "grid", gap: 1, fontSize: 14 }}>
        <Row
          label={t("payment.tuition_fee", "Tuition Fee")}
          value={`EGP ${tuition.toFixed(2)}`}
          labelSx={{ fontSize: 14, color: colors?.text }}
          valueSx={{ fontSize: 14 }}
        />

        <Row
          label={t("payment.admin_fee", "Administrative fees")}
          value={`EGP ${admin.toFixed(2)}`}
          labelSx={{ fontSize: 14, color: colors?.text }}
          valueSx={{ fontSize: 14 }}
        />

        <Row
          label={t("payment.knowledge_fee", "Knowledge Bank fees")}
          value={`EGP ${knowledge.toFixed(2)}`}
          labelSx={{ fontSize: 14, color: colors?.text }}
          valueSx={{ fontSize: 14 }}
        />

        <Row
          label={t("payment.tech_fee", "Technology Fee")}
          value={`EGP ${technology.toFixed(2)}`}
          labelSx={{ fontSize: 14, color: colors?.text }}
          valueSx={{ fontSize: 14 }}
        />

        <Divider sx={{ my: 1 }} />

        <Row
          label={t("payment.total", "Total")}
          value={`EGP ${total.toFixed(2)}`}
          valueSx={{ fontWeight: 300 }}
          labelSx={{ fontWeight: 700, color: colors?.text }}
        />

        {/* حالة الدفع */}
        <Box sx={{ mt: 0.2 }}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {t("payment.status", "Payment Status")}
          </Typography>
        </Box>

        <Chip
          label={t(`payment.${status}`, isPaid ? "Paid" : "Pending Payment")}
          sx={{
            mt: 0.5,
            bgcolor: isPaid ? "#E8FAF1" : "#fff2c8ff",
            color: isPaid ? "#10B981" : "#d99e5aff",
            fontWeight: 700,
            "& .MuiChip-label": { px: 0.5, fontSize: 12 },
          }}
        />
      </Box>
    </Paper>
  );
}

function Row({ label, value, bold, sx, labelSx, valueSx }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", ...sx }}>
      <Typography
        className="row-label"
        sx={{ color: "text.secondary", fontSize: 13.5, ...labelSx }}
      >
        {label}
      </Typography>
      <Typography
        className="row-value"
        sx={{ fontSize: 13.5, fontWeight: bold ? 700 : 500, ...valueSx }}
      >
        {value}
      </Typography>
    </Box>
  );
}
