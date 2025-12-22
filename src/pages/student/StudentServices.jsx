// src/pages/student/StudentServices.jsx
import React from "react";
import { Box, Paper } from "@mui/material";
import { useThemeContext } from "../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

import TAEvaluationForm from "../../components/ST-SE-components/TAEvaluationForm.jsx";
import TAEvaluationCriteria from "../../components/ST-SE-components/TAEvaluationCriteria.jsx";

const StudentServices = () => {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";
  const { t, i18n } = useTranslation();

  return (
    <Box
      dir={i18n.dir()}   // ✅ نفس ProfilePage
      sx={{
        p: { xs: 2, md: 3 },
        pt: 4,
        width: "100%",
        minHeight: "100vh",
        bgcolor: colors?.background || (isDark ? "#020617" : "#F3F4F6"),
        fontFamily: colors?.fontFamily,
        color: colors?.text,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: "none",   // stretch
          mx: 0,              // no center
          borderRadius: "12px",
          bgcolor: colors?.box || "#FFFFFF",
          p: { xs: 2, md: 2 },

          "& > *:not(:last-child)": {
            mb: 0,
          },
        }}
      >
        <TAEvaluationForm />
        <TAEvaluationCriteria />
      </Paper>
    </Box>
  );
};

export default StudentServices;
