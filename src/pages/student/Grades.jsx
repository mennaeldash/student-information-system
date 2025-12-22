import React, { useState, useEffect } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import { FaSearch, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { IoBookOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from "../../services/theme_context.jsx"; 
import './Grades.css';

// Custom Arrow Component
const CustomArrow = () => (
  <div className="select-arrow">
    <FaChevronUp />
    <FaChevronDown />
  </div>
);

// ✅ تعديل GpaTrend Component مع إضافة academicYear prop
const GpaTrend = ({ endpoints, colors, t, i18n, academicYear }) => {
  const [trendData, setTrendData] = useState({
    semester_points: [80, 50, 30],        //  بيانات افتراضية (Y positions)
    cumulative_points: [70, 45, 35],      //  بيانات افتراضية (Y positions)
    labels: ['F', 'S', 'F'],              //  بيانات افتراضية للتسميات
    x_positions: [100, 300, 500],         //  بيانات افتراضية (X positions)
    originalData: [                       //  بيانات افتراضية للـ GPA
      { semester_gpa: 2.5, cumulative_gpa: 2.8, label: 'F' },
      { semester_gpa: 3.2, cumulative_gpa: 3.1, label: 'S' },
      { semester_gpa: 3.8, cumulative_gpa: 3.4, label: 'F' }
    ]
  });
  
  const [tooltip, setTooltip] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const chartWidth = 600;
  const chartHeight = 120;

  // تحويل الـ GPA (0–4) لإحداثي Y
  const gpaToYPosition = (gpa) => {
    const maxGPA = 4.0;
    const top = 10;
    const bottom = chartHeight - 10;
    return bottom - (gpa / maxGPA) * (bottom - top);
  };

  const createPathFromPoints = (yPoints, xPoints) => {
    if (!yPoints || !xPoints || yPoints.length === 0 || xPoints.length === 0) {
      console.warn('⚠️ Empty points for path creation');
      return "";
    }
    
    const pathString = yPoints.map((y, i) => `${xPoints[i] || 0},${y || 0}`).join(" ");
    return pathString;
  };

  const translateSemesterLabel = (label) => {
    if (i18n.language === 'ar') {
      const semesterMap = {
        'F': 'خ',   // Fall - خريف
        'S': 'ر',   // Spring - ربيع 
        'Su': 'ص',  // Summer - صيف
        'W': 'ش',   // Winter - شتاء
      };
      return semesterMap[label] || label;
    }
    
    switch (label) {
      case "F": return "Fall";
      case "S": return "Spring";
      case "Su": return "Summer";
      case "W": return "Winter";
      default: return label;
    }
  };

  // جلب البيانات من الـ API مع الاحتفاظ بالبيانات الافتراضية
  useEffect(() => {
    let isMounted = true;
    
    if (endpoints?.gpa_trend) {
      setIsLoading(true);
      console.log('🔄 Fetching trend data from:', endpoints.gpa_trend);
      
      fetch(endpoints.gpa_trend)
        .then((res) => res.json())
        .then((trendInfo) => {
          console.log('📊 API Response:', trendInfo);
          
          if (isMounted && trendInfo.semesters && trendInfo.semesters.length > 0) {
            const xPositions = trendInfo.semesters.map((_, index) =>
              50 + (index * (chartWidth - 100)) / (trendInfo.semesters.length - 1)
            );
            
            const newTrendData = {
              semester_points: trendInfo.semesters.map((sem) => gpaToYPosition(sem.semester_gpa)),
              cumulative_points: trendInfo.semesters.map((sem) => gpaToYPosition(sem.cumulative_gpa)),
              labels: trendInfo.semesters.map((sem) => sem.label),
              x_positions: xPositions,
              originalData: trendInfo.semesters
            };
            
            console.log('✅ Setting Trend Data from API:', newTrendData);
            setTrendData(newTrendData);
          } else {
            console.log('📝 API returned no data, keeping default trend data');
          }
        })
        .catch(error => {
          console.error('❌ Error fetching trend data:', error);
          console.log('📝 Using default trend data due to API error');
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    } else {
      console.log('📝 No API endpoint provided, using default trend data');
    }
    
    return () => {
      isMounted = false;
    };
  }, [endpoints?.gpa_trend, chartWidth]);

  // ✅ تعديل getTooltipData Function مع إضافة السنة الأكاديمية
  const getTooltipData = (type, index) => {
    const originalData = trendData.originalData[index];
    if (!originalData) return null;

    return {
      x: trendData.x_positions[index],
      y: type === 'semester' ? trendData.semester_points[index] : trendData.cumulative_points[index],
      type,
      semester: translateSemesterLabel(trendData.labels[index]),
      gpa: type === 'semester' ? originalData.semester_gpa : originalData.cumulative_gpa,
      academicYear: academicYear || '2022/2023'  // ✅ إضافة السنة الأكاديمية
    };
  };

  console.log('📊 Current trend data for rendering:', trendData);

  return (
    <div className="trend-chart">
      <div 
        className="trend-line-container"
        style={{ 
          background: colors?.box || '#ffffff',
          border: 'none',
          position: 'relative'
        }}
      >
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: colors?.secondary || '#64748b',
            fontSize: '12px',
            zIndex: 10
          }}>
            {t('Loading trend data...')}
          </div>
        )}
        
        {/*  دائماً نعرض الـ SVG */}
        <svg 
          className="trend-svg" 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          style={{ width: '100%', height: '120px' }}
        >
          {/* الخطوط الإرشادية */}
          <line 
            x1="50" y1="10" x2="550" y2="10" 
            stroke={colors?.border || "#d6d7d9"} 
            strokeWidth="1" 
            strokeOpacity="0.7"
          />
          <line 
            x1="50" y1="60" x2="550" y2="60" 
            stroke={colors?.border || "#d6d7d9"} 
            strokeWidth="1" 
            strokeOpacity="0.7"
          />
          <line 
            x1="50" y1="110" x2="550" y2="110" 
            stroke={colors?.border || "#d6d7d9"} 
            strokeWidth="1" 
            strokeOpacity="0.7"
          />

          {/* الخط التركوازي - Semester GPA */}
          {trendData.semester_points.length > 0 && trendData.x_positions.length > 0 && (
            <polyline
              fill="none"
              stroke="#2A9D90"
              strokeWidth="2.5"
              points={createPathFromPoints(trendData.semester_points, trendData.x_positions)}
            />
          )}

          {/* الخط البرتقالي المحمر - Cumulative GPA */}
          {trendData.cumulative_points.length > 0 && trendData.x_positions.length > 0 && (
            <polyline
              fill="none"
              stroke="#E76E50"
              strokeWidth="2.5"
              points={createPathFromPoints(trendData.cumulative_points, trendData.x_positions)}
            />
          )}

          {/* النقاط التركوازية مع Tooltip */}
          {trendData.semester_points.map((y, index) => (
            <g key={`semester-${index}`}>
              <circle 
                cx={trendData.x_positions[index]} 
                cy={y} 
                r="5" 
                fill={colors?.box || "white"} 
                stroke={colors?.box || "white"} 
                strokeWidth="2" 
              />
              <circle
                cx={trendData.x_positions[index]}
                cy={y}
                r="3"
                fill="#2A9D90"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => {
                  const tooltipData = getTooltipData('semester', index);
                  if (tooltipData) setTooltip(tooltipData);
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            </g>
          ))}

          {/* النقاط البرتقالية المحمرة مع Tooltip */}
          {trendData.cumulative_points.map((y, index) => (
            <g key={`cumulative-${index}`}>
              <circle 
                cx={trendData.x_positions[index]} 
                cy={y} 
                r="5" 
                fill={colors?.box || "white"} 
                stroke={colors?.box || "white"} 
                strokeWidth="2" 
              />
              <circle
                cx={trendData.x_positions[index]}
                cy={y}
                r="3"
                fill="#E76E50"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => {
                  const tooltipData = getTooltipData('cumulative', index);
                  if (tooltipData) setTooltip(tooltipData);
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            </g>
          ))}

          {/* ✅ الـ Tooltip المحدث مع السنة الأكاديمية */}
          {tooltip && (
            <g>
              <rect
                x={Math.min(Math.max(tooltip.x - 60, 10), chartWidth - 130)}
                y={Math.max(tooltip.y - 80, 5)}
                width="120"
                height="70"
                fill={colors?.box || "white"}
                stroke={colors?.border || "black"}
                strokeWidth="1"
                rx="6"
                style={{
                  filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))'
                }}
              />
              
              {/* الفصل الدراسي */}
              <text
                x={Math.min(Math.max(tooltip.x - 55, 15), chartWidth - 125)}
                y={Math.max(tooltip.y - 60, 25)}
                fontSize="11"
                fontWeight="700"
                fill={colors?.text || "black"}
              >
                {tooltip.semester}
              </text>
              
              {/* ✅ السنة الأكاديمية - جديد */}
              <text
                x={Math.min(Math.max(tooltip.x - 55, 15), chartWidth - 125)}
                y={Math.max(tooltip.y - 45, 40)}
                fontSize="10"
                fill={colors?.secondary || "#666"}
                fontWeight="600"
              >
                {tooltip.academicYear}
              </text>
              
              {/* نوع GPA */}
              <text
                x={Math.min(Math.max(tooltip.x - 55, 15), chartWidth - 125)}
                y={Math.max(tooltip.y - 30, 55)}
                fontSize="10"
                fill={colors?.secondary || "#666"}
              >
                {tooltip.type === 'semester' ? t('Semester GPA') : t('Cumulative GPA')}
              </text>
              
              {/* قيمة GPA */}
              <text
                x={Math.min(Math.max(tooltip.x - 55, 15), chartWidth - 125)}
                y={Math.max(tooltip.y - 15, 70)}
                fontSize="12"
                fontWeight="700"
                fill={tooltip.type === 'semester' ? '#2A9D90' : '#E76E50'}
              >
                {tooltip.gpa ? tooltip.gpa.toFixed(2) : 'N/A'}/4.00
              </text>
            </g>
          )}
        </svg>
      </div>
      
      {/*  العلامات مع ضمان الظهور دائماً */}
      <div className="trend-labels">
        {(trendData.labels && trendData.labels.length > 0 ? trendData.labels : ['F', 'S', 'F']).map((label, index) => (
          <span key={index} style={{ color: colors?.secondary || '#64748b' }}>
            {translateSemesterLabel(label)}
          </span>
        ))}
      </div>
    </div>
  );
};

export default function Grades() {
  const { t, i18n } = useTranslation();
  const { colors } = useThemeContext(); 

  // تطبيق RTL على الـ document
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  //  متغيرات قابلة للتخصيص
  const ACADEMIC_YEARS = ['2022/2023', '2023/2024', '2024/2025'];
  const SEMESTERS = [
    { value: 'FirstSemester', label: t('First semester') },
    { value: 'SecondSemester', label: t('Second semester') },
    { value: 'SummerSemester', label: t('Summer semester') }
  ];

  //  State Management
  const [studentInfo, setStudentInfo] = useState({
    name: 'Shaza Mohamed',
    id: '2200930',
    major: t('Computer science'),
    status: t('Active')
  });

  const [filters, setFilters] = useState({
    academic_year: '2022/2023',
    semester: 'FirstSemester',
    search: ''
  });

  const [gpaData, setGpaData] = useState({
    semester_gpa: 2.5,
    cumulative_gpa: 2.8,
    total_courses: 4,
    semester_title: t('First semester'),
    academic_year: '2022/2023'
  });

  // البيانات الافتراضية للمقررات
  const [courses, setCourses] = useState([
    {
      code: 'CS301',
      section: t('Section 1'),
      name: 'Data Structures', 
      credit_hours: 3,
      numeric_grade: 87,
      grade: 'A+',
      grade_points: 3.7,
      instructor: 'Dr. Yasser Abdel Fattah',
      status: t('Pass')
    },
    {
      code: 'CS302',
      section: t('Section 1'),
      name: 'Operating Systems', 
      credit_hours: 3,
      numeric_grade: 91,
      grade: 'A+',
      grade_points: 4.0,
      instructor: 'Dr. Manal Shaaban',
      status: t('Pass')
    },
    {
      code: 'MATH201',
      section: t('Section 1'),
      name: 'Calculus II', 
      credit_hours: 3,
      numeric_grade: 76,
      grade: 'C+',
      grade_points: 2.7,
      instructor: 'Dr. Manal Shaaban',
      status: t('Pass')
    },
    {
      code: 'PHY201',
      section: t('Section 1'),
      name: 'Physics', 
      credit_hours: 3,
      numeric_grade: 83,
      grade: 'B',
      grade_points: 3.0,
      instructor: 'Dr. Nour Yasser',
      status: t('Pass')
    }
  ]);

  const [loading, setLoading] = useState(false);

  //  تحديث البيانات الافتراضية مع تغيير اللغة
  useEffect(() => {
    setStudentInfo(prev => ({
      ...prev,
      major: t('Computer Science'),
      status: t('Active')
    }));

    setGpaData(prev => ({
      ...prev,
      semester_title: t('First semester')
    }));

    setCourses(prevCourses => 
      prevCourses.map(course => ({
        ...course,
        section: t('Section 1'),
        status: t('Pass')
      }))
    );
  }, [t]);

  // API Calls مُحدثة لتستجيب لتغيير اللغة
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // URLs للـ APIs مع language parameter
        const endpoints = {
          student: `https://api.example.com/student/info?lang=${i18n.language}`,
          gpa: `https://api.example.com/student/gpa?lang=${i18n.language}`,
          courses: `https://api.example.com/student/courses?lang=${i18n.language}&academic_year=${filters.academic_year}&semester=${filters.semester}`,
          gpa_trend: `https://api.example.com/student/gpa-trend?lang=${i18n.language}&academic_year=${filters.academic_year}&semester=${filters.semester}`
        };

        // جلب معلومات الطالب مترجمة
        fetch(endpoints.student)
          .then(res => res.json())
          .then(studentData => {
            setStudentInfo(prevState => ({
              ...prevState,
              ...studentData
            }));
          })
          .catch(error => {
            console.error('Error fetching student data:', error);
          });

        // جلب معلومات GPA مترجمة
        fetch(endpoints.gpa)
          .then(res => res.json())
          .then(gpaInfo => {
            setGpaData(prevState => ({
              ...prevState,
              ...gpaInfo
            }));
          })
          .catch(error => {
            console.error('Error fetching GPA data:', error);
          });

        // جلب معلومات الكورسات
        fetch(endpoints.courses)
          .then(res => res.json())
          .then(coursesData => {
            if (coursesData && coursesData.length > 0) {
              setCourses(coursesData);
            }
          })
          .catch(error => {
            console.error('Error fetching courses data:', error);
          });

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [i18n.language, filters.academic_year, filters.semester]);

  //  Handler Functions - مع التعديل لتحديث السنة الأكاديمية
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'semester') {
      const selectedSemester = SEMESTERS.find(s => s.value === value);
      setGpaData(prev => ({
        ...prev,
        semester_title: selectedSemester ? selectedSemester.label : t('First semester')
      }));
    }

    // ✅ التعديل الجديد - تحديث السنة الأكاديمية في gpaData
    if (field === 'academic_year') {
      setGpaData(prev => ({
        ...prev,
        academic_year: value
      }));
    }
  };

  const getGradeColor = (grade) => {
    if (grade === 'A+' || grade === 'A' || grade === 'أ+' || grade === 'أ') return '#22c55e';
    if (grade === 'A-' || grade === 'B+' || grade === 'B' || grade === 'أ-' || grade === 'ب+' || grade === 'ب') return '#3b82f6';
    if (grade === 'B-' || grade === 'C+' || grade === 'ب-' || grade === 'ج+') return '#f59e0b';
    return '#ef4444';
  };

  //  Filter courses
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(filters.search.toLowerCase()) ||
    course.code.toLowerCase().includes(filters.search.toLowerCase())
  );

  // إنشاء endpoints للـ GpaTrend component
  const endpoints = {
    gpa_trend: `https://api.example.com/student/gpa-trend?lang=${i18n.language}&academic_year=${filters.academic_year}&semester=${filters.semester}`
  };

  return (
    <div 
      className="grades-main-container"
      style={{
        backgroundColor: colors?.background || '#F8FAFC',
      }}
    >
      <div className="content-wrapper">
        
        {/* Student Info Header */}
        <div 
          className="student-info-header"
          style={{
            background: colors?.box || '#ffffff',
            border: `1px solid ${colors?.border || '#e2e8f0'}`,
          }}
        >
          <div className="student-left-section">
            <div 
              className="student-icon-container"
              style={{
                background: colors?.mode === 'dark' ? colors?.chosen || '#1E293B' : '#e2e8f0',
                border: `2px solid ${colors?.border || '#e2e8f0'}`,
                color: colors?.mode === 'dark' ? '#ffffff' : '#0f0f10',
              }}
            >
              <IoBookOutline className="student-icon" />
            </div>
            <div className="student-details">
              <h3 className="student-name" style={{ color: colors?.text || '#18181B' }}>
                {studentInfo.name}
              </h3>
              
              <p className="student-meta" style={{ color: colors?.secondary || '#71717A' }}>
                {t('id')}: {studentInfo.id} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; •   {studentInfo.major}
              </p>
            </div>
          </div>
          
          <div className="student-right-section">
            <span className="status-label" style={{ color: colors?.text || '#18181B' }}>
              {t('Current Status')}
            </span>
            <div className="status-indicator">
              <div className="status-dot"></div>
              <span className="status-text">{studentInfo.status}</span>
            </div>
          </div>
        </div>

        {/* Title Section بدون كارد */}
        <div className="grades-title-section-no-card">
          <h1 className="grades-title" style={{ color: colors?.text || '#1e293b' }}>
            {t('Course Grades')}
          </h1>
          
         <p className="grades-subtitle" style={{ color: colors?.secondary || '#64748b' }}>
          {t('gradesSubtitle')}
        </p>

        </div>

        {/* Filters Section */}
        <div 
          className="grades-filters-section"
          style={{
            background: colors?.box || '#ffffff',
            border: `1px solid ${colors?.border || '#e2e8f0'}`,
          }}
        >
          <div className="filter-group">
            <label className="filter-label" style={{ color: colors?.text || '#374151' }}>
              {t('Academic year')}
            </label>
            <div className="select-wrapper">
              <select 
                className="filter-select"
                value={filters.academic_year}
                onChange={(e) => handleFilterChange('academic_year', e.target.value)}
                style={{
                  border: `1px solid ${colors?.border || '#e2e8f0'}`,
                  background: colors?.box || '#ffffff',
                  color: colors?.text || '#1e293b',
                }}
              >
                {ACADEMIC_YEARS.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <CustomArrow />
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label" style={{ color: colors?.text || '#374151' }}>
              {t('Semester')}
            </label>
            <div className="select-wrapper">
              <select 
                className="filter-select"
                value={filters.semester}
                onChange={(e) => handleFilterChange('semester', e.target.value)}
                style={{
                  border: `1px solid ${colors?.border || '#e2e8f0'}`,
                  background: colors?.box || '#ffffff',
                  color: colors?.text || '#1e293b',
                }}
              >
                {SEMESTERS.map(semester => (
                  <option key={semester.value} value={semester.value}>
                    {semester.label}
                  </option>
                ))}
              </select>
              <CustomArrow />
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label" style={{ color: colors?.text || '#374151' }}>
              {t('Search courses')}
            </label>
            <div className="search-wrapper">
              <input 
                type="text"
                className="search-input"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                style={{
                  border: `1px solid ${colors?.border || '#e2e8f0'}`,
                  background: colors?.box || '#ffffff',
                  color: colors?.text || '#1e293b',
                }}
              />
             
             {!filters.search && <FaSearch className="search-icon" />}
            </div>
          </div>
        </div>

        {/* Semester Info Bar */}
        <div className="semester-info-bar">
          <h2 className="semester-title" style={{ color: colors?.text || '#1e293b' }}>
            {gpaData.semester_title} • {gpaData.academic_year}
          </h2>
          <span className="courses-count" style={{ color: colors?.secondary || '#64748b' }}>
            {filteredCourses.length} {t('Courses ')}
          </span>
        </div>

        {/* GPA Section */}
        <div 
          className="gpa-section"
          style={{
            background: colors?.box || '#ffffff',
            border: `1px solid ${colors?.border || '#e2e8f0'}`,
          }}
        >
          <div className="gpa-summary">
            <h3 className="section-title" style={{ color: colors?.text || '#1e293b' }}>
              {t('GPA Summary')}
            </h3>
            
            <div className="gpa-item">
              <div className="gpa-row">
                <span className="gpa-label" style={{ color: colors?.mode === 'dark' ? '#ffffff' : colors?.secondary || '#374151' }}>
                  {t('Semester GPA')}
                </span>
                <span className="gpa-value" style={{ color: colors?.mode === 'dark' ? '#ffffff' : colors?.text || '#1e293b' }}>
                  {gpaData.semester_gpa}/4.00
                </span>
              </div>
              <div 
                className="gpa-progress-bar"
                style={{ 
                  background: colors?.mode === 'dark' ? colors?.chosen || '#1E293B' : '#f1f5f9' 
                }}
              >
                <div 
                  className="gpa-progress-fill" 
                  style={{ 
                    width: `${(gpaData.semester_gpa / 4) * 100}%`,
                    background: '#3b82f6'  
                  }}
                ></div>
              </div>
            </div>

            <div className="gpa-item">
              <div className="gpa-row">
                <span className="gpa-label" style={{ color: colors?.mode === 'dark' ? '#ffffff' : colors?.secondary || '#374151' }}>
                  {t('Cumulative GPA')}
                </span>
                <span className="gpa-value" style={{ color: colors?.mode === 'dark' ? '#ffffff' : colors?.text || '#1e293b' }}>
                  {gpaData.cumulative_gpa}/4.00
                </span>
              </div>
              <div 
                className="gpa-progress-bar"
                style={{ 
                  background: colors?.mode === 'dark' ? colors?.chosen || '#1E293B' : '#f1f5f9' 
                }}
              >
                <div 
                  className="gpa-progress-fill" 
                  style={{ 
                    width: `${(gpaData.cumulative_gpa / 4) * 100}%`,
                    background: '#3b82f6'
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* GPA Trend المُحدث مع السنة الأكاديمية */}
          <div className="gpa-trend">
            <h3 className="section-title gpa-trend-title" style={{ color: colors?.text || '#1e293b' }}>
              {t('GPA Trend')}
            </h3>
            <GpaTrend 
              endpoints={endpoints}
              colors={colors}
              t={t}
              i18n={i18n}
              academicYear={filters.academic_year}  
            />
          </div>
        </div>

        {/* Course Cards */}
        <div className="courses-container">
          {loading ? (
            <div className="loading-state" style={{ color: colors?.secondary || '#64748b' }}>
              {t('loading_courses')}
            </div>
          ) : (
            filteredCourses.map((course, index) => (
              <div 
                key={`${course.code}-${index}`} 
                className="course-card-new"
                style={{
                  background: colors?.box || '#ffffff',
                  border: `1px solid ${colors?.border || '#e2e8f0'}`,
                }}
              >
                
                <div className="course-card-horizontal">
                  
                  {/* الجزء الرمادي */}
                  <div 
                    className="course-header-side"
                    style={{
                      background: colors?.mode === 'dark' ? colors?.chosen || '#1E293B' : '#f8fafc',
                      borderRight: i18n.language === 'ar' ? 'none' : `1px solid ${colors?.border || '#e2e8f0'}`,
                      borderLeft: i18n.language === 'ar' ? `1px solid ${colors?.border || '#e2e8f0'}` : 'none',
                    }}
                  >
                    <div className="course-code-section">
                      <div className="course-code-label" style={{ color: colors?.secondary || '#64748b' }}>
                        {t('Course code')}
                      </div>
                      <div className="course-code" style={{ color: colors?.text || '#1e293b' }}>
                        {course.code}
                      </div>
                      <div className="course-section" style={{ color: colors?.secondary || '#64748b' }}>
                        {course.section}
                      </div>
                    </div>
                    
                    <div className="course-grade-section">
                      <div className="grade-label" style={{ color: colors?.secondary || '#64748b' }}>
                        {t('Grade')}
                      </div>
                      <div 
                        className="grade-value"
                        style={{ color: getGradeColor(course.grade) }}
                      >
                        {course.grade}
                      </div>
                    </div>
                  </div>

                  {/* الجزء الأبيض */}
                  <div className="course-body-side">
                    <div className="course-body-header">
                      <h3 className="course-name" style={{ color: colors?.text || '#1e293b' }}>
                        {course.name}
                      </h3>
                      <div className="course-status-inline">
                        <span className="status-badge">
                          {course.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="course-details-grid">
                      <div className="detail-row">
                        <div className="detail-item">
                          <span className="detail-label" style={{ color: colors?.secondary || '#64748b' }}>
                            {t('Credit hours')}:
                          </span>
                          <span className="detail-value" style={{ color: colors?.text || '#1e293b' }}>
                            {course.credit_hours}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label" style={{ color: colors?.secondary || '#64748b' }}>
                            {t('Instructor')}:
                          </span>
                          <span className="detail-value" style={{ color: colors?.text || '#1e293b' }}>
                            {course.instructor}
                          </span>
                        </div>
                      </div>
                      
                      <div className="detail-row">
                        <div className="detail-item">
                          <span className="detail-label" style={{ color: colors?.secondary || '#64748b' }}>
                            {t('Numeric grade')}:
                          </span>
                          <span className="detail-value" style={{ color: colors?.text || '#1e293b' }}>
                            {course.numeric_grade}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label" style={{ color: colors?.secondary || '#64748b' }}>
                            {t('Grade points')}:
                          </span>
                          <div className="grade-points">
                            <InfoIcon 
                              className="info-icon" 
                              style={{ color: colors?.secondary || '#64748b' }}
                            />
                            <span className="points-value" style={{ color: colors?.text || '#1e293b' }}>
                              {course.grade_points}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}