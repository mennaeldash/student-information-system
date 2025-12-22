import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Divider, Button } from '@mui/material';
import { useThemeContext } from '../../services/theme_context.jsx';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import UseProfile from "../../hooks/UseProfile";


export default function QualificationsCard() {
 
  const { colors } = useThemeContext();
  const { t } = useTranslation();
      const { q, error } = UseProfile(); // ✅ جاي من hook


  if (error) return <Typography color="error">{error}</Typography>;
  if (!q) return <Typography>{t('loading')}</Typography>;

  return (
    <Paper
      elevation={0}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        border: `1px solid ${colors?.border}`,
        bgcolor: colors?.box,
        mb: 3,
        width: '100%',
        fontFamily: colors?.fontFamily,
        color: colors?.text,
      }}
    >
      {/* Header */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 1.5,
      }}>
        <Typography
          fontWeight={600}
          sx={{ fontSize: 18, color: colors?.text, letterSpacing: '.02em' }}
        >
          {t('previous_qualifications')}
        </Typography>
     <Button
              size="small"
              variant="outlined"
              sx={{
                fontWeight: 500,
                fontSize: 13,
                py: 0.2,
                px: 1.4,
                color: '#64748B',
                borderColor: '#e2e8f0',
                background: '#fafbfd',
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: 'none',
                minWidth: 0,
                '&:hover': {
                  borderColor: '#b6c1d4',
                  background: '#f6faff',
                },
              }}
            >
              {t("request_edit")}
            </Button>
      </Box>

      <Divider sx={{ mb: 3, borderColor: colors?.border, height: 1 }} />

      {/* Content */}
      <Box sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        gap: 1,
        rowGap: 1.5,
      }}>
      <Box>
  <Label colors={colors}>{t('school_name')}</Label>
  <Value colors={colors}>{q?.school_name ?? '-'}</Value>

  <Label colors={colors}>{t('school_location')}</Label>
  <Value colors={colors}>{q?.school_location ?? '-'}</Value>

  <Label colors={colors}>{t('graduation_year')}</Label>
  <Value colors={colors}>{q?.graduation_year ?? '-'}</Value>

  <Label colors={colors}>{t('seat_number')}</Label>
  <Value colors={colors}>{q?.seat_number ?? '-'}</Value>

  <Label colors={colors}>{t('coordination_approval_number')}</Label>
  <Value colors={colors}>{q?.coordination_approval_number ?? '-'}</Value>

  <Label colors={colors}>{t('coordination_approval_date')}</Label>
  <Value colors={colors}>
    {(q?.coordination_approval_date || '').split('T')[0] || '-'}
  </Value>
</Box>

<Box>
  <Label colors={colors}>{t('qualification_type')}</Label>
  <Value colors={colors}>{q?.qualification_type ?? '-'}</Value>

  <Label colors={colors}>{t('score_gpa')}</Label>
  <Value colors={colors}>{q?.score ?? '-'}</Value>

  <Label colors={colors}>{t('total_score')}</Label>
  <Value colors={colors}>{q?.total_score ?? '-'}</Value>
</Box>

      </Box>
    </Paper>
  );
}

function Label({ children, colors, isRTL }) {
  return (
    <Typography
      sx={{
        fontSize: 13.5,
        color: colors?.secondary,
        fontWeight: 500,
        mb: 0.2,
        mt: 2,
        textAlign: isRTL ? 'right' : 'left',
        direction: isRTL ? 'rtl' : 'ltr',
      }}
    >
      {children}
    </Typography>
  );
}

function Value({ children, colors, isRTL }) {
  return (
    <Typography
      sx={{
        fontSize: 15.3,
        fontWeight: 500,
        color: colors?.text || "#222831",
        mb: 0.8,
        textAlign: isRTL ? 'right' : 'left',
        direction: isRTL ? 'rtl' : 'ltr',
        wordBreak: 'break-word',
      }}
    >
      {children}
    </Typography>
  );
}
