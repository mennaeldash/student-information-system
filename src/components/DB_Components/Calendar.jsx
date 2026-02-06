import React, { useEffect, useMemo, useState } from "react";
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

// === داتا محلية (بوقت من-لـ + لوكيشن) ===
const LOCAL_EVENTS = [
  // ===== Exams (أحمر) =====
  {
    id: "ex1",
    date: "2026-02-05",
    type: "exam",
    label: "Midterm – Signals",
    course: "Signals",
    startTime: "09:00",
    endTime: "11:00",
    location: "Hall A",
  },
  {
    id: "ex2",
    date: "2026-02-18",
    type: "exam",
    label: "Final – Control Systems",
    course: "Control",
    startTime: "12:00",
    endTime: "14:00",
    location: "Main Hall",
  },

  // ===== Assignments (برتقالي) =====
  {
    id: "as1",
    date: "2026-02-02",
    type: "assignment",
    label: "HW 3 – DSP",
    course: "DSP",
    startTime: "20:00",
    endTime: "23:59",
    location: "Online",
  },
  {
    id: "as2",
    date: "2026-02-12",
    type: "assignment",
    label: "Assignment – Networks",
    course: "Computer Networks",
    startTime: "18:00",
    endTime: "23:59",
    location: "Online",
  },

  // ===== Lectures (أزرق) =====
  {
    id: "lec1",
    date: "2026-02-03",
    type: "lecture",
    label: "Lecture – Chapter 4",
    course: "Signals",
    startTime: "10:00",
    endTime: "12:00",
    location: "Room 201",
  },
  {
    id: "lec2",
    date: "2026-02-10",
    type: "lecture",
    label: "Lecture – Routing Protocols",
    course: "Networks",
    startTime: "12:00",
    endTime: "14:00",
    location: "Room 105",
  },

  // ===== Deadlines (موف) =====
  {
    id: "dl1",
    date: "2026-02-02",
    type: "deadline",
    label: "Project Proposal Due",
    course: "Graduation Project",
    startTime: "23:59",
    endTime: null,
    location: "Online",
  },
  {
    id: "dl2",
    date: "2026-02-20",
    type: "deadline",
    label: "Final Report Submission",
    course: "Graduation Project",
    startTime: "23:59",
    endTime: null,
    location: "Online",
  },

  // ===== Study / Revision (موف فاتح) =====
  {
    id: "st1",
    date: "2026-02-04",
    type: "study",
    label: "Revision Session – Signals",
    course: "Signals",
    startTime: "18:00",
    endTime: "20:00",
    location: "Library",
  },
  {
    id: "st2",
    date: "2026-02-17",
    type: "study",
    label: "Group Study – Control",
    course: "Control",
    startTime: "17:00",
    endTime: "19:00",
    location: "Lab 3",
  },

  // ===== شهر مختلف (للتجربة) =====
  {
    id: "ex3",
    date: "2026-01-29",
    type: "exam",
    label: "Quiz – DSP",
    course: "DSP",
    startTime: "11:00",
    endTime: "12:00",
    location: "Room 12",
  },
];

function toISODateOnly(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function safeParseISO(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export default function AcademicCalendar() {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateISO, setSelectedDateISO] = useState(null);

  const { colors } = useThemeContext();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const isDark = colors?.mode === "dark";

  useEffect(() => {
    setEvents(LOCAL_EVENTS);
  }, []);

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth  = new Date(year, month + 1, 0);
  const daysInMonth     = lastDayOfMonth.getDate();
  const firstDayWeekIndex = firstDayOfMonth.getDay(); // 0=Sun ... 6=Sat

  const trWeek = t("weekdays", { returnObjects: true });
  const baseWeekDays =
    Array.isArray(trWeek) && trWeek.length === 7 ? trWeek : (isRTL ? AR_WEEK : EN_WEEK);

  const trMonths = t("months", { returnObjects: true });
  const baseMonths =
    Array.isArray(trMonths) && trMonths.length === 12 ? trMonths : (isRTL ? AR_MONTHS : EN_MONTHS);

  const weekStartIdx = isRTL ? 6 : 0;

  const orderedWeekDays = [
    ...baseWeekDays.slice(weekStartIdx),
    ...baseWeekDays.slice(0, weekStartIdx),
  ];

  const leadingBlanks = ((firstDayWeekIndex - weekStartIdx + 7) % 7);

  const calendarDays = [];
  for (let i = 0; i < leadingBlanks; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const eventsByISO = useMemo(() => {
    const map = new Map();
    for (const e of events) {
      if (!e?.date) continue;
      const key = e.date;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(e);
    }
    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => ((a.startTime || a.time || "")).localeCompare((b.startTime || b.time || "")));
      map.set(k, arr);
    }
    return map;
  }, [events]);

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
    setSelectedDateISO(null);
  };

  const isToday = (day) => {
    if (!day) return false;
    const checkDate = new Date(year, month, day);
    return checkDate.toDateString() === today.toDateString();
  };

  const getEventsByDate = (dateObj) => {
    const iso = toISODateOnly(dateObj);
    return eventsByISO.get(iso) || [];
  };

  const monthEvents = useMemo(() => {
    return events.filter((e) => {
      if (!e?.date) return false;
      const d = safeParseISO(e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }, [events, year, month]);

  const formatTimeRange = (e) => {
    const start = e?.startTime || e?.time;
    const end = e?.endTime;
    if (start && end) return isRTL ? `من ${start} إلى ${end}` : `${start} - ${end}`;
    if (start) return start;
    return "";
  };

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
        overflow: "hidden",
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
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={`${baseMonths[month]} ${year}`}
        >
          {baseMonths[month]} {year}
        </Typography>

        <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
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
          mb: 3,
          minWidth: 0,
        }}
      >
        {calendarDays.map((day, index) => {
          if (!day) {
            return <Box key={`blank-${index}`} sx={{ height: { xs: 44, sm: 52, md: 70 } }} />;
          }

          const date = new Date(year, month, day);
          const dayEvents = getEventsByDate(date);
          const todayClass = isToday(day);

          const cellISO = toISODateOnly(date);
          const isSelected = selectedDateISO === cellISO;

          const baseCellBg = isDark
            ? (todayClass ? "transparent" : (colors?.box || "#0b1220"))
            : (todayClass ? "#DBEAFE" : "#F8FAFC");

          const baseCellColor = todayClass
            ? (isDark ? "#fff" : "#1D4ED8")
            : (colors?.text || "#475569");

          const baseBorderWidth = (todayClass || isSelected) ? 2 : (isDark ? 1 : 0);
          const baseBorderColor = (todayClass || isSelected)
            ? (colors?.primary || "#3B82F6")
            : (isDark ? (colors?.border || "#233047") : "transparent");

          return (
            <Box
              key={`${day}-${index}`}
              onClick={() => setSelectedDateISO(cellISO)}
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
                fontWeight: (todayClass || isSelected) ? 600 : 400,
                p: { xs: 0.75, sm: 0.85, md: 1 },
                boxSizing: "border-box",
                minWidth: 0,
                cursor: "pointer",
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

              {/* نقاط الأحداث (حتى 3 نقاط) */}
              {dayEvents.length > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 6,
                    left: 6,
                    display: "flex",
                    gap: "6px",
                    alignItems: "center",
                  }}
                >
                  {dayEvents.slice(0, 3).map((ev, i) => (
                    <Box
                      key={ev.id || `${cellISO}-${i}`}
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: eventColors[ev.type] || "#94A3B8",
                        boxShadow: isDark ? "0 0 0 1px rgba(255,255,255,0.12)" : "none",
                      }}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <Typography sx={{ fontSize: "0.7rem", color: colors?.secondary, lineHeight: 1 }}>
                      +{dayEvents.length - 3}
                    </Typography>
                  )}
                </Box>
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
          minWidth: 0,
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

        {monthEvents.length === 0 && (
          <Typography sx={{ color: colors?.secondary, fontSize: "0.9rem" }}>
            {isRTL ? "لا توجد فعاليات هذا الشهر" : "No events this month"}
          </Typography>
        )}

        {monthEvents.map((e, index) => {
          const timeRange = formatTimeRange(e);

          return (
            <Box
              key={e.id || `${e.label}-${index}`}
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
                minWidth: 0,
                gap: 1.25,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: eventColors[e.type] || "#94A3B8",
                    flexShrink: 0,
                  }}
                />

                {/* الاسم + الوقت + اللوكيشن */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    minWidth: 0,
                    flexWrap: "wrap", // مهم للموبايل
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "0.85rem", md: "0.95rem" },
                      color: colors?.text,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      minWidth: 0,
                    }}
                    title={e.label}
                  >
                    {e.label}
                  </Typography>

                  {timeRange && (
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: "0.75rem", md: "0.8rem" },
                        color: colors?.secondary,
                        whiteSpace: "nowrap",
                      }}
                      title={timeRange}
                    >
                      ({timeRange})
                    </Typography>
                  )}

                  {e.location && (
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: { xs: "0.75rem", md: "0.8rem" },
                        color: colors?.secondary,
                        whiteSpace: "nowrap",
                      }}
                      title={e.location}
                    >
                      • {e.location}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* التاريخ يمين */}
              <Typography
                sx={{
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: { xs: "0.7rem", md: "0.8rem" },
                  px: 1.5,
                  py: 0.75,
                  borderRadius: "8px",
                  minWidth: "56px",
                  textAlign: "center",
                  backgroundColor: eventColors[e.type] || "#64748B",
                  flexShrink: 0,
                }}
              >
                {safeParseISO(e.date).toLocaleDateString(isRTL ? "ar-EG" : "en-US", {
                  month: "2-digit",
                  day: "2-digit",
                })}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
