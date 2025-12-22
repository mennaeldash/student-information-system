import React from "react";
import {
  Box,
  Typography,
  Card,
  IconButton,
  Button,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useThemeContext } from "../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

// TODO: استبدل هذه الروابط بالروابط الحقيقية لاحقاً
const API_BASE_URL = "https://your-api-domain.com/api/v1";
const API_ENDPOINTS = {
  saveSelections: `${API_BASE_URL}/sections/save`,
  removeSection: `${API_BASE_URL}/sections/remove/:id`
};

const SelectedSectionsCard = ({
  selectedSections = [],
  onRemoveSection,
  onSaveSelections,
}) => {
  const { colors } = useThemeContext();
  const { t } = useTranslation();

  const handleSaveSelections = () => {
    if (onSaveSelections) {
      onSaveSelections(selectedSections);
    }
  };

  return (
    <Box sx={{ maxWidth: "440px", width: '100%' }}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          bgcolor: colors.box,
          boxShadow: colors.mode === "dark" ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(17,27,56,.06)",
          border: `1px solid ${colors.border}`,
          width: '100%',
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: colors.text,
              fontSize: "20px",
              mb: 0.5,
            }}
          >
            {t("Selected Sections")}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: colors.textSecondary,
              fontSize: "14px",
              mb: 2.5,
            }}
          >
            {t("Your current section selections")}
          </Typography>

          <Box>
            {selectedSections.length === 0 ? (
              <Typography
                variant="body2"
                sx={{
                  color: colors.textSecondary,
                  textAlign: "center",
                  py: 4,
                  fontSize: "14px",
                }}
              >
                {t("No sections selected")}
              </Typography>
            ) : (
              selectedSections.map((section) => (
                <Box
                  key={section.id}
                  sx={{
                    mb: 1.5,
                    p: "16px",
                    bgcolor: colors.mode === "dark" ? colors.chosen : "#F3F4F6",
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        color: colors.text,
                        mb: 0.75,
                      }}
                    >
                      {section.courseCode} : {t("Section")} {section.number}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.textSecondary,
                        fontSize: "14px",
                        mb: 0.25,
                      }}
                    >
                      {section.schedule}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: colors.textSecondary, fontSize: "14px" }}
                    >
                      {section.instructor}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => onRemoveSection && onRemoveSection(section.id)}
                    sx={{ color: colors.textSecondary, mt: -0.5, mr: -0.5 }}
                  >
                    <CloseIcon sx={{ fontSize: "22px" }} />
                  </IconButton>
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Card>

      {selectedSections.length > 0 && (
        <Button
          variant="contained"
          onClick={handleSaveSelections}
          fullWidth
          sx={{
            mt: 2,
            bgcolor: colors.mode === "dark" ? "#1E293B" : "#111827",
            color: colors.mode === "dark" ? "#E2E8F0" : "white",
            "&:hover": { 
              bgcolor: colors.mode === "dark" ? "#334155" : "#1F2937" 
            },
            textTransform: "none",
            fontWeight: "600",
            fontSize: "16px",
            py: 1.25,
            borderRadius: "10px",
            boxShadow: colors.mode === "dark" 
              ? "0 2px 4px rgba(0,0,0,0.3)" 
              : "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          }}
        >
          {t("Save Section Selections")}
        </Button>
      )}
    </Box>
  );
};

export default SelectedSectionsCard;