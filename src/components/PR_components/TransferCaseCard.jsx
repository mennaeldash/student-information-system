// src/components/TransferCaseCardDynamic.jsx
import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, Divider } from '@mui/material';
import { useThemeContext } from '../../services/theme_context.jsx';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import UseProfile from "../../hooks/UseProfile";

export default function TransferCaseCardDynamic() {
  const { colors } = useThemeContext();
      const { transferData, error } = UseProfile(); // ✅ جاي من hook
  
  const { t } = useTranslation();

  if (error) return <Typography color="error">{error}</Typography>;
  if (!transferData) return <Typography>{t('loading')}</Typography>;

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
      <Typography
        fontWeight={600}
        sx={{
          fontSize: 18,
          color: colors?.text,
          mb: 1.5,
          letterSpacing: '.02em',
        }}
      >
        {t('case_of_transfer_to_another_college')}
      </Typography>

      <Divider sx={{ mb: 3, color: colors?.border || '#e3e8ee', height: 1 }} />

      {/* Content */}
      <Box sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        gap: 2,
      }}>
     <Box>
  <Label colors={colors}>{t('transferring_authority')}</Label>
  <Value colors={colors}>{transferData?.transferring_authority ?? '-'}</Value>

  <Label colors={colors}>{t('result_of_military_education')}</Label>
  <Value colors={colors}>{transferData?.result_of_military_education ?? '-'}</Value>
</Box>

<Box>
  <Label colors={colors}>{t('year_of_enrollment')}</Label>
  <Value colors={colors}>{transferData?.year_of_enrollment ?? '-'}</Value>
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
        color: colors?.text,
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
