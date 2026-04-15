import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../../../services/theme_context.jsx";

const getOverallColors = (value) => {
  const num = parseFloat(value);
  if (num >= 8) return { bg: "#F0FDF4", text: "#2A8648" };
  if (num >= 6) return { bg: "#FEFCE8", text: "#C88307" };
  return { bg: "#DBEAFE", text: "#1D4ED9" };
};

const isMeaningfulComment = (comment) => {
  if (!comment || typeof comment !== "string") return false;

  const normalized = comment.trim().toLowerCase();

  const blockedValues = [
    "",
    "ok",
    "good",
    "nice",
    "n/a",
    "na",
    "none",
    "no comment",
    "no comments",
    ".",
    "-",
    "--",
    "---",
  ];

  if (blockedValues.includes(normalized)) return false;

  return normalized.length > 20;
};

const EvaluationFeedbackCard = ({ item }) => {
  const { colors } = useThemeContext();
  const { t } = useTranslation();

  const isDark = colors?.mode === "dark";
  const borderColor = isDark ? "#334155" : "#E2E8F0";
  const { bg: overallBoxBg, text: overallTextColor } = getOverallColors(
    item.overall
  );

  const hasRealComment = isMeaningfulComment(item.comment);

  return (
    <Box
      sx={{
        pt: { xs: "18px", sm: "22px", md: "25px" },
        pb: { xs: "18px", sm: "22px", md: "25px" },
        px: { xs: "14px", sm: "20px", md: "28px" },
        borderBottom: `1px solid ${borderColor}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: "16px",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            width: "100%",
            minWidth: 0,
          }}
        >
          <Avatar
            sx={{
              width: 50,
              height: 50,
              borderRadius: "9999px",
              bgcolor: "#DBEAFE",
              color: "#2563EB",
              flexShrink: 0,
            }}
          >
            <UserRound size={22} />
          </Avatar>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              minWidth: 0,
            }}
          >
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: "20px",
                fontWeight: 400,
                lineHeight: "24px",
                color: isDark ? "#F8FAFC" : "#09090B",
                wordBreak: "break-word",
              }}
            >
              {item.studentName}
            </Typography>

            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "20px",
                color: "#71717A",
              }}
            >
              {item.date}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            alignSelf: { xs: "flex-start", sm: "center" },
          }}
        >
          <Typography
            sx={{
              fontFamily: "Inter, sans-serif",
              fontSize: "20px",
              fontWeight: 400,
              lineHeight: "20px",
              color: isDark ? "#F8FAFC" : "#000000",
            }}
          >
            {t("overall")}:
          </Typography>

          <Box
            sx={{
              minWidth: "48px",
              height: "44px",
              px: "10px",
              borderRadius: "12px",
              bgcolor: isDark ? `${overallTextColor}22` : overallBoxBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: "20px",
                fontWeight: 600,
                lineHeight: "24px",
                color: overallTextColor,
              }}
            >
              {item.overall}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          mt: "25px",
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(3, minmax(0, 1fr))",
            lg: "repeat(5, minmax(0, 1fr))",
          },
          gap: { xs: "12px", sm: "16px", md: "23px" },
        }}
      >
        {item.scores.map((score, index) => (
          <Box
            key={`${score.label}-${index}`}
            sx={{
              minHeight: "77px",
              borderRadius: "8px",
              bgcolor: isDark ? "#1E293B" : "#F4F4F5",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "9px",
              px: "8px",
              py: "10px",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: "20px",
                fontWeight: 500,
                lineHeight: "20px",
                color: isDark ? "rgba(248,250,252,0.7)" : "rgba(0,0,0,0.7)",
                textAlign: "center",
                wordBreak: "break-word",
              }}
            >
              {score.label}
            </Typography>

            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: "20px",
                fontWeight: 600,
                lineHeight: "20px",
                color: isDark ? "rgba(248,250,252,0.7)" : "rgba(0,0,0,0.7)",
                textAlign: "center",
              }}
            >
              {score.value}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          mt: "25px",
          bgcolor: isDark
            ? "#0F172A"
            : hasRealComment
              ? "#EFF6FF"
              : "#F4F4F5",
          borderRadius: "8px",
          pt: { xs: "16px", sm: "20px", md: "24px" },
          pb: { xs: "16px", sm: "20px", md: "24px" },
          pl: { xs: "14px", sm: "16px" },
          pr: { xs: "14px", sm: "16px" },
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Inter, sans-serif",
            fontSize: "20px",
            fontWeight: 500,
            lineHeight: "20px",
            color: isDark ? "rgba(248,250,252,0.7)" : "rgba(0,0,0,0.7)",
          }}
        >
          {t("student_comment")}:
        </Typography>

        <Typography
          sx={{
            fontFamily: "Inter, sans-serif",
            fontSize: "18px",
            fontWeight: 500,
            lineHeight: "20px",
            color: isDark ? "#F8FAFC" : "#000000",
          }}
        >
          {hasRealComment ? item.comment : t("no_comment_provided")}
        </Typography>
      </Box>
    </Box>
  );
};

export default EvaluationFeedbackCard;