import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useThemeContext } from "../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";

// ألوان أنواع الفعاليات
const eventColors = {
  exam: "#EF4444",
  assignment: "#F59E0B",
  lecture: "#3B82F6",
  deadline: "#8B5CF6",
  study: "#8B5CF6",
};

// أسماء افتراضية
const AR_WEEK = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
const EN_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const AR_MONTHS = [
  "يناير","فبراير","مارس","أبريل","مايو","يونيو",
  "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",
];
const EN_MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function AcademicCalendar() {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const { colors } = useThemeContext();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const isDark = colors?.mode === "dark";

  // جلب بيانات الفعاليات (كما هو)
  useEffect(() => {
    fetch("https://64dd83d8e64a8525a0f6f634.mockapi.io/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(() => setEvents([]));
  }, []);

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth  = new Date(year, month + 1, 0);
  const daysInMonth     = lastDayOfMonth.getDate();
  const firstDayWeekIndex = firstDayOfMonth.getDay(); // 0=Sun ... 6=Sat

  // أسماء الأيام/الشهور مع fallback
  const trWeek   = t("weekdays", { returnObjects: true });
  const baseWeekDays =
    Array.isArray(trWeek) && trWeek.length === 7 ? trWeek : (isRTL ? AR_WEEK : EN_WEEK);

  const trMonths = t("months", { returnObjects: true });
  const baseMonths =
    Array.isArray(trMonths) && trMonths.length === 12 ? trMonths : (isRTL ? AR_MONTHS : EN_MONTHS);

  // بداية الأسبوع: عربي = السبت / إنجليزي = الأحد
  const weekStartIdx = isRTL ? 6 : 0;

  // ترتيب عناوين الأيام
  const orderedWeekDays = [
    ...baseWeekDays.slice(weekStartIdx),
    ...baseWeekDays.slice(0, weekStartIdx),
  ];

  // عدد الخلايا الفارغة قبل اليوم 1
  const leadingBlanks = ((firstDayWeekIndex - weekStartIdx + 7) % 7);

  // تجهيز خلايا الشبكة
  const calendarDays = [];
  for (let i = 0; i < leadingBlanks; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  // التنقل بين الشهور
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isToday = (day) => {
    if (!day) return false;
    const checkDate = new Date(year, month, day);
    return checkDate.toDateString() === today.toDateString();
  };

  function getEventByDate(date) {
    const iso = date.toISOString().split("T")[0];
    return events.find((e) => e.date === iso);
  }

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.5, md: 3 },
        borderRadius: "16px",
        backgroundColor: colors?.box || "#fff",
        border: `1px solid ${colors?.border || "#E5E7EB"}`,
        color: colors?.text,
        fontFamily: colors?.fontFamily,
        direction: isRTL ? "rtl" : "ltr",
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        mx: { xs: "auto", md: 0 },
      }}
    >
      {/* العنوان */}
      <Typography
        dir={isRTL ? "rtl" : "ltr"}
        variant="h2"
        sx={{
          fontSize: { xs: "1rem", md: "1.25rem" },
          fontWeight: 600,
          mb: { xs: 2, md: 3 },
          color: colors?.text,
        }}
      >
        {t("academic_calendar") || (isRTL ? "التقويم الأكاديمي" : "Academic Calendar")}
      </Typography>

      {/* شريط الشهر والتنقل */}
      <Box
        dir={isRTL ? "rtl" : "ltr"}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          minWidth: 0,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: "0.95rem", md: "1.15rem" },
            fontWeight: 500,
            color: colors?.text,
          }}
        >
          {baseMonths[month]} {year}
        </Typography>

        <Box sx={{ display: "flex", gap: 0.5 }}>
          <button
            onClick={() => navigateMonth(-1)}
            style={{
              padding: "6px",
              backgroundColor: "transparent",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors?.secondary,
            }}
            aria-label={t("prev") || "Previous"}
          >
            {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          <button
            onClick={() => navigateMonth(1)}
            style={{
              padding: "6px",
              backgroundColor: "transparent",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors?.secondary,
            }}
            aria-label={t("next") || "Next"}
          >
            {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </Box>
      </Box>

      {/* عناوين أيام الأسبوع */}
      <Box
        dir={isRTL ? "rtl" : "ltr"}
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gap: { xs: 0.5, sm: 1, md: 1.5 },
          mb: { xs: 1.5, md: 2 },
          minWidth: 0,
        }}
      >
        {orderedWeekDays.map((day) => (
          <Typography
            key={day}
            sx={{
              textAlign: "center",
              fontSize: { xs: "0.7rem", md: "0.8rem" },
              fontWeight: 500,
              py: 0.25,
              color: colors?.secondary,
              textTransform: "uppercase",
              letterSpacing: "0.4px",
              minWidth: 0,
            }}
          >
            {day}
          </Typography>
        ))}
      </Box>

      {/* شبكة الأيام */}
      <Box
        dir={isRTL ? "rtl" : "ltr"}
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gap: { xs: 0.5, sm: 0.75, md: 1 },
          mb: 4,
          minWidth: 0,
        }}
      >
        {calendarDays.map((day, index) => {
          if (!day) {
            return (
              <Box key={`blank-${index}`} sx={{ height: { xs: 44, sm: 52, md: 70 } }} />
            );
          }

          const date = new Date(year, month, day);
          const event = getEventByDate(date);
          const todayClass = isToday(day);

          // === Dark mode adjustments to match the other component ===
          const baseCellBg = isDark ? (todayClass ? "transparent" : (colors?.box || "#0b1220")) : (todayClass ? "#DBEAFE" : "#F8FAFC");
          const baseCellColor = todayClass
            ? (isDark ? "#fff" : "#1D4ED8")
            : (colors?.text || "#475569");
          const baseBorderWidth = todayClass ? 2 : (isDark ? 1 : 0);
          const baseBorderColor = todayClass
            ? (colors?.primary || "#3B82F6")
            : (isDark ? (colors?.border || "#233047") : "transparent");

          return (
            <Box
              key={`${day}-${index}`}
              sx={{
                height: { xs: 44, sm: 52, md: 70 },
                position: "relative",
                borderRadius: "12px",
                backgroundColor: baseCellBg,
                borderStyle: "solid",
                borderWidth: baseBorderWidth,
                borderColor: baseBorderColor,
                color: baseCellColor,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-end",
                fontSize: { xs: "0.78rem", sm: "0.85rem", md: "0.9rem" },
                fontWeight: todayClass ? 600 : 400,
                p: { xs: 0.75, sm: 0.85, md: 1 },
                boxSizing: "border-box",
                minWidth: 0,
                "&:hover": {
                  backgroundColor: todayClass
                    ? baseCellBg
                    : (isDark ? (colors?.box || "#0b1220") : "#F1F5F9"),
                },
              }}
            >
              <Typography sx={{ fontSize: "inherit", fontWeight: "inherit", lineHeight: 1 }}>
                {day}
              </Typography>

              {event && (
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    position: "absolute",
                    bottom: 6,
                    left: 6,
                    backgroundColor: eventColors[event.type],
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>

      {/* قائمة فعاليات الشهر */}
      <Box
        sx={{
          p: { xs: 2, md: 2.5 },
          borderRadius: "12px",
          backgroundColor: isDark ? (colors?.box || "#0b1220") : "#FAFAFA",
          border: `1px solid ${colors?.border || "#F3F4F6"}`,
        }}
      >
        <Typography
          dir={isRTL ? "rtl" : "ltr"}
          sx={{
            fontSize: { xs: "0.9rem", md: "1rem" },
            mb: 2.5,
            fontWeight: 600,
            color: colors?.text,
          }}
        >
          {t("current_month_events") || (isRTL ? "فعاليات الشهر الحالي" : "Current Month Events")}
        </Typography>

        {events.map((e, index) => (
          <Box
            key={`${e.label}-${index}`}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: "12px",
              p: 1.5,
              mb: 1.5,
              backgroundColor: isDark ? "transparent" : "#FFFFFF",
              border: `1px solid ${colors?.border || "#F3F4F6"}`,
              "&:last-child": { mb: 0 },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: eventColors[e.type],
                  flexShrink: 0,
                }}
              />
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "0.85rem", md: "0.95rem" },
                  color: colors?.text,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={e.label}
              >
                {e.label}
              </Typography>
            </Box>

            <Typography
              sx={{
                color: "#fff",
                fontWeight: 600,
                fontSize: { xs: "0.7rem", md: "0.8rem" },
                px: 1.5,
                py: 0.75,
                borderRadius: "8px",
                minWidth: "56px",
                textAlign: "center",
                backgroundColor: eventColors[e.type],
              }}
            >
              {new Date(e.date).toLocaleDateString(isRTL ? "ar-EG" : "en-US", {
                month: "2-digit",
                day: "2-digit",
              })}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
