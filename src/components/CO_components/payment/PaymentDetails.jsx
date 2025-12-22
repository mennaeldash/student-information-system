// src/components/CO_components/payment/PaymentDetails.jsx
import React from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Grid,
  Button,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../../../services/theme_context.jsx";

/* ---------- helpers ---------- */
const onlyDigits = (s = "") => s.replace(/\D+/g, "");
const formatCard = (num = "") =>
  onlyDigits(num).slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
const formatMMYY = (v = "") => {
  const d = onlyDigits(v).slice(0, 4);
  if (d.length <= 2) return d;
  return d.slice(0, 2) + "/" + d.slice(2);
};
const isValidMMYY = (v = "") => {
  const [m = "", y = ""] = v.split("/");
  const mm = Number(m);
  const yy = Number(y);
  return m.length === 2 && y.length === 2 && mm >= 1 && mm <= 12 && yy >= 0;
};

export default function PaymentDetails({
  value = { cardNumber: "", name: "", expiry: "", cvv: "" },
  onChange = () => {},
  onCancel = () => {},
  onPay = () => {},
  loading = false,
}) {
  const { t, i18n } = useTranslation();
  const { colors } = useThemeContext();

  const { cardNumber, name, expiry, cvv } = value;

  const errors = {
    cardNumber: onlyDigits(cardNumber).length !== 16,
    name: !name?.trim(),
    expiry: !isValidMMYY(expiry),
    cvv: onlyDigits(cvv).length !== 3,
  };
  const canPay = !Object.values(errors).some(Boolean);

  /* -------- عرض النموذج والحقول (غيّري الرقم لو عايزة) -------- */
  const FORM_WIDTH = 500;

  /* حقل ثابت الارتفاع + بدون هايلايت أزرق */
  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 8,
      height: 44,
      boxShadow: "none",
      "& fieldset": { borderColor: colors?.border || "#E5E7EB" },
      "&:hover fieldset": { borderColor: colors?.border || "#E5E7EB" },
      "&.Mui-focused fieldset": { borderColor: "transparent" },
      "&.Mui-focused": { boxShadow: "none" },
    },
    "& .MuiInputBase-input": { py: 0 },
  };

  const OutLabel = ({ children, sx = {} }) => (
    <Typography
      variant="caption"
      sx={{
        color: "text.secondary",
        mb: 0.75,
        display: "block",
        width: "100%",
        ...sx,
      }}
    >
      {children}
    </Typography>
  );

  return (
    <Paper
      elevation={0}
      dir={i18n.dir()}
      sx={{
        mt: 2,
        borderRadius: 3,
        bgcolor: colors?.box,
        maxWidth: 720,
        width: "100%",
        mx: "auto",
      }}
    >
      {/* العنوان */}
      <Typography
        sx={{
          fontWeight: 600,
          mb: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
          width: "100%",
          maxWidth: FORM_WIDTH,
          mx: "auto",
        }}
      >
        <CreditCardIcon fontSize="small" />
        {t("payment.credit_card", "Credit Card Payment")}
      </Typography>

      {/* الكونتينر الداخلي: يوسّط كل العناصر ويتحكم في العرض */}
      <Box sx={{ width: "100%", maxWidth: FORM_WIDTH, mx: "auto" }}>
        <Grid container direction="column" rowSpacing={1.75}>
          {/* 1) Card Number */}
          <Grid item>
            <OutLabel sx={{ color: colors.text }}>
              {t("payment.card_number", "Card Number")}
            </OutLabel>
            <TextField
              fullWidth
              value={cardNumber}
              onChange={(e) =>
                onChange({ ...value, cardNumber: formatCard(e.target.value) })
              }
              error={Boolean(cardNumber) && errors.cardNumber}
              helperText={
                Boolean(cardNumber) && errors.cardNumber
                  ? t("payment.card_number_err", "Enter 16 digits")
                  : ""
              }
              autoComplete="off"
              sx={fieldSx}
              FormHelperTextProps={{ sx: { m: "4px 0 0", minHeight: 18 } }}
              InputProps={{ inputMode: "numeric" }}
            />
          </Grid>

          {/* 2) Cardholder Name */}
          <Grid item>
            <OutLabel sx={{ color: colors.text }}>
              {t("payment.cardholder", "Cardholder Name")}
            </OutLabel>
            <TextField
              fullWidth
              value={name}
              onChange={(e) => onChange({ ...value, name: e.target.value })}
              error={Boolean(name) && errors.name}
              helperText={
                Boolean(name) && errors.name ? t("payment.required", "Required") : ""
              }
              autoComplete="off"
              sx={fieldSx}
              FormHelperTextProps={{ sx: { m: "4px 0 0", minHeight: 18 } }}
            />
          </Grid>

          {/* 3) Expiry + CVV */}
          <Grid
            item
            sx={{
              width: "100%",
              maxWidth: FORM_WIDTH,
              mx: "auto",
            }}
          >
            <Grid container columnSpacing={5.75} rowSpacing={1.75}>
              <Grid item xs={12} md={6}>
                <OutLabel sx={{ color: colors.text }}>
                  {t("payment.expiry", "Expiry Date")}
                </OutLabel>
                <TextField
                  fullWidth
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) =>
                    onChange({ ...value, expiry: formatMMYY(e.target.value) })
                  }
                  error={Boolean(expiry) && errors.expiry}
                  helperText={
                    Boolean(expiry) && errors.expiry
                      ? t("payment.expiry_err", "Invalid date")
                      : ""
                  }
                  autoComplete="off"
                  sx={fieldSx}
                  FormHelperTextProps={{ sx: { m: "4px 0 0", minHeight: 18 } }}
                  InputProps={{ inputMode: "numeric" }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <OutLabel sx={{ color: colors.text }}>CVV</OutLabel>
                <TextField
                  fullWidth
                  value={cvv}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      cvv: onlyDigits(e.target.value).slice(0, 3),
                    })
                  }
                  error={Boolean(cvv) && errors.cvv}
                  helperText={
                    Boolean(cvv) && errors.cvv ? t("payment.cvv_err", "3 digits") : ""
                  }
                  autoComplete="off"
                  sx={fieldSx}
                  FormHelperTextProps={{ sx: { m: "4px 0 0", minHeight: 18 } }}
                  InputProps={{ inputMode: "numeric" }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {/* ملاحظة الأمان */}
      <Typography
        variant="caption"
        sx={{ color: "text.secondary", mt: 1, display: "block", textAlign: "center" }}
      >
        {t("payment.secure_note", "Your payment information is secure and encrypted")}
      </Typography>

      {/* الأزرار في المنتصف */}
      <Box
        sx={{
          mt: 2.25,
          display: "flex",
          justifyContent: "center",
          gap: 20.5,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          onClick={onCancel}
          disabled={loading}
          sx={{ textTransform: "none", borderRadius: 2, minWidth: 96 }}
        >
          {t("common.cancel", "Cancel")}
        </Button>

        <Button
          variant="contained"
          onClick={() => canPay && onPay()}
          disabled={!canPay || loading}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            bgcolor: "text.primary",
            "&:hover": { bgcolor: "text.primary" },
            minWidth: 96,
          }}
        >
          {t("payment.pay_now", "Pay Now")}
        </Button>
      </Box>
    </Paper>
  );
}
