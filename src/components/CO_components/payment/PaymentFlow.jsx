
// src/components/CO_components/payment/PaymentFlow.jsx
import React, { useMemo, useState } from "react";
import { Box, Typography, Paper, Button, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../../../services/theme_context.jsx";

import PaymentStepper from "./PaymentStepper";
import PaymentMethod from "./PaymentMethod";
import PaymentDetails from "./PaymentDetails";
import PaymentReceipt from "./PaymentReceipt";
import PaymentSummary from "./PaymentSummary";
import PaymentHistory from "./PaymentHistory";

export default function PaymentFlow() {
  const { t, i18n } = useTranslation();
  const { colors } = useThemeContext();

  // steps: 0=method, 1=details, 2=receipt
  const [step, setStep] = useState(0);

  // method: 'card' | 'cash'
  const [method, setMethod] = useState("card");

  // تفاصيل الكارد في Step 2
  const [details, setDetails] = useState({
    cardNumber: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  // أرقام تجريبية — بدّليها ببيانات الـ API
  const summary = useMemo(
    () => ({
      tuition: 3500,
      admin: 2500,
      knowledge: 100,
      technology: 150,
      total: 4000,
      status: "pending_payment",
    }),
    []
  );

  const history = useMemo(
    () => [
      {
        title: "Summer 2022 Tuition",
        date: "May 15, 2022",
        amount: 3750,
        status: "paid",
      },
      {
        title: "First term 2022 Tuition",
        date: "December 10, 2022",
        amount: 3500,
        status: "paid",
      },
    ],
    []
  );

  // صلاحية الدفع في Step 2 (بسيطة، نفس منطق PaymentDetails)
  const onlyDigits = (s = "") => s.replace(/\D+/g, "");
  const isValidMMYY = (v = "") => {
    const [m = "", y = ""] = v.split("/");
    const mm = Number(m);
    const yy = Number(y);
    return m.length === 2 && y.length === 2 && mm >= 1 && mm <= 12 && yy >= 0;
  };
  const canPay =
    onlyDigits(details.cardNumber).length === 16 &&
    !!details.name?.trim() &&
    isValidMMYY(details.expiry) &&
    onlyDigits(details.cvv).length === 3;

  const goNext = () => {
    if (step === 0) setStep(1);
    else if (step === 1 && (method === "cash" || canPay)) setStep(2);
  };
  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <Box
      dir={i18n.dir()}
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 360px" },
        gap: 4,
        alignItems: "start",
      }}
    >
      {/* العمود الشمال */}
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
          {t("payment.process", "Payment Process")}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          {t("payment.follow_steps", "Follow the steps to complete your payment")}
        </Typography>

        <PaymentStepper step={step} onChange={setStep} />

        <Paper
          elevation={0}
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 3,
            border: `1px solid ${colors?.border}`,
            bgcolor: colors?.box,
          }}
        >
          {/* Step 0: اختيار طريقة الدفع */}
          {step === 0 && (
            <PaymentMethod value={method} onChange={setMethod} />
          )}

          {/* Step 1: تفاصيل الدفع (لو كاش ممكن تظهري نوت بسيطة بدل الفورم) */}
          {step === 1 && (
            <>
              {method === "card" ? (
                <PaymentDetails
                  value={details}
                  onChange={setDetails}
                  onCancel={goBack}
                  onPay={goNext}
                />
              ) : (
                <Box>
                  <Typography sx={{ mb: 1.5, fontWeight: 600 }}>
                    {t("payment.cash", "Cash Payment")}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {t(
                      "payment.cash_desc",
                      "Pay at the nearest payment location"
                    )}
                  </Typography>
                  <Stack direction="row" spacing={1.25} sx={{ mt: 2 }}>
                    <Button variant="outlined" color="inherit" onClick={goBack}>
                      {t("common.back", "Back")}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={goNext}
                      sx={{
                        
                        textTransform: "none",
                        borderRadius: 2,
                        bgcolor: "text.primary",
                        "&:hover": { bgcolor: "text.primary" },
                      }}
                    >
                      {t("common.continue", "Continue")}
                    </Button>
                  </Stack>
                </Box>
              )}
            </>
          )}

          {/* Step 2: إيصال الدفع */}
          {step === 2 && (
            <PaymentReceipt
              meta={{
                receiptNo: "INV-2023-1234",
                date: "July 13, 2025",
                method:
                  method === "card"
                    ? "Credit Card (Visa **** 1234)"
                    : t("payment.cash", "Cash"),
                term: "Fall Semester 2023",
                status: "paid",
              }}
              lines={[
                {
                  key: "tuition_fee",
                  label: t("payment.tuition_fee", "Tuition Fee"),
                  value: summary.tuition,
                  subLabel: t("payment.term_fall_2023", "Fall Semester 2023"),
                },
                {
                  key: "admin_fee",
                  label: t("payment.admin_fee", "Administrative fees"),
                  value: summary.admin,
                },
                {
                  key: "knowledge_fee",
                  label: t("payment.knowledge_fee", "Knowledge Bank fees"),
                  value: summary.knowledge,
                },
                {
                  key: "tech_fee",
                  label: t("payment.tech_fee", "Technology Fee"),
                  value: summary.technology,
                },
              ]}
              currency="£"
              onPrint={() => window.print()}
              onDownload={() => {
                // TODO: hook PDF generation (jspdf/html2canvas) if needed
              }}
            />
          )}

          {/* أزرار تنقل عامة لو حابة */}
{step !== 1 && step !== 2 && (
  <Stack
    direction="row"
    spacing={1.25}
    sx={{ mt: 2, width: "100%", justifyContent: "flex-end" }}  // ← هنا السحر
  >
    {step > 0 && (
      <Button variant="outlined" color="inherit" onClick={goBack}>
        {t("common.back", "Back")}
      </Button>
    )}

    <Button
      variant="contained"
      onClick={goNext}
      sx={{
        textTransform: "none",
        borderRadius: 2,
        bgcolor: "text.primary",
        "&:hover": { bgcolor: "text.primary" },
      }}
    >
      {t("common.continue", "Continue")}
    </Button>
  </Stack>
)}

        </Paper>
      </Box>

      {/* العمود اليمين */}
      <Box sx={{ position: { md: "sticky" }, top: { md: 16 } }}>
        <PaymentSummary data={summary} />
        <Box sx={{ mt: 2 }}>
          <PaymentHistory items={history} />
        </Box>
      </Box>
    </Box>
  );
}
