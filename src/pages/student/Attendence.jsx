import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useState, useEffect } from 'react';
import { useThemeContext } from '@/services/theme_context.jsx';
import { useTranslation } from 'react-i18next';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// إضافة استيراد Menu و MenuItem من Material-UI
import { Menu, MenuItem } from '@mui/material';

// استيراد المكونات الجديدة
import CourseAttendancePanel from '@/components/Atten_components/CourseAttendancePanel.jsx';
import AttendanceCard from '@/components/Atten_components/AttendanceCard.jsx';

// API Configuration
const attendance_data_items = [
  { key: 'attendance_summary', api: 'https://api.example.com/student/attendance/summary' },
  { key: 'courses_list', api: 'https://api.example.com/student/attendance/courses' },
  { key: 'detailed_records', api: 'https://api.example.com/student/attendance/detailed' },
  { key: 'recent_activity', api: 'https://api.example.com/student/attendance/recent' },
  { key: 'sessions_data', api: 'https://api.example.com/student/attendance/sessions' },
];

const AttendancePage = () => {
  // Responsive breakpoints للابتوب والتابلت
  const isMobile = useMediaQuery('(max-width:768px)');
  const isTablet = useMediaQuery('(max-width:1024px)');
  const isSmallLaptop = useMediaQuery('(max-width:1200px)');
  const isMediumLaptop = useMediaQuery('(max-width:1440px)');
  
  const { colors } = useThemeContext();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // States للبيانات من API
  const [data, setData] = useState({
    overall_attendance: 88,
    attendance_trend: null,
    attendance_change: null,
    courses: [],
    detailed_records: [],
    recent_activity: [],
    last_updated: '7/10/2025',
  });

  const [activeTab, setActiveTab] = useState('course');
  const [selectedCourse, setSelectedCourse] = useState('1');
  
  // ✨ States جديدة للسليكت بانل
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAdditionalCourse, setSelectedAdditionalCourse] = useState('');
  const open = Boolean(anchorEl);
  
  // ✨ State لـ LED ثابت
  const [highlightedCardId, setHighlightedCardId] = useState(null);

  // البيانات الافتراضية
  const [courses] = useState([
    { id: 'MATH101', name: 'Calculus I', code: 'MATH101', percentage: 80, color: '#60A5FA' },
    { id: 'CS201', name: 'Data Structures', code: 'CS201', percentage: 93, color: '#10B981' },
    { id: 'PHYS201', name: 'Physics', code: 'PHYS201', percentage: 100, color: '#10B981' },
  ]);

  const [detailedRecords] = useState([
    {
      id: 1, name: 'Calculus I', code: 'MATH101', percentage: 80, status: 'Good',
      progressColor: '#3B82F6', statusColor: '#3B82F6', attended: 12, absences: 3,
      totalClasses: 15, lastUpdated: 'Oct 15, 2023',
    },
    {
      id: 2, name: 'Data Structures', code: 'CS201', percentage: 93, status: 'Excellent',
      progressColor: '#22C55E', statusColor: '#22C55E', attended: 14, absences: 1,
      totalClasses: 15, lastUpdated: 'Oct 15, 2023',
    },
    {
      id: 3, name: 'Physics', code: 'PHYS201', percentage: 100, status: 'Excellent',
      progressColor: '#22C55E', statusColor: '#22C55E', attended: 15, absences: 0,
      totalClasses: 15, lastUpdated: 'Oct 15, 2023',
    },
    {
      id: 4, name: 'Linear Algebra', code: 'MATH201', percentage: 80, status: 'Good',
      progressColor: '#3B82F6', statusColor: '#3B82F6', attended: 12, absences: 3,
      totalClasses: 15, lastUpdated: 'Oct 15, 2023',
    },
    {
      id: 5, name: 'Technical Writing', code: 'ENG201', percentage: 87, status: 'Good',
      progressColor: '#3B82F6', statusColor: '#3B82F6', attended: 13, absences: 2,
      totalClasses: 15, lastUpdated: 'Oct 17, 2023',
    },
  ]);

  const [recentActivity] = useState([
    { subject: 'Calculus I', date: 'Sep 1, 2023', status: 'Present' },
    { subject: 'Data Structures', date: 'Sep 2, 2023', status: 'Present' },
    { subject: 'Physics', date: 'Sep 3, 2023', status: 'Present' },
  ]);

  // دالة لحساب عرض الكارد حسب حجم الشاشة
  const getCardWidth = () => {
    if (isMobile) return '100%';
    if (isTablet) return 'calc(50% - 6px)';
    if (isSmallLaptop) return 'calc(33.33% - 8px)';
    return 'calc(33.33% - 8px)';
  };

  // دالة لحساب الحد الأدنى لعرض الكارد
  const getCardMinWidth = () => {
    if (isMobile) return '100%';
    if (isTablet) return '300px';
    if (isSmallLaptop) return '280px';
    if (isMediumLaptop) return '320px';
    return '350px';
  };

  // دالة لحساب المسافة بين الكاردز
  const getCardGap = () => {
    if (isMobile) return '12px';
    if (isTablet) return '10px';
    if (isSmallLaptop) return '12px';
    return '16px';
  };

  // ✨ دالة للحصول على المواد المرئية (فقط أول 3 مواد)
  const getVisibleCourses = () => {
    const allCourses = data.courses.length > 0 ? data.courses : courses;
    const allRecords = data.detailed_records.length > 0 ? data.detailed_records : detailedRecords;
    
    // دمج البيانات من courses و detailedRecords
    const mergedCourses = allRecords.map(record => ({
      id: record.code,
      recordId: record.id,
      name: record.name,
      code: record.code,
      percentage: record.percentage,
      color: record.percentage >= 90 ? '#10B981' : record.percentage >= 80 ? '#60A5FA' : '#EF4444'
    }));
    
    return mergedCourses.slice(0, 3); // عرض أول 3 مواد فقط
  };

  // ✨ دالة للحصول على المواد الإضافية للسليكت بانل
  const getAdditionalCourses = () => {
    const allRecords = data.detailed_records.length > 0 ? data.detailed_records : detailedRecords;
    
    const mergedCourses = allRecords.map(record => ({
      id: record.code,
      recordId: record.id,
      name: record.name,
      code: record.code,
      percentage: record.percentage,
      color: record.percentage >= 90 ? '#10B981' : record.percentage >= 80 ? '#60A5FA' : '#EF4444'
    }));
    
    // إرجاع المواد من الرابعة فما فوق
    return mergedCourses.slice(3);
  };

  // ✨ دالة لفتح السليكت بانل
  const handleOpenSelectPanel = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // ✨ دالة لإغلاق السليكت بانل
  const handleCloseSelectPanel = () => {
    setAnchorEl(null);
  };

  // ✨ دالة لاختيار مادة من السليكت بانل
  const handleSelectAdditionalCourse = (course) => {
    setSelectedAdditionalCourse(course.code);
    navigateToCourse(course.recordId);
    handleCloseSelectPanel();
  };

  // ✨ دالة محسنة للانتقال إلى مادة معينة في Detailed View مع LED ثابت
  const navigateToCourse = (courseRecordId) => {
    setActiveTab('detailed');
    setHighlightedCardId(courseRecordId);
    
    setTimeout(() => {
      const element = document.getElementById(`attendance-card-${courseRecordId}`);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        setTimeout(() => {
          setHighlightedCardId(null);
        }, 3000);
      }
    }, 100);
  };

  // استدعاء البيانات من API
  useEffect(() => {
    if (attendance_data_items && attendance_data_items[0] && attendance_data_items[0].api) {
      fetch(attendance_data_items[0].api)
        .then(res => res.json())
        .then(res_data => {
          setData(prev => ({
            ...prev,
            overall_attendance: res_data.overall_attendance ?? 88,
            attendance_trend: res_data.attendance_trend ?? null,
            attendance_change: res_data.attendance_change ?? null,
            last_updated: res_data.last_updated ?? prev.last_updated,
          }));
        })
        .catch(error => console.error('Error fetching attendance summary:', error));
    }

    if (attendance_data_items && attendance_data_items[1] && attendance_data_items[1].api) {
      fetch(attendance_data_items[1].api)
        .then(res => res.json())
        .then(res_data => {
          setData(prev => ({
            ...prev,
            courses: res_data.courses ?? courses,
          }));
        })
        .catch(error => console.error('Error fetching courses:', error));
    }

    if (attendance_data_items && attendance_data_items[2] && attendance_data_items[2].api) {
      fetch(attendance_data_items[2].api)
        .then(res => res.json())
        .then(res_data => {
          setData(prev => ({
            ...prev,
            detailed_records: res_data.records ?? detailedRecords,
          }));
        })
        .catch(error => console.error('Error fetching detailed records:', error));
    }

    if (attendance_data_items && attendance_data_items[3] && attendance_data_items[3].api) {
      fetch(attendance_data_items[3].api)
        .then(res => res.json())
        .then(res_data => {
          setData(prev => ({
            ...prev,
            recent_activity: res_data.activities ?? recentActivity,
          }));
        })
        .catch(error => console.error('Error fetching recent activity:', error));
    }
  }, []);
  

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        backgroundColor: colors?.background || '#F8FAFC',
        minHeight: '100vh',
        padding: isMobile ? '10px' : isTablet ? '15px' : '20px',
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        maxWidth: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
        marginLeft:'9px',
        
      }}
    >
      <h1
        style={{
          fontSize: '16px',
          color: colors?.textSecondary || '#9CA3AF',
          fontWeight: '400',
          margin: 0,
          marginBottom: '16px',
          marginTop: '20px',
          padding: 0,
          lineHeight: '1.4',
        }}
      >
        {t('Monitor and track your course attendance records')}
      </h1>

      {/* First row cards - محسنة للاستجابة */}
      <div
        style={{
          display: 'flex',
          gap: getCardGap(),
          marginBottom: '48px',
          flexWrap: isMobile || (isTablet && !isSmallLaptop) ? 'wrap' : 'nowrap',
          width: '100%',
          justifyContent: 'flex-start',
          boxSizing: 'border-box',
        }}
      >
        {/* Overall Attendance Card */}
        <div
          style={{
            backgroundColor: colors?.box || '#ffffff',
            borderRadius: '12px',
            padding: isTablet ? '20px' : '25px',
            boxShadow:
              colors?.mode === 'dark'
                ? '0 1px 3px rgba(0, 0, 0, 0.1)'
                : '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: colors?.mode === 'dark' ? '1px solid #374151' : '1px solid #E5E7EB',
            width: getCardWidth(),
            minWidth: getCardMinWidth(),
            maxWidth: isMobile ? '100%' : 'none',
            flex: isMobile ? 'none' : '1 1 0',
            boxSizing: 'border-box',
          }}
        >
          <h2
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: colors?.text || '#1F2937',
              margin: 0,
              marginBottom: '6px',
            }}
          >
            {t('Overall Attendance')}
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: colors?.textSecondary || '#9CA3AF',
              margin: 0,
              marginBottom: '24px',
              fontWeight: '400',
            }}
          >
            {t('Across all courses')}
          </p>

          <div
            style={{
              position: 'relative',
              width: isTablet ? '140px' : '160px',
              height: isTablet ? '140px' : '160px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg 
              width={isTablet ? "140" : "160"} 
              height={isTablet ? "140" : "160"} 
              style={{ transform: 'rotate(-90deg)' }}
            >
              <circle
                cx={isTablet ? "70" : "80"}
                cy={isTablet ? "70" : "80"}
                r={isTablet ? "55" : "65"}
                fill="none"
                stroke={colors?.mode === 'dark' ? '#374151' : '#E5E7EB'}
                strokeWidth="8"
                strokeLinecap="round"
              />
              <circle
                cx={isTablet ? "70" : "80"}
                cy={isTablet ? "70" : "80"}
                r={isTablet ? "55" : "65"}
                fill="none"
                stroke="#4F8CF7"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(data.overall_attendance / 100) * (isTablet ? 345 : 408)} ${isTablet ? 345 : 408}`}
                strokeDashoffset="0"
                style={{
                  transition: 'stroke-dasharray 0.8s ease-in-out',
                }}
              />
            </svg>

            <div
              style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontSize: isTablet ? '28px' : '32px',
                  fontWeight: 'bold',
                  color: '#4F8CF7',
                  lineHeight: '1',
                }}
              >
                {data.overall_attendance}%
              </span>
              <span
                style={{
                  fontSize: '13px',
                  color: colors?.textSecondary || '#9CA3AF',
                  marginTop: '4px',
                }}
              >
                {t('Attendance')}
              </span>
            </div>
          </div>
        </div>

        {/* Course Statistics Card - مُحدث مع السليكت بانل */}
        <div
          style={{
            backgroundColor: colors?.box || '#ffffff',
            borderRadius: '12px',
            padding: isTablet ? '20px' : '25px',
            boxShadow:
              colors?.mode === 'dark'
                ? '0 1px 3px rgba(0, 0, 0, 0.1)'
                : '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: colors?.mode === 'dark' ? '1px solid #374151' : '1px solid #E5E7EB',
            width: getCardWidth(),
            minWidth: getCardMinWidth(),
            maxWidth: isMobile ? '100%' : 'none',
            flex: isMobile ? 'none' : '1 1 0',
            boxSizing: 'border-box',
            height: 'fit-content',
            maxHeight: '400px',
          }}
        >
          <h2
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: colors?.text || '#1F2937',
              margin: 0,
              marginBottom: '6px',
            }}
          >
            {t('Course Statistics')}
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: colors?.textSecondary || '#9CA3AF',
              margin: 0,
              marginBottom: '20px',
              fontWeight: '400',
            }}
          >
            {t('Total attendance by course')}
          </p>

          {/* ✨ عرض أول 3 مواد فقط */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0',
            }}
          >
            {getVisibleCourses().map((course) => (
              <div
                key={course.id}
                onClick={() => navigateToCourse(course.recordId)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minHeight: '40px',
                  borderRadius: '6px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors?.mode === 'dark' ? 'rgba(55, 65, 81, 0.3)' : 'rgba(243, 244, 246, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: colors?.text || '#1F2937',
                      marginBottom: '2px',
                      lineHeight: '1.4',
                    }}
                  >
                    {course.code}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: colors?.textSecondary || '#9CA3AF',
                      lineHeight: '1.4',
                    }}
                  >
                    {course.name}
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: course.color,
                    }}
                  >
                    {course.percentage}%
                  </span>
                  <ArrowForwardIosIcon
                    style={{
                      fontSize: '12px',
                      color: colors?.textSecondary || '#9CA3AF',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ✨ زر View all courses مع السليكت بانل */}
          {getAdditionalCourses().length > 0 && (
            <>
              <button
                onClick={handleOpenSelectPanel}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  background: 'none',
                  border: 'none',
                  borderTop: colors?.mode === 'dark' ? '1px solid #374151' : '1px solid #F3F4F6',
                  color: colors?.textSecondary || '#9CA3AF',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  width: '100%',
                  marginTop: '8px',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = colors?.text || '#1F2937';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = colors?.textSecondary || '#9CA3AF';
                }}
              >
                <span>
                  {t('View all courses')}
                </span>
                {open ? (
                  <KeyboardArrowUpIcon style={{ fontSize: '14px' }} />
                ) : (
                  <KeyboardArrowDownIcon style={{ fontSize: '14px' }} />
                )}
              </button>

              {/* ✨ السليكت بانل للمواد الإضافية */}
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseSelectPanel}
                MenuListProps={{
                  'aria-labelledby': 'additional-courses-button',
                }}
                PaperProps={{
                  style: {
                    backgroundColor: colors?.box || '#ffffff',
                    border: colors?.mode === 'dark' ? '1px solid #374151' : '1px solid #E5E7EB',
                    boxShadow: colors?.mode === 'dark' 
                      ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
                      : '0 4px 6px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    minWidth: '250px',
                    maxHeight: '300px',
                  },
                }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: isRTL ? 'right' : 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: isRTL ? 'right' : 'left',
                }}
              >
                {getAdditionalCourses().map((course) => (
                  <MenuItem
                    key={course.id}
                    onClick={() => handleSelectAdditionalCourse(course)}
                    style={{
                      padding: '12px 16px',
                      borderBottom: colors?.mode === 'dark' ? '1px solid rgba(55, 65, 81, 0.3)' : '1px solid rgba(243, 244, 246, 0.5)',
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <div>
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: colors?.text || '#1F2937',
                            marginBottom: '2px',
                          }}
                        >
                          {course.code}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: colors?.textSecondary || '#9CA3AF',
                          }}
                        >
                          {course.name}
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: course.color,
                          }}
                        >
                          {course.percentage}%
                        </span>
                        <ArrowForwardIosIcon
                          style={{
                            fontSize: '12px',
                            color: colors?.textSecondary || '#9CA3AF',
                          }}
                        />
                      </div>
                    </div>
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </div>

        {/* Recent Activity Card */}
        <div
          style={{
            backgroundColor: colors?.box || '#ffffff',
            borderRadius: '12px',
            padding: isTablet ? '20px' : '25px',
            boxShadow:
              colors?.mode === 'dark'
                ? '0 1px 3px rgba(0, 0, 0, 0.1)'
                : '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: colors?.mode === 'dark' ? '1px solid #374151' : '1px solid #E5E7EB',
            width: getCardWidth(),
            minWidth: getCardMinWidth(),
            maxWidth: isMobile ? '100%' : 'none',
            flex: isMobile ? 'none' : '1 1 0',
            boxSizing: 'border-box',
          }}
        >
          <h2
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: colors?.text || '#1F2937',
              margin: 0,
              marginBottom: '6px',
            }}
          >
            {t('Recent Activity')}
          </h2>

          <p
            style={{
              fontSize: '14px',
              color: colors?.textSecondary || '#9CA3AF',
              margin: 0,
              marginBottom: '20px',
              fontWeight: '400',
            }}
          >
            {t('Your latest attendance records')}
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0',
            }}
          >
            {(data.recent_activity.length > 0 ? data.recent_activity : recentActivity).map((activity, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '10px 0',
                  borderBottom: 'none',
                }}
              >
                <FiberManualRecordIcon
                  style={{
                    fontSize: '10px',
                    color: '#10B981',
                    marginTop: '6px',
                  }}
                />

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: colors?.text || '#1F2937',
                      marginBottom: '2px',
                      lineHeight: '1.4',
                    }}
                  >
                    {t(activity.subject)} - {activity.date}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: colors?.text || '#1F2937',
                      fontWeight: '500',
                      lineHeight: '1.4',
                    }}
                  >
                    {t(activity.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: colors?.mode === 'dark' ? '1px solid #374151' : '1px solid #F3F4F6',
              fontSize: '14px',
              color: colors?.textSecondary || '#9CA3AF',
            }}
          >
            <AccessTimeIcon
              style={{
                fontSize: '18px',
                color: colors?.mode === 'dark' ? '#6B7280' : '#4B5563',
              }}
            />
            <span>{t('Last updated:')} {data.last_updated}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0',
          justifyContent: 'flex-start',
          marginBottom: '25px',
          backgroundColor: colors?.mode === 'dark' ? '#374151' : '#F3F4F6', 
          borderRadius: '13px',
          padding: '0px 8px',
          width: 'fit-content',
        }}
      >
        <button
          style={{
            padding: '8px 25px',
            backgroundColor: activeTab === 'course' 
              ? (colors?.mode === 'dark' ? '#1F2937' : '#FFFFFF') 
              : 'transparent',
            color: activeTab === 'course' 
              ? (colors?.mode === 'dark' ? '#F9FAFB' : '#1F2937') 
              : (colors?.mode === 'dark' ? '#D1D5DB' : '#6B7280'), 
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: activeTab === 'course' 
              ? (colors?.mode === 'dark' 
                ? '0 2px 4px rgba(0, 0, 0, 0.3)' 
                : '0 2px 4px rgba(0, 0, 0, 0.1)') 
              : 'none',
            outline: 'none',
          }}
          onClick={() => setActiveTab('course')}
          onMouseEnter={(e) => {
            if (activeTab !== 'course') {
              e.target.style.backgroundColor = colors?.mode === 'dark' 
                ? 'rgba(31, 41, 55, 0.7)' 
                : 'rgba(255, 255, 255, 0.5)';
              e.target.style.color = colors?.mode === 'dark' ? '#F3F4F6' : '#374151';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'course') {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = colors?.mode === 'dark' ? '#D1D5DB' : '#6B7280';
            }
          }}
        >
          {t('Course View')}
        </button>

        <button
          style={{
            padding: '8px 25px',
            backgroundColor: activeTab === 'detailed' 
              ? (colors?.mode === 'dark' ? '#1F2937' : '#FFFFFF') 
              : 'transparent',
            color: activeTab === 'detailed' 
              ? (colors?.mode === 'dark' ? '#F9FAFB' : '#1F2937') 
              : (colors?.mode === 'dark' ? '#D1D5DB' : '#6B7280'), 
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: activeTab === 'detailed' 
              ? (colors?.mode === 'dark' 
                ? '0 2px 4px rgba(0, 0, 0, 0.3)' 
                : '0 2px 4px rgba(0, 0, 0, 0.1)') 
              : 'none',
            outline: 'none',
          }}
          onClick={() => setActiveTab('detailed')}
          onMouseEnter={(e) => {
            if (activeTab !== 'detailed') {
              e.target.style.backgroundColor = colors?.mode === 'dark' 
                ? 'rgba(31, 41, 55, 0.7)' 
                : 'rgba(255, 255, 255, 0.5)';
              e.target.style.color = colors?.mode === 'dark' ? '#F3F4F6' : '#374151';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'detailed') {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = colors?.mode === 'dark' ? '#D1D5DB' : '#6B7280';
            }
          }}
        >
          {t('Detailed View')}
        </button>
      </div>

      {/* Course View Panel */}
      {activeTab === 'course' && (
        <CourseAttendancePanel
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          courses={data.courses.length > 0 ? data.courses : courses}
          detailedRecords={data.detailed_records.length > 0 ? data.detailed_records : detailedRecords}
        />
      )}

      {/* ✨ Detailed Records Section مع تأثير LED ثابت */}
      {activeTab === 'detailed' && (
        <div style={{ marginBottom: '80px' }}>
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: colors?.text || '#1F2937',
              margin: 0,
              marginBottom: '24px',
            }}
          >
            {t('Detailed Attendance Records')}
          </h3>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '32px',

            }}
          >
            {(data.detailed_records.length > 0 ? data.detailed_records : detailedRecords).map(record => (
              <div 
                key={record.id} 
                id={`attendance-card-${record.id}`}
                style={{
                  padding: '0',
                  borderRadius: highlightedCardId === record.id ? '12px' : '0',
                  transition: 'all 0.3s ease',
                  boxShadow: highlightedCardId === record.id 
                    ? '0 0 25px rgba(79, 140, 247, 0.8), 0 0 50px rgba(79, 140, 247, 0.6)' 
                    : 'none',
                  backgroundColor: highlightedCardId === record.id 
                    ? (colors?.mode === 'dark' ? 'rgba(79, 140, 247, 0.1)' : 'rgba(79, 140, 247, 0.05)')
                    : 'transparent',
                }}
              >
                <AttendanceCard 
                  record={record} 
                  isHighlighted={highlightedCardId === record.id}
                />
              </div>

            ))}

            {/* ✨ إضافة div فارغ في النهاية */}
      <div style={{ height: '150px' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;