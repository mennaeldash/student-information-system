import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../../../services/theme_context.jsx";

const EvaluationCriteriaTable = ({ data = [] }) => {
  const { colors } = useThemeContext();
  const { i18n, t } = useTranslation();

  const isDark = colors?.mode === "dark";
  const isRTL = i18n.language === "ar";
  const borderColor = isDark ? "#334155" : "#E2E8F0";
  const headerBg = isDark ? "#1E293B" : "#F1F5F9";

  return (
    <Box
      dir={isRTL ? "rtl" : "ltr"}
      sx={{
        borderRadius: "8px",
        overflow: "hidden",
        bgcolor: colors?.box || "#FFFFFF",
        mt: "32px",
        boxShadow: "0px 0px 4px 0px #00000040",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          pl: "48px",
          pr: "66px",
          height: "68px",
          bgcolor: headerBg,
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <Typography
          sx={{
            flex: 1,
            fontFamily: "Inter, sans-serif",
            fontSize: "18px",
            fontWeight: 400,
            lineHeight: "20px",
            color: isDark ? "#F8FAFC" : "#020617",
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {t("CRITERION")}
        </Typography>

        <Box
          sx={{
            width: "274px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Inter, sans-serif",
              fontSize: "18px",
              fontWeight: 400,
              lineHeight: "20px",
              color: isDark ? "#F8FAFC" : "#020617",
              textAlign: "center",
            }}
          >
            {t("AVERAGE RATING")}
          </Typography>
        </Box>
      </Box>

      {data.map((row, index) => (
        <Box
          key={row.id}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            pl: "62px",
            pr: "24px",
            height: "68px",
            borderBottom:
              index !== data.length - 1 ? `1px solid ${borderColor}` : "none",
          }}
        >
          <Typography
            sx={{
              flex: 1,
              fontFamily: "Inter, sans-serif",
              fontSize: "20px",
              fontWeight: 500,
              lineHeight: "100%",
              color: isDark ? "#F8FAFC" : "#000000",
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {t(row.label)}
          </Typography>

          <Box
            sx={{
              width: "274px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Box
              sx={{
                width: "220px",
                flexShrink: 0,
                height: "9px",
                borderRadius: "9999px",
                bgcolor: isDark ? "#1E293B" : "#E2E8F0",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: `${row.value}%`,
                  height: "100%",
                  borderRadius: "9999px",
                  bgcolor: row.color,
                }}
              />
            </Box>

            <Typography
              sx={{
                width: "42px",
                fontFamily: "Inter, sans-serif",
                fontSize: "18px",
                fontWeight: 500,
                lineHeight: "24px",
                color: isDark ? "#F8FAFC" : "#000000",
                textAlign: "left",
                direction: "ltr",
              }}
            >
              {row.value}%
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default EvaluationCriteriaTable;