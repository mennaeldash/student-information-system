import React, { useEffect, useMemo, useState } from "react";
import { Box, MenuItem, Select, Typography } from "@mui/material";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import { useTranslation } from "react-i18next";
import { ChevronsUpDown, ClipboardList, Star, Trophy } from "lucide-react";

import { useThemeContext } from "../../services/theme_context.jsx";
import { fetchEvaluationPageData } from "../../services/evaluation_service.js";

import EvaluationTabs from "../../components/assistant/evaluation_components/EvaluationTabs.jsx";
import EvaluationSummaryCard from "../../components/assistant/evaluation_components/EvaluationSummaryCard.jsx";
import EvaluationCriteriaTable from "../../components/assistant/evaluation_components/EvaluationCriteriaTable.jsx";
import EvaluationFeedbackCard from "../../components/assistant/evaluation_components/EvaluationFeedbackCard.jsx";
import EvaluationPagination from "../../components/assistant/evaluation_components/EvaluationPagination.jsx";

function SelectChevronIcon(props) {
  return <ChevronsUpDown size={18} strokeWidth={2} {...props} />;
}

const iconMap = {
  clipboard: <ClipboardList size={30} color="#2563EB" strokeWidth={2.2} />,
  star: <Star size={30} color="#16A34A" fill="#16A34A" strokeWidth={2} />,
  trophy: <Trophy size={30} color="#9333EA" strokeWidth={2} />,
};

const ITEMS_PER_PAGE = 5;

const Evaluation = () => {
  const { colors } = useThemeContext();
  const { i18n, t } = useTranslation();

  const isRTL = i18n.language === "ar";
  const isDark = colors?.mode === "dark";

  const [activeTab, setActiveTab] = useState("course");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [courses, setCourses] = useState([]);
  const [dataByCourse, setDataByCourse] = useState({});

  const pageBg = isDark ? "#0F172A" : "#F8FAFC";
  const mainCardBg = isDark ? "#111827" : "#FFFFFF";
  const textMain = isDark ? "#F8FAFC" : "#0F172A";
  const badgeBg = isDark ? "#1F2937" : "#F4F4F5";
  const badgeText = isDark ? "#F8FAFC" : "#09090B";
  const badgeIcon = isDark ? "#CBD5E1" : "#71717A";

  useEffect(() => {
    const load = async () => {
      const data = await fetchEvaluationPageData();
      setCourses(data.courses || []);
      setDataByCourse(data.dataByCourse || {});

      if (data.courses?.length) {
        setSelectedCourse(data.courses[0]);
      }
    };

    load();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCourse, activeTab]);

  const currentCourseData = dataByCourse[selectedCourse] || {};
  const summaryCards = currentCourseData.summaryCards || [];
  const criteriaData = currentCourseData.criteriaData || [];
  const feedbackList = currentCourseData.feedbackList || [];

  const totalItems = feedbackList.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = currentPage * ITEMS_PER_PAGE;
    return feedbackList.slice(start, end);
  }, [feedbackList, currentPage]);

  const startItem =
    totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;

  const endItem =
    totalItems === 0 ? 0 : Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <Box
      dir={isRTL ? "rtl" : "ltr"}
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: pageBg,
        py: { xs: "16px", sm: "20px", md: "24px" },
        px: { xs: "10px", sm: "14px", md: "18px" },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", mb: "24px" }}>
        <EvaluationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </Box>

      {activeTab === "course" && (
        <Box
          sx={{
            bgcolor: mainCardBg,
            borderRadius: "8px",
            p: { xs: "14px", sm: "20px", md: "30px" },
          }}
        >
          <Box
            sx={{
              px: { xs: 0, sm: "8px", md: "20px" },
              py: "20px",
              mb: "20px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", xl: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "stretch", xl: "flex-end" },
                gap: "20px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <Typography sx={{ color: textMain, fontSize: "16px" }}>
                  {t("Course")} *
                </Typography>

                <Select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  IconComponent={SelectChevronIcon}
                  displayEmpty
                  fullWidth
                  sx={{
                    width: "100%",
                    maxWidth: { xs: "100%", xl: "568px" },
                    height: "48px",
                    borderRadius: "6px",
                    bgcolor: isDark ? "#1E293B" : "#F1F5F9",
                    color: isDark ? "#F8FAFC" : "#0F172A",
                    fontSize: "12px",
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                    },
                    "& .MuiSvgIcon-root": {
                      color: isDark ? "#94A3B8" : "#64748B",
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    {t("Select Course")}
                  </MenuItem>

                  {courses.map((course) => (
                    <MenuItem key={course} value={course}>
                      {course}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              <Box
                sx={{
                  minHeight: "50px",
                  px: { xs: "14px", sm: "20px" },
                  py: { xs: "10px", sm: "0px" },
                  bgcolor: badgeBg,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  alignSelf: { xs: "flex-start", xl: "center" },
                  width: { xs: "100%", sm: "fit-content" },
                  maxWidth: "100%",
                  flexWrap: "wrap",
                }}
              >
                <GroupOutlinedIcon sx={{ color: badgeIcon }} />
                <Typography sx={{ color: badgeText, fontSize: "16px" }}>
                  {t("students_level")}:
                </Typography>
                <Typography
                  sx={{
                    color: badgeText,
                    fontWeight: 600,
                    fontSize: "16px",
                  }}
                >
                  {t("level_4")}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
                xl: "repeat(3, minmax(0, 1fr))",
              },
              gap: { xs: "12px", sm: "16px", md: "20px", xl: "24px" },
              alignItems: "stretch",
            }}
          >
            {summaryCards.map((card) => (
              <Box key={card.id} sx={{ minWidth: 0 }}>
                <EvaluationSummaryCard
                  {...card}
                  title={t(card.title)}
                  subValue={card.subValue ? t(card.subValue) : card.subValue}
                  footer={
                    card.footerLabel
                      ? `${t(card.footerLabel)}: ${card.footerValue || ""}`
                      : card.footer
                        ? t(card.footer)
                        : ""
                  }
                  icon={iconMap[card.iconType]}
                  isDark={isDark}
                />
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 5 }}>
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: "24px",
                fontWeight: 400,
                lineHeight: "32px",
                color: isDark ? "#F8FAFC" : "#0F172A",
              }}
            >
              {t("criteria_breakdown")}
            </Typography>

            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: "20px",
                fontWeight: 400,
                lineHeight: "20px",
                color: "#64748B",
                mt: "20px",
              }}
            >
              {t("average_rating_per_evaluation_criterion")}
            </Typography>

            <EvaluationCriteriaTable data={criteriaData} />
          </Box>

          <Box sx={{ mt: 5 }}>
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: "24px",
                fontWeight: 400,
                lineHeight: "32px",
                color: isDark ? "#F8FAFC" : "#0F172A",
              }}
            >
              {t("detailed_evaluation")}
            </Typography>

            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: "20px",
                fontWeight: 400,
                lineHeight: "20px",
                color: "#64748B",
                mt: "20px",
              }}
            >
              {t("anonymous_student_feedback")} ({totalItems} {t("submissions")})
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", mt: "20px" }}>
              {paginatedData.map((item) => (
                <EvaluationFeedbackCard
                  key={`${selectedCourse}-${item.id}`}
                  item={{
                    ...item,
                    studentName:
                      item.studentName === "Anonymous Student"
                        ? t("Anonymous Student")
                        : item.studentName,
                    date: formatDate(item.date),
                    scores: item.scores.map((score) => ({
                      ...score,
                      label: t(score.label),
                    })),
                  }}
                />
              ))}
            </Box>

            <EvaluationPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              startItem={startItem}
              endItem={endItem}
              onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Evaluation;