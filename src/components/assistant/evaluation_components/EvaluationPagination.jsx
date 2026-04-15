import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../../../services/theme_context.jsx";

const EvaluationPagination = ({
  currentPage,
  totalPages,
  totalItems,
  startItem,
  endItem,
  onPrev,
  onNext,
}) => {
  const { colors } = useThemeContext();
  const { i18n, t } = useTranslation();

  const isRTL = i18n.language === "ar";
  const isDark = colors?.mode === "dark";

  const softText = isDark ? "rgba(248,250,252,0.50)" : "rgba(0,0,0,0.50)";
  const strongText = isDark ? "#F8FAFC" : "#000000";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: { xs: "stretch", md: "center" },
        justifyContent: "space-between",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: "16px", md: "24px" },
        minHeight: "60px",
        px: { xs: "0px", sm: "8px", md: "16px" },
        py: { xs: "16px", md: "0px" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Inter, sans-serif",
            fontSize: "20px",
            fontWeight: 500,
            lineHeight: "100%",
            color: softText,
          }}
        >
          {t("showing")}
        </Typography>

        <Typography
          sx={{
            fontFamily: "Inter, sans-serif",
            fontSize: "22px",
            fontWeight: 500,
            lineHeight: "100%",
            color: strongText,
          }}
        >
          {startItem}
        </Typography>

        <Typography
          sx={{
            fontFamily: "Inter, sans-serif",
            fontSize: "22px",
            fontWeight: 500,
            lineHeight: "100%",
            color: strongText,
          }}
        >
          -
        </Typography>

        <Typography
          sx={{
            fontFamily: "Inter, sans-serif",
            fontSize: "22px",
            fontWeight: 500,
            lineHeight: "100%",
            color: strongText,
          }}
        >
          {endItem}
        </Typography>

        <Typography
          sx={{
            fontFamily: "Inter, sans-serif",
            fontSize: "25px",
            fontWeight: 500,
            lineHeight: "100%",
            color: softText,
          }}
        >
          {t("of")}
        </Typography>

        <Typography
          sx={{
            fontFamily: "Inter, sans-serif",
            fontSize: "22px",
            fontWeight: 500,
            lineHeight: "100%",
            color: strongText,
          }}
        >
          {totalItems}
        </Typography>

        <Typography
          sx={{
            fontFamily: "Inter, sans-serif",
            fontSize: "20px",
            fontWeight: 500,
            lineHeight: "100%",
            color: softText,
          }}
        >
          {t("evaluation")}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "stretch",
          gap: "12px",
          width: { xs: "100%", md: "auto" },
        }}
      >
        <Button
          onClick={onPrev}
          disabled={currentPage === 1}
          startIcon={
            isRTL ? <ChevronRight size={30} /> : <ChevronLeft size={30} />
          }
          sx={{
            width: { xs: "100%", sm: "160px", md: "179px" },
            height: { xs: "48px", md: "60px" },
            borderRadius: "12px",
            textTransform: "none",
            bgcolor: isDark ? "#1E293B" : "#F4F4F5",
            color: softText,
            boxShadow: "none",
            fontFamily: "Inter, sans-serif",
            fontSize: "20px",
            fontWeight: 500,
            lineHeight: "100%",
            border: "none",
            "& .MuiButton-startIcon svg": { width: "30px", height: "30px" },
            "&:hover": {
              bgcolor: isDark ? "#263348" : "#EAEAEA",
              boxShadow: "none",
            },
            "&.Mui-disabled": {
              opacity: 0.5,
              color: softText,
              bgcolor: isDark ? "#1E293B" : "#F4F4F5",
            },
          }}
        >
          {t("Previous")}
        </Button>

        <Button
          onClick={onNext}
          disabled={currentPage === totalPages || totalItems === 0}
          endIcon={
            isRTL ? <ChevronLeft size={30} /> : <ChevronRight size={30} />
          }
          sx={{
            width: { xs: "100%", sm: "140px", md: "150px" },
            height: { xs: "48px", md: "60px" },
            borderRadius: "12px",
            textTransform: "none",
            bgcolor: "#1F609D",
            color: "#FFFFFF",
            boxShadow: "none",
            fontFamily: "Inter, sans-serif",
            fontSize: "20px",
            fontWeight: 500,
            lineHeight: "100%",
            "& .MuiButton-endIcon svg": { width: "30px", height: "30px" },
            "&:hover": { bgcolor: "#1A5289", boxShadow: "none" },
            "&.Mui-disabled": {
              opacity: 0.5,
              color: "#FFFFFF",
              bgcolor: "#1F609D",
            },
          }}
        >
          {t("Next")}
        </Button>
      </Box>
    </Box>
  );
};

export default EvaluationPagination;