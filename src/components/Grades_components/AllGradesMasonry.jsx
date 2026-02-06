import React from "react";
import { Box, Typography } from "@mui/material";
import { useThemeContext } from "../../services/theme_context.jsx";
import CourseCard from "./CourseCard.jsx";

export default function AllGradesMasonry({
  isVerySmall,
  isMediumTablet,
  isTablet,
  isRTL,
  t,
  loading,
  courses,
  onToggleCourseDetails,
}) {
  const { colors } = useThemeContext();

  return (
    <Box
      sx={{
        width: "96.63%",
        mx: "auto",
        position: "relative",
        pb: "24px",
        mt: isTablet ? 0 : "-55px",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      <Typography
        sx={{
          fontSize: isVerySmall ? 20 : 25,
          fontWeight: 700,
          lineHeight: "30px",
          mb: "32px",
          color: colors?.text,
          textAlign: isRTL ? "right" : "left",
        }}
      >
        {t?.("All Grades") || "All Grades"}
      </Typography>

      <Box
        sx={{
          width: "100%",
          columnCount: isVerySmall ? 1 : isMediumTablet ? 2 : 3,
          columnGap: "30px",
        }}
      >
        {loading ? (
          <Box sx={{ textAlign: "center", p: "40px", color: colors?.secondary }}>
            {t?.("Loading courses...") || t?.("loading_courses") || "Loading courses..."}
          </Box>
        ) : (
          courses.map((course, index) => (
            <CourseCard
              key={`${course.code}-${index}`}
              isVerySmall={isVerySmall}
              isRTL={isRTL}
              t={t}
              course={course}
              index={index}
              onToggleCourseDetails={onToggleCourseDetails}
            />
          ))
        )}
      </Box>
    </Box>
  );
}
