// src/pages/doctor/courses.jsx
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useThemeContext } from "../../services/theme_context";
import { useTranslation } from "react-i18next";

import CourseHeader from "../../components/doctor/do_co_components/CourseHeader";
import CourseStats from "../../components/doctor/do_co_components/CourseStats";
import CourseTabs from "../../components/doctor/do_co_components/CourseTabs";
import CourseInfo from "../../components/doctor/do_co_components/CourseInfo";
import CourseSections from "../../components/doctor/do_co_components/CourseSections";
import GradeStructure from "../../components/doctor/do_co_components/GradeStructure";
import CourseGrades from "../../components/doctor/do_co_components/CourseGrades";
import {
  MOCK_COURSES,
  MOCK_SECTIONS,
  MOCK_BRANCHES,
  buildCourseHeaderData,
} from "../../components/doctor/do_co_components/courseHeaderData";

// Tab panel placeholder
function TabPanel({ index, activeTab, children }) {
  return activeTab === index ? <Box>{children}</Box> : null;
}

// Empty state for not-yet-built tabs
function ComingSoon({ colors }) {
  return (
    <Box
      sx={{
        bgcolor: colors?.box,
        border: `1px solid ${colors?.border}`,
        borderRadius: 2,
        p: 5,
        textAlign: "center",
      }}
    >
      <Typography sx={{ color: colors?.secondary, fontSize: "0.9rem" }}>
        Coming soon…
      </Typography>
    </Box>
  );
}

// ────────────────────────────
// Main Page
// ────────────────────────────
export default function DoctorCourses() {
  const { colors } = useThemeContext();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [selectedId, setSelectedId] = useState(MOCK_COURSES[0].id);
  const [activeTab, setActiveTab] = useState(0);

  const course = MOCK_COURSES.find((c) => c.id === selectedId) || MOCK_COURSES[0];

  // Build the data object that the header section consumes.
  // When the API is ready, replace this with the API response.
  const courseHeaderData = buildCourseHeaderData(course, colors);

  return (
    <Box
      dir={isRTL ? "rtl" : "ltr"}
      sx={{
        width: "100%",
        pt: 3,
        pb: 5,
        px: { xs: 0.5, sm: 1 },
        bgcolor: "transparent",
      }}
    >
      {/* Header + Stats — full-width container */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
          bgcolor: courseHeaderData.colors.containerBg,
          borderRadius: "12px",
          mb: 2.5,
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <CourseHeader
          data={courseHeaderData}
          courses={MOCK_COURSES}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            setActiveTab(0);
          }}
        />

        <CourseStats data={courseHeaderData} />
      </Box>

      {/* Tabs */}
      <CourseTabs activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Content */}
      <TabPanel index={0} activeTab={activeTab}>
        <CourseInfo course={course} />
      </TabPanel>

      <TabPanel index={1} activeTab={activeTab}>
        <CourseSections
          sections={MOCK_SECTIONS[course.id] ?? []}
          branches={MOCK_BRANCHES[course.id] ?? []}
        />
      </TabPanel>

      <TabPanel index={2} activeTab={activeTab}>
        <ComingSoon colors={colors} />
      </TabPanel>

      <TabPanel index={3} activeTab={activeTab}>
        <GradeStructure />
      </TabPanel>

      <TabPanel index={4} activeTab={activeTab}>
        <CourseGrades />
      </TabPanel>
    </Box>
  );
}
