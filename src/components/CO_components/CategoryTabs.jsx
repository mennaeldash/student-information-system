// src/components/CO_components/CategoryTabs.jsx
import React from "react";
import { Tabs, Tab, Box, useTheme } from "@mui/material";
import { useThemeContext } from "../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

const KEYS = ["all", "required", "recommended"];

export default function CategoryTabs({ value = "all", onChange = () => {} }) {
  const theme = useTheme();
  const { colors } = useThemeContext();
  const { t, i18n } = useTranslation();

  return (
    <Box
      dir={i18n.dir()}              
      sx={{
        mt: 2,
        width: "100%",
        borderRadius: 3,
        border: `1px solid ${colors?.border || theme.palette.divider}`,
        p: 0.5,
        backgroundColor: "#F4F4F5",
        height: 36,
        alignItems: "center",
        display: "flex",
      }}
    >
      <Tabs
        value={value}
        onChange={(e, v) => onChange(v)}
        TabIndicatorProps={{ style: { display: "none" } }}
        sx={{
          width: "100%",
          minHeight: 0,
          "& .MuiTabs-flexContainer": { height: "100%" },
          "& .MuiTab-root": {
            flex: 1,
            textTransform: "none",
            minHeight: 0,
            height: "28px",
            borderRadius: 2,
            fontSize: 14,
            fontWeight: 400,
            color: colors?.secondary || theme.palette.text.secondary,
          },
          "& .Mui-selected": {
            color: `${colors?.text} !important`,
            bgcolor: theme.palette.mode === "dark" ? "#0B1220" : "#fff",
            fontWeight: 500,
          },
        }}
      >
        {KEYS.map((k) => (
          <Tab key={k} value={k} label={t(`${k}`)} />
        ))}
      </Tabs>
    </Box>
  );
}
