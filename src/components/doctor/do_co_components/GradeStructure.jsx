import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Chip,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PublishIcon from "@mui/icons-material/Publish";
import { useThemeContext } from "../../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

/* ─────────────────────────────────────────────
   Default mock data
───────────────────────────────────────────── */
const DEFAULT_COMPONENTS = [
  { id: 1, title: "Midterm Exam",  type: "Exam",       maxScore: 20, weight: 15, date: "Oct 15, 2024", duration: "120 Mins", description: "", status: "published" },
  { id: 2, title: "Final Exam",    type: "Exam",       maxScore: 40, weight: 30, date: "Jan 10, 2025", duration: "180 Mins", description: "", status: "published" },
  { id: 3, title: "Quiz 1",        type: "Quiz",       maxScore: 10, weight: 5,  date: "Sep 20, 2024", duration: "30 Mins",  description: "", status: "draft" },
  { id: 4, title: "Quiz 2",        type: "Quiz",       maxScore: 10, weight: 5,  date: "Nov 5, 2024",  duration: "30 Mins",  description: "", status: "draft" },
  { id: 5, title: "Assignment 1",  type: "Assignment", maxScore: 15, weight: 10, date: "",             duration: "",         description: "Bi-weekly submissions", status: "published" },
  { id: 6, title: "Assignment 2",  type: "Assignment", maxScore: 15, weight: 10, date: "",             duration: "",         description: "Bi-weekly submissions", status: "draft" },
  { id: 7, title: "Lab Work",      type: "Assignment", maxScore: 20, weight: 15, date: "",             duration: "",         description: "Weekly lab exercises",   status: "published" },
  { id: 8, title: "Participation", type: "Assignment", maxScore: 10, weight: 10, date: "",             duration: "",         description: "Class participation",    status: "published" },
];

let nextId = 100;

/* ─────────────────────────────────────────────
   GradeComponentCard
───────────────────────────────────────────── */
function GradeComponentCard({ comp, onEdit, onDelete, isDark, colors, t }) {
  const subtitle = comp.date && comp.duration
    ? `${comp.date} • ${comp.duration}`
    : comp.description || "—";

  const isPublished = comp.status === "published";

  return (
    <Box
      sx={{
        bgcolor: isDark ? "#0F172A" : "#FFFFFF",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#E5E7EB"}`,
        borderRadius: "10px",
        p: "16px",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.15s, box-shadow 0.15s",
        "&:hover": {
          transform: { xs: "none", md: "translateY(-2px)" },
          boxShadow: {
            xs: "none",
            md: isDark
              ? "0 6px 20px rgba(0,0,0,0.5)"
              : "0 6px 20px rgba(0,0,0,0.08)",
          },
        },
      }}
    >
      {/* ── Header: title + actions ── */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: "4px",
        }}
      >
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: 600,
            color: colors?.text ?? "#09090B",
            lineHeight: 1.3,
          }}
        >
          {comp.title}
        </Typography>
        <Box sx={{ display: "flex", gap: "2px", ml: "8px", flexShrink: 0 }}>
          <IconButton
            size="small"
            onClick={() => onEdit(comp)}
            sx={{
              color: colors?.info ?? "#2563EB",
              "&:hover": { bgcolor: isDark ? "rgba(37,99,235,0.12)" : "rgba(37,99,235,0.08)" },
            }}
          >
            <EditOutlinedIcon sx={{ fontSize: 17 }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(comp.id)}
            sx={{
              color: colors?.danger ?? "#EF4444",
              "&:hover": { bgcolor: isDark ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.08)" },
            }}
          >
            <DeleteOutlineIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Box>
      </Box>

      {/* ── Subtitle ── */}
      <Typography
        sx={{
          fontSize: "12.5px",
          color: colors?.secondary ?? "#64748B",
          mb: "10px",
        }}
      >
        {subtitle}
      </Typography>

      {/* ── Divider ── */}
      <Divider
        sx={{
          borderColor: isDark ? "rgba(255,255,255,0.06)" : "#E5E7EB",
          mb: "12px",
        }}
      />

      {/* ── Info rows ── */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {/* Max Score */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={{ fontSize: "13px", color: colors?.secondary ?? "#64748B" }}>
            {t("grade.maxScore")}:
          </Typography>
          <Typography sx={{ fontSize: "13.5px", fontWeight: 600, color: colors?.text ?? "#09090B" }}>
            {comp.maxScore}
          </Typography>
        </Box>

        {/* Weight */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={{ fontSize: "13px", color: colors?.secondary ?? "#64748B" }}>
            {t("grade.weight")}:
          </Typography>
          <Typography sx={{ fontSize: "13.5px", fontWeight: 600, color: colors?.info ?? "#2563EB" }}>
            {comp.weight}%
          </Typography>
        </Box>

        {/* Status */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={{ fontSize: "13px", color: colors?.secondary ?? "#64748B" }}>
            {t("grade.status")}:
          </Typography>
          <Chip
            label={isPublished ? t("grade.published") : t("grade.draft")}
            size="small"
            sx={{
              height: 22,
              fontSize: "11.5px",
              fontWeight: 600,
              bgcolor: isPublished
                ? isDark ? "rgba(22,163,74,0.15)" : "#EFFFF4"
                : isDark ? "rgba(245,158,11,0.15)" : "#FFF8E6",
              color: isPublished
                ? colors?.success ?? "#16A34A"
                : colors?.warning ?? "#D97706",
              border: "none",
              "& .MuiChip-label": { px: "8px" },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

/* ─────────────────────────────────────────────
   AddEditDialog — shared for create + edit
───────────────────────────────────────────── */
function AddEditDialog({ open, onClose, onSave, initial, isDark, colors, t }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(
    initial ?? {
      title: "",
      type: "Exam",
      maxScore: "",
      weight: "",
      date: "",
      duration: "",
      description: "",
      status: "draft",
    }
  );

  // Reset form when dialog opens with new data
  React.useEffect(() => {
    if (open) {
      setForm(
        initial ?? {
          title: "",
          type: "Exam",
          maxScore: "",
          weight: "",
          date: "",
          duration: "",
          description: "",
          status: "draft",
        }
      );
    }
  }, [open, initial]);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = () => {
    if (!form.title || !form.maxScore || !form.weight) return;
    onSave({
      ...form,
      maxScore: Number(form.maxScore),
      weight: Number(form.weight),
      id: initial?.id ?? nextId++,
    });
    onClose();
  };

  const dialogBg = isDark ? "#0F172A" : "#FFFFFF";
  const fieldBg = isDark ? "#1E293B" : "#F9FAFB";
  const fieldBorder = isDark ? "rgba(255,255,255,0.08)" : "#E5E7EB";

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      bgcolor: fieldBg,
      borderRadius: "8px",
      fontSize: "14px",
      color: colors?.text ?? "#09090B",
      "& fieldset": { borderColor: fieldBorder },
      "&:hover fieldset": { borderColor: isDark ? "rgba(255,255,255,0.18)" : "#CBD5E1" },
    },
    "& .MuiInputLabel-root": { color: colors?.secondary ?? "#64748B", fontSize: "13px" },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: dialogBg,
          borderRadius: "14px",
          border: isDark ? "1px solid rgba(255,255,255,0.08)" : "none",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: "18px",
          color: colors?.text ?? "#09090B",
          fontFamily: "Inter, sans-serif",
          pb: 1,
        }}
      >
        {isEdit ? t("grade.editComponent") : t("grade.addComponent")}
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: "16px", pt: "8px !important" }}>
        <TextField label={t("grade.title")} value={form.title} onChange={handleChange("title")} fullWidth sx={fieldSx} />

        <FormControl fullWidth sx={fieldSx}>
          <InputLabel>{t("grade.type")}</InputLabel>
          <Select value={form.type} label={t("grade.type")} onChange={handleChange("type")}>
            <MenuItem value="Exam">{t("grade.exam")}</MenuItem>
            <MenuItem value="Quiz">{t("grade.quiz")}</MenuItem>
            <MenuItem value="Assignment">{t("grade.assignment")}</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", gap: "12px" }}>
          <TextField label={t("grade.maxScore")} value={form.maxScore} onChange={handleChange("maxScore")} type="number" fullWidth sx={fieldSx} />
          <TextField label={`${t("grade.weight")} (%)`} value={form.weight} onChange={handleChange("weight")} type="number" fullWidth sx={fieldSx} />
        </Box>

        <Box sx={{ display: "flex", gap: "12px" }}>
          <TextField label={t("grade.date")} value={form.date} onChange={handleChange("date")} fullWidth sx={fieldSx} placeholder="e.g. Oct 15, 2024" />
          <TextField label={t("grade.duration")} value={form.duration} onChange={handleChange("duration")} fullWidth sx={fieldSx} placeholder="e.g. 120 Mins" />
        </Box>

        <TextField label={t("grade.description")} value={form.description} onChange={handleChange("description")} fullWidth multiline minRows={2} sx={fieldSx} />

        <FormControl fullWidth sx={fieldSx}>
          <InputLabel>{t("grade.status")}</InputLabel>
          <Select value={form.status} label={t("grade.status")} onChange={handleChange("status")}>
            <MenuItem value="draft">{t("grade.draft")}</MenuItem>
            <MenuItem value="published">{t("grade.published")}</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: colors?.secondary ?? "#64748B", textTransform: "none" }}>
          {t("grade.cancel")}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            bgcolor: colors?.tabtn ?? "#1F609D",
            "&:hover": { bgcolor: "#1A5089" },
          }}
        >
          {isEdit ? t("grade.save") : t("grade.add")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ─────────────────────────────────────────────
   ConfirmDeleteDialog
───────────────────────────────────────────── */
function ConfirmDeleteDialog({ open, onClose, onConfirm, isDark, colors, t }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: isDark ? "#0F172A" : "#FFFFFF",
          borderRadius: "14px",
          border: isDark ? "1px solid rgba(255,255,255,0.08)" : "none",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: "17px", color: colors?.text ?? "#09090B" }}>
        {t("grade.confirmDelete")}
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ fontSize: "14px", color: colors?.secondary ?? "#64748B" }}>
          {t("grade.confirmDeleteMsg")}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: colors?.secondary ?? "#64748B", textTransform: "none" }}>
          {t("grade.cancel")}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            bgcolor: colors?.danger ?? "#EF4444",
            "&:hover": { bgcolor: "#DC2626" },
          }}
        >
          {t("grade.delete")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ═════════════════════════════════════════════
   GradeStructure — main export
═════════════════════════════════════════════ */
export default function GradeStructure() {
  const { colors } = useThemeContext();
  const { t } = useTranslation();
  const isDark = colors?.mode === "dark";

  const [components, setComponents] = useState(DEFAULT_COMPONENTS);
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [publishError, setPublishError] = useState("");

  const totalWeight = components.reduce((s, c) => s + c.weight, 0);

  /* ── CRUD handlers ── */
  const handleAdd = useCallback(
    (comp) => setComponents((prev) => [...prev, comp]),
    []
  );

  const handleEdit = useCallback(
    (comp) =>
      setComponents((prev) =>
        prev.map((c) => (c.id === comp.id ? comp : c))
      ),
    []
  );

  const handleDelete = useCallback(() => {
    setComponents((prev) => prev.filter((c) => c.id !== deleteId));
    setDeleteId(null);
  }, [deleteId]);

  const handlePublish = useCallback(() => {
    if (totalWeight !== 100) {
      setPublishError(t("grade.weightError"));
      setTimeout(() => setPublishError(""), 4000);
      return;
    }
    setComponents((prev) =>
      prev.map((c) => ({ ...c, status: "published" }))
    );
    setPublishError("");
  }, [totalWeight, t]);

  return (
    <Box sx={{ width: "100%" }}>
      {/* ── Header row ── */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: "12px",
          mb: "24px",
        }}
      >
        {/* Left: title + subtitle */}
        <Box>
          <Typography
            sx={{
              fontSize: "22px",
              fontWeight: 700,
              color: colors?.text ?? "#09090B",
              fontFamily: "Inter, sans-serif",
              mb: "4px",
            }}
          >
            {t("grade.gradeDistribution")}
          </Typography>
          <Typography
            sx={{
              fontSize: "13.5px",
              color: colors?.secondary ?? "#64748B",
            }}
          >
            {t("grade.totalWeightHint")}
            {totalWeight !== 100 && (
              <Box
                component="span"
                sx={{
                  ml: "8px",
                  fontWeight: 600,
                  color:
                    totalWeight === 100
                      ? colors?.success ?? "#16A34A"
                      : colors?.warning ?? "#D97706",
                }}
              >
                ({totalWeight}%)
              </Box>
            )}
          </Typography>
        </Box>

        {/* Right: action buttons */}
        <Box sx={{ display: "flex", gap: "10px", flexShrink: 0 }}>
          <Box
            component="button"
            onClick={() => setAddOpen(true)}
            sx={{
              height: 38,
              px: "14px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              borderRadius: "8px",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#D1D5DB"}`,
              bgcolor: "transparent",
              color: colors?.text ?? "#09090B",
              fontSize: "13.5px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.12s",
              "&:hover": {
                bgcolor: isDark ? "rgba(255,255,255,0.06)" : "#F3F4F6",
              },
            }}
          >
            <AddIcon sx={{ fontSize: 17 }} />
            {t("grade.addComponent")}
          </Box>

          <Box
            component="button"
            onClick={handlePublish}
            sx={{
              height: 38,
              px: "16px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              borderRadius: "8px",
              border: "none",
              bgcolor: colors?.tabtn ?? "#1F609D",
              color: "#FFFFFF",
              fontSize: "13.5px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.12s",
              "&:hover": { bgcolor: "#1A5089" },
            }}
          >
            <PublishIcon sx={{ fontSize: 17 }} />
            {t("grade.publishStructure")}
          </Box>
        </Box>
      </Box>

      {/* ── Publish error message ── */}
      {publishError && (
        <Box
          sx={{
            mb: "16px",
            px: "14px",
            py: "10px",
            borderRadius: "8px",
            bgcolor: isDark ? "rgba(239,68,68,0.12)" : "#FEF2F2",
            border: `1px solid ${isDark ? "rgba(239,68,68,0.2)" : "#FECACA"}`,
          }}
        >
          <Typography
            sx={{
              fontSize: "13.5px",
              fontWeight: 500,
              color: colors?.danger ?? "#EF4444",
            }}
          >
            {publishError}
          </Typography>
        </Box>
      )}

      {/* ── Card grid: 4 / 2 / 1 columns ── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: "16px",
        }}
      >
        {components.map((comp) => (
          <GradeComponentCard
            key={comp.id}
            comp={comp}
            onEdit={(c) => setEditTarget(c)}
            onDelete={(id) => setDeleteId(id)}
            isDark={isDark}
            colors={colors}
            t={t}
          />
        ))}
      </Box>

      {/* ── Dialogs ── */}
      <AddEditDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleAdd}
        initial={null}
        isDark={isDark}
        colors={colors}
        t={t}
      />

      <AddEditDialog
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSave={handleEdit}
        initial={editTarget}
        isDark={isDark}
        colors={colors}
        t={t}
      />

      <ConfirmDeleteDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isDark={isDark}
        colors={colors}
        t={t}
      />
    </Box>
  );
}
