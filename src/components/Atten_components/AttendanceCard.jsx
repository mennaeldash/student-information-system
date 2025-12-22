import React, { useState, useEffect } from 'react';
import { useThemeContext } from '@/services/theme_context.jsx';
import { useTranslation } from 'react-i18next';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { calculateCircleValues } from './AttendanceUtils.js';

const AttendanceCard = ({ record }) => {
  const { colors } = useThemeContext();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  
  //  متغير للتحكم في تشغيل API (متوقف الآن)
  const ENABLE_EXTERNAL_API = false; // غيري لـ true لما تكوني جاهزة
  
  // States للـ API الخارجي (بس مش هيتستخدموا دلوقتي)
  const [externalDetails, setExternalDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  const radius = 55;
  const strokeWidth = 8;
  const { circumference, strokeDashoffset, normalizedRadius } = calculateCircleValues(radius, strokeWidth, record.percentage);

  const attendanceRateColor = expanded 
    ? (colors?.mode === 'dark' ? '#FFFFFF' : '#000000')
    : (colors?.text || '#1F2937');

  const progressBarColor = expanded 
    ? (colors?.mode === 'dark' ? '#FFFFFF' : '#000000')
    : record.statusColor;

  //  useEffect للـ API الخارجي (معطل حالياً)
  useEffect(() => {
    if (!ENABLE_EXTERNAL_API || !expanded) return;
    
    const fetchExternalDetails = async () => {
      setDetailsLoading(true);
      setDetailsError(null);
      
      try {
        const response = await fetch(`https://your-actual-api.com/course-details/${record.id}`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const details = await response.json();
        setExternalDetails(details);
        
      } catch (error) {
        console.error('Failed to fetch course details:', error);
        setDetailsError(error.message);
      } finally {
        setDetailsLoading(false);
      }
    };

    fetchExternalDetails();
  }, [expanded, record.id, ENABLE_EXTERNAL_API]);

  //  حفظ واستعادة حالة التوسيع (اختياري)
  useEffect(() => {
    const storageKey = `attendance-card-${record.id}-expanded`;
    
    if (expanded) {
      localStorage.setItem(storageKey, 'true');
    } else {
      localStorage.removeItem(storageKey);
    }
  }, [expanded, record.id]);

  useEffect(() => {
    const storageKey = `attendance-card-${record.id}-expanded`;
    const savedExpanded = localStorage.getItem(storageKey);
    
    if (savedExpanded === 'true') {
      setExpanded(true);
    }
  }, [record.id]);

  return (
    <div
      style={{
        backgroundColor: colors?.box || '#ffffff',
        borderRadius: 12,
        padding: 24,
      
        boxShadow: colors?.mode === 'dark' 
          ? '0 1px 3px rgba(0, 0, 0, 0.2)' 
          : '0 1px 3px rgba(0,0,0,0.08)',
        border: colors?.mode === 'dark' 
          ? '1px solid #374151' 
          : '1px solid #E5E7EB',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 18, color: colors?.text || '#1F2937' }}>{record.name}</div>
          <div style={{ fontSize: 14, color: colors?.textSecondary || '#6B7280' }}>{record.code}</div>
        </div>
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => setExpanded(!expanded)}
        >
          <TaskAltIcon style={{ fontSize: '20px', color: record.statusColor }} />
          <span style={{
            fontSize: '14px',
            fontWeight: '300',
            color: record.statusColor,
            
          }}>
            {t(record.status)}
          </span>
          <div style={{ marginLeft: '19px' }}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            {detailsLoading && expanded && ENABLE_EXTERNAL_API && (
              <span style={{ marginLeft: 8, fontSize: 12, color: colors?.textSecondary }}>
                {t('Loading...')}
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'end',
        margin: '16px 0 8px 0'
      }}>
        <div style={{ 
          fontSize: 14, 
          color: colors?.textSecondary || '#191a1aff', 
          lineHeight: 1,
          margin: 0,
          padding: 0
        }}>
          {t('Attendance Rate')}
        </div>
        <div style={{ 
          fontWeight: '400', 
          fontSize: 14, 
          color: attendanceRateColor,
          lineHeight: 1,
          margin: 0,
          padding: 0,
        }}>
          {record.percentage}%
        </div>
      </div>

      <div style={{ 
        height: 7, 
        borderRadius: 6, 
        backgroundColor: colors?.mode === 'dark' ? '#4B5563' : '#E5E7EB', 
        overflow: 'hidden'
      }}>
        <div
          style={{
            width: `${record.percentage}%`,
            height: '100%',
            backgroundColor: progressBarColor,
            transition: 'width 0.3s ease, background-color 0.3s ease',
          }}
        />
      </div>

      {expanded && (
        <div
          style={{
            marginTop: 30,
            display: 'flex',
            justifyContent: 'space-around',
            fontSize: 14,
            color: colors?.text || '#1F2937',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width={(radius + strokeWidth) * 2} height={(radius + strokeWidth) * 2} style={{ transform: 'rotate(-90deg)' }}>
              <circle 
                cx={radius + strokeWidth} 
                cy={radius + strokeWidth} 
                r={normalizedRadius} 
                stroke={colors?.mode === 'dark' ? '#4B5563' : '#E5E7EB'} 
                strokeWidth={strokeWidth} 
                fill="none" 
                style={{ opacity: 0.3 }}
              />
              <circle
                cx={radius + strokeWidth}
                cy={radius + strokeWidth}
                r={normalizedRadius}
                stroke={record.statusColor}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                strokeLinecap="round"
              />
            </svg>
            <div
              style={{
                position: 'relative',
                top: -90,
                textAlign: 'center',
                fontWeight: '400',
                fontSize: 24,
                color: record.statusColor,
              }}
            >
              {record.percentage}%
            </div>
            <div style={{ 
              position: 'relative',
              top: -85,
              fontWeight: '400', 
              fontSize: 11, 
              color: colors?.textSecondary || '#6B7280',
              textAlign: 'center'
            }}>
              {t('Attendance')}
            </div>
          </div>

          <div style={{ textAlign: 'left' }}>
            <div style={{ color: colors?.textSecondary || '#6B7280', fontSize: 14 }}>{t('Total Classes')}</div>
            <div style={{ 
              fontWeight: '400', 
              color: colors?.text || '#1F2937',
              fontSize: 22,
              marginBottom: 12
            }}>{record.totalClasses}</div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: colors?.textSecondary || '#6B7280',
                fontSize: 12,
              }}
            >
              <AccessTimeIcon style={{ fontSize: 15 }} />
              <span style={{ marginLeft: 4 }}>{t('Last updated:')} {record.lastUpdated}</span>
            </div>
          </div>

          <div style={{ textAlign: 'left' }}>
            <div style={{ color: colors?.textSecondary || '#6B7280', fontSize: 14 }}>{t('Attended')}</div>
            <div style={{ 
              fontWeight: '400', 
              color: '#22C55E',
              fontSize: 22,
              marginBottom: 12
            }}>{record.attended}</div>
          </div>

          <div style={{ textAlign: 'left' }}>
            <div style={{ color: colors?.textSecondary || '#6B7280', fontSize: 14 }}>{t('Absences')}</div>
            <div style={{ 
              fontWeight: '400', 
              color: '#EF4444',
              fontSize: 22,
              marginBottom: 12
            }}>{record.absences}</div>
          </div>
        </div>
      )}

      {/*  رسالة الخطأ (تظهر فقط لو API شغال وحصل خطأ) */}
      {expanded && detailsError && ENABLE_EXTERNAL_API && (
        <div style={{
          marginTop: 16,
          backgroundColor: '#FEE2E2',
          color: '#DC2626',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px'
        }}>
          {t('Error loading details:')} {detailsError}
        </div>
      )}

      {/*  عرض التفاصيل الإضافية (فقط لو API شغال وفيه بيانات) */}
      {expanded && externalDetails && ENABLE_EXTERNAL_API && (
        <div style={{
          marginTop: 16,
          padding: 12,
          backgroundColor: colors?.mode === 'dark' ? '#374151' : '#F3F4F6',
          borderRadius: 6,
          fontSize: 12,
          color: colors?.text
        }}>
          <strong>{t('External Details:')}</strong>
          <pre style={{ marginTop: 8, fontSize: 11, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(externalDetails, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AttendanceCard;