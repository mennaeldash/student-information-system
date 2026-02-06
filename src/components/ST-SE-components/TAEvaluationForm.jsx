// src/components/ST-SE-components/TAEvaluationForm.jsx
import React, { useEffect, useState, useMemo } from "react";
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
import EvaluationTabs from "./EvaluationTabs";
import { useNavigate } from "react-router-dom";

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

export default function TAEvaluationForm({ active = "ta", setActive = () => {} }) {
  const navigate = useNavigate(); // ✅ لازم يكون هنا فقط

  const { colors } = useThemeContext();
  const { t } = useTranslation();
  const isDark = colors?.mode === "dark";

  const [loading, setLoading] = useState(true);
  const [coursesData, setCoursesData] = useState(fallbackCoursesData);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      // لو مفيش API → fallback
      if (!API_URL) {
        setCoursesData(fallbackCoursesData);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to load from API");
        const data = await res.json();

        if (cancelled) return;

        // ✅ استخدم الداتا اللي جاية من الـ API فعلاً
        // لو الـ API بيرجع شكل مختلف، عدل الـ mapping هنا
        const safeData = Array.isArray(data) && data.length ? data : fallbackCoursesData;
        setCoursesData(safeData);
      } catch (err) {
        console.error("TA Evaluation API error, using fallback:", err);
        if (!cancelled) setCoursesData(fallbackCoursesData);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedCourse = useMemo(
    () => coursesData.find((c) => c.id === selectedCourseId) || null,
    [coursesData, selectedCourseId]
  );

  // (دلوقتي انت بتعرض Level لأول TA في الكورس)
  const taLevelValue = selectedCourse?.tas?.[0]?.level || "";

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
    "& input::-webkit-input-placeholder": { opacity: 1, fontSize: "12px", color: "#6D6B6B" },
    "& input::-moz-placeholder": { opacity: 1, fontSize: "12px", color: "#6D6B6B" },
    "& input:-ms-input-placeholder": { opacity: 1, fontSize: "12px", color: "#6D6B6B" },
    "& input:focus": { outline: "none !important", boxShadow: "none !important" },
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
    mb: 1,
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
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
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
                    <span style={{ color: colors?.text || "#000000", fontSize: "12px" }}>
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

            <Grid item xs={12} md={6}>
              <Box>
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
                  value={taLevelValue || t("Select Course")}
                  InputProps={{ readOnly: true }}
                  placeholder={t("Level 4 (Senior Student)")}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 6 }}>
          <EvaluationTabs value={active} onChange={setActive} />
        </Box>
      </Box>
    </Paper>
  );
}
