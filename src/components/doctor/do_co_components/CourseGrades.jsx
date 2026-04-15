import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  Chip,
  CircularProgress,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import AddIcon from "@mui/icons-material/Add";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useThemeContext } from "../../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";

/* ─────────────────────────────────────────────
   Grade columns config
───────────────────────────────────────────── */
const GRADE_COLUMNS = [
  { key: "quiz1",       label: "Quiz1",        max: 10 },
  { key: "quiz2",       label: "Quiz2",        max: 10 },
  { key: "quiz3",       label: "Quiz3",        max: 10 },
  { key: "assignment1", label: "Assignment 1", max: 5 },
  { key: "assignment2", label: "Assignment 2", max: 5 },
  { key: "project",     label: "Project",      max: 5 },
  { key: "midterm",     label: "MidTerm",      max: 20 },
  { key: "final",       label: "Final",        max: 35 },
];

const TOTAL_MAX = GRADE_COLUMNS.reduce((s, c) => s + c.max, 0); // = 100

/* ─────────────────────────────────────────────
   Mock student generator
───────────────────────────────────────────── */
const FIRST_NAMES = [
  "Mohamed", "Ahmed", "Fatima", "Omar", "Sara",
  "Youssef", "Nadia", "Khalid", "Mariam", "Hassan",
  "Ali", "Layla", "Ibrahim", "Mona", "Tarek",
  "Rania", "Karim", "Dina", "Ayman", "Heba",
];
const LAST_NAMES = [
  "Yasser", "Al-Rashid", "Khalil", "Shaban", "Ibrahim",
  "Hassan", "Yousef", "Al-Mansour", "Fawzy", "Gaber",
];

const TOTAL_STUDENTS = 100;
const PAGE_SIZE = 5;

function makeMockGradeStudent(idx) {
  const fn = FIRST_NAMES[idx % FIRST_NAMES.length];
  const ln = LAST_NAMES[idx % LAST_NAMES.length];
  const grades = {};
  GRADE_COLUMNS.forEach((col) => {
    if (col.key === "quiz3" || col.key === "assignment2") {
      grades[col.key] = null;
    } else {
      grades[col.key] = Math.min(
        col.max,
        Math.floor(col.max * 0.7 + ((idx * 3 + col.max) % (col.max * 0.3 + 1)))
      );
    }
  });
  const total = Object.values(grades).reduce((s, v) => s + (v ?? 0), 0);
  return {
    id: `${2200914 + idx}`,
    name: `${fn} ${ln} Mohamed`,
    initials: `${fn[0]}${ln[0]}`,
    color: "#3B82F6",
    avatar: null,
    grades,
    total,
  };
}

function fetchGradeStudents(page) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = page * PAGE_SIZE;
      const end = Math.min(start + PAGE_SIZE, TOTAL_STUDENTS);
      const students = [];
      for (let i = start; i < end; i++) students.push(makeMockGradeStudent(i));
      resolve({ students, hasMore: end < TOTAL_STUDENTS });
    }, 500);
  });
}

/* ─────────────────────────────────────────────
   GradeCell — editable score cell
───────────────────────────────────────────── */
function GradeCell({ value, max, onChange, isDark, colors }) {
  const isEmpty = value === null || value === undefined;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 0,
        py: "10px",
      }}
    >
      {isEmpty ? (
        <Typography
          sx={{
            fontSize: "13px",
            color: colors?.secondary ?? "#94A3B8",
            userSelect: "none",
            letterSpacing: "0.05em",
          }}
        >
          ---
        </Typography>
      ) : (
        <Box
          component="input"
          type="number"
          value={value}
          min={0}
          max={max}
          onChange={(e) => {
            const v = Math.min(max, Math.max(0, Number(e.target.value) || 0));
            onChange(v);
          }}
          sx={{
            width: 46,
            height: 32,
            textAlign: "center",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "#E2E8F0"}`,
            borderRadius: "6px",
            bgcolor: isDark ? "rgba(255,255,255,0.04)" : "#F8FAFC",
            color: colors?.text ?? "#09090B",
            fontSize: "13px",
            fontWeight: 500,
            outline: "none",
            transition: "border-color 0.15s, box-shadow 0.15s",
            "&:focus": {
              borderColor: colors?.info ?? "#2563EB",
              boxShadow: `0 0 0 2px ${isDark ? "rgba(37,99,235,0.25)" : "rgba(37,99,235,0.12)"}`,
            },
            "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
              WebkitAppearance: "none",
              margin: 0,
            },
            MozAppearance: "textfield",
          }}
        />
      )}
    </Box>
  );
}

/* ═════════════════════════════════════════════
   CourseGrades — main exported component
═════════════════════════════════════════════ */
export default function CourseGrades() {
  const { colors } = useThemeContext();
  const { t } = useTranslation();
  const isDark = colors?.mode === "dark";

  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [filter, setFilter] = useState("all");
  const initialized = useRef(false);

  /* ── Initial load ── */
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    setLoadingMore(true);
    fetchGradeStudents(0).then((res) => {
      setStudents(res.students);
      setPage(1);
      setHasMore(res.hasMore);
      setLoadingMore(false);
    });
  }, []);

  /* ── Load more ── */
  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const res = await fetchGradeStudents(page);
    setStudents((prev) => [...prev, ...res.students]);
    setPage((p) => p + 1);
    setHasMore(res.hasMore);
    setLoadingMore(false);
  }, [loadingMore, hasMore, page]);

  /* ── Grade change ── */
  const handleGradeChange = useCallback((studentId, colKey, value) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const newGrades = { ...s.grades, [colKey]: value };
        const newTotal = Object.values(newGrades).reduce(
          (sum, v) => sum + (v ?? 0),
          0
        );
        return { ...s, grades: newGrades, total: newTotal };
      })
    );
  }, []);

  /* ── Save ── */
  const handleSave = useCallback(async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
  }, []);

  /* ── Export ── */
  const handleExport = useCallback(async () => {
    setExporting(true);
    await new Promise((r) => setTimeout(r, 500));
    const rows = students.map((s) => {
      const row = { "Student Name": s.name, "Student ID": s.id };
      GRADE_COLUMNS.forEach((col) => {
        row[col.label] = s.grades[col.key] ?? "—";
      });
      row["Total"] = s.total;
      return row;
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Grades");
    XLSX.writeFile(wb, "Course_Grades.xlsx");
    setExporting(false);
  }, [students]);

  const headerBg = isDark ? "rgba(255,255,255,0.04)" : "#F1F5F9";
  const rowBorder = isDark ? "rgba(255,255,255,0.06)" : "#E5E7EB";

  return (
    <Box sx={{ width: "100%" }}>
      {/* ══════ Top bar ══════ */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: "12px",
          mb: "16px",
        }}
      >
        {/* Left: filter + status */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          {/* Filter dropdown */}
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              displayEmpty
              IconComponent={KeyboardArrowDownIcon}
              renderValue={(val) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TuneIcon
                    sx={{
                      fontSize: 16,
                      color: colors?.secondary ?? "#64748B",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "13.5px",
                      color: colors?.text ?? "#09090B",
                    }}
                  >
                    {val === "all" ? t("grades.allStudents") : val}
                  </span>
                </Box>
              )}
              sx={{
                height: 36,
                borderRadius: "8px",
                bgcolor: isDark
                  ? colors?.cod ?? "#1E293B"
                  : "#FFFFFF",
                fontSize: "13.5px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "#E5E7EB",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: isDark
                    ? "rgba(255,255,255,0.18)"
                    : "#CBD5E1",
                },
              }}
            >
              <MenuItem value="all">{t("grades.allStudents")}</MenuItem>
            </Select>
          </FormControl>

          {/* Published badge */}
          <Chip
            label={t("grade.published")}
            size="small"
            sx={{
              height: 24,
              fontSize: "12px",
              fontWeight: 600,
              bgcolor: isDark ? "rgba(22,163,74,0.15)" : "#EFFFF4",
              color: colors?.success ?? "#16A34A",
              border: "none",
            }}
          />

          {/* Last save */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                bgcolor: colors?.success ?? "#16A34A",
              }}
            />
            <Typography
              sx={{
                fontSize: "13px",
                color: colors?.secondary ?? "#64748B",
              }}
            >
              {t("grades.lastSave")}: 10:30 AM
            </Typography>
          </Box>
        </Box>

        {/* Right: action buttons */}
        <Box sx={{ display: "flex", gap: "10px", flexShrink: 0 }}>
          <Box
            component="button"
            sx={{
              height: 36,
              px: "14px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              borderRadius: "8px",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#D1D5DB"}`,
              bgcolor: "transparent",
              color: colors?.text ?? "#09090B",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.12s",
              "&:hover": {
                bgcolor: isDark
                  ? "rgba(255,255,255,0.06)"
                  : "#F3F4F6",
              },
            }}
          >
            <AddIcon sx={{ fontSize: 16 }} />
            {t("grades.addGrade")}
          </Box>

          <Box
            component="button"
            onClick={handleSave}
            disabled={saving}
            sx={{
              height: 36,
              px: "14px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              borderRadius: "8px",
              border: "none",
              bgcolor: saving
                ? isDark ? "#334155" : "#94A3B8"
                : colors?.tabtn ?? "#1F609D",
              color: "#FFFFFF",
              fontSize: "13px",
              fontWeight: 600,
              cursor: saving ? "not-allowed" : "pointer",
              transition: "background 0.12s",
              "&:hover": { bgcolor: saving ? undefined : "#1A5089" },
            }}
          >
            {saving ? (
              <CircularProgress size={15} sx={{ color: "#FFF" }} />
            ) : (
              <SaveOutlinedIcon sx={{ fontSize: 16 }} />
            )}
            {t("grades.saveGrades")}
          </Box>
        </Box>
      </Box>

      {/* ══════ Table card ══════ */}
      <Box
        sx={{
          bgcolor: isDark ? colors?.cod ?? "#1E293B" : "#FFFFFF",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#E5E7EB"}`,
          borderRadius: "12px",
          overflow: "hidden",
          mb: "12px",
        }}
      >
        <Box sx={{ overflowX: "auto" }}>
          <Box sx={{ minWidth: 950 }}>
            {/* ── Table header ── */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: `2.2fr ${GRADE_COLUMNS.map(() => "1fr").join(" ")} 0.8fr`,
                bgcolor: headerBg,
                borderBottom: `1px solid ${rowBorder}`,
              }}
            >
              <Box sx={{ px: "16px", py: "10px" }}>
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: colors?.text ?? "#09090B",
                  }}
                >
                  {t("modal.student")}
                </Typography>
              </Box>
              {GRADE_COLUMNS.map((col) => (
                <Box key={col.key} sx={{ px: "4px", py: "10px", textAlign: "center" }}>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: colors?.text ?? "#09090B",
                      lineHeight: 1.2,
                    }}
                  >
                    {col.label}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "10.5px", color: colors?.secondary ?? "#64748B" }}
                  >
                    ({col.max})
                  </Typography>
                </Box>
              ))}
              <Box sx={{ px: "4px", py: "10px", textAlign: "center" }}>
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: colors?.text ?? "#09090B",
                    lineHeight: 1.2,
                  }}
                >
                  {t("modal.total")}
                </Typography>
                <Typography
                  sx={{ fontSize: "10.5px", color: colors?.secondary ?? "#64748B" }}
                >
                  ({TOTAL_MAX})
                </Typography>
              </Box>
            </Box>

            {/* ── Table rows ── */}
            {students.map((student, idx) => (
              <Box
                key={student.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: `2.2fr ${GRADE_COLUMNS.map(() => "1fr").join(" ")} 0.8fr`,
                  alignItems: "center",
                  borderBottom:
                    idx === students.length - 1 && !hasMore
                      ? "none"
                      : `1px solid ${rowBorder}`,
                  transition: "background 0.1s",
                  "&:hover": {
                    bgcolor: isDark
                      ? "rgba(255,255,255,0.02)"
                      : "rgba(0,0,0,0.01)",
                  },
                }}
              >
                {/* Student cell */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    px: "16px",
                    py: "12px",
                    minWidth: 0,
                  }}
                >
                  <Avatar
                    src={undefined}
                    sx={{
                      width: 34,
                      height: 34,
                      bgcolor: isDark ? "rgba(255,255,255,0.10)" : "#E2E8F0",
                      flexShrink: 0,
                      border: isDark
                        ? "2px solid rgba(255,255,255,0.06)"
                        : "2px solid #CBD5E1",
                    }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: colors?.text ?? "#09090B",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {student.name}
                    </Typography>
                    <Typography
                      sx={{ fontSize: "11px", color: colors?.secondary ?? "#64748B" }}
                    >
                      {student.id}
                    </Typography>
                  </Box>
                </Box>

                {/* Grade cells */}
                {GRADE_COLUMNS.map((col) => (
                  <GradeCell
                    key={col.key}
                    value={student.grades[col.key]}
                    max={col.max}
                    onChange={(v) => handleGradeChange(student.id, col.key, v)}
                    isDark={isDark}
                    colors={colors}
                  />
                ))}

                {/* Total cell */}
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    sx={{
                      fontSize: "13.5px",
                      fontWeight: 700,
                      color: colors?.text ?? "#09090B",
                    }}
                  >
                    {student.total}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ══════ Load more footer row ══════ */}
      <Box
        sx={{
          width: "100%",
          bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#E5E7EB"}`,
          borderRadius: "10px",
          mb: "16px",
          overflow: "hidden",
        }}
      >
        <Box
          onClick={!loadingMore && hasMore ? handleLoadMore : undefined}
          sx={{
            textAlign: "center",
            py: "12px",
            px: "16px",
            cursor: hasMore && !loadingMore ? "pointer" : "default",
            transition: "background 0.15s",
            "&:hover": {
              bgcolor:
                hasMore && !loadingMore
                  ? isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"
                  : "transparent",
            },
          }}
        >
          {loadingMore ? (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <CircularProgress size={13} sx={{ color: colors?.secondary ?? "#64748B" }} />
              <Typography sx={{ fontSize: "13px", color: colors?.secondary ?? "#64748B" }}>
                Loading more students... ({students.length} of {TOTAL_STUDENTS})
              </Typography>
            </Box>
          ) : hasMore ? (
            <Typography
              sx={{
                fontSize: "13px",
                color: colors?.info ?? "#2563EB",
                fontWeight: 500,
              }}
            >
              Load more students ({students.length} of {TOTAL_STUDENTS})
            </Typography>
          ) : (
            <Typography
              sx={{
                fontSize: "13px",
                color: colors?.secondary ?? "#64748B",
                fontStyle: "italic",
              }}
            >
              {t("modal.allStudentsLoaded")}
            </Typography>
          )}
        </Box>
      </Box>

      {/* ══════ Footer: Export Sheet ONLY ══════ */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <Box
          component="button"
          onClick={handleExport}
          disabled={exporting}
          sx={{
            height: 38,
            px: "16px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            borderRadius: "8px",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#D1D5DB"}`,
            bgcolor: "transparent",
            color: colors?.text ?? "#09090B",
            fontSize: "13px",
            fontWeight: 600,
            cursor: exporting ? "not-allowed" : "pointer",
            opacity: exporting ? 0.7 : 1,
            transition: "background 0.15s",
            "&:hover": {
              bgcolor: exporting
                ? undefined
                : isDark ? "rgba(255,255,255,0.06)" : "#F3F4F6",
            },
          }}
        >
          {exporting ? (
            <CircularProgress size={15} sx={{ color: colors?.secondary ?? "#64748B" }} />
          ) : (
            <FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />
          )}
          {t("modal.exportSheet")}
        </Box>
      </Box>
    </Box>
  );
}
