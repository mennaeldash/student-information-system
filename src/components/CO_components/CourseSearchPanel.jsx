// src/components/CourseSearchPanel.jsx
import React from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Popover,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlined from "@mui/icons-material/FilterAltOutlined";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../../services/theme_context.jsx";

function useDebouncedValue(value, delay = 300) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

export default function CourseSearchPanel({
  courses = [],
  value = { query: "", semester: "all" },
  onChange = () => {},
  themeColors,
  width,
}) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  // توحيد اسم الألوان
  const { colors: ctxColors } = useThemeContext();
  const colors = themeColors ?? ctxColors ?? {};

  const [anchor, setAnchor] = React.useState(null);
  const [query, setQuery] = React.useState(value.query || "");
  const [semester, setSemester] = React.useState(value.semester || "all");
  const debouncedQuery = useDebouncedValue(query, 300);

  const semesters = React.useMemo(() => {
    const s = Array.from(new Set(courses.map((c) => c.semester).filter(Boolean)));
    return ["all", ...s];
  }, [courses]);

  const nameOptions = React.useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const base = courses.map((c) => c.name).filter(Boolean);
    if (!q) return Array.from(new Set(base)).slice(0, 15);
    return Array.from(new Set(base.filter((n) => n.toLowerCase().includes(q)))).slice(0, 15);
  }, [courses, debouncedQuery]);

  React.useEffect(() => {
    onChange({ query: debouncedQuery, semester });
  }, [debouncedQuery, semester, onChange]);

  const open = Boolean(anchor);

  return (
    <Paper
      elevation={0}
      dir={i18n.dir()} // ✅ اتجاه حسب اللغة
      sx={{
        borderRadius: 4,
        border: `1px solid ${colors?.border || "#e5e7eb"}`,
        bgcolor: colors?.box || theme.palette.background.paper,
          p: { xs: 2, md: 2 },
width: width ?? { xs: "100%", md: "100%" },
  minWidth: 0, 
      }}
    >
      {/* عنوان ووصف */}
      <Box sx={{ textAlign: "left" }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, color: colors?.text || theme.palette.text.primary }}
        >
          {t("course_search")}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: colors?.secondary || theme.palette.text.secondary, mt: 0.5 }}
        >
          {t("search_helper")}
        </Typography>
      </Box>

      {/* صف الإدخالات */}
      <Box
        sx={{
          mt: 2,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          width: "80%",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 260 }}>
          <Autocomplete
            freeSolo
            options={nameOptions}
            onInputChange={(e, v) => setQuery(v ?? "")}
            inputValue={query}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={t("search")}
                size="small"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "#fff",
                    "& fieldset": { borderColor: colors?.border || "#E5E7EB" },
                    "&:hover fieldset": { borderColor: colors?.border || "#E5E7EB" },

                    // منع الأزرق عند الـ focus
                    "&.Mui-focused": { outline: "none !important", boxShadow: "none !important" },
                    "&.Mui-focused fieldset": { borderColor: colors?.border || "#E5E7EB" },
                  },
                  "& .MuiOutlinedInput-input": {
                    "&:focus": { outline: "none !important", boxShadow: "none !important" },
                  },
                }}
              />
            )}
          />
        </Box>

        {/* زر الفلاتر */}
        <Button
          variant="outlined"
          onClick={(e) => setAnchor(e.currentTarget)}
          startIcon={<FilterAltOutlined />}
          sx={{
            height: 40,
            borderRadius: 2,
            fontSize:13,
            fontWeight: 400,
            whiteSpace: "nowrap",
            borderColor: colors?.border || "divider",
            color: colors?.text || "text.primary",
          }}
        >
          {t("more_filters")}
        </Button>
      </Box>

      {/* Popover للفلاتر */}
      <Popover
        open={open}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 2,
            borderRadius: 3,
            border: `1px solid ${colors?.border || "divider"}`,
            bgcolor: colors?.box || theme.palette.background.paper,
          },
        }}
      >
        <Box sx={{ width: 260 }}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1.5, fontWeight: 700, color: colors?.text || "text.primary" }}
          >
            {t("filters")}
          </Typography>

          <FormControl fullWidth>
            <InputLabel id="semester-label">{t("semester")}</InputLabel>
            <Select
              labelId="semester-label"
              label={t("semester")}
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              {semesters.map((s) => (
                <MenuItem key={s} value={s}>
                  {s === "all" ? t("all") : s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Popover>
    </Paper>
  );
}
