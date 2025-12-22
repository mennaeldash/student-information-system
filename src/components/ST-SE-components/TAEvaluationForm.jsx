// src/components/ST-SE-components/TAEvaluationForm.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useThemeContext } from "../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";
import { ChevronsUpDown } from "lucide-react";

// داتا احتياطي لحد ما الـ API يجهز
const fallbackCoursesData = [
  {
    id: "CS101",
    code: "CS101",
    name: "Introduction to Computer",
    evaluationPeriod: "Fall Semester 2025/2026",
    tas: [
      {
        id: "TA2024001",
        name: "Ahmed Ali",
        level: "Level 4 (Senior Student)",
      },
      {
        id: "TA2024002",
        name: "Mona Hassan",
        level: "Level 3 (Junior Student)",
      },
    ],
  },
  {
    id: "CS202",
    code: "CS202",
    name: "Data Structures",
    evaluationPeriod: "Spring Semester 2025/2026",
    tas: [
      {
        id: "TA2024010",
        name: "Omar Tarek",
        level: "Level 4 (Senior Student)",
      },
    ],
  },
];

const API_URL = import.meta.env.VITE_TA_EVAL_META_URL;

export default function TAEvaluationForm() {
  const { colors } = useThemeContext();
  const { t } = useTranslation();

  const isDark = colors?.mode === "dark";

  const [loading, setLoading] = useState(true);
  const [coursesData, setCoursesData] = useState(fallbackCoursesData);

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedTaId, setSelectedTaId] = useState("");
  const [studentName, setStudentName] = useState("");

  // ---------------- LOGIC زي ما هو ----------------
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
        const data = await res.json();

        // TODO: لما الـ API يجهز حوّلي شكل الداتا هنا
        // setCoursesData(mappedDataFromApi);
        setCoursesData(fallbackCoursesData);
      } catch (err) {
        console.error("TA Evaluation API error, using fallback:", err);
        setCoursesData(fallbackCoursesData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const selectedCourse = coursesData.find((c) => c.id === selectedCourseId);
  const availableTas = selectedCourse?.tas || [];
  const selectedTa = availableTas.find((ta) => ta.id === selectedTaId) || null;

  const evaluationPeriod =
    selectedCourse?.evaluationPeriod || "Fall Semester 2025/2026";
  const taIdValue = selectedTa?.id || "";
  const taLevelValue = selectedTa?.level || "";

  // ---------------- STYLES: كل الألوان من colors.* ----------------
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

    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },

    // اللون الافتراضي لباقي الفيلدز (رمادي من الثيم)
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

 "& input::-webkit-input-placeholder": { opacity: 1, fontSize: "12px", color: "#6D6B6B" },
"& input::-moz-placeholder": { opacity: 1, fontSize: "12px", color: "#6D6B6B" },
"& input:-ms-input-placeholder": { opacity: 1, fontSize: "12px", color: "#6D6B6B" },

    "& input:focus": {
      outline: "none !important",
      boxShadow: "none !important",
    },

    "& .MuiInputBase-root:focus-within": {
      outline: "none !important",
      boxShadow: "none !important",
      border: `1px solid ${
        colors?.border || (isDark ? "#374151" : "#D9D9D9")
      } !important`,
    },

    "& .MuiInputBase-root.Mui-focused": {
      border: `1px solid ${
        colors?.border || (isDark ? "#374151" : "#D9D9D9")
      } !important`,
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
        px: { xs: 2, md: 4 }, 
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
          {t("TA Evaluation")}
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
          borderTop: `1px solid ${
            colors?.border || (isDark ? "#1E293B" : "#E5E7EB")
          }`,
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

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Grid container spacing={4}>
            {/* العمود الشمال */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: 2,
                }}
              >
                {/* Course * */}
                <Box>
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
                        color: colors?.text || "#111827", // أسود زي فيجما
                      },
                    }}
                    value={selectedCourseId}
                    onChange={(e) => {
                      setSelectedCourseId(e.target.value);
                      setSelectedTaId("");
                    }}
                    SelectProps={{
                      displayEmpty: true,
                      IconComponent: ChevronsUpDown,
                    }}
                  >
                    <MenuItem value="" disabled>
                      <span
                        style={{
                          color: colors?.text || "#000000",
                          fontSize: "12px",
                        }}
                      >
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

                {/* TA Name */}
                <Box>
                  <Typography sx={labelTextSx}>{t("TA Name")}</Typography>
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
                        color: colors?.text || "#111827", // أسود
                      },
                    }}
                    value={selectedTaId}
                    disabled={!selectedCourseId}
                    onChange={(e) => setSelectedTaId(e.target.value)}
                    SelectProps={{
                      displayEmpty: true,
                      IconComponent: ChevronsUpDown,
                    }}
                  >
                    <MenuItem value="" disabled>
                      <span
                        style={{
                          color: colors?.text || "#000000",
                          fontSize: "12px",
                        }}
                      >
                        {t("Select TA")}
                      </span>
                    </MenuItem>

                    {availableTas.length === 0 && (
                      <MenuItem disabled value="">
                        <span
                          style={{
                            color: colors?.secondary || "#6B7280",
                            fontSize: "12px",
                          }}
                        >
                          {t("No TA available")}
                        </span>
                      </MenuItem>
                    )}

                    {availableTas.map((ta) => (
                      <MenuItem key={ta.id} value={ta.id}>
                        {ta.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                {/* Evaluation period */}
                <Box>
                  <Typography sx={labelTextSx}>{t("Evaluation period")}</Typography>
                  <TextField
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
                        color: "#6B7280",
                      },
                    }}
                    value={evaluationPeriod}
                    InputProps={{ readOnly: true }}
                  />
                </Box>
              </Box>
            </Grid>

            {/* العمود اليمين */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: 2,
                }}
              >
                {/* Student Name (optional) */}
                <Box>
                  <Typography sx={labelTextSx}>
                    {t("Student Name")}{" "}
                    <Typography
                      component="span"
                      sx={{
                        fontSize: 12,
                        fontWeight: 400,
                        color: colors?.secondary || "#94A3B8",
                      }}
                    >
                      {t("(optional)")}
                    </Typography>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder={t("Enter your Name")}
                    sx={{
                      ...fieldSx,
                      "& .MuiInputBase-input, & .MuiSelect-select": {
                        padding: 0,
                        fontSize: "12px",
                        fontWeight: 500,
                        lineHeight: "16px",
                        color: "#6B7280",
                      },
                    }}
                  />
                </Box>

                {/* TA ID */}
                <Box>
                  <Typography sx={labelTextSx}>{t("TA ID")}</Typography>
                  <TextField
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
                        color: "#6B7280",
                      },
                    }}
                    value={taIdValue}
                    InputProps={{ readOnly: true }}
                    placeholder={t("TA ID")}
                  />
                </Box>

                {/* Student Level */}
                <Box>
                  <Typography sx={labelTextSx}>{t("Student Level")}</Typography>
                  <TextField
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
                        color: "#6B7280",
                      },
                    }}
                    value={taLevelValue}
                    InputProps={{ readOnly: true }}
                    placeholder={t("Level 4 (Senior Student)")}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
}
