import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Modal,
  Fade,
  Backdrop,
  Avatar,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { useThemeContext } from "../../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";

/* ─────────────────────────────────────────────
   Mock student pool — simulates a large dataset.
   In production replace with real API.
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
  "Salem", "Nour", "Adel", "Rizk", "Osman",
  "Mahmoud", "Sayed", "Mostafa", "Refaat", "Hamdy",
];

const TOTAL_STUDENTS = 100;
const PAGE_SIZE = 5;

/** Generate a deterministic mock student for a given index */
function makeMockStudent(idx) {
  const fn = FIRST_NAMES[idx % FIRST_NAMES.length];
  const ln = LAST_NAMES[idx % LAST_NAMES.length];
  const att = 60 + ((idx * 7 + 3) % 41); // 60 – 100
  const total = 10;
  const absent = Math.max(0, Math.floor((100 - att) / 10));
  const present = total - absent;
  return {
    id: `${2200914 + idx}`,
    name: `${fn} ${ln} Mohamed`,
    initials: `${fn[0]}${ln[0]}`,
    color: "#3B82F6",
    avatar: null,
    attendance: att,
    present,
    absent,
    total,
  };
}

/** Simulate a paginated API call */
function fetchStudentsPage(page) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = page * PAGE_SIZE;
      const end = Math.min(start + PAGE_SIZE, TOTAL_STUDENTS);
      const students = [];
      for (let i = start; i < end; i++) students.push(makeMockStudent(i));
      resolve({
        students,
        hasMore: end < TOTAL_STUDENTS,
        totalCount: TOTAL_STUDENTS,
      });
    }, 600); // simulate network latency
  });
}

/* ─── Attendance color helper ─── */
function getAttendanceColor(pct, colors) {
  if (pct >= 80) return colors?.success ?? "#16A34A";
  if (pct >= 70) return colors?.warning ?? "#F59E0B";
  return colors?.danger ?? "#EF4444";
}

/* ─────────────────────────────────────────────
   DetailItem — one labelled value in the top section
───────────────────────────────────────────── */
function DetailItem({ label, value, colors }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        sx={{
          fontSize: "13px",
          color: colors?.info ?? "#2563EB",
          fontWeight: 500,
          mb: "6px",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: "15px",
          fontWeight: 500,
          color: colors?.text ?? "#09090B",
          pl: "12px",
        }}
      >
        {value || "—"}
      </Typography>
    </Box>
  );
}

/* ─────────────────────────────────────────────
   AttendanceRow — a single student row
───────────────────────────────────────────── */
function AttendanceRow({ student, isDark, colors, isLast }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "2.2fr 1fr 0.8fr 0.8fr 0.6fr" },
        alignItems: "center",
        px: "16px",
        py: "12px",
        borderBottom: isLast
          ? "none"
          : `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#E5E7EB"}`,
        transition: "background 0.12s",
        "&:hover": {
          bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.015)",
        },
      }}
    >
      {/* Student cell: avatar + name + id */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          minWidth: 0,
        }}
      >
        <Avatar
          src={student.avatar || undefined}
          sx={{
            width: 40,
            height: 40,
            bgcolor: student.avatar ? "transparent" : student.color,
            fontSize: "0.78rem",
            fontWeight: 700,
            flexShrink: 0,
            border: isDark
              ? "2px solid rgba(255,255,255,0.1)"
              : "2px solid #E5E7EB",
          }}
        >
          {!student.avatar && student.initials}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: "14px",
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
            sx={{
              fontSize: "12px",
              color: colors?.secondary ?? "#64748B",
            }}
          >
            {student.id}
          </Typography>
        </Box>
      </Box>

      {/* Attendance % */}
      <Typography
        sx={{
          fontSize: "14px",
          fontWeight: 600,
          color: getAttendanceColor(student.attendance, colors),
          display: { xs: "none", sm: "block" },
        }}
      >
        {student.attendance}%
      </Typography>

      {/* Present */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          alignItems: "center",
          gap: "6px",
        }}
      >
        <CheckCircleIcon
          sx={{ fontSize: 16, color: colors?.success ?? "#16A34A" }}
        />
        <Typography sx={{ fontSize: "14px", color: colors?.text ?? "#09090B" }}>
          {student.present}
        </Typography>
      </Box>

      {/* Absent */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          alignItems: "center",
          gap: "6px",
        }}
      >
        <CancelIcon
          sx={{ fontSize: 16, color: colors?.danger ?? "#EF4444" }}
        />
        <Typography sx={{ fontSize: "14px", color: colors?.text ?? "#09090B" }}>
          {student.absent}
        </Typography>
      </Box>

      {/* Total */}
      <Typography
        sx={{
          fontSize: "14px",
          fontWeight: 600,
          color: colors?.text ?? "#09090B",
          display: { xs: "none", sm: "block" },
        }}
      >
        {student.total}
      </Typography>
    </Box>
  );
}

/* ═════════════════════════════════════════════
   SectionDetailsModal — main export
═════════════════════════════════════════════ */
export default function SectionDetailsModal({ open, onClose, section }) {
  const { colors } = useThemeContext();
  const { t } = useTranslation();
  const isDark = colors?.mode === "dark";

  /* ── Pagination state ── */
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [exporting, setExporting] = useState(false);
  const prevSectionId = useRef(null);

  /* Reset & load initial page when a new section opens */
  useEffect(() => {
    if (!open || !section) return;
    if (section.id === prevSectionId.current) return; // same section, keep data
    prevSectionId.current = section.id;

    // Reset state
    setStudents([]);
    setPage(0);
    setHasMore(true);
    setLoadingMore(true);

    fetchStudentsPage(0).then((res) => {
      setStudents(res.students);
      setPage(1);
      setHasMore(res.hasMore);
      setLoadingMore(false);
    });
  }, [open, section]);

  /* Reset ref when modal closes so re-opening same section reloads */
  useEffect(() => {
    if (!open) prevSectionId.current = null;
  }, [open]);

  /* ── Load more handler ── */
  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const res = await fetchStudentsPage(page);
    setStudents((prev) => [...prev, ...res.students]);
    setPage((p) => p + 1);
    setHasMore(res.hasMore);
    setLoadingMore(false);
  }, [loadingMore, hasMore, page]);

  /* ── Excel export (uses currently loaded students) ── */
  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      const rows = students.map((s) => ({
        "Student Name": s.name,
        "Student ID": s.id,
        "Attendance %": s.attendance,
        Present: s.present,
        Absent: s.absent,
        Total: s.total,
      }));
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, section?.title ?? "Attendance");
      XLSX.writeFile(
        wb,
        `${section?.title?.replace(/\s+/g, "_") ?? "Section"}_Attendance.xlsx`
      );
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  }, [students, section]);

  if (!section) return null;

  const sectionNumber =
    section.title?.replace(/^Section\s*/i, "") || section.title;

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          sx: { bgcolor: "rgba(0,0,0,0.5)" },
          timeout: 280,
        },
      }}
    >
      <Fade in={open} timeout={280}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 900,
            maxWidth: "95vw",
            maxHeight: "92vh",
            overflowY: "auto",
            bgcolor: isDark ? "#0F172A" : "#FFFFFF",
            border: isDark
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid #E5E7EB",
            borderRadius: "16px",
            p: { xs: "16px", sm: "24px" },
            outline: "none",
            boxShadow: "0 25px 50px rgba(0,0,0,0.18)",
            "&::-webkit-scrollbar": { width: 6 },
            "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: isDark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.12)",
              borderRadius: 3,
            },
          }}
        >
          {/* ── Close button ── */}
          <Box
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              width: 32,
              height: 32,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: colors?.secondary ?? "#64748B",
              transition: "background 0.12s",
              zIndex: 1,
              "&:hover": {
                bgcolor: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9",
              },
            }}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </Box>

          {/* ── Modal title ── */}
          <Typography
            sx={{
              fontSize: "22px",
              fontWeight: 700,
              color: colors?.text ?? "#09090B",
              mb: "24px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {t("modal.sectionDetails")}
          </Typography>

          {/* ── Section info grid — 2×2 ── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              rowGap: "20px",
              columnGap: "32px",
              mb: "28px",
            }}
          >
            <DetailItem
              label={t("modal.sectionNumber")}
              value={sectionNumber}
              colors={colors}
            />
            <DetailItem
              label={t("modal.ta")}
              value={section.instructor}
              colors={colors}
            />
            <DetailItem
              label={t("modal.schedule")}
              value={`${section.days}  ${section.time}`}
              colors={colors}
            />
            <DetailItem
              label={t("modal.enrollment")}
              value={section.enrollment ?? "48 / 50"}
              colors={colors}
            />
          </Box>

          {/* ── Section Attendance header ── */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: "16px",
            }}
          >
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 700,
                color: colors?.text ?? "#09090B",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {t("modal.sectionAttendance")}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: colors?.secondary ?? "#64748B",
                }}
              >
                {t("modal.lastSaved")}: 10:30 AM
              </Typography>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: colors?.success ?? "#16A34A",
                }}
              />
            </Box>
          </Box>

          {/* ── Attendance table card ── */}
          <Box
            sx={{
              bgcolor: isDark ? colors?.cod ?? "#1E293B" : "#F9FAFB",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#E5E7EB"}`,
              borderRadius: "12px",
              overflow: "hidden",
              mb: "12px",
            }}
          >
            {/* Table header */}
            <Box
              sx={{
                display: { xs: "none", sm: "grid" },
                gridTemplateColumns: "2.2fr 1fr 0.8fr 0.8fr 0.6fr",
                px: "16px",
                py: "12px",
                bgcolor: isDark ? "rgba(255,255,255,0.04)" : "#F1F5F9",
                borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#E5E7EB"}`,
              }}
            >
              {[
                t("modal.student"),
                t("modal.attendance"),
                t("modal.present"),
                t("modal.absent"),
                t("modal.total"),
              ].map((h) => (
                <Typography
                  key={h}
                  sx={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: colors?.secondary ?? "#64748B",
                  }}
                >
                  {h}
                </Typography>
              ))}
            </Box>

            {/* Table rows */}
            {students.map((student, idx) => (
              <AttendanceRow
                key={student.id}
                student={student}
                isDark={isDark}
                colors={colors}
                isLast={idx === students.length - 1 && !hasMore}
              />
            ))}
          </Box>

          {/* ── Load more / all loaded indicator ── */}
          <Box
            onClick={!loadingMore && hasMore ? handleLoadMore : undefined}
            sx={{
              textAlign: "center",
              py: "10px",
              mb: "16px",
              cursor: hasMore && !loadingMore ? "pointer" : "default",
              borderRadius: "8px",
              transition: "background 0.12s",
              "&:hover": {
                bgcolor:
                  hasMore && !loadingMore
                    ? isDark
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(0,0,0,0.025)"
                    : "transparent",
              },
            }}
          >
            {loadingMore ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <CircularProgress
                  size={14}
                  sx={{ color: colors?.secondary ?? "#64748B" }}
                />
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: colors?.secondary ?? "#64748B",
                  }}
                >
                  {t("modal.loadingMore")}
                </Typography>
              </Box>
            ) : hasMore ? (
              <Typography
                sx={{
                  fontSize: "13px",
                  color: colors?.info ?? "#2563EB",
                  fontWeight: 500,
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {t("modal.loadMoreStudents")} ({students.length} of{" "}
                {TOTAL_STUDENTS})
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

          {/* ── Footer: Export button ── */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Box
              component="button"
              onClick={handleExport}
              disabled={exporting}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                height: 40,
                px: "16px",
                borderRadius: "8px",
                border: "none",
                bgcolor: exporting
                  ? isDark
                    ? "#334155"
                    : "#94A3B8"
                  : colors?.tabtn ?? "#1F609D",
                color: "#FFFFFF",
                fontSize: "14px",
                fontWeight: 600,
                cursor: exporting ? "not-allowed" : "pointer",
                opacity: exporting ? 0.8 : 1,
                transition: "background 0.15s, transform 0.1s, opacity 0.15s",
                "&:hover": {
                  bgcolor: exporting ? undefined : "#1A5089",
                },
                "&:active": {
                  transform: exporting ? "none" : "scale(0.98)",
                },
              }}
            >
              {exporting ? (
                <CircularProgress size={18} sx={{ color: "#FFFFFF" }} />
              ) : (
                <FileDownloadOutlinedIcon sx={{ fontSize: 18 }} />
              )}
              {exporting ? t("modal.exporting") : t("modal.exportSheet")}
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
