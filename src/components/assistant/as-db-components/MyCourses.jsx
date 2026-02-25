// src/components/assistant/as-db-components/MyCourses.jsx
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
import { Calendar } from "lucide-react";

const coursesData = [
  {
    id: 1,
    code: "Cs101",
    instructor: "Dr. Sarah Ahmed",
    progress: 70,
    barColor: "#13A9DC",
    iconBg: "#D7E3F5",
    iconColor: "#424BD5",
  },
  {
    id: 2,
    code: "Cs101",
    instructor: "Dr. Sarah Ahmed",
    progress: 55,
    barColor: "#885EF6",
    iconBg: "#FBF4FF",
    iconColor: "#855FF6",
  },
  {
    id: 3,
    code: "Cs101",
    instructor: "Dr. Sarah Ahmed",
    progress: 60,
    barColor: "#22C55E",
    iconBg: "#DCFCE7",
    iconColor: "#22C55E",
  },
];

const MyCourses = () => {
  const { colors } = useThemeContext();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const boxBg = colors?.box || "#FFFFFF";
  const textColor = colors?.text || "#0F172A";
  const mutedText = colors?.textSecondary || "#6B7280";
  const primary = colors?.primary || "#4F46E5";

const handleViewAll = () => navigate("/ta/courses");

  const F = {
    headerTitle: "clamp(14px, calc(14px + 6 * (100vw / 1720)), 20px)", 
    headerLink:  "clamp(13px, calc(13px + 5 * (100vw / 1720)), 18px)", 
    courseCode:  "clamp(15px, calc(15px + 7 * (100vw / 1700)), 20px)", 
    instructor:  "clamp(12px, calc(12px + 6 * (100vw / 1720)), 18px)", 
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
            {t("My courses")}
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
            gap: { xs: "16px", md: "20px" }, 
          }}
        >
          {coursesData.map((course) => (
            <Box
              key={course.id}
              sx={{
                backgroundColor: colors?.mode === "dark" ? "#0F172A" : "#F9FAFB",
                borderRadius: 2,
                border: `1px solid ${
                  colors?.mode === "dark" ? "#1F2937" : "#E5E7EB"
                }`,
                px: "20px",
                height: "130px",
                py: 1.7,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1.0,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    // textAlign: isRTL ? "right" : "left",
                    minWidth: 0,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: F.courseCode,
                      fontWeight: 600,
                      color: textColor,
                      lineHeight: 1.2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {course.code}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: F.instructor,
                      fontWeight: 400,
                      color: mutedText,
                      lineHeight: 1.2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {course.instructor}
                  </Typography>
                </Box>

                <IconButton
                  size="small"
                  sx={{
                    backgroundColor: course.iconBg,
                    width: "46px",
                    height: "34px",
                    borderRadius: "6px",
                    "&:hover": { backgroundColor: course.iconBg },
                  }}
                >
                  <Calendar size={18} color={course.iconColor || course.barColor} />
                </IconButton>
              </Box>

              <LinearProgress
                variant="determinate"
                value={course.progress}
                sx={{
                  height: 4,
                  borderRadius: 999,
                  backgroundColor:
                    colors?.mode === "dark" ? "#111827" : "#E5E7EB",
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

export default MyCourses;
