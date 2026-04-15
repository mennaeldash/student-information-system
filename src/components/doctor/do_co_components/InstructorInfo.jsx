import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../../../services/theme_context.jsx";

/**
 * Maps known pastel/light avatar background colors to a
 * darker text color for strong contrast.
 */
const AVATAR_TEXT_COLOR_MAP = {
  "#c0d8f6ff": "#1549A8", // light blue  → deep blue
  "#c0d8f6":   "#1549A8",
  "#F0FDF4":   "#166534", // light mint  → deep green
  "#F59E0B":   "#78350F", // amber       → dark amber
  "#EF4444":   "#7F1D1D", // red         → dark red
  "#3B82F6":   "#1E3A8A", // blue        → dark blue
  "#16A34A":   "#14532D", // green       → dark green
};

function getInitialsColor(bgColor) {
  if (!bgColor) return "#1E293B";
  const key = bgColor.toLowerCase().replace(/ff$/, "");
  return (
    AVATAR_TEXT_COLOR_MAP[bgColor] ||
    AVATAR_TEXT_COLOR_MAP[bgColor.toLowerCase()] ||
    AVATAR_TEXT_COLOR_MAP[key] ||
    "#1E293B"
  );
}

/**
 * InstructorCard — Figma-exact: 40×40 avatar + name with 8px gap.
 */
function InstructorCard({ label, name, initials, color, image }) {
  const { colors } = useThemeContext();

  return (
    <Box>
      <Typography
        sx={{
          fontSize: "14px",
          color: colors?.secondary ?? "#64748B",
          mb: "6px",
          fontWeight: 500,
        }}
      >
        {label}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Avatar
          src={image || undefined}
          sx={{
            width: 40,
            height: 40,
            bgcolor: image ? "transparent" : color,
            fontSize: "0.8rem",
            fontWeight: 700,
            color: image ? undefined : getInitialsColor(color),
          }}
        >
          {!image && initials}
        </Avatar>
        <Typography
          sx={{
            fontSize: "14px",
            color: colors?.text ?? "#09090B",
            fontWeight: 500,
          }}
        >
          {name}
        </Typography>
      </Box>
    </Box>
  );
}

export default function InstructorInfo({ coordinator, instructor }) {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        gap: { xs: 3, sm: 5 },
        flexWrap: "wrap",
      }}
    >
      <InstructorCard
        label={t("courses.coordinator")}
        name={coordinator?.name}
        initials={coordinator?.initials}
        color={coordinator?.color || "#3B82F6"}
        image={coordinator?.image}
      />
      <InstructorCard
        label={t("courses.instructor")}
        name={instructor?.name}
        initials={instructor?.initials}
        color={instructor?.color || "#16A34A"}
        image={instructor?.image}
      />
    </Box>
  );
}
