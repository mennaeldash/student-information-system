import React from "react";
import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { BsChevronExpand } from "react-icons/bs";
import { useThemeContext } from "../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

// TODO: استبدل هذه الروابط بالروابط الحقيقية لاحقاً
const API_BASE_URL = "https://your-api-domain.com/api/v1";
const API_ENDPOINTS = {
  courses: `${API_BASE_URL}/courses`,
  courseDetails: `${API_BASE_URL}/courses/:id`
};

const CourseSelectionPanel = ({
  courses = [],
  selectedCourse,
  onCourseChange,
  sx = {}
}) => {
  const { colors } = useThemeContext();
  const { t } = useTranslation();

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: `1px solid ${colors.border}`,
        bgcolor: colors.box,
        p: { xs: 2, sm: 2.5 },
        width: "100%",
        minWidth: { xs: '100%', sm: 320 },
        boxShadow: colors.mode === "dark" ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(17,27,56,.06)",
        ...sx
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: colors.text,
            fontSize: { xs: "1.2rem", sm: "1.5rem" },
            lineHeight: 1.2,
            mb: 1.5,
            mt: 1.5,
          }}
        >
          {t("Select Course")}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: colors.textSecondary,
            fontSize: { xs: "0.95rem", sm: "1.05rem" },
            lineHeight: 1.3,
          }}
        >
          {t("Choose a course to manage its sections")}
        </Typography>
      </Box>

      {/* Select */}
      <Box sx={{ width: "100%", mb: 1, mt: 0 }}>
        <FormControl fullWidth>
          <Select
            value={selectedCourse || ""}
            displayEmpty
            onChange={(e) => onCourseChange && onCourseChange(e.target.value)}
            IconComponent={(props) => (
              <BsChevronExpand {...props} style={{ color: colors.textSecondary }} />
            )}
            sx={{
              minHeight: 40,
              bgcolor: colors.box,
              borderRadius: 2,
              fontSize: "1.08rem",
              color: colors.text,
              ".MuiSelect-select": {
                display: "flex",
                alignItems: "center",
                pl: 1,
                py: 0,
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.border,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.mode === "dark" ? colors.secondary : "#3b82f6",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.mode === "dark" ? colors.primary : "#3b82f6",
              }
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: colors.box,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 2,
                  mt: 1,
                  "& .MuiMenuItem-root": {
                    color: colors.text,
                    "&:hover": {
                      bgcolor: colors.mode === "dark" ? colors.chosen : "#f3f4f6",
                    },
                    "&.Mui-selected": {
                      bgcolor: colors.chosen,
                      "&:hover": {
                        bgcolor: colors.chosen,
                      }
                    },
                    "&.Mui-disabled": {
                      color: colors.textSecondary
                    }
                  }
                }
              }
            }}
          >
            <MenuItem disabled value="">
              <span style={{ color: colors.textSecondary }}>
                {t("Select a course...")}
              </span>
            </MenuItem>
            {courses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.code}: {course.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
};

export default CourseSelectionPanel;