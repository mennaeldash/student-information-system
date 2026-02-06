// src/components/ST-SE-components/InstructorEvaluationForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  CircularProgress,
  Stack,
  Button,
} from "@mui/material";
import { useThemeContext } from "../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";
import { ChevronsUpDown } from "lucide-react";
import EvaluationTabs from "./EvaluationTabs";

const fallbackCoursesData = [
  {
    id: "CS101",
    code: "CS101",
    name: "Introduction to Computer",
    evaluationPeriod: "Fall Semester 2025/2026",
    tas: [
      { id: "TA2024001", name: "Ahmed Ali", level: "Level 4 (Senior Student)" },
      { id: "TA2024002", name: "Mona Hassan", level: "Level 3 (Junior Student)" },
    ],
  },
  {
    id: "CS202",
    code: "CS202",
    name: "Data Structures",
    evaluationPeriod: "Spring Semester 2025/2026",
    tas: [{ id: "TA2024010", name: "Omar Tarek", level: "Level 4 (Senior Student)" }],
  },
];

const API_URL = import.meta.env.VITE_TA_EVAL_META_URL;

const CRITERIA = [
  { id: "subjectKnowledge", labelKey: "Subject Knowledge", required: true },
  { id: "communicationSkills", labelKey: "Communication Skills", required: true },
  { id: "commitmentPunctuality", labelKey: "Commitment & Punctuality", required: true },
  { id: "interactionEngagement", labelKey: "Interaction & Engagement", required: true },
  { id: "preparationOrganization", labelKey: "Preparation & Organization", required: true },
  { id: "helpfulness", labelKey: "Helpfulness", required: true },
];

export default function InstructorEvaluationForm({
  active = "instructor",
  setActive = () => {},
  onRatingsChange,
    disabled = false, 
}) {
  const { colors } = useThemeContext();
  const { t } = useTranslation();
  const isDark = colors?.mode === "dark";

  const [loading, setLoading] = useState(true);
  const [coursesData, setCoursesData] = useState(fallbackCoursesData);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const [ratings, setRatings] = useState(
    CRITERIA.reduce((acc, c) => ({ ...acc, [c.id]: null }), {})
  );

  const handleSelect = (id, value) => {
    const next = { ...ratings, [id]: value };
    setRatings(next);
    if (typeof onRatingsChange === "function") onRatingsChange(next);
  };

  useEffect(() => {
    const loadData = async () => {
      if (!API_URL) {
        setCoursesData(fallbackCoursesData);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to load from API");
        await res.json();
        setCoursesData(fallbackCoursesData);
      } catch (err) {
        console.error("Instructor Evaluation API error, using fallback:", err);
        setCoursesData(fallbackCoursesData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const selectedCourse = useMemo(
    () => coursesData.find((c) => c.id === selectedCourseId) || null,
    [coursesData, selectedCourseId]
  );

  const studentLevelValue = selectedCourse?.tas?.[0]?.level || "";

  const fieldSx = {
    "& .MuiInputBase-root": {
      minWidth: { xs: "100%", md: "470px" },
      bgcolor: colors?.label,
      borderRadius: "6px",
      minHeight: "48px",
      fontFamily: "Inter, sans-serif",
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: "24px",
      color: colors?.text,
      padding: "10px",
      boxSizing: "border-box",
    },
    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
    "& .MuiInputBase-input, & .MuiSelect-select": {
      padding: 0,
      fontSize: "12px",
      fontWeight: 400,
      lineHeight: "16px",
      color: "#6D6B6B",
    },
    "& .MuiSelect-icon": {
      color: colors?.text || "#111827",
      right: 16,
      top: "50%",
      transform: "translateY(-50%)",
      width: "20px",
    },
    "& input:focus": {
      outline: "none !important",
      boxShadow: "none !important",
    },
    "& .MuiInputBase-root:focus-within": {
      outline: "none !important",
      boxShadow: "none !important",
      border: `1px solid ${colors?.border || (isDark ? "#374151" : "#D9D9D9")} !important`,
    },
    "& .MuiInputBase-root.Mui-focused": {
      border: `1px solid ${colors?.border || (isDark ? "#374151" : "#D9D9D9")} !important`,
      boxShadow: "none !important",
      outline: "none !important",
    },
    "&:hover .MuiInputBase-root": {
      borderColor: colors?.border || (isDark ? "#4B5563" : "#C7C7C7"),
    },
  };

  const labelTextSx = {
    fontSize: 16,
    fontWeight: 500,
    color: colors?.text || (isDark ? "#E5E7EB" : "#1E293B"),
    mb: 0.75,
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: "none",
        mx: 0,
        borderRadius: "8px",
        pt: 3,
        pb: 4,
        px: { xs: 2, md: 1 },
        bgcolor: colors?.box || "#FFFFFF",
      }}
    >
      <Box sx={{ mb: 2.5 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: 30,
            lineHeight: "28px",
            fontWeight: 500,
            color: colors?.text || (isDark ? "#E5E7EB" : "#1E293B"),
            mb: 1,
            fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
          }}
        >
          {t("Instructor Evaluation", "Instructor Evaluation")}
        </Typography>

        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 400,
            lineHeight: "20px",
            color: colors?.secondary || (isDark ? "#94A3B8" : "#64748B"),
            fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
          }}
        >
          {t("Here is your feedback from students for the selected course.")}
        </Typography>
      </Box>

      <Box
        sx={{
          borderTop: `1px solid ${colors?.border || (isDark ? "#1E293B" : "#E5E7EB")}`,
          mt: 0.5,
          pt: 3,
        }}
      >
        {loading && (
          <Box
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: colors?.secondary || "#64748B",
              fontSize: 12,
            }}
          >
            <CircularProgress size={16} />
            <span>{t("Loading data...")}</span>
          </Box>
        )}

        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Box sx={{ width: "100%", maxWidth: "980px" }}>
            <Grid container spacing={4} sx={{ justifyContent: "center" }}>
              <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>
                <Box sx={{ width: "100%", maxWidth: "470px" }}>
                  <Typography sx={labelTextSx}>{t("Course *")}</Typography>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    variant="outlined"
                    sx={{
                      ...fieldSx,
                      "& .MuiInputBase-input, & .MuiSelect-select": {
                        padding: 0,
                        fontSize: "12px",
                        fontWeight: 500,
                        lineHeight: "16px",
                        color: colors?.text || "#111827",
                      },
                    }}
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    SelectProps={{
                      displayEmpty: true,
                      IconComponent: ChevronsUpDown,
                    }}
                  >
                    <MenuItem value="" disabled>
                      <span style={{ color: colors?.text || "#000", fontSize: "12px" }}>
                        {t("Select Course")}
                      </span>
                    </MenuItem>
                    {coursesData.map((course) => (
                      <MenuItem key={course.id} value={course.id}>
                        {`${course.code} - ${course.name}`}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </Grid>

              <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>
                <Box sx={{ width: "100%", maxWidth: "470px" }}>
                  <Typography sx={labelTextSx}>{t("Student Level")}</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    sx={{
                      ...fieldSx,
                      "& .MuiInputBase-input": {
                        padding: 0,
                        fontSize: "12px",
                        fontWeight: 500,
                        lineHeight: "16px",
                        color: "#6B7280",
                      },
                    }}
                    value={studentLevelValue || t("Select Course")}
                    InputProps={{ readOnly: true }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box sx={{ mt: 6 }}>
          <EvaluationTabs value={active} onChange={setActive} />
        </Box>

        <Box
          sx={{
            width: "100%",
            maxWidth: "none",
            mx: 0,
            borderRadius: "12px",
            bgcolor: colors?.box,
            px: { xs: 1, md: 0 },
            mt: 3,
          }}
        >
          <Typography
            sx={{
              fontFamily: "Inter, sans-serif",
              fontSize: { xs: 20, md: 25 },
              fontWeight: 500,
              color: colors?.text,
              mb: { xs: 2, md: 2.5 },
            }}
          >
            {t("Evaluation Criteria for Instructor", "Evaluation Criteria for Instructor")}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: { xs: 2, md: 3 },
              width: "100%",
            }}
          >
            {CRITERIA.map((criterion) => {
              const currentRating = ratings[criterion.id];

              return (
                <Box
                  key={criterion.id}
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: { xs: 1.5, md: 0 },
                    minHeight: { xs: "auto", md: "150px" },
                    alignItems: { xs: "flex-start", md: "center" },
                    justifyContent: "space-between",
                    bgcolor: colors?.min,
                    borderRadius: "12px",
                    border: `1px solid ${colors?.border}`,
                    px: { xs: 1.5, md: 2 },
                    py: { xs: 1.5, md: 2 },
                  }}
                >
                  <Box sx={{ flex: 1, width: "100%" }}>
                    <Typography
                      sx={{
                        fontSize: { xs: 16, md: 18 },
                        fontWeight: 500,
                        color: colors?.text,
                        mb: 1,
                        fontFamily:
                          "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                      }}
                    >
                      {t(criterion.labelKey)}
                      {criterion.required && (
                        <Typography component="span" sx={{ color: "#EF4444", ml: 0.5 }}>
                          *
                        </Typography>
                      )}
                    </Typography>

                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={{ xs: 1, md: "8px" }}
                      sx={{ width: "100%", flexWrap: "wrap", rowGap: { xs: 1, md: 0 } }}
                    >
                      <Stack
                        direction="row"
                        spacing={{ xs: 1, md: "5px" }}
                        sx={{ flexWrap: "wrap", rowGap: { xs: 1, md: 0 } }}
                      >
                        {Array.from({ length: 10 }).map((_, index) => {
                          const value = index + 1;
                          const selected = currentRating === value;

                          return (
                            <Button
                              key={value}
  onClick={() => !disabled && handleSelect(criterion.id, value)}
    disabled={disabled}

                              variant={selected ? "contained" : "outlined"}
                              disableRipple
                              sx={{
                                minWidth: { xs: 40, sm: 44, md: "50px" },
                                height: { xs: 40, sm: 44, md: "50px" },
                                borderRadius: { xs: 10, md: "12px" },
                                bgcolor: selected ? colors?.primary : colors?.box,
                                color: selected ? "#FFFFFF" : colors?.text,
                                fontSize: { xs: 16, md: 20 },
                                fontWeight: 600,
                                border: `3px solid #C1C1C3`,
                                "&:hover": {
                                  bgcolor: selected ? colors?.primary : colors?.chosen,
                                },
                              }}
                            >
                              {value}
                            </Button>
                          );
                        })}
                      </Stack>

                      <Typography
                        sx={{
                          fontSize: { xs: 13, md: 14 },
                          fontWeight: 500,
                          color: colors?.primary,
                          fontFamily:
                            "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                          ml: 1,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {t("Rating")}: {currentRating ?? "-"}
                      </Typography>
                    </Stack>
                  </Box>

                  <Box
                    sx={{
                      minWidth: { xs: "100%", md: 180 },
                      textAlign: { xs: "left", md: "right" },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: 14, md: 16 },
                        fontWeight: 500,
                        color: colors?.text,
                        mb: { xs: 0, md: "70px" },
                        mt: { xs: 0.5, md: 0 },
                      }}
                    >
                      {t("1 (Very Poor) – 10 (Excellent)")}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
