// src/components/FamilyCard.jsx
import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Divider, Button } from '@mui/material';
import { useThemeContext } from '../../services/theme_context.jsx';
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import UseProfile from "../../hooks/UseProfile";

export default function FamilyCard() {

  const { colors } = useThemeContext();
  const { t } = useTranslation();
      const { family, error } = UseProfile(); 
  


  if (error) return <Typography color="error">{error}</Typography>;
  if (!family) return <Typography>{t("loading")}</Typography>;

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
      <Box
       sx={{
         display: 'flex', 
         justifyContent: 'space-between',
          alignItems: 'center',
           mb: 1.5 
           }}
           >
        <Typography
          fontWeight={600}
          sx={{
            fontSize: 18,
            color: colors?.text,
            letterSpacing: '.02em',
          }}
        >
          {t("family_information")}
        </Typography>
        
      </Box>

      <Divider sx={{ mb: 3, color: colors?.border, height: 1 }} />

      <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 0,
          rowGap: 1.5,
        }}
      >
   <Box>
  <Label colors={colors}>{t("father_name")}</Label>
  <Value colors={colors}>{family.father_name}</Value>

  <Label colors={colors}>{t("father_occupation")}</Label>
  <Value colors={colors}>{family.father_occupation}</Value>

  <Label colors={colors}>{t("current_city")}</Label>
  <Value colors={colors}>{family.city}</Value>

  <Label colors={colors}>{t("current_address")}</Label>
  <Value colors={colors}>
    {[family.address?.street, family.address?.center, family.address?.city]
      .filter(Boolean)
      .join(" - ")}
  </Value>

  <Label colors={colors}>{t("home_phone")}</Label>
  <Value colors={colors}>{family.home_phone}</Value>
</Box>

<Box>
  <Label colors={colors}>{t("mother_name")}</Label>
  <Value colors={colors}>{family.mother_name}</Value>

  <Label colors={colors}>{t("mother_occupation")}</Label>
  <Value colors={colors}>{family.mother_occupation}</Value>

  <Label colors={colors}>{t("mobile")}</Label>
  <Value colors={colors}>{family.student_phone}</Value>

  <Label colors={colors}>{t("personal_email")}</Label>
  <Value colors={colors}>{family.student_email}</Value>
</Box>

      </Box>
    </Paper>
  );
}

function Label({ children, colors }) {
  return (
    <Typography
      sx={{
        fontSize: 13.5,
        color: colors?.secondary,
        fontWeight: 500,
        mb: 0.2,
        mt: 2,
      }}
    >
      {children}
    </Typography>
  );
}

function Value({ children, colors }) {
  return (
    <Typography
      sx={{
        fontSize: 15.3,
        fontWeight: 500,
        color: colors?.text,
        mb: 0.8,
      }}
    >
      {children}
    </Typography>
  );
}
