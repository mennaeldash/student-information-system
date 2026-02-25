// src/components/assistant/as_sd_components/StudentsGrid.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../../../services/theme_context.jsx";
import StudentCard from "./StudentCard";

export default function StudentsGrid({ students, onSelectStudent }) {
  const { t } = useTranslation();
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  if (!students || students.length === 0) {
    return (
      <Box sx={{ py: 6, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography sx={{ color: colors?.secondary || (isDark ? "#94A3B8" : "#6B7280") }}>
          {t("No students found") || "No students found"}
        </Typography>
      </Box>
    );
  }

return (
  <Box
    sx={{
      width: "100%",
      display: "grid",
      gap: { xs: 1.5, sm: 2, md: 2.5, lg: 3 },
      gridTemplateColumns: {
        xs: "1fr",
        sm: "repeat(2, minmax(0, 1fr))",
        lg: "repeat(3, minmax(0, 1fr))",
      },
      justifyContent: "flex-start",
      alignItems: "start",
    }}
  >
    {students.map((student) => (
      <StudentCard
        key={student.id}
        student={student}
        onSelect={onSelectStudent}
      />
    ))}
  </Box>
);

}
