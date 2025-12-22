// src/components/ST-SE-components/TAEvaluationCriteria.jsx
import React, { useState } from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import { useThemeContext } from "../../services/theme_context.jsx";
import { useTranslation } from "react-i18next";

const CRITERIA = [
  { id: "subjectKnowledge1", labelKey: "Subject Knowledge", required: true },
  { id: "subjectKnowledge2", labelKey: "Subject Knowledge", required: true },
  { id: "communicationSkills", labelKey: "Communication Skills", required: true },
  { id: "commitmentPunctuality", labelKey: "Commitment & Punctuality", required: true },
  { id: "interactionEngagement", labelKey: "Interaction & Engagement", required: true },
  { id: "preparationOrganization", labelKey: "Preparation & Organization", required: true },
  { id: "helpfulness", labelKey: "Helpfulness", required: true },
];

export default function TAEvaluationCriteria({ onRatingsChange }) {
  const { colors } = useThemeContext();
  const { t } = useTranslation();

  const [ratings, setRatings] = useState(
    CRITERIA.reduce((acc, c) => ({ ...acc, [c.id]: null }), {})
  );

  const handleSelect = (id, value) => {
    const next = { ...ratings, [id]: value };
    setRatings(next);
    if (typeof onRatingsChange === "function") onRatingsChange(next);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "none",
        mx: 0,
        borderRadius: "12px",
        bgcolor: colors?.box,
        px: { xs: 1, md: 0 },
      }}
    >
      <Typography
        sx={{
          fontFamily: "Inter, sans-serif",
          fontSize: { xs: 20, md: 25 },
          fontWeight: 500,
          color: colors?.text,
          mb: { xs: 2, md: 2.5 },
        }}
      >
        {t("Evaluation Criteria")}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: { xs: 2, md: 3 },
          width: "100%",
        }}
      >
        {CRITERIA.map((criterion) => {
          const currentRating = ratings[criterion.id];

          return (
            <Box
              key={criterion.id}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: { xs: 1.5, md: 0 },
                minHeight: { xs: "auto", md: "150px" },
                alignItems: { xs: "flex-start", md: "center" },
                justifyContent: "space-between",
                bgcolor: colors?.min,
                borderRadius: "12px",
                border: `1px solid ${colors?.border}`,
                px: { xs: 1.5, md: 2 },
                py: { xs: 1.5, md: 2 },
              }}
            >
              <Box sx={{ flex: 1, width: "100%" }}>
                <Typography
                  sx={{
                    fontSize: { xs: 16, md: 18 },
                    fontWeight: 500,
                    color: colors?.text,
                    mb: 1,
                    fontFamily:
                      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  }}
                >
                  {t(criterion.labelKey)}
                  {criterion.required && (
                    <Typography component="span" sx={{ color: "#EF4444", ml: 0.5 }}>
                      *
                    </Typography>
                  )}
                </Typography>

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={{ xs: 1, md: "8px" }}
                  sx={{
                    width: "100%",
                    flexWrap: "wrap",
                    rowGap: { xs: 1, md: 0 },
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={{ xs: 1, md: "5px" }}
                    sx={{
                      flexWrap: "wrap",
                      rowGap: { xs: 1, md: 0 },
                    }}
                  >
                    {Array.from({ length: 10 }).map((_, index) => {
                      const value = index + 1;
                      const selected = currentRating === value;

                      return (
                        <Button
                          key={value}
                          onClick={() => handleSelect(criterion.id, value)}
                          variant={selected ? "contained" : "outlined"}
                          disableRipple
                          sx={{
                            minWidth: { xs: 40, sm: 44, md: "50px" },
                            height: { xs: 40, sm: 44, md: "50px" },
                            borderRadius: { xs: 10, md: "12px" },
                            bgcolor: selected ? colors?.primary : colors?.box,
                            color: selected ? "#FFFFFF" : colors?.text,
                            fontSize: { xs: 16, md: 20 },
                            fontWeight: 600,
                            border: `3px solid #C1C1C3`,
                            "&:hover": {
                              bgcolor: selected ? colors?.primary : colors?.chosen,
                            },
                          }}
                        >
                          {value}
                        </Button>
                      );
                    })}
                  </Stack>

                  <Typography
                    sx={{
                      fontSize: { xs: 13, md: 14 },
                      fontWeight: 500,
                      color: colors?.primary,
                      fontFamily:
                        "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                      ml: 1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t("Rating")}: {currentRating ?? "-"}
                  </Typography>
                </Stack>
              </Box>

              <Box
                sx={{
                  minWidth: { xs: "100%", md: 180 },
                  textAlign: { xs: "left", md: "right" },
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: 14, md: 16 },
                    fontWeight: 500,
                    color: colors?.text,
                    mb: { xs: 0, md: "70px" },
                    mt: { xs: 0.5, md: 0 },
                  }}
                >
                  {t("1 (Very Poor) – 10 (Excellent)")}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
