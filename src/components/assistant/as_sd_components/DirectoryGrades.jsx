// src/components/assistant/as_sd_components/DirectoryGrades.jsx
import React from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../../../services/theme_context.jsx";
import { BookOpen, CheckCircle2, Layers, TrendingUp } from "lucide-react";

export default function DirectoryGrades({ student }) {
  const { t, i18n } = useTranslation();
  const { theme: appTheme, colors } = useThemeContext();
  const isRTL = i18n.language === "ar";
  const isDark = colors?.mode === "dark" || appTheme === "dark";

  // Page + theme fallbacks
  const pageBg = colors?.background || (isDark ? "#020617" : "#F3F4F6");
  const cardBg = colors?.box || (isDark ? "#0B1220" : "#FFFFFF");
  const borderColor = colors?.border || (isDark ? "#1E293B" : "#E5E7EB");
  const textColor = colors?.text || (isDark ? "#E2E8F0" : "#111827");
  const mutedTextColor = colors?.secondary || (isDark ? "#94A3B8" : "#6B7280");

        // Mock data (replace with API later)
  const academicData = {
    major: student?.program || "Computer Science",
    minor: "Information Technology",
    completedCredits: 98,
    totalCredits: 132,
    academicLevel: "Level 3",
    year: "Year 3",
    semester: "Semester 1",
    cumulativeGpa: student?.cumulativeGpa || "3.20",
    semesters: [
      {
        name: "Semester 1  2022-2032",
        courses: [
          { code: "IT110", name: "Introduction to Computers", credits: 3, grade: "C+", percentage: 65, points: 2.9, status: "passed" },
          { code: "MA112", name: "Discrete Mathematics", credits: 3, grade: "B+", percentage: 85, points: 3.5, status: "passed" },
          { code: "IT110", name: "Introduction to Computers", credits: 3, grade: "A+", percentage: 95, points: 3.9, status: "passed" },
          { code: "MA112", name: "Discrete Mathematics", credits: 3, grade: "C", percentage: 60, points: 2.6, status: "passed" },
          { code: "IT110", name: "Introduction to Computers", credits: 3, grade: "A+", percentage: 95, points: 3.9, status: "passed" },
          { code: "MA112", name: "Discrete Mathematics", credits: 3, grade: "B", percentage: 75, points: 3.2, status: "passed" },
        ],
        semesterGpa: "3.75",
        earnedCredits: 18,
        failedCourses: 0,
        cumulativeGpa: "3.75",
      },
      {
        name: "Semester 2   2022-2032",
        courses: [
          { code: "IT110", name: "Introduction to Computers", credits: 3, grade: "C+", percentage: 65, points: 2.9, status: "passed" },
          { code: "MA112", name: "Discrete Mathematics", credits: 3, grade: "B+", percentage: 85, points: 3.5, status: "passed" },
          { code: "IT110", name: "Introduction to Computers", credits: 3, grade: "A+", percentage: 95, points: 3.9, status: "passed" },
          { code: "MA112", name: "Discrete Mathematics", credits: 3, grade: "C", percentage: 60, points: 2.6, status: "passed" },
          { code: "IT110", name: "Introduction to Computers", credits: 3, grade: "A+", percentage: 95, points: 3.9, status: "passed" },
          { code: "MA112", name: "Discrete Mathematics", credits: 3, grade: "B", percentage: 75, points: 3.2, status: "passed" },
        ],
        semesterGpa: "3.2",
        earnedCredits: 18,
        failedCourses: 0,
        cumulativeGpa: "3.47",
      },
    ],
  };

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: pageBg,
        direction: isRTL ? "rtl" : "ltr",
        p: { xs: 2, sm: 3 },
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* ✅ Summary Cards responsive (4 cards take full row on md+) */}
      <Grid container spacing={2} sx={{ width: "100%" }}>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            width={265}
            iconBg={isDark ? "rgba(180,83,9,0.12)" : "rgba(180,83,9,0.06)"}
            icon={<BookOpen size={35} color={isDark ? "#F97316" : "#B45309"} />}
            cardBg={cardBg}
            borderColor={borderColor}
          >
            <LabelText muted={mutedTextColor}>{t("Major") || "Major"}:</LabelText>
            <ValueText color={textColor}>{academicData.major}</ValueText>

            <Box sx={{ height: 10 }} />

            <LabelText muted={mutedTextColor}>{t("Minor") || "Minor"}:</LabelText>
            <ValueText color={textColor}>{academicData.minor}</ValueText>
          </SummaryCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            width={265}
            iconBg={isDark ? "rgba(37,99,235,0.12)" : "rgba(37,99,235,0.06)"}
            icon={<CheckCircle2 size={35} color={isDark ? "#60A5FA" : "#2563EB"} />}
            cardBg={cardBg}
            borderColor={borderColor}
          >
            <LabelText muted={mutedTextColor}>{t("Completed Credits") || "Completed Credits"}</LabelText>
            <BigNumber color="#2563EB">{academicData.completedCredits}</BigNumber>
            <LabelText muted={mutedTextColor}>
              {t("out of") || "out of"} {academicData.totalCredits} {t("hours") || "hours"}
            </LabelText>
          </SummaryCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            width={265}
            iconBg={isDark ? "rgba(147,51,234,0.12)" : "rgba(147,51,234,0.06)"}
            icon={<Layers size={35} color={isDark ? "#C084FC" : "#9333EA"} />}
            cardBg={cardBg}
            borderColor={borderColor}
          >
            <LabelText muted={mutedTextColor}>{t("Academic Level") || "Academic Level"}</LabelText>
            <BigNumber color="#9333EA">{academicData.academicLevel}</BigNumber>
            <LabelText muted={mutedTextColor}>
              {academicData.year}, {academicData.semester}
            </LabelText>
          </SummaryCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            width={265}
            iconBg={isDark ? "rgba(16,185,129,0.12)" : "rgba(16,185,129,0.06)"}
            icon={<TrendingUp size={35} color={isDark ? "#34D399" : "#10B981"} />}
            cardBg={cardBg}
            borderColor={borderColor}
          >
            <LabelText muted={mutedTextColor}>{t("Cumulative GPA") || "Cumulative GPA"}</LabelText>
            <BigNumber color="#10B981">{academicData.cumulativeGpa}</BigNumber>
            <LabelText muted={mutedTextColor}>{t("out of") || "out of"} 4.00</LabelText>
          </SummaryCard>
        </Grid>
      </Grid>

      {/* ✅ Semesters */}
      {academicData.semesters.map((semester, idx) => (
        <Box key={idx} sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: 18, fontWeight: 600, color: textColor }}>
            {semester.name}
          </Typography>

          {/* Big card like figma */}
          <Card
            sx={{
              bgcolor: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: "12px",
              p: { xs: 2, sm: 3 },
              boxShadow: "0 8px 20px rgba(15,23,42,0.06)",
            }}
          >
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                bgcolor: "transparent",
                borderRadius: "10px",
                overflow: "hidden",
                border: `1px solid ${borderColor}`,
                width: "100%",
              }}
            >
              <Table sx={{ minWidth: 900 /* ✅ keep columns nice; scroll on small */ }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? "rgba(255,255,255,0.04)" : "#F1F5F9" }}>
                    {[
                      t("Course Code") || "Course Code",
                      t("Course Name") || "Course Name",
                      t("Credits") || "Credits",
                      t("Grade") || "Grade",
                      t("Percentage") || "Percentage",
                      t("Points") || "Points",
                      t("Status") || "Status",
                    ].map((h) => (
                      <TableCell
                        key={h}
                        sx={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: 13,
                          fontWeight: 600,
                          color: textColor,
                          borderBottom: `1px solid ${borderColor}`,
                          py: 1.75,
                          whiteSpace: "nowrap",
                        }}
                        align={["Credits", "Grade", "Percentage", "Points", "Status"].includes(h) ? "center" : "left"}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {semester.courses.map((course, cIdx) => (
                    <TableRow
                      key={cIdx}
                      sx={{
                        "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#FAFAFA" },
                      }}
                    >
                      <TableCell sx={bodyCell(borderColor, textColor)}>{course.code}</TableCell>
                      <TableCell sx={bodyCell(borderColor, textColor)}>{course.name}</TableCell>

                      <TableCell sx={bodyCell(borderColor, textColor)} align="center">
                        <Typography sx={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>{course.credits}</Typography>
                      </TableCell>

                      <TableCell sx={bodyCell(borderColor, textColor)} align="center">
                        <GradePill grade={course.grade} />
                      </TableCell>

                      <TableCell sx={bodyCell(borderColor, textColor)} align="center">
                        {course.percentage}%
                      </TableCell>

                      <TableCell sx={bodyCell(borderColor, textColor)} align="center">
                        {course.points}
                      </TableCell>

                      <TableCell sx={bodyCell(borderColor, textColor)} align="center">
                        <StatusPill status={course.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* ✅ Bottom summary bar like figma (no border, light bg) */}
            <Box
              sx={{
                mt: 2,
                bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC",
                borderRadius: "10px",
                px: { xs: 2, sm: 3 },
                py: { xs: 2, sm: 2.25 },
                display: "grid",
                gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr 1fr 1fr" },
                gap: { xs: 2, sm: 3 },
                alignItems: "center",
              }}
            >
              <SummaryStat
                label={t("Semester GPA") || "Semester GPA"}
                value={semester.semesterGpa}
                valueColor={parseFloat(semester.semesterGpa) >= 3.5 ? "#2563EB" : "#F97316"}
                muted={mutedTextColor}
              />
              <SummaryStat
                label={t("Earned Credits") || "Earned Credits"}
                value={semester.earnedCredits}
                valueColor={parseFloat(semester.semesterGpa) >= 3.5 ? "#2563EB" : "#F97316"}
                muted={mutedTextColor}
              />
              <SummaryStat
                label={t("Failed Course") || "Failed Course"}
                value={semester.failedCourses}
                valueColor={parseFloat(semester.semesterGpa) >= 3.5 ? "#2563EB" : "#F97316"}
                muted={mutedTextColor}
              />
              <SummaryStat
                label={t("Comulative GPA") || "Comulative GPA"}
                value={semester.cumulativeGpa}
                valueColor="#10B981"
                muted={mutedTextColor}
              />
            </Box>
          </Card>
        </Box>
      ))}
    </Box>
  );
}

/* ================== Small components ================== */

function SummaryCard({ children, iconBg, icon, cardBg, borderColor, width }) {
  return (
    <Card
      sx={{
        width: width || "100%",
        bgcolor: cardBg,
        border: `1px solid ${borderColor}`,
        borderRadius: "12px",
        p: "24px",
        height: 214,
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        boxSizing: "border-box",
        boxShadow: "0 6px 14px rgba(15,23,42,0.06)",
      }}
    >
      <Box
        sx={{
          width: 35,
          height: 35,
          borderRadius: "10px",
          bgcolor: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, flex: 1 }}>
        {children}
      </Box>
    </Card>
  );
}

function LabelText({ children, muted }) {
  return (
    <Typography 
      sx={{ 
        width: 140,
        height: 19,
        fontFamily: "Inter, sans-serif",
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "100%",
        letterSpacing: "0%",
        color: "#6B7280",
      }}
    >
      {children}
    </Typography>
  );
}

function ValueText({ children, color }) {
  return (
    <Typography 
      sx={{ 
        fontFamily: "Inter, sans-serif",
        fontSize: "18px",
        fontWeight: 400,
        lineHeight: "100%",
        letterSpacing: "0%",
        color: "#484848",
      }}
    >
      {children}
    </Typography>
  );
}

function BigNumber({ children, color }) {
  return (
    <Typography 
      sx={{ 
        fontFamily: "Inter, sans-serif",
        fontSize: 40,
        fontWeight: 600,
        color,
        lineHeight: "44px",
        letterSpacing: "0%",
      }}
    >
      {children}
    </Typography>
  );
}

function bodyCell(borderColor, textColor) {
  return {
    fontFamily: "Inter, sans-serif",
    fontSize: 13,
    fontWeight: 400,
    color: textColor,
    borderBottom: `1px solid ${borderColor}`,
    py: 2,
    whiteSpace: "nowrap",
  };
}

function GradePill({ grade }) {
  const { bg, color } = gradeStyle(grade);
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        px: 1.25,
        py: 0.5,
        borderRadius: "10px",
        bgcolor: bg,
        minWidth: 40,
      }}
    >
      <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color }}>{grade}</Typography>
    </Box>
  );
}

function StatusPill({ status }) {
  const ok = status === "passed";
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        px: 1.5,
        py: 0.6,
        borderRadius: "999px",
        bgcolor: ok ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
      }}
    >
      <Typography
        sx={{
          fontFamily: "Inter, sans-serif",
          fontSize: 12,
          fontWeight: 500,
          color: ok ? "#10B981" : "#EF4444",
          textTransform: "lowercase",
        }}
      >
        {status}
      </Typography>
    </Box>
  );
}

function SummaryStat({ label, value, valueColor, muted }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
      <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 400, color: muted }}>
        {label}
      </Typography>
      <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: 28, fontWeight: 600, color: valueColor, lineHeight: "32px" }}>
        {value}
      </Typography>
    </Box>
  );
}

function gradeStyle(grade) {
  // ✅ match screenshot: A green, B orange, C blue
  const map = {
    "A+": { bg: "rgba(16,185,129,0.12)", color: "#10B981" },
    A: { bg: "rgba(16,185,129,0.12)", color: "#10B981" },

    "B+": { bg: "rgba(249,115,22,0.12)", color: "#F97316" },
    B: { bg: "rgba(249,115,22,0.12)", color: "#F97316" },

    "C+": { bg: "rgba(37,99,235,0.12)", color: "#2563EB" },
    C: { bg: "rgba(37,99,235,0.12)", color: "#2563EB" },

    D: { bg: "rgba(147,51,234,0.12)", color: "#9333EA" },
    F: { bg: "rgba(239,68,68,0.12)", color: "#EF4444" },
  };
  return map[grade] || { bg: "rgba(100,116,139,0.12)", color: "#64748B" };
}