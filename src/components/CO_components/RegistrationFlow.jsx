// src/components/CO_components/RegistrationFlow.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  ButtonBase,
  Typography,
  useTheme,
  Button,
} from "@mui/material";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import GridViewOutlined from "@mui/icons-material/GridViewOutlined";
import PaymentOutlined from "@mui/icons-material/PaymentOutlined";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";

import { useThemeContext } from "../../services/theme_context.jsx";
import { fetchCourses } from "../../services/course_service.js";

import CourseSearchPanel from "./CourseSearchPanel";
import CourseCard from "./CourseCard";
import RegistrationSummary from "./RegistrationSummary";
import CategoryTabs from "./CategoryTabs";
import RegistrationDeadline, { fetchRegistrationMeta } from "./RegistrationDeadline";

import { useTranslation } from "react-i18next";
import PaymentFlow from "./payment/PaymentFlow";

// 👇 جديد: استيراد واجهة السكاشن من الكود التاني
import SectionManagement from "./SectionManagement";

// مقاسات
const SUMMARY_W = 350;
const GAP = 20;
const STEP_H = 50;

const STEPS = [
  { key: "register", label: "academic_registration", icon: <MenuBookOutlined fontSize="small" /> },
  { key: "sections", label: "section_management",    icon: <GridViewOutlined  fontSize="small" /> },
  { key: "payment",  label: "epayment",              icon: <PaymentOutlined  fontSize="small" /> },
];

/* ---------------------- Step pill ---------------------- */
function StepCard({ label, icon, status, onClick, dir = "ltr" }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isActive = status === "active";
  const isDone   = status === "done";
  const isLocked = status === "locked";

  const darkFill    = theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[900];
  const lightIconBg = theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[100];

  return (
    <Paper
      component={ButtonBase}
      onClick={isLocked ? undefined : onClick}
      disabled={isLocked}
      disableRipple
      aria-pressed={isActive}
      elevation={0}
      sx={{
        height: STEP_H,
        px: 2,
        borderRadius: 2,
        mr: dir === "rtl" ? 0 : 1,
        ml: dir === "rtl" ? 1 : 0,
        mb: 2,
        border: isActive ? "none" : "1px solid",
        borderColor: isActive ? "transparent" : "divider",
        bgcolor: isActive ? darkFill : "background.paper",
        color: isActive ? "common.white" : "text.primary",
        opacity: isLocked ? 0.6 : 1,
        transition: "box-shadow .15s ease, transform .05s ease",
        ":hover": { boxShadow: isLocked ? "none" : 2, transform: isLocked ? "none" : "translateY(-1px)" },
        ":focus-visible": {
          outline: (theme) => `2px solid ${theme.palette.primary.main}`,
          outlineOffset: 2,
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "4px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: isActive ? "rgba(255,255,255,.14)" : lightIconBg,
            color: isActive ? "common.white" : "text.primary",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>

        <Typography fontWeight={500} sx={{ fontSize: 14 }}>
          {t(label)}
        </Typography>

        {isDone && (
          <CheckCircleRounded
            sx={{
              fontSize: 18,
              ml: 0.5,
              color: isActive ? "common.white" : "success.main",
              opacity: 0.9,
            }}
          />
        )}
      </Box>
    </Paper>
  );
}

function StepsHeader({ step, setStep, dir = "ltr" }) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1, width: "100%" }}>
      {STEPS.map((s, i) => {
        const status = i < step ? "done" : i === step ? "active" : "locked";
        return (
          <StepCard
            key={s.key}
            label={s.label}
            icon={s.icon}
            status={status}
            dir={dir}
            onClick={() => { if (i <= step) setStep(i); }}
          />
        );
      })}
    </Box>
  );
}

/* ---------------------- Main flow ---------------------- */
export default function RegistrationFlow() {
  const { t, i18n } = useTranslation();
  const { colors } = useThemeContext();

  const [step, setStep] = useState(0);

  // البيانات
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // البحث + السيمستر
  const [filters, setFilters] = useState({ query: "", semester: "all" });

  // التاب (All / Required / Elective / Recommended)
  const [tab, setTab] = useState("all");

  // الملخص المختار
  const [selected, setSelected] = useState([]);

  // الميتاداتا
  const [deadlineISO, setDeadlineISO] = useState(null);
  const [deadlineNote, setDeadlineNote] = useState("");

  // جلب الكورسات + الميتا
  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchCourses();
      setAllCourses(data);
      setSelected(data.filter((c) => c.status === "registered"));
      setLoading(false);
    })();

    (async () => {
      const meta = await fetchRegistrationMeta();
      setDeadlineISO(meta?.deadline || null);
      setDeadlineNote(meta?.note || "");
    })();
  }, []);

  // فلترة حسب البحث + السيمستر + التاب
  const filtered = useMemo(() => {
    const q = (filters.query || "").trim().toLowerCase();
    return allCourses.filter((c) => {
      const inSem = filters.semester === "all" || c.semester === filters.semester;
      const inTab = tab === "all" ? true : (c.type || "").toLowerCase() === tab;
      const hay = `${c.code} ${c.name} ${c.instructor}`.toLowerCase();
      const inText = !q || hay.includes(q);
      return inSem && inTab && inText;
    });
  }, [allCourses, filters, tab]);

  // أفعال الملخص
  const handleRegister = (course) => {
    if (selected.some((s) => s.id === course.id)) return;
    setSelected((s) => [...s, { ...course, status: "registered" }]);
  };
  const handleRemove = (id) => setSelected((s) => s.filter((c) => c.id !== id));
  const handleSubmit = () => setStep(1); // انتقال للـ Section Management

  return (
    <Box
      dir={i18n.dir()}
      sx={{
        mx: "auto",
        px: { xs: 1, md: 4 },
        pt: 3,
        textAlign: "left",
        bgcolor: colors?.background,
        color: colors?.text,
      }}
    >
      {/* عنوان رئيسي */}
      <Typography variant="h4" sx={{ fontWeight: 500, mb: 2 }}>
        {t("academic_registration")}
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 3 }}>
        {t("Register for courses for the upcoming semester according to your academic plan.")}
      </Typography>

      {/* Steps */}
      <StepsHeader step={step} setStep={setStep} dir={i18n.dir()} />

      {step === 0 && (
        <>
          {/* البحث */}
          <CourseSearchPanel
            courses={allCourses}
            value={filters}
            onChange={setFilters}
            themeColors={colors}
            width={{ xs: "100%", lg: "67%" }}
          />

          {/* يسار: قائمة الكورسات — يمين: الملخص */}
          <Box
            sx={{
              mt: 3,
              display: "grid",
              gap: { xs: 3, lg: 5 },
              gridTemplateColumns: {
                xs: "1fr",
                lg: `minmax(0, 1fr) ${SUMMARY_W}px`,
              },
              alignItems: "start",
            }}
          >
            {/* Left column */}
            <Box sx={{ flex: "1 1 0%", minWidth: 0, width: "100%" }}>
             <Typography
    variant="h6"
    component="div"                 // ← مهم علشان ما يكونش <p> جواه عناصر بلوك
    sx={{
      fontWeight: 400,
      mb: 1.5,
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap", 
      justifyContent:"space-between"
                 // لو الشاشة ضاقت ينزل سطر تاني
    }}
  >
    {t("available_courses")}
    <RegistrationDeadline
      deadlineISO={deadlineISO}
      note={deadlineNote}
      sx={{ mt: 0, fontSize: 12 }} // ← إلغاء المارجن وقلّة بسيطة في الحجم
    />
  </Typography>


              <Box
                sx={{
                  mt: 1.5,
                  mb: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  rowGap: 1,
                }}
              >
                <CategoryTabs value={tab} onChange={setTab} />
              </Box>

              <Box sx={{ display: "grid", gap: 2 }}>
                {loading && <Typography variant="body2">{t("loading_courses")}</Typography>}

                {!loading &&
                  filtered.map((c) => (
                    <CourseCard
                      key={c.id}
                      course={c}
                      selected={selected.some((s) => s.id === c.id)}
                      onRegister={handleRegister}
                      onRemove={handleRemove}
                    />
                  ))}

                {!loading && filtered.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    {t("no_courses")}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Right column: الملخص */}
            <Box sx={{ width: "100%", minWidth: 0 }}>
              <RegistrationSummary
                selected={selected}
                onRemove={handleRemove}
                maxCredits={18}
                onSubmit={handleSubmit}
              />
            </Box>
          </Box>
        </>
      )}

      {/* ✅ Step 1: Section Management (من الكود التاني) */}
     {step === 1 && (
  <Box sx={{ mt: GAP / 2 }}>
    <SectionManagement onNext={() => setStep(2)} /> {/* 👈 هنا السحر */}
  </Box>
)}


      {/* Step 2: Payment */}
      {step === 2 && (
        <Box sx={{ mt: 2 }}>
          <PaymentFlow />
        </Box>
      )}
    </Box>
  );
}
