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
      dir={i18n.dir()} // ✅ الاتجاه حسب اللغة (LTR/RTL)
      sx={{
        height: "100vh",
        overflow: "auto",
        bgcolor: colors?.background, // استخدمي bgcolor بدل background لمطابقة MUI
        width: "100%",
        fontFamily: colors?.fontFamily,
        color: colors?.text,
        // حماية من التمرير الأفقي لو فيه عناصر واسعة
        overflowX: "hidden",
      }}
    >
      <RegistrationFlow />
    </Box>
  );
}
