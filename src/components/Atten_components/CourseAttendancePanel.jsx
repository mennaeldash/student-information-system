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

const CourseAttendancePanel = ({ selectedCourse, setSelectedCourse, courses, detailedRecords }) => {
  const { colors } = useThemeContext();
  const { t } = useTranslation();
  const theme = useTheme();
  
  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 600px - 900px
  const isLaptop = useMediaQuery(theme.breakpoints.between('md', 'lg')); // 900px - 1200px
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg')); // > 1200px
  
  const courseData = detailedRecords.find(record => record.id.toString() === selectedCourse) || detailedRecords[0];
  const [selectExpanded, setSelectExpanded] = useState(false);

  // متغير للتحكم في تشغيل API (متوقف الآن)
  const ENABLE_EXTERNAL_API = false;

  // States للـ API الخارجي (بس مش هيتستخدموا دلوقتي)
  const [externalApiData, setExternalApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [sessionsData, setSessionsData] = useState([
    { date: 'Oct 15, 2023', status: 'Present' },
    { date: 'Oct 13, 2023', status: 'Present' },
    { date: 'Oct 6, 2023', status: 'Present' },
    { date: 'Sep 29, 2023', status: 'Present' },
    { date: 'Sep 22, 2023', status: 'Absent' },
    { date: 'Sep 15, 2023', status: 'Present' },
    { date: 'Sep 8, 2023', status: 'Present' },
    { date: 'Sep 1, 2023', status: 'Present' },
  ]);

  // useEffect للـ API الخارجي (معطل حالياً)
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

        if (data.sessions) {
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

  // useEffect لحفظ تفضيلات الثيم 
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
        circleSize: 160,
        circleMarginTop: 0,
        circleMinWidth: '100%',
        rightSectionMarginLeft: 0,
        titleFontSize: 24,
        statsFlexDirection: 'column',
        statsGap: '20px',
        tableFontSize: 16,
        padding: 16,
        marginBottom: 60
      };
    } else if (isTablet) {
      return {
        headerFlexDirection: 'column',
        headerGap: '20px',
        selectMinWidth: '100%',
        selectMaxWidth: '100%',
        mainFlexDirection: 'column',
        mainGap: '40px',
        circleSize: 180,
        circleMarginTop: 0,
        circleMinWidth: '100%',
        rightSectionMarginLeft: 0,
        titleFontSize: 26,
        statsFlexDirection: 'row',
        statsGap: '25px',
        tableFontSize: 18,
        padding: 20,
        marginBottom: 70
      };
    } else if (isLaptop) {
      return {
        headerFlexDirection: 'row',
        headerGap: '20px',
        selectMinWidth: 280,
        selectMaxWidth: 300,
        mainFlexDirection: 'row',
        mainGap: '40px',
        circleSize: 180,
        circleMarginTop: 100,
        circleMinWidth: 280,
        rightSectionMarginLeft: 60,
        titleFontSize: 26,
        statsFlexDirection: 'row',
        statsGap: '25px',
        tableFontSize: 18,
        padding: 22,
        marginBottom: 80
      };
    } else {
      return {
        headerFlexDirection: 'row',
        headerGap: '20px',
        selectMinWidth: 300,
        selectMaxWidth: 320,
        mainFlexDirection: 'row',
        mainGap: '60px',
        circleSize: 200,
        circleMarginTop: 250,
        circleMinWidth: 300,
        rightSectionMarginLeft: 100,
        titleFontSize: 28,
        statsFlexDirection: 'row',
        statsGap: '30px',
        tableFontSize: 20,
        padding: 24,
        marginBottom: 100
      };
    }
  };

  const responsive = getResponsiveValues();

  return (
    <div style={{ marginBottom: responsive.marginBottom }}>
      {/* Header */}
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
            fontSize: isMobile ? 18 : isTablet ? 19 : 20,
            fontWeight: 600,
            color: colors?.text || '#1F2937',
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
                      fontWeight: 500,
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
                    fontWeight: 500,
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
                fontSize: `${isMobile ? 14 : 16}px !important`,
                fontWeight: '500 !important',
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
                  fontWeight: 500,
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

      {/* رسالة الخطأ (تظهر فقط لو API شغال وحصل خطأ) */}
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

      {/* Main Panel */}
      <div
        style={{
          backgroundColor: colors?.box || '#ffffff',
          borderRadius: 12,
          padding: responsive.padding,
          marginBottom: responsive.marginBottom,
          boxShadow: colors?.mode === 'dark' ? '0 1px 3px rgba(0, 0, 0, 0.2)' : '0 1px 3px rgba(0,0,0,0.08)',
          border: colors?.mode === 'dark' ? '1px solid #374151' : '1px solid #E5E7EB',
          opacity: loading && ENABLE_EXTERNAL_API ? 0.7 : 1,
        }}
      >
        
        <div style={{ 
          display: 'flex', 
          flexDirection: responsive.mainFlexDirection,
          gap: responsive.mainGap, 
          alignItems: responsive.mainFlexDirection === 'row' ? 'flex-start' : 'center' 
        }}>
          {/* Left side - Circle Progress */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minWidth: responsive.circleMinWidth, 
            marginTop: responsive.circleMarginTop,
            width: responsive.mainFlexDirection === 'column' ? '100%' : 'auto'
          }}>
            <div style={{ position: 'relative', marginBottom: 20 }}>
              <svg width={responsive.circleSize} height={responsive.circleSize} style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx={responsive.circleSize/2}
                  cy={responsive.circleSize/2}
                  r={responsive.circleSize/2 - 20}
                  fill="none"
                  stroke={colors?.mode === 'dark' ? '#374151' : '#E5E7EB'}
                  strokeWidth={isMobile ? 8 : 12}
                  strokeLinecap="round"
                />
                <circle
                  cx={responsive.circleSize/2}
                  cy={responsive.circleSize/2}
                  r={responsive.circleSize/2 - 20}
                  fill="none"
                  stroke="#4F8CF7"
                  strokeWidth={isMobile ? 8 : 12}
                  strokeLinecap="round"
                  strokeDasharray={`${(courseData.percentage / 100) * (2 * Math.PI * (responsive.circleSize/2 - 20))} ${2 * Math.PI * (responsive.circleSize/2 - 20)}`}
                  strokeDashoffset="0"
                  style={{ transition: 'stroke-dasharray 0.8s ease-in-out' }}
                />
              </svg>

              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  color: colors?.text || '#1F2937',
                }}
              >
                <div style={{ fontSize: isMobile ? 28 : isTablet ? 32 : 36, fontWeight: '400', color: '#4F8CF7' }}>
                  {courseData.percentage}%
                </div>
                <div style={{ fontSize: isMobile ? 12 : 14, color: colors?.textSecondary || '#9CA3AF', marginTop: 4 }}>
                  {t('Attendance')}
                </div>
              </div>
            </div>

            <div style={{ fontSize: isMobile ? 13 : 15, color: colors?.textSecondary || '#9CA3AF', textAlign: 'center' }}>
              {courseData.attended} / {courseData.totalClasses} {t('sessions')}
            </div>
          </div>

          {/* Right side - Course Info + Sessions Table */}
          <div style={{ 
            flex: 1, 
            marginLeft: responsive.rightSectionMarginLeft,
            width: responsive.mainFlexDirection === 'column' ? '100%' : 'auto'
          }}>
            <h3
              style={{
                fontSize: responsive.titleFontSize,
                fontWeight: 600,
                color: colors?.text || '#1F2937',
                margin: '0 0 8px 0',
                textAlign: 'left',
              }}
            >
              {courseData.name}
            </h3>
            <p
              style={{
                fontSize: isMobile ? 14 : 16,
                color: colors?.textSecondary || '#9CA3AF',
                margin: '0 0 20px 0',
                textAlign: 'left',
              }}
            >
              {courseData.code.toUpperCase()}
            </p>

            <div style={{ 
              display: 'flex', 
              flexDirection: responsive.statsFlexDirection,
              justifyContent: responsive.statsFlexDirection === 'row' ? 'space-between' : 'flex-start',
              gap: responsive.statsGap, 
              marginBottom: 30 
            }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: colors?.textSecondary || '#9CA3AF', fontSize: isMobile ? 14 : 16, marginBottom: 4, fontWeight: 500 }}>
                  {t('Total Classes')}
                </div>
                <div style={{ color: colors?.text || '#1F2937', fontWeight: '400', fontSize: isMobile ? 20 : 24 }}>
                  {courseData.totalClasses}
                </div>
              </div>

              <div style={{ textAlign: 'left' }}>
                <div style={{ color: colors?.textSecondary || '#9CA3AF', fontSize: isMobile ? 14 : 16, marginBottom: 4, fontWeight: 500 }}>
                  {t('Attended')}
                </div>
                <div style={{ color: '#22C55E', fontWeight: '400', fontSize: isMobile ? 20 : 24 }}>
                  {courseData.attended}
                </div>
              </div>

              <div style={{ textAlign: 'left' }}>
                <div style={{ color: colors?.textSecondary || '#9CA3AF', fontSize: isMobile ? 14 : 16, marginBottom: 4, fontWeight: 500 }}>
                  {t('Absences')}
                </div>
                <div style={{ color: '#EF4444', fontWeight: '400', fontSize: isMobile ? 20 : 24 }}>
                  {courseData.absences}
                </div>
              </div>
            </div>

            {/* Sessions Table */}
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', minWidth: isMobile ? 300 : 'auto' }}>
                <thead>
                  <tr style={{ borderBottom: colors?.mode === 'dark' ? '1px solid #374151' : '1px solid #E5E7EB' }}>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: `${isMobile ? 8 : 12}px 2px ${isMobile ? 8 : 12}px 0`,
                        color: '#9CA3AF',
                        fontSize: isMobile ? 13 : 15,
                        fontWeight: 500,
                        width: '55%',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {t('Date')}
                        <SwapVertIcon style={{ fontSize: isMobile ? 18 : 22, color: '#6B7280' }} />
                      </div>
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: `${isMobile ? 8 : 12}px 0 ${isMobile ? 8 : 12}px 0`,
                        color: '#9CA3AF',
                        fontSize: isMobile ? 13 : 15,
                        fontWeight: 500,
                        width: '45%',
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
                          padding: `${isMobile ? 8 : 12}px 2px ${isMobile ? 8 : 12}px 0`,
                          color: colors?.text || '#1F2937',
                          fontSize: responsive.tableFontSize,
                          width: '55%',
                        }}
                      >
                        {session.date}
                      </td>
                      <td style={{ padding: `${isMobile ? 8 : 12}px 0 ${isMobile ? 8 : 12}px 0`, fontSize: responsive.tableFontSize, width: '45%' }}>
                        <span
                          style={{
                            backgroundColor: session.status === 'Present' ? '#D1FAE5' : '#FEE2E2',
                            color: session.status === 'Present' ? '#22C55E' : '#EF4444',
                            padding: isMobile ? '3px 8px' : '4px 12px',
                            borderRadius: 6,
                            fontSize: isMobile ? 10 : 12,
                            fontWeight: 500,
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

            {/* عرض البيانات من API (فقط لو شغال وفيه بيانات) */}
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
