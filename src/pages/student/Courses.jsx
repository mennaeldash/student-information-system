// src/pages/Courses.jsx
import React from "react";
import { Box } from "@mui/material";
import { useThemeContext } from "../../services/theme_context.jsx"; // تأكدي من الامتداد
import { useTranslation } from "react-i18next";
import RegistrationFlow from "../../components/CO_components/RegistrationFlow";

export default function Courses() {
  const { colors } = useThemeContext();
  const { i18n } = useTranslation();

  return (
    <Box
      dir={i18n.dir()}
      sx={{
        height: "100vh",
        overflow: "auto",
        bgcolor: colors?.background,
        width: "100%",
        fontFamily: colors?.fontFamily,
        color: colors?.text,
        overflowX: "hidden",
      }}
    >
      <RegistrationFlow />
    </Box>
  );
}
