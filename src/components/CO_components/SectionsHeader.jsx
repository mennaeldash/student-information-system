import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { AccessTime } from "@mui/icons-material";
import { useThemeContext } from "../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

// TODO: استبدل هذه الروابط بالروابط الحقيقية لاحقاً
const API_BASE_URL = "https://your-api-domain.com/api/v1";
const API_ENDPOINTS = {
  registrationInfo: `${API_BASE_URL}/registration/info`,
  deadlines: `${API_BASE_URL}/registration/deadlines`
};

const SectionsHeader = ({ onViewChange }) => {
  const [view, setView] = useState("sections");
  const { colors } = useThemeContext();
  const { t } = useTranslation();

  const handleViewChange = (newView) => {
    setView(newView);
    if (onViewChange) {
      onViewChange(newView);
    }
  };

  return (
    <Box sx={{ width: "100%", mb: 3 }}>
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        mb: 2,
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 1, sm: 0 }
      }}>
        <Typography variant="h5" sx={{ 
          fontWeight: "bold", 
          color: colors.text,
          fontSize: { xs: "1.3rem", sm: "1.5rem" }
        }}>
          {t("Available Sections")}
        </Typography>
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 1, 
          color: colors.textSecondary 
        }}>
          <AccessTime sx={{ fontSize: "20px" }} />
          <Typography variant="body2" sx={{ fontSize: { xs: "0.875rem", sm: "0.9rem" } }}>
            {t("Registration Deadline: October 15, 2023")}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ 
        display: "flex", 
        bgcolor: colors.mode === "dark" ? "#334155" : "#F3F4F6", 
        borderRadius: "10px", 
        p: 0.5 
      }}>
        <Button
          fullWidth
          onClick={() => handleViewChange("sections")}
          sx={{
            bgcolor: view === "sections" ? colors.box : "transparent",
            color: view === "sections" ? colors.text : (colors.mode === "dark" ? "#94A3B8" : "#6B7280"),
            borderRadius: "8px",
            textTransform: "none",
            boxShadow: view === "sections" ? (colors.mode === "dark" ? "0 1px 3px rgba(0,0,0,0.4)" : "0 1px 3px rgba(0,0,0,0.1)") : "none",
            fontWeight: view === "sections" ? "bold" : "regular",
            "&:hover": { 
              bgcolor: view === "sections" ? colors.box : (colors.mode === "dark" ? "#475569" : "#E5E7EB")
            }
          }}
        >
          {t("Sections")}
        </Button>
        <Button
          fullWidth
          onClick={() => handleViewChange("schedule")}
          sx={{
            bgcolor: view === "schedule" ? colors.box : "transparent",
            color: view === "schedule" ? colors.text : (colors.mode === "dark" ? "#94A3B8" : "#6B7280"),
            borderRadius: "8px",
            textTransform: "none",
            boxShadow: view === "schedule" ? (colors.mode === "dark" ? "0 1px 3px rgba(0,0,0,0.4)" : "0 1px 3px rgba(0,0,0,0.1)") : "none",
            fontWeight: view === "schedule" ? "bold" : "regular",
            "&:hover": { 
              bgcolor: view === "schedule" ? colors.box : (colors.mode === "dark" ? "#475569" : "#E5E7EB")
            }
          }}
        >
          {t("Schedule View")}
        </Button>
      </Box>
    </Box>
  );
};

export default SectionsHeader;