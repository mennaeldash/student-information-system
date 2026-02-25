// src/components/assistant/as_co_components/TASectionTabs.jsx
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useThemeContext } from "../../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { BookOpen, Grid2x2 } from "lucide-react";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

export default function TASectionTabs({
  base = "/ta/courses",
  sectionsPath = "/ta/courses/sections",
  schedulePath = "/ta/courses/schedule",
}) {
  const { colors } = useThemeContext();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";

  const tabs = [
    {
      key: "Courses",
      to: base,
      icon: <BookOpen size={16} style={{ height: 16, color: "#71717A" }} />,
    },
    {
      key: "Sections",
      to: sectionsPath,
      icon: <Grid2x2 size={16} color="#71717A" />,
    },
    {
      key: "Schedule",
      to: schedulePath,
      icon: <CalendarMonthOutlinedIcon sx={{ fontSize: 18 }} />,
    },
  ];

  const isActive = React.useCallback(
    (to) => {
      const path = location.pathname.replace(/\/+$/, "");
      const target = to.replace(/\/+$/, "");
      const baseNorm = base.replace(/\/+$/, "");
      if (target === baseNorm) return path === baseNorm;
      return path === target || path.startsWith(`${target}/`);
    },
    [location.pathname, base]
  );

  return (
    <Box
      sx={{
        width: "100%",
        alignSelf: "center",
        display: "block",
        mt: 2.5,
      }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Box
        sx={{
          mx: "auto",
          width: "min(784px, 100%)",
          height: 55,
          borderRadius: 2,
          bgcolor: colors.tatab,
          border: `1px solid ${colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "flex-start", md: "center" },
          pt: 1,
          pb: 1,
          pl: "10px",
          pr: "7px",
          overflowX: { xs: "auto", md: "hidden" },
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-x",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Stack
          direction="row"
          sx={{
            width: "100%",
            whiteSpace: "nowrap",
          }}
        >
          {tabs.map((tab) => {
            const active = isActive(tab.to);
            return (
              <Button
                key={tab.key}
                onClick={() => navigate(tab.to)}
                disableElevation
                disableRipple
                startIcon={active ? tab.icon : null}
                sx={{
                  flex: 1,            // 👈 كل تاب ياخد ثُلث المساحة
                  minWidth: 0,

                  textTransform: "none",
                  fontSize: 18,
                  fontWeight: 400,
                  height: 40,
                  px: 3,
                  py: 0.5,
                  borderRadius: 2,

                  color: active ? colors.text : colors.secondary,
                  bgcolor: active ? colors.box : "transparent",
                  border: active
                    ? `1px solid ${colors.border}`
                    : "1px solid transparent",
                  boxShadow:
                    active && colors.mode !== "dark"
                      ? "0 1px 2px rgba(0,0,0,.05)"
                      : "none",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.75,

                  transition:
                    "background-color .15s, color .15s, border-color .15s",
                  "&:hover": {
                    color: active ? colors.text : colors.secondary,
                    backgroundColor: active ? colors.box : "transparent",
                    borderColor: active ? colors.border : "transparent",
                  },
                  "& .MuiButton-startIcon": { mr: 1 },
                }}
              >
                {t(tab.key)}
              </Button>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}
