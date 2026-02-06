import React, { useState, useEffect, useMemo } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../services/theme_context.jsx';
import StudentHeader from '../../components/Grades_components/StudentHeader.jsx';
import FiltersBar from '../../components/Grades_components/FiltersBar.jsx';
import GpaSummary from '../../components/Grades_components/GpaSummary.jsx';
import PerformanceMatrix from '../../components/Grades_components/PerformanceMatrix.jsx';
import AllGradesMasonry from "../../components/Grades_components/AllGradesMasonry.jsx";
import {
  fetchStudentInfo,
  fetchGpaData,
  fetchCoursesGrades,
  fetchPerformanceMatrix,
  fetchAcademicYears,
} from '../../hooks/grades_service.js/';

export default function Grades() {
  const { t, i18n } = useTranslation();
  const { colors } = useThemeContext();
  const isRTL = i18n.language === 'ar';

  // Responsive breakpoints
  const isVerySmall = useMediaQuery('(max-width:900px)');
  const isMediumTablet = useMediaQuery('(max-width:1200px)');
  const isTablet = useMediaQuery('(max-width:1025px)');
  const isDesktop = useMediaQuery('(min-width:1380px)');
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  const isDark = Boolean(colors?.mode === 'dark' || colors?.theme === 'dark' || colors?.isDark || prefersDark);

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [isRTL]);

  // Ensure full stretch
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root') || document.getElementById('__next');

    const prev = {
      htmlHeight: html.style.height,
      htmlWidth: html.style.width,
      bodyHeight: body.style.height,
      bodyWidth: body.style.width,
      bodyMargin: body.style.margin,
      bodyPadding: body.style.padding,
      rootHeight: root?.style?.height,
      rootWidth: root?.style?.width,
    };

    html.style.height = '100%';
    html.style.width = '100%';

    body.style.height = '100%';
    body.style.width = '100%';
    body.style.margin = '0';
    body.style.padding = '0';

    if (root) {
      root.style.height = '100%';
      root.style.width = '100%';
    }

    return () => {
      html.style.height = prev.htmlHeight;
      html.style.width = prev.htmlWidth;

      body.style.height = prev.bodyHeight;
      body.style.width = prev.bodyWidth;
      body.style.margin = prev.bodyMargin;
      body.style.padding = prev.bodyPadding;

      if (root) {
        root.style.height = prev.rootHeight || '';
        root.style.width = prev.rootWidth || '';
      }
    };
  }, []);

  // Theme tokens
  const ui = useMemo(() => {
    const background = colors?.background ?? (isDark ? '#020617' : '#F8FAFC');
    const box = colors?.box ?? (isDark ? '#0B1220' : '#FFFFFF');
    const text = colors?.text ?? (isDark ? '#F8FAFC' : '#0F172A');
    const secondary = colors?.secondary ?? (isDark ? '#94A3B8' : '#64748B');
    const border = colors?.border ?? (isDark ? '#1E293B' : '#E5E7EB');

    const muted = colors?.muted ?? (isDark ? '#0F172A' : '#F1F5F9');
    const buttonBg = colors?.buttonBg ?? muted;
    const buttonHoverBg = colors?.buttonHoverBg ?? (isDark ? '#111C33' : '#E2E8F0');

    const shadow =
      colors?.shadow ??
      (isDark ? '0 6px 16px rgba(0, 0, 0, 0.35)' : '0 4px 8px rgba(15, 23, 42, 0.04)');

    const inputBg = colors?.inputBg ?? box;
    const inputText = colors?.inputText ?? text;
    const inputBorder = colors?.inputBorder ?? border;
    const placeholder = colors?.placeholder ?? secondary;

    const tintGreen = isDark ? 'rgba(34,197,94,0.14)' : '#ECFDF4';
    const tintOrange = isDark ? 'rgba(249,115,22,0.14)' : '#FEF6EE';
    const tintBlue = isDark ? 'rgba(59,130,246,0.14)' : '#EEF3FF';
    const tintPurple = isDark ? 'rgba(168,85,247,0.14)' : '#F6F4FF';
    const pillBlue = isDark ? 'rgba(59,130,246,0.22)' : '#DBEAFE';

    const track = isDark ? '#1F2A44' : '#E5E7EB';
    const separator = border;

    return {
      background,
      box,
      text,
      secondary,
      border,
      muted,
      buttonBg,
      buttonHoverBg,
      shadow,
      inputBg,
      inputText,
      inputBorder,
      placeholder,
      tintGreen,
      tintOrange,
      tintBlue,
      tintPurple,
      pillBlue,
      track,
      separator,
    };
  }, [colors, isDark]);

  const SEMESTERS = [
    { value: 'FirstSemester', label: t('First Semester') || 'First Semester' },
    { value: 'SecondSemester', label: t('Second Semester') || 'Second Semester' },
    { value: 'SummerSemester', label: t('Summer Semester') || 'Summer Semester' },
  ];

  // Default fallback data
  const defaultStudentInfo = {
    name: localStorage.getItem('user_name') || 'Mohamed Yasser Mohamed',
    id: localStorage.getItem('user_id') || '2200914',
    status: t('Active') || 'Active',
  };

  const defaultGpaData = {
    semester_gpa: 3.35,
    cumulative_gpa: 3.35,
  };

  const defaultPerformanceMatrix = {
    highest_grade: { course: 'Data Structure', grade: 'A+', color: '#21A753' },
    lowest_grade: { course: 'Database Systems', grade: 'B', color: '#EA580C' },
    current_standing: { status: 'Good', description: 'Based on cumulative GPA' },
    completion_progress: { percentage: 78 },
  };

  const defaultCourses = [
    {
      code: 'CS301',
      name: 'Data Structures',
      credits: 3,
      instructor: 'Dr. Khalid Al-Mansour',
      grade: 'A+',
      grade_color: '#10B981',
      grade_point: 4.0,
      total_score: '93 / 100',
      expanded: false,
    },
    {
      code: 'CS302',
      name: 'Algorithms',
      credits: 3,
      instructor: 'Dr. Ahmed Ali',
      grade: 'B',
      grade_color: '#F59E0B',
      grade_point: 3.0,
      total_score: '82 / 100',
      expanded: false,
    },
    {
      code: 'CS303',
      name: 'Database Systems',
      credits: 3,
      instructor: 'Dr. Sara Hassan',
      grade: 'C+',
      grade_color: '#3B82F6',
      grade_point: 2.5,
      total_score: '76 / 100',
      expanded: false,
    },
    {
      code: 'CS304',
      name: 'Operating Systems',
      credits: 3,
      instructor: 'Dr. Omar Nabil',
      grade: 'B',
      grade_color: '#F59E0B',
      grade_point: 3.0,
      total_score: '81 / 100',
      expanded: false,
    },
    {
      code: 'CS305',
      name: 'Computer Networks',
      credits: 3,
      instructor: 'Dr. Mona Adel',
      grade: 'C+',
      grade_color: '#3B82F6',
      grade_point: 2.5,
      total_score: '75 / 100',
      expanded: false,
    },
    {
      code: 'CS306',
      name: 'Software Engineering',
      credits: 3,
      instructor: 'Dr. Khalid Al-Mansour',
      grade: 'A+',
      grade_color: '#10B981',
      grade_point: 4.0,
      total_score: '95 / 100',
      expanded: false,
    },
  ];

  // Helper function to get grade color if not provided
  const getGradeColor = (grade) => {
    if (!grade) return '#64748B';
    const gradeUpper = grade.toUpperCase();
    if (gradeUpper.includes('A+') || gradeUpper.includes('A')) return '#10B981';
    if (gradeUpper.includes('B+') || gradeUpper.includes('B')) return '#F59E0B';
    if (gradeUpper.includes('C+') || gradeUpper.includes('C')) return '#3B82F6';
    if (gradeUpper.includes('D')) return '#EF4444';
    return '#64748B';
  };

  const [academicYears, setAcademicYears] = useState(['2023/2024', '2024/2025', '2025/2026']);
  const [studentInfo, setStudentInfo] = useState(defaultStudentInfo);
  const [filters, setFilters] = useState({
    academic_year: '2025/2026',
    semester: 'FirstSemester',
    search: '',
  });
  const [gpaData, setGpaData] = useState(defaultGpaData);
  const [performanceMatrix, setPerformanceMatrix] = useState(defaultPerformanceMatrix);
  const [courses, setCourses] = useState(defaultCourses);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch academic years on mount and when language changes
  useEffect(() => {
    const loadAcademicYears = async () => {
      try {
        const years = await fetchAcademicYears(i18n.language);
        if (years && years.length > 0) {
          setAcademicYears(years);
          // Update filter if current year is not in the list
          setFilters(prev => {
            if (!years.includes(prev.academic_year) && years[0]) {
              return { ...prev, academic_year: years[0] };
            }
            return prev;
          });
        }
      } catch (error) {
        console.error('Error fetching academic years:', error);
        // Keep default years
      }
    };
    loadAcademicYears();
  }, [i18n.language]);

  // Fetch all data when language, academic year, or semester changes
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch all data in parallel
        const [studentResult, gpaResult, coursesResult, performanceResult] = await Promise.allSettled([
          fetchStudentInfo(i18n.language),
          fetchGpaData(filters.academic_year, filters.semester, i18n.language),
          fetchCoursesGrades(filters.academic_year, filters.semester, i18n.language),
          fetchPerformanceMatrix(i18n.language),
        ]);

        // Update student info
        if (studentResult.status === 'fulfilled' && studentResult.value) {
          setStudentInfo(prevState => ({
            ...prevState,
            ...studentResult.value,
            status: studentResult.value.status || t('Active') || 'Active',
          }));
        }

        // Update GPA data
        if (gpaResult.status === 'fulfilled' && gpaResult.value) {
          setGpaData(gpaResult.value);
        }

        // Update courses - only update if we got valid data
        if (coursesResult.status === 'fulfilled' && coursesResult.value) {
          if (Array.isArray(coursesResult.value) && coursesResult.value.length > 0) {
            // Map API response to component format and add expanded property
            const formattedCourses = coursesResult.value.map(course => ({
              ...course,
              expanded: false,
              grade_color: course.grade_color || getGradeColor(course.grade),
            }));
            setCourses(formattedCourses);
          }
        } else if (coursesResult.status === 'rejected') {
          // Keep current courses on error, don't reset to empty
          console.error('Error fetching courses:', coursesResult.reason);
        }

        // Update performance matrix
        if (performanceResult.status === 'fulfilled' && performanceResult.value) {
          setPerformanceMatrix(performanceResult.value);
        }
      } catch (error) {
        console.error('Error fetching grades data:', error);
        setError(error.message || 'Failed to load grades data');
        // Keep default data on error
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [i18n.language, filters.academic_year, filters.semester]);

  const handleFilterChange = (field, value) => setFilters(prev => ({ ...prev, [field]: value }));

  const toggleCourseDetails = index => {
    setCourses(prevCourses =>
      prevCourses.map((course, i) => (i === index ? { ...course, expanded: !course.expanded } : course))
    );
  };

  const filteredCourses = courses.filter(
    course =>
      course.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      course.code.toLowerCase().includes(filters.search.toLowerCase())
  );

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        backgroundColor: ui.background,
        minHeight: '100vh',
        minWidth: '100%',
        padding: isVerySmall ? '12px' : '20px',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <StudentHeader
        ui={ui}
        isVerySmall={isVerySmall}
        isDesktop={isDesktop}
        isRTL={isRTL}
        isDark={isDark}
        studentInfo={studentInfo}
        t={t}
      />

      <FiltersBar
        ui={ui}
        isVerySmall={isVerySmall}
        isTablet={isTablet}
        isRTL={isRTL}
        isDark={isDark}
        t={t}
        filters={filters}
        academicYears={academicYears}
        semesters={SEMESTERS}
        onFilterChange={handleFilterChange}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: isTablet ? 'column' : 'row',
          gap: isTablet ? '24px' : '41px',
          alignItems: 'flex-start',
          width: '100%',
          marginBottom: isVerySmall ? '16px' : '24px',
        }}
      >
        <GpaSummary ui={ui} isVerySmall={isVerySmall} isTablet={isTablet} isRTL={isRTL} t={t} gpaData={gpaData} />
        <PerformanceMatrix
          ui={ui}
          isVerySmall={isVerySmall}
          isTablet={isTablet}
          isRTL={isRTL}
          t={t}
          performanceMatrix={performanceMatrix}
        />
      </div>

      <AllGradesMasonry
        ui={ui}
        isVerySmall={isVerySmall}
        isMediumTablet={isMediumTablet}
        isTablet={isTablet}
        isRTL={isRTL}
        isDark={isDark}
        t={t}
        loading={loading}
        courses={filteredCourses}
        onToggleCourseDetails={toggleCourseDetails}
      />
    </div>
  );
}