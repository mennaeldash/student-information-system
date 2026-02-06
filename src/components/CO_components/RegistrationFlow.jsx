// src/components/CO_components/RegistrationFlow.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Box, Paper, ButtonBase, Typography, useTheme } from "@mui/material";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import GridViewOutlined from "@mui/icons-material/GridViewOutlined";
import PaymentOutlined from "@mui/icons-material/PaymentOutlined";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";

import { useThemeContext } from "../../services/theme_context.jsx";
import { fetchCourses } from "../../hooks/course_service.js";
import { submitRegistration } from "../../hooks/registration_service.jsx"; // عندك .jsx — سيبيه زي ما هو

import CourseSearchPanel from "./CourseSearchPanel";
import CourseCard from "./CourseCard";
import RegistrationSummary from "./RegistrationSummary";
import CategoryTabs from "./CategoryTabs";
import RegistrationDeadline, { fetchRegistrationMeta } from "./RegistrationDeadline";

import { useTranslation } from "react-i18next";
import PaymentFlow from "./payment/PaymentFlow";
import SectionManagement from "./SectionManagement";

const SUMMARY_W = 350;
const GAP = 20;
const STEP_H = 50;

const LS_KEY = "registeredCourses_v1";

const STEPS = [
  { key: "register", label: "academic_registration", icon: <MenuBookOutlined fontSize="small" /> },
  { key: "sections", label: "section_management", icon: <GridViewOutlined fontSize="small" /> },
  { key: "payment", label: "epayment", icon: <PaymentOutlined fontSize="small" /> },
];

function StepCard({ label, icon, status, onClick, dir = "ltr" }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isActive = status === "active";
  const isDone = status === "done";
  const isLocked = false;

  const darkFill = theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[900];
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
            sx={{ fontSize: 18, ml: 0.5, color: isActive ? "common.white" : "success.main", opacity: 0.9 }}
          />
        )}
      </Box>
    </Paper>
  );
}

function StepsHeader({ step, setStep, completedSteps, dir = "ltr" }) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1, width: "100%" }}>
      {STEPS.map((s, i) => {
        const status = i === step ? "active" : completedSteps.has(i) ? "done" : "idle";
        return (
          <StepCard
            key={s.key}
            label={s.label}
            icon={s.icon}
            status={status}
            dir={dir}
            onClick={() => setStep(i)}
          />
        );
      })}
    </Box>
  );
}

export default function RegistrationFlow() {
  const { t, i18n } = useTranslation();
  const { colors } = useThemeContext();

  const studentId = "2200914"; // مؤقت
  const academicTermId = "T2025F"; // مؤقت

  const [step, setStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(() => new Set());

  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({ query: "", level: "all" });
  const [tab, setTab] = useState("all");

  const [selected, setSelected] = useState([]);

  const [deadlineISO, setDeadlineISO] = useState(null);
  const [deadlineNote, setDeadlineNote] = useState("");

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // ✅ Load saved selected from localStorage
  const loadSavedSelected = () => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const arr = JSON.parse(raw || "[]");
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  };

  // ✅ Save selected to localStorage
  const saveSelected = (arr) => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(arr || []));
    } catch {}
  };

  useEffect(() => {
    (async () => {
      setLoading(true);

      const data = await fetchCourses();

      // ✅ restore saved courses after refresh
      const saved = loadSavedSelected();
      setSelected(saved);

      // ✅ merge statuses into API list (so chip/button shows Registered)
      const merged = data.map((c) => {
        const isSaved = saved.some((s) => s.id === c.id);
        return isSaved ? { ...c, status: "registered" } : c;
      });

      setAllCourses(merged);
      setLoading(false);
    })();

    (async () => {
      const meta = await fetchRegistrationMeta();
      setDeadlineISO(meta?.deadline || null);
      setDeadlineNote(meta?.note || "");
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = (filters.query || "").trim().toLowerCase();

    return allCourses.filter((c) => {
      const inLevel = filters.level === "all" || String(c.level) === String(filters.level);
      const inTab = tab === "all" ? true : (c.type || "").toLowerCase() === tab;

      const hay = `${c.code} ${c.name} ${c.instructor}`.toLowerCase();
      const inText = !q || hay.includes(q);

      return inLevel && inTab && inText;
    });
  }, [allCourses, filters, tab]);

  // ✅ Register locally + persist
  const handleRegister = (course) => {
    if (selected.some((s) => s.id === course.id)) return;

    const nextSelected = [...selected, { ...course, status: "registered" }];
    setSelected(nextSelected);
    saveSelected(nextSelected);

    // update UI list so chips show registered
    setAllCourses((prev) => prev.map((c) => (c.id === course.id ? { ...c, status: "registered" } : c)));
  };

  // ✅ Remove locally + persist
  const handleRemove = (id) => {
    const nextSelected = selected.filter((c) => c.id !== id);
    setSelected(nextSelected);
    saveSelected(nextSelected);

    // رجّعه available مؤقتًا
    setAllCourses((prev) => prev.map((c) => (c.id === id ? { ...c, status: "available" } : c)));
  };

  // ✅ Submit (هيفضل زي ما عندك — حتى لو الباك واقع)
  const handleSubmit = async () => {
    try {
      setSubmitError("");
      setSubmitLoading(true);

      const payload = {
        id: crypto.randomUUID(),
        studentId: String(studentId),
        academicTermId: String(academicTermId),
        courses: selected.map((c, idx) => ({
          id: idx + 1,
          courseOfferingId: String(c.id),
        })),
      };

      const result = await submitRegistration(payload);
      console.log("Registration POST result =>", result);

      setCompletedSteps((prev) => new Set(prev).add(0));
      setStep(1);
    } catch (e) {
      console.error("submitRegistration error =>", e);
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.title ||
        e?.message ||
        "Failed to submit registration";
      setSubmitError(msg);
    } finally {
      setSubmitLoading(false);
    }
  };

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
      <Typography variant="h4" sx={{ fontWeight: 500, mb: 2 }}>
        {t("academic_registration")}
      </Typography>

      <Typography sx={{ color: "text.secondary", mb: 3 }}>
        {t("Register for courses for the upcoming semester according to your academic plan.")}
      </Typography>

      <StepsHeader step={step} setStep={setStep} completedSteps={completedSteps} dir={i18n.dir()} />

      {step === 0 && (
        <>
          <CourseSearchPanel
            courses={allCourses}
            value={filters}
            onChange={setFilters}
            themeColors={colors}
            width={{ xs: "100%", lg: "67%" }}
          />

          <Box
            sx={{
              mt: 3,
              display: "grid",
              gap: { xs: 3, lg: 5 },
              gridTemplateColumns: { xs: "1fr", lg: `minmax(0, 1fr) ${SUMMARY_W}px` },
              alignItems: "start",
            }}
          >
            <Box sx={{ flex: "1 1 0%", minWidth: 0, width: "100%" }}>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 400,
                  mb: 1.5,
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                {t("available_courses")}
                <RegistrationDeadline deadlineISO={deadlineISO} note={deadlineNote} sx={{ mt: 0, fontSize: 12 }} />
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

            <Box sx={{ width: "100%", minWidth: 0 }}>
              <RegistrationSummary
                selected={selected}
                onRemove={handleRemove}
                maxCredits={18}
                onSubmit={handleSubmit}
                submitting={submitLoading}
                submitError={submitError}
              />
            </Box>
          </Box>
        </>
      )}

      {step === 1 && (
        <Box sx={{ mt: GAP / 2 }}>
          <SectionManagement
            onNext={() => {
              setCompletedSteps((prev) => new Set(prev).add(1));
              setStep(2);
            }}
          />
        </Box>
      )}

      {step === 2 && (
        <Box sx={{ mt: 2 }}>
          <PaymentFlow />
        </Box>
      )}
    </Box>
  );
}
