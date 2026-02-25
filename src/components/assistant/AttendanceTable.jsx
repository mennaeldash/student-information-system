import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Avatar,
  CircularProgress,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Download, Funnel, ChevronsUpDown } from 'lucide-react';
import { CircleCheckBig, CircleX } from 'lucide-react';
import { useThemeContext } from '@/services/theme_context.jsx';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';

const AttendanceTable = ({ onStatsUpdate }) => {
  const isMobile = useMediaQuery('(max-width:768px)');
  const isTablet = useMediaQuery('(min-width:769px) and (max-width:1023px)');
  const isSmallLaptop = useMediaQuery('(min-width:1024px) and (max-width:1399px)');
  const isMediumScreen = useMediaQuery('(min-width:1400px) and (max-width:1649px)');
  const isResponsiveLaptop = useMediaQuery('(min-width:1650px)');
  
  const { colors } = useThemeContext();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [lastSavedTime, setLastSavedTime] = useState('10:30 AM');
  const [hasMore, setHasMore] = useState(true);
  const [totalStudents, setTotalStudents] = useState(100);
  const [currentCount, setCurrentCount] = useState(0);

  const getColumnSizes = () => {
    if (isResponsiveLaptop) {
      return {
        student: '22%',
        gapAfterStudent: '1.5%',
        attendance: '8%',
        gapBetweenStats: '1%',
        present: '6.5%',
        absent: '6.5%',
        gapBeforeSessions: '1.5%',
        session: '5%',
        gapBetweenSessions: '0.7%',
        headerFontSize: 'clamp(14px, 1.1vw, 18px)',
        bodyFontSize: 'clamp(13px, 1vw, 16px)',
        sessionFontSize: 'clamp(10px, 0.85vw, 13px)',
        avatarSize: 'clamp(42px, 3vw, 52px)',
        studentPaddingLeft: 'clamp(20px, 1.8vw, 32px)',
        studentPaddingLeftBody: 'clamp(12px, 1.2vw, 20px)',
        usePercentage: true,
      };
    } else if (isMediumScreen) {
      return {
        student: '22%',
        gapAfterStudent: '1.5%',
        attendance: '8%',
        gapBetweenStats: '1%',
        present: '6.5%',
        absent: '6.5%',
        gapBeforeSessions: '1.5%',
        session: '5%',
        gapBetweenSessions: '0.7%',
        headerFontSize: 'clamp(13px, 1.05vw, 17px)',
        bodyFontSize: 'clamp(12px, 0.95vw, 15px)',
        sessionFontSize: 'clamp(10px, 0.8vw, 12px)',
        avatarSize: 'clamp(40px, 2.8vw, 48px)',
        studentPaddingLeft: 'clamp(18px, 1.6vw, 28px)',
        studentPaddingLeftBody: 'clamp(12px, 1.1vw, 18px)',
        usePercentage: true,
      };
    } else {
      return {
        student: 250,
        gapAfterStudent: 16,
        attendance: 90,
        gapBetweenStats: 12,
        present: 70,
        absent: 70,
        gapBeforeSessions: 16,
        session: 56,
        gapBetweenSessions: 8,
        headerFontSize: isSmallLaptop ? '14px' : (isTablet ? '13px' : '12px'),
        bodyFontSize: isSmallLaptop ? '13px' : (isTablet ? '12px' : '11px'),
        sessionFontSize: isSmallLaptop ? '11px' : (isTablet ? '10px' : '9px'),
        avatarSize: isSmallLaptop ? 44 : (isTablet ? 40 : 36),
        studentPaddingLeft: isSmallLaptop ? '24px' : (isTablet ? '20px' : '14px'),
        studentPaddingLeftBody: isSmallLaptop ? '16px' : (isTablet ? '14px' : '10px'),
        usePercentage: false,
      };
    }
  };

  const sizes = getColumnSizes();

  const studentNames = [
    { ar: "محمد ياسر محمد", en: "Mohamed Yasser Mohamed" },
    { ar: "أحمد علي حسن", en: "Ahmed Ali Hassan" },
    { ar: "سارة محمد إبراهيم", en: "Sara Mohamed Ibrahim" },
    { ar: "فاطمة حسن علي", en: "Fatima Hassan Ali" },
    { ar: "عمر خالد محمود", en: "Omar Khaled Mahmoud" },
    { ar: "نور أحمد سالم", en: "Nour Ahmed Salem" },
    { ar: "يوسف إبراهيم حسن", en: "Youssef Ibrahim Hassan" },
    { ar: "ليلى محمود يوسف", en: "Laila Mahmoud Youssef" },
    { ar: "كريم سعيد محمد", en: "Karim Said Mohamed" },
    { ar: "مريم علي أحمد", en: "Maryam Ali Ahmed" },
    { ar: "حسن محمد كريم", en: "Hassan Mohamed Karim" },
    { ar: "دينا خالد إبراهيم", en: "Dina Khaled Ibrahim" },
    { ar: "طارق ياسر علي", en: "Tarek Yasser Ali" },
    { ar: "هبة سالم حسن", en: "Heba Salem Hassan" },
    { ar: "محمود أحمد خالد", en: "Mahmoud Ahmed Khaled" },
    { ar: "سلمى إبراهيم محمد", en: "Salma Ibrahim Mohamed" },
    { ar: "عادل حسن سالم", en: "Adel Hassan Salem" },
    { ar: "ندى محمد علي", en: "Nada Mohamed Ali" },
    { ar: "وليد خالد حسن", en: "Waleed Khaled Hassan" },
    { ar: "رنا يوسف إبراهيم", en: "Rana Youssef Ibrahim" },
    { ar: "تامر علي محمد", en: "Tamer Ali Mohamed" },
    { ar: "ياسمين حسن خالد", en: "Yasmin Hassan Khaled" },
    { ar: "شريف محمد سالم", en: "Sherif Mohamed Salem" },
    { ar: "نهى أحمد حسن", en: "Noha Ahmed Hassan" },
    { ar: "عمرو إبراهيم يوسف", en: "Amr Ibrahim Youssef" }
  ];

  const formatTime = (time) => {
    if (!time) return '';
    const parts = time.split(' ');
    if (parts.length === 2) {
      const [timePart, period] = parts;
      return `${timePart} ${t(period)}`;
    }
    return time;
  };
  
  const getStudentName = (nameObj) => {
    if (typeof nameObj === 'string') return nameObj;
    return i18n.language === 'ar' ? nameObj.ar : nameObj.en;
  };

  useEffect(() => {
    fetchStudentsData();
  }, []);
  
  useEffect(() => {
    if (students.length > 0 && onStatsUpdate) {
      const stats = calculateStatistics(students, totalStudents);
      onStatsUpdate(stats);
    }
  }, [students, totalStudents, onStatsUpdate]);
  
  const calculateStatistics = (studentsData, total) => {
    if (studentsData.length === 0) {
      return {
        completedSessions: 0,
        canceledSessions: 0,
        totalSessions: 0,
        totalStudents: 0,
        totalPresentStudents: 0
      };
    }
    
    const numSessions = studentsData[0].sessions?.length || 0;
    
    let completedSessions = 0;
    let canceledSessions = 0;
    let totalPresentStudents = 0;
    
    for (let i = 0; i < numSessions; i++) {
      const session = studentsData[0].sessions[i];
      
      if (session.isCanceled) {
        canceledSessions++;
        continue;
      }
      
      let presentInSession = 0;
      studentsData.forEach(student => {
        if (student.sessions[i]?.status === true) {
          presentInSession++;
        }
      });
      
      totalPresentStudents += presentInSession;
      
      if (presentInSession > 0) {
        completedSessions++;
      }
    }
    
    return {
      completedSessions,
      canceledSessions,
      totalSessions: numSessions,
      totalStudents: total,
      totalPresentStudents
    };
  };

  const fetchStudentsData = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockStudents = [
        {
          id: '2200914',
          name: { ar: "محمد ياسر محمد", en: "Mohamed Yasser Mohamed" },
          attendance: "63%",
          present: 5,
          absent: 3,
          sessions: [
            { date: "01/02", status: true, isCanceled: false },
            { date: "01/04", status: false, isCanceled: false },
            { date: "01/06", status: true, isCanceled: false },
            { date: "01/09", status: false, isCanceled: true },
            { date: "01/11", status: true, isCanceled: false },
            { date: "01/13", status: false, isCanceled: false },
            { date: "01/16", status: true, isCanceled: false },
            { date: "01/18", status: true, isCanceled: false },
          ],
        },
        {
          id: '2200915',
          name: { ar: "أحمد علي حسن", en: "Ahmed Ali Hassan" },
          attendance: "70%",
          present: 5,
          absent: 2,
          sessions: [
            { date: "01/02", status: true, isCanceled: false },
            { date: "01/04", status: false, isCanceled: false },
            { date: "01/06", status: true, isCanceled: false },
            { date: "01/09", status: false, isCanceled: true },
            { date: "01/11", status: true, isCanceled: false },
            { date: "01/13", status: true, isCanceled: false },
            { date: "01/16", status: true, isCanceled: false },
            { date: "01/18", status: false, isCanceled: false },
          ],
        },
        {
          id: '2200916',
          name: { ar: "سارة محمد إبراهيم", en: "Sara Mohamed Ibrahim" },
          attendance: "87%",
          present: 7,
          absent: 1,
          sessions: [
            { date: "01/02", status: true, isCanceled: false },
            { date: "01/04", status: true, isCanceled: false },
            { date: "01/06", status: true, isCanceled: false },
            { date: "01/09", status: false, isCanceled: true },
            { date: "01/11", status: true, isCanceled: false },
            { date: "01/13", status: true, isCanceled: false },
            { date: "01/16", status: true, isCanceled: false },
            { date: "01/18", status: true, isCanceled: false },
          ],
        },
      ];
      
      setStudents(mockStudents);
      setFilteredStudents(mockStudents);
      setCurrentCount(mockStudents.length);
      setTotalStudents(100);
      setHasMore(true);
      setLoading(false);
    }, 800);
  };

  const loadMoreStudents = async () => {
    if (loading) return;
    
    setLoading(true);
    
    setTimeout(() => {
      let studentsToAdd = [];
      
      const remainingCount = totalStudents - students.length;
      for (let i = 0; i < remainingCount; i++) {
        const nameIndex = (students.length + i) % studentNames.length;
        studentsToAdd.push({
          id: `22009${17 + students.length + i}`,
          name: studentNames[nameIndex],
          attendance: `${Math.floor(Math.random() * 30) + 60}%`,
          present: Math.floor(Math.random() * 5) + 3,
          absent: Math.floor(Math.random() * 3) + 1,
          sessions: [
            { date: "01/02", status: Math.random() > 0.3, isCanceled: false },
            { date: "01/04", status: Math.random() > 0.3, isCanceled: false },
            { date: "01/06", status: Math.random() > 0.3, isCanceled: false },
            { date: "01/09", status: false, isCanceled: true },
            { date: "01/11", status: Math.random() > 0.3, isCanceled: false },
            { date: "01/13", status: Math.random() > 0.3, isCanceled: false },
            { date: "01/16", status: Math.random() > 0.3, isCanceled: false },
            { date: "01/18", status: Math.random() > 0.3, isCanceled: false },
          ],
        });
      }
      
      setHasMore(false);
      
      const updatedStudents = [...students, ...studentsToAdd];
      setStudents(updatedStudents);
      setFilteredStudents(sortAndFilterStudents(updatedStudents, searchQuery, sortBy));
      setCurrentCount(updatedStudents.length);
      setLoading(false);
    }, 1000);
  };

  const sortAndFilterStudents = (studentsList, search, sort) => {
    let filtered = [...studentsList];

    if (search) {
      filtered = filtered.filter(
        (student) => {
          const studentName = getStudentName(student.name).toLowerCase();
          return studentName.includes(search.toLowerCase()) || student.id.includes(search);
        }
      );
    }

    if (sort === 'id') {
      filtered.sort((a, b) => a.id.localeCompare(b.id));
    } else if (sort === 'name') {
      filtered.sort((a, b) => {
        const nameA = getStudentName(a.name);
        const nameB = getStudentName(b.name);
        return nameA.localeCompare(nameB);
      });
    }

    return filtered;
  };

  useEffect(() => {
    setFilteredStudents(sortAndFilterStudents(students, searchQuery, sortBy));
  }, [searchQuery, sortBy, students, i18n.language]);

  const handleExport = () => {
    let allStudents = [...students];
    
    if (allStudents.length < totalStudents) {
      const remainingCount = totalStudents - allStudents.length;
      for (let i = 0; i < remainingCount; i++) {
        const nameIndex = (allStudents.length + i) % studentNames.length;
        allStudents.push({
          id: `22009${17 + allStudents.length + i}`,
          name: studentNames[nameIndex],
          attendance: `${Math.floor(Math.random() * 30) + 60}%`,
          present: Math.floor(Math.random() * 5) + 3,
          absent: Math.floor(Math.random() * 3) + 1,
          sessions: [
            { date: "01/02", status: Math.random() > 0.3, isCanceled: false },
            { date: "01/04", status: Math.random() > 0.3, isCanceled: false },
            { date: "01/06", status: Math.random() > 0.3, isCanceled: false },
            { date: "01/09", status: false, isCanceled: true },
            { date: "01/11", status: Math.random() > 0.3, isCanceled: false },
            { date: "01/13", status: Math.random() > 0.3, isCanceled: false },
            { date: "01/16", status: Math.random() > 0.3, isCanceled: false },
            { date: "01/18", status: Math.random() > 0.3, isCanceled: false },
          ],
        });
      }
    }

    const exportData = allStudents.map(student => {
      const row = {
        'Student ID': student.id,
        'Student Name': getStudentName(student.name),
        'Attendance': student.attendance,
        'Present': student.present,
        'Absent': student.absent,
      };
      
      student.sessions.forEach((session, idx) => {
        if (session.isCanceled) {
          row[`Session ${idx + 1} (${session.date})`] = 'Canceled';
        } else {
          row[`Session ${idx + 1} (${session.date})`] = session.status ? 'Present' : 'Absent';
        }
      });
      
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    const columnWidths = [
      { wch: 12 },
      { wch: 25 },
      { wch: 12 },
      { wch: 10 },
      { wch: 10 },
    ];
    
    for (let i = 0; i < 8; i++) {
      columnWidths.push({ wch: 18 });
    }
    
    worksheet['!cols'] = columnWidths;
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Report');
    
    const fileName = `Attendance_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      setLastSavedTime(time);
    }, 60000);

    return () => clearInterval(interval);
  }, [students]);

  return (
    <Box
      dir={isRTL ? 'rtl' : 'ltr'}
      sx={{
        width: '100%',
        height: 'auto',
        bgcolor: colors?.box || '#FFFFFF',
        borderRadius: '8px',
        boxShadow: colors?.mode === 'dark' ? '0px 2px 4px rgba(0, 0, 0, 0.3)' : '0px 2px 4px rgba(0, 0, 0, 0.1)',
        pt: isMobile ? '16px' : isTablet ? '18px' : isSmallLaptop ? '20px' : '25px',
        pr: isMobile ? '16px' : isTablet ? '20px' : isSmallLaptop ? '24px' : '40px',
        pb: isMobile ? '16px' : isTablet ? '18px' : isSmallLaptop ? '20px' : '25px',
        pl: isMobile ? '16px' : isTablet ? '18px' : isSmallLaptop ? '20px' : '25px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '16px' : isTablet ? '18px' : isSmallLaptop ? '20px' : '28px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: isMobile ? 'center' : 'flex-end',
          alignItems: 'center',
          width: '100%',
          mb: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '8px' : isTablet ? '10px' : isSmallLaptop ? '12px' : '17px',
            height: '20px',
            p: 0,
            m: 0,
            mr: isMobile ? 0 : isTablet ? '12px' : isSmallLaptop ? '16px' : '32px',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Inter',
              fontSize: isMobile ? '12px' : isTablet ? '14px' : isSmallLaptop ? '16px' : '18px',
              fontWeight: 400,
              lineHeight: '20px',
              color: '#475569',
              whiteSpace: 'nowrap',
            }}
          >
            {t('Last saved')}: {formatTime(lastSavedTime)}
          </Typography>
          <Box
            sx={{
              width: isMobile ? '10px' : isTablet ? '12px' : isSmallLaptop ? '14px' : '15px',
              height: isMobile ? '10px' : isTablet ? '12px' : isSmallLaptop ? '14px' : '15px',
              minWidth: isMobile ? '10px' : isTablet ? '12px' : isSmallLaptop ? '14px' : '15px',
              minHeight: isMobile ? '10px' : isTablet ? '12px' : isSmallLaptop ? '14px' : '15px',
              borderRadius: '50%',
              bgcolor: '#708864',
              flexShrink: 0,
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          width: '100%',
          height: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0px',
          padding: '0px',
          bgcolor: colors?.box || '#FFFFFF',
          borderRadius: '8px',
          border: `1px solid ${colors?.mode === 'dark' ? '#374151' : '#E2E8F0'}`,
          boxShadow: colors?.mode === 'dark' ? '0px 2px 4px rgba(0, 0, 0, 0.3)' : '0px 2px 4px rgba(0, 0, 0, 0.1)',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: isMobile ? 'auto' : '52px',
            display: 'flex',
            justifyContent: isMobile ? 'center' : 'flex-end',
            alignItems: 'center',
            px: isMobile ? '16px' : isTablet ? '20px' : isSmallLaptop ? '24px' : '32px',
            py: isMobile ? '12px' : '0px',
            bgcolor: colors?.box || '#FFFFFF',
            boxSizing: 'border-box',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: isMobile ? '12px' : isTablet ? '16px' : '20px',
              alignItems: 'center',
              height: '20px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                height: '20px',
              }}
            >
              <CircleCheckBig size={isMobile ? 14 : 16} color="#16A34A" strokeWidth={3} />
              <Typography
                sx={{
                  fontFamily: 'Inter',
                  fontSize: isMobile ? '11px' : isTablet ? '12px' : '14px',
                  fontWeight: 400,
                  lineHeight: '20px',
                  color: colors?.text || '#0F172A',
                  whiteSpace: 'nowrap',
                }}
              >
                {t('Present')}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                height: '20px',
              }}
            >
              <CircleX size={isMobile ? 14 : 16} color="#DC2626" strokeWidth={3} />
              <Typography
                sx={{
                  fontFamily: 'Inter',
                  fontSize: isMobile ? '11px' : isTablet ? '12px' : '14px',
                  fontWeight: 400,
                  lineHeight: '20px',
                  color: colors?.text || '#0F172A',
                  whiteSpace: 'nowrap',
                }}
              >
                {t('Absent')}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: isMobile || isTablet ? 'column' : 'row',
            gap: isMobile ? '12px' : isTablet ? '16px' : isSmallLaptop ? '20px' : '31px',
            alignItems: isMobile || isTablet ? 'stretch' : 'center',
            px: isMobile ? '16px' : isTablet ? '20px' : isSmallLaptop ? '24px' : '32px',
            pt: isMobile ? '12px' : isTablet ? '16px' : isSmallLaptop ? '20px' : '24px',
            pb: isMobile ? '12px' : isTablet ? '16px' : isSmallLaptop ? '20px' : '34px',
            bgcolor: colors?.box || '#FFFFFF',
            boxSizing: 'border-box',
          }}
        >
          <TextField
            fullWidth
            placeholder={t('Search by name or student ID...')}
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              flex: '1 1 70%',
              minWidth: '200px',
              '& .MuiOutlinedInput-root': {
                height: isMobile ? '40px' : isTablet ? '42px' : isSmallLaptop ? '46px' : '48px',
                borderRadius: '8px',
                fontFamily: 'Inter',
                fontSize: isMobile ? '12px' : isTablet ? '14px' : isSmallLaptop ? '16px' : '18px',
                fontWeight: 400,
                lineHeight: '20px',
                color: colors?.text || '#636369',
                bgcolor: colors?.box || '#FFFFFF',
                '& fieldset': { 
                  borderColor: '#64748B'
                },
                '&:hover fieldset': { 
                  borderColor: '#64748B'
                },
                '&.Mui-focused fieldset': { 
                  borderColor: '#64748B',
                  borderWidth: '1px' 
                },
                '& input': {
                  color: colors?.text || '#636369',
                  padding: '8px 14px',
                  lineHeight: '20px',
                },
                '& input::placeholder': {
                  color: '#636369',
                  opacity: 1,
                  fontFamily: 'Inter',
                  fontSize: isMobile ? '12px' : isTablet ? '14px' : isSmallLaptop ? '16px' : '18px',
                  fontWeight: 400,
                  lineHeight: '20px',
                },
              },
            }}
          />
          
          <Box sx={{ 
            position: 'relative', 
            flex: isMobile || isTablet ? 'none' : '1 1 30%',
            minWidth: isMobile || isTablet ? '100%' : '200px',
            width: isMobile || isTablet ? '100%' : 'auto'
          }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: '100%',
                height: isMobile ? '40px' : isTablet ? '42px' : isSmallLaptop ? '46px' : '48px',
                paddingLeft: isRTL ? '36px' : '32px',
                paddingRight: isRTL ? '32px' : '36px',
                fontSize: isMobile ? '12px' : isTablet ? '13px' : isSmallLaptop ? '15px' : '16px',
                fontWeight: 400,
                fontFamily: 'Inter',
                lineHeight: '14px',
                color: colors?.text || '#141B34',
                background: colors?.box || '#FFFFFF',
                border: `1px solid #64748B`,
                borderRadius: '8px',
                outline: 'none',
                appearance: 'none',
                cursor: 'pointer',
                boxSizing: 'border-box',
              }}
            >
              <option value="">{t('Select')}</option>
              <option value="id">{t('Sort by ID')}</option>
              <option value="name">{t('Sort by Name')}</option>
            </select>
            
            <Funnel 
              size={isMobile ? 16 : 18} 
              strokeWidth={1.5} 
              style={{ 
                position: 'absolute',
                ...(isRTL ? { right: '12px' } : { left: '12px' }),
                top: '50%',
                transform: 'translateY(-50%)',
                color: colors?.text || '#141B34',
                pointerEvents: 'none',
                zIndex: 1,
                display: 'block',
                margin: 0,
                padding: 0,
              }} 
            />
            
            <ChevronsUpDown
              size={isMobile ? 18 : 20}
              strokeWidth={1.5}
              style={{
                position: 'absolute',
                ...(isRTL ? { left: '10px' } : { right: '10px' }),
                top: '50%',
                transform: 'translateY(-50%)',
                color: colors?.text || '#141B34',
                pointerEvents: 'none',
                display: 'block',
                margin: 0,
                padding: 0,
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            width: isMobile ? 'calc(100% - 32px)' : isTablet ? 'calc(100% - 40px)' : isSmallLaptop ? 'calc(100% - 48px)' : 'calc(100% - 64px)',
            bgcolor: colors?.mode === 'dark' ? '#1F2937' : '#F9FAFB',
            borderRadius: '8px',
            border: `1px solid ${colors?.mode === 'dark' ? '#374151' : '#E2E8F0'}`,
            boxShadow: colors?.mode === 'dark' ? '0px 2px 4px rgba(0, 0, 0, 0.2)' : '0px 2px 4px rgba(0, 0, 0, 0.08)',
            mx: isMobile ? '16px' : isTablet ? '20px' : isSmallLaptop ? '24px' : '32px',
            mb: isMobile ? '12px' : isTablet ? '16px' : isSmallLaptop ? '20px' : '24px',
            WebkitOverflowScrolling: 'touch',
 overflowX: (isResponsiveLaptop || isMediumScreen) ? 'hidden' : 'auto',
   overflowY: 'hidden',          }}
        >
          <Table
            sx={{
              width: '100%',
              minWidth: (isResponsiveLaptop || isMediumScreen) ? 'auto' : '1200px',
              tableLayout: (isResponsiveLaptop || isMediumScreen) ? 'fixed' : 'auto',
              bgcolor: 'transparent',
              borderCollapse: 'separate',
              borderSpacing: '0',
            }}
          >
            <TableHead>
              <TableRow 
                sx={{ 
                  height: '68px',
                  bgcolor: colors?.mode === 'dark' ? '#374151' : '#F1F5F9',
                  boxShadow: colors?.mode === 'dark' ? '0px 1px 3px rgba(0, 0, 0, 0.25)' : '0px 1px 3px rgba(0, 0, 0, 0.08)',
                  '& th:first-of-type': {
                    borderTopLeftRadius: isRTL ? '0px' : '8px',
                    borderTopRightRadius: isRTL ? '8px' : '0px',
                  },
                  '& th:last-of-type': {
                    borderTopRightRadius: isRTL ? '0px' : '8px',
                    borderTopLeftRadius: isRTL ? '8px' : '0px',
                  },
                }}
              >
                <TableCell
                  sx={{
                    bgcolor: colors?.mode === 'dark' ? '#374151' : '#F1F5F9',
                    fontFamily: 'Inter',
                    fontSize: sizes.headerFontSize,
                    fontWeight: 400,
                    lineHeight: sizes.headerFontSize,
                    letterSpacing: 0,
                    color: colors?.text || '#020617',
                    width: sizes.usePercentage ? sizes.student : `${sizes.student}px`,
                    pl: sizes.studentPaddingLeft,
                    pr: sizes.studentPaddingLeft,
                    py: 0,
                    whiteSpace: 'nowrap',
                    border: 'none',
                    textAlign: 'start',
                    boxSizing: 'border-box',
                  }}
                >
                  {t('Student')}
                </TableCell>

                <TableCell sx={{ 
                  bgcolor: colors?.mode === 'dark' ? '#374151' : '#F1F5F9', 
                  width: sizes.usePercentage ? sizes.gapAfterStudent : `${sizes.gapAfterStudent}px`, 
                  border: 'none', 
                  p: 0 
                }} />

                <TableCell
                  sx={{
                    bgcolor: colors?.mode === 'dark' ? '#374151' : '#F1F5F9',
                    fontFamily: 'Inter',
                    fontSize: sizes.headerFontSize,
                    fontWeight: 400,
                    lineHeight: sizes.headerFontSize,
                    letterSpacing: 0,
                    color: colors?.text || '#020617',
                    width: sizes.usePercentage ? sizes.attendance : `${sizes.attendance}px`,
                    px: '4px',
                    py: 0,
                    whiteSpace: 'nowrap',
                    border: 'none',
                    textAlign: 'center',
                    boxSizing: 'border-box',
                  }}
                >
                  {t('Attendance')}
                </TableCell>

                <TableCell sx={{ 
                  bgcolor: colors?.mode === 'dark' ? '#374151' : '#F1F5F9', 
                  width: sizes.usePercentage ? sizes.gapBetweenStats : `${sizes.gapBetweenStats}px`, 
                  border: 'none', 
                  p: 0 
                }} />

                <TableCell
                  sx={{
                    bgcolor: colors?.mode === 'dark' ? '#374151' : '#F1F5F9',
                    fontFamily: 'Inter',
                    fontSize: sizes.headerFontSize,
                    fontWeight: 400,
                    lineHeight: sizes.headerFontSize,
                    letterSpacing: 0,
                    color: colors?.text || '#020617',
                    width: sizes.usePercentage ? sizes.present : `${sizes.present}px`,
                    px: '4px',
                    py: 0,
                    whiteSpace: 'nowrap',
                    border: 'none',
                    textAlign: 'center',
                    boxSizing: 'border-box',
                  }}
                >
                  {t('Present')}
                </TableCell>

                <TableCell sx={{ 
                  bgcolor: colors?.mode === 'dark' ? '#374151' : '#F1F5F9', 
                  width: sizes.usePercentage ? sizes.gapBetweenStats : `${sizes.gapBetweenStats}px`, 
                  border: 'none', 
                  p: 0 
                }} />

                <TableCell
                  sx={{
                    bgcolor: colors?.mode === 'dark' ? '#374151' : '#F1F5F9',
                    fontFamily: 'Inter',
                    fontSize: sizes.headerFontSize,
                    fontWeight: 400,
                    lineHeight: sizes.headerFontSize,
                    letterSpacing: 0,
                    color: colors?.text || '#020617',
                    width: sizes.usePercentage ? sizes.absent : `${sizes.absent}px`,
                    px: '4px',
                    py: 0,
                    whiteSpace: 'nowrap',
                    border: 'none',
                    textAlign: 'center',
                    boxSizing: 'border-box',
                  }}
                >
                  {t('Absent')}
                </TableCell>

                <TableCell sx={{ 
                  bgcolor: colors?.mode === 'dark' ? '#374151' : '#F1F5F9', 
                  width: sizes.usePercentage ? sizes.gapBeforeSessions : `${sizes.gapBeforeSessions}px`, 
                  border: 'none', 
                  p: 0 
                }} />

                {filteredStudents.length > 0 && filteredStudents[0].sessions.map((session, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <TableCell sx={{ 
                      bgcolor: colors?.mode === 'dark' ? '#374151' : '#F1F5F9', 
                      width: sizes.usePercentage ? sizes.gapBetweenSessions : `${sizes.gapBetweenSessions}px`, 
                      border: 'none', 
                      p: 0 
                    }} />}
                    <TableCell
                      align="center"
                      sx={{
                        bgcolor: colors?.mode === 'dark' ? '#374151' : '#F1F5F9',
                        width: sizes.usePercentage ? sizes.session : `${sizes.session}px`,
                        px: '4px',
                        py: 0,
                        border: 'none',
                        textAlign: 'center',
                        boxSizing: 'border-box',
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px' }}>
                        <Box
                          sx={{
                            fontFamily: 'Inter',
                            fontSize: sizes.sessionFontSize,
                            fontWeight: 400,
                            lineHeight: sizes.sessionFontSize,
                            letterSpacing: 0,
                            color: colors?.text || '#0F172A',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {t('Session')}
                        </Box>
                        <Box
                          sx={{
                            fontFamily: 'Inter',
                            fontSize: sizes.sessionFontSize,
                            fontWeight: 400,
                            lineHeight: sizes.sessionFontSize,
                            letterSpacing: 0,
                            color: colors?.text || '#0F172A',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {idx + 1}
                        </Box>
                        <Box
                          sx={{
                            fontFamily: 'Inter',
                            fontSize: sizes.sessionFontSize,
                            fontWeight: 400,
                            lineHeight: sizes.sessionFontSize,
                            letterSpacing: 0,
                            color: colors?.textSecondary || '#64748B',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {session.date}
                        </Box>
                      </Box>
                    </TableCell>
                  </React.Fragment>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={100} align="center" sx={{ py: 4, border: 'none' }}>
                    <CircularProgress size={isMobile ? 32 : 40} sx={{ color: colors?.text }} />
                  </TableCell>
                </TableRow>
              ) : filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={100} align="center" sx={{ py: 4, border: 'none' }}>
                    <Typography sx={{ color: colors?.textSecondary || '#71717A', fontSize: sizes.bodyFontSize }}>
                      {t('No students found')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student, studentIdx) => (
                  <TableRow
                    key={student.id}
                    sx={{
                      height: '68px',
                      bgcolor: colors?.mode === 'dark' ? '#1F2937' : '#F9FAFB',
                      boxShadow: colors?.mode === 'dark' ? '0px 1px 2px rgba(0, 0, 0, 0.15)' : '0px 1px 2px rgba(0, 0, 0, 0.05)',
                      '&:hover': {
                        bgcolor: colors?.mode === 'dark' ? '#374151' : '#F1F5F9',
                      },
                      '& td': {
                        borderBottom: studentIdx === filteredStudents.length - 1 ? 'none' : `1px solid ${colors?.mode === 'dark' ? '#374151' : '#E2E8F0'}`,
                      },
                      ...(studentIdx === filteredStudents.length - 1 && {
                        '& td:first-of-type': {
                          borderBottomLeftRadius: isRTL ? '0px' : '8px',
                          borderBottomRightRadius: isRTL ? '8px' : '0px',
                        },
                        '& td:last-of-type': {
                          borderBottomRightRadius: isRTL ? '0px' : '8px',
                          borderBottomLeftRadius: isRTL ? '8px' : '0px',
                        },
                      }),
                    }}
                  >
                    <TableCell
                      sx={{
                        bgcolor: 'transparent',
                        width: sizes.usePercentage ? sizes.student : `${sizes.student}px`,
                        pl: sizes.studentPaddingLeftBody,
                        pr: sizes.studentPaddingLeftBody,
                        py: 0,
                        border: 'none',
                        verticalAlign: 'middle',
                        boxSizing: 'border-box',
                        overflow: 'visible',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '8px' }}>
                        <Avatar
                          sx={{
                            width: sizes.avatarSize,
                            height: sizes.avatarSize,
                            bgcolor: '#71717A',
                            flexShrink: 0,
                            fontSize: isMobile ? '14px' : isTablet ? '16px' : isMediumScreen ? '15px' : '18px',
                          }}
                        >
                          {getStudentName(student.name).charAt(0)}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontFamily: 'Inter',
                              fontSize: sizes.bodyFontSize,
                              fontWeight: 400,
                              lineHeight: '24px',
                              color: colors?.text || '#09090B',
                              whiteSpace: 'nowrap',
                              overflow: 'visible',
                            }}
                          >
                            {getStudentName(student.name)}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: 'Inter',
                              fontSize: sizes.bodyFontSize,
                              fontWeight: 400,
                              lineHeight: '24px',
                              color: colors?.textSecondary || '#71717A',
                            }}
                          >
                            {student.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ bgcolor: 'transparent', border: 'none', p: 0 }} />

                    <TableCell
                      sx={{
                        bgcolor: 'transparent',
                        width: sizes.usePercentage ? sizes.attendance : `${sizes.attendance}px`,
                        px: '4px',
                        py: 0,
                        border: 'none',
                        verticalAlign: 'middle',
                        textAlign: 'center',
                        boxSizing: 'border-box',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: isMobile ? '56px' : isTablet ? '60px' : '64px',
                          height: isMobile ? '24px' : '28px',
                          border: `1px solid ${colors?.mode === 'dark' ? '#4B5563' : '#E4E4E7'}`,
                          borderRadius: '8px',
                          bgcolor: colors?.mode === 'dark' ? '#374151' : '#FFFFFF',
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: 'Inter',
                            fontSize: isMobile ? '10px' : isTablet ? '11px' : '12px',
                            fontWeight: 400,
                            lineHeight: '16px',
                            color: colors?.text || '#0F172A',
                          }}
                        >
                          {student.attendance}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ bgcolor: 'transparent', border: 'none', p: 0 }} />

                    <TableCell
                      sx={{
                        bgcolor: 'transparent',
                        width: sizes.usePercentage ? sizes.present : `${sizes.present}px`,
                        px: '4px',
                        py: 0,
                        border: 'none',
                        verticalAlign: 'middle',
                        textAlign: 'center',
                        boxSizing: 'border-box',
                      }}
                    >
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        <CircleCheckBig size={isMobile ? 14 : 16} color="#16A34A" strokeWidth={3} />
                        <Typography
                          sx={{
                            fontFamily: 'Inter',
                            fontSize: sizes.bodyFontSize,
                            fontWeight: 400,
                            lineHeight: '24px',
                            color: colors?.text || '#0F172A',
                          }}
                        >
                          {student.present}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ bgcolor: 'transparent', border: 'none', p: 0 }} />

                    <TableCell
                      sx={{
                        bgcolor: 'transparent',
                        width: sizes.usePercentage ? sizes.absent : `${sizes.absent}px`,
                        px: '4px',
                        py: 0,
                        border: 'none',
                        verticalAlign: 'middle',
                        textAlign: 'center',
                        boxSizing: 'border-box',
                      }}
                    >
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '1px' }}>
                        <CircleX size={isMobile ? 14 : 16} color="#DC2626" strokeWidth={3} />
                        <Typography
                          sx={{
                            fontFamily: 'Inter',
                            fontSize: sizes.bodyFontSize,
                            fontWeight: 400,
                            lineHeight: '24px',
                            color: colors?.text || '#0F172A',
                          }}
                        >
                          {student.absent}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ bgcolor: 'transparent', border: 'none', p: 0 }} />

                    {student.sessions.map((session, sessionIdx) => (
                      <React.Fragment key={sessionIdx}>
                        {sessionIdx > 0 && <TableCell sx={{ bgcolor: 'transparent', border: 'none', p: 0 }} />}
                        <TableCell
                          sx={{
                            bgcolor: 'transparent',
                            width: sizes.usePercentage ? sizes.session : `${sizes.session}px`,
                            px: '4px',
                            py: 0,
                            border: 'none',
                            verticalAlign: 'middle',
                            textAlign: 'center',
                            boxSizing: 'border-box',
                          }}
                        >
                          {session.status ? (
                            <CircleCheckBig size={isMobile ? 14 : 16} color="#16A34A" strokeWidth={3} />
                          ) : (
                            <CircleX size={isMobile ? 14 : 16} color="#DC2626" strokeWidth={3} />
                          )}
                        </TableCell>
                      </React.Fragment>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {hasMore && (
            <Box
              onClick={loadMoreStudents}
              sx={{
                position: 'sticky',
                bottom: 0,
                left: 0,
                width: '100%',
                minHeight: '68px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: colors?.mode === 'dark' ? '#1F2937' : '#F9FAFB',
                cursor: loading ? 'not-allowed' : 'pointer',
                py: '18px',
                borderTop: `1px solid ${colors?.mode === 'dark' ? '#4B5563' : '#E2E8F0'}`,
                borderBottom: `1px solid ${colors?.mode === 'dark' ? '#4B5563' : '#E2E8F0'}`,
                boxShadow: colors?.mode === 'dark' ? '0px 1px 3px rgba(0, 0, 0, 0.2), 0px -1px 3px rgba(0, 0, 0, 0.2)' : '0px 1px 3px rgba(0, 0, 0, 0.08), 0px -1px 3px rgba(0, 0, 0, 0.08)',
                borderRadius: '8px',
                zIndex: 10,
                '&:hover': {
                  bgcolor: loading ? (colors?.mode === 'dark' ? '#1F2937' : '#F9FAFB') : (colors?.mode === 'dark' ? '#374151' : '#F1F5F9'),
                },
              }}
            >
              {loading ? (
                <CircularProgress size={isMobile ? 22 : 26} sx={{ color: '#475569' }} />
              ) : (
                <Typography
                  sx={{
                    fontFamily: 'Inter',
                    fontSize: isMobile ? '13px' : isTablet ? '15px' : isSmallLaptop ? '17px' : '18px',
                    fontWeight: 400,
                    lineHeight: '20px',
                    color: '#475569',
                  }}
                >
                  {t('Loading more students...')}({currentCount} {t('of')} {totalStudents})
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end', mt: 0 }}>
        <Button
          variant="contained"
          startIcon={<Download size={isMobile ? 16 : 18} strokeWidth={2} />}
          fullWidth={isMobile}
          onClick={handleExport}
          disabled={loading}
          sx={{
            width: isMobile ? '100%' : '170px',
            height: isMobile ? '40px' : '40px',
            bgcolor: '#1F609D',
            color: '#FFFFFF',
            textTransform: 'none',
            borderRadius: '8px',
            px: '24px',
            py: '12px',
            fontFamily: 'Inter',
            fontSize: isMobile ? '12px' : '14px',
            fontWeight: 500,
            lineHeight: '20px',
            boxShadow: 'none',
            gap: '8px',
            flexDirection: isRTL ? 'row-reverse' : 'row',
            '&:hover': {
              bgcolor: '#1A5082',
              boxShadow: 'none',
            },
            '&:disabled': {
              bgcolor: '#9CA3AF',
              color: '#FFFFFF',
            },
            '& .MuiButton-startIcon': {
              margin: 0,
              ...(isRTL ? { marginLeft: '8px' } : { marginRight: '8px' }),
            },
          }}
        >
          {t('Export Sheet')}
        </Button>
      </Box>
    </Box>
  );
};

export default AttendanceTable;