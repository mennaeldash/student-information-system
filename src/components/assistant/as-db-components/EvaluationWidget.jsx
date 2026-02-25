// src/components/assistant/as-db-components/EvaluationWidget.jsx
import React from "react";
import { Card, CardContent, Box, Typography, LinearProgress } from "@mui/material";
import { useThemeContext } from "@/services/theme_context.jsx";
import { useTranslation } from "react-i18next";

const EvaluationWidget = () => {
  const { colors } = useThemeContext();
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === "ar";

  const boxBg = colors?.box || "#FFFFFF";
  const textColor = colors?.text || "#0F172A";
  const mutedText = colors?.textSecondary || "#6B7280";

  const cardBg = colors?.mode === "dark" ? "#020617" : "#F9FAFB";

  // ✅ Responsive fonts: grow with screen, and hit your ORIGINAL sizes at 1720px+
  // ORIGINAL: title 20, itemTitle 18, value 16
  const F = {
    title: "clamp(14px, calc(14px + 6 * (100vw / 1720)), 20px)",       // -> 20 @1720+
    itemTitle: "clamp(13px, calc(13px + 5 * (100vw / 1720)), 18px)",   // -> 18 @1720+
    value: "clamp(12px, calc(12px + 4 * (100vw / 1720)), 16px)",       // -> 16 @1720+
  };

  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: boxBg,
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        minHeight: 298,
        width: "100%",
      }}
    >
      <CardContent
        sx={{
          pt: { xs: 3, md: "16px" },
          pb: { xs: 3, md: "16px" },
          pl: { xs: 2, md: "24px" },
          pr: { xs: 2, md: "24px" },
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <Typography
          sx={{
            fontSize: F.title, 
            fontWeight: 600,
            color: textColor,
            lineHeight: 1.2,
          }}
        >
          {t("My Evaluation")}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "11px",
            width: "100%",
          }}
        >
          {/* Response Rate */}
          <Box
            sx={{
              height: "105px",
              width: "100%",
              backgroundColor: cardBg,
              borderRadius: "12px",
              px: "20px",
              py: 1.6,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              boxSizing: "border-box",
            }}
          >
            <Typography
              sx={{
                fontSize: F.itemTitle, 
                fontWeight: 500,
                color: textColor,
                lineHeight: 1.2,
              }}
            >
              {t("Response Rate")}
            </Typography>

            <Typography
              sx={{
                fontSize: F.value, 
                fontWeight: 400,
                color: mutedText,
                lineHeight: 1.2,
              }}
            >
              75%
            </Typography>

            <LinearProgress
              variant="determinate"
              value={75}
              sx={{
                mt: 0.89,
                height: 4,
                borderRadius: 999,
                backgroundColor: colors?.mode === "dark" ? "#111827" : "#E5E7EB",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#22C5F6",
                  borderRadius: 999,
                },
              }}
            />
          </Box>

          {/* Average Score */}
          <Box
            sx={{
              height: "105px",
              width: "100%",
              backgroundColor: cardBg,
              borderRadius: "12px",
              px: "20px",
              py: 1.6,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              boxSizing: "border-box",
            }}
          >
            <Typography
              sx={{
                fontSize: F.itemTitle, 
                fontWeight: 500,
                color: textColor,
                lineHeight: 1.2,
              }}
            >
              {t("Average Score")}
            </Typography>

            <Typography
              sx={{
                fontSize: F.value,
                fontWeight: 400,
                color: mutedText,
                lineHeight: 1.2,
              }}
            >
              8.5 / 10
            </Typography>

            <LinearProgress
              variant="determinate"
              value={85}
              sx={{
                mt: 0.89,
                height: 4,
                borderRadius: 999,
                backgroundColor: colors?.mode === "dark" ? "#111827" : "#E5E7EB",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#A855F7",
                  borderRadius: 999,
                },
              }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EvaluationWidget;
