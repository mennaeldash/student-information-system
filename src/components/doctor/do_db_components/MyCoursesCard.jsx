// src/components/doctor/do_db_components/MyCoursesCard.jsx
import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  LinearProgress,
} from "@mui/material";
import { useThemeContext } from "@/services/theme_context.jsx";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpen } from "lucide-react";

const coursesData = [
  {
    id: 1,
    name: "Intro to Computer Science",
    progress: 72,
    barColor: "#6366F1",
    iconBg: "#EEF2FF",
    iconBgDark: "rgba(99,102,241,0.15)",
    iconColor: "#6366F1",
  },
  {
    id: 2,
    name: "Data Structures & Algorithms",
    progress: 58,
    barColor: "#A855F7",
    iconBg: "#F5F3FF",
    iconBgDark: "rgba(168,85,247,0.15)",
    iconColor: "#A855F7",
  },
  {
    id: 3,
    name: "Software Engineering",
    progress: 45,
    barColor: "#22C55E",
    iconBg: "#ECFDF5",
    iconBgDark: "rgba(34,197,94,0.15)",
    iconColor: "#22C55E",
  },
];

const MyCoursesCard = () => {
  const { colors } = useThemeContext();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const isDark = colors?.mode === "dark";
  const boxBg = colors?.box || "#FFFFFF";
  const textColor = colors?.text || "#0F172A";
  const primary = colors?.primary || "#6366F1";

  const handleViewAll = () => navigate("/doctor/courses");

  const F = {
    headerTitle: "clamp(14px, calc(14px + 6 * (100vw / 1720)), 20px)",
    headerLink: "clamp(13px, calc(13px + 5 * (100vw / 1720)), 18px)",
    courseName: "clamp(14px, calc(14px + 4 * (100vw / 1720)), 17px)",
  };

  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: boxBg,
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        minHeight: 297,
      }}
    >
      <CardContent
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          height: "100%",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: F.headerTitle,
              fontWeight: 600,
              color: textColor,
              lineHeight: 1.2,
            }}
          >
            {t("My Courses")}
          </Typography>

          <Typography
            onClick={handleViewAll}
            sx={{
              fontSize: F.headerLink,
              fontWeight: 600,
              color: primary,
              cursor: "pointer",
              userSelect: "none",
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              transition: "opacity 0.2s",
              "&:hover": { opacity: 0.8 },
            }}
          >
            {t("View All")}
          </Typography>
        </Box>

        {/* Courses list */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: { xs: "14px", md: "18px" },
          }}
        >
          {coursesData.map((course) => (
            <Box
              key={course.id}
              sx={{
                backgroundColor: isDark ? "#0F172A" : "#F9FAFB",
                borderRadius: "10px",
                border: `1px solid ${isDark ? "#1F2937" : "#E5E7EB"}`,
                px: "18px",
                py: 1.8,
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                transition: "border-color 0.2s ease",
                "&:hover": {
                  borderColor: isDark ? "#334155" : "#CBD5E1",
                },
              }}
            >
              {/* Course name + Icon row */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{
                    fontSize: F.courseName,
                    fontWeight: 600,
                    color: textColor,
                    lineHeight: 1.2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {course.name}
                </Typography>

                <IconButton
                  size="small"
                  sx={{
                    backgroundColor: isDark
                      ? course.iconBgDark
                      : course.iconBg,
                    width: "42px",
                    height: "32px",
                    borderRadius: "6px",
                    ml: 1.5,
                    "&:hover": {
                      backgroundColor: isDark
                        ? course.iconBgDark
                        : course.iconBg,
                    },
                  }}
                >
                  <BookOpen
                    size={16}
                    color={course.iconColor || course.barColor}
                  />
                </IconButton>
              </Box>

              {/* Progress bar only — no percentage text */}
              <LinearProgress
                variant="determinate"
                value={course.progress}
                sx={{
                  height: 4,
                  borderRadius: 999,
                  backgroundColor: isDark ? "#111827" : "#E5E7EB",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: course.barColor,
                    borderRadius: 999,
                  },
                }}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MyCoursesCard;
