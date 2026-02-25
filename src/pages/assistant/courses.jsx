import React from "react";
import { Box } from "@mui/material";
import TASectionTabs from "../../components/assistant/as_co_components/TASectionTabs.jsx";
import CoursesList from "../../services/assistant/CoursesList";

export default function CoursesPage() {
  return (
    <Box
      sx={{
        // ✅ وسّعي على الشاشات الكبيرة، مع سقف أعلى
        maxWidth: { xs: '100%', md: 1400, lg: 1600, xl: 1920 },
        width: '100%',

        // ✅ التصاق يسار لتقليل المسافة من السايدبار
        ml: 0,
        mr: 0,

        // ✅ حواف خفيفة
        px: { xs: 1, md: 2 },
      }}
    >
      <TASectionTabs />
      <Box sx={{ mt: 2 }}>
        <CoursesList apiUrl="/api/ta/courses" />
      </Box>
    </Box>
  );
}
