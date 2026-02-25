// src/components/assistant/as-db-components/ProjectsWidget.jsx
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
    name: "Smart Traffic Management System",
    status: "Accepted",
    variant: "accepted",
  },
];

const statusStyles = {
  underReview: { bg: "#FEF3C7", color: "#92400E" },
  accepted: { bg: "#DCFCE7", color: "#166534" },
  rejected: { bg: "#FEE2E2", color: "#B91C1C" },
};

const ProjectsWidget = () => {
  const { colors } = useThemeContext();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const boxBg = colors?.box || "#FFFFFF";
  const textColor = colors?.text || "#0F172A";
  const primary = colors?.primary || "#4F46E5";

  const F = {
    headerTitle: "clamp(14px, calc(14px + 6 * (100vw / 1720)), 20px)", 
    headerLink:  "clamp(13px, calc(13px + 5 * (100vw / 1720)), 18px)", 
    rowTitle:    "clamp(13px, calc(13px + 5 * (100vw / 1720)), 18px)", 
    statusText:  "clamp(12px, calc(12px + 2 * (100vw / 1720)), 14px)", 
  };

  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: boxBg,
        borderRadius: 2,
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
            gap: "30px",
          }}
        >
          {projectsData.map((project) => {
            const style =
              statusStyles[project.variant] || statusStyles.underReview;

            return (
              <Box
                key={project.id}
                sx={{
                  backgroundColor:
                    colors?.mode === "dark" ? "#020617" : "#F9FAFB",
                  borderRadius: "8px",
                  border: `1px solid ${
                    colors?.mode === "dark" ? "#1F2937" : "#E5E7EB"
                  }`,
                  px: "10px",
                  height: { xs: "auto", md: "75px" },
                  py: "7px",
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: { xs: "flex-start", md: "center" },
                  justifyContent: "space-between",
                  gap: { xs: 1, md: 2 },
                  boxShadow:
                    colors?.mode === "dark"
                      ? "0px 0px 4px 0px rgba(0, 0, 0, 0.35)"
                      : "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
              >
                {/* Project Name */}
                <Typography
                  sx={{
                    fontSize: F.rowTitle, 
                    fontWeight: 400,
                    color: textColor,
                    width: "100%",
                    lineHeight: 1.2,
                    whiteSpace: { xs: "normal", md: "nowrap" },
                    overflow: "hidden",
                    textOverflow: { md: "ellipsis" },
                  }}
                >
                  {t(project.name)}
                </Typography>

                {/* Status */}
                <Box
                  sx={{
                    height: "40px",
                    px: "10px",
                    borderRadius: "16px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: F.statusText, 
                    fontWeight: 400,
                    lineHeight: 1,
                    backgroundColor: style.bg,
                    color: style.color,
                    whiteSpace: "nowrap",
                    width: "fit-content",
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

export default ProjectsWidget;
