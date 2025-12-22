// src/components/CO_components/payment/PaymentReceipt.jsx
import React, { useMemo } from "react";
import {
  Paper,
  Box,
  Typography,
  Divider,
  Chip,
  Button,
  Stack,
} from "@mui/material";
import PrintOutlined from "@mui/icons-material/PrintOutlined";
import DownloadOutlined from "@mui/icons-material/FileDownloadOutlined";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../../../services/theme_context.jsx";

/** صف (Label يسار / Value يمين) مع إمكانية تمرير ستايلات */
function Row({ label, value, subLabel, bold, sx, labelSx, valueSx }) {
  return (
    <Box sx={{ py: 1, ...sx }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
        <Typography
          sx={{
            color: "text.secondary",
            fontWeight: bold ? 700 : 500,
            ...labelSx,
          }}
        >
          {label}
        </Typography>
        <Typography sx={{ fontWeight: bold ? 700 : 500, ...valueSx }}>
          {value}
        </Typography>
      </Box>
      {subLabel ? (
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {subLabel}
        </Typography>
      ) : null}
    </Box>
  );
}

export default function PaymentReceipt({
  meta = {
    receiptNo: "INV-2023-1234",
    date: "July 13, 2025",
    method: "Credit Card (Visa **** 1234)",
    term: "Fall Semester 2023",
    status: "paid",
  },
  lines = [
    { label: "Tuition Fee", value: 3500, subLabel: "Fall Semester 2023" },
    { label: "Administrative fees", value: 2500 },
    { label: "Knowledge Bank fees", value: 100 },
    { label: "Technology Fee", value: 150 },
  ],
  currency = "£",
  total,
  onPrint = () => window.print(),
  onDownload = () => {},
}) {
  const { t, i18n } = useTranslation();
  const { colors } = useThemeContext();

  const computedTotal = useMemo(
    () =>
      total ??
      lines.reduce(
        (acc, l) => acc + (Number.isFinite(l.value) ? l.value : 0),
        0
      ),
    [lines, total]
  );

  const fmt = (n) => `${currency} ${Number(n).toFixed(2)}`;

  return (
    <Paper
      elevation={0}
      dir={i18n.dir()}
      sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: colors?.box || "#fff",
        maxWidth: 720,
        width: "100%",
        mx: "auto",
      }}
    >
      {/* العنوان و Badge Paid */}
      <Box
        sx={{
          mb: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: 20 }}>
            {t("payment.receipt_title", "Payment Receipt")}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {t("payment.receipt_no", "Receipt")} #{meta.receiptNo}
          </Typography>
        </Box>

        <Chip
          icon={<CheckCircleRounded sx={{ fontSize: 18 }} />}
          label={t("payment.paid", "Paid")}
          sx={{
            bgcolor: "#E8FAF1",
            color: "#10B981",
            fontWeight: 600,
            "& .MuiChip-label": { px: 1.5 },
          }}
        />
      </Box>

      {/* بيانات أعلى الإيصال */}
      <Row label={t("payment.date", "Date")} value={meta.date} />
      <Row label={t("payment.method", "Payment Method")} value={meta.method} />

      <Divider sx={{ my: 1.5 }} />

      {/* البنود */}
      <Box>
        {lines.map((l, idx) => (
          <Row
            key={idx}
            label={t(`payment.${l.key || ""}`, l.label)}
            value={fmt(l.value)}
            subLabel={l.subLabel}
            labelSx={{ color: "colors.text" }}
          />
        ))}

        <Divider sx={{ my: 1 }} />

        <Row
          label={t("payment.total", "Total")}
          value={fmt(computedTotal)}
          bold
        />
      </Box>

      {/* الأزرار */}
      <Stack
        direction="row"
        spacing={2}
        sx={{ mt: 2 }}
        alignItems="center"
        justifyContent="flex-start"
      >
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<PrintOutlined />}
          onClick={onPrint}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          {t("payment.print", "Print")}
        </Button>

        <Button
          variant="contained"
          startIcon={<DownloadOutlined />}
          onClick={onDownload}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            bgcolor: "text.primary",
            "&:hover": { bgcolor: "text.primary" },
          }}
        >
          {t("payment.download_pdf", "Download PDF")}
        </Button>
      </Stack>
    </Paper>
  );
}
