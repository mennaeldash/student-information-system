import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";

import { useThemeContext } from "../../../services/theme_context";

import RRHeaderCard from "../../../components/assistant/registration_requests_components/RRHeaderCard.jsx";
import RRStudentInfoCard from "../../../components/assistant/registration_requests_components/RRStudentInfoCard.jsx";
import RRCoursesTableCard from "../../../components/assistant/registration_requests_components/RRCoursesTableCard.jsx";
import RRNotesActionsCard from "../../../components/assistant/registration_requests_components/RRNotesActionsCard.jsx";

import { fetchRegistrationRequest } from "../../../services/registration_requests_service.js";

export default function Requests() {
  const { colors } = useThemeContext();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const isDark = colors?.mode === "dark";

  const requestId = useMemo(() => "REQ-001", []);

  const [data, setData] = useState(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchRegistrationRequest(requestId);
        setData(res);
      } catch (e) {
        console.error("Requests load error:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [requestId]);

  // تشغيل زرار Edit
  const handleEditRow = (course) => {
    console.log("Edit course:", course);
    
  };

  //  تشغيل زرار Delete
  const handleDeleteRow = (course) => {
    const ok = window.confirm(t("Are you sure you want to delete this course?"));
    if (!ok) return;

    setData((prev) => {
      if (!prev) return prev;

      
      const sameKey = (c) =>
        (c.id && course.id && c.id === course.id) ||
        (!c.id && !course.id && c.code === course.code && c.section === course.section);

      const nextCourses = (prev.courses || []).filter((c) => !sameKey(c));

      return {
        ...prev,
        courses: nextCourses,
      };
    });
  };

  const pageBg = colors?.background || "#F9FAFB";
  const cardBg = colors?.box || "#FFFFFF";
  const cardBorder = isDark ? "#374151" : "#E5E7EB";
  const cardShadow = isDark
    ? "0px 0px 8px rgba(0,0,0,0.5)"
    : "0px 0px 4px rgba(0,0,0,0.15)";

  return (
    <Box
      dir={isRTL ? "rtl" : "ltr"}
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: pageBg,
        py: "24px",
        px: "12px",
      }}
    >
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Box
          sx={{
            bgcolor: cardBg,
           
            borderRadius: "8px",
            
            overflow: "hidden",
            px: "20px",
            py: "18px",
          }}
        >
          <RRHeaderCard header={data?.header} />
          <RRStudentInfoCard student={data?.student} />

          <RRCoursesTableCard
            courses={data?.courses || []}
            summary={data?.summary}
            onEditRow={handleEditRow}
            onDeleteRow={handleDeleteRow}
          />

          <RRNotesActionsCard notes={notes} setNotes={setNotes} />

          {loading && <Box sx={{ pt: "16px" }}>{t("Loading...")}</Box>}
        </Box>
      </Box>
    </Box>
  );
}