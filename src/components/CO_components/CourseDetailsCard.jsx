import React from "react";
import { Box, Typography, Card } from "@mui/material";
import { BiBookOpen } from "react-icons/bi";
import { useThemeContext } from "../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

// TODO: استبدل هذه الروابط بالروابط الحقيقية لاحقاً
const API_BASE_URL = "https://your-api-domain.com/api/v1";
const API_ENDPOINTS = {
  courseDetails: `${API_BASE_URL}/courses/:id`,
  courseInfo: `${API_BASE_URL}/courses/:id/details`
};

const DetailItem = ({ label, value, colors }) => (
  <Box sx={{ width: '100%' }}>
    <Typography
      variant="body2"
      sx={{ 
        color: colors.textSecondary, 
        fontSize: "14px", 
        mb: 0.25 
      }}
    >
      {label}
    </Typography>
    <Typography
      variant="body1"
      sx={{
        fontWeight: "bold",
        fontSize: "16px",
        color: colors.text,
      }}
    >
      {value}
    </Typography>
  </Box>
);

const CourseDetailsCard = ({ course, sx = {} }) => {
  const { colors } = useThemeContext();
  const { t } = useTranslation();
  
  if (!course) return null;

  // ✅ ترجمة نوع المقرر
  const getTranslatedType = (type) => {
    if (!type) return '';
    return t(type); // هيترجم "Lecture" لـ "محاضرة" و "Seminar" لـ "ندوة"
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: `1px solid ${colors.border}`,
        bgcolor: colors.box,
        boxShadow: colors.mode === "dark" ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(17,27,56,.06)",
        p: { xs: 2, sm: 2.5 },
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: 'border-box',
        ...sx,
      }}
    >
      <Box sx={{ width: '100%' }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            fontSize: "20px",
            color: colors.text,
            mb: 0.5,
          }}
        >
          {t("Course Details")}
        </Typography>

        <Typography
          variant="body2"
          sx={{ 
            color: colors.textSecondary, 
            fontSize: "14px", 
            mb: 3 
          }}
        >
          {t("Information about the selected course")}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3, width: '100%' }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: colors.mode === "dark" ? colors.border : "#F3F4F6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <BiBookOpen 
              size={20} 
              color={colors.textSecondary}
            />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1, width: '100%' }}>
            <Typography
              variant="body1"
              sx={{ 
                fontWeight: 600, 
                fontSize: "16px", 
                color: colors.text,
                wordBreak: "break-word"
              }}
            >
              {course.code}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: colors.textSecondary, 
                fontSize: "14px",
                wordBreak: "break-word"
              }}
            >
              {course.name}
            </Typography>
          </Box>
        </Box>

        <Box
          display="grid"
          gridTemplateColumns="1fr 1fr"
          rowGap={2.5}
          columnGap={3}
          sx={{ width: '100%' }}
        >
          {/* ✅ استخدام الـ function للترجمة */}
          <DetailItem 
            label={t("Type")} 
            value={getTranslatedType(course.type)} 
            colors={colors} 
          />
          <DetailItem label={t("Credits")} value={course.credits} colors={colors} />
          <DetailItem label={t("Level")} value={course.level} colors={colors} />
          <DetailItem label={t("Sections")} value={course.sections} colors={colors} />
        </Box>
      </Box>
    </Card>
  );
};

export default CourseDetailsCard;