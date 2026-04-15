import React from "react";
import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../../../services/theme_context.jsx";

const EvaluationTabs = ({ activeTab, setActiveTab }) => {
  const { colors } = useThemeContext();
  const { t } = useTranslation();

  const isDark = colors?.mode === "dark";

  const tabs = [
    { key: "section", label: t("evaluate_for_section") },
    { key: "course", label: t("evaluate_for_course") },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "547px",
          minHeight: "55px",
          bgcolor: isDark ? "#1E293B" : "#F4F4F5",
          borderRadius: "8px",
          boxShadow: "0px 0px 4px rgba(0,0,0,0.25)",
          p: "7px",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "stretch",
          justifyContent: "center",
          gap: "10px",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <Button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              disableElevation
              sx={{
                flex: 1,
                minWidth: 0,
                width: { xs: "100%", sm: "auto" },
                height: "40px",
                borderRadius: "8px",
                px: "10px",
                py: 0,
                textTransform: "none",
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: "18px",
                lineHeight: "20px",
                color: isActive
                  ? isDark
                    ? "#F8FAFC"
                    : "#000000"
                  : "#475569",
                bgcolor: isActive
                  ? isDark
                    ? "#0F172A"
                    : "#FFFFFF"
                  : "transparent",
                boxShadow: isActive
                  ? "0px 1px 2px rgba(0,0,0,0.06)"
                  : "none",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                boxSizing: "border-box",
                transition: "background-color 0.2s ease, color 0.2s ease",
                "&:hover": {
                  bgcolor: isActive
                    ? isDark
                      ? "#0F172A"
                      : "#FFFFFF"
                    : isDark
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(255,255,255,0.45)",
                  boxShadow: isActive
                    ? "0px 1px 2px rgba(0,0,0,0.06)"
                    : "none",
                },
              }}
            >
              {tab.label}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
};

export default EvaluationTabs;