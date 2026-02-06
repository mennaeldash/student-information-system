import React from 'react';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import Typography from "@mui/material/Typography";
import { SiWebex, SiCisco, SiMoodle } from 'react-icons/si';
import BarChartIcon from '@mui/icons-material/BarChart';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { PiMicrosoftOutlookLogoBold } from "react-icons/pi";
import { useThemeContext } from '../../services/theme_context.jsx';
import { useTranslation } from "react-i18next";
import Box from '@mui/material/Box';

export default function QuickLinks() {
  const { colors } = useThemeContext();
  const { t, i18n } = useTranslation();

  const links = [
    { href: 'https://webex.com', label: 'webex', icon: <SiWebex style={{ width: 26, height: 26 }} />, iconBg: '#DBEAFE', iconColor: '#2563EB' },
    { href: 'https://cisco.com', label: 'cisco', icon: <SiCisco style={{ width: 26, height: 26 }} />, iconBg: '#DCFCE7', iconColor: '#16A34A' },
    { href: '../../pages/student/Grades.jsx', label: 'view_grades', icon: <BarChartIcon style={{ width: 26, height: 26 }} />, iconBg: '#F3E8FF', iconColor: '#9333EA' },
    { href: '#calendar', label: 'calendar', icon: <CalendarMonthIcon style={{ width: 26, height: 26 }} />, iconBg: '#FEE2E2', iconColor: '#DC2626' },
    { href: '#moodle', label: 'moodle', icon: <SiMoodle style={{ width: 26, height: 26 }} />, iconBg: '#FEF3C7', iconColor: '#D97706' },
    { href: 'https://outlook.live.com', label: 'outlook', icon: <PiMicrosoftOutlookLogoBold style={{ width: 26, height: 26 }} />, iconBg: '#E0E7FF', iconColor: '#4F46E5' },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        mt: 2,
        backgroundColor: colors?.box || '#fff',
        color: colors?.text || '#1E293B',
        fontFamily: colors?.fontFamily,
        width: '100%',
        border: `1px solid ${colors?.border}`,
        boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: 400, fontSize: 19, color: colors?.text || "#1E40AF" }}
      >
        {t("quick_links")}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gap: { xs: 1.5, sm: 2, md: 2.5 },
          gridTemplateColumns: {
            xs: 'repeat(2, minmax(0, 1fr))',  
            sm: 'repeat(3, minmax(0, 1fr))',
            md: 'repeat(6, minmax(0, 1fr))',
          },
          alignItems: 'stretch',
        }}
      >
        {links.map(link => (
          <Paper
            key={link.label}
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid ${colors?.border}`,
              backgroundColor: colors?.box,
              height: { xs: 120, sm: 150 },
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
            }}
          >
            <Link
              href={link.href}
              target="_blank"
              underline="none"
              sx={{
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                textAlign: 'center',
                px: 1,
              }}
            >
              <Box
                sx={{
                  background: link.iconBg,
                  width: { xs: 46, sm: 52 },
                  height: { xs: 46, sm: 52 },
                  borderRadius: '50%',
                  mb: { xs: 1, sm: 1.25 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: link.iconColor,
                  fontSize: { xs: 24, sm: 26 },
                }}
              >
                {link.icon}
              </Box>

              <Box
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: 13, sm: 14.5 },
                  lineHeight: 1.2,
                }}
              >
                {t(link.label)}
              </Box>
            </Link>
          </Paper>
        ))}
      </Box>
    </Paper>
  );
}
