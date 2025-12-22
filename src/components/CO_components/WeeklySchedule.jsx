import React, { useState, useRef, useLayoutEffect } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useThemeContext } from "../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

// TODO: استبدل هذه الروابط بالروابط الحقيقية لاحقاً
const API_BASE_URL = "https://your-api-domain.com/api/v1";
const API_ENDPOINTS = {
  schedule: `${API_BASE_URL}/schedule`,
  weeklySchedule: `${API_BASE_URL}/schedule/weekly`,
  fullSchedule: `${API_BASE_URL}/schedule/full`
};

const WeeklySchedule = () => {
  const { colors } = useThemeContext();
  const { t } = useTranslation();

  // --- البيانات ---
  const events = [
    {
      id: 1, title: 'CS101', section: 'Section001', time: '9:00 - 10:00',
      instructor: 'Dr. Smith', location: 'Science Hall 101', day: 'Sunday',
      startHour: 9, endHour: 10, textColor: '#15803D', bgColor: '#F0FDF4',
      borderColor: 'rgba(74, 222, 128, 0.4)',
    },
    {
      id: 2, title: 'ENG303', section: 'Section002', day: 'Tuesday',
      startHour: 10, endHour: 11, textColor: '#1D4ED8', bgColor: '#EFF6FF',
      borderColor: 'rgba(96, 165, 250, 0.4)',
    },
  ];

  const days = [
    t("Saturday"), 
    t("Sunday"), 
    t("Monday"), 
    t("Tuesday"), 
    t("Wednesday"), 
    t("Thursday")
  ];
  const timeSlots = [8, 9, 10];
  const hourHeight = 110;

  // --- Hooks لقياس الارتفاع الديناميكي ---
  const scheduleContentRef = useRef(null);
  const [dynamicHeight, setDynamicHeight] = useState(0);

  useLayoutEffect(() => {
    if (scheduleContentRef.current) {
      setDynamicHeight(scheduleContentRef.current.scrollHeight);
    }
  }, [events]);

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: { xs: 2, sm: 2.5 },
        borderRadius: 3,
        bgcolor: colors.box,
        border: `1px solid ${colors.border}`,
        boxShadow: colors.mode === "dark" ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(17,27,56,.06)",
        overflow: 'hidden' 
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            fontWeight: 'bold', 
            color: colors.text 
          }}
        >
          {t("Weekly Schedule")}
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<CalendarTodayIcon />}
          sx={{ 
            borderColor: colors.border, 
            color: colors.text, 
            textTransform: 'none', 
            borderRadius: '8px', 
            '&:hover': { 
              backgroundColor: colors.mode === "dark" ? colors.chosen : '#f5f5f5',
              borderColor: colors.border
            } 
          }}
        >
          {t("Full Schedule")}
        </Button>
      </Box>

      {/* Layout الرئيسي */}
      <Box sx={{ display: 'flex' }}>
        {/* --- عمود الوقت والخطوط --- */}
        <Box sx={{ width: '70px', pt: '52px', position: 'relative', minHeight: dynamicHeight }}>
          {timeSlots.map((hour) => (
            <Box key={hour} sx={{ height: `${hourHeight}px`, position: 'relative' }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: colors.textSecondary, 
                  position: 'absolute', 
                  top: '-8px' 
                }}
              >
                {`${hour}:00 AM`}
              </Typography>
              <Box 
                sx={{ 
                  borderTop: `1px solid ${colors.border}`, 
                  position: 'absolute', 
                  top: 0, 
                  left: '70px', 
                  right: '-2000px'
                }} 
              />
            </Box>
          ))}
          {dynamicHeight > timeSlots.length * hourHeight && (
             <Box 
               sx={{ 
                 borderTop: `1px solid ${colors.border}`, 
                 position: 'absolute', 
                 top: dynamicHeight, 
                 left: '70px', 
                 right: '-2000px' 
               }} 
             />
          )}
        </Box>

        {/* --- منطقة الجدول --- */}
        <Box ref={scheduleContentRef} sx={{ flex: 1, ml: 1, position: 'relative' }}>
          {/* عناوين الأيام */}
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: `repeat(${days.length}, 1fr)`, 
              gap: 1, 
              height: '36px', 
              mb: 2 
            }}
          >
            {days.map((day) => (
              <Box 
                key={day} 
                sx={{ 
                  backgroundColor: colors.mode === "dark" ? colors.chosen : '#f5f5f5', 
                  color: colors.text, 
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '0.875rem',
                  border: `1px solid ${colors.border}`
                }}
              >
                {day}
              </Box>
            ))}
          </Box>

          {/* طبقة المحاضرات */}
          <Box 
            sx={{ 
              position: 'relative', 
              display: 'grid', 
              gridTemplateColumns: `repeat(${days.length}, 1fr)`, 
              gap: 1 
            }}
          >
            {events.map((event) => {
              if (event.startHour < timeSlots[0] || event.startHour > timeSlots[timeSlots.length - 1]) return null;

              // البحث عن index اليوم باستخدام النص المترجم
              const dayNames = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
              const dayIndex = dayNames.indexOf(event.day);
              if (dayIndex === -1) return null;

              const top = (event.startHour - timeSlots[0]) * hourHeight;
              const minEventHeight = (event.endHour - event.startHour) * hourHeight;

              return (
                <Box 
                  key={event.id}
                  sx={{
                    gridColumn: `${dayIndex + 1} / span 1`,
                    position: 'relative',
                    top: `${top}px`,
                    minHeight: `calc(${minEventHeight}px - 8px)`,
                    height: 'auto',
                    p: 1.5,
                    borderRadius: '8px',
                    backgroundColor: event.bgColor,
                    border: `1px solid ${event.borderColor}`,
                    color: event.textColor,
                    boxSizing: 'border-box',
                    lineHeight: 1.6,
                    mb: `${-top}px`,
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}
                  >
                    {event.title}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    {event.section}
                  </Typography>
                  {event.time && (
                    <Typography variant="caption" sx={{ display: 'block' }}>
                      {event.time}
                    </Typography>
                  )}
                  {event.instructor && (
                    <Typography variant="caption" sx={{ display: 'block' }}>
                      {event.instructor}
                    </Typography>
                  )}
                  {event.location && (
                    <Typography variant="caption" sx={{ display: 'block' }}>
                      {event.location}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default WeeklySchedule;