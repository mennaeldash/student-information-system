// src/components/assistant/as_sd_components/StudentCard.jsx
import React from "react";
import { Card, CardContent, Box, Typography, Divider, Button } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../../../services/theme_context.jsx";
import { User } from "lucide-react";

export default function StudentCard({ student, onSelect }) {
  const { t } = useTranslation();
  const { theme: appTheme, colors } = useThemeContext();
  const isDark = colors?.mode === "dark" || appTheme === "dark";

  const cardBg = colors?.box || (isDark ? "#020617" : "#FFFFFF");
  const borderColor = colors?.border || (isDark ? "#1E293B" : "#E5E7EB");
  const textColor = colors?.text || (isDark ? "#E2E8F0" : "#020617");
  const mutedTextColor = colors?.secondary || (isDark ? "#94A3B8" : "#475569");

  return (
<Card
  sx={{
    width: "100%",
    maxWidth: { xs: "100%", sm: 430, lg: 380 },
    height: "auto",
    borderRadius: "8px",
    border: `1px solid ${borderColor}`,
    bgcolor: cardBg,
    boxShadow: "0 8px 20px rgba(15,23,42,0.08)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  }}
>


      <CardContent
        sx={{
          pt: { xs: "20px", sm: "24px" },
          pr: { xs: "12px", sm: "16px" },
          pb: { xs: "10px", sm: "12px" },
          pl: { xs: "12px", sm: "16px" },
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          flex: 1,
        }}
      >
        {/* Avatar + Name */}
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: "12px", sm: "20px" } }}>
          <Box
            sx={{
              width: { xs: 64, sm: 72 },
              height: { xs: 64, sm: 72 },
              borderRadius: "50%",
              border: `1px solid ${isDark ? "#334155" : "#E5E7EB"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "transparent",
              flexShrink: 0,
            }}
          >
            {student?.avatarUrl ? (
              <Box
                component="img"
                src={student.avatarUrl}
                alt={student.name}
                sx={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              <User size={28} color={mutedTextColor} strokeWidth={1.5} />
            )}
          </Box>

          {/* Name — required size on desktop, responsive on mobile */}
          <Typography
            sx={{
              width: { xs: "100%", sm: "263px" },
              height: { xs: "auto", sm: "32px" },
              lineHeight: "32px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",

              fontFamily: "Inter, sans-serif",
              fontSize: "20px",
              fontWeight: 400,
              letterSpacing: "0%",
              color: textColor,
            }}
          >
            {student?.name || "-"}
          </Typography>
        </Box>

        <Divider sx={{ borderColor }} />

        {/* Personal Details */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: "8px", sm: "10px" } }}>
          <InfoRowInline label={t("Student ID") || "Student ID"} value={student?.studentId} muted={mutedTextColor} text={textColor} />
          <InfoRowInline label={t("Email") || "Email"} value={student?.email} muted={mutedTextColor} text={textColor} />
          <InfoRowInline label={t("Phone") || "Phone"} value={student?.phone} muted={mutedTextColor} text={textColor} />
          <InfoRowInline label={t("Nationality") || "Nationality"} value={student?.nationality} muted={mutedTextColor} text={textColor} />
        </Box>

        <Divider sx={{ borderColor }} />

        {/* Academic Info */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: "8px", sm: "10px" } }}>
          <InfoRowInline label={t("Program") || "Program"} value={student?.program} muted={mutedTextColor} text={textColor} />
          <InfoRowInline label={t("Level") || "Level"} value={student?.level} muted={mutedTextColor} text={textColor} />
          <InfoRowInline label={t("Credits") || "Credits"} value={student?.credits} muted={mutedTextColor} text={textColor} />
          <InfoRowInline label={t("GPA") || "GPA"} value={student?.gpa} muted={mutedTextColor} text={textColor} highlight />
        </Box>

        {/* keeps footer at bottom on desktop height=504 */}
        <Box sx={{ flex: 1 }} />
      </CardContent>

      <Divider sx={{ borderColor }} />

      {/* View Profile Button — required size on desktop, full width on mobile */}
      <Box
        sx={{
          px: { xs: "12px", sm: "16px" },
          py: { xs: "10px", sm: "12px" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: cardBg,
        }}
      >
        <Button
          onClick={() => onSelect?.(student)}
          sx={{
            width: { xs: "100%", sm: "250px" },
            height: { xs: "36px", sm: "39px" },
            borderRadius: "8px",
            padding: { xs: "8px", sm: "10px" },
            gap: { xs: "8px", sm: "10px" },

            textTransform: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            color: textColor,
            backgroundColor: "transparent",
            "&:hover": { backgroundColor: "transparent" },
          }}
        >
          <Typography sx={{ fontSize: { xs: 13, sm: 14 }, fontWeight: 400, lineHeight: { xs: "18px", sm: "19px" } }}>
            {t("View full profile") || "View full profile"}
          </Typography>
          <ArrowForwardIosIcon sx={{ fontSize: { xs: 13, sm: 14 } }} />
        </Button>
      </Box>
    </Card>
  );
}

function InfoRowInline({ label, value, muted, text, highlight = false }) {
  const val = value || "-";
  const isSplit = highlight && typeof val === "string" && val.includes(" / ");
  const left = isSplit ? val.split(" / ")[0] : null;
  const right = isSplit ? val.split(" / ")[1] : null;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: { xs: "10px", sm: "14px" }, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
      <Typography
        sx={{
          minWidth: { xs: 80, sm: 110 },
          color: muted,
          fontSize: { xs: 14, sm: 16 },
          fontWeight: 400,
          flexShrink: 0,
        }}
      >
        {label}:
      </Typography>

      {!isSplit ? (
        <Typography
          sx={{
            color: text,
            fontSize: { xs: 14, sm: 16 },
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
            minWidth: 0,
          }}
        >
          {val}
        </Typography>
      ) : (
        <Typography
          sx={{
            fontSize: { xs: 14, sm: 16 },
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
            minWidth: 0,
          }}
        >
          <Box component="span" sx={{ color: "#2563EB", fontWeight: 600 }}>
            {left}
          </Box>
          <Box component="span" sx={{ color: text, fontWeight: 400 }}>
            {" / " + right}
          </Box>
        </Typography>
      )}
    </Box>
  );
}