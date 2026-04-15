import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../../../services/theme_context.jsx";
import InstructorInfo from "./InstructorInfo";

/* ─── Reusable: labelled read-only field ─── */
function ReadonlyField({ label, value }) {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        sx={{
          fontSize: "14px",
          color: colors?.secondary ?? "#64748B",
          fontWeight: 500,
          mb: "6px",
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          height: 48,
          bgcolor: isDark ? colors?.cod ?? "#1E293B" : "#F8F8F8",
          border: `1px solid ${isDark ? colors?.border ?? "#374151" : "#E5E7EB"}`,
          borderRadius: "6px",
          px: "16px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "14px",
            color: colors?.text ?? "#09090B",
            fontWeight: 400,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value || "—"}
        </Typography>
      </Box>
    </Box>
  );
}

/* ─── Reusable: description block ─── */
function DescriptionField({ label, value }) {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  return (
    <Box>
      <Typography
        sx={{
          fontSize: "14px",
          color: colors?.secondary ?? "#64748B",
          fontWeight: 500,
          mb: "6px",
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          bgcolor: isDark ? colors?.cod ?? "#1E293B" : "#F8F8F8",
          border: `1px solid ${isDark ? colors?.border ?? "#374151" : "#E5E7EB"}`,
          borderRadius: "6px",
          p: "16px",
          minHeight: 90,
        }}
      >
        <Typography
          sx={{
            fontSize: "14px",
            color: colors?.text ?? "#09090B",
            lineHeight: "22px",
            fontWeight: 400,
          }}
        >
          {value || "—"}
        </Typography>
      </Box>
    </Box>
  );
}

/* ─── Prerequisite pill tag ─── */
function PrereqTag({ text }) {
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  return (
    <Box
      sx={{
        height: 40,
        borderRadius: "20px",
        bgcolor: isDark ? colors?.cod ?? "#1E293B" : "#F8F8F8",
        ...(isDark && { border: `1px solid ${colors?.border ?? "#374151"}` }),
        px: "12px",
        display: "flex",
        alignItems: "center",
        fontSize: "14px",
        color: colors?.text ?? "#09090B",
        fontWeight: 400,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </Box>
  );
}

/* ─── Main component ─── */
export default function CourseInfo({ course }) {
  const { t } = useTranslation();
  const { colors } = useThemeContext();
  const isDark = colors?.mode === "dark";

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: isDark ? colors?.box ?? "#010D1A" : "#FFFFFF",
        border: isDark ? `1px solid ${colors?.border ?? "#374151"}` : "none",
        borderRadius: "12px",
        p: "16px",
      }}
    >
      {/* Section title */}
      <Typography
        sx={{
          fontFamily: "Inter, sans-serif",
          fontSize: "24px",
          fontWeight: 600,
          color: colors?.text ?? "#09090B",
          mb: "20px",
        }}
      >
        {t("courses.generalInformation")}
      </Typography>

      {/* Two-column grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "595fr 638fr",
          },
          gap: { xs: "24px", md: "30px", lg: "30px" },
          alignItems: "start",
        }}
      >
        {/* ── Left Column ── */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Course Name */}
          <ReadonlyField
            label={t("courses.courseName")}
            value={course?.name}
          />

          {/* Course Code + Credit Hours — same row */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <ReadonlyField
              label={t("courses.courseCode")}
              value={course?.code}
            />
            <ReadonlyField
              label={t("courses.creditHours")}
              value={
                course?.creditHours
                  ? `${course.creditHours}.0 Credits`
                  : "—"
              }
            />
          </Box>

          {/* Department */}
          <ReadonlyField
            label={t("courses.department")}
            value={course?.department}
          />

          {/* Academic Program */}
          <ReadonlyField
            label={t("courses.academicProgram")}
            value={course?.academicProgram}
          />
        </Box>

        {/* ── Right Column ── */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          {/* Course Description */}
          <DescriptionField
            label={t("courses.courseDescription")}
            value={course?.description}
          />

          {/* Prerequisites */}
          <Box>
            <Typography
              sx={{
                fontSize: "14px",
                color: colors?.secondary ?? "#64748B",
                fontWeight: 500,
                mb: "6px",
              }}
            >
              {t("courses.prerequisites")}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {course?.prerequisites?.length ? (
                course.prerequisites.map((prereq) => (
                  <PrereqTag key={prereq} text={prereq} />
                ))
              ) : (
                <Typography sx={{ fontSize: "14px", color: colors?.secondary ?? "#64748B" }}>
                  —
                </Typography>
              )}
            </Box>
          </Box>

          {/* Instructors */}
          <InstructorInfo
            coordinator={course?.coordinator}
            instructor={course?.instructor}
          />
        </Box>
      </Box>
    </Box>
  );
}
