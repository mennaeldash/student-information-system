// src/components/assistant/as-db-components/NextSessionCard.jsx
import React from "react";
import { Card, CardContent, Box, Typography, Button } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const NextSessionCard = ({ session }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const primaryPurple = "#423ECD";
  const lighterPurple = "#5C5BFF";

  const data = session || {};

  const F = {
    title: "clamp(18px, calc(18px + 12 * (100vw / 1720)), 30px)",
    subText: "clamp(12px, calc(12px + 2 * (100vw / 1720)), 14px)",
    sectionCode: "clamp(18px, calc(18px + 12 * (100vw / 1720)), 30px)",
    courseName: "clamp(12px, calc(12px + 2 * (100vw / 1720)), 14px)",
    meta: "clamp(12px, calc(12px + 1 * (100vw / 1720)), 13px)",
    button: "clamp(14px, calc(14px + 6 * (100vw / 1720)), 20px)",
  };

  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: primaryPurple,
        color: "#FFFFFF",
        borderRadius: "12px",
        minHeight: 297,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "flex-start",
          pt: { xs: 3, md: "40px" },
          pb: { xs: 3, md: "40px" },
          pl: { xs: 2, md: "25px" },
          pr: { xs: 2, md: "25px" },
          gap: { xs: 2.5, md: 4 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            flex: 1,
            minWidth: 0,
          }}
        >
          <Typography sx={{ fontSize: F.title, fontWeight: 600, lineHeight: 1.15 }}>
            {t("Next Session")}
          </Typography>

          <Typography sx={{ fontSize: F.subText, fontWeight: 400, opacity: 0.9 }}>
            {data.startsInText || t("Starting in 45 minutes")}
          </Typography>

          <Typography
            sx={{
              fontSize: F.sectionCode,
              fontWeight: 600,
              mt: 1,
              lineHeight: 1.15,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {data.sectionCode || t("CS101-Section 2")}
          </Typography>

          <Typography
            sx={{
              fontSize: F.courseName,
              fontWeight: 400,
              mt: 0.5,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {data.courseName || t("Introduction to Computer Science")}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "25px",
              mt: 3,
              fontSize: F.meta,
              opacity: 0.95,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
              <LocationOnOutlinedIcon sx={{ fontSize: 18 }} />
              <span>{data.location || t("CS Building 101")}</span>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
              <AccessTimeOutlinedIcon sx={{ fontSize: 18 }} />
              <span>{data.timeText || t("MWF 9:00–10:00 AM")}</span>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
              <GroupOutlinedIcon sx={{ fontSize: 18 }} />
              <span>{data.studentsText || t("100 Student")}</span>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "flex-start", width: { xs: "100%", md: "auto" } }}>
    <Button
  variant="contained"
  component="a"
  href="https://www.webex.com/"
  target="_blank"
  rel="noopener noreferrer"
  sx={{
    width: { xs: "100%", md: "204px" },
    height: "52px",
    background: `linear-gradient(90deg, ${lighterPurple}, ${primaryPurple})`,
    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
    borderRadius: "26px",
    textTransform: "none",
    fontSize: F.button,
    fontWeight: 600,
  }}
>
  {t("Start Session")}
</Button>


        </Box>
      </CardContent>
    </Card>
  );
};

export default NextSessionCard;
