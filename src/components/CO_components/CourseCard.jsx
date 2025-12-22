// src/components/CO_components/CourseCard.jsx
import React from "react";
import { Box, Paper, Typography, Chip, Button, Divider } from "@mui/material";
import SchoolOutlined from "@mui/icons-material/SchoolOutlined";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import PersonOutline from "@mui/icons-material/PersonOutline";
import GroupOutlined from "@mui/icons-material/GroupOutlined";
import Block from "@mui/icons-material/Block";
import PlaylistAdd from "@mui/icons-material/PlaylistAdd";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../../services/theme_context.jsx";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import CancelRounded from "@mui/icons-material/CancelRounded";
/* ---------- Status chip ---------- */
function StatusChip({ status, t }) {
  const base = {
    size: "small",
    sx: {
      height: 24,
      px: 1,
      fontWeight: 700,
      borderRadius: 1,
      "& .MuiChip-label": { px: 0.5, fontSize: 12 },
      "& .MuiChip-icon": { fontSize: 16, ml: 0.25 },
    },
  };
  if (status === "available")
 return (
  <Chip
  {...base}
  icon={<CheckCircleRounded fontSize="small" />}
  label={t("available")}
  sx={{
    ...base.sx,
    bgcolor: "#E8FAF1",
    color: "#10B981",
    "& .MuiChip-icon": {
      color: "#10B981", 
      mr: 0.3,            // مسافة بسيطة يمين/شمال حسب الاتجاه
      // mt: 0,           // ما فيش داعي لرفع عمودي؛ Chip بيعمل align center
    },
  }}
/>
   ); if (status === "full") {
  return (
    <Chip
      {...base}
      icon={<CancelRounded fontSize="small" />}
      label={t("full")}
      sx={{
        ...base.sx,
        bgcolor: "#FEE2E2",
        color: "#DC2626",
        "& .MuiChip-icon": {
          color: "#DC2626",
          mr: 0.3,             // مسافة بسيطة بين الأيقونة والنص
        },
      }}
    />
  );
}
  if (status === "registered")
    return <Chip {...base}
    icon={<CheckCircleRounded fontSize="small" />}

   label={t("registered")}
    sx={{
    ...base.sx,
    bgcolor: "#E8FAF1",
    color: "#10B981",
    "& .MuiChip-icon": {
      color: "#10B981", 
      mr: 0.3,            // مسافة بسيطة يمين/شمال حسب الاتجاه
      // mt: 0,           // ما فيش داعي لرفع عمودي؛ Chip بيعمل align center
    },
  }}
   />;
   
  if (status === "prereq")
    return (
      <Chip
        {...base}
        icon={<InfoOutlined sx={{ fontSize: 16 }} />}
        label={t("prereq")}
        sx={{
          ...base.sx,
          bgcolor: "#FFF7ED",
          color: "#D97706",
          "& .MuiChip-icon": { color: "#D97706", mr: 0.3 },
        }}
      />
    );
  return null;
}

/* ---------- Course card ---------- */
export default function CourseCard({ course, selected, onRegister, onRemove }) {
  const { colors } = useThemeContext();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const disabledRegister = course.status === "full" || course.status === "prereq";

  return (
    <Paper
      elevation={0}
      dir={i18n.dir()}
      sx={{
        width: "100%",
        position: "relative",
        p: { xs: 1.5, md: 2 },
        borderRadius: 3,
        border: `1px solid ${colors?.border || "#E2E8F0"}`,
        bgcolor: colors?.box || "#fff",
        minWidth: 0,

        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
        gridAutoRows: "min-content",
        gap: { xs: 1, sm: 1.5 },
        alignItems: "start",
        marginBottom:"5px"
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1,
          minWidth: 0,
          gridColumn: "1 / -1",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 600,
              color: colors?.text || "#0F172A",
              lineHeight: 1.2,
              // لفّ النص على الشاشات الصغيرة فقط
              whiteSpace: { xs: "normal", md: "nowrap" },
              overflow: { xs: "visible", md: "hidden" },
              textOverflow: { xs: "clip", md: "ellipsis" },
            }}
          >
            {course.code}
          </Typography>
          <Typography
            sx={{
              mt: 0.25,
              fontSize: 13,
              color: colors?.secondary || "#64748B",
              whiteSpace: { xs: "normal", md: "nowrap" },
              overflow: { xs: "visible", md: "hidden" },
              textOverflow: { xs: "clip", md: "ellipsis" },
            }}
          >
            {course.name}
          </Typography>
        </Box>

        <Box sx={{ flexShrink: 0 }}>
          <StatusChip status={course.status} t={t} />
        </Box>
      </Box>

      {/* Details */}
      <Box sx={{ display: "grid", rowGap: 2.75, minWidth: 0 }}>
        {/* Row 1 — يتكدس تحت بعضه حتى md */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "max-content max-content" },
            justifyContent: { md: "flex-start" },
            columnGap: { md: 5 },
            rowGap: 0.5,
            minWidth: 0,
          }}
        >
          {/* Lecture + credits */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              minWidth: 0,
              flexWrap: "wrap",            // ✅ يسمح ينزل سطر جديد
            }}
          >
            <SchoolOutlined sx={{ fontSize: 18, color: colors?.secondary }} />
            <Typography sx={{ fontSize: 13.5, color: colors?.text }}>{t("lecture")}</Typography>
            <Typography sx={{ fontSize: 13.5, color: colors?.text }}>
              • {course.credits} {t("credits")}
            </Typography>
          </Box>

          {/* Instructor */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              justifySelf: { md: isRTL ? "start" : "end" },
              minWidth: 0,
              flexWrap: "wrap",            // ✅ يسمح ينزل سطر جديد
            }}
          >
            <PersonOutline sx={{ fontSize: 18, color: colors?.secondary }} />
            <Typography
              sx={{
                fontSize: 13.5,
                color: colors?.text,
                whiteSpace: { xs: "normal", md: "nowrap" },
                overflow: { xs: "visible", md: "hidden" },
                textOverflow: { xs: "clip", md: "ellipsis" },
              }}
            >
              {course.instructor}
            </Typography>
          </Box>
        </Box>

        {/* Row 2 — يتكدس تحت بعضه حتى md */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "max-content max-content" },
            justifyContent: { md: "flex-start" },
            columnGap: { md: 2.5 },
            rowGap: 0.5,
            minWidth: 0,
          }}
        >
          {/* Time */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.85,
              minWidth: 0,
              flexWrap: "wrap",            // ✅
            }}
          >
            <AccessTimeOutlined sx={{ fontSize: 18, color: colors?.secondary }} />
            <Typography
              sx={{
                fontSize: 13.5,
                color: colors?.text,
                whiteSpace: { xs: "normal", md: "nowrap" },
                overflow: { xs: "visible", md: "hidden" },
                textOverflow: { xs: "clip", md: "ellipsis" },
              }}
            >
              {course.schedule}
            </Typography>
          </Box>

          {/* Enrolled / Capacity */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.6,
              justifySelf: { md: isRTL ? "start" : "end" },
              minWidth: 0,
              flexWrap: "wrap",            // ✅
            }}
          >
            <GroupOutlined sx={{ fontSize: 18, color: colors?.secondary }} />
            <Typography sx={{ fontSize: 13.5, color: colors?.text }}>
              {course.enrolled}/{course.capacity} {t("students")}
            </Typography>
          </Box>
        </Box>
      </Box>


      <Divider sx={{ my: 1, borderColor: colors?.border, opacity: 0.6, gridColumn: "1 / -1" }} />
  {/* Optional prerequisites */}
      {course.prerequisites?.length > 0 && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, minWidth: 0}}>
          <InfoOutlined sx={{ fontSize: 18, color: colors?.secondary }} />
          <Typography
            sx={{
              fontSize: 13,
              color: colors?.secondary,
              whiteSpace: "normal",       // ✅ لفّ طبيعي
              overflow: "visible",
            }}
          >
            {t("prerequisites")}: {course.prerequisites.join(", ")}
          </Typography>
        </Box>
      )}
      {/* Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "stretch", sm: "flex-end" },
          gridColumn: { xs: "1 / -1", sm: "auto" },
          width: "100%",
        }}
      >
        {!selected ? (
          <Button
            size="medium"
            variant="contained"
            startIcon={disabledRegister ? <Block /> : <PlaylistAdd />}
            onClick={() => onRegister(course)}
            disabled={disabledRegister}
            fullWidth
            sx={{
              borderRadius: 2,
              textTransform: "none",
              boxShadow: "none",
              px: 2.5,
              color: "white",
              bgcolor: colors?.square,
              "&:hover": { bgcolor: "#0B1220" },
              "&.Mui-disabled": { bgcolor: colors?.square, color: "#FFF" },
              width: { sm: "auto" },
              minWidth: { sm: 120 },
            }}
          >
            {t("register")}
          </Button>
        ) : (
          <Button
            size="medium"
            variant="outlined"
            color="inherit"
            startIcon={<DeleteOutline />}
            onClick={() => onRemove(course.id)}
            fullWidth
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 2.5,
              width: { sm: "auto" },
              minWidth: { sm: 120 },
            }}
          >
            {t("remove")}
          </Button>
        )}
      </Box>
    </Paper>
  );
}
