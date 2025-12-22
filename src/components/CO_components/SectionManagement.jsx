import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useThemeContext } from "../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

import CourseSelectionPanel from "./CourseSelectionPanel";
import SectionsHeader from "./SectionsHeader"; 
import CourseSections from "./CourseSections"; 
import CourseDetailsCard from "./CourseDetailsCard";
import SelectedSectionsCard from "./SelectedSectionsCard";
import WeeklySchedule from "./WeeklySchedule";

// Mock data and API functions (لم تتغير)
const API_BASE_URL = "https://your-api-domain.com/api/v1";
const API_ENDPOINTS = {
  courses: `${API_BASE_URL}/courses`,
  sections: `${API_BASE_URL}/sections`
};

const fetchCourses = async (t) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: "CS101", code: "CS101", name: "Introduction to Programming", type: "Lecture", credits: 3, level: 1, sections: 3 },
      { id: "ENG303", code: "ENG303", name: "Advanced Composition", type: "Seminar", credits: 3, level: 3, sections: 2 },
    ];
  } catch (error) {
    console.error(t("Error fetching courses:"), error);
    throw error;
  }
};

const fetchAvailableSections = async (courseId, t) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [
      { id: "S001", number: "001", status: "Available", instructor: "Dr. Smith", schedule: "Mon, Wed 10:00-11:30 AM", location: "Science Building, Room 101", enrolled: 25, capacity: 30, courseCode: courseId },
      { id: "S002", number: "002", status: "Full", instructor: "Dr. Johnson", schedule: "Tue, Thu 1:00-2:30 PM", location: "Engineering Building, Room 205", enrolled: 30, capacity: 30, courseCode: courseId },
      { id: "S003", number: "003", status: "Available", instructor: "Dr. Williams", schedule: "Mon, Wed 2:00-4:00 PM", location: "Arts Building, Room 302", enrolled: 15, capacity: 25, courseCode: courseId },
    ];
  } catch (error) {
    console.error(t("Error fetching sections:"), error);
    throw error;
  }
};

export default function SectionManagement({ onNext }) { // 👈 أضفنا onNext
  const { t, i18n } = useTranslation();
  const { colors } = useThemeContext();

  const [courses, setCourses] = useState([]);
  const [availableSections, setAvailableSections] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSections, setSelectedSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("sections");
  const [saving, setSaving] = useState(false); // 👈 حالة للحفظ

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const coursesData = await fetchCourses(t);
        setCourses(coursesData);
        if (coursesData.length > 0) {
          const initialCourseId = coursesData[0].id;
          setSelectedCourse(initialCourseId);
          const sectionsData = await fetchAvailableSections(initialCourseId, t);
          setAvailableSections(sectionsData);
        }
      } catch (error) { console.error(t("Error loading data:"), error); } 
      finally { setLoading(false); }
    };
    loadInitialData();
  }, [t]);

  useEffect(() => {
    if (!selectedCourse || courses.length === 0) return;
    const loadSections = async () => {
      try {
        const sectionsData = await fetchAvailableSections(selectedCourse, t);
        setAvailableSections(sectionsData);
      } catch (error) {
        console.error(t("Error loading sections:"), error);
      }
    };
    loadSections();
  }, [selectedCourse, courses, t]);

  const handleRemoveSection = (sectionId) =>
    setSelectedSections(prev => prev.filter(s => s.id !== sectionId));
  
  const handleSelectSection = (section) => {
    if (!selectedSections.find(s => s.id === section.id)) {
      setSelectedSections(prev => [...prev, section]);
    } else {
      alert(t("This section is already selected."));
    }
  };

  // ✅ أهم جزء: احفظ ثم انتقل للدفع
  const handleSaveSelections = async (sections) => {
    try {
      setSaving(true);
      // هنا ممكن تنادي API حقيقي لو جاهز:
      // await fetch(`${API_BASE_URL}/sections/save`, { ... })

      // مبدئيًا: خزّن محليًا (اختياري)
      localStorage.setItem("selectedSections", JSON.stringify(sections));

      // وبعد الحفظ — انتقل للدفع
      if (onNext) onNext();  // 👈 الانتقال لخطوة الدفع
    } catch (e) {
      console.error("save error:", e);
      // حتى لو حصل خطأ، تقدري تختاري تكملِ للدفع أو توقفي:
      if (onNext) onNext();
    } finally {
      setSaving(false);
    }
  };
  
  const currentCourseDetails = courses.find(c => c.id === selectedCourse);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '80vh',
        bgcolor: colors.background 
      }}>
        <CircularProgress />
        <Typography sx={{ ml: 2, color: colors.text }}>{t("Loading...")}</Typography>
      </Box>
    );
  }

  return (
    <Box 
      dir={i18n.dir()} 
      sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' }, 
        gap: { xs: 2, sm: 2.5, md: 3 },
        bgcolor: colors.background,
        minHeight: '100vh',
        p: { xs: 1, sm: 2, md: 3 },
        boxSizing: 'border-box',
      }}
    >
      {/* منطقة المحتوى الرئيسية */}
      <Box 
        sx={{ 
          width: { xs: '100%', sm: '65%', md: '65%', lg: '65%', xl: '65%' },
          '@media (width: 1440px)': { width: '55%' },
          '@media (min-width: 1400px) and (max-width: 1450px)': { width: '55%' },
          display: 'flex', 
          flexDirection: 'column', 
          gap: { xs: 2, sm: 3, md: 4 },
          minWidth: 0,
        }}
      >
        <CourseSelectionPanel 
          courses={courses} 
          selectedCourse={selectedCourse} 
          onCourseChange={setSelectedCourse} 
        />
        <Box sx={{ width: '100%', minWidth: 0 }}>
          <SectionsHeader onViewChange={setView} />
          {view === 'sections' ? (
            <CourseSections 
              sections={availableSections} 
              onSelectSection={handleSelectSection} 
            />
          ) : (
            <WeeklySchedule />
          )}
        </Box>
      </Box>
      
      {/* منطقة الشريط الجانبي */}
      <Box 
        sx={{ 
          width: { xs: '100%', sm: '35%', md: '35%', lg: '35%', xl: '35%' },
          '@media (width: 1440px)': { width: '45%' },
          '@media (min-width: 1400px) and (max-width: 1450px)': { width: '45%' },
          minWidth: { xs: 'auto', sm: '350px', md: '320px', lg: '350px' },
          maxWidth: { xs: '100%', sm: '400px', md: '450px', lg: '480px' },
          display: 'flex', 
          flexDirection: 'column', 
          gap: { xs: 2, sm: 2.5, md: 3 },
          maxHeight: { sm: 'calc(100vh - 4rem)', md: 'calc(100vh - 5rem)', lg: 'calc(100vh - 6rem)' },
          overflowY: { sm: 'auto' },
          flexShrink: 0,
        }}
      >
        <CourseDetailsCard 
          course={currentCourseDetails}
          sx={{ width: '100%', maxWidth: '100%', minWidth: 0 }}
        />

        {/* ✅ مررنا handler اللي بينقلك للدفع */}
        <SelectedSectionsCard 
          selectedSections={selectedSections} 
          onRemoveSection={handleRemoveSection} 
          onSaveSelections={handleSaveSelections}
          saving={saving} // لو فعّلتِ تعطيل الزر أثناء الحفظ داخل الكارد
          sx={{ width: '100%', maxWidth: '100%', minWidth: 0 }}
        />
      </Box>
    </Box>
  );
}
