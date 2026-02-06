import React, { useState, useEffect } from 'react';
import { useThemeContext } from '@/services/theme_context.jsx';
import { useTranslation } from 'react-i18next';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useMediaQuery, useTheme } from '@mui/material';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CourseAttendancePanel = ({ selectedCourse, setSelectedCourse, courses, detailedRecords }) => {
  const { colors } = useThemeContext();
  const { t } = useTranslation();
  const theme = useTheme();
  
  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTinyTablet = useMediaQuery('(min-width:600px) and (max-width:660px)');
  const isSmallTablet = useMediaQuery('(min-width:661px) and (max-width:799px)');
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isLaptop = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  
  const [selectExpanded, setSelectExpanded] = useState(false);

  const ENABLE_EXTERNAL_API = false;
  const [externalApiData, setExternalApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Default sessions data (fallback)
  const defaultSessionsData = [
    { date: 'Oct 15, 2023', status: 'Present' },
    { date: 'Oct 13, 2023', status: 'Present' },
    { date: 'Oct 6, 2023', status: 'Present' },
    { date: 'Sep 29, 2023', status: 'Present' },
    { date: 'Sep 22, 2023', status: 'Absent' },
    { date: 'Sep 15, 2023', status: 'Present' },
    { date: 'Sep 8, 2023', status: 'Present' },
    { date: 'Sep 1, 2023', status: 'Present' },
  ];

  const [sessionsData, setSessionsData] = useState(defaultSessionsData);

  // Get current course data
  const courseData = detailedRecords.find(record => record.id.toString() === selectedCourse) || detailedRecords[0];

  // ========== الحل: تحديث جدول الحضور عند تغيير الكورس ==========
  useEffect(() => {
    // البحث عن الكورس المختار
    const currentCourse = detailedRecords.find(
      record => record.id.toString() === selectedCourse
    );

    if (currentCourse) {
      // لو الكورس عنده sessions data، استخدمها
      if (currentCourse.sessions && Array.isArray(currentCourse.sessions)) {
        setSessionsData(currentCourse.sessions);
      } else {
        // لو مفيش sessions، استخدم البيانات الافتراضية
        setSessionsData(defaultSessionsData);
      }
    }
  }, [selectedCourse, detailedRecords]);
  // ============================================================

  // External API call (if enabled)
  useEffect(() => {
    if (!ENABLE_EXTERNAL_API || !selectedCourse) return;

    const fetchExternalApiData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('https://your-actual-api.com/attendance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            course_id: selectedCourse,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setExternalApiData(data);

        // تحديث sessions من الـ API
        if (data.sessions && Array.isArray(data.sessions)) {
          setSessionsData(data.sessions);
        }
      } catch (error) {
        console.error('Failed to fetch external API data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExternalApiData();
  }, [selectedCourse, ENABLE_EXTERNAL_API]);

  useEffect(() => {
    if (colors?.mode) {
      localStorage.setItem('attendance-theme-preference', colors.mode);
    }
  }, [colors?.mode]);

  // Responsive values
  const getResponsiveValues = () => {
    if (isMobile) {
      return {
        headerFlexDirection: 'column',
        headerGap: '16px',
        selectMinWidth: '100%',
        selectMaxWidth: '100%',
        mainFlexDirection: 'column',
        mainGap: '30px',
        circleMarginTop: 0,
        circleWidth: '100%',
        circlePaddingLeft: 0,
        rightSectionMarginLeft: 0,
        titleFontSize: 24,
        statsFlexDirection: 'column',
        statsGap: '20px',
        tableFontSize: 16,
        tablePadding: 8,
        padding: 16,
        marginBottom: 60,
        panelHeight: 'auto',
        dateWidth: '30%',
        statusWidth: '70%'
      };
    } else if (isTinyTablet) {
      return {
        headerFlexDirection: 'column',
        headerGap: '16px',
        selectMinWidth: '100%',
        selectMaxWidth: '100%',
        mainFlexDirection: 'column',
        mainGap: '30px',
        circleMarginTop: 0,
        circleWidth: '100%',
        circlePaddingLeft: 0,
        rightSectionMarginLeft: 0,
        titleFontSize: 24,
        statsFlexDirection: 'column',
        statsGap: '20px',
        tableFontSize: 16,
        tablePadding: 9,
        padding: 17,
        marginBottom: 62,
        panelHeight: 'auto',
        dateWidth: '30%',
        statusWidth: '70%'
      };
    } else if (isSmallTablet) {
      return {
        headerFlexDirection: 'column',
        headerGap: '18px',
        selectMinWidth: '100%',
        selectMaxWidth: '100%',
        mainFlexDirection: 'column',
        mainGap: '35px',
        circleMarginTop: 0,
        circleWidth: '100%',
        circlePaddingLeft: 0,
        rightSectionMarginLeft: 0,
        titleFontSize: 25,
        statsFlexDirection: 'row',
        statsGap: 'clamp(30px, 8vw, 60px)',
        tableFontSize: 17,
        tablePadding: 10,
        padding: 18,
        marginBottom: 65,
        panelHeight: 'auto',
        dateWidth: '30%',
        statusWidth: '70%'
      };
    } else if (isTablet) {
      return {
        headerFlexDirection: 'column',
        headerGap: '20px',
        selectMinWidth: '100%',
        selectMaxWidth: '100%',
        mainFlexDirection: 'column',
        mainGap: '40px',
        circleMarginTop: 0,
        circleWidth: '100%',
        circlePaddingLeft: 0,
        rightSectionMarginLeft: 0,
        titleFontSize: 26,
        statsFlexDirection: 'row',
        statsGap: '15%',
        tableFontSize: 18,
        tablePadding: 12,
        padding: 20,
        marginBottom: 70,
        panelHeight: 'auto',
        dateWidth: '30%',
        statusWidth: '70%'
      };
    } else if (isLaptop) {
      return {
        headerFlexDirection: 'row',
        headerGap: '20px',
        selectMinWidth: 280,
        selectMaxWidth: 300,
        mainFlexDirection: 'row',
        mainGap: '18px',
        circleMarginTop: 100,
        circleWidth: '31.34%',
        circlePaddingLeft: 20,
        rightSectionMarginLeft: 28,
        titleFontSize: 20,
        statsFlexDirection: 'row',
        statsGap: '25%',
        tableFontSize: 13,
        tablePadding: 6,
        padding: 14,
        marginBottom: 50,
        panelHeight: 'auto',
        dateWidth: '30%',
        statusWidth: '70%'
      };
    } else {
      return {
        headerFlexDirection: 'row',
        headerGap: '20px',
        selectMinWidth: 300,
        selectMaxWidth: 320,
        mainFlexDirection: 'row',
        mainGap: '20px',
        circleMarginTop: 200,
        circleWidth: '31.34%',
        circlePaddingLeft: 100,
        rightSectionMarginLeft: 100,
        titleFontSize: 28,
        statsFlexDirection: 'row',
        statsGap: '32%',
        tableFontSize: 16,
        tablePadding: 12,
        padding: 24,
        marginBottom: 100,
        panelHeight: 'auto',
        dateWidth: '30%',
        statusWidth: '70%'
      };
    }
  };

  const responsive = getResponsiveValues();

  return (
    <div style={{ marginBottom: responsive.marginBottom }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: responsive.headerFlexDirection,
        justifyContent: responsive.headerFlexDirection === 'row' ? 'space-between' : 'flex-start', 
        alignItems: responsive.headerFlexDirection === 'row' ? 'center' : 'stretch', 
        gap: responsive.headerGap,
        marginBottom: 20 
      }}>
        <h2
          style={{
            fontSize: isMobile ? 18 : isTinyTablet ? 18 : isSmallTablet ? 18 : isTablet ? 19 : 20,
            fontWeight: 133,
            color: colors?.text || '#09090B',
            margin: 0,
            flexShrink: 0,
          }}
        >
          {t('Course Attendance')}
          {loading && ENABLE_EXTERNAL_API && (
            <span style={{ marginLeft: 10, fontSize: 14, color: colors?.textSecondary }}>
              {t('Loading...')}
            </span>
          )}
        </h2>

        <FormControl sx={{ 
          minWidth: responsive.selectMinWidth, 
          width: '100%', 
          maxWidth: responsive.selectMaxWidth 
        }}>
          <Select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            displayEmpty
            disabled={loading && ENABLE_EXTERNAL_API}
            onOpen={() => setSelectExpanded(true)}
            onClose={() => setSelectExpanded(false)}
            IconComponent={(props) =>
              selectExpanded ? (
                <ExpandLessIcon {...props} style={{ color: colors?.mode === 'dark' ? '#ffffff' : '#000000' }} />
              ) : (
                <ExpandMoreIcon {...props} style={{ color: colors?.mode === 'dark' ? '#ffffff' : '#000000' }} />
              )
            }
            renderValue={(selected) => {
              if (!selected) {
                return (
                  <span
                    style={{
                      color: colors?.mode === 'dark' ? '#ffffff' : '#000000',
                      fontSize: isMobile ? 14 : 16,
                      fontWeight: 133,
                    }}
                  >
                    {t('Select Course')}
                  </span>
                );
              }
              const selectedRecord = detailedRecords.find((record) => record.id.toString() === selected);
              return (
                <span
                  style={{
                    color: colors?.mode === 'dark' ? '#ffffff' : '#000000',
                    fontSize: isMobile ? 14 : 16,
                    fontWeight: 133,
                  }}
                >
                  {selectedRecord ? `${selectedRecord.code} - ${selectedRecord.name}` : ''}
                </span>
              );
            }}
            size="small"
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: colors?.mode === 'dark' ? '#1e293b' : '#ffffff',
                  '& .MuiMenuItem-root': {
                    color: colors?.mode === 'dark' ? '#ffffff' : '#000000',
                    fontSize: isMobile ? 14 : 16,
                    '&:hover': {
                      backgroundColor: colors?.mode === 'dark' ? '#374151' : '#F3F4F6',
                    },
                    '&.Mui-selected': {
                      backgroundColor: colors?.mode === 'dark' ? '#4B5563' : '#E5E7EB',
                      '&:hover': {
                        backgroundColor: colors?.mode === 'dark' ? '#6B7280' : '#D1D5DB',
                      },
                    },
                  },
                },
              },
            }}
            sx={{
              backgroundColor: colors?.mode === 'dark' ? '#1e293b' : colors?.box || '#ffffff',
              height: isMobile ? 45 : 50,
              borderRadius: '8px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderStyle: 'none',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderStyle: 'none',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderStyle: 'none',
                boxShadow: 'none',
              },
              '& .MuiSelect-select': {
                paddingRight: '32px !important',
                paddingTop: '8px !important',
                paddingBottom: '8px !important',
                color: `${colors?.mode === 'dark' ? '#ffffff' : '#000000'} !important`,
                fontSize: `${isMobile ? 12 : 14}px !important`,
                fontWeight: '133 !important',
                height: `${isMobile ? 20 : 24}px !important`,
                display: 'flex',
                alignItems: 'center',
              },
            }}
          >
            {detailedRecords.map((record) => (
              <MenuItem
                key={record.id}
                value={record.id.toString()}
                sx={{
                  color: colors?.mode === 'dark' ? '#ffffff' : '#000000',
                  fontSize: isMobile ? 14 : 16,
                  fontWeight: 133,
                  '&:hover': {
                    backgroundColor: colors?.mode === 'dark' ? '#374151' : '#F3F4F6',
                  },
                  '&.Mui-selected': {
                    backgroundColor: colors?.mode === 'dark' ? '#4B5563' : '#E5E7EB',
                    '&:hover': {
                      backgroundColor: colors?.mode === 'dark' ? '#6B7280' : '#D1D5DB',
                    },
                  },
                }}
              >
                {record.code} - {record.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {error && ENABLE_EXTERNAL_API && (
        <div
          style={{
            backgroundColor: '#FEE2E2',
            color: '#DC2626',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
          }}
        >
          {t('Error loading data:')} {error}
        </div>
      )}

      <div
        style={{
          backgroundColor: colors?.box || '#ffffff',
          borderRadius: 12,
          padding: responsive.padding,
          marginBottom: responsive.marginBottom,
          boxShadow: colors?.mode === 'dark' ? '0 1px 3px rgba(0, 0, 0, 0.2)' : '0 1px 3px rgba(0,0,0,0.08)',
          border: colors?.mode === 'dark' ? '1px solid #374151' : '1px solid #E5E7EB',
          opacity: loading && ENABLE_EXTERNAL_API ? 0.7 : 1,
          height: responsive.panelHeight
        }}
      >
        
        <div style={{ 
          display: 'flex', 
          flexDirection: responsive.mainFlexDirection,
          gap: responsive.mainGap, 
          alignItems: responsive.mainFlexDirection === 'row' ? 'flex-start' : 'center' 
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: responsive.circleWidth,
            paddingLeft: responsive.circlePaddingLeft,
            marginTop: responsive.circleMarginTop
          }}>
            <div style={{ position: 'relative', marginBottom: isLaptop ? 10 : 20 }}>
              <div
                style={{
                  position: 'relative',
                  width: 'clamp(100px, 100%, 160px)',
                  height: 'clamp(100px, 100%, 160px)',
                  maxWidth: '160px',
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircularProgressbar
                  value={courseData.percentage}
                  text=""
                  styles={buildStyles({
                    pathColor: '#3B82F6',
                    trailColor: '#E5E7EB',
                    pathTransitionDuration: 0.8,
                    strokeLinecap: 'round',
                  })}
                  strokeWidth={7}
                />
                
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '24px',
                      lineHeight: '32px',
                      width: '52px',
                      fontWeight: '133',
                      color: '#3B82F6',
                    }}
                  >
                    {courseData.percentage}%
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      lineHeight: '16px',
                      width: '66px',
                      color: colors?.textSecondary || '#9CA3AF',
                      marginTop: 0,
                    }}
                  >
                    {t('Attendance')}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ fontSize: isMobile ? 13 : isLaptop ? 11 : 15, color: '#71717A', textAlign: 'center' }}>
              {courseData.attended} / {courseData.totalClasses} {t('sessions')}
            </div>
          </div>

          <div style={{ 
            flex: 1, 
            marginLeft: responsive.rightSectionMarginLeft,
            width: responsive.mainFlexDirection === 'column' ? '100%' : 'auto'
          }}>
            <h3
              style={{
                fontSize: responsive.titleFontSize,
                fontWeight: 133,
                color: colors?.text || '#09090B',
                margin: '0 0 4px 0',
                textAlign: 'left',
              }}
            >
              {courseData.name}
            </h3>
            <p
              style={{
                fontSize: isMobile ? 14 : isLaptop ? 12 : 16,
                color: '#71717A',
                margin: '0 0 12px 0',
                textAlign: 'left',
              }}
            >
              {courseData.code.toUpperCase()}
            </p>

            <div style={{ 
              display: 'flex', 
              flexDirection: responsive.statsFlexDirection,
              justifyContent: 'flex-start',
              gap: responsive.statsGap, 
              marginBottom: isLaptop ? 15 : 30
            }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: '#71717A', fontSize: isMobile ? 14 : isTinyTablet ? 14 : isSmallTablet ? 13 : isLaptop ? 11 : 16, marginBottom: 4, fontWeight: 133 }}>
                  {t('Total Classes')}
                </div>
                <div style={{ color: colors?.text || '#09090B', fontWeight: '133', fontSize: isMobile ? 20 : isTinyTablet ? 20 : isSmallTablet ? 18 : isLaptop ? 16 : 24 }}>
                  {courseData.totalClasses}
                </div>
              </div>

              <div style={{ textAlign: 'left' }}>
                <div style={{ color: '#71717A', fontSize: isMobile ? 14 : isTinyTablet ? 14 : isSmallTablet ? 13 : isLaptop ? 11 : 16, marginBottom: 4, fontWeight: 133 }}>
                  {t('Attended')}
                </div>
                <div style={{ color: '#16A34A', fontWeight: '133', fontSize: isMobile ? 20 : isTinyTablet ? 20 : isSmallTablet ? 18 : isLaptop ? 16 : 24 }}>
                  {courseData.attended}
                </div>
              </div>

              <div style={{ textAlign: 'left' }}>
                <div style={{ color: '#71717A', fontSize: isMobile ? 14 : isTinyTablet ? 14 : isSmallTablet ? 13 : isLaptop ? 11 : 16, marginBottom: 4, fontWeight: 133 }}>
                  {t('Absences')}
                </div>
                <div style={{ color: '#DC2626', fontWeight: '133', fontSize: isMobile ? 20 : isTinyTablet ? 20 : isSmallTablet ? 18 : isLaptop ? 16 : 24 }}>
                  {courseData.absences}
                </div>
              </div>
            </div>

            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', minWidth: isMobile ? 300 : 'auto' }}>
                <thead>
                  <tr style={{ borderBottom: colors?.mode === 'dark' ? '1px solid #374151' : '1px solid #E5E7EB' }}>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: `${responsive.tablePadding}px 2px ${responsive.tablePadding}px 0`,
                        color: '#71717A',
                        fontSize: isMobile ? 13 : isLaptop ? 11 : 15,
                        fontWeight: 133,
                        width: responsive.dateWidth,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {t('Date')}
                        <SwapVertIcon style={{ fontSize: isMobile ? 18 : isLaptop ? 16 : 22, color: '#71717A' }} />
                      </div>
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: `${responsive.tablePadding}px 0 ${responsive.tablePadding}px 0`,
                        color: '#71717A',
                        fontSize: 16,
                        lineHeight: '20px',
                        fontWeight: 133,
                        width: responsive.statusWidth,
                      }}
                    >
                      {t('Status')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sessionsData.map((session, index) => (
                    <tr
                      key={index}
                      style={{
                        borderBottom:
                          index < sessionsData.length - 1
                            ? colors?.mode === 'dark'
                              ? '1px solid #374151'
                              : '1px solid #E5E7EB'
                            : 'none',
                      }}
                    >
                      <td
                        style={{
                          padding: `${responsive.tablePadding}px 2px ${responsive.tablePadding}px 0`,
                          color: colors?.text || '#09090B',
                          fontSize: responsive.tableFontSize,
                        }}
                      >
                        {session.date}
                      </td>
                      <td style={{ padding: `${responsive.tablePadding}px 0 ${responsive.tablePadding}px 0` }}>
                        <span
                          style={{
                            backgroundColor: session.status === 'Present' ? '#DCFCE7' : '#FEE2E2',
                            color: session.status === 'Present' ? '#166534' : '#991B1B',
                            padding: isMobile ? '3px 8px' : isLaptop ? '2px 8px' : '4px 12px',
                            borderRadius: 6,
                            fontSize: 12,
                            lineHeight: '16px',
                            fontWeight: 133,
                          }}
                        >
                          {t(session.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {externalApiData && ENABLE_EXTERNAL_API && (
              <div
                style={{
                  marginTop: 20,
                  padding: 16,
                  backgroundColor: colors?.mode === 'dark' ? '#374151' : '#F3F4F6',
                  borderRadius: 8,
                  fontSize: isMobile ? 12 : 14,
                  color: colors?.text,
                }}
              >
                <strong>{t('External API Data:')}</strong>
                <pre style={{ marginTop: 8, fontSize: isMobile ? 10 : 12, overflow: 'auto' }}>
                  {JSON.stringify(externalApiData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseAttendancePanel;