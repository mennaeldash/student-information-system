import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Divider,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import { GoBook } from "react-icons/go";
import { useThemeContext } from "../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

/* ============ Course Card ============ */
function CourseBox({ course, colors }) {
  const { t, i18n } = useTranslation();
  if (!course) return null;

  const statusStyles =
    course.status === "Approved"
      ? { background: "#F0FDF4", color: "#16A34A" }
      : course.status === "Pending"
      ? { background: "#FFF8E1", color: "#F57C00" }
      : { background: "#F5F5F5", color: "#616161" };

  return (
    <Paper
      elevation={0}
      dir={i18n.dir()}
      sx={{
        p: { xs: 2, sm: 3},                // أخف على الموبايل
        borderRadius: 3,
        width: "100%",
        boxShadow: "none",
        overflow: "hidden",
        border: `1px solid ${colors?.border}`,
        backgroundColor: colors?.box,
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            columnGap: 2,
            rowGap: 1,
            flexWrap: "wrap",                     // ← عشان كله يبان على الشاشات الضيقة
          }}
        >
          <GoBook
            style={{
              color: "#175b9e",
              backgroundColor: colors?.mode === "dark" ? "transparent" : "#EFF6FF",
              width: 48,                           // ← أصغر على الموبايل
              height: 30,
              padding: 6,
              borderRadius: 6,
            }}
          />

          <Typography
            sx={{
              fontWeight: 500,
              fontSize: { xs: 15, sm: 17, md: 18 },
              lineHeight: 1.2,
              flex: { xs: "1 1 auto", md: "0 0 auto" }, // يسمح للعنوان يلف سطرين
              minWidth: 120,
            }}
          >
            {course.name}
          </Typography>

          <Chip
            label={course.code}
            size="small"
            sx={{
              backgroundColor: colors?.mode === "dark" ? "#1E293B" : "#F1F5F9",
              color: colors?.secondary,
              fontWeight: 600,
              height: 24,
              "& .MuiChip-label": { px: 1, fontSize: { xs: 11, sm: 12 } },
            }}
          />

          <Chip
            label={t(course.status.toLowerCase())}
            sx={{
              backgroundColor:
                colors?.mode === "dark" ? "transparent" : statusStyles.background,
              color: statusStyles.color,
              fontWeight: 700,
              height: 26,
              ml: { xs: 0, md: "auto" },          // على الشاشات الكبيرة تروح يمين
              "& .MuiChip-label": { px: 1, fontSize: { xs: 11, sm: 12 } },
            }}
          />
        </Box>

        <Divider sx={{ my: 1, bgcolor: `${colors?.border}`, height: 2 }} />
      </Box>

      {/* Details grid: 3 أعمدة على الديسكتوب / 2 تابلت / 1 موبايل */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(160px, 1fr))",
            md: "repeat(3, minmax(0, 1fr))",
          },
          rowGap: { xs: 2, sm: 2.5 },
          columnGap: { xs: 2, sm: 3, md: 4 },
          mt: { xs: 2, sm: 2.5 },
          alignItems: "start",
        }}
      >
        <Field
          icon={<PersonOutlineIcon sx={{ fontSize: 18, color: "gray" }} />}
          label={t("instructor")}
          value={course.instructor}
        />
        <Field
          icon={<LocationOnOutlinedIcon sx={{ fontSize: 18, color: "gray" }} />}
          label={t("room")}
          value={course.room}
        />
        <Field
          icon={<CalendarTodayOutlinedIcon sx={{ fontSize: 18, color: "gray" }} />}
          label={t("days")}
          value={course.days}
        />
        <Field
          icon={<ClassOutlinedIcon sx={{ fontSize: 18, color: "gray" }} />}
          label={t("section")}
          value={course.section}
        />
        <Field
          icon={<AccessTimeOutlinedIcon sx={{ fontSize: 18, color: "gray" }} />}
          label={t("time")}
          value={course.time}
        />
        <Field
          icon={<MenuBookOutlinedIcon sx={{ fontSize: 18, color: "gray" }} />}
          label={t("credit_hours")}
          value={course.credits}
        />
      </Box>
    </Paper>
  );
}

/* عنصر حقل مع أيقونة + لابل + قيمة */
function Field({ icon, label, value }) {
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {icon}
        <Typography variant="caption" sx={{ color: "gray", fontSize: { xs: 11.5, sm: 12 } }}>
          {label}
        </Typography>
      </Box>
      <Typography
        sx={{
          mt: 0.5,
          ml: { xs: 0, sm: 3 },
          fontSize: { xs: 12.5, sm: 13.5 },
          lineHeight: 1.35,
          wordBreak: "break-word",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

/* ============ RegisterBox (list + spacing) ============ */
export default function RegisterBox() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useThemeContext();
  const { t, i18n } = useTranslation();

  const mockData = [
    {
      id: 1,
      name: "Data Structures",
      code: "CS201",
      instructor: "Dr. Khalid Al-Mansour",
      days: "Monday, Wednesday",
      section: "A",
      time: "10:00 AM - 11:30 AM",
      room: "CS Building, Room 305",
      credits: 3,
      status: "Approved",
    },
    {
      id: 2,
      name: "Operating Systems",
      code: "CS301",
      instructor: "Dr. Amina Hassan",
      days: "Tuesday, Thursday",
      section: "B",
      time: "09:00 AM - 10:30 AM",
      room: "CS Building, Room 210",
      credits: 4,
      status: "Pending",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setCourses(mockData);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }} dir={i18n.dir()}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>{t("loading_courses")}</Typography>
      </Box>
    );
  }

  return (
    <Box dir={i18n.dir()}>
      <h3
        style={{
          fontSize: "clamp(16px, 4.5vw, 20px)",
          marginLeft: 17,
          fontWeight: 400,
color: colors?.text,
          marginTop: "24px",
          marginBottom: "8px",
          paddingInline: "8px",
        }}
      >
        {t("course_registration")}
      </h3>

      {/* مسافة رأسية أكبر بين الكروت على الموبايل */}
      <Box
        sx={{
          width: "100%",
          mt: 2,
          px: { xs: 1, sm: 2 },
          display: "grid",
          rowGap: { xs: 3, sm: 2 },     // ← هنا زوّدنا المسافة بالطول للموبايل
        }}
      >
        {courses.length ? (
          courses.map((course) => <CourseBox key={course.id} course={course} colors={colors} />)
        ) : (
          <Typography>{t("no_courses")}</Typography>
        )}
      </Box>
    </Box>
  );
}
