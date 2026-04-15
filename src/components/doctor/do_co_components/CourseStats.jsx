import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

/**
 * StatCard — Figma-exact card, responsive width.
 *
 * Desktop: fixed 248px | Tablet: flex 1 (2-col) | Mobile: full width (1-col)
 */
function StatCard({ label, value, highlight, colors }) {
  return (
    <Box
      sx={{
        /* Desktop: fixed 248px, Tablet/Mobile: fill available space */
        width: { xs: "100%", lg: 248 },
        flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", lg: "0 0 248px" },
        height: 100,
        bgcolor: colors?.cardBg,
        border: `1px solid ${colors?.cardBorder}`,
        borderRadius: "8px",
        p: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minWidth: 0,
      }}
    >
      <Typography
        sx={{
          fontSize: "0.875rem",
          color: colors?.statLabel,
          fontWeight: 400,
          mb: 0.75,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: "1.4rem",
          fontWeight: 700,
          color: highlight ? colors?.statHighlight : colors?.statValue,
          lineHeight: 1.2,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

/**
 * CourseStats — responsive grid:
 *
 *   xs  (<600)  — 1 column, full width cards, 16px gap
 *   sm  (600+)  — 2 columns (2 per row), 16px gap
 *   md  (900+)  — 4 columns, 24px gap (laptop — slightly tighter)
 *   lg  (1200+) — 4 columns, 68px gap (desktop — Figma exact)
 */
export default function CourseStats({ data }) {
  const { t } = useTranslation();
  const c = data?.colors ?? {};
  const s = data?.stats ?? {};

  const stats = [
    { label: t("courses.creditHours"), value: s.creditHours, highlight: false },
    { label: t("courses.sections"), value: s.sections, highlight: false },
    { label: t("courses.enrolled"), value: s.enrolled, highlight: false },
    { label: t("courses.averageAttendance"), value: s.attendance, highlight: true },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: { xs: "12px", sm: "16px", md: "16px", lg: "30px", xl: "50px" },
        px: { xs: "16px", sm: "20px", md: "24px", lg: "32px" },
        py: { xs: "16px", sm: "18px", lg: "20px" },
      }}
    >
      {stats.map((stat) => (
        <StatCard key={stat.label} colors={c} {...stat} />
      ))}
    </Box>
  );
}
