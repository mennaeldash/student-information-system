// src/components/CO_components/RegistrationDeadline.jsx
import React from "react";
import { Box, Typography, Tooltip, useTheme } from "@mui/material";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { useThemeContext } from "../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

// (اختياري) موك API – استبدليه ببتاعك
export async function fetchRegistrationMeta() {
  return {
    deadline: "2025-10-15T23:59:00Z",
    note: "After this date registration will be closed.",
  };
}

export default function RegistrationDeadline({ deadlineISO, note, sx = {} }) {
  const theme = useTheme();
  const { colors } = useThemeContext();
  const { t, i18n } = useTranslation();

  const d = deadlineISO ? new Date(deadlineISO) : null;
  const pretty = d
    ? d.toLocaleDateString(i18n.language, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : t("registration.deadline_tbd"); // لو مفيش تاريخ

  return (
    <Box
      dir={i18n.dir()}
      sx={{
        mt: 1.5,
        display: "flex",
        alignItems: "center",
        gap: 1,
        color: colors?.secondary || theme.palette.text.secondary,
        fontSize: 14,
                ...sx,            // ← ندمج أي ستايل جاي من البرّنت

      }}
    >
      <AccessTimeOutlined sx={{ fontSize: 18, opacity: 0.9 }} />
      <Typography variant="body2">
        {t("Registration deadline")}:{" "}
        <strong style={{ color: colors?.secondary }}>{pretty}</strong>
      </Typography>

      {note && (
        <Tooltip title={note /* نص حر من الـ API، بنعرضه زي ما هو */}>
          <InfoOutlined sx={{ fontSize: 18, opacity: 0.7, cursor: "help" }} />
        </Tooltip>
      )}
    </Box>
  );
}

// export async function fetchRegistrationMeta() {
//   try {
//     const res = await fetch("https://your-backend.com/api/registration/meta");
//     if (!res.ok) {
//       throw new Error("Failed to fetch registration meta");
//     }
//     const data = await res.json(); 
//     return data; 
//   } catch (err) {
//     console.error("API Error:", err);
//     return { deadline: null, note: "Error fetching deadline" }; // fallback
//   }
// }
