// src/components/CO_components/payment/PaymentMethod.jsx
import React from "react";
import {
  Box,
  Typography,
  Radio,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CheckIcon from "@mui/icons-material/Check";
import { useThemeContext } from "../../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

export default function PaymentMethod({ value = "card", onChange = () => {} }) {
  const { t } = useTranslation();
  const { colors } = useThemeContext();

  const options = [
    {
      key: "card",
      icon: <CreditCardIcon fontSize="small" />,
      title: t("payment.credit_card", "Credit Card"),
      desc: t("payment.credit_card_desc", "Pay securely with your credit card"),
    },
    {
      key: "cash",
      icon: <StorefrontIcon fontSize="small" />,
      title: t("payment.cash", "Cash Payment"),
      desc: t("payment.cash_desc", "Pay at the nearest payment location"),
    },
  ];

  return (
    <Box>
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 200, mb: 2.5, mt: 4, color: colors.secondary }}
      >
        {t(
          "payment.step1_title",
          "Select your preferred payment method from the options below."
        )}
      </Typography>

      <List disablePadding sx={{ borderRadius: 2, overflow: "hidden" }}>
        {options.map((opt) => {
          const selected = value === opt.key;

          return (
            <ListItemButton
              key={opt.key}
              onClick={() => onChange(opt.key)}
              sx={{
                alignItems: "center",
                py: 1.25,
                borderRadius: 2,
                mb: 1,
                bgcolor: selected ? "background.default" : "background.paper",
                // توزيع الأعمدة: راديو (أقصى اليسار) + محتوى (أيقونة + عنوان + وصف) + علامة ✓ (أقصى اليمين)
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                columnGap: 2,
              }}
            >
              {/* الراديو على أقصى اليسار */}
              <ListItemIcon sx={{ minWidth: 28, alignSelf: "center" }}>
                <Radio
                  edge="start"
                  checked={selected}
                  onChange={() => onChange(opt.key)}
                  tabIndex={-1}
                  size="small"
                />
              </ListItemIcon>

              {/* المحتوى: سطر علوي (أيقونة + عنوان) + سطر سفلي (الوصف) */}
              <Box sx={{ minWidth: 0 }}>
                {/* السطر العلوي */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.0 }}>
                  {/* أيقونة الطريقة */}
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: 1,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "text.secondary",
                      flexShrink: 0,
                    }}
                  >
                    {opt.icon}
                  </Box>

                  {/* عنوان الطريقة */}
                  <Typography sx={{ fontWeight: 500, fontSize: 14, lineHeight: 1.2 }}>
                    {opt.title}
                  </Typography>
                </Box>

                {/* السطر السفلي: الوصف */}
                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: 12.5,
                    mt: 0.5,
                    lineHeight: 1.4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {opt.desc}
                </Typography>
              </Box>

              {/* ✓ في أقصى اليمين عند الاختيار */}
              <Box
                sx={{
                  visibility: selected ? "visible" : "hidden",
                  width: 28,
                  height: 24,
                  borderRadius: 1,
                  borderColor: "divider",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "text.primary",
                  flexShrink: 0,
                }}
              >
                <CheckIcon sx={{ fontSize: 18 }} />
              </Box>
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
