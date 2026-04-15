// src/components/doctor/do_db_components/ProjectsCard.jsx
import React from "react";
import { Card, CardContent, Box, Typography } from "@mui/material";
import { useThemeContext } from "@/services/theme_context.jsx";
import { useTranslation } from "react-i18next";

const projectsData = [
  {
    id: 1,
    name: "E-Learning Platform Development",
    status: "Under review",
    variant: "underReview",
  },
  {
    id: 2,
    name: "Smart Traffic Management System",
    status: "Accepted",
    variant: "accepted",
  },
  {
    id: 3,
    name: "AI-Powered Campus Assistant Chatbot",
    status: "Rejected",
    variant: "rejected",
  },
  {
    id: 4,
    name: "IoT-Based Lab Monitoring System",
    status: "Submitted",
    variant: "submitted",
  },
];

const statusStyles = {
  underReview: { bg: "#FEF3C7", color: "#92400E", bgDark: "rgba(245,158,11,0.15)", colorDark: "#FBBF24" },
  accepted: { bg: "#DCFCE7", color: "#166534", bgDark: "rgba(34,197,94,0.15)", colorDark: "#4ADE80" },
  rejected: { bg: "#FEE2E2", color: "#B91C1C", bgDark: "rgba(239,68,68,0.15)", colorDark: "#F87171" },
  submitted: { bg: "#DBEAFE", color: "#1E40AF", bgDark: "rgba(59,130,246,0.15)", colorDark: "#60A5FA" },
};

const ProjectsCard = () => {
  const { colors } = useThemeContext();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const isDark = colors?.mode === "dark";
  const boxBg = colors?.box || "#FFFFFF";
  const textColor = colors?.text || "#0F172A";
  const primary = colors?.primary || "#6366F1";

  const F = {
    headerTitle: "clamp(14px, calc(14px + 6 * (100vw / 1720)), 20px)",
    headerLink: "clamp(13px, calc(13px + 5 * (100vw / 1720)), 18px)",
    rowTitle: "clamp(13px, calc(13px + 4 * (100vw / 1720)), 16px)",
    statusText: "clamp(11px, calc(11px + 2 * (100vw / 1720)), 13px)",
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
            {t("Projects")}
          </Typography>

          <Typography
            sx={{
              fontSize: F.headerLink,
              fontWeight: 600,
              color: primary,
              cursor: "pointer",
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              transition: "opacity 0.2s",
              "&:hover": { opacity: 0.8 },
            }}
          >
            {t("View All")}
          </Typography>
        </Box>

        {/* List */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {projectsData.map((project) => {
            const style =
              statusStyles[project.variant] || statusStyles.underReview;

            return (
              <Box
                key={project.id}
                sx={{
                  backgroundColor: isDark ? "#020617" : "#F9FAFB",
                  borderRadius: "10px",
                  border: `1px solid ${isDark ? "#1F2937" : "#E5E7EB"}`,
                  px: "14px",
                  height: { xs: "auto", md: "65px" },
                  py: "10px",
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: { xs: "flex-start", md: "center" },
                  justifyContent: "space-between",
                  gap: { xs: 1, md: 2 },
                  transition: "border-color 0.2s ease",
                  "&:hover": {
                    borderColor: isDark ? "#334155" : "#CBD5E1",
                  },
                }}
              >
                {/* Project Name */}
                <Typography
                  sx={{
                    fontSize: F.rowTitle,
                    fontWeight: 400,
                    color: textColor,
                    width: "100%",
                    lineHeight: 1.3,
                    whiteSpace: { xs: "normal", md: "nowrap" },
                    overflow: "hidden",
                    textOverflow: { md: "ellipsis" },
                  }}
                >
                  {t(project.name)}
                </Typography>

                {/* Status Badge */}
                <Box
                  sx={{
                    height: "34px",
                    px: "12px",
                    borderRadius: "17px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: F.statusText,
                    fontWeight: 500,
                    lineHeight: 1,
                    backgroundColor: isDark ? style.bgDark : style.bg,
                    color: isDark ? style.colorDark : style.color,
                    whiteSpace: "nowrap",
                    width: "fit-content",
                    flexShrink: 0,
                  }}
                >
                  {t(project.status)}
                </Box>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectsCard;
