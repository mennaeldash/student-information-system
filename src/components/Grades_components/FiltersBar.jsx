import React from 'react';
import { ChevronsUpDown } from 'lucide-react';

export default function FiltersBar({
  ui,
  isVerySmall,
  isTablet,
  isRTL,
  isDark,
  t,
  filters,
  academicYears,
  semesters,
  onFilterChange,
}) {
  return (
    <div
      style={{
        width: '100%',
        height: 'auto',
        padding: isVerySmall ? '16px' : '22px 24px',
        borderRadius: '8px',
        background: ui.box,
        border: `1px solid ${ui.border}`,
        boxShadow: ui.shadow,
        boxSizing: 'border-box',
        marginBottom: isVerySmall ? '16px' : '24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'flex-start',
          gap: isVerySmall ? '10px' : '16px',
          flexDirection: isVerySmall ? 'column' : 'row',
          flexWrap: isVerySmall ? 'nowrap' : isTablet ? 'wrap' : 'nowrap',
          justifyContent: isVerySmall ? 'flex-start' : 'space-between', // توزيع بين الاتنين [web:1]
        }}
      >
        {/* Academic Year */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            flex: isVerySmall ? '1 1 100%' : '0 1 48%',
            minWidth: isVerySmall ? '100%' : isTablet ? '260px' : 0,
          }}
        >
          <label
            style={{
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: '20px',
              color: ui.text,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {t('Academic Year') || 'Academic Year'}
          </label>

          <div style={{ position: 'relative', height: '36px', width: '100%' }}>
            <select
              value={filters.academic_year}
              onChange={e => onFilterChange('academic_year', e.target.value)}
              style={{
                width: '100%',
                height: '100%',
                padding: isRTL ? '8px 14px 8px 38px' : '8px 38px 8px 14px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '20px',
                appearance: 'none',
                cursor: 'pointer',
                border: `1px solid ${ui.inputBorder}`,
                background: ui.inputBg,
                color: ui.inputText,
                fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box',
              }}
            >
              {academicYears.map(year => (
                <option key={year} value={year} style={{ color: ui.inputText }}>
                  {year}
                </option>
              ))}
            </select>

            <div
              style={{
                position: 'absolute',
                top: '50%',
                [isRTL ? 'left' : 'right']: '8px',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChevronsUpDown size={18} color={isDark ? ui.text : '#000'} strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Semester */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            flex: isVerySmall ? '1 1 100%' : '0 1 48%',
            minWidth: isVerySmall ? '100%' : isTablet ? '260px' : 0,
          }}
        >
          <label
            style={{
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: '20px',
              color: ui.text,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {t('Semester') || 'Semester'}
          </label>

          <div style={{ position: 'relative', height: '36px', width: '100%' }}>
            <select
              value={filters.semester}
              onChange={e => onFilterChange('semester', e.target.value)}
              style={{
                width: '100%',
                height: '100%',
                padding: isRTL ? '8px 14px 8px 38px' : '8px 38px 8px 14px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '20px',
                appearance: 'none',
                cursor: 'pointer',
                border: `1px solid ${ui.inputBorder}`,
                background: ui.inputBg,
                color: ui.inputText,
                fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box',
              }}
            >
              {semesters.map(semester => (
                <option key={semester.value} value={semester.value} style={{ color: ui.inputText }}>
                  {semester.label}
                </option>
              ))}
            </select>

            <div
              style={{
                position: 'absolute',
                top: '50%',
                [isRTL ? 'left' : 'right']: '8px',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChevronsUpDown size={18} color={isDark ? ui.text : '#000'} strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}