import React, { useState, useRef, useLayoutEffect } from 'react';
import { Box, Typography, Paper, Button, Collapse } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useThemeContext } from "../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

const WeeklySchedule = () => {
  const { colors } = useThemeContext();
  const { t, i18n } = useTranslation();

  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));

  const [expandedCard, setExpandedCard] = useState(null);

  // مفاتيح الأيام ثابتة للمنطق، الترجمة للعرض فقط
  const dayKeys = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
  const dayLabels = [
    t("Saturday"),
    t("Sunday"),
    t("Monday"),
    t("Tuesday"),
    t("Wednesday"),
    t("Thursday")
  ];

  const events = [
    { id: 1, title: 'CS101', section: 'Section001', time: '9:00 - 10:00',
      instructor: 'Dr. Smith', location: 'Science Hall 101', dayKey: 'Sunday',
      startHour: 9, endHour: 10, textColor: '#15803D', bgColor: '#F0FDF4',
      borderColor: 'rgba(74, 222, 128, 0.4)' },
    { id: 2, title: 'ENG303', section: 'Section002', dayKey: 'Tuesday',
      startHour: 10, endHour: 11, textColor: '#1D4ED8', bgColor: '#EFF6FF',
      borderColor: 'rgba(96, 165, 250, 0.4)', instructor: 'Dr. Johnson',
      location: 'Room 205', time: '10:00 - 11:00' },
  ];

  const timeSlots = [8, 9, 10, 11]; // لاحظ: سنرسم صفاً أيضاً للـ 11 بمحاذاة الخط الأخير [web:132]

  const scheduleContentRef = useRef(null);
  const [dynamicHeight, setDynamicHeight] = useState(0);

  useLayoutEffect(() => {
    if (scheduleContentRef.current) {
      setDynamicHeight(scheduleContentRef.current.scrollHeight);
    }
  }, [events, expandedCard]);

  const toggleCard = (eventId) => {
    setExpandedCard(expandedCard === eventId ? null : eventId);
  };

  // صفوف خطوط الساعات تُرسم لكل ساعة ما عدا الأخيرة كمسافة، والخط الأخير منفصل
  const rowsData = timeSlots.slice(0, -1).map((hour, i) => {
    const hasEvent = events.some(e => e.startHour === hour);
    return { hour, hasEvent, index: i };
  });

  // مقاسات مرنة
  const dayColMinPx = isSmDown ? 128 : 0;
  const timeColWidth = { xs: 'clamp(56px, 8vw, 72px)', md: 'clamp(64px, 5vw, 88px)' };
  const rowH = 'clamp(40px, 6vh, 64px)';
  const lineColor = colors.mode === "dark" ? colors.border : '#F4F4F5';

  // عرض أدنى لجدول الأيام على الهواتف
  const minGridWidth = `calc(${dayKeys.length} * ${Math.max(dayColMinPx, 120)}px)`;

  // معادلات التقطيع: طول الشرطة = عرض عمود يوم، والمسافة = الشرطة + فجوة الشبكة
  const columnWidth = `calc((100% - ${(dayKeys.length - 1) * 0.5}rem) / ${dayKeys.length})`; // عرض شرطة لكل عمود [web:126]
  const dashPattern = `calc((100% + 0.5rem) / ${dayKeys.length})`; // دورة الشرطة + الفجوة [web:126]

  return (
    <Paper
      dir={i18n.dir()}
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 3,
        bgcolor: colors.box,
        border: `1px solid ${colors.border}`,
        boxShadow: colors.mode === "dark" ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(17,27,56,.06)",
        overflow: 'hidden',
        '& ::-webkit-scrollbar': { display: 'none' },
        '& *': { scrollbarWidth: 'none', msOverflowStyle: 'none' }
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 133, color: colors.text }}>
          {t("Weekly Schedule")}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<CalendarTodayIcon sx={{ fontSize: '15px !important' }} />}
          sx={{
            borderColor: colors.mode === "dark" ? '#F4F4F5' : colors.border,
            color: colors.text,
            textTransform: 'none',
            borderRadius: '8px',
            fontSize: '0.875rem',
            '&:hover': {
              backgroundColor: colors.mode === "dark" ? colors.chosen : '#f5f5f5',
              borderColor: colors.mode === "dark" ? '#F4F4F5' : colors.border
            }
          }}
        >
          {t("Full Schedule")}
        </Button>
      </Box>

      {/* Layout الرئيسي */}
      <Box sx={{ display: 'flex' }}>
        {/* عمود الوقت: نرسم كل ساعات timeSlots بما فيها الأخيرة مع ارتفاع 0 للمربع الأخير */}
        <Box sx={{ width: timeColWidth, pt: '52px', position: 'relative' }}>
          {timeSlots.map((hour, idx) => (
            <Box
              key={hour}
              sx={{
                position: 'relative',
                minHeight: idx < timeSlots.length - 1 ? rowH : 0, // آخر ساعة صف افتراضي بدون ارتفاع [web:132]
                display: 'flex',
                alignItems: 'flex-start'
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: colors.textSecondary, position: 'absolute', top: '-8px' }} // محاذاة من أعلى الصف مثل باقي الساعات
              >
                {`${hour}:00`}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* منطقة الجدول مع تمرير أفقي على الهواتف */}
        <Box
          ref={scheduleContentRef}
          sx={{
            flex: 1,
            ml: 1,
            position: 'relative',
            overflowX: { xs: 'auto', md: 'visible' },
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <Box sx={{ minWidth: { xs: minGridWidth, md: 'unset' } }}>
            {/* عناوين الأيام */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: `repeat(${dayKeys.length}, minmax(${dayColMinPx}px, 1fr))`,
                gap: 0.5,
                height: '36px',
                mb: 2
              }}
            >
              {dayLabels.map((label) => (
                <Box
                  key={label}
                  sx={{
                    backgroundColor: colors.mode === "dark" ? '#131B25' : '#f5f5f5',
                    color: colors.text,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    border: colors.mode === "dark" ? 'none' : `1px solid #F4F4F5`
                  }}
                >
                  {label}
                </Box>
              ))}
            </Box>

            {/* طبقة المحاضرات مع الخطوط */}
            <Box
              sx={{
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: `repeat(${dayKeys.length}, minmax(${dayColMinPx}px, 1fr))`,
                gridAutoRows: `minmax(${rowH}, auto)`, // صفوف بارتفاع مرن لكل ساعة [web:132]
                columnGap: 0.5,
                rowGap: 0
              }}
            >
              {/* الخطوط الأفقية المتقطعة */}
              {rowsData.map(({ hour, index }) => (
                <Box
                  key={`line-${hour}`}
                  sx={{
                    gridColumn: `1 / -1`,
                    gridRow: index + 1,
                    minHeight: rowH,
                    position: 'relative',
                    zIndex: 1,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '1px',
                      backgroundImage: `repeating-linear-gradient(
                        to right,
                        ${lineColor} 0,
                        ${lineColor} ${columnWidth},
                        transparent ${columnWidth},
                        transparent ${dashPattern}
                      )`, // نُعيد التقطيع
                      transform: 'translateY(0.5px)' // تحسين حدة 1px اختيارياً
                    }
                  }}
                />
              ))}

             
              <Box
                sx={{
                  gridColumn: `1 / -1`,
                  gridRow: rowsData.length + 1,
                  height: '1px',
                  position: 'relative',
                  zIndex: 1,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    backgroundImage: `repeating-linear-gradient(
                      to right,
                      ${lineColor} 0,
                      ${lineColor} ${columnWidth},
                      transparent ${columnWidth},
                      transparent ${dashPattern}
                    )`,
                    transform: 'translateY(0.5px)' // نفس التحسين
                  }
                }}
              />

              {/* الكاردز */}
              {events.map((event) => {
                if (event.startHour < timeSlots[0] || event.startHour >= timeSlots[timeSlots.length - 1]) return null;
                const dayIndex = dayKeys.indexOf(event.dayKey);
                if (dayIndex === -1) return null;

                const startRow = event.startHour - timeSlots[0] + 1;
                const isExpanded = expandedCard === event.id;

                return (
                  <Box
                    key={event.id}
                    onClick={() => toggleCard(event.id)}
                    sx={{
                      gridColumn: `${dayIndex + 1} / span 1`,
                      gridRow: startRow,
                      mx: '3px',
                      borderRadius: isExpanded ? '7px' : '7px 7px 0 0',
                      backgroundColor: colors.mode === "dark" ? '#131B25' : event.bgColor,
                      border: `1px solid #F4F4F5`,
                      borderBottom: isExpanded ? `1px solid #F4F4F5` : 'none',
                      color: colors.mode === "dark" ? colors.text : event.textColor,
                      boxSizing: 'border-box',
                      overflow: 'hidden',
                      minWidth: 0,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      zIndex: 10,
                      height: isExpanded ? 'auto' : rowH,
                      mb: isExpanded ? 0 : '6px',
                      '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }
                    }}
                  >
                    {/* المطوي */}
                    <Box sx={{ p: 1.2, py: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem', lineHeight: 1.3 }}>
                        {event.title}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', fontSize: '0.72rem', lineHeight: 1.3, opacity: 0.85 }}>
                        {event.section}
                      </Typography>
                    </Box>

                    {/* الموسّع */}
                    <Collapse in={isExpanded} timeout={300}>
                      <Box sx={{ px: 1.2, pb: 1.2 }}>
                        {event.time && (
                          <Typography variant="caption" sx={{ display: 'block', fontSize: '0.72rem', lineHeight: 1.5, mb: 0.3 }}>
                            {event.time}
                          </Typography>
                        )}
                        {event.instructor && (
                          <Typography variant="caption" sx={{ display: 'block', fontSize: '0.72rem', lineHeight: 1.5, mb: 0.3 }}>
                            {event.instructor}
                          </Typography>
                        )}
                        {event.location && (
                          <Typography variant="caption" sx={{ display: 'block', fontSize: '0.72rem', lineHeight: 1.5 }}>
                            {event.location}
                          </Typography>
                        )}
                      </Box>
                    </Collapse>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default WeeklySchedule;